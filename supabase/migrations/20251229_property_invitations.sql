-- =====================================================
-- PROPERTY INVITATION SYSTEM
-- =====================================================
-- Tracks individual invitations to join properties
-- Replaces generic invitation_code with trackable links
-- =====================================================

-- =====================================================
-- TABLE: property_invitations
-- =====================================================
CREATE TABLE IF NOT EXISTS property_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Invitation token for URL (cryptographically secure)
  token VARCHAR(64) NOT NULL UNIQUE,

  -- Who created this invitation
  inviter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Which property this is for
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,

  -- What role is being invited (owner or resident)
  invited_role TEXT NOT NULL CHECK (invited_role IN ('owner', 'resident')),

  -- Optional: invitee email (for tracking who was invited)
  invitee_email VARCHAR(255),

  -- The user who accepted/refused (NULL until claimed)
  invitee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'refused', 'expired', 'cancelled')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  responded_at TIMESTAMPTZ,

  -- Metadata (for analytics)
  clicked_count INTEGER DEFAULT 0,
  last_clicked_at TIMESTAMPTZ
);

-- Indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_property_invitations_token ON property_invitations(token);
CREATE INDEX IF NOT EXISTS idx_property_invitations_inviter ON property_invitations(inviter_id);
CREATE INDEX IF NOT EXISTS idx_property_invitations_property ON property_invitations(property_id);
CREATE INDEX IF NOT EXISTS idx_property_invitations_invitee ON property_invitations(invitee_id);
CREATE INDEX IF NOT EXISTS idx_property_invitations_status ON property_invitations(status);
CREATE INDEX IF NOT EXISTS idx_property_invitations_pending ON property_invitations(status, expires_at)
  WHERE status = 'pending';

-- Enable RLS
ALTER TABLE property_invitations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Inviters can view their own invitations
CREATE POLICY "Inviters can view own invitations"
  ON property_invitations
  FOR SELECT
  USING (inviter_id = auth.uid());

-- Invitees can view invitations addressed to them
CREATE POLICY "Invitees can view their invitations"
  ON property_invitations
  FOR SELECT
  USING (invitee_id = auth.uid());

-- Property members can create invitations
CREATE POLICY "Property members can create invitations"
  ON property_invitations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM property_members
      WHERE property_members.property_id = property_invitations.property_id
      AND property_members.user_id = auth.uid()
      AND property_members.status = 'active'
    )
  );

-- Invitees can update their invitations (accept/refuse)
CREATE POLICY "Invitees can update their invitations"
  ON property_invitations
  FOR UPDATE
  USING (invitee_id = auth.uid() OR invitee_id IS NULL)
  WITH CHECK (invitee_id = auth.uid() OR invitee_id IS NULL);

-- =====================================================
-- FUNCTION: Generate secure invitation token
-- =====================================================
CREATE OR REPLACE FUNCTION generate_invitation_token()
RETURNS TEXT AS $$
DECLARE
  v_token TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 24-byte random token, encoded as base64url (32 chars)
    v_token := encode(gen_random_bytes(24), 'base64');
    -- Replace URL-unsafe characters
    v_token := replace(replace(v_token, '+', '-'), '/', '_');
    -- Remove padding
    v_token := rtrim(v_token, '=');

    -- Check if token already exists
    SELECT EXISTS(SELECT 1 FROM property_invitations WHERE token = v_token) INTO v_exists;

    EXIT WHEN NOT v_exists;
  END LOOP;

  RETURN v_token;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Create property invitation
