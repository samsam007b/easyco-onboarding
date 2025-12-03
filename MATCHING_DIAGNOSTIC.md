# 🔍 Diagnostic du Système de Matching

**Date**: 2025-01-03
**Status**: ❌ PROBLÈME IDENTIFIÉ

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

## 📋 Plan d'Action Recommandé

### Étape 1: Court Terme (Aujourd'hui)
1. ✅ Créer script de sync: `scripts/sync-matching-data.ts`
2. Exécuter le script pour tester
3. Vérifier que le matching fonctionne après sync

### Étape 2: Moyen Terme (Cette Semaine)
1. Modifier `BrowseContent.tsx` pour lire `user_matching_profiles`
2. Modifier `use-matching.ts` pour lire `user_matching_profiles`
3. Tester le matching end-to-end
4. Supprimer la dépendance à `user_profiles` pour les searchers

### Étape 3: Long Terme (Prochaine Sprint)
1. Décider: unifier les tables ou garder séparé?
2. Si unification: migrer l'onboarding QUICK vers `user_profiles`
3. Documenter l'architecture finale
4. Mettre à jour les tests

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
