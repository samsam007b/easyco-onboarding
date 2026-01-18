-- ============================================================================
-- FINAL REPAIR - Fix 20260118 conflict
-- ============================================================================
-- Problem: Remote has 20260118 with different name than local file
-- Solution: Update remote tracking to match local filename

-- Step 1: Check current state
SELECT version, name, 'CURRENT (will be updated)' as status
FROM supabase_migrations.schema_migrations
WHERE version = '20260118';

-- Step 2: Delete old tracking entry for 20260118
DELETE FROM supabase_migrations.schema_migrations
WHERE version = '20260118';

-- Step 3: Insert correct tracking for our local file
INSERT INTO supabase_migrations.schema_migrations (version, name, statements)
VALUES ('20260118', 'notifications_system', ARRAY['-- Already applied in production']);

-- Step 4: Verify
SELECT version, name, 'NEW (updated)' as status
FROM supabase_migrations.schema_migrations
WHERE version = '20260118';

-- Step 5: Count total (should be 81 now)
SELECT COUNT(*) as total_tracked_migrations
FROM supabase_migrations.schema_migrations;
