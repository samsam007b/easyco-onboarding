/**
 * User-to-User Matching Service
 * Calculates compatibility scores between users for coliving matching
 * Used for: Searchers finding co-searchers, Residents finding new roommates
 *
 * Scoring System (0-100):
 * - Lifestyle Compatibility: 30 points
 * - Social Compatibility: 25 points
 * - Practical Compatibility: 20 points
 * - Values Alignment: 15 points
 * - Preferences Match: 10 points
 */

export interface UserProfile {
  user_id: string;
  first_name: string;
  last_name: string;
  profile_photo_url?: string;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  languages?: string[];
  occupation_status?: string;
  bio?: string;

  // Enriched profile data
  languages_spoken?: string[];
  interests?: string[];
  hobbies?: string[];
  important_qualities?: string[];
  deal_breakers?: string[];

  // Lifestyle preferences (from onboarding)
  cleanliness_level?: number; // 1-10
  social_energy?: number; // 1-10 (introvert to extrovert)
  openness_to_sharing?: string; // 'private' | 'moderate' | 'open' | 'very_open'
  cultural_openness?: string; // 'conservative' | 'moderate' | 'open' | 'very_open'
  house_rules_preference?: number; // 1-10 (flexible to structured)
  shared_space_importance?: number; // 1-10

  // Daily routine
  wake_up_time?: 'early' | 'moderate' | 'late';
  sleep_time?: 'early' | 'moderate' | 'late';
  works_from_home?: boolean;
  work_schedule?: 'office' | 'hybrid' | 'remote' | 'flexible' | 'student';
  exercise_frequency?: 'never' | 'rarely' | 'sometimes' | 'often' | 'daily';
  sports_frequency?: 'never' | 'rarely' | 'sometimes' | 'often' | 'daily';

  // Social preferences
  guest_frequency?: 'never' | 'rarely' | 'sometimes' | 'often';
  shared_meals_interest?: boolean;
  flatmate_meetups_interest?: boolean;
  open_to_meetups?: boolean;
  event_participation_interest?: 'low' | 'medium' | 'high';
  event_interest?: 'low' | 'medium' | 'high';
  introvert_extrovert_scale?: number; // 1-5

  // Lifestyle habits
  smoking?: boolean;
  drinks_alcohol?: boolean;
  pets?: boolean;
  pet_type?: string;
  cooking_frequency?: 'never' | 'rarely' | 'sometimes' | 'often' | 'daily';
  music_at_home?: boolean;
  music_habits?: 'none' | 'headphones_only' | 'headphones_mostly' | 'quiet_background' | 'social_listening';
  diet_type?: 'omnivore' | 'vegetarian' | 'vegan' | 'flexitarian' | 'pescatarian';

  // Values
  core_values?: string[]; // ['respect', 'cleanliness', 'communication', 'sharing', 'privacy', 'fun', 'sustainability']

  // Preferences for matching
  preferred_coliving_size?: 'small' | 'medium' | 'large' | 'very_large'; // 2-3, 4-6, 7-10, 10+
  preferred_gender_mix?: 'no_preference' | 'same_gender' | 'mixed';
  gender_preference?: 'no_preference' | 'same_gender' | 'mixed';
  age_range_min?: number;
  age_range_max?: number;
  preferred_neighborhoods?: string[];
  min_budget?: number;
  max_budget?: number;
  quiet_hours_preference?: boolean;
  communication_style?: 'direct' | 'diplomatic' | 'casual' | 'formal';
  coworking_space_needed?: boolean;
  gym_access_needed?: boolean;

  // Tolerance preferences
  pets_tolerance?: boolean;
  smoking_tolerance?: boolean;
}

export interface ProfileCompleteness {
  percentage: number; // 0-100
  filledFields: number;
  totalFields: number;
  isComplete: boolean; // true if >= 40% filled
  missingCategories: string[];
}

export interface CompatibilityResult {
  score: number; // 0-100
  breakdown: {
    lifestyle: number;
    social: number;
    practical: number;
    values: number;
    preferences: number;
  };
  strengths: string[];
  considerations: string[];
  dealbreakers: string[];
  profileCompleteness: {
    user1: ProfileCompleteness;
    user2: ProfileCompleteness;
  };
  isScoreReliable: boolean; // true if both profiles are >= 40% complete
}

