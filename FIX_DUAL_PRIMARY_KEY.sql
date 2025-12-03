-- ============================================
-- FIX: Dual Primary Key Issue on user_profiles
-- Remove PRIMARY KEY from 'id', keep only on 'user_id'
-- ============================================

-- Problem: Having PRIMARY KEY on both 'id' and 'user_id' can cause upsert issues
-- Solution: Keep PRIMARY KEY only on 'user_id', make 'id' a regular UNIQUE column

-- Step 1: Check current PRIMARY KEY constraints
SELECT
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints
WHERE table_name = 'user_profiles'
AND constraint_type = 'PRIMARY KEY';

-- Step 2: If there's a PRIMARY KEY on 'id', we need to handle it
-- First, check if we can drop it safely
DO $$
DECLARE
    has_id_pkey BOOLEAN;
    has_user_id_pkey BOOLEAN;
BEGIN
    -- Check if 'id' has PRIMARY KEY
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.constraint_column_usage ccu
        JOIN information_schema.table_constraints tc
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.table_name = 'user_profiles'
        AND tc.constraint_type = 'PRIMARY KEY'
        AND ccu.column_name = 'id'
    ) INTO has_id_pkey;

    -- Check if 'user_id' has PRIMARY KEY
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.constraint_column_usage ccu
        JOIN information_schema.table_constraints tc
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.table_name = 'user_profiles'
        AND tc.constraint_type = 'PRIMARY KEY'
        AND ccu.column_name = 'user_id'
    ) INTO has_user_id_pkey;

    RAISE NOTICE 'id has PRIMARY KEY: %', has_id_pkey;
    RAISE NOTICE 'user_id has PRIMARY KEY: %', has_user_id_pkey;

    -- If both have PRIMARY KEY, that's the problem!
    IF has_id_pkey AND has_user_id_pkey THEN
        RAISE WARNING '⚠️  PROBLEM: Both id and user_id have PRIMARY KEY constraints!';
        RAISE NOTICE '   This causes upsert conflicts. We need to remove one.';
    END IF;

    -- If only id has PRIMARY KEY (not user_id), we need to swap them
    IF has_id_pkey AND NOT has_user_id_pkey THEN
        RAISE WARNING '⚠️  PROBLEM: id has PRIMARY KEY but user_id does not!';
        RAISE NOTICE '   For upsert with onConflict: user_id, we need PRIMARY KEY on user_id';

        -- Drop PRIMARY KEY from id
        ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_pkey;

        -- Add UNIQUE constraint to id (to keep it unique)
        ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_id_unique UNIQUE (id);

        -- Add PRIMARY KEY to user_id
        ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (user_id);

        RAISE NOTICE '✅ FIXED: PRIMARY KEY moved from id to user_id';
    END IF;

    -- If user_id already has PRIMARY KEY, we're good
    IF has_user_id_pkey THEN
        RAISE NOTICE '✅ CORRECT: user_id has PRIMARY KEY (upsert will work)';
    END IF;
END $$;

-- Step 3: Verify the final state
SELECT
    'FINAL STATE' as section,
    tc.constraint_name,
    tc.constraint_type,
    array_agg(ccu.column_name) as columns
FROM information_schema.table_constraints tc
JOIN information_schema.constraint_column_usage ccu
  ON tc.constraint_name = ccu.constraint_name
WHERE tc.table_name = 'user_profiles'
AND tc.constraint_type IN ('PRIMARY KEY', 'UNIQUE')
GROUP BY tc.constraint_name, tc.constraint_type
ORDER BY tc.constraint_type, tc.constraint_name;
