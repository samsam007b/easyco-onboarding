/**
 * Pre-configured Conversion Funnels
 *
 * Define and track complete user journeys across the application
 *
 * Usage:
 * ```ts
 * import { trackSearcherFunnel } from '@/lib/analytics/funnels';
 *
 * // In your component
 * trackSearcherFunnel.signupCompleted({ method: 'email' });
 * trackSearcherFunnel.onboardingCompleted({ mode: 'quick' });
 * ```
 */

import { trackFunnelStep } from './event-tracker';

// ============================================================================
// FUNNEL 1: Searcher Conversion Funnel
// Complete journey from landing to first application
// ============================================================================

export const trackSearcherFunnel = {
  /**
   * Step 1: User lands on homepage
   */
  landingViewed: (properties?: Record<string, any>) => {
    trackFunnelStep('searcher_conversion', 'landing_viewed', 1, properties);
  },

  /**
   * Step 2: User clicks "Start" or "Sign Up" CTA
   */
  signupStarted: (properties?: Record<string, any>) => {
    trackFunnelStep('searcher_conversion', 'signup_started', 2, properties);
  },

  /**
   * Step 3: User completes signup
   */
  signupCompleted: (properties?: Record<string, any>) => {
    trackFunnelStep('searcher_conversion', 'signup_completed', 3, properties);
  },

  /**
   * Step 4: User starts onboarding
   */
  onboardingStarted: (properties?: Record<string, any>) => {
    trackFunnelStep('searcher_conversion', 'onboarding_started', 4, properties);
  },

  /**
   * Step 5: User completes onboarding
   */
  onboardingCompleted: (properties?: Record<string, any>) => {
    trackFunnelStep('searcher_conversion', 'onboarding_completed', 5, properties);
  },

  /**
   * Step 6: User views first property
   */
  firstPropertyViewed: (properties?: Record<string, any>) => {
    trackFunnelStep('searcher_conversion', 'first_property_viewed', 6, properties);
  },

  /**
   * Step 7: User submits first application
   */
  firstApplicationSubmitted: (properties?: Record<string, any>) => {
    trackFunnelStep(
      'searcher_conversion',
      'first_application_submitted',
      7,
      properties
    );
  },
};

// ============================================================================
// FUNNEL 2: Owner Conversion Funnel
// Complete journey from landing to first property listed
// ============================================================================

export const trackOwnerFunnel = {
  /**
   * Step 1: User lands on "List Your Property" page
   */
  landingViewed: (properties?: Record<string, any>) => {
    trackFunnelStep('owner_conversion', 'landing_viewed', 1, properties);
  },

  /**
   * Step 2: User clicks "Start Listing" CTA
   */
  signupStarted: (properties?: Record<string, any>) => {
    trackFunnelStep('owner_conversion', 'signup_started', 2, properties);
  },

  /**
   * Step 3: User completes signup
   */
  signupCompleted: (properties?: Record<string, any>) => {
    trackFunnelStep('owner_conversion', 'signup_completed', 3, properties);
  },

  /**
   * Step 4: User starts property listing
   */
  listingStarted: (properties?: Record<string, any>) => {
    trackFunnelStep('owner_conversion', 'listing_started', 4, properties);
  },

  /**
   * Step 5: User adds property details
   */
  detailsAdded: (properties?: Record<string, any>) => {
    trackFunnelStep('owner_conversion', 'details_added', 5, properties);
  },

  /**
   * Step 6: User uploads photos
   */
  photosUploaded: (properties?: Record<string, any>) => {
    trackFunnelStep('owner_conversion', 'photos_uploaded', 6, properties);
  },

  /**
   * Step 7: User publishes property
   */
  propertyPublished: (properties?: Record<string, any>) => {
    trackFunnelStep('owner_conversion', 'property_published', 7, properties);
  },
};

// ============================================================================
// FUNNEL 3: Quick Start Onboarding Funnel
// Track completion of the Quick Start flow
// ============================================================================