/**
 * Calculate profile completeness for matching algorithm
 * Returns percentage of filled fields and missing categories
 */
export function calculateProfileCompleteness(user: UserProfile): ProfileCompleteness {
  const categories = {
    lifestyle: {
      fields: ['cleanliness_level', 'wake_up_time', 'sleep_time', 'house_rules_preference', 'cooking_frequency'],
      label: 'Mode de vie'
    },
    social: {
      fields: ['social_energy', 'openness_to_sharing', 'cultural_openness', 'event_participation_interest', 'guest_frequency'],
      label: 'Préférences sociales'
    },
    practical: {
      fields: ['min_budget', 'max_budget', 'date_of_birth', 'preferred_coliving_size', 'gender_preference'],
      label: 'Critères pratiques'
    },
    values: {
      fields: ['core_values'],
      label: 'Valeurs'
    },
    preferences: {
      fields: ['smoking', 'pets', 'smoking_tolerance', 'pets_tolerance'],
      label: 'Tolérances'
    }
  };

  let filledFields = 0;
  let totalFields = 0;
  const missingCategories: string[] = [];

  for (const [, category] of Object.entries(categories)) {
    let categoryFilled = 0;
    for (const field of category.fields) {
      totalFields++;
      const value = user[field as keyof UserProfile];
      if (value !== undefined && value !== null && value !== '' &&
          !(Array.isArray(value) && value.length === 0)) {
        filledFields++;
        categoryFilled++;
      }
    }
    // If less than 50% of category fields are filled, mark as missing
    if (categoryFilled < category.fields.length * 0.5) {
      missingCategories.push(category.label);
    }
  }

  const percentage = Math.round((filledFields / totalFields) * 100);
  const isComplete = percentage >= 40;

  return {
    percentage,
    filledFields,
    totalFields,
    isComplete,
    missingCategories
  };
}

/**
 * Calculate compatibility score between two users
 */
export function calculateUserCompatibility(
  user1: UserProfile,
  user2: UserProfile
): CompatibilityResult {
  // Calculate profile completeness for both users
  const user1Completeness = calculateProfileCompleteness(user1);
  const user2Completeness = calculateProfileCompleteness(user2);
  const isScoreReliable = user1Completeness.isComplete && user2Completeness.isComplete;

  const breakdown = {
    lifestyle: calculateLifestyleScore(user1, user2),
    social: calculateSocialScore(user1, user2),
    practical: calculatePracticalScore(user1, user2),
    values: calculateValuesScore(user1, user2),
    preferences: calculatePreferencesScore(user1, user2),
  };

  const score = Math.round(
    breakdown.lifestyle +
    breakdown.social +
    breakdown.practical +
    breakdown.values +
    breakdown.preferences
  );

  const strengths = generateStrengths(breakdown, user1, user2);
  const considerations = generateConsiderations(breakdown, user1, user2);
  const dealbreakers = generateDealbreakers(user1, user2);

  return {
    score,
    breakdown,
    strengths,
    considerations,
    dealbreakers,
    profileCompleteness: {
      user1: user1Completeness,
      user2: user2Completeness,
    },
    isScoreReliable,
  };
}

/**
 * Lifestyle Score (0-30 points)
 * Cleanliness, daily routines, house rules, cooking/music habits
 */