-- =====================================================
CREATE OR REPLACE FUNCTION create_property_invitation(
  p_property_id UUID,
  p_invited_role TEXT,
  p_invitee_email TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_token TEXT;
  v_invitation_id UUID;
  v_inviter_name TEXT;
  v_property_title TEXT;
  v_property_address TEXT;
  v_property_city TEXT;
BEGIN
  -- Verify caller is a member of the property
  IF NOT EXISTS (
    SELECT 1 FROM property_members
    WHERE property_id = p_property_id
    AND user_id = auth.uid()
    AND status = 'active'
  ) THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'not_member',
      'message', 'Vous devez etre membre de cette residence'
    );
  END IF;

  -- Validate role
  IF p_invited_role NOT IN ('owner', 'resident') THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'invalid_role',
      'message', 'Role invalide'
    );
  END IF;

  -- Generate token
  v_token := generate_invitation_token();

  -- Create invitation
  INSERT INTO property_invitations (
    token,
    inviter_id,
    property_id,
    invited_role,
    invitee_email
  )
  VALUES (
    v_token,
    auth.uid(),
    p_property_id,
    p_invited_role,
    p_invitee_email
  )
  RETURNING id INTO v_invitation_id;

  -- Get inviter name from user_profiles
  SELECT COALESCE(first_name || ' ' || last_name, 'Utilisateur') INTO v_inviter_name
  FROM user_profiles WHERE user_id = auth.uid();

  -- Fallback to users table if no profile
  IF v_inviter_name IS NULL OR v_inviter_name = ' ' THEN
    SELECT COALESCE(full_name, email) INTO v_inviter_name
    FROM users WHERE id = auth.uid();
  END IF;

  -- Get property info
  SELECT title, address, city INTO v_property_title, v_property_address, v_property_city
  FROM properties WHERE id = p_property_id;

  RETURN jsonb_build_object(
    'success', TRUE,
    'invitation_id', v_invitation_id,
    'token', v_token,
    'inviter_name', v_inviter_name,
    'property_title', v_property_title,
    'property_address', v_property_address,
    'property_city', v_property_city,
    'invited_role', p_invited_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Validate invitation token (public access)
-- Returns invitation details if valid
-- =====================================================
CREATE OR REPLACE FUNCTION validate_invitation_token(p_token TEXT)
RETURNS JSONB AS $$
DECLARE
  v_invitation RECORD;
  v_inviter_name TEXT;
  v_inviter_avatar TEXT;
  v_property RECORD;
BEGIN
  -- Get invitation
  SELECT * INTO v_invitation
  FROM property_invitations
  WHERE token = p_token
  AND status = 'pending'
  AND expires_at > NOW();

  IF v_invitation IS NULL THEN
    -- Check if it exists but is not pending
    SELECT status INTO v_invitation
    FROM property_invitations
    WHERE token = p_token;

    IF v_invitation IS NOT NULL THEN
      RETURN jsonb_build_object(
        'valid', FALSE,
        'error', 'already_used',
        'message', 'Cette invitation a deja ete utilisee'
      );
    END IF;

    RETURN jsonb_build_object(
      'valid', FALSE,
      'error', 'invalid_or_expired',
      'message', 'Cette invitation est invalide ou a expire'
    );
  END IF;

  -- Get inviter info from user_profiles
  SELECT
    COALESCE(first_name || ' ' || last_name, 'Utilisateur'),
    profile_photo_url
  INTO v_inviter_name, v_inviter_avatar
  FROM user_profiles WHERE user_id = v_invitation.inviter_id;

  -- Fallback to users table
  IF v_inviter_name IS NULL OR v_inviter_name = ' ' THEN
    SELECT COALESCE(full_name, split_part(email, '@', 1)) INTO v_inviter_name
    FROM users WHERE id = v_invitation.inviter_id;
  END IF;

  -- Get property info
  SELECT id, title, address, city, images INTO v_property
  FROM properties WHERE id = v_invitation.property_id;

  -- Increment click count
  UPDATE property_invitations
  SET clicked_count = clicked_count + 1,
      last_clicked_at = NOW()
  WHERE id = v_invitation.id;

  RETURN jsonb_build_object(
    'valid', TRUE,
    'invitation_id', v_invitation.id,
    'invited_role', v_invitation.invited_role,
    'expires_at', v_invitation.expires_at,
    'inviter', jsonb_build_object(
      'id', v_invitation.inviter_id,
      'name', v_inviter_name,
      'avatar_url', v_inviter_avatar
    ),
    'property', jsonb_build_object(
      'id', v_property.id,
      'title', v_property.title,
      'address', v_property.address,
      'city', v_property.city,
      'image', CASE
        WHEN v_property.images IS NOT NULL AND jsonb_array_length(v_property.images) > 0
        THEN v_property.images->0->>'url'
        ELSE NULL
      END
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Accept invitation
-- =====================================================
CREATE OR REPLACE FUNCTION accept_property_invitation(p_invitation_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_invitation RECORD;
  v_user_id UUID := auth.uid();
  v_existing_membership UUID;
  v_property_title TEXT;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'not_authenticated',
      'message', 'Vous devez etre connecte'
    );
  END IF;

  -- Get invitation
  SELECT * INTO v_invitation
  FROM property_invitations
  WHERE id = p_invitation_id
  AND status = 'pending'
  AND expires_at > NOW();

  IF v_invitation IS NULL THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'invalid_invitation',
      'message', 'Cette invitation est invalide ou a expire'
    );
  END IF;

  -- Check if user already has an active membership to this property
  SELECT id INTO v_existing_membership
  FROM property_members
  WHERE property_id = v_invitation.property_id
  AND user_id = v_user_id
  AND status = 'active';

  IF v_existing_membership IS NOT NULL THEN
    -- Mark invitation as accepted anyway
    UPDATE property_invitations
    SET status = 'accepted',
        invitee_id = v_user_id,
        responded_at = NOW()
    WHERE id = p_invitation_id;

    SELECT title INTO v_property_title FROM properties WHERE id = v_invitation.property_id;

    RETURN jsonb_build_object(
      'success', TRUE,
      'already_member', TRUE,
      'property_id', v_invitation.property_id,
      'property_title', v_property_title,
      'message', 'Vous etes deja membre de cette residence'
    );
  END IF;

  -- Create property membership
  INSERT INTO property_members (
    property_id,
    user_id,
    role,
    status,
    is_creator
  )
  VALUES (
    v_invitation.property_id,
    v_user_id,
    v_invitation.invited_role,
    'active',
    FALSE
  );

  -- Mark invitation as accepted
  UPDATE property_invitations
  SET status = 'accepted',
      invitee_id = v_user_id,
      responded_at = NOW()
  WHERE id = p_invitation_id;

  SELECT title INTO v_property_title FROM properties WHERE id = v_invitation.property_id;

  RETURN jsonb_build_object(
    'success', TRUE,
    'property_id', v_invitation.property_id,
    'property_title', v_property_title,
    'role', v_invitation.invited_role,
    'message', 'Vous avez rejoint la residence avec succes'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Refuse invitation
-- =====================================================
CREATE OR REPLACE FUNCTION refuse_property_invitation(p_invitation_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_invitation RECORD;
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'not_authenticated',
      'message', 'Vous devez etre connecte'
    );
  END IF;

  -- Get invitation (allow refusing pending invitations)
  SELECT * INTO v_invitation
  FROM property_invitations
  WHERE id = p_invitation_id
  AND status = 'pending';

  IF v_invitation IS NULL THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'invalid_invitation',
      'message', 'Cette invitation est invalide'
    );
  END IF;

  -- Mark invitation as refused
  UPDATE property_invitations
  SET status = 'refused',
      invitee_id = v_user_id,
      responded_at = NOW()
  WHERE id = p_invitation_id;

  RETURN jsonb_build_object(
    'success', TRUE,
    'message', 'Invitation refusee'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Get user's received invitations
-- =====================================================
CREATE OR REPLACE FUNCTION get_my_received_invitations()
RETURNS JSONB AS $$
DECLARE
  v_invitations JSONB;
  v_user_id UUID := auth.uid();
  v_user_email TEXT;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN '[]'::jsonb;
  END IF;

  -- Get user's email
  SELECT email INTO v_user_email
  FROM auth.users WHERE id = v_user_id;

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', pi.id,
      'status', pi.status,
      'invited_role', pi.invited_role,
      'created_at', pi.created_at,
      'responded_at', pi.responded_at,
      'expires_at', pi.expires_at,
      'inviter', jsonb_build_object(
        'id', pi.inviter_id,
        'name', COALESCE(up.first_name || ' ' || up.last_name, u.full_name, 'Utilisateur'),
        'avatar_url', up.profile_photo_url
      ),
      'property', jsonb_build_object(
        'id', p.id,
        'title', p.title,
        'address', p.address,
        'city', p.city,
        'image', CASE
          WHEN p.images IS NOT NULL AND jsonb_array_length(p.images) > 0
          THEN p.images->0->>'url'
          ELSE NULL
        END
      )
    ) ORDER BY
      CASE pi.status WHEN 'pending' THEN 0 ELSE 1 END,
      pi.created_at DESC
  ), '[]'::jsonb) INTO v_invitations
  FROM property_invitations pi
  LEFT JOIN users u ON u.id = pi.inviter_id
  LEFT JOIN user_profiles up ON up.user_id = pi.inviter_id
  JOIN properties p ON p.id = pi.property_id
  WHERE pi.invitee_id = v_user_id
     OR (pi.invitee_email = v_user_email AND pi.invitee_id IS NULL);

  RETURN v_invitations;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Link pending invitations to user after signup
