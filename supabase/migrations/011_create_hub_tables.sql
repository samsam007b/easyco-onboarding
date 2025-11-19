-- ============================================================================
-- CREATE HUB TABLES FOR RESIDENT FEATURES
-- ============================================================================
-- Tables: expenses, tasks, calendar_events, maintenance_requests
-- Purpose: Replace mock data with real Supabase data
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. EXPENSES TABLE - Shared expenses tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  paid_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  category TEXT NOT NULL CHECK (category IN ('rent', 'utilities', 'groceries', 'cleaning', 'maintenance', 'internet', 'other')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
  split_type TEXT NOT NULL DEFAULT 'equal' CHECK (split_type IN ('equal', 'custom', 'percentage')),
  receipt_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Expense splits (who owes what)
CREATE TABLE IF NOT EXISTS expense_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_owed DECIMAL(10, 2) NOT NULL CHECK (amount_owed >= 0),
  paid BOOLEAN NOT NULL DEFAULT FALSE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(expense_id, user_id)
);

-- ============================================================================
-- 2. TASKS TABLE - Shared chores and responsibilities
-- ============================================================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('cleaning', 'groceries', 'maintenance', 'admin', 'other')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  recurrence TEXT CHECK (recurrence IN ('none', 'daily', 'weekly', 'biweekly', 'monthly')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. CALENDAR EVENTS TABLE - Community events and important dates
-- ============================================================================
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('meeting', 'party', 'maintenance', 'inspection', 'payment_due', 'other')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  all_day BOOLEAN NOT NULL DEFAULT FALSE,
  location TEXT,
  color TEXT DEFAULT '#FFA040',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Event attendees
CREATE TABLE IF NOT EXISTS event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'maybe')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ============================================================================
-- 4. MAINTENANCE REQUESTS TABLE - Issues and repairs
-- ============================================================================
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('plumbing', 'electrical', 'heating', 'appliances', 'structural', 'cleaning', 'pest_control', 'other')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'emergency')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'cancelled')),
  location TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  assigned_to TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_expenses_property ON expenses(property_id);
CREATE INDEX IF NOT EXISTS idx_expenses_created_by ON expenses(created_by);
CREATE INDEX IF NOT EXISTS idx_expenses_paid_by ON expenses(paid_by_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expense_splits_user ON expense_splits(user_id);

CREATE INDEX IF NOT EXISTS idx_tasks_property ON tasks(property_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

CREATE INDEX IF NOT EXISTS idx_calendar_events_property ON calendar_events(property_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_date ON calendar_events(start_date);

CREATE INDEX IF NOT EXISTS idx_maintenance_requests_property ON maintenance_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_status ON maintenance_requests(status);

-- ============================================================================
-- RLS POLICIES - Row Level Security
-- ============================================================================

-- Expenses: Users can only see expenses for properties they're members of
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY expenses_select_policy ON expenses
  FOR SELECT USING (
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );
CREATE POLICY expenses_insert_policy ON expenses
  FOR INSERT WITH CHECK (
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );

-- Expense splits
ALTER TABLE expense_splits ENABLE ROW LEVEL SECURITY;
CREATE POLICY expense_splits_select_policy ON expense_splits
  FOR SELECT USING (
    expense_id IN (
      SELECT id FROM expenses WHERE property_id IN (
        SELECT property_id FROM property_members WHERE user_id = auth.uid()
      )
    )
  );

-- Tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY tasks_select_policy ON tasks
  FOR SELECT USING (
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );
CREATE POLICY tasks_insert_policy ON tasks
  FOR INSERT WITH CHECK (
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );
CREATE POLICY tasks_update_policy ON tasks
  FOR UPDATE USING (
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );

-- Calendar events
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY calendar_events_select_policy ON calendar_events
  FOR SELECT USING (
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );
CREATE POLICY calendar_events_insert_policy ON calendar_events
  FOR INSERT WITH CHECK (
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );

-- Event attendees
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
CREATE POLICY event_attendees_select_policy ON event_attendees
  FOR SELECT USING (
    event_id IN (
      SELECT id FROM calendar_events WHERE property_id IN (
        SELECT property_id FROM property_members WHERE user_id = auth.uid()
      )
    )
  );

-- Maintenance requests
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY maintenance_requests_select_policy ON maintenance_requests
  FOR SELECT USING (
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );
CREATE POLICY maintenance_requests_insert_policy ON maintenance_requests
  FOR INSERT WITH CHECK (
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- TRIGGER for updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_requests_updated_at BEFORE UPDATE ON maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ Hub tables created successfully!';
  RAISE NOTICE '   - expenses & expense_splits';
  RAISE NOTICE '   - tasks';
  RAISE NOTICE '   - calendar_events & event_attendees';
  RAISE NOTICE '   - maintenance_requests';
  RAISE NOTICE '   - All with RLS policies enabled';
END $$;
