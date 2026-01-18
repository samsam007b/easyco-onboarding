-- Migration: Fix overly permissive notifications RLS policy
-- This fixes critical bug #6: Anyone could create notifications for anyone
-- Created: 2025-10-27

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

-- Create a more secure policy that only allows service_role to insert
-- This ensures only backend processes (triggers, functions) can create notifications
CREATE POLICY "Service role can insert notifications"
  ON public.notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Optionally: Allow authenticated users to create notifications for themselves
-- This can be useful for self-notifications (reminders, etc.)
CREATE POLICY "Users can create own notifications"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add comment for documentation
COMMENT ON POLICY "Service role can insert notifications" ON public.notifications IS
  'Only service role (backend triggers/functions) can create notifications for users';

COMMENT ON POLICY "Users can create own notifications" ON public.notifications IS
  'Users can create notifications for themselves only';
