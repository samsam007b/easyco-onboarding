-- ============================================
-- IMMEDIATE FIX FOR user_profiles RLS ERROR
-- Copy this ENTIRE file and run it in Supabase SQL Editor
-- ============================================

-- Step 1: Drop all existing RLS policies
DROP POLICY IF EXISTS "user_profiles_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_select_public" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_delete_own" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;

-- Step 2: Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create new policies with correct permissions

-- SELECT policy: Users can view their own profile
CREATE POLICY "user_profiles_select_own"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- SELECT policy: Users can view other profiles (for matching, etc.)
CREATE POLICY "user_profiles_select_public"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (true);

-- INSERT policy: Users can create their own profile
CREATE POLICY "user_profiles_insert_own"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- UPDATE policy: Users can update their own profile
CREATE POLICY "user_profiles_update_own"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- DELETE policy: Users can delete their own profile
CREATE POLICY "user_profiles_delete_own"
ON public.user_profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Step 4: Verify columns exist (add if missing)
DO $$
BEGIN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'user_profiles' AND column_name = 'phone_verified') THEN
        ALTER TABLE public.user_profiles ADD COLUMN phone_verified BOOLEAN DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'user_profiles' AND column_name = 'id_verified') THEN
        ALTER TABLE public.user_profiles ADD COLUMN id_verified BOOLEAN DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'user_profiles' AND column_name = 'background_check') THEN
        ALTER TABLE public.user_profiles ADD COLUMN background_check BOOLEAN DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'user_profiles' AND column_name = 'email_verified') THEN
        ALTER TABLE public.user_profiles ADD COLUMN email_verified BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Step 5: Test the policies work
DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE tablename = 'user_profiles'
    AND schemaname = 'public';

    IF policy_count >= 5 THEN
        RAISE NOTICE '✅ SUCCESS: % RLS policies created on user_profiles', policy_count;
    ELSE
        RAISE WARNING '⚠️  WARNING: Only % RLS policies found on user_profiles', policy_count;
    END IF;
END $$;

-- Step 6: Display current policies
SELECT
    policyname as "Policy Name",
    cmd as "Command",
    CASE
        WHEN qual IS NOT NULL THEN 'Has USING clause'
        ELSE 'No USING clause'
    END as "Using",
    CASE
        WHEN with_check IS NOT NULL THEN 'Has WITH CHECK clause'
        ELSE 'No WITH CHECK clause'
    END as "With Check"
FROM pg_policies
WHERE tablename = 'user_profiles'
AND schemaname = 'public'
ORDER BY cmd;
