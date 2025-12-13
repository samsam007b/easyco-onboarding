-- ============================================================================
-- RESIDENT FEATURES - COMPLETE MIGRATIONS
-- ============================================================================
-- Apply these 3 migrations in order via Supabase Dashboard SQL Editor
-- Dashboard URL: https://supabase.com/dashboard/project/fgthoyilfupywmpmiuwd/editor
-- ============================================================================

-- ============================================================================
-- MIGRATION 1/3: ENHANCED FINANCES SYSTEM
-- ============================================================================
-- Tables: rent_payments, enhanced expenses with OCR support
-- ============================================================================

BEGIN;

-- 1. RENT_PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS rent_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  paid_at TIMESTAMPTZ,
  proof_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(property_id, user_id, month)
);

-- 2. ENHANCE EXPENSES TABLE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'receipt_image_url'
  ) THEN
    ALTER TABLE expenses ADD COLUMN receipt_image_url TEXT;
    RAISE NOTICE '✅ Added receipt_image_url to expenses';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'ocr_data'
  ) THEN
    ALTER TABLE expenses ADD COLUMN ocr_data JSONB;
    RAISE NOTICE '✅ Added ocr_data to expenses';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'split_method'
  ) THEN
    ALTER TABLE expenses ADD COLUMN split_method TEXT DEFAULT 'equal' CHECK (split_method IN ('equal', 'custom', 'percentage', 'by_item'));
    RAISE NOTICE '✅ Added split_method to expenses';
  END IF;
END $$;

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_rent_payments_property ON rent_payments(property_id);
CREATE INDEX IF NOT EXISTS idx_rent_payments_user ON rent_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_rent_payments_month ON rent_payments(month);
CREATE INDEX IF NOT EXISTS idx_rent_payments_status ON rent_payments(status);

-- 4. RLS POLICIES
ALTER TABLE rent_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY rent_payments_select_policy ON rent_payments
  FOR SELECT USING (
    user_id = auth.uid() OR
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY rent_payments_insert_policy ON rent_payments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY rent_payments_update_policy ON rent_payments
  FOR UPDATE USING (user_id = auth.uid());

-- 5. FUNCTIONS
CREATE OR REPLACE FUNCTION get_upcoming_rent_dues(
  p_user_id UUID,
  p_days_ahead INTEGER DEFAULT 30
)
RETURNS TABLE (
  property_id UUID,
  property_name TEXT,
  amount DECIMAL,
  due_date DATE,
  status TEXT,
  days_until_due INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    rp.property_id,
    p.title as property_name,
    rp.amount,
    rp.due_date,
    rp.status,
    (rp.due_date - CURRENT_DATE)::INTEGER as days_until_due
  FROM rent_payments rp
  JOIN properties p ON p.id = rp.property_id
  WHERE rp.user_id = p_user_id
    AND rp.status IN ('pending', 'overdue')
    AND rp.due_date <= CURRENT_DATE + p_days_ahead
  ORDER BY rp.due_date ASC;
END;
$$;

-- 6. TRIGGERS
CREATE TRIGGER update_rent_payments_updated_at
  BEFORE UPDATE ON rent_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMIT;

RAISE NOTICE '✅ Migration 1/3 Complete: Enhanced Finances System';

-- ============================================================================
-- MIGRATION 2/3: ENHANCED TASKS SYSTEM
-- ============================================================================
-- Tables: task_rotations, task_exchanges, user_availability
-- ============================================================================

BEGIN;

-- 1. TASK_ROTATIONS
CREATE TABLE IF NOT EXISTS task_rotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  rotation_order JSONB NOT NULL,
  current_position INTEGER NOT NULL DEFAULT 0,
  frequency TEXT NOT NULL DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly')),
  rotation_day INTEGER,
  last_rotated_at TIMESTAMPTZ,
  next_rotation_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(task_id)
);

-- 2. TASK_EXCHANGES
CREATE TABLE IF NOT EXISTS task_exchanges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  original_date DATE NOT NULL,
  proposed_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),
  responded_at TIMESTAMPTZ,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. USER_AVAILABILITY
CREATE TABLE IF NOT EXISTS user_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  unavailable_from DATE NOT NULL,
  unavailable_to DATE NOT NULL,
  reason TEXT CHECK (reason IN ('vacation', 'work_trip', 'illness', 'other')),
  notes TEXT,
  auto_reassign BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (unavailable_to >= unavailable_from)
);

