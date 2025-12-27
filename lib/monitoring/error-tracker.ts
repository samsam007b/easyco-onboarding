/**
 * EASYCO ADVANCED ERROR TRACKING SYSTEM
 *
 * Système ultra-avancé de capture et analyse d'erreurs
 * Intégration avec Sentry + Base de données locale + Analytics
 */

import * as Sentry from '@sentry/nextjs';
import { createClient } from '@/lib/auth/supabase-client';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ErrorType = 'exception' | 'validation' | 'auth' | 'database' | 'api' | 'security';

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  route?: string;
  method?: string;
  statusCode?: number;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface CapturedError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  stackTrace?: string;
  errorCode?: string;
  context: ErrorContext;
}

class ErrorTracker {
  private static instance: ErrorTracker;
  private supabase = createClient();
  private errorQueue: CapturedError[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private readonly BATCH_SIZE = 10;
  private readonly FLUSH_INTERVAL = 5000; // 5 secondes

  private constructor() {
    // Démarrer le flush automatique
    this.startAutoFlush();
  }

  public static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  /**
   * Capturer une erreur avec contexte complet
   */
  public async captureError(
    error: Error | string,
    type: ErrorType,
    severity: ErrorSeverity,
    context: ErrorContext = {}
  ): Promise<void> {
    try {
      const errorMessage = typeof error === 'string' ? error : error.message;
      const stackTrace = typeof error === 'object' ? error.stack : undefined;

      // Enrichir le contexte avec des informations système
      const enrichedContext: ErrorContext = {
        ...context,
        userAgent: context.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : undefined),
        timestamp: new Date().toISOString(),
      };

      const capturedError: CapturedError = {
        type,
        severity,
        message: errorMessage,
        stackTrace,
        context: enrichedContext,
      };

      // Envoyer à Sentry
      if (typeof error === 'object') {
        Sentry.captureException(error, {
          level: this.mapSeverityToSentryLevel(severity),
          tags: {
            error_type: type,
            severity,
            route: context.route,
          },
          contexts: {
            custom: enrichedContext,
          },
        });
      } else {
        Sentry.captureMessage(errorMessage, {
          level: this.mapSeverityToSentryLevel(severity),
          tags: {
            error_type: type,
            severity,
          },
        });
      }

      // Ajouter à la queue pour insertion en base
      this.errorQueue.push(capturedError);

      // Flush immédiat si critique ou si la queue est pleine
      if (severity === 'critical' || this.errorQueue.length >= this.BATCH_SIZE) {
        await this.flush();
      }

      // Logger en console en développement
      if (process.env.NODE_ENV === 'development') {
        console.error(`[ERROR TRACKER] ${severity.toUpperCase()} - ${type}:`, errorMessage, enrichedContext);
      }
    } catch (trackingError) {
      // Ne pas laisser le système de tracking planter l'application
      console.error('[ERROR TRACKER] Failed to capture error:', trackingError);
    }
  }

  /**
   * Capturer une erreur d'exception générique
   */
  public async captureException(error: Error, context?: ErrorContext): Promise<void> {
    await this.captureError(error, 'exception', 'high', context);
  }

  /**
   * Capturer une erreur de validation
   */
  public async captureValidationError(message: string, context?: ErrorContext): Promise<void> {
    await this.captureError(message, 'validation', 'low', context);
  }

  /**
   * Capturer une erreur d'authentification
   */
  public async captureAuthError(message: string, context?: ErrorContext): Promise<void> {
    await this.captureError(message, 'auth', 'high', context);
  }

  /**
   * Capturer une erreur de base de données
   */
  public async captureDatabaseError(error: Error, context?: ErrorContext): Promise<void> {
    await this.captureError(error, 'database', 'high', context);
  }

  /**
   * Capturer une erreur API
   */
  public async captureAPIError(message: string, statusCode: number, context?: ErrorContext): Promise<void> {
    const severity = this.determineSeverityFromStatusCode(statusCode);
    await this.captureError(message, 'api', severity, {
      ...context,
      statusCode,
    });
  }

  /**
   * Capturer un incident de sécurité critique
   */
  public async captureSecurityIncident(message: string, context?: ErrorContext): Promise<void> {
    await this.captureError(message, 'security', 'critical', context);

    // Pour les incidents de sécurité, créer aussi un événement de sécurité
    try {
      await this.supabase.from('security_events').insert({
        event_type: 'security_incident',
        severity: 'critical',
        description: message,
        user_id: context?.userId,
        ip_address: context?.ipAddress,
        route: context?.route,
        method: context?.method,
        metadata: context?.metadata || {},
      });
    } catch (error) {
      console.error('[ERROR TRACKER] Failed to log security event:', error);
    }
  }

