-- ============================================================================
-- STANDALONE SECURITY FIX FOR v_platform_metrics VIEW
-- ============================================================================
-- Execute this directly in Supabase SQL Editor to apply the security fix
-- without running all pending migrations
-- ============================================================================

BEGIN;

-- Step 1: Drop the existing view
DROP VIEW IF EXISTS public.v_platform_metrics CASCADE;

-- Step 2: Create a helper function to check if user is admin
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
REVOKE ALL ON FUNCTION public.get_platform_metrics() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_platform_metrics() TO authenticated;

-- Step 5: Add comments
COMMENT ON FUNCTION public.get_platform_metrics() IS
'Returns platform-wide metrics. Requires admin privileges. Use: SELECT * FROM get_platform_metrics();';

COMMENT ON FUNCTION public.is_user_admin() IS
'Helper function to check if the current authenticated user is an admin.';

COMMIT;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify the functions were created successfully
SELECT
  p.proname as function_name,
  p.prosecdef as is_security_definer,
  CASE WHEN pg_get_functiondef(p.oid) LIKE '%SECURITY INVOKER%' THEN true ELSE false END as has_security_invoker,
  pg_catalog.array_to_string(p.proacl, E', ') as access_privileges
FROM pg_proc p
WHERE p.proname IN ('get_platform_metrics', 'is_user_admin')
ORDER BY p.proname;

-- Expected results:
-- get_platform_metrics: is_security_definer = false, has_security_invoker = true
-- is_user_admin: is_security_definer = true, has_security_invoker = false
