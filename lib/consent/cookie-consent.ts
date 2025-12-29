/**
 * Cookie Consent Management System
 *
 * Implements GDPR/RGPD compliant cookie consent management.
 * Users must explicitly consent before any non-essential cookies are set.
 *
 * Features:
 * - Granular consent (necessary, analytics, marketing)
 * - Persistent storage in localStorage
 * - Easy integration with analytics providers
 * - Consent withdrawal support
 */

export interface CookieConsent {
  necessary: boolean; // Always true, can't be disabled
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
  version: string; // Track consent policy version
}

const CONSENT_STORAGE_KEY = 'izzico_cookie_consent';
const CONSENT_VERSION = '1.0'; // Increment when privacy policy changes

/**
 * Get the current consent state from localStorage
 */
export function getConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;

    const consent = JSON.parse(stored) as CookieConsent;

    // If consent version changed, invalidate old consent
    if (consent.version !== CONSENT_VERSION) {
      return null;
    }

    return consent;
  } catch (error) {
    console.error('Error reading cookie consent:', error);
    return null;
  }
}

/**
 * Save consent preferences to localStorage
 */
export function saveConsent(preferences: Omit<CookieConsent, 'timestamp' | 'version'>): void {
  if (typeof window === 'undefined') return;

  const consent: CookieConsent = {
    ...preferences,
    necessary: true, // Always required
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));

    // Trigger custom event so components can react to consent changes
    window.dispatchEvent(new CustomEvent('consentChanged', { detail: consent }));
  } catch (error) {
    console.error('Error saving cookie consent:', error);
  }
}

/**
 * Check if user has given consent for a specific category
 */
export function hasConsent(category: keyof CookieConsent): boolean {
  if (typeof window === 'undefined') return false;

  const consent = getConsent();
  if (!consent) return false;

  return consent[category] === true;
}

/**
 * Check if user has responded to consent banner
 */
export function hasConsentResponse(): boolean {
  return getConsent() !== null;
}

/**
 * Accept all cookies
 */
export function acceptAll(): void {
  saveConsent({
    necessary: true,
    analytics: true,
    marketing: true,
  });
}

/**
 * Reject all non-essential cookies
 */
export function rejectAll(): void {
  saveConsent({
    necessary: true,
    analytics: false,
    marketing: false,
  });
}

/**
 * Clear all consent (for testing or privacy reset)
 */
export function clearConsent(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('consentChanged', { detail: null }));
  } catch (error) {
    console.error('Error clearing cookie consent:', error);
  }
}

/**
 * Get consent status for analytics providers
 * Returns true only if user has explicitly consented to analytics
 */
export function canUseAnalytics(): boolean {
  return hasConsent('analytics');
}

/**
 * Get consent status for marketing/advertising
 */
export function canUseMarketing(): boolean {
  return hasConsent('marketing');
}
