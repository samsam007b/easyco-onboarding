-- ============================================
-- VISIT BOOKING SYSTEM
-- ============================================
-- Description: Complete visit booking system for property viewings
-- Features:
--   - Visit scheduling with time slots
--   - Owner availability management
--   - Visit statuses (pending, confirmed, completed, cancelled)
--   - In-person and virtual visits
--   - Notifications and reminders
-- ============================================

-- Drop existing tables if they exist (for clean migrations)
DROP TABLE IF EXISTS property_visits CASCADE;
DROP TABLE IF EXISTS visit_availability CASCADE;
DROP TABLE IF EXISTS visit_time_slots CASCADE;

-- ============================================
-- TABLE: visit_time_slots
-- Purpose: Predefined time slots for visits (configurable)
-- ============================================
CREATE TABLE visit_time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_name TEXT NOT NULL, -- e.g., "Morning", "Afternoon", "Evening"
  start_time TIME NOT NULL, -- e.g., 09:00
  end_time TIME NOT NULL, -- e.g., 10:00
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default time slots
INSERT INTO visit_time_slots (slot_name, start_time, end_time, duration_minutes) VALUES
  ('Morning - 9:00 AM', '09:00', '09:30', 30),
  ('Morning - 9:30 AM', '09:30', '10:00', 30),
  ('Morning - 10:00 AM', '10:00', '10:30', 30),
  ('Morning - 10:30 AM', '10:30', '11:00', 30),
  ('Morning - 11:00 AM', '11:00', '11:30', 30),
  ('Morning - 11:30 AM', '11:30', '12:00', 30),
  ('Afternoon - 12:00 PM', '12:00', '12:30', 30),
  ('Afternoon - 12:30 PM', '12:30', '13:00', 30),
  ('Afternoon - 1:00 PM', '13:00', '13:30', 30),
  ('Afternoon - 1:30 PM', '13:30', '14:00', 30),
  ('Afternoon - 2:00 PM', '14:00', '14:30', 30),
  ('Afternoon - 2:30 PM', '14:30', '15:00', 30),
  ('Afternoon - 3:00 PM', '15:00', '15:30', 30),
  ('Afternoon - 3:30 PM', '15:30', '16:00', 30),
  ('Afternoon - 4:00 PM', '16:00', '16:30', 30),
  ('Afternoon - 4:30 PM', '16:30', '17:00', 30),
  ('Evening - 5:00 PM', '17:00', '17:30', 30),
  ('Evening - 5:30 PM', '17:30', '18:00', 30),
  ('Evening - 6:00 PM', '18:00', '18:30', 30),
  ('Evening - 6:30 PM', '18:30', '19:00', 30);

-- ============================================
-- TABLE: visit_availability
-- Purpose: Owner's availability for property visits
-- ============================================
CREATE TABLE visit_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Availability pattern
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,

  -- Metadata
  notes TEXT, -- Special instructions for visitors
  max_visits_per_day INTEGER DEFAULT 5,
  buffer_minutes INTEGER DEFAULT 15, -- Buffer between visits

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(property_id, day_of_week, start_time),
  CHECK (end_time > start_time)
);

-- ============================================
-- TABLE: property_visits
-- Purpose: Scheduled visits for properties
-- ============================================
CREATE TABLE property_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relations
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- The searcher
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Property owner

  -- Visit details
  scheduled_at TIMESTAMPTZ NOT NULL, -- Exact date and time
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  visit_type TEXT NOT NULL CHECK (visit_type IN ('in_person', 'virtual')),

  -- Status workflow
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'completed', 'cancelled_by_visitor', 'cancelled_by_owner', 'no_show')
  ),

  -- Communication
  visitor_notes TEXT, -- Notes from visitor when booking
  owner_response TEXT, -- Response from owner
  visitor_phone TEXT, -- Contact for visit
  visitor_email TEXT,

  -- Virtual visit
  meeting_url TEXT, -- Zoom/Google Meet link for virtual visits
  meeting_password TEXT,

  -- Post-visit
  visitor_rating INTEGER CHECK (visitor_rating BETWEEN 1 AND 5),
  visitor_feedback TEXT,
  was_helpful BOOLEAN, -- Did the visit help make a decision?

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,

  -- Constraints
  CHECK (scheduled_at > NOW()), -- Can't book in the past (except for completed visits)
  CHECK (duration_minutes > 0),
  CHECK (duration_minutes <= 180) -- Max 3 hours
);

