-- Fix: Re-grant all execute permissions for admin functions
-- Ensures all RPC functions are accessible

-- Grant execute on verify_admin_credentials
GRANT EXECUTE ON FUNCTION verify_admin_credentials(TEXT, TEXT) TO anon, authenticated;

-- Grant execute on admin activity management functions
GRANT EXECUTE ON FUNCTION is_valid_admin_session(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_create_activity(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT[], TEXT[], TEXT, BOOLEAN) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_update_activity(UUID, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT[], TEXT[], TEXT, BOOLEAN) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_delete_activity(UUID, INTEGER) TO anon, authenticated;

DO $$
BEGIN
    RAISE NOTICE '✅ Fixed: All admin function execute permissions restored';
END $$;
