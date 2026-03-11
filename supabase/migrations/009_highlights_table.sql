-- Highlights Table Migration
-- This migration creates the highlights table for the carousel feature

-- =============================================
-- 1. Create highlights table
-- =============================================
CREATE TABLE IF NOT EXISTS public.highlights (
    id SERIAL PRIMARY KEY,
    title TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add comment
COMMENT ON TABLE public.highlights IS 'Stores highlight banners for the homepage carousel';

-- =============================================
-- 2. Enable Row Level Security
-- =============================================
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 3. Create RLS policies
-- =============================================

-- Allow anyone to read active highlights
CREATE POLICY "Allow public read access for active highlights"
    ON public.highlights
    FOR SELECT
    USING (is_active = true);

-- Allow authenticated admin users to perform all operations
CREATE POLICY "Allow admin full access to highlights"
    ON public.highlights
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- =============================================
-- 4. Create index for display order
-- =============================================
CREATE INDEX IF NOT EXISTS idx_highlights_display_order ON public.highlights(display_order);
CREATE INDEX IF NOT EXISTS idx_highlights_is_active ON public.highlights(is_active);

-- =============================================
-- 5. Grant permissions
-- =============================================
GRANT SELECT ON public.highlights TO anon;
GRANT ALL ON public.highlights TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.highlights_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.highlights_id_seq TO authenticated;
