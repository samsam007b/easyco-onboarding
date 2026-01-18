-- Fix get_unread_count function to use SECURITY DEFINER
-- This prevents RLS infinite recursion on conversation_participants table
-- Error: "infinite recursion detected in policy for relation conversation_participants" (code: 42P17)
--
-- Date: 2025-11-09
-- Issue: RLS policy on conversation_participants causes infinite loop when called with SECURITY INVOKER
-- Solution: Change to SECURITY DEFINER so function runs with creator's permissions (bypasses RLS)

-- Drop existing function first (it may have a different return type)
DROP FUNCTION IF EXISTS get_unread_count(UUID);

CREATE OR REPLACE FUNCTION get_unread_count(target_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER  -- Run with creator's permissions, not caller's (bypasses RLS)
SET search_path = public  -- Security: Explicitly set search path
AS $$
  -- Count unread messages where:
  -- 1. User is a participant in the conversation
  -- 2. Message was sent by someone else
  -- 3. Message created after user's last_read_at timestamp
  SELECT COUNT(*)::INTEGER
  FROM messages m
  INNER JOIN conversation_participants cp
    ON cp.conversation_id = m.conversation_id
  WHERE cp.user_id = target_user_id
    AND m.sender_id != target_user_id
    AND m.created_at > cp.last_read_at;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_unread_count(UUID) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION get_unread_count(UUID) IS
'Returns count of unread messages for a user. Uses SECURITY DEFINER to bypass RLS infinite recursion on conversation_participants.';
