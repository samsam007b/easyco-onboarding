-- Create SECURITY DEFINER function to handle membership creation
-- This bypasses RLS policies

-- First, re-enable RLS on property_members (good practice)
ALTER TABLE property_members ENABLE ROW LEVEL SECURITY;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS create_property_membership(uuid, uuid, text);

-- Create function to insert membership and return it
CREATE OR REPLACE FUNCTION create_property_membership(
  p_property_id UUID,
  p_user_id UUID,
  p_role TEXT DEFAULT 'resident'
)
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
  -- Verify the user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Verify the user is creating their own membership
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Can only create membership for yourself';
  END IF;

  -- Check if membership already exists
  IF EXISTS (
    SELECT 1 FROM property_members
    WHERE property_members.property_id = p_property_id
    AND property_members.user_id = p_user_id
  ) THEN
    -- Return existing membership
    RETURN QUERY
    SELECT pm.id, pm.property_id, pm.user_id, pm.role, pm.status, pm.created_at, pm.updated_at
    FROM property_members pm
    WHERE pm.property_id = p_property_id
    AND pm.user_id = p_user_id;
  ELSE
    -- Insert new membership and return it
    RETURN QUERY
    INSERT INTO property_members (property_id, user_id, role, status)
    VALUES (p_property_id, p_user_id, p_role, 'active')
    RETURNING property_members.id, property_members.property_id, property_members.user_id,
              property_members.role, property_members.status, property_members.created_at,
              property_members.updated_at;
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_property_membership(uuid, uuid, text) TO authenticated;

-- Create function to get user's property membership
DROP FUNCTION IF EXISTS get_my_property_membership();

CREATE OR REPLACE FUNCTION get_my_property_membership()
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
  -- Verify the user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Return user's active membership
  RETURN QUERY
  SELECT pm.id, pm.property_id, pm.user_id, pm.role, pm.status, pm.created_at, pm.updated_at
  FROM property_members pm
  WHERE pm.user_id = auth.uid()
  AND pm.status = 'active'
  LIMIT 1;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_my_property_membership() TO authenticated;

-- Create function to count members of a property
DROP FUNCTION IF EXISTS count_property_members(uuid);

CREATE OR REPLACE FUNCTION count_property_members(p_property_id UUID)
RETURNS INTEGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  member_count INTEGER;
BEGIN
  -- Count active members
  SELECT COUNT(*)
  INTO member_count
  FROM property_members
  WHERE property_id = p_property_id
  AND status = 'active';

  RETURN member_count;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION count_property_members(uuid) TO authenticated;

-- Verify functions were created
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('create_property_membership', 'get_my_property_membership', 'count_property_members')
ORDER BY routine_name;
