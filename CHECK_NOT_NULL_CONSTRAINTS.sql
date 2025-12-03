-- Check which columns have NOT NULL constraints
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
AND table_schema = 'public'
AND is_nullable = 'NO'
ORDER BY ordinal_position;
