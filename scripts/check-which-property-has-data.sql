-- ============================================================================
-- VÉRIFIER QUELLE PROPRIÉTÉ A LES DONNÉES
-- ============================================================================

-- 1. Voir toutes les propriétés avec leurs owner_id
SELECT
  id,
  title,
  owner_id,
  CASE
    WHEN owner_id IS NULL THEN '❌ Pas d''owner'
    ELSE '✅ A un owner'
  END as status
FROM properties
ORDER BY created_at DESC
LIMIT 10;

-- 2. Voir quelle propriété a des chambres
SELECT
  p.id,
  p.title,
  COUNT(pr.id) as nombre_chambres
FROM properties p
LEFT JOIN property_rooms pr ON p.id = pr.property_id
GROUP BY p.id, p.title
HAVING COUNT(pr.id) > 0
ORDER BY p.created_at DESC;

-- 3. Voir les propriétaires qui existent dans user_profiles
SELECT
  p.title as propriete,
  p.owner_id,
  up.first_name,
  up.last_name,
  up.user_type
FROM properties p
LEFT JOIN user_profiles up ON p.owner_id = up.user_id
WHERE up.user_id IS NOT NULL
ORDER BY p.created_at DESC
LIMIT 10;