export const trackQuickStartFunnel = {
  /**
   * Step 1: User selects Quick Start mode
   */
  modeSelected: (properties?: Record<string, any>) => {
    trackFunnelStep('quick_start_onboarding', 'mode_selected', 1, {
      mode: 'quick',
      ...properties,
    });
  },

  /**
   * Step 2: Basic Info completed
   */
  basicInfoCompleted: (properties?: Record<string, any>) => {
    trackFunnelStep(
      'quick_start_onboarding',
      'basic_info_completed',
      2,
      properties
    );
  },

  /**
   * Step 3: Budget & Location completed
   */
  budgetLocationCompleted: (properties?: Record<string, any>) => {
    trackFunnelStep(
      'quick_start_onboarding',
      'budget_location_completed',
      3,
      properties
    );
  },

  /**
   * Step 4: Lifestyle preferences completed
   */
  lifestyleCompleted: (properties?: Record<string, any>) => {
    trackFunnelStep(
      'quick_start_onboarding',
      'lifestyle_completed',
      4,
      properties
    );
  },

  /**
   * Step 5: Availability completed
   */
  availabilityCompleted: (properties?: Record<string, any>) => {
    trackFunnelStep(
      'quick_start_onboarding',
      'availability_completed',
      5,
      properties
    );
  },

  /**
   * Step 6: Onboarding completed
   */
  onboardingCompleted: (properties?: Record<string, any>) => {
    trackFunnelStep(
      'quick_start_onboarding',
      'onboarding_completed',
      6,
      properties
    );
  },
};

// ============================================================================
// FUNNEL 4: Full Onboarding Funnel
// Track completion of the Full onboarding flow
// ============================================================================

export const trackFullOnboardingFunnel = {
  /**
   * Step 1: User selects Full mode
   */
  modeSelected: (properties?: Record<string, any>) => {
    trackFunnelStep('full_onboarding', 'mode_selected', 1, {
      mode: 'full',
      ...properties,
    });
  },

  /**
   * Step 2: Personal Info completed
   */
  personalInfoCompleted: (properties?: Record<string, any>) => {
    trackFunnelStep('full_onboarding', 'personal_info_completed', 2, properties);
  },

  /**
   * Step 3: Budget & Location completed
   */
  budgetLocationCompleted: (properties?: Record<string, any>) => {
    trackFunnelStep(
      'full_onboarding',
      'budget_location_completed',
      3,
      properties
    );
  },

  /**
   * Step 4: Lifestyle completed
   */
  lifestyleCompleted: (properties?: Record<string, any>) => {
    trackFunnelStep('full_onboarding', 'lifestyle_completed', 4, properties);
  },

  /**
   * Step 5: Preferences completed
   */
  preferencesCompleted: (properties?: Record<string, any>) => {
    trackFunnelStep('full_onboarding', 'preferences_completed', 5, properties);
  },

  /**
   * Step 6: Compatibility completed
   */
  compatibilityCompleted: (properties?: Record<string, any>) => {
    trackFunnelStep('full_onboarding', 'compatibility_completed', 6, properties);
  },

  /**
   * Step 7: Verification completed
   */
  verificationCompleted: (properties?: Record<string, any>) => {
    trackFunnelStep('full_onboarding', 'verification_completed', 7, properties);
  },

  /**
   * Step 8: Onboarding completed
   */
  onboardingCompleted: (properties?: Record<string, any>) => {
    trackFunnelStep('full_onboarding', 'onboarding_completed', 8, properties);
  },
};

// ============================================================================
// FUNNEL 5: Application Funnel
// From property viewing to application submission
// ============================================================================

export const trackApplicationFunnel = {
  /**
   * Step 1: User views property listing
   */
  propertyViewed: (properties?: Record<string, any>) => {
    trackFunnelStep('application', 'property_viewed', 1, properties);
  },

  /**
   * Step 2: User clicks "Apply" button
   */
  applicationStarted: (properties?: Record<string, any>) => {
    trackFunnelStep('application', 'application_started', 2, properties);
  },

  /**
   * Step 3: User fills application form
   */
  applicationFormFilled: (properties?: Record<string, any>) => {
    trackFunnelStep('application', 'application_form_filled', 3, properties);
  },

  /**
   * Step 4: User uploads documents
   */
  documentsUploaded: (properties?: Record<string, any>) => {
    trackFunnelStep('application', 'documents_uploaded', 4, properties);
  },

  /**
   * Step 5: User submits application
   */
  applicationSubmitted: (properties?: Record<string, any>) => {
    trackFunnelStep('application', 'application_submitted', 5, properties);
  },

  /**
   * Step 6: Application accepted
   */
  applicationAccepted: (properties?: Record<string, any>) => {
    trackFunnelStep('application', 'application_accepted', 6, properties);
  },
};

