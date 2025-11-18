-- Migration: Clean Profile Structure
-- Description: Separates base user profiles from role-specific data
-- Date: 2025-11-17

-- ============================================================================
-- STEP 1: Create new clean tables
-- ============================================================================

-- Base profiles table (common info for all users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone_number TEXT,
    profile_photo_url TEXT,
    date_of_birth DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Resident-specific profiles
CREATE TABLE IF NOT EXISTS public.resident_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

    -- Occupation
    occupation_status TEXT,
    field_of_study_or_work TEXT,
    institution_or_company TEXT,
    monthly_income_bracket TEXT,

    -- Financial
    budget_min INTEGER,
    budget_max INTEGER,
    guarantor_available BOOLEAN DEFAULT FALSE,

    -- Lifestyle
    wake_up_time TEXT,
    sleep_time TEXT,
    is_smoker BOOLEAN DEFAULT FALSE,
    drinks_alcohol TEXT,
    cleanliness_preference TEXT,
    guest_frequency TEXT,
    has_pets BOOLEAN DEFAULT FALSE,
    pet_type TEXT,

    -- Personality
    introvert_extrovert_scale INTEGER CHECK (introvert_extrovert_scale BETWEEN 1 AND 10),
    communication_style TEXT,

    -- Preferences
    preferred_coliving_size TEXT,
    preferred_gender_mix TEXT,
    roommate_age_min INTEGER,
    roommate_age_max INTEGER,
    pet_tolerance BOOLEAN DEFAULT TRUE,
    smoking_tolerance BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(profile_id)
);

-- Owner-specific profiles
CREATE TABLE IF NOT EXISTS public.owner_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

    -- Business info
    owner_type TEXT,
    company_name TEXT,
    business_registration_number TEXT,
    vat_number TEXT,

    -- Banking
    iban TEXT,
    bic_swift TEXT,
    account_holder_name TEXT,

    -- Policies
    accepts_short_term_leases BOOLEAN DEFAULT TRUE,
    minimum_lease_duration_months INTEGER DEFAULT 6,
    pets_allowed_policy BOOLEAN DEFAULT FALSE,
    smoking_allowed BOOLEAN DEFAULT FALSE,
    guarantor_required BOOLEAN DEFAULT FALSE,
    minimum_income_ratio INTEGER DEFAULT 3,
    deposit_amount_months INTEGER DEFAULT 1,

    -- Portfolio
    portfolio_size INTEGER DEFAULT 0,
    experience_years INTEGER,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(profile_id)
);

-- Searcher-specific profiles
CREATE TABLE IF NOT EXISTS public.searcher_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

    -- Search criteria
    budget_min INTEGER,
    budget_max INTEGER,
    preferred_location_city TEXT,
    preferred_move_in_date DATE,
    minimum_stay_months INTEGER,

    -- Room preferences
    preferred_room_type TEXT,
    preferred_coliving_size TEXT,
    preferred_gender_mix TEXT,

    -- Requirements
    coworking_space_needed BOOLEAN DEFAULT FALSE,
    gym_access_needed BOOLEAN DEFAULT FALSE,
    pet_tolerance BOOLEAN DEFAULT TRUE,
    smoking_tolerance BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(profile_id)
);

-- ============================================================================
-- STEP 2: Create indexes for performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

CREATE INDEX IF NOT EXISTS idx_resident_profiles_profile_id ON public.resident_profiles(profile_id);
CREATE INDEX IF NOT EXISTS idx_owner_profiles_profile_id ON public.owner_profiles(profile_id);
CREATE INDEX IF NOT EXISTS idx_searcher_profiles_profile_id ON public.searcher_profiles(profile_id);

-- ============================================================================
-- STEP 3: Create updated_at triggers
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resident_profiles_updated_at ON public.resident_profiles;
CREATE TRIGGER update_resident_profiles_updated_at BEFORE UPDATE ON public.resident_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_owner_profiles_updated_at ON public.owner_profiles;
CREATE TRIGGER update_owner_profiles_updated_at BEFORE UPDATE ON public.owner_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_searcher_profiles_updated_at ON public.searcher_profiles;
CREATE TRIGGER update_searcher_profiles_updated_at BEFORE UPDATE ON public.searcher_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 4: Migrate existing data from user_profiles
-- ============================================================================

