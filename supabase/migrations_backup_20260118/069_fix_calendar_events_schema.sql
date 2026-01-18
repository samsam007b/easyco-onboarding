-- ============================================================================
-- FIX CALENDAR EVENTS SCHEMA
-- ============================================================================
-- Issues to fix:
-- 1. Rename start_date/end_date to start_time/end_time to match app code
-- 2. Remove event_type constraint (app doesn't use it)
-- 3. Add missing RLS policies for UPDATE and DELETE operations
-- 4. Add INSERT policy for event_attendees
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. FIX CALENDAR_EVENTS SCHEMA
-- ============================================================================

-- Check if columns need to be renamed
DO $$
BEGIN
  -- Rename start_date to start_time if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'calendar_events'
    AND column_name = 'start_date'
  ) THEN
    ALTER TABLE calendar_events RENAME COLUMN start_date TO start_time;
    RAISE NOTICE '✅ Renamed start_date to start_time';
  END IF;

  -- Rename end_date to end_time if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'calendar_events'
    AND column_name = 'end_date'
  ) THEN
    ALTER TABLE calendar_events RENAME COLUMN end_date TO end_time;
    RAISE NOTICE '✅ Renamed end_date to end_time';
  END IF;
END $$;

-- Drop the event_type constraint to make it optional
ALTER TABLE calendar_events ALTER COLUMN event_type DROP NOT NULL;

-- Update index to use start_time instead of start_date
DROP INDEX IF EXISTS idx_calendar_events_start_date;
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);

-- ============================================================================
-- 2. ADD MISSING RLS POLICIES
-- ============================================================================

-- Calendar Events: Add UPDATE and DELETE policies
DROP POLICY IF EXISTS calendar_events_update_policy ON calendar_events;
CREATE POLICY calendar_events_update_policy ON calendar_events
  FOR UPDATE USING (
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS calendar_events_delete_policy ON calendar_events;
CREATE POLICY calendar_events_delete_policy ON calendar_events
  FOR DELETE USING (
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );

-- Event Attendees: Add INSERT, UPDATE, and DELETE policies
DROP POLICY IF EXISTS event_attendees_insert_policy ON event_attendees;
CREATE POLICY event_attendees_insert_policy ON event_attendees
  FOR INSERT WITH CHECK (
    event_id IN (
      SELECT id FROM calendar_events WHERE property_id IN (
        SELECT property_id FROM property_members WHERE user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS event_attendees_update_policy ON event_attendees;
CREATE POLICY event_attendees_update_policy ON event_attendees
  FOR UPDATE USING (
    event_id IN (
      SELECT id FROM calendar_events WHERE property_id IN (
        SELECT property_id FROM property_members WHERE user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS event_attendees_delete_policy ON event_attendees;
CREATE POLICY event_attendees_delete_policy ON event_attendees
  FOR DELETE USING (
    event_id IN (
      SELECT id FROM calendar_events WHERE property_id IN (
        SELECT property_id FROM property_members WHERE user_id = auth.uid()
      )
    )
  );

COMMIT;

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ Calendar events schema fixed!';
  RAISE NOTICE '   - Columns renamed: start_date -> start_time, end_date -> end_time';
  RAISE NOTICE '   - event_type is now optional';
  RAISE NOTICE '   - Added UPDATE and DELETE policies for calendar_events';
  RAISE NOTICE '   - Added INSERT, UPDATE, DELETE policies for event_attendees';
END $$;
