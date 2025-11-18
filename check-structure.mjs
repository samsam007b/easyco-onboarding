import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 Checking user_profiles structure...\n');

const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .limit(1);

if (error) {
  console.log('❌ Error:', error);
} else if (data && data.length > 0) {
  console.log('✅ Available columns in user_profiles:');
  console.log(Object.keys(data[0]).join(', '));
  console.log('\n📋 Sample data:');
  console.log(JSON.stringify(data[0], null, 2));
} else {
  console.log('⚠️ No data in user_profiles table');
}
