# Core vs Additional Onboarding - Strategic Analysis

**Date**: 26 octobre 2025
**Analysis Based On**: Figma Screenshots (figma-01 to figma-22)

---

## Executive Summary

Based on the Figma designs, the onboarding is strategically split into two distinct phases:

1. **CORE ONBOARDING** (Required, Linear Flow)
   - Must be completed before accessing the app
   - 6-8 essential pages
   - Focus: Minimum viable profile for matching
   - CTA: "Continue" → Forces completion
   - Result: User can START using the app

2. **ADDITIONAL ONBOARDING** (Optional, Hub Model)
   - Can be completed AFTER core onboarding
   - Accessed from "Enhance Your Profile" hub (figma-15)
   - Focus: Profile enrichment for better matches
   - CTA: "Add more details" / "Skip for now" → User choice
   - Result: User gets BETTER matches

---

## Strategic Rationale

### Why Split Core vs Additional?

**User Psychology**:
- ❌ **Bad UX**: Forcing 70 fields = High abandonment rate
- ✅ **Good UX**: Quick start (6 pages) → Engagement → Progressive profiling

**Business Goals**:
- **Core**: Get users INTO the platform quickly
- **Additional**: Keep users engaged OVER TIME with progressive disclosure

**Data Quality**:
- **Core**: High completion rate on essential data
- **Additional**: Better quality on optional data (users CHOOSE to share)

---

## Core Onboarding Analysis (From Figma)

### Figma Flow Sequence:

1. **figma-01**: Welcome screen
2. **figma-02-03**: Basic Info (DOB, Nationality, Languages)
3. **figma-04-05**: Daily Habits (Wake/Sleep, Work, Sport, Smoking)
4. **figma-06**: Home Lifestyle (Cleanliness, Guests, Music, Pets, Cooking)
5. **figma-07**: Social Vibe (Intro/Extro, Sharing, Communication, Culture)
6. **figma-08**: Ideal Coliving (Size, Gender mix, Age range, Shared space)
7. **figma-20**: Advanced Preferences (Budget, District, Tolerances)
8. **figma-21-22**: Profile Verification (Optional but encouraged)

**Total Core Pages**: 8 pages
**Estimated Time**: 5-7 minutes
**Completion Rate Target**: >80%

### Core Onboarding Fields (35 fields)

#### ✅ CORE - Basic Info (3 fields)
- dateOfBirth
- nationality
- languagesSpoken

#### ✅ CORE - Daily Habits (5 fields)
- wakeUpTime
- sleepTime
- workSchedule
- sportFrequency
- isSmoker

#### ✅ CORE - Home Lifestyle (6 fields)
- cleanliness
- guestFrequency
- musicHabits
- hasPets
- petType
- cookingFrequency

#### ✅ CORE - Social Vibe (4 fields)
- socialEnergy (introvert/extrovert scale)
- opennessToSharing
- communicationStyle
- culturalOpenness

#### ✅ CORE - Ideal Coliving (7 fields)
- preferredColivingSize (2-3, 4-6, 7-10, 10+)
- preferredGenderMix
- roommateAgeRangeMin
- roommateAgeRangeMax
- sharedSpaceImportance
- privateSpaceImportance
- communalActivitiesInterest

#### ✅ CORE - Advanced Preferences (5 fields)
- budgetMin
- budgetMax
- preferredDistrict
- petTolerance
- smokingTolerance

#### ✅ CORE - Verification (Optional but in flow) (5 fields)
- phoneNumber
- phoneVerification
- emailVerification
- idDocumentUpload
- idVerification

**TOTAL CORE**: 35 fields

---

## Additional Onboarding Analysis (From Figma)

### Figma "Enhance Your Profile" Hub (figma-15):

This is a **dashboard-style page** where users can progressively add more details:

#### 🎯 Additional Section 1: Financial & Guarantee Info
- **CTA**: "Add more details"
- **Description**: "Add income and employment details"
- **Why Optional**: Sensitive data, better shared when user trusts platform
- **Fields** (6):
  - occupation_status
  - field_of_study_or_work
  - institution_or_company
  - monthly_income_bracket
  - employment_type
  - guarantor_available

#### 🎯 Additional Section 2: Community & Events (figma-17)
- **CTA**: "Add more details"
- **Description**: "Share your social preferences"
- **Why Optional**: Nice-to-have for community building
- **Fields** (5):
  - event_participation_interest (low/medium/high)
  - shared_meals_interest
  - open_to_flatmate_meetups
  - community_perks_opt_in
  - social_activity_preference

