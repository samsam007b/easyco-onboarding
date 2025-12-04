# Guide - Table user_matching_profiles

## ⚠️ Important

**Status actuel**: ❌ Table NON créée - nous utilisons uniquement `user_profiles`

Ce guide explique comment créer la table `user_matching_profiles` si vous décidez d'utiliser l'approche **deux tables** au lieu de l'approche **table unique** actuellement implémentée.

---

## Context

### Problème Initial
- Onboarding QUICK sauvegardait dans `user_matching_profiles` (table inexistante)
- Matching algorithm lisait depuis `user_profiles` (table existante)
- Résultat: **Matching ne fonctionnait pas**

### Solutions Possibles

#### Option A: Table Unique (✅ IMPLÉMENTÉ)
```
Onboarding QUICK → user_profiles (avec aliases)
Onboarding CORE → user_profiles
Matching Algorithm → user_profiles
```

**Avantages**:
- ✅ Simple et unifié
- ✅ Pas de synchronisation nécessaire
- ✅ Utilise une table existante
- ✅ Matching fonctionne immédiatement

**Status**: ✅ **C'est la solution actuellement en place**

#### Option B: Deux Tables (❌ Non implémenté)
```
Onboarding QUICK → user_matching_profiles
Onboarding CORE → user_profiles
Matching Algorithm → user_matching_profiles (avec fallback)
```

**Avantages**:
- Séparation des données QUICK et CORE
- Schéma plus simple pour matching

**Inconvénients**:
- Plus complexe
- Nécessite synchronisation
- Migration requise

---

## Si Vous Voulez Créer la Table user_matching_profiles

### Étape 1: Appliquer la Migration SQL

**Fichier disponible**: `supabase/migrations/20250103_create_user_matching_profiles.sql`

#### Méthode 1: Via Supabase CLI (Recommandé)

```bash
# 1. Vérifier la connexion
npx supabase status

# 2. Appliquer la migration
npx supabase db push

# 3. Vérifier que la table est créée
npx tsx -e "
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const { data, error } = await supabase
  .from('user_matching_profiles')
  .select('count')
  .limit(1);

if (error) {
  console.log('❌ Table does NOT exist:', error.message);
} else {
  console.log('✅ Table exists!');
}
"
```

#### Méthode 2: Via le Dashboard Supabase

