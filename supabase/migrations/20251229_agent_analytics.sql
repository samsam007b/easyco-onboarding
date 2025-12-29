-- =====================================================
-- AGENT ANALYTICS & AUTO-IMPROVEMENT SYSTEM
-- =====================================================
-- Advanced tracking for AI agent usage, intent detection,
-- provider distribution, and self-improvement capabilities
-- =====================================================

-- =====================================================
-- TABLE: agent_request_logs (detailed request tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS agent_request_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES assistant_conversations(id) ON DELETE CASCADE,
  message_id UUID REFERENCES assistant_messages(id) ON DELETE CASCADE,

  -- Request details
  user_message TEXT NOT NULL,
  user_message_length INTEGER,

  -- Intent detection
  detected_intent TEXT,
  intent_confidence DECIMAL(4,3), -- 0.000 to 1.000

  -- Provider routing
  provider TEXT NOT NULL CHECK (provider IN ('faq', 'groq', 'openai', 'error')),
  recommended_provider TEXT,
  complexity_score DECIMAL(4,3),
  complexity_reasons TEXT[], -- Array of reasons

  -- Response metrics
  response_time_ms INTEGER,
  tokens_used INTEGER,
  cost_estimate DECIMAL(10,8), -- Very small amounts

  -- User context (anonymized)
  user_type TEXT CHECK (user_type IN ('owner', 'resident', 'searcher', 'unknown')),
  is_authenticated BOOLEAN DEFAULT FALSE,
  profile_completion_score INTEGER,

  -- Session context
  page_path TEXT,
  conversation_turn INTEGER, -- Which message in the conversation

  -- Quality indicators
  was_escalated BOOLEAN DEFAULT FALSE, -- User asked for better AI
  had_tool_calls BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient analytics
CREATE INDEX IF NOT EXISTS idx_agent_logs_intent ON agent_request_logs(detected_intent);
CREATE INDEX IF NOT EXISTS idx_agent_logs_provider ON agent_request_logs(provider);
CREATE INDEX IF NOT EXISTS idx_agent_logs_created ON agent_request_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_logs_user_type ON agent_request_logs(user_type);
CREATE INDEX IF NOT EXISTS idx_agent_logs_page ON agent_request_logs(page_path);
-- Note: For date-based queries, use created_at with date truncation in queries
-- or create a generated column if needed for heavy date filtering

-- =====================================================
-- TABLE: agent_intent_stats (aggregated intent analytics)
-- =====================================================
CREATE TABLE IF NOT EXISTS agent_intent_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Intent identification
  intent TEXT NOT NULL,

  -- Usage counts
  total_count INTEGER DEFAULT 0,
  faq_handled_count INTEGER DEFAULT 0, -- Handled by FAQ
  ai_handled_count INTEGER DEFAULT 0,  -- Required AI

  -- Quality metrics
  avg_confidence DECIMAL(4,3),
  escalation_rate DECIMAL(4,3), -- % that got escalated

  -- Performance
  avg_response_time_ms INTEGER,
  avg_cost DECIMAL(10,8),

  -- Time tracking
  first_seen_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(intent)
);

CREATE INDEX IF NOT EXISTS idx_intent_stats_count ON agent_intent_stats(total_count DESC);
CREATE INDEX IF NOT EXISTS idx_intent_stats_intent ON agent_intent_stats(intent);