-- ============================================
-- INDEXES for Performance
-- ============================================
CREATE INDEX idx_property_visits_property ON property_visits(property_id);
CREATE INDEX idx_property_visits_visitor ON property_visits(visitor_id);
CREATE INDEX idx_property_visits_owner ON property_visits(owner_id);
CREATE INDEX idx_property_visits_status ON property_visits(status);
CREATE INDEX idx_property_visits_scheduled ON property_visits(scheduled_at);
CREATE INDEX idx_property_visits_property_status ON property_visits(property_id, status);
CREATE INDEX idx_property_visits_visitor_status ON property_visits(visitor_id, status);

CREATE INDEX idx_visit_availability_property ON visit_availability(property_id);
CREATE INDEX idx_visit_availability_owner ON visit_availability(owner_id);
CREATE INDEX idx_visit_availability_day ON visit_availability(day_of_week);

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE property_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_time_slots ENABLE ROW LEVEL SECURITY;

-- Time slots: Everyone can read
CREATE POLICY "Everyone can view time slots"
  ON visit_time_slots FOR SELECT
  USING (true);

-- Visit availability: Public can read, owners can manage
CREATE POLICY "Everyone can view availability"
  ON visit_availability FOR SELECT
  USING (true);

CREATE POLICY "Owners can manage their availability"
  ON visit_availability FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Property visits: Visitors and owners can see their visits
CREATE POLICY "Visitors can view their visits"
  ON property_visits FOR SELECT
  USING (auth.uid() = visitor_id);

CREATE POLICY "Owners can view visits for their properties"
  ON property_visits FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Visitors can create visits"
  ON property_visits FOR INSERT
  WITH CHECK (auth.uid() = visitor_id);

CREATE POLICY "Visitors can update their visits"
  ON property_visits FOR UPDATE
  USING (auth.uid() = visitor_id)
  WITH CHECK (auth.uid() = visitor_id);

CREATE POLICY "Owners can update visits for their properties"
  ON property_visits FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_visit_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_property_visits_timestamp
  BEFORE UPDATE ON property_visits
  FOR EACH ROW
  EXECUTE FUNCTION update_visit_timestamp();

CREATE TRIGGER update_visit_availability_timestamp
  BEFORE UPDATE ON visit_availability
  FOR EACH ROW
  EXECUTE FUNCTION update_visit_timestamp();

-- Function: Get available time slots for a property on a specific date
CREATE OR REPLACE FUNCTION get_available_slots(
  p_property_id UUID,
  p_date DATE
)
RETURNS TABLE (
  slot_start TIMESTAMPTZ,
  slot_end TIMESTAMPTZ,
  is_available BOOLEAN
) AS $$
DECLARE
  v_day_of_week INTEGER;
BEGIN
  -- Get day of week (0 = Sunday)
  v_day_of_week := EXTRACT(DOW FROM p_date);

  RETURN QUERY
  WITH owner_availability AS (
    SELECT va.start_time, va.end_time
    FROM visit_availability va
    WHERE va.property_id = p_property_id
      AND va.day_of_week = v_day_of_week
      AND va.is_available = true
  ),
  existing_visits AS (
    SELECT pv.scheduled_at, pv.duration_minutes
    FROM property_visits pv
    WHERE pv.property_id = p_property_id
      AND DATE(pv.scheduled_at) = p_date
      AND pv.status IN ('pending', 'confirmed')
  )
  SELECT
    (p_date + vts.start_time)::TIMESTAMPTZ as slot_start,
    (p_date + vts.end_time)::TIMESTAMPTZ as slot_end,
    CASE
      WHEN EXISTS (
        SELECT 1 FROM existing_visits ev
        WHERE ev.scheduled_at = (p_date + vts.start_time)::TIMESTAMPTZ
      ) THEN false
      WHEN EXISTS (
        SELECT 1 FROM owner_availability oa
        WHERE vts.start_time >= oa.start_time
          AND vts.end_time <= oa.end_time
      ) THEN true
      ELSE false
    END as is_available
  FROM visit_time_slots vts
  WHERE vts.is_active = true
  ORDER BY vts.start_time;
END;
$$ LANGUAGE plpgsql;

