-- ============================================================================
-- USER MATCHING SYSTEM - Tinder-Style Swipe & Match
-- ============================================================================
-- This migration creates tables for user-to-user matching system
-- Used for: Searchers finding co-searchers, Residents finding new roommates
-- ============================================================================

-- ============================================================================
-- TABLE: user_swipes
-- Tracks all swipe actions (like/pass) between users
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  swiped_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('like', 'pass', 'superlike')),
  context TEXT CHECK (context IN ('searcher_matching', 'resident_matching')),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one user can only swipe another once per context
  UNIQUE(swiper_id, swiped_id, context)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_swipes_swiper ON user_swipes(swiper_id);
CREATE INDEX IF NOT EXISTS idx_user_swipes_swiped ON user_swipes(swiped_id);
CREATE INDEX IF NOT EXISTS idx_user_swipes_action ON user_swipes(action);
CREATE INDEX IF NOT EXISTS idx_user_swipes_context ON user_swipes(context);

-- ============================================================================
-- TABLE: user_matches
-- Stores mutual matches (when both users like each other)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  context TEXT CHECK (context IN ('searcher_matching', 'resident_matching')),
  compatibility_score INTEGER CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  matched_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,

  -- Ensure we don't create duplicate matches
  CONSTRAINT unique_match CHECK (user1_id < user2_id),
  UNIQUE(user1_id, user2_id, context)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_matches_user1 ON user_matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_user_matches_user2 ON user_matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_user_matches_context ON user_matches(context);
CREATE INDEX IF NOT EXISTS idx_user_matches_active ON user_matches(is_active);
CREATE INDEX IF NOT EXISTS idx_user_matches_score ON user_matches(compatibility_score DESC);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE user_swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_matches ENABLE ROW LEVEL SECURITY;

-- user_swipes policies
-- Users can view their own swipes
CREATE POLICY "Users can view their own swipes"
  ON user_swipes
  FOR SELECT
  USING (swiper_id = auth.uid());

-- Users can create their own swipes
CREATE POLICY "Users can create their own swipes"
  ON user_swipes
  FOR INSERT
  WITH CHECK (swiper_id = auth.uid());

-- Users can update their own swipes (e.g., change from pass to like)
CREATE POLICY "Users can update their own swipes"
  ON user_swipes
  FOR UPDATE
  USING (swiper_id = auth.uid())
  WITH CHECK (swiper_id = auth.uid());

-- user_matches policies
-- Users can view matches they're part of
CREATE POLICY "Users can view their matches"
  ON user_matches
  FOR SELECT
  USING (user1_id = auth.uid() OR user2_id = auth.uid());

-- System can create matches (via trigger)
CREATE POLICY "System can create matches"
  ON user_matches
  FOR INSERT
  WITH CHECK (true);

-- Users can update matches they're part of (e.g., mark as inactive)
CREATE POLICY "Users can update their matches"
  ON user_matches
  FOR UPDATE
  USING (user1_id = auth.uid() OR user2_id = auth.uid())
  WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());

-- ============================================================================
-- TRIGGER: Auto-create matches on mutual like
-- ============================================================================

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

-- Create trigger
CREATE TRIGGER trigger_create_match_on_mutual_like
  AFTER INSERT ON user_swipes
  FOR EACH ROW
  EXECUTE FUNCTION create_match_on_mutual_like();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get matches for a user
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

-- Function to check if two users have matched
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

-- Function to get swipe status between two users
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
