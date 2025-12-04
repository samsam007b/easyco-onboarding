/**
 * Roommate Matching Algorithm Service
 * Calculates compatibility scores between searchers and current residents
 *
 * NEW APPROACH:
 * - Property filters handle physical criteria (price, location, rooms)
 * - Matching focuses on SOCIAL compatibility with roommates
 *
 * Scoring System (0-100):
 * - Lifestyle Compatibility: 30 points (cleanliness, noise, guests)
 * - Schedule Compatibility: 20 points (wake/sleep times, work schedule)
 * - Social Compatibility: 20 points (social energy, shared activities)
 * - Values Alignment: 15 points (core values, priorities)
 * - Habits Compatibility: 15 points (smoking, pets, cooking, alcohol)
 */

export interface RoommateProfile {
  // Identity
  user_id: string;
  first_name?: string;
  age?: number;
  gender?: string;
  occupation?: string;

  // Lifestyle (HIGH WEIGHT)
  cleanliness_level?: number; // 1-10 scale
  noise_tolerance?: number; // 1-10 scale
  guest_frequency?: string; // 'never' | 'rarely' | 'sometimes' | 'often'

  // Schedule (MEDIUM WEIGHT)
  wake_up_time?: string; // 'early' | 'normal' | 'late'
  sleep_time?: string; // 'early' | 'normal' | 'late'
  work_schedule?: string; // 'traditional' | 'flexible' | 'remote' | 'student'

  // Social (MEDIUM WEIGHT)
  social_energy?: number; // 1-10 scale (1=introvert, 10=extrovert)
  shared_meals_interest?: boolean;
  shared_activities_interest?: boolean;
  communication_style?: string; // 'casual' | 'formal' | 'minimal'

  // Values (MEDIUM WEIGHT)
  core_values?: string[]; // ['eco-friendly', 'career-focused', 'family-oriented', etc.]
  priorities?: string[]; // ['quiet', 'social', 'clean', 'affordable', etc.]

  // Habits (LOWER WEIGHT but can be dealbreakers)
  smoking?: boolean;
  pets?: boolean;
  cooking_frequency?: string; // 'never' | 'rarely' | 'sometimes' | 'often'
  drinks_alcohol?: boolean;

  // Personality (BONUS)
  hobbies?: string[];
  interests?: string[];
  languages_spoken?: string[];
}

export interface RoommateMatchResult {
  overallScore: number; // 0-100
  breakdown: {
    lifestyle: number; // 0-30
    schedule: number; // 0-20
    social: number; // 0-20
    values: number; // 0-15
    habits: number; // 0-15
  };
  compatibilityLevel: 'excellent' | 'good' | 'fair' | 'low';
  strengths: string[]; // What makes you compatible
  concerns: string[]; // Potential friction points
  dealbreakers: string[]; // Critical incompatibilities
}

/**
 * Calculate compatibility between a searcher and a current resident
 */
export function calculateRoommateCompatibility(
  searcher: RoommateProfile,
  resident: RoommateProfile
): RoommateMatchResult {
  const breakdown = {
    lifestyle: calculateLifestyleCompatibility(searcher, resident),
    schedule: calculateScheduleCompatibility(searcher, resident),
    social: calculateSocialCompatibility(searcher, resident),
    values: calculateValuesCompatibility(searcher, resident),
    habits: calculateHabitsCompatibility(searcher, resident),
  };

  const overallScore = Math.round(
    breakdown.lifestyle +
    breakdown.schedule +
    breakdown.social +
    breakdown.values +
    breakdown.habits
  );

  const compatibilityLevel = getCompatibilityLevel(overallScore);
  const strengths = generateStrengths(breakdown, searcher, resident);
  const concerns = generateConcerns(breakdown, searcher, resident);
  const dealbreakers = generateDealbreakers(searcher, resident);

  return {
    overallScore,
    breakdown,
    compatibilityLevel,
    strengths,
    concerns,
    dealbreakers,
  };
}

/**
 * Calculate compatibility for a searcher with ALL residents in a property
 */
