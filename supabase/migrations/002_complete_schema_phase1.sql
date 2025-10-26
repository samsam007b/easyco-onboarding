-- ============================================================================
-- PHASE 1 MIGRATION: Complete Schema with Typed Columns
-- Date: 2025-10-26
-- Description: Transform JSONB blob storage to properly typed, queryable schema
-- Impact: Enables matching algorithm, analytics, and data-driven features
-- ============================================================================

-- ============================================================================
-- STEP 1: ENHANCE users TABLE
-- ============================================================================

ALTER TABLE public.users
  -- Phone
  ADD COLUMN IF NOT EXISTS phone_number TEXT,
  ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,

  -- Account Status
  ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active'
    CHECK (account_status IN ('active', 'suspended', 'deleted', 'pending_verification')),

  -- Profile Completion
  ADD COLUMN IF NOT EXISTS onboarding_step TEXT,
  ADD COLUMN IF NOT EXISTS profile_completion_score INTEGER DEFAULT 0
    CHECK (profile_completion_score BETWEEN 0 AND 100),

  -- Display
  ADD COLUMN IF NOT EXISTS display_name TEXT,

  -- Activity
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,

  -- Flags
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_test_account BOOLEAN DEFAULT FALSE,

  -- GDPR
  ADD COLUMN IF NOT EXISTS gdpr_consent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS data_retention_until TIMESTAMPTZ,

  -- Attribution
  ADD COLUMN IF NOT EXISTS referral_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,

  -- Soft Delete
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- ============================================================================
-- STEP 2: TRANSFORM user_profiles TO TYPED COLUMNS
-- ============================================================================

-- Drop the old JSONB-only structure and rebuild with typed columns
-- NOTE: This is safe because we'll migrate data in STEP 6

