# 📋 PLAN ONBOARDING COMPLET - EasyCo

**Date**: 26 Octobre 2025
**Objectif**: Compléter tous les onboardings (Searcher, Owner, Resident, Property) avec Core + Additional flows

---

## 🎯 VISION GLOBALE

### Concept "Core + Additional Onboarding"

**Core Onboarding**: Minimum viable pour créer le profil/listing
**Additional Onboarding**: Enrichissement optionnel pour améliorer matching/experience

---

## 1. SEARCHER ONBOARDING

### ✅ Core Onboarding (QUASI-COMPLET - 90%)

| Page | Status | Action Requise |
|------|--------|----------------|
| Basic Info | ✅ Complet | Rien |
| Daily Habits | ✅ Complet | Rien |
| Home Lifestyle | 🟡 Partiel | ✏️ **Ajouter slider cleanliness** |
| Social Vibe | 🟡 Partiel | ✏️ **Ajouter 3 sliders** (social energy, openness, cultural openness) |
| Ideal Coliving | ✅ Complet | Rien |
| Preferences | ✅ Complet | Rien |
| Review | ✅ Complet | Rien |
| Success | ✅ Complet | Rien |

#### Actions Sliders Required:

**Home Lifestyle** (`/onboarding/searcher/home-lifestyle`):
- 🔄 Remplacer dropdown cleanliness par Slider (1-10: Relaxed → Spotless)

**Social Vibe** (`/onboarding/searcher/social-vibe`):
- 🔄 Remplacer dropdown "Social energy" par Slider (1-10: Introvert → Extrovert)
- 🔄 Remplacer dropdown "Openness to sharing" par Slider (1-10: Private → Very open)
- 🔄 Remplacer dropdown "Cultural openness" par Slider (1-10: Prefer similar → Love diversity)
- ✅ Garder dropdown "Communication style"

### 🟡 Additional Onboarding (60% COMPLET)

| Page | Status | Action Requise |
|------|--------|----------------|
| **About** | ✅ Créé | Rien - Bio, About Me, Looking For |
| **Hobbies** | ✅ Créé | Rien - Selection + custom hobbies |
| **Values** | ✅ Créé | Rien - Core values, Important qualities, Deal breakers |
| **Financial Info** | ❌ Manquant | ➕ **CRÉER PAGE** |
| **Community Events** | ❌ Manquant | ➕ **CRÉER PAGE** |
| **Verification** | 🟡 Structure | ✏️ **Compléter upload fonctionnel** |
| **Review** | ✅ Créé | Rien |

#### Pages à Créer:

**1. Financial Info** (`/profile/enhance/financial`):
- Income range selector (buttons: <€1,000, €1-1.5k, €1.5-2k, €2-3k, €3-5k, >€5k)
- Toggle: "I have a guarantor available"
- Dropdown: Employment type (Full-time, Part-time, Freelance, Contract, Internship, Student, Unemployed)
- Privacy notice box
- Save & Continue / Skip buttons

**2. Community Events** (`/profile/enhance/community`):
- Event participation interest (emoji buttons: Low 😐, Medium 😊, High 🎉)
- Context: "How interested are you in community events, parties, and social gatherings?"
- Toggle: "I'd enjoy shared meals" (yellow highlight)
- Toggle: "Open to flatmate meetups" (blue highlight)
- Community perks callout box
- Save & Continue / Skip buttons

**3. Verification** (compléter `/profile/enhance/verification`):
- ID Upload avec Supabase Storage
- Email verification (déjà existant mais pas intégré)
- Phone verification (OTP flow)
- Affichage des bénéfices (3x more views, verified badge)

---

## 2. OWNER ONBOARDING

### 🟡 Core Onboarding (30% COMPLET)

| Page | Status | Action Requise |
|------|--------|----------------|
| Basic Info | ✅ Complet | Landlord type, name, company, phone |
| **Property Basics** | ❌ Placeholder | ➕ **CRÉER PAGE COMPLÈTE** |
| **About** | ❌ Placeholder | ➕ **CRÉER PAGE COMPLÈTE** |
| **Verification** | ❌ Placeholder | ➕ **CRÉER PAGE COMPLÈTE** |
| Review | ❌ Placeholder | ➕ **CRÉER PAGE** |
| Success | ✅ Complet | Rien |

#### Pages à Créer:

