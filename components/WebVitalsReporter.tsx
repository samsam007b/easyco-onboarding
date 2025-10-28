'use client'

import { useEffect } from 'react'
import { initWebVitals } from '@/lib/monitoring/web-vitals'

/**
 * Web Vitals Reporter Component
 * Initializes Web Vitals tracking on mount
 */
export function WebVitalsReporter() {
  useEffect(() => {
    initWebVitals()
  }, [])

  return null
}
