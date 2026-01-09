/**
 * Property-to-Searcher Matching Service
 * Calculates compatibility scores between properties and searchers
 * Combines:
 * 1. Property filters match (location, budget, amenities)
 * 2. Resident compatibility (if residents exist in the property)
 * 3. Property characteristics vs searcher preferences
 *
 * Scoring System (0-100):
 * - Property Filters Match: 40 points
 * - Resident Compatibility: 35 points (average of all residents)
 * - Property Lifestyle Match: 15 points
 * - Location & Practical: 10 points
 */

import { Property } from '@/types/property.types';
import { UserProfile, calculateUserCompatibility } from './user-matching-service';

export interface PropertySearcherProfile extends UserProfile {
  // Additional searcher-specific preferences
  preferred_neighborhoods?: string[];
  min_budget?: number;
  max_budget?: number;
  preferred_property_type?: string[];
  min_bedrooms?: number;
  furnished_required?: boolean;
  required_amenities?: string[];
  preferred_amenities?: string[];
}

export interface PropertyWithResidents extends Property {
  residents?: UserProfile[];
  resident_count?: number;
}

export interface PropertyMatchResult {
  score: number; // 0-100
  breakdown: {
    propertyFilters: number; // 0-40
    residentCompatibility: number; // 0-35
    propertyLifestyle: number; // 0-15
    locationPractical: number; // 0-10
  };
  strengths: string[];
  considerations: string[];
  dealbreakers: string[];
  residentMatches?: Array<{
    resident: UserProfile;
    compatibilityScore: number;
  }>;
  isScoreReliable: boolean; // true if searcher profile is >= 40% complete
}

/**
 * Calculate compatibility between a property and a searcher
 */
export function calculatePropertySearcherMatch(
  property: PropertyWithResidents,
  searcher: PropertySearcherProfile
): PropertyMatchResult {
  const breakdown = {
    propertyFilters: calculatePropertyFiltersScore(property, searcher),
    residentCompatibility: calculateResidentCompatibilityScore(property, searcher),
    propertyLifestyle: calculatePropertyLifestyleScore(property, searcher),
    locationPractical: calculateLocationPracticalScore(property, searcher),
  };

  const score = Math.round(
    breakdown.propertyFilters +
    breakdown.residentCompatibility +
    breakdown.propertyLifestyle +
    breakdown.locationPractical
  );

  const residentMatches = calculateResidentMatches(property, searcher);
  const strengths = generatePropertyStrengths(breakdown, property, searcher, residentMatches);
  const considerations = generatePropertyConsiderations(breakdown, property, searcher);
  const dealbreakers = generatePropertyDealbreakers(property, searcher);

  // Check if searcher profile has enough data for reliable matching
  const searcherDataFields = [
    searcher.min_budget,
    searcher.max_budget,
    searcher.cleanliness_level,
    searcher.social_energy,
    searcher.smoking,
    searcher.pets,
    searcher.smoking_tolerance,
    searcher.pets_tolerance,
  ].filter(field => field !== undefined && field !== null);

  const isScoreReliable = searcherDataFields.length >= 4;

  return {
    score,
    breakdown,
    strengths,
    considerations,
    dealbreakers,
    residentMatches,
    isScoreReliable,
  };
}

/**
 * Property Filters Score (0-40 points)
 * Budget, location, bedrooms, property type, amenities
 */
