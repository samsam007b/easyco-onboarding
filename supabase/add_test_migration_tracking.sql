-- Add tracking for test migration 20260118132945
INSERT INTO supabase_migrations.schema_migrations (version, name, statements)
VALUES ('20260118132945', 'test_auto_push', ARRAY['-- Test migration'])
ON CONFLICT (version) DO NOTHING;

-- Verify
SELECT COUNT(*) as total_tracked_migrations
FROM supabase_migrations.schema_migrations;