1. Aller sur [https://app.supabase.com](https://app.supabase.com)
2. Sélectionner votre projet
3. Aller dans **SQL Editor**
4. Copier-coller le contenu de `supabase/migrations/20250103_create_user_matching_profiles.sql`
5. Exécuter la requête
6. Vérifier le succès dans les logs

#### Méthode 3: Via psql

```bash
# Se connecter à votre base de données
psql "postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres"

# Exécuter la migration
\i supabase/migrations/20250103_create_user_matching_profiles.sql

# Vérifier
\dt user_matching_profiles
\d user_matching_profiles
```

### Étape 2: Reverser les Changements d'Onboarding

Si vous créez la table, vous devez reverser les modifications qui sauvegardent dans `user_profiles`:

#### Fichiers à Modifier

##### 1. `app/onboarding/searcher/quick/budget-location/page.tsx`

**Changements à faire**:

```typescript
// AVANT (actuel - sauvegarde dans user_profiles)
const { data: profile } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', user.id)
  .single();

// APRÈS (si vous voulez user_matching_profiles)
const { data: matchingProfile } = await supabase
  .from('user_matching_profiles')
  .select('*')
  .eq('user_id', user.id)
  .single();
```

Et pour la sauvegarde:

```typescript
// AVANT (actuel)
await supabase.from('user_profiles').upsert({
  user_id: user.id,
  min_budget: minBudget,
  max_budget: maxBudget,
  preferred_cities: [preferredCity.trim()],
  // ...
});

// APRÈS
await supabase.from('user_matching_profiles').upsert({
  user_id: user.id,
  min_budget: minBudget,
  max_budget: maxBudget,
  preferred_city: preferredCity.trim(), // Note: string, pas array
  // ...
});
```

##### 2. `app/onboarding/searcher/quick/lifestyle/page.tsx`

**Changements similaires**: Remplacer `user_profiles` par `user_matching_profiles`

##### 3. Autres fichiers QUICK à modifier
- `app/onboarding/searcher/quick/availability/page.tsx`
- `app/onboarding/searcher/quick/basic-info/page.tsx`
- Tous les autres steps QUICK

### Étape 3: Modifier BrowseContent (Déjà fait)

Le fichier `components/browse/BrowseContent.tsx` a déjà le code pour lire depuis `user_matching_profiles` avec fallback (commit `b8d6939`).

Vous n'avez rien à faire ici.

### Étape 4: Synchroniser les Données Existantes

Si vous avez des utilisateurs qui ont déjà complété le QUICK onboarding:

```bash
# Option 1: Script de sync (créé mais non testé)
npx tsx scripts/sync-matching-data.ts

# Option 2: SQL manuel
```

```sql
-- Copier les données de user_profiles vers user_matching_profiles
INSERT INTO user_matching_profiles (
  user_id,
  min_budget,
  max_budget,
  preferred_city,
  is_smoker,
  has_pets,
  cleanliness_level
)
SELECT
  user_id,
  COALESCE(min_budget, budget_min) as min_budget,
  COALESCE(max_budget, budget_max) as max_budget,
  COALESCE(preferred_cities[1], current_city) as preferred_city,
  COALESCE(is_smoker, smoking) as is_smoker,
  COALESCE(has_pets, pets) as has_pets,
  cleanliness_level
FROM user_profiles
WHERE user_type = 'searcher'
ON CONFLICT (user_id) DO UPDATE SET
  min_budget = EXCLUDED.min_budget,
  max_budget = EXCLUDED.max_budget,
  preferred_city = EXCLUDED.preferred_city,
  updated_at = NOW();
```

---

## Comparaison des Approches

| Aspect | Table Unique (Actuel) | Deux Tables |
|--------|----------------------|-------------|
| **Complexité** | Simple | Plus complexe |
| **Code à modifier** | 2 fichiers | ~6 fichiers |
| **Synchronisation** | Aucune | Nécessaire |
| **Migration DB** | Aucune | Requise |
| **Performance** | Meilleure | Légèrement moins bonne |
| **Maintenance** | Facile | Plus difficile |
| **Risque** | Faible | Moyen |

---

## Recommandation

**❌ NE PAS créer la table user_matching_profiles**

**Raisons**:
1. ✅ La solution actuelle (table unique) fonctionne
2. ✅ Plus simple à maintenir
3. ✅ Pas de synchronisation nécessaire
4. ✅ Évite la duplication de données
5. ✅ Support des aliases pour compatibilité

**Gardez l'approche table unique** sauf si vous avez une raison très spécifique de vouloir séparer les données.

---

## Vérification de l'État Actuel

### Vérifier quelle table est utilisée

```bash
# Script de diagnostic
npx tsx scripts/check-matching-tables.ts
```

### Vérifier où les données sont sauvegardées

```bash
# Tester avec un nouvel utilisateur
# 1. Créer un compte
# 2. Compléter onboarding QUICK
# 3. Vérifier dans la DB

npx tsx -e "
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Vérifier user_profiles
const { data: profiles } = await supabase
  .from('user_profiles')
  .select('user_id, min_budget, max_budget, preferred_cities')
  .limit(5);

console.log('📊 user_profiles:', profiles?.length || 0, 'records');
if (profiles) console.log(profiles);

// Vérifier user_matching_profiles
const { data: matching, error } = await supabase
  .from('user_matching_profiles')
  .select('user_id, min_budget, max_budget, preferred_city')
  .limit(5);

if (error) {
  console.log('❌ user_matching_profiles: Table does NOT exist');
} else {
  console.log('📊 user_matching_profiles:', matching?.length || 0, 'records');
  if (matching) console.log(matching);
}
"
```

---

## Schéma de la Table user_matching_profiles

Si vous décidez quand même de la créer, voici le schéma:

```sql
CREATE TABLE user_matching_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic info
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'non-binary', 'prefer-not-to-say')),

  -- Budget & Location (REQUIRED for matching)
  min_budget INTEGER,
  max_budget INTEGER,
  preferred_city TEXT,
  preferred_neighborhoods TEXT[],

  -- Room preferences
  preferred_room_type TEXT,
  min_bedrooms INTEGER,
  furnished_required BOOLEAN,

  -- Lifestyle
  is_smoker BOOLEAN,
  has_pets BOOLEAN,
  cleanliness_level INTEGER CHECK (cleanliness_level >= 1 AND cleanliness_level <= 10),
  social_energy INTEGER CHECK (social_energy >= 1 AND social_energy <= 10),

  -- Compatibility
  wake_up_time TEXT,
  sleep_time TEXT,
  smoking_tolerance TEXT CHECK (smoking_tolerance IN ('no', 'outside-only', 'yes')),
  pets_tolerance TEXT CHECK (pets_tolerance IN ('no', 'small-pets', 'all-pets')),

  -- Amenities & Values
  required_amenities TEXT[],
  preferred_amenities TEXT[],
  core_values TEXT[],

  -- Availability
  desired_move_in_date DATE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

Voir le fichier complet: `supabase/migrations/20250103_create_user_matching_profiles.sql`

---

## Support

Si vous avez des questions:

1. Consulter `MATCHING_DIAGNOSTIC.md` pour l'analyse complète
2. Vérifier les scripts de diagnostic dans `scripts/`
3. Lire la migration SQL dans `supabase/migrations/`
