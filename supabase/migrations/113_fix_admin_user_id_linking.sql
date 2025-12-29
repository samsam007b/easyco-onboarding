-- =====================================================
-- FIX: Link admin records to user accounts
-- =====================================================
-- This migration fixes admin records that have email but no user_id
-- by matching them with existing auth.users based on email
-- =====================================================

-- Update admins where user_id is NULL but email matches an auth.users record
UPDATE public.admins
SET user_id = u.id
FROM auth.users u
WHERE public.admins.email = u.email
AND public.admins.user_id IS NULL;

-- Log how many were updated (for debugging - view in Supabase logs)
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO updated_count
  FROM public.admins
  WHERE user_id IS NOT NULL;

  RAISE NOTICE 'Admin records with user_id linked: %', updated_count;
END $$;