#### 🎯 Additional Section 3: Extended Personality
- **CTA**: "Add more details"
- **Description**: "Help us find your perfect match"
- **Why Optional**: Deep personality insights take time to reflect
- **Fields** (8):
  - sociability_level (1-10)
  - conflict_tolerance
  - stress_management_style
  - values_priority
  - interests
- hobbies
  - bio
  - profile_photo

#### 🎯 Additional Section 4: Advanced Preferences
- **CTA**: "Add more details"
- **Description**: "Fine-tune your search criteria"
- **Why Optional**: Power users who want granular control
- **Fields** (10):
  - preferred_room_type
  - preferred_move_in_date
  - minimum_stay_months
  - cleanliness_expectation (for others)
  - quiet_hours_preference
  - guests_policy_preference
  - coworking_space_needed
  - gym_access_needed
  - preferred_lease_type
  - preferred_amenities[]

#### 🎯 Additional Section 5: Profile Verification (highlighted)
- **CTA**: "Add more details"
- **Description**: "Unlock verified badge"
- **Why Optional but Encouraged**: Users who skip in core can come back
- **Benefits Shown**:
  - Get 3x more profile views
  - Build trust with potential flatmates
  - Stand out with verified badge

**TOTAL ADDITIONAL**: 29 fields

---

## Comparison: Current Implementation vs Figma Strategy

### Current Implementation Issues:

| Issue | Current State | Figma Strategy |
|-------|--------------|----------------|
| **Flow Type** | Linear, all-or-nothing | Core (linear) + Additional (hub) |
| **Field Count** | ~25 fields in core | 35 fields in core, 29 in additional |
| **Verification** | Not implemented | In both core (optional) and additional (encouraged) |
| **Professional Info** | Missing | Moved to Additional (sensitive data) |
| **Completion UX** | Single review page | Core completion → Hub for more |
| **Abandonment Risk** | Medium | Low (quick core, optional additional) |

---

## Recommended Implementation Strategy

### Phase 1: Core Onboarding (Week 1-2)

**Searcher Core Flow** (8 pages):

```
1. /onboarding/searcher/welcome
   - Welcome screen with EasyCo branding

2. /onboarding/searcher/basic-info
   ✅ Already exists, needs: firstName, lastName
   - firstName, lastName (NEW)
   - dateOfBirth ✅
   - nationality ✅
   - languagesSpoken ✅

3. /onboarding/searcher/daily-habits
   ✅ Already exists, needs enhancement
   - wakeUpTime ✅
   - sleepTime ✅
   - workSchedule ✅
   - sportFrequency ✅
   - isSmoker ✅

4. /onboarding/searcher/home-lifestyle
   ✅ Already exists
   - cleanliness ✅
   - guestFrequency ✅
   - musicHabits ✅
   - hasPets ✅
   - petType ✅
   - cookingFrequency ✅

5. /onboarding/searcher/social-vibe
   ✅ Already exists
   - socialEnergy ✅
   - opennessToSharing ✅
   - communicationStyle ✅
   - culturalOpenness ✅

6. /onboarding/searcher/ideal-coliving (NEW)
   ❌ Needs to be created
   - preferredColivingSize (2-3, 4-6, 7-10, 10+)
   - preferredGenderMix
   - roommateAgeRangeMin, roommateAgeRangeMax
   - sharedSpaceImportance (slider)
   - communalActivitiesInterest

7. /onboarding/searcher/preferences
   ✅ Already exists, needs enhancement
   - budgetMin ✅
   - budgetMax ✅
   - preferredDistrict ✅
   - petTolerance ✅
   - smokingTolerance ✅
   - cleanlinessExpectation (NEW slider)

8. /onboarding/searcher/verification (NEW, but optional)
   ❌ Needs to be created
   - phoneNumber
   - Phone verification flow (OTP)
   - Email verification
   - ID upload (optional)
   - CTA: "Save Progress" + "I'll verify later"

9. /onboarding/searcher/success
   ✅ Exists
   - Success message
   - CTA: "Start browsing" or "Enhance your profile"
```

### Phase 2: Additional Onboarding Hub (Week 3)

**Profile Enhancement Hub** (`/profile/enhance`):

