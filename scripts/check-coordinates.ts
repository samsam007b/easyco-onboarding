import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCoordinates() {
  console.log('Checking properties for GPS coordinates...\n');

  const { data: properties, error } = await supabase
    .from('properties')
    .select('id, title, city, latitude, longitude')
    .limit(10);

  if (error) {
    console.error('Error fetching properties:', error);
    return;
  }

  if (!properties || properties.length === 0) {
    console.log('No properties found in database');
    return;
  }

  console.log(`Found ${properties.length} properties:\n`);

  let withCoords = 0;
  let withoutCoords = 0;

  properties.forEach((prop) => {
    const hasCoords = prop.latitude && prop.longitude;
    if (hasCoords) {
      withCoords++;
    } else {
      withoutCoords++;
    }

    console.log(`ID: ${prop.id}`);
    console.log(`Title: ${prop.title}`);
    console.log(`City: ${prop.city}`);
    console.log(`Coordinates: ${hasCoords ? `${prop.latitude}, ${prop.longitude}` : '❌ MISSING'}`);
    console.log('---');
  });

  console.log(`\n✅ Properties with coordinates: ${withCoords}`);
  console.log(`❌ Properties without coordinates: ${withoutCoords}`);

  if (withoutCoords > 0) {
    console.log('\n⚠️  Some properties are missing GPS coordinates!');
    console.log('You need to run the SQL script: supabase/add_property_coordinates.sql');
  }
}

checkCoordinates();
