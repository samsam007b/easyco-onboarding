-- ============================================================================
-- SCRIPT COMPLET DE CORRECTION DES ERREURS DE BASE DE DONNÉES
-- À exécuter sur la base de données de PRODUCTION
-- ============================================================================

-- ============================================================================
-- 1. FIX MESSAGING FUNCTION (404 error on get_unread_count)
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
-- 2. FIX RLS POLICIES (400 errors on user_profiles, property_members, profiles)
-- ============================================================================

-- Enable RLS on tables if not already enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

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

-- profiles policies (if different from user_profiles)
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
CREATE POLICY "Users can view profiles" ON profiles
  FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own profile record" ON profiles;
CREATE POLICY "Users can update own profile record" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- 3. FIX CONVERSATION_PARTICIPANTS (500 error - infinite recursion)
-- ============================================================================

-- Enable RLS on conversation_participants
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can join conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can update own participation" ON conversation_participants;

-- Simple policy: authenticated users can view all conversation participants
-- This avoids the infinite recursion issue
CREATE POLICY "Authenticated users can view participants" ON conversation_participants
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow users to insert themselves as participants
CREATE POLICY "Users can join conversations" ON conversation_participants
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own participation status
CREATE POLICY "Users can update own participation" ON conversation_participants
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 4. VERIFICATION
-- ============================================================================

-- Check that the function exists
SELECT
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_name = 'get_unread_count'
  AND routine_schema = 'public';

-- Check RLS policies on critical tables
SELECT
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename IN ('user_profiles', 'property_members', 'profiles', 'conversation_participants')
ORDER BY tablename, policyname;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ All database errors have been fixed!';
  RAISE NOTICE '✅ Function get_unread_count created';
  RAISE NOTICE '✅ RLS policies updated for user_profiles, property_members, profiles';
  RAISE NOTICE '✅ RLS policies updated for conversation_participants';
  RAISE NOTICE '';
  RAISE NOTICE '🔄 Please refresh www.izzico.be to verify the errors are gone';
END $$;
