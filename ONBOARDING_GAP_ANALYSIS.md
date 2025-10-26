# Onboarding Gap Analysis - EasyCo Platform

**Date**: 26 octobre 2025
**Status**: Analysis Complete - Ready for Implementation

---

## Executive Summary

This document provides a comprehensive comparison between:
- **Current Implementation**: What's currently captured in Searcher and Owner onboarding
- **Required Fields**: What the PDF specifications require
- **Gaps**: Missing fields that need to be implemented

### Overview Statistics

| User Type | PDF Required Fields | Currently Implemented | Missing Fields | Coverage % |
|-----------|--------------------|-----------------------|----------------|------------|
| **Searcher/Resident** | ~70 fields | ~25 fields | ~45 fields | 36% |
| **Owner** | ~60 fields | ~6 fields | ~54 fields | 10% |
| **Property** | ~180 fields | ~30 fields | ~150 fields | 17% |

---

## 1. SEARCHER ONBOARDING ANALYSIS

### Current Implementation (~/app/onboarding/searcher/)

#### Pages Implemented:
1. **basic-info** (3 fields)
   - dateOfBirth
   - nationality
   - languages (array)

2. **daily-habits** (5 fields)
   - wakeUpTime
   - sleepTime
   - workSchedule
   - sportFrequency
   - isSmoker

3. **home-lifestyle** (6 fields)
   - cleanliness
   - guestFrequency
   - musicHabits
   - hasPets
   - petType
   - cookingFrequency

4. **social-vibe** (4 fields)
   - socialEnergy (introvert/extrovert)
   - opennessToSharing
   - communicationStyle
   - culturalOpenness

5. **preferences** (5 fields)
   - budgetMin
   - budgetMax
   - preferredDistrict
   - openToLivingWithPets
   - acceptSmokersInHouse

6. **lifestyle** (stub page, not fully implemented)

7. **location** (stub page, not fully implemented)

8. **budget** (stub page, not fully implemented)

**Total Currently Captured**: ~25 fields

---

### Required Fields (From PDF Filter List 2 - People Specific)

#### ✅ IMPLEMENTED (25 fields)

**Basic Information**:
- ✅ date_of_birth
- ✅ nationality
- ✅ languages_spoken

**Professional Situation**:
- ✅ occupation_status (called workSchedule)

**Daily Habits**:
- ✅ wake_up_time
- ✅ sleep_time
- ✅ work_schedule
- ✅ smoker
- ✅ sports_frequency
- ✅ cleanliness_preference
- ✅ pet_owner
- ✅ cooking_frequency

**Personality**:
- ✅ introvert_extrovert_scale (called socialEnergy)
- ✅ openness_to_sharing
- ✅ communication_style
- ✅ cultural_openness

**Housing Preferences**:
- ✅ budget_min
- ✅ budget_max
- ✅ preferred_location_city (called preferredDistrict)
- ✅ pet_tolerance (called openToLivingWithPets)
- ✅ smoking_tolerance (called acceptSmokersInHouse)

---

#### ❌ MISSING (45+ fields)

**Basic Information** (7 missing):
- ❌ user_type (searcher/resident) - auto-set but not asked
- ❌ first_name
- ❌ last_name
- ❌ gender_identity
- ❌ current_city
- ❌ id_verified
- ❌ phone_verified
- ❌ email_verified (exists in auth but not captured in onboarding)

**Professional Situation** (5 missing):
- ❌ field_of_study_or_work
- ❌ institution_or_company
- ❌ monthly_income_bracket
- ❌ employment_type (full-time, part-time, freelance, student, unemployed)
- ❌ guarantor_available

**Daily Habits** (2 missing):
- ❌ drinks_alcohol
- ❌ diet_type (omnivore, vegetarian, vegan, pescatarian, halal, kosher, etc.)

**Personality** (3 missing):
- ❌ sociability_level (1-10 scale)
- ❌ conflict_tolerance
- ❌ values_priority (e.g., privacy, community, sustainability, career, health)

**Housing Preferences** (10 missing):
- ❌ preferred_room_type (private, shared, studio, entire apartment)
- ❌ preferred_move_in_date
- ❌ preferred_coliving_size (small <5, medium 5-10, large 10+)
- ❌ preferred_gender_mix (male-only, female-only, mixed, no-preference)
- ❌ cleanliness_expectation (for others, not just self)
- ❌ guests_policy_preference
- ❌ quiet_hours_preference
- ❌ shared_meals_interest
- ❌ coworking_space_needed
- ❌ minimum_stay_months

