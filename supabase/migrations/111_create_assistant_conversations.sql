-- =====================================================
-- ASSISTANT CONVERSATIONS & FEEDBACK SYSTEM
-- =====================================================
-- Stores all AI assistant conversations with context
-- Enables bottom-up feedback and feature suggestions
-- Tracks user engagement and pain points per page
-- =====================================================

-- =====================================================
-- TABLE: assistant_conversations (main conversation record)
-- =====================================================
CREATE TABLE IF NOT EXISTS assistant_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Session info
  session_id TEXT NOT NULL, -- Browser session identifier

  -- Context tracking
  started_on_page TEXT NOT NULL, -- URL path where conversation started
  page_title TEXT, -- Page title for easier reading
  user_agent TEXT, -- Browser info

  -- Conversation metadata
  message_count INTEGER DEFAULT 0,

  -- Feedback data
  has_feedback BOOLEAN DEFAULT FALSE,
  feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_text TEXT,
  feedback_type TEXT CHECK (feedback_type IN ('bug', 'suggestion', 'question', 'praise', 'complaint')),

  -- Feature suggestion
  has_suggestion BOOLEAN DEFAULT FALSE,
  suggestion_text TEXT,
  suggestion_category TEXT CHECK (suggestion_category IN (
    'ui_ux', 'new_feature', 'improvement', 'integration', 'performance', 'other'
  )),
  suggestion_priority TEXT CHECK (suggestion_priority IN ('low', 'medium', 'high', 'critical')),

  -- Admin tracking
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'in_progress', 'implemented', 'rejected', 'duplicate')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_assistant_conv_user_id ON assistant_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_assistant_conv_page ON assistant_conversations(started_on_page);
CREATE INDEX IF NOT EXISTS idx_assistant_conv_created ON assistant_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assistant_conv_has_feedback ON assistant_conversations(has_feedback) WHERE has_feedback = TRUE;
CREATE INDEX IF NOT EXISTS idx_assistant_conv_has_suggestion ON assistant_conversations(has_suggestion) WHERE has_suggestion = TRUE;
CREATE INDEX IF NOT EXISTS idx_assistant_conv_status ON assistant_conversations(status);
CREATE INDEX IF NOT EXISTS idx_assistant_conv_session ON assistant_conversations(session_id);

-- =====================================================
-- TABLE: assistant_messages (individual messages)
-- =====================================================
CREATE TABLE IF NOT EXISTS assistant_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES assistant_conversations(id) ON DELETE CASCADE,

  -- Message content
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,

  -- Context at time of message
  current_page TEXT, -- Page user was on when sending this message

  -- Tool calls (if assistant used tools)
  tool_calls JSONB,
  tool_results JSONB,

  -- Timing
  created_at TIMESTAMPTZ DEFAULT NOW(),
  response_time_ms INTEGER -- How long the AI took to respond
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_assistant_msg_conv ON assistant_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_assistant_msg_role ON assistant_messages(role);
CREATE INDEX IF NOT EXISTS idx_assistant_msg_created ON assistant_messages(created_at);

-- =====================================================
-- TABLE: assistant_page_analytics (aggregated page data)
-- =====================================================
CREATE TABLE IF NOT EXISTS assistant_page_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL UNIQUE,

  -- Counts
  total_conversations INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,

  -- Feedback aggregates
  feedback_count INTEGER DEFAULT 0,
  avg_rating DECIMAL(3,2),
  suggestion_count INTEGER DEFAULT 0,

  -- Common topics (extracted keywords)
  common_topics JSONB DEFAULT '[]'::jsonb,

  -- Timestamps
  first_conversation_at TIMESTAMPTZ,
  last_conversation_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assistant_analytics_path ON assistant_page_analytics(page_path);

-- =====================================================
-- TABLE: assistant_suggestions_backlog (extracted suggestions)
-- =====================================================
CREATE TABLE IF NOT EXISTS assistant_suggestions_backlog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES assistant_conversations(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Suggestion details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN (
    'ui_ux', 'new_feature', 'improvement', 'integration', 'performance', 'bug_fix', 'other'
  )),

  -- Source context
  source_page TEXT,
  original_message TEXT, -- The user's original message

  -- Voting system
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,

  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'under_review', 'planned', 'in_development', 'completed', 'rejected', 'duplicate'
  )),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),

  -- Admin response
  admin_response TEXT,
  assigned_to UUID REFERENCES auth.users(id),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_suggestions_status ON assistant_suggestions_backlog(status);
CREATE INDEX IF NOT EXISTS idx_suggestions_category ON assistant_suggestions_backlog(category);
CREATE INDEX IF NOT EXISTS idx_suggestions_priority ON assistant_suggestions_backlog(priority);
CREATE INDEX IF NOT EXISTS idx_suggestions_upvotes ON assistant_suggestions_backlog(upvotes DESC);

-- =====================================================
-- TABLE: suggestion_votes (user votes on suggestions)
-- =====================================================
CREATE TABLE IF NOT EXISTS suggestion_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_id UUID NOT NULL REFERENCES assistant_suggestions_backlog(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(suggestion_id, user_id)
);

