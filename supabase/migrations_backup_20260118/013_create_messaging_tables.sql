-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Participants (2-way conversation for now)
  participant1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Last message info for quick display
  last_message_text TEXT,
  last_message_at TIMESTAMPTZ,
  last_message_sender_id UUID REFERENCES auth.users(id),

  -- Ensure users can't have duplicate conversations
  UNIQUE(participant1_id, participant2_id),

  -- Ensure participant1_id < participant2_id for consistency
  CHECK (participant1_id < participant2_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Read status tracking
  read_at TIMESTAMPTZ,

  -- For future features
  edited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

-- Create unread_messages tracking table
CREATE TABLE IF NOT EXISTS public.conversation_read_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(conversation_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_conversations_participant1 ON public.conversations(participant1_id);
CREATE INDEX idx_conversations_participant2 ON public.conversations(participant2_id);
CREATE INDEX idx_conversations_updated_at ON public.conversations(updated_at DESC);

CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

CREATE INDEX idx_conversation_read_status_user ON public.conversation_read_status(user_id);
CREATE INDEX idx_conversation_read_status_conversation ON public.conversation_read_status(conversation_id);

-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_read_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations

-- Users can view conversations they're part of
CREATE POLICY "Users can view own conversations"
  ON public.conversations
  FOR SELECT
  USING (
    auth.uid() = participant1_id OR
    auth.uid() = participant2_id
  );

-- Users can create conversations
CREATE POLICY "Users can create conversations"
  ON public.conversations
  FOR INSERT
  WITH CHECK (
    auth.uid() = participant1_id OR
    auth.uid() = participant2_id
  );

-- Users can update conversations they're part of
CREATE POLICY "Users can update own conversations"
  ON public.conversations
  FOR UPDATE
  USING (
    auth.uid() = participant1_id OR
    auth.uid() = participant2_id
  );

-- RLS Policies for messages

-- Users can view messages in their conversations
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

-- Users can send messages in their conversations
CREATE POLICY "Users can send messages in own conversations"
  ON public.messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.participant1_id = auth.uid() OR c.participant2_id = auth.uid())
    )
  );

-- Users can update their own messages
CREATE POLICY "Users can update own messages"
  ON public.messages
  FOR UPDATE
  USING (auth.uid() = sender_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete own messages"
  ON public.messages
  FOR DELETE
  USING (auth.uid() = sender_id);

-- RLS Policies for read status

-- Users can view their own read status
CREATE POLICY "Users can view own read status"
  ON public.conversation_read_status
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own read status
CREATE POLICY "Users can insert own read status"
  ON public.conversation_read_status
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own read status
CREATE POLICY "Users can update own read status"
  ON public.conversation_read_status
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to update conversation's last_message info
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET
    last_message_text = NEW.content,
    last_message_at = NEW.created_at,
    last_message_sender_id = NEW.sender_id,
    updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update conversation when message is sent
CREATE TRIGGER trigger_update_conversation_last_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- Comments for documentation
COMMENT ON TABLE public.conversations IS 'Stores conversations between users';
COMMENT ON TABLE public.messages IS 'Stores individual messages within conversations';
COMMENT ON TABLE public.conversation_read_status IS 'Tracks when users last read each conversation';

COMMENT ON COLUMN public.conversations.participant1_id IS 'First participant (always < participant2_id for consistency)';
COMMENT ON COLUMN public.conversations.participant2_id IS 'Second participant (always > participant1_id for consistency)';
COMMENT ON COLUMN public.conversations.last_message_text IS 'Text of the last message for quick display';
COMMENT ON COLUMN public.conversations.last_message_at IS 'Timestamp of the last message';

COMMENT ON COLUMN public.messages.content IS 'The message text content';
COMMENT ON COLUMN public.messages.read_at IS 'When the message was read by the recipient';
