# Architecture Supabase Complète - EasyCo Platform

**Date**: 26 octobre 2025
**Status**: 🔴 **DIAGNOSTIC CRITIQUE - RESTRUCTURATION NÉCESSAIRE**

---

## 🚨 DIAGNOSTIC CRITIQUE du Schema Actuel

### État Actuel

Le schema actuel (`supabase/schema.sql`) est **MINIMAL et INADÉQUAT** pour un projet data-centric:

**Problèmes Majeurs**:

1. ❌ **JSONB Blob Antipattern**
   - Tout stocké dans `profile_data JSONB`
   - Impossible à query efficacement
   - Pas de validation de structure
   - Pas de contraintes de données
   - Mauvaises performances

2. ❌ **Perte de Data Richness**
   - 320+ champs requis (PDFs)
   - Seulement ~10 colonnes typées
   - **97% de la data est dans un blob JSON**
   - Impossible d'exploiter pour matching algorithm

3. ❌ **Pas de Structure Relationnelle**
   - Pas de tables séparées pour:
     - Properties
     - Matches
     - Messages
     - Reviews
     - Bookmarks/Favorites
     - Notifications
     - etc.

4. ❌ **Pas de Data Governance**
   - Pas d'enum types
   - Pas de CHECK constraints
   - Pas de foreign keys entre entités
   - Pas d'audit trail

5. ❌ **Pas Scalable**
   - user_profiles deviendra énorme
   - Queries lentes
   - Indexes inefficaces sur JSONB
   - Migration difficile plus tard

### Impact Business

**Sans structure robuste**, on NE PEUT PAS:
- ✗ Faire du matching intelligent (queries sur lifestyle, budget, etc.)
- ✗ Analyser les comportements users
- ✗ Créer des dashboards analytics
- ✗ Optimiser les conversions
- ✗ Détecter les fraudes
- ✗ Segmenter pour marketing
- ✗ A/B testing
- ✗ Recommandations personnalisées

**LA DATA EST LE CORE VALUE** - Il faut une architecture robuste!

---

## 🎯 Architecture Complète Proposée

### Principes de Design

1. **Typed Columns** pour tout champ utilisé dans:
   - Queries/filters
   - Matching algorithm
   - Analytics
   - Business logic

2. **JSONB Only** pour:
   - Metadata flexible
   - Preferences non-critiques
   - Extension points

3. **Normalization** pour:
   - Performance
   - Integrity
   - Maintenance

4. **Audit Trail** pour:
   - GDPR compliance
   - Security
   - Analytics

---

## 📊 SCHEMA COMPLET

### Vue d'Ensemble des Tables

```
CORE TABLES (14):
├── 1. auth.users (Supabase managed)
├── 2. users (Public user records)
├── 3. user_profiles (Detailed profiles)
├── 4. user_verifications (KYC, documents)
├── 5. user_consents (GDPR, privacy)
├── 6. user_preferences (Settings, UI prefs)
├── 7. user_sessions (Analytics, security)
│
PROPERTY TABLES (5):
├── 8. properties (Property listings)
├── 9. property_rooms (Individual rooms in coliving)
├── 10. property_amenities (Join table)
├── 11. property_photos (Media)
├── 12. property_availability (Calendar)
│
MATCHING & INTERACTION (6):
├── 13. matches (Algorithm results)
├── 14. match_actions (swipe/like/pass)
├── 15. conversations (Message threads)
├── 16. messages (Chat messages)
├── 17. bookmarks (Saved properties/profiles)
├── 18. property_views (Analytics)
│
BOOKING & TRANSACTIONS (4):
├── 19. booking_requests (Rental requests)
├── 20. bookings (Confirmed rentals)
├── 21. reviews (User/property reviews)
├── 22. payments (Transaction records)
│
ENUM TABLES (Referenced):
├── property_types
├── amenities_catalog
├── languages
├── cities
```

---

## 📋 TABLES DÉTAILLÉES

### 1. users (Core User Data)

