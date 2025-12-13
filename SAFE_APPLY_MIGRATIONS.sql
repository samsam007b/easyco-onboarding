-- ============================================================================
-- SAFE MIGRATIONS - Can be run multiple times without errors
-- ============================================================================
-- This script safely applies all 4 Resident migrations
-- It skips items that already exist
-- ============================================================================

BEGIN;

-- ============================================================================
-- MIGRATION 080: ENHANCED FINANCES SYSTEM
-- ============================================================================

-- 1. CREATE rent_payments TABLE
CREATE TABLE IF NOT EXISTS rent_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'partial')),
  proof_url TEXT,
  paid_at TIMESTAMPTZ,
  due_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(property_id, user_id, month)
);

-- 2. ENHANCE expenses TABLE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'receipt_image_url'
  ) THEN
    ALTER TABLE expenses ADD COLUMN receipt_image_url TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'ocr_data'
  ) THEN
    ALTER TABLE expenses ADD COLUMN ocr_data JSONB;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'split_method'
  ) THEN
    ALTER TABLE expenses ADD COLUMN split_method TEXT DEFAULT 'equal' CHECK (split_method IN ('equal', 'custom', 'percentage', 'by_item'));
  END IF;
END $$;

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_rent_payments_property ON rent_payments(property_id);
CREATE INDEX IF NOT EXISTS idx_rent_payments_user ON rent_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_rent_payments_month ON rent_payments(month);
CREATE INDEX IF NOT EXISTS idx_rent_payments_status ON rent_payments(status);
CREATE INDEX IF NOT EXISTS idx_rent_payments_due_date ON rent_payments(due_date);

-- 4. RLS POLICIES (with DROP IF EXISTS first)
ALTER TABLE rent_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rent_payments_select_policy ON rent_payments;
CREATE POLICY rent_payments_select_policy ON rent_payments
  FOR SELECT USING (
    user_id = auth.uid() OR
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS rent_payments_insert_policy ON rent_payments;
CREATE POLICY rent_payments_insert_policy ON rent_payments
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS rent_payments_update_policy ON rent_payments;
CREATE POLICY rent_payments_update_policy ON rent_payments
  FOR UPDATE USING (user_id = auth.uid());

-- 5. FUNCTIONS
CREATE OR REPLACE FUNCTION get_upcoming_rent_dues(p_user_id UUID, p_days_ahead INTEGER DEFAULT 30)
RETURNS TABLE (
  payment_id UUID,
  property_id UUID,
  property_name TEXT,
  amount DECIMAL(10, 2),
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
    rp.id as payment_id,
    rp.property_id,
    p.title as property_name,
    rp.amount,
    rp.due_date,
    rp.status,
    (rp.due_date - CURRENT_DATE)::INTEGER as days_until_due
  FROM rent_payments rp
  JOIN properties p ON p.id = rp.property_id
  WHERE rp.user_id = p_user_id
    AND rp.status IN ('pending', 'partial')
    AND rp.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + p_days_ahead
  ORDER BY rp.due_date ASC;
END;
$$;

CREATE OR REPLACE FUNCTION get_expense_averages(p_property_id UUID, p_months INTEGER DEFAULT 3)
RETURNS TABLE (
  category TEXT,
  avg_amount DECIMAL(10, 2),
  expense_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.category,
    AVG(e.amount)::DECIMAL(10, 2) as avg_amount,
    COUNT(*)::INTEGER as expense_count
  FROM expenses e
  WHERE e.property_id = p_property_id
    AND e.date >= CURRENT_DATE - (p_months || ' months')::INTERVAL
  GROUP BY e.category
  ORDER BY avg_amount DESC;
END;
$$;

-- 6. TRIGGER
DROP TRIGGER IF EXISTS update_rent_payments_updated_at ON rent_payments;
CREATE TRIGGER update_rent_payments_updated_at
  BEFORE UPDATE ON rent_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION 081: ENHANCED TASKS SYSTEM
-- ============================================================================

-- 1. task_rotations TABLE
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

-- 2. task_exchanges TABLE
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

-- 3. user_availability TABLE
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

-- 4. ENHANCE tasks TABLE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'proof_image_url'
  ) THEN
    ALTER TABLE tasks ADD COLUMN proof_image_url TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'completion_notes'
  ) THEN
    ALTER TABLE tasks ADD COLUMN completion_notes TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'skip_count'
  ) THEN
    ALTER TABLE tasks ADD COLUMN skip_count INTEGER DEFAULT 0;
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

