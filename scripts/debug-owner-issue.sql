-- ============================================================================
-- DEBUG: Pourquoi le propriétaire ne s'affiche pas?
-- ============================================================================

-- 1. Vérifier la propriété et son owner_id
SELECT
  'Propriété actuelle' as info,
  id as property_id,
  title,
  owner_id,
  CASE
    WHEN owner_id IS NULL THEN '❌ PAS DE OWNER_ID'
    ELSE '✅ Owner ID présent'
  END as status
FROM properties
WHERE title ILIKE '%Ixelles%' OR title ILIKE '%Flagey%'
LIMIT 1;

-- 2. Vérifier si le user_profile existe pour ce owner_id
SELECT
  'Profil du propriétaire' as info,
  up.user_id,
  up.first_name,
  up.last_name,
  up.phone_number,
  up.profile_photo_url,
  CASE
    WHEN up.user_id IS NULL THEN '❌ PROFIL N''EXISTE PAS'
    WHEN up.first_name IS NULL OR up.last_name IS NULL THEN '⚠️ Profil incomplet'
    ELSE '✅ Profil complet'
  END as status
FROM properties p
LEFT JOIN user_profiles up ON p.owner_id = up.user_id
WHERE p.title ILIKE '%Ixelles%' OR p.title ILIKE '%Flagey%'
LIMIT 1;

-- 3. Vérifier l'email du propriétaire dans auth.users
SELECT
  'Email du propriétaire' as info,
  au.id as user_id,
  au.email,
  CASE
    WHEN au.email IS NULL THEN '❌ PAS D''EMAIL'
    ELSE '✅ Email présent'
  END as status
FROM properties p
LEFT JOIN auth.users au ON p.owner_id = au.id
WHERE p.title ILIKE '%Ixelles%' OR p.title ILIKE '%Flagey%'
LIMIT 1;

-- 4. Tout voir ensemble
SELECT
  p.title as propriete,
  p.owner_id,
  up.first_name,
  up.last_name,
  up.phone_number,
  au.email,
  CONCAT(
    CASE WHEN up.user_id IS NOT NULL THEN '✅ Profil ' ELSE '❌ Profil manquant ' END,
    CASE WHEN au.email IS NOT NULL THEN '✅ Email' ELSE '❌ Email manquant' END
  ) as diagnostic
FROM properties p
LEFT JOIN user_profiles up ON p.owner_id = up.user_id
LEFT JOIN auth.users au ON p.owner_id = au.id
WHERE p.title ILIKE '%Ixelles%' OR p.title ILIKE '%Flagey%'
LIMIT 1;
