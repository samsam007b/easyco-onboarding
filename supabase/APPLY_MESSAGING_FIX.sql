-- ============================================================================
-- STANDALONE FIX FOR MESSAGING SYSTEM
-- ============================================================================
-- Execute this directly in Supabase SQL Editor
-- This drops and recreates the messaging tables cleanly
-- ============================================================================

BEGIN;

-- Drop existing tables if they exist (cascade to remove dependencies)
DROP TABLE IF EXISTS public.typing_indicators CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.get_or_create_conversation CASCADE;
DROP FUNCTION IF EXISTS public.send_message CASCADE;
DROP FUNCTION IF EXISTS public.mark_conversation_read CASCADE;
DROP FUNCTION IF EXISTS public.cleanup_expired_typing_indicators CASCADE;
DROP FUNCTION IF EXISTS public.get_user_conversations CASCADE;

-- ============================================================================
-- 1. CREATE CONVERSATIONS TABLE
-- ============================================================================

CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Participants (always 2 users for direct messaging)
  participant1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Context (optional - link to property, application, etc.)
  context_type TEXT CHECK (context_type IN ('general', 'property_inquiry', 'application', 'coliving_match')),
  context_id UUID, -- Could reference properties.id, applications.id, etc.

  -- Last message tracking
  last_message_id UUID,
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,

  -- Participant-specific data
  participant1_unread_count INTEGER DEFAULT 0,
  participant2_unread_count INTEGER DEFAULT 0,
  participant1_archived BOOLEAN DEFAULT FALSE,
  participant2_archived BOOLEAN DEFAULT FALSE,
  participant1_deleted_at TIMESTAMPTZ,
  participant2_deleted_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate conversations (same 2 users)
  UNIQUE(participant1_id, participant2_id),
  CONSTRAINT different_participants CHECK (participant1_id != participant2_id)
);

-- ============================================================================
-- 2. CREATE MESSAGES TABLE
-- ============================================================================

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,

  -- Message content
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 5000),

  -- Message type
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'property_share', 'meeting_request')),

  -- Metadata (for special message types)
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Read status
  read_by_recipient BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,

  -- Soft delete (users can delete messages for themselves)
  deleted_by_sender BOOLEAN DEFAULT FALSE,
  deleted_by_recipient BOOLEAN DEFAULT FALSE,

  -- Edited tracking
  edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. CREATE TYPING INDICATORS TABLE
-- ============================================================================

CREATE TABLE public.typing_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Auto-expire typing indicators after 5 seconds
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '5 seconds'),

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Only one typing indicator per user per conversation
  UNIQUE(conversation_id, user_id)
);

-- ============================================================================
-- 4. CREATE INDEXES
-- ============================================================================

-- Conversations indexes
CREATE INDEX idx_conversations_participant1 ON public.conversations(participant1_id);
CREATE INDEX idx_conversations_participant2 ON public.conversations(participant2_id);
CREATE INDEX idx_conversations_last_message ON public.conversations(last_message_at DESC);
CREATE INDEX idx_conversations_context ON public.conversations(context_type, context_id) WHERE context_id IS NOT NULL;

-- Messages indexes
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_unread ON public.messages(conversation_id, read_by_recipient) WHERE read_by_recipient = FALSE;

-- Typing indicators indexes
CREATE INDEX idx_typing_conversation ON public.typing_indicators(conversation_id);
CREATE INDEX idx_typing_expires ON public.typing_indicators(expires_at);

-- ============================================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typing_indicators ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. RLS POLICIES FOR CONVERSATIONS
-- ============================================================================

CREATE POLICY "Users can view own conversations"
  ON public.conversations
  FOR SELECT
  USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);

CREATE POLICY "Users can create conversations"
  ON public.conversations
  FOR INSERT
  WITH CHECK (auth.uid() = participant1_id OR auth.uid() = participant2_id);

CREATE POLICY "Users can update own conversations"
  ON public.conversations
  FOR UPDATE
  USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);

-- ============================================================================
-- 7. RLS POLICIES FOR MESSAGES
-- ============================================================================

CREATE POLICY "Users can view messages in own conversations"
  ON public.messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.participant1_id = auth.uid() OR c.participant2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages"
  ON public.messages
  FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.participant1_id = auth.uid() OR c.participant2_id = auth.uid())
    )
  );

CREATE POLICY "Users can update messages in own conversations"
  ON public.messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.participant1_id = auth.uid() OR c.participant2_id = auth.uid())
    )
  );

-- ============================================================================
-- 8. RLS POLICIES FOR TYPING INDICATORS
-- ============================================================================

CREATE POLICY "Users can view typing in own conversations"
  ON public.typing_indicators
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.participant1_id = auth.uid() OR c.participant2_id = auth.uid())
    )
  );

CREATE POLICY "Users can set own typing indicator"
  ON public.typing_indicators
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 9. FUNCTIONS
-- ============================================================================

