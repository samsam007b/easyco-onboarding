-- ============================================
-- CHECK si les colonnes JSONB existent
-- ============================================

-- Vérifier les colonnes JSONB utilisées par l'API
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
AND table_schema = 'public'
AND column_name IN (
    'extended_personality',
    'financial_info',
    'community_preferences',
    'advanced_preferences',
    'profile_data'
)
ORDER BY column_name;

-- Si ces colonnes n'existent pas, on doit les créer
-- Ajoutons-les si manquantes

DO $$
BEGIN
    -- extended_personality
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles'
        AND column_name = 'extended_personality'
    ) THEN
        ALTER TABLE public.user_profiles
        ADD COLUMN extended_personality JSONB DEFAULT NULL;
        RAISE NOTICE '✅ Added column: extended_personality';
    ELSE
        RAISE NOTICE '✓ Column exists: extended_personality';
    END IF;

    -- financial_info
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles'
        AND column_name = 'financial_info'
    ) THEN
        ALTER TABLE public.user_profiles
        ADD COLUMN financial_info JSONB DEFAULT NULL;
        RAISE NOTICE '✅ Added column: financial_info';
    ELSE
        RAISE NOTICE '✓ Column exists: financial_info';
    END IF;

    -- community_preferences
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles'
        AND column_name = 'community_preferences'
    ) THEN
        ALTER TABLE public.user_profiles
        ADD COLUMN community_preferences JSONB DEFAULT NULL;
        RAISE NOTICE '✅ Added column: community_preferences';
    ELSE
        RAISE NOTICE '✓ Column exists: community_preferences';
    END IF;

    -- advanced_preferences
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles'
        AND column_name = 'advanced_preferences'
    ) THEN
        ALTER TABLE public.user_profiles
        ADD COLUMN advanced_preferences JSONB DEFAULT NULL;
        RAISE NOTICE '✅ Added column: advanced_preferences';
    ELSE
        RAISE NOTICE '✓ Column exists: advanced_preferences';
    END IF;
END $$;

-- Vérifier à nouveau après ajout
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
AND table_schema = 'public'
AND column_name IN (
    'extended_personality',
    'financial_info',
    'community_preferences',
    'advanced_preferences',
    'profile_data'
)
ORDER BY column_name;
