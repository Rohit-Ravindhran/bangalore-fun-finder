-- Password Policy Enhancement
-- This migration updates the password validation to require stronger passwords

-- =============================================
-- 1. Drop existing functions to recreate with better validation
-- =============================================
DROP FUNCTION IF EXISTS create_admin_user(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS change_admin_password(TEXT, TEXT, TEXT);

-- =============================================
-- 2. Password validation helper function
-- =============================================
CREATE OR REPLACE FUNCTION validate_password_strength(p_password TEXT)
RETURNS JSON AS $$
DECLARE
    v_errors TEXT[] := '{}';
BEGIN
    -- Minimum length: 12 characters
    IF LENGTH(p_password) < 12 THEN
        v_errors := array_append(v_errors, 'Password must be at least 12 characters long');
    END IF;
    
    -- Maximum length: 128 characters (prevent DoS with very long passwords)
    IF LENGTH(p_password) > 128 THEN
        v_errors := array_append(v_errors, 'Password must not exceed 128 characters');
    END IF;
    
    -- Require at least one uppercase letter
    IF p_password !~ '[A-Z]' THEN
        v_errors := array_append(v_errors, 'Password must contain at least one uppercase letter');
    END IF;
    
    -- Require at least one lowercase letter
    IF p_password !~ '[a-z]' THEN
        v_errors := array_append(v_errors, 'Password must contain at least one lowercase letter');
    END IF;
    
    -- Require at least one number
    IF p_password !~ '[0-9]' THEN
        v_errors := array_append(v_errors, 'Password must contain at least one number');
    END IF;
    
    -- Require at least one special character
    IF p_password !~ '[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~]' THEN
        v_errors := array_append(v_errors, 'Password must contain at least one special character (!@#$%^&*etc.)');
    END IF;
    
    -- Check for common weak patterns
    IF p_password ~* '(password|123456|qwerty|admin|letmein|welcome)' THEN
        v_errors := array_append(v_errors, 'Password contains common weak patterns');
    END IF;
    
    IF array_length(v_errors, 1) > 0 THEN
        RETURN json_build_object(
            'valid', false,
            'errors', v_errors
        );
    END IF;
    
    RETURN json_build_object('valid', true, 'errors', '{}'::TEXT[]);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =============================================
-- 3. Recreate create_admin_user with strong password validation
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
    v_validation JSON;
BEGIN
    -- Validate username
    IF p_username IS NULL OR LENGTH(TRIM(p_username)) < 3 THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Username must be at least 3 characters long'
        );
    END IF;
    
    -- Validate password strength
    v_validation := validate_password_strength(p_password);
    IF NOT (v_validation->>'valid')::BOOLEAN THEN
        RETURN json_build_object(
            'success', false,
            'message', (v_validation->'errors'->>0)::TEXT,
            'all_errors', v_validation->'errors'
        );
    END IF;
    
    -- Hash the password using bcrypt with cost factor 12
    v_password_hash := crypt(p_password, gen_salt('bf', 12));
    
    -- Insert the admin user
    INSERT INTO public.admin_users (username, password_hash, email)
    VALUES (LOWER(TRIM(p_username)), v_password_hash, LOWER(TRIM(p_email)))
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
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Failed to create admin user'
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 4. Recreate change_admin_password with strong password validation
-- =============================================
CREATE OR REPLACE FUNCTION change_admin_password(
    p_username TEXT,
    p_old_password TEXT,
    p_new_password TEXT
)
RETURNS JSON AS $$
DECLARE
    v_admin RECORD;
    v_validation JSON;
BEGIN
    -- Validate new password strength
    v_validation := validate_password_strength(p_new_password);
    IF NOT (v_validation->>'valid')::BOOLEAN THEN
        RETURN json_build_object(
            'success', false,
            'message', (v_validation->'errors'->>0)::TEXT,
            'all_errors', v_validation->'errors'
        );
    END IF;
    
    -- Find and verify current password
    SELECT id, password_hash
    INTO v_admin
    FROM public.admin_users
    WHERE username = LOWER(TRIM(p_username)) AND is_active = true;
    
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
    
    -- Ensure new password is different from old
    IF crypt(p_new_password, v_admin.password_hash) = v_admin.password_hash THEN
        RETURN json_build_object(
            'success', false,
            'message', 'New password must be different from current password'
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
-- 5. Add server-side rate limiting for login attempts
-- =============================================
CREATE TABLE IF NOT EXISTS public.login_attempts (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    ip_address TEXT,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    success BOOLEAN DEFAULT false
);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_login_attempts_username_time 
ON public.login_attempts(username, attempted_at DESC);

-- Enable RLS
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- Block direct access
CREATE POLICY "No direct access to login_attempts"
    ON public.login_attempts
    FOR ALL
    USING (false);

-- =============================================
-- 6. Update verify_admin_credentials with rate limiting
-- =============================================
CREATE OR REPLACE FUNCTION verify_admin_credentials(
    p_username TEXT,
    p_password TEXT
)
RETURNS JSON AS $$
DECLARE
    v_admin RECORD;
    v_recent_failures INTEGER;
    v_lockout_until TIMESTAMP WITH TIME ZONE;
    v_username_normalized TEXT;
BEGIN
    v_username_normalized := LOWER(TRIM(p_username));
    
    -- Check for recent failed attempts (rate limiting)
    SELECT COUNT(*) INTO v_recent_failures
    FROM public.login_attempts
    WHERE username = v_username_normalized
      AND success = false
      AND attempted_at > (NOW() - INTERVAL '15 minutes');
    
    -- Lock out after 5 failed attempts
    IF v_recent_failures >= 5 THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Account temporarily locked. Try again in 15 minutes.',
            'locked', true
        );
    END IF;
    
    -- Find admin user by username
    SELECT id, username, password_hash, is_active
    INTO v_admin
    FROM public.admin_users
    WHERE username = v_username_normalized AND is_active = true;
    
    -- Check if user exists
    IF NOT FOUND THEN
        -- Record failed attempt (but don't reveal user doesn't exist)
        INSERT INTO public.login_attempts (username, success)
        VALUES (v_username_normalized, false);
        
        RETURN json_build_object(
            'success', false,
            'message', 'Invalid credentials'
        );
    END IF;
    
    -- Verify password using bcrypt comparison
    IF v_admin.password_hash = crypt(p_password, v_admin.password_hash) THEN
        -- Record successful attempt
        INSERT INTO public.login_attempts (username, success)
        VALUES (v_username_normalized, true);
        
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
        -- Record failed attempt
        INSERT INTO public.login_attempts (username, success)
        VALUES (v_username_normalized, false);
        
        RETURN json_build_object(
            'success', false,
            'message', 'Invalid credentials'
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 7. Cleanup old login attempts (scheduled task)
-- =============================================
CREATE OR REPLACE FUNCTION cleanup_old_login_attempts()
RETURNS void AS $$
BEGIN
    DELETE FROM public.login_attempts
    WHERE attempted_at < (NOW() - INTERVAL '24 hours');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute on cleanup function (for scheduled jobs)
GRANT EXECUTE ON FUNCTION cleanup_old_login_attempts() TO authenticated;

DO $$
BEGIN
    RAISE NOTICE '✅ Password policy strengthened!';
    RAISE NOTICE '🔒 Passwords now require: 12+ chars, upper, lower, number, special char';
    RAISE NOTICE '⏱️ Server-side rate limiting added (5 attempts / 15 min lockout)';
END $$;