-- Function: Get or create conversation between two users
CREATE FUNCTION get_or_create_conversation(
  p_user1_id UUID,
  p_user2_id UUID,
  p_context_type TEXT DEFAULT NULL,
  p_context_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_conversation_id UUID;
  v_participant1_id UUID;
  v_participant2_id UUID;
BEGIN
  IF p_user1_id < p_user2_id THEN
    v_participant1_id := p_user1_id;
    v_participant2_id := p_user2_id;
  ELSE
    v_participant1_id := p_user2_id;
    v_participant2_id := p_user1_id;
  END IF;

  SELECT id INTO v_conversation_id
  FROM public.conversations
  WHERE participant1_id = v_participant1_id
    AND participant2_id = v_participant2_id;

  IF v_conversation_id IS NULL THEN
    INSERT INTO public.conversations (
      participant1_id, participant2_id, context_type, context_id
    ) VALUES (
      v_participant1_id, v_participant2_id, p_context_type, p_context_id
    )
    RETURNING id INTO v_conversation_id;
  END IF;

  RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Send message and update conversation
CREATE FUNCTION send_message(
  p_conversation_id UUID,
  p_sender_id UUID,
  p_content TEXT,
  p_message_type TEXT DEFAULT 'text',
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  v_message_id UUID;
  v_participant1_id UUID;
  v_participant2_id UUID;
  v_is_participant1 BOOLEAN;
BEGIN
  SELECT participant1_id, participant2_id
  INTO v_participant1_id, v_participant2_id
  FROM public.conversations
  WHERE id = p_conversation_id;

  IF p_sender_id NOT IN (v_participant1_id, v_participant2_id) THEN
    RAISE EXCEPTION 'Sender is not a participant in this conversation';
  END IF;

  v_is_participant1 := (p_sender_id = v_participant1_id);

  INSERT INTO public.messages (
    conversation_id, sender_id, content, message_type, metadata
  ) VALUES (
    p_conversation_id, p_sender_id, p_content, p_message_type, p_metadata
  )
  RETURNING id INTO v_message_id;

  UPDATE public.conversations
  SET
    last_message_id = v_message_id,
    last_message_at = NOW(),
    last_message_preview = LEFT(p_content, 100),
    participant1_unread_count = CASE
      WHEN v_is_participant1 THEN participant1_unread_count
      ELSE participant1_unread_count + 1
    END,
    participant2_unread_count = CASE
      WHEN v_is_participant1 THEN participant2_unread_count + 1
      ELSE participant2_unread_count
    END,
    participant1_archived = FALSE,
    participant2_archived = FALSE,
    updated_at = NOW()
  WHERE id = p_conversation_id;

  RETURN v_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Mark conversation as read
CREATE FUNCTION mark_conversation_read(
  p_conversation_id UUID,
  p_user_id UUID
)
RETURNS void AS $$
DECLARE
  v_participant1_id UUID;
  v_is_participant1 BOOLEAN;
BEGIN
  SELECT participant1_id INTO v_participant1_id
  FROM public.conversations
  WHERE id = p_conversation_id;

  v_is_participant1 := (p_user_id = v_participant1_id);

  UPDATE public.messages
  SET read_by_recipient = TRUE, read_at = NOW()
  WHERE conversation_id = p_conversation_id
    AND sender_id != p_user_id
    AND read_by_recipient = FALSE;

  UPDATE public.conversations
  SET
    participant1_unread_count = CASE WHEN v_is_participant1 THEN 0 ELSE participant1_unread_count END,
    participant2_unread_count = CASE WHEN v_is_participant1 THEN participant2_unread_count ELSE 0 END,
    updated_at = NOW()
  WHERE id = p_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Clean up expired typing indicators
CREATE FUNCTION cleanup_expired_typing_indicators()
RETURNS void AS $$
BEGIN
  DELETE FROM public.typing_indicators WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get conversation list for user
CREATE FUNCTION get_user_conversations(p_user_id UUID)
RETURNS TABLE (
  conversation_id UUID,
  other_user_id UUID,
  other_user_name TEXT,
  other_user_photo TEXT,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  unread_count INTEGER,
  is_archived BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id as conversation_id,
    CASE WHEN c.participant1_id = p_user_id THEN c.participant2_id ELSE c.participant1_id END as other_user_id,
    CASE WHEN c.participant1_id = p_user_id THEN p2.first_name || ' ' || p2.last_name ELSE p1.first_name || ' ' || p1.last_name END as other_user_name,
    CASE WHEN c.participant1_id = p_user_id THEN p2.profile_photo_url ELSE p1.profile_photo_url END as other_user_photo,
    c.last_message_preview as last_message,
    c.last_message_at,
    CASE WHEN c.participant1_id = p_user_id THEN c.participant1_unread_count ELSE c.participant2_unread_count END as unread_count,
    CASE WHEN c.participant1_id = p_user_id THEN c.participant1_archived ELSE c.participant2_archived END as is_archived
  FROM public.conversations c
  LEFT JOIN public.user_profiles p1 ON p1.user_id = c.participant1_id
  LEFT JOIN public.user_profiles p2 ON p2.user_id = c.participant2_id
  WHERE (c.participant1_id = p_user_id OR c.participant2_id = p_user_id)
  ORDER BY c.last_message_at DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 10. GRANT PERMISSIONS
-- ============================================================================

GRANT EXECUTE ON FUNCTION get_or_create_conversation TO authenticated;
GRANT EXECUTE ON FUNCTION send_message TO authenticated;
GRANT EXECUTE ON FUNCTION mark_conversation_read TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_typing_indicators TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_conversations TO authenticated;

COMMIT;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 'Messaging system created successfully!' as status;
SELECT COUNT(*) as conversations_count FROM public.conversations;
SELECT COUNT(*) as messages_count FROM public.messages;
