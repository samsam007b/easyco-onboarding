import { createClient } from './auth/supabase-client'

export interface OnboardingData {
  // Basic Information
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  genderIdentity?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | 'other'
  nationality?: string
  currentCity?: string
  languagesSpoken?: string[]

  // Professional Information (Searcher/Resident)
  occupationStatus?: 'student' | 'employed' | 'self-employed' | 'unemployed' | 'retired' | 'other'
  fieldOfStudy?: string
  university?: string
  employer?: string
  jobTitle?: string
  monthlyIncomeBracket?: string

  // Housing Information (Searcher/Resident)
  budgetMin?: number
  budgetMax?: number
  moveInDate?: string
  moveInFlexibility?: string
  desiredStayDuration?: string
  preferredCities?: string[]
  acceptedRoomTypes?: string[]

  // Lifestyle & Habits (Searcher/Resident)
  cleanlinessPreference?: number
  noiseTolerance?: number
  guestFrequency?: number
  isSmoker?: boolean
  hasPets?: boolean
  petType?: string
  introvertExtrovertScale?: number
  earlyBirdNightOwl?: string
  workFromHome?: boolean
  alcoholConsumption?: string
  dietaryPreferences?: string[]
  exerciseFrequency?: string
  hobbies?: string[]

  // Ideal Coliving (Searcher/Resident)
  colivingSize?: string
  genderMix?: string
  minAge?: number
  maxAge?: number
  sharedSpaceImportance?: number

  // Values & Personality (Searcher/Resident)
  coreValues?: string[]
  importantQualities?: string[]
  dealBreakers?: string[]
  communicationStyle?: string
  conflictResolution?: string

  // Social Preferences (Searcher/Resident)
  socialLevel?: number
  sharedMealsFrequency?: string
  sharedActivitiesInterest?: string[]

  // Practical Considerations (Searcher/Resident)
  hasCar?: boolean
  needsParking?: boolean
  accessibilityNeeds?: string
  workSchedule?: string
  nightShifts?: boolean

  // Additional Info (Searcher/Resident)
  bio?: string
  lookingFor?: string
  aboutMe?: string

  // Owner-specific Information
  landlordType?: 'individual' | 'agency' | 'company'
  companyName?: string
  email?: string
  phoneNumber?: string
  ownerType?: 'individual' | 'agency' | 'company'
  primaryLocation?: string
  hostingExperience?: string
  hasProperty?: string
  propertyCity?: string
  propertyType?: string
  iban?: string
  swiftBic?: string

  // Verification data
  phoneVerification?: string
  idDocument?: string
  proofOfOwnership?: string
  phoneVerified?: boolean
  emailVerified?: boolean
  idVerified?: boolean

  // Consent data
  termsAccepted?: boolean
  privacyAccepted?: boolean
  marketingEmail?: boolean
  marketingPush?: boolean

  // Legacy/Other
  completedAt?: string
  [key: string]: any
}

/**
 * Save onboarding data to user_profiles table using TYPED COLUMNS
 * This replaces the old JSONB blob approach with properly typed, queryable columns
 */
