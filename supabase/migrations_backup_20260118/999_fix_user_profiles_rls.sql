-- Fix user_profiles RLS policies to allow authenticated users to access their profiles
-- This migration fixes the 400 error on user_profiles

-- Drop existing policies
DROP POLICY IF EXISTS "user_profiles_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_select_public" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_delete_own" ON public.user_profiles;

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy SELECT for own profile
CREATE POLICY "user_profiles_select_own"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy SELECT for public profiles (allows viewing other profiles)
CREATE POLICY "user_profiles_select_public"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (true);

-- Policy INSERT for creating own profile
CREATE POLICY "user_profiles_insert_own"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy UPDATE for modifying own profile
CREATE POLICY "user_profiles_update_own"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy DELETE for deleting own profile
CREATE POLICY "user_profiles_delete_own"
ON public.user_profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Verify the policies were created
DO $$
BEGIN
  RAISE NOTICE 'user_profiles RLS policies have been successfully created';
END $$;
