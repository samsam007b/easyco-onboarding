// ============================================================================
// ONBOARDING TYPES - Izzico Platform
// ============================================================================

export type UserType = 'searcher' | 'owner' | 'resident';

// ============================================================================
// SEARCHER/RESIDENT ONBOARDING TYPES
// ============================================================================

export interface SearcherBasicInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  genderIdentity: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | 'other';
  nationality: string;
  currentCity: string;
  languagesSpoken: string[];
  profilePhotoUrl?: string;
}

export interface SearcherProfessionalInfo {
  occupationStatus: 'student' | 'employed' | 'self-employed' | 'unemployed' | 'retired';
  fieldOfStudyOrWork?: string;
  institutionOrCompany?: string;
  monthlyIncomeBracket: 'under-500' | '500-1000' | '1000-1500' | '1500-2000' | '2000-3000' | 'over-3000';
  employmentType?: 'full-time' | 'part-time' | 'freelance' | 'contract' | 'internship';
  guarantorAvailable: boolean;
}

export interface SearcherDailyHabits {
  wakeUpTime: 'early' | 'moderate' | 'late';
  sleepTime: 'early' | 'moderate' | 'late';
  workSchedule: 'traditional' | 'flexible' | 'remote' | 'student' | 'night-shift';
  sportFrequency: 'daily' | 'few-times-week' | 'once-week' | 'rarely' | 'never';
  isSmoker: boolean;
  drinksAlcohol: 'never' | 'occasionally' | 'socially' | 'regularly';
  dietType: 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'halal' | 'kosher' | 'other';
}

export interface SearcherHomeLifestyle {
  cleanliness: 'relaxed' | 'moderate' | 'tidy' | 'spotless';
  guestFrequency: 'never' | 'rarely' | 'sometimes' | 'often';
  musicHabits: 'quiet' | 'low-volume' | 'moderate' | 'loud';
  hasPets: boolean;
  petType?: string;
  cookingFrequency: 'never' | 'once-week' | 'few-times' | 'daily';
}

export interface SearcherPersonality {
  introvertExtrovertScale: number; // 1-10 scale
  sociabilityLevel: number; // 1-10 scale
  opennessToSharing: 'private' | 'moderate' | 'very-open';
  communicationStyle: 'direct' | 'diplomatic' | 'casual' | 'formal';
  culturalOpenness: 'prefer-similar' | 'moderate' | 'love-diversity';
  conflictTolerance: 'low' | 'medium' | 'high';
  valuesPriority: string[]; // e.g., ['privacy', 'community', 'sustainability']
  stressManagementStyle?: 'exercise' | 'meditation' | 'social' | 'alone-time' | 'creative';
}

export interface SearcherHousingPreferences {
  preferredRoomType: 'private' | 'shared' | 'studio' | 'entire-apartment';
  budgetMin: number;
  budgetMax: number;
  preferredLocationCity: string;
  preferredDistrict?: string;
  preferredMoveInDate: string;
  minimumStayMonths?: number;
  preferredColivingSize: 'small' | 'medium' | 'large' | 'no-preference';
  preferredGenderMix: 'male-only' | 'female-only' | 'mixed' | 'no-preference';
  petTolerance: boolean;
  smokingTolerance: boolean;
  cleanlinessExpectation: 'relaxed' | 'moderate' | 'tidy' | 'spotless';
  quietHoursPreference?: boolean;
  sharedMealsInterest: boolean;
  coworkingSpaceNeeded: boolean;
}

export interface SearcherInterests {
  bio?: string;
  interests?: string[];
  hobbies?: string[];
}

export interface SearcherVerification {
  phoneNumber: string;
  phoneVerified: boolean;
  idDocumentUrl?: string;
  idVerified: boolean;
}

