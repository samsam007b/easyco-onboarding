-- ============================================================================
-- COMPLETE FIX FOR USER MATCHING SYSTEM
-- ============================================================================
-- Run this script to completely reset and fix the matching system
-- ============================================================================

-- Step 1: Drop ALL policies (ignore errors if they don't exist)
DO $$
BEGIN
  -- Drop policies for user_swipes
  DROP POLICY IF EXISTS "Users can view their own swipes" ON user_swipes;
  DROP POLICY IF EXISTS "Users can create their own swipes" ON user_swipes;
  DROP POLICY IF EXISTS "Users can update their own swipes" ON user_swipes;

  -- Drop policies for user_matches
  DROP POLICY IF EXISTS "Users can view their matches" ON user_matches;
  DROP POLICY IF EXISTS "System can create matches" ON user_matches;
  DROP POLICY IF EXISTS "Users can update their matches" ON user_matches;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Some policies did not exist, continuing...';
END $$;

-- Step 2: Drop trigger and functions (ignore errors if they don't exist)
DO $$
BEGIN
  DROP TRIGGER IF EXISTS trigger_create_match_on_mutual_like ON user_swipes;
  DROP FUNCTION IF EXISTS create_match_on_mutual_like();
  DROP FUNCTION IF EXISTS get_user_matches(UUID, TEXT);
  DROP FUNCTION IF EXISTS have_users_matched(UUID, UUID, TEXT);
  DROP FUNCTION IF EXISTS get_swipe_status(UUID, UUID, TEXT);
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Some functions/triggers did not exist, continuing...';
END $$;

-- Step 3: Ensure RLS is enabled
ALTER TABLE user_swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_matches ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies for user_swipes
DO $$
BEGIN
  CREATE POLICY "Users can view their own swipes"
    ON user_swipes
    FOR SELECT
    USING (swiper_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Policy already exists, skipping...';
END $$;

DO $$
BEGIN
  CREATE POLICY "Users can create their own swipes"
    ON user_swipes
    FOR INSERT
    WITH CHECK (swiper_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Policy already exists, skipping...';
END $$;

DO $$
BEGIN
  CREATE POLICY "Users can update their own swipes"
    ON user_swipes
    FOR UPDATE
    USING (swiper_id = auth.uid())
    WITH CHECK (swiper_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Policy already exists, skipping...';
END $$;

-- Step 5: Create policies for user_matches
DO $$
BEGIN
  CREATE POLICY "Users can view their matches"
    ON user_matches
    FOR SELECT
    USING (user1_id = auth.uid() OR user2_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Policy already exists, skipping...';
END $$;

DO $$
BEGIN
  CREATE POLICY "System can create matches"
    ON user_matches
    FOR INSERT
    WITH CHECK (true);
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Policy already exists, skipping...';
END $$;

DO $$
BEGIN
  CREATE POLICY "Users can update their matches"
    ON user_matches
    FOR UPDATE
    USING (user1_id = auth.uid() OR user2_id = auth.uid())
    WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Policy already exists, skipping...';
END $$;

-- Step 6: Create trigger function
CREATE OR REPLACE FUNCTION create_match_on_mutual_like()
RETURNS TRIGGER AS $$
DECLARE
  mutual_like_exists BOOLEAN;
  smaller_id UUID;
  larger_id UUID;
BEGIN
  IF NEW.action != 'like' THEN
    RETURN NEW;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM user_swipes
    WHERE swiper_id = NEW.swiped_id
    AND swiped_id = NEW.swiper_id
    AND action = 'like'
    AND context = NEW.context
  ) INTO mutual_like_exists;

  IF mutual_like_exists THEN
    IF NEW.swiper_id < NEW.swiped_id THEN
      smaller_id := NEW.swiper_id;
      larger_id := NEW.swiped_id;
    ELSE
      smaller_id := NEW.swiped_id;
      larger_id := NEW.swiper_id;
    END IF;

    INSERT INTO user_matches (user1_id, user2_id, context, matched_at)
    VALUES (smaller_id, larger_id, NEW.context, NOW())
    ON CONFLICT (user1_id, user2_id, context) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger
DROP TRIGGER IF EXISTS trigger_create_match_on_mutual_like ON user_swipes;
CREATE TRIGGER trigger_create_match_on_mutual_like
  AFTER INSERT ON user_swipes
  FOR EACH ROW
  EXECUTE FUNCTION create_match_on_mutual_like();

-- Step 8: Create helper functions
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

-- Verification queries
SELECT 'Tables exist:' as check_type,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'user_swipes') as user_swipes,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'user_matches') as user_matches;

SELECT 'Policies count:' as check_type,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'user_swipes') as user_swipes_policies,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'user_matches') as user_matches_policies;

SELECT 'Functions exist:' as check_type,
  (SELECT COUNT(*) FROM pg_proc WHERE proname = 'create_match_on_mutual_like') as trigger_func,
  (SELECT COUNT(*) FROM pg_proc WHERE proname = 'get_user_matches') as get_matches,
  (SELECT COUNT(*) FROM pg_proc WHERE proname = 'have_users_matched') as check_match;
