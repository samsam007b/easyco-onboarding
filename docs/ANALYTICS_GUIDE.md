# 📊 Analytics & Event Tracking Guide

## Overview

EasyCo now has a comprehensive analytics system with event tracking, conversion funnels, and multi-provider support (Google Analytics 4, PostHog, Mixpanel).

---

## Quick Start

### 1. Track Page Views Automatically

Add to any layout or page:

```tsx
'use client';

import { usePageTracking } from '@/lib/analytics/use-analytics';

export default function Layout({ children }) {
  usePageTracking(); // Automatically tracks page views

  return <>{children}</>;
}
```

### 2. Track Custom Events

```tsx
import { trackEvent } from '@/lib/analytics/event-tracker';

// Simple event
trackEvent('button_clicked', {
  button_name: 'Sign Up',
  location: 'header',
});

// Property event
trackEvent('property_viewed', {
  property_id: '123',
  price: 1200,
  city: 'Brussels',
});
```

### 3. Use Specialized Hooks

```tsx
import { usePropertyAnalytics } from '@/lib/analytics/use-analytics';

function PropertyCard({ property }) {
  const { trackPropertyViewed, trackPropertyFavorited } = usePropertyAnalytics();

  useEffect(() => {
    trackPropertyViewed(property);
  }, [property.id]);

  const handleFavorite = () => {
    trackPropertyFavorited(property.id);
  };

  return <div>...</div>;
}
```

---

## Available Event Categories

### 1. User Events

```typescript
import { UserEvent } from '@/lib/analytics/event-tracker';

// Sign up
trackEvent(UserEvent.SIGN_UP, { method: 'email' });

// Profile completed
trackEvent(UserEvent.PROFILE_COMPLETED, { user_type: 'searcher' });

// Verification
trackEvent(UserEvent.VERIFICATION_COMPLETED);
```

**Available:**
- `SIGN_UP`, `SIGN_IN`, `SIGN_OUT`
- `PROFILE_COMPLETED`, `PROFILE_UPDATED`
- `VERIFICATION_STARTED`, `VERIFICATION_COMPLETED`
- `UPGRADE_TO_PREMIUM`

### 2. Property Events

```typescript
import { PropertyEvent } from '@/lib/analytics/event-tracker';

trackEvent(PropertyEvent.VIEWED, { property_id: '123' });
trackEvent(PropertyEvent.FAVORITED, { property_id: '123' });
trackEvent(PropertyEvent.SHARED, { property_id: '123', platform: 'facebook' });
```

**Available:**
- `VIEWED`, `FAVORITED`, `UNFAVORITED`, `SHARED`
- `CONTACTED`, `VISIT_SCHEDULED`, `VISIT_COMPLETED`
- `CREATED`, `PUBLISHED`, `UNPUBLISHED`, `UPDATED`, `DELETED`

### 3. Matching Events

```typescript
trackEvent(MatchingEvent.SWIPE_RIGHT, {
  property_id: '123',
  match_score: 85
});
```

**Available:**
- `SWIPE_RIGHT`, `SWIPE_LEFT`
- `MATCH_CREATED`, `MATCH_VIEWED`
- `ALGORITHM_RAN`

### 4. Application Events

```typescript
trackEvent(ApplicationEvent.SUBMITTED, {
  property_id: '123',
  application_id: '456',
});
```

**Available:**
- `STARTED`, `SUBMITTED`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`, `VIEWED`

### 5. Onboarding Events

```typescript
trackEvent(OnboardingEvent.STEP_COMPLETED, {
  step_name: 'basic_info',
  step_number: 1,
  onboarding_mode: 'quick',
});
```

**Available:**
- `STARTED`, `STEP_COMPLETED`, `COMPLETED`, `ABANDONED`, `MODE_SELECTED`

---

## React Hooks

### usePropertyAnalytics()

Track property-related events:

```tsx
const {
  trackPropertyViewed,
  trackPropertyFavorited,
  trackPropertyUnfavorited,
  trackPropertyShared,
  trackPropertyContacted,
  trackVisitScheduled,
} = usePropertyAnalytics();

