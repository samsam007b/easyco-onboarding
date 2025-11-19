# Fix Owner Onboarding Error

## Problem Identified

L'erreur lors de l'onboarding owner est causée par une **fonction manquante** dans la base de données :

```
Error code: 42883
Error message: function public.calculate_profile_completion(uuid) does not exist
```

Cette fonction est appelée par un trigger sur la table `user_profiles` lors de l'insertion/mise à jour, mais elle n'existe pas dans votre base de données.

## Root Cause

La table `user_profiles` a un trigger qui calcule automatiquement le score de complétion du profil :

```sql
CREATE TRIGGER update_profile_completion_trigger
  BEFORE INSERT OR UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_completion();
```

Cette fonction appelle `calculate_profile_completion(user_id)` qui est manquante.

## Solution

### Option 1: Appliquer via Supabase Dashboard (RECOMMANDÉ)

1. Allez dans votre projet Supabase Dashboard
2. Ouvrez le **SQL Editor**
3. Copiez et exécutez le contenu du fichier : [scripts/fix-profile-completion.sql](scripts/fix-profile-completion.sql)
4. Cliquez sur "Run"

### Option 2: Appliquer via Script TypeScript

Exécutez la commande suivante :

```bash
npx tsx scripts/apply-profile-completion-fix.ts
```

(Le script est créé ci-dessous)

## Errors Explained

Les erreurs que vous avez rencontrées :

1. **400 sur user_profiles** : Tentative d'insertion/mise à jour échoue car le trigger appelle une fonction inexistante
2. **406 sur property_members** : Erreur secondaire causée par l'échec de la création du profil
3. **404 sur user_profiles** : Tentative de lecture d'un profil qui n'a jamais été créé à cause de l'erreur 400

## After Fix

Après avoir appliqué le fix :
- ✅ La fonction `calculate_profile_completion` sera créée
- ✅ Le trigger fonctionnera correctement
- ✅ L'onboarding owner pourra être complété
- ✅ Le score de complétion du profil sera calculé automatiquement

## Test

Pour tester que tout fonctionne :

```bash
npx tsx scripts/check-user-profiles-columns.ts
```

Si vous voyez "✅ All expected columns exist!", c'est bon !
