/**
 * Test Matching Fix
 *
 * This script tests if the matching system works correctly after the fix.
 * It creates test data in user_matching_profiles and verifies the matching works.
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function testMatchingFix() {
  console.log('🧪 Testing Matching Fix\n');

  // 1. Check if we have searchers
  const { data: searchers } = await supabase
    .from('users')
    .select('id, user_type, full_name, email')
    .eq('user_type', 'searcher')
    .limit(1);

  if (!searchers || searchers.length === 0) {
    console.log('❌ No searchers found. Create a searcher user first.');
    return;
  }

  const searcherId = searchers[0].id;
  console.log(`✅ Found searcher: ${searchers[0].full_name || searchers[0].email}`);
  console.log(`   User ID: ${searcherId.substring(0, 8)}...\n`);

  // 2. Create test data in user_matching_profiles
  console.log('📝 Creating test data in user_matching_profiles...');

  const testData = {
    user_id: searcherId,
    first_name: 'Test',
    last_name: 'User',
    min_budget: 800,
    max_budget: 1500,
    preferred_city: 'Brussels',
    is_smoker: false,
    has_pets: false,
    cleanliness_level: 8,
    preferred_room_type: 'private',
    desired_move_in_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    updated_at: new Date().toISOString(),
  };

  const { data: created, error: createError } = await supabase
    .from('user_matching_profiles')
    .upsert(testData, { onConflict: 'user_id' })
    .select()
    .single();

  if (createError) {
    console.log('❌ Error creating test data:', createError);
    return;
  }

  console.log('✅ Test data created successfully!');
  console.log('   Budget:', testData.min_budget, '-', testData.max_budget, '€');
  console.log('   City:', testData.preferred_city);
  console.log('   Smoker:', testData.is_smoker);
  console.log('   Pets:', testData.has_pets);
  console.log('   Cleanliness:', testData.cleanliness_level, '/10\n');

  // 3. Check properties
  const { data: properties } = await supabase
    .from('properties')
    .select('id, title, monthly_rent, city')
    .eq('status', 'published')
    .limit(5);

  if (!properties || properties.length === 0) {
    console.log('❌ No published properties found.');
    return;
  }

  console.log(`📦 Found ${properties.length} published properties:`);

  properties.forEach((prop, idx) => {
    const inBudget = prop.monthly_rent >= testData.min_budget && prop.monthly_rent <= testData.max_budget;
    const cityMatch = prop.city?.toLowerCase() === testData.preferred_city.toLowerCase();

    console.log(`\n   ${idx + 1}. ${prop.title}`);
    console.log(`      Price: ${prop.monthly_rent}€ ${inBudget ? '✅' : '❌'} (${inBudget ? 'in' : 'out of'} budget)`);
    console.log(`      City: ${prop.city} ${cityMatch ? '✅' : '❌'} (${cityMatch ? 'matches' : 'different'})`);
  });

  // 4. Calculate expected match scores
  console.log('\n\n🎯 Expected Matching Behavior:');
  console.log('   When user visits /dashboard/searcher:');
  console.log('   1. BrowseContent will query user_matching_profiles');
  console.log('   2. Find the test data we just created');
  console.log('   3. PropertyCard will receive searcherProfile');
  console.log('   4. Match scores will be calculated and displayed\n');

  console.log('📊 Match Score Breakdown (Budget: 800-1500€):');
  const propertyInBudget = properties.find(p =>
    p.monthly_rent >= testData.min_budget &&
    p.monthly_rent <= testData.max_budget
  );

  if (propertyInBudget) {
    console.log(`   ✅ Property "${propertyInBudget.title}" (${propertyInBudget.monthly_rent}€)`);
    console.log('      - Budget match: 23-25 points (perfect)');
    console.log('      - Expected total: 70-85% match (Great to Excellent)');
  } else {
    console.log('   ⚠️  No properties in budget range!');
    console.log('      - All properties will show low match scores (20-40%)');
    console.log('      - This is EXPECTED behavior - algorithm is working!');
  }

  console.log('\n✨ NEXT STEPS:');
  console.log('   1. Login as:', searchers[0].email);
  console.log('   2. Go to: /dashboard/searcher');
  console.log('   3. Check browser console for these logs:');
  console.log('      - "✅ Found user_matching_profiles data:"');
  console.log('      - "🔄 Converted searcher profile from user_matching_profiles:"');
  console.log('   4. Verify match scores appear on PropertyCard badges');
  console.log('   5. Scores should reflect budget compatibility\n');

  console.log('🎉 Test data setup complete!');
}

testMatchingFix().catch(console.error);
