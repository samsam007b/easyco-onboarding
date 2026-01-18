-- Check what's tracked for version 20260118
SELECT version, name, statements
FROM supabase_migrations.schema_migrations
WHERE version = '20260118';
