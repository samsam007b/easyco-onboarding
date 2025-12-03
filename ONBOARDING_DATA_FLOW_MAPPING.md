# Onboarding Data Flow & Profile Completion Mapping

**Date**: 2025-12-03
**Issue**: Profile completion shows 33% but should reflect all data from CORE onboarding
**Root Cause**: CORE onboarding fields are NOT mapped to the 7 "enhance" profile sections

---

## The Problem

### Current State
- ✅ User completes CORE onboarding (9 pages)
- ✅ Data is saved to `user_profiles` table
- ❌ Profile completion shows 33% instead of ~60%
- ❌ Data is NOT recognized by `calculateProfileCompletion()` function

### Why?
The CORE onboarding saves fields like:
- `budget_min`, `budget_max` → But function looks for `min_budget`, `max_budget`
- `introvert_extrovert_scale` → But function looks for `introvert_extrovert`
- `hobbies` → Saved correctly ✅
- `about_me` → Not in completion calculation ❌

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ONBOARDING FLOW                               │
└─────────────────────────────────────────────────────────────────┘

1. CORE ONBOARDING (Quick Path - 9 pages)
   └─> Saves to user_profiles with specific column names
   └─> Sets onboarding_completed = true
   └─> Should contribute to profile completion: ~50-60%

2. PROFILE ENHANCEMENT (7 sections - optional)
   └─> Also saves to user_profiles
   └─> Fills in missing fields
   └─> Should increase completion: 60% → 100%

3. PROFILE COMPLETION CALCULATION
   └─> lib/profile/profile-completion.ts
   └─> Counts 27 individual fields
   └─> Should count BOTH core AND enhance data
```

---

## Field Mapping: CORE → Profile Completion

### Section 1: Basic Info (5 fields)
**Completion Formula**: `5 fields / 5 total = 100%` if all filled

| Field in Completion | CORE Onboarding Source | Currently Mapped? | Fix Needed |
|---------------------|------------------------|-------------------|------------|
| `first_name` | ✅ `basic-info` page | ✅ YES | None |
| `last_name` | ✅ `basic-info` page | ✅ YES | None |
| `date_of_birth` | ✅ `basic-info` page | ✅ YES | None |
| `phone_number` | ✅ `basic-info` page | ✅ YES | None |
| `profile_photo_url` | ❌ NOT in CORE | ❌ NO | User must upload |

**Current Completion**: 4/5 = 80% ✅
**Expected after fix**: 80% (user needs to add photo)

---

### Section 2: Preferences (5 fields)
**Completion Formula**: `5 fields / 5 total = 100%` if all filled

| Field in Completion | CORE Onboarding Source | Currently Mapped? | Fix Needed |
|---------------------|------------------------|-------------------|------------|
| `preferred_cities` | ❌ NOT in CORE (uses `current_city`) | ❌ NO | Add alias or map |
| `min_budget` | ✅ `preferences` page → `budget_min` | ❌ NO | **CRITICAL: Rename column** |
| `max_budget` | ✅ `preferences` page → `budget_max` | ❌ NO | **CRITICAL: Rename column** |
| `move_in_date` | ✅ `preferences` page → `preferred_move_in_date` | ✅ YES | Rename to `move_in_date` |
| `room_type` | ❌ NOT in CORE (`preferred_room_type`) | ❌ NO | Map `preferred_room_type` |

**Current Completion**: 1/5 = 20% ❌
**Expected after fix**: 4/5 = 80% ✅

**Critical Fix**:
```typescript
// In calculateProfileCompletion(), add aliases:
min_budget: profile.min_budget || profile.budget_min,
max_budget: profile.max_budget || profile.budget_max,
preferred_cities: profile.preferred_cities || [profile.current_city],
room_type: profile.room_type || profile.preferred_room_type,
```

---

### Section 3: Lifestyle (8 fields)
**Completion Formula**: `8 fields / 8 total = 100%` if all filled

| Field in Completion | CORE Onboarding Source | Currently Mapped? | Fix Needed |
|---------------------|------------------------|-------------------|------------|
| `occupation` | ✅ `basic-info` → `occupation_status` | ❌ NO | Add alias |
| `bio` | ✅ `lifestyle-details` page | ✅ YES | None |
| `cleanliness_level` | ✅ `home-lifestyle` → `cleanliness_preference` | ❌ NO | Convert to number |
| `noise_tolerance` | ❌ NOT in CORE | ❌ NO | Add to CORE or enhance |
| `smoking` | ✅ `daily-habits` → `is_smoker` | ❌ NO | Add alias |
| `pets` | ✅ `home-lifestyle` → `has_pets` | ✅ YES | None |
| `morning_person` | ✅ `daily-habits` → `wake_up_time` | ❌ NO | Convert wake_up_time |
| `hobbies` | ✅ `hobbies` page | ✅ YES | None |

**Current Completion**: 3/8 = 38% ❌
**Expected after fix**: 6/8 = 75% ✅

**Critical Fix**:
```typescript
// In calculateProfileCompletion(), add conversions:
occupation: profile.occupation || profile.occupation_status,
cleanliness_level: profile.cleanliness_level || parseInt(profile.cleanliness_preference),
smoking: profile.smoking !== null ? profile.smoking : profile.is_smoker,
morning_person: profile.morning_person || (profile.wake_up_time === 'early'),
```

---

### Section 4: Personality (5 fields)
**Completion Formula**: `5 fields / 5 total = 100%` if all filled

| Field in Completion | CORE Onboarding Source | Currently Mapped? | Fix Needed |
|---------------------|------------------------|-------------------|------------|
| `social_level` | ✅ `social-vibe` → `home_activity_level` | ❌ NO | Map to social_level |
| `introvert_extrovert` | ✅ `social-vibe` → `introvert_extrovert_scale` | ❌ NO | **CRITICAL: Convert** |
| `shared_meals_interest` | ✅ `community` page | ✅ YES | None |
| `event_participation` | ✅ `community` → `event_interest` | ❌ NO | Map `event_interest` |
| `community_values` | ✅ `values` page → `core_values` | ❌ NO | Add alias |

**Current Completion**: 1/5 = 20% ❌
**Expected after fix**: 5/5 = 100% ✅

**Critical Fix**:
```typescript
// In calculateProfileCompletion(), add conversions:
social_level: profile.social_level || profile.home_activity_level,
introvert_extrovert: profile.introvert_extrovert || convertScaleToText(profile.introvert_extrovert_scale),
event_participation: profile.event_participation || profile.event_interest,
community_values: profile.community_values || profile.core_values,

