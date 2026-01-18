-- ============================================================================
-- CREATE RESIDENT MATCHING SYSTEM
-- ============================================================================
-- Purpose: Match residents based on compatibility (lifestyle, personality)
-- Algorithm: Calculate compatibility score based on multiple factors
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. RESIDENT MATCHES TABLE - Store match results
-- ============================================================================
CREATE TABLE IF NOT EXISTS resident_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  matched_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  compatibility_score INTEGER NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  match_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'liked', 'passed', 'matched')),
  viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, matched_user_id),
  CHECK (user_id != matched_user_id)
);

-- ============================================================================
-- 2. MATCH PREFERENCES TABLE - User's matching preferences
-- ============================================================================
CREATE TABLE IF NOT EXISTS match_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  -- Age range
  min_age INTEGER CHECK (min_age >= 18 AND min_age <= 100),
  max_age INTEGER CHECK (max_age >= 18 AND max_age <= 100),
  -- Location
  preferred_cities TEXT[],
  max_distance_km INTEGER,
  -- Lifestyle preferences
  smoker_preference TEXT CHECK (smoker_preference IN ('any', 'smoker', 'non_smoker')),
  pets_preference TEXT CHECK (pets_preference IN ('any', 'has_pets', 'no_pets')),
  cleanliness_min INTEGER CHECK (cleanliness_min >= 1 AND cleanliness_min <= 10),
  cleanliness_max INTEGER CHECK (cleanliness_max >= 1 AND cleanliness_max <= 10),
  -- Personality preferences
  sociability_preference TEXT[] CHECK (sociability_preference <@ ARRAY['low', 'medium', 'high']),
  interaction_preference TEXT[] CHECK (interaction_preference <@ ARRAY['cozy_evenings', 'independent_living', 'community_events']),
  -- Budget
  min_budget DECIMAL(10, 2),
  max_budget DECIMAL(10, 2),
  -- Active status
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. COMPATIBILITY FUNCTION - Calculate match score
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_compatibility_score(
  user1_id UUID,
  user2_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  user1_profile RECORD;
  user2_profile RECORD;
  age_diff INTEGER;
  cleanliness_diff INTEGER;
BEGIN
  -- Get both user profiles
  SELECT * INTO user1_profile FROM user_profiles WHERE user_id = user1_id;
  SELECT * INTO user2_profile FROM user_profiles WHERE user_id = user2_id;

  IF user1_profile IS NULL OR user2_profile IS NULL THEN
    RETURN 0;
  END IF;

  -- 1. Lifestyle Compatibility (40 points max)

  -- Sleep schedule compatibility (15 points)
  IF user1_profile.wake_up_time = user2_profile.wake_up_time THEN
    score := score + 8;
  END IF;
  IF user1_profile.sleep_time = user2_profile.sleep_time THEN
    score := score + 7;
  END IF;

  -- Smoking compatibility (10 points)
  IF user1_profile.smoker = user2_profile.smoker THEN
    score := score + 10;
  ELSIF user1_profile.smoker IS NULL OR user2_profile.smoker IS NULL THEN
    score := score + 5;
  END IF;

  -- Cleanliness compatibility (15 points)
  cleanliness_diff := ABS(COALESCE(user1_profile.cleanliness_preference, 5) - COALESCE(user2_profile.cleanliness_preference, 5));
  score := score + GREATEST(0, 15 - (cleanliness_diff * 2));

  -- 2. Personality Compatibility (30 points max)

  -- Sociability level (15 points)
  IF user1_profile.sociability_level = user2_profile.sociability_level THEN
    score := score + 15;
  ELSIF (user1_profile.sociability_level = 'medium' OR user2_profile.sociability_level = 'medium') THEN
    score := score + 8;
  ELSE
    score := score + 3;
  END IF;

  -- Interaction type compatibility (10 points)
  IF user1_profile.preferred_interaction_type = user2_profile.preferred_interaction_type THEN
    score := score + 10;
  ELSIF user1_profile.preferred_interaction_type IS NOT NULL AND user2_profile.preferred_interaction_type IS NOT NULL THEN
    score := score + 5;
  END IF;

  -- Introvert/Extrovert scale (5 points)
  IF ABS(COALESCE(user1_profile.introvert_extrovert_scale, 3) - COALESCE(user2_profile.introvert_extrovert_scale, 3)) <= 1 THEN
    score := score + 5;
  END IF;

  -- 3. Demographics (20 points max)

  -- Age compatibility (10 points)
  age_diff := ABS(
    EXTRACT(YEAR FROM AGE(user1_profile.date_of_birth)) -
    EXTRACT(YEAR FROM AGE(user2_profile.date_of_birth))
  );
  IF age_diff <= 3 THEN
    score := score + 10;
  ELSIF age_diff <= 5 THEN
    score := score + 7;
  ELSIF age_diff <= 10 THEN
    score := score + 4;
  END IF;

  -- Occupation compatibility (5 points)
  IF user1_profile.occupation_status = user2_profile.occupation_status THEN
    score := score + 5;
  END IF;

  -- Languages in common (5 points)
  IF user1_profile.languages_spoken && user2_profile.languages_spoken THEN
    score := score + 5;
  END IF;

  -- 4. Location (10 points max)
  IF user1_profile.current_city = user2_profile.current_city THEN
    score := score + 10;
  END IF;

  -- Ensure score is between 0 and 100
  RETURN LEAST(100, GREATEST(0, score));
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 4. FUNCTION to generate matches for a user
-- ============================================================================
CREATE OR REPLACE FUNCTION generate_matches_for_user(
  target_user_id UUID,
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  matched_user_id UUID,
  compatibility_score INTEGER,
  match_details JSONB
) AS $$
DECLARE
  user_prefs RECORD;
BEGIN
  -- Get user preferences
  SELECT * INTO user_prefs FROM match_preferences WHERE user_id = target_user_id;

  -- If no preferences, use defaults
  IF user_prefs IS NULL THEN
    user_prefs := ROW(
      target_user_id, 18, 100, NULL, NULL, 'any', 'any', 1, 10,
      ARRAY['low', 'medium', 'high'], ARRAY['cozy_evenings', 'independent_living', 'community_events'],
      0, 999999, TRUE, NOW(), NOW()
    );
  END IF;

  RETURN QUERY
  SELECT
    up.user_id AS matched_user_id,
    calculate_compatibility_score(target_user_id, up.user_id) AS compatibility_score,
    jsonb_build_object(
      'full_name', up.first_name || ' ' || up.last_name,
      'age', EXTRACT(YEAR FROM AGE(up.date_of_birth)),
      'occupation', up.occupation_status,
      'city', up.current_city,
      'sociability', up.sociability_level,
      'cleanliness', up.cleanliness_preference,
      'smoker', up.smoker,
      'languages', up.languages_spoken
    ) AS match_details
  FROM user_profiles up
  WHERE
    up.user_id != target_user_id
    AND up.user_type = 'resident'
    -- Age filter
    AND EXTRACT(YEAR FROM AGE(up.date_of_birth)) BETWEEN COALESCE(user_prefs.min_age, 18) AND COALESCE(user_prefs.max_age, 100)
    -- Smoker preference
    AND (user_prefs.smoker_preference = 'any' OR
         (user_prefs.smoker_preference = 'smoker' AND up.smoker = TRUE) OR
         (user_prefs.smoker_preference = 'non_smoker' AND up.smoker = FALSE))
    -- Cleanliness preference
    AND COALESCE(up.cleanliness_preference, 5) BETWEEN COALESCE(user_prefs.cleanliness_min, 1) AND COALESCE(user_prefs.cleanliness_max, 10)
    -- Sociability preference
    AND (user_prefs.sociability_preference IS NULL OR up.sociability_level = ANY(user_prefs.sociability_preference))
    -- City filter
    AND (user_prefs.preferred_cities IS NULL OR up.current_city = ANY(user_prefs.preferred_cities))
    -- Not already matched
    AND up.user_id NOT IN (
      SELECT matched_user_id FROM resident_matches
      WHERE user_id = target_user_id AND status IN ('liked', 'passed', 'matched')
    )
  ORDER BY calculate_compatibility_score(target_user_id, up.user_id) DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_resident_matches_user ON resident_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_resident_matches_matched_user ON resident_matches(matched_user_id);
CREATE INDEX IF NOT EXISTS idx_resident_matches_status ON resident_matches(status);
CREATE INDEX IF NOT EXISTS idx_resident_matches_score ON resident_matches(compatibility_score DESC);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
ALTER TABLE resident_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY resident_matches_select_policy ON resident_matches
  FOR SELECT USING (user_id = auth.uid() OR matched_user_id = auth.uid());

CREATE POLICY resident_matches_insert_policy ON resident_matches
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY resident_matches_update_policy ON resident_matches
  FOR UPDATE USING (user_id = auth.uid());

ALTER TABLE match_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY match_preferences_select_policy ON match_preferences
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY match_preferences_insert_policy ON match_preferences
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY match_preferences_update_policy ON match_preferences
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER update_resident_matches_updated_at BEFORE UPDATE ON resident_matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_match_preferences_updated_at BEFORE UPDATE ON match_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ Resident matching system created successfully!';
  RAISE NOTICE '   - resident_matches table';
  RAISE NOTICE '   - match_preferences table';
  RAISE NOTICE '   - calculate_compatibility_score() function';
  RAISE NOTICE '   - generate_matches_for_user() function';
  RAISE NOTICE '   Compatibility scoring:';
  RAISE NOTICE '     40 points - Lifestyle (sleep, smoking, cleanliness)';
  RAISE NOTICE '     30 points - Personality (sociability, interaction)';
  RAISE NOTICE '     20 points - Demographics (age, occupation, languages)';
  RAISE NOTICE '     10 points - Location (same city)';
END $$;
