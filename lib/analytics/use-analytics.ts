/**
 * React Hooks for Analytics
 *
 * Provides easy-to-use hooks for tracking events in React components
 *
 * Usage:
 * ```tsx
 * import { usePageTracking, usePropertyAnalytics } from '@/lib/analytics/use-analytics';
 *
 * function MyComponent() {
 *   usePageTracking(); // Automatic page view tracking
 *   const { trackPropertyViewed } = usePropertyAnalytics();
 *
 *   return <button onClick={() => trackPropertyViewed('prop-123')}>View</button>
 * }
 * ```
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  trackEvent,
  trackPageView,
  trackFunnelStep,
  identifyUser,
  resetUserIdentity,
  UserEvent,
  PropertyEvent,
  MatchingEvent,
  ApplicationEvent,
  OnboardingEvent,
  PaymentEvent,
  EngagementEvent,
  ErrorEvent,
  type EventProperties,
  type UserProperties,
} from './event-tracker';

// ============================================================================
// PAGE TRACKING
// ============================================================================

/**
 * Automatically track page views on route changes
 */
export function usePageTracking() {
  const pathname = usePathname();
  const previousPath = useRef<string>('');

  useEffect(() => {
    // Only track if path actually changed
    if (pathname !== previousPath.current) {
      trackPageView(pathname);
      previousPath.current = pathname;
    }
  }, [pathname]);
}

// ============================================================================
// USER ANALYTICS
// ============================================================================

export function useUserAnalytics() {
  const trackSignupStarted = useCallback(
    (method: 'email' | 'google', userType: 'searcher' | 'owner' | 'resident') => {
      trackEvent(UserEvent.SIGNUP_STARTED, { method, user_type: userType });
    },
    []
  );

  const trackSignupCompleted = useCallback(
    (method: 'email' | 'google', userType: 'searcher' | 'owner' | 'resident') => {
      trackEvent(UserEvent.SIGNUP_COMPLETED, { method, user_type: userType });
    },
    []
  );

  const trackLogin = useCallback((method: 'email' | 'google') => {
    trackEvent(UserEvent.LOGIN, { method });
  }, []);

  const trackLogout = useCallback(() => {
    trackEvent(UserEvent.LOGOUT);
    resetUserIdentity();
  }, []);

  const trackProfileCreated = useCallback((userType: string) => {
    trackEvent(UserEvent.PROFILE_CREATED, { user_type: userType });
  }, []);

  const trackProfileUpdated = useCallback(
    (fieldsUpdated: string[], userType: string) => {
      trackEvent(UserEvent.PROFILE_UPDATED, {
        fields_updated: fieldsUpdated.join(','),
        user_type: userType,
      });
    },
    []
  );

  const trackVerificationStarted = useCallback((verificationType: string) => {
    trackEvent(UserEvent.VERIFICATION_STARTED, {
      verification_type: verificationType,
    });
  }, []);

  const trackVerificationCompleted = useCallback((verificationType: string) => {
    trackEvent(UserEvent.VERIFICATION_COMPLETED, {
      verification_type: verificationType,
    });
  }, []);

  const identifyCurrentUser = useCallback(
    (userId: string, properties?: UserProperties) => {
      identifyUser(userId, properties);
    },
    []
  );

  return {
    trackSignupStarted,
    trackSignupCompleted,
    trackLogin,
    trackLogout,
    trackProfileCreated,
    trackProfileUpdated,
    trackVerificationStarted,
    trackVerificationCompleted,
    identifyCurrentUser,
  };
}

// ============================================================================
// PROPERTY ANALYTICS
// ============================================================================

