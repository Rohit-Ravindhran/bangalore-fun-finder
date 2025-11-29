-- Bangalore Fun Finder - Initial Database Schema Migration
-- This migration creates all necessary tables for a new Supabase instance
-- Run this file in the Supabase SQL Editor to set up your database

-- =============================================
-- 1. Enable necessary extensions
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 2. Create categories table
-- =============================================
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add comment
COMMENT ON TABLE public.categories IS 'Stores activity categories (e.g., Food, Music, Art)';

-- =============================================
-- 3. Create tags table
-- =============================================
CREATE TABLE IF NOT EXISTS public.tags (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add comment
COMMENT ON TABLE public.tags IS 'Stores activity tags (e.g., trending, ourpick)';

-- =============================================
-- 4. Create activities table
-- =============================================
CREATE TABLE IF NOT EXISTS public.activities (
    id SERIAL PRIMARY KEY,
    title TEXT,
    description TEXT,
    image TEXT,
    price_range TEXT,
    location TEXT,
    date TEXT,
    time TEXT,
    map_link TEXT,
    contact_info TEXT,
    url TEXT,
    category_ids TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    section_type TEXT DEFAULT 'all',
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add comments
COMMENT ON TABLE public.activities IS 'Stores all activities/events in Bangalore';
COMMENT ON COLUMN public.activities.section_type IS 'Can be: all, unique, date';
COMMENT ON COLUMN public.activities.category_ids IS 'Array of category IDs';
COMMENT ON COLUMN public.activities.tags IS 'Array of tags (trending, ourpick, etc.)';
COMMENT ON COLUMN public.activities.enabled IS 'Controls whether activity is visible to users';

-- Create index on section_type for faster filtering
CREATE INDEX IF NOT EXISTS idx_activities_section_type ON public.activities(section_type);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON public.activities(created_at DESC);

-- Create GIN index on category_ids for array containment queries
CREATE INDEX IF NOT EXISTS idx_activities_category_ids ON public.activities USING GIN(category_ids);

-- Create GIN index on tags for array containment queries
CREATE INDEX IF NOT EXISTS idx_activities_tags ON public.activities USING GIN(tags);

-- =============================================
-- 5. Create users table (for newsletter subscriptions)
-- =============================================
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT email_or_phone_required CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Add comment
COMMENT ON TABLE public.users IS 'Stores newsletter subscribers';

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- =============================================
-- 6. Create contact_submissions table
-- =============================================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email_or_phone TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add comment
COMMENT ON TABLE public.contact_submissions IS 'Stores contact form submissions';

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);

-- =============================================
-- 7. Create function to update updated_at timestamp
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment
COMMENT ON FUNCTION public.handle_updated_at() IS 'Automatically updates updated_at timestamp on row modification';

-- =============================================
-- 8. Create trigger for activities updated_at
-- =============================================
DROP TRIGGER IF EXISTS set_updated_at ON public.activities;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.activities
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- 9. Enable Row Level Security (RLS)
-- =============================================
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 10. Create RLS Policies
-- =============================================

-- Activities: Public read access, authenticated write access
CREATE POLICY "Enable read access for all users" ON public.activities
    FOR SELECT USING (enabled = true);

CREATE POLICY "Enable insert for authenticated users only" ON public.activities
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.activities
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON public.activities
    FOR DELETE USING (auth.role() = 'authenticated');

-- Categories: Public read access
CREATE POLICY "Enable read access for all users" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Enable write for authenticated users only" ON public.categories
    FOR ALL USING (auth.role() = 'authenticated');

-- Tags: Public read access
CREATE POLICY "Enable read access for all users" ON public.tags
    FOR SELECT USING (true);

CREATE POLICY "Enable write for authenticated users only" ON public.tags
    FOR ALL USING (auth.role() = 'authenticated');

-- Users: Insert only (for subscriptions)
CREATE POLICY "Enable insert access for all users" ON public.users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users only" ON public.users
    FOR SELECT USING (auth.role() = 'authenticated');

-- Contact Submissions: Insert only (for contact form)
CREATE POLICY "Enable insert access for all users" ON public.contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users only" ON public.contact_submissions
    FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================
-- 11. Insert seed data for categories
-- =============================================
INSERT INTO public.categories (name) VALUES
    ('food'),
    ('music'),
    ('art'),
    ('sports'),
    ('comedy'),
    ('theater'),
    ('workshops'),
    ('outdoor'),
    ('nightlife'),
    ('wellness')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 12. Insert seed data for tags
-- =============================================
INSERT INTO public.tags (name) VALUES
    ('trending'),
    ('ourpick'),
    ('free'),
    ('family-friendly'),
    ('weekend'),
    ('popular')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 13. Grant necessary permissions
-- =============================================

-- Grant usage on sequences
GRANT USAGE ON SEQUENCE public.activities_id_seq TO anon, authenticated;
GRANT USAGE ON SEQUENCE public.categories_id_seq TO anon, authenticated;
GRANT USAGE ON SEQUENCE public.tags_id_seq TO anon, authenticated;
GRANT USAGE ON SEQUENCE public.users_id_seq TO anon, authenticated;

-- Grant table permissions
GRANT SELECT ON public.activities TO anon, authenticated;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.tags TO anon, authenticated;
GRANT INSERT ON public.users TO anon, authenticated;
GRANT INSERT ON public.contact_submissions TO anon, authenticated;

GRANT ALL ON public.activities TO authenticated;
GRANT ALL ON public.categories TO authenticated;
GRANT ALL ON public.tags TO authenticated;
GRANT SELECT ON public.users TO authenticated;
GRANT SELECT ON public.contact_submissions TO authenticated;

-- =============================================
-- 14. Create sample activities (optional)
-- =============================================
INSERT INTO public.activities (
    title,
    description,
    image,
    price_range,
    location,
    date,
    time,
    category_ids,
    tags,
    section_type,
    enabled
) VALUES
(
    'Sample Event - Weekend Market',
    'A vibrant weekend market with local artisans, food vendors, and live music.',
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e',
    'Free',
    'Indiranagar',
    'This Weekend',
    '10:00 AM',
    ARRAY['food', 'art']::TEXT[],
    ARRAY['trending', 'free']::TEXT[],
    'all',
    true
),
(
    'Sample Event - Live Music Night',
    'Experience live indie music under the stars with amazing local bands.',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
    '₹500 - ₹1000',
    'Koramangala',
    'Friday',
    '7:00 PM',
    ARRAY['music', 'nightlife']::TEXT[],
    ARRAY['ourpick']::TEXT[],
    'all',
    true
),
(
    'Sample Event - Yoga in the Park',
    'Start your day with rejuvenating yoga sessions in a peaceful park setting.',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
    'Free',
    'Cubbon Park',
    'Every Saturday',
    '6:30 AM',
    ARRAY['wellness', 'outdoor']::TEXT[],
    ARRAY['free', 'weekend']::TEXT[],
    'unique',
    true
)
ON CONFLICT DO NOTHING;

-- =============================================
-- MIGRATION COMPLETE
-- =============================================

-- Display success message
DO $$
BEGIN
    RAISE NOTICE '✅ Migration completed successfully!';
    RAISE NOTICE '📊 Created tables: activities, categories, tags, users, contact_submissions';
    RAISE NOTICE '🔒 Row Level Security policies enabled';
    RAISE NOTICE '🌱 Seed data inserted';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Next steps:';
    RAISE NOTICE '1. Add your Supabase URL and anon key to your .env file';
    RAISE NOTICE '2. Start adding activities through your admin interface';
    RAISE NOTICE '3. Customize categories and tags as needed';
END $$;
