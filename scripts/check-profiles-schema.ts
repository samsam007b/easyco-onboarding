import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1);

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Available columns:', Object.keys(data[0]).join(', '));
    console.log('\nSample profile structure:');
    console.log(JSON.stringify(data[0], null, 2));
  } else {
    console.log('No profiles found in database');
  }
}

main().catch(console.error);
