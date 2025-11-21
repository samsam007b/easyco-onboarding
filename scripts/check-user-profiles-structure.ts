import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function checkStructure() {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .limit(2);

  if (error) {
    console.error('❌ Error:', error.message);
  } else {
    console.log('📊 Sample user_profiles structure:');
    console.log(JSON.stringify(data, null, 2));
  }
}

checkStructure().catch(console.error);
