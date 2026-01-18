-- ============================================================================
-- CREATE RESIDENT PROPERTY FUNCTION
-- Creates a property and assigns the creator as main_resident with is_creator=TRUE
-- ============================================================================

CREATE OR REPLACE FUNCTION create_resident_property(
  p_user_id UUID,
  p_title TEXT,
  p_address TEXT,
  p_city TEXT,
  p_postal_code TEXT DEFAULT NULL,
  p_country TEXT DEFAULT 'France',
  p_property_type TEXT DEFAULT 'coliving',
  p_bedrooms INTEGER DEFAULT 1,
  p_bathrooms INTEGER DEFAULT 1,
  p_total_rooms INTEGER DEFAULT 2,
  p_monthly_rent DECIMAL DEFAULT 0,
  p_available_from DATE DEFAULT CURRENT_DATE,
  p_is_available BOOLEAN DEFAULT FALSE,
  p_status TEXT DEFAULT 'draft',
  p_invitation_code TEXT DEFAULT NULL,
  p_owner_code TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_property_id UUID;
  v_membership_id UUID;
  v_property_data JSON;
  v_membership_data JSON;
  v_result JSON;
BEGIN
  -- Create the property
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
    invitation_code,
    owner_code,
    created_at,
    updated_at
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
    p_invitation_code,
    p_owner_code,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_property_id;

  -- Create property membership with is_creator = TRUE and role = main_resident
  INSERT INTO property_members (
    property_id,
    user_id,
    role,
    status,
    is_creator,
    move_in_date,
    created_at,
    updated_at
  ) VALUES (
    v_property_id,
    p_user_id,
    'main_resident', -- Role for creator with elevated permissions
    'active',
    TRUE, -- This user created the property
    CURRENT_DATE,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_membership_id;

  -- Get property data
  SELECT json_build_object(
    'id', id,
    'title', title,
    'address', address,
    'city', city,
    'postal_code', postal_code,
    'country', country,
    'invitation_code', invitation_code,
    'owner_code', owner_code,
    'status', status
  ) INTO v_property_data
  FROM properties
  WHERE id = v_property_id;

  -- Get membership data
  SELECT json_build_object(
    'id', id,
    'property_id', property_id,
    'user_id', user_id,
    'role', role,
    'is_creator', is_creator,
    'status', status
  ) INTO v_membership_data
  FROM property_members
  WHERE id = v_membership_id;

  -- Build result
  v_result := json_build_object(
    'property', v_property_data,
    'membership', v_membership_data
  );

  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating property: %', SQLERRM;
END;
$$;

COMMENT ON FUNCTION create_resident_property IS 'Creates a property and assigns the creator as main_resident with full permissions (is_creator=TRUE)';

-- ============================================================================
-- JOIN PROPERTY FUNCTION
-- Allows a user to join an existing property as a standard resident
-- ============================================================================

CREATE OR REPLACE FUNCTION join_property_as_resident(
  p_user_id UUID,
  p_invitation_code TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_property_id UUID;
  v_membership_id UUID;
  v_property_data JSON;
  v_membership_data JSON;
  v_result JSON;
BEGIN
  -- Find property by invitation code
  SELECT id INTO v_property_id
  FROM properties
  WHERE invitation_code = UPPER(TRIM(p_invitation_code))
  LIMIT 1;

  IF v_property_id IS NULL THEN
    RAISE EXCEPTION 'Invalid invitation code';
  END IF;

  -- Check if user is already a member
  IF EXISTS (
    SELECT 1 FROM property_members
    WHERE property_id = v_property_id
    AND user_id = p_user_id
    AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'User is already a member of this property';
  END IF;

  -- Create property membership as standard resident (NOT creator)
  INSERT INTO property_members (
    property_id,
    user_id,
    role,
    status,
    is_creator, -- FALSE for users joining via invitation
    move_in_date,
    created_at,
    updated_at
  ) VALUES (
    v_property_id,
    p_user_id,
    'resident', -- Standard resident role
    'active',
    FALSE, -- Not the creator
    CURRENT_DATE,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_membership_id;

  -- Get property data
  SELECT json_build_object(
    'id', id,
    'title', title,
    'address', address,
    'city', city,
    'postal_code', postal_code,
    'country', country,
    'invitation_code', invitation_code
  ) INTO v_property_data
  FROM properties
  WHERE id = v_property_id;

  -- Get membership data
  SELECT json_build_object(
    'id', id,
    'property_id', property_id,
    'user_id', user_id,
    'role', role,
    'is_creator', is_creator,
    'status', status
  ) INTO v_membership_data
  FROM property_members
  WHERE id = v_membership_id;

  -- Build result
  v_result := json_build_object(
    'property', v_property_data,
    'membership', v_membership_data
  );

  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error joining property: %', SQLERRM;
END;
$$;

COMMENT ON FUNCTION join_property_as_resident IS 'Allows a user to join an existing property as a standard resident (is_creator=FALSE, role=resident)';

-- ============================================================================
-- CLAIM PROPERTY AS OWNER FUNCTION
-- Allows the legal owner to claim property using owner_code
-- ============================================================================

CREATE OR REPLACE FUNCTION claim_property_as_owner(
  p_user_id UUID,
  p_owner_code TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_property_id UUID;
  v_membership_id UUID;
  v_existing_membership UUID;
  v_property_data JSON;
  v_membership_data JSON;
  v_result JSON;
BEGIN
  -- Find property by owner code
  SELECT id INTO v_property_id
  FROM properties
  WHERE owner_code = UPPER(TRIM(p_owner_code))
  LIMIT 1;

  IF v_property_id IS NULL THEN
    RAISE EXCEPTION 'Invalid owner code';
  END IF;

  -- Check if user already has a membership
  SELECT id INTO v_existing_membership
  FROM property_members
  WHERE property_id = v_property_id
  AND user_id = p_user_id
  AND status = 'active'
  LIMIT 1;

  IF v_existing_membership IS NOT NULL THEN
    -- Update existing membership to owner role
    UPDATE property_members
    SET role = 'owner',
        updated_at = NOW()
    WHERE id = v_existing_membership
    RETURNING id INTO v_membership_id;
  ELSE
    -- Create new property membership as owner
    INSERT INTO property_members (
      property_id,
      user_id,
      role,
      status,
      is_creator,
      move_in_date,
      created_at,
      updated_at
    ) VALUES (
      v_property_id,
      p_user_id,
      'owner', -- Owner role with full permissions
      'active',
      FALSE, -- Owner is not necessarily the creator
      CURRENT_DATE,
      NOW(),
      NOW()
    )
    RETURNING id INTO v_membership_id;
  END IF;

  -- Get property data
  SELECT json_build_object(
    'id', id,
    'title', title,
    'address', address,
    'city', city,
    'postal_code', postal_code,
    'country', country,
    'invitation_code', invitation_code,
    'owner_code', owner_code
  ) INTO v_property_data
  FROM properties
  WHERE id = v_property_id;

  -- Get membership data
  SELECT json_build_object(
    'id', id,
    'property_id', property_id,
    'user_id', user_id,
    'role', role,
    'is_creator', is_creator,
    'status', status
  ) INTO v_membership_data
  FROM property_members
  WHERE id = v_membership_id;

  -- Build result
  v_result := json_build_object(
    'property', v_property_data,
    'membership', v_membership_data
  );

  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error claiming property: %', SQLERRM;
END;
$$;

COMMENT ON FUNCTION claim_property_as_owner IS 'Allows the legal property owner to claim ownership using the owner_code';
