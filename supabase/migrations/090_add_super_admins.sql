-- =====================================================
-- ADD SUPER ADMINS FOR CLOSED BETA TESTING
-- =====================================================
-- Add baudonsamuel@gmail.com and sam7777jones@gmail.com as super admins
-- These accounts have full access to all features, including Searcher routes
-- =====================================================

-- Insert baudonsamuel@gmail.com as super admin
INSERT INTO public.admins (email, role, created_by)
SELECT
  'baudonsamuel@gmail.com',
  'super_admin',
  id
FROM auth.users
WHERE email = 'baudonsamuel@gmail.com'
ON CONFLICT (email) DO UPDATE
SET role = 'super_admin', updated_at = NOW();

-- Insert sam7777jones@gmail.com as super admin
INSERT INTO public.admins (email, role, created_by)
SELECT
  'sam7777jones@gmail.com',
  'super_admin',
  id
FROM auth.users
WHERE email = 'sam7777jones@gmail.com'
ON CONFLICT (email) DO UPDATE
SET role = 'super_admin', updated_at = NOW();

-- If users don't exist yet, insert placeholder records
-- These will be updated when users actually sign up
INSERT INTO public.admins (email, role)
VALUES
  ('baudonsamuel@gmail.com', 'super_admin'),
  ('sam7777jones@gmail.com', 'super_admin')
ON CONFLICT (email) DO UPDATE
SET role = 'super_admin', updated_at = NOW();

COMMENT ON TABLE public.admins IS 'Super admins: baudonsamuel@gmail.com, sam7777jones@gmail.com - Full access including Searcher features for testing';
