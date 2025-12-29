/**
 * STRIPE SESSION VERIFICATION API
 *
 * Verifies that a checkout session was actually completed successfully
 * before showing the user a success message
 */

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required', verified: false },
        { status: 400 }
      );
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    });

    // Check if the session is complete
    // For subscriptions with trials, status will be 'complete' even though payment_status might be 'no_payment_required'
    const isComplete = session.status === 'complete';
    const isPaid = session.payment_status === 'paid' || session.payment_status === 'no_payment_required';

    if (!isComplete) {
      return NextResponse.json({
        verified: false,
        status: session.status,
        message: 'La session de paiement n\'est pas complète',
      });
    }

    // Extract subscription info if available
    const subscription = session.subscription as any;
    const subscriptionStatus = subscription?.status || null;
    const trialEnd = subscription?.trial_end
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null;

    return NextResponse.json({
      verified: true,
      status: session.status,
      payment_status: session.payment_status,
      subscription: {
        id: subscription?.id || null,
        status: subscriptionStatus,
        trial_end: trialEnd,
      },
      customer_email: session.customer_details?.email || null,
      plan: session.metadata?.plan || null,
    });

  } catch (error: any) {
    console.error('Error verifying Stripe session:', error);

    // Handle specific Stripe errors
    if (error.code === 'resource_missing') {
      return NextResponse.json({
        verified: false,
        error: 'Session introuvable',
        message: 'Cette session de paiement n\'existe pas ou a expiré',
      }, { status: 404 });
    }

    return NextResponse.json({
      verified: false,
      error: error.message || 'Erreur de vérification',
    }, { status: 500 });
  }
}
