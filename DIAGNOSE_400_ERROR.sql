-- ============================================
-- DIAGNOSTIC COMPLET : Erreur 400 sur user_profiles
-- ============================================

-- Step 1: Vérifier les contraintes actuelles
SELECT
    'CONSTRAINTS' as section,
    constraint_name,
    constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'user_profiles'
AND table_schema = 'public'
ORDER BY constraint_type, constraint_name;

-- Step 2: Vérifier les colonnes NOT NULL
SELECT
    'NOT NULL COLUMNS' as section,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
AND table_schema = 'public'
AND is_nullable = 'NO'
ORDER BY ordinal_position;

-- Step 3: Vérifier les RLS policies
SELECT
    'RLS POLICIES' as section,
    policyname as "Policy Name",
    cmd as "Command",
    roles as "Roles",
    qual as "USING Expression",
    with_check as "WITH CHECK Expression"
FROM pg_policies
WHERE tablename = 'user_profiles'
AND schemaname = 'public'
ORDER BY cmd;

-- Step 4: Vérifier si RLS est activé
SELECT
    'RLS STATUS' as section,
    tablename,
    rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE tablename = 'user_profiles'
AND schemaname = 'public';

-- Step 5: Test d'un INSERT minimal (simuler ce que fait l'upsert)
-- ATTENTION : Ne pas exécuter cette partie si tu n'es pas sûr, c'est juste pour voir l'erreur
/*
INSERT INTO public.user_profiles (user_id)
VALUES ('00000000-0000-0000-0000-000000000000')
ON CONFLICT (user_id) DO NOTHING;
*/

-- Step 6: Vérifier les triggers
SELECT
    'TRIGGERS' as section,
    trigger_name,
    event_manipulation as "Event",
    action_statement as "Action"
FROM information_schema.triggers
WHERE event_object_table = 'user_profiles'
AND event_object_schema = 'public';