function calculateLifestyleScore(user1: UserProfile, user2: UserProfile): number {
  let score = 0;

  // Cleanliness compatibility (0-8 points)
  if (user1.cleanliness_level && user2.cleanliness_level) {
    const diff = Math.abs(user1.cleanliness_level - user2.cleanliness_level);
    score += Math.max(0, 8 - diff * 0.8); // Max difference of 10, lose 0.8 points per level
  } else {
    score += 6; // Default if not specified
  }

  // Wake up time compatibility (0-5 points)
  if (user1.wake_up_time && user2.wake_up_time) {
    score += user1.wake_up_time === user2.wake_up_time ? 5 : 3;
  } else {
    score += 4;
  }

  // Sleep time compatibility (0-5 points)
  if (user1.sleep_time && user2.sleep_time) {
    score += user1.sleep_time === user2.sleep_time ? 5 : 3;
  } else {
    score += 4;
  }

  // House rules preference (0-7 points)
  if (user1.house_rules_preference && user2.house_rules_preference) {
    const diff = Math.abs(user1.house_rules_preference - user2.house_rules_preference);
    score += Math.max(0, 7 - diff * 0.7);
  } else {
    score += 5;
  }

  // Cooking frequency compatibility (0-5 points)
  if (user1.cooking_frequency && user2.cooking_frequency) {
    const cookingLevels = { never: 0, rarely: 1, sometimes: 2, often: 3, daily: 4 };
    const diff = Math.abs(
      cookingLevels[user1.cooking_frequency] - cookingLevels[user2.cooking_frequency]
    );
    score += Math.max(0, 5 - diff * 1.25);
  } else {
    score += 4;
  }

  return Math.min(30, score);
}

/**
 * Social Score (0-25 points)
 * Social energy, sharing, communication, cultural openness
 */
function calculateSocialScore(user1: UserProfile, user2: UserProfile): number {
  let score = 0;

  // Social energy compatibility (0-8 points)
  if (user1.social_energy && user2.social_energy) {
    const diff = Math.abs(user1.social_energy - user2.social_energy);
    score += Math.max(0, 8 - diff * 0.8);
  } else {
    score += 6;
  }

  // Openness to sharing (0-7 points)
  if (user1.openness_to_sharing && user2.openness_to_sharing) {
    const levels = { private: 1, moderate: 2, open: 3, very_open: 4 };
    const diff = Math.abs(
      levels[user1.openness_to_sharing as keyof typeof levels] - levels[user2.openness_to_sharing as keyof typeof levels]
    );
    score += Math.max(0, 7 - diff * 2);
  } else {
    score += 5;
  }

  // Cultural openness (0-5 points)
  if (user1.cultural_openness && user2.cultural_openness) {
    const levels = { conservative: 1, moderate: 2, open: 3, very_open: 4 };
    const avg = (levels[user1.cultural_openness as keyof typeof levels] + levels[user2.cultural_openness as keyof typeof levels]) / 2;
    score += (avg / 4) * 5; // Higher is better for both
  } else {
    score += 4;
  }

  // Event participation interest (0-5 points)
  if (user1.event_participation_interest && user2.event_participation_interest) {
    const levels = { low: 1, medium: 2, high: 3 };
    const diff = Math.abs(
      levels[user1.event_participation_interest] - levels[user2.event_participation_interest]
    );
    score += Math.max(0, 5 - diff * 1.5);
  } else {
    score += 4;
  }

  return Math.min(25, score);
}

/**
 * Practical Score (0-20 points)
 * Budget, location, coliving size, gender mix, age range
 */
