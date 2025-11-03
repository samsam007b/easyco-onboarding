-- Property Comparisons System
-- Allows users to compare multiple properties side by side

-- Table for storing user property comparisons
CREATE TABLE IF NOT EXISTS property_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  property_ids UUID[] NOT NULL,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT max_three_properties CHECK (array_length(property_ids, 1) <= 3),
  CONSTRAINT min_two_properties CHECK (array_length(property_ids, 1) >= 2)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_property_comparisons_user_id ON property_comparisons(user_id);
CREATE INDEX IF NOT EXISTS idx_property_comparisons_created ON property_comparisons(created_at DESC);

-- RLS Policies
ALTER TABLE property_comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own comparisons"
  ON property_comparisons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own comparisons"
  ON property_comparisons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comparisons"
  ON property_comparisons FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comparisons"
  ON property_comparisons FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_property_comparisons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER update_property_comparisons_timestamp
  BEFORE UPDATE ON property_comparisons
  FOR EACH ROW
  EXECUTE FUNCTION update_property_comparisons_updated_at();

COMMENT ON TABLE property_comparisons IS 'Stores user property comparisons for side-by-side analysis';
COMMENT ON COLUMN property_comparisons.property_ids IS 'Array of 2-3 property UUIDs to compare';
