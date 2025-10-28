/**
 * Centralized logging utility
 *
 * This logger provides structured logging with different levels,
 * automatic context capture, and integration with monitoring services.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
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
   * Send log to external monitoring service (Sentry, etc.)
   */
  private async sendToMonitoring(level: LogLevel, message: string, context?: LogContext) {
    if (!this.isProduction) return;

    try {
      // TODO: Integrate with Sentry or other monitoring service
      // For now, just console in production
      if (level === 'error') {
        // Sentry.captureMessage(message, { level: 'error', extra: context });
      }
    } catch (error) {
      // Fail silently - don't let logging errors break the app
    }
  }

  /**
   * Debug log - only in development
   */
  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.debug(this.format('debug', message, context));
    }
  }

  /**
   * Info log - general information
   */
  info(message: string, context?: LogContext) {
    console.info(this.format('info', message, context));
  }

  /**
   * Warning log - something unexpected but not breaking
   */
  warn(message: string, context?: LogContext) {
    console.warn(this.format('warn', message, context));
    this.sendToMonitoring('warn', message, context);
  }

  /**
   * Error log - something went wrong
   */
  error(message: string, error?: Error | any, context?: LogContext) {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    };

    console.error(this.format('error', message, errorContext));
    this.sendToMonitoring('error', message, errorContext);
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