function calculatePracticalScore(user1: UserProfile, user2: UserProfile): number {
  let score = 0;

  // Budget compatibility (0-7 points)
  if (user1.min_budget && user1.max_budget && user2.min_budget && user2.max_budget) {
    const overlap = Math.min(user1.max_budget, user2.max_budget) - Math.max(user1.min_budget, user2.min_budget);
    const range1 = user1.max_budget - user1.min_budget;
    const range2 = user2.max_budget - user2.min_budget;
    const avgRange = (range1 + range2) / 2;

    if (overlap > 0) {
      const overlapPercent = overlap / avgRange;
      score += Math.min(7, overlapPercent * 7);
    }
  } else {
    score += 5;
  }

  // Age compatibility (0-6 points)
  if (user1.date_of_birth && user2.date_of_birth) {
    const age1 = calculateAge(user1.date_of_birth);
    const age2 = calculateAge(user2.date_of_birth);
    const ageDiff = Math.abs(age1 - age2);

    // Check if ages are within each other's preferences
    let withinPreference = true;
    if (user1.age_range_min && user1.age_range_max) {
      withinPreference = withinPreference && age2 >= user1.age_range_min && age2 <= user1.age_range_max;
    }
    if (user2.age_range_min && user2.age_range_max) {
      withinPreference = withinPreference && age1 >= user2.age_range_min && age1 <= user2.age_range_max;
    }

    if (withinPreference) {
      score += 6;
    } else if (ageDiff <= 5) {
      score += 4;
    } else if (ageDiff <= 10) {
      score += 2;
    }
  } else {
    score += 5;
  }

  // Coliving size preference (0-4 points)
  if (user1.preferred_coliving_size && user2.preferred_coliving_size) {
    score += user1.preferred_coliving_size === user2.preferred_coliving_size ? 4 : 2;
  } else {
    score += 3;
  }

  // Gender preference (0-3 points)
  if (user1.gender_preference && user2.gender_preference && user1.gender && user2.gender) {
    let genderMatch = true;

    if (user1.gender_preference === 'same_gender' && user1.gender !== user2.gender) {
      genderMatch = false;
    }
    if (user2.gender_preference === 'same_gender' && user1.gender !== user2.gender) {
      genderMatch = false;
    }

    score += genderMatch ? 3 : 0;
  } else {
    score += 2;
  }

  return Math.min(20, score);
}

/**
 * Values Score (0-15 points)
 * Core values alignment
 */
function calculateValuesScore(user1: UserProfile, user2: UserProfile): number {
  if (!user1.core_values || !user2.core_values || user1.core_values.length === 0 || user2.core_values.length === 0) {
    return 12; // Default high score if no values specified
  }

  const commonValues = user1.core_values.filter(v => user2.core_values?.includes(v));
  const totalValues = new Set([...user1.core_values, ...(user2.core_values || [])]).size;

  if (totalValues === 0) return 12;

  const overlapRatio = commonValues.length / totalValues;
  return Math.round(overlapRatio * 15);
}

/**
 * Preferences Score (0-10 points)
 * Dealbreakers: smoking, pets, location
 */
function calculatePreferencesScore(user1: UserProfile, user2: UserProfile): number {
  let score = 10;

  // Smoking dealbreaker (major)
  if (user1.smoking && user2.smoking_tolerance === false) {
    score -= 5;
  }
  if (user2.smoking && user1.smoking_tolerance === false) {
    score -= 5;
  }

  // Pets dealbreaker (major)
  if (user1.pets && user2.pets_tolerance === false) {
    score -= 5;
  }
  if (user2.pets && user1.pets_tolerance === false) {
    score -= 5;
  }

  // Location overlap (0-3 points bonus if neighborhoods overlap)
  if (user1.preferred_neighborhoods && user2.preferred_neighborhoods) {
    const commonNeighborhoods = user1.preferred_neighborhoods.filter(n =>
      user2.preferred_neighborhoods?.some(n2 => n2.toLowerCase() === n.toLowerCase())
    );

    if (commonNeighborhoods.length > 0) {
      score = Math.min(10, score + 3);
    }
  }

  return Math.max(0, score);
}

/**
 * Generate strengths for the match
 */
function generateStrengths(
  breakdown: CompatibilityResult['breakdown'],
  user1: UserProfile,
  user2: UserProfile
): string[] {
  const strengths: string[] = [];

  if (breakdown.lifestyle >= 25) {
    strengths.push('🏠 Very similar daily routines and lifestyle habits');
  } else if (breakdown.lifestyle >= 20) {
    strengths.push('🏠 Compatible lifestyle preferences');
  }

  if (breakdown.social >= 20) {
    strengths.push('✨ Great social compatibility and communication style');
  } else if (breakdown.social >= 15) {
    strengths.push('✨ Good social vibe match');
  }

  if (breakdown.practical >= 16) {
    strengths.push('💰 Practical aspects align well (budget, location, preferences)');
  }

  if (breakdown.values >= 12) {
    strengths.push('💎 Shared core values and principles');
  }

  // Specific strengths
  if (user1.shared_meals_interest && user2.shared_meals_interest) {
    strengths.push('🍽️ Both enjoy sharing meals');
  }

  if (user1.cleanliness_level && user2.cleanliness_level && Math.abs(user1.cleanliness_level - user2.cleanliness_level) <= 2) {
    strengths.push('✨ Similar cleanliness standards');
  }

  return strengths;
}

