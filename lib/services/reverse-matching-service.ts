/**
 * Reverse Matching Algorithm Service
 * Calculates compatibility scores between tenants/groups and properties
 * Used by owners to evaluate applicants
 *
 * Scoring System (0-100):
 * - Financial Stability: 30 points
 * - Profile Completeness: 20 points
 * - Lifestyle Match: 20 points
 * - Timing Alignment: 15 points
 * - References & Verification: 15 points
 */

export interface TenantProfile {
  // Financial
  monthly_income?: number;
  occupation_status?: string;
  employment_type?: string;
  guarantor_available?: boolean;

  // Profile
  profile_completion_score?: number;
  bio?: string;
  profile_photo_url?: string;

  // Lifestyle
  cleanliness_level?: number;
  noise_tolerance?: number;
  smoking?: boolean;
  pets?: boolean;
  guest_frequency?: string;

  // Timing
  desired_move_in_date?: string;
  desired_lease_duration_months?: number;

  // Verification
  id_verified?: boolean;
  email_verified?: boolean;
  phone_verified?: boolean;
  reference_count?: number;

  // Demographics
  age?: number;
  occupation?: string;
}

export interface PropertyRequirements {
  // Financial requirements
  monthly_price: number;
  min_income_ratio?: number; // e.g., 3x rent
  requires_guarantor?: boolean;

  // Property rules
  smoking_allowed?: boolean;
  pets_allowed?: boolean;
  quiet_hours?: boolean;

  // Availability
  available_from?: string;
  min_lease_duration_months?: number;
  max_lease_duration_months?: number;

  // Preferences
  preferred_tenant_age_min?: number;
  preferred_tenant_age_max?: number;
  preferred_occupation_types?: string[];
}

export interface ReverseMatchResult {
  score: number; // 0-100
  breakdown: {
    financial: number;
    profile: number;
    lifestyle: number;
    timing: number;
    verification: number;
  };
  insights: string[];
  warnings: string[];
  recommendation: 'highly_recommended' | 'recommended' | 'acceptable' | 'risky' | 'not_recommended';
}

/**
 * Calculate reverse match score (tenant → property)
 */
export function calculateReverseMatch(
  tenant: TenantProfile,
  property: PropertyRequirements
): ReverseMatchResult {
  const breakdown = {
    financial: calculateFinancialScore(tenant, property),
    profile: calculateProfileScore(tenant),
    lifestyle: calculateLifestyleCompatibility(tenant, property),
    timing: calculateTimingAlignment(tenant, property),
    verification: calculateVerificationScore(tenant),
  };

  const score = Math.round(
    breakdown.financial +
    breakdown.profile +
    breakdown.lifestyle +
    breakdown.timing +
    breakdown.verification
  );

  const insights = generateTenantInsights(breakdown, tenant, property);
  const warnings = generateTenantWarnings(breakdown, tenant, property);
  const recommendation = getRecommendation(score);

  return {
    score,
    breakdown,
    insights,
    warnings,
    recommendation,
  };
}

/**
 * Financial Score (0-30 points)
 * Most important factor for owners
 */
function calculateFinancialScore(
  tenant: TenantProfile,
  property: PropertyRequirements
): number {
  let score = 0;

  if (!tenant.monthly_income) {
    return 5; // No income info = major red flag
  }

  const incomeRatio = tenant.monthly_income / property.monthly_price;
  const requiredRatio = property.min_income_ratio || 3;

  // Income ratio scoring
  if (incomeRatio >= requiredRatio + 1) {
    score += 20; // Excellent: 4x+ rent
  } else if (incomeRatio >= requiredRatio) {
    score += 18; // Good: meets requirement
  } else if (incomeRatio >= requiredRatio - 0.5) {
    score += 12; // Acceptable: close to requirement
  } else if (incomeRatio >= requiredRatio - 1) {
    score += 8; // Risky: below requirement
  } else {
    score += 3; // Very risky: far below
  }

  // Employment status
  if (tenant.occupation_status === 'employed' || tenant.occupation_status === 'self-employed') {
    score += 5;
  } else if (tenant.occupation_status === 'student' && tenant.guarantor_available) {
    score += 4;
  } else if (tenant.occupation_status === 'student') {
    score += 2;
  }

  // Guarantor bonus
  if (tenant.guarantor_available && incomeRatio < requiredRatio) {
    score += 5; // Extra security
  }

  return Math.min(30, score);
}

/**
 * Profile Score (0-20 points)
 * Complete profiles = serious tenants
 */
function calculateProfileScore(tenant: TenantProfile): number {
  let score = 0;

  // Profile completion
  const completionScore = tenant.profile_completion_score || 0;
  score += (completionScore / 100) * 10; // Up to 10 points

  // Bio
  if (tenant.bio && tenant.bio.length > 50) {
    score += 4;
  } else if (tenant.bio) {
    score += 2;
  }

  // Photo
  if (tenant.profile_photo_url) {
    score += 3;
  }

  // Occupation info
  if (tenant.occupation) {
    score += 3;
  }

  return Math.round(Math.min(20, score));
}

/**
 * Lifestyle Compatibility (0-20 points)
 */
