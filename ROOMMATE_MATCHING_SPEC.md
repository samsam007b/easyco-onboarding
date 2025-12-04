# Spécification - Matching Colocataires

## 📋 Vue d'Ensemble

**Objectif**: Calculer la compatibilité entre un searcher et les résidents d'une propriété

**Philosophie**:
- ✅ Filtres = Caractéristiques physiques du logement (prix, ville, chambres...)
- ✅ Matching = Compatibilité sociale avec les colocataires

## 🎯 Système de Scoring

### Score Total: 0-100 points

1. **Lifestyle Compatibility** (30 points)
   - Cleanliness: 12 points
   - Noise tolerance: 10 points
   - Guest frequency: 8 points

2. **Schedule Compatibility** (20 points)
   - Wake up time: 8 points
   - Sleep time: 8 points
   - Work schedule: 4 points

3. **Social Compatibility** (20 points)
   - Social energy: 10 points
   - Shared meals interest: 3 points
   - Shared activities: 3 points
   - Communication style: 4 points

4. **Values Alignment** (15 points)
   - Core values overlap: 10 points
   - Priorities overlap: 5 points

5. **Habits Compatibility** (15 points)
   - Smoking: 5 points
   - Pets: 4 points
   - Cooking: 3 points
   - Alcohol: 3 points

### Niveaux de Compatibilité

- **Excellent** (80-100): Très compatibles! 🌟
- **Good** (65-79): Bonne compatibilité ✨
- **Fair** (50-64): Compatibilité moyenne 👍
- **Low** (<50): Faible compatibilité ⚠️

## 📊 Architecture des Données

### Phase 1: Utiliser le Propriétaire Comme Résident

**Tables actuelles:**
- `user_profiles` → Profil du searcher
- `properties` → Propriétés avec `owner_id`
- `users` → Propriétaire (via `owner_id`)

**Mapping:**
```typescript
// Searcher profile
{
  cleanliness_level: user_profiles.cleanliness_preference,
  social_energy: user_profiles.sociability_level,
  smoking: user_profiles.smoker || user_profiles.is_smoker,
  // ...
}

// Propriétaire = Résident temporaire
{
  user_id: properties.owner_id,
  cleanliness_level: owner_profile.cleanliness_preference,
  // ...
}
```

### Phase 2: Table Résidents Dédiée (Future)

```sql
CREATE TABLE property_residents (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  user_id UUID REFERENCES auth.users(id),
  is_primary BOOLEAN, -- Owner ou résident principal
  move_in_date DATE,
  move_out_date DATE,
  room_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔄 Flux de Données

### BrowseContent

```typescript
// 1. Charger profil du searcher
const searcherProfile = loadSearcherProfile(userId);

// 2. Pour chaque propriété
properties.forEach(property => {
  // 2a. Charger résidents (Phase 1: owner only)
  const residents = [loadOwnerProfile(property.owner_id)];

  // 2b. Calculer compatibilité
  const matchResult = calculatePropertyRoommateCompatibility(
    searcherProfile,
    residents
  );

  // 2c. Afficher score
  property.roommateMatch = matchResult;
});
```

### PropertyCard

```typescript
// Afficher badge de compatibilité
<Badge color={matchResult.compatibilityLevel}>
  {matchResult.averageScore}% Match
</Badge>

// Au clic, modal avec détails
<Modal>
  <h3>Compatibilité avec les Résidents</h3>

  <OverallScore>{matchResult.averageScore}%</OverallScore>

  <Breakdown>
    Lifestyle: {matchResult.breakdown.lifestyle}/30
    Schedule: {matchResult.breakdown.schedule}/20
    Social: {matchResult.breakdown.social}/20
    Values: {matchResult.breakdown.values}/15
    Habits: {matchResult.breakdown.habits}/15
  </Breakdown>

  <Strengths>
    {matchResult.strengths.map(s => <li>{s}</li>)}
  </Strengths>

  <Concerns>
    {matchResult.concerns.map(c => <li>{c}</li>)}
  </Concerns>
