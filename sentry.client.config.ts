// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a user loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Sample rate - lower in production for cost efficiency
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Enable replay for 10% of sessions, and 100% of sessions with errors
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  // Integrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Environment and release info
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  // Ignore known benign errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    // Facebook errors
    'fb_xd_fragment',
    // Network errors that are expected
    'NetworkError',
    'Failed to fetch',
    'Load failed',
    // Browser quirks
    'ResizeObserver loop',
  ],

  // Filter out certain errors that aren't useful
  beforeSend(event, hint) {
    // Don't send errors during development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Sentry] Error captured (dev mode, not sent):', hint.originalException);
      return null;
    }

    // Filter out hydration errors that don't affect UX
    const error = hint.originalException;
    if (error instanceof Error) {
      if (error.message?.includes('Hydration failed')) {
        return null;
      }
    }

    return event;
  },
});