export function usePropertyAnalytics() {
  const trackPropertyCreated = useCallback(
    (propertyId: string, propertyType: string, location: string) => {
      trackEvent(PropertyEvent.PROPERTY_CREATED, {
        property_id: propertyId,
        property_type: propertyType,
        location,
      });
    },
    []
  );

  const trackPropertyViewed = useCallback(
    (propertyId: string, source?: string) => {
      trackEvent(PropertyEvent.PROPERTY_VIEWED, {
        property_id: propertyId,
        source: source || 'direct',
      });
    },
    []
  );

  const trackPropertyPublished = useCallback((propertyId: string) => {
    trackEvent(PropertyEvent.PROPERTY_PUBLISHED, {
      property_id: propertyId,
    });
  }, []);

  const trackPropertySearch = useCallback(
    (searchTerm?: string, filters?: EventProperties) => {
      trackEvent(PropertyEvent.PROPERTY_SEARCH, {
        search_term: searchTerm,
        ...filters,
      });
    },
    []
  );

  const trackPropertyFavorited = useCallback((propertyId: string) => {
    trackEvent(PropertyEvent.PROPERTY_FAVORITED, {
      property_id: propertyId,
    });
  }, []);

  const trackPropertyUnfavorited = useCallback((propertyId: string) => {
    trackEvent(PropertyEvent.PROPERTY_UNFAVORITED, {
      property_id: propertyId,
    });
  }, []);

  return {
    trackPropertyCreated,
    trackPropertyViewed,
    trackPropertyPublished,
    trackPropertySearch,
    trackPropertyFavorited,
    trackPropertyUnfavorited,
  };
}

// ============================================================================
// MATCHING ANALYTICS
// ============================================================================

export function useMatchingAnalytics() {
  const trackMatchingStarted = useCallback(() => {
    trackEvent(MatchingEvent.MATCHING_STARTED);
  }, []);

  const trackMatchFound = useCallback(
    (matchId: string, compatibilityScore: number) => {
      trackEvent(MatchingEvent.MATCH_FOUND, {
        match_id: matchId,
        compatibility_score: compatibilityScore,
      });
    },
    []
  );

  const trackMatchViewed = useCallback(
    (matchId: string, compatibilityScore: number) => {
      trackEvent(MatchingEvent.MATCH_VIEWED, {
        match_id: matchId,
        compatibility_score: compatibilityScore,
      });
    },
    []
  );

  const trackMatchLiked = useCallback(
    (matchId: string, compatibilityScore: number) => {
      trackEvent(MatchingEvent.MATCH_LIKED, {
        match_id: matchId,
        compatibility_score: compatibilityScore,
      });
    },
    []
  );

  const trackMatchPassed = useCallback(
    (matchId: string, compatibilityScore: number, reason?: string) => {
      trackEvent(MatchingEvent.MATCH_PASSED, {
        match_id: matchId,
        compatibility_score: compatibilityScore,
        reason,
      });
    },
    []
  );

  const trackMatchMutual = useCallback(
    (matchId: string, compatibilityScore: number) => {
      trackEvent(MatchingEvent.MATCH_MUTUAL, {
        match_id: matchId,
        compatibility_score: compatibilityScore,
      });
    },
    []
  );

  return {
    trackMatchingStarted,
    trackMatchFound,
    trackMatchViewed,
    trackMatchLiked,
    trackMatchPassed,
    trackMatchMutual,
  };
}

// ============================================================================
// APPLICATION ANALYTICS
// ============================================================================

export function useApplicationAnalytics() {
  const trackApplicationStarted = useCallback(
    (propertyId: string, applicationType: string) => {
      trackEvent(ApplicationEvent.APPLICATION_STARTED, {
        property_id: propertyId,
        application_type: applicationType,
      });
    },
    []
  );

  const trackApplicationSubmitted = useCallback(
    (propertyId: string, applicationType: string) => {
      trackEvent(ApplicationEvent.APPLICATION_SUBMITTED, {
        property_id: propertyId,
        application_type: applicationType,
      });
    },
    []
  );

  const trackApplicationAccepted = useCallback((applicationId: string) => {
    trackEvent(ApplicationEvent.APPLICATION_ACCEPTED, {
      application_id: applicationId,
    });
  }, []);

  const trackApplicationRejected = useCallback(
    (applicationId: string, reason?: string) => {
      trackEvent(ApplicationEvent.APPLICATION_REJECTED, {
        application_id: applicationId,
        rejection_reason: reason,
      });
    },
    []
  );

  const trackViewingRequested = useCallback(
    (propertyId: string, preferredDate?: string) => {
      trackEvent(ApplicationEvent.VIEWING_REQUESTED, {
        property_id: propertyId,
        preferred_date: preferredDate,
      });
    },
    []
  );

  return {
    trackApplicationStarted,
    trackApplicationSubmitted,
    trackApplicationAccepted,
    trackApplicationRejected,
    trackViewingRequested,
  };
}

