-- ============================================================================
-- VERIFY SECURITY FIX WAS APPLIED SUCCESSFULLY
-- ============================================================================
-- Run this to confirm the v_platform_metrics security issue is resolved
-- ============================================================================

-- Test 1: Check that old view is gone
SELECT
  'Test 1: Old view removed' as test_name,
  CASE
    WHEN COUNT(*) = 0 THEN '✓ PASS - View no longer exists'
    ELSE '✗ FAIL - View still exists!'
  END as result
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name = 'v_platform_metrics';

-- Test 2: Check that new functions exist
SELECT
  'Test 2: New functions created' as test_name,
  CASE
    WHEN COUNT(*) = 2 THEN '✓ PASS - Both functions exist'
    ELSE '✗ FAIL - Expected 2 functions, found ' || COUNT(*)
  END as result
FROM pg_proc p
WHERE p.proname IN ('get_platform_metrics', 'is_user_admin')
  AND p.pronamespace = 'public'::regnamespace;

-- Test 3: Verify security settings
SELECT
  'Test 3: Security settings' as test_name,
  p.proname as function_name,
  CASE p.proname
    WHEN 'get_platform_metrics' THEN
      CASE
        WHEN NOT p.prosecdef AND pg_get_functiondef(p.oid) LIKE '%SECURITY INVOKER%'
        THEN '✓ PASS - Correctly using SECURITY INVOKER'
        ELSE '✗ FAIL - Should use SECURITY INVOKER'
      END
    WHEN 'is_user_admin' THEN
      CASE
        WHEN p.prosecdef
        THEN '✓ PASS - Correctly using SECURITY DEFINER (limited scope)'
        ELSE '✗ FAIL - Should use SECURITY DEFINER'
      END
  END as security_check,
  p.prosecdef as is_security_definer
FROM pg_proc p
WHERE p.proname IN ('get_platform_metrics', 'is_user_admin')
  AND p.pronamespace = 'public'::regnamespace
ORDER BY p.proname;

-- Test 4: Check permissions
SELECT
  'Test 4: Function permissions' as test_name,
  p.proname as function_name,
  pg_catalog.array_to_string(p.proacl, ', ') as access_privileges,
  CASE
    WHEN p.proacl IS NOT NULL THEN '✓ PASS - Explicit permissions set'
    ELSE '⚠ WARNING - Using default permissions'
  END as permission_check
FROM pg_proc p
WHERE p.proname IN ('get_platform_metrics', 'is_user_admin')
  AND p.pronamespace = 'public'::regnamespace
ORDER BY p.proname;

-- Test 5: Function signature check
SELECT
  'Test 5: Function signatures' as test_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments,
  pg_catalog.format_type(p.prorettype, NULL) as return_type
FROM pg_proc p
WHERE p.proname IN ('get_platform_metrics', 'is_user_admin')
  AND p.pronamespace = 'public'::regnamespace
ORDER BY p.proname;

-- ============================================================================
-- SUMMARY
-- ============================================================================
SELECT
  '====== SECURITY FIX VERIFICATION SUMMARY ======' as summary,
  CASE
    WHEN (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'v_platform_metrics') = 0
     AND (SELECT COUNT(*) FROM pg_proc WHERE proname IN ('get_platform_metrics', 'is_user_admin') AND pronamespace = 'public'::regnamespace) = 2
    THEN '✓✓✓ ALL CHECKS PASSED - Security fix successfully applied! ✓✓✓'
    ELSE '✗✗✗ SOME CHECKS FAILED - Please review results above ✗✗✗'
  END as status;

-- ============================================================================
-- FUNCTIONAL TEST (Optional - only works if you're an admin)
-- ============================================================================
-- Uncomment below to test the actual function call:

-- SELECT * FROM get_platform_metrics();
--
-- Expected results:
-- - If you're an admin: Should return metrics data
-- - If you're not an admin: ERROR: Access denied. Only administrators can view platform metrics.