export interface SearcherConsents {
  termsAndConditions: boolean;
  termsVersion?: string;
  termsAcceptedAt?: string;
  privacyPolicy: boolean;
  privacyVersion?: string;
  privacyAcceptedAt?: string;
  dataProcessingConsent: boolean;
  matchingAlgorithmConsent: boolean;
  marketingOptIn: boolean;
  profileVisibility: 'public' | 'private' | 'hidden';
  gdprDataRetention: boolean;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface CompleteSearcherProfile {
  basicInfo: SearcherBasicInfo;
  professionalInfo: SearcherProfessionalInfo;
  dailyHabits: SearcherDailyHabits;
  homeLifestyle: SearcherHomeLifestyle;
  personality: SearcherPersonality;
  housingPreferences: SearcherHousingPreferences;
  interests: SearcherInterests;
  verification: SearcherVerification;
  consents: SearcherConsents;
}

// ============================================================================
// OWNER ONBOARDING TYPES
// ============================================================================

export interface OwnerBasicInfo {
  landlordType: 'individual' | 'agency' | 'company';
  firstName: string;
  lastName: string;
  companyName?: string; // Required if landlordType = 'agency' or 'company'
  email: string;
  phoneNumber: string;
  nationality: string;
  profilePhotoUrl?: string;
}

export interface OwnerAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  primaryLocation: string; // Main city where they operate
}

export interface OwnerExperience {
  experienceYears: string; // '0-1 year', '1-3 years', '3+ years'
  portfolioSize: number; // Number of properties managed
  managementType: 'self-managed' | 'agency' | 'hybrid';
  primaryMotivation: 'income' | 'community' | 'investment' | 'other';
  availabilityForVisits: 'flexible' | 'weekdays-only' | 'weekends-only' | 'by-appointment';
}

export interface OwnerVerification {
  nationalIdNumber?: string;
  idDocumentUrl?: string;
  idVerified: boolean;
  proofOfOwnershipUrl?: string;
  proofOfOwnershipVerified: boolean;
  phoneVerified: boolean;
  kycStatus: 'pending' | 'verified' | 'rejected' | 'expired';
  insurancePolicyNumber?: string;
  insuranceCertificateUrl?: string;
}

export interface OwnerBanking {
  iban: string;
  bicSwift?: string;
  accountHolderName: string;
  billingAddress: string;
  paymentFrequency: 'monthly' | 'quarterly' | 'annual';
  currency: 'EUR' | 'USD' | 'GBP' | 'other';
}

export interface OwnerTenantPolicies {
  acceptsShortTermLeases: boolean;
  minimumLeaseDurationMonths: number;
  requiredDocuments: string[]; // ['ID', 'proof-of-income', 'employment-letter', etc.]
  guarantorRequired: boolean;
  minimumIncomeRatio: number; // e.g., 3 (means 3x rent)
  creditScoreCheckRequired: boolean;
  depositAmountPolicy: string; // e.g., '1 month', '2 months'
  petsAllowed: boolean;
  maintenanceResponsibility: 'landlord' | 'tenant' | 'shared';
}

export interface OwnerPreferences {
  tenantSelectionStyle: 'first-come' | 'best-match' | 'highest-offer';
  preferredTenantProfile: string[]; // ['students', 'professionals', 'families', 'retirees']
  communicationPreference: 'email' | 'phone' | 'sms' | 'whatsapp';
  responseTimeCommitment: '24h' | '48h' | '72h' | 'week';
  languagesSpoken: string[];
  reviewVisibilityConsent: boolean;
}

export interface OwnerLegalCompliance {
  businessRegistrationNumber?: string; // For agencies/companies
  vatNumber?: string; // For professional landlords
  taxResidencyCountry: string;
  amlCheckConsent: boolean; // Anti-Money Laundering
  gdprCompliance: boolean;
}

export interface OwnerAbout {
  bio?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  operatingHours?: string; // For agencies
  emergencyContact?: string;
}

export interface OwnerConsents {
  termsAndConditions: boolean;
  termsVersion?: string;
  termsAcceptedAt?: string;
  privacyPolicy: boolean;
  privacyVersion?: string;
  privacyAcceptedAt?: string;
  marketingOptIn: boolean;
}

