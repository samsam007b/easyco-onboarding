-- ============================================================================
-- FAVORITES SYSTEM MIGRATION
-- ============================================================================
-- This migration creates the favorites and wishlist system
-- Tables: user_favorites, property_comparisons, saved_searches
-- Features: Save properties, wishlist management, property comparison

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USER FAVORITES TABLE
-- ============================================================================
-- Stores user's favorite/saved properties
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,

  -- Notes
  user_notes TEXT,
  priority INTEGER CHECK (priority >= 1 AND priority <= 5) DEFAULT 3, -- 1=low, 5=high

  -- Status
  is_active BOOLEAN DEFAULT true, -- Can be archived
  visited BOOLEAN DEFAULT false,
  visit_date DATE,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, property_id)
);

-- ============================================================================
-- PROPERTY COMPARISONS TABLE
-- ============================================================================
-- Allows users to compare multiple properties side by side
CREATE TABLE IF NOT EXISTS property_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT, -- Optional name for comparison group

  -- Properties being compared (array of property IDs)
  property_ids UUID[] NOT NULL DEFAULT '{}',

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT max_properties CHECK (array_length(property_ids, 1) <= 5) -- Max 5 properties
);

-- ============================================================================
-- SAVED SEARCHES TABLE
-- ============================================================================
-- Stores user's saved search criteria for properties
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- Search details
  search_name TEXT NOT NULL,

  -- Search criteria (JSON structure)
  criteria JSONB NOT NULL DEFAULT '{}',
  -- Example: {
  --   "city": "Brussels",
  --   "min_price": 500,
  --   "max_price": 1000,
  --   "bedrooms": 2,
  --   "furnished": true,
  --   "available_from": "2025-01-01"
  -- }

  -- Notifications
  notify_on_match BOOLEAN DEFAULT false, -- Send notification when new property matches
  last_notification_sent_at TIMESTAMP WITH TIME ZONE,

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- User Favorites
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_property_id ON user_favorites(property_id);
CREATE INDEX idx_user_favorites_active ON user_favorites(is_active) WHERE is_active = true;
CREATE INDEX idx_user_favorites_priority ON user_favorites(priority DESC);
CREATE INDEX idx_user_favorites_created_at ON user_favorites(created_at DESC);

-- Property Comparisons
CREATE INDEX idx_property_comparisons_user_id ON property_comparisons(user_id);
CREATE INDEX idx_property_comparisons_active ON property_comparisons(is_active) WHERE is_active = true;

-- Saved Searches
CREATE INDEX idx_saved_searches_user_id ON saved_searches(user_id);
CREATE INDEX idx_saved_searches_active ON saved_searches(is_active) WHERE is_active = true;
CREATE INDEX idx_saved_searches_notify ON saved_searches(notify_on_match) WHERE notify_on_match = true;
CREATE INDEX idx_saved_searches_criteria ON saved_searches USING GIN(criteria);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

-- User Favorites Policies
CREATE POLICY "Users can view their own favorites"
  ON user_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own favorites"
  ON user_favorites FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON user_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Property Comparisons Policies
CREATE POLICY "Users can view their own comparisons"
  ON property_comparisons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own comparisons"
  ON property_comparisons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comparisons"
  ON property_comparisons FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comparisons"
  ON property_comparisons FOR DELETE
  USING (auth.uid() = user_id);

-- Saved Searches Policies
CREATE POLICY "Users can view their own saved searches"
  ON saved_searches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved searches"
  ON saved_searches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved searches"
  ON saved_searches FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved searches"
  ON saved_searches FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_favorites_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_user_favorites_updated_at
  BEFORE UPDATE ON user_favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_favorites_updated_at();

CREATE TRIGGER update_property_comparisons_updated_at
  BEFORE UPDATE ON property_comparisons
  FOR EACH ROW
  EXECUTE FUNCTION update_favorites_updated_at();

CREATE TRIGGER update_saved_searches_updated_at
  BEFORE UPDATE ON saved_searches
  FOR EACH ROW
  EXECUTE FUNCTION update_favorites_updated_at();