function calculateLifestyleCompatibility(
  tenant: TenantProfile,
  property: PropertyRequirements
): number {
  let score = 20; // Start at max, deduct for incompatibilities

  // Smoking
  if (tenant.smoking && !property.smoking_allowed) {
    score -= 10; // Major incompatibility
  }

  // Pets
  if (tenant.pets && !property.pets_allowed) {
    score -= 10; // Major incompatibility
  }

  // Noise/quiet hours
  if (property.quiet_hours && tenant.noise_tolerance && tenant.noise_tolerance >= 4) {
    score -= 3; // Potential issue
  }

  // Guest frequency
  if (tenant.guest_frequency === 'often' && property.quiet_hours) {
    score -= 2;
  }

  return Math.max(0, score);
}

/**
 * Timing Alignment (0-15 points)
 */
function calculateTimingAlignment(
  tenant: TenantProfile,
  property: PropertyRequirements
): number {
  let score = 10; // Base score

  if (!tenant.desired_move_in_date || !property.available_from) {
    return score;
  }

  const tenantDate = new Date(tenant.desired_move_in_date);
  const propertyDate = new Date(property.available_from);

  // Perfect alignment
  const daysDiff = Math.abs(tenantDate.getTime() - propertyDate.getTime()) / (1000 * 60 * 60 * 24);

  if (daysDiff <= 7) {
    score += 5; // Within a week
  } else if (daysDiff <= 14) {
    score += 4; // Within 2 weeks
  } else if (daysDiff <= 30) {
    score += 3; // Within a month
  } else if (daysDiff <= 60) {
    score += 1;
  }

  return Math.min(15, score);
}

/**
 * Verification Score (0-15 points)
 */
function calculateVerificationScore(tenant: TenantProfile): number {
  let score = 0;

  if (tenant.id_verified) score += 5;
  if (tenant.email_verified) score += 3;
  if (tenant.phone_verified) score += 3;

  // References
  const refCount = tenant.reference_count || 0;
  if (refCount >= 3) {
    score += 4;
  } else if (refCount >= 2) {
    score += 3;
  } else if (refCount >= 1) {
    score += 2;
  }

  return Math.min(15, score);
}

/**
 * Generate insights for tenant
 */
function generateTenantInsights(
  breakdown: ReverseMatchResult['breakdown'],
  tenant: TenantProfile,
  property: PropertyRequirements
): string[] {
  const insights: string[] = [];

  // Financial insights
  if (breakdown.financial >= 25) {
    insights.push('💰 Strong financial profile - low risk');
  } else if (breakdown.financial >= 18) {
    insights.push('💵 Good financial stability');
  }

  // Profile insights
  if (breakdown.profile >= 16) {
    insights.push('✨ Complete and detailed profile');
  }

  // Lifestyle insights
  if (breakdown.lifestyle === 20) {
    insights.push('🌟 Perfect lifestyle compatibility');
  } else if (breakdown.lifestyle >= 15) {
    insights.push('👍 Good lifestyle match');
  }

  // Verification insights
  if (breakdown.verification >= 12) {
    insights.push('✅ Well-verified tenant');
  }

  // Timing
  if (breakdown.timing >= 13) {
    insights.push('📅 Excellent timing alignment');
  }

  return insights;
}

/**
 * Generate warnings for tenant
 */
function generateTenantWarnings(
  breakdown: ReverseMatchResult['breakdown'],
  tenant: TenantProfile,
  property: PropertyRequirements
): string[] {
  const warnings: string[] = [];

  // Financial warnings
  if (breakdown.financial < 15) {
    if (!tenant.monthly_income) {
      warnings.push('⚠️ No income information provided');
    } else if (tenant.monthly_income < property.monthly_price * (property.min_income_ratio || 3)) {
      warnings.push('⚠️ Income below recommended threshold');
    }
  }

  // Lifestyle warnings
  if (breakdown.lifestyle < 15) {
    if (tenant.smoking && !property.smoking_allowed) {
      warnings.push('🚭 Tenant smokes but property is non-smoking');
    }
    if (tenant.pets && !property.pets_allowed) {
      warnings.push('🐾 Tenant has pets but property does not allow them');
    }
  }

  // Verification warnings
  if (breakdown.verification < 8) {
    warnings.push('⚠️ Limited verification - request more documents');
  }

  // Profile warnings
  if (breakdown.profile < 10) {
    warnings.push('⚠️ Incomplete profile - may not be serious');
  }

  return warnings;
}

/**
 * Get recommendation level
 */
function getRecommendation(score: number): ReverseMatchResult['recommendation'] {
  if (score >= 80) return 'highly_recommended';
  if (score >= 65) return 'recommended';
  if (score >= 50) return 'acceptable';
  if (score >= 35) return 'risky';
  return 'not_recommended';
}

/**
 * Get recommendation badge
 */
export function getRecommendationBadge(recommendation: ReverseMatchResult['recommendation']): {
  label: string;
  color: string;
  description: string;
} {
  switch (recommendation) {
    case 'highly_recommended':
      return {
        label: 'Highly Recommended',
        color: 'green',
        description: 'Excellent tenant - approve immediately',
      };
    case 'recommended':
      return {
        label: 'Recommended',
        color: 'blue',
        description: 'Good tenant - safe to approve',
      };
    case 'acceptable':
      return {
        label: 'Acceptable',
        color: 'yellow',
        description: 'Decent candidate - review carefully',
      };
    case 'risky':
      return {
        label: 'Risky',
        color: 'orange',
        description: 'Some concerns - proceed with caution',
      };
    case 'not_recommended':
      return {
        label: 'Not Recommended',
        color: 'red',
        description: 'High risk - consider rejecting',
      };
  }
}
