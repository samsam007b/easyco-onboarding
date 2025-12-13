/**
 * Verify and create property-documents storage bucket
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log('🔍 Checking storage bucket: property-documents\n');

  try {
    // List buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) throw listError;

    const propertyDocsBucket = buckets?.find(b => b.name === 'property-documents');

    if (propertyDocsBucket) {
      console.log('✅ Bucket "property-documents" already exists');
      console.log('   Public:', propertyDocsBucket.public);
      console.log('   ID:', propertyDocsBucket.id);
    } else {
      console.log('⚠️  Bucket "property-documents" does not exist');
      console.log('   Creating it now...');

      const { data: newBucket, error: createError } = await supabase.storage.createBucket(
        'property-documents',
        {
          public: true,
          fileSizeLimit: 52428800, // 50MB
        }
      );

      if (createError) throw createError;

      console.log('✅ Bucket created successfully!');
      console.log('   Name:', newBucket.name);
    }

    console.log('\n🎉 Storage verification complete!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