export async function saveOnboardingData(userId: string, data: OnboardingData, userType: string) {
  const supabase = createClient()

  try {
    // Prepare the profile data object with typed columns
    const profileData: any = {
      user_id: userId,
      user_type: userType,
      updated_at: new Date().toISOString()
    }

    // Basic Information
    if (data.firstName) profileData.first_name = data.firstName
    if (data.lastName) profileData.last_name = data.lastName
    if (data.dateOfBirth) profileData.date_of_birth = data.dateOfBirth
    if (data.genderIdentity) profileData.gender_identity = data.genderIdentity
    if (data.nationality) profileData.nationality = data.nationality
    if (data.currentCity) profileData.current_city = data.currentCity
    if (data.languagesSpoken) profileData.languages_spoken = data.languagesSpoken

    // Professional Information (Searcher/Resident)
    if (data.occupationStatus) profileData.occupation_status = data.occupationStatus
    if (data.fieldOfStudy) profileData.field_of_study = data.fieldOfStudy
    if (data.university) profileData.university = data.university
    if (data.employer) profileData.employer = data.employer
    if (data.jobTitle) profileData.job_title = data.jobTitle
    if (data.monthlyIncomeBracket) profileData.monthly_income_bracket = data.monthlyIncomeBracket

    // Housing Information (Searcher/Resident)
    if (data.budgetMin !== undefined) profileData.budget_min = data.budgetMin
    if (data.budgetMax !== undefined) profileData.budget_max = data.budgetMax
    if (data.moveInDate) profileData.move_in_date = data.moveInDate
    if (data.moveInFlexibility) profileData.move_in_flexibility = data.moveInFlexibility
    if (data.desiredStayDuration) profileData.desired_stay_duration = data.desiredStayDuration
    if (data.preferredCities) profileData.preferred_cities = data.preferredCities
    if (data.acceptedRoomTypes) profileData.accepted_room_types = data.acceptedRoomTypes

    // Lifestyle & Habits (Searcher/Resident)
    if (data.cleanlinessPreference !== undefined) profileData.cleanliness_preference = data.cleanlinessPreference
    if (data.noiseTolerance !== undefined) profileData.noise_tolerance = data.noiseTolerance
    if (data.guestFrequency !== undefined) profileData.guest_frequency = data.guestFrequency
    if (data.isSmoker !== undefined) profileData.is_smoker = data.isSmoker
    if (data.hasPets !== undefined) profileData.has_pets = data.hasPets
    if (data.petType) profileData.pet_type = data.petType
    if (data.introvertExtrovertScale !== undefined) profileData.introvert_extrovert_scale = data.introvertExtrovertScale
    if (data.earlyBirdNightOwl) profileData.early_bird_night_owl = data.earlyBirdNightOwl
    if (data.workFromHome !== undefined) profileData.work_from_home = data.workFromHome
    if (data.alcoholConsumption) profileData.alcohol_consumption = data.alcoholConsumption
    if (data.dietaryPreferences) profileData.dietary_preferences = data.dietaryPreferences
    if (data.exerciseFrequency) profileData.exercise_frequency = data.exerciseFrequency
    if (data.hobbies) profileData.hobbies = data.hobbies

    // Ideal Coliving (Searcher/Resident)
    if (data.colivingSize) profileData.coliving_size = data.colivingSize
    if (data.genderMix) profileData.gender_mix = data.genderMix
    if (data.minAge !== undefined) profileData.min_age = data.minAge
    if (data.maxAge !== undefined) profileData.max_age = data.maxAge
    if (data.sharedSpaceImportance !== undefined) profileData.shared_space_importance = data.sharedSpaceImportance

    // Values & Personality (Searcher/Resident)
    if (data.coreValues) profileData.core_values = data.coreValues
    if (data.importantQualities) profileData.important_qualities = data.importantQualities
    if (data.dealBreakers) profileData.deal_breakers = data.dealBreakers
    if (data.communicationStyle) profileData.communication_style = data.communicationStyle
    if (data.conflictResolution) profileData.conflict_resolution = data.conflictResolution

    // Social Preferences (Searcher/Resident)
    if (data.socialLevel !== undefined) profileData.social_level = data.socialLevel
    if (data.sharedMealsFrequency) profileData.shared_meals_frequency = data.sharedMealsFrequency
    if (data.sharedActivitiesInterest) profileData.shared_activities_interest = data.sharedActivitiesInterest

    // Practical Considerations (Searcher/Resident)
    if (data.hasCar !== undefined) profileData.has_car = data.hasCar
    if (data.needsParking !== undefined) profileData.needs_parking = data.needsParking
    if (data.accessibilityNeeds) profileData.accessibility_needs = data.accessibilityNeeds
    if (data.workSchedule) profileData.work_schedule = data.workSchedule
    if (data.nightShifts !== undefined) profileData.night_shifts = data.nightShifts

    // Additional Info (Searcher/Resident)
    if (data.bio) profileData.bio = data.bio
    if (data.lookingFor) profileData.looking_for = data.lookingFor
    if (data.aboutMe) profileData.about_me = data.aboutMe

    // Owner-specific Information
    if (data.landlordType) profileData.landlord_type = data.landlordType
    if (data.companyName) profileData.company_name = data.companyName
    if (data.email) profileData.email = data.email
    if (data.phoneNumber) profileData.phone_number = data.phoneNumber
    if (data.ownerType) profileData.owner_type = data.ownerType
    if (data.primaryLocation) profileData.primary_location = data.primaryLocation
    if (data.hostingExperience) profileData.hosting_experience = data.hostingExperience
    if (data.hasProperty) profileData.has_property = data.hasProperty
    if (data.propertyCity) profileData.property_city = data.propertyCity
    if (data.propertyType) profileData.property_type = data.propertyType
    if (data.iban) profileData.iban = data.iban
    if (data.swiftBic) profileData.swift_bic = data.swiftBic

    // Upsert to user_profiles (insert or update)
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert(profileData, {
        onConflict: 'user_id'
      })

    if (profileError) throw profileError

    // Save verification data if present
    if (data.phoneVerification || data.idDocument || data.proofOfOwnership ||
        data.phoneVerified !== undefined || data.emailVerified !== undefined || data.idVerified !== undefined) {

      const verificationData: any = {
        user_id: userId,
        updated_at: new Date().toISOString()
      }

      if (data.phoneVerification) verificationData.phone_number = data.phoneVerification
      if (data.phoneVerified !== undefined) verificationData.phone_verified = data.phoneVerified
      if (data.emailVerified !== undefined) verificationData.email_verified = data.emailVerified
      if (data.idVerified !== undefined) verificationData.kyc_status = data.idVerified ? 'verified' : 'pending'
      if (data.idDocument) verificationData.id_document_url = data.idDocument
      if (data.proofOfOwnership) verificationData.proof_of_ownership_url = data.proofOfOwnership

      const { error: verificationError } = await supabase
        .from('user_verifications')
        .upsert(verificationData, {
          onConflict: 'user_id'
        })

      if (verificationError) {
        console.warn('Warning: Could not save verification data (table may not exist yet):', verificationError)
        // Don't throw - verification table might not be created yet
      }
    }

    // Save consent data if present
    if (data.termsAccepted !== undefined || data.privacyAccepted !== undefined ||
        data.marketingEmail !== undefined || data.marketingPush !== undefined) {

      const consentData: any = {
        user_id: userId,
        updated_at: new Date().toISOString()
      }

      if (data.termsAccepted !== undefined) consentData.terms_accepted = data.termsAccepted
      if (data.privacyAccepted !== undefined) consentData.privacy_accepted = data.privacyAccepted
      if (data.marketingEmail !== undefined) consentData.marketing_email = data.marketingEmail
      if (data.marketingPush !== undefined) consentData.marketing_push = data.marketingPush

      const { error: consentError } = await supabase
        .from('user_consents')
        .upsert(consentData, {
          onConflict: 'user_id'
        })

      if (consentError) {
        console.warn('Warning: Could not save consent data (table may not exist yet):', consentError)
        // Don't throw - consent table might not be created yet
      }
    }

    // Mark onboarding as completed in users table
    const { error: userError } = await supabase
      .from('users')
      .update({
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (userError) throw userError

    return { success: true }
  } catch (error) {
    console.error('Error saving onboarding data:', error)
    return { success: false, error }
  }
}

/**
 * Get onboarding data from user_profiles table
 * Returns data from TYPED COLUMNS (not JSONB blob)
 */
export async function getOnboardingData(userId: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found
        return { data: null }
      }
      throw error
    }

    // Convert snake_case columns back to camelCase for frontend
    const camelCaseData: OnboardingData = {}

    if (data.first_name) camelCaseData.firstName = data.first_name
    if (data.last_name) camelCaseData.lastName = data.last_name
    if (data.date_of_birth) camelCaseData.dateOfBirth = data.date_of_birth
    if (data.gender_identity) camelCaseData.genderIdentity = data.gender_identity
    if (data.nationality) camelCaseData.nationality = data.nationality
    if (data.current_city) camelCaseData.currentCity = data.current_city
    if (data.languages_spoken) camelCaseData.languagesSpoken = data.languages_spoken

    if (data.occupation_status) camelCaseData.occupationStatus = data.occupation_status
    if (data.field_of_study) camelCaseData.fieldOfStudy = data.field_of_study
    if (data.university) camelCaseData.university = data.university
    if (data.employer) camelCaseData.employer = data.employer
    if (data.job_title) camelCaseData.jobTitle = data.job_title
    if (data.monthly_income_bracket) camelCaseData.monthlyIncomeBracket = data.monthly_income_bracket

    if (data.budget_min !== undefined) camelCaseData.budgetMin = data.budget_min
    if (data.budget_max !== undefined) camelCaseData.budgetMax = data.budget_max
    if (data.move_in_date) camelCaseData.moveInDate = data.move_in_date
    if (data.move_in_flexibility) camelCaseData.moveInFlexibility = data.move_in_flexibility
    if (data.desired_stay_duration) camelCaseData.desiredStayDuration = data.desired_stay_duration
    if (data.preferred_cities) camelCaseData.preferredCities = data.preferred_cities
    if (data.accepted_room_types) camelCaseData.acceptedRoomTypes = data.accepted_room_types

    if (data.cleanliness_preference !== undefined) camelCaseData.cleanlinessPreference = data.cleanliness_preference
    if (data.noise_tolerance !== undefined) camelCaseData.noiseTolerance = data.noise_tolerance
    if (data.guest_frequency !== undefined) camelCaseData.guestFrequency = data.guest_frequency
    if (data.is_smoker !== undefined) camelCaseData.isSmoker = data.is_smoker
    if (data.has_pets !== undefined) camelCaseData.hasPets = data.has_pets
    if (data.pet_type) camelCaseData.petType = data.pet_type
    if (data.introvert_extrovert_scale !== undefined) camelCaseData.introvertExtrovertScale = data.introvert_extrovert_scale
    if (data.early_bird_night_owl) camelCaseData.earlyBirdNightOwl = data.early_bird_night_owl
    if (data.work_from_home !== undefined) camelCaseData.workFromHome = data.work_from_home
    if (data.alcohol_consumption) camelCaseData.alcoholConsumption = data.alcohol_consumption
    if (data.dietary_preferences) camelCaseData.dietaryPreferences = data.dietary_preferences
    if (data.exercise_frequency) camelCaseData.exerciseFrequency = data.exercise_frequency
    if (data.hobbies) camelCaseData.hobbies = data.hobbies

    if (data.coliving_size) camelCaseData.colivingSize = data.coliving_size
    if (data.gender_mix) camelCaseData.genderMix = data.gender_mix
    if (data.min_age !== undefined) camelCaseData.minAge = data.min_age
    if (data.max_age !== undefined) camelCaseData.maxAge = data.max_age
    if (data.shared_space_importance !== undefined) camelCaseData.sharedSpaceImportance = data.shared_space_importance

    if (data.core_values) camelCaseData.coreValues = data.core_values
    if (data.important_qualities) camelCaseData.importantQualities = data.important_qualities
    if (data.deal_breakers) camelCaseData.dealBreakers = data.deal_breakers
    if (data.communication_style) camelCaseData.communicationStyle = data.communication_style
    if (data.conflict_resolution) camelCaseData.conflictResolution = data.conflict_resolution

    if (data.social_level !== undefined) camelCaseData.socialLevel = data.social_level
    if (data.shared_meals_frequency) camelCaseData.sharedMealsFrequency = data.shared_meals_frequency
    if (data.shared_activities_interest) camelCaseData.sharedActivitiesInterest = data.shared_activities_interest

    if (data.has_car !== undefined) camelCaseData.hasCar = data.has_car
    if (data.needs_parking !== undefined) camelCaseData.needsParking = data.needs_parking
    if (data.accessibility_needs) camelCaseData.accessibilityNeeds = data.accessibility_needs
    if (data.work_schedule) camelCaseData.workSchedule = data.work_schedule
    if (data.night_shifts !== undefined) camelCaseData.nightShifts = data.night_shifts

    if (data.bio) camelCaseData.bio = data.bio
    if (data.looking_for) camelCaseData.lookingFor = data.looking_for
    if (data.about_me) camelCaseData.aboutMe = data.about_me

    if (data.landlord_type) camelCaseData.landlordType = data.landlord_type
    if (data.company_name) camelCaseData.companyName = data.company_name
    if (data.email) camelCaseData.email = data.email
    if (data.phone_number) camelCaseData.phoneNumber = data.phone_number
    if (data.owner_type) camelCaseData.ownerType = data.owner_type
    if (data.primary_location) camelCaseData.primaryLocation = data.primary_location
    if (data.hosting_experience) camelCaseData.hostingExperience = data.hosting_experience
    if (data.has_property) camelCaseData.hasProperty = data.has_property
    if (data.property_city) camelCaseData.propertyCity = data.property_city
    if (data.property_type) camelCaseData.propertyType = data.property_type
    if (data.iban) camelCaseData.iban = data.iban
    if (data.swift_bic) camelCaseData.swiftBic = data.swift_bic

    return { data: camelCaseData }
  } catch (error) {
    console.error('Error getting onboarding data:', error)
    return { data: null, error }
  }
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(userId: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('users')
      .select('onboarding_completed')
      .eq('id', userId)
      .single()

    if (error) throw error

    return data?.onboarding_completed || false
  } catch (error) {
    console.error('Error checking onboarding status:', error)
    return false
  }
}

