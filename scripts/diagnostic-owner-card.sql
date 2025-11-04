-- ============================================================================
-- DIAGNOSTIC COMPLET: Pourquoi la carte propriétaire ne s'affiche pas?
-- ============================================================================

-- 1. Vérifier que chaque propriété a un owner_id
SELECT
  '1️⃣ PROPRIÉTÉS ET LEURS OWNER_ID' as section,
  id,
  title,
  owner_id,
  CASE
    WHEN owner_id IS NULL THEN '❌ PAS DE OWNER_ID'
    ELSE '✅ Owner ID présent'
  END as status
FROM properties
ORDER BY created_at DESC
LIMIT 5;

-- 2. Vérifier que les user_profiles existent pour ces owner_id
SELECT
  '2️⃣ PROFILS DES PROPRIÉTAIRES' as section,
  p.title as propriete,
  p.owner_id,
  up.user_id,
  up.first_name,
  up.last_name,
  up.phone_number,
  up.profile_photo_url,
  up.user_type,
  CASE
    WHEN up.user_id IS NULL THEN '❌ PROFIL MANQUANT'
    WHEN up.first_name IS NULL OR up.last_name IS NULL THEN '⚠️ Profil incomplet'
    ELSE '✅ Profil complet'
  END as status
FROM properties p
LEFT JOIN user_profiles up ON p.owner_id = up.user_id
ORDER BY p.created_at DESC
LIMIT 5;

-- 3. Vérifier les emails dans auth.users
SELECT
  '3️⃣ EMAILS DES PROPRIÉTAIRES' as section,
  p.title as propriete,
  p.owner_id,
  au.email,
  CASE
    WHEN au.email IS NULL THEN '❌ PAS D''EMAIL'
    ELSE '✅ Email présent'
  END as status
FROM properties p
LEFT JOIN auth.users au ON p.owner_id = au.id
ORDER BY p.created_at DESC
LIMIT 5;

-- 4. Vue complète pour UNE propriété (la première)
SELECT
  '4️⃣ DÉTAILS COMPLETS PREMIÈRE PROPRIÉTÉ' as section,
  p.id as property_id,
  p.title,
  p.owner_id,
  up.first_name,
  up.last_name,
  up.phone_number,
  up.profile_photo_url,
  au.email,
  CASE
    WHEN p.owner_id IS NULL THEN '❌ Pas d''owner_id sur la propriété'
    WHEN up.user_id IS NULL THEN '❌ Pas de profil pour cet owner_id'
    WHEN up.first_name IS NULL THEN '❌ Prénom manquant'
    WHEN up.last_name IS NULL THEN '❌ Nom manquant'
    WHEN au.email IS NULL THEN '❌ Email manquant'
    ELSE '✅ TOUT EST OK'
  END as diagnostic
FROM properties p
LEFT JOIN user_profiles up ON p.owner_id = up.user_id
LEFT JOIN auth.users au ON p.owner_id = au.id
ORDER BY p.created_at DESC
LIMIT 1;

-- 5. Compter les propriétaires manquants
SELECT
  '5️⃣ RÉSUMÉ' as section,
  COUNT(*) as total_proprietes,
  COUNT(owner_id) as proprietes_avec_owner_id,
  COUNT(DISTINCT owner_id) as owners_differents,
  (SELECT COUNT(*) FROM properties WHERE owner_id IS NULL) as proprietes_sans_owner
FROM properties;
