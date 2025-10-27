// lib/security/logger.ts

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  userId?: string;
  action?: string;
  ip?: string;
  [key: string]: any;
}

/**
 * Secure logger that only logs in development and sanitizes sensitive data
 */
class SecureLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isTest = process.env.NODE_ENV === 'test';

  /**
   * Sanitize sensitive data before logging
   */
  private sanitize(data: any): any {
    if (typeof data === 'string') {
      // Redact email addresses
      data = data.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '***@***.***');
      // Redact JWT tokens
      data = data.replace(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, 'JWT_REDACTED');
    }

    if (typeof data === 'object' && data !== null) {
      const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization', 'cookie'];
      const sanitized: any = Array.isArray(data) ? [] : {};

      for (const key in data) {
        const lowerKey = key.toLowerCase();
        if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
          sanitized[key] = '***REDACTED***';
        } else {
          sanitized[key] = this.sanitize(data[key]);
        }
      }
      return sanitized;
    }

    return data;
  }

  /**
   * Format log message with context
   */
  private format(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(this.sanitize(context))}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  /**
   * Log general information (development only)
   */
  log(message: string, ...args: any[]): void {
    if (this.isDevelopment && !this.isTest) {
      console.log(this.format('log', message), ...args.map(arg => this.sanitize(arg)));
    }
  }

  /**
   * Log informational messages (development only)
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment && !this.isTest) {
      console.info(this.format('info', message, context));
    }
  }

  /**
   * Log warnings (always logged)
   */
  warn(message: string, context?: LogContext): void {
    if (!this.isTest) {
      console.warn(this.format('warn', message, context));
    }
  }

  /**
   * Log errors (always logged, can be sent to error tracking service)
   */
  error(message: string, error?: Error, context?: LogContext): void {
    if (!this.isTest) {
      const errorContext = {
        ...context,
        error: error ? {
          message: error.message,
          stack: error.stack,
          name: error.name,
        } : undefined,
      };

      console.error(this.format('error', message, errorContext));

      // TODO: Send to error tracking service (Sentry, etc.)
      // if (process.env.NODE_ENV === 'production') {
      //   Sentry.captureException(error, { contexts: { custom: context } });
      // }
    }
  }

  /**
   * Log debug information (development only)
   */
  debug(message: string, data?: any): void {
    if (this.isDevelopment && !this.isTest) {
      console.debug(this.format('debug', message), this.sanitize(data));
    }
  }

  /**
   * Log security events (always logged and should be sent to security monitoring)
   */
  security(event: string, context: LogContext): void {
    const securityLog = this.format('warn', `[SECURITY] ${event}`, context);

    if (!this.isTest) {
      console.warn(securityLog);
    }

    // TODO: Send to security monitoring service
    // if (process.env.NODE_ENV === 'production') {
    //   // Send to SIEM, CloudWatch, Datadog, etc.
    // }
  }

  /**
   * Log audit events for compliance (always logged and stored)
   */
  audit(action: string, context: LogContext): void {
    const auditLog = {
      timestamp: new Date().toISOString(),
      action,
      ...this.sanitize(context),
    };

    if (!this.isTest) {
      console.info(`[AUDIT] ${JSON.stringify(auditLog)}`);
    }

    // TODO: Store in audit_logs table or send to compliance system
  }
}

// Export singleton instance
export const logger = new SecureLogger();

// Export types
export type { LogContext };
