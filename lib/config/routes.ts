/**
 * Centralized route configuration
 * All application routes should be defined here to avoid hard-coded URLs
 * and ensure consistency across the application.
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/auth', // Consolidated auth page
  SIGNUP: '/auth?mode=signup', // Consolidated auth page with signup mode
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  WELCOME: '/welcome',

  // Legal routes
  LEGAL: {
    PRIVACY: '/legal/privacy',
    TERMS: '/legal/terms',
    MENTIONS: '/legal/mentions',
    COOKIES: '/legal/cookies',
  },

  // Auth routes
  AUTH: {
    INDEX: '/auth',
    CALLBACK: '/auth/callback',
    COMPLETE_SIGNUP: '/auth/complete-signup',
    VERIFIED: '/auth/verified',
  },

  // Admin routes
  ADMIN: '/admin',

  // Dashboard routes
  DASHBOARD: {
    SEARCHER: '/dashboard/searcher',
    OWNER: '/dashboard/owner',
    RESIDENT: '/dashboard/resident',
    MY_PROFILE: '/dashboard/my-profile',
    MY_PROFILE_OWNER: '/dashboard/my-profile-owner',
    MY_PROFILE_RESIDENT: '/dashboard/my-profile-resident',
    PROFILES: '/dashboard/profiles',
    SEARCHER_APPLICATIONS: '/dashboard/searcher/my-applications',
    OWNER_APPLICATIONS: '/dashboard/owner/applications',
  },

  // Onboarding routes - Searcher
  ONBOARDING_SEARCHER: {
    INDEX: '/onboarding/searcher',
    PROFILE_TYPE: '/onboarding/searcher/profile-type',
    GROUP_SELECTION: '/onboarding/searcher/group-selection',
    CREATE_GROUP: '/onboarding/searcher/create-group',
    JOIN_GROUP: '/onboarding/searcher/join-group',
    BASIC_INFO: '/onboarding/searcher/basic-info',
    DAILY_HABITS: '/onboarding/searcher/daily-habits',
    HOME_LIFESTYLE: '/onboarding/searcher/home-lifestyle',
    SOCIAL_VIBE: '/onboarding/searcher/social-vibe',
    IDEAL_COLIVING: '/onboarding/searcher/ideal-coliving',
    PREFERENCES: '/onboarding/searcher/preferences',
    PRIVACY: '/onboarding/searcher/privacy',
    VERIFICATION: '/onboarding/searcher/verification',
    REVIEW: '/onboarding/searcher/review',
    SUCCESS: '/onboarding/searcher/success',
  },

  // Onboarding routes - Owner
  ONBOARDING_OWNER: {
    INDEX: '/onboarding/owner',
    BASIC_INFO: '/onboarding/owner/basic-info',
    ABOUT: '/onboarding/owner/about',
    PROPERTY_BASICS: '/onboarding/owner/property-basics',
    VERIFICATION: '/onboarding/owner/verification',
    REVIEW: '/onboarding/owner/review',
    SUCCESS: '/onboarding/owner/success',
  },

  // Onboarding routes - Resident
  ONBOARDING_RESIDENT: {
    INDEX: '/onboarding/resident',
    BASIC_INFO: '/onboarding/resident/basic-info',
    LIFESTYLE: '/onboarding/resident/lifestyle',
    PERSONALITY: '/onboarding/resident/personality',
    LIVING_SITUATION: '/onboarding/resident/living-situation',
    REVIEW: '/onboarding/resident/review',
    SUCCESS: '/onboarding/resident/success',
  },

  // Onboarding routes - Property (DEPRECATED - routes removed)

  // Profile enhancement routes
  PROFILE_ENHANCE: {
    INDEX: '/profile/enhance',
    ABOUT: '/profile/enhance/about',
    PERSONALITY: '/profile/enhance/personality',
    VALUES: '/profile/enhance/values',
    HOBBIES: '/profile/enhance/hobbies',
    FINANCIAL: '/profile/enhance/financial',
    PREFERENCES: '/profile/enhance/preferences',
    COMMUNITY: '/profile/enhance/community',
    VERIFICATION: '/profile/enhance/verification',
    REVIEW: '/profile/enhance/review',
  },

  PROFILE_ENHANCE_OWNER: {
    INDEX: '/profile/enhance-owner',
    BIO: '/profile/enhance-owner/bio',
    EXPERIENCE: '/profile/enhance-owner/experience',
    SERVICES: '/profile/enhance-owner/services',
    POLICIES: '/profile/enhance-owner/policies',
    VERIFICATION: '/profile/enhance-owner/verification',
    REVIEW: '/profile/enhance-owner/review',
  },

  PROFILE_ENHANCE_RESIDENT: {
    INDEX: '/profile/enhance-resident',
    PERSONALITY: '/profile/enhance-resident/personality',
    LIFESTYLE: '/profile/enhance-resident/lifestyle',
    COMMUNITY: '/profile/enhance-resident/community',
    VERIFICATION: '/profile/enhance-resident/verification',
  },

  // Properties routes
  PROPERTIES: {
    BROWSE: '/properties/browse',
    ADD: '/properties/add',
    VIEW: (id: string) => `/properties/${id}`,
    EDIT: (id: string) => `/properties/edit/${id}`,
  },

  // Groups routes
  GROUPS: {
    CREATE: '/dashboard/searcher/groups/create',
    JOIN: '/groups/join',
    SETTINGS: (id: string) => `/groups/${id}/settings`,
  },

  // Other routes
  COMMUNITY: '/community',
  MESSAGES: '/messages',
  NOTIFICATIONS: '/notifications',
  FAVORITES: '/favorites',
  PROFILE: '/profile',

  // API routes
  API: {
    AUTH: {
      SIGNUP: '/api/auth/signup',
      LOGIN: '/api/auth/login',
    },
    USER: {
      DELETE: '/api/user/delete',
    },
    ANALYTICS: '/api/analytics',
    ANALYTICS_CHECK: '/api/analytics/check',
  },
} as const;

/**
 * Helper function to build redirect URLs for login
 */