**Purpose**: Extension of auth.users with app-specific fields

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic Identity
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT,
  phone_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,

  -- User Classification
  user_type TEXT NOT NULL CHECK (user_type IN ('searcher', 'owner', 'resident')),
  account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'deleted', 'pending_verification')),

  -- Profile Completion
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step TEXT, -- Current step if incomplete
  profile_completion_score INTEGER DEFAULT 0 CHECK (profile_completion_score BETWEEN 0 AND 100),

  -- Display
  display_name TEXT,
  avatar_url TEXT,

  -- Activity
  last_login_at TIMESTAMPTZ,
  last_active_at TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0,

  -- Flags
  is_verified BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  is_test_account BOOLEAN DEFAULT FALSE,

  -- GDPR
  gdpr_consent_at TIMESTAMPTZ,
  marketing_consent BOOLEAN DEFAULT FALSE,
  data_retention_until TIMESTAMPTZ,

  -- Metadata
  referral_source TEXT,
  utm_campaign TEXT,
  utm_source TEXT,
  utm_medium TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ -- Soft delete
);
```

---

### 2. user_profiles (Rich User Data)

**Purpose**: ALL profile data from onboarding + enhancements

```sql
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('searcher', 'owner', 'resident')),

  -- ==========================================================================
  -- BASIC INFORMATION (ALL USER TYPES)
  -- ==========================================================================
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender_identity TEXT CHECK (gender_identity IN ('male', 'female', 'non-binary', 'prefer-not-to-say', 'other')),
  nationality TEXT,
  languages_spoken TEXT[] DEFAULT '{}',
  current_city TEXT,
  current_country TEXT,
  bio TEXT,
  profile_photo_url TEXT,
  profile_photos TEXT[], -- Multiple photos

  -- ==========================================================================
  -- SEARCHER/RESIDENT SPECIFIC FIELDS
  -- ==========================================================================

  -- Professional Information
  occupation_status TEXT CHECK (occupation_status IN ('student', 'employed', 'self-employed', 'unemployed', 'retired', 'other')),
  field_of_study_or_work TEXT,
  institution_or_company TEXT,
  monthly_income_bracket TEXT CHECK (monthly_income_bracket IN ('under-500', '500-1000', '1000-1500', '1500-2000', '2000-3000', '3000-5000', 'over-5000')),
  employment_type TEXT CHECK (employment_type IN ('full-time', 'part-time', 'freelance', 'contract', 'internship')),
  guarantor_available BOOLEAN DEFAULT FALSE,
  guarantor_name TEXT,
  guarantor_phone TEXT,

  -- Daily Habits
  wake_up_time TEXT CHECK (wake_up_time IN ('early', 'moderate', 'late')),
  sleep_time TEXT CHECK (sleep_time IN ('early', 'moderate', 'late')),
  work_schedule TEXT CHECK (work_schedule IN ('traditional', 'flexible', 'remote', 'student', 'night-shift')),
  sports_frequency TEXT CHECK (sports_frequency IN ('daily', 'few-times-week', 'once-week', 'rarely', 'never')),
  is_smoker BOOLEAN DEFAULT FALSE,
  drinks_alcohol TEXT CHECK (drinks_alcohol IN ('never', 'occasionally', 'socially', 'regularly')),
  diet_type TEXT CHECK (diet_type IN ('omnivore', 'vegetarian', 'vegan', 'pescatarian', 'halal', 'kosher', 'other')),

  -- Home Lifestyle
  cleanliness_preference TEXT CHECK (cleanliness_preference IN ('relaxed', 'moderate', 'tidy', 'spotless')),
  guest_frequency TEXT CHECK (guest_frequency IN ('never', 'rarely', 'sometimes', 'often')),
  music_habits TEXT CHECK (music_habits IN ('quiet', 'low-volume', 'moderate', 'loud')),
  has_pets BOOLEAN DEFAULT FALSE,
  pet_type TEXT,
  cooking_frequency TEXT CHECK (cooking_frequency IN ('never', 'once-week', 'few-times', 'daily')),

  -- Personality Traits
  introvert_extrovert_scale INTEGER CHECK (introvert_extrovert_scale BETWEEN 1 AND 10),
  sociability_level INTEGER CHECK (sociability_level BETWEEN 1 AND 10),
  openness_to_sharing TEXT CHECK (openness_to_sharing IN ('private', 'moderate', 'very-open')),
  communication_style TEXT CHECK (communication_style IN ('direct', 'diplomatic', 'casual', 'formal')),
  cultural_openness TEXT CHECK (cultural_openness IN ('prefer-similar', 'moderate', 'love-diversity')),
  conflict_tolerance TEXT CHECK (conflict_tolerance IN ('low', 'medium', 'high')),
  stress_management_style TEXT,
  values_priority TEXT[], -- ['privacy', 'community', 'sustainability', etc.]
  interests TEXT[],
  hobbies TEXT[],

  -- Housing Preferences (Searcher)
  preferred_room_type TEXT CHECK (preferred_room_type IN ('private', 'shared', 'studio', 'entire-apartment')),
  budget_min INTEGER,
  budget_max INTEGER,
  preferred_location_city TEXT,
  preferred_districts TEXT[],
  preferred_move_in_date DATE,
  minimum_stay_months INTEGER,
  preferred_coliving_size TEXT CHECK (preferred_coliving_size IN ('small', 'medium', 'large', 'no-preference')),
  preferred_gender_mix TEXT CHECK (preferred_gender_mix IN ('male-only', 'female-only', 'mixed', 'no-preference')),
  roommate_age_min INTEGER CHECK (roommate_age_min BETWEEN 18 AND 100),
  roommate_age_max INTEGER CHECK (roommate_age_max BETWEEN 18 AND 100),
  shared_space_importance INTEGER CHECK (shared_space_importance BETWEEN 1 AND 10),
  pet_tolerance BOOLEAN DEFAULT TRUE,
  smoking_tolerance BOOLEAN DEFAULT FALSE,
  cleanliness_expectation TEXT CHECK (cleanliness_expectation IN ('relaxed', 'moderate', 'tidy', 'spotless')),
  quiet_hours_preference BOOLEAN DEFAULT FALSE,
  shared_meals_interest BOOLEAN DEFAULT FALSE,
  coworking_space_needed BOOLEAN DEFAULT FALSE,
  gym_access_needed BOOLEAN DEFAULT FALSE,

  -- Current Living Situation (Resident)
  current_address TEXT,
  current_landlord_name TEXT,
  current_lease_end_date DATE,
  reason_for_change TEXT,
  notice_period_days INTEGER,
  current_roommates_count INTEGER,

  -- ==========================================================================
  -- OWNER SPECIFIC FIELDS
  -- ==========================================================================

  -- Owner Type & Company
  landlord_type TEXT CHECK (landlord_type IN ('individual', 'agency', 'company')),
  company_name TEXT,
  business_registration_number TEXT,
  vat_number TEXT,
  tax_residency_country TEXT,

  -- Experience & Portfolio
  experience_years INTEGER,
  portfolio_size INTEGER DEFAULT 0,
  management_type TEXT CHECK (management_type IN ('self-managed', 'agency', 'hybrid')),
  primary_motivation TEXT CHECK (primary_motivation IN ('income', 'community', 'investment', 'other')),
  availability_for_visits TEXT CHECK (availability_for_visits IN ('flexible', 'weekdays-only', 'weekends-only', 'by-appointment')),

  -- Banking & Payments
  iban TEXT,
  bic_swift TEXT,
  account_holder_name TEXT,
  billing_address TEXT,
  payment_frequency TEXT CHECK (payment_frequency IN ('monthly', 'quarterly', 'annual')),
  currency TEXT DEFAULT 'EUR',

  -- Tenant Policies
  accepts_short_term_leases BOOLEAN DEFAULT TRUE,
  minimum_lease_duration_months INTEGER DEFAULT 6,
  required_tenant_documents TEXT[], -- ['ID', 'income-proof', 'employment-letter']
  guarantor_required BOOLEAN DEFAULT FALSE,
  minimum_income_ratio DECIMAL(3,1) DEFAULT 3.0, -- e.g., 3.0x rent
  credit_score_check_required BOOLEAN DEFAULT FALSE,
  deposit_amount_months DECIMAL(2,1) DEFAULT 1.0,
  pets_allowed_policy BOOLEAN DEFAULT FALSE,
  maintenance_responsibility TEXT CHECK (maintenance_responsibility IN ('landlord', 'tenant', 'shared')),

  -- Owner Preferences
  tenant_selection_style TEXT CHECK (tenant_selection_style IN ('first-come', 'best-match', 'highest-offer')),
  preferred_tenant_types TEXT[], -- ['students', 'professionals', 'families']
  communication_preference TEXT CHECK (communication_preference IN ('email', 'phone', 'sms', 'whatsapp')),
  response_time_hours INTEGER,
  review_visibility_consent BOOLEAN DEFAULT TRUE,

  -- Insurance & Legal
  insurance_policy_number TEXT,
  insurance_provider TEXT,
  liability_coverage_amount DECIMAL(12,2),
  property_insurance_expiry DATE,

  -- ==========================================================================
  -- METADATA & ANALYTICS
  -- ==========================================================================
  profile_views_count INTEGER DEFAULT 0,
  matches_count INTEGER DEFAULT 0,
  messages_sent_count INTEGER DEFAULT 0,
  messages_received_count INTEGER DEFAULT 0,
  average_response_time_minutes INTEGER,
  rating_average DECIMAL(3,2),
  rating_count INTEGER DEFAULT 0,

  -- Behavioral Clustering (ML Generated)
  living_style_cluster TEXT, -- Generated by algorithm
  compatibility_tags TEXT[], -- Generated by algorithm

  -- Flexible Extension
  additional_data JSONB DEFAULT '{}', -- For future fields

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes**:
```sql
CREATE INDEX idx_user_profiles_user_type ON user_profiles(user_type);
CREATE INDEX idx_user_profiles_city ON user_profiles(current_city);
CREATE INDEX idx_user_profiles_budget ON user_profiles(budget_min, budget_max) WHERE user_type IN ('searcher', 'resident');
CREATE INDEX idx_user_profiles_move_in_date ON user_profiles(preferred_move_in_date) WHERE user_type = 'searcher';
CREATE INDEX idx_user_profiles_landlord_type ON user_profiles(landlord_type) WHERE user_type = 'owner';
CREATE INDEX idx_user_profiles_completion_score ON user_profiles(profile_completion_score);
CREATE GIN INDEX idx_user_profiles_languages ON user_profiles USING gin(languages_spoken);
CREATE GIN INDEX idx_user_profiles_interests ON user_profiles USING gin(interests);
CREATE GIN INDEX idx_user_profiles_additional_data ON user_profiles USING gin(additional_data);
```

