/**
 * Matching Algorithm Service
 * Calculates compatibility scores between searchers and properties
 *
 * Scoring System (0-100):
 * - Budget Match: 25 points
 * - Location Preferences: 20 points
 * - Lifestyle Compatibility: 20 points
 * - Property Features: 15 points
 * - Move-in Date: 10 points
 * - Lease Duration: 10 points
 */

export interface UserPreferences {
  // Budget
  min_budget?: number;
  max_budget?: number;

  // Location
  preferred_cities?: string[];
  preferred_neighborhoods?: string[];
  max_commute_time?: number;

  // Lifestyle
  cleanliness_level?: number; // 1-5
  noise_tolerance?: number; // 1-5
  guest_frequency?: string; // 'never' | 'rarely' | 'sometimes' | 'often'
  smoking?: boolean;
  pets?: boolean;

  // Property preferences
  min_bedrooms?: number;
  min_bathrooms?: number;
  furnished?: boolean;
  balcony?: boolean;
  parking?: boolean;

  // Timing
  desired_move_in_date?: string;
  desired_lease_duration_months?: number;

  // Social
  age_range_min?: number;
  age_range_max?: number;
  occupation_types?: string[];
}

export interface PropertyFeatures {
  // Basic
  price: number;
  city: string;
  neighborhood?: string;
  address?: string;

  // Physical
  bedrooms: number;
  bathrooms: number;
  furnished: boolean;
  balcony?: boolean;
  parking?: boolean;

  // Availability
  available_from?: string;
  min_lease_duration_months?: number;
  max_lease_duration_months?: number;

  // Rules
  smoking_allowed?: boolean;
  pets_allowed?: boolean;

  // Owner preferences
  preferred_tenant_type?: string;
  preferred_age_range?: { min: number; max: number };
}

export interface MatchResult {
  score: number; // 0-100
  breakdown: {
    budget: number;
    location: number;
    lifestyle: number;
    features: number;
    timing: number;
    duration: number;
  };
  insights: string[];
  warnings: string[];
}

/**
 * Calculate match score between a user and a property
 */
export function calculateMatchScore(
  userPrefs: UserPreferences,
  property: PropertyFeatures
): MatchResult {
  const breakdown = {
    budget: calculateBudgetScore(userPrefs, property),
    location: calculateLocationScore(userPrefs, property),
    lifestyle: calculateLifestyleScore(userPrefs, property),
    features: calculateFeaturesScore(userPrefs, property),
    timing: calculateTimingScore(userPrefs, property),
    duration: calculateDurationScore(userPrefs, property),
  };

  const score = Math.round(
    breakdown.budget +
    breakdown.location +
    breakdown.lifestyle +
    breakdown.features +
    breakdown.timing +
    breakdown.duration
  );

  const insights = generateInsights(breakdown, userPrefs, property);
  const warnings = generateWarnings(breakdown, userPrefs, property);

  return {
    score,
    breakdown,
    insights,
    warnings,
  };
}

/**
 * Budget Score (0-25 points)
 * Perfect match: Price is within user's budget range
 */
function calculateBudgetScore(
  userPrefs: UserPreferences,
  property: PropertyFeatures
): number {
  if (!userPrefs.min_budget && !userPrefs.max_budget) {
    return 20; // No budget specified, give default high score
  }

  const price = property.price;
  const minBudget = userPrefs.min_budget || 0;
  const maxBudget = userPrefs.max_budget || Infinity;

  // Perfect match: within budget
  if (price >= minBudget && price <= maxBudget) {
    // Higher score if closer to middle of budget range
    const midBudget = (minBudget + maxBudget) / 2;
    const deviation = Math.abs(price - midBudget);
    const range = maxBudget - minBudget;
    const normalizedDeviation = range > 0 ? deviation / range : 0;

    return 25 - normalizedDeviation * 5; // 20-25 points for within budget
  }

  // Slightly over budget: deduct points
  if (price > maxBudget) {
    const overage = price - maxBudget;
    const overagePercent = overage / maxBudget;

    if (overagePercent <= 0.1) return 15; // Within 10% over
    if (overagePercent <= 0.2) return 10; // Within 20% over
    return 5; // More than 20% over
  }

  // Under minimum budget (might be suspicious)
  return 15;
}

