-- ============================================================================
-- FIX SECURITY DEFINER VULNERABILITY IN v_platform_metrics VIEW
-- ============================================================================
-- Security Issue: View v_platform_metrics may be running with SECURITY DEFINER
-- which bypasses RLS policies and exposes aggregated user data to all users.
--
-- Fix Strategy:
-- 1. Drop the existing view completely
-- 2. Create a SECURITY INVOKER function that requires admin privileges
-- 3. Ensure only admins (or a specific admin role) can execute the function
-- 4. Add explicit checks to prevent unauthorized access
-- ============================================================================

-- Step 1: Drop the existing view
DROP VIEW IF EXISTS public.v_platform_metrics CASCADE;

-- Step 2: Create a helper function to check if user is admin
-- This function checks if the current user has admin privileges
CREATE OR REPLACE FUNCTION public.is_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user exists in admins table
  -- Note: Uses SECURITY DEFINER to access admins table which may have RLS
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Revoke public access and grant only to authenticated users
REVOKE ALL ON FUNCTION public.is_user_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_user_admin() TO authenticated;

-- Step 3: Create a SECURITY INVOKER function to get platform metrics
-- This function explicitly checks admin privileges before returning data
CREATE OR REPLACE FUNCTION public.get_platform_metrics()
RETURNS TABLE (
  active_searchers BIGINT,
  active_owners BIGINT,
  active_residents BIGINT,
  completed_onboarding BIGINT,
  avg_completion_score NUMERIC,
  verified_users BIGINT
)
LANGUAGE plpgsql
SECURITY INVOKER  -- Runs with caller's privileges, not definer's
AS $$
BEGIN
  -- Explicit admin check - fail fast if not admin
  IF NOT public.is_user_admin() THEN
    RAISE EXCEPTION 'Access denied. Only administrators can view platform metrics.'
      USING HINT = 'Contact your system administrator for access.';
  END IF;

  -- Return the metrics - this only executes if user is admin
  RETURN QUERY
  SELECT
    COUNT(DISTINCT u.id) FILTER (WHERE u.user_type = 'searcher' AND u.account_status = 'active')::BIGINT as active_searchers,
    COUNT(DISTINCT u.id) FILTER (WHERE u.user_type = 'owner' AND u.account_status = 'active')::BIGINT as active_owners,
    COUNT(DISTINCT u.id) FILTER (WHERE u.user_type = 'resident' AND u.account_status = 'active')::BIGINT as active_residents,
    COUNT(DISTINCT u.id) FILTER (WHERE u.onboarding_completed = TRUE)::BIGINT as completed_onboarding,
    AVG(u.profile_completion_score) FILTER (WHERE u.profile_completion_score > 0) as avg_completion_score,
    COUNT(DISTINCT uv.user_id) FILTER (WHERE uv.kyc_status = 'verified')::BIGINT as verified_users
  FROM public.users u
  LEFT JOIN public.user_verifications uv ON u.id = uv.user_id;
END;
$$;

-- Step 4: Set appropriate permissions on the function
-- Revoke from public and anon, grant only to authenticated users
REVOKE ALL ON FUNCTION public.get_platform_metrics() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_platform_metrics() TO authenticated;

-- Step 5: Add comment for documentation
COMMENT ON FUNCTION public.get_platform_metrics() IS
'Returns platform-wide metrics. Requires admin privileges. Use: SELECT * FROM get_platform_metrics();';

COMMENT ON FUNCTION public.is_user_admin() IS
'Helper function to check if the current authenticated user is an admin.';

-- ============================================================================
-- ALTERNATIVE: If you need a view for backwards compatibility
-- ============================================================================
-- This view wraps the function but still enforces admin checks
-- Uncomment if your application code expects a view instead of a function

-- CREATE OR REPLACE VIEW public.v_platform_metrics
-- WITH (security_invoker = true)  -- PostgreSQL 15+ only
-- AS
-- SELECT * FROM public.get_platform_metrics();

-- For PostgreSQL < 15, use this instead:
-- CREATE OR REPLACE VIEW public.v_platform_metrics AS
-- SELECT * FROM public.get_platform_metrics();

-- Enable RLS on the view (PostgreSQL 15+)
-- ALTER VIEW public.v_platform_metrics SET (security_invoker = true);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Test 1: Verify the function exists and has correct security
SELECT
  p.proname as function_name,
  p.prosecdef as is_security_definer,
  pg_get_function_identity_arguments(p.oid) as arguments,
  pg_get_functiondef(p.oid) LIKE '%SECURITY INVOKER%' as has_security_invoker
FROM pg_proc p
WHERE p.proname IN ('get_platform_metrics', 'is_user_admin')
ORDER BY p.proname;

-- Test 2: Verify permissions
SELECT
  p.proname,
  pg_catalog.array_to_string(p.proacl, E'\n') as access_privileges
FROM pg_proc p
WHERE p.proname IN ('get_platform_metrics', 'is_user_admin')
ORDER BY p.proname;

-- Test 3: Check if old view still exists (should return 0 rows)
SELECT COUNT(*) as old_view_exists
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name = 'v_platform_metrics';

-- ============================================================================
-- USAGE INSTRUCTIONS
-- ============================================================================
--
-- For application code:
-- Instead of: SELECT * FROM v_platform_metrics;
-- Use:        SELECT * FROM get_platform_metrics();
--
-- The function will:
-- 1. Check if the calling user is an admin
-- 2. Return metrics if authorized
-- 3. Raise an exception if unauthorized
--
-- Non-admin users will receive:
-- ERROR: Access denied. Only administrators can view platform metrics.
-- ============================================================================