-- 4. ENHANCE TASKS TABLE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'proof_image_url'
  ) THEN
    ALTER TABLE tasks ADD COLUMN proof_image_url TEXT;
    RAISE NOTICE '✅ Added proof_image_url to tasks';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'completion_notes'
  ) THEN
    ALTER TABLE tasks ADD COLUMN completion_notes TEXT;
    RAISE NOTICE '✅ Added completion_notes to tasks';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'skip_count'
  ) THEN
    ALTER TABLE tasks ADD COLUMN skip_count INTEGER DEFAULT 0;
    RAISE NOTICE '✅ Added skip_count to tasks';
  END IF;
END $$;

-- 5. INDEXES
CREATE INDEX IF NOT EXISTS idx_task_rotations_task ON task_rotations(task_id);
CREATE INDEX IF NOT EXISTS idx_task_rotations_next_rotation ON task_rotations(next_rotation_at);
CREATE INDEX IF NOT EXISTS idx_task_exchanges_task ON task_exchanges(task_id);
CREATE INDEX IF NOT EXISTS idx_task_exchanges_requester ON task_exchanges(requester_id);
CREATE INDEX IF NOT EXISTS idx_task_exchanges_target ON task_exchanges(target_id);
CREATE INDEX IF NOT EXISTS idx_user_availability_user ON user_availability(user_id);
CREATE INDEX IF NOT EXISTS idx_user_availability_property ON user_availability(property_id);

-- 6. RLS POLICIES
ALTER TABLE task_rotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_exchanges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY task_rotations_select_policy ON task_rotations
  FOR SELECT USING (
    task_id IN (
      SELECT id FROM tasks WHERE property_id IN (
        SELECT property_id FROM property_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY task_exchanges_select_policy ON task_exchanges
  FOR SELECT USING (requester_id = auth.uid() OR target_id = auth.uid());

CREATE POLICY task_exchanges_insert_policy ON task_exchanges
  FOR INSERT WITH CHECK (requester_id = auth.uid());

CREATE POLICY user_availability_select_policy ON user_availability
  FOR SELECT USING (
    user_id = auth.uid() OR
    property_id IN (SELECT property_id FROM property_members WHERE user_id = auth.uid())
  );

CREATE POLICY user_availability_insert_policy ON user_availability
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- 7. FUNCTIONS
CREATE OR REPLACE FUNCTION rotate_task_assignment(p_task_id UUID)
RETURNS TABLE (success BOOLEAN, new_assignee UUID, message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_rotation RECORD;
  v_next_pos INTEGER;
  v_new_assignee UUID;
BEGIN
  SELECT * INTO v_rotation FROM task_rotations WHERE task_id = p_task_id;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, 'No rotation configured';
    RETURN;
  END IF;

  v_next_pos := (v_rotation.current_position + 1) % jsonb_array_length(v_rotation.rotation_order);
  v_new_assignee := (v_rotation.rotation_order->v_next_pos)::TEXT::UUID;

  UPDATE tasks SET assigned_to = v_new_assignee, status = 'pending' WHERE id = p_task_id;
  UPDATE task_rotations SET current_position = v_next_pos, last_rotated_at = NOW() WHERE task_id = p_task_id;

  RETURN QUERY SELECT TRUE, v_new_assignee, 'Rotation successful';
END;
$$;

-- 8. TRIGGERS
CREATE TRIGGER update_task_rotations_updated_at
  BEFORE UPDATE ON task_rotations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_exchanges_updated_at
  BEFORE UPDATE ON task_exchanges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_availability_updated_at
  BEFORE UPDATE ON user_availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

RAISE NOTICE '✅ Migration 2/3 Complete: Enhanced Tasks System';

-- ============================================================================
-- MIGRATION 3/3: DOCUMENT VAULT SYSTEM
-- ============================================================================
-- Tables: property_documents, document_shares
-- ============================================================================

BEGIN;

-- 1. PROPERTY_DOCUMENTS
CREATE TABLE IF NOT EXISTS property_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'lease', 'insurance', 'inventory', 'rules', 'bills',
    'maintenance', 'contracts', 'receipts', 'other'
  )),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  is_private BOOLEAN NOT NULL DEFAULT FALSE,
  requires_approval BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at DATE,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. DOCUMENT_SHARES
CREATE TABLE IF NOT EXISTS document_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES property_documents(id) ON DELETE CASCADE,
  shared_with UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  can_download BOOLEAN NOT NULL DEFAULT TRUE,
  can_delete BOOLEAN NOT NULL DEFAULT FALSE,
  shared_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  shared_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(document_id, shared_with)
);

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_property_documents_property ON property_documents(property_id);
CREATE INDEX IF NOT EXISTS idx_property_documents_category ON property_documents(category);
CREATE INDEX IF NOT EXISTS idx_property_documents_uploaded_by ON property_documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_property_documents_tags ON property_documents USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_document_shares_document ON document_shares(document_id);
CREATE INDEX IF NOT EXISTS idx_document_shares_user ON document_shares(shared_with);

-- 4. RLS POLICIES
ALTER TABLE property_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY property_documents_select_policy ON property_documents
  FOR SELECT USING (
    (NOT is_private AND property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )) OR
    uploaded_by = auth.uid() OR
    id IN (SELECT document_id FROM document_shares WHERE shared_with = auth.uid())
  );

