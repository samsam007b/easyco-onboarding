/**
 * List all properties in the database
 * Usage: npx tsx scripts/list-all-properties.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listAllProperties() {
  console.log('🏠 Fetching all properties...\n');

  // Get all properties with owner info
  const { data: properties, error } = await supabase
    .from('properties')
    .select(`
      id,
      title,
      city,
      neighborhood,
      property_type,
      bedrooms,
      bathrooms,
      monthly_rent,
      charges,
      status,
      is_available,
      created_at,
      owner_id
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching properties:', error);
    process.exit(1);
  }

  if (!properties || properties.length === 0) {
    console.log('ℹ️  No properties found in database\n');
    console.log('💡 Run: npm run seed:demo');
    console.log('   to create demo properties\n');
    return;
  }

  console.log(`✅ Found ${properties.length} property(ies)\n`);
  console.log('═══════════════════════════════════════════════════════════════════\n');

  // Get owner emails
  const ownerIds = [...new Set(properties.map(p => p.owner_id))];
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('user_id, email, first_name, last_name')
    .in('user_id', ownerIds);

  const ownerMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

  for (const prop of properties) {
    const owner = ownerMap.get(prop.owner_id);
    const totalRent = prop.monthly_rent + (prop.charges || 0);
    const statusEmoji = prop.status === 'published' ? '✅' : '📝';
    const availEmoji = prop.is_available ? '🟢' : '🔴';

    console.log(`${statusEmoji} ${prop.title}`);
    console.log(`   📍 ${prop.city}${prop.neighborhood ? ` - ${prop.neighborhood}` : ''}`);
    console.log(`   🏠 Type: ${prop.property_type} | 🛏️  ${prop.bedrooms}ch | 🚿 ${prop.bathrooms} SDB`);
    console.log(`   💰 €${prop.monthly_rent}/mois + €${prop.charges || 0} charges = €${totalRent} total`);
    console.log(`   ${availEmoji} Status: ${prop.status} ${prop.is_available ? '(Available)' : '(Not Available)'}`);

    if (owner) {
      console.log(`   👤 Owner: ${owner.first_name} ${owner.last_name} (${owner.email})`);
    } else {
      console.log(`   👤 Owner ID: ${prop.owner_id}`);
    }

    console.log(`   🔗 ID: ${prop.id}`);
    console.log('   ─────────────────────────────────────────────────────────────\n');
  }

  console.log('═══════════════════════════════════════════════════════════════════\n');

  // Summary stats
  const published = properties.filter(p => p.status === 'published').length;
  const available = properties.filter(p => p.is_available).length;
  const avgRent = Math.round(properties.reduce((sum, p) => sum + p.monthly_rent, 0) / properties.length);

  console.log('📊 Summary:');
  console.log(`   Total: ${properties.length}`);
  console.log(`   Published: ${published}`);
  console.log(`   Available: ${available}`);
  console.log(`   Avg Rent: €${avgRent}/month`);
  console.log('\n');

  // Cities breakdown
  const citiesCount = properties.reduce((acc, p) => {
    acc[p.city] = (acc[p.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('🗺️  By City:');
  Object.entries(citiesCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([city, count]) => {
      console.log(`   ${city}: ${count}`);
    });

  console.log('\n');
}

listAllProperties();
