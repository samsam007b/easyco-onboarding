-- ============================================================================
-- FIX RLS: Permettre la lecture publique des user_profiles pour les propriétaires
-- ============================================================================

-- 1. Vérifier les politiques actuelles sur user_profiles
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- 2. Créer une politique pour permettre la lecture publique des profils
-- (tout le monde peut voir les profils des propriétaires)
DROP POLICY IF EXISTS "Public can view property owner profiles" ON user_profiles;

CREATE POLICY "Public can view property owner profiles"
  ON user_profiles FOR SELECT
  TO public
  USING (
    -- Tout le monde peut voir les profils des propriétaires
    user_type = 'owner'
    OR
    -- Ou si c'est ton propre profil
    auth.uid() = user_id
  );

-- 3. Si le RLS est trop restrictif, on peut temporairement le désactiver pour debug
-- ATTENTION: À utiliser uniquement pour le debug!
-- ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- 4. Vérifier qu'on peut maintenant lire les profils des propriétaires
SELECT
  'Test lecture profil propriétaire' as test,
  user_id,
  first_name,
  last_name,
  user_type
FROM user_profiles
WHERE user_type = 'owner'
LIMIT 3;

-- 5. Vérifier spécifiquement le propriétaire de la propriété Ixelles
SELECT
  'Propriétaire Ixelles Flagey' as test,
  up.user_id,
  up.first_name,
  up.last_name,
  up.phone_number,
  up.user_type
FROM properties p
JOIN user_profiles up ON p.owner_id = up.user_id
WHERE p.title ILIKE '%Ixelles%' OR p.title ILIKE '%Flagey%'
LIMIT 1;
