-- ============================================================================
-- FIX RLS POLICIES: Permettre la lecture publique des nouvelles tables
-- ============================================================================
-- Ce script corrige les erreurs 406 en ajustant les politiques RLS

-- 1. Supprimer les anciennes politiques restrictives
DROP POLICY IF EXISTS "Public can view rooms" ON property_rooms;
DROP POLICY IF EXISTS "Public can view costs" ON property_costs;
DROP POLICY IF EXISTS "Public can view lifestyle metrics" ON property_lifestyle_metrics;

-- 2. Créer de nouvelles politiques plus permissives pour la lecture publique
-- Les utilisateurs non connectés (anon) doivent pouvoir voir les données des propriétés publiées

-- Policy pour property_rooms
CREATE POLICY "Anyone can view available rooms"
  ON property_rooms FOR SELECT
  TO public
  USING (true);

-- Policy pour property_costs
CREATE POLICY "Anyone can view property costs"
  ON property_costs FOR SELECT
  TO public
  USING (true);

-- Policy pour property_lifestyle_metrics
CREATE POLICY "Anyone can view lifestyle metrics"
  ON property_lifestyle_metrics FOR SELECT
  TO public
  USING (true);

-- 3. Vérifier que les politiques sont bien actives
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('property_rooms', 'property_costs', 'property_lifestyle_metrics')
ORDER BY tablename, policyname;

-- 4. Tester l'accès aux données
-- Si ces requêtes retournent des résultats, c'est que ça fonctionne
SELECT 'Test property_rooms' as test, COUNT(*) as count FROM property_rooms;
SELECT 'Test property_costs' as test, COUNT(*) as count FROM property_costs;
SELECT 'Test property_lifestyle_metrics' as test, COUNT(*) as count FROM property_lifestyle_metrics;
