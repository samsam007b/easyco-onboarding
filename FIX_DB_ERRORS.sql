-- ============================================================================
-- FIX MESSAGING FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION get_unread_count(target_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  unread_count INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO unread_count
  FROM messages
  WHERE receiver_id = target_user_id
    AND read = FALSE
    AND sender_id != target_user_id;

  RETURN COALESCE(unread_count, 0);
END;
$$;

-- ============================================================================
-- FIX RLS POLICIES
-- ============================================================================

-- Enable RLS on tables if not already enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_members ENABLE ROW LEVEL SECURITY;

-- user_profiles policies
DROP POLICY IF EXISTS "Users can view all profiles" ON user_profiles;
CREATE POLICY "Users can view all profiles" ON user_profiles
  FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- property_members policies
DROP POLICY IF EXISTS "Users can view property members" ON property_members;
CREATE POLICY "Users can view property members" ON property_members
  FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Members can view own membership" ON property_members;
CREATE POLICY "Members can view own membership" ON property_members
  FOR SELECT
  USING (auth.uid() = user_id);
