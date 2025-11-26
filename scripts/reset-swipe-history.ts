import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log('🔄 Resetting swipe history...\n');

  // Count existing swipes
  const { count: beforeCount } = await supabase
    .from('user_swipes')
    .select('*', { count: 'exact', head: true });

  console.log(`Found ${beforeCount || 0} swipe records to delete`);

  // Delete all swipes
  const { error } = await supabase
    .from('user_swipes')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

  if (error) {
    console.error('❌ Error deleting swipes:', error);
    process.exit(1);
  }

  console.log('✅ Successfully reset swipe history!\n');

  // Count profiles available
  const { count: profileCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  console.log(`📊 ${profileCount || 0} profiles available for swiping`);
  console.log('💡 Reload the swipe page to see all profiles again!\n');
}

main().catch(console.error);
