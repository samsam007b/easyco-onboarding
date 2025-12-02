# 📋 Mapping complet des questions Searcher & Resident

## 🎯 Objectif
Réorganiser TOUTES les questions existantes entre CORE (4 étapes obligatoires) et ENHANCE (optionnel) sans rien perdre.

---

## 📊 QUESTIONS ACTUELLES SEARCHER (8 étapes)

### ✅ 1. Basic Info
- first_name ⭐
- last_name ⭐
- date_of_birth ⭐
- nationality ⭐
- languages ⭐
- **DEPENDENT**: profile_name, relationship (child/family/friend)

### ✅ 2. Daily Habits
- wake_up_time (early/moderate/late) ⭐
- sleep_time (early/moderate/late) ⭐
- work_schedule (traditional/flexible/remote/student) ⭐
- sport_frequency (daily/few-times-week/once-week/rarely) 🔄 ENHANCE
- smoking (boolean) ⭐

### ✅ 3. Home Lifestyle
- cleanliness (1-10 slider) ⭐
- guest_frequency (never/rarely/sometimes/often) 🔄 ENHANCE
- music_habits (quiet/low-volume/moderate/loud) 🔄 ENHANCE
- has_pets (boolean) ⭐
- pet_type (if has_pets) ⭐
- cooking_frequency (never/once-week/few-times/daily) 🔄 ENHANCE

### ✅ 4. Social Vibe
- social_energy (introvert/moderate/extrovert) ⭐
- openness_to_sharing (private/moderate/very-open) 🔄 ENHANCE
- communication_style (direct/diplomatic/casual/formal) 🔄 ENHANCE
- cultural_openness (prefer-similar/moderate/love-diversity) ⭐

### ✅ 5. Ideal Coliving
- coliving_size (small/medium/large/xlarge: 2-3/4-6/7-10/10+) 🔄 ENHANCE
- gender_mix (male-only/female-only/mixed/no-preference) 🔄 ENHANCE
- min_age 🔄 ENHANCE
- max_age 🔄 ENHANCE
- shared_space_importance (1-10 slider) 🔄 ENHANCE

### ✅ 6. Preferences (SEARCHER SPECIFIC)
- neighborhoods ⭐ SEARCHER ONLY
- min_budget ⭐ SEARCHER ONLY
- max_budget ⭐ SEARCHER ONLY
- property_type (apartment/house/coliving/studio) ⭐ SEARCHER ONLY
- bedrooms ⭐ SEARCHER ONLY
- bathrooms ⭐ SEARCHER ONLY
- furnished_preference ⭐ SEARCHER ONLY
- required_amenities (wifi/washing_machine/dishwasher/etc.) ⭐ SEARCHER ONLY
- preferred_amenities ⭐ SEARCHER ONLY
- move_in_date ⭐ SEARCHER ONLY
- lease_duration (short-term/long-term/flexible) ⭐ SEARCHER ONLY

