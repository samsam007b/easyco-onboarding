-- Check if the view exists and get its definition
SELECT
  'View exists:' as check,
  EXISTS (
    SELECT 1 FROM information_schema.views
    WHERE table_schema = 'public' AND table_name = 'v_complete_user_profiles'
  ) as exists;

-- Get the actual view definition if it exists
SELECT
  'Current view definition:' as info,
  definition
FROM pg_views
WHERE schemaname = 'public' AND viewname = 'v_complete_user_profiles';

-- Check if any views are using SECURITY DEFINER
SELECT
  viewname,
  viewowner,
  definition
FROM pg_views
WHERE schemaname = 'public'
  AND viewname LIKE '%profile%';
