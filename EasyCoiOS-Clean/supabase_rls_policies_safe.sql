-- ============================================
-- RLS Policies for EasyCo iOS App (Safe Version)
-- ============================================
-- This script safely creates RLS policies
-- Only creates policies if they don't exist
-- ============================================

-- First, enable RLS on both tables if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DROP EXISTING POLICIES (if needed)
-- ============================================
-- Uncomment these if you want to recreate policies from scratch

-- DROP POLICY IF EXISTS "Users can read own data" ON public.users;
-- DROP POLICY IF EXISTS "Users can update own data" ON public.users;
-- DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
-- DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
-- DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- ============================================
-- CREATE POLICIES (with IF NOT EXISTS workaround)
-- ============================================

-- USERS TABLE: Read policy
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'users'
        AND policyname = 'Users can read own data'
    ) THEN
        CREATE POLICY "Users can read own data"
        ON public.users
        FOR SELECT
        USING (auth.uid()::text = id::text);
    END IF;
END $$;

-- USERS TABLE: Update policy
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'users'
        AND policyname = 'Users can update own data'
    ) THEN
        CREATE POLICY "Users can update own data"
        ON public.users
        FOR UPDATE
        USING (auth.uid()::text = id::text);
    END IF;
END $$;

-- PROFILES TABLE: Read policy
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'profiles'
        AND policyname = 'Users can read own profile'
    ) THEN
        CREATE POLICY "Users can read own profile"
        ON public.profiles
        FOR SELECT
        USING (auth.uid()::text = user_id::text);
    END IF;
END $$;

-- PROFILES TABLE: Insert policy
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'profiles'
        AND policyname = 'Users can insert own profile'
    ) THEN
        CREATE POLICY "Users can insert own profile"
        ON public.profiles
        FOR INSERT
        WITH CHECK (auth.uid()::text = user_id::text);
    END IF;
END $$;

-- PROFILES TABLE: Update policy
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'profiles'
        AND policyname = 'Users can update own profile'
    ) THEN
        CREATE POLICY "Users can update own profile"
        ON public.profiles
        FOR UPDATE
        USING (auth.uid()::text = user_id::text);
    END IF;
END $$;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check RLS status
SELECT
    tablename,
    rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'profiles');

-- List all policies
SELECT
    tablename,
    policyname,
    cmd as "Command",
    qual as "USING Expression",
    with_check as "WITH CHECK Expression"
FROM pg_policies
WHERE tablename IN ('users', 'profiles')
ORDER BY tablename, policyname;