</Modal>
```

## 📋 Mapping des Colonnes

### user_profiles → RoommateProfile

| RoommateProfile Field | user_profiles Column | Fallback |
|-----------------------|---------------------|----------|
| cleanliness_level | cleanliness_preference | cleanliness_expectation |
| noise_tolerance | - | 5 (default) |
| guest_frequency | guest_frequency | 'rarely' |
| wake_up_time | wake_up_time | 'normal' |
| sleep_time | sleep_time | 'normal' |
| work_schedule | work_schedule | 'traditional' |
| social_energy | sociability_level | social_energy |
| shared_meals_interest | shared_meals_interest | false |
| shared_activities_interest | - | false |
| communication_style | communication_style | 'casual' |
| core_values | core_values | [] |
| priorities | - | [] |
| smoking | smoker \|\| is_smoker | false |
| pets | has_pets | false |
| cooking_frequency | cooking_frequency | 'sometimes' |
| drinks_alcohol | drinks_alcohol | false |
| hobbies | hobbies | [] |
| interests | interests | [] |
| languages_spoken | languages_spoken | [] |

## 🧪 Tests à Effectuer

### Test 1: Excellent Match
```typescript
searcher = {
  cleanliness_level: 8,
  social_energy: 7,
  smoking: false,
  pets: false,
}

resident = {
  cleanliness_level: 8,
  social_energy: 6,
  smoking: false,
  pets: false,
}

// Expected: 80-90% match
```

### Test 2: Low Match
```typescript
searcher = {
  cleanliness_level: 9,
  social_energy: 2,
  smoking: false,
  wake_up_time: 'early',
}

resident = {
  cleanliness_level: 3,
  social_energy: 9,
  smoking: true,
  wake_up_time: 'late',
}

// Expected: 20-40% match
```

### Test 3: No Data
```typescript
searcher = {} // Profil vide
resident = {} // Profil vide

// Expected: ~50% (neutral scores)
```

## 📝 TODO List

### Phase 1: Implémentation de Base
- [x] Créer `roommate-matching-service.ts`
- [ ] Créer helper function `mapUserProfileToRoommateProfile()`
- [ ] Modifier BrowseContent pour charger owner profile
- [ ] Calculer compatibilité pour chaque propriété
- [ ] Modifier PropertyCard pour afficher score
- [ ] Créer composant MatchScoreBreakdown (modal détails)
- [ ] Tester avec données réelles

### Phase 2: Table Résidents
- [ ] Créer migration `property_residents`
- [ ] Ajouter UI pour gérer résidents
- [ ] Modifier BrowseContent pour charger tous les résidents
- [ ] Afficher compatibilité individuelle avec chaque résident

### Phase 3: Amélioration
- [ ] Ajouter weights personnalisables (importance des critères)
- [ ] Système de "dealbreakers" configurables
- [ ] Filtrer propriétés par score minimum
- [ ] Trier propriétés par compatibilité

## 🎨 UI/UX

### PropertyCard Badge
```
┌─────────────────────┐
│ Appartement 2 Ch... │
│                     │
│ €1250/mois          │
│                     │
│ [85% Match 🌟]     │ ← Badge de compatibilité
└─────────────────────┘
```

### Modal Détails
```
Compatibilité avec les Résidents
─────────────────────────────────

Score Global: 85% 🌟

┌──────────────────────────┐
│ Lifestyle      ████████░ 27/30 │
│ Schedule       ███████░░ 16/20 │
│ Social         ████████░ 18/20 │
│ Values         ██████░░░ 12/15 │
│ Habits         ███████░░ 12/15 │
└──────────────────────────┘

✨ Points Forts
• Même niveau de propreté (8/10)
• Rythmes de vie similaires
• Energie sociale alignée

⚠️ Points d'Attention
• Différences de cuisine

[Voir les Résidents]
```

## 🔒 Privacy & Sécurité

- ✅ Ne jamais exposer l'identité complète des résidents
- ✅ Montrer seulement prénom + première lettre du nom
- ✅ Scores agrégés pour les propriétés avec plusieurs résidents
- ✅ Option pour résidents de masquer leur profil du matching

## 📈 Métriques

### KPIs à Suivre
- Distribution des scores (combien d'excellent vs low matches?)
- Corrélation score → visites demandées
- Corrélation score → contracts signés
- Feedback utilisateurs sur la pertinence

### A/B Tests
- Avec vs sans matching scores
- Différents seuils de compatibilité
- Poids des critères (lifestyle vs schedule vs social)
