-- =====================================================
-- ADMIN INVITATION SYSTEM
-- =====================================================
-- Allows super admins to invite external users to become admins
-- The invitee can create an account directly through a special invite link
-- =====================================================

-- =====================================================
-- TABLE: admin_invitations
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Invitation token for URL (cryptographically secure)
  token VARCHAR(64) NOT NULL UNIQUE,

  -- Invitee information
  email VARCHAR(255) NOT NULL,

  -- What admin role is being invited
  role TEXT NOT NULL CHECK (role IN ('admin', 'super_admin')),

  -- Who created this invitation
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMPTZ,

  -- The user ID after account creation (NULL until accepted)
  accepted_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_admin_invitations_token ON admin_invitations(token);
CREATE INDEX IF NOT EXISTS idx_admin_invitations_email ON admin_invitations(email);
CREATE INDEX IF NOT EXISTS idx_admin_invitations_status ON admin_invitations(status);
CREATE INDEX IF NOT EXISTS idx_admin_invitations_invited_by ON admin_invitations(invited_by);
CREATE INDEX IF NOT EXISTS idx_admin_invitations_pending ON admin_invitations(status, expires_at)
  WHERE status = 'pending';

-- Enable RLS
ALTER TABLE admin_invitations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Admins can view all invitations
CREATE POLICY "Admins can view all invitations"
  ON admin_invitations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
    )
  );

-- Only super_admins can create invitations
CREATE POLICY "Super admins can create invitations"
  ON admin_invitations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Only super_admins can update invitations (cancel, etc.)
CREATE POLICY "Super admins can update invitations"
  ON admin_invitations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- =====================================================
-- FUNCTION: Generate admin invitation token
-- Reuses the same pattern as property invitations
-- =====================================================
CREATE OR REPLACE FUNCTION generate_admin_invitation_token()
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
    SELECT EXISTS(SELECT 1 FROM admin_invitations WHERE token = v_token) INTO v_exists;

    EXIT WHEN NOT v_exists;
  END LOOP;

  RETURN v_token;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Create admin invitation
