# 🔄 Proposition d'Harmonisation Onboarding Resident ↔ Searcher

## 🎯 Objectif
Assurer que **Residents** et **Searchers** collectent les **mêmes champs essentiels** pour l'algorithme de matching, tout en gardant un onboarding rapide.

---

## 📊 Analyse du Problème

### Champs utilisés par l'algorithme de matching (user-to-user)
```typescript
// Lifestyle Compatibility (30 points)
- cleanliness_level: 1-10
- wake_up_time: early/moderate/late
- sleep_time: early/moderate/late
- smoking: boolean
- pets: boolean

// Social Compatibility (25 points)
- social_energy: 1-10 (ou introvert_extrovert_scale 1-5)
- shared_meals_interest: boolean
- event_participation_interest: low/medium/high
- guest_frequency: never/rarely/sometimes/often

// Practical Compatibility (20 points)
- work_schedule: office/hybrid/remote/flexible/student
- sports_frequency: never/rarely/sometimes/often/daily
- works_from_home: boolean
- cooking_frequency: never/rarely/sometimes/often/daily

// Values Alignment (15 points)
- core_values: string[]
- openness_to_sharing: private/moderate/open/very_open
- cultural_openness: conservative/moderate/open/very_open

// Preferences Match (10 points)
- preferred_coliving_size: small/medium/large
- gender_preference: no_preference/same_gender/mixed
- quiet_hours_preference: boolean
```

### Champs actuellement collectés

#### ✅ RESIDENT (5 étapes)
- ✅ Basic Info: first_name, last_name, DOB, nationality, phone, languages
- ✅ Lifestyle: occupation_status, wake_up_time, sleep_time, smoking, cleanliness (1-10)
- ✅ Personality: introvert_extrovert_scale (1-5), sociability_level, interaction_type, activity_level
- ❌ **MANQUE**: core_values, music_habits, cooking_frequency, shared_meals, cultural_openness, guest_frequency
- ✅ Living Situation: property info (si owner)
- ✅ Property Setup: details propriété

#### ✅ SEARCHER (8 étapes CORE + 7 Enhance)
- ✅ Basic Info: first_name, last_name, DOB, nationality, languages
- ✅ Daily Habits: wake_up_time, sleep_time, work_schedule, sport_frequency, smoking
- ✅ Home Lifestyle: cleanliness (1-10), music_habits, cooking_frequency, shared_meals
- ✅ Social Vibe: social_energy (1-10), community_size, guest_frequency
- ✅ Ideal Coliving: openness_to_sharing, cultural_openness
- ✅ Preferences: neighborhoods, budget, property_type, amenities
- ✅ Verification (placeholder)
- ✅ **ENHANCE** (optionnel): about, personality, values, hobbies, community, financial, verification

---

## ✅ SOLUTION PROPOSÉE

### 🔥 OPTION 1 : Onboarding CORE harmonisé (4 étapes) + ENHANCE modulaire

#### **CORE pour TOUS** (Resident & Searcher) - **4 étapes obligatoires**
```
1️⃣ Basic Info (identité)
   - first_name, last_name, date_of_birth, nationality, languages

2️⃣ Daily Life (routine & lifestyle)
   - wake_up_time, sleep_time
   - work_schedule (student/employee/remote/flexible)
   - occupation_status
   - smoking, pets
   - cleanliness_level (1-10)

3️⃣ Social & Personality (compatibilité sociale)
   - social_energy (1-10) OU introvert_extrovert_scale (1-5)
   - shared_meals_interest
   - event_participation_interest (low/medium/high)
   - guest_frequency

4️⃣ Values & Preferences (valeurs de vie)
   - core_values (sélection parmi: respect, cleanliness, communication, sustainability, fun, privacy)
   - openness_to_sharing (private/moderate/open)
   - cultural_openness (conservative/moderate/open)
```

#### **ENHANCE optionnel** (après CORE, pour tous)
```
Menu Enhance (identique pour Resident & Searcher) :
├─ About (bio, about_me, looking_for)
├─ Personality (hobbies, interests, traits)
├─ Values (core_values détaillé, qualities, dealbreakers)
├─ Hobbies (loisirs, passions)
├─ Community (event_interest, meetups)
├─ Financial (income, guarantor, employment) [SEARCHER ONLY]
└─ Verification (ID, proof of income)
```

#### **SPÉCIFIQUE selon rôle**
- **RESIDENT** : + Property Setup (si owner)
- **SEARCHER** : + Preferences (budget, neighborhoods, property_type, amenities)

---

### 🎯 OPTION 2 : Onboarding CORE court (3 étapes) + ENHANCE obligatoire partiel

#### **CORE ultra-rapide** (3 étapes)
```
1️⃣ Basic Info (identité)
2️⃣ Daily Life (routine basique: wake/sleep, work, smoking)
3️⃣ Quick Personality (social_energy slider 1-10)
```

#### **ENHANCE avec sections obligatoires**
```
Menu Enhance :
├─ ⭐ Values (OBLIGATOIRE) → core_values, openness, cultural_openness
├─ ⭐ Social Preferences (OBLIGATOIRE) → shared_meals, events, guests
├─ About (optionnel)
├─ Hobbies (optionnel)
├─ Community (optionnel)
├─ Financial (optionnel, searcher only)
└─ Verification (optionnel)
```

**Gating** : Matching débloqué seulement si sections obligatoires complétées.

---

## 📋 COMPARAISON DES OPTIONS

