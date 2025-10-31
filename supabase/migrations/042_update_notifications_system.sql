-- Update existing notifications table to add new features
-- This migration is safe to run on existing notifications table

-- Add new columns if they don't exist
DO $$
BEGIN
  -- Add is_read column (alias for read)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'notifications' AND column_name = 'is_read') THEN
    ALTER TABLE public.notifications ADD COLUMN is_read BOOLEAN DEFAULT false;
    -- Copy existing read values if read column exists
    UPDATE public.notifications SET is_read = read WHERE read IS NOT NULL;
  END IF;

  -- Add data column (enhanced metadata)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'notifications' AND column_name = 'data') THEN
    ALTER TABLE public.notifications ADD COLUMN data JSONB DEFAULT '{}'::jsonb;
    -- Copy existing metadata to data if it exists
    UPDATE public.notifications SET data = metadata WHERE metadata IS NOT NULL;
  END IF;

  -- Add related_message_id if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'notifications' AND column_name = 'related_message_id') THEN
    ALTER TABLE public.notifications ADD COLUMN related_message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL;
  END IF;

  -- Add action_label if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'notifications' AND column_name = 'action_label') THEN
    ALTER TABLE public.notifications ADD COLUMN action_label VARCHAR(100);
  END IF;

  -- Add expires_at if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'notifications' AND column_name = 'expires_at') THEN
    ALTER TABLE public.notifications ADD COLUMN expires_at TIMESTAMPTZ;
  END IF;
END $$;

-- Ensure read_at exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'notifications' AND column_name = 'read_at') THEN
    ALTER TABLE public.notifications ADD COLUMN read_at TIMESTAMPTZ;
  END IF;
END $$;

-- Create indexes for performance (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

-- Enable Row Level Security if not already enabled
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop and recreate RLS Policies to ensure correct setup
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Service role can insert notifications" ON public.notifications;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON public.notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- System can create notifications for any user (via service role)
CREATE POLICY "Service role can insert notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.notifications
  SET is_read = true, read = true, read_at = now()
  WHERE id = notification_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark all notifications as read for a user
CREATE OR REPLACE FUNCTION mark_all_notifications_read()
RETURNS VOID AS $$
BEGIN
  UPDATE public.notifications
  SET is_read = true, read = true, read_at = now()
  WHERE user_id = auth.uid() AND is_read = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get unread count
CREATE OR REPLACE FUNCTION get_unread_notifications_count()
RETURNS INTEGER AS $$
DECLARE
  count INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO count
  FROM public.notifications
  WHERE user_id = auth.uid() AND is_read = false;

  RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type VARCHAR,
  p_title VARCHAR,
  p_message TEXT,
  p_related_user_id UUID DEFAULT NULL,
  p_related_property_id UUID DEFAULT NULL,
  p_related_message_id UUID DEFAULT NULL,
  p_data JSONB DEFAULT '{}'::jsonb,
  p_action_url TEXT DEFAULT NULL,
  p_action_label VARCHAR DEFAULT NULL
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
    related_message_id,
    data,
    metadata,
    action_url,
    action_label,
    is_read,
    read
  ) VALUES (
    p_user_id,
    p_type,
    p_title,
    p_message,
    p_related_user_id,
    p_related_property_id,
    p_related_message_id,
    p_data,
    p_data, -- Also set metadata for backwards compatibility
    p_action_url,
    p_action_label,
    false,
    false
  ) RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create notification on new message
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
DECLARE
  recipient_id UUID;
  sender_name TEXT;
BEGIN
  -- Get recipient (the other user in the conversation)
  SELECT
    CASE
      WHEN NEW.sender_id = conversations.user1_id THEN conversations.user2_id
      ELSE conversations.user1_id
    END INTO recipient_id
  FROM conversations
  WHERE conversations.id = NEW.conversation_id;

  -- Get sender name
  SELECT COALESCE(up.first_name || ' ' || up.last_name, u.email)
  INTO sender_name
  FROM auth.users u
  LEFT JOIN user_profiles up ON u.id = up.user_id
  WHERE u.id = NEW.sender_id;

  -- Create notification
  PERFORM create_notification(
    recipient_id,
    'message',
    'Nouveau message',
    sender_name || ' vous a envoyé un message',
    NEW.sender_id,
    NULL,
    NEW.id,
    jsonb_build_object('preview', LEFT(NEW.content, 100)),
    '/messages',
    'Voir le message'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new messages
DROP TRIGGER IF EXISTS trigger_notify_new_message ON messages;
CREATE TRIGGER trigger_notify_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_message();

-- Trigger to auto-create notification on new favorite
CREATE OR REPLACE FUNCTION notify_new_favorite()
RETURNS TRIGGER AS $$
DECLARE
  property_owner_id UUID;
  favoriter_name TEXT;
  property_title TEXT;
BEGIN
  -- Get property owner
  SELECT owner_id INTO property_owner_id
  FROM properties
  WHERE id = NEW.property_id;

  -- Only notify if not the owner themselves
  IF property_owner_id != NEW.user_id THEN
    -- Get favoriter name
    SELECT COALESCE(up.first_name || ' ' || up.last_name, u.email)
    INTO favoriter_name
    FROM auth.users u
    LEFT JOIN user_profiles up ON u.id = up.user_id
    WHERE u.id = NEW.user_id;

    -- Get property title
    SELECT title INTO property_title
    FROM properties
    WHERE id = NEW.property_id;

    -- Create notification
    PERFORM create_notification(
      property_owner_id,
      'favorite',
      'Nouvelle mise en favoris',
      favoriter_name || ' a ajouté "' || property_title || '" à ses favoris',
      NEW.user_id,
      NEW.property_id,
      NULL,
      '{}'::jsonb,
      '/properties/' || NEW.property_id,
      'Voir la propriété'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new favorites (only if favorites table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'favorites') THEN
    EXECUTE 'DROP TRIGGER IF EXISTS trigger_notify_new_favorite ON public.favorites';
    EXECUTE 'CREATE TRIGGER trigger_notify_new_favorite
      AFTER INSERT ON public.favorites
      FOR EACH ROW
      EXECUTE FUNCTION notify_new_favorite()';
    RAISE NOTICE '✅ Created trigger on favorites table';
  ELSE
    RAISE NOTICE '⚠️  Favorites table does not exist - skipping trigger creation';
  END IF;
END $$;

-- Function to clean up old read notifications (can be run periodically)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete read notifications older than 30 days
  DELETE FROM public.notifications
  WHERE is_read = true
  AND read_at < now() - INTERVAL '30 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Sync read and is_read columns for existing data
UPDATE public.notifications
SET is_read = read
WHERE is_read IS NULL OR is_read != read;

-- Add comments for documentation
COMMENT ON TABLE public.notifications IS 'Stores user notifications for real-time updates';
COMMENT ON COLUMN public.notifications.type IS 'Type of notification: message, match, favorite, application, system';
COMMENT ON COLUMN public.notifications.data IS 'Additional JSON data for the notification';
COMMENT ON COLUMN public.notifications.action_url IS 'Optional URL to navigate when notification is clicked';
COMMENT ON COLUMN public.notifications.expires_at IS 'Optional expiration date for time-sensitive notifications';
COMMENT ON COLUMN public.notifications.is_read IS 'Whether notification has been read (use this for new code)';
COMMENT ON COLUMN public.notifications.read IS 'Legacy read column (kept for backwards compatibility)';