-- =====================================================
CREATE OR REPLACE FUNCTION create_admin_invitation(
  p_email TEXT,
  p_role TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_token TEXT;
  v_invitation_id UUID;
  v_inviter_email TEXT;
BEGIN
  -- Verify caller is a super_admin
  IF NOT EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
  ) THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'not_authorized',
      'message', 'Seuls les super admins peuvent inviter'
    );
  END IF;

  -- Validate role
  IF p_role NOT IN ('admin', 'super_admin') THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'invalid_role',
      'message', 'Role invalide'
    );
  END IF;

  -- Check if email already has an admin record
  IF EXISTS (
    SELECT 1 FROM public.admins WHERE email = p_email
  ) THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'already_admin',
      'message', 'Cet email est deja administrateur'
    );
  END IF;

  -- Check if there's already a pending invitation for this email
  IF EXISTS (
    SELECT 1 FROM admin_invitations
    WHERE email = p_email
    AND status = 'pending'
    AND expires_at > NOW()
  ) THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'already_invited',
      'message', 'Une invitation est deja en attente pour cet email'
    );
  END IF;

  -- Cancel any expired invitations for this email
  UPDATE admin_invitations
  SET status = 'expired'
  WHERE email = p_email
  AND status = 'pending'
  AND expires_at <= NOW();

  -- Generate token
  v_token := generate_admin_invitation_token();

  -- Get inviter email for logging
  SELECT email INTO v_inviter_email
  FROM auth.users WHERE id = auth.uid();

  -- Create invitation
  INSERT INTO admin_invitations (
    token,
    email,
    role,
    invited_by
  )
  VALUES (
    v_token,
    p_email,
    p_role,
    auth.uid()
  )
  RETURNING id INTO v_invitation_id;

  -- Log the action
  INSERT INTO audit_logs (user_id, action, resource_type, resource_id, metadata)
  VALUES (
    auth.uid(),
    'admin_invitation_created',
    'admin_invitation',
    v_invitation_id::text,
    jsonb_build_object(
      'invited_email', p_email,
      'invited_role', p_role,
      'inviter_email', v_inviter_email
    )
  );

  RETURN jsonb_build_object(
    'success', TRUE,
    'invitation_id', v_invitation_id,
    'token', v_token,
    'email', p_email,
    'role', p_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Validate admin invitation token (public access)
-- Returns invitation details if valid
-- =====================================================
CREATE OR REPLACE FUNCTION validate_admin_invitation_token(p_token TEXT)
RETURNS JSONB AS $$
DECLARE
  v_invitation RECORD;
  v_inviter_email TEXT;
BEGIN
  -- Get invitation
  SELECT * INTO v_invitation
  FROM admin_invitations
  WHERE token = p_token
  AND status = 'pending'
  AND expires_at > NOW();

  IF v_invitation IS NULL THEN
    -- Check if it exists but is not pending
    SELECT status INTO v_invitation
    FROM admin_invitations
    WHERE token = p_token;

    IF v_invitation IS NOT NULL THEN
      IF v_invitation.status = 'accepted' THEN
        RETURN jsonb_build_object(
          'valid', FALSE,
          'error', 'already_used',
          'message', 'Cette invitation a deja ete utilisee'
        );
      ELSIF v_invitation.status = 'cancelled' THEN
        RETURN jsonb_build_object(
          'valid', FALSE,
          'error', 'cancelled',
          'message', 'Cette invitation a ete annulee'
        );
      ELSIF v_invitation.status = 'expired' THEN
        RETURN jsonb_build_object(
          'valid', FALSE,
          'error', 'expired',
          'message', 'Cette invitation a expire'
        );
      END IF;
    END IF;

    RETURN jsonb_build_object(
      'valid', FALSE,
      'error', 'invalid_or_expired',
      'message', 'Cette invitation est invalide ou a expire'
    );
  END IF;

  -- Get inviter email
  SELECT email INTO v_inviter_email
  FROM auth.users WHERE id = v_invitation.invited_by;

  RETURN jsonb_build_object(
    'valid', TRUE,
    'invitation_id', v_invitation.id,
    'email', v_invitation.email,
    'role', v_invitation.role,
    'expires_at', v_invitation.expires_at,
    'inviter_email', v_inviter_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Accept admin invitation
-- Called after user account is created
-- =====================================================
CREATE OR REPLACE FUNCTION accept_admin_invitation(
  p_token TEXT,
  p_user_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_invitation RECORD;
  v_admin_id UUID;
BEGIN
  -- Get invitation
  SELECT * INTO v_invitation
  FROM admin_invitations
  WHERE token = p_token
  AND status = 'pending'
  AND expires_at > NOW();

  IF v_invitation IS NULL THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'invalid_invitation',
      'message', 'Cette invitation est invalide ou a expire'
    );
  END IF;

  -- Check user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'user_not_found',
      'message', 'Utilisateur non trouve'
    );
  END IF;

  -- Create admin record
  INSERT INTO public.admins (
    user_id,
    email,
    role,
    created_by
  )
  VALUES (
    p_user_id,
    v_invitation.email,
    v_invitation.role,
    v_invitation.invited_by
  )
  RETURNING id INTO v_admin_id;

  -- Update invitation status
  UPDATE admin_invitations
  SET
    status = 'accepted',
    accepted_at = NOW(),
    accepted_by_user_id = p_user_id
  WHERE id = v_invitation.id;

  -- Log the action
  INSERT INTO audit_logs (user_id, action, resource_type, resource_id, metadata)
  VALUES (
    p_user_id,
    'admin_invitation_accepted',
    'admin',
    v_admin_id::text,
    jsonb_build_object(
      'email', v_invitation.email,
      'role', v_invitation.role,
      'invitation_id', v_invitation.id
    )
  );

  RETURN jsonb_build_object(
    'success', TRUE,
    'admin_id', v_admin_id,
    'role', v_invitation.role,
    'message', 'Invitation acceptee avec succes'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Cancel admin invitation
-- =====================================================
CREATE OR REPLACE FUNCTION cancel_admin_invitation(p_invitation_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_invitation RECORD;
BEGIN
  -- Verify caller is a super_admin
  IF NOT EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
  ) THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'not_authorized',
      'message', 'Seuls les super admins peuvent annuler les invitations'
    );
  END IF;

  -- Get invitation
  SELECT * INTO v_invitation
  FROM admin_invitations
  WHERE id = p_invitation_id
  AND status = 'pending';

  IF v_invitation IS NULL THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'not_found',
      'message', 'Invitation non trouvee ou deja traitee'
    );
  END IF;

  -- Cancel invitation
  UPDATE admin_invitations
  SET status = 'cancelled'
  WHERE id = p_invitation_id;

  -- Log the action
  INSERT INTO audit_logs (user_id, action, resource_type, resource_id, metadata)
  VALUES (
    auth.uid(),
    'admin_invitation_cancelled',
    'admin_invitation',
    p_invitation_id::text,
    jsonb_build_object(
      'email', v_invitation.email,
      'role', v_invitation.role
    )
  );

  RETURN jsonb_build_object(
    'success', TRUE,
    'message', 'Invitation annulee'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: Get pending admin invitations
-- =====================================================
CREATE OR REPLACE FUNCTION get_pending_admin_invitations()
RETURNS JSONB AS $$
DECLARE
  v_invitations JSONB;
BEGIN
  -- Verify caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
  ) THEN
    RETURN '[]'::jsonb;
  END IF;

  -- First, expire old invitations
  UPDATE admin_invitations
  SET status = 'expired'
  WHERE status = 'pending'
  AND expires_at <= NOW();

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', ai.id,
      'email', ai.email,
      'role', ai.role,
      'status', ai.status,
      'created_at', ai.created_at,
      'expires_at', ai.expires_at,
      'inviter', jsonb_build_object(
        'id', ai.invited_by,
        'email', u.email
      )
    ) ORDER BY ai.created_at DESC
  ), '[]'::jsonb) INTO v_invitations
  FROM admin_invitations ai
  JOIN auth.users u ON u.id = ai.invited_by
  WHERE ai.status = 'pending';

  RETURN v_invitations;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Grant permissions
-- =====================================================
GRANT EXECUTE ON FUNCTION generate_admin_invitation_token() TO authenticated;
GRANT EXECUTE ON FUNCTION create_admin_invitation(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_admin_invitation_token(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION accept_admin_invitation(TEXT, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION cancel_admin_invitation(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_pending_admin_invitations() TO authenticated;

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON TABLE admin_invitations IS 'Stores invitations for external users to become admins';
COMMENT ON COLUMN admin_invitations.token IS 'Cryptographically secure token for invite URL';
COMMENT ON COLUMN admin_invitations.email IS 'Email address of the invited person';
COMMENT ON COLUMN admin_invitations.role IS 'Admin role being granted: admin or super_admin';
COMMENT ON COLUMN admin_invitations.status IS 'Invitation status: pending, accepted, expired, cancelled';