// Usage
trackPropertyViewed({
  id: property.id,
  title: property.title,
  price: property.price,
  city: property.city,
});
```

### useUserAnalytics()

Track user-related events:

```tsx
const {
  trackSignUp,
  trackSignIn,
  trackProfileCompleted,
  trackVerificationStarted,
  trackVerificationCompleted,
} = useUserAnalytics();

// Usage
trackSignUp('email');
```

### useMatchingAnalytics()

Track matching events:

```tsx
const {
  trackSwipeRight,
  trackSwipeLeft,
  trackMatchCreated,
  trackMatchViewed,
} = useMatchingAnalytics();

// Usage
trackSwipeRight(property.id, matchScore);
```

### useOnboardingFunnel(mode)

Track onboarding funnel:

```tsx
const {
  trackStepCompleted,
  trackOnboardingStarted,
  trackOnboardingCompleted,
  trackOnboardingAbandoned,
} = useOnboardingFunnel('quick');

// Usage
useEffect(() => {
  trackOnboardingStarted();
}, []);

const handleNext = async () => {
  trackStepCompleted('basic_info', 1);
  router.push('/next-step');
};
```

### useSearchAnalytics()

Track search events:

```tsx
const {
  trackSearchPerformed,
  trackFilterApplied,
  trackSearchSaved,
  trackAlertCreated,
} = useSearchAnalytics();

// Usage
trackSearchPerformed('Brussels apartments', resultsCount);
trackFilterApplied('price', '800-1200');
```

### useEngagementTracking()

Track UI interactions:

```tsx
const {
  trackButtonClick,
  trackLinkClick,
  trackFormSubmitted,
} = useEngagementTracking();

// Usage
<button onClick={() => trackButtonClick('Sign Up', 'header')}>
  Sign Up
</button>
```

### useTimeOnPage()

Automatically track time spent on page:

```tsx
function PropertyPage() {
  useTimeOnPage(); // Tracks automatically

  return <div>...</div>;
}
```

### useScrollDepth()

Track scroll depth (25%, 50%, 75%, 100%):

```tsx
function BlogPost() {
  useScrollDepth(); // Tracks automatically

  return <article>...</article>;
}
```

---

## Conversion Funnels

Pre-configured funnels for key user journeys.

### 1. Searcher Conversion Funnel

9 steps from sign up to contract:

```tsx
import { trackSearcherFunnel } from '@/lib/analytics/funnels';

// Step 1: Sign up
trackSearcherFunnel.signUp({ method: 'email' });

// Step 2: Profile created
trackSearcherFunnel.profileCreated({ user_id: '123' });

// Step 3: Onboarding completed
trackSearcherFunnel.onboardingCompleted({ mode: 'quick' });

// Step 4: First search
trackSearcherFunnel.firstSearch({ query: 'Brussels' });

// Step 5: Property viewed
trackSearcherFunnel.propertyViewed({ property_id: '123' });

// Step 6: Property favorited
trackSearcherFunnel.propertyFavorited({ property_id: '123' });

// Step 7: Application submitted
trackSearcherFunnel.applicationSubmitted({ application_id: '456' });

// Step 8: Visit scheduled
trackSearcherFunnel.visitScheduled({ visit_date: '2025-12-01' });

// Step 9: Contract signed ✅
trackSearcherFunnel.contractSigned({ contract_id: '789' });
```

### 2. Owner Conversion Funnel

9 steps from sign up to contract:

```tsx
import { trackOwnerFunnel } from '@/lib/analytics/funnels';

