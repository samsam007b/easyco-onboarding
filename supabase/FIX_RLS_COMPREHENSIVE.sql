-- ============================================================================
-- COMPREHENSIVE RLS FIXES
-- Date: 2025-10-28
-- Purpose: Fix all RLS policies to ensure proper access control
-- Security Level: HIGH
-- ============================================================================

-- ============================================================================
-- 1. GROUP_APPLICATIONS TABLE
-- ============================================================================

-- Ensure table has RLS enabled
ALTER TABLE IF EXISTS public.group_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can view own group applications" ON public.group_applications;
DROP POLICY IF EXISTS "Property owners can view group applications on their properties" ON public.group_applications;
DROP POLICY IF EXISTS "Group members can create group applications" ON public.group_applications;
DROP POLICY IF EXISTS "Group members can update group applications" ON public.group_applications;
DROP POLICY IF EXISTS "Property owners can update group application status" ON public.group_applications;

-- Group members can view their group's applications
CREATE POLICY "Users can view own group applications"
  ON public.group_applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_applications.group_id
      AND gm.user_id = auth.uid()
    )
  );

-- Property owners can view group applications on their properties
CREATE POLICY "Property owners can view group applications on their properties"
  ON public.group_applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = group_applications.property_id
      AND p.owner_id = auth.uid()
    )
  );

-- Group members can create applications for their group
CREATE POLICY "Group members can create group applications"
  ON public.group_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_applications.group_id
      AND gm.user_id = auth.uid()
    )
  );

-- Group members can update their group's applications (withdraw, etc.)
CREATE POLICY "Group members can update group applications"
  ON public.group_applications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_applications.group_id
      AND gm.user_id = auth.uid()
    )
  );

-- Property owners can update application status (approve/reject)
CREATE POLICY "Property owners can update group application status"
  ON public.group_applications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = group_applications.property_id
      AND p.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- 2. GROUPS TABLE
-- ============================================================================

-- Ensure RLS is enabled
ALTER TABLE IF EXISTS public.groups ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view public groups" ON public.groups;
DROP POLICY IF EXISTS "Group members can view their groups" ON public.groups;
DROP POLICY IF EXISTS "Users can create groups" ON public.groups;
DROP POLICY IF EXISTS "Group creators can update their groups" ON public.groups;
DROP POLICY IF EXISTS "Group creators can delete their groups" ON public.groups;

-- Anyone authenticated can view groups (for discovery/joining)
CREATE POLICY "Anyone can view public groups"
  ON public.groups
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can create groups
CREATE POLICY "Users can create groups"
  ON public.groups
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Group creators or admins can update groups
CREATE POLICY "Group creators can update their groups"
  ON public.groups
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = created_by
    OR EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = groups.id
      AND gm.user_id = auth.uid()
      AND gm.role = 'admin'
    )
  );

-- Only group creators can delete groups
CREATE POLICY "Group creators can delete their groups"
  ON public.groups
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- ============================================================================
-- 3. GROUP_MEMBERS TABLE
-- ============================================================================

-- Ensure RLS is enabled
ALTER TABLE IF EXISTS public.group_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Group members can view members of their groups" ON public.group_members;
DROP POLICY IF EXISTS "Anyone can view group members for public groups" ON public.group_members;
DROP POLICY IF EXISTS "Group admins can add members" ON public.group_members;
DROP POLICY IF EXISTS "Users can join groups" ON public.group_members;
DROP POLICY IF EXISTS "Group admins can update members" ON public.group_members;
DROP POLICY IF EXISTS "Users can leave groups" ON public.group_members;
DROP POLICY IF EXISTS "Group admins can remove members" ON public.group_members;

-- Anyone can view group members (for transparency before joining)
CREATE POLICY "Anyone can view group members for public groups"
  ON public.group_members
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can join groups (create their own membership)
CREATE POLICY "Users can join groups"
  ON public.group_members
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Group admins can add members
CREATE POLICY "Group admins can add members"
  ON public.group_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id = group_members.group_id
      AND (
        g.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.group_members gm
          WHERE gm.group_id = g.id
          AND gm.user_id = auth.uid()
          AND gm.role = 'admin'
        )
      )
    )
  );

-- Users can update their own membership (e.g., status)
-- Group admins can update any member
CREATE POLICY "Group admins can update members"
  ON public.group_members
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id = group_members.group_id
      AND (
        g.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.group_members gm
          WHERE gm.group_id = g.id
          AND gm.user_id = auth.uid()
          AND gm.role = 'admin'
        )
      )
    )
  );

-- Users can leave groups (delete their own membership)
CREATE POLICY "Users can leave groups"
  ON public.group_members
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Group admins can remove members
CREATE POLICY "Group admins can remove members"
  ON public.group_members
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id = group_members.group_id
      AND (
        g.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.group_members gm
          WHERE gm.group_id = g.id
          AND gm.user_id = auth.uid()
          AND gm.role = 'admin'
        )
      )
    )
  );

-- ============================================================================
-- 4. USERS TABLE
-- ============================================================================

-- Ensure RLS is enabled
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view other user profiles" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can view other users' public info (for messaging, groups, etc.)
CREATE POLICY "Users can view other user profiles"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- ============================================================================
-- 5. USER_PROFILES TABLE
-- ============================================================================

-- Ensure RLS is enabled
ALTER TABLE IF EXISTS public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own detailed profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view other profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own detailed profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can create own detailed profile" ON public.user_profiles;

-- Users can view their own detailed profile
CREATE POLICY "Users can view own detailed profile"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can view other profiles (for matching, groups, etc.)
CREATE POLICY "Users can view other profiles"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can create their own profile
CREATE POLICY "Users can create own detailed profile"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own detailed profile
CREATE POLICY "Users can update own detailed profile"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- 6. NOTIFICATIONS TABLE (if exists)
-- ============================================================================

-- Ensure RLS is enabled
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- System/functions can create notifications for users
-- Note: Functions with SECURITY DEFINER can bypass RLS
CREATE POLICY "System can create notifications"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON public.notifications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- 7. FAVORITES TABLE
-- ============================================================================

-- Ensure RLS is enabled
ALTER TABLE IF EXISTS public.favorites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can create favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON public.favorites;

-- Users can view their own favorites
CREATE POLICY "Users can view own favorites"
  ON public.favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create favorites
CREATE POLICY "Users can create favorites"
  ON public.favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete own favorites"
  ON public.favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- 8. VERIFY ALL POLICIES ARE IN PLACE
-- ============================================================================

DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public';

  RAISE NOTICE 'Total RLS policies created: %', policy_count;

  -- Check critical tables
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'applications';
  RAISE NOTICE 'Applications policies: %', policy_count;

  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'group_applications';
  RAISE NOTICE 'Group applications policies: %', policy_count;

  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'groups';
  RAISE NOTICE 'Groups policies: %', policy_count;

  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'group_members';
  RAISE NOTICE 'Group members policies: %', policy_count;
END $$;

-- ============================================================================
-- END OF RLS FIXES
-- ============================================================================

COMMENT ON SCHEMA public IS 'RLS policies comprehensively updated on 2025-10-28';
