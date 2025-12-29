/**
 * STRIPE SERVER CLIENT
 *
 * Stripe instance for server-side operations (API routes, webhooks)
 * NEVER expose this client to the frontend
 */

import Stripe from 'stripe';

// Lazy initialization to avoid build-time errors when env vars aren't available
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
      appInfo: {
        name: 'EASYCO Onboarding',
        version: '1.0.0',
        url: 'https://easyco.be',
      },
    });
  }
  return _stripe;
}

// Export a proxy that lazily initializes and properly binds methods
export const stripe = new Proxy({} as Stripe, {
  get(_, prop: string | symbol) {
    const stripeInstance = getStripe();
    const value = (stripeInstance as any)[prop];
    // Bind functions to maintain proper 'this' context
    if (typeof value === 'function') {
      return value.bind(stripeInstance);
    }
    return value;
  },
});

/**
 * Helper pour formater les montants en centimes
 * Stripe utilise les centimes pour tous les montants
 */
export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Helper pour formater les montants depuis les centimes
 */
export function formatAmountFromStripe(amount: number): number {
  return amount / 100;
}
