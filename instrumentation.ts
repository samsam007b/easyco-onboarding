import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side Sentry configuration
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      debug: false,
      environment: process.env.NODE_ENV,
      release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
      ignoreErrors: [
        'ECONNREFUSED',
        'ETIMEDOUT',
      ],
      beforeSend(event) {
        if (process.env.NODE_ENV === 'development') {
          return null
        }
        return event
      },
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime Sentry configuration
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      debug: false,
      environment: process.env.NODE_ENV,
      release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    })
  }
}
