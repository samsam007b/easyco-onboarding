-- ==============================================================================
-- COPY AND PASTE THIS ENTIRE FILE INTO SUPABASE SQL EDITOR
-- Then click "RUN" to apply
-- ==============================================================================

-- Drop existing function first (it may have a different return type or wrong implementation)
DROP FUNCTION IF EXISTS get_unread_count(UUID);

-- Create the corrected function with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION get_unread_count(target_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER  -- Run with creator's permissions, not caller's (bypasses RLS infinite recursion)
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
COMMENT ON FUNCTION get_unread_count(UUID) IS 'Returns count of unread messages for a user. Uses SECURITY DEFINER to bypass RLS infinite recursion on conversation_participants.';

-- ==============================================================================
-- DONE! Now test it by running this:
-- SELECT get_unread_count(auth.uid());
-- ==============================================================================