DROP POLICY IF EXISTS task_rotations_select_policy ON task_rotations;
CREATE POLICY task_rotations_select_policy ON task_rotations
  FOR SELECT USING (
    task_id IN (
      SELECT id FROM tasks WHERE property_id IN (
        SELECT property_id FROM property_members WHERE user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS task_exchanges_select_policy ON task_exchanges;
CREATE POLICY task_exchanges_select_policy ON task_exchanges
  FOR SELECT USING (requester_id = auth.uid() OR target_id = auth.uid());

DROP POLICY IF EXISTS task_exchanges_insert_policy ON task_exchanges;
CREATE POLICY task_exchanges_insert_policy ON task_exchanges
  FOR INSERT WITH CHECK (requester_id = auth.uid());

DROP POLICY IF EXISTS user_availability_select_policy ON user_availability;
CREATE POLICY user_availability_select_policy ON user_availability
  FOR SELECT USING (
    user_id = auth.uid() OR
    property_id IN (SELECT property_id FROM property_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS user_availability_insert_policy ON user_availability;
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
    RETURN QUERY SELECT FALSE, NULL::UUID, 'No rotation configured'::TEXT;
    RETURN;
  END IF;
  v_next_pos := (v_rotation.current_position + 1) % jsonb_array_length(v_rotation.rotation_order);
  v_new_assignee := (v_rotation.rotation_order->v_next_pos)::TEXT::UUID;
  UPDATE tasks SET assigned_to = v_new_assignee, status = 'pending' WHERE id = p_task_id;
  UPDATE task_rotations SET current_position = v_next_pos, last_rotated_at = NOW() WHERE task_id = p_task_id;
  RETURN QUERY SELECT TRUE, v_new_assignee, 'Rotation successful'::TEXT;
END;
$$;

-- 8. TRIGGERS
DROP TRIGGER IF EXISTS update_task_rotations_updated_at ON task_rotations;
CREATE TRIGGER update_task_rotations_updated_at
  BEFORE UPDATE ON task_rotations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_task_exchanges_updated_at ON task_exchanges;
CREATE TRIGGER update_task_exchanges_updated_at
  BEFORE UPDATE ON task_exchanges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_availability_updated_at ON user_availability;
CREATE TRIGGER update_user_availability_updated_at
  BEFORE UPDATE ON user_availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION 082: DOCUMENT VAULT SYSTEM
-- ============================================================================

-- 1. property_documents TABLE
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

-- 2. document_shares TABLE
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

DROP POLICY IF EXISTS property_documents_select_policy ON property_documents;
CREATE POLICY property_documents_select_policy ON property_documents
  FOR SELECT USING (
    (NOT is_private AND property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )) OR
    uploaded_by = auth.uid() OR
    id IN (SELECT document_id FROM document_shares WHERE shared_with = auth.uid())
  );

DROP POLICY IF EXISTS property_documents_insert_policy ON property_documents;
CREATE POLICY property_documents_insert_policy ON property_documents
  FOR INSERT WITH CHECK (
    property_id IN (SELECT property_id FROM property_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS property_documents_update_policy ON property_documents;
CREATE POLICY property_documents_update_policy ON property_documents
  FOR UPDATE USING (uploaded_by = auth.uid());

DROP POLICY IF EXISTS property_documents_delete_policy ON property_documents;
CREATE POLICY property_documents_delete_policy ON property_documents
  FOR DELETE USING (uploaded_by = auth.uid());

DROP POLICY IF EXISTS document_shares_select_policy ON document_shares;
CREATE POLICY document_shares_select_policy ON document_shares
  FOR SELECT USING (
    document_id IN (
      SELECT id FROM property_documents WHERE uploaded_by = auth.uid() OR shared_with = auth.uid()
    )
  );

DROP POLICY IF EXISTS document_shares_insert_policy ON document_shares;
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
DROP TRIGGER IF EXISTS update_property_documents_updated_at ON property_documents;
CREATE TRIGGER update_property_documents_updated_at
  BEFORE UPDATE ON property_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION 083: HOUSE RULES + VOTING SYSTEM
-- ============================================================================

-- 1. house_rules TABLE
CREATE TABLE IF NOT EXISTS house_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  proposed_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'cleaning', 'noise', 'guests', 'common_areas',
    'kitchen', 'bathroom', 'pets', 'smoking', 'other'
  )),
  status TEXT NOT NULL DEFAULT 'voting' CHECK (status IN ('voting', 'active', 'rejected', 'archived')),
  votes_required INTEGER NOT NULL DEFAULT 0,
  votes_for INTEGER NOT NULL DEFAULT 0,
  votes_against INTEGER NOT NULL DEFAULT 0,
  votes_abstain INTEGER NOT NULL DEFAULT 0,
  voting_ends_at TIMESTAMPTZ,
  activated_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. rule_votes TABLE
CREATE TABLE IF NOT EXISTS rule_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID NOT NULL REFERENCES house_rules(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('for', 'against', 'abstain')),
  comment TEXT,
  voted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(rule_id, user_id)
);

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_house_rules_property ON house_rules(property_id);
CREATE INDEX IF NOT EXISTS idx_house_rules_status ON house_rules(status);
CREATE INDEX IF NOT EXISTS idx_house_rules_category ON house_rules(category);
CREATE INDEX IF NOT EXISTS idx_house_rules_voting_ends ON house_rules(voting_ends_at);
CREATE INDEX IF NOT EXISTS idx_rule_votes_rule ON rule_votes(rule_id);
CREATE INDEX IF NOT EXISTS idx_rule_votes_user ON rule_votes(user_id);

-- 4. RLS POLICIES
ALTER TABLE house_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS house_rules_select_policy ON house_rules;
CREATE POLICY house_rules_select_policy ON house_rules
  FOR SELECT USING (
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS house_rules_insert_policy ON house_rules;
CREATE POLICY house_rules_insert_policy ON house_rules
  FOR INSERT WITH CHECK (
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    ) AND proposed_by = auth.uid()
  );

DROP POLICY IF EXISTS house_rules_update_policy ON house_rules;
CREATE POLICY house_rules_update_policy ON house_rules
  FOR UPDATE USING (
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS rule_votes_select_policy ON rule_votes;
CREATE POLICY rule_votes_select_policy ON rule_votes
  FOR SELECT USING (
    rule_id IN (
      SELECT id FROM house_rules WHERE property_id IN (
        SELECT property_id FROM property_members WHERE user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS rule_votes_insert_policy ON rule_votes;
CREATE POLICY rule_votes_insert_policy ON rule_votes
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    rule_id IN (
      SELECT id FROM house_rules WHERE property_id IN (
        SELECT property_id FROM property_members WHERE user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS rule_votes_update_policy ON rule_votes;
CREATE POLICY rule_votes_update_policy ON rule_votes
  FOR UPDATE USING (user_id = auth.uid());

-- 5. FUNCTIONS
CREATE OR REPLACE FUNCTION cast_rule_vote(
  p_rule_id UUID,
  p_user_id UUID,
  p_vote TEXT,
  p_comment TEXT DEFAULT NULL
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  votes_for INTEGER,
  votes_against INTEGER,
  votes_abstain INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_old_vote TEXT;
  v_rule RECORD;
BEGIN
  SELECT vote INTO v_old_vote FROM rule_votes
  WHERE rule_id = p_rule_id AND user_id = p_user_id;

  INSERT INTO rule_votes (rule_id, user_id, vote, comment)
  VALUES (p_rule_id, p_user_id, p_vote, p_comment)
  ON CONFLICT (rule_id, user_id)
  DO UPDATE SET vote = p_vote, comment = p_comment, voted_at = NOW();

  SELECT * INTO v_rule FROM house_rules WHERE id = p_rule_id;

  IF v_old_vote = 'for' THEN
    UPDATE house_rules SET votes_for = votes_for - 1 WHERE id = p_rule_id;
  ELSIF v_old_vote = 'against' THEN
    UPDATE house_rules SET votes_against = votes_against - 1 WHERE id = p_rule_id;
  ELSIF v_old_vote = 'abstain' THEN
    UPDATE house_rules SET votes_abstain = votes_abstain - 1 WHERE id = p_rule_id;
  END IF;

  IF p_vote = 'for' THEN
    UPDATE house_rules SET votes_for = votes_for + 1 WHERE id = p_rule_id;
  ELSIF p_vote = 'against' THEN
    UPDATE house_rules SET votes_against = votes_against + 1 WHERE id = p_rule_id;
  ELSIF p_vote = 'abstain' THEN
    UPDATE house_rules SET votes_abstain = votes_abstain + 1 WHERE id = p_rule_id;
  END IF;

  SELECT votes_for, votes_against, votes_abstain INTO v_rule
  FROM house_rules WHERE id = p_rule_id;

  RETURN QUERY SELECT
    TRUE,
    'Vote enregistré'::TEXT,
    v_rule.votes_for,
    v_rule.votes_against,
    v_rule.votes_abstain;
END;
$$;

CREATE OR REPLACE FUNCTION finalize_rule_voting(p_rule_id UUID)
RETURNS TABLE (
  success BOOLEAN,
  new_status TEXT,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_rule RECORD;
  v_total_votes INTEGER;
  v_new_status TEXT;
BEGIN
  SELECT * INTO v_rule FROM house_rules WHERE id = p_rule_id;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::TEXT, 'Règle non trouvée'::TEXT;
    RETURN;
  END IF;

  IF v_rule.status != 'voting' THEN
    RETURN QUERY SELECT FALSE, v_rule.status, 'Vote déjà finalisé'::TEXT;
    RETURN;
  END IF;

  v_total_votes := v_rule.votes_for + v_rule.votes_against + v_rule.votes_abstain;

  IF v_total_votes < v_rule.votes_required THEN
    RETURN QUERY SELECT FALSE, 'voting'::TEXT, 'Pas assez de votes'::TEXT;
    RETURN;
  END IF;

  IF v_rule.votes_for > v_rule.votes_against THEN
    v_new_status := 'active';
    UPDATE house_rules SET status = 'active', activated_at = NOW() WHERE id = p_rule_id;
  ELSE
    v_new_status := 'rejected';
    UPDATE house_rules SET status = 'rejected' WHERE id = p_rule_id;
  END IF;

  RETURN QUERY SELECT TRUE, v_new_status, 'Vote finalisé'::TEXT;
END;
$$;

CREATE OR REPLACE FUNCTION get_active_rules_summary(p_property_id UUID)
RETURNS TABLE (
  total_rules INTEGER,
  by_category JSONB,
  recent_rules JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT
      COUNT(*)::INTEGER as total,
      jsonb_object_agg(category, COUNT(*)) as categories,
      jsonb_agg(
        jsonb_build_object(
          'id', id,
          'title', title,
          'category', category,
          'activated_at', activated_at
        ) ORDER BY activated_at DESC
      ) FILTER (WHERE activated_at >= NOW() - INTERVAL '30 days') as recent
    FROM house_rules
    WHERE property_id = p_property_id AND status = 'active'
  )
  SELECT total, categories, recent FROM stats;
END;
$$;

-- 6. TRIGGERS
DROP TRIGGER IF EXISTS update_house_rules_updated_at ON house_rules;
CREATE TRIGGER update_house_rules_updated_at
  BEFORE UPDATE ON house_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- ============================================================================
-- FINAL SUMMARY
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎉 ALL 4 MIGRATIONS APPLIED SUCCESSFULLY!';
  RAISE NOTICE '';
  RAISE NOTICE '📦 Tables Created:';
  RAISE NOTICE '   ✅ rent_payments';
  RAISE NOTICE '   ✅ task_rotations, task_exchanges, user_availability';
  RAISE NOTICE '   ✅ property_documents, document_shares';
  RAISE NOTICE '   ✅ house_rules, rule_votes';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 Tables Enhanced:';
  RAISE NOTICE '   ✅ expenses (+3 columns)';
  RAISE NOTICE '   ✅ tasks (+3 columns)';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Next Steps:';
  RAISE NOTICE '   1. Restart dev server: npm run dev';
  RAISE NOTICE '   2. Test OCR scanner at /hub/finances';
  RAISE NOTICE '   3. Test document vault at /hub/documents';
  RAISE NOTICE '   4. Test house rules at /hub/rules';
  RAISE NOTICE '';
END $$;
