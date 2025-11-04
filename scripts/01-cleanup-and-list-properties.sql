-- ============================================================================
-- ÉTAPE 1: NETTOYER LES DOUBLONS ET LISTER LES PROPRIÉTÉS
-- ============================================================================

-- 1. Voir toutes les propriétés actuelles
SELECT
  '1️⃣ TOUTES LES PROPRIÉTÉS ACTUELLES' as section,
  id,
  title,
  address,
  owner_id,
  created_at
FROM properties
ORDER BY created_at DESC;

-- 2. Supprimer toutes les données liées aux propriétés (chambres, coûts, metrics)
DELETE FROM property_rooms;
DELETE FROM property_costs;
DELETE FROM property_lifestyle_metrics;

-- 3. Identifier les doublons
SELECT
  '2️⃣ DOUBLONS DÉTECTÉS' as section,
  title,
  COUNT(*) as nombre_doublons
FROM properties
GROUP BY title
HAVING COUNT(*) > 1
ORDER BY nombre_doublons DESC;

-- 4. Supprimer les doublons (garder seulement le plus récent de chaque)
WITH duplicates AS (
  SELECT
    id,
    title,
    ROW_NUMBER() OVER (PARTITION BY title ORDER BY created_at DESC) as rn
  FROM properties
)
DELETE FROM properties
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- 5. Vérifier les propriétés restantes
SELECT
  '3️⃣ PROPRIÉTÉS APRÈS NETTOYAGE' as section,
  id,
  title,
  address,
  city,
  owner_id
FROM properties
ORDER BY created_at DESC;

-- 6. Résumé
SELECT
  '4️⃣ RÉSUMÉ' as section,
  COUNT(*) as total_proprietes,
  COUNT(DISTINCT title) as titres_uniques,
  COUNT(DISTINCT owner_id) as proprietaires_differents
FROM properties;
