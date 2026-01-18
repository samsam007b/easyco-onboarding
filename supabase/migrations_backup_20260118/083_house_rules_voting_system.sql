-- ============================================================================
-- MIGRATION 083: HOUSE RULES + VOTING SYSTEM
-- ============================================================================
-- Tables: house_rules, rule_votes
-- Features: Democratic rule creation, voting, rule status tracking
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. HOUSE_RULES TABLE
-- ============================================================================

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
  votes_required INTEGER NOT NULL DEFAULT 0, -- Minimum votes needed to pass
  votes_for INTEGER NOT NULL DEFAULT 0,
  votes_against INTEGER NOT NULL DEFAULT 0,
  votes_abstain INTEGER NOT NULL DEFAULT 0,
  voting_ends_at TIMESTAMPTZ,
  activated_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. RULE_VOTES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS rule_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID NOT NULL REFERENCES house_rules(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('for', 'against', 'abstain')),
  comment TEXT,
  voted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(rule_id, user_id)
);

-- ============================================================================
-- 3. INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_house_rules_property ON house_rules(property_id);
CREATE INDEX IF NOT EXISTS idx_house_rules_status ON house_rules(status);
CREATE INDEX IF NOT EXISTS idx_house_rules_category ON house_rules(category);
CREATE INDEX IF NOT EXISTS idx_house_rules_voting_ends ON house_rules(voting_ends_at);
CREATE INDEX IF NOT EXISTS idx_rule_votes_rule ON rule_votes(rule_id);
CREATE INDEX IF NOT EXISTS idx_rule_votes_user ON rule_votes(user_id);

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE house_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_votes ENABLE ROW LEVEL SECURITY;

-- House Rules Policies
CREATE POLICY house_rules_select_policy ON house_rules
  FOR SELECT USING (
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY house_rules_insert_policy ON house_rules
  FOR INSERT WITH CHECK (
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    ) AND proposed_by = auth.uid()
  );

CREATE POLICY house_rules_update_policy ON house_rules
  FOR UPDATE USING (
    property_id IN (
      SELECT property_id FROM property_members WHERE user_id = auth.uid()
    )
  );

-- Rule Votes Policies
CREATE POLICY rule_votes_select_policy ON rule_votes
  FOR SELECT USING (
    rule_id IN (
      SELECT id FROM house_rules WHERE property_id IN (
        SELECT property_id FROM property_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY rule_votes_insert_policy ON rule_votes
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    rule_id IN (
      SELECT id FROM house_rules WHERE property_id IN (
        SELECT property_id FROM property_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY rule_votes_update_policy ON rule_votes
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================================
-- 5. FUNCTIONS
-- ============================================================================

-- Function: Cast a vote and update rule counts
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
  -- Get current vote if exists
  SELECT vote INTO v_old_vote FROM rule_votes
  WHERE rule_id = p_rule_id AND user_id = p_user_id;

  -- Insert or update vote
  INSERT INTO rule_votes (rule_id, user_id, vote, comment)
  VALUES (p_rule_id, p_user_id, p_vote, p_comment)
  ON CONFLICT (rule_id, user_id)
  DO UPDATE SET vote = p_vote, comment = p_comment, voted_at = NOW();

  -- Update vote counts on rule
  SELECT * INTO v_rule FROM house_rules WHERE id = p_rule_id;

  -- Decrement old vote count
  IF v_old_vote = 'for' THEN
    UPDATE house_rules SET votes_for = votes_for - 1 WHERE id = p_rule_id;
  ELSIF v_old_vote = 'against' THEN
    UPDATE house_rules SET votes_against = votes_against - 1 WHERE id = p_rule_id;
  ELSIF v_old_vote = 'abstain' THEN
    UPDATE house_rules SET votes_abstain = votes_abstain - 1 WHERE id = p_rule_id;
  END IF;

  -- Increment new vote count
  IF p_vote = 'for' THEN
    UPDATE house_rules SET votes_for = votes_for + 1 WHERE id = p_rule_id;
  ELSIF p_vote = 'against' THEN
    UPDATE house_rules SET votes_against = votes_against + 1 WHERE id = p_rule_id;
  ELSIF p_vote = 'abstain' THEN
    UPDATE house_rules SET votes_abstain = votes_abstain + 1 WHERE id = p_rule_id;
  END IF;

  -- Get updated counts
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

-- Function: Check and finalize votes
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

  -- Check if enough votes
  IF v_total_votes < v_rule.votes_required THEN
    RETURN QUERY SELECT FALSE, 'voting'::TEXT, 'Pas assez de votes'::TEXT;
    RETURN;
  END IF;

  -- Determine outcome
  IF v_rule.votes_for > v_rule.votes_against THEN
    v_new_status := 'active';
    UPDATE house_rules
    SET status = 'active', activated_at = NOW()
    WHERE id = p_rule_id;
  ELSE
    v_new_status := 'rejected';
    UPDATE house_rules
    SET status = 'rejected'
    WHERE id = p_rule_id;
  END IF;

  RETURN QUERY SELECT TRUE, v_new_status, 'Vote finalisé'::TEXT;
END;
$$;

-- Function: Get active rules summary
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

-- ============================================================================
-- 6. TRIGGERS
-- ============================================================================

CREATE TRIGGER update_house_rules_updated_at
  BEFORE UPDATE ON house_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMIT;

RAISE NOTICE '✅ Migration 083 Complete: House Rules + Voting System';
