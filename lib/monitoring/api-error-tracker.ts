/**
 * API ERROR TRACKER
 *
 * Captures all API errors (4xx, 5xx) and reports them to Sentry
 * and the local error tracking system.
 */

import * as Sentry from '@sentry/nextjs';

interface ApiError {
  url: string;
  method: string;
  status: number;
  statusText: string;
  errorBody?: string;
  timestamp: Date;
  userId?: string;
  context?: Record<string, unknown>;
}

// Store for tracking errors locally (for dashboard)
const recentApiErrors: ApiError[] = [];
const MAX_STORED_ERRORS = 100;

/**
 * Track an API error
 */
export function trackApiError(error: ApiError) {
  // Add to local store
  recentApiErrors.unshift(error);
  if (recentApiErrors.length > MAX_STORED_ERRORS) {
    recentApiErrors.pop();
  }

  // Report to Sentry
  // Handle relative URLs by providing a base URL
  let pathname = error.url;
  try {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://izzico.be';
    pathname = new URL(error.url, base).pathname;
  } catch {
    // If URL parsing still fails, use the raw URL
    pathname = error.url;
  }

  Sentry.captureMessage(`API Error: ${error.status} ${error.method} ${error.url}`, {
    level: error.status >= 500 ? 'error' : 'warning',
    tags: {
      'api.status': error.status,
      'api.method': error.method,
      'api.endpoint': pathname,
    },
    extra: {
      url: error.url,
      statusText: error.statusText,
      errorBody: error.errorBody,
      userId: error.userId,
      ...error.context,
    },
  });

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[API Error Tracked] ${error.status} ${error.method} ${error.url}`);
  }
}

/**
 * Get recent API errors (for dashboard)
 */
export function getRecentApiErrors(): ApiError[] {
  return [...recentApiErrors];
}

/**
 * Create a fetch wrapper that tracks errors
 */
export function createTrackedFetch(userId?: string) {
  return async function trackedFetch(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const method = init?.method || 'GET';

    const response = await fetch(input, init);

    // Track 4xx and 5xx errors
    if (response.status >= 400) {
      let errorBody: string | undefined;
      try {
        // Clone response to read body without consuming it
        const clonedResponse = response.clone();
        errorBody = await clonedResponse.text();
      } catch {
        // Ignore if we can't read the body
      }

      trackApiError({
        url,
        method,
        status: response.status,
        statusText: response.statusText,
        errorBody,
        timestamp: new Date(),
        userId,
      });
    }

    return response;
  };
}

/**
 * Wrap Supabase client to track errors
 * Call this once when initializing the app
 */
export function setupGlobalErrorTracking() {
  if (typeof window === 'undefined') return;

  const originalFetch = window.fetch;

  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url;
    const method = init?.method || 'GET';

    try {
      const response = await originalFetch(input, init);

      // Track 4xx and 5xx errors for Supabase and internal APIs
      if (response.status >= 400) {
        const isSupabase = url.includes('supabase.co');
        const isInternalApi = url.includes('/api/');

        if (isSupabase || isInternalApi) {
          let errorBody: string | undefined;
          try {
            const clonedResponse = response.clone();
            errorBody = await clonedResponse.text();
          } catch {
            // Ignore
          }

          trackApiError({
            url,
            method,
            status: response.status,
            statusText: response.statusText,
            errorBody: errorBody?.slice(0, 1000), // Limit size
            timestamp: new Date(),
            context: {
              source: isSupabase ? 'supabase' : 'internal-api',
            },
          });
        }
      }

      return response;
    } catch (error) {
      // Track network errors
      Sentry.captureException(error, {
        tags: {
          'api.url': url,
          'api.method': method,
          'error.type': 'network',
        },
      });
      throw error;
    }
  };

  console.log('[API Error Tracker] Global error tracking enabled');
}
