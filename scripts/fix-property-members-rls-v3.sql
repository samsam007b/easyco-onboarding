-- Fix infinite recursion in property_members RLS policies
-- Version 3: FULLY NON-CIRCULAR POLICIES

-- First, disable RLS temporarily to avoid issues
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
-- CORRECT RLS POLICIES - ZERO CIRCULAR DEPENDENCIES
-- ============================================================================

-- 1. INSERT: Anyone can insert their own membership
--    Simple check: user_id must match authenticated user
CREATE POLICY "property_members_insert_own"
ON property_members
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 2. SELECT: Users can ONLY view their own memberships
--    Simple check: user_id must match authenticated user
--    (We'll handle viewing other members through a separate mechanism if needed)
CREATE POLICY "property_members_select_own"
ON property_members
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

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
-- Optional: Function to get members of user's properties (non-RLS approach)
-- ============================================================================
-- If you need to show all members of a property, use this function instead of SELECT

CREATE OR REPLACE FUNCTION get_property_members(p_property_id UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  property_id UUID,
  user_id UUID,
  role TEXT,
  status TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- If property_id is provided, check user is a member
  IF p_property_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM property_members
      WHERE property_id = p_property_id
      AND user_id = auth.uid()
      AND status = 'active'
    ) THEN
      RAISE EXCEPTION 'Not authorized to view members of this property';
    END IF;

    -- Return all members of that property
    RETURN QUERY
    SELECT pm.id, pm.property_id, pm.user_id, pm.role, pm.status, pm.created_at, pm.updated_at
    FROM property_members pm
    WHERE pm.property_id = p_property_id;
  ELSE
    -- Return members of all properties the user belongs to
    RETURN QUERY
    SELECT pm.id, pm.property_id, pm.user_id, pm.role, pm.status, pm.created_at, pm.updated_at
    FROM property_members pm
    WHERE pm.property_id IN (
      SELECT property_id FROM property_members
      WHERE user_id = auth.uid() AND status = 'active'
    );
  END IF;
END;
$$;

-- Verify the policies were created
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'property_members'
ORDER BY policyname;
