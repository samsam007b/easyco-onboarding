/**
 * STRIPE SERVER CLIENT
 *
 * Stripe instance for server-side operations (API routes, webhooks)
 * NEVER expose this client to the frontend
 */

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
  appInfo: {
    name: 'EASYCO Onboarding',
    version: '1.0.0',
    url: 'https://easyco.be',
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