---

### 3. user_verifications (KYC & Documents)

```sql
CREATE TABLE public.user_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,

  -- Identity Verification
  id_verified BOOLEAN DEFAULT FALSE,
  id_document_type TEXT CHECK (id_document_type IN ('passport', 'national-id', 'drivers-license')),
  id_document_number TEXT,
  id_document_url TEXT, -- Supabase Storage path
  id_document_expiry DATE,
  id_verified_at TIMESTAMPTZ,
  id_verified_by UUID, -- Admin user id

  -- Phone Verification
  phone_verified BOOLEAN DEFAULT FALSE,
  phone_verified_at TIMESTAMPTZ,
  phone_verification_code TEXT,
  phone_verification_attempts INTEGER DEFAULT 0,

  -- Email Verification
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMPTZ,

  -- Owner-Specific Verifications
  proof_of_ownership_url TEXT,
  proof_of_ownership_verified BOOLEAN DEFAULT FALSE,
  proof_of_ownership_verified_at TIMESTAMPTZ,

  insurance_certificate_url TEXT,
  insurance_verified BOOLEAN DEFAULT FALSE,
  insurance_verified_at TIMESTAMPTZ,

  business_registration_url TEXT,
  business_verified BOOLEAN DEFAULT FALSE,
  business_verified_at TIMESTAMPTZ,

  -- KYC Status
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'in-review', 'verified', 'rejected', 'expired')),
  kyc_completed_at TIMESTAMPTZ,
  kyc_rejection_reason TEXT,
  kyc_notes TEXT,

  -- Anti-Money Laundering (AML)
  aml_check_status TEXT DEFAULT 'not-required' CHECK (aml_check_status IN ('not-required', 'pending', 'passed', 'failed')),
  aml_check_date TIMESTAMPTZ,
  aml_provider TEXT, -- e.g., 'veriff', 'onfido'
  aml_reference_id TEXT,

  -- Background Check (Optional)
  background_check_requested BOOLEAN DEFAULT FALSE,
  background_check_status TEXT CHECK (background_check_status IN ('pending', 'passed', 'failed', 'not-requested')),
  background_check_date TIMESTAMPTZ,

  -- Metadata
  verification_ip_address INET,
  verification_user_agent TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 4. user_consents (GDPR Compliance)

```sql
CREATE TABLE public.user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,

  -- Required Consents
  terms_accepted BOOLEAN DEFAULT FALSE NOT NULL,
  terms_version TEXT,
  terms_accepted_at TIMESTAMPTZ,
  terms_accepted_ip INET,

  privacy_accepted BOOLEAN DEFAULT FALSE NOT NULL,
  privacy_version TEXT,
  privacy_accepted_at TIMESTAMPTZ,
  privacy_accepted_ip INET,

  -- Data Processing
  data_processing_consent BOOLEAN DEFAULT FALSE NOT NULL,
  data_processing_at TIMESTAMPTZ,

  -- Matching & Algorithm
  matching_algorithm_consent BOOLEAN DEFAULT FALSE,
  matching_algorithm_at TIMESTAMPTZ,

  -- Marketing & Communications
  marketing_email BOOLEAN DEFAULT FALSE,
  marketing_sms BOOLEAN DEFAULT FALSE,
  marketing_push BOOLEAN DEFAULT FALSE,
  marketing_consent_at TIMESTAMPTZ,

  -- Profile Visibility
  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'members-only', 'hidden')),
  show_in_search BOOLEAN DEFAULT TRUE,
  show_last_active BOOLEAN DEFAULT TRUE,

  -- Data Rights
  gdpr_data_retention_consent BOOLEAN DEFAULT FALSE,
  gdpr_data_retention_at TIMESTAMPTZ,
  data_deletion_requested BOOLEAN DEFAULT FALSE,
  data_deletion_requested_at TIMESTAMPTZ,
  data_deletion_scheduled_for DATE,

  -- Cookie Consent
  cookies_functional BOOLEAN DEFAULT TRUE,
  cookies_analytics BOOLEAN DEFAULT FALSE,
  cookies_marketing BOOLEAN DEFAULT FALSE,
  cookies_consent_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 5. properties (Property Listings)