-- =====================================================
-- FUNCTION: Update conversation message count
-- =====================================================
CREATE OR REPLACE FUNCTION update_conversation_message_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE assistant_conversations
  SET
    message_count = message_count + 1,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_conv_message_count ON assistant_messages;
CREATE TRIGGER trigger_update_conv_message_count
  AFTER INSERT ON assistant_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_message_count();

-- =====================================================
-- FUNCTION: Update page analytics
-- =====================================================
CREATE OR REPLACE FUNCTION update_assistant_page_analytics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO assistant_page_analytics (
    page_path,
    total_conversations,
    first_conversation_at,
    last_conversation_at
  )
  VALUES (
    NEW.started_on_page,
    1,
    NEW.created_at,
    NEW.created_at
  )
  ON CONFLICT (page_path) DO UPDATE
  SET
    total_conversations = assistant_page_analytics.total_conversations + 1,
    last_conversation_at = NEW.created_at,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_page_analytics ON assistant_conversations;
CREATE TRIGGER trigger_update_page_analytics
  AFTER INSERT ON assistant_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_assistant_page_analytics();

-- =====================================================
-- FUNCTION: Update suggestion votes count
-- =====================================================
CREATE OR REPLACE FUNCTION update_suggestion_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'up' THEN
      UPDATE assistant_suggestions_backlog SET upvotes = upvotes + 1 WHERE id = NEW.suggestion_id;
    ELSE
      UPDATE assistant_suggestions_backlog SET downvotes = downvotes + 1 WHERE id = NEW.suggestion_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'up' THEN
      UPDATE assistant_suggestions_backlog SET upvotes = upvotes - 1 WHERE id = OLD.suggestion_id;
    ELSE
      UPDATE assistant_suggestions_backlog SET downvotes = downvotes - 1 WHERE id = OLD.suggestion_id;
    END IF;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_suggestion_votes ON suggestion_votes;
CREATE TRIGGER trigger_suggestion_votes
  AFTER INSERT OR DELETE ON suggestion_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_suggestion_vote_counts();

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE assistant_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_page_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_suggestions_backlog ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestion_votes ENABLE ROW LEVEL SECURITY;

-- Users can see their own conversations
CREATE POLICY conv_select_own ON assistant_conversations
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own conversations
CREATE POLICY conv_insert_own ON assistant_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can update their own conversations (for feedback)
CREATE POLICY conv_update_own ON assistant_conversations
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can see their own messages
CREATE POLICY msg_select_own ON assistant_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM assistant_conversations c
      WHERE c.id = conversation_id AND c.user_id = auth.uid()
    )
  );

-- Users can insert messages to their own conversations
CREATE POLICY msg_insert_own ON assistant_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM assistant_conversations c
      WHERE c.id = conversation_id AND (c.user_id = auth.uid() OR c.user_id IS NULL)
    )
  );

-- Anyone can view public suggestions (for voting)
CREATE POLICY suggestions_select_all ON assistant_suggestions_backlog
  FOR SELECT USING (status != 'rejected');

-- Users can insert suggestions
CREATE POLICY suggestions_insert ON assistant_suggestions_backlog
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can vote on suggestions
CREATE POLICY votes_select_own ON suggestion_votes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY votes_insert_own ON suggestion_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY votes_delete_own ON suggestion_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Service role can do everything
CREATE POLICY conv_service_all ON assistant_conversations
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY msg_service_all ON assistant_messages
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY analytics_service_all ON assistant_page_analytics
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY suggestions_service_all ON assistant_suggestions_backlog
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Admins can see everything
CREATE POLICY conv_admin_all ON assistant_conversations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );

CREATE POLICY msg_admin_all ON assistant_messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );

CREATE POLICY analytics_admin_all ON assistant_page_analytics
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );

CREATE POLICY suggestions_admin_all ON assistant_suggestions_backlog
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );

-- =====================================================
-- UPDATED_AT TRIGGERS
-- =====================================================
CREATE OR REPLACE FUNCTION update_assistant_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_conv_updated_at ON assistant_conversations;
CREATE TRIGGER trigger_conv_updated_at
  BEFORE UPDATE ON assistant_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_assistant_updated_at();

DROP TRIGGER IF EXISTS trigger_suggestions_updated_at ON assistant_suggestions_backlog;
CREATE TRIGGER trigger_suggestions_updated_at
  BEFORE UPDATE ON assistant_suggestions_backlog
  FOR EACH ROW
  EXECUTE FUNCTION update_assistant_updated_at();

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE assistant_conversations IS 'Stores all AI assistant chat conversations with page context';
COMMENT ON TABLE assistant_messages IS 'Individual messages within assistant conversations';
COMMENT ON TABLE assistant_page_analytics IS 'Aggregated analytics per page for assistant usage';
COMMENT ON TABLE assistant_suggestions_backlog IS 'User feature suggestions extracted from conversations';
COMMENT ON TABLE suggestion_votes IS 'User votes on feature suggestions';
