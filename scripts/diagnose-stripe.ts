/**
 * STRIPE DIAGNOSTIC SCRIPT
 * Run with: npx tsx scripts/diagnose-stripe.ts
 *
 * This script checks:
 * 1. If Stripe API keys are valid
 * 2. If the configured Price IDs exist
 * 3. Lists all available prices in your Stripe account
 */

import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

console.log('='.repeat(60));
console.log('🔍 STRIPE DIAGNOSTIC REPORT');
console.log('='.repeat(60));
console.log(`📅 Date: ${new Date().toISOString()}`);
console.log('');

// Check if API key is present
if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not found in .env.local');
  process.exit(1);
}

// Show API key prefix (for debugging which account)
const keyPrefix = STRIPE_SECRET_KEY.substring(0, 20) + '...';
const isTestMode = STRIPE_SECRET_KEY.startsWith('sk_test_');
console.log(`🔑 API Key: ${keyPrefix}`);
console.log(`🧪 Mode: ${isTestMode ? 'TEST' : 'LIVE'}`);
console.log('');

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia' as Stripe.LatestApiVersion,
});

// Price IDs from environment
const priceIds = {
  STRIPE_PRICE_OWNER_MONTHLY: process.env.STRIPE_PRICE_OWNER_MONTHLY,
  STRIPE_PRICE_OWNER_ANNUAL: process.env.STRIPE_PRICE_OWNER_ANNUAL,
  STRIPE_PRICE_RESIDENT_MONTHLY: process.env.STRIPE_PRICE_RESIDENT_MONTHLY,
  STRIPE_PRICE_RESIDENT_ANNUAL: process.env.STRIPE_PRICE_RESIDENT_ANNUAL,
};

async function runDiagnostic() {
  console.log('📋 CONFIGURED PRICE IDS:');
  console.log('-'.repeat(60));
  for (const [key, value] of Object.entries(priceIds)) {
    console.log(`  ${key}: ${value || '(not set)'}`);
  }
  console.log('');

  // Test API connection
  console.log('🔗 TESTING API CONNECTION:');
  console.log('-'.repeat(60));
  try {
    const balance = await stripe.balance.retrieve();
    console.log(`  ✅ API connection successful`);
    console.log(`  💰 Available balance: ${balance.available.map(b => `${b.amount / 100} ${b.currency.toUpperCase()}`).join(', ') || '0'}`);
  } catch (error: any) {
    console.log(`  ❌ API connection failed: ${error.message}`);
    process.exit(1);
  }
  console.log('');

  // Verify each Price ID
  console.log('🔍 VERIFYING PRICE IDS:');
  console.log('-'.repeat(60));

  const results: { key: string; priceId: string; valid: boolean; error?: string; product?: string }[] = [];

  for (const [key, priceId] of Object.entries(priceIds)) {
    if (!priceId) {
      results.push({ key, priceId: '(not set)', valid: false, error: 'Not configured' });
      continue;
    }

    try {
      const price = await stripe.prices.retrieve(priceId);
      const product = await stripe.products.retrieve(price.product as string);
      results.push({
        key,
        priceId,
        valid: true,
        product: product.name
      });
      console.log(`  ✅ ${key}`);
      console.log(`     Price: ${priceId}`);
      console.log(`     Product: ${product.name}`);
      console.log(`     Amount: ${(price.unit_amount || 0) / 100} ${price.currency.toUpperCase()}/${price.recurring?.interval || 'one-time'}`);
      console.log('');
    } catch (error: any) {
      results.push({
        key,
        priceId,
        valid: false,
        error: error.message
      });
      console.log(`  ❌ ${key}`);
      console.log(`     Price: ${priceId}`);
      console.log(`     Error: ${error.message}`);
      console.log('');
    }
  }

  // List all prices in account
  console.log('📦 ALL PRICES IN YOUR STRIPE ACCOUNT:');
  console.log('-'.repeat(60));

  try {
    const prices = await stripe.prices.list({
      limit: 50,
      active: true,
      expand: ['data.product']
    });

    if (prices.data.length === 0) {
      console.log('  ⚠️  No prices found in this Stripe account!');
      console.log('  💡 You need to create products and prices first.');
      console.log('     Run: npx tsx scripts/create-stripe-products.ts');
    } else {
      for (const price of prices.data) {
        const product = price.product as Stripe.Product;
        console.log(`  📍 ${price.id}`);
        console.log(`     Product: ${product.name}`);
        console.log(`     Amount: ${(price.unit_amount || 0) / 100} ${price.currency.toUpperCase()}/${price.recurring?.interval || 'one-time'}`);
        console.log('');
      }
    }
  } catch (error: any) {
    console.log(`  ❌ Failed to list prices: ${error.message}`);
  }

  // Summary
  console.log('='.repeat(60));
  console.log('📊 SUMMARY:');
  console.log('='.repeat(60));

  const validCount = results.filter(r => r.valid).length;
  const invalidCount = results.filter(r => !r.valid).length;

  console.log(`  ✅ Valid prices: ${validCount}/4`);
  console.log(`  ❌ Invalid prices: ${invalidCount}/4`);
  console.log('');

  if (invalidCount > 0) {
    console.log('🔧 RECOMMENDED ACTIONS:');
    console.log('-'.repeat(60));
    console.log('  1. Run: npx tsx scripts/create-stripe-products.ts');
    console.log('  2. Copy the new Price IDs to .env.local');
    console.log('  3. Update Vercel environment variables with the same Price IDs');
    console.log('  4. Redeploy to Vercel');
  } else {
    console.log('  🎉 All Price IDs are valid!');
    console.log('');
    console.log('  If checkout still fails, check:');
    console.log('  1. Vercel environment variables match .env.local');
    console.log('  2. Redeploy after updating env vars');
  }

  console.log('');
  console.log('='.repeat(60));
}

runDiagnostic()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Diagnostic failed:', error);
    process.exit(1);
  });
