/**
 * User Types and Interfaces for Izzico Platform
 */

/**
 * User type enum
 */
export type UserType = 'searcher' | 'owner' | 'resident'

/**
 * Base user interface
 */
export interface User {
  id: string
  email: string
  user_type: UserType
  full_name: string | null
  avatar_url: string | null
  onboarding_completed: boolean
  email_verified: boolean
  created_at: string
  updated_at: string
}

/**
 * Searcher profile (from onboarding)
 */
export interface SearcherProfile {
  id: string
  user_id: string

  // Basic info
  first_name: string
  last_name: string
  age: number
  email: string
  phone_number: string | null

  // Location preferences
  preferred_city: string
  preferred_neighborhood: string | null
  max_commute_time: number | null

  // Budget
  budget_min: number
  budget_max: number
  move_in_date: string | null
  lease_duration: string | null

  // Lifestyle preferences
  cleanliness_level: number
  noise_tolerance: number
  guests_frequency: string
  smoking: boolean
  pets: boolean

  // Social preferences
  social_frequency: string
  common_meals: string

  // Other preferences
  work_from_home: boolean
  overnight_guests: boolean
  dietary_restrictions: string | null

  created_at: string
}

/**
 * Owner profile (from onboarding)
 */
export interface OwnerProfile {
  id: string
  user_id: string

  // Basic info
  first_name: string
  last_name: string
  email: string
  phone_number: string | null

  // Experience
  years_of_experience: number | null
  number_of_properties: number

  // Location
  city: string

  // Description
  description: string | null

  created_at: string
}

/**
 * Property interface
 */
export interface Property {
  id: string
  owner_id: string

  // Basic info
  title: string
  description: string
  property_type: 'apartment' | 'house' | 'studio' | 'room'

  // Location
  address: string
  city: string
  postal_code: string
  neighborhood: string | null

  // Details
  total_bedrooms: number
  available_bedrooms: number
  bathrooms: number
  square_meters: number | null

  // Pricing
  monthly_rent: number
  deposit: number | null
  utilities_included: boolean

  // Features
  furnished: boolean
  parking: boolean
  wifi: boolean
  pets_allowed: boolean
  smoking_allowed: boolean

  // Availability
  available_from: string
  minimum_stay_months: number | null

  // Media
  photos: string[]

  // Status
  status: 'active' | 'inactive' | 'pending' | 'rented'

  created_at: string
  updated_at: string
}

/**
 * User session for analytics
 */
export interface UserSession {
  id: string
  user_id: string
  login_at: string
  logout_at: string | null
  ip_address: string | null
  user_agent: string | null
  session_duration_seconds: number | null
  created_at: string
}

/**
 * User authentication state
 */
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

/**
 * User preferences (can be extended)
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'fr'
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  privacy: {
    show_online_status: boolean
    show_last_seen: boolean
    show_profile_photo: boolean
  }
}

/**
 * User profile update payload
 */
export interface UpdateUserProfile {
  full_name?: string
  avatar_url?: string
  phone_number?: string
}

/**
 * User filter options (for admin/search)
 */
export interface UserFilters {
  user_type?: UserType
  email_verified?: boolean
  onboarding_completed?: boolean
  created_after?: string
  created_before?: string
  search?: string
}
