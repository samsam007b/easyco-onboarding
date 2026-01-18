-- ============================================================================
-- CREATE EVENTS SYSTEM FOR IZZICO
-- ============================================================================
-- Purpose: Events discovery & community building feature
-- Target users: Residents (primary), Searchers (secondary)
-- Features: Public events, co-living events, community events, partnerships
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. EVENT CATEGORIES - Standardized categories for all events
-- ============================================================================
CREATE TABLE IF NOT EXISTS event_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- 'festivals', 'museums', 'sports', 'nightlife'...
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_nl TEXT,
  name_de TEXT,
  icon_name TEXT NOT NULL, -- Lucide icon name
  color TEXT NOT NULL, -- Hex color for UI
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. EVENTS - Main events table (all types)
-- ============================================================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Event Type (3 types)
  event_type TEXT NOT NULL CHECK (event_type IN ('public', 'property', 'community')),

  -- Basic Info
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT, -- 1-line teaser
  category_id UUID REFERENCES event_categories(id) ON DELETE SET NULL,

  -- Location
  city TEXT NOT NULL,
  venue_name TEXT,
  venue_address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Timing
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  all_day BOOLEAN NOT NULL DEFAULT FALSE,
  timezone TEXT DEFAULT 'Europe/Brussels',

  -- Media
  cover_image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb, -- Array of image URLs

  -- Property Events (event_type = 'property')
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  max_attendees INTEGER, -- NULL = unlimited

  -- Public Events (event_type = 'public')
  external_url TEXT, -- Link to ticketing site
  external_source TEXT, -- 'eventbrite', 'meetup', 'manual'...
  external_id TEXT, -- ID from external API

  -- Pricing
  price_min DECIMAL(10, 2) DEFAULT 0,
  price_max DECIMAL(10, 2),
  is_free BOOLEAN NOT NULL DEFAULT TRUE,
  currency TEXT DEFAULT 'EUR',

  -- Partnership & Monetization
  is_partner_event BOOLEAN NOT NULL DEFAULT FALSE,
  partner_name TEXT,
  partner_logo_url TEXT,
  promo_code TEXT, -- Discount code for Izzico users
  promo_description TEXT, -- "20% off with code IZZICO"
  affiliate_url TEXT, -- Tracking URL for commissions
  commission_rate DECIMAL(5, 2), -- Percentage (e.g., 10.00 = 10%)

  -- Status & Moderation
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed', 'archived')),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE, -- Featured on homepage

  -- Metadata
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ,

  -- Tags
  tags TEXT[] DEFAULT ARRAY[]::TEXT[], -- ['outdoor', 'family-friendly', 'beginner']

  -- Search
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('french', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('french', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('french', coalesce(city, '')), 'C')
  ) STORED
);

-- ============================================================================
-- 3. EVENT ATTENDEES - Who's attending which event
-- ============================================================================
CREATE TABLE IF NOT EXISTS event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- RSVP Status
  status TEXT NOT NULL DEFAULT 'interested' CHECK (status IN (
    'interested',  -- Saved/bookmarked
    'going',       -- Confirmed attendance
    'maybe',       -- Tentative
    'not_going',   -- Declined
    'attended'     -- Actually attended (post-event)
  )),

  -- Tickets (for paid events)
  ticket_purchased BOOLEAN NOT NULL DEFAULT FALSE,
  ticket_reference TEXT, -- External ticket ID
  ticket_price DECIMAL(10, 2),

  -- Social
  invite_friends BOOLEAN NOT NULL DEFAULT FALSE, -- User wants to invite friends

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(event_id, user_id)
);

-- ============================================================================
-- 4. EVENT INVITATIONS - Invite specific users to events
-- ============================================================================
CREATE TABLE IF NOT EXISTS event_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invited_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  message TEXT, -- Personal message from inviter

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMPTZ,

  UNIQUE(event_id, invited_user_id)
);

-- ============================================================================
-- 5. EVENT REVIEWS - Post-event feedback
-- ============================================================================
CREATE TABLE IF NOT EXISTS event_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,

  -- Moderation
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(event_id, user_id)
);

-- ============================================================================
-- 6. USER EVENT PREFERENCES - What types of events users like
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_event_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

  -- Preferred Categories
  preferred_categories UUID[] DEFAULT ARRAY[]::UUID[], -- Array of category IDs

  -- Preferences
  max_distance_km INTEGER DEFAULT 10, -- How far willing to travel
  price_range TEXT DEFAULT 'all' CHECK (price_range IN ('free', 'budget', 'moderate', 'premium', 'all')),
  preferred_days TEXT[] DEFAULT ARRAY['friday', 'saturday', 'sunday'], -- ['monday', 'tuesday'...]

  -- Notifications
  email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  push_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  weekly_digest BOOLEAN NOT NULL DEFAULT TRUE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 7. EVENT ANALYTICS - Track engagement and conversions
