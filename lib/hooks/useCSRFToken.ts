/**
 * CSRF TOKEN HOOK (Client-Side)
 *
 * React hook to automatically include CSRF token in fetch requests
 * SECURITY: Protects against Cross-Site Request Forgery attacks
 *
 * Usage:
 *   const { fetchWithCSRF } = useCSRFToken();
 *
 *   await fetchWithCSRF('/api/endpoint', {
 *     method: 'POST',
 *     body: JSON.stringify(data),
 *   });
 */

'use client';

import { useCallback } from 'react';
import { getClientCSRFToken } from '@/lib/security/csrf';

export function useCSRFToken() {
  /**
   * Wrapper around fetch that automatically adds CSRF token
   */
  const fetchWithCSRF = useCallback(async (
    url: string | URL,
    init?: RequestInit
  ): Promise<Response> => {
    const token = getClientCSRFToken();

    const headers = new Headers(init?.headers);

    // Add CSRF token to headers for state-changing methods
    if (token && init?.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(init.method.toUpperCase())) {
      headers.set('X-CSRF-Token', token);
    }

    return fetch(url, {
      ...init,
      headers,
    });
  }, []);

  /**
   * Get current CSRF token (for manual use)
   */
  const getToken = useCallback((): string | null => {
    return getClientCSRFToken();
  }, []);

  return {
    fetchWithCSRF,
    getToken,
  };
}