CREATE POLICY property_documents_insert_policy ON property_documents
  FOR INSERT WITH CHECK (
    property_id IN (SELECT property_id FROM property_members WHERE user_id = auth.uid())
  );

CREATE POLICY property_documents_update_policy ON property_documents
  FOR UPDATE USING (uploaded_by = auth.uid());

CREATE POLICY property_documents_delete_policy ON property_documents
  FOR DELETE USING (uploaded_by = auth.uid());

CREATE POLICY document_shares_select_policy ON document_shares
  FOR SELECT USING (
    document_id IN (
      SELECT id FROM property_documents WHERE uploaded_by = auth.uid() OR shared_with = auth.uid()
    )
  );

CREATE POLICY document_shares_insert_policy ON document_shares
  FOR INSERT WITH CHECK (
    document_id IN (SELECT id FROM property_documents WHERE uploaded_by = auth.uid())
  );

-- 5. FUNCTIONS
CREATE OR REPLACE FUNCTION get_document_stats(p_property_id UUID)
RETURNS TABLE (
  total_documents INTEGER,
  total_size_bytes BIGINT,
  by_category JSONB,
  expiring_soon INTEGER,
  expired INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT
      COUNT(*)::INTEGER as total_docs,
      SUM(file_size)::BIGINT as total_bytes,
      jsonb_object_agg(category, COUNT(*)) as cat_counts,
      COUNT(CASE WHEN expires_at BETWEEN CURRENT_DATE AND CURRENT_DATE + 30 THEN 1 END)::INTEGER as expiring,
      COUNT(CASE WHEN expires_at < CURRENT_DATE THEN 1 END)::INTEGER as expired_count
    FROM property_documents
    WHERE property_id = p_property_id
  )
  SELECT total_docs, total_bytes, cat_counts, expiring, expired_count FROM stats;
END;
$$;

CREATE OR REPLACE FUNCTION search_documents(p_property_id UUID, p_query TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  file_name TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT pd.id, pd.title, pd.description, pd.category, pd.file_name, pd.created_at
  FROM property_documents pd
  WHERE pd.property_id = p_property_id
    AND (
      pd.title ILIKE '%' || p_query || '%' OR
      pd.description ILIKE '%' || p_query || '%' OR
      pd.tags && ARRAY[p_query] OR
      pd.file_name ILIKE '%' || p_query || '%'
    )
  ORDER BY pd.created_at DESC;
END;
$$;

-- 6. TRIGGERS
CREATE TRIGGER update_property_documents_updated_at
  BEFORE UPDATE ON property_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

RAISE NOTICE '✅ Migration 3/3 Complete: Document Vault System';

-- ============================================================================
-- FINAL VERIFICATION
-- ============================================================================

DO $$
DECLARE
  rent_count INTEGER;
  rotation_count INTEGER;
  doc_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO rent_count FROM rent_payments;
  SELECT COUNT(*) INTO rotation_count FROM task_rotations;
  SELECT COUNT(*) INTO doc_count FROM property_documents;

  RAISE NOTICE '';
  RAISE NOTICE '🎉 ALL MIGRATIONS COMPLETED SUCCESSFULLY!';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Created Tables:';
  RAISE NOTICE '   ✅ rent_payments (% rows)', rent_count;
  RAISE NOTICE '   ✅ task_rotations (% rows)', rotation_count;
  RAISE NOTICE '   ✅ task_exchanges';
  RAISE NOTICE '   ✅ user_availability';
  RAISE NOTICE '   ✅ property_documents (% rows)', doc_count;
  RAISE NOTICE '   ✅ document_shares';
  RAISE NOTICE '';
  RAISE NOTICE '📦 Enhanced Tables:';
  RAISE NOTICE '   ✅ expenses (+ receipt_image_url, ocr_data, split_method)';
  RAISE NOTICE '   ✅ tasks (+ proof_image_url, completion_notes, skip_count)';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Next Steps:';
  RAISE NOTICE '   1. Activate UIs by renaming new-page.tsx → page.tsx';
  RAISE NOTICE '   2. Test Finance Scanner with OCR';
  RAISE NOTICE '   3. Test Task Rotations';
  RAISE NOTICE '   4. Test Maintenance Tickets';
  RAISE NOTICE '';
END $$;
