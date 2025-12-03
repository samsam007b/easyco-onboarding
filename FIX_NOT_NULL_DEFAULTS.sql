-- ============================================
-- FIX NOT NULL Constraints on user_profiles
-- Add DEFAULT values to avoid 400 errors on upsert
-- ============================================

-- This fixes the issue where upsert operations fail when NOT NULL columns
-- don't have values provided and don't have default values

-- Step 1: Check current NOT NULL constraints
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

-- Step 2: Add default values for common NOT NULL columns
-- Note: user_id is PRIMARY KEY so it's always required

-- If first_name is NOT NULL without default, add one
DO $$
BEGIN
    -- Check if first_name is NOT NULL and has no default
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'user_profiles'
        AND column_name = 'first_name'
        AND is_nullable = 'NO'
        AND column_default IS NULL
    ) THEN
        -- Make it nullable OR add default
        ALTER TABLE public.user_profiles ALTER COLUMN first_name DROP NOT NULL;
        RAISE NOTICE 'first_name is now nullable';
    END IF;
END $$;

-- Repeat for other common text columns
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'user_profiles'
        AND column_name = 'last_name'
        AND is_nullable = 'NO'
        AND column_default IS NULL
    ) THEN
        ALTER TABLE public.user_profiles ALTER COLUMN last_name DROP NOT NULL;
        RAISE NOTICE 'last_name is now nullable';
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'user_profiles'
        AND column_name = 'user_type'
        AND is_nullable = 'NO'
        AND column_default IS NULL
    ) THEN
        ALTER TABLE public.user_profiles ALTER COLUMN user_type SET DEFAULT 'searcher';
        RAISE NOTICE 'user_type now has default: searcher';
    END IF;
END $$;

-- Step 3: Verify the changes
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 4: Final notice
DO $$
BEGIN
    RAISE NOTICE '✅ NOT NULL constraints have been relaxed to allow partial upserts';
    RAISE NOTICE '📝 user_id remains NOT NULL (PRIMARY KEY)';
END $$;
