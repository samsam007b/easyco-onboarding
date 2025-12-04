-- ============================================================================
-- USER MATCHING PROFILES TABLE
-- ============================================================================
-- This table stores quick onboarding data for matching algorithm
-- Used by: Onboarding QUICK flow
-- Read by: Property matching algorithm in BrowseContent
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_matching_profiles (
  -- Primary key
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic info
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'non-binary', 'prefer-not-to-say')),

  -- Budget & Location (REQUIRED for matching)
  min_budget INTEGER,
  max_budget INTEGER,
  preferred_city TEXT,
  preferred_neighborhoods TEXT[],

  -- Room preferences
  preferred_room_type TEXT,
  min_bedrooms INTEGER,
  furnished_required BOOLEAN,

  -- Lifestyle preferences
  is_smoker BOOLEAN,
  has_pets BOOLEAN,
  cleanliness_level INTEGER CHECK (cleanliness_level >= 1 AND cleanliness_level <= 10),
  social_energy INTEGER CHECK (social_energy >= 1 AND social_energy <= 10),

  -- Compatibility factors
  wake_up_time TEXT,
  sleep_time TEXT,
  smoking_tolerance TEXT CHECK (smoking_tolerance IN ('no', 'outside-only', 'yes')),
  pets_tolerance TEXT CHECK (pets_tolerance IN ('no', 'small-pets', 'all-pets')),

  -- Amenities
  required_amenities TEXT[],
  preferred_amenities TEXT[],

  -- Values
  core_values TEXT[],

  -- Availability
  desired_move_in_date DATE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_matching_profiles_budget
  ON user_matching_profiles(min_budget, max_budget);

CREATE INDEX IF NOT EXISTS idx_user_matching_profiles_city
  ON user_matching_profiles(preferred_city);

CREATE INDEX IF NOT EXISTS idx_user_matching_profiles_move_in
  ON user_matching_profiles(desired_move_in_date);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE user_matching_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own matching profile"
  ON user_matching_profiles
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own profile
CREATE POLICY "Users can insert own matching profile"
  ON user_matching_profiles
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own matching profile"
  ON user_matching_profiles
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own profile
CREATE POLICY "Users can delete own matching profile"
  ON user_matching_profiles
  FOR DELETE
  USING (user_id = auth.uid());

-- Service role can read all profiles (for matching algorithm)
CREATE POLICY "Service role can read all profiles"
  ON user_matching_profiles
  FOR SELECT
  TO service_role
  USING (true);

-- ============================================================================
-- TRIGGER: Update timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_user_matching_profiles_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_matching_profiles_timestamp
  BEFORE UPDATE ON user_matching_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_matching_profiles_timestamp();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE user_matching_profiles IS
  'Stores quick onboarding data for property matching algorithm. Used by QUICK onboarding flow.';

COMMENT ON COLUMN user_matching_profiles.min_budget IS
  'Minimum monthly rent budget in EUR';

COMMENT ON COLUMN user_matching_profiles.max_budget IS
  'Maximum monthly rent budget in EUR';

COMMENT ON COLUMN user_matching_profiles.preferred_city IS
  'Primary city preference for property search';

COMMENT ON COLUMN user_matching_profiles.cleanliness_level IS
  'Cleanliness preference on scale of 1-10';

COMMENT ON COLUMN user_matching_profiles.social_energy IS
  'Social energy level on scale of 1-10';
