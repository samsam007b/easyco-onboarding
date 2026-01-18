-- =====================================================
-- FIX SUPER ADMIN SEARCHER ACCESS
-- =====================================================
-- Ensures baudonsamuel@gmail.com and sam7777jones@gmail.com
-- can access searcher features as super admins.
-- Includes hardcoded fallback to guarantee access even if
-- table lookup fails.
-- =====================================================

-- Step 1: Ensure admins table entries exist
-- Use DO block to handle the case where admins table might not have all columns yet
DO $$
BEGIN
  -- Insert baudonsamuel@gmail.com as super admin
  INSERT INTO public.admins (email, role)
  VALUES ('baudonsamuel@gmail.com', 'super_admin')
  ON CONFLICT (email) DO UPDATE
  SET role = 'super_admin', updated_at = NOW();

  -- Insert sam7777jones@gmail.com as super admin
  INSERT INTO public.admins (email, role)
  VALUES ('sam7777jones@gmail.com', 'super_admin')
  ON CONFLICT (email) DO UPDATE
  SET role = 'super_admin', updated_at = NOW();
END $$;

-- Step 2: Update is_super_admin function with hardcoded fallback
-- This ensures these specific emails ALWAYS work, even if the table is empty
CREATE OR REPLACE FUNCTION public.is_super_admin(user_email text)
RETURNS boolean AS $$
BEGIN
  -- Hardcoded fallback for guaranteed super admin access
  -- These emails can ALWAYS access all features including searcher
  IF user_email IN ('baudonsamuel@gmail.com', 'sam7777jones@gmail.com') THEN
    RETURN TRUE;
  END IF;

  -- Standard table lookup for other admins
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE email = user_email
    AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create a helper function to check if user can be a searcher
-- This provides an explicit check that can be used anywhere in the app
CREATE OR REPLACE FUNCTION public.can_be_searcher(user_email text)
RETURNS boolean AS $$
BEGIN
  -- Super admins can always be searchers
  IF public.is_super_admin(user_email) THEN
    RETURN TRUE;
  END IF;

  -- For now (closed beta), only super admins can be searchers
  -- In the future, this can be expanded to check subscriptions, beta access, etc.
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_super_admin(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin(text) TO anon;
GRANT EXECUTE ON FUNCTION public.can_be_searcher(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_be_searcher(text) TO anon;

-- Add comments
COMMENT ON FUNCTION public.is_super_admin IS 'Checks if user is a super admin. Includes hardcoded fallback for baudonsamuel@gmail.com and sam7777jones@gmail.com';
COMMENT ON FUNCTION public.can_be_searcher IS 'Checks if user can access searcher features. Currently restricted to super admins during closed beta.';
