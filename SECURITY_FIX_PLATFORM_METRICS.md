# Security Fixes: SECURITY DEFINER Views

## Issue Summary

Supabase's security linter flagged **TWO views** as being defined with `SECURITY DEFINER` property, which poses serious security risks:

1. **`v_platform_metrics`** - Platform-wide aggregated statistics
2. **`v_complete_user_profiles`** - Complete user profile data with joins

### What is SECURITY DEFINER?

When a view or function is created with `SECURITY DEFINER`, it executes with the privileges of its **owner/creator** rather than the **current user**. This means:

- The view bypasses Row Level Security (RLS) policies
- Any user can see data they shouldn't have access to
- Potential privilege escalation vulnerability

## The Vulnerability

### Original View Definition
Located in: [supabase/migrations/002_complete_schema_phase1.sql:502-511](supabase/migrations/002_complete_schema_phase1.sql#L502-L511)

```sql
CREATE OR REPLACE VIEW public.v_platform_metrics AS
SELECT
  COUNT(DISTINCT u.id) FILTER (WHERE u.user_type = 'searcher' AND u.account_status = 'active') as active_searchers,
  COUNT(DISTINCT u.id) FILTER (WHERE u.user_type = 'owner' AND u.account_status = 'active') as active_owners,
  COUNT(DISTINCT u.id) FILTER (WHERE u.user_type = 'resident' AND u.account_status = 'active') as active_residents,
  COUNT(DISTINCT u.id) FILTER (WHERE u.onboarding_completed = TRUE) as completed_onboarding,
  AVG(u.profile_completion_score) FILTER (WHERE u.profile_completion_score > 0) as avg_completion_score,
  COUNT(DISTINCT uv.user_id) FILTER (WHERE uv.kyc_status = 'verified') as verified_users
FROM public.users u
LEFT JOIN public.user_verifications uv ON u.id = uv.user_id;
```

### Why This is a Problem

1. **RLS Bypass**: The `users` table has RLS enabled with policies that only allow users to view their own data:
   ```sql
   CREATE POLICY "Users can view own data"
     ON public.users FOR SELECT
     USING (auth.uid() = id);
   ```

2. **Data Exposure**: When the view runs with `SECURITY DEFINER`, it bypasses this RLS policy, allowing ANY authenticated user to see aggregated statistics across ALL users.

3. **Privacy Violation**: Regular users could see:
   - Total number of active searchers, owners, residents
   - Platform-wide verification statistics
   - Average completion scores across all users

## The Fix

### Migration: `034_fix_platform_metrics_security.sql`

The fix implements a secure, admin-only access pattern:

#### 1. Remove the Vulnerable View
```sql
DROP VIEW IF EXISTS public.v_platform_metrics CASCADE;
```

#### 2. Create Admin Check Function
```sql
CREATE OR REPLACE FUNCTION public.is_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Why SECURITY DEFINER here is safe:**
- Very minimal function with single purpose
- Only returns boolean, no data leakage
- Explicitly scoped to check admin status
- Required to access admins table which may have RLS

#### 3. Create Secure Metrics Function
```sql
CREATE OR REPLACE FUNCTION public.get_platform_metrics()
RETURNS TABLE (...)
LANGUAGE plpgsql
SECURITY INVOKER  -- Key: runs with CALLER's privileges
AS $$
BEGIN
  -- Fail fast if not admin
  IF NOT public.is_user_admin() THEN
    RAISE EXCEPTION 'Access denied. Only administrators can view platform metrics.';
  END IF;

  -- Return metrics only if authorized
  RETURN QUERY SELECT ...;
END;
$$;
```

**Key Security Features:**
- `SECURITY INVOKER`: Runs with caller's privileges (not definer's)
- Explicit admin check before ANY data is returned
- Fails with clear error message for non-admins
- No data leakage in error messages

#### 4. Restrict Permissions
```sql
REVOKE ALL ON FUNCTION public.get_platform_metrics() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_platform_metrics() TO authenticated;
```

## Applying the Fix

### Option 1: Push Migration (Recommended)
```bash
supabase db push
```

### Option 2: Manual SQL Execution
Execute the migration file directly in your Supabase SQL editor or via psql.

## Testing the Fix

### Test 1: Non-Admin User (Should Fail)
```sql
-- Login as a regular user
SELECT * FROM get_platform_metrics();
-- Expected: ERROR: Access denied. Only administrators can view platform metrics.
```

### Test 2: Admin User (Should Succeed)
```sql
-- Login as an admin user (exists in public.admins table)
SELECT * FROM get_platform_metrics();
-- Expected: Returns metrics successfully
```

### Test 3: Verify Security Settings
```sql
-- Check function security mode
SELECT
  p.proname as function_name,
  p.prosecdef as is_security_definer,
  pg_get_functiondef(p.oid) LIKE '%SECURITY INVOKER%' as has_security_invoker
FROM pg_proc p
WHERE p.proname = 'get_platform_metrics';

-- Expected for get_platform_metrics:
-- is_security_definer: false
-- has_security_invoker: true
```

## Application Code Changes Required

### Before (Vulnerable)
```typescript
// Old code that used the view
const { data } = await supabase
  .from('v_platform_metrics')
  .select('*')
  .single();
```

### After (Secure)
```typescript
// New code that uses the function
const { data, error } = await supabase
  .rpc('get_platform_metrics');

if (error) {
  // Non-admins will receive error here
  console.error('Access denied:', error.message);
}
```

## Additional Recommendations

### 1. Audit Other Views and Functions
Search for other `SECURITY DEFINER` usage:
```sql
SELECT
  p.proname,
  p.prosecdef as is_security_definer,
  pg_get_functiondef(p.oid)
FROM pg_proc p
WHERE p.prosecdef = true
  AND p.pronamespace = 'public'::regnamespace;
```

### 2. Regular Security Reviews
- Schedule quarterly reviews of RLS policies
- Use Supabase's built-in security linter
- Test with different user roles

### 3. Principle of Least Privilege
- Only use `SECURITY DEFINER` when absolutely necessary
- Keep `SECURITY DEFINER` functions minimal and audited
- Always validate caller identity explicitly
- Document why elevated privileges are needed

## References

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL SECURITY DEFINER Documentation](https://www.postgresql.org/docs/current/sql-createfunction.html)
- [OWASP Access Control](https://owasp.org/www-project-top-ten/2017/A5_2017-Broken_Access_Control)

---

## Fix #2: v_complete_user_profiles View

### The Vulnerability

Located in: [supabase/migrations/002_complete_schema_phase1.sql](supabase/migrations/002_complete_schema_phase1.sql)

```sql
CREATE OR REPLACE VIEW public.v_complete_user_profiles AS
SELECT
  u.id, u.email, u.user_type, u.account_status,
  up.*, -- All profile fields
  uv.kyc_status, uv.id_verified, -- Verification data
  uc.terms_accepted, uc.privacy_accepted -- Consent data
FROM public.users u
LEFT JOIN public.user_profiles up ON u.id = up.user_id
LEFT JOIN public.user_verifications uv ON u.id = uv.user_id
LEFT JOIN public.user_consents uc ON u.id = uc.user_id;
```

### Critical Privacy Issue

This view exposes **highly sensitive personal data**:
- Full user profiles (name, DOB, nationality, income, etc.)
- KYC verification status and documents
- Banking information (IBAN, BIC/SWIFT)
- Privacy consents and preferences
- Contact information

**When run with SECURITY DEFINER**: Any authenticated user could see **ALL users'** complete profiles, verification status, and personal data!

### The Fix

**Migration**: [035_fix_complete_user_profiles_security.sql](supabase/migrations/035_fix_complete_user_profiles_security.sql)
**Standalone**: [APPLY_COMPLETE_PROFILES_FIX.sql](supabase/APPLY_COMPLETE_PROFILES_FIX.sql)

**Strategy**: Simply remove `SECURITY DEFINER` and let RLS policies handle access control.

```sql
-- Drop and recreate WITHOUT SECURITY DEFINER
DROP VIEW IF EXISTS public.v_complete_user_profiles CASCADE;

CREATE OR REPLACE VIEW public.v_complete_user_profiles AS
SELECT ... -- Same query
FROM public.users u
LEFT JOIN public.user_profiles up ON u.id = up.user_id
LEFT JOIN public.user_verifications uv ON u.id = uv.user_id
LEFT JOIN public.user_consents uc ON u.id = uc.user_id;
-- No SECURITY DEFINER = runs with caller's privileges
```

### How RLS Protects This View

Existing RLS policies on underlying tables:

```sql
-- users table
CREATE POLICY "Users can view own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- user_profiles table
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- user_verifications table
CREATE POLICY "Users can view own verifications"
  ON public.user_verifications FOR SELECT
  USING (auth.uid() = user_id);

-- user_consents table
CREATE POLICY "Users can view own consents"
  ON public.user_consents FOR SELECT
  USING (auth.uid() = user_id);
```

**Result**: When User A queries the view, they only see their own data. The JOINs naturally filter based on RLS policies.

### Applying Fix #2

#### Option A: Via Supabase Dashboard (Immediate)
1. Go to Supabase Dashboard → SQL Editor
2. Open [supabase/APPLY_COMPLETE_PROFILES_FIX.sql](supabase/APPLY_COMPLETE_PROFILES_FIX.sql)
3. Copy and paste into SQL Editor
4. Run

#### Option B: Via Migration (when conflicts resolved)
```bash
supabase db push
```

### Testing

```sql
-- As User A (should only see their own profile)
SELECT * FROM v_complete_user_profiles;

-- Should return: 1 row (User A's profile only)
-- Should NOT see: User B, User C, or any other user's data
```

### Application Impact

**Good news**: View isn't used in application code yet.
**Usage**: Continue using `v_complete_user_profiles` in queries - RLS will automatically filter to current user's data.

```typescript
// Existing code pattern (if used)
const { data } = await supabase
  .from('v_complete_user_profiles')
  .select('*')
  .single(); // Will only return current user's profile due to RLS
```

---

## Status

### v_platform_metrics (Fix #1)
- [x] Vulnerability identified
- [x] Fix implemented in migration 034
- [x] Standalone SQL created
- [x] Applied via SQL Editor
- [x] Verified
- [ ] Application code updated (not needed - view not used yet)

### v_complete_user_profiles (Fix #2)
- [x] Vulnerability identified
- [x] Fix implemented in migration 035
- [x] Standalone SQL created
- [ ] Applied to database ⚠️
- [ ] Testing completed
- [ ] Deployed to production
