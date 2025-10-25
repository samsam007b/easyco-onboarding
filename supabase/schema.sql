-- =====================================================
-- EASYCO AUTHENTICATION SCHEMA
-- =====================================================
-- This schema extends Supabase Auth with custom user tables
-- and implements Row Level Security (RLS) policies.
--
-- Created for: EasyCo MVP Platform
-- Purpose: User authentication and profile management
-- =====================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS TABLE (extends auth.users)
-- =====================================================
-- This table stores additional user information beyond
-- what Supabase Auth provides by default.

CREATE TABLE IF NOT EXISTS public.users (
  -- Primary key, references Supabase Auth user
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic information
  email TEXT UNIQUE NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('searcher', 'owner', 'resident')),
  full_name TEXT,
  avatar_url TEXT,

  -- Status flags
  onboarding_completed BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment to table
COMMENT ON TABLE public.users IS 'Extended user information for EasyCo platform';

-- =====================================================
-- 2. USER PROFILES TABLE
-- =====================================================
-- Links users to their onboarding data (searcher or owner profiles)

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,

  -- Links to onboarding data
  searcher_profile_id UUID REFERENCES public.test_onboardings(id) ON DELETE SET NULL,
  owner_profile_id UUID REFERENCES public.test_owners(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.user_profiles IS 'Links users to their onboarding profiles';

-- =====================================================
-- 3. USER SESSIONS TABLE (for analytics)
-- =====================================================
-- Tracks user login sessions for analytics and security

CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,

  -- Session information
  login_at TIMESTAMPTZ DEFAULT NOW(),
  logout_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,

  -- Session metadata
  session_duration_seconds INTEGER,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.user_sessions IS 'User login sessions for analytics';

-- =====================================================
-- 4. INDEXES FOR PERFORMANCE
-- =====================================================

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON public.users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_searcher ON public.user_profiles(searcher_profile_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_owner ON public.user_profiles(owner_profile_id);

-- User sessions indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_login_at ON public.user_sessions(login_at);

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Policy: Users can read their own data
CREATE POLICY "Users can read own data"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy: Service role can insert users (for signup)
CREATE POLICY "Service role can insert users"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Users can delete their own account
CREATE POLICY "Users can delete own account"
ON public.users
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- =====================================================
-- USER PROFILES TABLE POLICIES
-- =====================================================

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- =====================================================
-- USER SESSIONS TABLE POLICIES
-- =====================================================

-- Policy: Users can read their own sessions
CREATE POLICY "Users can read own sessions"
ON public.user_sessions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy: Users can insert their own sessions
CREATE POLICY "Users can insert own sessions"
ON public.user_sessions
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- =====================================================
-- 6. TRIGGERS & FUNCTIONS
-- =====================================================

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Update users.updated_at on update
DROP TRIGGER IF EXISTS set_updated_at_users ON public.users;
CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: Update user_profiles.updated_at on update
DROP TRIGGER IF EXISTS set_updated_at_user_profiles ON public.user_profiles;
CREATE TRIGGER set_updated_at_user_profiles
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- Function: Auto-create user record on auth.users insert
-- =====================================================
-- This function automatically creates a record in public.users
-- whenever a new user signs up via Supabase Auth.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, user_type, email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'searcher'),
    NEW.email_confirmed_at IS NOT NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create user record when auth.users record is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- Function: Update email_verified when email is confirmed
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_email_verified()
RETURNS TRIGGER AS $$
BEGIN
  -- If email_confirmed_at changed from NULL to a timestamp
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    UPDATE public.users
    SET email_verified = TRUE
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Update email_verified when auth.users email is confirmed
DROP TRIGGER IF EXISTS on_auth_user_email_verified ON auth.users;
CREATE TRIGGER on_auth_user_email_verified
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_email_verified();

-- =====================================================
-- 7. INITIAL DATA / SEED (Optional)
-- =====================================================

-- You can add test users or default data here if needed
-- For now, we'll leave this empty

-- =====================================================
-- SCHEMA VERIFICATION QUERIES
-- =====================================================
-- Run these queries after applying the schema to verify:

-- 1. Check if all tables exist:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name IN ('users', 'user_profiles', 'user_sessions');

-- 2. Check if RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables
-- WHERE schemaname = 'public'
-- AND tablename IN ('users', 'user_profiles', 'user_sessions');

-- 3. Check if policies exist:
-- SELECT tablename, policyname FROM pg_policies
-- WHERE schemaname = 'public';

-- 4. Check if triggers exist:
-- SELECT trigger_name, event_object_table
-- FROM information_schema.triggers
-- WHERE event_object_schema = 'public';

-- =====================================================
-- END OF SCHEMA
-- =====================================================

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'EasyCo authentication schema applied successfully!';
  RAISE NOTICE 'Tables created: users, user_profiles, user_sessions';
  RAISE NOTICE 'RLS policies enabled';
  RAISE NOTICE 'Triggers configured for automatic user creation';
END $$;
