-- ============================================
-- CHECK RLS POLICIES sur user_profiles
-- Vérifier si les policies bloquent les INSERT
-- ============================================

-- Step 1: Vérifier toutes les policies RLS actuelles
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual as "USING clause",
    with_check as "WITH CHECK clause"
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY cmd, policyname;

-- Step 2: Afficher les policies de façon plus lisible
SELECT
    policyname as "Policy Name",
    cmd as "Command (SELECT/INSERT/UPDATE/DELETE)",
    CASE
        WHEN roles::text = '{authenticated}' THEN 'authenticated users'
        WHEN roles::text = '{public}' THEN 'public (anyone)'
        ELSE roles::text
    END as "Who can do this",
    CASE
        WHEN qual IS NOT NULL THEN 'Has USING clause (controls which rows)'
        ELSE 'No USING clause'
    END as "USING",
    CASE
        WHEN with_check IS NOT NULL THEN 'Has WITH CHECK clause (controls INSERT/UPDATE)'
        ELSE 'No WITH CHECK clause'
    END as "WITH CHECK"
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY cmd, policyname;

-- Step 3: Vérifier spécifiquement les policies INSERT
SELECT
    'INSERT POLICIES' as section,
    policyname,
    qual as "USING (should be NULL for INSERT)",
    with_check as "WITH CHECK (controls what can be inserted)"
FROM pg_policies
WHERE tablename = 'user_profiles'
AND cmd = 'INSERT';

-- Step 4: Vérifier si RLS est activé
SELECT
    tablename,
    rowsecurity as "RLS Enabled?"
FROM pg_tables
WHERE tablename = 'user_profiles'
AND schemaname = 'public';

-- ============================================
-- DIAGNOSTIC: Tester si un INSERT passerait
-- ============================================
-- Les policies INSERT doivent avoir WITH CHECK qui permet:
-- - auth.uid() = user_id (l'utilisateur peut insérer son propre profil)
--
-- Si WITH CHECK est trop restrictif, l'INSERT échoue avec 400
