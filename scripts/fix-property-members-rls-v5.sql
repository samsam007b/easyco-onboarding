-- Fix infinite recursion in property_members RLS policies
-- Version 5: SEPARATE POLICIES for better performance and reliability

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
-- FINAL RLS POLICIES - TWO SEPARATE SELECT POLICIES FOR BETTER PERFORMANCE
-- ============================================================================

-- 1. INSERT: Anyone can insert their own membership
CREATE POLICY "property_members_insert_own"
ON property_members
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 2a. SELECT: Users can ALWAYS view their own memberships (SIMPLE, NO JOINS)
CREATE POLICY "property_members_select_own"
ON property_members
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 2b. SELECT: Property owners can view ALL members of their properties
--     This is a SEPARATE policy to avoid complex OR conditions
CREATE POLICY "property_members_select_as_owner"
ON property_members
FOR SELECT
TO authenticated
USING (
  property_id IN (
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