export function calculatePropertyRoommateCompatibility(
  searcher: RoommateProfile,
  residents: RoommateProfile[]
): {
  averageScore: number;
  individualScores: RoommateMatchResult[];
  bestMatch?: RoommateProfile;
  worstMatch?: RoommateProfile;
} {
  if (residents.length === 0) {
    return {
      averageScore: 50, // Neutral score when no residents
      individualScores: [],
    };
  }

  const individualScores = residents.map(resident =>
    calculateRoommateCompatibility(searcher, resident)
  );

  const averageScore = Math.round(
    individualScores.reduce((sum, result) => sum + result.overallScore, 0) / residents.length
  );

  // Find best and worst matches
  const sortedByScore = [...individualScores].sort((a, b) => b.overallScore - a.overallScore);
  const bestMatchIndex = individualScores.indexOf(sortedByScore[0]);
  const worstMatchIndex = individualScores.indexOf(sortedByScore[sortedByScore.length - 1]);

  return {
    averageScore,
    individualScores,
    bestMatch: residents[bestMatchIndex],
    worstMatch: residents[worstMatchIndex],
  };
}

/**
 * Lifestyle Compatibility (0-30 points)
 * Cleanliness, noise tolerance, guests
 */
function calculateLifestyleCompatibility(
  searcher: RoommateProfile,
  resident: RoommateProfile
): number {
  let score = 0;

  // Cleanliness (0-12 points)
  if (searcher.cleanliness_level !== undefined && resident.cleanliness_level !== undefined) {
    const diff = Math.abs(searcher.cleanliness_level - resident.cleanliness_level);
    // Perfect match (0-1 diff): 12 points
    // Close match (2-3 diff): 8 points
    // Moderate diff (4-5): 4 points
    // Large diff (6+): 0 points
    if (diff <= 1) score += 12;
    else if (diff <= 3) score += 8;
    else if (diff <= 5) score += 4;
  } else {
    score += 6; // Default when data missing
  }

  // Noise tolerance (0-10 points)
  if (searcher.noise_tolerance !== undefined && resident.noise_tolerance !== undefined) {
    const diff = Math.abs(searcher.noise_tolerance - resident.noise_tolerance);
    if (diff <= 2) score += 10;
    else if (diff <= 4) score += 6;
    else if (diff <= 6) score += 3;
  } else {
    score += 5; // Default
  }

  // Guest frequency (0-8 points)
  if (searcher.guest_frequency && resident.guest_frequency) {
    const guestLevels = { never: 0, rarely: 1, sometimes: 2, often: 3 };
    const searcherLevel = guestLevels[searcher.guest_frequency as keyof typeof guestLevels];
    const residentLevel = guestLevels[resident.guest_frequency as keyof typeof guestLevels];
    const diff = Math.abs(searcherLevel - residentLevel);

    if (diff === 0) score += 8;
    else if (diff === 1) score += 5;
    else if (diff === 2) score += 2;
  } else {
    score += 4; // Default
  }

  return Math.min(30, score);
}

/**
 * Schedule Compatibility (0-20 points)
 * Wake/sleep times, work schedule
 */
function calculateScheduleCompatibility(
  searcher: RoommateProfile,
  resident: RoommateProfile
): number {
  let score = 0;

  // Wake up time (0-8 points)
  if (searcher.wake_up_time && resident.wake_up_time) {
    if (searcher.wake_up_time === resident.wake_up_time) {
      score += 8; // Same schedule = great
    } else {
      score += 4; // Different is ok, less noise conflicts
    }
  } else {
    score += 6; // Default
  }

  // Sleep time (0-8 points)
  if (searcher.sleep_time && resident.sleep_time) {
    if (searcher.sleep_time === resident.sleep_time) {
      score += 8; // Same bedtime = less conflicts
    } else {
      const earlyBird = searcher.sleep_time === 'early' || resident.sleep_time === 'early';
      const nightOwl = searcher.sleep_time === 'late' || resident.sleep_time === 'late';
      if (earlyBird && nightOwl) {
        score += 2; // Potential conflict
      } else {
        score += 5; // Moderate match
      }
    }
  } else {
    score += 6; // Default
  }

  // Work schedule (0-4 points)
  if (searcher.work_schedule && resident.work_schedule) {
    if (searcher.work_schedule === resident.work_schedule) {
      score += 4;
    } else {
      score += 2;
    }
  } else {
    score += 3; // Default
  }

  return Math.min(20, score);
}

/**
 * Social Compatibility (0-20 points)
 * Social energy, shared activities, communication
 */
