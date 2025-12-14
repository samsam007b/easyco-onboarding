-- ============================================================================
-- ADD PROPERTY MEMBER ROLES AND CREATOR FLAG
-- Adds is_creator field and extends roles to include owner
-- ============================================================================

-- Add is_creator column to track who created the property
ALTER TABLE property_members
ADD COLUMN IF NOT EXISTS is_creator BOOLEAN DEFAULT FALSE;

-- Update role constraint to include 'owner'
ALTER TABLE property_members
DROP CONSTRAINT IF EXISTS property_members_role_check;

ALTER TABLE property_members
ADD CONSTRAINT property_members_role_check
CHECK (role IN ('resident', 'tenant', 'roommate', 'owner', 'main_resident'));

-- Create index for faster queries on creator
CREATE INDEX IF NOT EXISTS idx_property_members_is_creator
ON property_members(is_creator) WHERE is_creator = TRUE;

-- Create index for role-based queries
CREATE INDEX IF NOT EXISTS idx_property_members_role
ON property_members(role);

-- Add comments
COMMENT ON COLUMN property_members.is_creator IS 'TRUE if this user created the property (main resident)';
COMMENT ON COLUMN property_members.role IS 'User role: resident (standard), main_resident (creator with full access), owner (property owner), tenant, roommate';

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to check if user is the creator of a property
CREATE OR REPLACE FUNCTION is_property_creator(p_user_id UUID, p_property_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM property_members
    WHERE property_id = p_property_id
    AND user_id = p_user_id
    AND is_creator = TRUE
    AND status = 'active'
  );
END;
$$;

-- Function to check if user is property owner
CREATE OR REPLACE FUNCTION is_property_owner(p_user_id UUID, p_property_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM property_members
    WHERE property_id = p_property_id
    AND user_id = p_user_id
    AND role = 'owner'
    AND status = 'active'
  );
END;
$$;

-- Function to get user's role in a property
CREATE OR REPLACE FUNCTION get_user_property_role(p_user_id UUID, p_property_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role
  FROM property_members
  WHERE property_id = p_property_id
  AND user_id = p_user_id
  AND status = 'active'
  LIMIT 1;

  RETURN v_role;
END;
$$;

-- ============================================================================
-- PERMISSIONS TABLE
-- Define what each role can do
-- ============================================================================

CREATE TABLE IF NOT EXISTS property_role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL CHECK (role IN ('resident', 'main_resident', 'owner')),
  permission TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(role, permission)
);

-- Insert default permissions
INSERT INTO property_role_permissions (role, permission, description) VALUES
-- Owner permissions (full access)
('owner', 'view_property', 'Can view property details'),
('owner', 'edit_property', 'Can edit property information'),
('owner', 'delete_property', 'Can delete the property'),
('owner', 'manage_members', 'Can add/remove members'),
('owner', 'view_invitation_codes', 'Can view invitation codes'),
('owner', 'view_owner_code', 'Can view owner code'),
('owner', 'manage_documents', 'Can upload/delete documents'),
('owner', 'manage_finances', 'Full access to finances'),
('owner', 'manage_rules', 'Can create/edit/delete rules'),

-- Main resident permissions (creator - elevated access)
('main_resident', 'view_property', 'Can view property details'),
('main_resident', 'edit_property', 'Can edit basic property information'),
('main_resident', 'manage_members', 'Can invite members'),
('main_resident', 'view_invitation_codes', 'Can view and share invitation codes'),
('main_resident', 'view_owner_code', 'Can view owner code (to give to real owner)'),
('main_resident', 'manage_documents', 'Can upload documents'),
('main_resident', 'manage_finances', 'Can create expenses and manage finance'),
('main_resident', 'manage_rules', 'Can propose and vote on rules'),

-- Standard resident permissions (limited access)
('resident', 'view_property', 'Can view property details'),
('resident', 'view_invitation_codes', 'Can view invitation codes to invite others'),
('resident', 'manage_finances', 'Can add expenses and view finances'),
('resident', 'manage_rules', 'Can vote on rules'),
('resident', 'upload_documents', 'Can upload personal documents')
ON CONFLICT (role, permission) DO NOTHING;

-- Create index on permissions
CREATE INDEX IF NOT EXISTS idx_property_role_permissions_role
ON property_role_permissions(role);

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION user_has_permission(
  p_user_id UUID,
  p_property_id UUID,
  p_permission TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_role TEXT;
  v_has_permission BOOLEAN;
BEGIN
  -- Get user's role
  SELECT role INTO v_user_role
  FROM property_members
  WHERE property_id = p_property_id
  AND user_id = p_user_id
  AND status = 'active'
  LIMIT 1;

  -- If no role found, no permission
  IF v_user_role IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Check if role has permission
  SELECT EXISTS (
    SELECT 1 FROM property_role_permissions
    WHERE role = v_user_role
    AND permission = p_permission
  ) INTO v_has_permission;

  RETURN v_has_permission;
END;
$$;

COMMENT ON FUNCTION user_has_permission IS 'Check if a user has a specific permission in a property based on their role';
COMMENT ON TABLE property_role_permissions IS 'Defines permissions for each property member role';
