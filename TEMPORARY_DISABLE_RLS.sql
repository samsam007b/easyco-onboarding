-- ============================================
-- TEMPORARY: Disable RLS to see if that's blocking
-- ============================================

-- ATTENTION: Ceci désactive temporairement la sécurité RLS
-- À utiliser UNIQUEMENT pour diagnostiquer, puis réactiver après !

-- Step 1: Désactiver temporairement RLS
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Vérifier que RLS est désactivé
SELECT
    tablename,
    rowsecurity as "RLS Enabled? (should be false)"
FROM pg_tables
WHERE tablename = 'user_profiles'
AND schemaname = 'public';

-- Maintenant:
-- 1. Rafraîchis la page sur le site
-- 2. Si l'erreur 400 DISPARAÎT, le problème vient des RLS policies
-- 3. Si l'erreur 400 PERSISTE, le problème vient d'autre chose

-- ============================================
-- IMPORTANT: RÉACTIVER RLS APRÈS LE TEST !
-- ============================================
-- Exécute ceci après le test:
-- ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
