# Property Matching Service

Service de matching entre propriétés et searchers, combinant les préférences de filtres de propriété avec la compatibilité des résidents.

## Vue d'ensemble

L'algorithme de matching de propriétés calcule un score de compatibilité (0-100%) entre une propriété et un searcher en tenant compte de:

1. **Property Filters Match (40 points)** - Critères de recherche de base
2. **Resident Compatibility (35 points)** - Compatibilité avec les résidents actuels
3. **Property Lifestyle Match (15 points)** - Règles de vie de la propriété
4. **Location & Practical (10 points)** - Disponibilité et localisation

## Système de scoring détaillé

### 1. Property Filters Match (0-40 points)

#### Budget (0-15 points) - CRITÈRE LE PLUS IMPORTANT
- **Parfait (15 pts)**: Loyer dans le budget
- **Bon (10-15 pts)**: En dessous du budget
- **Acceptable (5-10 pts)**: Jusqu'à 10% au-dessus du budget
- **Limite (0-5 pts)**: 10-20% au-dessus du budget
- **Dealbreaker (0 pts)**: Plus de 20% au-dessus du budget

#### Localisation (0-10 points)
- **Match (10 pts)**: Quartier dans les préférences
- **Pas de match (0 pts)**: Quartier non préféré

#### Type de propriété (0-7 points)
- **Match exact (7 pts)**: Type dans les préférences
- **Partiel (2 pts)**: Type différent mais acceptable

#### Chambres (0-5 points)
- **Parfait (5 pts)**: Nombre de chambres >= minimum requis
- **Pénalité**: -2 pts par chambre manquante

#### Meublé (0-3 points)
- **Requis ET meublé (3 pts)**: Parfait
- **Pas requis (3 pts)**: Indifférent
- **Requis MAIS non meublé (0 pts)**: Dealbreaker

#### Équipements requis (0-5 points)
- **Tous présents (5 pts)**: Parfait
- **Un manquant (0 pts)**: Dealbreaker

#### Équipements préférés (0-5 points)
- **Proportionnel**: (équipements présents / équipements préférés) × 5

### 2. Resident Compatibility (0-35 points)

Utilise l'algorithme de matching user-to-user existant pour calculer la compatibilité avec chaque résident, puis fait la moyenne.

- **Pas de résidents**: Score neutre de 18 points (~50%)
- **Avec résidents**: Moyenne des scores de compatibilité × 0.35

**Exemple**:
- Résident 1: 80% de compatibilité
- Résident 2: 70% de compatibilité
- Moyenne: 75%
- Score final: 75 × 0.35 = 26.25 points

### 3. Property Lifestyle Match (0-15 points)

#### Fumeur (0-7 points)
- **Fumeur + autorisé (7 pts)**: Parfait
- **Non-fumeur (7 pts)**: Indifférent
- **Fumeur + interdit (0 pts)**: Dealbreaker

#### Animaux (0-8 points)
- **A des animaux + autorisé (8 pts)**: Parfait
- **Pas d'animaux (8 pts)**: Indifférent
- **A des animaux + interdit (0 pts)**: Dealbreaker

### 4. Location & Practical (0-10 points)

#### Disponibilité (0-5 points)
- **Disponible maintenant (5 pts)**: Idéal
- **Disponible dans 30 jours (4 pts)**: Très bien
- **Disponible dans 60 jours (3 pts)**: Acceptable
- **Plus tard (1 pt)**: Limite

#### Durée minimale (0-5 points)
- **≤3 mois ou aucune (5 pts)**: Flexible
- **4-6 mois (3 pts)**: Modéré
- **>6 mois (1 pt)**: Engagement long

## Interprétation des scores

| Score | Label | Description |
|-------|-------|-------------|
| 85-100% | Perfect Match | Propriété idéale pour vous |
| 70-84% | Excellent Match | Fortement recommandé |
| 55-69% | Good Match | Vaut la peine d'être considéré |
| 40-54% | Fair Match | Compatibilité modérée |
| 0-39% | Low Match | Peut ne pas convenir |

## Utilisation