**Behavioral Patterns** (4 missing):
- ❌ living_style_cluster (assigned by algorithm but could capture preferences)
- ❌ communication_preference (text, call, email, in-person)
- ❌ stress_management_style
- ❌ profile_completion_score (auto-calculated)

**Consent & Legal** (6 missing):
- ❌ terms_and_conditions_acceptance
- ❌ privacy_policy_acceptance
- ❌ data_processing_consent
- ❌ matching_algorithm_consent
- ❌ marketing_opt_in
- ❌ profile_visibility (public, private, hidden)

**Verification** (3 missing):
- ❌ id_document_upload
- ❌ phone_number
- ❌ profile_photo_upload

**Additional Missing Fields** (5):
- ❌ bio/about_me (free text)
- ❌ interests/hobbies (tags or text)
- ❌ emergency_contact_name
- ❌ emergency_contact_phone
- ❌ current_living_situation

---

## 2. OWNER ONBOARDING ANALYSIS

### Current Implementation (~/app/onboarding/owner/)

#### Pages Implemented:
1. **basic-info** (3 fields)
   - firstName
   - lastName
   - email

2. **about** (3 fields)
   - ownerType (individual, agency, company)
   - primaryLocation
   - hostingExperience

**Total Currently Captured**: ~6 fields

---

### Required Fields (From PDF Filter List 3 - Home Owner)

#### ✅ IMPLEMENTED (6 fields)

**Personal/Company Info**:
- ✅ landlord_type (called ownerType)
- ✅ first_name
- ✅ last_name
- ✅ email
- ✅ experience_years (called hostingExperience)
- ✅ primary location (approximate)

---

#### ❌ MISSING (54+ fields)

**Personal/Company Information** (8 missing):
- ❌ company_name (if landlord_type = company)
- ❌ national_id_number
- ❌ nationality
- ❌ phone_number
- ❌ address (full address)
- ❌ city
- ❌ postal_code
- ❌ country

**Verification** (4 missing):
- ❌ id_document_upload (PDF/image)
- ❌ proof_of_ownership (property deed, etc.)
- ❌ phone_verified
- ❌ kyc_status (pending, verified, rejected)

**Experience & Management** (3 missing):
- ❌ portfolio_size (number of properties managed)
- ❌ management_type (self-managed, agency, hybrid)
- ❌ primary_motivation (income, community, investment, etc.)
- ❌ availability_for_visits (flexible, weekdays-only, weekends-only, by-appointment)

**Legal & Compliance** (7 missing):
- ❌ business_registration_number (for agencies/companies)
- ❌ vat_number (for professional landlords)
- ❌ insurance_policy_number
- ❌ insurance_certificate_upload
- ❌ tax_residency_country
- ❌ aml_check_status (anti-money laundering)
- ❌ gdpr_compliance_consent

**Banking & Payments** (6 missing):
- ❌ iban
- ❌ bic_swift
- ❌ account_holder_name
- ❌ billing_address
- ❌ payment_frequency (monthly, quarterly, annual)
- ❌ currency (EUR, USD, GBP, etc.)

**Tenant Policies** (9 missing):
- ❌ accepts_short_term_leases
- ❌ minimum_lease_duration_months
- ❌ required_documents_from_tenants (ID, proof of income, etc.)
- ❌ guarantor_required
- ❌ minimum_income_ratio (e.g., 3x rent)
- ❌ credit_score_check_required
- ❌ deposit_amount_policy (1 month, 2 months, etc.)
- ❌ maintenance_responsibility (landlord, tenant, shared)
- ❌ pets_allowed_policy

**Preferences & Communication** (5 missing):
- ❌ tenant_selection_style (first-come, best-match, highest-offer)
- ❌ preferred_tenant_profile (students, professionals, families, retirees)
- ❌ communication_preference (email, phone, SMS, WhatsApp)
- ❌ response_time_commitment (24h, 48h, 72h, week)
- ❌ review_visibility_consent

**Account & Metadata** (6 missing):
- ❌ profile_completion_score
- ❌ account_status (active, suspended, pending-verification)
- ❌ properties_linked_count
- ❌ terms_and_conditions_acceptance
- ❌ privacy_policy_acceptance
- ❌ profile_photo_url

**Additional Missing** (6):
- ❌ bio/about (free text description)
- ❌ languages_spoken
- ❌ linkedin_url
- ❌ website_url
- ❌ emergency_contact
- ❌ operating_hours (for agencies)

