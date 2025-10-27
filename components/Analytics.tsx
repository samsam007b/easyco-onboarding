'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Google Analytics Measurement ID
// TODO: Replace with actual GA4 measurement ID when available
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Valider le format GA4 pour éviter l'injection de code
const isValidGAId = (id: string): boolean => {
  return /^G-[A-Z0-9]{10}$/.test(id);
};

if (!isValidGAId(GA_MEASUREMENT_ID)) {
  console.warn('Invalid Google Analytics ID format:', GA_MEASUREMENT_ID);
}

/**
 * Google Analytics Component
 * Tracks pageviews and custom events
 */
export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track pageviews on route changes
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const url = pathname + searchParams.toString();
      (window as any).gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  // Don't load analytics in development or if ID is invalid
  if (process.env.NODE_ENV === 'development' || !isValidGAId(GA_MEASUREMENT_ID)) {
    return null;
  }

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID.replace(/[^A-Z0-9-]/g, '')}', {
              page_path: window.location.pathname,
              cookie_flags: 'SameSite=None;Secure',
            });
          `,
        }}
      />
    </>
  );
}

/**
 * Custom event tracking functions
 * Usage: trackEvent('button_click', { button_name: 'signup' })
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

// Predefined tracking events
export const analytics = {
  // User signup/login events
  trackSignup: (method: 'email' | 'google', userType: 'searcher' | 'owner' | 'resident') => {
    trackEvent('sign_up', {
      method,
      user_type: userType,
    });
  },

  trackLogin: (method: 'email' | 'google') => {
    trackEvent('login', { method });
  },

  // Onboarding events
  trackOnboardingStart: (userType: 'searcher' | 'owner' | 'resident') => {
    trackEvent('onboarding_start', {
      user_type: userType,
    });
  },

  trackOnboardingStep: (step: string, userType: string) => {
    trackEvent('onboarding_step', {
      step_name: step,
      user_type: userType,
    });
  },

  trackOnboardingComplete: (userType: 'searcher' | 'owner' | 'resident') => {
    trackEvent('onboarding_complete', {
      user_type: userType,
    });
  },

  // Conversion events
  trackPropertyListing: (propertyId: string) => {
    trackEvent('property_listing_created', {
      property_id: propertyId,
    });
  },

  trackProfileComplete: (userType: string, profileCompleteness: number) => {
    trackEvent('profile_complete', {
      user_type: userType,
      completeness: profileCompleteness,
    });
  },

  // Engagement events
  trackLanguageChange: (from: string, to: string) => {
    trackEvent('language_change', {
      from_language: from,
      to_language: to,
    });
  },

  trackCookieConsent: (consent: 'accepted' | 'declined') => {
    trackEvent('cookie_consent', {
      consent_status: consent,
    });
  },

  trackLegalPageView: (page: 'privacy' | 'terms' | 'mentions' | 'cookies') => {
    trackEvent('legal_page_view', {
      page_name: page,
    });
  },

  // CTA tracking
  trackCTAClick: (ctaName: string, location: string) => {
    trackEvent('cta_click', {
      cta_name: ctaName,
      cta_location: location,
    });
  },

  // Error tracking
  trackError: (errorType: string, errorMessage: string) => {
    trackEvent('error', {
      error_type: errorType,
      error_message: errorMessage,
    });
  },

  // Social proof
  trackTestimonialView: (testimonialId: number) => {
    trackEvent('testimonial_view', {
      testimonial_id: testimonialId,
    });
  },

  trackFAQInteraction: (questionId: number) => {
    trackEvent('faq_interaction', {
      question_id: questionId,
    });
  },
};