```typescript
import { calculatePropertySearcherMatch } from '@/lib/services/property-matching-service';
import type { PropertyWithResidents, PropertySearcherProfile } from '@/lib/services/property-matching-service';

// Préparer les données
const property: PropertyWithResidents = {
  // ... données de la propriété
  residents: [
    // ... profils des résidents actuels
  ]
};

const searcher: PropertySearcherProfile = {
  // ... profil du searcher
  min_budget: 500,
  max_budget: 800,
  preferred_neighborhoods: ['Paris 11', 'Paris 10'],
  required_amenities: ['wifi', 'washing_machine'],
  preferred_amenities: ['gym', 'balcony'],
  smoking: false,
  pets: false,
};

// Calculer le matching
const matchResult = calculatePropertySearcherMatch(property, searcher);

console.log(`Score: ${matchResult.score}%`);
console.log(`Breakdown:`, matchResult.breakdown);
console.log(`Strengths:`, matchResult.strengths);
console.log(`Considerations:`, matchResult.considerations);
console.log(`Dealbreakers:`, matchResult.dealbreakers);

// Voir les matchs individuels avec les résidents
matchResult.residentMatches?.forEach(match => {
  console.log(`${match.resident.first_name}: ${match.compatibilityScore}%`);
});
```

## Exemples de scénarios

### Scénario 1: Match Parfait (95%)
```typescript
Property:
  - Loyer: 700€ (budget: 500-800€) [OK]
  - Paris 11 (préféré) [OK]
  - Coliving (préféré) [OK]
  - 5 chambres (min 3 requis) [OK]
  - Meublé [OK]
  - WiFi + Machine à laver + Gym [OK]
  - Non-fumeur [OK]
  - Résidents: 85% compatibilité moyenne [OK]

Breakdown:
  - Property Filters: 38/40
  - Resident Compatibility: 30/35
  - Property Lifestyle: 15/15
  - Location & Practical: 10/10
```

### Scénario 2: Good Match avec considérations (65%)
```typescript
Property:
  - Loyer: 850€ (budget: 500-800€, +6% au-dessus) [WARN]
  - Paris 12 (pas dans les préférés) [WARN]
  - Appartement (coliving préféré) [WARN]
  - 4 chambres (min 3 requis) [OK]
  - Meublé [OK]
  - WiFi + Machine à laver (pas de gym) [OK]
  - Non-fumeur [OK]
  - Résidents: 70% compatibilité moyenne [WARN]

Breakdown:
  - Property Filters: 22/40
  - Resident Compatibility: 24/35
  - Property Lifestyle: 15/15
  - Location & Practical: 8/10

Considerations:
  - [WARN] Loyer 6% au-dessus du budget
  - [WARN] Quartier non préféré
  - [WARN] Type de propriété différent
```

### Scénario 3: Dealbreakers (25%)
```typescript
Property:
  - Loyer: 1000€ (budget: 500-800€, +25% au-dessus) [X]
  - Animaux interdits (searcher a un chien) [X]
  - Pas de WiFi (équipement requis) [X]

Breakdown:
  - Property Filters: 5/40
  - Resident Compatibility: 20/35
  - Property Lifestyle: 0/15 (animaux)
  - Location & Practical: 5/10

Dealbreakers:
  - Loyer très au-dessus du budget
  - Animaux non autorisés
  - Équipements requis manquants (WiFi)
```

## Intégration avec l'algorithme User-to-User

Le service réutilise directement `calculateUserCompatibility()` du service `user-matching-service.ts` pour calculer la compatibilité avec les résidents. Cela assure:

1. **Cohérence**: Même logique de matching pour users et properties
2. **Maintenabilité**: Améliorations du matching users profitent au matching properties
3. **Fiabilité**: Algorithme déjà testé et validé

## Notes techniques

### Fiabilité du score

Le score est considéré **fiable** si le searcher a rempli au minimum:
- Budget (min et max)
- 2 critères de lifestyle (cleanliness, social_energy, smoking, pets, etc.)

Si le profil est incomplet, `isScoreReliable: false` est retourné.

### Performance

- Complexité: O(n) où n = nombre de résidents
- Optimisation: Les résidents sont triés par score décroissant
- Cache: Peut être implémenté au niveau API/DB pour les propriétés populaires

### Évolutions futures possibles

1. **Machine Learning**: Apprendre des préférences réelles des users
2. **Pondération dynamique**: Ajuster les poids selon le type de searcher
3. **Facteur temps**: Pénaliser les propriétés longtemps indisponibles
4. **Score de confiance**: Basé sur le nombre de reviews/validations
5. **Géolocalisation précise**: Distance réelle vs préférences de quartier