// Helper function:
function convertScaleToText(scale: number): string {
  if (scale <= 3) return 'introvert';
  if (scale <= 7) return 'ambivert';
  return 'extrovert';
}
```

---

### Section 5: Verification (4 fields)
**Completion Formula**: `4 fields / 4 total = 100%` if all filled

| Field in Completion | CORE Onboarding Source | Currently Mapped? | Fix Needed |
|---------------------|------------------------|-------------------|------------|
| `id_verified` | ❌ NOT in CORE | ❌ NO | Add verification flow |
| `email_verified` | ❌ NOT in CORE | ❌ NO | Add email verification |
| `phone_verified` | ❌ NOT in CORE | ❌ NO | Add phone verification |
| `background_check` | ❌ NOT in CORE | ❌ NO | Future feature |

**Current Completion**: 0/4 = 0% ❌
**Expected after fix**: 0/4 = 0% (requires new features)

---

## Profile Completion Calculation Fix

### Current Calculation (BROKEN):
```typescript
// lib/profile/profile-completion.ts
export function calculateProfileCompletion(profile: UserProfile | null) {
  // Counts 27 hardcoded field names
  // Doesn't recognize CORE onboarding field names
  // Result: 33% (9/27 fields)
}
```

### Fixed Calculation (WITH ALIASES):
```typescript
export function calculateProfileCompletion(profile: UserProfile | null) {
  if (!profile) return { percentage: 0, ... };

  // ADD FIELD ALIASES for CORE onboarding compatibility
  const normalizedProfile = {
    ...profile,
    // Preferences aliases
    min_budget: profile.min_budget || profile.budget_min,
    max_budget: profile.max_budget || profile.budget_max,
    preferred_cities: profile.preferred_cities || (profile.current_city ? [profile.current_city] : null),
    move_in_date: profile.move_in_date || profile.preferred_move_in_date,
    room_type: profile.room_type || profile.preferred_room_type,

    // Lifestyle aliases
    occupation: profile.occupation || profile.occupation_status,
    cleanliness_level: profile.cleanliness_level || (profile.cleanliness_preference ? parseInt(profile.cleanliness_preference) : null),
    smoking: profile.smoking !== null ? profile.smoking : profile.is_smoker,
    morning_person: profile.morning_person !== null ? profile.morning_person : (profile.wake_up_time === 'early'),

    // Personality aliases
    social_level: profile.social_level || profile.home_activity_level,
    introvert_extrovert: profile.introvert_extrovert || convertScaleToText(profile.introvert_extrovert_scale),
    event_participation: profile.event_participation || profile.event_interest,
    community_values: profile.community_values || profile.core_values,
  };

  // Now count fields from normalizedProfile
  const basicFields = [
    { key: 'first_name', value: normalizedProfile.first_name, label: 'Prénom' },
    { key: 'last_name', value: normalizedProfile.last_name, label: 'Nom' },
    { key: 'date_of_birth', value: normalizedProfile.date_of_birth, label: 'Date de naissance' },
    { key: 'phone_number', value: normalizedProfile.phone_number, label: 'Téléphone' },
    { key: 'profile_photo_url', value: normalizedProfile.profile_photo_url, label: 'Photo de profil' },
  ];

  // ... rest of calculation using normalizedProfile
}

