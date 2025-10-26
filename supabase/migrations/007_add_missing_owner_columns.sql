-- Migration 007: Add Missing Owner Profile Columns
-- These columns were referenced in code but missing from the database schema

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS owner_type TEXT CHECK (owner_type IN ('individual', 'agency', 'company')),
  ADD COLUMN IF NOT EXISTS primary_location TEXT,
  ADD COLUMN IF NOT EXISTS hosting_experience TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.user_profiles.owner_type IS 'Type of property owner (individual, agency, company) - used in about page';
COMMENT ON COLUMN public.user_profiles.primary_location IS 'Primary city/location where the owner operates';
COMMENT ON COLUMN public.user_profiles.hosting_experience IS 'Years of hosting/landlord experience (0-1 year, 1-3 years, 3+ years)';

-- Create indexes for filtering
CREATE INDEX IF NOT EXISTS idx_user_profiles_owner_type ON public.user_profiles(owner_type) WHERE owner_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_primary_location ON public.user_profiles(primary_location) WHERE primary_location IS NOT NULL;
