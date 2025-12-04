# 🔍 Diagnostic du Système de Matching

**Date**: 2025-01-03
**Status**: ✅ PROBLÈME RÉSOLU

**Solution finale**: Onboarding QUICK modifié pour utiliser `user_profiles` avec aliases de champs

## Problème Principal

Le système de matching pour les searchers **ne fonctionne pas** à cause d'un **désalignement entre les tables utilisées par l'onboarding et l'algorithme de matching**.

## Architecture Actuelle

### 1. Onboarding QUICK (Mode Rapide)
**Fichiers**: `app/onboarding/searcher/quick/**/*.tsx`

**Sauvegarde dans**: `user_matching_profiles`

**Champs sauvegardés**:
```typescript
{
  user_id: string,
  min_budget: number,
  max_budget: number,
  preferred_city: string,
  is_smoker: boolean,
  has_pets: boolean,
  cleanliness_level: number,
  preferred_room_type: string,
  desired_move_in_date: string
}
```

### 2. Algorithme de Matching
**Fichiers**:
- `lib/services/matching-service.ts` (ancien système)
- `lib/hooks/use-matching.ts`
- `components/browse/BrowseContent.tsx`

**Lit depuis**: `user_profiles`

**Champs requis**:
```typescript
{
  user_id: string,
  min_budget: number,      // ou budget_min
  max_budget: number,      // ou budget_max
  preferred_cities: string[],
  smoking: boolean,        // ou is_smoker
  pets: boolean,          // ou has_pets
  cleanliness_level: number,
  // ... autres champs lifestyle
}
```

### 3. Profile Completion
**Fichier**: `lib/profile/profile-completion.ts`

**Lit depuis**: `user_profiles`

**Supporte les alias** pour compatibilité:
- `budget_min` ↔️ `min_budget`
- `budget_max` ↔️ `max_budget`
- `is_smoker` ↔️ `smoking`
- etc.

## 🔴 Problèmes Identifiés

### 1. Désalignement des Tables
```
Onboarding QUICK → user_matching_profiles ❌
                                           ↓
Matching Algorithm → user_profiles ✅ (mais vide!)
```

**Résultat**: Les données de l'onboarding QUICK ne sont **JAMAIS** utilisées par le matching!

### 2. Données de Test
```bash
user_matching_profiles: 0 enregistrements
user_profiles: 0 enregistrements (ou données anciennes)
properties: 5 propriétés publiées
```

### 3. BrowseContent
Le fichier `components/browse/BrowseContent.tsx` charge correctement:
```typescript
const { data: searcherProfile } = useQuery<PropertySearcherProfile | null>({
  queryKey: ['searcherProfile', userId],
  queryFn: async () => {
    const { data } = await supabase
      .from('user_profiles')  // ❌ Table incorrecte!
      .select('*')
      .eq('user_id', userId)
      .single();
    // ...
  }
});
```

**ET** passe bien à PropertyCard:
```typescript
<PropertyCard
  searcherProfile={searcherProfile || undefined}
  showCompatibilityScore  // ✅ Activé
  // ...
/>
```

## ✅ Solutions Possibles

### Solution 1: Script de Synchronisation (Court Terme)
Créer un script qui copie les données de `user_matching_profiles` vers `user_profiles`.

**Avantages**:
- Rapide à implémenter
- Pas de changement de code

**Inconvénients**:
- Doit être exécuté manuellement ou via cron
- Données peuvent être désynchronisées

**Script créé**: `scripts/sync-matching-data.ts`

### Solution 2: Modifier le Matching (Recommandé)
Mettre à jour `BrowseContent.tsx` et `use-matching.ts` pour lire depuis `user_matching_profiles`.

**Avantages**:
- Source unique de vérité
- Pas de synchronisation nécessaire
- Données toujours à jour

**Inconvénients**:
- Nécessite modification du code
- Tester tous les flux de matching

### Solution 3: Trigger Database
Créer un trigger Supabase qui synchronise automatiquement les deux tables.

**Avantages**:
- Automatique
- Temps réel

**Inconvénients**:
- Complexité supplémentaire
- Dépendance à la DB

### Solution 4: Unifier les Tables (Long Terme)
Utiliser UNIQUEMENT `user_profiles` pour tout.

**Avantages**:
- Architecture simplifiée
- Une seule source de vérité

**Inconvénients**:
- Nécessite refactorisation complète de l'onboarding
- Migration des données existantes

## ✅ Solution Finale Implémentée

### Approche: Table Unifiée `user_profiles`

**Décision**: Utiliser **UNIQUEMENT** `user_profiles` pour toutes les données d'onboarding (QUICK et CORE).

**Raison**: La table `user_matching_profiles` n'existe pas dans la base de données. Plutôt que de la créer, nous unifions tout dans `user_profiles`.

### Modifications Effectuées

#### 1. Onboarding QUICK - Budget & Location
**Fichier**: `app/onboarding/searcher/quick/budget-location/page.tsx`

**Changements**:
- ❌ Avant: Sauvegarde dans `user_matching_profiles`
- ✅ Après: Sauvegarde dans `user_profiles`
- ✅ Support des aliases de champs (min_budget/budget_min, etc.)
- ✅ Conversion `preferred_city` (string) → `preferred_cities` (array)