function convertScaleToText(scale: number | null): string | null {
  if (scale === null) return null;
  if (scale <= 3) return 'introvert';
  if (scale <= 7) return 'ambivert';
  return 'extrovert';
}
```

### Expected Result After Fix:
```
Current: 9/27 = 33%
After fix: 18/27 = 67% ✅

Breakdown:
- Basic: 4/5 = 80%
- Preferences: 4/5 = 80%
- Lifestyle: 6/8 = 75%
- Personality: 4/5 = 80%
- Verification: 0/4 = 0%
```

---

## The 7 "Enhance" Sections Mapping

### How CORE data fills the 7 sections:

| Enhance Section | Fields from CORE | Fields Missing | Completion |
|-----------------|------------------|----------------|------------|
| **1. À propos** | `about_me`, `looking_for` | None | ✅ 100% |
| **2. Personnalité** | `extended_personality` | Needs to be created from CORE data | ❌ 0% |
| **3. Valeurs** | `core_values` | None | ✅ 100% |
| **4. Loisirs** | `hobbies` | None | ✅ 100% |
| **5. Financier** | `financial_info` | Needs to be created from CORE data | ❌ 0% |
| **6. Communauté** | `community_preferences` | Needs to be created from CORE data | ❌ 0% |
| **7. Vérification** | None | All verification fields missing | ❌ 0% |

### Critical Issue:
The CORE onboarding saves individual fields (e.g., `introvert_extrovert_scale`, `wake_up_time`, `cleanliness_preference`) but the "enhance" sections expect **JSONB objects**:

- `extended_personality` (JSONB)
- `financial_info` (JSONB)
- `community_preferences` (JSONB)

**Solution**: Create these JSONB objects from CORE data in `lib/onboarding-helpers.ts`

---

## Implementation Fix

### File: `lib/onboarding-helpers.ts`

Add this after line 173 (after all individual fields are mapped):

```typescript
// ============================================
// CREATE JSONB OBJECTS FOR "ENHANCE" SECTIONS
// ============================================

// 1. Extended Personality (from CORE data)
if (!profileData.extended_personality) {
  profileData.extended_personality = {
    hobbies: data.hobbies || [],
    interests: [], // Not in CORE
    personalityTraits: [
      data.introvertExtrovertScale ? {
        type: 'social_energy',
        scale: data.introvertExtrovertScale,
        text: convertScaleToText(data.introvertExtrovertScale)
      } : null,
      data.communicationStyle ? {
        type: 'communication',
        value: data.communicationStyle
      } : null,
    ].filter(Boolean)
  };
}

// 2. Financial Info (from CORE data)
if (!profileData.financial_info) {
  profileData.financial_info = {
    incomeRange: data.monthlyIncomeBracket || data.incomeRange,
    hasGuarantor: data.guarantorAvailable || false,
    employmentType: data.employmentType || data.occupationStatus
  };
}

// 3. Community Preferences (from CORE data)
if (!profileData.community_preferences) {
  profileData.community_preferences = {
    eventInterest: data.eventInterest || 'medium',
    enjoySharedMeals: data.sharedMealsInterest || false,
    openToMeetups: data.openToMeetups || false
  };
}
```

---

## Testing Plan

### Step 1: Fix `lib/profile/profile-completion.ts`
Add field aliases as shown above

### Step 2: Update `/api/profile/debug` endpoint
Add before/after comparison

### Step 3: Test with existing user
- User: sam7777jones@gmail.com
- Current: 33% (9/27)
- Expected: 67% (18/27)

### Step 4: Verify dashboard displays correct %

---

## Next Actions

1. ✅ Fix `calculateProfileCompletion()` with field aliases
2. ✅ Update `lib/onboarding-helpers.ts` to create JSONB objects
3. ✅ Test with debug endpoint
4. ✅ Deploy and verify on production
5. ⏳ Add missing fields to CORE onboarding (noise_tolerance, etc.)
6. ⏳ Implement verification flow

---

**Status**: Ready to implement
**Estimated Time**: 2-3 hours
**Priority**: 🔴 CRITICAL (blocks accurate profile completion tracking)
