import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Test as ANONYMOUS user (like production)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function testAnonymousAccess() {
  console.log('🔍 Testing as ANONYMOUS user (production scenario)...\n');

  const { data, error, count } = await supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .limit(10);

  if (error) {
    console.error('❌ RLS Error for anonymous:', error.message);
    console.log('\n💡 This means anonymous users CANNOT see properties.');
    console.log('   The RLS policy needs to allow SELECT for anonymous users.');
    console.log('\n📋 Current error details:');
    console.log(JSON.stringify(error, null, 2));
  } else {
    console.log('✅ Anonymous access works!');
    console.log('📊 Count:', count);
    console.log('📝 Properties:', data?.length || 0);

    if (data && data.length > 0) {
      console.log('\n🏠 Properties visible to anonymous users:');
      data.forEach(p => {
        console.log(`  - ${p.title} (${p.city}) - €${p.monthly_rent}/mois`);
      });
    }
  }
}

testAnonymousAccess().catch(console.error);