/**
 * Generate considerations for the match
 */
function generateConsiderations(
  breakdown: CompatibilityResult['breakdown'],
  user1: UserProfile,
  user2: UserProfile
): string[] {
  const considerations: string[] = [];

  if (breakdown.lifestyle < 20) {
    considerations.push('⚠️ Different daily routines - may need to discuss schedules');
  }

  if (breakdown.social < 15) {
    considerations.push('⚠️ Different social preferences - communication will be key');
  }

  if (breakdown.practical < 12) {
    considerations.push('⚠️ Some practical aspects may need discussion (budget, location)');
  }

  // Specific considerations
  if (user1.cleanliness_level && user2.cleanliness_level && Math.abs(user1.cleanliness_level - user2.cleanliness_level) > 3) {
    considerations.push('⚠️ Different cleanliness standards - consider house rules');
  }

  if (user1.guest_frequency !== user2.guest_frequency) {
    considerations.push('⚠️ Different preferences for having guests over');
  }

  return considerations;
}

/**
 * Generate dealbreakers for the match
 */
function generateDealbreakers(user1: UserProfile, user2: UserProfile): string[] {
  const dealbreakers: string[] = [];

  // Smoking dealbreaker
  if (user1.smoking && user2.smoking_tolerance === false) {
    dealbreakers.push('🚭 User 1 smokes but User 2 does not tolerate smoking');
  }
  if (user2.smoking && user1.smoking_tolerance === false) {
    dealbreakers.push('🚭 User 2 smokes but User 1 does not tolerate smoking');
  }

  // Pets dealbreaker
  if (user1.pets && user2.pets_tolerance === false) {
    dealbreakers.push('🐾 User 1 has pets but User 2 does not tolerate pets');
  }
  if (user2.pets && user1.pets_tolerance === false) {
    dealbreakers.push('🐾 User 2 has pets but User 1 does not tolerate pets');
  }

  // Age preference dealbreaker
  if (user1.date_of_birth && user2.date_of_birth) {
    const age1 = calculateAge(user1.date_of_birth);
    const age2 = calculateAge(user2.date_of_birth);

    if (user1.age_range_min && user1.age_range_max && (age2 < user1.age_range_min || age2 > user1.age_range_max)) {
      dealbreakers.push(`⚠️ Age mismatch: User 2 (${age2}) outside User 1's preferred range (${user1.age_range_min}-${user1.age_range_max})`);
    }
    if (user2.age_range_min && user2.age_range_max && (age1 < user2.age_range_min || age1 > user2.age_range_max)) {
      dealbreakers.push(`⚠️ Age mismatch: User 1 (${age1}) outside User 2's preferred range (${user2.age_range_min}-${user2.age_range_max})`);
    }
  }

  return dealbreakers;
}

/**
 * Calculate age from date of birth
 */
function calculateAge(dateOfBirth: string): number {
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
 * Get compatibility quality label
 */
export function getCompatibilityQuality(score: number): {
  label: string;
  color: string;
  emoji: string;
  description: string;
} {
  if (score >= 85) {
    return {
      label: 'Excellent Match',
      color: 'green',
      emoji: '💚',
      description: 'You two would be amazing roommates!',
    };
  } else if (score >= 70) {
    return {
      label: 'Great Match',
      color: 'blue',
      emoji: '💙',
      description: 'Strong compatibility - worth connecting!',
    };
  } else if (score >= 55) {
    return {
      label: 'Good Match',
      color: 'yellow',
      emoji: '💛',
      description: 'Good potential - have a chat to explore more',
    };
  } else if (score >= 40) {
    return {
      label: 'Fair Match',
      color: 'orange',
      emoji: '🧡',
      description: 'Some compatibility - review considerations carefully',
    };
  } else {
    return {
      label: 'Low Match',
      color: 'red',
      emoji: '❤️',
      description: 'Limited compatibility - may face challenges',
    };
  }
}
