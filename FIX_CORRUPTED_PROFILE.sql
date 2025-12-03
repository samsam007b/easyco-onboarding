-- ============================================
-- FIX CORRUPTED USER PROFILE
-- Supprime et recrée le profil utilisateur corrompu
-- ============================================

-- REMPLACE 'baudonsamuel@gmail.com' par ton vrai email !

-- Step 1: Identifier ton user_id
SELECT
    'Your user_id:' as info,
    id as user_id,
    email
FROM auth.users
WHERE email = 'baudonsamuel@gamil.com';  -- CHANGE THIS!

-- Step 2: Voir l'état actuel de ton profil
SELECT
    'Current profile state:' as info,
    *
FROM public.user_profiles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'ton-email@example.com' LIMIT 1);

-- Step 3: SUPPRIMER le profil corrompu
-- ATTENTION: Ceci va supprimer toutes tes données de profil !
DELETE FROM public.user_profiles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'ton-email@example.com' LIMIT 1);

-- Step 4: Vérifier que c'est supprimé
SELECT
    'Profile deleted:' as info,
    COUNT(*) as remaining_profiles
FROM public.user_profiles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'ton-email@example.com' LIMIT 1);

-- Step 5: Optionnel - Créer un nouveau profil minimal propre
INSERT INTO public.user_profiles (
    user_id,
    user_type,
    created_at,
    updated_at
)
SELECT
    id,
    'searcher',  -- ou 'owner' ou 'resident' selon ton rôle
    now(),
    now()
FROM auth.users
WHERE email = 'baudonsamuel@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

-- Step 6: Vérifier le nouveau profil
SELECT
    'New clean profile:' as info,
    user_id,
    user_type,
    created_at
FROM public.user_profiles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'ton-email@example.com' LIMIT 1);

-- MAINTENANT: Va sur le site et refais ton onboarding normalement
-- Le profil va se remplir progressivement sans erreur 400
