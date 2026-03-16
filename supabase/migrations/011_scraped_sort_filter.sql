-- Migration 011: Add sort + date filter to admin_list_scraped_activities

CREATE OR REPLACE FUNCTION admin_list_scraped_activities(
  p_admin_id     UUID,
  p_status       TEXT          DEFAULT NULL,
  p_source       TEXT          DEFAULT NULL,
  p_sort         TEXT          DEFAULT 'newest',       -- newest|oldest|quality_desc|quality_asc
  p_scraped_since TIMESTAMPTZ  DEFAULT NULL,           -- filter scraped_at >= this
  p_limit        INTEGER       DEFAULT 50,
  p_offset       INTEGER       DEFAULT 0
) RETURNS JSON AS $$
DECLARE
  v_result JSON;
  v_order  TEXT;
BEGIN
  IF NOT is_valid_admin_session(p_admin_id) THEN
    RETURN json_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  -- Build ORDER BY clause safely (whitelist only)
  v_order := CASE p_sort
    WHEN 'oldest'       THEN 'sa.created_at ASC'
    WHEN 'quality_desc' THEN 'sa.quality_score DESC, sa.created_at DESC'
    WHEN 'quality_asc'  THEN 'sa.quality_score ASC, sa.created_at DESC'
    ELSE                     'sa.created_at DESC'   -- newest (default)
  END;

  -- Count for pagination
  EXECUTE format(
    'SELECT json_build_object(
       ''success'', true,
       ''data'',  COALESCE(json_agg(row_to_json(t)), ''[]''::json),
       ''total'', (
         SELECT COUNT(*) FROM public.scraped_activities sa
         WHERE ($1 IS NULL OR sa.status = $1)
           AND ($2 IS NULL OR sa.source = $2)
           AND ($3 IS NULL OR sa.scraped_at >= $3)
       )
     )
     FROM (
       SELECT sa.*, au.username AS reviewed_by_name
       FROM public.scraped_activities sa
       LEFT JOIN public.admin_users au ON sa.reviewed_by = au.id
       WHERE ($1 IS NULL OR sa.status = $1)
         AND ($2 IS NULL OR sa.source = $2)
         AND ($3 IS NULL OR sa.scraped_at >= $3)
       ORDER BY %s
       LIMIT $4 OFFSET $5
     ) t',
    v_order
  ) INTO v_result
  USING p_status, p_source, p_scraped_since, p_limit, p_offset;

  RETURN COALESCE(v_result,
    json_build_object('success', true, 'data', '[]'::json, 'total', 0));
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$ BEGIN
  RAISE NOTICE '✅ Migration 011 complete: sort + scraped_since filter added';
END $$;
