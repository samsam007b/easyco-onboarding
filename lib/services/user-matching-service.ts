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

/**
 * Personal Profile Completion - Used to GATE matching feature
 * Includes ALL fields that matter for the business (KYC, bank, email, etc.)
 * This is separate from matching-relevant fields
 */
export interface PersonalProfileCompletion {
  percentage: number; // 0-100
  filledFields: number;
  totalFields: number;
  isUnlocked: boolean; // true if >= 70% filled (can use matching)
  missingCategories: {
    category: string;
    label: string;
    filled: number;
    total: number;
    isComplete: boolean;
  }[];
  requiredForUnlock: string[]; // Fields required to unlock matching
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
 * Calculate PERSONAL profile completion for feature gating
 * This includes business-critical fields (KYC, bank, etc.) that don't affect matching
 * but are required to UNLOCK the matching feature
 *
 * Extended profile data (from DB) that we check:
 * - first_name, last_name, date_of_birth, gender_identity
 * - phone_number, email (from auth)
 * - bio, profile_photo_url
 * - occupation_status, employer/university
 * - languages_spoken, nationality
 * - KYC status, bank info (iban)
 */
export function calculatePersonalProfileCompletion(
  user: UserProfile,
  extendedData?: {
    phone_number?: string;
    email?: string;
    kyc_verified?: boolean;
    iban?: string;
    profile_photo_url?: string;
  }
): PersonalProfileCompletion {
  const categories: Record<string, {
    label: string;
    fields: Array<{ key: string; value: unknown }>;
    required: string[];
  }> = {
    identity: {
      label: 'Identité',
      fields: [
        { key: 'first_name', value: user.first_name },
        { key: 'last_name', value: user.last_name },
        { key: 'date_of_birth', value: user.date_of_birth },
        { key: 'gender', value: user.gender },
        { key: 'profile_photo_url', value: user.profile_photo_url || extendedData?.profile_photo_url },
      ],
      required: ['first_name', 'last_name', 'date_of_birth'],
    },
    contact: {
      label: 'Contact',
      fields: [
        { key: 'email', value: extendedData?.email },
        { key: 'phone_number', value: extendedData?.phone_number },
      ],
      required: ['email'],
    },
    verification: {
      label: 'Vérification',
      fields: [
        { key: 'kyc_verified', value: extendedData?.kyc_verified },
      ],
      required: [], // KYC not required to unlock, but encouraged
    },
    professional: {
      label: 'Situation',
      fields: [
        { key: 'occupation_status', value: user.occupation_status },
        { key: 'nationality', value: user.nationality },
        { key: 'languages_spoken', value: user.languages_spoken },
      ],
      required: ['occupation_status'],
    },
    presentation: {
      label: 'Présentation',
      fields: [
        { key: 'bio', value: user.bio },
        { key: 'hobbies', value: user.hobbies },
        { key: 'interests', value: user.interests },
      ],
      required: ['bio'],
    },
    lifestyle: {
      label: 'Mode de vie',
      fields: [
        { key: 'cleanliness_level', value: user.cleanliness_level },
        { key: 'wake_up_time', value: user.wake_up_time },
        { key: 'sleep_time', value: user.sleep_time },
        { key: 'social_energy', value: user.social_energy },
        { key: 'smoking', value: user.smoking },
        { key: 'pets', value: user.pets },
      ],
      required: ['cleanliness_level', 'social_energy'],
    },
    preferences: {
      label: 'Préférences de coliving',
      fields: [
        { key: 'min_budget', value: user.min_budget },
        { key: 'max_budget', value: user.max_budget },
        { key: 'preferred_coliving_size', value: user.preferred_coliving_size },
        { key: 'gender_preference', value: user.gender_preference },
      ],
      required: ['min_budget', 'max_budget'],
    },
    banking: {
      label: 'Informations bancaires',
      fields: [
        { key: 'iban', value: extendedData?.iban },
      ],
      required: [], // Not required to unlock matching, but important for business
    },
  };

  let filledFields = 0;
  let totalFields = 0;
  const missingCategories: PersonalProfileCompletion['missingCategories'] = [];
  const requiredForUnlock: string[] = [];

  for (const [categoryKey, category] of Object.entries(categories)) {
    let categoryFilled = 0;
    const categoryTotal = category.fields.length;

    for (const field of category.fields) {
      totalFields++;
      const value = field.value;
      const isFilled = value !== undefined && value !== null && value !== '' &&
        !(Array.isArray(value) && value.length === 0);

      if (isFilled) {
        filledFields++;
        categoryFilled++;
      } else if (category.required.includes(field.key)) {
        requiredForUnlock.push(`${category.label}: ${field.key}`);
      }
    }

    const isComplete = categoryFilled >= Math.ceil(categoryTotal * 0.5);

    missingCategories.push({
      category: categoryKey,
      label: category.label,
      filled: categoryFilled,
      total: categoryTotal,
      isComplete,
    });
  }

  const percentage = Math.round((filledFields / totalFields) * 100);
  const isUnlocked = percentage >= 70; // Need 70% to unlock matching

  return {
    percentage,
    filledFields,
    totalFields,
    isUnlocked,
    missingCategories,
    requiredForUnlock,
  };
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
 *
 * SCORING PHILOSOPHY:
 * - NO default points for missing data (creates differentiation)
 * - Only score when BOTH users have the data
 * - This rewards complete profiles with more accurate, differentiated scores
 */
function calculateLifestyleScore(user1: UserProfile, user2: UserProfile): number {
  let score = 0;
  let maxPossibleScore = 0;
  let scoredCategories = 0;

  // Cleanliness compatibility (0-8 points)
  maxPossibleScore += 8;
  if (user1.cleanliness_level && user2.cleanliness_level) {
    const diff = Math.abs(user1.cleanliness_level - user2.cleanliness_level);
    score += Math.max(0, 8 - diff * 0.8);
    scoredCategories++;
  }
  // NO default points - missing data = 0 points for this category

  // Wake up time compatibility (0-5 points)
  maxPossibleScore += 5;
  if (user1.wake_up_time && user2.wake_up_time) {
    if (user1.wake_up_time === user2.wake_up_time) {
      score += 5;
    } else {
      // Partial match: early/late is worse than early/moderate
      const timeOrder = { early: 0, moderate: 1, late: 2 };
      const diff = Math.abs(timeOrder[user1.wake_up_time] - timeOrder[user2.wake_up_time]);
      score += diff === 1 ? 3 : 1;
    }
    scoredCategories++;
  }

  // Sleep time compatibility (0-5 points)
  maxPossibleScore += 5;
  if (user1.sleep_time && user2.sleep_time) {
    if (user1.sleep_time === user2.sleep_time) {
      score += 5;
    } else {
      const timeOrder = { early: 0, moderate: 1, late: 2 };
      const diff = Math.abs(timeOrder[user1.sleep_time] - timeOrder[user2.sleep_time]);
      score += diff === 1 ? 3 : 1;
    }
    scoredCategories++;
  }

  // House rules preference (0-7 points)
  maxPossibleScore += 7;
  if (user1.house_rules_preference && user2.house_rules_preference) {
    const diff = Math.abs(user1.house_rules_preference - user2.house_rules_preference);
    score += Math.max(0, 7 - diff * 0.7);
    scoredCategories++;
  }

  // Cooking frequency compatibility (0-5 points)
  maxPossibleScore += 5;
  if (user1.cooking_frequency && user2.cooking_frequency) {
    const cookingLevels = { never: 0, rarely: 1, sometimes: 2, often: 3, daily: 4 };
    const diff = Math.abs(
      cookingLevels[user1.cooking_frequency] - cookingLevels[user2.cooking_frequency]
    );
    score += Math.max(0, 5 - diff * 1.25);
    scoredCategories++;
  }

  // Normalize: if no categories scored, return 0
  // Otherwise, scale to 30 points based on proportion of max possible
  if (scoredCategories === 0) {
    return 0;
  }

  // Scale the score proportionally to 30 points max
  return Math.round((score / maxPossibleScore) * 30);
}

/**
 * Social Score (0-25 points)
 * Social energy, sharing, communication, cultural openness
 *
 * SCORING PHILOSOPHY: NO default points for missing data
 */
function calculateSocialScore(user1: UserProfile, user2: UserProfile): number {
  let score = 0;
  let maxPossibleScore = 0;
  let scoredCategories = 0;

  // Social energy compatibility (0-8 points)
  maxPossibleScore += 8;
  if (user1.social_energy && user2.social_energy) {
    const diff = Math.abs(user1.social_energy - user2.social_energy);
    score += Math.max(0, 8 - diff * 0.8);
    scoredCategories++;
  }

  // Openness to sharing (0-7 points)
  maxPossibleScore += 7;
  if (user1.openness_to_sharing && user2.openness_to_sharing) {
    const levels = { private: 1, moderate: 2, open: 3, very_open: 4 };
    const diff = Math.abs(
      levels[user1.openness_to_sharing as keyof typeof levels] - levels[user2.openness_to_sharing as keyof typeof levels]
    );
    score += Math.max(0, 7 - diff * 2);
    scoredCategories++;
  }

  // Cultural openness (0-5 points) - both being open is rewarded
  maxPossibleScore += 5;
  if (user1.cultural_openness && user2.cultural_openness) {
    const levels = { conservative: 1, moderate: 2, open: 3, very_open: 4 };
    const level1 = levels[user1.cultural_openness as keyof typeof levels] || 2;
    const level2 = levels[user2.cultural_openness as keyof typeof levels] || 2;
    // Similar levels = good match
    const diff = Math.abs(level1 - level2);
    score += Math.max(0, 5 - diff * 1.5);
    scoredCategories++;
  }

  // Event participation interest (0-5 points)
  maxPossibleScore += 5;
  if (user1.event_participation_interest && user2.event_participation_interest) {
    const levels = { low: 1, medium: 2, high: 3 };
    const diff = Math.abs(
      levels[user1.event_participation_interest] - levels[user2.event_participation_interest]
    );
    score += Math.max(0, 5 - diff * 1.5);
    scoredCategories++;
  }

  if (scoredCategories === 0) {
    return 0;
  }

  return Math.round((score / maxPossibleScore) * 25);
}

/**
 * Practical Score (0-20 points)
 * Budget, location, coliving size, gender mix, age range
 *
 * SCORING PHILOSOPHY: NO default points for missing data
 */
function calculatePracticalScore(user1: UserProfile, user2: UserProfile): number {
  let score = 0;
  let maxPossibleScore = 0;
  let scoredCategories = 0;

  // Budget compatibility (0-7 points)
  maxPossibleScore += 7;
  if (user1.min_budget && user1.max_budget && user2.min_budget && user2.max_budget) {
    const overlap = Math.min(user1.max_budget, user2.max_budget) - Math.max(user1.min_budget, user2.min_budget);
    const range1 = user1.max_budget - user1.min_budget;
    const range2 = user2.max_budget - user2.min_budget;
    const avgRange = Math.max(1, (range1 + range2) / 2);

    if (overlap > 0) {
      const overlapPercent = Math.min(1, overlap / avgRange);
      score += overlapPercent * 7;
    }
    // If no overlap, score stays 0 for this category
    scoredCategories++;
  }

  // Age compatibility (0-6 points)
  maxPossibleScore += 6;
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
    // If ageDiff > 10 and outside preference, score stays 0
    scoredCategories++;
  }

  // Coliving size preference (0-4 points)
  maxPossibleScore += 4;
  if (user1.preferred_coliving_size && user2.preferred_coliving_size) {
    if (user1.preferred_coliving_size === user2.preferred_coliving_size) {
      score += 4;
    } else {
      // Adjacent sizes get partial points
      const sizeOrder = { small: 1, medium: 2, large: 3, very_large: 4 };
      const diff = Math.abs(
        sizeOrder[user1.preferred_coliving_size] - sizeOrder[user2.preferred_coliving_size]
      );
      score += Math.max(0, 4 - diff * 1.5);
    }
    scoredCategories++;
  }

  // Gender preference (0-3 points)
  maxPossibleScore += 3;
  if (user1.gender_preference && user2.gender_preference && user1.gender && user2.gender) {
    let genderMatch = true;

    if (user1.gender_preference === 'same_gender' && user1.gender !== user2.gender) {
      genderMatch = false;
    }
    if (user2.gender_preference === 'same_gender' && user1.gender !== user2.gender) {
      genderMatch = false;
    }

    score += genderMatch ? 3 : 0;
    scoredCategories++;
  }

  if (scoredCategories === 0) {
    return 0;
  }

  return Math.round((score / maxPossibleScore) * 20);
}

/**
 * Values Score (0-15 points)
 * Core values alignment
 *
 * SCORING PHILOSOPHY: NO default points for missing data
 * If either user has no values, return 0 (not scoreable)
 */
function calculateValuesScore(user1: UserProfile, user2: UserProfile): number {
  if (!user1.core_values || !user2.core_values || user1.core_values.length === 0 || user2.core_values.length === 0) {
    return 0; // Cannot score without data
  }

  const commonValues = user1.core_values.filter(v => user2.core_values?.includes(v));
  const totalValues = new Set([...user1.core_values, ...(user2.core_values || [])]).size;

  if (totalValues === 0) return 0;

  const overlapRatio = commonValues.length / totalValues;
  return Math.round(overlapRatio * 15);
}

/**
 * Preferences Score (0-10 points)
 * Dealbreakers: smoking, pets, location
 *
 * SCORING PHILOSOPHY: This is different - we START at max and DEDUCT for dealbreakers
 * Only deduct if we have explicit conflict data
 * Add bonus for location match
 */
function calculatePreferencesScore(user1: UserProfile, user2: UserProfile): number {
  let score = 0;
  let maxPossibleScore = 0;
  let scoredCategories = 0;

  // Smoking compatibility (0-4 points)
  // Only score if both users have declared their smoking status AND tolerance
  maxPossibleScore += 4;
  if (user1.smoking !== undefined && user2.smoking_tolerance !== undefined) {
    if (user1.smoking && user2.smoking_tolerance === false) {
      score += 0; // Dealbreaker
    } else {
      score += 4; // Compatible
    }
    scoredCategories++;
  }
  if (user2.smoking !== undefined && user1.smoking_tolerance !== undefined) {
    maxPossibleScore += 4;
    if (user2.smoking && user1.smoking_tolerance === false) {
      score += 0; // Dealbreaker
    } else {
      score += 4; // Compatible
    }
    scoredCategories++;
  }

  // Pets compatibility (0-4 points)
  if (user1.pets !== undefined && user2.pets_tolerance !== undefined) {
    maxPossibleScore += 4;
    if (user1.pets && user2.pets_tolerance === false) {
      score += 0; // Dealbreaker
    } else {
      score += 4; // Compatible
    }
    scoredCategories++;
  }
  if (user2.pets !== undefined && user1.pets_tolerance !== undefined) {
    maxPossibleScore += 4;
    if (user2.pets && user1.pets_tolerance === false) {
      score += 0; // Dealbreaker
    } else {
      score += 4; // Compatible
    }
    scoredCategories++;
  }

  // Location overlap bonus (0-3 points)
  if (user1.preferred_neighborhoods && user1.preferred_neighborhoods.length > 0 &&
      user2.preferred_neighborhoods && user2.preferred_neighborhoods.length > 0) {
    maxPossibleScore += 3;
    const commonNeighborhoods = user1.preferred_neighborhoods.filter(n =>
      user2.preferred_neighborhoods?.some(n2 => n2.toLowerCase() === n.toLowerCase())
    );
    if (commonNeighborhoods.length > 0) {
      score += 3;
    }
    scoredCategories++;
  }

  if (scoredCategories === 0) {
    return 0;
  }

  return Math.round((score / maxPossibleScore) * 10);
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
    strengths.push('Very similar daily routines and lifestyle habits');
  } else if (breakdown.lifestyle >= 20) {
    strengths.push('Compatible lifestyle preferences');
  }

