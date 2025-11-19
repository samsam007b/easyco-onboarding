import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function diagnoseExpenseIssue() {
  console.log('🔍 DIAGNOSTIC COMPLET - Création de dépense\n');
  console.log('='.repeat(60));

  // 1. Vérifier que les tables existent
  console.log('\n1️⃣ Vérification des tables...\n');

  const tables = ['expenses', 'expense_splits', 'property_members'];
  for (const table of tables) {
    const { data, error } = await supabaseAdmin
      .from(table)
      .select('*')
      .limit(1);

    if (error) {
      console.log(`❌ Table "${table}": ERREUR - ${error.message}`);
    } else {
      console.log(`✅ Table "${table}": OK`);
    }
  }

  // 2. Vérifier les RLS policies
  console.log('\n2️⃣ Vérification des RLS policies...\n');

  const { data: policiesData, error: policiesError } = await supabaseAdmin
    .rpc('exec_sql', {
      sql: `
        SELECT
          tablename,
          policyname,
          cmd,
          CASE WHEN qual IS NOT NULL THEN 'USING' ELSE '' END as has_using,
          CASE WHEN with_check IS NOT NULL THEN 'WITH CHECK' ELSE '' END as has_check
        FROM pg_policies
        WHERE tablename IN ('expenses', 'expense_splits', 'property_members')
        ORDER BY tablename, policyname;
      `
    });

  if (policiesError) {
    console.log('⚠️  Impossible de vérifier les policies via RPC, utilisation alternative...\n');

    // Alternative: Vérifier si RLS est activé
    const { data: rlsStatus } = await supabaseAdmin
      .rpc('exec_sql', {
        sql: `
          SELECT
            schemaname,
            tablename,
            rowsecurity
          FROM pg_tables
          WHERE tablename IN ('expenses', 'expense_splits', 'property_members')
            AND schemaname = 'public';
        `
      });

    if (rlsStatus) {
      console.log('Status RLS:', JSON.stringify(rlsStatus, null, 2));
    }
  } else {
    console.log('Policies trouvées:');
    console.log(JSON.stringify(policiesData, null, 2));
  }

  // 3. Récupérer un utilisateur de test
  console.log('\n3️⃣ Récupération d\'un utilisateur de test...\n');

  const { data: membership, error: memberError } = await supabaseAdmin
    .from('property_members')
    .select('property_id, user_id, status')
    .eq('status', 'active')
    .limit(1)
    .single();

  if (memberError || !membership) {
    console.log('❌ Pas de membership actif trouvé:', memberError?.message);
    console.log('\n⚠️  PROBLÈME: Aucun utilisateur n\'a de membership actif!');
    console.log('   Solution: Créer un membership actif pour votre utilisateur');
    return;
  }

  console.log(`✅ Membership trouvé:`);
  console.log(`   User ID: ${membership.user_id}`);
  console.log(`   Property ID: ${membership.property_id}`);
  console.log(`   Status: ${membership.status}`);

  // 4. Simuler l'insertion comme le fait le frontend
  console.log('\n4️⃣ Test d\'insertion (simulant le frontend)...\n');

  const testExpense = {
    property_id: membership.property_id,
    created_by: membership.user_id,
    paid_by_id: membership.user_id,
    title: 'Test Diagnostic',
    description: 'Test pour diagnostic',
    amount: 25.00,
    category: 'groceries',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
  };

  console.log('Données de test:', JSON.stringify(testExpense, null, 2));

  // Test avec service role (devrait fonctionner)
  console.log('\n   a) Test avec Service Role Key (bypass RLS)...');
  const { data: expenseAdmin, error: errorAdmin } = await supabaseAdmin
    .from('expenses')
    .insert(testExpense)
    .select()
    .single();

  if (errorAdmin) {
    console.log(`   ❌ ERREUR avec Service Role:`, errorAdmin);
  } else {
    console.log(`   ✅ OK avec Service Role - ID: ${expenseAdmin.id}`);

    // Test du split
    const { error: splitErrorAdmin } = await supabaseAdmin
      .from('expense_splits')
      .insert({
        expense_id: expenseAdmin.id,
        user_id: membership.user_id,
        amount_owed: 25.00,
        paid: false,
      });

    if (splitErrorAdmin) {
      console.log(`   ❌ ERREUR split avec Service Role:`, splitErrorAdmin);
    } else {
      console.log(`   ✅ OK split avec Service Role`);
    }
  }

  // 5. Vérifier l'auth du user
  console.log('\n5️⃣ Vérification de l\'authentification...\n');

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();

  if (authError) {
    console.log('❌ Impossible de lister les utilisateurs:', authError.message);
  } else {
    const user = authData.users.find(u => u.id === membership.user_id);
    if (user) {
      console.log(`✅ Utilisateur trouvé:`);
      console.log(`   Email: ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Confirmé: ${user.email_confirmed_at ? 'Oui' : 'Non'}`);
    } else {
      console.log(`❌ Utilisateur ${membership.user_id} non trouvé dans auth`);
    }
  }

  // 6. Diagnostic final
  console.log('\n' + '='.repeat(60));
  console.log('📋 RÉSUMÉ DU DIAGNOSTIC\n');

  console.log('Points à vérifier dans le navigateur:');
  console.log('1. Console du navigateur (F12) - Erreurs?');
  console.log('2. Network tab - Quelle erreur HTTP (400, 403, 500)?');
  console.log('3. L\'utilisateur est-il connecté? (vérifier auth.getUser())');
  console.log('4. L\'utilisateur a-t-il un property_membership actif?');

  console.log('\nProchaines étapes:');
  console.log('- Copiez les erreurs de la console du navigateur');
  console.log('- Vérifiez le status HTTP dans l\'onglet Network');
}

diagnoseExpenseIssue();
