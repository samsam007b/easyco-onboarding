/**
 * Centralized logging utility
 *
 * This logger provides structured logging with different levels,
 * automatic context capture, and integration with Sentry.
 *
 * PRODUCTION: Logs are silent (no console output), errors go to Sentry
 * DEVELOPMENT: Full console logging for debugging
 */

import * as Sentry from '@sentry/nextjs'

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  /**
   * Format log message with timestamp and context
   */
  private format(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `\n${JSON.stringify(context, null, 2)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  /**
   * Send log to Sentry in production
   */
  private sendToSentry(level: LogLevel, message: string, error?: Error | unknown, context?: LogContext) {
    if (!this.isProduction) return;

    try {
      if (level === 'error' && error) {
        Sentry.captureException(error instanceof Error ? error : new Error(message), {
          extra: context,
        });
      } else if (level === 'warn') {
        Sentry.addBreadcrumb({
          category: 'warning',
          message,
          level: 'warning',
          data: context,
        });
      }
    } catch {
      // Fail silently - don't let logging errors break the app
    }
  }

  /**
   * Debug log - only in development, silent in production
   */
  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.debug(this.format('debug', message, context));
    }
    // Silent in production
  }

  /**
   * Info log - only in development, silent in production
   */
  info(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.info(this.format('info', message, context));
    }
    // Silent in production
  }

  /**
   * Warning log - development console + Sentry breadcrumb in production
   */
  warn(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.warn(this.format('warn', message, context));
    }
    this.sendToSentry('warn', message, undefined, context);
  }

  /**
   * Error log - development console + Sentry capture in production
   */
  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    };

    if (this.isDevelopment) {
      console.error(this.format('error', message, errorContext));
    }
    this.sendToSentry('error', message, error, errorContext);
  }

  /**
   * Log Supabase errors with structured context
   */
  supabaseError(operation: string, error: any, context?: LogContext) {
    this.error(`Supabase ${operation} failed`, error, {
      ...context,
      supabase: {
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
      },
    });
  }

  /**
   * Log API request/response
   */
  apiCall(method: string, url: string, status?: number, context?: LogContext) {
    const level = status && status >= 400 ? 'error' : 'info';
    const message = `API ${method} ${url} ${status ? `- ${status}` : ''}`;

    if (level === 'error') {
      this.error(message, undefined, context);
    } else {
      this.info(message, context);
    }
  }

  /**
   * Log user action for analytics
   */
  userAction(action: string, context?: LogContext) {
    this.info(`User action: ${action}`, context);

    // TODO: Send to analytics service
    // analytics.track(action, context);
  }

  /**
   * Log performance metric
   */
  performance(operation: string, durationMs: number, context?: LogContext) {
    const message = `${operation} took ${durationMs}ms`;

    if (durationMs > 3000) {
      this.warn(message, context);
    } else if (this.isDevelopment) {
      this.debug(message, context);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export helper for timing operations
export function withTiming<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  return fn().finally(() => {
    const duration = Date.now() - start;
    logger.performance(operation, duration);
  });
}
