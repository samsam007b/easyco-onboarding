import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function testBrowseQuery() {
  console.log('🔍 Testing query from browse page...\n');

  // Test the exact same query as the browse page
  const { data, error, count } = await supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .limit(10);

  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ Query successful!');
    console.log('📊 Count:', count);
    console.log('📝 Properties returned:', data?.length || 0);

    if (data && data.length > 0) {
      console.log('\n🏠 Properties:');
      data.forEach(p => {
        console.log(`  - ${p.title} (${p.city}) - €${p.monthly_rent}/mois - Status: ${p.status}`);
        console.log(`    Owner: ${p.owner_id || 'N/A'}`);
        console.log(`    Available: ${p.is_available ? 'Yes' : 'No'}`);
      });
    } else {
      console.log('\n⚠️  No properties returned!');
      console.log('This might be a RLS (Row Level Security) issue.');
      console.log('\nLet me check with is_available filter too...');

      // Try with is_available = true
      const { data: data2, error: error2 } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'published')
        .eq('is_available', true)
        .limit(10);

      if (error2) {
        console.error('❌ Error with is_available filter:', error2);
      } else {
        console.log(`✅ With is_available=true: ${data2?.length || 0} properties`);
      }
    }
  }
}

testBrowseQuery().catch(console.error);
