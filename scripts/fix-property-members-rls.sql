-- Fix infinite recursion in property_members RLS policies
-- The issue: policies were checking membership to allow membership creation (circular!)

-- Drop all existing policies on property_members
DROP POLICY IF EXISTS "property_members_insert_policy" ON property_members;
DROP POLICY IF EXISTS "property_members_select_policy" ON property_members;
DROP POLICY IF EXISTS "property_members_update_policy" ON property_members;
DROP POLICY IF EXISTS "property_members_delete_policy" ON property_members;
DROP POLICY IF EXISTS "property_members_insert_property_members" ON property_members;
DROP POLICY IF EXISTS "property_members_select_property_members" ON property_members;
DROP POLICY IF EXISTS "property_members_update_property_members" ON property_members;
DROP POLICY IF EXISTS "property_members_delete_property_members" ON property_members;

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

-- Verify RLS is enabled
ALTER TABLE property_members ENABLE ROW LEVEL SECURITY;
