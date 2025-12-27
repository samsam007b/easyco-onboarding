/**
 * EASYCO SECURITY MONITORING HOOK
 *
 * React hook pour capturer automatiquement les erreurs frontend
 * et envoyer des métriques de performance
 */

'use client';

import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { errorTracker } from '@/lib/monitoring/error-tracker';

export function useSecurityMonitoring() {
  const pathname = usePathname();

  useEffect(() => {
    // Capturer les erreurs globales
    const handleError = (event: ErrorEvent) => {
      errorTracker.captureException(event.error, {
        route: pathname,
        metadata: {
          source: 'window.error',
          lineno: event.lineno,
          colno: event.colno,
          filename: event.filename,
        },
      });
    };

    // Capturer les promesses rejetées
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      errorTracker.captureError(
        event.reason instanceof Error ? event.reason : String(event.reason),
        'exception',
        'high',
        {
          route: pathname,
          metadata: {
            source: 'unhandledrejection',
          },
        }
      );
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [pathname]);

  // Helper pour capturer manuellement des erreurs
  const captureError = useCallback(
    (error: Error | string, context?: Record<string, any>) => {
      errorTracker.captureException(
        error instanceof Error ? error : new Error(error),
        {
          route: pathname,
          metadata: context,
        }
      );
    },
    [pathname]
  );

  // Helper pour tracker un événement de sécurité
  const trackSecurityEvent = useCallback(
    async (eventType: string, description: string, severity: 'info' | 'warning' | 'critical' = 'info') => {
      // TODO: Implement security monitoring in future version
      console.log('[SECURITY EVENT]', { eventType, description, severity, route: pathname });
    },
    [pathname]
  );

  return {
    captureError,
    trackSecurityEvent,
  };
}
