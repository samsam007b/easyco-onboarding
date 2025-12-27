/**
 * STRIPE CHECKOUT HOOK
 *
 * Custom React hook for initiating Stripe Checkout sessions
 * Handles the full flow: create session → redirect to Stripe
 */

import { useState } from 'react';

export type SubscriptionPlan = 'owner_monthly' | 'owner_annual' | 'resident_monthly' | 'resident_annual';

interface UseStripeCheckoutReturn {
  startCheckout: (plan: SubscriptionPlan) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useStripeCheckout(): UseStripeCheckoutReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async (plan: SubscriptionPlan) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call our API to create a Stripe Checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred');
      setIsLoading(false);
    }
  };

  return {
    startCheckout,
    isLoading,
    error,
  };
}