trackOwnerFunnel.signUp();
trackOwnerFunnel.profileCreated();
trackOwnerFunnel.onboardingCompleted();
trackOwnerFunnel.firstPropertyAdded({ property_id: '123' });
trackOwnerFunnel.propertyPublished({ property_id: '123' });
trackOwnerFunnel.firstApplicationReceived({ application_id: '456' });
trackOwnerFunnel.applicantContacted({ applicant_id: '789' });
trackOwnerFunnel.visitScheduled({ visit_date: '2025-12-01' });
trackOwnerFunnel.contractSigned({ contract_id: '999' });
```

### 3. Quick Start Onboarding Funnel

6 steps for Quick Start onboarding:

```tsx
import { trackQuickStartFunnel } from '@/lib/analytics/funnels';

trackQuickStartFunnel.modeSelected();
trackQuickStartFunnel.basicInfoCompleted();
trackQuickStartFunnel.budgetLocationCompleted();
trackQuickStartFunnel.lifestyleCompleted();
trackQuickStartFunnel.availabilityCompleted();
trackQuickStartFunnel.onboardingCompleted({ completion_time: 300 }); // 5 min
```

### 4. Application Funnel

9 steps from view to contract:

```tsx
import { trackApplicationFunnel } from '@/lib/analytics/funnels';

trackApplicationFunnel.propertyViewed('prop-123');
trackApplicationFunnel.contactInitiated('prop-123');
trackApplicationFunnel.applicationStarted('prop-123');
trackApplicationFunnel.formFilled('app-456');
trackApplicationFunnel.documentsUploaded('app-456');
trackApplicationFunnel.applicationSubmitted('app-456');
trackApplicationFunnel.applicationAccepted('app-456');
trackApplicationFunnel.visitScheduled('app-456');
trackApplicationFunnel.contractSigned('app-456');
```

### 5. Matching Funnel

6 steps from algorithm to application:

```tsx
import { trackMatchingFunnel } from '@/lib/analytics/funnels';

trackMatchingFunnel.algorithmRan();
trackMatchingFunnel.matchesViewed(15);
trackMatchingFunnel.swipedRight('prop-123', 85);
trackMatchingFunnel.matchCreated('match-456');
trackMatchingFunnel.matchContacted('match-456');
trackMatchingFunnel.applicationSubmitted('match-456');
```

### 6. Premium Upgrade Funnel

6 steps from interest to payment:

```tsx
import { trackPremiumFunnel } from '@/lib/analytics/funnels';

trackPremiumFunnel.featureClicked('unlimited_matches');
trackPremiumFunnel.pricingViewed();
trackPremiumFunnel.planSelected('premium', 29.99);
trackPremiumFunnel.checkoutStarted('premium');
trackPremiumFunnel.paymentInfoEntered();
trackPremiumFunnel.paymentCompleted('premium', 29.99);
```

---

## User Identification

Identify users for personalized tracking:

```tsx
import { identifyUser, resetUser } from '@/lib/analytics/event-tracker';

// On login
identifyUser('user-123', {
  user_type: 'searcher',
  email: 'user@example.com',
  full_name: 'John Doe',
  city: 'Brussels',
  verified: true,
  subscription_tier: 'premium',
});

