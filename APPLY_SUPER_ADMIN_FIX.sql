-- =====================================================
-- QUICK FIX: Super Admin Searcher Access
-- Run this SQL in Supabase SQL Editor to apply immediately
-- =====================================================

-- Insert/update super admin entries
INSERT INTO public.admins (email, role)
VALUES ('baudonsamuel@gmail.com', 'super_admin')
ON CONFLICT (email) DO UPDATE
SET role = 'super_admin', updated_at = NOW();

INSERT INTO public.admins (email, role)
VALUES ('sam7777jones@gmail.com', 'super_admin')
ON CONFLICT (email) DO UPDATE
SET role = 'super_admin', updated_at = NOW();

-- Update is_super_admin function with hardcoded fallback
CREATE OR REPLACE FUNCTION public.is_super_admin(user_email text)
RETURNS boolean AS $$
BEGIN
  -- Hardcoded fallback for guaranteed super admin access
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

-- Create helper function for searcher access check
CREATE OR REPLACE FUNCTION public.can_be_searcher(user_email text)
RETURNS boolean AS $$
BEGIN
  IF public.is_super_admin(user_email) THEN
    RETURN TRUE;
  END IF;
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.is_super_admin(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin(text) TO anon;
GRANT EXECUTE ON FUNCTION public.can_be_searcher(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_be_searcher(text) TO anon;

-- Verify it works
SELECT
  'baudonsamuel@gmail.com' as email,
  public.is_super_admin('baudonsamuel@gmail.com') as is_super_admin,
  public.can_be_searcher('baudonsamuel@gmail.com') as can_be_searcher
UNION ALL
SELECT
  'sam7777jones@gmail.com',
  public.is_super_admin('sam7777jones@gmail.com'),
  public.can_be_searcher('sam7777jones@gmail.com')
UNION ALL
SELECT
  'random@test.com',
  public.is_super_admin('random@test.com'),
  public.can_be_searcher('random@test.com');