```typescript
// This is NOT a linear flow
// It's a dashboard with optional sections

/profile/enhance
├── Financial & Guarantee Info (optional)
│   └── /profile/enhance/professional
├── Community & Events (optional)
│   └── /profile/enhance/community
├── Extended Personality (optional)
│   └── /profile/enhance/personality
├── Advanced Preferences (optional)
│   └── /profile/enhance/advanced-preferences
└── Profile Verification (encouraged)
    └── /profile/enhance/verification
```

**Key UX Principles**:
1. ✅ Each section shows completion percentage
2. ✅ "Add more details" CTA (not "Continue")
3. ✅ "Skip for now" option on every page
4. ✅ Benefits clearly stated ("Get 3x more matches!")
5. ✅ Can access main app while incomplete
6. ✅ Gentle reminders to complete (e.g., banner)

---

## Owner Onboarding Strategy

### Core Owner Onboarding (6 pages):

Based on Owner Figma screenshots (owner-01 to owner-29):

```
1. /onboarding/owner/welcome
2. /onboarding/owner/basic-info
   - landlordType ✅
   - firstName ✅
   - lastName ✅
   - companyName (if applicable)
   - email ✅
   - phoneNumber (NEW)

3. /onboarding/owner/about
   - primaryLocation ✅
   - experienceYears ✅
   - portfolioSize (NEW)
   - managementType (NEW)

4. /onboarding/owner/property-basics (NEW)
   - Do you already have a property to list? (Yes/No)
   - If Yes: Quick property preview form
   - If No: Skip to verification

5. /onboarding/owner/verification (NEW)
   - Phone verification
   - Email verification
   - CTA: "I'll verify later"

6. /onboarding/owner/success
   - CTA: "List your property" or "Complete your profile"
```

### Additional Owner Onboarding:

```
/profile/enhance (for owners)
├── Banking Information
│   └── IBAN, account details
├── Legal & Compliance
│   └── Business reg, VAT, insurance
├── Tenant Policies
│   └── Lease duration, deposit, requirements
└── Verification Documents
    └── ID, proof of ownership
```

---

## Implementation Priorities

### Must-Have for Core (Phase 1):

| Page | Status | Priority | Effort |
|------|--------|----------|--------|
| Searcher: basic-info (enhanced) | Partial | 🔴 HIGH | 2h |
| Searcher: ideal-coliving (NEW) | Missing | 🔴 HIGH | 4h |
| Searcher: verification (NEW) | Missing | 🟡 MEDIUM | 6h |
| Owner: basic-info (enhanced) | Partial | 🔴 HIGH | 2h |
| Owner: property-basics (NEW) | Missing | 🔴 HIGH | 4h |
| Owner: verification (NEW) | Missing | 🟡 MEDIUM | 6h |

**Total Effort**: ~24 hours

### Nice-to-Have for Additional (Phase 2):

| Feature | Priority | Effort |
|---------|----------|--------|
| Profile enhancement hub | 🟡 MEDIUM | 8h |
| Professional info page | 🟡 MEDIUM | 4h |
| Community & events page | 🟢 LOW | 4h |
| Extended personality page | 🟢 LOW | 4h |
| Advanced preferences page | 🟢 LOW | 4h |
| Banking page (owners) | 🟡 MEDIUM | 4h |
| Legal compliance page (owners) | 🟡 MEDIUM | 4h |

**Total Effort**: ~32 hours

---

## Database Schema Implications

### Core Onboarding Fields (Required columns):

```sql
-- Essential for matching algorithm
ALTER TABLE user_profiles ADD COLUMN first_name TEXT NOT NULL;
ALTER TABLE user_profiles ADD COLUMN last_name TEXT NOT NULL;
ALTER TABLE user_profiles ADD COLUMN date_of_birth DATE NOT NULL;
ALTER TABLE user_profiles ADD COLUMN nationality TEXT NOT NULL;
ALTER TABLE user_profiles ADD COLUMN languages_spoken TEXT[] NOT NULL;

-- Core lifestyle (required)
ALTER TABLE user_profiles ADD COLUMN wake_up_time TEXT NOT NULL;
ALTER TABLE user_profiles ADD COLUMN sleep_time TEXT NOT NULL;
ALTER TABLE user_profiles ADD COLUMN is_smoker BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN cleanliness_preference TEXT NOT NULL;
ALTER TABLE user_profiles ADD COLUMN social_energy INTEGER NOT NULL; -- 1-10
ALTER TABLE user_profiles ADD COLUMN openness_to_sharing TEXT NOT NULL;

-- Core preferences (required for search)
ALTER TABLE user_profiles ADD COLUMN budget_min INTEGER NOT NULL;
ALTER TABLE user_profiles ADD COLUMN budget_max INTEGER NOT NULL;
ALTER TABLE user_profiles ADD COLUMN preferred_coliving_size TEXT NOT NULL;
ALTER TABLE user_profiles ADD COLUMN preferred_gender_mix TEXT NOT NULL;
```