/**
 * Location Score (0-20 points)
 */
function calculateLocationScore(
  userPrefs: UserPreferences,
  property: PropertyFeatures
): number {
  let score = 10; // Base score

  // City match
  if (userPrefs.preferred_cities && userPrefs.preferred_cities.length > 0) {
    const cityMatch = userPrefs.preferred_cities.some(
      city => city.toLowerCase() === property.city.toLowerCase()
    );
    score += cityMatch ? 10 : -5;
  } else {
    score += 10; // No preference, full points
  }

  // Neighborhood match
  if (userPrefs.preferred_neighborhoods && property.neighborhood) {
    const neighborhoodMatch = userPrefs.preferred_neighborhoods.some(
      n => n.toLowerCase() === property.neighborhood?.toLowerCase()
    );
    if (neighborhoodMatch) score += 5;
  }

  return Math.max(0, Math.min(20, score));
}

/**
 * Lifestyle Score (0-20 points)
 * Checks compatibility of lifestyle preferences
 */
function calculateLifestyleScore(
  userPrefs: UserPreferences,
  property: PropertyFeatures
): number {
  let score = 20;

  // Smoking compatibility
  if (userPrefs.smoking !== undefined && property.smoking_allowed !== undefined) {
    if (userPrefs.smoking && !property.smoking_allowed) {
      score -= 8; // Major incompatibility
    } else if (!userPrefs.smoking && property.smoking_allowed) {
      score -= 2; // Minor concern
    }
  }

  // Pets compatibility
  if (userPrefs.pets !== undefined && property.pets_allowed !== undefined) {
    if (userPrefs.pets && !property.pets_allowed) {
      score -= 8; // Major incompatibility
    } else if (!userPrefs.pets && property.pets_allowed) {
      score -= 1; // Very minor
    }
  }

  return Math.max(0, score);
}

/**
 * Features Score (0-15 points)
 * Match on specific property features
 */
function calculateFeaturesScore(
  userPrefs: UserPreferences,
  property: PropertyFeatures
): number {
  let score = 0;
  let matchedFeatures = 0;
  let totalFeatures = 0;

  // Bedrooms
  if (userPrefs.min_bedrooms !== undefined) {
    totalFeatures++;
    if (property.bedrooms >= userPrefs.min_bedrooms) {
      matchedFeatures++;
    }
  }

  // Bathrooms
  if (userPrefs.min_bathrooms !== undefined) {
    totalFeatures++;
    if (property.bathrooms >= userPrefs.min_bathrooms) {
      matchedFeatures++;
    }
  }

  // Furnished
  if (userPrefs.furnished !== undefined) {
    totalFeatures++;
    if (userPrefs.furnished === property.furnished) {
      matchedFeatures++;
    }
  }

  // Balcony
  if (userPrefs.balcony === true && property.balcony === true) {
    totalFeatures++;
    matchedFeatures++;
  }

  // Parking
  if (userPrefs.parking === true && property.parking === true) {
    totalFeatures++;
    matchedFeatures++;
  }

  // Calculate score based on ratio of matched features
  if (totalFeatures > 0) {
    score = (matchedFeatures / totalFeatures) * 15;
  } else {
    score = 12; // No specific features requested, give high default
  }

  return Math.round(score);
}

/**
 * Timing Score (0-10 points)
 * Match on move-in date
 */
function calculateTimingScore(
  userPrefs: UserPreferences,
  property: PropertyFeatures
): number {
  if (!userPrefs.desired_move_in_date || !property.available_from) {
    return 8; // No timing specified, give high default
  }

  const desiredDate = new Date(userPrefs.desired_move_in_date);
  const availableDate = new Date(property.available_from);

  // Property available before desired date: perfect
  if (availableDate <= desiredDate) {
    const daysDiff = Math.abs(desiredDate.getTime() - availableDate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff <= 7) return 10; // Within a week
    if (daysDiff <= 30) return 9; // Within a month
    return 8; // Available earlier
  }

  // Property available after desired date: deduct points
  const daysLate = (availableDate.getTime() - desiredDate.getTime()) / (1000 * 60 * 60 * 24);

  if (daysLate <= 14) return 7; // Within 2 weeks late
  if (daysLate <= 30) return 5; // Within a month late
  return 3; // More than a month late
}