**Purpose**: Complete property data from Filter List 1 PDF

```sql
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,

  -- ==========================================================================
  -- BASIC INFORMATION
  -- ==========================================================================
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'house', 'studio', 'room', 'coliving', 'shared-house', 'villa', 'loft', 'duplex')),
  building_type TEXT CHECK (building_type IN ('modern', 'traditional', 'historic', 'new-construction')),
  coliving_structure TEXT CHECK (coliving_structure IN ('independent-rooms', 'shared-apartments', 'mixed')),

  -- ==========================================================================
  -- LOCATION
  -- ==========================================================================
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  district_neighborhood TEXT,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'Belgium',
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  proximity_transport TEXT,
  proximity_university TEXT,
  distance_to_center_km DECIMAL(5,2),

  -- ==========================================================================
  -- PROPERTY DETAILS
  -- ==========================================================================
  total_surface_m2 DECIMAL(7,2),
  number_of_bedrooms INTEGER,
  number_of_bathrooms INTEGER,
  maximum_occupancy INTEGER,
  floor INTEGER,
  total_floors INTEGER,
  has_elevator BOOLEAN DEFAULT FALSE,
  year_built INTEGER,
  condition TEXT CHECK (condition IN ('excellent', 'good', 'average', 'needs-renovation')),
  furnished BOOLEAN DEFAULT TRUE,

  -- ==========================================================================
  -- PRICING
  -- ==========================================================================
  monthly_rent DECIMAL(10,2) NOT NULL,
  monthly_charges DECIMAL(10,2),
  security_deposit DECIMAL(10,2),
  entry_fees DECIMAL(10,2), -- Admin fees
  indexation_type TEXT CHECK (indexation_type IN ('none', 'annual', 'biannual', 'health-index')),
  utilities_included BOOLEAN DEFAULT FALSE,
  electricity_included BOOLEAN DEFAULT FALSE,
  water_included BOOLEAN DEFAULT FALSE,
  heating_included BOOLEAN DEFAULT FALSE,
  internet_included BOOLEAN DEFAULT FALSE,

  -- ==========================================================================
  -- AVAILABILITY & LEASE
  -- ==========================================================================
  available_from DATE,
  available_until DATE,
  is_available BOOLEAN DEFAULT TRUE,
  minimum_stay_months INTEGER DEFAULT 6,
  maximum_stay_months INTEGER,
  lease_type TEXT CHECK (lease_type IN ('short-term', 'long-term', 'student', 'flexible')),
  renewal_option BOOLEAN DEFAULT TRUE,
  subletting_allowed BOOLEAN DEFAULT FALSE,

  -- ==========================================================================
  -- AMENITIES
  -- ==========================================================================
  kitchen_type TEXT CHECK (kitchen_type IN ('equipped', 'semi-equipped', 'basic', 'none')),
  bathroom_type TEXT CHECK (bathroom_type IN ('private', 'shared', 'ensuite')),
  washing_machine BOOLEAN DEFAULT FALSE,
  dryer BOOLEAN DEFAULT FALSE,
  dishwasher BOOLEAN DEFAULT FALSE,
  internet_type TEXT CHECK (internet_type IN ('fiber', 'cable', 'dsl', 'none')),
  internet_speed_mbps INTEGER,
  heating_type TEXT CHECK (heating_type IN ('central', 'individual', 'electric', 'gas', 'none')),
  air_conditioning BOOLEAN DEFAULT FALSE,
  parking_type TEXT CHECK (parking_type IN ('private', 'street', 'garage', 'none')),
  parking_spaces INTEGER DEFAULT 0,
  balcony BOOLEAN DEFAULT FALSE,
  terrace BOOLEAN DEFAULT FALSE,
  garden BOOLEAN DEFAULT FALSE,
  garden_size_m2 DECIMAL(7,2),
  gym_access BOOLEAN DEFAULT FALSE,
  coworking_space BOOLEAN DEFAULT FALSE,
  storage_space BOOLEAN DEFAULT FALSE,
  bike_storage BOOLEAN DEFAULT FALSE,

  -- ==========================================================================
  -- RULES & POLICIES
  -- ==========================================================================
  gender_policy TEXT CHECK (gender_policy IN ('mixed', 'male-only', 'female-only', 'no-preference')),
  minimum_age INTEGER CHECK (minimum_age >= 18),
  maximum_age INTEGER CHECK (maximum_age <= 100),
  couples_allowed BOOLEAN DEFAULT FALSE,
  pets_allowed BOOLEAN DEFAULT FALSE,
  pet_types_allowed TEXT[], -- ['cats', 'small-dogs']
  smoking_policy TEXT CHECK (smoking_policy IN ('allowed', 'outside-only', 'not-allowed')),
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  common_area_maintenance TEXT CHECK (common_area_maintenance IN ('included', 'shared', 'tenant')),
  guests_policy TEXT CHECK (guests_policy IN ('allowed', 'limited', 'not-allowed')),
  overnight_guests_allowed BOOLEAN DEFAULT TRUE,
  alcohol_policy TEXT CHECK (alcohol_policy IN ('allowed', 'limited', 'not-allowed')),
  events_allowed BOOLEAN DEFAULT FALSE,

  -- ==========================================================================
  -- CERTIFICATIONS & SAFETY
  -- ==========================================================================
  energy_performance_certificate TEXT, -- A, B, C, D, E, F, G
  epc_score INTEGER,
  epc_expiry_date DATE,
  electrical_installation_compliant BOOLEAN DEFAULT TRUE,
  electrical_certificate_date DATE,
  smoke_detectors BOOLEAN DEFAULT TRUE,
  fire_extinguishers BOOLEAN DEFAULT FALSE,
  carbon_monoxide_detector BOOLEAN DEFAULT FALSE,
  first_aid_kit BOOLEAN DEFAULT FALSE,
  cctv_security BOOLEAN DEFAULT FALSE,
  security_alarm BOOLEAN DEFAULT FALSE,
  secure_entry BOOLEAN DEFAULT FALSE,
  rental_insurance_required BOOLEAN DEFAULT FALSE,

  -- ==========================================================================
  -- ACCESSIBILITY
  -- ==========================================================================
  wheelchair_accessible BOOLEAN DEFAULT FALSE,
  door_width_cm INTEGER,
  walk_in_shower BOOLEAN DEFAULT FALSE,
  grab_bars BOOLEAN DEFAULT FALSE,
  braille_signage BOOLEAN DEFAULT FALSE,
  elevator_accessible BOOLEAN DEFAULT FALSE,

  -- ==========================================================================
  -- MEDIA
  -- ==========================================================================
  main_photo_url TEXT,
  photos TEXT[], -- Array of Supabase Storage URLs
  video_url TEXT,
  virtual_tour_url TEXT,
  floor_plan_url TEXT,

  -- ==========================================================================
  -- LANDLORD VERIFICATION
  -- ==========================================================================
  landlord_verified BOOLEAN DEFAULT FALSE,
  ownership_proof_verified BOOLEAN DEFAULT FALSE,
  insurance_verified BOOLEAN DEFAULT FALSE,
  landlord_rating DECIMAL(3,2),
  landlord_reviews_count INTEGER DEFAULT 0,

  -- ==========================================================================
  -- TENANT REQUIREMENTS
  -- ==========================================================================
  minimum_income_required DECIMAL(10,2),
  income_verification_required BOOLEAN DEFAULT FALSE,
  guarantor_required BOOLEAN DEFAULT FALSE,
  credit_score_check BOOLEAN DEFAULT FALSE,
  employment_proof_required BOOLEAN DEFAULT FALSE,
  student_proof_required BOOLEAN DEFAULT FALSE,

  -- ==========================================================================
  -- ANALYTICS & STATUS
  -- ==========================================================================
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive', 'pending', 'rented', 'archived')),
  views_count INTEGER DEFAULT 0,
  inquiries_count INTEGER DEFAULT 0,
  bookmarks_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),
  reviews_count INTEGER DEFAULT 0,

  -- Boost & Promotion
  is_featured BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMPTZ,
  boost_score INTEGER DEFAULT 0,

  -- SEO
  slug TEXT UNIQUE,
  meta_title TEXT,
  meta_description TEXT,

  -- Flexible Extension
  additional_features JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  last_modified_at TIMESTAMPTZ,
  rented_at TIMESTAMPTZ
);
```