ALTER TABLE public.user_profiles

  -- ==========================================================================
  -- BASIC INFORMATION (ALL USER TYPES)
  -- ==========================================================================
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS gender_identity TEXT
    CHECK (gender_identity IN ('male', 'female', 'non-binary', 'prefer-not-to-say', 'other')),
  ADD COLUMN IF NOT EXISTS nationality TEXT,
  ADD COLUMN IF NOT EXISTS languages_spoken TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS current_city TEXT,
  ADD COLUMN IF NOT EXISTS current_country TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS profile_photos TEXT[],

  -- ==========================================================================
  -- SEARCHER/RESIDENT FIELDS
  -- ==========================================================================

  -- Professional
  ADD COLUMN IF NOT EXISTS occupation_status TEXT
    CHECK (occupation_status IN ('student', 'employed', 'self-employed', 'unemployed', 'retired', 'other')),
  ADD COLUMN IF NOT EXISTS field_of_study_or_work TEXT,
  ADD COLUMN IF NOT EXISTS institution_or_company TEXT,
  ADD COLUMN IF NOT EXISTS monthly_income_bracket TEXT
    CHECK (monthly_income_bracket IN ('under-500', '500-1000', '1000-1500', '1500-2000', '2000-3000', '3000-5000', 'over-5000')),
  ADD COLUMN IF NOT EXISTS employment_type TEXT
    CHECK (employment_type IN ('full-time', 'part-time', 'freelance', 'contract', 'internship')),
  ADD COLUMN IF NOT EXISTS guarantor_available BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS guarantor_name TEXT,
  ADD COLUMN IF NOT EXISTS guarantor_phone TEXT,

  -- Daily Habits
  ADD COLUMN IF NOT EXISTS wake_up_time TEXT
    CHECK (wake_up_time IN ('early', 'moderate', 'late')),
  ADD COLUMN IF NOT EXISTS sleep_time TEXT
    CHECK (sleep_time IN ('early', 'moderate', 'late')),
  ADD COLUMN IF NOT EXISTS work_schedule TEXT
    CHECK (work_schedule IN ('traditional', 'flexible', 'remote', 'student', 'night-shift')),
  ADD COLUMN IF NOT EXISTS sports_frequency TEXT
    CHECK (sports_frequency IN ('daily', 'few-times-week', 'once-week', 'rarely', 'never')),
  ADD COLUMN IF NOT EXISTS is_smoker BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS drinks_alcohol TEXT
    CHECK (drinks_alcohol IN ('never', 'occasionally', 'socially', 'regularly')),
  ADD COLUMN IF NOT EXISTS diet_type TEXT
    CHECK (diet_type IN ('omnivore', 'vegetarian', 'vegan', 'pescatarian', 'halal', 'kosher', 'other')),

  -- Home Lifestyle
  ADD COLUMN IF NOT EXISTS cleanliness_preference TEXT
    CHECK (cleanliness_preference IN ('relaxed', 'moderate', 'tidy', 'spotless')),
  ADD COLUMN IF NOT EXISTS guest_frequency TEXT
    CHECK (guest_frequency IN ('never', 'rarely', 'sometimes', 'often')),
  ADD COLUMN IF NOT EXISTS music_habits TEXT
    CHECK (music_habits IN ('quiet', 'low-volume', 'moderate', 'loud')),
  ADD COLUMN IF NOT EXISTS has_pets BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS pet_type TEXT,
  ADD COLUMN IF NOT EXISTS cooking_frequency TEXT
    CHECK (cooking_frequency IN ('never', 'once-week', 'few-times', 'daily')),

  -- Personality
  ADD COLUMN IF NOT EXISTS introvert_extrovert_scale INTEGER
    CHECK (introvert_extrovert_scale BETWEEN 1 AND 10),
  ADD COLUMN IF NOT EXISTS sociability_level INTEGER
    CHECK (sociability_level BETWEEN 1 AND 10),
  ADD COLUMN IF NOT EXISTS openness_to_sharing TEXT
    CHECK (openness_to_sharing IN ('private', 'moderate', 'very-open')),
  ADD COLUMN IF NOT EXISTS communication_style TEXT
    CHECK (communication_style IN ('direct', 'diplomatic', 'casual', 'formal')),
  ADD COLUMN IF NOT EXISTS cultural_openness TEXT
    CHECK (cultural_openness IN ('prefer-similar', 'moderate', 'love-diversity')),
  ADD COLUMN IF NOT EXISTS conflict_tolerance TEXT
    CHECK (conflict_tolerance IN ('low', 'medium', 'high')),
  ADD COLUMN IF NOT EXISTS stress_management_style TEXT,
  ADD COLUMN IF NOT EXISTS values_priority TEXT[],
  ADD COLUMN IF NOT EXISTS interests TEXT[],
  ADD COLUMN IF NOT EXISTS hobbies TEXT[],

  -- Housing Preferences
  ADD COLUMN IF NOT EXISTS preferred_room_type TEXT
    CHECK (preferred_room_type IN ('private', 'shared', 'studio', 'entire-apartment')),
  ADD COLUMN IF NOT EXISTS budget_min INTEGER,
  ADD COLUMN IF NOT EXISTS budget_max INTEGER,
  ADD COLUMN IF NOT EXISTS preferred_location_city TEXT,
  ADD COLUMN IF NOT EXISTS preferred_districts TEXT[],
  ADD COLUMN IF NOT EXISTS preferred_move_in_date DATE,
  ADD COLUMN IF NOT EXISTS minimum_stay_months INTEGER,
  ADD COLUMN IF NOT EXISTS preferred_coliving_size TEXT
    CHECK (preferred_coliving_size IN ('small', 'medium', 'large', 'no-preference')),
  ADD COLUMN IF NOT EXISTS preferred_gender_mix TEXT
    CHECK (preferred_gender_mix IN ('male-only', 'female-only', 'mixed', 'no-preference')),
  ADD COLUMN IF NOT EXISTS roommate_age_min INTEGER
    CHECK (roommate_age_min BETWEEN 18 AND 100),
  ADD COLUMN IF NOT EXISTS roommate_age_max INTEGER
    CHECK (roommate_age_max BETWEEN 18 AND 100),
  ADD COLUMN IF NOT EXISTS shared_space_importance INTEGER
    CHECK (shared_space_importance BETWEEN 1 AND 10),
  ADD COLUMN IF NOT EXISTS pet_tolerance BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS smoking_tolerance BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS cleanliness_expectation TEXT
    CHECK (cleanliness_expectation IN ('relaxed', 'moderate', 'tidy', 'spotless')),
  ADD COLUMN IF NOT EXISTS quiet_hours_preference BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS shared_meals_interest BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS coworking_space_needed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS gym_access_needed BOOLEAN DEFAULT FALSE,

  -- Current Situation (Resident)
  ADD COLUMN IF NOT EXISTS current_address TEXT,
  ADD COLUMN IF NOT EXISTS current_landlord_name TEXT,
  ADD COLUMN IF NOT EXISTS current_lease_end_date DATE,
  ADD COLUMN IF NOT EXISTS reason_for_change TEXT,
  ADD COLUMN IF NOT EXISTS notice_period_days INTEGER,
  ADD COLUMN IF NOT EXISTS current_roommates_count INTEGER,

  -- ==========================================================================
  -- OWNER FIELDS
  -- ==========================================================================

  -- Owner Type
  ADD COLUMN IF NOT EXISTS landlord_type TEXT
    CHECK (landlord_type IN ('individual', 'agency', 'company')),
  ADD COLUMN IF NOT EXISTS company_name TEXT,
  ADD COLUMN IF NOT EXISTS business_registration_number TEXT,
  ADD COLUMN IF NOT EXISTS vat_number TEXT,
  ADD COLUMN IF NOT EXISTS tax_residency_country TEXT,

  -- Experience
  ADD COLUMN IF NOT EXISTS experience_years INTEGER,
  ADD COLUMN IF NOT EXISTS portfolio_size INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS management_type TEXT
    CHECK (management_type IN ('self-managed', 'agency', 'hybrid')),
  ADD COLUMN IF NOT EXISTS primary_motivation TEXT
    CHECK (primary_motivation IN ('income', 'community', 'investment', 'other')),
  ADD COLUMN IF NOT EXISTS availability_for_visits TEXT
    CHECK (availability_for_visits IN ('flexible', 'weekdays-only', 'weekends-only', 'by-appointment')),

  -- Banking
  ADD COLUMN IF NOT EXISTS iban TEXT,
  ADD COLUMN IF NOT EXISTS bic_swift TEXT,
  ADD COLUMN IF NOT EXISTS account_holder_name TEXT,
  ADD COLUMN IF NOT EXISTS billing_address TEXT,
  ADD COLUMN IF NOT EXISTS payment_frequency TEXT
    CHECK (payment_frequency IN ('monthly', 'quarterly', 'annual')),
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'EUR',

  -- Tenant Policies
  ADD COLUMN IF NOT EXISTS accepts_short_term_leases BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS minimum_lease_duration_months INTEGER DEFAULT 6,
  ADD COLUMN IF NOT EXISTS required_tenant_documents TEXT[],
  ADD COLUMN IF NOT EXISTS guarantor_required BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS minimum_income_ratio DECIMAL(3,1) DEFAULT 3.0,
  ADD COLUMN IF NOT EXISTS credit_score_check_required BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS deposit_amount_months DECIMAL(2,1) DEFAULT 1.0,
  ADD COLUMN IF NOT EXISTS pets_allowed_policy BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS maintenance_responsibility TEXT
    CHECK (maintenance_responsibility IN ('landlord', 'tenant', 'shared')),

  -- Owner Preferences
  ADD COLUMN IF NOT EXISTS tenant_selection_style TEXT
    CHECK (tenant_selection_style IN ('first-come', 'best-match', 'highest-offer')),
  ADD COLUMN IF NOT EXISTS preferred_tenant_types TEXT[],
  ADD COLUMN IF NOT EXISTS communication_preference TEXT
    CHECK (communication_preference IN ('email', 'phone', 'sms', 'whatsapp')),
  ADD COLUMN IF NOT EXISTS response_time_hours INTEGER,
  ADD COLUMN IF NOT EXISTS review_visibility_consent BOOLEAN DEFAULT TRUE,

  -- Insurance
  ADD COLUMN IF NOT EXISTS insurance_policy_number TEXT,
  ADD COLUMN IF NOT EXISTS insurance_provider TEXT,
  ADD COLUMN IF NOT EXISTS liability_coverage_amount DECIMAL(12,2),
  ADD COLUMN IF NOT EXISTS property_insurance_expiry DATE,

  -- ==========================================================================
  -- METADATA & ANALYTICS
  -- ==========================================================================
  ADD COLUMN IF NOT EXISTS profile_views_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS matches_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS messages_sent_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS messages_received_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS average_response_time_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS rating_average DECIMAL(3,2),
  ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0,

  -- ML/Algorithm
  ADD COLUMN IF NOT EXISTS living_style_cluster TEXT,
  ADD COLUMN IF NOT EXISTS compatibility_tags TEXT[],

  -- Profile Completion
  ADD COLUMN IF NOT EXISTS profile_completion_score INTEGER DEFAULT 0
    CHECK (profile_completion_score BETWEEN 0 AND 100);

