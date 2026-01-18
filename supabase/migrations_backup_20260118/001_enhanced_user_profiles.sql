-- ============================================================================
-- MIGRATION: Enhanced User Profiles for Complete Onboarding
-- Date: 2025-10-26
-- Description: Adds critical typed columns and new tables for verification and consents
-- ============================================================================

-- ============================================================================
-- 1. ADD TYPED COLUMNS TO user_profiles
-- ============================================================================

-- Basic Information
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS phone_number TEXT,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS gender_identity TEXT,
  ADD COLUMN IF NOT EXISTS nationality TEXT,
  ADD COLUMN IF NOT EXISTS current_city TEXT,
  ADD COLUMN IF NOT EXISTS languages_spoken TEXT[],
  ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;

-- Professional Information (for Searchers/Residents)
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS occupation_status TEXT,
  ADD COLUMN IF NOT EXISTS field_of_study_or_work TEXT,
  ADD COLUMN IF NOT EXISTS institution_or_company TEXT,
  ADD COLUMN IF NOT EXISTS monthly_income_bracket TEXT,
  ADD COLUMN IF NOT EXISTS employment_type TEXT,
  ADD COLUMN IF NOT EXISTS guarantor_available BOOLEAN DEFAULT FALSE;

-- Owner-specific Information
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS company_name TEXT,
  ADD COLUMN IF NOT EXISTS landlord_type TEXT,
  ADD COLUMN IF NOT EXISTS portfolio_size INTEGER,
  ADD COLUMN IF NOT EXISTS management_type TEXT;

-- Address Information
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS postal_code TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT;

-- Banking Information (for Owners)
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS iban TEXT,
  ADD COLUMN IF NOT EXISTS bic_swift TEXT,
  ADD COLUMN IF NOT EXISTS account_holder_name TEXT,
  ADD COLUMN IF NOT EXISTS billing_address TEXT;

-- Metadata
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS profile_completion_score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bio TEXT;

-- ============================================================================
-- 2. CREATE VERIFICATION TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,

  -- Verification status flags
  id_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected', 'expired')),

  -- Document URLs (stored in Supabase Storage)
  id_document_url TEXT,
  proof_of_ownership_url TEXT,
  insurance_certificate_url TEXT,

  -- Verification metadata
  verified_at TIMESTAMPTZ,
  verified_by UUID,
  rejection_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)
);

-- ============================================================================
-- 3. CREATE CONSENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,

  -- Required consents
  terms_accepted BOOLEAN DEFAULT FALSE,
  terms_accepted_at TIMESTAMPTZ,
  terms_version TEXT,

  privacy_accepted BOOLEAN DEFAULT FALSE,
  privacy_accepted_at TIMESTAMPTZ,
  privacy_version TEXT,

  -- Optional consents
  data_processing BOOLEAN DEFAULT FALSE,
  data_processing_at TIMESTAMPTZ,

  matching_algorithm BOOLEAN DEFAULT FALSE,
  matching_algorithm_at TIMESTAMPTZ,

  marketing_opt_in BOOLEAN DEFAULT FALSE,
  marketing_opt_in_at TIMESTAMPTZ,

  -- GDPR compliance
  gdpr_data_retention BOOLEAN DEFAULT FALSE,
  gdpr_data_retention_at TIMESTAMPTZ,

  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private', 'hidden')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)
);

-- ============================================================================
-- 4. CREATE INDEXES
-- ============================================================================

-- user_profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_first_name ON public.user_profiles(first_name);
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_name ON public.user_profiles(last_name);
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON public.user_profiles(phone_number);
CREATE INDEX IF NOT EXISTS idx_user_profiles_city ON public.user_profiles(current_city);
CREATE INDEX IF NOT EXISTS idx_user_profiles_nationality ON public.user_profiles(nationality);
CREATE INDEX IF NOT EXISTS idx_user_profiles_completion ON public.user_profiles(profile_completion_score);

-- user_verifications indexes
CREATE INDEX IF NOT EXISTS idx_user_verifications_user_id ON public.user_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_verifications_kyc_status ON public.user_verifications(kyc_status);
CREATE INDEX IF NOT EXISTS idx_user_verifications_id_verified ON public.user_verifications(id_verified);
CREATE INDEX IF NOT EXISTS idx_user_verifications_phone_verified ON public.user_verifications(phone_verified);

-- user_consents indexes
CREATE INDEX IF NOT EXISTS idx_user_consents_user_id ON public.user_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_consents_terms ON public.user_consents(terms_accepted);
CREATE INDEX IF NOT EXISTS idx_user_consents_privacy ON public.user_consents(privacy_accepted);

-- ============================================================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.user_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. CREATE RLS POLICIES
-- ============================================================================