**Indexes**:
```sql
CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_available FROM properties(available_from) WHERE is_available = TRUE;
CREATE INDEX idx_properties_rent ON properties(monthly_rent);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_location ON properties USING gist (ll_to_earth(latitude, longitude));
CREATE INDEX idx_properties_bedrooms ON properties(number_of_bedrooms);
CREATE INDEX idx_properties_featured ON properties(is_featured, featured_until) WHERE is_featured = TRUE;
CREATE GIN INDEX idx_properties_search ON properties USING gin(to_tsvector('english', title || ' ' || description));
```

---

### 6. matches (Matching Algorithm Results)

```sql
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Participants
  searcher_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  target_id UUID NOT NULL, -- Can be user or property
  target_type TEXT NOT NULL CHECK (target_type IN ('user', 'property')),

  -- Match Score
  compatibility_score DECIMAL(5,2) NOT NULL CHECK (compatibility_score BETWEEN 0 AND 100),
  match_algorithm_version TEXT,

  -- Score Breakdown
  lifestyle_score DECIMAL(5,2),
  budget_score DECIMAL(5,2),
  location_score DECIMAL(5,2),
  personality_score DECIMAL(5,2),
  preferences_score DECIMAL(5,2),

  -- Match Factors (for explanation)
  match_factors JSONB, -- {'shared_interests': ['cooking', 'sports'], 'similar_schedule': true}

  -- Status
  match_status TEXT DEFAULT 'pending' CHECK (match_status IN ('pending', 'shown', 'liked', 'passed', 'matched', 'expired')),

  -- Mutual Match
  is_mutual BOOLEAN DEFAULT FALSE,
  mutual_matched_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  shown_at TIMESTAMPTZ,
  actioned_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_matches_searcher ON matches(searcher_id, match_status);
CREATE INDEX idx_matches_target ON matches(target_id, target_type);
CREATE INDEX idx_matches_score ON matches(compatibility_score DESC);
CREATE INDEX idx_matches_mutual ON matches(is_mutual) WHERE is_mutual = TRUE;
```

