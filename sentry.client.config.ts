// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a user loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Enable replay for 10% of sessions, and 100% of sessions with errors
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  // Integrations
  integrations: [
    Sentry.replayIntegration({
      // Additional SDK configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Filter out certain errors that aren't useful
  beforeSend(event, hint) {
    // Don't send errors during development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Sentry] Error captured (dev mode, not sent):', hint.originalException);
      return null;
    }

    // Filter out known benign errors
    const error = hint.originalException;
    if (error instanceof Error) {
      // Ignore ResizeObserver errors (common browser quirk)
      if (error.message?.includes('ResizeObserver')) {
        return null;
      }
      // Ignore hydration errors that don't affect UX
      if (error.message?.includes('Hydration failed')) {
        return null;
      }
    }

    return event;
  },

  // Environment
  environment: process.env.NODE_ENV,
});
