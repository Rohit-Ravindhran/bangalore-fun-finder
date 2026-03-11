-- Admin Users - Secure Password Storage
-- This migration creates the admin_users table with encrypted passwords using pgcrypto

-- =============================================
-- 1. Enable pgcrypto extension for password hashing
-- =============================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================
-- 2. Create admin_users table
-- =============================================
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    email TEXT UNIQUE,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add comments
COMMENT ON TABLE public.admin_users IS 'Stores admin user credentials with hashed passwords';
COMMENT ON COLUMN public.admin_users.password_hash IS 'Bcrypt hashed password - never store plain text';

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON public.admin_users(username);

-- =============================================
-- 3. Create function to hash passwords
-- =============================================
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Use bcrypt with cost factor 12 (good balance of security and performance)
    RETURN crypt(password, gen_salt('bf', 12));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 4. Create secure function to verify admin credentials
-- This function never exposes the password hash to the client
-- =============================================
CREATE OR REPLACE FUNCTION verify_admin_credentials(
    p_username TEXT,
    p_password TEXT
)
RETURNS JSON AS $$
DECLARE
    v_admin RECORD;
    v_result JSON;
BEGIN
    -- Find admin user by username
    SELECT id, username, password_hash, is_active
    INTO v_admin
    FROM public.admin_users
    WHERE username = p_username AND is_active = true;
    
    -- Check if user exists
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Invalid credentials'
        );
    END IF;
    
    -- Verify password using bcrypt comparison
    IF v_admin.password_hash = crypt(p_password, v_admin.password_hash) THEN
        -- Update last login timestamp
        UPDATE public.admin_users 
        SET last_login = timezone('utc'::text, now()),
            updated_at = timezone('utc'::text, now())
        WHERE id = v_admin.id;
        
        RETURN json_build_object(
            'success', true,
            'message', 'Authentication successful',
            'admin_id', v_admin.id,
            'username', v_admin.username
        );
    ELSE
        RETURN json_build_object(
            'success', false,
            'message', 'Invalid credentials'
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 5. Create function to create admin user (for setup)
-- =============================================
CREATE OR REPLACE FUNCTION create_admin_user(
    p_username TEXT,
    p_password TEXT,
    p_email TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    v_password_hash TEXT;
    v_admin_id UUID;
BEGIN
    -- Validate password strength (minimum 8 characters)
    IF LENGTH(p_password) < 8 THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Password must be at least 8 characters long'
        );
    END IF;
    
    -- Hash the password
    v_password_hash := crypt(p_password, gen_salt('bf', 12));
    
    -- Insert the admin user
    INSERT INTO public.admin_users (username, password_hash, email)
    VALUES (p_username, v_password_hash, p_email)
    RETURNING id INTO v_admin_id;
    
    RETURN json_build_object(
        'success', true,
        'message', 'Admin user created successfully',
        'admin_id', v_admin_id
    );
EXCEPTION
    WHEN unique_violation THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Username or email already exists'
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 6. Create function to change admin password
-- =============================================
CREATE OR REPLACE FUNCTION change_admin_password(
    p_username TEXT,
    p_old_password TEXT,
    p_new_password TEXT
)
RETURNS JSON AS $$
DECLARE
    v_admin RECORD;
BEGIN
    -- Validate new password strength
    IF LENGTH(p_new_password) < 8 THEN
        RETURN json_build_object(
            'success', false,
            'message', 'New password must be at least 8 characters long'
        );
    END IF;
    
    -- Find and verify current password
    SELECT id, password_hash
    INTO v_admin
    FROM public.admin_users
    WHERE username = p_username AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Invalid credentials'
        );
    END IF;
    
    -- Verify old password
    IF v_admin.password_hash != crypt(p_old_password, v_admin.password_hash) THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Current password is incorrect'
        );
    END IF;
    
    -- Update with new hashed password
    UPDATE public.admin_users 
    SET password_hash = crypt(p_new_password, gen_salt('bf', 12)),
        updated_at = timezone('utc'::text, now())
    WHERE id = v_admin.id;
    
    RETURN json_build_object(
        'success', true,
        'message', 'Password changed successfully'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 7. Row Level Security (RLS) Policies
-- =============================================
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- No direct access to admin_users table - all access through functions
-- This prevents any direct queries that might expose password hashes
CREATE POLICY "No direct read access to admin_users"
    ON public.admin_users
    FOR SELECT
    USING (false);

CREATE POLICY "No direct insert to admin_users"
    ON public.admin_users
    FOR INSERT
    WITH CHECK (false);

CREATE POLICY "No direct update to admin_users"
    ON public.admin_users
    FOR UPDATE
    USING (false);

CREATE POLICY "No direct delete from admin_users"
    ON public.admin_users
    FOR DELETE
    USING (false);

-- =============================================
-- 8. Grant execute permissions on functions
-- =============================================
GRANT EXECUTE ON FUNCTION verify_admin_credentials(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION create_admin_user(TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION change_admin_password(TEXT, TEXT, TEXT) TO authenticated;

-- Note: To create the initial admin user, run this in Supabase SQL Editor as a superuser:
-- SELECT create_admin_user('admin', 'your_secure_password_here', 'admin@yourdomain.com');
