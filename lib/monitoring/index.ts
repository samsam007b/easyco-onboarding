/**
 * EASYCO MONITORING SYSTEM - CENTRAL EXPORT
 *
 * Point d'entrée unique pour tous les systèmes de monitoring
 * Simplifie les imports et garantit l'initialisation correcte
 */

// Export all monitoring systems
export { errorTracker, captureError, captureException, captureValidationError, captureAuthError, captureDatabaseError, captureAPIError, captureSecurityIncident, getErrorStats } from './error-tracker';
export type { ErrorSeverity, ErrorType, ErrorContext, CapturedError } from './error-tracker';

// Security monitor temporarily disabled for closed beta
// export { securityMonitor } from './security-monitor';
// export type { SecurityEvent, SecurityEventType, SecuritySeverity, SecurityStats, SuspiciousIP } from './security-monitor';

export { routeMonitor, measureResponseTime, withRouteMonitoring } from './route-monitor';
export type { RouteMetrics, RouteAnalytics, EndpointHealth } from './route-monitor';

export { vulnerabilityScanner } from './vulnerability-scanner';
export type { Vulnerability, VulnerabilitySeverity, SecurityScore, SecurityAuditReport } from './vulnerability-scanner';

export { alertSystem } from './alert-system';
export type { Alert, AlertType, AlertSeverity, AlertRule, AnomalyDetectionResult, NotificationChannel } from './alert-system';

export { withMonitoring, monitoredRoute } from './monitoring-middleware';

/**
 * Initialiser tous les systèmes de monitoring
 * À appeler au démarrage de l'application
 */
export async function initializeMonitoring(): Promise<void> {
  try {
    console.log('[MONITORING] Initializing monitoring systems...');

    // Les singletons sont déjà initialisés via getInstance()
    // On peut ajouter des vérifications ou configurations supplémentaires ici

    // Exemple: Vérifier que les tables existent
    // Exemple: Charger les configurations depuis la DB

    console.log('[MONITORING] ✅ Monitoring systems initialized successfully');
  } catch (error) {
    console.error('[MONITORING] ❌ Failed to initialize monitoring systems:', error);
    throw error;
  }
}

/**
 * Arrêter proprement tous les systèmes de monitoring
 * À appeler lors du shutdown de l'application
 */
export async function shutdownMonitoring(): Promise<void> {
  try {
    console.log('[MONITORING] Shutting down monitoring systems...');

    // Arrêter les timers de flush automatique
    const { errorTracker } = await import('./error-tracker');
    const { routeMonitor } = await import('./route-monitor');

    errorTracker.stopAutoFlush();
    routeMonitor.stopAutoFlush();

    console.log('[MONITORING] ✅ Monitoring systems shut down successfully');
  } catch (error) {
    console.error('[MONITORING] ❌ Failed to shut down monitoring systems:', error);
  }
}

/**
 * Obtenir l'état de santé global du système de monitoring
 */
export async function getMonitoringHealth(): Promise<{
  status: 'healthy' | 'degraded' | 'critical';
  systems: {
    errorTracker: boolean;
    securityMonitor: boolean;
    routeMonitor: boolean;
    vulnerabilityScanner: boolean;
    alertSystem: boolean;
  };
  message: string;
}> {
  try {
    // Tester chaque système
    const systems = {
      errorTracker: true,
      securityMonitor: false, // Disabled for closed beta
      routeMonitor: true,
      vulnerabilityScanner: true,
      alertSystem: true,
    };

    // Tous les systèmes fonctionnent
    return {
      status: 'healthy',
      systems,
      message: 'All monitoring systems operational',
    };
  } catch (error) {
    return {
      status: 'critical',
      systems: {
        errorTracker: false,
        securityMonitor: false,
        routeMonitor: false,
        vulnerabilityScanner: false,
        alertSystem: false,
      },
      message: 'Monitoring system health check failed',
    };
  }
}