// ============================================================================
// FUNNEL 6: Matching Funnel
// From matching start to mutual match
// ============================================================================

export const trackMatchingFunnel = {
  /**
   * Step 1: User starts matching
   */
  matchingStarted: (properties?: Record<string, any>) => {
    trackFunnelStep('matching', 'matching_started', 1, properties);
  },

  /**
   * Step 2: First match viewed
   */
  firstMatchViewed: (properties?: Record<string, any>) => {
    trackFunnelStep('matching', 'first_match_viewed', 2, properties);
  },

  /**
   * Step 3: User likes a match
   */
  matchLiked: (properties?: Record<string, any>) => {
    trackFunnelStep('matching', 'match_liked', 3, properties);
  },

  /**
   * Step 4: Mutual match achieved
   */
  mutualMatch: (properties?: Record<string, any>) => {
    trackFunnelStep('matching', 'mutual_match', 4, properties);
  },

  /**
   * Step 5: User messages match
   */
  messageSent: (properties?: Record<string, any>) => {
    trackFunnelStep('matching', 'message_sent', 5, properties);
  },
};

// ============================================================================
// FUNNEL 7: Premium Upgrade Funnel
// From premium feature view to subscription
// ============================================================================

export const trackPremiumFunnel = {
  /**
   * Step 1: User views premium feature prompt
   */
  premiumPromptViewed: (properties?: Record<string, any>) => {
    trackFunnelStep('premium_upgrade', 'premium_prompt_viewed', 1, properties);
  },

  /**
   * Step 2: User clicks "Upgrade" or "Learn More"
   */
  upgradeClicked: (properties?: Record<string, any>) => {
    trackFunnelStep('premium_upgrade', 'upgrade_clicked', 2, properties);
  },

  /**
   * Step 3: User views pricing page
   */
  pricingViewed: (properties?: Record<string, any>) => {
    trackFunnelStep('premium_upgrade', 'pricing_viewed', 3, properties);
  },

  /**
   * Step 4: User selects a plan
   */
  planSelected: (properties?: Record<string, any>) => {
    trackFunnelStep('premium_upgrade', 'plan_selected', 4, properties);
  },

  /**
   * Step 5: User enters payment info
   */
  paymentInfoEntered: (properties?: Record<string, any>) => {
    trackFunnelStep('premium_upgrade', 'payment_info_entered', 5, properties);
  },

  /**
   * Step 6: Payment completed
   */
  paymentCompleted: (properties?: Record<string, any>) => {
    trackFunnelStep('premium_upgrade', 'payment_completed', 6, properties);
  },

  /**
   * Step 7: Subscription activated
   */
  subscriptionActivated: (properties?: Record<string, any>) => {
    trackFunnelStep('premium_upgrade', 'subscription_activated', 7, properties);
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate conversion rate between two funnel steps
 */
export function calculateConversionRate(
  stepACount: number,
  stepBCount: number
): number {
  if (stepACount === 0) return 0;
  return Math.round((stepBCount / stepACount) * 100 * 100) / 100; // Round to 2 decimals
}

/**
 * Get funnel step name for a given funnel and step number
 */
export function getFunnelStepName(
  funnelName: string,
  stepNumber: number
): string | null {
  const funnelMaps: Record<string, Record<number, string>> = {
    searcher_conversion: {
      1: 'landing_viewed',
      2: 'signup_started',
      3: 'signup_completed',
      4: 'onboarding_started',
      5: 'onboarding_completed',
      6: 'first_property_viewed',
      7: 'first_application_submitted',
    },
    owner_conversion: {
      1: 'landing_viewed',
      2: 'signup_started',
      3: 'signup_completed',
      4: 'listing_started',
      5: 'details_added',
      6: 'photos_uploaded',
      7: 'property_published',
    },
    quick_start_onboarding: {
      1: 'mode_selected',
      2: 'basic_info_completed',
      3: 'budget_location_completed',
      4: 'lifestyle_completed',
      5: 'availability_completed',
      6: 'onboarding_completed',
    },
    full_onboarding: {
      1: 'mode_selected',
      2: 'personal_info_completed',
      3: 'budget_location_completed',
      4: 'lifestyle_completed',
      5: 'preferences_completed',
      6: 'compatibility_completed',
      7: 'verification_completed',
      8: 'onboarding_completed',
    },
    application: {
      1: 'property_viewed',
      2: 'application_started',
      3: 'application_form_filled',
      4: 'documents_uploaded',
      5: 'application_submitted',
      6: 'application_accepted',
    },
    matching: {
      1: 'matching_started',
      2: 'first_match_viewed',
      3: 'match_liked',
      4: 'mutual_match',
      5: 'message_sent',
    },
    premium_upgrade: {
      1: 'premium_prompt_viewed',
      2: 'upgrade_clicked',
      3: 'pricing_viewed',
      4: 'plan_selected',
      5: 'payment_info_entered',
      6: 'payment_completed',
      7: 'subscription_activated',
    },
  };

  return funnelMaps[funnelName]?.[stepNumber] || null;
}

/**
 * Get all available funnels
 */
export function getAvailableFunnels(): string[] {
  return [
    'searcher_conversion',
    'owner_conversion',
    'quick_start_onboarding',
    'full_onboarding',
    'application',
    'matching',
    'premium_upgrade',
  ];
}

/**
 * Get the total number of steps in a funnel
 */
export function getFunnelStepCount(funnelName: string): number {
  const stepCounts: Record<string, number> = {
    searcher_conversion: 7,
    owner_conversion: 7,
    quick_start_onboarding: 6,
    full_onboarding: 8,
    application: 6,
    matching: 5,
    premium_upgrade: 7,
  };

  return stepCounts[funnelName] || 0;
}

/**
 * Check if a user has completed a funnel
 */
export function hasFunnelCompleted(
  funnelName: string,
  completedSteps: number[]
): boolean {
  const totalSteps = getFunnelStepCount(funnelName);
  return completedSteps.includes(totalSteps);
}

/**
 * Get funnel progress percentage
 */
export function getFunnelProgress(
  funnelName: string,
  currentStep: number
): number {
  const totalSteps = getFunnelStepCount(funnelName);
  if (totalSteps === 0) return 0;
  return Math.round((currentStep / totalSteps) * 100);
}

// ============================================================================
// FUNNEL DEFINITIONS (For Documentation)
// ============================================================================

export interface FunnelDefinition {
  name: string;
  displayName: string;
  description: string;
  steps: Array<{
    stepNumber: number;
    stepName: string;
    description: string;
  }>;
}

export const FUNNEL_DEFINITIONS: FunnelDefinition[] = [
  {
    name: 'searcher_conversion',
    displayName: 'Searcher Conversion',
    description: 'Complete journey from landing to first application',
    steps: [
      { stepNumber: 1, stepName: 'landing_viewed', description: 'User lands on homepage' },
      { stepNumber: 2, stepName: 'signup_started', description: 'User clicks Sign Up' },
      { stepNumber: 3, stepName: 'signup_completed', description: 'User completes signup' },
      { stepNumber: 4, stepName: 'onboarding_started', description: 'User starts onboarding' },
      { stepNumber: 5, stepName: 'onboarding_completed', description: 'User completes onboarding' },
      { stepNumber: 6, stepName: 'first_property_viewed', description: 'User views first property' },
      { stepNumber: 7, stepName: 'first_application_submitted', description: 'User submits first application' },
    ],
  },
  {
    name: 'quick_start_onboarding',
    displayName: 'Quick Start Onboarding',
    description: 'Quick Start onboarding flow (5 steps)',
    steps: [
      { stepNumber: 1, stepName: 'mode_selected', description: 'User selects Quick Start mode' },
      { stepNumber: 2, stepName: 'basic_info_completed', description: 'Basic Info completed' },
      { stepNumber: 3, stepName: 'budget_location_completed', description: 'Budget & Location completed' },
      { stepNumber: 4, stepName: 'lifestyle_completed', description: 'Lifestyle preferences completed' },
      { stepNumber: 5, stepName: 'availability_completed', description: 'Availability completed' },
      { stepNumber: 6, stepName: 'onboarding_completed', description: 'Onboarding completed' },
    ],
  },
  // Add more funnel definitions as needed
];
