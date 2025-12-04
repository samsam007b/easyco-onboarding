/**
 * Roommate Profile Mapper
 * Converts user_profiles data to RoommateProfile format for matching
 */

import type { RoommateProfile } from './roommate-matching-service';

interface UserProfileData {
  user_id: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: string;
  occupation_status?: string;

  // Lifestyle
  cleanliness_preference?: number;
  cleanliness_expectation?: number;
  guest_frequency?: string;

  // Schedule
  wake_up_time?: string;
  sleep_time?: string;
  work_schedule?: string;

  // Social
  sociability_level?: number;
  social_energy?: number;
  shared_meals_interest?: boolean;
  communication_style?: string;

  // Values
  core_values?: string[];

  // Habits
  smoker?: boolean;
  smoking?: boolean;
  is_smoker?: boolean;
  has_pets?: boolean;
  pets?: boolean;
  cooking_frequency?: string;
  drinks_alcohol?: boolean;

  // Personality
  hobbies?: string[];
  interests?: string[];
  languages_spoken?: string[];

  [key: string]: any; // For other fields
}

/**
 * Calculate age from date of birth
 */
function calculateAge(dateOfBirth: string | undefined): number | undefined {
  if (!dateOfBirth) return undefined;

  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * Map user_profiles data to RoommateProfile
 */
export function mapUserProfileToRoommateProfile(
  userProfile: UserProfileData
): RoommateProfile {
  return {
    // Identity
    user_id: userProfile.user_id,
    first_name: userProfile.first_name,
    age: calculateAge(userProfile.date_of_birth),
    gender: userProfile.gender,
    occupation: userProfile.occupation_status,

    // Lifestyle
    cleanliness_level: userProfile.cleanliness_preference || userProfile.cleanliness_expectation,
    noise_tolerance: undefined, // Not available yet - will use default in matching
    guest_frequency: userProfile.guest_frequency,

    // Schedule
    wake_up_time: userProfile.wake_up_time,
    sleep_time: userProfile.sleep_time,
    work_schedule: userProfile.work_schedule,

    // Social
    social_energy: userProfile.sociability_level || userProfile.social_energy,
    shared_meals_interest: userProfile.shared_meals_interest,
    shared_activities_interest: undefined, // Not available yet
    communication_style: userProfile.communication_style,

    // Values
    core_values: userProfile.core_values || [],
    priorities: undefined, // Not available yet

    // Habits
    smoking: userProfile.smoker || userProfile.smoking || userProfile.is_smoker || false,
    pets: userProfile.has_pets || userProfile.pets || false,
    cooking_frequency: userProfile.cooking_frequency,
    drinks_alcohol: userProfile.drinks_alcohol,

    // Personality
    hobbies: userProfile.hobbies || [],
    interests: userProfile.interests || [],
    languages_spoken: userProfile.languages_spoken || [],
  };
}

/**
 * Map multiple user profiles to RoommateProfile array
 */
export function mapUserProfilesToRoommateProfiles(
  userProfiles: UserProfileData[]
): RoommateProfile[] {
  return userProfiles.map(mapUserProfileToRoommateProfile);
}

/**
 * Get user profile for roommate matching
 * Fetches from user_profiles table and converts to RoommateProfile
 */
export async function fetchRoommateProfile(
  supabase: any,
  userId: string
): Promise<RoommateProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    console.error('Failed to fetch roommate profile:', error);
    return null;
  }

  return mapUserProfileToRoommateProfile(data);
}

/**
 * Get property owner as a resident (Phase 1 implementation)
 */
export async function fetchPropertyOwnerAsResident(
  supabase: any,
  ownerId: string
): Promise<RoommateProfile | null> {
  if (!ownerId) return null;

  return fetchRoommateProfile(supabase, ownerId);
}

/**
 * Get all residents for a property
 * Phase 1: Returns only the owner
 * Phase 2: Will query property_residents table
 */
export async function fetchPropertyResidents(
  supabase: any,
  propertyId: string,
  ownerId?: string
): Promise<RoommateProfile[]> {
  // Phase 1: Use owner as the only resident
  if (ownerId) {
    const owner = await fetchPropertyOwnerAsResident(supabase, ownerId);
    return owner ? [owner] : [];
  }

  // Phase 2: TODO - Query property_residents table
  // const { data: residents } = await supabase
  //   .from('property_residents')
  //   .select('user_id, user_profiles(*)')
  //   .eq('property_id', propertyId);
  //
  // return mapUserProfilesToRoommateProfiles(residents.map(r => r.user_profiles));

  return [];
}
