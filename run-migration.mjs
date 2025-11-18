import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

// Use SERVICE_ROLE_KEY for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🚀 Running database migration...\n');

// Read the migration SQL file
const migrationSQL = fs.readFileSync(
  './supabase/migrations/20251117_create_clean_profile_structure.sql',
  'utf8'
);

console.log('📄 Migration file loaded');
console.log(`📏 Size: ${(migrationSQL.length / 1024).toFixed(2)} KB\n`);

// Split by statement (basic split on semicolons, might need refinement)
const statements = migrationSQL
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`📝 Found ${statements.length} SQL statements\n`);

let successCount = 0;
let errorCount = 0;

for (let i = 0; i < statements.length; i++) {
  const statement = statements[i] + ';'; // Add semicolon back

  // Skip comments and empty lines
  if (statement.trim().startsWith('--') || statement.trim() === ';') {
    continue;
  }

  console.log(`[${i + 1}/${statements.length}] Executing...`);

  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: statement
    });

    if (error) {
      // Try alternative method: direct SQL execution
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({ sql_query: statement })
        }
      );

      if (!response.ok) {
        console.log(`❌ Error:`, error?.message || `HTTP ${response.status}`);
        console.log(`   Statement: ${statement.substring(0, 100)}...`);
        errorCount++;
      } else {
        console.log(`✅ Success`);
        successCount++;
      }
    } else {
      console.log(`✅ Success`);
      successCount++;
    }
  } catch (err) {
    console.log(`❌ Exception:`, err.message);
    console.log(`   Statement: ${statement.substring(0, 100)}...`);
    errorCount++;
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`✅ Successful: ${successCount}`);
console.log(`❌ Errors: ${errorCount}`);
console.log(`${'='.repeat(60)}\n`);

if (errorCount === 0) {
  console.log('🎉 Migration completed successfully!');
} else {
  console.log('⚠️  Migration completed with errors. Check logs above.');
}
