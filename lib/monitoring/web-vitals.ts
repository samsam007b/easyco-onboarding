import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals'
import * as Sentry from '@sentry/nextjs'

/**
 * Web Vitals Monitoring
 * Tracks Core Web Vitals and reports them to:
 * - Sentry (real-time monitoring)
 * - Google Analytics (if configured)
 * - Our backend (for dashboard persistence)
 */

// ============================================================================
// TYPES
// ============================================================================

interface MetricEntry {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  id: string;
  timestamp: number;
  path: string;
  userAgent: string;
}

// ============================================================================
// BATCH BUFFER FOR PERSISTENCE
// ============================================================================

const BATCH_SIZE = 5;
const FLUSH_INTERVAL = 30000; // 30 seconds
const metricsBuffer: MetricEntry[] = [];
let flushTimeoutId: ReturnType<typeof setTimeout> | null = null;

/**
 * Flush buffered metrics to our backend
 */
async function flushMetrics() {
  if (metricsBuffer.length === 0) return;

  // Take a copy and clear the buffer
  const metricsToSend = [...metricsBuffer];
  metricsBuffer.length = 0;

  // Cancel any pending flush
  if (flushTimeoutId) {
    clearTimeout(flushTimeoutId);
    flushTimeoutId = null;
  }

  try {
    // Don't persist in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_PERSIST_DEV_METRICS) {
      console.log('[Web Vitals] Would send metrics:', metricsToSend);
      return;
    }

    await fetch('/api/performance/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metrics: metricsToSend }),
      // Use keepalive to ensure the request completes even if page unloads
      keepalive: true,
    });
  } catch (error) {
    // Silently fail - we don't want to impact user experience
    // Sentry will already have the metrics anyway
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Web Vitals] Failed to persist metrics:', error);
    }
  }
}

/**
 * Add metric to buffer and schedule flush
 */
function bufferMetric(metric: Metric) {
  if (typeof window === 'undefined') return;

  const entry: MetricEntry = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    id: metric.id,
    timestamp: Date.now(),
    path: window.location.pathname,
    userAgent: navigator.userAgent,
  };

  metricsBuffer.push(entry);

  // Flush if buffer is full
  if (metricsBuffer.length >= BATCH_SIZE) {
    flushMetrics();
  } else if (!flushTimeoutId) {
    // Schedule flush after interval
    flushTimeoutId = setTimeout(flushMetrics, FLUSH_INTERVAL);
  }
}

/**
 * Setup visibility change handler to flush on page hide
 */
function setupVisibilityHandler() {
  if (typeof document === 'undefined') return;

  // Use pagehide for reliable unload handling
  window.addEventListener('pagehide', () => {
    flushMetrics();
  });

  // Also flush when page becomes hidden (tab switch)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushMetrics();
    }
  });
}

// ============================================================================
// SENTRY REPORTING
// ============================================================================

/**
 * Report metric to Sentry
 */
function reportToSentry(metric: Metric) {
  const { name, value, id, rating } = metric

  // Don't report in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${name}: value=${Math.round(value)}, rating=${rating}, id=${id}`)
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

// ============================================================================
// GOOGLE ANALYTICS REPORTING
// ============================================================================

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

// ============================================================================
// MAIN HANDLER
// ============================================================================

/**
 * Main function to report Web Vitals to all destinations
 */
function sendToAnalytics(metric: Metric) {
  reportToSentry(metric)
  reportToAnalytics(metric)
  bufferMetric(metric) // Add to buffer for backend persistence
}

// ============================================================================
// INITIALIZATION
// ============================================================================

let isInitialized = false;

/**
 * Initialize Web Vitals monitoring
 * Call this in _app.tsx or layout.tsx
 */
export function initWebVitals() {
  // Prevent multiple initializations
  if (isInitialized) return;
  isInitialized = true;

  try {
    // Setup visibility handlers for reliable flushing
    setupVisibilityHandler();

    // Register Web Vitals observers
    onCLS(sendToAnalytics)
    onINP(sendToAnalytics) // Interaction to Next Paint (replaces FID in v5)
    onFCP(sendToAnalytics)
    onLCP(sendToAnalytics)
    onTTFB(sendToAnalytics)
  } catch (error) {
    // Silently fail in production, log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Web Vitals] Failed to initialize:', error)
    }
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

// ============================================================================
// UTILITY EXPORTS (for testing/debugging)
// ============================================================================

/**
 * Manually flush metrics (useful for testing)
 */
export function forceFlushMetrics() {
  return flushMetrics();
}

/**
 * Get current buffer size (useful for debugging)
 */
export function getBufferSize(): number {
  return metricsBuffer.length;
}
