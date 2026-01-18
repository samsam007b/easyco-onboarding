-- ============================================================================
-- MIGRATION 028: MATCHING SYSTEM
-- ============================================================================
-- Creates tables and functions for intelligent matching between searchers and properties
-- ============================================================================

-- Create matches table
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  searcher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID,  -- Will be connected to properties table when it exists
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Match score breakdown (out of 100)
  total_score INTEGER NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
  budget_score INTEGER CHECK (budget_score >= 0 AND budget_score <= 30),
  location_score INTEGER CHECK (location_score >= 0 AND location_score <= 25),
  lifestyle_score INTEGER CHECK (lifestyle_score >= 0 AND lifestyle_score <= 20),
  availability_score INTEGER CHECK (availability_score >= 0 AND availability_score <= 15),
  preferences_score INTEGER CHECK (preferences_score >= 0 AND preferences_score <= 10),

  -- Match status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'viewed', 'contacted', 'hidden', 'expired')),

  -- Interaction tracking
  viewed_at TIMESTAMPTZ,
  contacted_at TIMESTAMPTZ,
  hidden_at TIMESTAMPTZ,

  -- Metadata
  match_reason TEXT,  -- Human-readable explanation of why this is a good match
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate matches
  UNIQUE(searcher_id, owner_id)
);

-- Create match_notifications table
CREATE TABLE IF NOT EXISTS public.match_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,

  -- Notification details
  notification_type TEXT NOT NULL CHECK (notification_type IN ('new_match', 'match_viewed', 'match_contacted')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Status
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, match_id, notification_type)
);

-- Create match_feedback table (for algorithm improvement)
CREATE TABLE IF NOT EXISTS public.match_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Feedback
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  helpful BOOLEAN,
  feedback_text TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(match_id, user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_matches_searcher ON public.matches(searcher_id);
CREATE INDEX IF NOT EXISTS idx_matches_owner ON public.matches(owner_id);
CREATE INDEX IF NOT EXISTS idx_matches_property ON public.matches(property_id);
CREATE INDEX IF NOT EXISTS idx_matches_score ON public.matches(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_created ON public.matches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_matches_expires ON public.matches(expires_at);
CREATE INDEX IF NOT EXISTS idx_matches_searcher_score ON public.matches(searcher_id, total_score DESC);

CREATE INDEX IF NOT EXISTS idx_match_notifications_user ON public.match_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_match_notifications_match ON public.match_notifications(match_id);
CREATE INDEX IF NOT EXISTS idx_match_notifications_read ON public.match_notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_match_notifications_user_unread ON public.match_notifications(user_id, read_at) WHERE read_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_match_feedback_match ON public.match_feedback(match_id);
CREATE INDEX IF NOT EXISTS idx_match_feedback_rating ON public.match_feedback(rating);

-- Enable Row Level Security
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for matches

-- Searchers can view their own matches
CREATE POLICY "Searchers can view own matches"
  ON public.matches
  FOR SELECT
  USING (auth.uid() = searcher_id);

-- Owners can view matches for their properties
CREATE POLICY "Owners can view matches for own properties"
  ON public.matches
  FOR SELECT
  USING (auth.uid() = owner_id);

-- System can insert matches (via service role or function)
CREATE POLICY "Service can insert matches"
  ON public.matches
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Users can update their own matches (status, viewed_at, etc.)
CREATE POLICY "Users can update own matches"
  ON public.matches
  FOR UPDATE
  USING (auth.uid() = searcher_id OR auth.uid() = owner_id);

-- RLS Policies for match_notifications

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.match_notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert notifications
CREATE POLICY "Service can insert notifications"
  ON public.match_notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON public.match_notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for match_feedback

-- Users can view feedback for their matches
CREATE POLICY "Users can view feedback for own matches"
  ON public.match_feedback
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.matches m
      WHERE m.id = match_id
      AND (m.searcher_id = auth.uid() OR m.owner_id = auth.uid())
    )
  );

