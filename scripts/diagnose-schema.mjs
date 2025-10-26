/**
 * Diagnostic complet du schéma Supabase actuel
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

console.log('\n🔍 DIAGNOSTIC COMPLET DU SCHÉMA SUPABASE\n');
console.log('='.repeat(70));

async function checkTable(tableName) {
  console.log(`\n📊 Table: ${tableName}`);
  console.log('-'.repeat(70));

  try {
    // Essayer de lire la structure
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (error) {
      console.log(`   ❌ Erreur: ${error.message}`);
      return null;
    }

    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log(`   ✅ Existe avec ${columns.length} colonnes`);
      console.log(`   📋 Colonnes: ${columns.slice(0, 10).join(', ')}${columns.length > 10 ? '...' : ''}`);
      return columns;
    } else {
      console.log(`   ✅ Existe mais vide`);
      // Essayer d'obtenir les colonnes via insert dry-run
      return [];
    }
  } catch (err) {
    console.log(`   ❌ Exception: ${err.message}`);
    return null;
  }
}

async function getTableColumns(tableName) {
  // Utiliser une requête SQL via RPC si disponible
  try {
    const { data, error } = await supabase.rpc('get_table_columns', {
      table_name: tableName
    });

    if (!error && data) {
      return data;
    }
  } catch (err) {
    // RPC non disponible, utiliser méthode alternative
  }

  // Méthode alternative: lire un row
  const { data } = await supabase.from(tableName).select('*').limit(1);
  if (data && data.length > 0) {
    return Object.keys(data[0]);
  }
  return [];
}

async function main() {
  console.log('\n🎯 OBJECTIF: Identifier l\'état exact du schéma avant migration\n');

  // Tables à vérifier
  const tables = [
    'users',
    'user_profiles',
    'user_sessions',
    'user_verifications',
    'user_consents'
  ];

  const schemaState = {};

  for (const table of tables) {
    const columns = await checkTable(table);
    schemaState[table] = columns;
  }

  console.log('\n\n📋 RÉSUMÉ DU DIAGNOSTIC');
  console.log('='.repeat(70));

  Object.entries(schemaState).forEach(([table, columns]) => {
    if (columns === null) {
      console.log(`❌ ${table}: N'EXISTE PAS`);
    } else if (columns.length === 0) {
      console.log(`⚠️  ${table}: EXISTE mais structure inconnue`);
    } else {
      console.log(`✅ ${table}: ${columns.length} colonnes`);
    }
  });

  // Analyse spécifique user_profiles
  console.log('\n\n🔬 ANALYSE DÉTAILLÉE: user_profiles');
  console.log('='.repeat(70));

  if (schemaState.user_profiles && schemaState.user_profiles.length > 0) {
    const columns = schemaState.user_profiles;

    console.log('\n📊 Colonnes actuelles:');
    columns.forEach((col, idx) => {
      console.log(`   ${idx + 1}. ${col}`);
    });

    // Vérifier colonnes critiques
    console.log('\n🎯 Vérification colonnes critiques:');
    const criticalColumns = [
      'first_name',
      'last_name',
      'budget_min',
      'budget_max',
      'is_smoker',
      'has_pets',
      'cleanliness_preference',
      'landlord_type'
    ];

    criticalColumns.forEach(col => {
      const exists = columns.includes(col);
      console.log(`   ${exists ? '✅' : '❌'} ${col}`);
    });

    // Vérifier si profile_data existe (JSONB blob)
    const hasJsonBlob = columns.includes('profile_data');
    console.log(`\n🔍 JSONB Blob (profile_data): ${hasJsonBlob ? '✅ EXISTE' : '❌ N\'existe pas'}`);

    if (hasJsonBlob) {
      console.log('   ⚠️  PROBLÈME: Les données sont stockées dans un blob JSONB');
      console.log('   ✅ SOLUTION: La migration va créer des colonnes typées');
    }
  }

  // Vérifier tables de vérification et consentements
  console.log('\n\n📋 TABLES DE VÉRIFICATION ET CONSENTEMENTS');
  console.log('='.repeat(70));

  const verificationsExist = schemaState.user_verifications !== null;
  const consentsExist = schemaState.user_consents !== null;

  console.log(`user_verifications: ${verificationsExist ? '✅ EXISTE' : '❌ N\'EXISTE PAS - sera créée'}`);
  console.log(`user_consents: ${consentsExist ? '✅ EXISTE' : '❌ N\'EXISTE PAS - sera créée'}`);

  // Recommandations
  console.log('\n\n💡 RECOMMANDATIONS POUR LA MIGRATION');
  console.log('='.repeat(70));

  if (!verificationsExist && !consentsExist) {
    console.log('✅ PARFAIT: Les tables n\'existent pas, la migration peut tout créer');
    console.log('   → Utiliser la migration COMPLÈTE (002_complete_schema_phase1.sql)');
  } else {
    console.log('⚠️  ATTENTION: Certaines tables existent déjà');
    console.log('   → Utiliser une migration INCRÉMENTALE (ajouter seulement colonnes manquantes)');
  }

  if (schemaState.user_profiles && schemaState.user_profiles.length < 20) {
    console.log('\n⚠️  user_profiles a peu de colonnes, migration nécessaire');
    console.log('   → Ajouter ~100 colonnes typées pour remplacer JSONB');
  }

  console.log('\n\n🚀 PROCHAINES ÉTAPES');
  console.log('='.repeat(70));
  console.log('1. Créer migration SQL adaptée basée sur ce diagnostic');
  console.log('2. Appliquer migration via Supabase Dashboard');
  console.log('3. Vérifier avec: node scripts/verify-migration.mjs');
  console.log('4. Tester onboarding flows');
  console.log('');
}

main().catch(console.error);
