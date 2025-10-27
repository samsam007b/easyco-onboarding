-- ============================================================================
-- MIGRATION 019: Add Missing RLS Policies
-- Date: 2025-10-27
-- Description: Add comprehensive RLS policies for all tables
-- Security Impact: Prevents unauthorized access to user data
-- ============================================================================

-- ============================================================================
-- USERS TABLE
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
    DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

    CREATE POLICY "Users can view own profile"
      ON public.users
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);

    CREATE POLICY "Users can update own profile"
      ON public.users
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id);

    RAISE NOTICE 'RLS policies added to users table';
  END IF;
END $$;

-- ============================================================================
-- USER_PROFILES TABLE
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_profiles') THEN
    ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

    CREATE POLICY "Users can view own profile"
      ON public.user_profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can update own profile"
      ON public.user_profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert own profile"
      ON public.user_profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);

    RAISE NOTICE 'RLS policies added to user_profiles table';
  END IF;
END $$;

-- ============================================================================
-- PROPERTIES TABLE
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'properties') THEN
    ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Properties visible to authenticated users" ON public.properties;
    DROP POLICY IF EXISTS "Property owners can insert properties" ON public.properties;
    DROP POLICY IF EXISTS "Property owners can update own properties" ON public.properties;
    DROP POLICY IF EXISTS "Property owners can delete own properties" ON public.properties;

    CREATE POLICY "Properties visible to authenticated users"
      ON public.properties
      FOR SELECT
      TO authenticated
      USING (true);

    CREATE POLICY "Property owners can insert properties"
      ON public.properties
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = owner_id);

    CREATE POLICY "Property owners can update own properties"
      ON public.properties
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = owner_id);

    CREATE POLICY "Property owners can delete own properties"
      ON public.properties
      FOR DELETE
      TO authenticated
      USING (auth.uid() = owner_id);

    RAISE NOTICE 'RLS policies added to properties table';
  END IF;
END $$;

-- ============================================================================
-- APPLICATIONS TABLE
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'applications') THEN
    ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view own applications" ON public.applications;
    DROP POLICY IF EXISTS "Property owners can view applications on their properties" ON public.applications;
    DROP POLICY IF EXISTS "Users can create applications" ON public.applications;
    DROP POLICY IF EXISTS "Users can update own applications" ON public.applications;
    DROP POLICY IF EXISTS "Property owners can update applications status" ON public.applications;

    CREATE POLICY "Users can view own applications"
      ON public.applications
      FOR SELECT
      TO authenticated
      USING (auth.uid() = applicant_id);

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

    CREATE POLICY "Users can create applications"
      ON public.applications
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = applicant_id);

    CREATE POLICY "Users can update own applications"
      ON public.applications
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = applicant_id);

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

    RAISE NOTICE 'RLS policies added to applications table';
  END IF;
END $$;

-- ============================================================================
-- MESSAGES TABLE
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'messages') THEN
    ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view own messages" ON public.messages;
    DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
    DROP POLICY IF EXISTS "Users can update own messages" ON public.messages;

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

    CREATE POLICY "Users can update own messages"
      ON public.messages
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = sender_id);

    RAISE NOTICE 'RLS policies added to messages table';
  END IF;
END $$;

-- ============================================================================
-- CONVERSATIONS TABLE
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'conversations') THEN
    ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
    DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
    DROP POLICY IF EXISTS "Users can update own conversations" ON public.conversations;

    CREATE POLICY "Users can view own conversations"
      ON public.conversations
      FOR SELECT
      TO authenticated
      USING (
        auth.uid() = participant1_id
        OR
        auth.uid() = participant2_id
      );

    CREATE POLICY "Users can create conversations"
      ON public.conversations
      FOR INSERT
      TO authenticated
      WITH CHECK (
        auth.uid() = participant1_id
        OR
        auth.uid() = participant2_id
      );

    CREATE POLICY "Users can update own conversations"
      ON public.conversations
      FOR UPDATE
      TO authenticated
      USING (
        auth.uid() = participant1_id
        OR
        auth.uid() = participant2_id
      );

    RAISE NOTICE 'RLS policies added to conversations table';
  END IF;
END $$;

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'notifications') THEN
    ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
    DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
    DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
    DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;

    CREATE POLICY "Users can view own notifications"
      ON public.notifications
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE POLICY "System can create notifications"
      ON public.notifications
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update own notifications"
      ON public.notifications
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete own notifications"
      ON public.notifications
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);

    RAISE NOTICE 'RLS policies added to notifications table';
  END IF;
END $$;

-- ============================================================================
-- FAVORITES TABLE
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'favorites') THEN
    ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;
    DROP POLICY IF EXISTS "Users can add favorites" ON public.favorites;
    DROP POLICY IF EXISTS "Users can delete own favorites" ON public.favorites;

    CREATE POLICY "Users can view own favorites"
      ON public.favorites
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can add favorites"
      ON public.favorites
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can delete own favorites"
      ON public.favorites
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);

    RAISE NOTICE 'RLS policies added to favorites table';
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
