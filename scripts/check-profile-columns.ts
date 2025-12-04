import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function checkColumns() {
  const userId = 'b6e95df0-6e57-4201-aed7-30730bf29fd1';

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (data) {
    console.log('📋 All columns in user_profiles:');
    Object.keys(data).sort().forEach(key => {
      const value = data[key];
      if (value != null) {
        console.log('  ✅', key, '=', JSON.stringify(value).slice(0, 50));
      } else {
        console.log('  ⚪', key);
      }
    });
  }
}

checkColumns();