-- User Verifications Policies
DROP POLICY IF EXISTS "Users can view own verifications" ON public.user_verifications;
CREATE POLICY "Users can view own verifications"
  ON public.user_verifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own verifications" ON public.user_verifications;
CREATE POLICY "Users can insert own verifications"
  ON public.user_verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own verifications" ON public.user_verifications;
CREATE POLICY "Users can update own verifications"
  ON public.user_verifications FOR UPDATE
  USING (auth.uid() = user_id);

-- User Consents Policies
DROP POLICY IF EXISTS "Users can view own consents" ON public.user_consents;
CREATE POLICY "Users can view own consents"
  ON public.user_consents FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own consents" ON public.user_consents;
CREATE POLICY "Users can insert own consents"
  ON public.user_consents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own consents" ON public.user_consents;
CREATE POLICY "Users can update own consents"
  ON public.user_consents FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 7. CREATE/UPDATE TRIGGERS
-- ============================================================================

-- Trigger for user_verifications updated_at
DROP TRIGGER IF EXISTS set_user_verifications_updated_at ON public.user_verifications;
CREATE TRIGGER set_user_verifications_updated_at
  BEFORE UPDATE ON public.user_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for user_consents updated_at
DROP TRIGGER IF EXISTS set_user_consents_updated_at ON public.user_consents;
CREATE TRIGGER set_user_consents_updated_at
  BEFORE UPDATE ON public.user_consents
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 8. CREATE HELPER FUNCTIONS
-- ============================================================================

-- Function to calculate profile completion score
CREATE OR REPLACE FUNCTION public.calculate_profile_completion(user_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  profile_record RECORD;
BEGIN
  SELECT * INTO profile_record
  FROM public.user_profiles
  WHERE user_id = user_id_param;

  IF profile_record IS NULL THEN
    RETURN 0;
  END IF;

  -- Basic info (30 points)
  IF profile_record.first_name IS NOT NULL THEN score := score + 5; END IF;
  IF profile_record.last_name IS NOT NULL THEN score := score + 5; END IF;
  IF profile_record.date_of_birth IS NOT NULL THEN score := score + 5; END IF;
  IF profile_record.nationality IS NOT NULL THEN score := score + 5; END IF;
  IF profile_record.phone_number IS NOT NULL THEN score := score + 5; END IF;
  IF profile_record.profile_photo_url IS NOT NULL THEN score := score + 5; END IF;

  -- Professional/Location (20 points)
  IF profile_record.occupation_status IS NOT NULL THEN score := score + 10; END IF;
  IF profile_record.current_city IS NOT NULL THEN score := score + 10; END IF;

  -- Profile data (30 points)
  IF profile_record.profile_data IS NOT NULL AND
     jsonb_array_length(COALESCE(profile_record.profile_data, '{}'::jsonb)) > 0
  THEN
    score := score + 30;
  END IF;

  -- Verifications (20 points)
  IF EXISTS (
    SELECT 1 FROM public.user_verifications
    WHERE user_id = user_id_param AND id_verified = TRUE
  ) THEN score := score + 10; END IF;

  IF EXISTS (
    SELECT 1 FROM public.user_verifications
    WHERE user_id = user_id_param AND phone_verified = TRUE
  ) THEN score := score + 10; END IF;

  RETURN score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update profile completion score
CREATE OR REPLACE FUNCTION public.update_profile_completion_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.profile_completion_score := public.calculate_profile_completion(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update completion score
DROP TRIGGER IF EXISTS update_completion_score ON public.user_profiles;
CREATE TRIGGER update_completion_score
  BEFORE INSERT OR UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profile_completion_score();

-- ============================================================================
-- 9. CREATE VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Complete user profile view
CREATE OR REPLACE VIEW public.complete_user_profiles AS
SELECT
  u.id,
  u.email,
  u.user_type,
  u.onboarding_completed,
  up.first_name,
  up.last_name,
  up.phone_number,
  up.date_of_birth,
  up.gender_identity,
  up.nationality,
  up.current_city,
  up.languages_spoken,
  up.profile_photo_url,
  up.profile_completion_score,
  up.profile_data,
  uv.id_verified,
  uv.phone_verified,
  uv.email_verified,
  uv.kyc_status,
  uc.terms_accepted,
  uc.privacy_accepted,
  uc.marketing_opt_in,
  u.created_at,
  u.updated_at
FROM public.users u
LEFT JOIN public.user_profiles up ON u.id = up.user_id
LEFT JOIN public.user_verifications uv ON u.id = uv.user_id
LEFT JOIN public.user_consents uc ON u.id = uc.user_id;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Verify new tables
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('users', 'user_profiles', 'user_sessions', 'user_verifications', 'user_consents')
ORDER BY table_name;