-- Keep profile_data for backward compatibility and future extensions
-- It will now store only non-critical, flexible metadata

-- ============================================================================
-- STEP 3: CREATE user_verifications TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,

  -- Identity Verification
  id_verified BOOLEAN DEFAULT FALSE,
  id_document_type TEXT CHECK (id_document_type IN ('passport', 'national-id', 'drivers-license')),
  id_document_number TEXT,
  id_document_url TEXT,
  id_document_expiry DATE,
  id_verified_at TIMESTAMPTZ,
  id_verified_by UUID,

  -- Phone Verification
  phone_verified BOOLEAN DEFAULT FALSE,
  phone_verified_at TIMESTAMPTZ,
  phone_verification_code TEXT,
  phone_verification_attempts INTEGER DEFAULT 0,

  -- Email Verification
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMPTZ,

  -- Owner-Specific
  proof_of_ownership_url TEXT,
  proof_of_ownership_verified BOOLEAN DEFAULT FALSE,
  proof_of_ownership_verified_at TIMESTAMPTZ,

  insurance_certificate_url TEXT,
  insurance_verified BOOLEAN DEFAULT FALSE,
  insurance_verified_at TIMESTAMPTZ,

  business_registration_url TEXT,
  business_verified BOOLEAN DEFAULT FALSE,
  business_verified_at TIMESTAMPTZ,

  -- KYC
  kyc_status TEXT DEFAULT 'pending'
    CHECK (kyc_status IN ('pending', 'in-review', 'verified', 'rejected', 'expired')),
  kyc_completed_at TIMESTAMPTZ,
  kyc_rejection_reason TEXT,
  kyc_notes TEXT,

  -- AML
  aml_check_status TEXT DEFAULT 'not-required'
    CHECK (aml_check_status IN ('not-required', 'pending', 'passed', 'failed')),
  aml_check_date TIMESTAMPTZ,
  aml_provider TEXT,
  aml_reference_id TEXT,

  -- Metadata
  verification_ip_address INET,
  verification_user_agent TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 4: CREATE user_consents TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,

  -- Required Consents
  terms_accepted BOOLEAN DEFAULT FALSE NOT NULL,
  terms_version TEXT,
  terms_accepted_at TIMESTAMPTZ,
  terms_accepted_ip INET,

  privacy_accepted BOOLEAN DEFAULT FALSE NOT NULL,
  privacy_version TEXT,
  privacy_accepted_at TIMESTAMPTZ,
  privacy_accepted_ip INET,

  -- Data Processing
  data_processing_consent BOOLEAN DEFAULT FALSE NOT NULL,
  data_processing_at TIMESTAMPTZ,

  -- Matching
  matching_algorithm_consent BOOLEAN DEFAULT FALSE,
  matching_algorithm_at TIMESTAMPTZ,

  -- Marketing
  marketing_email BOOLEAN DEFAULT FALSE,
  marketing_sms BOOLEAN DEFAULT FALSE,
  marketing_push BOOLEAN DEFAULT FALSE,
  marketing_consent_at TIMESTAMPTZ,

  -- Profile Visibility
  profile_visibility TEXT DEFAULT 'public'
    CHECK (profile_visibility IN ('public', 'members-only', 'hidden')),
  show_in_search BOOLEAN DEFAULT TRUE,
  show_last_active BOOLEAN DEFAULT TRUE,

  -- GDPR
  gdpr_data_retention_consent BOOLEAN DEFAULT FALSE,
  gdpr_data_retention_at TIMESTAMPTZ,
  data_deletion_requested BOOLEAN DEFAULT FALSE,
  data_deletion_requested_at TIMESTAMPTZ,
  data_deletion_scheduled_for DATE,

  -- Cookies
  cookies_functional BOOLEAN DEFAULT TRUE,
  cookies_analytics BOOLEAN DEFAULT FALSE,
  cookies_marketing BOOLEAN DEFAULT FALSE,
  cookies_consent_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 5: CREATE INDEXES (Performance Critical)
