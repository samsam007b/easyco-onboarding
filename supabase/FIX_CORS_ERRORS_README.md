# Fix CORS and RLS Errors - Instructions

## Problem
The application is showing these errors in the console:
```
Fetch API cannot load https://fgthoyilfupywmpmiuwd.supabase.co/rest/v1/notifications due to access control checks
Error loading notifications
Failed to load resource: the server responded with a status of 400 (user_profiles)
Failed to load resource: the server responded with a status of 406 (group_members)
```

## Root Cause
These errors occur because:
1. **RLS Policies are missing or misconfigured** on the `notifications`, `user_profiles`, and `group_members` tables
2. **CORS errors appear** when the browser can't complete the request due to permission issues
3. The tables exist but authenticated users don't have proper SELECT permissions

## Solution

### Step 1: Run Diagnostic (Optional but Recommended)
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to: **SQL Editor**
3. Open the file: `supabase/DIAGNOSTIC_RLS_STATUS.sql`
4. Copy all content and paste into SQL Editor
5. Click **Run** to see current state of your tables and policies

This will show you:
- Which tables exist
- Whether RLS is enabled
- What policies are currently active
- What permissions are granted

### Step 2: Apply the Fix
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to: **SQL Editor**
3. Open the file: `supabase/migrations/029_fix_cors_and_rls_notifications.sql`
4. Copy all content and paste into SQL Editor
5. Click **Run** to apply all fixes

This migration will:
- **Drop all existing RLS policies** on the three tables (clean slate)
- **Create comprehensive new policies** that properly allow:
  - Users to view their own notifications
  - Users to mark notifications as read
  - Users to delete their notifications
  - Users to view all user profiles (needed for matching)
  - Users to manage their own profile
  - Users to view and manage group memberships
- **Grant necessary permissions** to authenticated users
- **Keep service_role permissions** for backend operations

### Step 3: Verify the Fix
1. **Reload your application** (hard refresh: Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
2. **Open Developer Console** (F12 or Right-click → Inspect)
3. **Check for errors**:
   - ✅ No more "Fetch API cannot load" errors
   - ✅ No more 400/406 errors
   - ✅ Notifications dropdown works
   - ✅ Dashboard loads without errors

### Step 4: Test Functionality
Test these features to confirm everything works:
- [ ] Click the bell icon (notifications) - should open without errors
- [ ] Navigate to different dashboards (owner/searcher/resident)
- [ ] Check group management features
- [ ] Verify profile editing works

## Expected Results

### Before Fix:
```javascript
[Error] Fetch API cannot load https://...supabase.co/rest/v1/notifications due to access control checks
[Error] Error loading notifications: {message: "TypeError: Load failed", ...}
[Error] Failed to load resource: status of 400 (user_profiles)
[Error] Failed to load resource: status of 406 (group_members)
```

### After Fix:
```javascript
✅ No CORS errors
✅ No 400/406 errors
✅ Notifications load successfully
✅ User profiles accessible
✅ Group members accessible
```

## Technical Details

### What Changed

#### Notifications Table:
- **Before**: Had conflicting policies or missing SELECT policy
- **After**: Clean policies allowing users to SELECT/UPDATE/DELETE their own notifications

#### User Profiles Table:
- **Before**: Overly restrictive policies preventing profile viewing
- **After**: Allows all authenticated users to view profiles (needed for matching algorithm)

#### Group Members Table:
- **Before**: Missing or restrictive policies
- **After**: Allows users to view/manage members of groups they belong to

### Policy Summary

**notifications**:
- `notifications_select_own`: Users can SELECT their notifications
- `notifications_insert_own`: Users can INSERT notifications for themselves
- `notifications_update_own`: Users can UPDATE (mark as read) their notifications
- `notifications_delete_own`: Users can DELETE their notifications
- `notifications_insert_service`: Service role can INSERT any notification (for triggers)

**user_profiles**:
- `user_profiles_select_own`: Users can SELECT their own profile
- `user_profiles_select_public`: Users can SELECT all profiles (for matching)
- `user_profiles_insert_own`: Users can INSERT their profile
- `user_profiles_update_own`: Users can UPDATE their profile
- `user_profiles_delete_own`: Users can DELETE their profile

**group_members**:
- `group_members_select_own_groups`: Users can SELECT members of groups they're in
- `group_members_insert_by_creator`: Group creators can INSERT members
- `group_members_update_by_creator_or_self`: Creators and members can UPDATE
- `group_members_delete_by_creator_or_self`: Creators and members can DELETE

## Troubleshooting

### If errors persist after applying the fix:

1. **Clear browser cache**:
   - Chrome: Cmd/Ctrl + Shift + Delete → Clear cached images and files
   - Or open in Incognito/Private mode

2. **Check Supabase migration was successful**:
   - Go to SQL Editor
   - Run: `SELECT * FROM pg_policies WHERE tablename IN ('notifications', 'user_profiles', 'group_members');`
   - You should see all the new policies listed

3. **Verify RLS is enabled**:
   ```sql
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'public'
   AND tablename IN ('notifications', 'user_profiles', 'group_members');
   ```
   All should show `rowsecurity = true`

4. **Check your Supabase environment variables**:
   - Verify `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Restart your dev server after any env changes

### Still having issues?

Run the diagnostic script again:
```sql
-- Copy content from: supabase/DIAGNOSTIC_RLS_STATUS.sql
-- Paste and run in Supabase SQL Editor
-- Compare "Before" and "After" results
```

## Prevention

To prevent these issues in the future:

1. **Always test RLS policies** after creating tables
2. **Use the diagnostic script** when adding new tables
3. **Follow the policy naming convention**: `{table}_{action}_{scope}`
4. **Document policies** with COMMENT statements
5. **Grant explicit permissions** to authenticated role

## References

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Policy Documentation](https://www.postgresql.org/docs/current/sql-createpolicy.html)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
