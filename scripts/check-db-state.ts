import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('user_id, first_name, last_name, user_type, property_id')
    .limit(10);

  console.log('\n📋 Profiles:', JSON.stringify(profiles, null, 2));

  const { data: properties } = await supabase
    .from('properties')
    .select('id, name')
    .limit(5);

  console.log('\n🏠 Properties:', JSON.stringify(properties, null, 2));

  const { data: members } = await supabase
    .from('property_members')
    .select('*')
    .limit(10);

  console.log('\n👥 Property members:', JSON.stringify(members, null, 2));

  // Check if expenses table exists
  const { data: expenses, error: expensesError } = await supabase
    .from('expenses')
    .select('*')
    .limit(1);

  console.log('\n💰 Expenses table:', expensesError ? `❌ ${expensesError.message}` : `✅ Exists (${expenses?.length || 0} rows)`);

  const { data: expenseSplits, error: splitsError } = await supabase
    .from('expense_splits')
    .select('*')
    .limit(1);

  console.log('💸 Expense splits table:', splitsError ? `❌ ${splitsError.message}` : `✅ Exists (${expenseSplits?.length || 0} rows)\n`);
}

check();