-- =====================================================
-- TABLE: agent_daily_stats (daily aggregates)
-- =====================================================
CREATE TABLE IF NOT EXISTS agent_daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Date partition
  stat_date DATE NOT NULL,

  -- Request counts
  total_requests INTEGER DEFAULT 0,
  faq_requests INTEGER DEFAULT 0,
  groq_requests INTEGER DEFAULT 0,
  openai_requests INTEGER DEFAULT 0,
  error_requests INTEGER DEFAULT 0,

  -- User breakdown
  authenticated_requests INTEGER DEFAULT 0,
  anonymous_requests INTEGER DEFAULT 0,
  owner_requests INTEGER DEFAULT 0,
  resident_requests INTEGER DEFAULT 0,
  searcher_requests INTEGER DEFAULT 0,

  -- Token usage
  total_tokens INTEGER DEFAULT 0,
  groq_tokens INTEGER DEFAULT 0,
  openai_tokens INTEGER DEFAULT 0,

  -- Costs
  total_cost DECIMAL(10,6) DEFAULT 0,
  groq_cost DECIMAL(10,6) DEFAULT 0,
  openai_cost DECIMAL(10,6) DEFAULT 0,
  savings_vs_all_openai DECIMAL(10,6) DEFAULT 0,

  -- Performance
  avg_response_time_ms INTEGER,
  p95_response_time_ms INTEGER,

  -- Quality
  escalation_count INTEGER DEFAULT 0,
  avg_intent_confidence DECIMAL(4,3),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(stat_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON agent_daily_stats(stat_date DESC);

-- =====================================================
-- TABLE: agent_improvement_candidates (auto-learning)
-- =====================================================
CREATE TABLE IF NOT EXISTS agent_improvement_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Source
  request_log_id UUID REFERENCES agent_request_logs(id) ON DELETE SET NULL,

  -- The message that triggered this
  user_message TEXT NOT NULL,

  -- Analysis
  detected_intent TEXT,
  suggested_intent TEXT, -- What it SHOULD have been
  current_confidence DECIMAL(4,3),

  -- Improvement type
  improvement_type TEXT NOT NULL CHECK (improvement_type IN (
    'new_intent',        -- Completely new intent needed
    'low_confidence',    -- FAQ confidence too low
    'wrong_provider',    -- Sent to AI when FAQ could handle
    'missing_keywords',  -- Need more patterns
    'response_quality',  -- Response could be better
    'escalation'         -- User explicitly asked for better
  )),

  -- Current handling
  was_handled_by TEXT, -- 'faq' | 'groq' | 'openai'

  -- Suggested improvements
  suggested_keywords TEXT[],
  suggested_response TEXT,

  -- Review status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'reviewing', 'implemented', 'rejected', 'duplicate'
  )),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,

  -- Impact metrics
  similar_messages_count INTEGER DEFAULT 1, -- How many similar messages exist
  potential_cost_savings DECIMAL(10,6),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_improvement_status ON agent_improvement_candidates(status);
CREATE INDEX IF NOT EXISTS idx_improvement_type ON agent_improvement_candidates(improvement_type);
CREATE INDEX IF NOT EXISTS idx_improvement_intent ON agent_improvement_candidates(detected_intent);
CREATE INDEX IF NOT EXISTS idx_improvement_created ON agent_improvement_candidates(created_at DESC);

-- =====================================================
-- TABLE: agent_topic_clusters (grouped themes)
-- =====================================================
CREATE TABLE IF NOT EXISTS agent_topic_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Topic identification
  topic_name TEXT NOT NULL,
  topic_description TEXT,

  -- Related intents
  related_intents TEXT[],

  -- Keywords that belong to this topic
  keywords TEXT[],

  -- Usage stats
  message_count INTEGER DEFAULT 0,
  conversation_count INTEGER DEFAULT 0,

  -- Quality
  avg_satisfaction DECIMAL(3,2), -- If we have ratings
  resolution_rate DECIMAL(4,3), -- How often resolved without escalation

  -- Timestamps
  first_seen_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_topic_clusters_name ON agent_topic_clusters(topic_name);
CREATE INDEX IF NOT EXISTS idx_topic_clusters_count ON agent_topic_clusters(message_count DESC);

