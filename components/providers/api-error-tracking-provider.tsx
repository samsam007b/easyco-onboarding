'use client';

import { useEffect } from 'react';
import { setupGlobalErrorTracking } from '@/lib/monitoring/api-error-tracker';

/**
 * Provider that enables global API error tracking
 * Wraps fetch to capture all 4xx/5xx errors
 */
export function ApiErrorTrackingProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setupGlobalErrorTracking();
  }, []);

  return <>{children}</>;
}
