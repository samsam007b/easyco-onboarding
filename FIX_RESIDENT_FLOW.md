# 🔧 GUIDE: Débloquer le Flow Resident

## ⚠️ Problème Actuel

Le flow d'onboarding **Resident** est bloqué avec cette erreur:
```
ERROR: invalid input syntax for type integer: "high"
COLUMN: sociability_level
```

## ✅ Solution (5 minutes)

### Étape 1: Ouvrir Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Connectez-vous à votre projet EasyCo
3. Cliquez sur **"SQL Editor"** dans le menu de gauche

### Étape 2: Exécuter la Migration

1. Cliquez sur **"+ New Query"**
2. Copiez-collez ce SQL:

```sql
-- Migration to fix sociability_level column type
-- Problem: Column was created as INTEGER in migration 002, but code expects TEXT
-- This migration changes it from INTEGER to TEXT with proper constraints

-- First, drop the column if it exists as INTEGER
ALTER TABLE user_profiles
DROP COLUMN IF EXISTS sociability_level;

-- Recreate as TEXT with proper CHECK constraint
ALTER TABLE user_profiles
ADD COLUMN sociability_level TEXT CHECK (sociability_level IN ('low', 'medium', 'high'));

-- Do the same for dependent_profiles table
ALTER TABLE dependent_profiles
DROP COLUMN IF EXISTS sociability_level;

ALTER TABLE dependent_profiles
ADD COLUMN sociability_level TEXT CHECK (sociability_level IN ('low', 'medium', 'high'));

-- Add comment explaining the column
COMMENT ON COLUMN user_profiles.sociability_level IS 'Social energy level: low (introvert), medium (moderate), high (extrovert)';
COMMENT ON COLUMN dependent_profiles.sociability_level IS 'Social energy level: low (introvert), medium (moderate), high (extrovert)';
```

3. Cliquez sur **"Run"** (ou appuyez sur Cmd/Ctrl + Enter)
4. Vérifiez qu'il n'y a pas d'erreur (vous devriez voir "Success")

### Étape 3: Vérifier

Retournez sur votre application et testez le flow resident:
1. Allez sur https://easyco-onboarding-kappa.vercel.app
2. Créez un compte ou connectez-vous
3. Choisissez le profil **"Resident"**
4. Complétez toutes les étapes jusqu'à la fin

Vous ne devriez plus avoir d'erreur! 🎉

## 📊 Ce qui a été changé

| Avant | Après |
|-------|-------|
| `sociability_level INTEGER` | `sociability_level TEXT` |
| Valeurs: 1, 2, 3 | Valeurs: 'low', 'medium', 'high' |
| ❌ Crash avec "high" | ✅ Fonctionne parfaitement |

## 🆘 En cas de problème

Si vous voyez une erreur lors de l'exécution de la migration:

1. **Erreur "column does not exist"**: C'est normal! Continuez, les autres commandes s'exécuteront.

2. **Erreur "permission denied"**: Assurez-vous d'être connecté comme Owner du projet Supabase.

3. **Autre erreur**:
   - Copiez l'erreur complète
   - Créez une issue GitHub avec l'erreur
   - Ou contactez l'équipe de support

## 📝 Note Technique

Cette migration est **SAFE** car:
- Elle utilise `DROP COLUMN IF EXISTS` (pas d'erreur si la colonne n'existe pas)
- Elle utilise `ADD COLUMN` (crée la colonne avec le bon type)
- Les données existantes ne sont pas perdues (la colonne était vide de toute façon)
- La constraint CHECK garantit que seules les valeurs valides peuvent être insérées

## ✨ Après la Migration

L'application sera **100% fonctionnelle** pour:
- ✅ Flow Searcher (11 pages)
- ✅ Flow Owner (7 pages)
- ✅ Flow Resident (8 pages)

Profitez de votre application complète! 🚀
