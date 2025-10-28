-- ============================================================================
-- PROPERTY MEMBERS TABLE
-- Track residents living in each property
-- ============================================================================

-- Create property_members table
CREATE TABLE IF NOT EXISTS property_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'resident' CHECK (role IN ('resident', 'tenant', 'roommate')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'moved_out')),
  move_in_date DATE,
  move_out_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint: one user can only be an active member of a property once
  UNIQUE(property_id, user_id, status)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_property_members_property_id ON property_members(property_id);
CREATE INDEX IF NOT EXISTS idx_property_members_user_id ON property_members(user_id);
CREATE INDEX IF NOT EXISTS idx_property_members_status ON property_members(status);

-- Enable RLS
ALTER TABLE property_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view active residents of published properties
CREATE POLICY "Anyone can view active residents of published properties"
  ON property_members
  FOR SELECT
  USING (
    status = 'active' AND
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_members.property_id
      AND properties.status = 'published'
    )
  );

-- Property owners can manage residents
CREATE POLICY "Property owners can manage residents"
  ON property_members
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_members.property_id
      AND properties.owner_id = auth.uid()
    )
  );

-- Residents can view their own membership
CREATE POLICY "Residents can view their own membership"
  ON property_members
  FOR SELECT
  USING (user_id = auth.uid());

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_property_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_property_members_updated_at
  BEFORE UPDATE ON property_members
  FOR EACH ROW
  EXECUTE FUNCTION update_property_members_updated_at();
