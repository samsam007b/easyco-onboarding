-- =============================================
-- NOTIFICATIONS SYSTEM ENHANCEMENT FOR IZZICO
-- Migration: 20260118_notifications_system.sql
-- Description: Add missing columns and ensure full compatibility
-- with existing NotificationContext.tsx frontend
-- =============================================

-- Add image_url column if it doesn't exist (required by NotificationContext.tsx)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public'
                 AND table_name = 'notifications'
                 AND column_name = 'image_url') THEN
    ALTER TABLE public.notifications ADD COLUMN image_url TEXT;
    RAISE NOTICE '✅ Added image_url column to notifications';
  ELSE
    RAISE NOTICE 'ℹ️  image_url column already exists';
  END IF;
END $$;

-- Ensure is_read column exists (for frontend compatibility)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public'
                 AND table_name = 'notifications'
                 AND column_name = 'is_read') THEN
    ALTER TABLE public.notifications ADD COLUMN is_read BOOLEAN DEFAULT false;
    -- Sync with read column if it exists
    UPDATE public.notifications SET is_read = COALESCE(read, false);
    RAISE NOTICE '✅ Added is_read column to notifications';
  END IF;
END $$;

-- Ensure action_label column exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public'
                 AND table_name = 'notifications'
                 AND column_name = 'action_label') THEN
    ALTER TABLE public.notifications ADD COLUMN action_label TEXT;
    RAISE NOTICE '✅ Added action_label column to notifications';
  END IF;
END $$;

-- Create partial index for faster unread queries (if not exists)
CREATE INDEX IF NOT EXISTS idx_notifications_user_is_read_unread
  ON public.notifications(user_id, is_read)
  WHERE is_read = false;

-- =============================================
-- ENHANCED HELPER FUNCTIONS
-- =============================================

-- Function to get unread notification count by user_id parameter
CREATE OR REPLACE FUNCTION get_notification_unread_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.notifications
    WHERE user_id = p_user_id
    AND (is_read = FALSE OR (is_read IS NULL AND read = FALSE))
  );
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION get_notification_unread_count(UUID) TO authenticated;

-- =============================================
-- ENABLE REALTIME (if not already enabled)
-- =============================================

-- Try to add table to realtime publication
DO $$
BEGIN
  -- Check if already in publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND schemaname = 'public'
    AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
    RAISE NOTICE '✅ Added notifications to supabase_realtime publication';
  ELSE
    RAISE NOTICE 'ℹ️  notifications already in supabase_realtime publication';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'ℹ️  Could not modify realtime publication: %', SQLERRM;
END $$;

-- =============================================
-- SYNC read and is_read columns
-- =============================================

-- Ensure is_read and read are in sync
UPDATE public.notifications
SET is_read = COALESCE(read, false)
WHERE is_read IS NULL OR is_read != COALESCE(read, false);

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON COLUMN public.notifications.image_url IS 'Optional image to display with the notification (avatar, icon, etc.)';
COMMENT ON COLUMN public.notifications.action_label IS 'Optional label for the action button (e.g., "Voir le message")';
