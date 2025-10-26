/**
 * Direct Migration Application Script
 * Uses PostgreSQL connection string to apply migration directly
 */

const fs = require('fs');
const path = require('path');

// For direct PostgreSQL connection, we need pg library
async function applyMigration() {
  try {
    // Check if pg is installed
    let pg;
    try {
      pg = require('pg');
    } catch (err) {
      console.log('📦 Installing pg library...');
      const { execSync } = require('child_process');
      execSync('npm install --save-dev pg', { stdio: 'inherit' });
      pg = require('pg');
    }

    const { Client } = pg;

    // Read migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/002_complete_schema_phase1.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('\n🚀 Supabase Migration - Direct PostgreSQL Connection\n');
    console.log('📁 Migration file:', migrationPath);
    console.log('📏 SQL size:', (migrationSQL.length / 1024).toFixed(2), 'KB\n');

    // Get connection string from user
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('📖 To apply this migration, you have 2 options:\n');
    console.log('Option 1: Use Supabase Dashboard (RECOMMENDED)');
    console.log('  1. Go to: https://supabase.com/dashboard/project/fgthoyilfupywmpmiuwd');
    console.log('  2. Navigate to: SQL Editor');
    console.log('  3. Create a new query');
    console.log('  4. Copy the contents of: supabase/migrations/002_complete_schema_phase1.sql');
    console.log('  5. Paste and run the query\n');

    console.log('Option 2: Use PostgreSQL Connection String');
    console.log('  1. Go to: Project Settings → Database → Connection String');
    console.log('  2. Copy the connection string (with password)\n');

    rl.question('Do you have a PostgreSQL connection string? (y/n): ', async (answer) => {
      if (answer.toLowerCase() !== 'y') {
        console.log('\n✅ Please use Option 1 (Supabase Dashboard) to apply the migration.');
        console.log('   The SQL file is ready at: supabase/migrations/002_complete_schema_phase1.sql\n');
        rl.close();
        return;
      }

      rl.question('\nEnter PostgreSQL connection string: ', async (connectionString) => {
        try {
          console.log('\n⏳ Connecting to database...');

          const client = new Client({
            connectionString: connectionString.trim(),
            ssl: { rejectUnauthorized: false }
          });

          await client.connect();
          console.log('✅ Connected successfully!\n');

          console.log('⚙️  Applying migration...\n');

          // Execute the migration
          await client.query(migrationSQL);

          console.log('\n✅ Migration applied successfully!\n');

          // Verify the migration
          console.log('🔍 Verifying migration...\n');

          const columnCheck = await client.query(`
            SELECT COUNT(*) as column_count
            FROM information_schema.columns
            WHERE table_name = 'user_profiles'
            AND table_schema = 'public'
          `);

          console.log(`   ✓ user_profiles has ${columnCheck.rows[0].column_count} columns`);

          const tableCheck = await client.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name IN ('user_verifications', 'user_consents')
            ORDER BY table_name
          `);

          console.log(`   ✓ Found ${tableCheck.rows.length} new tables:`);
          tableCheck.rows.forEach(row => {
            console.log(`     - ${row.table_name}`);
          });

          const indexCheck = await client.query(`
            SELECT COUNT(*) as index_count
            FROM pg_indexes
            WHERE tablename = 'user_profiles'
          `);

          console.log(`   ✓ user_profiles has ${indexCheck.rows[0].index_count} indexes`);

          console.log('\n🎉 Migration completed and verified!\n');
          console.log('Next steps:');
          console.log('1. Test the onboarding flows');
          console.log('2. Verify data in Supabase Dashboard');
          console.log('3. Check application logs for any errors\n');

          await client.end();
          rl.close();

        } catch (error) {
          console.error('\n❌ Migration failed:', error.message);
          console.log('\nPlease use Option 1 (Supabase Dashboard) instead.\n');
          rl.close();
          process.exit(1);
        }
      });
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

applyMigration();