  if (breakdown.social >= 20) {
    strengths.push('Great social compatibility and communication style');
  } else if (breakdown.social >= 15) {
    strengths.push('Good social vibe match');
  }

  if (breakdown.practical >= 16) {
    strengths.push('Practical aspects align well (budget, location, preferences)');
  }

  if (breakdown.values >= 12) {
    strengths.push('Shared core values and principles');
  }

  // Specific strengths
  if (user1.shared_meals_interest && user2.shared_meals_interest) {
    strengths.push('Both enjoy sharing meals');
  }

  if (user1.cleanliness_level && user2.cleanliness_level && Math.abs(user1.cleanliness_level - user2.cleanliness_level) <= 2) {
    strengths.push('Similar cleanliness standards');
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
    considerations.push('Different daily routines - may need to discuss schedules');
  }

  if (breakdown.social < 15) {
    considerations.push('Different social preferences - communication will be key');
  }

  if (breakdown.practical < 12) {
    considerations.push('Some practical aspects may need discussion (budget, location)');
  }

  // Specific considerations
  if (user1.cleanliness_level && user2.cleanliness_level && Math.abs(user1.cleanliness_level - user2.cleanliness_level) > 3) {
    considerations.push('Different cleanliness standards - consider house rules');
  }

  if (user1.guest_frequency !== user2.guest_frequency) {
    considerations.push('Different preferences for having guests over');
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
    dealbreakers.push('User 1 smokes but User 2 does not tolerate smoking');
  }
  if (user2.smoking && user1.smoking_tolerance === false) {
    dealbreakers.push('User 2 smokes but User 1 does not tolerate smoking');
  }

