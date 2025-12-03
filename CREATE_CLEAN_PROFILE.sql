-- ============================================
-- CREATE CLEAN PROFILE for baudonsamuel@gmail.com
-- ============================================

-- Step 1: Vérifier que l'ancien profil est bien supprimé
SELECT
    'Before creation:' as info,
    COUNT(*) as existing_profiles
FROM public.user_profiles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'baudonsamuel@gmail.com' LIMIT 1);

-- Step 2: Créer un nouveau profil minimal et propre
INSERT INTO public.user_profiles (
    user_id,
    user_type,
    created_at,
    updated_at
)
SELECT
    id,
    'searcher',  -- Défaut: searcher (tu peux changer si besoin)
    now(),
    now()
FROM auth.users
WHERE email = 'baudonsamuel@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

-- Step 3: Vérifier le nouveau profil créé
SELECT
    'New clean profile created:' as info,
    user_id,
    user_type,
    created_at,
    updated_at
FROM public.user_profiles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'baudonsamuel@gmail.com' LIMIT 1);

-- SUCCESS! Maintenant:
-- 1. Va sur https://easyco-onboarding.vercel.app
-- 2. Rafraîchis la page (Cmd+R)
-- 3. L'erreur 400 devrait disparaître
-- 4. Tu peux refaire ton onboarding normalement