-- ============================================================================
CREATE TABLE IF NOT EXISTS event_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Metrics
  views_count INTEGER NOT NULL DEFAULT 0,
  clicks_count INTEGER NOT NULL DEFAULT 0, -- External URL clicks
  shares_count INTEGER NOT NULL DEFAULT 0,

  -- Conversions (for partner events)
  conversions_count INTEGER NOT NULL DEFAULT 0, -- Actual purchases via affiliate link
  commission_earned DECIMAL(10, 2) DEFAULT 0,

  -- Last updated
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(event_id)
);

-- ============================================================================
-- INDEXES for performance
-- ============================================================================
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_city ON events(city);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_category ON events(category_id);
CREATE INDEX idx_events_property ON events(property_id) WHERE property_id IS NOT NULL;
CREATE INDEX idx_events_featured ON events(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_events_partner ON events(is_partner_event) WHERE is_partner_event = TRUE;
CREATE INDEX idx_events_search ON events USING gin(search_vector);
CREATE INDEX idx_events_location ON events(latitude, longitude) WHERE latitude IS NOT NULL;

CREATE INDEX idx_event_attendees_user ON event_attendees(user_id);
CREATE INDEX idx_event_attendees_status ON event_attendees(status);
CREATE INDEX idx_event_attendees_going ON event_attendees(event_id, status) WHERE status = 'going';

CREATE INDEX idx_event_invitations_invited_user ON event_invitations(invited_user_id);
CREATE INDEX idx_event_invitations_status ON event_invitations(status);

CREATE INDEX idx_event_reviews_event ON event_reviews(event_id);
CREATE INDEX idx_event_reviews_approved ON event_reviews(is_approved) WHERE is_approved = TRUE;

-- ============================================================================
-- RLS POLICIES - Row Level Security
-- ============================================================================

-- EVENTS: Different access rules based on event_type
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Public events: everyone can see published events
CREATE POLICY events_select_public ON events
  FOR SELECT USING (
    event_type = 'public' AND status = 'published'
  );

-- Community events: everyone can see published events
CREATE POLICY events_select_community ON events
  FOR SELECT USING (
    event_type = 'community' AND status = 'published'
  );

-- Property events: only property members can see
CREATE POLICY events_select_property ON events
  FOR SELECT USING (
    event_type = 'property' AND
    status = 'published' AND
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );

-- Insert: Property events can be created by property members
CREATE POLICY events_insert_property ON events
  FOR INSERT WITH CHECK (
    event_type = 'property' AND
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );

-- Update: Only creator or admins can update
CREATE POLICY events_update_own ON events
  FOR UPDATE USING (
    created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM super_admins WHERE user_id = auth.uid())
  );

-- EVENT ATTENDEES: Users can manage their own attendance
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY event_attendees_select ON event_attendees
  FOR SELECT USING (
    user_id = auth.uid() OR
    event_id IN (
      SELECT id FROM events WHERE status = 'published'
    )
  );

CREATE POLICY event_attendees_insert ON event_attendees
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY event_attendees_update ON event_attendees
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY event_attendees_delete ON event_attendees
  FOR DELETE USING (user_id = auth.uid());

-- EVENT INVITATIONS
ALTER TABLE event_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY event_invitations_select ON event_invitations
  FOR SELECT USING (
    invited_by = auth.uid() OR invited_user_id = auth.uid()
  );

CREATE POLICY event_invitations_insert ON event_invitations
  FOR INSERT WITH CHECK (invited_by = auth.uid());

CREATE POLICY event_invitations_update ON event_invitations
  FOR UPDATE USING (invited_user_id = auth.uid());

-- EVENT REVIEWS
ALTER TABLE event_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY event_reviews_select ON event_reviews
  FOR SELECT USING (is_approved = TRUE OR user_id = auth.uid());

CREATE POLICY event_reviews_insert ON event_reviews
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM event_attendees
      WHERE event_id = event_reviews.event_id
      AND user_id = auth.uid()
      AND status = 'attended'
    )
  );

CREATE POLICY event_reviews_update ON event_reviews
  FOR UPDATE USING (user_id = auth.uid());

-- USER EVENT PREFERENCES
ALTER TABLE user_event_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_event_preferences_all ON user_event_preferences
  FOR ALL USING (user_id = auth.uid());