-- ============================================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_user_type_status ON public.users(user_type, account_status);
CREATE INDEX IF NOT EXISTS idx_users_completion_score ON public.users(profile_completion_score DESC);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON public.users(last_active_at DESC) WHERE account_status = 'active';
CREATE INDEX IF NOT EXISTS idx_users_verified ON public.users(is_verified) WHERE is_verified = TRUE;
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone_number) WHERE phone_number IS NOT NULL;

-- User profiles indexes (CRITICAL for matching)
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON public.user_profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_city ON public.user_profiles(current_city) WHERE current_city IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_preferred_city ON public.user_profiles(preferred_location_city) WHERE preferred_location_city IS NOT NULL;

-- Budget range (for searcher matching)
CREATE INDEX IF NOT EXISTS idx_user_profiles_budget_range ON public.user_profiles(budget_min, budget_max)
  WHERE user_type IN ('searcher', 'resident') AND budget_min IS NOT NULL;

-- Move-in date (for searcher matching)
CREATE INDEX IF NOT EXISTS idx_user_profiles_move_in_date ON public.user_profiles(preferred_move_in_date)
  WHERE user_type = 'searcher' AND preferred_move_in_date IS NOT NULL;

-- Owner-specific
CREATE INDEX IF NOT EXISTS idx_user_profiles_landlord_type ON public.user_profiles(landlord_type)
  WHERE user_type = 'owner';
