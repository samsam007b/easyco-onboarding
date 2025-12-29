/**
 * STRIPE HELPER FUNCTIONS
 *
 * Utilities for Stripe integration
 */

import { stripe } from './stripe-server';
import { createClient } from '@/lib/auth/supabase-server';

/**
 * Map subscription plan to Stripe Price ID
 */
export function getPriceId(plan: string): string {
  const priceIds: Record<string, string> = {
    'owner_monthly': process.env.STRIPE_PRICE_OWNER_MONTHLY!,
    'owner_annual': process.env.STRIPE_PRICE_OWNER_ANNUAL!,
    'resident_monthly': process.env.STRIPE_PRICE_RESIDENT_MONTHLY!,
    'resident_annual': process.env.STRIPE_PRICE_RESIDENT_ANNUAL!,
  };

  const priceId = priceIds[plan];
  if (!priceId || priceId === 'price_xxx') {
    throw new Error(`Invalid or unconfigured plan: ${plan}. Please configure Stripe Price IDs in .env.local`);
  }

  return priceId;
}

/**
 * Get or create a Stripe Customer for a user
 * Returns the Stripe Customer ID
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<string> {
  const supabase = await createClient();

  // Check if user already has a Stripe customer ID
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single();

  if (subscription?.stripe_customer_id) {
    return subscription.stripe_customer_id;
  }

  // Create a new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      supabase_user_id: userId,
    },
  });

  // Save the customer ID to the database
  await supabase
    .from('subscriptions')
    .update({ stripe_customer_id: customer.id })
    .eq('user_id', userId);

  return customer.id;
}

/**
 * Get subscription display information
 */
export function getSubscriptionInfo(plan: string) {
  const info: Record<string, { name: string; price: string; interval: string }> = {
    'owner_monthly': {
      name: 'IZZICO Owner - Mensuel',
      price: '€15.99',
      interval: 'mois',
    },
    'owner_annual': {
      name: 'IZZICO Owner - Annuel',
      price: '€159.90',
      interval: 'an',
    },
    'resident_monthly': {
      name: 'IZZICO Resident - Mensuel',
      price: '€7.99',
      interval: 'mois',
    },
    'resident_annual': {
      name: 'IZZICO Resident - Annuel',
      price: '€79.90',
      interval: 'an',
    },
  };

  return info[plan] || {
    name: 'Unknown Plan',
    price: '€0',
    interval: 'month',
  };
}
