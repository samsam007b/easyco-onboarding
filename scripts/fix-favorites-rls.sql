-- ============================================================================
-- FIX RLS: Permettre aux utilisateurs d'accéder à leurs propres favoris
-- ============================================================================

-- 1. Vérifier les politiques actuelles sur favorites
SELECT
  policyname,
  cmd,
  roles,
  qual
FROM pg_policies
WHERE tablename = 'favorites'
ORDER BY policyname;

-- 2. Vérifier si RLS est activé sur favorites
SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'favorites';

-- 3. Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can insert their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON favorites;
DROP POLICY IF EXISTS "Authenticated users can view their favorites" ON favorites;

-- 4. Créer les nouvelles politiques RLS

-- Politique SELECT: Les utilisateurs peuvent voir LEURS favoris
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Politique INSERT: Les utilisateurs peuvent ajouter des favoris
CREATE POLICY "Users can insert their own favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Politique DELETE: Les utilisateurs peuvent supprimer LEURS favoris
CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 5. S'assurer que RLS est activé
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 6. Vérifier les nouvelles politiques
SELECT
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'favorites'
ORDER BY policyname;

-- 7. Test: Compter les favoris (avec service role, devrait voir tous)
SELECT COUNT(*) as total_favorites FROM favorites;
