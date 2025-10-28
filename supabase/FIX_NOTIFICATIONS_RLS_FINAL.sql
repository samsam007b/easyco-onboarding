-- FIX NOTIFICATIONS RLS POLICIES
-- Date: 28 Octobre 2025
-- Issue: "access control checks" error when loading notifications
-- Root cause: RLS policies are blocking SELECT queries

-- STEP 1: Drop ALL existing policies on notifications table
DO $
$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = 'notifications'
  )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.notifications', r.policyname);
    RAISE NOTICE 'Dropped policy: %', r.policyname;
  END LOOP;
END $
$;

-- STEP 2: Create simple, working policies

-- Allow users to SELECT their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to UPDATE their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to DELETE their own notifications
CREATE POLICY "Users can delete their own notifications"
ON public.notifications
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Allow service_role to INSERT notifications (for system/admin)
CREATE POLICY "Service role can insert notifications"
ON public.notifications
FOR INSERT
TO service_role
WITH CHECK (true);

-- STEP 3: Verify RLS is enabled
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- STEP 4: Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

-- STEP 5: Verify the policies
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'notifications'
ORDER BY policyname;

-- Expected result: 4 policies
-- 1. Users can view their own notifications (SELECT)
-- 2. Users can update their own notifications (UPDATE)
-- 3. Users can delete their own notifications (DELETE)
-- 4. Service role can insert notifications (INSERT)
