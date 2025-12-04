import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function listUsers() {
  const { data: { users } } = await supabase.auth.admin.listUsers();
  console.log('📧 Users found:', users.length);
  users.slice(0, 15).forEach(u => {
    console.log('   -', u.email, '(', u.id.substring(0, 8) + '...)');
  });
}

listUsers();
