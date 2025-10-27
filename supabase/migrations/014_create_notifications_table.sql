-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Notification content
  type TEXT NOT NULL, -- 'message', 'favorite', 'property_update', 'application', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Related entities (optional)
  related_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  related_property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  related_conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,

  -- Link to navigate when clicked
  action_url TEXT,

  -- Status
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Metadata
  metadata JSONB
);

-- Indexes for performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, read) WHERE read = FALSE;
CREATE INDEX idx_notifications_type ON public.notifications(type);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON public.notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- System can insert notifications (this will be used by triggers and functions)
CREATE POLICY "System can insert notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- Function to create a notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_related_user_id UUID DEFAULT NULL,
  p_related_property_id UUID DEFAULT NULL,
  p_related_conversation_id UUID DEFAULT NULL,
  p_action_url TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    related_user_id,
    related_property_id,
    related_conversation_id,
    action_url,
    metadata
  ) VALUES (
    p_user_id,
    p_type,
    p_title,
    p_message,
    p_related_user_id,
    p_related_property_id,
    p_related_conversation_id,
    p_action_url,
    p_metadata
  )
  RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to notify when a new message is received
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
DECLARE
  recipient_id UUID;
  sender_name TEXT;
  conversation_record RECORD;
BEGIN
  -- Get conversation details
  SELECT * INTO conversation_record
  FROM public.conversations
  WHERE id = NEW.conversation_id;

  -- Determine recipient (the other participant)
  IF conversation_record.participant1_id = NEW.sender_id THEN
    recipient_id := conversation_record.participant2_id;
  ELSE
    recipient_id := conversation_record.participant1_id;
  END IF;

  -- Get sender name
  SELECT full_name INTO sender_name
  FROM public.users
  WHERE id = NEW.sender_id;

  -- Create notification for recipient
  PERFORM create_notification(
    recipient_id,
    'message',
    'New message from ' || COALESCE(sender_name, 'Someone'),
    LEFT(NEW.content, 100),
    NEW.sender_id,
    NULL,
    NEW.conversation_id,
    '/messages',
    jsonb_build_object('message_id', NEW.id)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create notification when new message is sent
CREATE TRIGGER trigger_notify_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_message();

-- Function to notify when someone favorites a property (for owners)
CREATE OR REPLACE FUNCTION notify_property_favorited()
RETURNS TRIGGER AS $$
DECLARE
  owner_id UUID;
  property_title TEXT;
  user_name TEXT;
BEGIN
  -- Get property owner and title
  SELECT p.owner_id, p.title INTO owner_id, property_title
  FROM public.properties p
  WHERE p.id = NEW.property_id;

  -- Don't notify if user favorited their own property
  IF owner_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  -- Get user name
  SELECT full_name INTO user_name
  FROM public.users
  WHERE id = NEW.user_id;

  -- Create notification for property owner
  PERFORM create_notification(
    owner_id,
    'favorite',
    'Property favorited',
    COALESCE(user_name, 'Someone') || ' saved your property "' || COALESCE(property_title, 'Untitled') || '"',
    NEW.user_id,
    NEW.property_id,
    NULL,
    '/properties/' || NEW.property_id,
    jsonb_build_object('favorite_id', NEW.id)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create notification when property is favorited
CREATE TRIGGER trigger_notify_property_favorited
  AFTER INSERT ON public.favorites
  FOR EACH ROW
  EXECUTE FUNCTION notify_property_favorited();

-- Comments for documentation
COMMENT ON TABLE public.notifications IS 'Stores user notifications for various events';
COMMENT ON COLUMN public.notifications.type IS 'Type of notification: message, favorite, property_update, application, etc.';
COMMENT ON COLUMN public.notifications.title IS 'Short notification title';
COMMENT ON COLUMN public.notifications.message IS 'Detailed notification message';
COMMENT ON COLUMN public.notifications.action_url IS 'URL to navigate to when notification is clicked';
COMMENT ON COLUMN public.notifications.metadata IS 'Additional data related to the notification';
COMMENT ON COLUMN public.notifications.read IS 'Whether the notification has been read';
