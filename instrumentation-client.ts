import * as Sentry from '@sentry/nextjs'

// Export for router transition tracking (required by Sentry for App Router navigation)
// NOTE: Sentry initialization is handled in sentry.client.config.ts
// Do NOT call Sentry.init() here to avoid "Multiple Sentry Session Replay instances" error
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
