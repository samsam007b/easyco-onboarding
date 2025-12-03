import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function checkMatchingTables() {
  console.log('🔍 Checking tables used for matching data\n');

  // Check user_matching_profiles
  const { data: matchingProfiles } = await supabase
    .from('user_matching_profiles')
    .select('user_id, min_budget, max_budget, preferred_city')
    .limit(3);

  console.log('📊 user_matching_profiles table:');
  console.log('   Records:', matchingProfiles?.length || 0);
  if (matchingProfiles && matchingProfiles.length > 0) {
    console.log('   Sample:', JSON.stringify(matchingProfiles[0], null, 2));
  }

  // Check user_profiles
  const { data: userProfiles } = await supabase
    .from('user_profiles')
    .select('user_id, min_budget, max_budget, budget_min, budget_max, preferred_cities')
    .limit(3);

  console.log('\n📊 user_profiles table:');
  console.log('   Records:', userProfiles?.length || 0);
  if (userProfiles && userProfiles.length > 0) {
    console.log('   Sample:', JSON.stringify(userProfiles[0], null, 2));
  }

  // Check if same user has data in both
  if (matchingProfiles && userProfiles) {
    const matchingIds = new Set(matchingProfiles.map(p => p.user_id));
    const profileIds = new Set(userProfiles.map(p => p.user_id));
    const overlap = [...matchingIds].filter(id => profileIds.has(id));

    console.log('\n🔄 Data overlap:');
    console.log('   Users in both tables:', overlap.length);

    if (overlap.length > 0) {
      const userId = overlap[0];
      const mp = matchingProfiles.find(p => p.user_id === userId);
      const up = userProfiles.find(p => p.user_id === userId);

      console.log('\n   Comparison for user:', userId.substring(0, 8) + '...');
      console.log('   matching_profiles budget:', mp?.min_budget, '-', mp?.max_budget);
      console.log('   user_profiles budget:', up?.min_budget || up?.budget_min, '-', up?.max_budget || up?.budget_max);

      if (mp?.min_budget !== (up?.min_budget || up?.budget_min)) {
        console.log('   ⚠️  BUDGET DATA MISMATCH!');
      } else {
        console.log('   ✅ Budget data matches');
      }
    }
  }

  console.log('\n📋 CONCLUSION:');
  console.log('   - Onboarding saves to: user_matching_profiles');
  console.log('   - Matching algorithm reads from: user_profiles');
  console.log('   - Need to sync data OR update matching to read from user_matching_profiles');
}

checkMatchingTables().catch(console.error);
