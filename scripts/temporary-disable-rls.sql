-- TEMPORARY: Disable RLS on property_members to test
-- This is NOT secure for production, but will help us diagnose the issue

-- Disable RLS on property_members (TEMPORARY!)
ALTER TABLE property_members DISABLE ROW LEVEL SECURITY;

-- Keep simple RLS on properties
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

-- Simple policies for properties (no subqueries)
CREATE POLICY "properties_select_own"
ON properties
FOR SELECT
TO authenticated
USING (owner_id = auth.uid());

CREATE POLICY "properties_insert_own"
ON properties
FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "properties_update_own"
ON properties
FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "properties_delete_own"
ON properties
FOR DELETE
TO authenticated
USING (owner_id = auth.uid());

-- Verify
SELECT 'RLS STATUS:' as info;
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('properties', 'property_members')
  AND schemaname = 'public';
