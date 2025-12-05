-- ============================================
-- DIAGNOSTIC RLS POLICIES
-- ============================================
-- These temporary policies allow ALL authenticated users
-- to access data. This helps diagnose if the issue is:
-- 1. Policy matching logic (auth.uid() = id not working)
-- 2. JWT token/headers/API configuration
-- ============================================

-- Drop the restrictive policies temporarily
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;

-- Create temporary allow-all policies for diagnosis
CREATE POLICY "temp_allow_all_authenticated_users"
ON public.users
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "temp_allow_all_authenticated_profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Verify the new policies
SELECT
    tablename,
    policyname,
    cmd as command,
    roles,
    qual as "USING clause"
FROM pg_policies
WHERE tablename IN ('users', 'profiles')
ORDER BY tablename, policyname;