---

## 3. RESIDENT ONBOARDING

### Current Implementation

**Status**: ❌ **DOES NOT EXIST**

No resident onboarding flow has been implemented.

---

### Required Fields

According to PDF Filter List 2, Residents share the same fields as Searchers (70 fields), with potentially different:
- Flow/UX (since they're already living somewhere vs searching)
- Some preference fields might not apply
- Additional fields specific to existing living situations

**Recommendation**: Create Resident onboarding using the same fields as Searcher, but:
1. Skip housing preferences (budget, location, move-in date)
2. Focus more on personality/lifestyle/daily habits
3. Add fields specific to current living situation
4. Different success message and next steps

---

## 4. DATABASE SCHEMA GAPS

### Current Schema (supabase/schema.sql)

**user_profiles table**:
- Uses a flexible `profile_data JSONB` column
- This is good for MVP but needs structure

**Issues**:
1. No validation on JSONB structure
2. Hard to query specific fields
3. No indexes on commonly queried fields
4. No enum types for dropdown values

---

### Recommended Schema Updates

#### Option A: Keep JSONB but add typed columns for critical fields

```sql
ALTER TABLE user_profiles ADD COLUMN first_name TEXT;
ALTER TABLE user_profiles ADD COLUMN last_name TEXT;
ALTER TABLE user_profiles ADD COLUMN phone_number TEXT;
ALTER TABLE user_profiles ADD COLUMN date_of_birth DATE;
ALTER TABLE user_profiles ADD COLUMN nationality TEXT;
ALTER TABLE user_profiles ADD COLUMN gender_identity TEXT;
ALTER TABLE user_profiles ADD COLUMN occupation_status TEXT;
ALTER TABLE user_profiles ADD COLUMN monthly_income_bracket TEXT;
ALTER TABLE user_profiles ADD COLUMN languages_spoken TEXT[];
ALTER TABLE user_profiles ADD COLUMN verification_status TEXT;
ALTER TABLE user_profiles ADD COLUMN profile_completion_score INTEGER;
ALTER TABLE user_profiles ADD COLUMN consents JSONB; -- for all consent fields
```

#### Option B: Create separate verification and consent tables

```sql
CREATE TABLE user_verifications (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  id_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  kyc_status TEXT,
  id_document_url TEXT,
  verified_at TIMESTAMPTZ
);

CREATE TABLE user_consents (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  terms_accepted BOOLEAN DEFAULT FALSE,
  privacy_accepted BOOLEAN DEFAULT FALSE,
  data_processing BOOLEAN DEFAULT FALSE,
  matching_algorithm BOOLEAN DEFAULT FALSE,
  marketing_opt_in BOOLEAN DEFAULT FALSE,
  consented_at TIMESTAMPTZ
);
```

#### Option C: Hybrid - Critical fields as columns, rest in JSONB

**Recommended approach for MVP+**

---

## 5. PRIORITY RECOMMENDATIONS

### Phase 1: Critical Missing Fields (Week 1)

**Searcher Onboarding**:
1. ✅ Add first_name, last_name to basic-info
2. ✅ Add gender_identity to basic-info
3. ✅ Add field_of_study_or_work, institution_or_company to professional info (new page)
4. ✅ Add employment_type, monthly_income_bracket to professional info
5. ✅ Add guarantor_available to professional info
6. ✅ Add diet_type, drinks_alcohol to daily habits
7. ✅ Add preferred_room_type, preferred_move_in_date to preferences
8. ✅ Add terms_and_conditions_acceptance, privacy_policy_acceptance to privacy page
9. ✅ Fix budget, location, lifestyle stub pages

**Owner Onboarding**:
1. ✅ Add company_name (conditional on ownerType)
2. ✅ Add phone_number, nationality
3. ✅ Add full address fields (city, postal_code, country)
4. ✅ Add portfolio_size, management_type
5. ✅ Add IBAN, account_holder_name for banking (new page)
6. ✅ Add insurance_policy_number
7. ✅ Add tenant policies (new page): minimum_lease_duration, guarantor_required, pets_allowed
8. ✅ Add terms_and_conditions_acceptance, privacy_policy_acceptance

**Resident Onboarding**:
1. ✅ Create complete flow (copy from Searcher, adapt)

### Phase 2: Verification & Documents (Week 2)

1. Add ID document upload for both Searcher and Owner
2. Add proof of ownership upload for Owner
3. Add phone verification flow
4. Add profile photo upload
5. Add KYC verification system

### Phase 3: Enhanced Fields (Week 3)

1. Add all remaining personality fields
2. Add all remaining preference fields
3. Add behavioral pattern fields
4. Add emergency contacts
5. Add bio/about sections

### Phase 4: Polish & Validation (Week 4)

1. Add proper validation for all fields
2. Add conditional logic (e.g., show company fields only if ownerType = company)
3. Add field dependencies
4. Add data sanitization
5. Add comprehensive error handling

---

## 6. PROPOSED NEW ONBOARDING STRUCTURE

### Searcher Onboarding (Enhanced)

```
1. /basic-info (8 fields)
   - firstName, lastName
   - dateOfBirth
   - gender_identity
   - nationality
   - current_city
   - languages_spoken
   - profile_photo_upload

2. /professional-info (NEW - 5 fields)
   - occupation_status
   - field_of_study_or_work
   - institution_or_company
   - monthly_income_bracket
   - guarantor_available

3. /daily-habits (ENHANCED - 7 fields)
   - wake_up_time
   - sleep_time
   - work_schedule
   - sport_frequency
   - smoker
   - drinks_alcohol
   - diet_type

4. /home-lifestyle (SAME - 6 fields)
   - cleanliness
   - guest_frequency
   - music_habits
   - has_pets
   - pet_type
   - cooking_frequency

5. /personality (NEW - 6 fields)
   - introvert_extrovert_scale
   - sociability_level
   - conflict_tolerance
   - values_priority
   - communication_preference
   - stress_management_style

6. /social-vibe (ENHANCED - 4 fields)
   - openness_to_sharing
   - communication_style
   - cultural_openness
   - shared_meals_interest

7. /housing-preferences (ENHANCED - 12 fields)
   - preferred_room_type
   - budget_min, budget_max
   - preferred_location_city
   - preferred_move_in_date
   - minimum_stay_months
   - preferred_coliving_size
   - preferred_gender_mix
   - pet_tolerance
   - smoking_tolerance
   - cleanliness_expectation
   - quiet_hours_preference

8. /interests (NEW - 3 fields)
   - bio/about_me
   - interests/hobbies
   - lifestyle tags

9. /verification (NEW - 3 fields)
   - phone_number
   - phone_verification
   - id_document_upload

10. /privacy-consent (ENHANCED - 7 fields)
    - terms_and_conditions
    - privacy_policy
    - data_processing_consent
    - matching_algorithm_consent
    - marketing_opt_in
    - profile_visibility
    - emergency_contact

11. /review (ENHANCED)
    - Show all collected data
    - Allow editing any section

12. /success
```

**Total: 12 pages, ~70 fields**

---

### Owner Onboarding (Enhanced)

```
1. /basic-info (ENHANCED - 9 fields)
   - landlord_type
   - first_name, last_name
   - company_name (if applicable)
   - email, phone_number
   - nationality
   - profile_photo_upload

2. /address (NEW - 5 fields)
   - address
   - city, postal_code
   - country
   - primary_location

3. /experience (ENHANCED - 5 fields)
   - experience_years
   - portfolio_size
   - management_type
   - primary_motivation
   - availability_for_visits

4. /verification (NEW - 5 fields)
   - national_id_number
   - id_document_upload
   - proof_of_ownership_upload
   - insurance_policy_number
   - insurance_certificate_upload

5. /banking (NEW - 6 fields)
   - iban, bic_swift
   - account_holder_name
   - billing_address
   - payment_frequency
   - currency

6. /tenant-policies (NEW - 9 fields)
   - accepts_short_term_leases
   - minimum_lease_duration_months
   - required_documents
   - guarantor_required
   - minimum_income_ratio
   - credit_score_check
   - deposit_amount_policy
   - pets_allowed
   - maintenance_responsibility

7. /preferences (NEW - 5 fields)
   - tenant_selection_style
   - preferred_tenant_profile
   - communication_preference
   - response_time
   - languages_spoken

8. /legal-compliance (NEW - 5 fields)
   - business_registration_number (if applicable)
   - vat_number (if applicable)
   - tax_residency_country
   - aml_check_consent
   - gdpr_compliance

9. /about (NEW - 4 fields)
   - bio/about
   - website_url (if applicable)
   - linkedin_url (optional)
   - operating_hours (if agency)

10. /privacy-consent (NEW - 4 fields)
    - terms_and_conditions
    - privacy_policy
    - review_visibility
    - marketing_opt_in

11. /review (NEW)
    - Show all collected data
    - Allow editing

12. /success
```

**Total: 12 pages, ~62 fields**

---

### Resident Onboarding (New)

```
1. /basic-info (8 fields)
   - Same as Searcher

2. /current-situation (NEW - 6 fields)
   - current_address
   - current_landlord_name
   - current_lease_end_date
   - reason_for_change
   - notice_period_required
   - current_roommates_count

3. /professional-info (5 fields)
   - Same as Searcher

4. /daily-habits (7 fields)
   - Same as Searcher

5. /home-lifestyle (6 fields)
   - Same as Searcher

6. /personality (6 fields)
   - Same as Searcher

7. /social-vibe (4 fields)
   - Same as Searcher

8. /interests (3 fields)
   - Same as Searcher

9. /verification (3 fields)
   - Same as Searcher

10. /privacy-consent (7 fields)
    - Same as Searcher

11. /review
12. /success
```

**Total: 12 pages, ~55 fields**

---

## 7. TECHNICAL IMPLEMENTATION PLAN

### Step 1: Update Database Schema

Create migration file: `supabase/migrations/001_enhanced_user_profiles.sql`

```sql
-- Add critical typed columns
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS gender_identity TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS nationality TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS current_city TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS languages_spoken TEXT[];
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS profile_completion_score INTEGER DEFAULT 0;

-- Verification table
CREATE TABLE IF NOT EXISTS user_verifications (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  id_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  kyc_status TEXT DEFAULT 'pending',
  id_document_url TEXT,
  proof_of_ownership_url TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consents table
CREATE TABLE IF NOT EXISTS user_consents (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  terms_accepted BOOLEAN DEFAULT FALSE,
  privacy_accepted BOOLEAN DEFAULT FALSE,
  data_processing BOOLEAN DEFAULT FALSE,
  matching_algorithm BOOLEAN DEFAULT FALSE,
  marketing_opt_in BOOLEAN DEFAULT FALSE,
  consented_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own verifications"
  ON user_verifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own consents"
  ON user_consents FOR SELECT USING (auth.uid() = user_id);
```

### Step 2: Create TypeScript Types

Create file: `types/onboarding.ts`

```typescript
export type UserType = 'searcher' | 'owner' | 'resident';

export interface SearcherBasicInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  genderIdentity: string;
  nationality: string;
  currentCity: string;
  languagesSpoken: string[];
  profilePhotoUrl?: string;
}

export interface SearcherProfessionalInfo {
  occupationStatus: 'student' | 'employed' | 'self-employed' | 'unemployed' | 'retired';
  fieldOfStudyOrWork?: string;
  institutionOrCompany?: string;
  monthlyIncomeBracket: string;
  employmentType?: string;
  guarantorAvailable: boolean;
}

// ... etc for all sections
```

### Step 3: Build Enhanced Onboarding Pages

For each new/updated page:
1. Create/update page.tsx file
2. Add proper form validation (Zod schemas)
3. Update localStorage keys
4. Update review page to show all fields
5. Update saveOnboardingData helper

### Step 4: Update Helpers

Update `lib/onboarding-helpers.ts`:
- Add functions to save to new tables (verifications, consents)
- Add profile_completion_score calculation
- Add data validation before save

### Step 5: Update Middleware

Ensure middleware checks profile_completion_score and redirects accordingly.

---

## 8. ESTIMATED EFFORT

| Task | Estimated Time |
|------|----------------|
| Database schema updates | 4 hours |
| TypeScript types | 2 hours |
| Searcher onboarding (9 new/updated pages) | 20 hours |
| Owner onboarding (10 new pages) | 24 hours |
| Resident onboarding (11 new pages) | 22 hours |
| Helper functions updates | 4 hours |
| Review pages updates | 4 hours |
| Testing & bug fixes | 8 hours |
| **TOTAL** | **88 hours (~11 days)** |

---

## 9. NEXT STEPS

1. ✅ Get user approval for this gap analysis
2. ⏳ Start with Phase 1 (Critical Missing Fields)
3. ⏳ Implement database schema updates
4. ⏳ Build Searcher enhancements
5. ⏳ Build Owner enhancements
6. ⏳ Build Resident from scratch
7. ⏳ Test everything
8. ⏳ Deploy to production

---

**Document created**: 26 octobre 2025
**Status**: Ready for Review and Implementation