-- EVENT ANALYTICS: Read-only for users, write for system
ALTER TABLE event_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY event_analytics_select ON event_analytics
  FOR SELECT USING (TRUE);

-- EVENT CATEGORIES: Public read
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY event_categories_select ON event_categories
  FOR SELECT USING (TRUE);

-- ============================================================================
-- FUNCTIONS - Helper functions
-- ============================================================================

-- Function to increment event views
CREATE OR REPLACE FUNCTION increment_event_views(target_event_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO event_analytics (event_id, views_count, updated_at)
  VALUES (target_event_id, 1, NOW())
  ON CONFLICT (event_id)
  DO UPDATE SET
    views_count = event_analytics.views_count + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recommended events for a user
CREATE OR REPLACE FUNCTION get_recommended_events(
  target_user_id UUID,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  event_id UUID,
  relevance_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id as event_id,
    (
      -- Category match (40%)
      CASE WHEN e.category_id = ANY(
        SELECT unnest(preferred_categories)
        FROM user_event_preferences
        WHERE user_id = target_user_id
      ) THEN 0.4 ELSE 0 END +

      -- City match (30%)
      CASE WHEN e.city = (
        SELECT city
        FROM user_profiles
        WHERE user_id = target_user_id
      ) THEN 0.3 ELSE 0 END +

      -- Price match (20%)
      CASE WHEN e.is_free THEN 0.2
           WHEN e.price_min <= 20 THEN 0.15
           ELSE 0.1 END +

      -- Featured bonus (10%)
      CASE WHEN e.is_featured THEN 0.1 ELSE 0 END
    ) as relevance_score
  FROM events e
  WHERE e.status = 'published'
    AND e.start_date > NOW()
  ORDER BY relevance_score DESC, e.start_date ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_attendees_updated_at BEFORE UPDATE ON event_attendees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_reviews_updated_at BEFORE UPDATE ON event_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_event_preferences_updated_at BEFORE UPDATE ON user_event_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA - Initial event categories
-- ============================================================================
INSERT INTO event_categories (slug, name_fr, name_en, name_nl, name_de, icon_name, color, display_order) VALUES
  ('festivals', 'Festivals & Concerts', 'Festivals & Concerts', 'Festivals & Concerten', 'Festivals & Konzerte', 'Music', '#e05747', 1),
  ('museums', 'Musées & Expos', 'Museums & Exhibitions', 'Musea & Tentoonstellingen', 'Museen & Ausstellungen', 'Palette', '#9c5698', 2),
  ('sports', 'Sport & Fitness', 'Sports & Fitness', 'Sport & Fitness', 'Sport & Fitness', 'Dumbbell', '#ffa000', 3),
  ('nightlife', 'Soirées & Bars', 'Nightlife & Bars', 'Nachtleven & Bars', 'Nachtleben & Bars', 'PartyPopper', '#d15659', 4),
  ('outdoor', 'Activités Outdoor', 'Outdoor Activities', 'Outdoor Activiteiten', 'Outdoor-Aktivitäten', 'TreePine', '#7CB89B', 5),
  ('food', 'Food & Restaurants', 'Food & Restaurants', 'Eten & Restaurants', 'Essen & Restaurants', 'UtensilsCrossed', '#ff7c10', 6),
  ('gaming', 'Escape Room & Gaming', 'Escape Room & Gaming', 'Escape Room & Gaming', 'Escape Room & Gaming', 'Gamepad2', '#c85570', 7),
  ('culture', 'Théâtre & Cinéma', 'Theater & Cinema', 'Theater & Cinema', 'Theater & Kino', 'Theater', '#9c5698', 8),
  ('networking', 'Networking & Business', 'Networking & Business', 'Netwerken & Business', 'Networking & Business', 'Users', '#1A1A2E', 9),
  ('wellness', 'Bien-être & Détente', 'Wellness & Relaxation', 'Wellness & Ontspanning', 'Wellness & Entspannung', 'Sparkles', '#D08080', 10)
ON CONFLICT (slug) DO NOTHING;

COMMIT;

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ Events system created successfully!';
  RAISE NOTICE '   - events (public, property, community)';
  RAISE NOTICE '   - event_attendees & event_invitations';
  RAISE NOTICE '   - event_reviews & event_analytics';
  RAISE NOTICE '   - user_event_preferences';
  RAISE NOTICE '   - 10 event categories seeded';
  RAISE NOTICE '   - Recommendation algorithm included';
  RAISE NOTICE '   - Partnership & monetization fields ready';
END $$;