function calculatePropertyFiltersScore(
  property: PropertyWithResidents,
  searcher: PropertySearcherProfile
): number {
  let score = 0;
  let maxPossibleScore = 0;
  let scoredCategories = 0;

  // Budget match (0-15 points) - MOST IMPORTANT
  maxPossibleScore += 15;
  if (searcher.min_budget !== undefined && searcher.max_budget !== undefined) {
    const totalRent = property.monthly_rent + (property.charges || 0);

    if (totalRent >= searcher.min_budget && totalRent <= searcher.max_budget) {
      // Perfect match: rent is within budget
      score += 15;
    } else if (totalRent < searcher.min_budget) {
      // Below budget: still good, slight penalty
      const diffPercent = (searcher.min_budget - totalRent) / searcher.min_budget;
      score += Math.max(10, 15 - diffPercent * 20);
    } else {
      // Above budget: penalty based on how much over
      const diffPercent = (totalRent - searcher.max_budget) / searcher.max_budget;
      if (diffPercent <= 0.1) {
        score += 10; // Within 10% over budget
      } else if (diffPercent <= 0.2) {
        score += 5; // Within 20% over budget
      }
      // Over 20% = 0 points
    }
    scoredCategories++;
  }

  // Location match (0-10 points)
  maxPossibleScore += 10;
  if (searcher.preferred_neighborhoods && searcher.preferred_neighborhoods.length > 0) {
    const cityMatch = searcher.preferred_neighborhoods.some(
      neighborhood =>
        property.city.toLowerCase().includes(neighborhood.toLowerCase()) ||
        neighborhood.toLowerCase().includes(property.city.toLowerCase())
    );
    score += cityMatch ? 10 : 0;
    scoredCategories++;
  }

  // Property type match (0-7 points)
  maxPossibleScore += 7;
  if (searcher.preferred_property_type && searcher.preferred_property_type.length > 0) {
    const typeMatch = searcher.preferred_property_type.includes(property.property_type);
    score += typeMatch ? 7 : 2; // Small points even if not exact match
    scoredCategories++;
  }

  // Bedrooms match (0-5 points)
  maxPossibleScore += 5;
  if (searcher.min_bedrooms !== undefined) {
    if (property.bedrooms >= searcher.min_bedrooms) {
      score += 5;
    } else {
      // Penalty if fewer bedrooms than required
      const diff = searcher.min_bedrooms - property.bedrooms;
      score += Math.max(0, 5 - diff * 2);
    }
    scoredCategories++;
  }

  // Furnished match (0-3 points)
  maxPossibleScore += 3;
  if (searcher.furnished_required !== undefined) {
    if (searcher.furnished_required && property.furnished) {
      score += 3;
    } else if (!searcher.furnished_required) {
      score += 3; // Doesn't matter to them
    }
    // If they require furnished but property isn't = 0 points
    scoredCategories++;
  }

  // Required amenities (0-5 points) - MUST HAVE
  maxPossibleScore += 5;
  if (searcher.required_amenities && searcher.required_amenities.length > 0) {
    const hasAllRequired = searcher.required_amenities.every(amenity =>
      property.amenities.includes(amenity as any)
    );
    score += hasAllRequired ? 5 : 0;
    scoredCategories++;
  }

  // Preferred amenities (0-5 points) - NICE TO HAVE
  maxPossibleScore += 5;
  if (searcher.preferred_amenities && searcher.preferred_amenities.length > 0) {
    const matchedPreferred = searcher.preferred_amenities.filter(amenity =>
      property.amenities.includes(amenity as any)
    ).length;
    const preferredRatio = matchedPreferred / searcher.preferred_amenities.length;
    score += Math.round(preferredRatio * 5);
    scoredCategories++;
  }

  if (scoredCategories === 0) {
    return 0;
  }

  // Scale to 40 points max
  return Math.round((score / maxPossibleScore) * 40);
}

/**
 * Resident Compatibility Score (0-35 points)
 * Average compatibility with all current residents
 */
function calculateResidentCompatibilityScore(
  property: PropertyWithResidents,
  searcher: PropertySearcherProfile
): number {
  if (!property.residents || property.residents.length === 0) {
    // No residents = neutral score (not good or bad)
    return 18; // ~50% of max 35 points
  }

  // Calculate compatibility with each resident
  const residentScores = property.residents.map(resident => {
    const compatibility = calculateUserCompatibility(searcher, resident);
    return compatibility.score;
  });

  // Average of all resident scores
  const avgResidentScore = residentScores.reduce((sum, score) => sum + score, 0) / residentScores.length;

  // Scale from 0-100 to 0-35
  return Math.round((avgResidentScore / 100) * 35);
}

/**
 * Property Lifestyle Score (0-15 points)
 * How well property rules match searcher preferences
 */
