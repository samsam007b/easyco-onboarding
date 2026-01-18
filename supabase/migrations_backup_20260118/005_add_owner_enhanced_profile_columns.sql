-- Migration: Add Owner Enhanced Profile Columns
-- Date: 2025-10-26
-- Description: Add missing columns for Owner Enhanced Profile pages

-- Add owner enhanced profile columns to user_profiles table
ALTER TABLE public.user_profiles
  -- Owner bio (separate from general bio for owners)
  ADD COLUMN IF NOT EXISTS owner_bio TEXT,

  -- Smoking policy (separate from is_smoker which is for renters)
  ADD COLUMN IF NOT EXISTS smoking_allowed BOOLEAN DEFAULT FALSE,

  -- Amenities offered in properties (array of strings)
  ADD COLUMN IF NOT EXISTS amenities TEXT[] DEFAULT '{}',

  -- Services included in rental (array of strings)
  ADD COLUMN IF NOT EXISTS included_services TEXT[] DEFAULT '{}';

-- Add comments for documentation
COMMENT ON COLUMN public.user_profiles.owner_bio IS 'Bio/description specifically for landlords/owners';
COMMENT ON COLUMN public.user_profiles.smoking_allowed IS 'Whether owner allows smoking in their properties';
COMMENT ON COLUMN public.user_profiles.amenities IS 'Array of amenities available (wifi, parking, gym, etc.)';
COMMENT ON COLUMN public.user_profiles.included_services IS 'Array of services included in rent (utilities, cleaning, etc.)';

-- Create indexes for array columns
CREATE INDEX IF NOT EXISTS idx_user_profiles_amenities ON public.user_profiles USING GIN (amenities);
CREATE INDEX IF NOT EXISTS idx_user_profiles_included_services ON public.user_profiles USING GIN (included_services);

-- Note: The following columns already exist with slightly different names:
-- - experience_years (exists)
-- - management_type (exists)
-- - primary_motivation (exists)
-- - notice_period_days (exists, maps to noticePeriod)
-- - minimum_lease_duration_months (exists, maps to minimumLeaseDuration)
-- - deposit_amount_months (exists, maps to depositAmount)
-- - pets_allowed_policy (exists, maps to petsAllowed)