/**
 * Duration Score (0-10 points)
 * Match on lease duration
 */
function calculateDurationScore(
  userPrefs: UserPreferences,
  property: PropertyFeatures
): number {
  if (!userPrefs.desired_lease_duration_months) {
    return 8; // No duration specified
  }

  const desired = userPrefs.desired_lease_duration_months;
  const minLease = property.min_lease_duration_months || 0;
  const maxLease = property.max_lease_duration_months || Infinity;

  // Desired duration within property's range
  if (desired >= minLease && desired <= maxLease) {
    return 10;
  }

  // Desired duration shorter than minimum
  if (desired < minLease) {
    const diff = minLease - desired;
    if (diff <= 3) return 7; // Within 3 months
    if (diff <= 6) return 5; // Within 6 months
    return 3;
  }

  // Desired duration longer than maximum
  if (maxLease !== Infinity && desired > maxLease) {
    const diff = desired - maxLease;
    if (diff <= 3) return 7;
    if (diff <= 6) return 5;
    return 3;
  }

  return 8;
}

/**
 * Generate insights for the user
 */
function generateInsights(
  breakdown: MatchResult['breakdown'],
  userPrefs: UserPreferences,
  property: PropertyFeatures
): string[] {
  const insights: string[] = [];

  // Budget insights
  if (breakdown.budget >= 23) {
    insights.push('💰 Excellent price match for your budget');
  } else if (breakdown.budget >= 15) {
    insights.push('💵 Price is slightly above your budget but still reasonable');
  }

  // Location insights
  if (breakdown.location >= 18) {
    insights.push('📍 Perfect location match');
  }

  // Lifestyle insights
  if (breakdown.lifestyle === 20) {
    insights.push('🌟 Lifestyle preferences align perfectly');
  }

  // Features insights
  if (breakdown.features >= 13) {
    insights.push('✨ Property has most of your desired features');
  }

  // Timing insights
  if (breakdown.timing >= 9) {
    insights.push('📅 Move-in timing works great');
  }

  return insights;
}

/**
 * Generate warnings for the user
 */
function generateWarnings(
  breakdown: MatchResult['breakdown'],
  userPrefs: UserPreferences,
  property: PropertyFeatures
): string[] {
  const warnings: string[] = [];

  // Budget warnings
  if (breakdown.budget < 10) {
    warnings.push('⚠️ Price is significantly above your budget');
  }

  // Lifestyle warnings
  if (breakdown.lifestyle < 15) {
    if (userPrefs.smoking && !property.smoking_allowed) {
      warnings.push('🚭 Smoking not allowed in this property');
    }
    if (userPrefs.pets && !property.pets_allowed) {
      warnings.push('🐾 Pets not allowed in this property');
    }
  }

  // Features warnings
  if (breakdown.features < 8) {
    warnings.push('⚠️ This property is missing several features you wanted');
  }

  // Timing warnings
  if (breakdown.timing < 6) {
    warnings.push('📅 Property available date may not align with your needs');
  }

  return warnings;
}

/**
 * Get match quality label
 */
export function getMatchQuality(score: number): {
  label: string;
  color: string;
  description: string;
} {
  if (score >= 85) {
    return {
      label: 'Excellent Match',
      color: 'green',
      description: 'This property is highly compatible with your preferences',
    };
  } else if (score >= 70) {
    return {
      label: 'Great Match',
      color: 'blue',
      description: 'This property matches most of your criteria',
    };
  } else if (score >= 55) {
    return {
      label: 'Good Match',
      color: 'yellow',
      description: 'This property meets many of your needs',
    };
  } else if (score >= 40) {
    return {
      label: 'Fair Match',
      color: 'orange',
      description: 'Some aspects match, but consider the warnings',
    };
  } else {
    return {
      label: 'Low Match',
      color: 'red',
      description: 'This property may not be the best fit for you',
    };
  }
}