export function getLoginRedirectUrl(redirectTo?: string): string {
  if (!redirectTo) return ROUTES.LOGIN;
  return `${ROUTES.LOGIN}?redirect=${encodeURIComponent(redirectTo)}`;
}

/**
 * Helper function to get dashboard route based on user type
 */
export function getDashboardRoute(userType: 'searcher' | 'owner' | 'resident'): string {
  const dashboardMap = {
    searcher: ROUTES.DASHBOARD.SEARCHER,
    owner: ROUTES.DASHBOARD.OWNER,
    resident: ROUTES.DASHBOARD.RESIDENT,
  };
  return dashboardMap[userType] || ROUTES.HOME;
}

/**
 * Helper function to get onboarding route based on user type
 */
export function getOnboardingRoute(userType: 'searcher' | 'owner' | 'resident'): string {
  const onboardingMap = {
    searcher: ROUTES.ONBOARDING_SEARCHER.BASIC_INFO,
    owner: ROUTES.ONBOARDING_OWNER.BASIC_INFO,
    resident: ROUTES.ONBOARDING_RESIDENT.BASIC_INFO,
  };
  return onboardingMap[userType] || ROUTES.HOME;
}

/**
 * Whitelist of allowed redirect URLs for security
 */
export const ALLOWED_REDIRECTS = [
  ROUTES.HOME,
  ROUTES.ADMIN,
  ROUTES.DASHBOARD.SEARCHER,
  ROUTES.DASHBOARD.OWNER,
  ROUTES.DASHBOARD.RESIDENT,
  ROUTES.WELCOME,
  ROUTES.ONBOARDING_SEARCHER.BASIC_INFO,
  ROUTES.ONBOARDING_OWNER.BASIC_INFO,
  ROUTES.ONBOARDING_RESIDENT.BASIC_INFO,
] as const;
