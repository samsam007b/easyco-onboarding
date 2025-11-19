-- Fix infinite recursion in property_members RLS policies
-- Version 4: FINAL - Allow viewing members of your properties WITHOUT recursion

-- First, disable RLS temporarily
ALTER TABLE property_members DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
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
-- FINAL RLS POLICIES - NO RECURSION, FULL FUNCTIONALITY
-- ============================================================================

-- 1. INSERT: Anyone can insert their own membership
CREATE POLICY "property_members_insert_own"
ON property_members
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 2. SELECT: Users can view memberships in two scenarios:
--    a) Their own memberships
--    b) All memberships of properties they own
--    This avoids recursion by checking the PROPERTIES table, not property_members!
CREATE POLICY "property_members_select_own_and_owned_properties"
ON property_members
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()  -- Can see your own memberships
  OR
  property_id IN (  -- Can see all members of properties you own
    SELECT id FROM properties
    WHERE owner_id = auth.uid()
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
