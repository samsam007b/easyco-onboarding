/**
 * STRIPE CLIENT-SIDE LOADER
 *
 * Loads the Stripe.js library for client-side operations
 * (payment forms, checkout redirection, etc.)
 */

'use client';

import { loadStripe, Stripe } from '@stripe/stripe-js';

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
}

let stripePromise: Promise<Stripe | null>;

/**
 * Get Stripe.js instance (singleton)
 * Automatically loads the library once and caches it
 */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
}
