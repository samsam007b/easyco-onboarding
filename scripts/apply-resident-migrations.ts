/**
 * Apply Resident Features Migrations
 * Applies migrations 080, 081, 082 directly to Supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE environment variables');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const migrations = [
  {
    name: '080_enhanced_finances_system.sql',
    description: 'Enhanced Finances System (Expenses + Rent + OCR)',
  },
  {
    name: '081_enhanced_tasks_system.sql',
    description: 'Enhanced Tasks System (Rotations + Exchanges + Proof)',
  },
  {
    name: '082_document_vault_system.sql',
    description: 'Document Vault System (Secure Storage + Sharing)',
  },
];

async function applyMigration(fileName: string, description: string) {
  console.log(`\n📦 Applying: ${description}`);
  console.log(`   File: ${fileName}`);

  try {
    const filePath = path.join(process.cwd(), 'supabase', 'migrations', fileName);
    const sql = fs.readFileSync(filePath, 'utf-8');

    // Execute the migration SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql }).single();

    if (error) {
      // If exec_sql doesn't exist, try direct query
      console.log('   Trying direct SQL execution...');

      // Split by statement and execute one by one
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        if (statement.length > 0) {
          const result = await supabase.rpc('exec', { sql: statement });
          if (result.error) {
            console.error(`   ❌ Error in statement: ${statement.substring(0, 100)}...`);
            throw result.error;
          }
        }
      }
    }

    console.log(`   ✅ Migration applied successfully!`);
    return true;
  } catch (error: any) {
    console.error(`   ❌ Migration failed:`, error.message || error);
    return false;
  }
}

async function main() {
  console.log('🚀 Applying Resident Features Migrations\n');
  console.log('   Environment:', supabaseUrl);
  console.log('   Migrations:', migrations.length);

  let successCount = 0;

  for (const migration of migrations) {
    const success = await applyMigration(migration.name, migration.description);
    if (success) {
      successCount++;
    } else {
      console.log('\n⚠️  Migration failed. Stopping here.');
      console.log('   Please apply remaining migrations manually via Supabase Dashboard SQL Editor.');
      break;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ Applied ${successCount}/${migrations.length} migrations successfully`);

  if (successCount === migrations.length) {
    console.log('\n🎉 All migrations completed!');
    console.log('\nNext steps:');
    console.log('1. Verify tables in Supabase Dashboard → Table Editor');
    console.log('2. Activate UIs by renaming:');
    console.log('   - app/hub/finances/new-page.tsx → page.tsx');
    console.log('   - app/hub/tasks/new-page.tsx → page.tsx');
    console.log('   - app/hub/maintenance/new-page.tsx → page.tsx');
    console.log('3. Test each feature!');
  } else {
    console.log('\n📋 Manual Application Required:');
    console.log('Go to Supabase Dashboard → SQL Editor and run:');
    for (let i = successCount; i < migrations.length; i++) {
      console.log(`   ${i + 1}. supabase/migrations/${migrations[i].name}`);
    }
  }
}

main().catch(console.error);