-- Called after signup to associate pending invitations by email
-- =====================================================
CREATE OR REPLACE FUNCTION link_pending_invitations_to_user(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_email TEXT;
  v_count INTEGER;
BEGIN
  -- Get user's email
  SELECT email INTO v_email
  FROM auth.users WHERE id = p_user_id;

  IF v_email IS NULL THEN
    RETURN 0;
  END IF;

  -- Link pending invitations that match this email
  UPDATE property_invitations
  SET invitee_id = p_user_id
  WHERE invitee_email = v_email
  AND invitee_id IS NULL
  AND status = 'pending';

  GET DIAGNOSTICS v_count = ROW_COUNT;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Get sent invitations for a property
-- =====================================================
CREATE OR REPLACE FUNCTION get_property_sent_invitations(p_property_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_invitations JSONB;
BEGIN
  -- Verify caller is a member of the property
  IF NOT EXISTS (
    SELECT 1 FROM property_members
    WHERE property_id = p_property_id
    AND user_id = auth.uid()
    AND status = 'active'
  ) THEN
    RETURN '[]'::jsonb;
  END IF;

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', pi.id,
      'status', pi.status,
      'invited_role', pi.invited_role,
      'invitee_email', pi.invitee_email,
      'created_at', pi.created_at,
      'expires_at', pi.expires_at,
      'clicked_count', pi.clicked_count,
      'invitee', CASE WHEN pi.invitee_id IS NOT NULL THEN
        jsonb_build_object(
          'id', pi.invitee_id,
          'name', COALESCE(up.first_name || ' ' || up.last_name, 'Utilisateur'),
          'avatar_url', up.profile_photo_url
        )
      ELSE NULL END
    ) ORDER BY pi.created_at DESC
  ), '[]'::jsonb) INTO v_invitations
  FROM property_invitations pi
  LEFT JOIN user_profiles up ON up.user_id = pi.invitee_id
  WHERE pi.property_id = p_property_id
  AND pi.inviter_id = auth.uid();

  RETURN v_invitations;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Grant permissions
-- =====================================================
GRANT EXECUTE ON FUNCTION generate_invitation_token() TO authenticated;
GRANT EXECUTE ON FUNCTION create_property_invitation(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_invitation_token(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION accept_property_invitation(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION refuse_property_invitation(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_my_received_invitations() TO authenticated;
GRANT EXECUTE ON FUNCTION link_pending_invitations_to_user(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_property_sent_invitations(UUID) TO authenticated;
