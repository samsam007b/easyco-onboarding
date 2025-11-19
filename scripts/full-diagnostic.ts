import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function fullDiagnostic() {
  console.log('🔬 DIAGNOSTIC COMPLET - CRÉATION DE DÉPENSE');
  console.log('='.repeat(80));

  // ============================================================================
  // 1. VÉRIFICATION DES VARIABLES D'ENVIRONNEMENT
  // ============================================================================
  console.log('\n📋 1. Variables d\'environnement\n');
  console.log(`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Définie' : '❌ Manquante'}`);
  console.log(`SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Définie' : '❌ Manquante'}`);
  console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Définie' : '❌ Manquante'}`);

  // ============================================================================
  // 2. VÉRIFICATION DES TABLES ET COLONNES
  // ============================================================================
  console.log('\n📋 2. Structure des tables\n');

  // Expenses
  const { data: expensesColumns, error: expColError } = await supabaseAdmin
    .rpc('exec_sql', {
      sql: `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'expenses'
        ORDER BY ordinal_position;
      `
    });

  if (expColError) {
    console.log('⚠️  Impossible de lire les colonnes via RPC, utilisation alternative...');
    // Test simple
    const { data: testExp, error: testExpErr } = await supabaseAdmin
      .from('expenses')
      .select('*')
      .limit(1);

    if (testExpErr) {
      console.log('❌ Table expenses:', testExpErr.message);
    } else {
      console.log('✅ Table expenses accessible');
      if (testExp && testExp.length > 0) {
        console.log('   Colonnes trouvées:', Object.keys(testExp[0]).join(', '));
      }
    }
  } else {
    console.log('✅ Colonnes de expenses:');
    expensesColumns?.forEach((col: any) => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });
  }

  // Expense_splits
  const { data: testSplit, error: testSplitErr } = await supabaseAdmin
    .from('expense_splits')
    .select('*')
    .limit(1);

  if (testSplitErr) {
    console.log('❌ Table expense_splits:', testSplitErr.message);
  } else {
    console.log('✅ Table expense_splits accessible');
    if (testSplit && testSplit.length > 0) {
      console.log('   Colonnes:', Object.keys(testSplit[0]).join(', '));
    }
  }

  // ============================================================================
  // 3. VÉRIFICATION DES RLS POLICIES
  // ============================================================================
  console.log('\n📋 3. RLS Policies\n');

  const tables = ['expenses', 'expense_splits', 'property_members'];

  for (const table of tables) {
    const { data: policies } = await supabaseAdmin
      .rpc('exec_sql', {
        sql: `
          SELECT policyname, cmd, permissive, roles
          FROM pg_policies
          WHERE tablename = '${table}'
          ORDER BY cmd, policyname;
        `
      });

    if (policies) {
      console.log(`\n✅ ${table} (${policies.length} policies):`);
      policies.forEach((pol: any) => {
        console.log(`   ${pol.cmd.padEnd(8)} - ${pol.policyname}`);
      });
    } else {
      console.log(`⚠️  ${table}: Impossible de lire les policies`);
    }
  }

  // ============================================================================
  // 4. VÉRIFICATION DES UTILISATEURS ET MEMBERSHIPS
  // ============================================================================
  console.log('\n📋 4. Utilisateurs et memberships\n');

  const { data: memberships, error: memError } = await supabaseAdmin
    .from('property_members')
    .select('user_id, property_id, role, status')
    .eq('status', 'active');

  if (memError) {
    console.log('❌ Erreur memberships:', memError.message);
  } else {
    console.log(`✅ ${memberships?.length || 0} memberships actifs trouvés`);
    if (memberships && memberships.length > 0) {
      console.log('\nExemples:');
      memberships.slice(0, 3).forEach((mem: any, i: number) => {
        console.log(`   ${i + 1}. User: ${mem.user_id.substring(0, 8)}... → Property: ${mem.property_id.substring(0, 8)}... (${mem.role})`);
      });
    } else {
      console.log('⚠️  AUCUN MEMBERSHIP ACTIF TROUVÉ!');
      console.log('   → C\'est peut-être ça le problème!');
    }
  }

  // ============================================================================
  // 5. TEST D'INSERTION RÉELLE
  // ============================================================================
  console.log('\n📋 5. Test d\'insertion avec Service Role\n');

  if (memberships && memberships.length > 0) {
    const testMember = memberships[0];

    const testExpense = {
      property_id: testMember.property_id,
      created_by: testMember.user_id,
      paid_by_id: testMember.user_id,
      title: 'Test Diagnostic Complet',
      description: 'Test pour identifier le problème',
      amount: 99.99,
      category: 'groceries',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    console.log('Tentative d\'insertion:', JSON.stringify(testExpense, null, 2));

    const { data: newExpense, error: insertError } = await supabaseAdmin
      .from('expenses')
      .insert(testExpense)
      .select()
      .single();

    if (insertError) {
      console.log('❌ ERREUR d\'insertion:', insertError);
      console.log('   Code:', insertError.code);
      console.log('   Message:', insertError.message);
      console.log('   Details:', insertError.details);
    } else {
      console.log('✅ Insertion réussie!');
      console.log('   ID:', newExpense.id);

      // Test du split
      const { data: newSplit, error: splitError } = await supabaseAdmin
        .from('expense_splits')
        .insert({
          expense_id: newExpense.id,
          user_id: testMember.user_id,
          amount_owed: 99.99,
          paid: false,
        })
        .select()
        .single();

      if (splitError) {
        console.log('❌ ERREUR split:', splitError);
      } else {
        console.log('✅ Split créé!');
        console.log('   ID:', newSplit.id);
      }
    }
  }

  // ============================================================================
  // 6. VÉRIFICATION DU CODE FRONTEND
  // ============================================================================
  console.log('\n📋 6. Analyse du code frontend\n');

  console.log('Points à vérifier dans app/hub/finances/page.tsx:');
  console.log('   1. La fonction createExpense est-elle bien appelée?');
  console.log('   2. Le bouton est-il disabled pendant isSubmitting?');
  console.log('   3. Y a-t-il des alerts qui s\'affichent?');
  console.log('   4. Vérifier la console du navigateur pour les erreurs');

  // ============================================================================
  // 7. RECOMMANDATIONS
  // ============================================================================
  console.log('\n' + '='.repeat(80));
  console.log('📊 RÉSUMÉ ET RECOMMANDATIONS\n');

  if (!memberships || memberships.length === 0) {
    console.log('🔴 PROBLÈME CRITIQUE: Aucun membership actif!');
    console.log('   Solution: Créer un membership actif pour votre utilisateur');
    console.log('   SQL à exécuter:');
    console.log('   ');
    console.log('   INSERT INTO property_members (user_id, property_id, role, status)');
    console.log('   VALUES (\'VOTRE_USER_ID\', \'VOTRE_PROPERTY_ID\', \'resident\', \'active\');');
  } else {
    console.log('✅ Les memberships existent');
  }

  console.log('\n🔍 Prochaines étapes:');
  console.log('   1. Ouvrez la console du navigateur (F12)');
  console.log('   2. Allez sur /hub/finances');
  console.log('   3. Cliquez sur "Ajouter"');
  console.log('   4. Remplissez le formulaire');
  console.log('   5. Cliquez sur "Créer la dépense"');
  console.log('   6. COPIEZ TOUTES les erreurs qui apparaissent');
  console.log('   7. Regardez aussi l\'onglet Network → filtrez par "expenses"');
  console.log('   8. Vérifiez le status code (400, 403, 500?) et la réponse');

  console.log('\n' + '='.repeat(80));
}

fullDiagnostic();
