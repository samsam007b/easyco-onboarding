import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const userId = '47959c9b-30c4-4cff-af0c-866679f5b651';

console.log('🔍 Querying user_profiles for user_id:', userId);

const { data, error } = await supabase
  .from('user_profiles')
  .select()
  .eq('user_id', userId);

if (error) {
  console.log('❌ Error:', error);
} else {
  console.log('\n✅ Data returned:');
  console.log(JSON.stringify(data, null, 2));
  
  if (data && data.length > 0) {
    console.log('\n📋 Available fields:');
    console.log(Object.keys(data[0]).sort().join(', '));
    
    console.log('\n🔍 user_type field:');
    console.log('   Value:', data[0].user_type);
    console.log('   Type:', typeof data[0].user_type);
  }
}
