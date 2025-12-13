-- ============================================================================
-- ENHANCED TASKS SYSTEM - Rotations, Exchanges, Proof Photos
-- ============================================================================
-- Tables: task_rotations, task_exchanges, user_availability
-- Purpose: Smart task assignment with automatic rotations
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. TASK_ROTATIONS - Automatic rotation scheduling
-- ============================================================================
CREATE TABLE IF NOT EXISTS task_rotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,

  -- Rotation configuration
  rotation_order JSONB NOT NULL, -- Array of user_ids: ["user1", "user2", "user3"]
  current_position INTEGER NOT NULL DEFAULT 0,

  -- Rotation frequency
  frequency TEXT NOT NULL DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly')),
  rotation_day INTEGER, -- 0-6 for weekly (0=Monday), 1-31 for monthly

  -- Last rotation tracking
  last_rotated_at TIMESTAMPTZ,
  next_rotation_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Unique: one rotation config per task
  UNIQUE(task_id)
);

-- ============================================================================
-- 2. TASK_EXCHANGES - Swap turns between roommates
-- ============================================================================
CREATE TABLE IF NOT EXISTS task_exchanges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,

  -- Exchange details
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Which assignment date to swap
  original_date DATE NOT NULL,
  proposed_date DATE,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),

  -- Response
  responded_at TIMESTAMPTZ,
  message TEXT,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. USER_AVAILABILITY - Vacation/pause mode
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,

  -- Availability period
  unavailable_from DATE NOT NULL,
  unavailable_to DATE NOT NULL,

  -- Reason
  reason TEXT CHECK (reason IN ('vacation', 'work_trip', 'illness', 'other')),
  notes TEXT,

  -- Auto-reassign tasks during this period
  auto_reassign BOOLEAN NOT NULL DEFAULT TRUE,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Validate dates
  CHECK (unavailable_to >= unavailable_from)
);

-- ============================================================================
-- 4. ENHANCE TASKS TABLE - Add proof photos and completion tracking
-- ============================================================================

-- Add proof_image_url for task completion photos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'proof_image_url'
  ) THEN
    ALTER TABLE tasks ADD COLUMN proof_image_url TEXT;
    RAISE NOTICE '✅ Added proof_image_url to tasks table';
  END IF;
END $$;

-- Add completion notes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'completion_notes'
  ) THEN
    ALTER TABLE tasks ADD COLUMN completion_notes TEXT;
    RAISE NOTICE '✅ Added completion_notes to tasks table';
  END IF;
END $$;

-- Add skip_count for tracking skipped rotations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'skip_count'
  ) THEN
    ALTER TABLE tasks ADD COLUMN skip_count INTEGER DEFAULT 0;
    RAISE NOTICE '✅ Added skip_count to tasks table';
  END IF;
END $$;

-- ============================================================================
-- 5. INDEXES for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_task_rotations_task ON task_rotations(task_id);
CREATE INDEX IF NOT EXISTS idx_task_rotations_next_rotation ON task_rotations(next_rotation_at);

CREATE INDEX IF NOT EXISTS idx_task_exchanges_task ON task_exchanges(task_id);
CREATE INDEX IF NOT EXISTS idx_task_exchanges_requester ON task_exchanges(requester_id);
CREATE INDEX IF NOT EXISTS idx_task_exchanges_target ON task_exchanges(target_id);
CREATE INDEX IF NOT EXISTS idx_task_exchanges_status ON task_exchanges(status);

CREATE INDEX IF NOT EXISTS idx_user_availability_user ON user_availability(user_id);
CREATE INDEX IF NOT EXISTS idx_user_availability_property ON user_availability(property_id);
CREATE INDEX IF NOT EXISTS idx_user_availability_dates ON user_availability(unavailable_from, unavailable_to);

-- ============================================================================
-- 6. RLS POLICIES - Row Level Security
-- ============================================================================

