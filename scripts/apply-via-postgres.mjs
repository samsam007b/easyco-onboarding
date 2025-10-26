/**
 * Apply Migration via Direct PostgreSQL Connection
 * This script connects directly to Supabase PostgreSQL and runs the migration
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pkg from 'pg';
const { Client } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n🚀 Supabase Migration - PostgreSQL Direct Connection\n');
console.log('=' .repeat(60));
console.log('');

// Read migration file
const migrationPath = join(__dirname, '../supabase/migrations/002_complete_schema_phase1.sql');
const migrationSQL = readFileSync(migrationPath, 'utf8');

console.log('📁 Migration file:', '002_complete_schema_phase1.sql');
console.log('📏 Size:', (migrationSQL.length / 1024).toFixed(2), 'KB');
console.log('📝 Statements:', migrationSQL.split(';').filter(s => s.trim().length > 10).length);
console.log('');

// Build connection string from Supabase credentials
const SUPABASE_PROJECT_REF = 'fgthoyilfupywmpmiuwd';
const SUPABASE_HOST = `db.${SUPABASE_PROJECT_REF}.supabase.co`;
const SUPABASE_PORT = 5432;
const SUPABASE_DATABASE = 'postgres';
const SUPABASE_USER = 'postgres';

console.log('🔗 Connection Details:');
console.log(`   Host: ${SUPABASE_HOST}`);
console.log(`   Port: ${SUPABASE_PORT}`);
console.log(`   Database: ${SUPABASE_DATABASE}`);
console.log(`   User: ${SUPABASE_USER}`);
console.log('');

console.log('⚠️  To connect, we need the database password.\n');
console.log('To get your password:');
console.log('1. Go to: https://supabase.com/dashboard/project/fgthoyilfupywmpmiuwd/settings/database');
console.log('2. Look for "Database password" or "Reset database password"\n');
console.log('Alternative: Use the connection pooler string from:');
console.log('   Project Settings → Database → Connection Pooling\n');

// Ask for password
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function testConnection(client) {
  try {
    const result = await client.query('SELECT current_database(), current_user, version()');
    console.log('\n✅ Connection successful!');
    console.log(`   Database: ${result.rows[0].current_database}`);
    console.log(`   User: ${result.rows[0].current_user}`);
    console.log(`   PostgreSQL: ${result.rows[0].version.split(' ')[1]}`);
    console.log('');
    return true;
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    return false;
  }
}

async function checkCurrentSchema(client) {
  console.log('🔍 Checking current schema...\n');

  try {
    const columnCount = await client.query(`
      SELECT COUNT(*) as count
      FROM information_schema.columns
      WHERE table_name = 'user_profiles'
      AND table_schema = 'public'
    `);
    console.log(`   Current user_profiles columns: ${columnCount.rows[0].count}`);

    const hasTypedColumns = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'user_profiles'
      AND table_schema = 'public'
      AND column_name = 'first_name'
    `);

    if (hasTypedColumns.rows.length > 0) {
      console.log('   ⚠️  Typed columns already exist - migration may have been applied');
      const answer = await question('\n   Continue anyway? (y/n): ');
      if (answer.toLowerCase() !== 'y') {
        return false;
      }
    } else {
      console.log('   ✓ Ready for migration (typed columns not found)');
    }

    console.log('');
    return true;

  } catch (error) {
    console.error('   ❌ Error:', error.message);
    return false;
  }
}

async function applyMigration(client) {
  console.log('⚙️  Applying migration...\n');
  console.log('   This may take 30-60 seconds...\n');

  try {
    // Execute the entire migration as a single transaction
    await client.query('BEGIN');

    // Execute the migration SQL
    await client.query(migrationSQL);

    await client.query('COMMIT');

    console.log('✅ Migration executed successfully!\n');
    return true;

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error.message);
    console.log('');
    return false;
  }
}

async function verifyMigration(client) {
  console.log('🔍 Verifying migration...\n');

  try {
    // Check column count
    const columnCount = await client.query(`
      SELECT COUNT(*) as count
      FROM information_schema.columns
      WHERE table_name = 'user_profiles'
      AND table_schema = 'public'
    `);
    console.log(`   ✓ user_profiles now has ${columnCount.rows[0].count} columns`);

    // Check new tables
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('user_verifications', 'user_consents')
      ORDER BY table_name
    `);
    console.log(`   ✓ Created ${tables.rows.length} new tables:`);
    tables.rows.forEach(row => {
      console.log(`     - ${row.table_name}`);
    });

    // Check indexes
    const indexes = await client.query(`
      SELECT COUNT(*) as count
      FROM pg_indexes
      WHERE tablename = 'user_profiles'
      AND schemaname = 'public'
    `);
    console.log(`   ✓ user_profiles has ${indexes.rows[0].count} indexes`);

    console.log('\n🎉 Migration completed and verified successfully!\n');
    return true;

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    return false;
  }
}

async function main() {
  try {
    // Ask for connection method
    console.log('Choose connection method:\n');
    console.log('1. Enter database password');
    console.log('2. Enter full connection string');
    console.log('3. Use Supabase Dashboard (manual)\n');

    const choice = await question('Enter choice (1/2/3): ');

    if (choice === '3') {
      console.log('\n📖 Manual Migration Instructions:\n');
      console.log('1. Open: https://supabase.com/dashboard/project/fgthoyilfupywmpmiuwd/editor');
      console.log('2. Go to: SQL Editor');
      console.log('3. Create new query');
      console.log('4. Copy contents of: supabase/migrations/002_complete_schema_phase1.sql');
      console.log('5. Paste and click "Run"');
      console.log('6. Wait for completion');
      console.log('7. Verify with: node scripts/verify-migration.mjs\n');
      rl.close();
      return;
    }

    let connectionString;

    if (choice === '1') {
      const password = await question('\nEnter database password: ');
      connectionString = `postgresql://${SUPABASE_USER}:${password}@${SUPABASE_HOST}:${SUPABASE_PORT}/${SUPABASE_DATABASE}`;
    } else if (choice === '2') {
      connectionString = await question('\nEnter full connection string: ');
    } else {
      console.log('\n❌ Invalid choice');
      rl.close();
      return;
    }

    console.log('\n⏳ Connecting to database...\n');

    const client = new Client({
      connectionString: connectionString.trim(),
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();

    const connected = await testConnection(client);
    if (!connected) {
      rl.close();
      await client.end();
      return;
    }

    const canProceed = await checkCurrentSchema(client);
    if (!canProceed) {
      rl.close();
      await client.end();
      return;
    }

    const migrationSuccess = await applyMigration(client);
    if (!migrationSuccess) {
      rl.close();
      await client.end();
      return;
    }

    await verifyMigration(client);

    await client.end();
    rl.close();

    console.log('=' .repeat(60));
    console.log('\n✅ All done! Next steps:\n');
    console.log('1. Run verification: node scripts/verify-migration.mjs');
    console.log('2. Test onboarding flows');
    console.log('3. Check Supabase Dashboard\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

main();