---

### 7. conversations & messages

```sql
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Participants
  user1_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  user2_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,

  -- Related to
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'blocked')),

  -- Metadata
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,
  messages_count INTEGER DEFAULT 0,

  -- Read Status
  user1_unread_count INTEGER DEFAULT 0,
  user2_unread_count INTEGER DEFAULT 0,
  user1_last_read_at TIMESTAMPTZ,
  user2_last_read_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user1_id, user2_id),
  CHECK (user1_id < user2_id) -- Ensure consistent ordering
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,

  -- Sender
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,

  -- Content
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  attachment_url TEXT,

  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT FALSE,

  -- Moderation
  is_flagged BOOLEAN DEFAULT FALSE,
  flagged_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_unread ON messages(is_read) WHERE is_read = FALSE;
```

---

### 8. bookmarks (Saved Items)

```sql
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,

  -- Bookmarked Item
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('property', 'user')),

  -- Organization
  folder_name TEXT DEFAULT 'default',
  notes TEXT,
  tags TEXT[],

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, target_id, target_type)
);

CREATE INDEX idx_bookmarks_user ON bookmarks(user_id, target_type);
CREATE INDEX idx_bookmarks_target ON bookmarks(target_id, target_type);
```

---

### 9. reviews (User & Property Reviews)

