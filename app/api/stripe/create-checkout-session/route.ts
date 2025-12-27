/**
 * STRIPE CHECKOUT SESSION API ROUTE
 *
 * Creates a Stripe Checkout session for upgrading from trial to paid subscription
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { stripe, getOrCreateStripeCustomer, getPriceId } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { plan } = body;

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan is required' },
        { status: 400 }
      );
    }

    // Validate plan format (owner_monthly, owner_annual, resident_monthly, resident_annual)
    const validPlans = ['owner_monthly', 'owner_annual', 'resident_monthly', 'resident_annual'];
    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Get user's email and full name
    const { data: userData } = await supabase
      .from('users')
      .select('email, first_name, last_name')
      .eq('id', user.id)
      .single();

    if (!userData?.email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const customerName = userData.first_name && userData.last_name
      ? `${userData.first_name} ${userData.last_name}`
      : undefined;

    const customerId = await getOrCreateStripeCustomer(
      user.id,
      userData.email,
      customerName
    );

    // Get Stripe Price ID for the plan
    const priceId = getPriceId(plan);

    // Determine redirect URL based on user type
    const isOwner = plan.startsWith('owner_');
    const dashboardUrl = isOwner ? '/dashboard/owner' : '/hub';

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}${dashboardUrl}?upgrade=success`,
      cancel_url: `${request.nextUrl.origin}${dashboardUrl}?upgrade=cancelled`,
      metadata: {
        supabase_user_id: user.id,
        plan: plan,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          plan: plan,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