### ✅ 7. Verification
- (Placeholder pour l'instant)

### ✅ 8. Review
- Récap + Save

---

## 📊 QUESTIONS ACTUELLES RESIDENT (5 étapes)

### ✅ 1. Basic Info
- first_name ⭐
- last_name ⭐
- date_of_birth ⭐
- nationality ⭐
- phone_number ⭐ (RESIDENT a phone en plus)
- languages ⭐

### ✅ 2. Lifestyle
- occupation_status (student/employee/self-employed/intern/job_seeker/other) ⭐
- wake_up_time (early/average/late) ⭐
- sleep_time (before_23h/23h_01h/after_01h) ⭐
- smoking (boolean) ⭐
- cleanliness_preference (1-10 slider) ⭐

### ✅ 3. Personality
- introvert_extrovert_scale (1-5 slider) ⭐
- sociability_level (low/medium/high) ⭐
- preferred_interaction_type (cozy_evenings/independent_living/community_events) 🔄 ENHANCE
- home_activity_level (quiet/social/very_active) 🔄 ENHANCE

### ✅ 4. Living Situation
- property_type (apartment/house/coliving/other)
- bedrooms
- bathrooms
- rent_amount
- amenities
- (Seulement si owner)

### ✅ 5. Property Setup
- (Détails propriété si owner)

---

## 🎯 NOUVEAU MAPPING : CORE (4 étapes) + ENHANCE

### ✅ CORE 1 : Basic Info (IDENTIQUE pour tous)
```
⭐ OBLIGATOIRE pour tous
- first_name
- last_name
- date_of_birth
- nationality
- languages
- phone_number (optionnel mais recommandé)
```

### ✅ CORE 2 : Daily Life (IDENTIQUE pour tous)
```
⭐ OBLIGATOIRE pour tous
- occupation_status (student/employee/remote/freelance/intern/job_seeker/other)
- wake_up_time (early/moderate/late)
- sleep_time (early/moderate/late)
- work_schedule (office/hybrid/remote/flexible/student)
- smoking (boolean)
- has_pets (boolean)
- pet_type (if has_pets)
- cleanliness_level (1-10 slider)
```

### ✅ CORE 3 : Social & Personality (IDENTIQUE pour tous)
```
⭐ OBLIGATOIRE pour tous
- social_energy (1-10 slider OU introvert/moderate/extrovert)
  → Conversion: introvert=3, moderate=5, extrovert=8
- shared_meals_interest (boolean toggle)
- event_participation_interest (low/medium/high)
- guest_frequency (never/rarely/sometimes/often)
```

### ✅ CORE 4 : Values & Preferences (IDENTIQUE pour tous)
```
⭐ OBLIGATOIRE pour tous
- core_values (multi-select chips: respect, cleanliness, communication, sustainability, fun, privacy, diversity, growth)
- openness_to_sharing (private/moderate/open/very_open)
- cultural_openness (conservative/moderate/open/very_open)
```

### 🏠 SPÉCIFIQUE RESIDENT : Property Setup (si owner)
```
⭐ OBLIGATOIRE si owner
- property_type
- bedrooms
- bathrooms
- rent_amount
- amenities
- etc.
```

### 🔍 SPÉCIFIQUE SEARCHER : Search Preferences
```
⭐ OBLIGATOIRE pour searcher
- neighborhoods
- min_budget
- max_budget
- property_type
- bedrooms
- bathrooms
- furnished_preference
- required_amenities
- preferred_amenities
- move_in_date
- lease_duration
```

---

## 🎨 ENHANCE (optionnel pour TOUS)

### 📝 About (existant, identique)
- bio
- about_me
- looking_for

### 🎭 Personality (NOUVEAU - consolide les questions déplacées)
```
Questions déplacées du CORE :
- hobbies (chip input)
- interests (Music/Sports/Reading/Cooking/Gaming/Travel/Art/Photography/etc.)
- personality_traits (Outgoing/Introverted/Creative/Organized/Spontaneous/etc.)
- preferred_interaction_type (cozy_evenings/independent_living/community_events)
- home_activity_level (quiet/social/very_active)
```

### ✨ Values (existant, enrichi)
```
- core_values (détaillé avec descriptions)
- important_qualities (Cleanliness/Punctuality/Friendliness/Quietness/Flexibility/etc.)
- deal_breakers (Smoking indoors/Loud noise late night/Messiness/etc.)
```

### 🎨 Hobbies (existant)
- hobbies selection + custom

### 🏘️ Community (NOUVEAU - consolide social lifestyle)
```
Questions déplacées du CORE :
- event_interest (low/medium/high) - DUPLICATE de event_participation_interest ?
- shared_meals (boolean toggle) - DUPLICATE ?
- open_to_meetups (boolean toggle)
- sport_frequency (daily/few-times-week/once-week/rarely)
```

### 💰 Financial (existant, SEARCHER ONLY)
- income_range
- has_guarantor
- employment_type

### 🛋️ Lifestyle Details (NOUVEAU - pour questions home lifestyle)
```
Questions déplacées du CORE :
- music_habits (quiet/low-volume/moderate/loud)
- cooking_frequency (never/once-week/few-times/daily)
- diet_type (omnivore/vegetarian/vegan/flexitarian/pescatarian)
- communication_style (direct/diplomatic/casual/formal)
```

### 🏠 Ideal Living (NOUVEAU - pour préférences de coliving)
```
Questions déplacées du CORE :
- coliving_size (small/medium/large/xlarge)
- gender_mix (male-only/female-only/mixed/no-preference)
- age_range (min/max sliders)
- shared_space_importance (1-10 slider)
- quiet_hours_preference (boolean)
```

### ✅ Verification (existant)
- ID verification
- Proof of income

---

## 📊 RÉSUMÉ DES CHANGEMENTS

### Questions qui restent dans CORE (essentielles pour matching)
- ✅ Basic Info: first_name, last_name, DOB, nationality, languages
- ✅ Daily Life: occupation, wake/sleep times, work_schedule, smoking, pets, cleanliness
- ✅ Social: social_energy, shared_meals_interest, event_interest, guest_frequency
- ✅ Values: core_values, openness_to_sharing, cultural_openness

### Questions déplacées vers ENHANCE (enrichissement optionnel)
- 🔄 Daily Habits: sport_frequency → Community
- 🔄 Home Lifestyle: music_habits, cooking_frequency → Lifestyle Details
- 🔄 Home Lifestyle: guest_frequency → **DÉJÀ dans CORE 3**
- 🔄 Social Vibe: communication_style → Lifestyle Details
- 🔄 Social Vibe: openness_to_sharing → **DÉJÀ dans CORE 4**
- 🔄 Ideal Coliving: TOUT → Ideal Living (enhance)
- 🔄 Personality (Resident): interaction_type, activity_level → Personality (enhance)

### Nouvelles sections Enhance créées
1. ✨ **Personality** (hobbies, interests, traits, interaction_type, activity_level)
2. ✨ **Lifestyle Details** (music, cooking, diet, communication_style)
3. ✨ **Ideal Living** (coliving_size, gender_mix, age_range, shared_space)
4. ✨ **Community** (sport_frequency, meetups, event_interest détaillé)

---

## ⚠️ DUPLICATES À RÉSOUDRE

### 1. event_participation_interest (CORE 3) vs event_interest (Community enhance)
**Solution** : Garder `event_participation_interest` dans CORE 3, supprimer de Community enhance

### 2. shared_meals_interest (CORE 3) vs shared_meals (Community enhance)
**Solution** : Garder `shared_meals_interest` dans CORE 3, supprimer de Community enhance

### 3. guest_frequency (CORE 3) vs (Home Lifestyle)
**Solution** : Garder dans CORE 3 uniquement

### 4. openness_to_sharing (CORE 4) vs (Social Vibe)
**Solution** : Garder dans CORE 4 uniquement

---

## ✅ VALIDATION : Champs nécessaires pour matching (100% couverts)

### Lifestyle Compatibility (30 points) ✅
- ✅ cleanliness_level (CORE 2)
- ✅ wake_up_time (CORE 2)
- ✅ sleep_time (CORE 2)
- ✅ smoking (CORE 2)
- ✅ pets (CORE 2)

### Social Compatibility (25 points) ✅
- ✅ social_energy (CORE 3)
- ✅ shared_meals_interest (CORE 3)
- ✅ event_participation_interest (CORE 3)
- ✅ guest_frequency (CORE 3)

### Practical Compatibility (20 points) ✅
- ✅ work_schedule (CORE 2)
- ⚠️ sports_frequency (ENHANCE Community) - **10% moins précis**
- ✅ occupation_status (CORE 2)

### Values Alignment (15 points) ✅
- ✅ core_values (CORE 4)
- ✅ openness_to_sharing (CORE 4)
- ✅ cultural_openness (CORE 4)

### Preferences Match (10 points) ✅
- ⚠️ preferred_coliving_size (ENHANCE Ideal Living) - **optionnel**
- ⚠️ gender_preference (ENHANCE Ideal Living) - **optionnel**

**Score minimum garanti avec CORE seul : ~85/100** ✅
**Score maximum avec ENHANCE : ~100/100** ✅