-- Task rotations
ALTER TABLE task_rotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY task_rotations_select_policy ON task_rotations
  FOR SELECT USING (
    task_id IN (
      SELECT id FROM tasks WHERE property_id IN (
        SELECT property_id FROM property_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY task_rotations_insert_policy ON task_rotations
  FOR INSERT WITH CHECK (
    task_id IN (
      SELECT id FROM tasks WHERE property_id IN (
        SELECT property_id FROM property_members WHERE user_id = auth.uid()
      )
    )
  );

-- Task exchanges
ALTER TABLE task_exchanges ENABLE ROW LEVEL SECURITY;

CREATE POLICY task_exchanges_select_policy ON task_exchanges
  FOR SELECT USING (
    requester_id = auth.uid() OR target_id = auth.uid()
  );

CREATE POLICY task_exchanges_insert_policy ON task_exchanges
  FOR INSERT WITH CHECK (
    requester_id = auth.uid()
  );

CREATE POLICY task_exchanges_update_policy ON task_exchanges
  FOR UPDATE USING (
    target_id = auth.uid() -- Only target can accept/decline
  );

-- User availability
ALTER TABLE user_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_availability_select_policy ON user_availability
  FOR SELECT USING (
    user_id = auth.uid() OR
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY user_availability_insert_policy ON user_availability
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
  );

CREATE POLICY user_availability_update_policy ON user_availability
  FOR UPDATE USING (
    user_id = auth.uid()
  );

-- ============================================================================
-- 7. FUNCTIONS for smart task rotation
-- ============================================================================

-- Function to rotate task assignment
CREATE OR REPLACE FUNCTION rotate_task_assignment(p_task_id UUID)
RETURNS TABLE (
  success BOOLEAN,
  new_assignee UUID,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_rotation RECORD;
  v_rotation_array JSONB;
  v_current_pos INTEGER;
  v_next_pos INTEGER;
  v_new_assignee UUID;
  v_order_length INTEGER;
BEGIN
  -- Get rotation config
  SELECT * INTO v_rotation
  FROM task_rotations
  WHERE task_id = p_task_id;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, 'No rotation configured for this task';
    RETURN;
  END IF;

  v_rotation_array := v_rotation.rotation_order;
  v_current_pos := v_rotation.current_position;
  v_order_length := jsonb_array_length(v_rotation_array);

  -- Calculate next position (wrap around)
  v_next_pos := (v_current_pos + 1) % v_order_length;

  -- Get new assignee
  v_new_assignee := (v_rotation_array->v_next_pos)::TEXT::UUID;

  -- Update task assignment
  UPDATE tasks
  SET assigned_to = v_new_assignee,
      status = 'pending',
      completed_at = NULL
  WHERE id = p_task_id;

  -- Update rotation tracking
  UPDATE task_rotations
  SET current_position = v_next_pos,
      last_rotated_at = NOW(),
      next_rotation_at = NOW() + CASE frequency
        WHEN 'daily' THEN INTERVAL '1 day'
        WHEN 'weekly' THEN INTERVAL '7 days'
        WHEN 'biweekly' THEN INTERVAL '14 days'
        WHEN 'monthly' THEN INTERVAL '30 days'
      END
  WHERE task_id = p_task_id;

  RETURN QUERY SELECT TRUE, v_new_assignee, 'Task rotated successfully';
END;
$$;

-- Function to get upcoming tasks for a user
CREATE OR REPLACE FUNCTION get_user_upcoming_tasks(
  p_user_id UUID,
  p_days_ahead INTEGER DEFAULT 7
)
RETURNS TABLE (
  task_id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  priority TEXT,
  due_date DATE,
  days_until_due INTEGER,
  has_rotation BOOLEAN,
  can_exchange BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id as task_id,
    t.title,
    t.description,
    t.category,
    t.priority,
    t.due_date,
    (t.due_date - CURRENT_DATE)::INTEGER as days_until_due,
    EXISTS(SELECT 1 FROM task_rotations WHERE task_id = t.id) as has_rotation,
    TRUE as can_exchange -- Can always request exchange
  FROM tasks t
  WHERE t.assigned_to = p_user_id
    AND t.status IN ('pending', 'in_progress')
    AND t.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + p_days_ahead
  ORDER BY t.due_date ASC, t.priority DESC;
END;
$$;

-- Function to check if user is available for task assignment
CREATE OR REPLACE FUNCTION is_user_available(
  p_user_id UUID,
  p_date DATE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM user_availability
    WHERE user_id = p_user_id
      AND p_date BETWEEN unavailable_from AND unavailable_to
  );
END;
$$;

-- ============================================================================
-- 8. TRIGGER for updated_at
-- ============================================================================
CREATE TRIGGER update_task_rotations_updated_at
  BEFORE UPDATE ON task_rotations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_exchanges_updated_at
  BEFORE UPDATE ON task_exchanges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_availability_updated_at
  BEFORE UPDATE ON user_availability
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
DO $$
DECLARE
  rotation_count INTEGER;
  exchange_count INTEGER;
  availability_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO rotation_count FROM task_rotations;
  SELECT COUNT(*) INTO exchange_count FROM task_exchanges;
  SELECT COUNT(*) INTO availability_count FROM user_availability;

  RAISE NOTICE '✅ Enhanced Tasks System Migration Complete!';
  RAISE NOTICE '   ├─ task_rotations table created';
  RAISE NOTICE '   ├─ task_exchanges table created';
  RAISE NOTICE '   ├─ user_availability table created';
  RAISE NOTICE '   ├─ tasks table enhanced (proof_image_url, completion_notes)';
  RAISE NOTICE '   ├─ Smart functions created (rotate_task_assignment, get_user_upcoming_tasks)';
  RAISE NOTICE '   ├─ RLS policies enabled';
  RAISE NOTICE '   └─ Current data: % rotations, % exchanges, % availability periods',
    rotation_count, exchange_count, availability_count;
END $$;
