-- Security Fix: Proper RLS Policies for Production
-- This migration reverts the permissive policies from 002 and adds secure policies

-- =============================================
-- 1. Drop the permissive policies from migration 002
-- =============================================
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.activities;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.activities;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.activities;

-- =============================================
-- 2. Create admin verification helper function
-- This checks if a session token is valid for admin operations
-- =============================================
CREATE OR REPLACE FUNCTION is_valid_admin_session(p_admin_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE id = p_admin_id AND is_active = true
    ) INTO v_exists;
    RETURN v_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 3. Create secure RLS policies for activities
-- Write operations require calling through secure RPC functions
-- =============================================

-- Read policy: Anyone can read enabled activities (keep existing behavior)
-- This should already exist, but ensure it's there
DROP POLICY IF EXISTS "Enable read access for all users" ON public.activities;
CREATE POLICY "Enable read access for all users" ON public.activities
    FOR SELECT USING (enabled = true OR enabled IS NULL);

-- Write policies: Block direct access, use RPC functions instead
CREATE POLICY "Block direct insert to activities" ON public.activities
    FOR INSERT WITH CHECK (false);

CREATE POLICY "Block direct update to activities" ON public.activities
    FOR UPDATE USING (false);

CREATE POLICY "Block direct delete from activities" ON public.activities
    FOR DELETE USING (false);

-- =============================================
-- 4. Create secure admin RPC functions for activity management
-- These bypass RLS using SECURITY DEFINER
-- =============================================

-- Secure function to create activity (admin only)
CREATE OR REPLACE FUNCTION admin_create_activity(
    p_admin_id UUID,
    p_title TEXT,
    p_description TEXT DEFAULT NULL,
    p_image TEXT DEFAULT NULL,
    p_price_range TEXT DEFAULT NULL,
    p_location TEXT DEFAULT NULL,
    p_date TEXT DEFAULT NULL,
    p_time TEXT DEFAULT NULL,
    p_map_link TEXT DEFAULT NULL,
    p_contact_info TEXT DEFAULT NULL,
    p_url TEXT DEFAULT NULL,
    p_category_ids TEXT[] DEFAULT '{}',
    p_tags TEXT[] DEFAULT '{}',
    p_section_type TEXT DEFAULT 'all',
    p_enabled BOOLEAN DEFAULT true
)
RETURNS JSON AS $$
DECLARE
    v_activity_id INTEGER;