// ============================================================================
// ONBOARDING FUNNEL TRACKING
// ============================================================================

export function useOnboardingFunnel(mode: 'quick' | 'full') {
  const trackStepCompleted = useCallback(
    (stepName: string, stepNumber: number) => {
      trackFunnelStep('onboarding', stepName, stepNumber, {
        onboarding_mode: mode,
      });

      trackEvent(OnboardingEvent.STEP_COMPLETED, {
        step_name: stepName,
        step_number: stepNumber,
        onboarding_mode: mode,
      });
    },
    [mode]
  );

  const trackOnboardingStarted = useCallback(() => {
    trackEvent(OnboardingEvent.STARTED, {
      onboarding_mode: mode,
    });
    trackFunnelStep('onboarding', 'started', 1, {
      onboarding_mode: mode,
    });
  }, [mode]);

  const trackOnboardingCompleted = useCallback(
    (totalTime?: number) => {
      trackEvent(OnboardingEvent.COMPLETED, {
        onboarding_mode: mode,
        completion_time: totalTime,
      });
    },
    [mode]
  );

  const trackOnboardingAbandoned = useCallback(
    (lastStep: string, stepNumber: number) => {
      trackEvent(OnboardingEvent.ABANDONED, {
        onboarding_mode: mode,
        last_step: lastStep,
        last_step_number: stepNumber,
      });
    },
    [mode]
  );

  const trackModeSelected = useCallback(() => {
    trackEvent(OnboardingEvent.MODE_SELECTED, {
      onboarding_mode: mode,
    });
  }, [mode]);

  return {
    trackStepCompleted,
    trackOnboardingStarted,
    trackOnboardingCompleted,
    trackOnboardingAbandoned,
    trackModeSelected,
  };
}

// ============================================================================
// PAYMENT ANALYTICS
// ============================================================================

export function usePaymentAnalytics() {
  const trackPaymentInitiated = useCallback(
    (amount: number, currency: string, paymentMethod: string) => {
      trackEvent(PaymentEvent.PAYMENT_INITIATED, {
        amount,
        currency,
        payment_method: paymentMethod,
      });
    },
    []
  );

  const trackPaymentCompleted = useCallback(
    (amount: number, currency: string, paymentMethod: string, transactionId: string) => {
      trackEvent(PaymentEvent.PAYMENT_COMPLETED, {
        amount,
        currency,
        payment_method: paymentMethod,
        transaction_id: transactionId,
      });
    },
    []
  );

  const trackPaymentFailed = useCallback(
    (amount: number, currency: string, errorReason: string) => {
      trackEvent(PaymentEvent.PAYMENT_FAILED, {
        amount,
        currency,
        error_reason: errorReason,
      });
    },
    []
  );

  const trackSubscriptionStarted = useCallback(
    (plan: string, amount: number, currency: string) => {
      trackEvent(PaymentEvent.SUBSCRIPTION_STARTED, {
        plan,
        amount,
        currency,
      });
    },
    []
  );

  return {
    trackPaymentInitiated,
    trackPaymentCompleted,
    trackPaymentFailed,
    trackSubscriptionStarted,
  };
}

// ============================================================================
// ENGAGEMENT TRACKING
// ============================================================================