CREATE INDEX IF NOT EXISTS idx_user_profiles_portfolio ON public.user_profiles(portfolio_size DESC)
  WHERE user_type = 'owner';

-- Lifestyle matching (composite indexes for algorithm)
CREATE INDEX IF NOT EXISTS idx_user_profiles_lifestyle ON public.user_profiles(
  cleanliness_preference,
  is_smoker,
  has_pets,
  introvert_extrovert_scale
) WHERE user_type IN ('searcher', 'resident');

-- Completion scores
CREATE INDEX IF NOT EXISTS idx_user_profiles_completion_score ON public.user_profiles(profile_completion_score DESC);

-- GIN indexes for arrays
CREATE INDEX IF NOT EXISTS idx_user_profiles_languages_gin ON public.user_profiles USING gin(languages_spoken);
CREATE INDEX IF NOT EXISTS idx_user_profiles_interests_gin ON public.user_profiles USING gin(interests);
CREATE INDEX IF NOT EXISTS idx_user_profiles_hobbies_gin ON public.user_profiles USING gin(hobbies);
CREATE INDEX IF NOT EXISTS idx_user_profiles_values_gin ON public.user_profiles USING gin(values_priority);

-- Verifications indexes
CREATE INDEX IF NOT EXISTS idx_user_verifications_kyc_status ON public.user_verifications(kyc_status);
CREATE INDEX IF NOT EXISTS idx_user_verifications_verified ON public.user_verifications(id_verified, phone_verified, email_verified);