-- Insert base profiles from user_profiles
INSERT INTO public.profiles (id, user_id, email, first_name, last_name, phone_number, profile_photo_url, date_of_birth, created_at, updated_at)
SELECT
    up.id,
    up.user_id,
    au.email, -- Get email from auth.users
    up.first_name,
    up.last_name,
    up.phone_number,
    up.profile_photo_url,
    up.date_of_birth,
    up.created_at,
    up.updated_at
FROM public.user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
ON CONFLICT (user_id) DO NOTHING;

-- Migrate residents (where user_type = 'resident')
INSERT INTO public.resident_profiles (
    profile_id,
    occupation_status,
    field_of_study_or_work,
    institution_or_company,
    monthly_income_bracket,
    budget_min,
    budget_max,
    guarantor_available,
    wake_up_time,
    sleep_time,
    is_smoker,
    drinks_alcohol,
    cleanliness_preference,
    guest_frequency,
    has_pets,
    pet_type,
    introvert_extrovert_scale,
    communication_style,
    preferred_coliving_size,
    preferred_gender_mix,
    roommate_age_min,
    roommate_age_max,
    pet_tolerance,
    smoking_tolerance,
    created_at,
    updated_at
)
SELECT
    up.id, -- profile_id references profiles.id
    up.occupation_status,
    up.field_of_study_or_work,
    up.institution_or_company,
    up.monthly_income_bracket,
    up.budget_min,
    up.budget_max,
    up.guarantor_available,
    up.wake_up_time,
    up.sleep_time,
    up.is_smoker,
    up.drinks_alcohol,
    up.cleanliness_preference,
    up.guest_frequency,
    up.has_pets,
    up.pet_type,
    up.introvert_extrovert_scale,
    up.communication_style,
    up.preferred_coliving_size,
    up.preferred_gender_mix,
    up.roommate_age_min,
    up.roommate_age_max,
    up.pet_tolerance,
    up.smoking_tolerance,
    up.created_at,
    up.updated_at
FROM public.user_profiles up
WHERE up.user_type = 'resident'
ON CONFLICT (profile_id) DO NOTHING;

-- Migrate owners (where user_type = 'owner')
INSERT INTO public.owner_profiles (
    profile_id,
    owner_type,
    company_name,
    business_registration_number,
    vat_number,
    iban,
    bic_swift,
    account_holder_name,
    accepts_short_term_leases,
    minimum_lease_duration_months,
    pets_allowed_policy,
    smoking_allowed,
    guarantor_required,
    minimum_income_ratio,
    deposit_amount_months,
    portfolio_size,
    experience_years,
    created_at,
    updated_at
)
SELECT
    up.id,
    up.owner_type,
    up.company_name,
    up.business_registration_number,
    up.vat_number,
    up.iban,
    up.swift_bic, -- Note: column name might be different
    up.account_holder_name,
    up.accepts_short_term_leases,
    up.minimum_lease_duration_months,
    up.pets_allowed_policy,
    up.smoking_allowed,
    up.guarantor_required,
    up.minimum_income_ratio,
    up.deposit_amount_months,
    up.portfolio_size,
    up.experience_years,
    up.created_at,
    up.updated_at
FROM public.user_profiles up
WHERE up.user_type = 'owner'
ON CONFLICT (profile_id) DO NOTHING;

-- Migrate searchers (where user_type = 'searcher')
INSERT INTO public.searcher_profiles (
    profile_id,
    budget_min,
    budget_max,
    preferred_location_city,
    preferred_move_in_date,
    minimum_stay_months,
    preferred_room_type,
    preferred_coliving_size,
    preferred_gender_mix,
    coworking_space_needed,
    gym_access_needed,
    pet_tolerance,
    smoking_tolerance,
    created_at,
    updated_at
)
SELECT
    up.id,
    up.budget_min,
    up.budget_max,
    up.preferred_location_city,
    up.preferred_move_in_date::DATE,
    up.minimum_stay_months,
    up.preferred_room_type,
    up.preferred_coliving_size,
    up.preferred_gender_mix,
    up.coworking_space_needed,
    up.gym_access_needed,
    up.pet_tolerance,
    up.smoking_tolerance,
    up.created_at,
    up.updated_at