```sql
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Reviewer
  reviewer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,

  -- Reviewed Entity
  reviewed_id UUID NOT NULL,
  reviewed_type TEXT NOT NULL CHECK (reviewed_type IN ('user', 'property', 'booking')),

  -- Rating
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),

  -- Detailed Ratings
  cleanliness_rating INTEGER CHECK (cleanliness_rating BETWEEN 1 AND 5),
  communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
  location_rating INTEGER CHECK (location_rating BETWEEN 1 AND 5),
  value_rating INTEGER CHECK (value_rating BETWEEN 1 AND 5),

  -- Review Content
  title TEXT,
  content TEXT,
  pros TEXT[],
  cons TEXT[],

  -- Media
  photos TEXT[],

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'flagged', 'removed')),
  is_verified_stay BOOLEAN DEFAULT FALSE,

  -- Response
  owner_response TEXT,
  owner_responded_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewed ON reviews(reviewed_id, reviewed_type, status);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
```

---

### 10. booking_requests & bookings

```sql
CREATE TABLE public.booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Participants
  searcher_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,

  -- Booking Details
  move_in_date DATE NOT NULL,
  move_out_date DATE,
  duration_months INTEGER,

  -- Pricing
  monthly_rent DECIMAL(10,2) NOT NULL,
  total_rent DECIMAL(10,2),
  deposit_amount DECIMAL(10,2),

  -- Request Message
  message TEXT,

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired', 'cancelled')),
  rejection_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_request_id UUID REFERENCES public.booking_requests(id),

  -- Same structure as booking_requests but confirmed
  -- ... (columns omitted for brevity)

  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  contract_url TEXT,
  contract_signed BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 11. analytics_events (User Behavior Tracking)

```sql
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  session_id UUID,

  -- Event
  event_name TEXT NOT NULL,
  event_category TEXT,
  event_properties JSONB,

  -- Context
  page_url TEXT,
  referrer_url TEXT,
  user_agent TEXT,
  ip_address INET,
  device_type TEXT CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
  browser TEXT,
  os TEXT,

  -- AB Testing
  experiment_id TEXT,
  variant_id TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_user ON analytics_events(user_id, created_at DESC);
CREATE INDEX idx_analytics_event ON analytics_events(event_name, created_at DESC);
CREATE INDEX idx_analytics_session ON analytics_events(session_id);
CREATE GIN INDEX idx_analytics_properties ON analytics_events USING gin(event_properties);
```

---

## 🔐 ROW LEVEL SECURITY (RLS) POLICIES

### General Patterns

```sql
-- Users can view own data
CREATE POLICY "view_own" ON {table} FOR SELECT USING (auth.uid() = user_id);

-- Users can update own data
CREATE POLICY "update_own" ON {table} FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert own data
CREATE POLICY "insert_own" ON {table} FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Owners can view own properties
CREATE POLICY "owners_view_own_properties" ON properties FOR SELECT
  USING (auth.uid() = owner_id OR status = 'active');

-- Public can view active properties
CREATE POLICY "public_view_active_properties" ON properties FOR SELECT
  USING (status = 'active' AND is_available = TRUE);

-- Conversation participants can view messages
CREATE POLICY "participants_view_messages" ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_id
      AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
    )
  );
```

---

## 📈 ANALYTICS & REPORTING VIEWS

```sql
-- Complete user profile view
CREATE VIEW v_complete_user_profiles AS
SELECT
  u.*,
  up.*,
  uv.kyc_status,
  uv.id_verified,
  uv.phone_verified,
  uc.terms_accepted,
  uc.marketing_email
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN user_verifications uv ON u.id = uv.user_id
LEFT JOIN user_consents uc ON u.id = uc.user_id;

