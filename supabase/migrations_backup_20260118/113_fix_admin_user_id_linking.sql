-- =====================================================
-- FIX: Link admin records to user accounts
-- =====================================================
-- This migration fixes admin records that have email but no user_id
-- by matching them with existing auth.users based on email (case-insensitive)
-- =====================================================

-- Update admins where user_id is NULL but email matches an auth.users record (case-insensitive)
UPDATE public.admins
SET user_id = u.id
FROM auth.users u
WHERE LOWER(public.admins.email) = LOWER(u.email)
AND public.admins.user_id IS NULL;

-- Also handle the reverse case: if admin email is different but user_id matches auth.users
-- This ensures consistency
UPDATE public.admins a
SET email = u.email
FROM auth.users u
WHERE a.user_id = u.id
AND LOWER(a.email) != LOWER(u.email);

-- Log results
DO $$
DECLARE
  total_admins INTEGER;
  linked_admins INTEGER;
  unlinked_admins INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_admins FROM public.admins;
  SELECT COUNT(*) INTO linked_admins FROM public.admins WHERE user_id IS NOT NULL;
  unlinked_admins := total_admins - linked_admins;

  RAISE NOTICE 'Total admin records: %', total_admins;
  RAISE NOTICE 'Linked (with user_id): %', linked_admins;
  RAISE NOTICE 'Unlinked (user_id NULL): %', unlinked_admins;
END $$;

-- Show unlinked admins for debugging
DO $$
DECLARE
  admin_record RECORD;
BEGIN
  FOR admin_record IN
    SELECT email, role FROM public.admins WHERE user_id IS NULL
  LOOP
    RAISE NOTICE 'Unlinked admin: % (role: %)', admin_record.email, admin_record.role;
  END LOOP;
END $$;
