-- Update RLS policies to allow inserts from client
-- WARNING: This is for development/testing. In production, use proper authentication.

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.activities;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.activities;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.activities;

-- Create new policies that allow all operations
-- For production, you should implement proper authentication

-- Allow anyone to insert activities
CREATE POLICY "Enable insert access for all users" ON public.activities
    FOR INSERT WITH CHECK (true);

-- Allow anyone to update activities
CREATE POLICY "Enable update access for all users" ON public.activities
    FOR UPDATE USING (true);

-- Allow anyone to delete activities
CREATE POLICY "Enable delete access for all users" ON public.activities
    FOR DELETE USING (true);

-- Note: Keep the read policy as is (only enabled activities are visible)

DO $$
BEGIN
    RAISE NOTICE '✅ RLS policies updated!';
    RAISE NOTICE '⚠️  WARNING: All users can now insert/update/delete activities';
    RAISE NOTICE '📝 For production, implement proper authentication';
END $$;