-- Consents indexes
CREATE INDEX IF NOT EXISTS idx_user_consents_terms_privacy ON public.user_consents(terms_accepted, privacy_accepted);
CREATE INDEX IF NOT EXISTS idx_user_consents_marketing ON public.user_consents(marketing_email, marketing_sms);

-- ============================================================================
-- STEP 6: ENABLE ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE public.user_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

-- Verifications policies
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

-- Consents policies
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
-- STEP 7: CREATE/UPDATE TRIGGERS
-- ============================================================================

-- Update verifications updated_at
DROP TRIGGER IF EXISTS set_user_verifications_updated_at ON public.user_verifications;
CREATE TRIGGER set_user_verifications_updated_at
  BEFORE UPDATE ON public.user_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Update consents updated_at
DROP TRIGGER IF EXISTS set_user_consents_updated_at ON public.user_consents;
CREATE TRIGGER set_user_consents_updated_at
  BEFORE UPDATE ON public.user_consents
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- STEP 8: CREATE HELPER FUNCTIONS
-- ============================================================================

-- Calculate profile completion score
CREATE OR REPLACE FUNCTION public.calculate_profile_completion(profile_id UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  profile RECORD;
  critical_fields_filled INTEGER := 0;
  total_critical_fields INTEGER := 30; -- Adjust based on user type
BEGIN
  SELECT * INTO profile FROM public.user_profiles WHERE id = profile_id;

  IF profile IS NULL THEN
    RETURN 0;
  END IF;

  -- Basic fields (20 points)
  IF profile.first_name IS NOT NULL THEN critical_fields_filled := critical_fields_filled + 1; END IF;
  IF profile.last_name IS NOT NULL THEN critical_fields_filled := critical_fields_filled + 1; END IF;
  IF profile.date_of_birth IS NOT NULL THEN critical_fields_filled := critical_fields_filled + 1; END IF;
  IF profile.nationality IS NOT NULL THEN critical_fields_filled := critical_fields_filled + 1; END IF;
  IF profile.current_city IS NOT NULL THEN critical_fields_filled := critical_fields_filled + 1; END IF;
  IF profile.profile_photo_url IS NOT NULL THEN critical_fields_filled := critical_fields_filled + 1; END IF;

  -- Type-specific fields
  IF profile.user_type IN ('searcher', 'resident') THEN
    IF profile.budget_min IS NOT NULL THEN critical_fields_filled := critical_fields_filled + 1; END IF;
    IF profile.budget_max IS NOT NULL THEN critical_fields_filled := critical_fields_filled + 1; END IF;
    IF profile.preferred_location_city IS NOT NULL THEN critical_fields_filled := critical_fields_filled + 1; END IF;
    IF profile.cleanliness_preference IS NOT NULL THEN critical_fields_filled := critical_fields_filled + 1; END IF;
  ELSIF profile.user_type = 'owner' THEN
    IF profile.landlord_type IS NOT NULL THEN critical_fields_filled := critical_fields_filled + 1; END IF;
    IF profile.experience_years IS NOT NULL THEN critical_fields_filled := critical_fields_filled + 1; END IF;
    IF profile.iban IS NOT NULL THEN critical_fields_filled := critical_fields_filled + 1; END IF;
  END IF;

  -- Calculate percentage
  score := LEAST(100, (critical_fields_filled::DECIMAL / total_critical_fields * 100)::INTEGER);

  RETURN score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-update profile completion on profile changes
CREATE OR REPLACE FUNCTION public.update_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.profile_completion_score := public.calculate_profile_completion(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profile_completion_trigger ON public.user_profiles;
CREATE TRIGGER update_profile_completion_trigger
  BEFORE INSERT OR UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profile_completion();

-- Sync user completion score
CREATE OR REPLACE FUNCTION public.sync_user_completion_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET profile_completion_score = NEW.profile_completion_score
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_user_completion_trigger ON public.user_profiles;
CREATE TRIGGER sync_user_completion_trigger
  AFTER INSERT OR UPDATE OF profile_completion_score ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_completion_score();

-- ============================================================================
-- STEP 9: CREATE ANALYTICS VIEWS
-- ============================================================================

-- Complete user profile view (for application use)
CREATE OR REPLACE VIEW public.v_complete_user_profiles AS
SELECT
  u.id,
  u.email,
  u.user_type,
  u.account_status,
  u.onboarding_completed,
  u.profile_completion_score as user_completion_score,
  u.is_verified,
  u.is_premium,
  u.created_at as user_created_at,

  -- Profile data
  up.*,

  -- Verification status
  uv.kyc_status,
  uv.id_verified,
  uv.phone_verified,
  uv.email_verified,

  -- Consent status
  uc.terms_accepted,
  uc.privacy_accepted,
  uc.marketing_email,
  uc.profile_visibility

FROM public.users u
LEFT JOIN public.user_profiles up ON u.id = up.user_id
LEFT JOIN public.user_verifications uv ON u.id = uv.user_id
LEFT JOIN public.user_consents uc ON u.id = uc.user_id;

-- Platform metrics view
CREATE OR REPLACE VIEW public.v_platform_metrics AS
SELECT
  COUNT(DISTINCT u.id) FILTER (WHERE u.user_type = 'searcher' AND u.account_status = 'active') as active_searchers,
  COUNT(DISTINCT u.id) FILTER (WHERE u.user_type = 'owner' AND u.account_status = 'active') as active_owners,
  COUNT(DISTINCT u.id) FILTER (WHERE u.user_type = 'resident' AND u.account_status = 'active') as active_residents,
  COUNT(DISTINCT u.id) FILTER (WHERE u.onboarding_completed = TRUE) as completed_onboarding,
  AVG(u.profile_completion_score) FILTER (WHERE u.profile_completion_score > 0) as avg_completion_score,
  COUNT(DISTINCT uv.user_id) FILTER (WHERE uv.kyc_status = 'verified') as verified_users
FROM public.users u
LEFT JOIN public.user_verifications uv ON u.id = uv.user_id;

-- ============================================================================
-- STEP 10: DATA MIGRATION (If existing data)
-- ============================================================================

-- Migrate existing profile_data JSONB to typed columns
-- This runs only if there's existing data

DO $$
DECLARE
  profile_record RECORD;
BEGIN
  FOR profile_record IN
    SELECT id, user_id, profile_data FROM public.user_profiles
    WHERE profile_data IS NOT NULL AND profile_data != '{}'::jsonb
  LOOP
    -- Update typed columns from JSONB (adjust field names as needed)
    UPDATE public.user_profiles SET
      first_name = COALESCE(first_name, profile_data->>'firstName'),
      last_name = COALESCE(last_name, profile_data->>'lastName'),
      date_of_birth = COALESCE(date_of_birth, (profile_data->>'dateOfBirth')::date),
      nationality = COALESCE(nationality, profile_data->>'nationality'),
      budget_min = COALESCE(budget_min, (profile_data->>'budgetMin')::integer),
      budget_max = COALESCE(budget_max, (profile_data->>'budgetMax')::integer),
      is_smoker = COALESCE(is_smoker, (profile_data->>'isSmoker')::boolean),
      cleanliness_preference = COALESCE(cleanliness_preference, profile_data->>'cleanliness')
      -- Add more fields as needed
    WHERE id = profile_record.id;
  END LOOP;
END $$;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Verification query
SELECT
  'Migration Phase 1 Complete' as status,
  (SELECT COUNT(*) FROM public.users) as total_users,
  (SELECT COUNT(*) FROM public.user_profiles) as total_profiles,
  (SELECT COUNT(*) FROM public.user_verifications) as total_verifications,
  (SELECT COUNT(*) FROM public.user_consents) as total_consents,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'user_profiles') as profile_columns;
