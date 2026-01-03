/**
 * STRIPE EMBEDDED CHECKOUT API ROUTE
 *
 * Creates a Stripe Checkout session in embedded mode for custom UI
 * Returns a clientSecret for use with Stripe Elements
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { stripe, getOrCreateStripeCustomer, getPriceId } from '@/lib/stripe';
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

    // Parse request body
    const body = await request.json();
    const { plan } = body;

    if (!plan) {
      return NextResponse.json(
        { error: apiT('stripe.planRequired', lang) },
        { status: 400 }
      );
    }

    // Validate plan format
    const validPlans = ['owner_monthly', 'owner_annual', 'resident_monthly', 'resident_annual'];
    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { error: apiT('stripe.invalidPlan', lang) },
        { status: 400 }
      );
    }

    // Get user's email
    const userEmail = user.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: apiT('stripe.userEmailNotFound', lang) },
        { status: 400 }
      );
    }

    // Get user's full name from user_profiles
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('first_name, last_name')
      .eq('user_id', user.id)
      .single();

    // Get or create Stripe customer
    const customerName = profileData?.first_name && profileData?.last_name
      ? `${profileData.first_name} ${profileData.last_name}`
      : undefined;

    const customerId = await getOrCreateStripeCustomer(
      user.id,
      userEmail,
      customerName
    );

    // Get Stripe Price ID for the plan
    const priceId = getPriceId(plan);

    // Determine redirect URL based on user type
    const isOwner = plan.startsWith('owner_');
    const dashboardUrl = isOwner ? '/dashboard/owner' : '/hub';

    // Calculate trial days based on plan type
    // Owner plans: 3 months (90 days), Resident plans: 6 months (180 days)
    const trialDays = isOwner ? 90 : 180;

    // Create Embedded Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      ui_mode: 'embedded',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      return_url: `${request.nextUrl.origin}${dashboardUrl}?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        supabase_user_id: user.id,
        plan: plan,
      },
      subscription_data: {
        trial_period_days: trialDays,
        metadata: {
          supabase_user_id: user.id,
          plan: plan,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return NextResponse.json({
      clientSecret: session.client_secret,
    });

  } catch (error: any) {
    console.error('Error creating embedded checkout session:', error);
    return NextResponse.json(
      { error: error.message || apiT('common.internalServerError', lang) },
      { status: 500 }
    );
  }
}
