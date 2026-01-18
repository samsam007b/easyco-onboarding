-- Add image_url column to notifications table
-- Required by NotificationContext.tsx frontend

ALTER TABLE public.notifications
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_notifications_image_url
  ON public.notifications(image_url)
  WHERE image_url IS NOT NULL;

-- Comment
COMMENT ON COLUMN public.notifications.image_url IS 'Optional image URL for notification (avatar, icon, etc.)';
