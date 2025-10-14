// lib/analytics.ts
export function track(
  event: string,
  props?: Record<string, unknown>
) {
  try {
    if (typeof window !== 'undefined') {
      console.debug('[track]', event, props);
    }
  } catch {
    // no-op
  }
}