function calculatePropertyLifestyleScore(
  property: PropertyWithResidents,
  searcher: PropertySearcherProfile
): number {
  let score = 0;
  let maxPossibleScore = 0;
  let scoredCategories = 0;

  // Smoking compatibility (0-7 points)
  maxPossibleScore += 7;
  if (searcher.smoking !== undefined) {
    if (searcher.smoking && property.smoking_allowed) {
      score += 7; // Smoker + smoking allowed = perfect
    } else if (!searcher.smoking) {
      score += 7; // Non-smoker doesn't care either way
    } else if (searcher.smoking && !property.smoking_allowed) {
      score += 0; // Dealbreaker
    }
    scoredCategories++;
  }

  // Pets compatibility (0-8 points)
  maxPossibleScore += 8;
  if (searcher.pets !== undefined) {
    if (searcher.pets && property.pets_allowed) {
      score += 8; // Has pets + pets allowed = perfect
    } else if (!searcher.pets) {
      score += 8; // No pets, doesn't matter
    } else if (searcher.pets && !property.pets_allowed) {
      score += 0; // Dealbreaker
    }
    scoredCategories++;
  }

  if (scoredCategories === 0) {
    return 7.5; // ~50% of 15 if no data
  }

  return Math.round((score / maxPossibleScore) * 15);
}

/**
 * Location & Practical Score (0-10 points)
 * Availability dates, minimum stay, etc.
 */
