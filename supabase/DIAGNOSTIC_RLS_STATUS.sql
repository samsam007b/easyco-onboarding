-- ============================================================================
-- DIAGNOSTIC: Check RLS status for all tables causing CORS errors
-- Run this in Supabase SQL Editor to see current state
-- Created: 2025-10-28
-- ============================================================================

-- Check if tables exist
SELECT 'notifications' as table_name, EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'notifications'
) as table_exists;

SELECT 'user_profiles' as table_name, EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
) as table_exists;

SELECT 'group_members' as table_name, EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'group_members'
) as table_exists;

-- ============================================================================
-- Check if RLS is enabled on each table
-- ============================================================================

SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('notifications', 'user_profiles', 'group_members')
ORDER BY tablename;

-- ============================================================================
-- Check current policies on notifications table
-- ============================================================================

SELECT
  'notifications' as table_name,
  policyname as policy_name,
  roles,
  cmd as command_type,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'notifications'
ORDER BY policyname;

-- ============================================================================
-- Check current policies on user_profiles table
-- ============================================================================

SELECT
  'user_profiles' as table_name,
  policyname as policy_name,
  roles,
  cmd as command_type,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'user_profiles'
ORDER BY policyname;

-- ============================================================================
-- Check current policies on group_members table
-- ============================================================================

SELECT
  'group_members' as table_name,
  policyname as policy_name,
  roles,
  cmd as command_type,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'group_members'
ORDER BY policyname;

-- ============================================================================
-- Check table permissions
-- ============================================================================

SELECT
  table_name,
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public'
AND table_name IN ('notifications', 'user_profiles', 'group_members')
ORDER BY table_name, grantee, privilege_type;

-- ============================================================================
-- Check if groups table exists (required for group_members RLS)
-- ============================================================================

SELECT 'groups' as table_name, EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'groups'
) as table_exists;

-- ============================================================================
-- Summary: Count rows in each table (if accessible)
-- ============================================================================

DO $$
DECLARE
  notification_count INTEGER;
  profile_count INTEGER;
  group_member_count INTEGER;
BEGIN
  -- Try to count notifications
  BEGIN
    SELECT COUNT(*) INTO notification_count FROM public.notifications;
    RAISE NOTICE 'notifications table: % rows', notification_count;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'notifications table: Cannot count (may not exist or no permission)';
  END;

  -- Try to count user_profiles
  BEGIN
    SELECT COUNT(*) INTO profile_count FROM public.user_profiles;
    RAISE NOTICE 'user_profiles table: % rows', profile_count;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'user_profiles table: Cannot count (may not exist or no permission)';
  END;

  -- Try to count group_members
  BEGIN
    SELECT COUNT(*) INTO group_member_count FROM public.group_members;
    RAISE NOTICE 'group_members table: % rows', group_member_count;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'group_members table: Cannot count (may not exist or no permission)';
  END;
END $$;
