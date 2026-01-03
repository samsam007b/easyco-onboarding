/**
 * STRIPE WEBHOOK HANDLER
 *
 * Handles Stripe webhook events to keep subscription status in sync
 * IMPORTANT: This endpoint must be publicly accessible (no auth required)
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { logger } from '@/lib/security/logger';
import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';

// Initialize Supabase with service role (needed for webhook context)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const lang = getApiLanguage(request);
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: apiT('stripe.missingSignatureHeader', lang) },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    logger.security('Webhook signature verification failed', { error: err.message });
    return NextResponse.json(
      { error: `${apiT('stripe.webhookError', lang)}: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        logger.info(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    logger.error('Error processing Stripe webhook', error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: error.message || apiT('stripe.webhookError', lang) },
      { status: 500 }
    );
  }
}

/**
 * Handle checkout.session.completed
 * Called when a checkout session is successfully completed
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.supabase_user_id;
  const plan = session.metadata?.plan;

  if (!userId) {
    logger.warn('No supabase_user_id in session metadata', { sessionId: session.id });
    return;
  }

  // If subscription was created, get the subscription details
  if (session.subscription && typeof session.subscription === 'string') {
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    await handleSubscriptionUpdate(subscription);
  }
}

/**
 * Handle customer.subscription.created and customer.subscription.updated
 * Sync subscription data to our database
 */
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.supabase_user_id;
  const plan = subscription.metadata?.plan;

  if (!userId) {
    logger.warn('No supabase_user_id in subscription metadata', { subscriptionId: subscription.id });
    return;
  }

  // Determine subscription status
  let status: 'active' | 'past_due' | 'cancelled' | 'trial' = 'trial';
  if (subscription.status === 'active') {
    status = 'active';
  } else if (subscription.status === 'past_due') {
    status = 'past_due';
  } else if (subscription.status === 'canceled') {
    status = 'cancelled';
  }

  // Get the first subscription item (contains price and period info)
  const subscriptionItem = subscription.items.data[0];
  const priceId = subscriptionItem?.price.id;

  // Get period dates from subscription item (API 2025-12-15.clover structure)
  // Use type assertion for newer Stripe API structure
  const subData = subscription as unknown as {
    current_period_start?: number;
    current_period_end?: number;
    cancel_at_period_end: boolean;
    customer: string | Stripe.Customer | Stripe.DeletedCustomer;
    id: string;
  };

  // Period dates might be at subscription level or item level depending on API version
  const periodStart = subData.current_period_start
    || (subscriptionItem as unknown as { current_period_start?: number })?.current_period_start;
  const periodEnd = subData.current_period_end
    || (subscriptionItem as unknown as { current_period_end?: number })?.current_period_end;

  // Update subscription in database
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status,
      plan: plan || 'owner_monthly', // fallback to default plan
      stripe_customer_id: subscription.customer as string,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
    .eq('user_id', userId);

  if (error) {
    logger.error('Error updating subscription', error instanceof Error ? error : new Error(String(error)), { userId });
    throw error;
  }

  logger.audit('subscription_updated', { userId, subscriptionId: subscription.id });
}

/**
 * Handle customer.subscription.deleted
 * Mark subscription as cancelled when deleted
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.supabase_user_id;

  if (!userId) {
    logger.warn('No supabase_user_id in subscription metadata', { subscriptionId: subscription.id });
    return;
  }

  // Update subscription status to cancelled
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      stripe_subscription_id: subscription.id,
    })
    .eq('user_id', userId);

  if (error) {
    logger.error('Error cancelling subscription', error instanceof Error ? error : new Error(String(error)), { userId });
    throw error;
  }

  logger.audit('subscription_cancelled', { userId, subscriptionId: subscription.id });
}

/**
 * Handle invoice.payment_succeeded
 * Update subscription status when payment succeeds
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // Use type assertion for newer Stripe API structure
  const invoiceData = invoice as unknown as {
    subscription?: string | null;
  };
  const subscriptionId = invoiceData.subscription;

  if (!subscriptionId || typeof subscriptionId !== 'string') {
    return;
  }

  // Get subscription to update status
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await handleSubscriptionUpdate(subscription);
}

/**
 * Handle invoice.payment_failed
 * Update subscription status when payment fails
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  // Use type assertion for newer Stripe API structure
  const invoiceData = invoice as unknown as {
    subscription?: string | null;
  };
  const subscriptionId = invoiceData.subscription;

  if (!subscriptionId || typeof subscriptionId !== 'string') {
    return;
  }

  // Get subscription to update status
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata?.supabase_user_id;

  if (!userId) {
    logger.warn('No supabase_user_id in subscription metadata', { subscriptionId });
    return;
  }

  // Update subscription status to past_due
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'past_due',
    })
    .eq('user_id', userId);

  if (error) {
    logger.error('Error updating subscription to past_due', error instanceof Error ? error : new Error(String(error)), { userId });
    throw error;
  }

  logger.audit('subscription_past_due', { userId, subscriptionId });
}