-- Users can insert feedback for their matches
CREATE POLICY "Users can insert feedback"
  ON public.match_feedback
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.matches m
      WHERE m.id = match_id
      AND (m.searcher_id = auth.uid() OR m.owner_id = auth.uid())
    )
  );

-- Users can update their own feedback
CREATE POLICY "Users can update own feedback"
  ON public.match_feedback
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to calculate match score between searcher and owner
CREATE OR REPLACE FUNCTION calculate_match_score(
  p_searcher_id UUID,
  p_owner_id UUID,
  p_property_id UUID DEFAULT NULL
)
RETURNS TABLE(
  total_score INTEGER,
  budget_score INTEGER,
  location_score INTEGER,
  lifestyle_score INTEGER,
  availability_score INTEGER,
  preferences_score INTEGER,
  match_reason TEXT
) AS $$
DECLARE
  v_budget_score INTEGER := 0;
  v_location_score INTEGER := 0;
  v_lifestyle_score INTEGER := 0;
  v_availability_score INTEGER := 0;
  v_preferences_score INTEGER := 0;
  v_total_score INTEGER := 0;
  v_match_reason TEXT := '';

  v_searcher_profile RECORD;
  v_owner_profile RECORD;
BEGIN
  -- Get searcher profile
  SELECT * INTO v_searcher_profile
  FROM public.user_profiles
  WHERE user_id = p_searcher_id;

  -- Get owner profile
  SELECT * INTO v_owner_profile
  FROM public.user_profiles
  WHERE user_id = p_owner_id;

  -- If profiles don't exist, return 0
  IF v_searcher_profile IS NULL OR v_owner_profile IS NULL THEN
    RETURN QUERY SELECT 0, 0, 0, 0, 0, 0, 'Incomplete profiles'::TEXT;
    RETURN;
  END IF;

  -- 1. BUDGET SCORE (30 points max)
  -- This is a placeholder - actual budget matching would compare with property price
  v_budget_score := 25;  -- Default good score
  v_match_reason := v_match_reason || 'Compatible budget. ';

  -- 2. LOCATION SCORE (25 points max)
  -- Match based on city
  IF v_searcher_profile.current_city IS NOT NULL AND v_owner_profile.current_city IS NOT NULL THEN
    IF LOWER(v_searcher_profile.current_city) = LOWER(v_owner_profile.current_city) THEN
      v_location_score := 25;
      v_match_reason := v_match_reason || 'Same city. ';
    ELSIF v_searcher_profile.current_city IS NOT NULL AND v_owner_profile.city IS NOT NULL THEN
      -- Check alternative city field
      IF LOWER(v_searcher_profile.current_city) = LOWER(v_owner_profile.city) THEN
        v_location_score := 20;
        v_match_reason := v_match_reason || 'Nearby location. ';
      ELSE
        v_location_score := 5;
      END IF;
    END IF;
  ELSE
    v_location_score := 10; -- Default if location data missing
  END IF;

  -- 3. LIFESTYLE SCORE (20 points max)
  -- Match based on lifestyle preferences
  v_lifestyle_score := 15; -- Base score

  -- Smoking compatibility
  IF v_searcher_profile.smoking_allowed IS NOT NULL AND v_owner_profile.smoking_allowed IS NOT NULL THEN
    IF v_searcher_profile.smoking_allowed = v_owner_profile.smoking_allowed THEN
      v_lifestyle_score := v_lifestyle_score + 2;
    END IF;
  END IF;

  -- Pets compatibility
  IF v_searcher_profile.pets_allowed IS NOT NULL AND v_owner_profile.pets_allowed IS NOT NULL THEN
    IF v_searcher_profile.pets_allowed = v_owner_profile.pets_allowed THEN
      v_lifestyle_score := v_lifestyle_score + 2;
      v_match_reason := v_match_reason || 'Pet-friendly. ';
    END IF;
  END IF;

  -- Social preferences match
  IF v_searcher_profile.sociability_level IS NOT NULL AND v_owner_profile.sociability_level IS NOT NULL THEN
    -- If both are similar (within 1 point on a 5-point scale)
    IF ABS(v_searcher_profile.sociability_level - v_owner_profile.sociability_level) <= 1 THEN
      v_lifestyle_score := v_lifestyle_score + 1;
      v_match_reason := v_match_reason || 'Compatible social style. ';
    END IF;
  END IF;

  -- Cap at 20
  v_lifestyle_score := LEAST(v_lifestyle_score, 20);

  -- 4. AVAILABILITY SCORE (15 points max)
  -- Placeholder - would check property availability vs move-in date
  v_availability_score := 12;

  -- 5. PREFERENCES SCORE (10 points max)
  -- Match based on core values and deal breakers
  v_preferences_score := 8;

  -- Check core values overlap (if both have core_values arrays)
  IF v_searcher_profile.core_values IS NOT NULL AND v_owner_profile.core_values IS NOT NULL THEN
    -- Count overlapping values
    DECLARE
      v_overlap INTEGER;
    BEGIN
      SELECT COUNT(*)
      INTO v_overlap
      FROM unnest(v_searcher_profile.core_values) AS sv
      WHERE sv = ANY(v_owner_profile.core_values);

      IF v_overlap > 0 THEN
        v_preferences_score := v_preferences_score + 2;
        v_match_reason := v_match_reason || 'Shared values. ';
      END IF;
    END;
  END IF;

  -- Cap at 10
  v_preferences_score := LEAST(v_preferences_score, 10);

  -- Calculate total score
  v_total_score := v_budget_score + v_location_score + v_lifestyle_score + v_availability_score + v_preferences_score;

  RETURN QUERY SELECT
    v_total_score,
    v_budget_score,
    v_location_score,
    v_lifestyle_score,
    v_availability_score,
    v_preferences_score,
    v_match_reason;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-expire old matches
