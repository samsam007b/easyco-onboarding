/**
 * IZZICO MONITORING MIDDLEWARE
 *
 * Middleware pour capturer automatiquement toutes les requêtes
 * et les analyser pour la sécurité et la performance
 */

import { NextRequest, NextResponse } from 'next/server';
import { routeMonitor } from './route-monitor';
// import { securityMonitor } from './security-monitor'; // Disabled for closed beta
import { errorTracker } from './error-tracker';

/**
 * Wrapper middleware qui monitore automatiquement toutes les requêtes
 */
export async function withMonitoring(
  request: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const startTime = Date.now();
  const route = request.nextUrl.pathname;
  const method = request.method;

  // Extraire les informations de la requête
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
                    request.headers.get('x-real-ip') ||
                    'unknown';
  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';

  let response: NextResponse;
  let statusCode = 200;
  let errorOccurred = false;

  try {
    // Security analysis disabled for closed beta
    // TODO: Re-enable security monitoring in future version

    // Exécuter le handler
    response = await handler();
    statusCode = response.status;
    errorOccurred = statusCode >= 400;

    return response;
  } catch (error) {
    errorOccurred = true;
    statusCode = 500;

    // Capturer l'erreur
    await errorTracker.captureException(error as Error, {
      route,
      method,
      ipAddress,
    });

    throw error;
  } finally {
    const responseTime = Date.now() - startTime;

    // Tracker la requête
    await routeMonitor.trackRequest({
      route,
      method,
      responseTimeMs: responseTime,
      statusCode,
      ipAddress,
      userAgent,
      referer,
      errorOccurred,
    });

    // Enregistrer les métriques de performance
    if (typeof window === 'undefined') {
      // Côté serveur uniquement
      const { createClient } = await import('@/lib/auth/supabase-client');
      const supabase = createClient();

      await supabase.from('performance_metrics').insert({
        metric_type: 'api_latency',
        metric_name: `${method}_${route}`,
        metric_value: responseTime,
        unit: 'ms',
        route,
      });
    }
  }
}

/**
 * Helper pour wrapper facilement les route handlers Next.js
 */
export function monitoredRoute(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    return withMonitoring(request, () => handler(request, context));
  };
}
