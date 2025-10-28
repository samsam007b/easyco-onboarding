-- Migration: Fix CORS and RLS issues for notifications, user_profiles, and group_members
-- This fixes the "due to access control checks" errors
-- Created: 2025-10-28

-- ============================================================================
-- PART 1: Fix notifications table RLS policies
-- ============================================================================

-- Ensure RLS is enabled
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Service role can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can create own notifications" ON public.notifications;

-- Create comprehensive RLS policies for notifications

-- SELECT: Users can view their own notifications
CREATE POLICY "notifications_select_own"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- INSERT: Users can create notifications for themselves
CREATE POLICY "notifications_insert_own"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- INSERT: Service role can insert notifications for anyone (for triggers/functions)
CREATE POLICY "notifications_insert_service"
  ON public.notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- UPDATE: Users can update their own notifications (mark as read)
CREATE POLICY "notifications_update_own"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can delete their own notifications
CREATE POLICY "notifications_delete_own"
  ON public.notifications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- PART 2: Fix user_profiles table RLS policies
-- ============================================================================

-- Ensure RLS is enabled on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;

-- Create comprehensive RLS policies for user_profiles

-- SELECT: Users can view their own profile
CREATE POLICY "user_profiles_select_own"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- SELECT: Users can view public profiles (profiles of other users for matching)
CREATE POLICY "user_profiles_select_public"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (true); -- All authenticated users can see all profiles for matching purposes

-- INSERT: Users can create their own profile
CREATE POLICY "user_profiles_insert_own"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update their own profile
CREATE POLICY "user_profiles_update_own"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can delete their own profile
CREATE POLICY "user_profiles_delete_own"
  ON public.user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- PART 3: Fix group_members table RLS policies
-- ============================================================================

-- Ensure RLS is enabled on group_members
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view group members" ON public.group_members;
DROP POLICY IF EXISTS "Users can manage own membership" ON public.group_members;
DROP POLICY IF EXISTS "Group creators can manage members" ON public.group_members;

-- Create comprehensive RLS policies for group_members

-- SELECT: Users can view members of groups they belong to
CREATE POLICY "group_members_select_own_groups"
  ON public.group_members
  FOR SELECT
  TO authenticated
  USING (
    -- Can see members if user is in the group
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_members.group_id
      AND gm.user_id = auth.uid()
    )
    OR
    -- Or if the user created the group
    EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id = group_members.group_id
      AND g.created_by = auth.uid()
    )
  );

-- INSERT: Group creators and admins can add members
CREATE POLICY "group_members_insert_by_creator"
  ON public.group_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Group creator can add members
    EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id = group_id
      AND g.created_by = auth.uid()
    )
    OR
    -- User can add themselves
    auth.uid() = user_id
  );

-- UPDATE: Group creators and the member themselves can update membership
CREATE POLICY "group_members_update_by_creator_or_self"
  ON public.group_members
  FOR UPDATE
  TO authenticated
  USING (
    -- Group creator can update
    EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id = group_id
      AND g.created_by = auth.uid()
    )
    OR
    -- User can update their own membership
    auth.uid() = user_id
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id = group_id
      AND g.created_by = auth.uid()
    )
    OR
    auth.uid() = user_id
  );

-- DELETE: Group creators and members themselves can remove membership
CREATE POLICY "group_members_delete_by_creator_or_self"
  ON public.group_members
  FOR DELETE
  TO authenticated
  USING (
    -- Group creator can remove members
    EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id = group_id
      AND g.created_by = auth.uid()
    )
    OR
    -- User can remove themselves
    auth.uid() = user_id
  );

-- ============================================================================
-- PART 4: Grant necessary permissions
-- ============================================================================

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.group_members TO authenticated;

-- Grant all permissions to service_role (for backend operations)
GRANT ALL ON public.notifications TO service_role;
GRANT ALL ON public.user_profiles TO service_role;
GRANT ALL ON public.group_members TO service_role;

-- ============================================================================
-- PART 5: Add helpful comments
-- ============================================================================

COMMENT ON POLICY "notifications_select_own" ON public.notifications IS
  'Users can view their own notifications';

COMMENT ON POLICY "user_profiles_select_public" ON public.user_profiles IS
  'All authenticated users can view profiles for matching purposes';

COMMENT ON POLICY "group_members_select_own_groups" ON public.group_members IS
  'Users can view members of groups they belong to';

-- ============================================================================
-- VERIFICATION QUERIES (run these to verify the fix)
-- ============================================================================

-- Verify notifications policies
-- SELECT policyname, roles, cmd, qual FROM pg_policies WHERE tablename = 'notifications';

-- Verify user_profiles policies
-- SELECT policyname, roles, cmd, qual FROM pg_policies WHERE tablename = 'user_profiles';

-- Verify group_members policies
-- SELECT policyname, roles, cmd, qual FROM pg_policies WHERE tablename = 'group_members';
