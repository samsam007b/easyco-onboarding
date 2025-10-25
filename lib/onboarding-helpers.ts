import { createClient } from './auth/supabase-client'

export interface OnboardingData {
  // Searcher data
  location?: string
  budget?: string
  moveInDate?: string
  lifestyle?: string
  preferences?: any
  about?: string

  // Owner data
  firstName?: string
  lastName?: string
  phone?: string
  propertyType?: string

  // Common
  [key: string]: any
}

/**
 * Save onboarding data to user_profiles table
 */
export async function saveOnboardingData(userId: string, data: OnboardingData, userType: string) {
  const supabase = createClient()

  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (existingProfile) {
      // Update existing profile
      const { error } = await supabase
        .from('user_profiles')
        .update({
          profile_data: data,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (error) throw error
    } else {
      // Create new profile
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          user_type: userType,
          profile_data: data
        })

      if (error) throw error
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
 */
export async function getOnboardingData(userId: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('profile_data')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found
        return { data: null }
      }
      throw error
    }

    return { data: data?.profile_data || {} }
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
