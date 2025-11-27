-- ============================================================================
-- FIX RLS: Permettre la lecture des profils pour le matching entre utilisateurs
-- ============================================================================

-- 1. Vérifier les politiques actuelles sur profiles
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 2. Vérifier si RLS est activé sur profiles
SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'profiles';

-- 3. Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Authenticated users can view all profiles for matching" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- 4. Créer les nouvelles politiques RLS

-- Politique SELECT: Les utilisateurs authentifiés peuvent voir TOUS les profils (pour le matching)
CREATE POLICY "Authenticated users can view all profiles for matching"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Politique UPDATE: Les utilisateurs peuvent modifier uniquement LEUR profil
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Politique INSERT: Les utilisateurs peuvent créer LEUR profil
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 5. Vérifier les nouvelles politiques
SELECT
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 6. Test: Compter les profils accessibles
SELECT COUNT(*) as total_profiles FROM profiles;
