/**
 * STRIPE CUSTOMER PORTAL SESSION API ROUTE
 *
 * Creates a Stripe Customer Portal session for managing subscriptions
 * (cancel, upgrade, update payment method, view invoices)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { stripe } from '@/lib/stripe';
import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';

export async function POST(request: NextRequest) {
  const lang = getApiLanguage(request);

  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: apiT('common.unauthorized', lang) },
        { status: 401 }
      );
    }

    // Get user's Stripe customer ID
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: apiT('stripe.noStripeCustomer', lang) },
        { status: 400 }
      );
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${request.nextUrl.origin}/dashboard/settings/subscription`,
    });

    return NextResponse.json({
      url: session.url,
    });

  } catch (error: any) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: error.message || apiT('common.internalServerError', lang) },
      { status: 500 }
    );
  }
}
