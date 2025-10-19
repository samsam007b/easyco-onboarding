// lib/analytics.ts
/**
 * Petit stub d'analytics.
 * Tu pourras le brancher plus tard sur Plausible/GA/Segment…
 */
export function track(
  event: string,
  props?: Record<string, unknown>
): void {
  try {
    if (typeof window !== 'undefined') {
      // Remplace par ton vrai SDK analytics si besoin
      // Exemple: plausible(event, { props })
      console.debug('[track]', event, props ?? {});
    }
  } catch {
    // pas d'échec bloquant
  }
}