**1. Property Basics** (`/onboarding/owner/property-basics`):
- "Do you already have a property to list?" (Yes/No cards)
- Si Yes → "How many properties?" (Number input)
- Si No → "Are you planning to acquire one?" (Yes/No/Not sure)
- Property type preference (dropdown: Apartment, House, Studio, Coliving, Shared room)
- Primary city/location (text input with autocomplete)
- Continue button

**2. About** (`/onboarding/owner/about`):
- Years of experience as landlord (dropdown: 0, 1-2, 3-5, 5-10, 10+)
- Management style (dropdown: Self-managed, Agency, Hybrid)
- Primary motivation (dropdown: Income, Community building, Investment, Other)
- Availability for property visits (dropdown: Flexible, Weekdays only, Weekends only, By appointment)
- Bio (textarea, 500 chars)
- Continue button

**3. Verification** (`/onboarding/owner/verification`):
- Proof of ownership upload
- Business registration (if company/agency)
- Insurance certificate
- ID verification
- KYC status tracking

**4. Review** (`/onboarding/owner/review`):
- Récap de toutes les données
- Sections: Basic Info, Property Info, About, Verification Status
- Submit button

### ❌ Additional Onboarding (0% - TO DESIGN)

**Suggestions**:
- Financial Setup (IBAN, payment preferences)
- Tenant Policies (lease duration, deposit, pets, smoking)
- Services & Amenities offered
- Communication preferences
- Insurance details

---

## 3. PROPERTY ONBOARDING

### 🟡 Core Property Listing (40% COMPLET)

| Page | Status | Action Requise |
|------|--------|----------------|
| Basics | ✅ Complet | Address, beds, baths, type |
| **Description** | ❌ Placeholder | ➕ **CRÉER PAGE** |
| **Pricing** | ❌ Placeholder | ➕ **CRÉER PAGE** |
| Photos | ❌ Manquant | ➕ **CRÉER PAGE** |
| Review | ❌ Placeholder | ➕ **CRÉER PAGE** |
| Success | ❌ Placeholder | ➕ **CRÉER PAGE** |

#### Pages à Créer:

**1. Description** (`/onboarding/property/description`):
- Title (text input, 100 chars)
- Description (textarea, 1000 chars)
- Property highlights (multi-select chips)
- Neighborhood description (textarea, 500 chars)
- Continue button

**2. Pricing** (`/onboarding/property/pricing`):
- Monthly rent (number input with € symbol)
- Charges included? (Yes/No toggle)
- If No → Additional charges (number input)
- Deposit amount (number input, default = 1 month)
- Minimum lease duration (dropdown: 1, 3, 6, 12 months)
- Available from (date picker)
- Continue button

**3. Photos** (`/onboarding/property/photos`):
- Drag & drop photo upload (Supabase Storage)
- Minimum 3 photos required
- Maximum 20 photos
- Photo reordering
- Primary photo selection
- Continue button

**4. Review** (`/onboarding/property/review`):
- Property card preview
- All details recap
- Edit buttons per section
- Publish button

**5. Success** (`/onboarding/property/success`):
- Success message
- Property card preview
- CTA: "View My Listing" / "Add Another Property" / "Go to Dashboard"

### ❌ Additional Property Details (TO DESIGN)

**Suggestions**:
- Availability calendar
- House rules details
- Ideal tenant description
- Special features/amenities details
- Virtual tour/video

---

## 4. RESIDENT ONBOARDING (NOUVEAU - 0%)

### 🎯 Concept

**Resident** = Personne déjà locataire qui cherche:
- Nouveaux colocataires pour remplacer ceux qui partent
- OU À déménager vers un nouveau coliving
- OU À évaluer leur situation actuelle

### Core Onboarding Structure (TO CREATE)

| Page | Description |
|------|-------------|
| **Current Situation** | Adresse actuelle, date d'emménagement, fin de bail, raison de changement |
| **Current Living** | Type de logement, nombre de colocataires, budget actuel |
| **Daily Habits** | Même que Searcher |
| **Home Lifestyle** | Même que Searcher |
| **Social Vibe** | Même que Searcher |
| **Looking For** | Cherche nouveau coloc ou nouveau logement? |
| **Ideal Next Step** | Préférences pour prochain coliving/colocataire |
| **Review** | Récap |
| **Success** | Confirmation |

#### Pages à Créer:

**1. Current Situation** (`/onboarding/resident/current-situation`):
- Current address (text input)
- Move-in date (date picker)
- Lease end date (date picker)
- Notice period (dropdown: 1, 2, 3 months)
- Reason for potential change (textarea, optional)
- Continue

