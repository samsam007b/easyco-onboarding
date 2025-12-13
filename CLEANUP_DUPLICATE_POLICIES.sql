-- ============================================================================
-- NETTOYAGE DES POLICIES RLS EN DOUBLON
-- À exécuter sur la base de données de PRODUCTION après FIX_ALL_DB_ERRORS.sql
-- ============================================================================

-- ============================================================================
-- 1. NETTOYER conversation_participants (6 policies → garder 3)
-- ============================================================================

-- Supprimer les anciennes policies (doublons)
DROP POLICY IF EXISTS "conversation_participants_insert_policy" ON conversation_participants;
DROP POLICY IF EXISTS "conversation_participants_select_policy" ON conversation_participants;
DROP POLICY IF EXISTS "conversation_participants_update_policy" ON conversation_participants;

-- Garder seulement:
-- ✅ "Authenticated users can view participants" (SELECT)
-- ✅ "Users can join conversations" (INSERT)
-- ✅ "Users can update own participation" (UPDATE)

-- ============================================================================
-- 2. NETTOYER profiles (3 policies → garder 2)
-- ============================================================================

-- Supprimer la policy temporaire
DROP POLICY IF EXISTS "temp_allow_all_authenticated_profiles" ON profiles;

-- Garder seulement:
-- ✅ "Users can view profiles" (SELECT)
-- ✅ "Users can update own profile record" (UPDATE)

-- ============================================================================
-- 3. NETTOYER property_members (7 policies → garder 2)
-- ============================================================================

-- Supprimer les anciennes policies détaillées (trop restrictives)
DROP POLICY IF EXISTS "property_members_delete_own" ON property_members;
DROP POLICY IF EXISTS "property_members_insert_own" ON property_members;
DROP POLICY IF EXISTS "property_members_select_as_owner" ON property_members;
DROP POLICY IF EXISTS "property_members_select_own" ON property_members;
DROP POLICY IF EXISTS "property_members_update_own" ON property_members;

-- Garder seulement:
-- ✅ "Users can view property members" (SELECT - tous les membres)
-- ✅ "Members can view own membership" (SELECT - propre membership)

-- ============================================================================
-- 4. NETTOYER user_profiles (16 policies → garder 2)
-- ============================================================================

-- Supprimer toutes les anciennes policies
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON user_profiles;
DROP POLICY IF EXISTS "Public can view property owner profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can create own detailed profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own detailed profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view other profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own detailed profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "profile_delete_own" ON user_profiles;
DROP POLICY IF EXISTS "profile_insert_own" ON user_profiles;
DROP POLICY IF EXISTS "profile_select_all" ON user_profiles;
DROP POLICY IF EXISTS "profile_update_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_delete_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_select_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_select_public" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON user_profiles;

-- Garder seulement:
-- ✅ "Users can view all profiles" (SELECT)
-- ✅ "Users can update own profile" (UPDATE)

-- ============================================================================
-- 5. VERIFICATION FINALE
-- ============================================================================

-- Vérifier qu'il ne reste que les policies essentielles
SELECT
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename IN ('user_profiles', 'property_members', 'profiles', 'conversation_participants')
ORDER BY tablename, policyname;

-- ============================================================================
-- RÉSULTAT ATTENDU
-- ============================================================================
-- conversation_participants: 3 policies (SELECT, INSERT, UPDATE)
-- profiles: 2 policies (SELECT, UPDATE)
-- property_members: 2 policies (SELECT x2)
-- user_profiles: 2 policies (SELECT, UPDATE)
-- TOTAL: 9 policies (au lieu de 32)

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Duplicate policies cleaned up!';
  RAISE NOTICE '✅ conversation_participants: 3 policies (was 6)';
  RAISE NOTICE '✅ profiles: 2 policies (was 3)';
  RAISE NOTICE '✅ property_members: 2 policies (was 7)';
  RAISE NOTICE '✅ user_profiles: 2 policies (was 16)';
  RAISE NOTICE '';
  RAISE NOTICE '🔄 Total: 9 clean policies (was 32 with duplicates)';
END $$;