function calculateSocialCompatibility(
  searcher: RoommateProfile,
  resident: RoommateProfile
): number {
  let score = 0;

  // Social energy (0-10 points)
  if (searcher.social_energy !== undefined && resident.social_energy !== undefined) {
    const diff = Math.abs(searcher.social_energy - resident.social_energy);
    // Similar energy levels = good match
    if (diff <= 2) score += 10;
    else if (diff <= 4) score += 6;
    else if (diff <= 6) score += 3;
  } else {
    score += 5; // Default
  }

  // Shared interests (0-6 points)
  if (searcher.shared_meals_interest !== undefined && resident.shared_meals_interest !== undefined) {
    if (searcher.shared_meals_interest === resident.shared_meals_interest) {
      score += 3;
    } else {
      score += 1; // Different preferences ok
    }
  } else {
    score += 2; // Default
  }

  if (searcher.shared_activities_interest !== undefined && resident.shared_activities_interest !== undefined) {
    if (searcher.shared_activities_interest === resident.shared_activities_interest) {
      score += 3;
    } else {
      score += 1;
    }
  } else {
    score += 2; // Default
  }

  // Communication style (0-4 points)
  if (searcher.communication_style && resident.communication_style) {
    if (searcher.communication_style === resident.communication_style) {
      score += 4;
    } else {
      score += 2;
    }
  } else {
    score += 3; // Default
  }

  return Math.min(20, score);
}

/**
 * Values Compatibility (0-15 points)
 * Core values, priorities alignment
 */
function calculateValuesCompatibility(
  searcher: RoommateProfile,
  resident: RoommateProfile
): number {
  let score = 0;

  // Core values overlap (0-10 points)
  if (searcher.core_values && resident.core_values) {
    const overlap = searcher.core_values.filter(v =>
      resident.core_values?.includes(v)
    ).length;

    if (overlap >= 3) score += 10;
    else if (overlap >= 2) score += 7;
    else if (overlap >= 1) score += 4;
    else score += 2;
  } else {
    score += 5; // Default
  }

  // Priorities overlap (0-5 points)
  if (searcher.priorities && resident.priorities) {
    const overlap = searcher.priorities.filter(p =>
      resident.priorities?.includes(p)
    ).length;

    if (overlap >= 2) score += 5;
    else if (overlap >= 1) score += 3;
    else score += 1;
  } else {
    score += 3; // Default
  }

  return Math.min(15, score);
}

/**
 * Habits Compatibility (0-15 points)
 * Smoking, pets, cooking, alcohol
 */
function calculateHabitsCompatibility(
  searcher: RoommateProfile,
  resident: RoommateProfile
): number {
  let score = 0;

  // Smoking (0-5 points - can be dealbreaker)
  if (searcher.smoking !== undefined && resident.smoking !== undefined) {
    if (searcher.smoking === resident.smoking) {
      score += 5; // Both smoke or both don't
    } else {
      score += 1; // Mismatch but tolerable
    }
  } else {
    score += 3; // Default
  }

  // Pets (0-4 points)
  if (searcher.pets !== undefined && resident.pets !== undefined) {
    if (searcher.pets === resident.pets) {
      score += 4;
    } else {
      score += 2; // One has pets, one doesn't - ok if property allows
    }
  } else {
    score += 3; // Default
  }

  // Cooking frequency (0-3 points)
  if (searcher.cooking_frequency && resident.cooking_frequency) {
    const levels = { never: 0, rarely: 1, sometimes: 2, often: 3 };
    const diff = Math.abs(
      levels[searcher.cooking_frequency as keyof typeof levels] -
      levels[resident.cooking_frequency as keyof typeof levels]
    );

    if (diff <= 1) score += 3;
    else score += 1;
  } else {
    score += 2; // Default
  }

  // Alcohol (0-3 points)
  if (searcher.drinks_alcohol !== undefined && resident.drinks_alcohol !== undefined) {
    if (searcher.drinks_alcohol === resident.drinks_alcohol) {
      score += 3;
    } else {
      score += 2; // Different is usually ok
    }
  } else {
    score += 2; // Default
  }

  return Math.min(15, score);
}

/**
 * Get compatibility level label
 */
function getCompatibilityLevel(score: number): 'excellent' | 'good' | 'fair' | 'low' {
  if (score >= 80) return 'excellent';
  if (score >= 65) return 'good';
  if (score >= 50) return 'fair';
  return 'low';
}

