-- ─── Trending Activities ───────────────────────────────────────────────────
-- Tracks which activities are currently marked as trending by admins.
-- Each row represents one activity in the trending list with a display order.

CREATE TABLE IF NOT EXISTS public.trending_activities (
  id            SERIAL PRIMARY KEY,
  activity_id   INTEGER NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  added_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  added_by      UUID REFERENCES public.admin_users(id),
  CONSTRAINT trending_activities_activity_id_unique UNIQUE (activity_id)
);

CREATE INDEX IF NOT EXISTS trending_activities_display_order_idx
  ON public.trending_activities (display_order ASC);

-- ─── RLS: no direct access; all access via SECURITY DEFINER RPC functions ──
ALTER TABLE public.trending_activities ENABLE ROW LEVEL SECURITY;

-- Allow public read so the frontend can fetch the trending list
CREATE POLICY "trending_activities_public_read"
  ON public.trending_activities FOR SELECT
  USING (true);

-- ─── RPC: list trending activities (joined with activity data) ─────────────
CREATE OR REPLACE FUNCTION public.admin_list_trending()
RETURNS TABLE (
  trending_id   INT,
  display_order INT,
  added_at      TIMESTAMPTZ,
  activity_id   INT,
  title         TEXT,
  image         TEXT,
  location      TEXT,
  price_range   TEXT,
  date          TEXT,
  url           TEXT
)
LANGUAGE sql SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    t.id         AS trending_id,
    t.display_order,
    t.added_at,
    a.id         AS activity_id,
    a.title,
    a.image,
    a.location,
    a.price_range,
    a.date,
    a.url
  FROM trending_activities t
  JOIN activities a ON a.id = t.activity_id
  WHERE a.enabled = true
  ORDER BY t.display_order ASC, t.added_at DESC;
$$;

-- ─── RPC: add activity to trending ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_add_trending(
  p_activity_id INT,
  p_admin_id    UUID,
  p_order       INT DEFAULT 0
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admin_users WHERE id = p_admin_id AND is_active = true) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  INSERT INTO trending_activities (activity_id, display_order, added_by)
  VALUES (p_activity_id, p_order, p_admin_id)
  ON CONFLICT (activity_id) DO UPDATE SET
    display_order = EXCLUDED.display_order,
    added_at      = NOW(),
    added_by      = EXCLUDED.added_by;
END;
$$;

-- ─── RPC: remove activity from trending ────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_remove_trending(
  p_activity_id INT,
  p_admin_id    UUID
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admin_users WHERE id = p_admin_id AND is_active = true) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  DELETE FROM trending_activities WHERE activity_id = p_activity_id;
END;
$$;

-- Grant execute on all new functions to the anon + authenticated roles
GRANT EXECUTE ON FUNCTION public.admin_list_trending() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_add_trending(INT, UUID, INT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_remove_trending(INT, UUID) TO anon, authenticated;
