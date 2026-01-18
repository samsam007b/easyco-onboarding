-- Search History & Analytics System
-- Track user search behavior and property views for analytics and recommendations

-- Table for tracking property views
CREATE TABLE IF NOT EXISTS property_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,

  -- View details
  view_duration INTEGER, -- seconds spent on property page
  source VARCHAR(100), -- browse, search, recommendation, etc.

  -- Metadata
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Allow anonymous tracking with session_id
  session_id VARCHAR(255)
);

-- Table for tracking search queries
CREATE TABLE IF NOT EXISTS search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Search criteria
  search_query TEXT,
  filters JSONB DEFAULT '{}'::jsonb,

  -- Results
  results_count INTEGER DEFAULT 0,
  clicked_property_id UUID REFERENCES properties(id) ON DELETE SET NULL,

  -- Metadata
  searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Allow anonymous tracking
  session_id VARCHAR(255)
);

-- Table for user activity statistics
CREATE TABLE IF NOT EXISTS user_activity_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

  -- Counters
  total_searches INTEGER DEFAULT 0,
  total_property_views INTEGER DEFAULT 0,
  total_favorites INTEGER DEFAULT 0,
  total_applications INTEGER DEFAULT 0,
  total_messages_sent INTEGER DEFAULT 0,

  -- Preferences derived from behavior
  preferred_cities TEXT[] DEFAULT '{}',
  preferred_price_range INT4RANGE,
  preferred_property_types TEXT[] DEFAULT '{}',

  -- Timestamps
  first_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_property_views_user_id ON property_views(user_id);
CREATE INDEX IF NOT EXISTS idx_property_views_property_id ON property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_viewed_at ON property_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_property_views_session ON property_views(session_id) WHERE session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_searched_at ON search_history(searched_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_session ON search_history(session_id) WHERE session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_user_activity_stats_user_id ON user_activity_stats(user_id);

-- RLS Policies
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_stats ENABLE ROW LEVEL SECURITY;

-- Users can view their own data
CREATE POLICY "Users can view own property views"
  ON property_views FOR SELECT
  USING (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Users can insert own property views"
  ON property_views FOR INSERT
  WITH CHECK (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Users can view own search history"
  ON search_history FOR SELECT
  USING (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Users can insert own search history"
  ON search_history FOR INSERT
  WITH CHECK (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Users can view own activity stats"
  ON user_activity_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own activity stats"
  ON user_activity_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to update activity stats timestamp
CREATE OR REPLACE FUNCTION update_user_activity_stats_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.last_activity_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER update_user_activity_stats_trigger
  BEFORE UPDATE ON user_activity_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_user_activity_stats_timestamp();

-- Function to increment property view count in properties table
CREATE OR REPLACE FUNCTION increment_property_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE properties
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = NEW.property_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update property views count
CREATE TRIGGER increment_property_views_trigger
  AFTER INSERT ON property_views
  FOR EACH ROW
  EXECUTE FUNCTION increment_property_views();

-- Function to update user activity stats when actions occur
CREATE OR REPLACE FUNCTION update_user_activity_on_view()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    INSERT INTO user_activity_stats (user_id, total_property_views)
    VALUES (NEW.user_id, 1)
    ON CONFLICT (user_id)
    DO UPDATE SET
      total_property_views = user_activity_stats.total_property_views + 1,
      last_activity_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER update_user_activity_on_view_trigger
  AFTER INSERT ON property_views
  FOR EACH ROW
  EXECUTE FUNCTION update_user_activity_on_view();

-- Function to update user activity stats on search
CREATE OR REPLACE FUNCTION update_user_activity_on_search()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    INSERT INTO user_activity_stats (user_id, total_searches)
    VALUES (NEW.user_id, 1)
    ON CONFLICT (user_id)
    DO UPDATE SET
      total_searches = user_activity_stats.total_searches + 1,
      last_activity_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER update_user_activity_on_search_trigger
  AFTER INSERT ON search_history
  FOR EACH ROW
  EXECUTE FUNCTION update_user_activity_on_search();

-- Function to get user's most viewed properties
CREATE OR REPLACE FUNCTION get_user_most_viewed_properties(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  property_id UUID,
  view_count BIGINT,
  last_viewed TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pv.property_id,
    COUNT(*) as view_count,
    MAX(pv.viewed_at) as last_viewed
  FROM property_views pv
  WHERE pv.user_id = p_user_id
  GROUP BY pv.property_id
  ORDER BY view_count DESC, last_viewed DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's search trends
CREATE OR REPLACE FUNCTION get_user_search_trends(
  p_user_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  search_date DATE,
  search_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    DATE(searched_at) as search_date,
    COUNT(*) as search_count
  FROM search_history
  WHERE user_id = p_user_id
    AND searched_at >= NOW() - (p_days || ' days')::INTERVAL
  GROUP BY DATE(searched_at)
  ORDER BY search_date DESC;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE property_views IS 'Tracks user property views for analytics and recommendations';
COMMENT ON TABLE search_history IS 'Stores user search queries and filters for analytics';
COMMENT ON TABLE user_activity_stats IS 'Aggregated user activity statistics';
COMMENT ON COLUMN property_views.view_duration IS 'Time spent viewing property in seconds';
COMMENT ON COLUMN property_views.source IS 'Where the user came from (browse, search, etc.)';
