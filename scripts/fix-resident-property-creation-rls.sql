-- Fix RLS for resident-created properties
-- Allow residents to create properties without being owners

-- Create a SECURITY DEFINER function to create property + membership in one transaction
-- This bypasses RLS policies
CREATE OR REPLACE FUNCTION create_resident_property(
  p_user_id UUID,
  p_title TEXT,
  p_address TEXT,
  p_city TEXT,
  p_postal_code TEXT,
  p_country TEXT,
  p_property_type TEXT,
  p_bedrooms INTEGER,
  p_bathrooms INTEGER,
  p_total_rooms INTEGER,
  p_monthly_rent INTEGER,
  p_available_from DATE,
  p_is_available BOOLEAN,
  p_status TEXT,
  p_invitation_code TEXT,
  p_owner_code TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_property properties%ROWTYPE;
  new_membership property_members%ROWTYPE;
  result JSON;
BEGIN
  -- Create the property (with owner_id = NULL)
  INSERT INTO properties (
    title,
    address,
    city,
    postal_code,
    country,
    property_type,
    bedrooms,
    bathrooms,
    total_rooms,
    monthly_rent,
    available_from,
    is_available,
    status,
    owner_id,
    invitation_code,
    owner_code,
    owner_verified
  ) VALUES (
    p_title,
    p_address,
    p_city,
    p_postal_code,
    p_country,
    p_property_type,
    p_bedrooms,
    p_bathrooms,
    p_total_rooms,
    p_monthly_rent,
    p_available_from,
    p_is_available,
    p_status,
    NULL, -- owner_id is NULL for resident-created properties
    p_invitation_code,
    p_owner_code,
    FALSE -- owner_verified
  )
  RETURNING * INTO new_property;

  -- Create the property membership (user becomes creator resident)
  INSERT INTO property_members (
    property_id,
    user_id,
    role,
    status,
    is_creator
  ) VALUES (
    new_property.id,
    p_user_id,
    'resident',
    'active',
    TRUE -- This user is the creator
  )
  RETURNING * INTO new_membership;

  -- Return both property and membership as JSON
  result := json_build_object(
    'property', row_to_json(new_property),
    'membership', row_to_json(new_membership)
  );

  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_resident_property TO authenticated;

-- Verify function exists
SELECT 'Function created successfully' as status,
       proname as function_name
FROM pg_proc
WHERE proname = 'create_resident_property';
