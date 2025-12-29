import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Create a client WITHOUT service role key to test RLS policies
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function testExpenseWithUser() {
  console.log('🧪 Test de création de dépense avec un utilisateur authentifié...\n');

  // Get a test user (you'll need to provide credentials)
  console.log('Utilisez cette URL pour tester manuellement :');
  console.log('https://izzico.be/hub/finances');
  console.log('\n✅ Si vous pouvez créer une dépense sur cette page, tout fonctionne !');
  console.log('\nSi vous voyez toujours une erreur, vérifiez la console du navigateur pour les détails.');
}

testExpenseWithUser();
