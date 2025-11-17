/**
 * Multi-Provider Event Tracking System
 *
 * Supports Google Analytics 4, PostHog, and Mixpanel
 * Provides type-safe event tracking with pre-defined event categories
 * GDPR/RGPD compliant - checks user consent before tracking
 *
 * Usage:
 * ```ts
 * import { trackEvent, UserEvent } from '@/lib/analytics/event-tracker';
 *
 * trackEvent(UserEvent.SIGNUP_COMPLETED, {
 *   method: 'email',
 *   user_type: 'searcher',
 * });
 * ```
 */

import { canUseAnalytics } from '@/lib/consent/cookie-consent';
import { validateEventProperties, validateUserProperties } from './event-validator';
import { retryQueue } from './retry-queue';

// ============================================================================
// EVENT ENUMS - Type-safe event names
// ============================================================================

export enum UserEvent {
  // Authentication
  SIGNUP_STARTED = 'signup_started',
  SIGNUP_COMPLETED = 'signup_completed',
  LOGIN = 'login',
  LOGOUT = 'logout',
  EMAIL_VERIFIED = 'email_verified',
  PASSWORD_RESET = 'password_reset',

  // Profile
  PROFILE_CREATED = 'profile_created',
  PROFILE_UPDATED = 'profile_updated',
  PROFILE_PHOTO_UPLOADED = 'profile_photo_uploaded',
  VERIFICATION_STARTED = 'verification_started',
  VERIFICATION_COMPLETED = 'verification_completed',
}

export enum PropertyEvent {
  // Property Management
  PROPERTY_CREATED = 'property_created',
  PROPERTY_UPDATED = 'property_updated',
  PROPERTY_DELETED = 'property_deleted',
  PROPERTY_PUBLISHED = 'property_published',
  PROPERTY_UNPUBLISHED = 'property_unpublished',
  PROPERTY_VIEWED = 'property_viewed',

  // Property Photos
  PROPERTY_PHOTO_UPLOADED = 'property_photo_uploaded',
  PROPERTY_PHOTO_DELETED = 'property_photo_deleted',

  // Property Search
  PROPERTY_SEARCH = 'property_search',
  PROPERTY_FILTER_APPLIED = 'property_filter_applied',
  PROPERTY_FAVORITED = 'property_favorited',
  PROPERTY_UNFAVORITED = 'property_unfavorited',
}

export enum MatchingEvent {
  // Matching System
  MATCHING_STARTED = 'matching_started',
  MATCHING_PREFERENCES_SET = 'matching_preferences_set',
  MATCH_FOUND = 'match_found',
  MATCH_VIEWED = 'match_viewed',
  MATCH_LIKED = 'match_liked',
  MATCH_PASSED = 'match_passed',
  MATCH_MUTUAL = 'match_mutual',

  // Compatibility
  COMPATIBILITY_QUIZ_STARTED = 'compatibility_quiz_started',
  COMPATIBILITY_QUIZ_COMPLETED = 'compatibility_quiz_completed',
  COMPATIBILITY_SCORE_VIEWED = 'compatibility_score_viewed',
}

export enum ApplicationEvent {
  // Applications
  APPLICATION_STARTED = 'application_started',
  APPLICATION_SUBMITTED = 'application_submitted',
  APPLICATION_ACCEPTED = 'application_accepted',
  APPLICATION_REJECTED = 'application_rejected',
  APPLICATION_WITHDRAWN = 'application_withdrawn',

  // Viewing
  VIEWING_REQUESTED = 'viewing_requested',
  VIEWING_CONFIRMED = 'viewing_confirmed',
  VIEWING_COMPLETED = 'viewing_completed',
  VIEWING_CANCELLED = 'viewing_cancelled',
}

export enum OnboardingEvent {
  // Onboarding Flow
  STARTED = 'onboarding_started',
  MODE_SELECTED = 'onboarding_mode_selected',
  STEP_VIEWED = 'onboarding_step_viewed',
  STEP_COMPLETED = 'onboarding_step_completed',
  STEP_SKIPPED = 'onboarding_step_skipped',
  COMPLETED = 'onboarding_completed',
  ABANDONED = 'onboarding_abandoned',
}

export enum PaymentEvent {
  // Payments & Subscriptions
  PAYMENT_INITIATED = 'payment_initiated',
  PAYMENT_COMPLETED = 'payment_completed',
  PAYMENT_FAILED = 'payment_failed',
  SUBSCRIPTION_STARTED = 'subscription_started',
  SUBSCRIPTION_RENEWED = 'subscription_renewed',
  SUBSCRIPTION_CANCELLED = 'subscription_cancelled',
  PREMIUM_FEATURE_VIEWED = 'premium_feature_viewed',
}

export enum EngagementEvent {
  // UI Interactions
  CTA_CLICKED = 'cta_clicked',
  LINK_CLICKED = 'link_clicked',
  BUTTON_CLICKED = 'button_clicked',
  MODAL_OPENED = 'modal_opened',
  MODAL_CLOSED = 'modal_closed',

  // Content
  FAQ_VIEWED = 'faq_viewed',
  FAQ_EXPANDED = 'faq_expanded',
  TESTIMONIAL_VIEWED = 'testimonial_viewed',
  VIDEO_PLAYED = 'video_played',
  VIDEO_COMPLETED = 'video_completed',

  // Language & Settings
  LANGUAGE_CHANGED = 'language_changed',
  THEME_CHANGED = 'theme_changed',
  NOTIFICATION_SETTINGS_CHANGED = 'notification_settings_changed',
}

