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

// Initialize Supabase with service role (needed for webhook context)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
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
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
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
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
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
    console.error('No supabase_user_id in session metadata');
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
    console.error('No supabase_user_id in subscription metadata');
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

  // Get the price ID from the first subscription item
  const priceId = subscription.items.data[0]?.price.id;

  // Update subscription in database
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status,
      plan: plan || 'owner_monthly', // fallback to default plan
      stripe_customer_id: subscription.customer as string,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }

  console.log(`Subscription updated for user ${userId}: ${subscription.id}`);
}

/**
 * Handle customer.subscription.deleted
 * Mark subscription as cancelled when deleted
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.supabase_user_id;

  if (!userId) {
    console.error('No supabase_user_id in subscription metadata');
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
    console.error('Error cancelling subscription:', error);
    throw error;
  }

  console.log(`Subscription cancelled for user ${userId}: ${subscription.id}`);
}

/**
 * Handle invoice.payment_succeeded
 * Update subscription status when payment succeeds
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription;

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
  const subscriptionId = invoice.subscription;

  if (!subscriptionId || typeof subscriptionId !== 'string') {
    return;
  }

  // Get subscription to update status
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata?.supabase_user_id;

  if (!userId) {
    console.error('No supabase_user_id in subscription metadata');
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
    console.error('Error updating subscription to past_due:', error);
    throw error;
  }

  console.log(`Subscription marked as past_due for user ${userId}: ${subscriptionId}`);
}
