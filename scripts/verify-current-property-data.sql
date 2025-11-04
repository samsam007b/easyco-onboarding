-- ============================================================================
-- DIAGNOSTIC COMPLET: Vérifier quelle propriété a les données
-- ============================================================================

-- 1. Voir TOUTES les propriétés avec leurs détails
SELECT
  '1️⃣ TOUTES LES PROPRIÉTÉS' as section,
  id,
  title,
  owner_id,
  CASE
    WHEN owner_id IS NULL THEN '❌ Pas d''owner'
    ELSE '✅ A un owner'
  END as owner_status
FROM properties
ORDER BY created_at DESC;

-- 2. Voir quelle propriété a des CHAMBRES (property_rooms)
SELECT
  '2️⃣ PROPRIÉTÉS AVEC CHAMBRES' as section,
  p.id,
  p.title,
  COUNT(pr.id) as nombre_chambres
FROM properties p
LEFT JOIN property_rooms pr ON p.id = pr.property_id
GROUP BY p.id, p.title
HAVING COUNT(pr.id) > 0
ORDER BY p.created_at DESC;

-- 3. Voir quelle propriété a des COÛTS (property_costs)
SELECT
  '3️⃣ PROPRIÉTÉS AVEC COÛTS' as section,
  p.id,
  p.title,
  COUNT(pc.id) as nombre_couts
FROM properties p
LEFT JOIN property_costs pc ON p.id = pc.property_id
GROUP BY p.id, p.title
HAVING COUNT(pc.id) > 0
ORDER BY p.created_at DESC;

-- 4. Voir quelle propriété a des METRICS DE VIE (property_lifestyle_metrics)
SELECT
  '4️⃣ PROPRIÉTÉS AVEC LIFESTYLE METRICS' as section,
  p.id,
  p.title,
  COUNT(plm.id) as nombre_metrics
FROM properties p
LEFT JOIN property_lifestyle_metrics plm ON p.id = plm.property_id
GROUP BY p.id, p.title
HAVING COUNT(plm.id) > 0
ORDER BY p.created_at DESC;

-- 5. FOCUS sur "Appartement 2 Chambres - Ixelles Flagey"
SELECT
  '5️⃣ IXELLES FLAGEY - DÉTAILS COMPLETS' as section,
  p.id as property_id,
  p.title,
  p.owner_id,
  (SELECT COUNT(*) FROM property_rooms WHERE property_id = p.id) as nb_rooms,
  (SELECT COUNT(*) FROM property_costs WHERE property_id = p.id) as nb_costs,
  (SELECT COUNT(*) FROM property_lifestyle_metrics WHERE property_id = p.id) as nb_metrics,
  CASE
    WHEN (SELECT COUNT(*) FROM property_rooms WHERE property_id = p.id) > 0 THEN '✅ A des chambres'
    ELSE '❌ Pas de chambres'
  END as status_rooms,
  CASE
    WHEN (SELECT COUNT(*) FROM property_costs WHERE property_id = p.id) > 0 THEN '✅ A des coûts'
    ELSE '❌ Pas de coûts'
  END as status_costs,
  CASE
    WHEN (SELECT COUNT(*) FROM property_lifestyle_metrics WHERE property_id = p.id) > 0 THEN '✅ A des metrics'
    ELSE '❌ Pas de metrics'
  END as status_metrics
FROM properties p
WHERE p.title ILIKE '%Ixelles%' OR p.title ILIKE '%Flagey%'
LIMIT 1;

-- 6. Voir le PROPRIÉTAIRE de Ixelles Flagey
SELECT
  '6️⃣ PROPRIÉTAIRE IXELLES FLAGEY' as section,
  p.title as propriete,
  p.owner_id,
  up.first_name,
  up.last_name,
  up.phone_number,
  up.profile_photo_url,
  au.email,
  CASE
    WHEN up.user_id IS NULL THEN '❌ Profil propriétaire manquant'
    WHEN up.first_name IS NULL OR up.last_name IS NULL THEN '⚠️ Profil incomplet'
    ELSE '✅ Profil complet'
  END as status_profil
FROM properties p
LEFT JOIN user_profiles up ON p.owner_id = up.user_id
LEFT JOIN auth.users au ON p.owner_id = au.id
WHERE p.title ILIKE '%Ixelles%' OR p.title ILIKE '%Flagey%'
LIMIT 1;

-- 7. RÉSUMÉ FINAL
SELECT
  '7️⃣ RÉSUMÉ DIAGNOSTIC' as section,
  (SELECT COUNT(*) FROM properties) as total_properties,
  (SELECT COUNT(DISTINCT property_id) FROM property_rooms) as properties_with_rooms,
  (SELECT COUNT(DISTINCT property_id) FROM property_costs) as properties_with_costs,
  (SELECT COUNT(DISTINCT property_id) FROM property_lifestyle_metrics) as properties_with_metrics;
