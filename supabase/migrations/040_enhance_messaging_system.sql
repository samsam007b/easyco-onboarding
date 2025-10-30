-- ============================================================================
-- ENHANCE MESSAGING SYSTEM
-- Add typing indicators, image support, and RPC functions
-- ============================================================================

-- ============================================================================
-- 1. CREATE TYPING INDICATORS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.typing_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(conversation_id, user_id)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_typing_indicators_conversation ON public.typing_indicators(conversation_id);
CREATE INDEX IF NOT EXISTS idx_typing_indicators_expires ON public.typing_indicators(expires_at);

-- Enable RLS
ALTER TABLE public.typing_indicators ENABLE ROW LEVEL SECURITY;

-- Users can view typing indicators in their conversations
CREATE POLICY "Users can view typing indicators in own conversations"
  ON public.typing_indicators
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.participant1_id = auth.uid() OR c.participant2_id = auth.uid())
    )
  );

-- Users can set their own typing indicators
CREATE POLICY "Users can set own typing indicators"
  ON public.typing_indicators
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own typing indicators
CREATE POLICY "Users can update own typing indicators"
  ON public.typing_indicators
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own typing indicators
CREATE POLICY "Users can delete own typing indicators"
  ON public.typing_indicators
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically clean expired typing indicators
CREATE OR REPLACE FUNCTION clean_expired_typing_indicators()
RETURNS void AS $$
BEGIN
  DELETE FROM public.typing_indicators
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 2. ADD IMAGE SUPPORT TO MESSAGES
-- ============================================================================

-- Add image columns to messages table
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_width INTEGER,
ADD COLUMN IF NOT EXISTS image_height INTEGER;

-- Add comment
COMMENT ON COLUMN public.messages.image_url IS 'URL of attached image (stored in Supabase Storage)';

-- ============================================================================
-- 3. RPC FUNCTIONS FOR MESSAGING
-- ============================================================================

-- Function: Get or create conversation between two users
CREATE OR REPLACE FUNCTION get_or_create_conversation(
  p_user1_id UUID,
  p_user2_id UUID,
  p_context_type TEXT DEFAULT 'general',
  p_context_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_conversation_id UUID;
  v_participant1_id UUID;
  v_participant2_id UUID;
BEGIN
  -- Ensure participant1_id < participant2_id for consistency
  IF p_user1_id < p_user2_id THEN
    v_participant1_id := p_user1_id;
    v_participant2_id := p_user2_id;
  ELSE
    v_participant1_id := p_user2_id;
    v_participant2_id := p_user1_id;
  END IF;

  -- Try to find existing conversation
  SELECT id INTO v_conversation_id
  FROM public.conversations
  WHERE participant1_id = v_participant1_id
    AND participant2_id = v_participant2_id;

  -- If not found, create new conversation
  IF v_conversation_id IS NULL THEN
    INSERT INTO public.conversations (participant1_id, participant2_id)
    VALUES (v_participant1_id, v_participant2_id)
    RETURNING id INTO v_conversation_id;
  END IF;

  RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get user's conversations with details
CREATE OR REPLACE FUNCTION get_user_conversations(p_user_id UUID)
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
    c.id AS conversation_id,
    CASE
      WHEN c.participant1_id = p_user_id THEN c.participant2_id
      ELSE c.participant1_id
    END AS other_user_id,
    CASE
      WHEN c.participant1_id = p_user_id THEN u2.full_name
      ELSE u1.full_name
    END AS other_user_name,
    CASE
      WHEN c.participant1_id = p_user_id THEN up2.profile_photo_url
      ELSE up1.profile_photo_url
    END AS other_user_photo,
    c.last_message_text AS last_message,
    c.last_message_at,
    CASE
      WHEN c.participant1_id = p_user_id THEN
        (SELECT COUNT(*)::INTEGER
         FROM public.messages m
         WHERE m.conversation_id = c.id
           AND m.sender_id = c.participant2_id
           AND NOT m.read_by_recipient)
      ELSE
        (SELECT COUNT(*)::INTEGER
         FROM public.messages m
         WHERE m.conversation_id = c.id
           AND m.sender_id = c.participant1_id
           AND NOT m.read_by_recipient)
    END AS unread_count,
    FALSE AS is_archived
  FROM public.conversations c
  LEFT JOIN auth.users u1 ON u1.id = c.participant1_id
  LEFT JOIN auth.users u2 ON u2.id = c.participant2_id
  LEFT JOIN public.users us1 ON us1.id = c.participant1_id
  LEFT JOIN public.users us2 ON us2.id = c.participant2_id
  LEFT JOIN public.user_profiles up1 ON up1.user_id = c.participant1_id
  LEFT JOIN public.user_profiles up2 ON up2.user_id = c.participant2_id
  WHERE c.participant1_id = p_user_id OR c.participant2_id = p_user_id
  ORDER BY c.last_message_at DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Send message
CREATE OR REPLACE FUNCTION send_message(
  p_conversation_id UUID,
  p_sender_id UUID,
  p_content TEXT,
  p_message_type TEXT DEFAULT 'text',
  p_metadata JSONB DEFAULT '{}'::jsonb,
  p_image_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_message_id UUID;
BEGIN
  -- Insert message
  INSERT INTO public.messages (
    conversation_id,
    sender_id,
    content,
    message_type,
    metadata,
    image_url,
    read_by_recipient
  )
  VALUES (
    p_conversation_id,
    p_sender_id,
    p_content,
    p_message_type::TEXT,
    p_metadata,
    p_image_url,
    FALSE
  )
  RETURNING id INTO v_message_id;

  RETURN v_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Mark conversation as read
CREATE OR REPLACE FUNCTION mark_conversation_read(
  p_conversation_id UUID,
  p_user_id UUID
)
RETURNS void AS $$
BEGIN
  -- Mark all messages from other user as read
  UPDATE public.messages
  SET read_by_recipient = TRUE,
      read_at = now()
  WHERE conversation_id = p_conversation_id
    AND sender_id != p_user_id
    AND read_by_recipient = FALSE;

  -- Update or insert read status
  INSERT INTO public.conversation_read_status (conversation_id, user_id, last_read_at)
  VALUES (p_conversation_id, p_user_id, now())
  ON CONFLICT (conversation_id, user_id)
  DO UPDATE SET last_read_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 4. COMMENTS
-- ============================================================================

COMMENT ON TABLE public.typing_indicators IS 'Tracks when users are typing in conversations (auto-expires)';
COMMENT ON FUNCTION get_or_create_conversation IS 'Gets existing conversation or creates new one between two users';
COMMENT ON FUNCTION get_user_conversations IS 'Returns list of user conversations with unread counts and other user details';
COMMENT ON FUNCTION send_message IS 'Sends a message and updates conversation last_message';
COMMENT ON FUNCTION mark_conversation_read IS 'Marks all messages in conversation as read by user';
COMMENT ON FUNCTION clean_expired_typing_indicators IS 'Removes expired typing indicators (can be called by cron job)';
