/**
 * DEBUG: Check Stripe configuration
 * Returns which env vars are set (without revealing values)
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    stripe: {
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        ? `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.substring(0, 12)}...`
        : 'NOT SET',
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
        ? `${process.env.STRIPE_SECRET_KEY.substring(0, 12)}...`
        : 'NOT SET',
      STRIPE_PRICE_OWNER_MONTHLY: process.env.STRIPE_PRICE_OWNER_MONTHLY
        ? `${process.env.STRIPE_PRICE_OWNER_MONTHLY.substring(0, 15)}...`
        : 'NOT SET',
      STRIPE_PRICE_OWNER_ANNUAL: process.env.STRIPE_PRICE_OWNER_ANNUAL
        ? `${process.env.STRIPE_PRICE_OWNER_ANNUAL.substring(0, 15)}...`
        : 'NOT SET',
      STRIPE_PRICE_RESIDENT_MONTHLY: process.env.STRIPE_PRICE_RESIDENT_MONTHLY
        ? `${process.env.STRIPE_PRICE_RESIDENT_MONTHLY.substring(0, 15)}...`
        : 'NOT SET',
      STRIPE_PRICE_RESIDENT_ANNUAL: process.env.STRIPE_PRICE_RESIDENT_ANNUAL
        ? `${process.env.STRIPE_PRICE_RESIDENT_ANNUAL.substring(0, 15)}...`
        : 'NOT SET',
    }
  };

  return NextResponse.json(config);
}