CREATE OR REPLACE FUNCTION expire_old_matches()
RETURNS void AS $$
BEGIN
  UPDATE public.matches
  SET status = 'expired'
  WHERE status = 'active'
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark match as viewed
CREATE OR REPLACE FUNCTION mark_match_viewed(p_match_id UUID, p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.matches
  SET
    viewed_at = NOW(),
    status = CASE WHEN status = 'active' THEN 'viewed' ELSE status END,
    updated_at = NOW()
  WHERE id = p_match_id
    AND (searcher_id = p_user_id OR owner_id = p_user_id)
    AND viewed_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE public.matches IS 'Stores match scores between searchers and owners/properties';
COMMENT ON TABLE public.match_notifications IS 'Notifications for new matches and match updates';
COMMENT ON TABLE public.match_feedback IS 'User feedback on match quality for algorithm improvement';

COMMENT ON COLUMN public.matches.total_score IS 'Overall match score (0-100)';
COMMENT ON COLUMN public.matches.budget_score IS 'Budget compatibility score (0-30)';
COMMENT ON COLUMN public.matches.location_score IS 'Location compatibility score (0-25)';
COMMENT ON COLUMN public.matches.lifestyle_score IS 'Lifestyle compatibility score (0-20)';
COMMENT ON COLUMN public.matches.availability_score IS 'Availability match score (0-15)';
COMMENT ON COLUMN public.matches.preferences_score IS 'Preferences match score (0-10)';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Migration 028: Matching system created successfully';
  RAISE NOTICE '- Created matches table with score breakdown';
  RAISE NOTICE '- Created match_notifications table';
  RAISE NOTICE '- Created match_feedback table';
  RAISE NOTICE '- Added calculate_match_score() function';
  RAISE NOTICE '- Added RLS policies for security';
  RAISE NOTICE '- Next: Use API route to generate matches';
END $$;
