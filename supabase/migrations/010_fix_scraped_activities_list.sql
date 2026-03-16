-- Migration 010: Fix admin_list_scraped_activities — au.name → au.username
-- The admin_users table uses 'username' not 'name'

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

DO $$ BEGIN
  RAISE NOTICE '✅ Migration 010 complete: fixed au.username in admin_list_scraped_activities';
END $$;
