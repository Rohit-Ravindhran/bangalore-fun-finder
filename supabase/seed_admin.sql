-- =============================================
-- Admin User Seed Script
-- =============================================
-- Run this script in the Supabase SQL Editor after running all migrations
-- to create your initial admin user.
--
-- IMPORTANT: Change the password below to a strong, unique password!
-- 
-- Password requirements:
--   - Minimum 12 characters
--   - At least one uppercase letter (A-Z)
--   - At least one lowercase letter (a-z) 
--   - At least one number (0-9)
--   - At least one special character (!@#$%^&* etc.)
--   - Cannot contain common weak patterns (password, 123456, etc.)
-- 
-- After running this script, delete it or store the password securely.
-- Never commit real passwords to version control.
-- =============================================

-- Create the initial admin user
-- Replace 'YourStr0ng!Pass#2024' with your actual password
SELECT create_admin_user(
    'admin',                          -- username
    'YourStr0ng!Pass#2024',           -- password (CHANGE THIS!)
    'admin@happninbangalore.com'      -- email (optional)
);

-- =============================================
-- Verification (optional - run separately)
-- =============================================
-- To verify the admin was created, run:
-- SELECT verify_admin_credentials('admin', 'YourStr0ng!Pass#2024');
-- Should return: {"success": true, "message": "Authentication successful", ...}