-- =====================================================
-- FUNCTION: Log agent request
-- =====================================================
CREATE OR REPLACE FUNCTION log_agent_request(
  p_conversation_id UUID,
  p_message_id UUID,
  p_user_message TEXT,
  p_detected_intent TEXT,
  p_intent_confidence DECIMAL,
  p_provider TEXT,
  p_recommended_provider TEXT,
  p_complexity_score DECIMAL,
  p_complexity_reasons TEXT[],
  p_response_time_ms INTEGER,
  p_tokens_used INTEGER,
  p_cost_estimate DECIMAL,
  p_user_type TEXT,
  p_is_authenticated BOOLEAN,
  p_page_path TEXT,
  p_conversation_turn INTEGER
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  -- Insert the request log
  INSERT INTO agent_request_logs (
    conversation_id, message_id, user_message, user_message_length,
    detected_intent, intent_confidence, provider, recommended_provider,
    complexity_score, complexity_reasons, response_time_ms, tokens_used,
    cost_estimate, user_type, is_authenticated, page_path, conversation_turn
  ) VALUES (
    p_conversation_id, p_message_id, p_user_message, LENGTH(p_user_message),
    p_detected_intent, p_intent_confidence, p_provider, p_recommended_provider,
    p_complexity_score, p_complexity_reasons, p_response_time_ms, p_tokens_used,
    p_cost_estimate, p_user_type, p_is_authenticated, p_page_path, p_conversation_turn
  ) RETURNING id INTO v_log_id;

  -- Update intent stats
  INSERT INTO agent_intent_stats (
    intent, total_count, faq_handled_count, ai_handled_count,
    avg_confidence, first_seen_at, last_seen_at
  ) VALUES (
    COALESCE(p_detected_intent, 'unknown'),
    1,
    CASE WHEN p_provider = 'faq' THEN 1 ELSE 0 END,
    CASE WHEN p_provider IN ('groq', 'openai') THEN 1 ELSE 0 END,
    p_intent_confidence,
    NOW(),
    NOW()
  )
  ON CONFLICT (intent) DO UPDATE SET
    total_count = agent_intent_stats.total_count + 1,
    faq_handled_count = agent_intent_stats.faq_handled_count +
      CASE WHEN p_provider = 'faq' THEN 1 ELSE 0 END,
    ai_handled_count = agent_intent_stats.ai_handled_count +
      CASE WHEN p_provider IN ('groq', 'openai') THEN 1 ELSE 0 END,
    avg_confidence = (agent_intent_stats.avg_confidence * agent_intent_stats.total_count + p_intent_confidence) /
      (agent_intent_stats.total_count + 1),
    last_seen_at = NOW(),
    updated_at = NOW();

  -- Update daily stats
  INSERT INTO agent_daily_stats (
    stat_date, total_requests, faq_requests, groq_requests, openai_requests, error_requests,
    authenticated_requests, anonymous_requests, owner_requests, resident_requests, searcher_requests,
    total_tokens, groq_tokens, openai_tokens, total_cost, groq_cost, openai_cost
  ) VALUES (
    CURRENT_DATE,
    1,
    CASE WHEN p_provider = 'faq' THEN 1 ELSE 0 END,
    CASE WHEN p_provider = 'groq' THEN 1 ELSE 0 END,
    CASE WHEN p_provider = 'openai' THEN 1 ELSE 0 END,
    CASE WHEN p_provider = 'error' THEN 1 ELSE 0 END,
    CASE WHEN p_is_authenticated THEN 1 ELSE 0 END,
    CASE WHEN NOT p_is_authenticated THEN 1 ELSE 0 END,
    CASE WHEN p_user_type = 'owner' THEN 1 ELSE 0 END,
    CASE WHEN p_user_type = 'resident' THEN 1 ELSE 0 END,
    CASE WHEN p_user_type = 'searcher' THEN 1 ELSE 0 END,
    COALESCE(p_tokens_used, 0),
    CASE WHEN p_provider = 'groq' THEN COALESCE(p_tokens_used, 0) ELSE 0 END,
    CASE WHEN p_provider = 'openai' THEN COALESCE(p_tokens_used, 0) ELSE 0 END,
    COALESCE(p_cost_estimate, 0),
    CASE WHEN p_provider = 'groq' THEN COALESCE(p_cost_estimate, 0) ELSE 0 END,
    CASE WHEN p_provider = 'openai' THEN COALESCE(p_cost_estimate, 0) ELSE 0 END
  )
  ON CONFLICT (stat_date) DO UPDATE SET
    total_requests = agent_daily_stats.total_requests + 1,
    faq_requests = agent_daily_stats.faq_requests + CASE WHEN p_provider = 'faq' THEN 1 ELSE 0 END,
    groq_requests = agent_daily_stats.groq_requests + CASE WHEN p_provider = 'groq' THEN 1 ELSE 0 END,
    openai_requests = agent_daily_stats.openai_requests + CASE WHEN p_provider = 'openai' THEN 1 ELSE 0 END,
    error_requests = agent_daily_stats.error_requests + CASE WHEN p_provider = 'error' THEN 1 ELSE 0 END,
    authenticated_requests = agent_daily_stats.authenticated_requests + CASE WHEN p_is_authenticated THEN 1 ELSE 0 END,
    anonymous_requests = agent_daily_stats.anonymous_requests + CASE WHEN NOT p_is_authenticated THEN 1 ELSE 0 END,
    owner_requests = agent_daily_stats.owner_requests + CASE WHEN p_user_type = 'owner' THEN 1 ELSE 0 END,
    resident_requests = agent_daily_stats.resident_requests + CASE WHEN p_user_type = 'resident' THEN 1 ELSE 0 END,
    searcher_requests = agent_daily_stats.searcher_requests + CASE WHEN p_user_type = 'searcher' THEN 1 ELSE 0 END,
    total_tokens = agent_daily_stats.total_tokens + COALESCE(p_tokens_used, 0),
    groq_tokens = agent_daily_stats.groq_tokens + CASE WHEN p_provider = 'groq' THEN COALESCE(p_tokens_used, 0) ELSE 0 END,
    openai_tokens = agent_daily_stats.openai_tokens + CASE WHEN p_provider = 'openai' THEN COALESCE(p_tokens_used, 0) ELSE 0 END,
    total_cost = agent_daily_stats.total_cost + COALESCE(p_cost_estimate, 0),
    groq_cost = agent_daily_stats.groq_cost + CASE WHEN p_provider = 'groq' THEN COALESCE(p_cost_estimate, 0) ELSE 0 END,
    openai_cost = agent_daily_stats.openai_cost + CASE WHEN p_provider = 'openai' THEN COALESCE(p_cost_estimate, 0) ELSE 0 END,
    updated_at = NOW();

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Flag improvement candidate
-- =====================================================
CREATE OR REPLACE FUNCTION flag_improvement_candidate(
  p_request_log_id UUID,
  p_improvement_type TEXT,
  p_suggested_intent TEXT DEFAULT NULL,
  p_suggested_keywords TEXT[] DEFAULT NULL,
  p_suggested_response TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_candidate_id UUID;
  v_log_record RECORD;
BEGIN
  -- Get the original log record
  SELECT * INTO v_log_record FROM agent_request_logs WHERE id = p_request_log_id;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Insert improvement candidate
  INSERT INTO agent_improvement_candidates (
    request_log_id, user_message, detected_intent, suggested_intent,
    current_confidence, improvement_type, was_handled_by,
    suggested_keywords, suggested_response
  ) VALUES (
    p_request_log_id,
    v_log_record.user_message,
    v_log_record.detected_intent,
    p_suggested_intent,
    v_log_record.intent_confidence,
    p_improvement_type,
    v_log_record.provider,
    p_suggested_keywords,
    p_suggested_response
  ) RETURNING id INTO v_candidate_id;

  RETURN v_candidate_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE agent_request_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_intent_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_improvement_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_topic_clusters ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY agent_logs_service ON agent_request_logs
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY intent_stats_service ON agent_intent_stats
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY daily_stats_service ON agent_daily_stats
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY improvement_service ON agent_improvement_candidates
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY topics_service ON agent_topic_clusters
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Admins can see everything
CREATE POLICY agent_logs_admin ON agent_request_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );

CREATE POLICY intent_stats_admin ON agent_intent_stats
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );

CREATE POLICY daily_stats_admin ON agent_daily_stats
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );

CREATE POLICY improvement_admin ON agent_improvement_candidates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );

CREATE POLICY topics_admin ON agent_topic_clusters
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE agent_request_logs IS 'Detailed log of every agent request with intent, provider, and performance data';
COMMENT ON TABLE agent_intent_stats IS 'Aggregated statistics per intent for tracking FAQ effectiveness';
COMMENT ON TABLE agent_daily_stats IS 'Daily aggregated metrics for cost tracking and trend analysis';
COMMENT ON TABLE agent_improvement_candidates IS 'Flagged messages that could improve the FAQ system';
COMMENT ON TABLE agent_topic_clusters IS 'Grouped themes/topics for understanding user needs';
COMMENT ON FUNCTION log_agent_request IS 'Logs a request and updates all related statistics atomically';
COMMENT ON FUNCTION flag_improvement_candidate IS 'Flags a request for potential FAQ improvement';
