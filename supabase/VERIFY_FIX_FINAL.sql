-- ============================================================================
-- VERIFICATION FINALE: Confirmer que les politiques RLS sont correctes
-- Exécutez ce script après avoir appliqué le nettoyage
-- Created: 2025-10-28
-- ============================================================================

-- 1. Vérifier que RLS est activé sur les 3 tables
SELECT
  '✅ RLS Status' as check_type,
  tablename,
  CASE
    WHEN rowsecurity = true THEN '✅ ENABLED'
    ELSE '❌ DISABLED'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('notifications', 'user_profiles', 'group_members')
ORDER BY tablename;

-- 2. Compter les politiques sur chaque table
SELECT
  '📊 Policy Count' as check_type,
  tablename,
  COUNT(*) as policy_count,
  CASE
    WHEN COUNT(*) >= 4 THEN '✅ OK (4+ policies)'
    WHEN COUNT(*) > 0 THEN '⚠️ WARNING (less than 4)'
    ELSE '❌ ERROR (no policies)'
  END as status
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('notifications', 'user_profiles', 'group_members')
GROUP BY tablename
ORDER BY tablename;

-- 3. Lister TOUTES les politiques sur notifications
SELECT
  '🔔 Notifications Policies' as table_name,
  policyname,
  cmd as operation,
  roles,
  CASE
    WHEN policyname LIKE 'notifications_%' THEN '✅ New format'
    ELSE '⚠️ Old format (should not exist)'
  END as naming_status
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'notifications'
ORDER BY cmd, policyname;

-- 4. Lister TOUTES les politiques sur user_profiles
SELECT
  '👤 User Profiles Policies' as table_name,
  policyname,
  cmd as operation,
  roles,
  CASE
    WHEN policyname LIKE 'user_profiles_%' THEN '✅ New format'
    ELSE '⚠️ Old format (should not exist)'
  END as naming_status
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'user_profiles'
ORDER BY cmd, policyname;

-- 5. Lister TOUTES les politiques sur group_members
SELECT
  '👥 Group Members Policies' as table_name,
  policyname,
  cmd as operation,
  roles,
  CASE
    WHEN policyname LIKE 'group_members_%' THEN '✅ New format'
    ELSE '⚠️ Old format (should not exist)'
  END as naming_status
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'group_members'
ORDER BY cmd, policyname;

-- 6. Vérifier les permissions GRANT
SELECT
  '🔐 Permissions' as check_type,
  table_name,
  grantee,
  STRING_AGG(privilege_type, ', ' ORDER BY privilege_type) as permissions
FROM information_schema.table_privileges
WHERE table_schema = 'public'
AND table_name IN ('notifications', 'user_profiles', 'group_members')
AND grantee IN ('authenticated', 'service_role', 'postgres')
GROUP BY table_name, grantee
ORDER BY table_name, grantee;

-- 7. Test de sécurité: Vérifier qu'on ne peut PAS contourner RLS
SELECT
  '🛡️ Security Test' as check_type,
  tablename,
  CASE
    WHEN rowsecurity = true AND
         EXISTS (
           SELECT 1 FROM pg_policies
           WHERE schemaname = 'public'
           AND pg_policies.tablename = pg_tables.tablename
           AND cmd = 'SELECT'
         )
    THEN '✅ SECURE (RLS enabled + SELECT policy exists)'
    ELSE '❌ INSECURE'
  END as security_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('notifications', 'user_profiles', 'group_members')
ORDER BY tablename;

-- ============================================================================
-- RÉSULTAT ATTENDU
-- ============================================================================

/*
APRÈS LE NETTOYAGE ET LA RECRÉATION, VOUS DEVRIEZ VOIR:

✅ RLS Status:
  - notifications: ENABLED
  - user_profiles: ENABLED
  - group_members: ENABLED

📊 Policy Count:
  - notifications: 4 policies (SELECT, INSERT, UPDATE, DELETE)
  - user_profiles: 4 policies (SELECT, INSERT, UPDATE, DELETE)
  - group_members: 4 policies (SELECT, INSERT, UPDATE, DELETE)

🔔 Notifications Policies:
  - notifications_select (SELECT)
  - notifications_insert (INSERT)
  - notifications_update (UPDATE)
  - notifications_delete (DELETE)

👤 User Profiles Policies:
  - user_profiles_select_all (SELECT)
  - user_profiles_insert (INSERT)
  - user_profiles_update (UPDATE)
  - user_profiles_delete (DELETE)

👥 Group Members Policies:
  - group_members_select (SELECT)
  - group_members_insert (INSERT)
  - group_members_update (UPDATE)
  - group_members_delete (DELETE)

🔐 Permissions:
  - Chaque table doit avoir:
    * authenticated: SELECT, INSERT, UPDATE, DELETE
    * service_role: ALL

🛡️ Security Test:
  - Toutes les tables: SECURE

SI VOUS VOYEZ DES ANCIENNES POLITIQUES (avec des noms longs en anglais),
RE-EXÉCUTEZ LE SCRIPT DE NETTOYAGE!
*/
