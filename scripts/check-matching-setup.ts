import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function checkMatchingSetup() {
  console.log('🔍 Checking Matching System Setup\n');

  // 1. Check properties
  const { data: properties, error: propError } = await supabase
    .from('properties')
    .select('id, title, monthly_rent, city, bedrooms, bathrooms, status, furnished, pets_allowed, smoking_allowed')
    .eq('status', 'published')
    .limit(5);

  console.log('📦 PROPERTIES:');
  console.log(`   Total published: ${properties?.length || 0}`);
  if (properties && properties.length > 0) {
    console.log('   Sample property:');
    console.log(JSON.stringify(properties[0], null, 4));
  } else {
    console.log('   ⚠️  NO PUBLISHED PROPERTIES FOUND!');
  }

  // 2. Check searchers
  const { data: searchers } = await supabase
    .from('users')
    .select('id, user_type, full_name')
    .eq('user_type', 'searcher')
    .limit(5);

  console.log('\n👥 SEARCHERS:');
  console.log(`   Total: ${searchers?.length || 0}`);

  if (searchers && searchers.length > 0) {
    // Check first searcher's profile
    const searcherId = searchers[0].id;
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', searcherId)
      .single();

    console.log(`   Sample searcher: ${searchers[0].full_name}`);
    console.log('   Profile data:');

    if (profile) {
      console.log(`      - min_budget: ${profile.min_budget || profile.budget_min || 'NOT SET'}`);
      console.log(`      - max_budget: ${profile.max_budget || profile.budget_max || 'NOT SET'}`);
      console.log(`      - preferred_cities: ${JSON.stringify(profile.preferred_cities || 'NOT SET')}`);
      console.log(`      - min_bedrooms: ${profile.min_bedrooms || 'NOT SET'}`);
      console.log(`      - smoking: ${profile.smoking !== undefined ? profile.smoking : 'NOT SET'}`);
      console.log(`      - pets: ${profile.pets !== undefined ? profile.pets : 'NOT SET'}`);
    } else {
      console.log('      ⚠️  NO PROFILE DATA!');
    }
  } else {
    console.log('   ⚠️  NO SEARCHERS FOUND!');
  }

  // 3. Check if BrowseContent is using searcherProfile correctly
  console.log('\n🧪 MATCHING ALGORITHM CHECK:');

  if (properties && properties.length > 0 && searchers && searchers.length > 0) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', searchers[0].id)
      .single();

    if (profile && (profile.min_budget || profile.budget_min)) {
      console.log('   ✅ Searcher has budget preferences');
      console.log(`      Budget range: ${profile.min_budget || profile.budget_min}-${profile.max_budget || profile.budget_max}€`);

      const property = properties[0];
      const inBudget = property.monthly_rent >= (profile.min_budget || profile.budget_min) &&
                      property.monthly_rent <= (profile.max_budget || profile.budget_max);

      console.log(`   Property price: ${property.monthly_rent}€`);
      console.log(`   ${inBudget ? '✅' : '❌'} Property ${inBudget ? 'IS' : 'IS NOT'} in budget`);
    } else {
      console.log('   ⚠️  Searcher has NO budget preferences set');
    }
  }

  // 4. Summary
  console.log('\n📊 SUMMARY:');
  const hasProperties = (properties?.length || 0) > 0;
  const hasSearchers = (searchers?.length || 0) > 0;

  if (hasProperties && hasSearchers) {
    console.log('   ✅ System has both properties and searchers');
    console.log('\n💡 NEXT STEPS:');
    console.log('   1. Check browser console logs when viewing dashboard');
    console.log('   2. Look for "🏠 PropertyCard calculating match" logs');
    console.log('   3. Verify searcherProfile is being passed to PropertyCard');
    console.log('   4. Check if showCompatibilityScore is true');
  } else {
    console.log('   ❌ Missing data:');
    if (!hasProperties) console.log('      - No published properties');
    if (!hasSearchers) console.log('      - No searchers');
  }
}

checkMatchingSetup().catch(console.error);