function calculateLocationPracticalScore(
  property: PropertyWithResidents,
  searcher: PropertySearcherProfile
): number {
  let score = 0;
  let maxPossibleScore = 0;

  // Availability score (0-5 points)
  maxPossibleScore += 5;
  if (property.is_available) {
    score += 5;
  } else if (property.available_from) {
    // Available in the future
    const daysUntilAvailable = Math.ceil(
      (new Date(property.available_from).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilAvailable <= 30) {
      score += 4; // Available within a month
    } else if (daysUntilAvailable <= 60) {
      score += 3; // Available within 2 months
    } else {
      score += 1;
    }
  }

  // Minimum stay compatibility (0-5 points)
  maxPossibleScore += 5;
  if (property.minimum_stay_months) {
    // Most searchers prefer flexibility
    if (property.minimum_stay_months <= 3) {
      score += 5; // Flexible
    } else if (property.minimum_stay_months <= 6) {
      score += 3; // Moderate
    } else {
      score += 1; // Long commitment
    }
  } else {
    score += 5; // No minimum = flexible
  }

  return Math.round((score / maxPossibleScore) * 10);
}

/**
 * Calculate individual resident matches for display
 */
function calculateResidentMatches(
  property: PropertyWithResidents,
  searcher: PropertySearcherProfile
): Array<{ resident: UserProfile; compatibilityScore: number }> {
  if (!property.residents || property.residents.length === 0) {
    return [];
  }

  return property.residents.map(resident => {
    const compatibility = calculateUserCompatibility(searcher, resident);
    return {
      resident,
      compatibilityScore: compatibility.score,
    };
  }).sort((a, b) => b.compatibilityScore - a.compatibilityScore); // Highest first
}

/**
 * Generate strengths for the property match
 */
function generatePropertyStrengths(
  breakdown: PropertyMatchResult['breakdown'],
  property: PropertyWithResidents,
  searcher: PropertySearcherProfile,
  residentMatches?: PropertyMatchResult['residentMatches']
): string[] {
  const strengths: string[] = [];

  if (breakdown.propertyFilters >= 32) {
    strengths.push('Excellent match for your search criteria');
  } else if (breakdown.propertyFilters >= 24) {
    strengths.push('Good fit for your requirements');
  }

  if (breakdown.residentCompatibility >= 28) {
    strengths.push('Very compatible with current residents');
  } else if (breakdown.residentCompatibility >= 21) {
    strengths.push('Good compatibility with housemates');
  }

  // Budget strength
  if (searcher.min_budget && searcher.max_budget) {
    const totalRent = property.monthly_rent + (property.charges || 0);
    if (totalRent >= searcher.min_budget && totalRent <= searcher.max_budget) {
      strengths.push('Within your budget range');
    }
  }

  // Location strength
  if (searcher.preferred_neighborhoods && searcher.preferred_neighborhoods.length > 0) {
    const cityMatch = searcher.preferred_neighborhoods.some(neighborhood =>
      property.city.toLowerCase().includes(neighborhood.toLowerCase())
    );
    if (cityMatch) {
      strengths.push(`Located in your preferred area (${property.city})`);
    }
  }

  // Amenities strength
  if (searcher.required_amenities && searcher.required_amenities.length > 0) {
    const hasAllRequired = searcher.required_amenities.every(amenity =>
      property.amenities.includes(amenity as any)
    );
    if (hasAllRequired) {
      strengths.push('Has all your required amenities');
    }
  }

  // Best resident match
  if (residentMatches && residentMatches.length > 0 && residentMatches[0].compatibilityScore >= 70) {
    strengths.push(`Great compatibility with ${residentMatches[0].resident.first_name} (${residentMatches[0].compatibilityScore}%)`);
  }

  return strengths;
}

/**
 * Generate considerations for the property match
 */
function generatePropertyConsiderations(
  breakdown: PropertyMatchResult['breakdown'],
  property: PropertyWithResidents,
  searcher: PropertySearcherProfile
): string[] {
  const considerations: string[] = [];

  if (breakdown.propertyFilters < 24) {
    considerations.push('Some of your criteria may not be fully met');
  }

  if (breakdown.residentCompatibility < 21 && property.residents && property.residents.length > 0) {
    considerations.push('Compatibility with current residents could be better');
  }

  // Budget consideration
  if (searcher.max_budget) {
    const totalRent = property.monthly_rent + (property.charges || 0);
    if (totalRent > searcher.max_budget) {
      const overPercent = Math.round(((totalRent - searcher.max_budget) / searcher.max_budget) * 100);
      considerations.push(`Rent is ${overPercent}% over your budget (${totalRent}€ vs ${searcher.max_budget}€)`);
    }
  }

  // Minimum stay consideration
  if (property.minimum_stay_months && property.minimum_stay_months > 6) {
    considerations.push(`Requires minimum ${property.minimum_stay_months} months commitment`);
  }

  // Availability consideration
  if (!property.is_available && property.available_from) {
    const daysUntilAvailable = Math.ceil(
      (new Date(property.available_from).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilAvailable > 30) {
      considerations.push(`Available in ${Math.round(daysUntilAvailable / 30)} months`);
    }
  }

  return considerations;
}

/**
 * Generate dealbreakers for the property match
 */
function generatePropertyDealbreakers(
  property: PropertyWithResidents,
  searcher: PropertySearcherProfile
): string[] {
  const dealbreakers: string[] = [];

  // Smoking dealbreaker
  if (searcher.smoking && !property.smoking_allowed) {
    dealbreakers.push('You smoke but smoking is not allowed in this property');
  }

  // Pets dealbreaker
  if (searcher.pets && !property.pets_allowed) {
    dealbreakers.push('You have pets but pets are not allowed in this property');
  }

  // Required amenities dealbreaker
  if (searcher.required_amenities && searcher.required_amenities.length > 0) {
    const missingRequired = searcher.required_amenities.filter(amenity =>
      !property.amenities.includes(amenity as any)
    );
    if (missingRequired.length > 0) {
      dealbreakers.push(`Missing required amenities: ${missingRequired.join(', ')}`);
    }
  }

  // Budget hard limit dealbreaker
  if (searcher.max_budget) {
    const totalRent = property.monthly_rent + (property.charges || 0);
    if (totalRent > searcher.max_budget * 1.2) { // More than 20% over budget
      dealbreakers.push(`Rent significantly exceeds your budget (${totalRent}€ vs ${searcher.max_budget}€ max)`);
    }
  }

  // Bedrooms dealbreaker
  if (searcher.min_bedrooms && property.bedrooms < searcher.min_bedrooms) {
    dealbreakers.push(`Not enough bedrooms (${property.bedrooms} vs ${searcher.min_bedrooms} required)`);
  }

  return dealbreakers;
}

/**
 * Get property match quality label
 */
export function getPropertyMatchQuality(score: number): {
  label: string;
  color: string;
  emoji: string;
  description: string;
} {
  if (score >= 85) {
    return {
      label: 'Perfect Match',
      color: 'green',
      emoji: '',
      description: 'This property is ideal for you!',
    };
  } else if (score >= 70) {
    return {
      label: 'Excellent Match',
      color: 'blue',
      emoji: '',
      description: 'Highly recommended - check it out!',
    };
  } else if (score >= 55) {
    return {
      label: 'Good Match',
      color: 'yellow',
      emoji: '',
      description: 'Worth considering - review the details',
    };
  } else if (score >= 40) {
    return {
      label: 'Fair Match',
      color: 'orange',
      emoji: '',
      description: 'Some compatibility - review considerations',
    };
  } else {
    return {
      label: 'Low Match',
      color: 'red',
      emoji: '',
      description: 'May not be the best fit for you',
    };
  }
}
