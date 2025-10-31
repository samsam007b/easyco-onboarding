-- Create saved_searches table
CREATE TABLE IF NOT EXISTS public.saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,

  -- Search filters (stored as JSONB for flexibility)
  filters JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Notification preferences
  email_alerts BOOLEAN DEFAULT true,
  alert_frequency VARCHAR(50) DEFAULT 'daily', -- 'instant', 'daily', 'weekly'

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_checked_at TIMESTAMPTZ,

  -- Stats
  properties_found_count INTEGER DEFAULT 0,
  last_match_count INTEGER DEFAULT 0
);

-- Add indexes
CREATE INDEX idx_saved_searches_user_id ON public.saved_searches(user_id);
CREATE INDEX idx_saved_searches_created_at ON public.saved_searches(created_at DESC);
CREATE INDEX idx_saved_searches_email_alerts ON public.saved_searches(email_alerts) WHERE email_alerts = true;

-- Enable Row Level Security
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view their own saved searches
CREATE POLICY "Users can view own saved searches"
  ON public.saved_searches
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own saved searches
CREATE POLICY "Users can create own saved searches"
  ON public.saved_searches
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own saved searches
CREATE POLICY "Users can update own saved searches"
  ON public.saved_searches
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own saved searches
CREATE POLICY "Users can delete own saved searches"
  ON public.saved_searches
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_saved_searches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER trigger_update_saved_searches_updated_at
  BEFORE UPDATE ON public.saved_searches
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_searches_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.saved_searches IS 'Stores user saved property searches with alert preferences';
COMMENT ON COLUMN public.saved_searches.filters IS 'Search filters as JSON (city, price_range, bedrooms, etc.)';
COMMENT ON COLUMN public.saved_searches.email_alerts IS 'Whether to send email alerts for new matches';
COMMENT ON COLUMN public.saved_searches.alert_frequency IS 'How often to send alerts: instant, daily, weekly';
COMMENT ON COLUMN public.saved_searches.properties_found_count IS 'Total properties ever found for this search';
COMMENT ON COLUMN public.saved_searches.last_match_count IS 'Number of properties in last check';
