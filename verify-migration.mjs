import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 Verifying migration results...\n');

// Check profiles table
console.log('📋 Checking profiles table...');
const { data: profiles, error: profilesError } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', '47959c9b-30c4-4cff-af0c-866679f5b651');

if (profilesError) {
  console.log('❌ Error:', profilesError.message);
} else {
  console.log(`✅ Found ${profiles?.length || 0} profile(s)`);
  if (profiles && profiles.length > 0) {
    console.log('   Profile:', JSON.stringify(profiles[0], null, 2));
  }
}

// Check resident_profiles
console.log('\n📋 Checking resident_profiles table...');
const { data: residents, error: residentsError } = await supabase
  .from('resident_profiles')
  .select('*');

if (residentsError) {
  console.log('❌ Error:', residentsError.message);
} else {
  console.log(`✅ Found ${residents?.length || 0} resident profile(s)`);
}

// Check owner_profiles
console.log('\n📋 Checking owner_profiles table...');
const { data: owners, error: ownersError } = await supabase
  .from('owner_profiles')
  .select('*');

if (ownersError) {
  console.log('❌ Error:', ownersError.message);
} else {
  console.log(`✅ Found ${owners?.length || 0} owner profile(s)`);
}

// Check searcher_profiles
console.log('\n📋 Checking searcher_profiles table...');
const { data: searchers, error: searchersError } = await supabase
  .from('searcher_profiles')
  .select('*');

if (searchersError) {
  console.log('❌ Error:', searchersError.message);
} else {
  console.log(`✅ Found ${searchers?.length || 0} searcher profile(s)`);
}

console.log('\n✅ Verification complete!');