export enum ErrorEvent {
  // Errors
  ERROR_OCCURRED = 'error_occurred',
  API_ERROR = 'api_error',
  FORM_VALIDATION_ERROR = 'form_validation_error',
  PAGE_NOT_FOUND = 'page_not_found',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface EventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

export interface UserProperties {
  user_id?: string;
  email?: string;
  user_type?: 'searcher' | 'owner' | 'resident';
  is_verified?: boolean;
  signup_date?: string;
  language?: string;
  [key: string]: any;
}

// ============================================================================
// CORE TRACKING FUNCTIONS
// ============================================================================

/**
 * Track a custom event across all analytics providers
 * GDPR/RGPD compliant - only tracks if user has given consent
 */
export function trackEvent(
  eventName: string,
  properties?: EventProperties
): void {
  if (typeof window === 'undefined') return;

  // Check for user consent (RGPD compliance)
  if (!canUseAnalytics()) {
    return;
  }

  // Validate and sanitize properties to prevent PII leakage
  const sanitizedProperties = properties ? validateEventProperties(properties) : {};

  // Don't track in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 [Analytics]', eventName, sanitizedProperties);
    return;
  }

  const eventData = {
    event: eventName,
    timestamp: new Date().toISOString(),
    page_url: window.location.href,
    page_path: window.location.pathname,
    referrer: document.referrer,
    user_agent: navigator.userAgent,
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    ...sanitizedProperties,
  };

  // Google Analytics 4 (gtag)
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, sanitizedProperties);
  }

  // PostHog
  if (typeof window.posthog !== 'undefined') {
    window.posthog.capture(eventName, sanitizedProperties);
  }

  // Mixpanel
  if (typeof window.mixpanel !== 'undefined') {
    window.mixpanel.track(eventName, sanitizedProperties);
  }

  // Custom analytics endpoint (optional)
  sendToCustomAnalytics(eventData);
}

/**
 * Track a page view
 */
export function trackPageView(
  pagePath: string,
  pageTitle?: string,
  properties?: EventProperties
): void {
  trackEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle || document.title,
    ...properties,
  });
}

/**
 * Identify a user across all analytics providers
 * GDPR/RGPD compliant - only tracks if user has given consent
 */
export function identifyUser(
  userId: string,
  userProperties?: UserProperties
): void {
  if (typeof window === 'undefined') return;

  // Check for user consent (RGPD compliance)
  if (!canUseAnalytics()) {
    return;
  }

  // Validate and sanitize user properties to prevent PII leakage
  const sanitizedProperties = userProperties ? validateUserProperties(userProperties) : {};

  // Google Analytics 4
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
      user_id: userId,
    });
    window.gtag('set', 'user_properties', sanitizedProperties);
  }

  // PostHog
  if (typeof window.posthog !== 'undefined') {
    window.posthog.identify(userId, sanitizedProperties);
  }

  // Mixpanel
  if (typeof window.mixpanel !== 'undefined') {
    window.mixpanel.identify(userId);
    if (Object.keys(sanitizedProperties).length > 0) {
      window.mixpanel.people.set(sanitizedProperties);
    }
  }
}

/**
 * Reset user identity (on logout)
 */
export function resetUserIdentity(): void {
  if (typeof window === 'undefined') return;

  // PostHog
  if (typeof window.posthog !== 'undefined') {
    window.posthog.reset();
  }

  // Mixpanel
  if (typeof window.mixpanel !== 'undefined') {
    window.mixpanel.reset();
  }
}

/**
 * Track a conversion event
 */
export function trackConversion(
  conversionName: string,
  value?: number,
  currency?: string,
  properties?: EventProperties
): void {
  trackEvent('conversion', {
    conversion_name: conversionName,
    value,
    currency: currency || 'EUR',
    ...properties,
  });

  // GA4 specific conversion tracking
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'conversion', {
      send_to: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      value,
      currency: currency || 'EUR',
      ...properties,
    });
  }
}

/**
 * Track a funnel step
 */
export function trackFunnelStep(
  funnelName: string,
  stepName: string,
  stepNumber: number,
  properties?: EventProperties
): void {
  trackEvent('funnel_step', {
    funnel_name: funnelName,
    step_name: stepName,
    step_number: stepNumber,
    ...properties,
  });
}

/**
 * Track an error
 */
export function trackError(
  errorType: string,
  errorMessage: string,
  errorStack?: string,
  properties?: EventProperties
): void {
  trackEvent(ErrorEvent.ERROR_OCCURRED, {
    error_type: errorType,
    error_message: errorMessage,
    error_stack: errorStack,
    ...properties,
  });
}

// ============================================================================
// CUSTOM ANALYTICS ENDPOINT (Optional)
// ============================================================================

/**
 * Send event to custom analytics endpoint
 * This allows you to store analytics data in your own database
 */
async function sendToCustomAnalytics(eventData: any): Promise<void> {
  // Only send if custom endpoint is configured
  const customEndpoint = process.env.NEXT_PUBLIC_CUSTOM_ANALYTICS_ENDPOINT;
  if (!customEndpoint) return;

  try {
    await fetch(customEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
      // Don't wait for response
      keepalive: true,
    });
  } catch (error) {
    // Add to retry queue for automatic retry with exponential backoff
    if (typeof window !== 'undefined') {
      retryQueue.add(eventData.event, eventData);
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('Custom analytics error (added to retry queue):', error);
    }
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if analytics is enabled (user has consented)
 */
export function isAnalyticsEnabled(): boolean {
  if (typeof window === 'undefined') return false;

  // Check for cookie consent
  const consent = localStorage.getItem('cookie-consent');
  return consent === 'accepted';
}

/**
 * Enable analytics tracking
 */
export function enableAnalytics(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cookie-consent', 'accepted');

  // Reload analytics scripts
  window.location.reload();
}

/**
 * Disable analytics tracking
 */
export function disableAnalytics(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cookie-consent', 'declined');

  // Reset all analytics
  resetUserIdentity();
}
