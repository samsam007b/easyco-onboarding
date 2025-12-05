-- ============================================
-- RLS Policies for EasyCo iOS App
-- ============================================
-- This script creates Row Level Security policies
-- to allow authenticated users to access their data
-- ============================================

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Allow users to read their own user record
CREATE POLICY "Users can read own data"
ON public.users
FOR SELECT
USING (auth.uid()::text = id::text);

-- Allow users to update their own user record
CREATE POLICY "Users can update own data"
ON public.users
FOR UPDATE
USING (auth.uid()::text = id::text);

-- ============================================
-- PROFILES TABLE POLICIES
-- ============================================

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
ON public.profiles
FOR SELECT
USING (auth.uid()::text = user_id::text);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid()::text = user_id::text);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid()::text = user_id::text);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- After running the above policies, you can verify with:
-- SELECT * FROM pg_policies WHERE tablename IN ('users', 'profiles');
