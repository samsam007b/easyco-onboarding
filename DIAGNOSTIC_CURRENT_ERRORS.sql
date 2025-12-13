-- ============================================================================
-- DIAGNOSTIC DES ERREURS PERSISTANTES
-- À exécuter sur la base de données de PRODUCTION pour diagnostiquer
-- ============================================================================

-- ============================================================================
-- 1. VÉRIFIER QUE LA FONCTION get_unread_count EXISTE
-- ============================================================================

SELECT
  routine_name,
  routine_type,
  security_type,
  routine_definition
FROM information_schema.routines
WHERE routine_name = 'get_unread_count'
  AND routine_schema = 'public';

-- Résultat attendu: 1 ligne avec routine_name = 'get_unread_count'
-- Si vide: la fonction n'existe pas (404 normal)

-- ============================================================================
-- 2. VÉRIFIER QUE LES TABLES EXISTENT
-- ============================================================================

SELECT
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('user_profiles', 'property_members', 'profiles', 'messages', 'conversation_participants')
ORDER BY table_name;

-- Résultat attendu: 5 tables
-- Si moins: une table n'existe pas

-- ============================================================================
-- 3. VÉRIFIER LES POLICIES RLS SUR user_profiles
-- ============================================================================

SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- Résultat attendu: au moins "Users can view all profiles" (SELECT)

-- ============================================================================
-- 4. VÉRIFIER LES POLICIES RLS SUR property_members
-- ============================================================================

SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'property_members'
ORDER BY policyname;

-- Résultat attendu: au moins "Users can view property members" (SELECT)

-- ============================================================================
-- 5. VÉRIFIER QUE RLS EST ACTIVÉ
-- ============================================================================

SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('user_profiles', 'property_members', 'profiles', 'conversation_participants')
ORDER BY tablename;

-- Résultat attendu: rowsecurity = true pour toutes les tables

-- ============================================================================
-- 6. TESTER LA FONCTION get_unread_count DIRECTEMENT
-- ============================================================================

-- Test avec un UUID fictif (devrait retourner 0)
SELECT get_unread_count('00000000-0000-0000-0000-000000000000'::UUID) as unread_count;

-- Résultat attendu: 0
-- Si erreur: la fonction a un problème

-- ============================================================================
-- 7. COMPTER LES DONNÉES DANS LES TABLES (pour vérifier qu'elles ne sont pas vides)
-- ============================================================================

SELECT
  'user_profiles' as table_name,
  COUNT(*) as row_count
FROM user_profiles
UNION ALL
SELECT
  'property_members' as table_name,
  COUNT(*) as row_count
FROM property_members
UNION ALL
SELECT
  'profiles' as table_name,
  COUNT(*) as row_count
FROM profiles
UNION ALL
SELECT
  'messages' as table_name,
  COUNT(*) as row_count
FROM messages
UNION ALL
SELECT
  'conversation_participants' as table_name,
  COUNT(*) as row_count
FROM conversation_participants;

-- ============================================================================
-- RÉSUMÉ DES RÉSULTATS ATTENDUS
-- ============================================================================
-- ✅ get_unread_count existe et retourne 0
-- ✅ 5 tables existent
-- ✅ RLS activé sur toutes les tables
-- ✅ Policies SELECT présentes sur user_profiles et property_members
-- ✅ Tables contiennent des données
