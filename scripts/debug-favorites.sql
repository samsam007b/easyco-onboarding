-- ============================================================================
-- DEBUG: Pourquoi les favoris ne s'affichent pas ?
-- ============================================================================

-- 1. Voir tous les favoris de Samuel (avec service role)
SELECT
  f.id as favorite_id,
  f.property_id,
  f.created_at,
  p.title,
  p.status,
  p.is_available
FROM favorites f
LEFT JOIN properties p ON p.id = f.property_id
WHERE f.user_id = (SELECT id FROM profiles WHERE full_name ILIKE '%samuel%' LIMIT 1);

-- 2. Vérifier si les propriétés sont "published" et "is_available"
-- Si status != 'published' ou is_available = false, RLS les bloquera

-- 3. Corriger les propriétés si nécessaire
-- Mettre à jour les propriétés pour qu'elles soient visibles
UPDATE properties
SET status = 'published', is_available = true
WHERE id IN (
  SELECT property_id
  FROM favorites
  WHERE user_id = (SELECT id FROM profiles WHERE full_name ILIKE '%samuel%' LIMIT 1)
);

-- 4. Vérifier les politiques RLS sur favorites
SELECT policyname, cmd, roles, qual
FROM pg_policies
WHERE tablename = 'favorites';

-- 5. Vérifier les politiques RLS sur properties
SELECT policyname, cmd, roles, qual
FROM pg_policies
WHERE tablename = 'properties';