-- Function: Check if a time slot is available
CREATE OR REPLACE FUNCTION is_slot_available(
  p_property_id UUID,
  p_scheduled_at TIMESTAMPTZ,
  p_duration_minutes INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_day_of_week INTEGER;
  v_time TIME;
  v_end_time TIME;
  v_is_available BOOLEAN;
  v_existing_visits INTEGER;
BEGIN
  -- Extract day of week and time
  v_day_of_week := EXTRACT(DOW FROM p_scheduled_at);
  v_time := p_scheduled_at::TIME;
  v_end_time := (p_scheduled_at + (p_duration_minutes || ' minutes')::INTERVAL)::TIME;

  -- Check if owner has availability for this day/time
  SELECT COUNT(*) INTO v_is_available
  FROM visit_availability
  WHERE property_id = p_property_id
    AND day_of_week = v_day_of_week
    AND is_available = true
    AND v_time >= start_time
    AND v_end_time <= end_time;

  IF v_is_available = 0 THEN
    RETURN false;
  END IF;

  -- Check if there's already a visit at this time
  SELECT COUNT(*) INTO v_existing_visits
  FROM property_visits
  WHERE property_id = p_property_id
    AND scheduled_at = p_scheduled_at
    AND status IN ('pending', 'confirmed');

  IF v_existing_visits > 0 THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- NOTIFICATION TRIGGERS
-- ============================================

-- Function: Notify on new visit booking
CREATE OR REPLACE FUNCTION notify_new_visit_booking()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification for property owner
  INSERT INTO notifications (user_id, type, title, message, link, data)
  VALUES (
    NEW.owner_id,
    'visit_requested',
    'New Visit Request',
    'Someone wants to visit your property',
    '/dashboard/owner/visits',
    jsonb_build_object(
      'visit_id', NEW.id,
      'property_id', NEW.property_id,
      'scheduled_at', NEW.scheduled_at
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_visit_booking
  AFTER INSERT ON property_visits
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_visit_booking();

-- Function: Notify on visit confirmation
CREATE OR REPLACE FUNCTION notify_visit_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status = 'pending' THEN
    -- Notify visitor
    INSERT INTO notifications (user_id, type, title, message, link, data)
    VALUES (
      NEW.visitor_id,
      'visit_confirmed',
      'Visit Confirmed',
      'Your property visit has been confirmed',
      '/dashboard/searcher/my-visits',
      jsonb_build_object(
        'visit_id', NEW.id,
        'property_id', NEW.property_id,
        'scheduled_at', NEW.scheduled_at
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_visit_status_change
  AFTER UPDATE ON property_visits
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION notify_visit_confirmed();

-- ============================================
-- HELPFUL VIEWS
-- ============================================

-- View: Upcoming visits with property and user details
CREATE OR REPLACE VIEW upcoming_visits AS
SELECT
  pv.id,
  pv.property_id,
  p.title as property_title,
  p.city as property_city,
  p.address as property_address,
  pv.visitor_id,
  u.full_name as visitor_name,
  u.email as visitor_email,
  pv.owner_id,
  o.full_name as owner_name,
  pv.scheduled_at,
  pv.duration_minutes,
  pv.visit_type,
  pv.status,
  pv.visitor_notes,
  pv.created_at
FROM property_visits pv
JOIN properties p ON p.id = pv.property_id
JOIN users u ON u.id = pv.visitor_id
JOIN users o ON o.id = pv.owner_id
WHERE pv.scheduled_at > NOW()
  AND pv.status IN ('pending', 'confirmed')
ORDER BY pv.scheduled_at ASC;

-- ============================================
-- GRANTS
-- ============================================

-- Grant access to authenticated users
GRANT SELECT ON visit_time_slots TO authenticated;
GRANT ALL ON visit_availability TO authenticated;
GRANT ALL ON property_visits TO authenticated;
GRANT SELECT ON upcoming_visits TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION get_available_slots(UUID, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION is_slot_available(UUID, TIMESTAMPTZ, INTEGER) TO authenticated;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE property_visits IS 'Scheduled visits for property viewings';
COMMENT ON TABLE visit_availability IS 'Property owner availability for visits';
COMMENT ON TABLE visit_time_slots IS 'Predefined time slots for booking visits';
COMMENT ON FUNCTION get_available_slots(UUID, DATE) IS 'Get all available time slots for a property on a specific date';
COMMENT ON FUNCTION is_slot_available(UUID, TIMESTAMPTZ, INTEGER) IS 'Check if a specific time slot is available for booking';
