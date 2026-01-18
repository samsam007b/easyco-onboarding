-- Check for duplicate version entries in remote tracking
SELECT version, name, COUNT(*) as count
FROM supabase_migrations.schema_migrations
GROUP BY version, name
HAVING COUNT(*) > 1;

-- Show all 999 entries
SELECT version, name, statements[1] as first_statement
FROM supabase_migrations.schema_migrations
WHERE version = '999'
ORDER BY name;

-- Show all 20260118 entries
SELECT version, name, statements[1] as first_statement
FROM supabase_migrations.schema_migrations
WHERE version = '20260118'
ORDER BY name;