-- Property search view (optimized for queries)
CREATE VIEW v_property_search AS
SELECT
  p.*,
  u.display_name as owner_name,
  u.avatar_url as owner_avatar,
  uv.id_verified as owner_verified,
  up.rating_average as owner_rating
FROM properties p
JOIN users u ON p.owner_id = u.id
LEFT JOIN user_verifications uv ON u.id = uv.user_id
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE p.status = 'active' AND p.is_available = TRUE;

-- Analytics dashboard
CREATE VIEW v_platform_metrics AS
SELECT
  COUNT(DISTINCT u.id) FILTER (WHERE u.user_type = 'searcher') as total_searchers,
  COUNT(DISTINCT u.id) FILTER (WHERE u.user_type = 'owner') as total_owners,
  COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'active') as active_properties,
  COUNT(DISTINCT m.id) FILTER (WHERE m.is_mutual = TRUE) as total_matches,
  COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'active') as active_bookings
FROM users u
CROSS JOIN properties p
CROSS JOIN matches m
CROSS JOIN bookings b;
```

---

## 🔄 TRIGGERS & FUNCTIONS

### Auto-update timestamps

```sql
CREATE TRIGGER set_updated_at BEFORE UPDATE ON {table}
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
```

### Auto-calculate profile completion

```sql
CREATE OR REPLACE FUNCTION calculate_profile_completion()
RETURNS TRIGGER AS $$
DECLARE
  score INTEGER := 0;
  total_fields INTEGER := 50; -- Adjust based on user type
  filled_fields INTEGER := 0;
BEGIN
  -- Count non-null critical fields
  IF NEW.first_name IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
  IF NEW.last_name IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
  -- ... (add all critical fields)

  score := (filled_fields::DECIMAL / total_fields * 100)::INTEGER;
  NEW.profile_completion_score := score;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profile_completion
  BEFORE INSERT OR UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION calculate_profile_completion();
```

### Update property stats

```sql
CREATE OR REPLACE FUNCTION update_property_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE properties
    SET views_count = views_count + 1
    WHERE id = NEW.property_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_property_views
  AFTER INSERT ON property_views
  FOR EACH ROW EXECUTE FUNCTION update_property_stats();
```

---

## 📦 ENUMS & LOOKUP TABLES

```sql
CREATE TABLE amenities_catalog (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  icon TEXT
);

CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  UNIQUE(name, country)
);

CREATE TABLE languages (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL, -- 'en', 'fr', 'nl'
  name TEXT NOT NULL
);
```

---

## 🎯 MIGRATION STRATEGY

### Phase 1: Core Tables (Week 1)
1. ✅ Apply enhanced users table
2. ✅ Apply user_profiles with all typed columns
3. ✅ Apply user_verifications
4. ✅ Apply user_consents
5. ✅ Migrate existing JSONB data to typed columns

### Phase 2: Properties & Matching (Week 2)
1. ✅ Apply properties table
2. ✅ Apply property_rooms, property_amenities
3. ✅ Apply matches table
4. ✅ Implement matching algorithm

### Phase 3: Interactions (Week 3)
1. ✅ Apply conversations, messages
2. ✅ Apply bookmarks, reviews
3. ✅ Apply booking_requests, bookings

### Phase 4: Analytics & Optimization (Week 4)
1. ✅ Apply analytics_events
2. ✅ Create all indexes
3. ✅ Create all views
4. ✅ Performance testing
5. ✅ Monitoring setup

---

## 📊 ESTIMATED IMPACT

### Data Storage

| Entity | Estimated Records (Year 1) | Storage per Record | Total Storage |
|--------|----------------------------|-------------------|---------------|
| users | 10,000 | 2 KB | 20 MB |
| user_profiles | 10,000 | 5 KB | 50 MB |
| properties | 2,000 | 10 KB | 20 MB |
| messages | 100,000 | 1 KB | 100 MB |
| analytics_events | 1,000,000 | 0.5 KB | 500 MB |
| **TOTAL** | | | **~700 MB** |

### Query Performance (Estimated)

| Query Type | Current (JSONB) | Proposed (Typed) | Improvement |
|------------|-----------------|------------------|-------------|
| User search by city | 500ms | 10ms | **50x faster** |
| Property filter | 800ms | 15ms | **53x faster** |
| Matching algorithm | N/A | 100ms | **New capability** |
| Analytics aggregation | 2000ms | 50ms | **40x faster** |

---

## ✅ NEXT ACTIONS

1. **Review & Approve** this architecture
2. **Create migration SQL** files (one per phase)
3. **Update TypeScript types** to match schema
4. **Update onboarding-helpers.ts** to use typed columns
5. **Apply Phase 1 migration** to Supabase
6. **Test data integrity**
7. **Deploy to production**

---

**Document Status**: ⚠️ **AWAITING APPROVAL**
**Recommendation**: **APPROVE & IMPLEMENT ASAP** - Current schema is blocking data-driven features