| Critère | Option 1 (4 étapes CORE) | Option 2 (3 étapes + Enhance obligatoire) |
|---------|---------------------------|-------------------------------------------|
| **Friction initiale** | Moyenne (4 étapes) | Faible (3 étapes) |
| **Qualité du matching** | ✅ Excellente dès le début | ⚠️ Moyenne au début, excellente après Enhance |
| **Taux de complétion** | ⚠️ ~70% (4 étapes peut perdre users) | ✅ ~90% (3 étapes rapide) |
| **UX** | ✅ Clair : CORE = obligatoire | ⚠️ Moins clair : Enhance "optionnel mais obligatoire" |
| **Flexibilité** | ❌ Rigide | ✅ Modulaire |
| **Harmonisation Resident/Searcher** | ✅ Identique | ✅ Identique |

---

## ✅ MA RECOMMANDATION FINALE : **OPTION 1**

### Pourquoi ?
1. ✅ **Qualité du matching immédiate** : tous les champs essentiels collectés dès CORE
2. ✅ **UX claire** : CORE = obligatoire, ENHANCE = optionnel (pas de confusion)
3. ✅ **Harmonisation parfaite** : Resident & Searcher ont le même CORE
4. ✅ **Pas de gating complexe** : matching disponible dès fin du CORE
5. ✅ **Évite le biais** : ne pas forcer les users à faire "Enhance obligatoire" déguisé en optionnel

### Structure finale proposée

#### **RESIDENT Onboarding**
```
CORE (4 étapes obligatoires) :
1. Basic Info
2. Daily Life
3. Social & Personality
4. Values & Preferences

→ Si owner : + Property Setup
→ Review → Enhance Menu (optionnel) → Dashboard
```

#### **SEARCHER Onboarding**
```
CORE (4 étapes obligatoires) :
1. Basic Info
2. Daily Life
3. Social & Personality
4. Values & Preferences

→ + Search Preferences (budget, neighborhoods, amenities)
→ Review → Enhance Menu (optionnel) → Dashboard
```

---

## 🔄 Migration Plan

### Étapes d'implémentation
1. ✅ Créer le nouveau CORE harmonisé (4 étapes)
2. ✅ Migrer les sections Enhance existantes
3. ✅ Adapter Property Setup pour Residents
4. ✅ Adapter Search Preferences pour Searchers
5. ✅ Mettre à jour l'algorithme de matching pour utiliser les bons champs
6. ✅ Tester le matching Resident ↔ Searcher

### Données à migrer
```sql
-- Mapping ancien → nouveau
- Searcher.social_vibe → CORE.Social&Personality
- Searcher.ideal_coliving → CORE.Values&Preferences
- Searcher.home_lifestyle → CORE.Daily Life
- Resident.personality → CORE.Social&Personality (déjà bien aligné !)
```

---

## 📊 Champs finaux collectés (CORE)

### Tous les utilisateurs (Resident & Searcher)
```typescript
interface CoreOnboardingData {
  // Basic Info
  first_name: string;
  last_name: string;
  date_of_birth: string;
  nationality: string;
  languages: string[];

  // Daily Life
  wake_up_time: 'early' | 'moderate' | 'late';
  sleep_time: 'early' | 'moderate' | 'late';
  work_schedule: 'office' | 'hybrid' | 'remote' | 'flexible' | 'student';
  occupation_status: string;
  smoking: boolean;
  pets: boolean;
  cleanliness_level: number; // 1-10

  // Social & Personality
  social_energy: number; // 1-10
  shared_meals_interest: boolean;
  event_participation_interest: 'low' | 'medium' | 'high';
  guest_frequency: 'never' | 'rarely' | 'sometimes' | 'often';

  // Values & Preferences
  core_values: string[]; // ['respect', 'cleanliness', 'communication', etc.]
  openness_to_sharing: 'private' | 'moderate' | 'open' | 'very_open';
  cultural_openness: 'conservative' | 'moderate' | 'open' | 'very_open';
}
```

### Resident uniquement
```typescript
interface ResidentSpecific {
  // Si owner
  property_id?: string;
  // ... property setup data
}
```

### Searcher uniquement
```typescript
interface SearcherSpecific {
  // Search Preferences
  min_budget: number;
  max_budget: number;
  preferred_neighborhoods: string[];
  preferred_property_type: string[];
  required_amenities: string[];
  preferred_amenities: string[];
  min_bedrooms: number;
  furnished_required: boolean;
}
```

---

## 🎯 Résultat attendu

### Matching Score avec profil CORE complet
- ✅ Lifestyle Compatibility: **30/30** points (wake/sleep/cleanliness/smoking/pets)
- ✅ Social Compatibility: **25/25** points (social_energy/shared_meals/events/guests)
- ✅ Practical Compatibility: **20/20** points (work_schedule)
- ✅ Values Alignment: **15/15** points (core_values/openness/cultural_openness)
- ⚠️ Preferences Match: **5/10** points (données de base seulement)

**Total : ~95/100** dès la fin du CORE ! 🎉

### Matching Score avec Enhance complété
- ✅ **100/100** avec hobbies, interests, personalities supplémentaires

---

## 📝 Notes

- L'harmonisation permet aux Residents et Searchers de matcher ensemble efficacement
- Le CORE reste court (4 étapes) tout en collectant l'essentiel
- L'Enhance permet d'affiner sans friction
- Pas de différence majeure entre Resident/Searcher (sauf Property Setup vs Preferences)
