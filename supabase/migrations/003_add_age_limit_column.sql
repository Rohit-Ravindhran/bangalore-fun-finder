-- Migration: Add age_limit column to activities table
-- This adds support for age restrictions on activities

ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS age_limit TEXT;

-- Add comment for the new column
COMMENT ON COLUMN public.activities.age_limit IS 'Age limit or restriction for the activity (e.g., "18+", "All ages", "21+")';