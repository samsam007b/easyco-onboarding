import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  // Check how many profiles we have
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Total profiles in database: ${count}`);

  // Get all profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .limit(20);

  console.log(`\nFirst ${profiles?.length || 0} profiles:`);
  profiles?.forEach((p: any, i: number) => {
    console.log(`${i + 1}. ${p.first_name} ${p.last_name} (${p.user_id})`);
  });
}

main().catch(console.error);
