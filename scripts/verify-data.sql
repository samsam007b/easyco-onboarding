-- ============================================================================
-- SCRIPT DE VÉRIFICATION: Données multi-room
-- ============================================================================
-- Exécute ce script pour vérifier que toutes les données sont bien en place

-- 1. Vérifier qu'il y a bien des chambres
SELECT
  'Chambres trouvées' as verification,
  COUNT(*) as nombre,
  STRING_AGG(room_name, ', ') as chambres
FROM property_rooms
WHERE property_id IN (
  SELECT id FROM properties
  WHERE title ILIKE '%Forest%' OR title ILIKE '%Coliving%'
  LIMIT 1
);

-- 2. Vérifier les coûts
SELECT
  'Coûts trouvés' as verification,
  COUNT(*) as nombre,
  utilities_total as charges,
  shared_living_total as vie_commune
FROM property_costs
WHERE property_id IN (
  SELECT id FROM properties
  WHERE title ILIKE '%Forest%' OR title ILIKE '%Coliving%'
  LIMIT 1
);

-- 3. Vérifier les métriques lifestyle
SELECT
  'Lifestyle trouvé' as verification,
  COUNT(*) as nombre,
  party_vibe as ambiance,
  cleanliness as proprete,
  noise_level as bruit,
  social_interaction as social
FROM property_lifestyle_metrics
WHERE property_id IN (
  SELECT id FROM properties
  WHERE title ILIKE '%Forest%' OR title ILIKE '%Coliving%'
  LIMIT 1
);

-- 4. Afficher toutes les chambres avec prix total
SELECT
  p.title as propriete,
  r.room_name as chambre,
  r.price as loyer,
  c.utilities_total as charges,
  c.shared_living_total as vie_commune,
  (r.price + COALESCE(c.utilities_total, 0) + COALESCE(c.shared_living_total, 0)) as total_mensuel,
  r.is_available as disponible,
  r.available_from as dispo_depuis
FROM property_rooms r
JOIN properties p ON r.property_id = p.id
LEFT JOIN property_costs c ON r.property_id = c.property_id
WHERE p.title ILIKE '%Forest%' OR p.title ILIKE '%Coliving%'
ORDER BY r.price ASC;

-- 5. Afficher l'URL complète de la propriété
SELECT
  'URL de la propriété:' as info,
  CONCAT('https://izzico.be/properties/', id) as url,
  title as nom_propriete
FROM properties
WHERE title ILIKE '%Forest%' OR title ILIKE '%Coliving%'
LIMIT 1;
