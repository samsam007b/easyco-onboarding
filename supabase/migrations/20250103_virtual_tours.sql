-- Virtual Tours System
-- Support for 360° virtual tours and tour scheduling

-- Add virtual tour fields to properties table
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS has_virtual_tour BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS virtual_tour_url TEXT,
ADD COLUMN IF NOT EXISTS virtual_tour_type VARCHAR(50) DEFAULT 'matterport', -- matterport, youtube360, custom
ADD COLUMN IF NOT EXISTS tour_embed_code TEXT;

-- Table for scheduled property tours
CREATE TABLE IF NOT EXISTS property_tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Tour details
  tour_type VARCHAR(50) NOT NULL, -- virtual, physical
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,

  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  confirmed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,

  -- Attendees (for physical tours)
  attendees_count INTEGER DEFAULT 1,
  attendee_names TEXT[],

  -- Notes
  user_notes TEXT,
  owner_notes TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_tour_type CHECK (tour_type IN ('virtual', 'physical')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'))
);

-- Table for virtual tour analytics
CREATE TABLE IF NOT EXISTS virtual_tour_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- View details
  view_duration INTEGER, -- seconds
  completed BOOLEAN DEFAULT false, -- watched entire tour

  -- Metadata
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id VARCHAR(255)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_property_tours_property_id ON property_tours(property_id);
CREATE INDEX IF NOT EXISTS idx_property_tours_user_id ON property_tours(user_id);
CREATE INDEX IF NOT EXISTS idx_property_tours_scheduled_at ON property_tours(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_property_tours_status ON property_tours(status);

CREATE INDEX IF NOT EXISTS idx_virtual_tour_views_property_id ON virtual_tour_views(property_id);
CREATE INDEX IF NOT EXISTS idx_virtual_tour_views_user_id ON virtual_tour_views(user_id);

CREATE INDEX IF NOT EXISTS idx_properties_virtual_tour ON properties(has_virtual_tour) WHERE has_virtual_tour = true;

-- RLS Policies
ALTER TABLE property_tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_tour_views ENABLE ROW LEVEL SECURITY;

-- Property tours policies
CREATE POLICY "Users can view own property tours"
  ON property_tours FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Property owners can view tours for their properties"
  ON property_tours FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_tours.property_id
      AND properties.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create property tours"
  ON property_tours FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own property tours"
  ON property_tours FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Property owners can update tours for their properties"
  ON property_tours FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_tours.property_id
      AND properties.owner_id = auth.uid()
    )
  );

-- Virtual tour views policies
CREATE POLICY "Users can view own virtual tour views"
  ON virtual_tour_views FOR SELECT
  USING (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Users can insert virtual tour views"
  ON virtual_tour_views FOR INSERT
  WITH CHECK (auth.uid() = user_id OR session_id IS NOT NULL);

-- Function to update property tour timestamp
CREATE OR REPLACE FUNCTION update_property_tours_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER update_property_tours_trigger
  BEFORE UPDATE ON property_tours
  FOR EACH ROW
  EXECUTE FUNCTION update_property_tours_timestamp();

-- Function to increment virtual tour views count
CREATE OR REPLACE FUNCTION increment_virtual_tour_views()
RETURNS TRIGGER AS $$
BEGIN
  -- Could add a counter column to properties if needed
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER increment_virtual_tour_views_trigger
  AFTER INSERT ON virtual_tour_views
  FOR EACH ROW
  EXECUTE FUNCTION increment_virtual_tour_views();

-- Function to get upcoming tours for a user
CREATE OR REPLACE FUNCTION get_user_upcoming_tours(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  tour_id UUID,
  property_id UUID,
  property_title TEXT,
  tour_type VARCHAR(50),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pt.id as tour_id,
    pt.property_id,
    p.title as property_title,
    pt.tour_type,
    pt.scheduled_at,
    pt.status
  FROM property_tours pt
  JOIN properties p ON p.id = pt.property_id
  WHERE pt.user_id = p_user_id
    AND pt.scheduled_at >= NOW()
    AND pt.status != 'cancelled'
  ORDER BY pt.scheduled_at ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON COLUMN properties.has_virtual_tour IS 'Whether property has a virtual 360° tour available';
COMMENT ON COLUMN properties.virtual_tour_url IS 'URL to the virtual tour (Matterport, YouTube 360, etc.)';
COMMENT ON COLUMN properties.virtual_tour_type IS 'Type of virtual tour platform';
COMMENT ON TABLE property_tours IS 'Scheduled property tours (virtual or physical)';
COMMENT ON TABLE virtual_tour_views IS 'Analytics for virtual tour viewing';