export function useEngagementTracking() {
  const trackCTAClick = useCallback((ctaName: string, location: string) => {
    trackEvent(EngagementEvent.CTA_CLICKED, {
      cta_name: ctaName,
      cta_location: location,
    });
  }, []);

  const trackButtonClick = useCallback((buttonName: string, location: string) => {
    trackEvent(EngagementEvent.BUTTON_CLICKED, {
      button_name: buttonName,
      button_location: location,
    });
  }, []);

  const trackModalOpened = useCallback((modalName: string) => {
    trackEvent(EngagementEvent.MODAL_OPENED, {
      modal_name: modalName,
    });
  }, []);

  const trackModalClosed = useCallback((modalName: string, timeOpen?: number) => {
    trackEvent(EngagementEvent.MODAL_CLOSED, {
      modal_name: modalName,
      time_open: timeOpen,
    });
  }, []);

  const trackFAQExpanded = useCallback((questionId: string, questionText: string) => {
    trackEvent(EngagementEvent.FAQ_EXPANDED, {
      question_id: questionId,
      question_text: questionText,
    });
  }, []);

  const trackLanguageChanged = useCallback((from: string, to: string) => {
    trackEvent(EngagementEvent.LANGUAGE_CHANGED, {
      from_language: from,
      to_language: to,
    });
  }, []);

  return {
    trackCTAClick,
    trackButtonClick,
    trackModalOpened,
    trackModalClosed,
    trackFAQExpanded,
    trackLanguageChanged,
  };
}

// ============================================================================
// ERROR TRACKING
// ============================================================================

export function useErrorTracking() {
  const trackError = useCallback(
    (errorType: string, errorMessage: string, context?: EventProperties) => {
      trackEvent(ErrorEvent.ERROR_OCCURRED, {
        error_type: errorType,
        error_message: errorMessage,
        ...context,
      });
    },
    []
  );

  const trackAPIError = useCallback(
    (endpoint: string, statusCode: number, errorMessage: string) => {
      trackEvent(ErrorEvent.API_ERROR, {
        api_endpoint: endpoint,
        status_code: statusCode,
        error_message: errorMessage,
      });
    },
    []
  );

  const trackFormValidationError = useCallback(
    (formName: string, fieldName: string, errorType: string) => {
      trackEvent(ErrorEvent.FORM_VALIDATION_ERROR, {
        form_name: formName,
        field_name: fieldName,
        error_type: errorType,
      });
    },
    []
  );

  return {
    trackError,
    trackAPIError,
    trackFormValidationError,
  };
}

// ============================================================================
// SEARCH ANALYTICS
// ============================================================================

export function useSearchAnalytics() {
  const trackSearch = useCallback(
    (searchTerm: string, resultsCount: number, filters?: EventProperties) => {
      trackEvent('search_performed', {
        search_term: searchTerm,
        results_count: resultsCount,
        ...filters,
      });
    },
    []
  );

  const trackFilterApplied = useCallback(
    (filterType: string, filterValue: string | number) => {
      trackEvent('search_filter_applied', {
        filter_type: filterType,
        filter_value: filterValue,
      });
    },
    []
  );

  const trackSearchResultClick = useCallback(
    (resultId: string, resultPosition: number, searchTerm?: string) => {
      trackEvent('search_result_clicked', {
        result_id: resultId,
        result_position: resultPosition,
        search_term: searchTerm,
      });
    },
    []
  );

  return {
    trackSearch,
    trackFilterApplied,
    trackSearchResultClick,
  };
}

// ============================================================================
// TIME TRACKING
// ============================================================================

export function useTimeOnPage() {
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    return () => {
      const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
      if (timeSpent > 5) {
        // Only track if user spent more than 5 seconds
        trackEvent('time_on_page', {
          time_spent_seconds: timeSpent,
          page_path: window.location.pathname,
        });
      }
    };
  }, []);
}

// ============================================================================
// SCROLL DEPTH TRACKING
// ============================================================================

export function useScrollDepth() {
  const trackedDepths = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;

      const depths = [25, 50, 75, 100];
      depths.forEach((depth) => {
        if (scrollPercentage >= depth && !trackedDepths.current.has(depth)) {
          trackedDepths.current.add(depth);
          trackEvent('scroll_depth', {
            depth_percentage: depth,
            page_path: window.location.pathname,
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}