export interface CompleteOwnerProfile {
  basicInfo: OwnerBasicInfo;
  address: OwnerAddress;
  experience: OwnerExperience;
  verification: OwnerVerification;
  banking: OwnerBanking;
  tenantPolicies: OwnerTenantPolicies;
  preferences: OwnerPreferences;
  legalCompliance: OwnerLegalCompliance;
  about: OwnerAbout;
  consents: OwnerConsents;
}

// ============================================================================
// RESIDENT ONBOARDING TYPES (similar to Searcher but with current situation)
// ============================================================================

export interface ResidentCurrentSituation {
  currentAddress: string;
  currentLandlordName?: string;
  currentLeaseEndDate?: string;
  reasonForChange: string;
  noticePeriodRequired?: number; // in days
  currentRoommatesCount?: number;
}

export interface CompleteResidentProfile {
  basicInfo: SearcherBasicInfo;
  currentSituation: ResidentCurrentSituation;
  professionalInfo: SearcherProfessionalInfo;
  dailyHabits: SearcherDailyHabits;
  homeLifestyle: SearcherHomeLifestyle;
  personality: SearcherPersonality;
  interests: SearcherInterests;
  verification: SearcherVerification;
  consents: SearcherConsents;
}

// ============================================================================
// DATABASE TYPES (matching Supabase schema)
// ============================================================================

export interface UserProfile {
  id: string;
  user_id: string;
  user_type: UserType;

  // Typed columns
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender_identity?: string;
  nationality?: string;
  current_city?: string;
  languages_spoken?: string[];
  profile_photo_url?: string;

  // Professional (Searcher/Resident)
  occupation_status?: string;
  field_of_study_or_work?: string;
  institution_or_company?: string;
  monthly_income_bracket?: string;
  employment_type?: string;
  guarantor_available?: boolean;

  // Owner-specific
  company_name?: string;
  landlord_type?: string;
  portfolio_size?: number;
  management_type?: string;

  // Address
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;

  // Banking (Owner)
  iban?: string;
  bic_swift?: string;
  account_holder_name?: string;
  billing_address?: string;

  // Metadata
  profile_completion_score: number;
  bio?: string;

  // Flexible JSONB for remaining data
  profile_data: Record<string, any>;

  created_at: string;
  updated_at: string;
}

export interface UserVerification {
  id: string;
  user_id: string;
  id_verified: boolean;
  phone_verified: boolean;
  email_verified: boolean;
  kyc_status: 'pending' | 'verified' | 'rejected' | 'expired';
  id_document_url?: string;
  proof_of_ownership_url?: string;
  insurance_certificate_url?: string;
  verified_at?: string;
  verified_by?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface UserConsent {
  id: string;
  user_id: string;
  terms_accepted: boolean;
  terms_accepted_at?: string;
  terms_version?: string;
  privacy_accepted: boolean;
  privacy_accepted_at?: string;
  privacy_version?: string;
  data_processing: boolean;
  data_processing_at?: string;
  matching_algorithm: boolean;
  matching_algorithm_at?: string;
  marketing_opt_in: boolean;
  marketing_opt_in_at?: string;
  gdpr_data_retention: boolean;
  gdpr_data_retention_at?: string;
  profile_visibility: 'public' | 'private' | 'hidden';
  created_at: string;
  updated_at: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type OnboardingStep =
  | 'basic-info'
  | 'professional-info'
  | 'daily-habits'
  | 'home-lifestyle'
  | 'personality'
  | 'social-vibe'
  | 'housing-preferences'
  | 'interests'
  | 'verification'
  | 'privacy-consent'
  | 'review'
  | 'success';

export type OwnerOnboardingStep =
  | 'basic-info'
  | 'address'
  | 'about'
  | 'experience'
  | 'verification'
  | 'banking'
  | 'tenant-policies'
  | 'preferences'
  | 'legal-compliance'
  | 'privacy-consent'
  | 'review'
  | 'success';

export interface OnboardingProgress {
  currentStep: OnboardingStep | OwnerOnboardingStep;
  completedSteps: (OnboardingStep | OwnerOnboardingStep)[];
  totalSteps: number;
  percentComplete: number;
}
