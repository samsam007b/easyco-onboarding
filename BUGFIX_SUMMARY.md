# Bug Fix Summary - Owner Onboarding

**Date**: 2025-11-19
**Status**: ✅ RÉSOLU

## Problème Initial

L'onboarding "owner" ne fonctionnait pas et générait les erreurs suivantes :
- ❌ **Error 400** sur `user_profiles` : "function public.calculate_profile_completion(uuid) does not exist"
- ❌ **Error 406** sur `property_members` : Erreur RLS secondaire
- ❌ **Error 404** sur `user_profiles` : Profil jamais créé à cause des erreurs précédentes

## Cause Racine

La table `user_profiles` avait un trigger qui appelait automatiquement la fonction `calculate_profile_completion()` pour calculer le score de complétion du profil. Cette fonction n'existait pas dans la base de données, causant l'échec de toutes les insertions/mises à jour de profils.

```sql
-- Le trigger qui causait le problème
CREATE TRIGGER update_profile_completion_trigger
  BEFORE INSERT OR UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_completion();
```

## Solution Appliquée

### 1. Diagnostic
- Identification de la fonction manquante via test d'insertion
- Vérification que toutes les colonnes nécessaires existaient bien

### 2. Correction
Exécution du SQL suivant dans Supabase Dashboard (voir [scripts/fix-profile-completion.sql](scripts/fix-profile-completion.sql)) :

```sql
-- Création de la fonction calculate_profile_completion
CREATE OR REPLACE FUNCTION public.calculate_profile_completion(user_id_param UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
-- Calcule le pourcentage de champs remplis dans le profil
-- Score basé sur 20 champs essentiels
$$;

-- Création de la fonction trigger
CREATE OR REPLACE FUNCTION public.update_profile_completion()
RETURNS TRIGGER
-- Appelle calculate_profile_completion et met à jour le score
$$;

-- Recréation du trigger
CREATE TRIGGER update_profile_completion_trigger
  BEFORE INSERT OR UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_completion();
```

### 3. Validation
- ✅ Test de la fonction : Score calculé correctement (40% sur profil test)
- ✅ Test de l'onboarding : Création de profil owner réussie
- ✅ Aucune erreur dans la console

## Fichiers Créés/Modifiés

### Fichiers de correction (à garder)
- `scripts/fix-profile-completion.sql` - SQL de correction (peut resservir)
- `OWNER_ONBOARDING_FIX.md` - Documentation détaillée

### Scripts de diagnostic (nettoyés)
- ~~`scripts/check-user-profiles-columns.ts`~~ - Supprimé après usage
- ~~`scripts/apply-profile-completion-fix.ts`~~ - Supprimé après usage
- ~~`scripts/test-profile-completion-function.ts`~~ - Supprimé après usage

## Leçons Apprises

1. **Migrations incomplètes** : La migration `067_create_calculate_profile_completion.sql` existait mais n'avait pas été appliquée à la base de données
2. **Importance des triggers** : Les triggers peuvent bloquer silencieusement les opérations si les fonctions qu'ils appellent n'existent pas
3. **Diagnostic méthodique** :
   - ✅ Lire les messages d'erreur complets (code + message)
   - ✅ Tester l'insertion directe pour identifier le problème exact
   - ✅ Vérifier que les fonctions/triggers existent avant de modifier le code applicatif

## Prévention Future

Pour éviter ce problème à l'avenir :

1. **Vérifier les migrations appliquées** :
   ```bash
   # Liste des migrations appliquées
   SELECT * FROM supabase_migrations.schema_migrations;
   ```

2. **Tester les fonctions critiques** :
   ```sql
   -- Vérifier l'existence d'une fonction
   SELECT * FROM pg_proc WHERE proname = 'calculate_profile_completion';
   ```

3. **Appliquer systématiquement toutes les migrations** :
   - Utiliser `supabase db push` pour appliquer les migrations locales
   - Vérifier dans le dashboard que toutes les migrations sont appliquées

## Statut Final

✅ **L'onboarding owner fonctionne maintenant correctement**
✅ **Les profils owners peuvent être créés sans erreur**
✅ **Le score de complétion du profil est calculé automatiquement**

---

**Si vous rencontrez à nouveau ce problème** : Exécutez simplement le fichier `scripts/fix-profile-completion.sql` dans le SQL Editor de Supabase.