/**
 * Generate strengths (what makes them compatible)
 */
function generateStrengths(
  breakdown: RoommateMatchResult['breakdown'],
  searcher: RoommateProfile,
  resident: RoommateProfile
): string[] {
  const strengths: string[] = [];

  if (breakdown.lifestyle >= 24) {
    strengths.push('🏠 Lifestyle très compatible (propreté, bruit, invités)');
  }

  if (breakdown.schedule >= 16) {
    strengths.push('⏰ Rythmes de vie similaires');
  }

  if (breakdown.social >= 16) {
    strengths.push('🤝 Energie sociale alignée');
  }

  if (breakdown.values >= 12) {
    strengths.push('💭 Valeurs partagées');
  }

  if (breakdown.habits >= 12) {
    strengths.push('✅ Habitudes compatibles');
  }

  // Specific positive matches
  if (searcher.cleanliness_level && resident.cleanliness_level) {
    const diff = Math.abs(searcher.cleanliness_level - resident.cleanliness_level);
    if (diff <= 1) {
      strengths.push(`✨ Même niveau de propreté (${searcher.cleanliness_level}/10)`);
    }
  }

  if (searcher.shared_meals_interest && resident.shared_meals_interest) {
    strengths.push('🍽️ Intérêt pour les repas partagés');
  }

  return strengths;
}

/**
 * Generate concerns (potential friction points)
 */
function generateConcerns(
  breakdown: RoommateMatchResult['breakdown'],
  searcher: RoommateProfile,
  resident: RoommateProfile
): string[] {
  const concerns: string[] = [];

  if (breakdown.lifestyle < 20) {
    concerns.push('⚠️ Différences de style de vie');
  }

  if (breakdown.schedule < 12) {
    concerns.push('⏰ Horaires potentiellement incompatibles');
  }

  if (breakdown.social < 12) {
    concerns.push('🤔 Niveaux sociaux différents');
  }

  // Specific mismatches
  if (searcher.cleanliness_level && resident.cleanliness_level) {
    const diff = Math.abs(searcher.cleanliness_level - resident.cleanliness_level);
    if (diff >= 4) {
      concerns.push(`🧹 Grande différence de propreté (toi: ${searcher.cleanliness_level}/10, résident: ${resident.cleanliness_level}/10)`);
    }
  }

  if (searcher.sleep_time === 'early' && resident.sleep_time === 'late') {
    concerns.push('🌙 Couche-tôt vs couche-tard');
  }

  return concerns;
}

/**
 * Generate dealbreakers (critical incompatibilities)
 */
function generateDealbreakers(
  searcher: RoommateProfile,
  resident: RoommateProfile
): string[] {
  const dealbreakers: string[] = [];

  // Smoking mismatch
  if (searcher.smoking === false && resident.smoking === true) {
    dealbreakers.push('🚭 Tu ne fumes pas mais le résident fume');
  }

  // Extreme cleanliness mismatch
  if (searcher.cleanliness_level && resident.cleanliness_level) {
    const diff = Math.abs(searcher.cleanliness_level - resident.cleanliness_level);
    if (diff >= 7) {
      dealbreakers.push('❗ Incompatibilité majeure sur la propreté');
    }
  }

  return dealbreakers;
}

/**
 * Helper: Get compatibility quality description
 */
export function getCompatibilityDescription(level: string): {
  label: string;
  color: string;
  icon: string;
  description: string;
} {
  switch (level) {
    case 'excellent':
      return {
        label: 'Excellent Match',
        color: 'green',
        icon: '🌟',
        description: 'Vous êtes très compatibles! Bon potentiel de colocation',
      };
    case 'good':
      return {
        label: 'Bon Match',
        color: 'blue',
        icon: '✨',
        description: 'Bonne compatibilité générale',
      };
    case 'fair':
      return {
        label: 'Compatibilité Moyenne',
        color: 'yellow',
        icon: '👍',
        description: 'Quelques différences mais gérable',
      };
    case 'low':
      return {
        label: 'Faible Compatibilité',
        color: 'orange',
        icon: '⚠️',
        description: 'Différences importantes à considérer',
      };
    default:
      return {
        label: 'Non évalué',
        color: 'gray',
        icon: '❓',
        description: 'Pas assez de données',
      };
  }
}
