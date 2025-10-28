-- ============================================================================
-- MIGRATION 027: ENHANCE MESSAGING SYSTEM
-- ============================================================================
-- Adds file attachments, typing indicators, and message reactions
-- ============================================================================

-- Add attachment support to messages table
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS attachment_url TEXT,
  ADD COLUMN IF NOT EXISTS attachment_type TEXT,
  ADD COLUMN IF NOT EXISTS attachment_size INTEGER,
  ADD COLUMN IF NOT EXISTS attachment_name TEXT;

-- Add message type (text, image, file, etc.)
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system'));

-- Add reactions support
CREATE TABLE IF NOT EXISTS public.message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),

  -- User can only react once per message per emoji
  UNIQUE(message_id, user_id, emoji)
);

-- Create typing indicators table (temporary data, auto-cleanup)
CREATE TABLE IF NOT EXISTS public.typing_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Only one typing indicator per user per conversation
  UNIQUE(conversation_id, user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_attachment ON public.messages(attachment_url) WHERE attachment_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_message_reactions_message ON public.message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_user ON public.message_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_typing_indicators_conversation ON public.typing_indicators(conversation_id);
CREATE INDEX IF NOT EXISTS idx_typing_indicators_updated_at ON public.typing_indicators(updated_at);

-- Enable RLS
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typing_indicators ENABLE ROW LEVEL SECURITY;

-- RLS Policies for message_reactions

-- Users can view reactions on messages in their conversations
CREATE POLICY "Users can view reactions in own conversations"
  ON public.message_reactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      JOIN public.conversations c ON m.conversation_id = c.id
      WHERE m.id = message_id
      AND (c.participant1_id = auth.uid() OR c.participant2_id = auth.uid())
    )
  );

-- Users can add reactions
CREATE POLICY "Users can add reactions"
  ON public.message_reactions
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.messages m
      JOIN public.conversations c ON m.conversation_id = c.id
      WHERE m.id = message_id
      AND (c.participant1_id = auth.uid() OR c.participant2_id = auth.uid())
    )
  );

-- Users can remove their own reactions
CREATE POLICY "Users can remove own reactions"
  ON public.message_reactions
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for typing_indicators

-- Users can view typing indicators in their conversations
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

-- Users can insert their own typing indicators
CREATE POLICY "Users can insert own typing"
  ON public.typing_indicators
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.participant1_id = auth.uid() OR c.participant2_id = auth.uid())
    )
  );

-- Users can update their own typing indicators
CREATE POLICY "Users can update own typing"
  ON public.typing_indicators
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own typing indicators
CREATE POLICY "Users can delete own typing"
  ON public.typing_indicators
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to auto-cleanup old typing indicators (older than 10 seconds)
CREATE OR REPLACE FUNCTION cleanup_old_typing_indicators()
RETURNS void AS $$
BEGIN
  DELETE FROM public.typing_indicators
  WHERE updated_at < NOW() - INTERVAL '10 seconds';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to mark messages as read when the other user loads the conversation
CREATE OR REPLACE FUNCTION mark_messages_as_read()
RETURNS TRIGGER AS $$
BEGIN
  -- When read status is updated, mark all previous unread messages as read
  UPDATE public.messages
  SET read_at = NEW.last_read_at
  WHERE conversation_id = NEW.conversation_id
    AND sender_id != NEW.user_id
    AND read_at IS NULL
    AND created_at <= NEW.last_read_at;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on conversation_read_status updates
DROP TRIGGER IF EXISTS trigger_mark_messages_as_read ON public.conversation_read_status;
CREATE TRIGGER trigger_mark_messages_as_read
  AFTER INSERT OR UPDATE ON public.conversation_read_status
  FOR EACH ROW
  EXECUTE FUNCTION mark_messages_as_read();

-- Create Supabase Storage bucket for message attachments (if not exists)
-- This needs to be done via Supabase Dashboard or via SQL with proper permissions
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('message-attachments', 'message-attachments', false)
-- ON CONFLICT (id) DO NOTHING;

-- Storage policies will need to be set via Dashboard or separate migration
-- Allow authenticated users to upload to their own folder
-- Allow users to read attachments in their conversations

-- Comments for documentation
COMMENT ON COLUMN public.messages.attachment_url IS 'URL to attached file in Supabase Storage';
COMMENT ON COLUMN public.messages.attachment_type IS 'MIME type of attachment (image/jpeg, application/pdf, etc.)';
COMMENT ON COLUMN public.messages.attachment_size IS 'File size in bytes';
COMMENT ON COLUMN public.messages.attachment_name IS 'Original filename';
COMMENT ON COLUMN public.messages.message_type IS 'Type of message: text, image, file, or system';

COMMENT ON TABLE public.message_reactions IS 'Emoji reactions to messages';
COMMENT ON TABLE public.typing_indicators IS 'Temporary table for real-time typing indicators';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Migration 027: Messaging system enhanced successfully';
  RAISE NOTICE '- Added file attachment support to messages';
  RAISE NOTICE '- Added message reactions table';
  RAISE NOTICE '- Added typing indicators table';
  RAISE NOTICE '- Added automatic message read marking';
  RAISE NOTICE '- Next step: Create storage bucket "message-attachments" in Supabase Dashboard';
END $$;
