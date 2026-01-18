-- ============================================================================
-- CREATE MESSAGING SYSTEM
-- ============================================================================
-- Purpose: Real-time messaging between residents (DM + Group chat)
-- Features: Individual conversations, group chats, Supabase Realtime
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. CONVERSATIONS TABLE - Chat rooms (DM or Group)
-- ============================================================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('direct', 'group')),
  name TEXT, -- For group chats
  description TEXT,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE, -- For property-wide groups
  avatar_url TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. CONVERSATION PARTICIPANTS TABLE - Who's in each conversation
-- ============================================================================
CREATE TABLE IF NOT EXISTS conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_read_at TIMESTAMPTZ,
  muted BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(conversation_id, user_id)
);

-- ============================================================================
-- 3. MESSAGES TABLE - Actual messages
-- ============================================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  metadata JSONB DEFAULT '{}'::jsonb, -- For file URLs, image URLs, etc.
  reply_to UUID REFERENCES messages(id) ON DELETE SET NULL,
  edited BOOLEAN NOT NULL DEFAULT FALSE,
  deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. MESSAGE REACTIONS TABLE - Emoji reactions
-- ============================================================================
CREATE TABLE IF NOT EXISTS message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- ============================================================================
-- 5. HELPER FUNCTIONS
-- ============================================================================

-- Function to get or create a direct conversation between two users
CREATE OR REPLACE FUNCTION get_or_create_direct_conversation(
  user1_id UUID,
  user2_id UUID
)
RETURNS UUID AS $$
DECLARE
  conversation_id UUID;
BEGIN
  -- Try to find existing conversation
  SELECT c.id INTO conversation_id
  FROM conversations c
  WHERE c.type = 'direct'
    AND EXISTS (
      SELECT 1 FROM conversation_participants cp1
      WHERE cp1.conversation_id = c.id AND cp1.user_id = user1_id
    )
    AND EXISTS (
      SELECT 1 FROM conversation_participants cp2
      WHERE cp2.conversation_id = c.id AND cp2.user_id = user2_id
    )
    AND (
      SELECT COUNT(*) FROM conversation_participants cp
      WHERE cp.conversation_id = c.id
    ) = 2
  LIMIT 1;

  -- If not found, create new conversation
  IF conversation_id IS NULL THEN
    INSERT INTO conversations (type, created_by)
    VALUES ('direct', user1_id)
    RETURNING id INTO conversation_id;

    -- Add both participants
    INSERT INTO conversation_participants (conversation_id, user_id)
    VALUES
      (conversation_id, user1_id),
      (conversation_id, user2_id);
  END IF;

  RETURN conversation_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get unread count for a user
CREATE OR REPLACE FUNCTION get_unread_count(target_user_id UUID)
RETURNS TABLE (
  conversation_id UUID,
  unread_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.conversation_id,
    COUNT(*) AS unread_count
  FROM messages m
  INNER JOIN conversation_participants cp ON m.conversation_id = cp.conversation_id
  WHERE
    cp.user_id = target_user_id
    AND m.sender_id != target_user_id
    AND m.deleted = FALSE
    AND (cp.last_read_at IS NULL OR m.created_at > cp.last_read_at)
  GROUP BY m.conversation_id;
END;
$$ LANGUAGE plpgsql;

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_as_read(
  target_conversation_id UUID,
  target_user_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE conversation_participants
  SET last_read_at = NOW()
  WHERE conversation_id = target_conversation_id
    AND user_id = target_user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_conversations_type ON conversations(type);
CREATE INDEX IF NOT EXISTS idx_conversations_property ON conversations(property_id);

CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user ON conversation_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_message_reactions_message ON message_reactions(message_id);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Conversations: Users can only see conversations they're part of
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY conversations_select_policy ON conversations
  FOR SELECT USING (
    id IN (
      SELECT conversation_id FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY conversations_insert_policy ON conversations
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY conversations_update_policy ON conversations
  FOR UPDATE USING (
    id IN (
      SELECT conversation_id FROM conversation_participants
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Conversation participants
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY conversation_participants_select_policy ON conversation_participants
  FOR SELECT USING (
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY conversation_participants_insert_policy ON conversation_participants
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants
      WHERE user_id = auth.uid() AND role = 'admin'
    )
    OR
    conversation_id IN (
      SELECT id FROM conversations WHERE created_by = auth.uid()
    )
  );

CREATE POLICY conversation_participants_update_policy ON conversation_participants
  FOR UPDATE USING (user_id = auth.uid());

-- Messages: Users can only see messages in their conversations
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY messages_select_policy ON messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants
      WHERE user_id = auth.uid()
    )
    AND deleted = FALSE
  );

CREATE POLICY messages_insert_policy ON messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants
      WHERE user_id = auth.uid()
    )
    AND sender_id = auth.uid()
  );

CREATE POLICY messages_update_policy ON messages
  FOR UPDATE USING (sender_id = auth.uid());

CREATE POLICY messages_delete_policy ON messages
  FOR DELETE USING (sender_id = auth.uid());

-- Message reactions
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY message_reactions_select_policy ON message_reactions
  FOR SELECT USING (
    message_id IN (
      SELECT id FROM messages WHERE conversation_id IN (
        SELECT conversation_id FROM conversation_participants
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY message_reactions_insert_policy ON message_reactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY message_reactions_delete_policy ON message_reactions
  FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update conversation updated_at when new message is sent
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_on_new_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();

-- Standard updated_at triggers
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ENABLE REALTIME
-- ============================================================================
-- This allows Supabase Realtime to broadcast changes
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE conversation_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE message_reactions;

COMMIT;

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ Messaging system created successfully!';
  RAISE NOTICE '   - conversations (direct & group)';
  RAISE NOTICE '   - conversation_participants';
  RAISE NOTICE '   - messages (with text, image, file support)';
  RAISE NOTICE '   - message_reactions (emoji reactions)';
  RAISE NOTICE '   - Helper functions:';
  RAISE NOTICE '     • get_or_create_direct_conversation()';
  RAISE NOTICE '     • get_unread_count()';
  RAISE NOTICE '     • mark_messages_as_read()';
  RAISE NOTICE '   - Realtime enabled for live updates';
END $$;
