/**
 * STRIPE CHECKOUT HOOK
 *
 * Custom React hook for initiating Stripe Checkout
 * Redirects to our custom embedded checkout page
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export type SubscriptionPlan = 'owner_monthly' | 'owner_annual' | 'resident_monthly' | 'resident_annual';

interface UseStripeCheckoutReturn {
  startCheckout: (plan: SubscriptionPlan) => void;
  isLoading: boolean;
  error: string | null;
}

export function useStripeCheckout(): UseStripeCheckoutReturn {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = (plan: SubscriptionPlan) => {
    setIsLoading(true);
    setError(null);

    // Redirect to our custom embedded checkout page
    router.push(`/checkout/${plan}`);
  };

  return {
    startCheckout,
    isLoading,
    error,
  };
}
