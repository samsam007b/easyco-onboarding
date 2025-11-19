import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function testExpenseCreation() {
  console.log('🧪 Test d\'insertion d\'une dépense...\n');

  // 1. Récupérer un user_id et property_id de test
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('user_id')
    .limit(1)
    .single();

  console.log('User ID:', profile?.user_id);

  const { data: membership } = await supabase
    .from('property_members')
    .select('property_id, user_id')
    .limit(1)
    .single();

  console.log('Property ID:', membership?.property_id);
  console.log('Member User ID:', membership?.user_id);

  if (!membership?.property_id || !membership?.user_id) {
    console.log('❌ Pas de property membership trouvé pour le test');
    return;
  }

  // 2. Tenter d'insérer une dépense de test
  const testExpense = {
    property_id: membership.property_id,
    created_by: membership.user_id,
    paid_by_id: membership.user_id,
    title: 'Test expense',
    description: 'Test description',
    amount: 50.00,
    category: 'groceries',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
  };

  console.log('\n📝 Tentative d\'insertion:', JSON.stringify(testExpense, null, 2));

  const { data: expense, error: expenseError } = await supabase
    .from('expenses')
    .insert(testExpense)
    .select()
    .single();

  if (expenseError) {
    console.log('\n❌ ERREUR lors de l\'insertion de la dépense:');
    console.log('Code:', expenseError.code);
    console.log('Message:', expenseError.message);
    console.log('Details:', expenseError.details);
    console.log('Hint:', expenseError.hint);
    return;
  }

  console.log('\n✅ Dépense créée avec succès:', expense);

  // 3. Tenter de créer un split
  const testSplit = {
    expense_id: expense.id,
    user_id: membership.user_id,
    amount_owed: 50.00,
    paid: false,
  };

  console.log('\n📝 Tentative d\'insertion du split:', JSON.stringify(testSplit, null, 2));

  const { data: split, error: splitError } = await supabase
    .from('expense_splits')
    .insert(testSplit)
    .select()
    .single();

  if (splitError) {
    console.log('\n❌ ERREUR lors de l\'insertion du split:');
    console.log('Code:', splitError.code);
    console.log('Message:', splitError.message);
    console.log('Details:', splitError.details);
    console.log('Hint:', splitError.hint);
    return;
  }

  console.log('\n✅ Split créé avec succès:', split);
}

testExpenseCreation();