FROM public.user_profiles up
WHERE up.user_type = 'searcher'
ON CONFLICT (profile_id) DO NOTHING;

-- ============================================================================
-- STEP 5: Enable Row Level Security (RLS)
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resident_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.searcher_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 6: Create RLS policies
-- ============================================================================

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Resident profiles policies
DROP POLICY IF EXISTS "Users can view their own resident profile" ON public.resident_profiles;
CREATE POLICY "Users can view their own resident profile" ON public.resident_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = resident_profiles.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update their own resident profile" ON public.resident_profiles;
CREATE POLICY "Users can update their own resident profile" ON public.resident_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = resident_profiles.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert their own resident profile" ON public.resident_profiles;
CREATE POLICY "Users can insert their own resident profile" ON public.resident_profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = resident_profiles.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

-- Owner profiles policies (same pattern)
DROP POLICY IF EXISTS "Users can view their own owner profile" ON public.owner_profiles;
CREATE POLICY "Users can view their own owner profile" ON public.owner_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = owner_profiles.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update their own owner profile" ON public.owner_profiles;
CREATE POLICY "Users can update their own owner profile" ON public.owner_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = owner_profiles.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert their own owner profile" ON public.owner_profiles;
CREATE POLICY "Users can insert their own owner profile" ON public.owner_profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = owner_profiles.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

-- Searcher profiles policies (same pattern)
DROP POLICY IF EXISTS "Users can view their own searcher profile" ON public.searcher_profiles;
CREATE POLICY "Users can view their own searcher profile" ON public.searcher_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = searcher_profiles.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update their own searcher profile" ON public.searcher_profiles;
CREATE POLICY "Users can update their own searcher profile" ON public.searcher_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = searcher_profiles.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert their own searcher profile" ON public.searcher_profiles;
CREATE POLICY "Users can insert their own searcher profile" ON public.searcher_profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = searcher_profiles.profile_id
            AND profiles.user_id = auth.uid()
        )
    );

-- ============================================================================
-- STEP 7: Create helper view for easy querying
-- ============================================================================

CREATE OR REPLACE VIEW public.user_profiles_with_roles AS
SELECT
    p.id,
    p.user_id,
    p.email,
    p.first_name,
    p.last_name,
    p.phone_number,
    p.profile_photo_url,
    p.date_of_birth,
    p.created_at,
    p.updated_at,
    CASE
        WHEN rp.profile_id IS NOT NULL THEN 'resident'
        WHEN op.profile_id IS NOT NULL THEN 'owner'
        WHEN sp.profile_id IS NOT NULL THEN 'searcher'
        ELSE NULL
    END AS active_role,
    -- Role-specific data as JSONB
    CASE WHEN rp.profile_id IS NOT NULL THEN row_to_json(rp)::JSONB ELSE NULL END AS resident_data,
    CASE WHEN op.profile_id IS NOT NULL THEN row_to_json(op)::JSONB ELSE NULL END AS owner_data,
    CASE WHEN sp.profile_id IS NOT NULL THEN row_to_json(sp)::JSONB ELSE NULL END AS searcher_data
FROM public.profiles p
LEFT JOIN public.resident_profiles rp ON p.id = rp.profile_id
LEFT JOIN public.owner_profiles op ON p.id = op.profile_id
LEFT JOIN public.searcher_profiles sp ON p.id = sp.profile_id;

-- ============================================================================
-- Notes:
-- ============================================================================
--
-- After running this migration:
-- 1. The old user_profiles table is NOT dropped (for safety)
-- 2. You can manually verify data migration
-- 3. Update your application code to use the new tables
-- 4. Once confirmed working, you can drop user_profiles table
--
-- To drop user_profiles later:
-- DROP TABLE IF EXISTS public.user_profiles CASCADE;
--
-- ============================================================================