### Additional Onboarding Fields (Nullable columns):

```sql
-- Optional enrichment data
ALTER TABLE user_profiles ADD COLUMN occupation_status TEXT;
ALTER TABLE user_profiles ADD COLUMN field_of_study_or_work TEXT;
ALTER TABLE user_profiles ADD COLUMN monthly_income_bracket TEXT;
ALTER TABLE user_profiles ADD COLUMN bio TEXT;
ALTER TABLE user_profiles ADD COLUMN interests TEXT[];
ALTER TABLE user_profiles ADD COLUMN event_participation_interest TEXT;
ALTER TABLE user_profiles ADD COLUMN shared_meals_interest BOOLEAN;
```

---

## Key Decisions & Rationale

### Decision 1: First/Last Name in Core
**Rationale**: While not in original Figma basic-info, it's essential for:
- Profile display
- Trust & safety
- Communication between users
- Legal compliance (KYC)

### Decision 2: Verification in Core (Optional)
**Rationale**: Figma shows verification as optional in core flow with "I'll verify later":
- Reduces abandonment
- Users can start browsing immediately
- Verification encouraged via hub later with benefits

### Decision 3: Professional Info in Additional
**Rationale**: Sensitive data (income, employer) should be:
- Optional initially (trust not established)
- Requested after user sees value
- Clearly communicated why it helps (better guarantor matching)

### Decision 4: Ideal Coliving as Separate Page
**Rationale**: Important matching criteria deserve dedicated focus:
- Coliving size preference
- Gender mix preference
- Age range compatibility
- Shared vs private space preference

### Decision 5: Hub Model for Additional
**Rationale**: Non-linear completion:
- Users complete sections that matter to THEM
- Progress tracking motivates completion
- No forced order = better UX
- Can revisit and update anytime

---

## Success Metrics

### Core Onboarding:
- **Target Completion Rate**: >80%
- **Target Time**: 5-7 minutes
- **Drop-off Point**: Monitor which page has highest abandonment
- **Mobile Completion**: >70% (core is mobile-optimized)

### Additional Onboarding:
- **Target Engagement**: >50% complete at least 1 section within 7 days
- **Target Full Completion**: >30% complete all sections within 30 days
- **Verification Rate**: >40% verify phone within 14 days
- **Return Rate**: >60% return to enhance profile after first session

---

## Recommended Phased Rollout

### Week 1-2: Core Onboarding MVP
1. Update Searcher basic-info (add first/last name)
2. Create Searcher ideal-coliving page
3. Create Searcher verification page (optional CTA)
4. Update Owner basic-info (add phone, company name)
5. Create Owner property-basics page
6. Update success pages with "Enhance profile" CTA

### Week 3: Additional Onboarding Hub
1. Create /profile/enhance hub page
2. Create professional-info page
3. Create community-events page
4. Add completion percentage tracking
5. Add gentle reminder system

### Week 4: Polish & Optimization
1. A/B test verification placement
2. Optimize abandonment points
3. Add progressive profiling nudges
4. Analytics implementation
5. User feedback collection

---

## Migration Strategy for Existing Users

**Scenario**: Users who completed old onboarding (25 fields)

**Approach**:
1. Mark their core onboarding as "complete"
2. Show "Enhance Your Profile" banner
3. Pre-fill any existing data
4. Highlight missing sections with benefits
5. Don't force re-onboarding

---

## Conclusion

The Figma designs clearly show a **two-phase onboarding strategy**:

✅ **CORE** = Fast, essential, linear, required
✅ **ADDITIONAL** = Rich, optional, hub-based, progressive

This approach:
- ✅ Reduces abandonment (quick core)
- ✅ Increases engagement (progressive enhancement)
- ✅ Improves match quality (more data over time)
- ✅ Better UX (user chooses what to share)
- ✅ Mobile-friendly (shorter initial flow)

**Recommendation**: Implement Core onboarding first (Week 1-2), then add Additional hub (Week 3+). This allows users to start using the platform quickly while encouraging progressive profiling for better matches.

---

**Document Status**: Ready for Implementation
**Next Step**: Get approval on Core vs Additional split, then proceed with Phase 1 implementation
