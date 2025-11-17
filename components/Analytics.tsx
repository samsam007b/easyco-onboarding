'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { usePageTracking } from '@/lib/analytics/use-analytics';

// Analytics Provider IDs
// TODO: Replace with actual IDs when available
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
const POSTHOG_API_KEY = process.env.NEXT_PUBLIC_POSTHOG_API_KEY || '';
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '';

// Valider le format GA4 pour éviter l'injection de code
const isValidGAId = (id: string): boolean => {
  return /^G-[A-Z0-9]{10}$/.test(id);
};

if (!isValidGAId(GA_MEASUREMENT_ID)) {
  // FIXME: Use logger.warn('Invalid Google Analytics ID format:', GA_MEASUREMENT_ID);
}

/**
 * Multi-Provider Analytics Component
 * Tracks pageviews and custom events across GA4, PostHog, and Mixpanel
 */
export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Use our custom page tracking hook
  usePageTracking();

  // Track pageviews on route changes (GA4 specific)
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const url = pathname + searchParams.toString();
      (window as any).gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  // Don't load analytics in development
  const isDevelopment = process.env.NODE_ENV === 'development';
  const hasValidGA = isValidGAId(GA_MEASUREMENT_ID);
  const hasPostHog = !!POSTHOG_API_KEY;
  const hasMixpanel = !!MIXPANEL_TOKEN;

  if (isDevelopment) {
    return null;
  }

  return (
    <>
      {/* Google Analytics 4 */}
      {hasValidGA && (
        <>
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
      )}

      {/* PostHog Analytics */}
      {hasPostHog && (
        <Script
          id="posthog"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('${POSTHOG_API_KEY}',{api_host:'https://app.posthog.com'})
            `,
          }}
        />
      )}

      {/* Mixpanel Analytics */}
      {hasMixpanel && (
        <Script
          id="mixpanel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);
              mixpanel.init('${MIXPANEL_TOKEN}', {
                debug: false,
                track_pageview: true,
                persistence: 'localStorage',
              });
            `,
          }}
        />
      )}
    </>
  );
}

/**
 * Custom event tracking functions
 * Usage: trackEvent('button_click', { button_name: 'signup' })
 */

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, any>) => void;
    posthog?: {
      capture: (eventName: string, properties?: Record<string, any>) => void;
      identify: (userId: string, properties?: Record<string, any>) => void;
      reset: () => void;
      [key: string]: any;
    };
    mixpanel?: {
      track: (eventName: string, properties?: Record<string, any>) => void;
      identify: (userId: string) => void;
      people: {
        set: (properties: Record<string, any>) => void;
      };
      reset: () => void;
      [key: string]: any;
    };
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
