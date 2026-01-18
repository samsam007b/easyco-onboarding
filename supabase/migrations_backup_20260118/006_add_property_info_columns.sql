-- Migration 006: Add Property Information Columns to Owner Profiles
-- These columns track basic property ownership information for landlords/owners

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS has_property BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS property_city TEXT,
  ADD COLUMN IF NOT EXISTS property_type TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.user_profiles.has_property IS 'Whether the owner currently has a property available to rent';
COMMENT ON COLUMN public.user_profiles.property_city IS 'Primary city where the owner has properties';
COMMENT ON COLUMN public.user_profiles.property_type IS 'Primary type of property the owner manages (apartment, house, etc.)';

-- Create index for filtering owners by property availability
CREATE INDEX IF NOT EXISTS idx_user_profiles_has_property ON public.user_profiles(has_property) WHERE has_property = true;
CREATE INDEX IF NOT EXISTS idx_user_profiles_property_city ON public.user_profiles(property_city) WHERE property_city IS NOT NULL;
