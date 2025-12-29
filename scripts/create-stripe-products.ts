/**
 * Script to create Stripe products and prices for IzzIco
 * Run with: npx tsx scripts/create-stripe-products.ts
 */

import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not found in .env.local');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

interface ProductConfig {
  name: string;
  description: string;
  priceAmount: number; // in cents
  interval: 'month' | 'year';
  envKey: string;
}

const products: ProductConfig[] = [
  {
    name: 'IzzIco Owner - Mensuel',
    description: 'Abonnement mensuel pour propriétaires. Gestion multi-propriétés, matching avancé, messagerie illimitée.',
    priceAmount: 1599, // 15.99€
    interval: 'month',
    envKey: 'STRIPE_PRICE_OWNER_MONTHLY',
  },
  {
    name: 'IzzIco Owner - Annuel',
    description: 'Abonnement annuel pour propriétaires. Économisez 31,98€/an.',
    priceAmount: 15990, // 159.90€
    interval: 'year',
    envKey: 'STRIPE_PRICE_OWNER_ANNUAL',
  },
  {
    name: 'IzzIco Resident - Mensuel',
    description: 'Abonnement mensuel pour résidents. Profil vérifié, matching colocations, messagerie illimitée.',
    priceAmount: 799, // 7.99€
    interval: 'month',
    envKey: 'STRIPE_PRICE_RESIDENT_MONTHLY',
  },
  {
    name: 'IzzIco Resident - Annuel',
    description: 'Abonnement annuel pour résidents. Économisez 15,98€/an.',
    priceAmount: 7990, // 79.90€
    interval: 'year',
    envKey: 'STRIPE_PRICE_RESIDENT_ANNUAL',
  },
];

async function createProducts() {
  console.log('🚀 Creating Stripe products for IzzIco...\n');

  const results: { envKey: string; priceId: string }[] = [];

  for (const config of products) {
    try {
      // Create product
      const product = await stripe.products.create({
        name: config.name,
        description: config.description,
        metadata: {
          app: 'izzico',
          type: config.interval === 'month' ? 'monthly' : 'annual',
        },
      });

      console.log(`✅ Created product: ${product.name} (${product.id})`);

      // Create price
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: config.priceAmount,
        currency: 'eur',
        recurring: {
          interval: config.interval,
        },
        metadata: {
          app: 'izzico',
        },
      });

      console.log(`   └─ Price: ${config.priceAmount / 100}€/${config.interval} (${price.id})\n`);

      results.push({
        envKey: config.envKey,
        priceId: price.id,
      });
    } catch (error: any) {
      console.error(`❌ Error creating ${config.name}:`, error.message);
    }
  }

  // Output environment variables
  console.log('\n' + '='.repeat(60));
  console.log('📋 Add these to your .env.local file:\n');
  console.log('# Stripe Price IDs (created ' + new Date().toISOString().split('T')[0] + ')');
  for (const result of results) {
    console.log(`${result.envKey}=${result.priceId}`);
  }
  console.log('\n' + '='.repeat(60));

  return results;
}

createProducts()
  .then((results) => {
    console.log(`\n✨ Done! Created ${results.length} products.`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