/**
 * Get profile completion percentage
 * This can be enhanced to use the calculate_profile_completion() function from the database
 */
export async function getProfileCompletionPercentage(userId: string) {
  const supabase = createClient()

  try {
    // Try to use database function if it exists
    const { data, error } = await supabase
      .rpc('calculate_profile_completion', { profile_user_id: userId })

    if (!error && data !== null) {
      return data
    }

    // Fallback: calculate manually
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!profile) return 0

    // Count filled fields (simplified version)
    const totalFields = 50 // Approximate total important fields
    let filledFields = 0

    const fieldsToCheck = [
      'first_name', 'last_name', 'date_of_birth', 'gender_identity', 'nationality',
      'current_city', 'languages_spoken', 'occupation_status', 'budget_min', 'budget_max',
      'move_in_date', 'preferred_cities', 'cleanliness_preference', 'is_smoker', 'has_pets',
      'bio', 'hobbies', 'core_values', 'coliving_size', 'gender_mix'
      // Add more as needed
    ]

    fieldsToCheck.forEach(field => {
      if (profile[field] !== null && profile[field] !== undefined && profile[field] !== '') {
        filledFields++
      }
    })

    return Math.round((filledFields / totalFields) * 100)
  } catch (error) {
    console.error('Error calculating profile completion:', error)
    return 0
  }
}
