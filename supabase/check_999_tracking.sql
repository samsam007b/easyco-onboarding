-- Check all 999 entries in remote tracking
SELECT version, name, statements[1] as first_statement
FROM supabase_migrations.schema_migrations
WHERE version = '999'
ORDER BY name;
