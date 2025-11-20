-- Create SECURITY DEFINER functions to query property_members without RLS issues

-- Function to get user's property membership
CREATE OR REPLACE FUNCTION get_user_property_membership(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT row_to_json(pm.*)
  INTO result
  FROM property_members pm
  WHERE pm.user_id = p_user_id
    AND pm.status = 'active'
  LIMIT 1;

  RETURN result;
END;
$$;

-- Function to get property with membership info
CREATE OR REPLACE FUNCTION get_property_with_membership(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'property', row_to_json(p.*),
    'membership', row_to_json(pm.*)
  )
  INTO result
  FROM property_members pm
  JOIN properties p ON p.id = pm.property_id
  WHERE pm.user_id = p_user_id
    AND pm.status = 'active'
  LIMIT 1;

  RETURN result;
END;
$$;

-- Function to count property members
CREATE OR REPLACE FUNCTION count_property_members(p_property_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  member_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO member_count
  FROM property_members
  WHERE property_id = p_property_id
    AND status = 'active';

  RETURN member_count;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_user_property_membership TO authenticated;
GRANT EXECUTE ON FUNCTION get_property_with_membership TO authenticated;
GRANT EXECUTE ON FUNCTION count_property_members TO authenticated;

-- Verify functions exist
SELECT 'Functions created successfully' as status,
       COUNT(*) as function_count,
       array_agg(proname) as function_names
FROM pg_proc
WHERE proname IN ('get_user_property_membership', 'get_property_with_membership', 'count_property_members');
