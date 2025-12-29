/**
 * Application-wide constants
 * Centralized configuration to avoid hard-coded values
 */

/**
 * Contact information
 * Can be overridden via environment variables for different environments
 */
export const CONTACT = {
  SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@izzico.be',
  SALES_EMAIL: process.env.NEXT_PUBLIC_SALES_EMAIL || 'sales@izzico.be',
  INFO_EMAIL: process.env.NEXT_PUBLIC_INFO_EMAIL || 'info@izzico.be',
} as const;

/**
 * Admin panel configuration
 */
export const ADMIN_CONFIG = {
  // Data limits for queries
  DEFAULT_LIMIT: 1000, // Increased from 200
  MAX_LIMIT: 5000,

  // Pagination
  ITEMS_PER_PAGE: 50,

  // Export limits
  MAX_EXPORT_ROWS: 10000,
} as const;

/**
 * Authentication configuration
 */
export const AUTH_CONFIG = {
  // Rate limiting
  SIGNUP_RATE_LIMIT: {
    MAX_ATTEMPTS: 3,
    WINDOW_HOURS: 1,
  },
  LOGIN_RATE_LIMIT: {
    MAX_ATTEMPTS: 5,
    WINDOW_MINUTES: 1,
  },

  // Account lockout
  ACCOUNT_LOCK: {
    MAX_FAILED_ATTEMPTS: 5,
    LOCK_DURATION_MINUTES: 15,
  },

  // Session
  SESSION_MAX_AGE_DAYS: 7,
} as const;

/**
 * Onboarding configuration
 */
export const ONBOARDING_CONFIG = {
  SEARCHER: {
    TOTAL_STEPS: 6,
    REQUIRED_FIELDS: ['firstName', 'lastName', 'dateOfBirth', 'nationality'],
  },
  OWNER: {
    TOTAL_STEPS: 5,
    REQUIRED_FIELDS: ['firstName', 'lastName', 'phoneNumber'],
  },
  RESIDENT: {
    TOTAL_STEPS: 5,
    REQUIRED_FIELDS: ['firstName', 'lastName', 'dateOfBirth'],
  },
  PROPERTY: {
    TOTAL_STEPS: 4,
    REQUIRED_FIELDS: ['propertyType', 'address', 'city'],
  },
} as const;

/**
 * Database query limits
 */
export const DB_LIMITS = {
  USERS: 1000,
  PROFILES: 1000,
  PROPERTIES: 500,
  GROUPS: 500,
  APPLICATIONS: 1000,
  NOTIFICATIONS: 1000,
  MESSAGES: 500,
} as const;

/**
 * File upload configuration
 */
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
  MAX_FILES_PER_UPLOAD: 5,
} as const;

/**
 * Validation rules
 */
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PHONE_REGEX: /^(\+32|0)[1-9]\d{8}$/,
  POSTAL_CODE_REGEX: /^\d{4}$/,
  MIN_AGE: 18,
  MAX_AGE: 100,
} as const;

/**
 * Brand colors
 */
export const BRAND_COLORS = {
  PRIMARY: '#4A148C', // Izzico Purple
  ACCENT: '#FFD600', // Izzico Yellow
} as const;

/**
 * Feature flags
 */
export const FEATURES = {
  ENABLE_MATCHING_ALGORITHM: true,
  ENABLE_MESSAGING: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: false, // Currently stub
  ENABLE_DEPENDENT_PROFILES: true,
  ENABLE_GROUP_CREATION: true,
} as const;

/**
 * External links
 */
export const EXTERNAL_LINKS = {
  FACEBOOK: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/izzico',
  INSTAGRAM: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/izzico',
  LINKEDIN: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/company/izzico',
} as const;
