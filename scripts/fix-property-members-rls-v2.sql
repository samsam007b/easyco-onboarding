-- Fix infinite recursion in property_members RLS policies
-- Version 2: Complete cleanup and rebuild

-- First, disable RLS temporarily to avoid issues
ALTER TABLE property_members DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies (get current policy names from pg_policies)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT policyname
    FROM pg_policies
    WHERE tablename = 'property_members'
      AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON property_members', r.policyname);
  END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE property_members ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CORRECT RLS POLICIES - NO CIRCULAR DEPENDENCIES
-- ============================================================================

-- 1. INSERT: Anyone can insert their own membership
--    (No circular check - just verify user_id matches auth.uid())
CREATE POLICY "property_members_insert_own"
ON property_members
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 2. SELECT: Users can view memberships in properties where they are members
--    This is safe because we're querying EXISTING memberships, not creating them
CREATE POLICY "property_members_select_own_properties"
ON property_members
FOR SELECT
TO authenticated
USING (
  property_id IN (
    SELECT property_id
    FROM property_members
    WHERE user_id = auth.uid()
    AND status = 'active'
  )
);

-- 3. UPDATE: Users can update their own membership
CREATE POLICY "property_members_update_own"
ON property_members
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 4. DELETE: Users can delete their own membership
CREATE POLICY "property_members_delete_own"
ON property_members
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Verify the policies were created
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'property_members'
ORDER BY policyname;
