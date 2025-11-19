-- Fix RLS policies for property_members AND properties
-- This ensures the subqueries work correctly

-- ============================================================================
-- PART 1: FIX PROPERTIES TABLE RLS POLICIES
-- ============================================================================

-- Drop all existing policies on properties
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT policyname
    FROM pg_policies
    WHERE tablename = 'properties'
      AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON properties', r.policyname);
  END LOOP;
END $$;

-- Create simple policies for properties table
-- 1. SELECT: Users can see properties they own OR properties they are members of
CREATE POLICY "properties_select_own_or_member"
ON properties
FOR SELECT
TO authenticated
USING (
  owner_id = auth.uid()  -- Can see properties you own
  OR
  id IN (  -- Can see properties you're a member of
    SELECT property_id FROM property_members
    WHERE user_id = auth.uid()
    AND status = 'active'
  )
);

-- 2. INSERT: Users can create properties
CREATE POLICY "properties_insert_own"
ON properties
FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

-- 3. UPDATE: Only owners can update their properties
CREATE POLICY "properties_update_own"
ON properties
FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- 4. DELETE: Only owners can delete their properties
CREATE POLICY "properties_delete_own"
ON properties
FOR DELETE
TO authenticated
USING (owner_id = auth.uid());

-- ============================================================================
-- PART 2: FIX PROPERTY_MEMBERS TABLE RLS POLICIES
-- ============================================================================

-- Disable RLS temporarily
ALTER TABLE property_members DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on property_members
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

-- Create property_members policies
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
--     Now this will work because properties table allows SELECT
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

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify properties policies
SELECT 'PROPERTIES POLICIES:' as info;
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'properties'
ORDER BY policyname;

-- Verify property_members policies
SELECT 'PROPERTY_MEMBERS POLICIES:' as info;
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'property_members'
ORDER BY policyname;
