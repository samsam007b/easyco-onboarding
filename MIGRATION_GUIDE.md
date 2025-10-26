# Migration Guide - Complete Supabase Schema Update

## Vue d'ensemble

Ce guide explique comment appliquer la migration complète du schéma Supabase pour passer du système JSONB blob au système de colonnes typées avec données structurées et requêtables.

## ⚠️ IMPORTANT - Avant de commencer

**Cette migration est CRITIQUE et transforme la structure fondamentale de la base de données.**

### Ce qui va changer:

1. **users table**: Ajout de colonnes metadata
2. **user_profiles table**: Transformation de `profile_data JSONB` en 100+ colonnes typées
3. **NOUVELLES tables**:
   - `user_verifications` - KYC, vérification email/phone
   - `user_consents` - GDPR, tracking des consentements

### Impact:

- ✅ **Pas de perte de données** - Migration automatique des données JSONB vers colonnes typées
- ✅ **Backward compatible** - Les anciennes données sont migrées automatiquement
- ✅ **Amélioration des performances** - Indexes sur les colonnes les plus utilisées
- ✅ **Ready for matching algorithm** - Données queryables pour l'algorithme de matching

---

## Étape 1: Backup de la base de données

### Via Supabase Dashboard:

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Database** → **Backups**
4. Créez un backup manuel avant la migration

### Via SQL (alternative):

```sql
-- Export des données critiques
COPY (SELECT * FROM users) TO '/tmp/users_backup.csv' WITH CSV HEADER;
COPY (SELECT * FROM user_profiles) TO '/tmp/user_profiles_backup.csv' WITH CSV HEADER;
```

---

## Étape 2: Vérification de l'état actuel

### Vérifiez la structure actuelle:

```sql
-- Vérifier la table user_profiles actuelle
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'user_profiles';

-- Vérifier combien de profils existent
SELECT user_type, COUNT(*)
FROM user_profiles
GROUP BY user_type;

-- Vérifier les données dans profile_data JSONB
SELECT id, user_type, jsonb_pretty(profile_data)
FROM user_profiles
LIMIT 5;
```

---

## Étape 3: Application de la migration

### Option A: Via Supabase Dashboard SQL Editor (RECOMMANDÉ)

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor**
4. Créez une nouvelle query
5. Copiez TOUT le contenu de `supabase/migrations/002_complete_schema_phase1.sql`
6. Exécutez la query (cela peut prendre 30-60 secondes)

### Option B: Via psql (si vous avez accès)

```bash
# Récupérez votre connection string depuis Supabase Dashboard → Project Settings → Database
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres" \
  -f supabase/migrations/002_complete_schema_phase1.sql
```

---

## Étape 4: Vérification post-migration

### Vérifiez que les nouvelles colonnes existent:

```sql
-- Vérifier les nouvelles colonnes de user_profiles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

-- Devrait montrer ~100 colonnes au lieu de ~5
```

### Vérifiez que les nouvelles tables existent:

```sql
-- Vérifier user_verifications
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'user_verifications';

-- Vérifier user_consents
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'user_consents';
```

### Vérifiez la migration des données:

```sql
-- Vérifier que les données ont été migrées depuis JSONB vers colonnes typées
SELECT
  id,
  user_type,
  first_name,
  last_name,
  nationality,
  budget_min,
  budget_max,
  cleanliness_preference
FROM user_profiles
WHERE first_name IS NOT NULL
LIMIT 10;

-- Si vous voyez des données, la migration a réussi!
```

### Vérifiez les indexes:

```sql
-- Vérifier les indexes créés
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('user_profiles', 'user_verifications', 'user_consents')
ORDER BY tablename, indexname;

-- Devrait montrer ~20 indexes
```

### Vérifiez les RLS policies:

```sql
-- Vérifier les policies RLS
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
WHERE tablename IN ('user_profiles', 'user_verifications', 'user_consents');
```

### Vérifiez les fonctions:

```sql
-- Vérifier que la fonction de calcul de complétion existe
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'calculate_profile_completion';

-- Tester la fonction
SELECT calculate_profile_completion('[USER_ID]');
-- Devrait retourner un pourcentage 0-100
```

---

## Étape 5: Test de l'application

### 1. Redémarrez l'application:

```bash
cd "/Users/samuelbaudon/Desktop/Easy Co/code/APP /easyco-onboarding"
npm run dev
```

### 2. Testez le flux d'onboarding Searcher:

1. Créez un nouveau compte
2. Choisissez "I'm looking for a place"
3. Complétez toutes les étapes du onboarding
4. Vérifiez que les données sont sauvegardées correctement

### 3. Vérifiez dans la base de données:

```sql
-- Vérifier que le nouveau profil est dans les colonnes typées
SELECT
  first_name,
  last_name,
  budget_min,
  budget_max,
  cleanliness_preference,
  is_smoker,
  has_pets
FROM user_profiles
WHERE user_id = '[NEW_USER_ID]';

-- PAS dans profile_data JSONB
```

### 4. Testez le flux d'onboarding Owner:

