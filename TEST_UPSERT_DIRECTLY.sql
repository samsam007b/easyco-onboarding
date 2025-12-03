-- ============================================
-- TEST UPSERT DIRECT pour reproduire l'erreur 400
-- ============================================

-- Ce script simule exactement ce que fait le code TypeScript
-- pour identifier où l'erreur se produit

-- IMPORTANT: Remplace 'YOUR_USER_ID_HERE' par ton vrai user_id
-- Tu peux le trouver avec: SELECT id FROM auth.users WHERE email = 'ton-email@example.com';

-- Test 1: Upsert minimal (comme basic-info page)
-- Devrait fonctionner si NOT NULL constraints sont OK
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Récupérer un vrai user_id (le premier utilisateur authentifié)
    SELECT id INTO test_user_id
    FROM auth.users
    LIMIT 1;

    IF test_user_id IS NULL THEN
        RAISE EXCEPTION 'No users found in auth.users table';
    END IF;

    RAISE NOTICE 'Testing with user_id: %', test_user_id;

    -- Test upsert (simule ce que fait basic-info page)
    BEGIN
        INSERT INTO public.user_profiles (
            user_id,
            first_name,
            last_name,
            date_of_birth,
            nationality,
            updated_at
        ) VALUES (
            test_user_id,
            'Test',
            'User',
            '1990-01-01',
            'Belgian',
            now()
        )
        ON CONFLICT (user_id) DO UPDATE SET
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            date_of_birth = EXCLUDED.date_of_birth,
            nationality = EXCLUDED.nationality,
            updated_at = EXCLUDED.updated_at;

        RAISE NOTICE '✅ Test 1 PASSED: Basic upsert works';
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING '❌ Test 1 FAILED: %', SQLERRM;
        RAISE NOTICE 'Error detail: %', SQLSTATE;
    END;

    -- Test 2: Upsert avec JSONB (comme personality page)
    BEGIN
        INSERT INTO public.user_profiles (
            user_id,
            extended_personality,
            updated_at
        ) VALUES (
            test_user_id,
            '{"hobbies": ["reading"], "interests": ["tech"], "personalityTraits": ["friendly"]}'::jsonb,
            now()
        )
        ON CONFLICT (user_id) DO UPDATE SET
            extended_personality = EXCLUDED.extended_personality,
            updated_at = EXCLUDED.updated_at;

        RAISE NOTICE '✅ Test 2 PASSED: JSONB extended_personality works';
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING '❌ Test 2 FAILED: %', SQLERRM;
        RAISE NOTICE 'Error detail: %', SQLSTATE;
        RAISE NOTICE 'Hint: Column extended_personality may not exist';
    END;

    -- Test 3: Upsert avec financial_info
    BEGIN
        INSERT INTO public.user_profiles (
            user_id,
            financial_info,
            updated_at
        ) VALUES (
            test_user_id,
            '{"incomeRange": "2000-3000", "hasGuarantor": false, "employmentType": "employed"}'::jsonb,
            now()
        )
        ON CONFLICT (user_id) DO UPDATE SET
            financial_info = EXCLUDED.financial_info,
            updated_at = EXCLUDED.updated_at;

        RAISE NOTICE '✅ Test 3 PASSED: JSONB financial_info works';
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING '❌ Test 3 FAILED: %', SQLERRM;
        RAISE NOTICE 'Error detail: %', SQLSTATE;
        RAISE NOTICE 'Hint: Column financial_info may not exist';
    END;

    -- Test 4: Upsert avec community_preferences
    BEGIN
        INSERT INTO public.user_profiles (
            user_id,
            community_preferences,
            updated_at
        ) VALUES (
            test_user_id,
            '{"eventInterest": "high", "enjoySharedMeals": true, "openToMeetups": true}'::jsonb,
            now()
        )
        ON CONFLICT (user_id) DO UPDATE SET
            community_preferences = EXCLUDED.community_preferences,
            updated_at = EXCLUDED.updated_at;

        RAISE NOTICE '✅ Test 4 PASSED: JSONB community_preferences works';
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING '❌ Test 4 FAILED: %', SQLERRM;
        RAISE NOTICE 'Error detail: %', SQLSTATE;
        RAISE NOTICE 'Hint: Column community_preferences may not exist';
    END;

END $$;

-- Summary
SELECT
    'TEST SUMMARY' as section,
    'If all tests passed, the issue is NOT with the database structure' as result,
    'If tests failed, check the error messages above for details' as action;
