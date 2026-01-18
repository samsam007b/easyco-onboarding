-- Enhanced Saved Searches System
-- Allows users to save, organize, and share property searches

-- Create or update saved_searches table
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,

  -- Search criteria (JSON for flexibility)
  filters JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Metadata
  description TEXT,
  is_favorite BOOLEAN DEFAULT false,
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,

  -- Sharing
  is_shared BOOLEAN DEFAULT false,
  share_code VARCHAR(50) UNIQUE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for tracking who a search is shared with
CREATE TABLE IF NOT EXISTS saved_search_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  saved_search_id UUID NOT NULL REFERENCES saved_searches(id) ON DELETE CASCADE,
  shared_with_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_with_email VARCHAR(255),

  -- Permissions
  can_edit BOOLEAN DEFAULT false,

  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, declined

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT valid_share_status CHECK (status IN ('pending', 'accepted', 'declined')),
  CONSTRAINT require_user_or_email CHECK (
    shared_with_user_id IS NOT NULL OR shared_with_email IS NOT NULL
  )
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_favorite ON saved_searches(user_id, is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_saved_searches_share_code ON saved_searches(share_code) WHERE share_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_saved_search_shares_search_id ON saved_search_shares(saved_search_id);
CREATE INDEX IF NOT EXISTS idx_saved_search_shares_user_id ON saved_search_shares(shared_with_user_id);
CREATE INDEX IF NOT EXISTS idx_saved_search_shares_pending ON saved_search_shares(shared_with_user_id, status) WHERE status = 'pending';

-- RLS Policies
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_search_shares ENABLE ROW LEVEL SECURITY;

-- Users can view their own searches
CREATE POLICY "Users can view own saved searches"
  ON saved_searches FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view searches shared with them
CREATE POLICY "Users can view shared searches"
  ON saved_searches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM saved_search_shares
      WHERE saved_search_shares.saved_search_id = saved_searches.id
      AND saved_search_shares.shared_with_user_id = auth.uid()
      AND saved_search_shares.status = 'accepted'
    )
  );

-- Users can create their own searches
CREATE POLICY "Users can create own saved searches"
  ON saved_searches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own searches
CREATE POLICY "Users can update own saved searches"
  ON saved_searches FOR UPDATE
  USING (auth.uid() = user_id);

-- Users with edit permission can update shared searches
CREATE POLICY "Users can update searches shared with edit permission"
  ON saved_searches FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM saved_search_shares
      WHERE saved_search_shares.saved_search_id = saved_searches.id
      AND saved_search_shares.shared_with_user_id = auth.uid()
      AND saved_search_shares.can_edit = true
      AND saved_search_shares.status = 'accepted'
    )
  );

-- Users can delete their own searches
CREATE POLICY "Users can delete own saved searches"
  ON saved_searches FOR DELETE
  USING (auth.uid() = user_id);

-- Saved search shares policies
CREATE POLICY "Users can view shares of own searches"
  ON saved_search_shares FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM saved_searches
      WHERE saved_searches.id = saved_search_shares.saved_search_id
      AND saved_searches.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view shares for them"
  ON saved_search_shares FOR SELECT
  USING (shared_with_user_id = auth.uid());

CREATE POLICY "Users can create shares for own searches"
  ON saved_search_shares FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM saved_searches
      WHERE saved_searches.id = saved_search_shares.saved_search_id
      AND saved_searches.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update shares for them"
  ON saved_search_shares FOR UPDATE
  USING (shared_with_user_id = auth.uid());

CREATE POLICY "Users can delete shares of own searches"
  ON saved_search_shares FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM saved_searches
      WHERE saved_searches.id = saved_search_shares.saved_search_id
      AND saved_searches.user_id = auth.uid()
    )
  );

-- Function to generate unique share code
CREATE OR REPLACE FUNCTION generate_share_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_saved_searches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_saved_searches_timestamp ON saved_searches;
CREATE TRIGGER update_saved_searches_timestamp
  BEFORE UPDATE ON saved_searches
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_searches_updated_at();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_search_view_count(search_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE saved_searches
  SET
    view_count = view_count + 1,
    last_viewed_at = NOW()
  WHERE id = search_id;
END;
$$ LANGUAGE plpgsql;

-- Add helpful comments
COMMENT ON TABLE saved_searches IS 'Stores user-defined saved property searches with sharing capabilities';
COMMENT ON TABLE saved_search_shares IS 'Tracks search sharing between users';
COMMENT ON COLUMN saved_searches.share_code IS 'Unique code for sharing searches via link';
COMMENT ON COLUMN saved_search_shares.status IS 'Status of share invitation: pending, accepted, or declined';
