import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function checkMatchingScores() {
  console.log('🔍 Analyzing Matching Scores\n');

  // Récupérer un searcher profile
  const { data: searchers } = await supabase
    .from('users')
    .select('id, user_type, full_name')
    .eq('user_type', 'searcher')
    .limit(1);

  if (!searchers || searchers.length === 0) {
    console.log('❌ No searchers found');
    return;
  }

  const userId = searchers[0].id;
  console.log('👤 Searcher:', searchers[0].full_name);
  console.log('   ID:', userId);

  // Vérifier le profil
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!profile) {
    console.log('\n❌ No profile found for this searcher');
    return;
  }

  console.log('\n📊 Searcher Profile Data:');
  console.log('   Budget: min_budget =', profile.min_budget, '| budget_min =', profile.budget_min);
  console.log('          max_budget =', profile.max_budget, '| budget_max =', profile.budget_max);
  console.log('   Cities: preferred_cities =', profile.preferred_cities);
  console.log('          current_city =', profile.current_city);
  console.log('   Lifestyle: smoking =', profile.smoking, '| is_smoker =', profile.is_smoker);
  console.log('             pets =', profile.pets, '| has_pets =', profile.has_pets);
  console.log('             cleanliness =', profile.cleanliness_level);
  console.log('   Rooms: min_bedrooms =', profile.min_bedrooms);

  // Vérifier les propriétés
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'published')
    .limit(5);

  if (!properties || properties.length === 0) {
    console.log('\n❌ No published properties found');
    return;
  }

  console.log('\n🏠 Published Properties:');
  properties.forEach((p, i) => {
    console.log(`\n   Property ${i + 1}:`);
    console.log('     Title:', p.title);
    console.log('     Price:', p.monthly_rent, '€');
    console.log('     City:', p.city);
    console.log('     Bedrooms:', p.bedrooms);
    console.log('     Furnished:', p.furnished);
    console.log('     Smoking allowed:', p.smoking_allowed);
    console.log('     Pets allowed:', p.pets_allowed);
  });

  // Analyse du problème
  console.log('\n🔍 ANALYSIS:');

  const minBudget = profile.min_budget || profile.budget_min;
  const maxBudget = profile.max_budget || profile.budget_max;

  if (!minBudget || !maxBudget) {
    console.log('   ⚠️  PROBLEM: No budget preferences set!');
    console.log('   → Algorithm gives default scores when preferences are missing');
  } else {
    console.log(`   ✅ Budget set: ${minBudget}€ - ${maxBudget}€`);

    let inBudgetCount = 0;
    properties.forEach(p => {
      if (p.monthly_rent >= minBudget && p.monthly_rent <= maxBudget) {
        inBudgetCount++;
      }
    });

    console.log(`   → ${inBudgetCount}/${properties.length} properties in budget`);

    if (inBudgetCount === 0) {
      console.log('   ⚠️  WARNING: NO properties match the budget!');
      console.log('   → All properties get LOW budget scores');
      console.log('   → Default scores for other criteria make them similar');
    }
  }

  if (!profile.preferred_cities && !profile.current_city) {
    console.log('   ⚠️  No city preferences set');
    console.log('   → All properties get same location score');
  }

  if (profile.smoking === undefined && !profile.is_smoker) {
    console.log('   ⚠️  No smoking preference set');
  }

  if (profile.pets === undefined && !profile.has_pets) {
    console.log('   ⚠️  No pets preference set');
  }

  console.log('\n💡 REASON FOR SIMILAR SCORES:');
  console.log('   When user preferences are missing or properties don\'t match:');
  console.log('   - Algorithm gives DEFAULT scores for missing criteria');
  console.log('   - All properties get similar default scores');
  console.log('   - Result: 50-60% match for everything');

  console.log('\n✅ SOLUTION:');
  console.log('   1. Complete onboarding QUICK with real preferences');
  console.log('   2. Ensure properties have varied characteristics');
  console.log('   3. Match scores will then vary significantly');
}

checkMatchingScores().catch(console.error);
