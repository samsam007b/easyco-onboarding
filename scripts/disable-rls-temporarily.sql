-- ============================================================================
-- DÉSACTIVER TEMPORAIREMENT LE RLS pour déboguer
-- ============================================================================
-- Cette approche désactive complètement le RLS pour voir si c'est bien le problème

-- 1. Désactiver RLS sur les 3 tables
ALTER TABLE property_rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE property_costs DISABLE ROW LEVEL SECURITY;
ALTER TABLE property_lifestyle_metrics DISABLE ROW LEVEL SECURITY;

-- 2. Vérifier que le RLS est bien désactivé
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('property_rooms', 'property_costs', 'property_lifestyle_metrics');

-- 3. Tester que les données sont accessibles
SELECT 'property_rooms' as table_name, COUNT(*) as count FROM property_rooms;
SELECT 'property_costs' as table_name, COUNT(*) as count FROM property_costs;
SELECT 'property_lifestyle_metrics' as table_name, COUNT(*) as count FROM property_lifestyle_metrics;

-- 4. Afficher un échantillon des données
SELECT
  'Sample room data' as info,
  room_name,
  price,
  is_available
FROM property_rooms
LIMIT 3;

SELECT
  'Sample costs data' as info,
  utilities_total,
  shared_living_total
FROM property_costs
LIMIT 1;

SELECT
  'Sample lifestyle data' as info,
  party_vibe,
  cleanliness,
  noise_level
FROM property_lifestyle_metrics
LIMIT 1;
