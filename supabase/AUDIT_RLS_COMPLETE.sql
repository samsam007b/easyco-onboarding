-- ============================================================================
-- COMPREHENSIVE RLS AUDIT SCRIPT
-- Date: 2025-10-28
-- Purpose: Diagnose and audit all RLS policies for security and functionality
-- ============================================================================

-- ============================================================================
-- 1. CHECK WHICH TABLES HAVE RLS ENABLED
-- ============================================================================

SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- ============================================================================
-- 2. LIST ALL RLS POLICIES
-- ============================================================================

SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================================
-- 3. IDENTIFY TABLES WITH RLS ENABLED BUT NO POLICIES
-- ============================================================================

SELECT t.tablename
FROM pg_tables t
WHERE t.schemaname = 'public'
  AND t.rowsecurity = true
  AND NOT EXISTS (
    SELECT 1 FROM pg_policies p
    WHERE p.schemaname = t.schemaname
    AND p.tablename = t.tablename
  )
ORDER BY t.tablename;

-- ============================================================================
-- 4. CHECK APPLICATIONS TABLE POLICIES
-- ============================================================================

SELECT
  policyname,
  cmd as command,
  CASE
    WHEN qual IS NOT NULL THEN 'Has USING clause'
    ELSE 'No USING clause'
  END as using_status,
  CASE
    WHEN with_check IS NOT NULL THEN 'Has WITH CHECK'
    ELSE 'No WITH CHECK'
  END as with_check_status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'applications'
ORDER BY cmd, policyname;

-- ============================================================================
-- 5. CHECK GROUP_APPLICATIONS TABLE
-- ============================================================================

-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'group_applications'
) as table_exists;

-- Check RLS status
SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'group_applications';

-- Check policies
SELECT
  policyname,
  cmd as command,
  roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'group_applications'
ORDER BY cmd, policyname;

-- ============================================================================
-- 6. CHECK GROUPS TABLE
-- ============================================================================

SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'groups';

SELECT
  policyname,
  cmd as command
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'groups'
ORDER BY cmd, policyname;

-- ============================================================================
-- 7. CHECK GROUP_MEMBERS TABLE
-- ============================================================================

SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'group_members';

SELECT
  policyname,
  cmd as command
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'group_members'
ORDER BY cmd, policyname;

-- ============================================================================
-- 8. CHECK PROPERTIES TABLE POLICIES
-- ============================================================================

SELECT
  policyname,
  cmd as command,
  roles,
  CASE
    WHEN policyname LIKE '%visible%' THEN 'READ ACCESS'
    WHEN policyname LIKE '%insert%' THEN 'CREATE ACCESS'
    WHEN policyname LIKE '%update%' THEN 'UPDATE ACCESS'
    WHEN policyname LIKE '%delete%' THEN 'DELETE ACCESS'
    ELSE 'OTHER'
  END as access_type
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'properties'
ORDER BY cmd, policyname;

-- ============================================================================
-- 9. CHECK USERS TABLE
-- ============================================================================

SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'users';

SELECT
  policyname,
  cmd as command
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'users'
ORDER BY cmd, policyname;

-- ============================================================================
-- 10. CHECK USER_PROFILES TABLE
-- ============================================================================

SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'user_profiles';

SELECT
  policyname,
  cmd as command
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'user_profiles'
ORDER BY cmd, policyname;

-- ============================================================================
-- 11. IDENTIFY POTENTIAL SECURITY ISSUES
-- ============================================================================

-- Tables with RLS but allowing unrestricted access
SELECT
  tablename,
  policyname,
  'WARNING: Policy allows unrestricted access' as issue
FROM pg_policies
WHERE schemaname = 'public'
  AND (
    qual = 'true'::text
    OR with_check = 'true'::text
  )
ORDER BY tablename, policyname;

-- ============================================================================
-- 12. CHECK FOREIGN KEY RELATIONSHIPS FOR JOIN ACCESS
-- ============================================================================

SELECT
  tc.table_name as source_table,
  kcu.column_name as source_column,
  ccu.table_name AS foreign_table,
  ccu.column_name AS foreign_column
FROM information_schema.table_constraints AS tc
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('applications', 'group_applications', 'properties', 'groups', 'group_members')
ORDER BY tc.table_name;

-- ============================================================================
-- 13. RECOMMENDATIONS
-- ============================================================================

-- List all tables that should have RLS but might not
SELECT
  tablename,
  CASE
    WHEN rowsecurity THEN '✓ RLS Enabled'
    ELSE '⚠️ RLS NOT Enabled - SECURITY RISK'
  END as status,
  CASE
    WHEN rowsecurity AND EXISTS (
      SELECT 1 FROM pg_policies p
      WHERE p.schemaname = 'public'
      AND p.tablename = t.tablename
    ) THEN '✓ Has Policies'
    WHEN rowsecurity THEN '⚠️ No Policies - Table Inaccessible'
    ELSE '⚠️ No RLS - Open Access'
  END as policy_status
FROM pg_tables t
WHERE schemaname = 'public'
  AND tablename NOT LIKE 'pg_%'
  AND tablename NOT LIKE 'sql_%'
ORDER BY
  CASE WHEN rowsecurity THEN 1 ELSE 0 END,
  tablename;

-- ============================================================================
-- END OF AUDIT
-- ============================================================================

COMMENT ON SCHEMA public IS 'RLS Audit completed on 2025-10-28';
