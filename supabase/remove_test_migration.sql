-- Remove test migration from tracking
DELETE FROM supabase_migrations.schema_migrations
WHERE version = '20260118132945';

-- Verify count (should be 80 now)
SELECT COUNT(*) as total_tracked_migrations
FROM supabase_migrations.schema_migrations;