// On logout
resetUser();
```

---

## Multi-Provider Support

The system supports multiple analytics providers simultaneously:

### Google Analytics 4 (GA4)

**Setup:**
1. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. Add GA4 script to `app/layout.tsx`:
   ```tsx
   <Script
     src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
     strategy="afterInteractive"
   />
   <Script id="google-analytics" strategy="afterInteractive">
     {`
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
     `}
   </Script>
   ```

### PostHog

**Setup:**
1. Add to `.env.local`:
   ```
   NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxx
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```

2. Add PostHog script to `app/layout.tsx`:
   ```tsx
   <Script id="posthog" strategy="afterInteractive">
     {`
       !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
       posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_KEY}',{api_host:'${process.env.NEXT_PUBLIC_POSTHOG_HOST}'})
     `}
   </Script>
   ```

### Mixpanel

**Setup:**
1. Add to `.env.local`:
   ```
   NEXT_PUBLIC_MIXPANEL_TOKEN=xxxxxxxxxxxxx
   ```

2. Add Mixpanel script to `app/layout.tsx`:
   ```tsx
   <Script id="mixpanel" strategy="afterInteractive">
     {`
       (function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
       for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?
       MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);
       mixpanel.init('${process.env.NEXT_PUBLIC_MIXPANEL_TOKEN}');
     `}
   </Script>
   ```

---

## Testing Analytics

### Development Mode

In development, all events are logged to console:

```
📊 Event tracked: property_viewed { property_id: '123', price: 1200 }
```

### Production Mode

Events are sent to:
- Google Analytics (if configured)
- PostHog (if configured)
- Mixpanel (if configured)
- Custom analytics endpoint (if configured)

### Custom Analytics Endpoint

Add to `.env.local`:
```
NEXT_PUBLIC_CUSTOM_ANALYTICS_ENDPOINT=https://api.yourdomain.com/analytics
```

Events will be POSTed to this endpoint with full event data.

---

## Best Practices

### ✅ DO

1. **Track important user actions:**
   ```tsx
   trackEvent('application_submitted', { application_id: '123' });
   ```

2. **Use semantic event names:**
   ```tsx
   // ✅ Good
   trackEvent('property_favorited', { property_id: '123' });

   // ❌ Bad
   trackEvent('click', { type: 'favorite' });
   ```

3. **Include relevant context:**
   ```tsx
   trackEvent('search_performed', {
     query: 'Brussels',
     results_count: 42,
     filters: { price_max: 1200 },
   });
   ```

4. **Track funnel steps:**
   ```tsx
   trackQuickStartFunnel.basicInfoCompleted({ user_id: '123' });
   ```

### ❌ DON'T

1. **Don't track PII without consent:**
   ```tsx
   // ❌ Bad
   trackEvent('user_action', {
     email: 'user@example.com',
     phone: '+32...'
   });
   ```

2. **Don't track too frequently:**
   ```tsx
   // ❌ Bad - tracks on every keystroke
   onChange={(e) => trackEvent('search_typed', { query: e.target.value })}

   // ✅ Good - debounce or track on submit
   onSubmit={() => trackEvent('search_performed', { query })}
   ```

3. **Don't block UI on tracking:**
   ```tsx
   // ❌ Bad
   await trackEvent('button_clicked');

   // ✅ Good - fire and forget
   trackEvent('button_clicked');
   ```

---

## Performance Impact

- Event tracking: ~0-5ms (async)
- Page view tracking: ~0-2ms
- User identification: ~0-3ms
- Total overhead: <10ms per page

All tracking is **non-blocking** and won't affect user experience.

---

## Privacy & GDPR

### Cookie Consent

Integrate with your cookie banner:

```tsx
import { CookieConsent } from '@/components/CookieConsent';

function App() {
  const handleConsent = (consent) => {
    if (consent.analytics) {
      // Initialize analytics
      identifyUser(userId);
    }
  };

  return <CookieConsent onConsent={handleConsent} />;
}
```

### Opt-out

Users can opt out via settings:

```tsx
function AnalyticsSettings() {
  const handleOptOut = () => {
    resetUser();
    localStorage.setItem('analytics_opt_out', 'true');
  };

  return <button onClick={handleOptOut}>Disable Analytics</button>;
}
```

---

## Analyzing Data

### Google Analytics 4

View in GA4 dashboard:
- Events → All events
- Reports → Engagement
- Explore → Funnel exploration

### PostHog

View in PostHog:
- Events → Live events
- Insights → Funnels
- Persons → User properties

### Custom Analysis

Export data from your custom endpoint for analysis.

---

## Migration Checklist

- [ ] Add analytics scripts to layout
- [ ] Configure environment variables
- [ ] Add `usePageTracking()` to main layout
- [ ] Track user sign up/login
- [ ] Track onboarding funnel
- [ ] Track property views
- [ ] Track applications
- [ ] Track conversions
- [ ] Set up conversion goals in GA4
- [ ] Create funnel visualizations in PostHog
- [ ] Test in development
- [ ] Verify in production

---

**Last Updated:** 2025-11-17
**Version:** 1.0.0
