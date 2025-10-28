-- ============================================================================
-- FIX USER MATCHING SYSTEM - Drop and Recreate Policies
-- ============================================================================
-- This script fixes the user matching tables by dropping existing policies
-- and recreating them properly
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own swipes" ON user_swipes;
DROP POLICY IF EXISTS "Users can create their own swipes" ON user_swipes;
DROP POLICY IF EXISTS "Users can update their own swipes" ON user_swipes;
DROP POLICY IF EXISTS "Users can view their matches" ON user_matches;
DROP POLICY IF EXISTS "System can create matches" ON user_matches;
DROP POLICY IF EXISTS "Users can update their matches" ON user_matches;

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS trigger_create_match_on_mutual_like ON user_swipes;
DROP FUNCTION IF EXISTS create_match_on_mutual_like();
DROP FUNCTION IF EXISTS get_user_matches(UUID, TEXT);
DROP FUNCTION IF EXISTS have_users_matched(UUID, UUID, TEXT);
DROP FUNCTION IF EXISTS get_swipe_status(UUID, UUID, TEXT);

-- Recreate RLS policies for user_swipes
CREATE POLICY "Users can view their own swipes"
  ON user_swipes
  FOR SELECT
  USING (swiper_id = auth.uid());

CREATE POLICY "Users can create their own swipes"
  ON user_swipes
  FOR INSERT
  WITH CHECK (swiper_id = auth.uid());

CREATE POLICY "Users can update their own swipes"
  ON user_swipes
  FOR UPDATE
  USING (swiper_id = auth.uid())
  WITH CHECK (swiper_id = auth.uid());

-- Recreate RLS policies for user_matches
CREATE POLICY "Users can view their matches"
  ON user_matches
  FOR SELECT
  USING (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "System can create matches"
  ON user_matches
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their matches"
  ON user_matches
  FOR UPDATE
  USING (user1_id = auth.uid() OR user2_id = auth.uid())
  WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());

-- Recreate trigger function for auto-matching
CREATE OR REPLACE FUNCTION create_match_on_mutual_like()
RETURNS TRIGGER AS $$
DECLARE
  mutual_like_exists BOOLEAN;
  smaller_id UUID;
  larger_id UUID;
BEGIN
  -- Only proceed if this is a 'like' action
  IF NEW.action != 'like' THEN
    RETURN NEW;
  END IF;

  -- Check if the other user also liked this user
  SELECT EXISTS (
    SELECT 1 FROM user_swipes
    WHERE swiper_id = NEW.swiped_id
    AND swiped_id = NEW.swiper_id
    AND action = 'like'
    AND context = NEW.context
  ) INTO mutual_like_exists;

  -- If mutual like exists, create a match
  IF mutual_like_exists THEN
    -- Ensure user1_id < user2_id for uniqueness constraint
    IF NEW.swiper_id < NEW.swiped_id THEN
      smaller_id := NEW.swiper_id;
      larger_id := NEW.swiped_id;
    ELSE
      smaller_id := NEW.swiped_id;
      larger_id := NEW.swiper_id;
    END IF;

    -- Insert match (ON CONFLICT DO NOTHING to avoid duplicates)
    INSERT INTO user_matches (user1_id, user2_id, context, matched_at)
    VALUES (smaller_id, larger_id, NEW.context, NOW())
    ON CONFLICT (user1_id, user2_id, context) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
CREATE TRIGGER trigger_create_match_on_mutual_like
  AFTER INSERT ON user_swipes
  FOR EACH ROW
  EXECUTE FUNCTION create_match_on_mutual_like();

-- Recreate helper functions
CREATE OR REPLACE FUNCTION get_user_matches(p_user_id UUID, p_context TEXT DEFAULT NULL)
RETURNS TABLE (
  match_id UUID,
  matched_user_id UUID,
  compatibility_score INTEGER,
  matched_at TIMESTAMPTZ,
  last_message_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    um.id as match_id,
    CASE
      WHEN um.user1_id = p_user_id THEN um.user2_id
      ELSE um.user1_id
    END as matched_user_id,
    um.compatibility_score,
    um.matched_at,
    um.last_message_at
  FROM user_matches um
  WHERE (um.user1_id = p_user_id OR um.user2_id = p_user_id)
    AND um.is_active = TRUE
    AND (p_context IS NULL OR um.context = p_context)
  ORDER BY um.matched_at DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION have_users_matched(p_user1_id UUID, p_user2_id UUID, p_context TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  match_exists BOOLEAN;
  smaller_id UUID;
  larger_id UUID;
BEGIN
  -- Normalize user IDs
  IF p_user1_id < p_user2_id THEN
    smaller_id := p_user1_id;
    larger_id := p_user2_id;
  ELSE
    smaller_id := p_user2_id;
    larger_id := p_user1_id;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM user_matches
    WHERE user1_id = smaller_id
      AND user2_id = larger_id
      AND is_active = TRUE
      AND (p_context IS NULL OR context = p_context)
  ) INTO match_exists;

  RETURN match_exists;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_swipe_status(p_swiper_id UUID, p_swiped_id UUID, p_context TEXT DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  swipe_action TEXT;
BEGIN
  SELECT action INTO swipe_action
  FROM user_swipes
  WHERE swiper_id = p_swiper_id
    AND swiped_id = p_swiped_id
    AND (p_context IS NULL OR context = p_context)
  LIMIT 1;

  RETURN COALESCE(swipe_action, 'not_swiped');
END;
$$ LANGUAGE plpgsql;