**2. Current Living** (`/onboarding/resident/current-living`):
- Property type (dropdown)
- Number of current roommates (number)
- Current monthly rent (number)
- Landlord name (text, optional)
- Landlord type (Individual, Agency, Company)
- Continue

**3. Daily Habits, Home Lifestyle, Social Vibe**:
- ♻️ Réutiliser les pages Searcher (mêmes composants)

**4. Looking For** (`/onboarding/resident/looking-for`):
- Card selection:
  - "Looking for a new roommate" (current place, someone leaving)
  - "Looking to move" (new coliving entirely)
  - "Just updating my profile" (happy where I am)
- Based on selection, show different next steps
- Continue

**5. Ideal Next Step** (`/onboarding/resident/ideal-next-step`):
- If "new roommate": Describe ideal new roommate
- If "move": Réutiliser Ideal Coliving + Preferences de Searcher
- If "updating": Skip to review
- Continue

**6. Review** + **Success**: Standard

### Additional Onboarding (TO DESIGN)

**Suggestions**:
- Current roommate reviews/references
- Landlord reference
- Lease documentation
- Photos of current space (if looking for roommate)

---

## 📊 RÉCAPITULATIF QUANTITATIF

### Pages à Créer (Total: ~20 pages)

| Onboarding Type | Core Pages Manquantes | Additional Pages Manquantes | Total |
|-----------------|----------------------|----------------------------|-------|
| **Searcher** | 0 (mais 2 à upgrader) | 2 | 2 |
| **Owner** | 3 | ~4 (to design) | 7 |
| **Property** | 4 | ~3 (to design) | 7 |
| **Resident** | 6 | ~4 (to design) | 10 |
| **TOTAL** | **13** | **13** | **~26** |

### Effort Estimé

| Tâche | Effort | Complexité |
|-------|--------|------------|
| Searcher - Ajout sliders (2 pages) | 2h | Low |
| Searcher - Additional (2 pages) | 4h | Low |
| Owner - Core (3 pages) | 6h | Medium |
| Owner - Additional (4 pages) | 6h | Medium |
| Property - Core (4 pages) | 8h | Medium |
| Property - Additional (3 pages) | 4h | Low |
| Resident - Core (6 pages) | 10h | Medium |
| Resident - Additional (4 pages) | 6h | Low |
| **TOTAL** | **~46h** | **~6 jours de dev** |

---

## 🎯 PRIORISATION RECOMMANDÉE

### Phase 1 - URGENT (Cette Semaine)
1. ✅ **Searcher sliders** (2h) - Finir ce qui est commencé
2. ✅ **Searcher Additional** (4h) - Financial + Community pages
3. ✅ **Property Core** (8h) - Description, Pricing, Photos, Review, Success

**Pourquoi**: Searcher + Property = core user journey complet

### Phase 2 - IMPORTANT (Semaine Prochaine)
4. ✅ **Owner Core** (6h) - Property Basics, About, Verification, Review
5. ✅ **Resident Core** (10h) - Toutes les pages de base

**Pourquoi**: Compléter les 3 user types core

### Phase 3 - POLISH (À Planifier)
6. ⏳ **Owner Additional** (6h)
7. ⏳ **Property Additional** (4h)
8. ⏳ **Resident Additional** (6h)

---

## 🔧 COMPOSANTS RÉUTILISABLES À CRÉER

Pour accélérer le développement:

1. **Slider Component** ✅ (Déjà créé)
2. **ProgressBar Component** (pour toutes les pages)
3. **IncomeRangeSelector Component** (buttons avec selection)
4. **EmojiSelector Component** (Low/Medium/High avec emojis)
5. **PhotoUploader Component** (drag & drop avec preview)
6. **PropertyCard Component** (preview dans review pages)
7. **OnboardingLayout Component** (wrapper avec back button, progress, etc.)

---

## 📝 PROCHAINES ÉTAPES IMMÉDIATES

1. **Terminer ce qui est commencé**:
   - Commit Slider component ✅
   - Finir Home Lifestyle slider
   - Ajouter 3 sliders à Social Vibe

2. **Créer Financial Info page**
3. **Créer Community Events page**
4. **Tester Searcher flow end-to-end**

5. **Commencer Property Onboarding**:
   - Description page
   - Pricing page
   - Photos page

---

**Document créé le**: 26 Octobre 2025
**Prochaine mise à jour**: Après Phase 1 (dans 3-4 jours)
