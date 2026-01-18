-- Update tracking for renamed migration
-- Old: 20260118 -> notifications_system
-- New: 20260118000000 -> notifications_system

-- Delete old entry
DELETE FROM supabase_migrations.schema_migrations
WHERE version = '20260118';

-- Insert new entry with full timestamp
INSERT INTO supabase_migrations.schema_migrations (version, name, statements)
VALUES ('20260118000000', 'notifications_system', ARRAY['-- Already applied']);

-- Verify count (should still be 80)
SELECT COUNT(*) as total_tracked_migrations
FROM supabase_migrations.schema_migrations;
