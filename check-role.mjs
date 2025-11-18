import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const profileId = '3eeb7732-6695-4b48-b9b1-05b1a4dc753a';

// Check each role table
const { data: resident } = await supabase.from('resident_profiles').select('profile_id').eq('profile_id', profileId);
const { data: owner } = await supabase.from('owner_profiles').select('profile_id').eq('profile_id', profileId);
const { data: searcher } = await supabase.from('searcher_profiles').select('profile_id').eq('profile_id', profileId);

console.log('🔍 Checking role for profile:', profileId);
console.log('');
console.log('Is Resident:', resident && resident.length > 0 ? '✅ YES' : '❌ NO');
console.log('Is Owner:', owner && owner.length > 0 ? '✅ YES' : '❌ NO');
console.log('Is Searcher:', searcher && searcher.length > 0 ? '✅ YES' : '❌ NO');
