-- ============================================
-- CHECK shared_meals columns in user_profiles
-- ============================================

-- Chercher toutes les colonnes qui contiennent "shared" ou "meal"
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
AND table_schema = 'public'
AND (
    column_name LIKE '%shared%'
    OR column_name LIKE '%meal%'
)
ORDER BY column_name;

-- Si aucune colonne trouvée, créons-la
DO $$
BEGIN
    -- Vérifier si shared_meals_frequency existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles'
        AND column_name = 'shared_meals_frequency'
    ) THEN
        -- Vérifier si shared_meals_interest existe (nom alternatif)
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'user_profiles'
            AND column_name = 'shared_meals_interest'
        ) THEN
            RAISE NOTICE '✅ Column exists as: shared_meals_interest (BOOLEAN)';
            RAISE NOTICE '⚠️  Code uses: shared_meals_frequency (TEXT)';
            RAISE NOTICE '💡 Solution: Either add shared_meals_frequency column OR fix the code mapping';
        ELSE
            -- Créer la colonne manquante
            ALTER TABLE public.user_profiles
            ADD COLUMN shared_meals_frequency TEXT DEFAULT NULL;

            RAISE NOTICE '✅ Created column: shared_meals_frequency';
        END IF;
    ELSE
        RAISE NOTICE '✅ Column already exists: shared_meals_frequency';
    END IF;
END $$;

-- Vérifier le résultat final
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'user_profiles'
AND table_schema = 'public'
AND (
    column_name = 'shared_meals_frequency'
    OR column_name = 'shared_meals_interest'
);