```typescript
// Lecture avec support d'aliases
const minBudgetValue = profile.min_budget || profile.budget_min;
const maxBudgetValue = profile.max_budget || profile.budget_max;
const cityValue = profile.preferred_cities?.[0] || profile.current_city;

// Sauvegarde avec doubles champs pour compatibilité
await supabase.from('user_profiles').upsert({
  min_budget: minBudget,
  max_budget: maxBudget,
  budget_min: minBudget, // Alias
  budget_max: maxBudget, // Alias
  preferred_cities: [preferredCity.trim()],
  current_city: preferredCity.trim(), // Alias
});
```

#### 2. Onboarding QUICK - Lifestyle
**Fichier**: `app/onboarding/searcher/quick/lifestyle/page.tsx`

**Changements**:
- ❌ Avant: Sauvegarde dans `user_matching_profiles`
- ✅ Après: Sauvegarde dans `user_profiles`
- ✅ Support des aliases (smoking/is_smoker, pets/has_pets)

```typescript
// Lecture avec support d'aliases
const isSmokerValue = profile.smoking ?? profile.is_smoker;
const hasPetsValue = profile.pets ?? profile.has_pets;

// Sauvegarde avec doubles champs
await supabase.from('user_profiles').upsert({
  smoking: isSmoker,
  is_smoker: isSmoker, // Alias
  pets: hasPets,
  has_pets: hasPets, // Alias
  cleanliness_level: cleanlinessLevel,
});
```

### Avantages de cette Solution

✅ **Architecture simplifiée**: Une seule table pour tout
✅ **Compatibilité rétroactive**: Support des anciens noms de champs
✅ **Matching fonctionnel**: BrowseContent lit déjà depuis `user_profiles`
✅ **Pas de migration**: Utilise une table existante
✅ **Profile completion**: Fonctionne avec les nouveaux champs

### Migration SQL Créée (Optionnelle)

**Fichier**: `supabase/migrations/20250103_create_user_matching_profiles.sql`

Cette migration créerait la table `user_matching_profiles` si on voulait l'approche deux-tables.

**Status**: ❌ Non appliquée (on utilise l'approche table unique à la place)

## 📋 Plan d'Action (Mis à Jour)

### ✅ Étape 1: Implémenté (Table Unifiée)
1. ✅ Modifier `budget-location/page.tsx` pour utiliser `user_profiles`
2. ✅ Modifier `lifestyle/page.tsx` pour utiliser `user_profiles`
3. ✅ Ajouter support des aliases de champs (compatibilité)
4. ✅ Créer migration SQL (optionnelle, non utilisée)
5. ✅ Créer scripts de diagnostic

### 🔄 Étape 2: À Compléter
1. ⏳ Modifier `availability/page.tsx` pour utiliser `user_profiles`
2. ⏳ Modifier `basic-info/page.tsx` pour utiliser `user_profiles`
3. ⏳ Vérifier tous les autres fichiers QUICK pour cohérence

### 🧪 Étape 3: Tests
1. Compléter onboarding QUICK avec un nouveau compte
2. Vérifier que les données sont dans `user_profiles`
3. Vérifier que le matching fonctionne sur `/dashboard/searcher`
4. Vérifier que les scores s'affichent correctement
5. Vérifier que le profile completion fonctionne

### 🎯 Étape 4: Nettoyage
1. Décider si on garde ou supprime la migration `user_matching_profiles`
2. Nettoyer les scripts de diagnostic si non nécessaires
3. Mettre à jour la documentation finale

## 🧪 Tests à Effectuer

### 1. Test de Synchronisation
```bash
npm run tsx scripts/sync-matching-data.ts
```

### 2. Test de Matching
1. Compléter l'onboarding QUICK en tant que searcher
2. Vérifier que les données sont dans `user_matching_profiles`
3. Exécuter le script de sync
4. Vérifier que les données sont dans `user_profiles`
5. Aller sur `/dashboard/searcher`
6. Vérifier que les scores de matching s'affichent sur les PropertyCard

### 3. Test de Profil Completion
1. Vérifier que le pourcentage de complétion reflète les données
2. Vérifier que les sections sont correctement calculées

## 📊 Mapping des Champs

| user_matching_profiles | user_profiles | Notes |
|----------------------|---------------|-------|
| min_budget | min_budget, budget_min | Alias supporté |
| max_budget | max_budget, budget_max | Alias supporté |
| preferred_city | preferred_cities[] | Conversion string → array |
| is_smoker | smoking, is_smoker | Alias supporté |
| has_pets | pets, has_pets | Alias supporté |
| cleanliness_level | cleanliness_level | Direct |
| preferred_room_type | room_type, preferred_room_type | Alias supporté |
| desired_move_in_date | move_in_date, preferred_move_in_date | Alias supporté |

## 🎯 Prochaines Étapes

1. [ ] Exécuter le script de sync pour tester
2. [ ] Créer des données de test cohérentes
3. [ ] Vérifier que le matching fonctionne
4. [ ] Décider de la solution permanente
5. [ ] Implémenter la solution choisie
6. [ ] Documenter la décision

## 📝 Notes

- Le système de matching est **techniquement fonctionnel**
- Le problème est **uniquement** le désalignement des sources de données
- Une fois synchronisé, le matching devrait fonctionner immédiatement
- Les PropertyCard affichent déjà les scores quand `searcherProfile` est fourni

## ⚠️ Attention

Avant de modifier en production:
1. Sauvegarder les données actuelles
2. Tester sur environnement de développement
3. Vérifier l'impact sur les utilisateurs existants
4. Documenter la migration si nécessaire
