# Property Card Matching Badge

Le composant `PropertyCard` affiche maintenant un badge de matching lorsqu'un profil de chercheur (searcher) est fourni.

## Utilisation

### Avec le profil du chercheur (nouveau)

```tsx
import PropertyCard from '@/components/PropertyCard';
import type { PropertySearcherProfile } from '@/lib/services/property-matching-service';

const searcherProfile: PropertySearcherProfile = {
  // ... profil du chercheur connecté
  min_budget: 500,
  max_budget: 800,
  preferred_neighborhoods: ['Paris 11', 'Paris 10'],
  required_amenities: ['wifi', 'washing_machine'],
  // ... autres champs
};

<PropertyCard
  property={property}
  residents={residents}
  searcherProfile={searcherProfile} // Active le matching automatique
/>
```

### Comportement du badge

Le badge de matching s'affiche automatiquement quand `searcherProfile` est fourni :

1. **Score fiable** : Badge coloré avec pourcentage
   - 85-100% : Badge vert (Perfect Match)
   - 70-84% : Badge bleu (Excellent Match)
   - 55-69% : Badge jaune (Good Match)
   - 40-54% : Badge orange (Fair Match)
   - 0-39% : Badge rouge (Low Match)

2. **Profil incomplet** : Badge "Complétez votre profil"
   - Affiché quand le profil du chercheur manque de données critiques
   - Encourage l'utilisateur à remplir son profil

## Design V1 Flat

Le badge utilise le design V1 Flat avec :
- Couleurs plates (`bg-{color}-100` / `text-{color}-700`)
- Pas de dégradés
- Ombres légères (`shadow-md` ou `shadow-lg`)

## Variantes

### Compact
```tsx
<PropertyCard
  variant="compact"
  property={property}
  searcherProfile={searcherProfile}
/>
```
Badge plus petit (`text-xs`, `px-3 py-1`)

### Default
```tsx
<PropertyCard
  variant="default"
  property={property}
  searcherProfile={searcherProfile}
/>
```
Badge plus grand (`text-sm`, `px-4 py-2`)

## Rétrocompatibilité

Le composant reste compatible avec l'ancien système de score manuel :

```tsx
<PropertyCard
  property={property}
  showCompatibilityScore={true}
  compatibilityScore={85}
/>
```

Si `searcherProfile` et `compatibilityScore` sont tous deux fournis, le score calculé automatiquement prend la priorité.

## Données manquantes = 0 points

Conformément à la spécification, les données manquantes comptent comme 0 points dans l'algorithme de matching. Cela pousse :
- Les **résidents** à remplir leur profil lifestyle
- Les **propriétaires** à compléter les informations de la propriété

### Exemple d'impact

```typescript
// Propriété avec données complètes
{
  monthly_rent: 700,
  bedrooms: 5,
  amenities: ['wifi', 'washing_machine', 'gym'],
  smoking_allowed: false,
  pets_allowed: true,
  furnished: true,
  // ... etc
}
// Score élevé si match avec searcher

// Propriété avec données manquantes
{
  monthly_rent: 700,
  bedrooms: 5,
  amenities: [], // Vide = 0 pts
  smoking_allowed: null, // Manquant = 0 pts
  // ... etc
}
// Score plus faible même si budget/location match
```

## Notes techniques

- L'algorithme de matching est dans `/lib/services/property-matching-service.ts`
- Documentation complète : `/lib/services/PROPERTY_MATCHING_README.md`
- Tests unitaires : `/lib/services/__tests__/property-matching-service.test.ts`
- Le badge utilise `useMemo` pour optimiser le calcul du score
