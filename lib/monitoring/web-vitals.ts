import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals'
import * as Sentry from '@sentry/nextjs'

/**
 * Web Vitals Monitoring
 * Tracks Core Web Vitals and reports them to Sentry
 */

/**
 * Report metric to Sentry
 */
function reportToSentry(metric: Metric) {
  const { name, value, id, rating } = metric

  // Don't report in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${name}:`, {
      value: Math.round(value),
      rating,
      id,
    })
    return
  }

  // Report to Sentry as measurement
  Sentry.setMeasurement(name, value, 'millisecond')

  // Add context
  Sentry.setContext('web-vitals', {
    [name]: {
      value: Math.round(value),
      rating,
      id,
    },
  })

  // Report poor metrics as breadcrumbs
  if (rating === 'poor') {
    Sentry.addBreadcrumb({
      category: 'web-vitals',
      message: `Poor ${name} detected`,
      level: 'warning',
      data: {
        value: Math.round(value),
        id,
      },
    })
  }
}

/**
 * Report metric to Google Analytics (if configured)
 */
function reportToAnalytics(metric: Metric) {
  const { name, value, id, rating } = metric

  // Check if gtag is available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(value),
      non_interaction: true,
      metric_rating: rating,
    })
  }
}

/**
 * Main function to report Web Vitals
 */
function sendToAnalytics(metric: Metric) {
  reportToSentry(metric)
  reportToAnalytics(metric)
}

/**
 * Initialize Web Vitals monitoring
 * Call this in _app.tsx or layout.tsx
 */
export function initWebVitals() {
  try {
    onCLS(sendToAnalytics)
    onINP(sendToAnalytics) // Interaction to Next Paint (replaces FID in v5)
    onFCP(sendToAnalytics)
    onLCP(sendToAnalytics)
    onTTFB(sendToAnalytics)
  } catch (error) {
    console.error('Failed to initialize Web Vitals:', error)
  }
}

/**
 * Custom hook for Web Vitals in components
 */
export function useWebVitals() {
  if (typeof window !== 'undefined') {
    initWebVitals()
  }
}
