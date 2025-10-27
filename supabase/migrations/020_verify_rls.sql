-- ============================================================================
-- VERIFICATION QUERY: Check RLS Status
-- Run this after executing migrations 018 and 019
-- ============================================================================

-- This will show you which tables have RLS enabled and how many policies each has
SELECT * FROM test_rls_policies();

-- Expected output:
-- table_name       | rls_enabled | policy_count
-- -----------------+-------------+-------------
-- applications     | true        | 5
-- conversations    | true        | 3
-- favorites        | true        | 3
-- messages         | true        | 3
-- notifications    | true        | 4
-- properties       | true        | 4
-- user_profiles    | true        | 3
-- users            | true        | 2

-- If you see rls_enabled = false or policy_count = 0, the table is not protected