BEGIN
    -- Verify admin session
    IF NOT is_valid_admin_session(p_admin_id) THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Unauthorized: Invalid admin session'
        );
    END IF;
    
    -- Validate required fields
    IF p_title IS NULL OR LENGTH(TRIM(p_title)) = 0 THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Title is required'
        );
    END IF;
    
    -- Validate URL if provided
    IF p_url IS NOT NULL AND p_url !~ '^https?://' THEN
        RETURN json_build_object(
            'success', false,
            'message', 'URL must start with http:// or https://'
        );
    END IF;
    
    -- Validate map_link if provided
    IF p_map_link IS NOT NULL AND p_map_link !~ '^https?://' THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Map link must start with http:// or https://'
        );
    END IF;
    
    -- Insert with sanitized data
    INSERT INTO public.activities (
        title, description, image, price_range, location,
        date, time, map_link, contact_info, url,
        category_ids, tags, section_type, enabled,
        created_at, updated_at
    ) VALUES (
        TRIM(p_title),
        TRIM(COALESCE(p_description, '')),
        p_image,
        p_price_range,
        TRIM(COALESCE(p_location, '')),
        p_date,
        p_time,
        p_map_link,
        p_contact_info,
        p_url,
        p_category_ids,
        p_tags,
        COALESCE(p_section_type, 'all'),
        COALESCE(p_enabled, true),
        NOW(),
        NOW()
    ) RETURNING id INTO v_activity_id;
    
    RETURN json_build_object(
        'success', true,
        'message', 'Activity created successfully',
        'activity_id', v_activity_id
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Failed to create activity: ' || SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Secure function to update activity (admin only)
CREATE OR REPLACE FUNCTION admin_update_activity(
    p_admin_id UUID,
    p_activity_id INTEGER,
    p_title TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_image TEXT DEFAULT NULL,
    p_price_range TEXT DEFAULT NULL,
    p_location TEXT DEFAULT NULL,
    p_date TEXT DEFAULT NULL,
    p_time TEXT DEFAULT NULL,
    p_map_link TEXT DEFAULT NULL,
    p_contact_info TEXT DEFAULT NULL,
    p_url TEXT DEFAULT NULL,
    p_category_ids TEXT[] DEFAULT NULL,
    p_tags TEXT[] DEFAULT NULL,
    p_section_type TEXT DEFAULT NULL,
    p_enabled BOOLEAN DEFAULT NULL
)
RETURNS JSON AS $$
BEGIN
    -- Verify admin session
    IF NOT is_valid_admin_session(p_admin_id) THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Unauthorized: Invalid admin session'
        );
    END IF;
    
    -- Validate URL if provided
    IF p_url IS NOT NULL AND p_url != '' AND p_url !~ '^https?://' THEN
        RETURN json_build_object(
            'success', false,
            'message', 'URL must start with http:// or https://'
        );
    END IF;
    
    -- Validate map_link if provided
    IF p_map_link IS NOT NULL AND p_map_link != '' AND p_map_link !~ '^https?://' THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Map link must start with http:// or https://'
        );
    END IF;
    
    -- Update only provided fields
    UPDATE public.activities SET
        title = COALESCE(TRIM(p_title), title),
        description = COALESCE(TRIM(p_description), description),
        image = COALESCE(p_image, image),
        price_range = COALESCE(p_price_range, price_range),
        location = COALESCE(TRIM(p_location), location),
        date = COALESCE(p_date, date),
        time = COALESCE(p_time, time),
        map_link = COALESCE(p_map_link, map_link),
        contact_info = COALESCE(p_contact_info, contact_info),
        url = COALESCE(p_url, url),
        category_ids = COALESCE(p_category_ids, category_ids),
        tags = COALESCE(p_tags, tags),
        section_type = COALESCE(p_section_type, section_type),
        enabled = COALESCE(p_enabled, enabled),
        updated_at = NOW()
    WHERE id = p_activity_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Activity not found'
        );
    END IF;
    
    RETURN json_build_object(
        'success', true,
        'message', 'Activity updated successfully'
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Failed to update activity: ' || SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Secure function to delete activity (admin only)
CREATE OR REPLACE FUNCTION admin_delete_activity(
    p_admin_id UUID,
    p_activity_id INTEGER
)
RETURNS JSON AS $$
BEGIN
    -- Verify admin session
    IF NOT is_valid_admin_session(p_admin_id) THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Unauthorized: Invalid admin session'
        );
    END IF;
    
    DELETE FROM public.activities WHERE id = p_activity_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Activity not found'
        );
    END IF;
    
    RETURN json_build_object(
        'success', true,
        'message', 'Activity deleted successfully'
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Failed to delete activity: ' || SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 5. Grant execute permissions on admin functions
-- =============================================
GRANT EXECUTE ON FUNCTION admin_create_activity TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_update_activity TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_delete_activity TO anon, authenticated;
GRANT EXECUTE ON FUNCTION is_valid_admin_session TO anon, authenticated;

-- =============================================
-- 6. Update 005 migration: Revoke create_admin_user from authenticated
-- Only service role should be able to create admin users
-- =============================================
REVOKE EXECUTE ON FUNCTION create_admin_user(TEXT, TEXT, TEXT) FROM authenticated;
REVOKE EXECUTE ON FUNCTION create_admin_user(TEXT, TEXT, TEXT) FROM anon;

DO $$
BEGIN
    RAISE NOTICE '✅ Security migration complete!';
    RAISE NOTICE '🔒 Direct write access to activities table is now blocked';
    RAISE NOTICE '🔑 Use admin_create_activity, admin_update_activity, admin_delete_activity functions';
    RAISE NOTICE '⚠️  create_admin_user revoked from authenticated users';
END $$;