1. Créez un nouveau compte
2. Choisissez "I have a place to offer"
3. Complétez toutes les étapes
4. Vérifiez que les données owner sont sauvegardées

### 5. Testez les anciennes données:

1. Connectez-vous avec un compte existant (créé avant la migration)
2. Allez sur votre profil
3. Vérifiez que toutes vos anciennes données sont toujours présentes
4. Faites une modification et sauvegardez
5. Vérifiez que les données sont maintenant dans les colonnes typées

---

## Étape 6: Monitoring post-migration

### Surveillez les logs d'erreurs:

```sql
-- Checker les logs Supabase pour errors
-- Via Dashboard → Logs → Postgres Logs
```

### Surveillez les performances:

```sql
-- Vérifier les query les plus lentes
SELECT
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
WHERE query LIKE '%user_profiles%'
ORDER BY mean_time DESC
LIMIT 10;
```

---

## Rollback (en cas de problème)

### ⚠️ IMPORTANT: Ne faites le rollback QUE si vous rencontrez des problèmes critiques

### Rollback SQL:

```sql
-- 1. Restaurer depuis backup
-- Via Supabase Dashboard → Database → Backups → Restore

-- OU

-- 2. Supprimer les nouvelles colonnes (DESTRUCTIF!)
-- NE FAITES CECI QUE SI ABSOLUMENT NÉCESSAIRE

BEGIN;

-- Drop new tables
DROP TABLE IF EXISTS user_consents CASCADE;
DROP TABLE IF EXISTS user_verifications CASCADE;

-- Remove new columns from user_profiles
-- (Liste complète dans 002_complete_schema_phase1.sql)
-- NOTE: Ceci est TRÈS long, préférez restaurer depuis backup

ROLLBACK; -- ou COMMIT si vous êtes sûr
```

---

## Problèmes courants et solutions

### Problème 1: "column already exists"

**Cause**: La migration a déjà été partiellement appliquée

**Solution**:
```sql
-- Vérifiez quelles colonnes existent déjà
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'user_profiles';

-- Si beaucoup de colonnes typées existent déjà, la migration est OK
```

### Problème 2: "permission denied"

**Cause**: Vous n'avez pas les droits d'admin sur la base

**Solution**:
- Utilisez le Supabase Dashboard SQL Editor (a les droits automatiquement)
- OU contactez l'admin du projet Supabase

### Problème 3: "timeout"

**Cause**: La migration prend trop de temps (beaucoup de données existantes)

**Solution**:
```sql
-- Augmentez le timeout
SET statement_timeout = '300000'; -- 5 minutes

-- Puis relancez la migration
```

### Problème 4: Les données ne migrent pas du JSONB

**Cause**: Le script de migration des données a échoué

**Solution**:
```sql
-- Relancez manuellement la migration des données
-- (Section du script 002_complete_schema_phase1.sql qui commence par "-- Migrate existing data")

UPDATE user_profiles
SET
  first_name = profile_data->>'firstName',
  last_name = profile_data->>'lastName',
  date_of_birth = (profile_data->>'dateOfBirth')::DATE,
  -- ... etc (voir script complet)
WHERE profile_data IS NOT NULL
AND profile_data != '{}'::jsonb;
```

---

## Prochaines étapes après migration réussie

1. ✅ Migration Phase 1 complétée
2. ⏳ Tester tous les flux d'onboarding
3. ⏳ Créer Phase 2 migration (properties, matches, messages)
4. ⏳ Implémenter matching algorithm avec données typées
5. ⏳ Créer analytics dashboard utilisant les colonnes typées

---

## Support

Si vous rencontrez des problèmes:

1. Vérifiez les logs Supabase Dashboard → Logs
2. Vérifiez les logs de l'application Next.js
3. Consultez `SUPABASE_ARCHITECTURE_COMPLETE.md` pour détails techniques
4. En dernier recours, restaurez depuis le backup

---

## Résumé des changements

### Avant (JSONB Blob Antipattern):
```sql
user_profiles:
- id, user_id, user_type, profile_data JSONB

profile_data contient TOUT (❌ Non requêtable)
```

### Après (Typed Columns - Data-Centric):
```sql
user_profiles:
- 100+ colonnes typées (✅ Requêtable)
- first_name, last_name, budget_min, budget_max, etc.

user_verifications:
- KYC, email_verified, phone_verified, etc.

user_consents:
- GDPR compliant consent tracking
```

### Bénéfices:

1. ✅ **Queries SQL puissantes** - `WHERE budget_min >= 500 AND budget_max <= 1000`
2. ✅ **Matching algorithm** - Calculs de compatibilité sur données structurées
3. ✅ **Analytics** - Business intelligence et reporting
4. ✅ **Performance** - Indexes sur colonnes les plus utilisées
5. ✅ **Type safety** - PostgreSQL valide les types automatiquement
6. ✅ **Scalabilité** - Prêt pour des millions d'utilisateurs

---

**Migration créée le**: 26 Octobre 2025
**Version**: Phase 1 - Core Onboarding Data
**Statut**: Ready for production
