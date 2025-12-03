-- ============================================
-- FIX user_profiles UPSERT CONSTRAINT
-- This fixes the 400 error on upsert operations
-- ============================================

-- Step 1: Check if user_id unique constraint exists
DO $$
BEGIN
    -- Drop existing constraint if it exists (to recreate it properly)
    ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_key;
    ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_pkey;

    RAISE NOTICE 'Existing constraints dropped';
END $$;

-- Step 2: Add primary key constraint on user_id
-- This makes user_id unique and allows upsert with on_conflict
ALTER TABLE public.user_profiles
ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (user_id);

-- Step 3: Verify the constraint was created
DO $$
DECLARE
    constraint_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_name = 'user_profiles'
        AND constraint_type = 'PRIMARY KEY'
        AND constraint_name = 'user_profiles_pkey'
    ) INTO constraint_exists;

    IF constraint_exists THEN
        RAISE NOTICE '✅ SUCCESS: Primary key constraint created on user_id';
    ELSE
        RAISE WARNING '⚠️  WARNING: Primary key constraint not found';
    END IF;
END $$;

-- Step 4: Ensure RLS is still enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 5: Display table info
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
AND table_schema = 'public'
ORDER BY ordinal_position;
