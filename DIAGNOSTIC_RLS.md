# Diagnostic: Erreur 400 sur user_profiles

## Problème
L'utilisateur obtient une erreur 400 lors de la sauvegarde du profil à la fin de l'onboarding.

## Cause probable
Les politiques RLS (Row Level Security) sur la table `user_profiles` bloquent l'accès.

## Solutions

### 1. Vérifier les politiques RLS actuelles

Connecte-toi à Supabase et vérifie que les politiques suivantes existent:

```sql
-- Voir les politiques actuelles
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_profiles';
```

### 2. Appliquer les bonnes politiques

```sql
-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "user_profiles_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_select_public" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_delete_own" ON public.user_profiles;

-- Activer RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Politique SELECT pour son propre profil
CREATE POLICY "user_profiles_select_own"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Politique SELECT pour les profils publics
CREATE POLICY "user_profiles_select_public"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (true);

-- Politique INSERT pour créer son propre profil
CREATE POLICY "user_profiles_insert_own"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Politique UPDATE pour modifier son propre profil
CREATE POLICY "user_profiles_update_own"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Politique DELETE pour supprimer son propre profil
CREATE POLICY "user_profiles_delete_own"
ON public.user_profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

### 3. Vérifier la migration existante

La migration `029_fix_cors_and_rls_notifications.sql` contient déjà ces politiques. Assure-toi qu'elle a bien été appliquée en production.

### 4. Test rapide

Pour tester si les politiques fonctionnent:

```sql
-- En tant qu'utilisateur authentifié
SELECT * FROM user_profiles WHERE user_id = auth.uid();
INSERT INTO user_profiles (user_id, user_type) VALUES (auth.uid(), 'searcher');
UPDATE user_profiles SET bio = 'test' WHERE user_id = auth.uid();
```

## Workaround temporaire

Si les politiques ne peuvent pas être fixées immédiatement, tu peux temporairement désactiver RLS sur user_profiles en production:

```sql
-- TEMPORAIRE SEULEMENT - NE PAS LAISSER EN PRODUCTION
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
```

⚠️ **ATTENTION**: Cela expose tous les profils. À utiliser SEULEMENT pour débloquer les utilisateurs, puis réactiver immédiatement.