  /**
   * Flush la queue d'erreurs vers la base de données
   */
  private async flush(): Promise<void> {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      const formattedErrors = errors.map(error => ({
        error_type: error.type,
        severity: error.severity,
        message: error.message,
        stack_trace: error.stackTrace,
        error_code: error.errorCode,
        route: error.context.route,
        method: error.context.method,
        status_code: error.context.statusCode,
        user_id: error.context.userId,
        session_id: error.context.sessionId,
        ip_address: error.context.ipAddress,
        user_agent: error.context.userAgent,
        metadata: error.context.metadata || {},
      }));

      const { error: insertError } = await this.supabase
        .from('security_errors')
        .insert(formattedErrors);

      if (insertError) {
        console.error('[ERROR TRACKER] Failed to insert errors:', insertError);
        // Remettre les erreurs dans la queue
        this.errorQueue.unshift(...errors);
      }
    } catch (error) {
      console.error('[ERROR TRACKER] Flush failed:', error);
      // Remettre les erreurs dans la queue
      this.errorQueue.unshift(...errors);
    }
  }

  /**
   * Démarrer le flush automatique
   */
  private startAutoFlush(): void {
    this.flushInterval = setInterval(() => {
      this.flush();
    }, this.FLUSH_INTERVAL);
  }

  /**
   * Arrêter le flush automatique
   */
  public stopAutoFlush(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  /**
   * Mapper la sévérité vers le niveau Sentry
   */
  private mapSeverityToSentryLevel(severity: ErrorSeverity): Sentry.SeverityLevel {
    const mapping: Record<ErrorSeverity, Sentry.SeverityLevel> = {
      low: 'info',
      medium: 'warning',
      high: 'error',
      critical: 'fatal',
    };
    return mapping[severity];
  }

  /**
   * Déterminer la sévérité depuis un code HTTP
   */
  private determineSeverityFromStatusCode(statusCode: number): ErrorSeverity {
    if (statusCode >= 500) return 'critical';
    if (statusCode >= 400) return 'medium';
    return 'low';
  }

  /**
   * Obtenir les statistiques d'erreurs en temps réel
   */
  public async getErrorStats(timeWindow: string = '24 hours'): Promise<{
    total: number;
    bySeverity: Record<ErrorSeverity, number>;
    byType: Record<ErrorType, number>;
    recentErrors: any[];
  }> {
    try {
      const { data, error } = await this.supabase
        .from('security_errors')
        .select('*')
        .gte('created_at', new Date(Date.now() - this.parseTimeWindow(timeWindow)).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        bySeverity: {
          low: 0,
          medium: 0,
          high: 0,
          critical: 0,
        } as Record<ErrorSeverity, number>,
        byType: {
          exception: 0,
          validation: 0,
          auth: 0,
          database: 0,
          api: 0,
          security: 0,
        } as Record<ErrorType, number>,
        recentErrors: data?.slice(0, 10) || [],
      };

      data?.forEach((error: any) => {
        stats.bySeverity[error.severity as ErrorSeverity]++;
        stats.byType[error.error_type as ErrorType]++;
      });

      return stats;
    } catch (error) {
      console.error('[ERROR TRACKER] Failed to get stats:', error);
      return {
        total: 0,
        bySeverity: { low: 0, medium: 0, high: 0, critical: 0 },
        byType: { exception: 0, validation: 0, auth: 0, database: 0, api: 0, security: 0 },
        recentErrors: [],
      };
    }
  }

  /**
   * Parser une fenêtre de temps en millisecondes
   */
  private parseTimeWindow(timeWindow: string): number {
    const units: Record<string, number> = {
      hour: 60 * 60 * 1000,
      hours: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      weeks: 7 * 24 * 60 * 60 * 1000,
    };

    const match = timeWindow.match(/^(\d+)\s*(\w+)$/);
    if (!match) return 24 * 60 * 60 * 1000; // Default: 24 hours

    const [, amount, unit] = match;
    return parseInt(amount) * (units[unit] || units.hours);
  }
}

// Export singleton instance
export const errorTracker = ErrorTracker.getInstance();

// Export helper functions
export const captureError = (error: Error | string, type: ErrorType, severity: ErrorSeverity, context?: ErrorContext) =>
  errorTracker.captureError(error, type, severity, context);

export const captureException = (error: Error, context?: ErrorContext) =>
  errorTracker.captureException(error, context);

export const captureValidationError = (message: string, context?: ErrorContext) =>
  errorTracker.captureValidationError(message, context);

export const captureAuthError = (message: string, context?: ErrorContext) =>
  errorTracker.captureAuthError(message, context);

export const captureDatabaseError = (error: Error, context?: ErrorContext) =>
  errorTracker.captureDatabaseError(error, context);

export const captureAPIError = (message: string, statusCode: number, context?: ErrorContext) =>
  errorTracker.captureAPIError(message, statusCode, context);

export const captureSecurityIncident = (message: string, context?: ErrorContext) =>
  errorTracker.captureSecurityIncident(message, context);

export const getErrorStats = (timeWindow?: string) =>
  errorTracker.getErrorStats(timeWindow);
