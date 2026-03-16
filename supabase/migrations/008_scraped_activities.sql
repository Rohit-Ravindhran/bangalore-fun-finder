-- Migration 008: Scraped activities staging pipeline
-- scraped_activities holds events from crawlers/BMS import before admin review.
-- Admin can Approve → pushes to activities, Reject, or Edit & Approve.

-- =============================================
-- scraped_activities table
-- =============================================
CREATE TABLE public.scraped_activities (
  id              SERIAL PRIMARY KEY,
  -- Core fields (mirrors activities table)
  title           TEXT NOT NULL,
  description     TEXT DEFAULT '',
  image           TEXT,
  price_range     TEXT,
  location        TEXT DEFAULT '',
  date            TEXT,
  time            TEXT,
  map_link        TEXT,
  contact_info    TEXT DEFAULT '',
  url             TEXT,
  category_ids    TEXT[] DEFAULT '{}',
  tags            TEXT[] DEFAULT '{}',
  section_type    TEXT DEFAULT 'all',
  latitude        DOUBLE PRECISION,
  longitude       DOUBLE PRECISION,
  -- Scraping metadata
  source          TEXT DEFAULT 'manual',  -- 'bms', 'instagram', 'meetup', 'manual'
  status          TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'duplicate'
  quality_score   INTEGER DEFAULT 0,      -- 0–100, computed on insert/update
  duplicate_of    INTEGER REFERENCES public.activities(id) ON DELETE SET NULL,
  scraped_at      TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at     TIMESTAMPTZ,
  reviewed_by     UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.scraped_activities ENABLE ROW LEVEL SECURITY;
-- All access goes through SECURITY DEFINER RPC functions
CREATE POLICY "no_direct_access_scraped" ON public.scraped_activities FOR ALL USING (false);

-- =============================================
-- scrape_jobs table  (tracks crawler runs)
-- =============================================
CREATE TABLE public.scrape_jobs (
  id             SERIAL PRIMARY KEY,
  source         TEXT NOT NULL,
  started_at     TIMESTAMPTZ DEFAULT NOW(),
  finished_at    TIMESTAMPTZ,
  events_found   INTEGER DEFAULT 0,
  events_saved   INTEGER DEFAULT 0,
  status         TEXT DEFAULT 'running',  -- 'running', 'completed', 'failed'
  error_message  TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.scrape_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "no_direct_access_scrape_jobs" ON public.scrape_jobs FOR ALL USING (false);

-- =============================================
-- Helper: compute quality score (0–100)
-- =============================================
CREATE OR REPLACE FUNCTION compute_quality_score(
  p_image       TEXT,
  p_location    TEXT,
  p_description TEXT,
  p_date        TEXT,
  p_map_link    TEXT
) RETURNS INTEGER AS $$
DECLARE score INTEGER := 0;
BEGIN
  IF p_image       IS NOT NULL AND p_image       != '' THEN score := score + 20; END IF;
  IF p_location    IS NOT NULL AND p_location    != '' AND p_location != 'Bangalore' THEN score := score + 20; END IF;
  IF p_description IS NOT NULL AND LENGTH(p_description) > 150             THEN score := score + 20; END IF;
  IF p_date        IS NOT NULL AND p_date        != ''                      THEN score := score + 20; END IF;
  IF p_map_link    IS NOT NULL AND p_map_link    != ''                      THEN score := score + 20; END IF;
  RETURN score;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =============================================
-- RPC: admin_save_scraped_activity
-- Called by BMS import tool and future crawlers
-- =============================================
CREATE OR REPLACE FUNCTION admin_save_scraped_activity(
  p_admin_id    UUID,
  p_title       TEXT,
  p_description TEXT          DEFAULT NULL,
  p_image       TEXT          DEFAULT NULL,
  p_price_range TEXT          DEFAULT NULL,
  p_location    TEXT          DEFAULT NULL,
  p_date        TEXT          DEFAULT NULL,
  p_time        TEXT          DEFAULT NULL,
  p_map_link    TEXT          DEFAULT NULL,
  p_contact_info TEXT         DEFAULT NULL,
  p_url         TEXT          DEFAULT NULL,
  p_category_ids TEXT[]       DEFAULT '{}',
  p_tags        TEXT[]        DEFAULT '{}',
  p_section_type TEXT         DEFAULT 'all',
  p_latitude    DOUBLE PRECISION DEFAULT NULL,
  p_longitude   DOUBLE PRECISION DEFAULT NULL,
  p_source      TEXT          DEFAULT 'manual'
) RETURNS JSON AS $$
DECLARE
  v_id         INTEGER;
  v_score      INTEGER;
  v_status     TEXT    := 'pending';
  v_dup_of     INTEGER := NULL;
  v_existing   INTEGER;
BEGIN
  IF NOT is_valid_admin_session(p_admin_id) THEN
    RETURN json_build_object('success', false, 'message', 'Unauthorized');
  END IF;
  IF p_title IS NULL OR LENGTH(TRIM(p_title)) = 0 THEN
    RETURN json_build_object('success', false, 'message', 'Title is required');
  END IF;

  v_score := compute_quality_score(p_image, p_location, p_description, p_date, p_map_link);

  -- Duplicate check: same title + date in live activities table
  IF p_date IS NOT NULL AND p_date != '' THEN
    SELECT id INTO v_existing FROM public.activities
    WHERE LOWER(TRIM(title)) = LOWER(TRIM(p_title)) AND date = p_date LIMIT 1;
    IF FOUND THEN v_status := 'duplicate'; v_dup_of := v_existing; END IF;
  END IF;

  -- Duplicate check: same title + date already pending in scraped_activities
  IF v_status = 'pending' THEN
    SELECT id INTO v_existing FROM public.scraped_activities
    WHERE LOWER(TRIM(title)) = LOWER(TRIM(p_title))
      AND (date = p_date OR (date IS NULL AND p_date IS NULL))
      AND status = 'pending' LIMIT 1;
    IF FOUND THEN v_status := 'duplicate'; END IF;
  END IF;

  INSERT INTO public.scraped_activities (
    title, description, image, price_range, location,
    date, time, map_link, contact_info, url,
    category_ids, tags, section_type,
    latitude, longitude,
    source, status, quality_score, duplicate_of,
    created_at, updated_at
  ) VALUES (
    TRIM(p_title), COALESCE(p_description, ''), p_image, p_price_range,
    COALESCE(p_location, ''), p_date, p_time, p_map_link,
    COALESCE(p_contact_info, ''), p_url,
    COALESCE(p_category_ids, '{}'), COALESCE(p_tags, '{}'),
    COALESCE(p_section_type, 'all'),
    p_latitude, p_longitude,
    COALESCE(p_source, 'manual'), v_status, v_score, v_dup_of,
    NOW(), NOW()
  ) RETURNING id INTO v_id;

  RETURN json_build_object(
    'success', true,
    'scraped_activity_id', v_id,
    'status', v_status,
    'quality_score', v_score,
    'message', CASE WHEN v_status = 'duplicate' THEN 'Saved as possible duplicate — pending review'
                    ELSE 'Saved for admin review' END
  );
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- RPC: admin_list_scraped_activities
-- =============================================
CREATE OR REPLACE FUNCTION admin_list_scraped_activities(
  p_admin_id UUID,
  p_status   TEXT    DEFAULT NULL,
  p_source   TEXT    DEFAULT NULL,
  p_limit    INTEGER DEFAULT 50,
  p_offset   INTEGER DEFAULT 0
) RETURNS JSON AS $$
DECLARE v_result JSON;
BEGIN
  IF NOT is_valid_admin_session(p_admin_id) THEN
    RETURN json_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  SELECT json_build_object(
    'success', true,
    'data',  COALESCE(json_agg(row_to_json(t) ORDER BY t.created_at DESC), '[]'::json),
    'total', (SELECT COUNT(*) FROM public.scraped_activities
              WHERE (p_status IS NULL OR status = p_status)
                AND (p_source IS NULL OR source = p_source))
  ) INTO v_result
  FROM (
    SELECT sa.*, au.username AS reviewed_by_name
    FROM public.scraped_activities sa
    LEFT JOIN public.admin_users au ON sa.reviewed_by = au.id
    WHERE (p_status IS NULL OR sa.status = p_status)
      AND (p_source IS NULL OR sa.source = p_source)
    ORDER BY sa.created_at DESC
    LIMIT p_limit OFFSET p_offset
  ) t;

  RETURN COALESCE(v_result, json_build_object('success', true, 'data', '[]'::json, 'total', 0));
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- RPC: admin_approve_scraped_activity
-- Copies to activities, marks approved
-- =============================================
CREATE OR REPLACE FUNCTION admin_approve_scraped_activity(
  p_admin_id     UUID,
  p_scraped_id   INTEGER,
  -- Optional field overrides (for Edit & Approve)
  p_title        TEXT             DEFAULT NULL,
  p_description  TEXT             DEFAULT NULL,
  p_image        TEXT             DEFAULT NULL,
  p_price_range  TEXT             DEFAULT NULL,
  p_location     TEXT             DEFAULT NULL,
  p_date         TEXT             DEFAULT NULL,
  p_time         TEXT             DEFAULT NULL,
  p_map_link     TEXT             DEFAULT NULL,
  p_contact_info TEXT             DEFAULT NULL,
  p_url          TEXT             DEFAULT NULL,
  p_category_ids TEXT[]           DEFAULT NULL,
  p_tags         TEXT[]           DEFAULT NULL,
  p_section_type TEXT             DEFAULT NULL,
  p_latitude     DOUBLE PRECISION DEFAULT NULL,
  p_longitude    DOUBLE PRECISION DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
  v_scraped    public.scraped_activities%ROWTYPE;
  v_activity_id INTEGER;
BEGIN
  IF NOT is_valid_admin_session(p_admin_id) THEN
    RETURN json_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  SELECT * INTO v_scraped FROM public.scraped_activities WHERE id = p_scraped_id;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Scraped activity not found');
  END IF;

  INSERT INTO public.activities (
    title, description, image, price_range, location,
    date, time, map_link, contact_info, url,
    category_ids, tags, section_type, enabled,
    latitude, longitude, created_at, updated_at
  ) VALUES (
    TRIM(COALESCE(p_title,        v_scraped.title)),
    COALESCE(p_description,  v_scraped.description),
    COALESCE(p_image,        v_scraped.image),
    COALESCE(p_price_range,  v_scraped.price_range),
    COALESCE(p_location,     v_scraped.location),
    COALESCE(p_date,         v_scraped.date),
    COALESCE(p_time,         v_scraped.time),
    COALESCE(p_map_link,     v_scraped.map_link),
    COALESCE(p_contact_info, v_scraped.contact_info),
    COALESCE(p_url,          v_scraped.url),
    COALESCE(p_category_ids, v_scraped.category_ids),
    COALESCE(p_tags,         v_scraped.tags),
    COALESCE(p_section_type, v_scraped.section_type, 'all'),
    true,
    COALESCE(p_latitude,  v_scraped.latitude),
    COALESCE(p_longitude, v_scraped.longitude),
    NOW(), NOW()
  ) RETURNING id INTO v_activity_id;

  UPDATE public.scraped_activities
  SET status = 'approved', reviewed_at = NOW(), reviewed_by = p_admin_id, updated_at = NOW()
  WHERE id = p_scraped_id;

  RETURN json_build_object('success', true, 'message', 'Published successfully', 'activity_id', v_activity_id);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- RPC: admin_reject_scraped_activity
-- =============================================
CREATE OR REPLACE FUNCTION admin_reject_scraped_activity(
  p_admin_id   UUID,
  p_scraped_id INTEGER,
  p_notes      TEXT DEFAULT NULL
) RETURNS JSON AS $$
BEGIN
  IF NOT is_valid_admin_session(p_admin_id) THEN
    RETURN json_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  UPDATE public.scraped_activities
  SET status = 'rejected', reviewed_at = NOW(), reviewed_by = p_admin_id,
      notes = COALESCE(p_notes, notes), updated_at = NOW()
  WHERE id = p_scraped_id;

  IF NOT FOUND THEN RETURN json_build_object('success', false, 'message', 'Not found'); END IF;
  RETURN json_build_object('success', true, 'message', 'Rejected');
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- RPC: admin_update_scraped_activity  (for Edit & Approve)
-- =============================================
CREATE OR REPLACE FUNCTION admin_update_scraped_activity(
  p_admin_id     UUID,
  p_scraped_id   INTEGER,
  p_title        TEXT             DEFAULT NULL,
  p_description  TEXT             DEFAULT NULL,
  p_image        TEXT             DEFAULT NULL,
  p_price_range  TEXT             DEFAULT NULL,
  p_location     TEXT             DEFAULT NULL,
  p_date         TEXT             DEFAULT NULL,
  p_time         TEXT             DEFAULT NULL,
  p_map_link     TEXT             DEFAULT NULL,
  p_contact_info TEXT             DEFAULT NULL,
  p_url          TEXT             DEFAULT NULL,
  p_category_ids TEXT[]           DEFAULT NULL,
  p_tags         TEXT[]           DEFAULT NULL,
  p_section_type TEXT             DEFAULT NULL,
  p_latitude     DOUBLE PRECISION DEFAULT NULL,
  p_longitude    DOUBLE PRECISION DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
  v_new_image TEXT; v_new_loc TEXT; v_new_desc TEXT; v_new_date TEXT; v_new_map TEXT;
BEGIN
  IF NOT is_valid_admin_session(p_admin_id) THEN
    RETURN json_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  UPDATE public.scraped_activities SET
    title        = COALESCE(TRIM(p_title), title),
    description  = COALESCE(p_description,  description),
    image        = COALESCE(p_image,        image),
    price_range  = COALESCE(p_price_range,  price_range),
    location     = COALESCE(p_location,     location),
    date         = COALESCE(p_date,         date),
    time         = COALESCE(p_time,         time),
    map_link     = COALESCE(p_map_link,     map_link),
    contact_info = COALESCE(p_contact_info, contact_info),
    url          = COALESCE(p_url,          url),
    category_ids = COALESCE(p_category_ids, category_ids),
    tags         = COALESCE(p_tags,         tags),
    section_type = COALESCE(p_section_type, section_type),
    latitude     = COALESCE(p_latitude,     latitude),
    longitude    = COALESCE(p_longitude,    longitude),
    quality_score = compute_quality_score(
      COALESCE(p_image,        image),
      COALESCE(p_location,     location),
      COALESCE(p_description,  description),
      COALESCE(p_date,         date),
      COALESCE(p_map_link,     map_link)
    ),
    updated_at = NOW()
  WHERE id = p_scraped_id;

  IF NOT FOUND THEN RETURN json_build_object('success', false, 'message', 'Not found'); END IF;
  RETURN json_build_object('success', true, 'message', 'Updated');
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Grants
-- =============================================
GRANT EXECUTE ON FUNCTION admin_save_scraped_activity    TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_list_scraped_activities  TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_approve_scraped_activity TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_reject_scraped_activity  TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_update_scraped_activity  TO anon, authenticated;
GRANT EXECUTE ON FUNCTION compute_quality_score          TO anon, authenticated;

DO $$ BEGIN
  RAISE NOTICE '✅ Migration 008 complete: scraped_activities + scrape_jobs tables created';
  RAISE NOTICE '🔍 RPC functions: save / list / approve / reject / update scraped activities';
END $$;