-- Get user favorites with full property details
CREATE OR REPLACE FUNCTION get_user_favorites_with_details(user_uuid UUID)
RETURNS TABLE (
  favorite_id UUID,
  property_id UUID,
  property_title TEXT,
  property_city TEXT,
  property_neighborhood TEXT,
  monthly_rent DECIMAL,
  main_image TEXT,
  bedrooms INTEGER,
  available_from DATE,
  user_notes TEXT,
  priority INTEGER,
  visited BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    uf.id as favorite_id,
    p.id as property_id,
    p.title as property_title,
    p.city as property_city,
    p.neighborhood as property_neighborhood,
    p.monthly_rent,
    p.main_image,
    p.bedrooms,
    p.available_from,
    uf.user_notes,
    uf.priority,
    uf.visited,
    uf.created_at
  FROM user_favorites uf
  JOIN properties p ON p.id = uf.property_id
  WHERE uf.user_id = user_uuid AND uf.is_active = true
  ORDER BY uf.priority DESC, uf.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if property is favorited by user
CREATE OR REPLACE FUNCTION is_property_favorited(user_uuid UUID, property_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  favorite_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM user_favorites
    WHERE user_id = user_uuid
      AND property_id = property_uuid
      AND is_active = true
  ) INTO favorite_exists;

  RETURN favorite_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get properties matching saved search criteria
CREATE OR REPLACE FUNCTION find_properties_matching_search(search_uuid UUID)
RETURNS TABLE (
  property_id UUID,
  title TEXT,
  city TEXT,
  monthly_rent DECIMAL,
  bedrooms INTEGER,
  match_score INTEGER
) AS $$
DECLARE
  search_criteria JSONB;
  search_user_id UUID;
BEGIN
  -- Get search criteria and user_id
  SELECT criteria, user_id INTO search_criteria, search_user_id
  FROM saved_searches
  WHERE id = search_uuid AND is_active = true;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    p.title,
    p.city,
    p.monthly_rent,
    p.bedrooms,
    (
      -- Calculate match score based on criteria
      CASE WHEN search_criteria->>'city' IS NOT NULL AND p.city = search_criteria->>'city' THEN 20 ELSE 0 END +
      CASE WHEN search_criteria->>'min_price' IS NOT NULL AND p.monthly_rent >= (search_criteria->>'min_price')::DECIMAL THEN 15 ELSE 0 END +
      CASE WHEN search_criteria->>'max_price' IS NOT NULL AND p.monthly_rent <= (search_criteria->>'max_price')::DECIMAL THEN 15 ELSE 0 END +
      CASE WHEN search_criteria->>'bedrooms' IS NOT NULL AND p.bedrooms = (search_criteria->>'bedrooms')::INTEGER THEN 20 ELSE 0 END +
      CASE WHEN search_criteria->>'furnished' IS NOT NULL AND p.furnished = (search_criteria->>'furnished')::BOOLEAN THEN 15 ELSE 0 END +
      CASE WHEN search_criteria->>'available_from' IS NOT NULL AND p.available_from <= (search_criteria->>'available_from')::DATE THEN 15 ELSE 0 END
    ) as match_score
  FROM properties p
  WHERE p.status = 'published'
    -- Apply criteria filters
    AND (search_criteria->>'city' IS NULL OR p.city = search_criteria->>'city')
    AND (search_criteria->>'min_price' IS NULL OR p.monthly_rent >= (search_criteria->>'min_price')::DECIMAL)
    AND (search_criteria->>'max_price' IS NULL OR p.monthly_rent <= (search_criteria->>'max_price')::DECIMAL)
    AND (search_criteria->>'bedrooms' IS NULL OR p.bedrooms = (search_criteria->>'bedrooms')::INTEGER)
    AND (search_criteria->>'furnished' IS NULL OR p.furnished = (search_criteria->>'furnished')::BOOLEAN)
    AND (search_criteria->>'available_from' IS NULL OR p.available_from <= (search_criteria->>'available_from')::DATE)
  ORDER BY match_score DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get count of user favorites
CREATE OR REPLACE FUNCTION get_favorites_count(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  count_result INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO count_result
  FROM user_favorites
  WHERE user_id = user_uuid AND is_active = true;

  RETURN count_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE user_favorites IS 'Stores user saved/favorite properties';
COMMENT ON TABLE property_comparisons IS 'Allows users to compare multiple properties side by side';
COMMENT ON TABLE saved_searches IS 'Stores user saved search criteria with optional notifications';

COMMENT ON FUNCTION get_user_favorites_with_details IS 'Returns user favorites with full property details';
COMMENT ON FUNCTION is_property_favorited IS 'Checks if a property is favorited by user';
COMMENT ON FUNCTION find_properties_matching_search IS 'Finds properties matching saved search criteria with match score';
COMMENT ON FUNCTION get_favorites_count IS 'Returns count of user active favorites';
