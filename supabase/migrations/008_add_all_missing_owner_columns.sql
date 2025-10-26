-- Migration 008: Add ALL Missing Owner Profile Columns
-- This is a consolidation migration to ensure all Owner columns exist

ALTER TABLE public.user_profiles
  -- Basic Owner Info (if not already added)
  ADD COLUMN IF NOT EXISTS phone_number TEXT,
  ADD COLUMN IF NOT EXISTS owner_type TEXT CHECK (owner_type IN ('individual', 'agency', 'company')),
  ADD COLUMN IF NOT EXISTS primary_location TEXT,
  ADD COLUMN IF NOT EXISTS hosting_experience TEXT,

  -- Property Info (from migration 006)
  ADD COLUMN IF NOT EXISTS has_property BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS property_city TEXT,
  ADD COLUMN IF NOT EXISTS property_type TEXT,

  -- Payment Info
  ADD COLUMN IF NOT EXISTS iban TEXT,
  ADD COLUMN IF NOT EXISTS swift_bic TEXT,

  -- Owner Enhanced Profile (from migration 005)
  ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS management_type TEXT,
  ADD COLUMN IF NOT EXISTS primary_motivation TEXT,
  ADD COLUMN IF NOT EXISTS owner_bio TEXT,
  ADD COLUMN IF NOT EXISTS pets_allowed_policy BOOLEAN,
  ADD COLUMN IF NOT EXISTS smoking_allowed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS minimum_lease_duration_months INTEGER,
  ADD COLUMN IF NOT EXISTS deposit_amount_months NUMERIC(4,2) DEFAULT 1.0,
  ADD COLUMN IF NOT EXISTS notice_period_days INTEGER,
  ADD COLUMN IF NOT EXISTS amenities TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS included_services TEXT[] DEFAULT '{}';

-- Add comments
COMMENT ON COLUMN public.user_profiles.phone_number IS 'Phone number for contact';
COMMENT ON COLUMN public.user_profiles.owner_type IS 'Type of property owner (individual, agency, company)';
COMMENT ON COLUMN public.user_profiles.primary_location IS 'Primary city/location where owner operates';
COMMENT ON COLUMN public.user_profiles.hosting_experience IS 'Years of hosting experience';
COMMENT ON COLUMN public.user_profiles.has_property IS 'Whether owner has a property available';
COMMENT ON COLUMN public.user_profiles.property_city IS 'Primary city where owner has properties';
COMMENT ON COLUMN public.user_profiles.property_type IS 'Primary property type';
COMMENT ON COLUMN public.user_profiles.iban IS 'IBAN for payments';
COMMENT ON COLUMN public.user_profiles.swift_bic IS 'SWIFT/BIC code';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone_number ON public.user_profiles(phone_number) WHERE phone_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_owner_type ON public.user_profiles(owner_type) WHERE owner_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_primary_location ON public.user_profiles(primary_location) WHERE primary_location IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_has_property ON public.user_profiles(has_property) WHERE has_property = true;
CREATE INDEX IF NOT EXISTS idx_user_profiles_property_city ON public.user_profiles(property_city) WHERE property_city IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_amenities ON public.user_profiles USING GIN (amenities);
CREATE INDEX IF NOT EXISTS idx_user_profiles_included_services ON public.user_profiles USING GIN (included_services);
