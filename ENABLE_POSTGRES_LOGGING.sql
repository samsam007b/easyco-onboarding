-- ============================================
-- ENABLE PostgreSQL Query Logging
-- Voir exactement quelles requêtes causent l'erreur 400
-- ============================================

-- ATTENTION: Ceci n'est PAS exécutable dans Supabase SQL Editor
-- Tu dois aller dans Supabase Dashboard > Database > Logs
-- et filtrer par "postgres" pour voir les requêtes SQL

-- En attendant, créons une fonction pour capturer les erreurs

-- Function to test if an upsert would succeed
CREATE OR REPLACE FUNCTION test_user_profiles_upsert(
    p_user_id UUID,
    p_data JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    result JSONB;
    error_msg TEXT;
BEGIN
    -- Try to do the upsert
    BEGIN
        EXECUTE format(
            'INSERT INTO user_profiles (user_id, %s) VALUES ($1, %s) ON CONFLICT (user_id) DO UPDATE SET %s',
            (SELECT string_agg(key, ', ') FROM jsonb_each(p_data)),
            (SELECT string_agg('$' || (row_number() OVER() + 1)::text, ', ') FROM jsonb_each(p_data)),
            (SELECT string_agg(key || ' = EXCLUDED.' || key, ', ') FROM jsonb_each(p_data))
        )
        USING p_user_id, p_data;

        result := jsonb_build_object('success', true, 'message', 'Upsert would succeed');
    EXCEPTION WHEN OTHERS THEN
        result := jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'sqlstate', SQLSTATE,
            'detail', COALESCE(PG_EXCEPTION_DETAIL, 'No detail'),
            'hint', COALESCE(PG_EXCEPTION_HINT, 'No hint')
        );
    END;

    RETURN result;
END;
$$;

-- Test avec ton user_id
SELECT test_user_profiles_upsert(
    (SELECT id FROM auth.users LIMIT 1),
    '{"first_name": "Test"}'::jsonb
);
