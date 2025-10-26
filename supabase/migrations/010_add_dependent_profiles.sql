-- ============================================================================
-- MIGRATION 010: Add Dependent Profiles Support
-- Date: 2025-10-26
-- Description: Allows Searchers to create profiles for dependents (children, family, friends)
-- ============================================================================

-- ============================================================================
-- 1. CREATE DEPENDENT_PROFILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.dependent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Link to parent user (the person who created this dependent profile)
  parent_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,

  -- Profile metadata
  profile_name TEXT NOT NULL, -- e.g., "Profile for Emma", "Profile for my son"
  relationship TEXT CHECK (relationship IN ('child', 'family_member', 'friend', 'other')) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE, -- Allow users to disable without deleting

  -- Core profile data (same structure as user_profiles for Searcher)
  -- Basic Information
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  gender_identity TEXT,
  nationality TEXT,
  phone_number TEXT,
  languages_spoken TEXT[],

  -- Professional Information
  occupation_status TEXT,
  field_of_study_or_work TEXT,
  institution_or_company TEXT,
  monthly_income_bracket TEXT,
  employment_type TEXT,

  -- Location & Budget
  current_city TEXT,
  preferred_cities TEXT[],
  budget_min INTEGER,
  budget_max INTEGER,
  move_in_date DATE,
  preferred_accommodation TEXT,

  -- Lifestyle Preferences
  cleanliness_preference INTEGER CHECK (cleanliness_preference >= 1 AND cleanliness_preference <= 10),
  is_smoker BOOLEAN DEFAULT FALSE,
  has_pets BOOLEAN DEFAULT FALSE,
  pet_types TEXT[],
  wake_up_time TEXT CHECK (wake_up_time IN ('early', 'average', 'late')),
  sleep_time TEXT CHECK (sleep_time IN ('before_23h', '23h_01h', 'after_01h')),

  -- Social & Personality
  introvert_extrovert_scale INTEGER CHECK (introvert_extrovert_scale >= 1 AND introvert_extrovert_scale <= 5),
  sociability_level TEXT CHECK (sociability_level IN ('low', 'medium', 'high')),
  shared_meals_interest BOOLEAN DEFAULT FALSE,
  preferred_interaction_type TEXT CHECK (preferred_interaction_type IN ('cozy_evenings', 'independent_living', 'community_events')),
  home_activity_level TEXT CHECK (home_activity_level IN ('quiet', 'social', 'very_active')),

  -- Profile Text
  bio TEXT,
  about_me TEXT,
  looking_for TEXT,

  -- Enhanced Profile
  core_values TEXT[],
  important_qualities TEXT[],
  deal_breakers TEXT[],

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. CREATE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_dependent_profiles_parent_user_id ON public.dependent_profiles(parent_user_id);
CREATE INDEX IF NOT EXISTS idx_dependent_profiles_is_active ON public.dependent_profiles(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_dependent_profiles_relationship ON public.dependent_profiles(relationship);
CREATE INDEX IF NOT EXISTS idx_dependent_profiles_budget ON public.dependent_profiles(budget_min, budget_max) WHERE budget_min IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_dependent_profiles_preferred_cities ON public.dependent_profiles USING GIN (preferred_cities);
CREATE INDEX IF NOT EXISTS idx_dependent_profiles_languages ON public.dependent_profiles USING GIN (languages_spoken);
CREATE INDEX IF NOT EXISTS idx_dependent_profiles_move_in_date ON public.dependent_profiles(move_in_date) WHERE move_in_date IS NOT NULL;

-- ============================================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.dependent_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. CREATE RLS POLICIES
-- ============================================================================

-- Users can view their own dependent profiles
DROP POLICY IF EXISTS "Users can view own dependent profiles" ON public.dependent_profiles;
CREATE POLICY "Users can view own dependent profiles"
  ON public.dependent_profiles FOR SELECT
  USING (auth.uid() = parent_user_id);

-- Users can insert their own dependent profiles
DROP POLICY IF EXISTS "Users can insert own dependent profiles" ON public.dependent_profiles;
CREATE POLICY "Users can insert own dependent profiles"
  ON public.dependent_profiles FOR INSERT
  WITH CHECK (auth.uid() = parent_user_id);

-- Users can update their own dependent profiles
DROP POLICY IF EXISTS "Users can update own dependent profiles" ON public.dependent_profiles;
CREATE POLICY "Users can update own dependent profiles"
  ON public.dependent_profiles FOR UPDATE
  USING (auth.uid() = parent_user_id);

-- Users can delete their own dependent profiles
DROP POLICY IF EXISTS "Users can delete own dependent profiles" ON public.dependent_profiles;
CREATE POLICY "Users can delete own dependent profiles"
  ON public.dependent_profiles FOR DELETE
  USING (auth.uid() = parent_user_id);

-- ============================================================================
-- 5. CREATE TRIGGERS
-- ============================================================================

-- Trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS set_dependent_profiles_updated_at ON public.dependent_profiles;
CREATE TRIGGER set_dependent_profiles_updated_at
  BEFORE UPDATE ON public.dependent_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 6. CREATE HELPER FUNCTIONS
-- ============================================================================

-- Function to get all profiles for a user (own profile + dependent profiles)
CREATE OR REPLACE FUNCTION public.get_all_user_profiles(user_id_param UUID)
RETURNS TABLE (
  profile_id UUID,
  profile_type TEXT, -- 'own' or 'dependent'
  profile_name TEXT,
  relationship TEXT,
  first_name TEXT,
  last_name TEXT,
  budget_min INTEGER,
  budget_max INTEGER,
  current_city TEXT,
  move_in_date DATE,
  is_active BOOLEAN
) AS $$
BEGIN
  -- Return own profile first
  RETURN QUERY
  SELECT
    up.id as profile_id,
    'own'::TEXT as profile_type,
    'My Profile'::TEXT as profile_name,
    NULL::TEXT as relationship,
    up.first_name,
    up.last_name,
    up.budget_min,
    up.budget_max,
    up.current_city,
    up.move_in_date,
    true as is_active
  FROM public.user_profiles up
  WHERE up.user_id = user_id_param;

  -- Then return dependent profiles
  RETURN QUERY
  SELECT
    dp.id as profile_id,
    'dependent'::TEXT as profile_type,
    dp.profile_name,
    dp.relationship,
    dp.first_name,
    dp.last_name,
    dp.budget_min,
    dp.budget_max,
    dp.current_city,
    dp.move_in_date,
    dp.is_active
  FROM public.dependent_profiles dp
  WHERE dp.parent_user_id = user_id_param
    AND dp.is_active = true
  ORDER BY dp.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to count active dependent profiles for a user
CREATE OR REPLACE FUNCTION public.count_dependent_profiles(user_id_param UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.dependent_profiles
    WHERE parent_user_id = user_id_param
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. ADD COMMENTS
-- ============================================================================

COMMENT ON TABLE public.dependent_profiles IS 'Stores profiles created by Searchers for dependents (children, family, friends)';
COMMENT ON COLUMN public.dependent_profiles.parent_user_id IS 'The user who created this dependent profile';
COMMENT ON COLUMN public.dependent_profiles.profile_name IS 'User-friendly name for the profile (e.g., "Profile for Emma")';
COMMENT ON COLUMN public.dependent_profiles.relationship IS 'Relationship to the parent user (child/family_member/friend/other)';
COMMENT ON COLUMN public.dependent_profiles.is_active IS 'Whether this profile is active (false = soft delete)';

-- ============================================================================
-- VERIFICATION: Check table and functions were created
-- ============================================================================

-- Check table exists
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'dependent_profiles') as column_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'dependent_profiles';

-- Check functions exist
SELECT
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('get_all_user_profiles', 'count_dependent_profiles')
ORDER BY routine_name;

-- Check RLS is enabled
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'dependent_profiles';
