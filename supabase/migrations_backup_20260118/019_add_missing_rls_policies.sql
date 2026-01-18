-- ============================================================================
-- MIGRATION 019: Add Missing RLS Policies
-- Date: 2025-10-27
-- Description: Add comprehensive RLS policies for all tables
-- Security Impact: Prevents unauthorized access to user data
-- ============================================================================

-- ============================================================================
-- PROPERTIES TABLE
-- ============================================================================

-- Enable RLS if not already enabled
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Properties visible to authenticated users" ON public.properties;
DROP POLICY IF EXISTS "Property owners can insert properties" ON public.properties;
DROP POLICY IF EXISTS "Property owners can update own properties" ON public.properties;
DROP POLICY IF EXISTS "Property owners can delete own properties" ON public.properties;

-- Anyone authenticated can view properties (for browsing)
CREATE POLICY "Properties visible to authenticated users"
  ON public.properties
  FOR SELECT
  TO authenticated
  USING (true);

-- Only property owners can insert their own properties
CREATE POLICY "Property owners can insert properties"
  ON public.properties
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Only property owners can update their own properties
CREATE POLICY "Property owners can update own properties"
  ON public.properties
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Only property owners can delete their own properties
CREATE POLICY "Property owners can delete own properties"
  ON public.properties
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- ============================================================================
-- APPLICATIONS TABLE
-- ============================================================================

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own applications" ON public.applications;
DROP POLICY IF EXISTS "Property owners can view applications on their properties" ON public.applications;
DROP POLICY IF EXISTS "Users can create applications" ON public.applications;
DROP POLICY IF EXISTS "Users can update own applications" ON public.applications;
DROP POLICY IF EXISTS "Property owners can update applications status" ON public.applications;

-- Applicants can view their own applications
CREATE POLICY "Users can view own applications"
  ON public.applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = applicant_id);

-- Property owners can view applications on their properties
CREATE POLICY "Property owners can view applications on their properties"
  ON public.applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE id = property_id AND owner_id = auth.uid()
    )
  );

-- Users can create applications
CREATE POLICY "Users can create applications"
  ON public.applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = applicant_id);

-- Users can update their own applications
CREATE POLICY "Users can update own applications"
  ON public.applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = applicant_id);

-- Property owners can update application status
CREATE POLICY "Property owners can update applications status"
  ON public.applications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE id = property_id AND owner_id = auth.uid()
    )
  );

-- ============================================================================
-- MESSAGES TABLE
-- ============================================================================

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update own messages" ON public.messages;

-- Users can view messages they sent or received
CREATE POLICY "Users can view own messages"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = sender_id
    OR
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = conversation_id
      AND (participant1_id = auth.uid() OR participant2_id = auth.uid())
    )
  );

-- Users can send messages in their conversations
CREATE POLICY "Users can send messages"
  ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = conversation_id
      AND (participant1_id = auth.uid() OR participant2_id = auth.uid())
    )
  );

-- Users can update their own messages (for editing)
CREATE POLICY "Users can update own messages"
  ON public.messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id);

-- ============================================================================
-- CONVERSATIONS TABLE
-- ============================================================================

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON public.conversations;

-- Users can view conversations they're part of
CREATE POLICY "Users can view own conversations"
  ON public.conversations
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = participant1_id
    OR
    auth.uid() = participant2_id
  );

-- Users can create conversations
CREATE POLICY "Users can create conversations"
  ON public.conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = participant1_id
    OR
    auth.uid() = participant2_id
  );

-- Users can update conversations they're part of
CREATE POLICY "Users can update own conversations"
  ON public.conversations
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = participant1_id
    OR
    auth.uid() = participant2_id
  );

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;

-- Users can only view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role can create notifications for any user
CREATE POLICY "System can create notifications"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON public.notifications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- GROUPS TABLES (if they exist)
-- ============================================================================

-- Groups table
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'groups') THEN
    ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view groups they're part of" ON public.groups;
    DROP POLICY IF EXISTS "Users can create groups" ON public.groups;
    DROP POLICY IF EXISTS "Group creators can update their groups" ON public.groups;

    CREATE POLICY "Users can view groups they're part of"
      ON public.groups
      FOR SELECT
      TO authenticated
      USING (
        creator_id = auth.uid()
        OR
        EXISTS (
          SELECT 1 FROM public.group_members
          WHERE group_id = id AND user_id = auth.uid()
        )
      );

    CREATE POLICY "Users can create groups"
      ON public.groups
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = creator_id);

    CREATE POLICY "Group creators can update their groups"
      ON public.groups
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = creator_id);

    RAISE NOTICE 'RLS policies added to groups table';
  END IF;
END $$;

-- Group members table
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'group_members') THEN
    ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view group members" ON public.group_members;
    DROP POLICY IF EXISTS "Group creators can add members" ON public.group_members;
    DROP POLICY IF EXISTS "Users can leave groups" ON public.group_members;

    CREATE POLICY "Users can view group members"
      ON public.group_members
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.groups
          WHERE id = group_id
          AND (creator_id = auth.uid() OR id IN (
            SELECT group_id FROM public.group_members WHERE user_id = auth.uid()
          ))
        )
      );

    CREATE POLICY "Group creators can add members"
      ON public.group_members
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.groups
          WHERE id = group_id AND creator_id = auth.uid()
        )
      );

    CREATE POLICY "Users can leave groups"
      ON public.group_members
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);

    RAISE NOTICE 'RLS policies added to group_members table';
  END IF;
END $$;

-- ============================================================================
-- VERIFICATION AND TESTING
-- ============================================================================

-- Create a function to test RLS policies
CREATE OR REPLACE FUNCTION test_rls_policies()
RETURNS TABLE(table_name TEXT, rls_enabled BOOLEAN, policy_count INTEGER) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.tablename::TEXT,
    t.rowsecurity::BOOLEAN,
    COUNT(p.policyname)::INTEGER
  FROM pg_tables t
  LEFT JOIN pg_policies p ON p.tablename = t.tablename AND p.schemaname = t.schemaname
  WHERE t.schemaname = 'public'
    AND t.tablename IN ('users', 'user_profiles', 'properties', 'applications', 'messages', 'conversations', 'notifications', 'favorites', 'groups', 'group_members')
  GROUP BY t.tablename, t.rowsecurity
  ORDER BY t.tablename;
END;
$$ LANGUAGE plpgsql;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'RLS Policies Migration Completed';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'All critical tables now have comprehensive RLS policies';
  RAISE NOTICE 'Run: SELECT * FROM test_rls_policies(); to verify';
END $$;