  // Pets dealbreaker
  if (user1.pets && user2.pets_tolerance === false) {
    dealbreakers.push('User 1 has pets but User 2 does not tolerate pets');
  }
  if (user2.pets && user1.pets_tolerance === false) {
    dealbreakers.push('User 2 has pets but User 1 does not tolerate pets');
  }

  // Age preference dealbreaker
  if (user1.date_of_birth && user2.date_of_birth) {
    const age1 = calculateAge(user1.date_of_birth);
    const age2 = calculateAge(user2.date_of_birth);

    if (user1.age_range_min && user1.age_range_max && (age2 < user1.age_range_min || age2 > user1.age_range_max)) {
      dealbreakers.push(`Age mismatch: User 2 (${age2}) outside User 1's preferred range (${user1.age_range_min}-${user1.age_range_max})`);
    }
    if (user2.age_range_min && user2.age_range_max && (age1 < user2.age_range_min || age1 > user2.age_range_max)) {
      dealbreakers.push(`Age mismatch: User 1 (${age1}) outside User 2's preferred range (${user2.age_range_min}-${user2.age_range_max})`);
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
      emoji: '',
      description: 'You two would be amazing roommates!',
    };
  } else if (score >= 70) {
    return {
      label: 'Great Match',
      color: 'blue',
      emoji: '',
      description: 'Strong compatibility - worth connecting!',
    };
  } else if (score >= 55) {
    return {
      label: 'Good Match',
      color: 'yellow',
      emoji: '',
      description: 'Good potential - have a chat to explore more',
    };
  } else if (score >= 40) {
    return {
      label: 'Fair Match',
      color: 'orange',
      emoji: '',
      description: 'Some compatibility - review considerations carefully',
    };
  } else {
    return {
      label: 'Low Match',
      color: 'red',
      emoji: '',
      description: 'Limited compatibility - may face challenges',
    };
  }
}
