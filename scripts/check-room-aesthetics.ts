import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkRoomAesthetics() {
  console.log('🔍 Checking room aesthetics data...\n');

  // 1. Check total properties
  const { data: properties, error: propError } = await supabase
    .from('properties')
    .select('id, title, city')
    .limit(10);

  if (propError) {
    console.error('❌ Error fetching properties:', propError);
    return;
  }

  console.log(`📊 Total properties (first 10): ${properties?.length || 0}\n`);

  // 2. Check rooms for each property
  for (const property of properties || []) {
    console.log(`\n🏠 Property: ${property.title} (${property.city})`);
    console.log(`   ID: ${property.id}`);

    const { data: rooms, error: roomError } = await supabase
      .from('property_rooms')
      .select('id, room_number, room_name, price, is_available')
      .eq('property_id', property.id);

    if (roomError) {
      console.error('   ❌ Error fetching rooms:', roomError);
      continue;
    }

    console.log(`   📋 Rooms: ${rooms?.length || 0}`);

    if (rooms && rooms.length > 0) {
      for (const room of rooms) {
        console.log(`\n   🛏️  Room ${room.room_number}: ${room.room_name || 'Sans nom'}`);
        console.log(`       Price: ${room.price}€ | Available: ${room.is_available}`);

        // Check if room has aesthetics
        const { data: aesthetics, error: aestheticsError } = await supabase
          .from('property_room_aesthetics')
          .select('*')
          .eq('room_id', room.id)
          .single();

        if (aestheticsError) {
          console.log(`       ⚠️  No aesthetics data`);
        } else if (aesthetics) {
          console.log(`       ✅ Has aesthetics:`);
          if (aesthetics.natural_light_rating) {
            console.log(`          - Lumière: ${aesthetics.natural_light_rating}/10`);
          }
          if (aesthetics.heating_type) {
            console.log(`          - Chauffage: ${aesthetics.heating_type}`);
          }
          if (aesthetics.design_style) {
            console.log(`          - Style: ${aesthetics.design_style}`);
          }
          if (aesthetics.room_atmosphere) {
            console.log(`          - Atmosphère: ${aesthetics.room_atmosphere}`);
          }
          if (aesthetics.furniture_style) {
            console.log(`          - Mobilier: ${aesthetics.furniture_style}`);
          }
        }
      }
    }
  }

  // 3. Global statistics
  console.log('\n\n📊 STATISTIQUES GLOBALES:\n');

  const { count: totalRooms } = await supabase
    .from('property_rooms')
    .select('*', { count: 'exact', head: true });

  console.log(`Total rooms: ${totalRooms || 0}`);

  const { count: roomsWithAesthetics } = await supabase
    .from('property_room_aesthetics')
    .select('*', { count: 'exact', head: true });

  console.log(`Rooms with aesthetics: ${roomsWithAesthetics || 0}`);

  if (totalRooms && roomsWithAesthetics) {
    const percentage = ((roomsWithAesthetics / totalRooms) * 100).toFixed(1);
    console.log(`Coverage: ${percentage}%`);
  }

  // 4. Sample aesthetics data
  console.log('\n\n🎨 SAMPLE AESTHETICS DATA:\n');

  const { data: sampleAesthetics, error: sampleError } = await supabase
    .from('property_room_aesthetics')
    .select('*')
    .limit(1)
    .single();

  if (sampleError) {
    console.log('❌ No aesthetics data found');
  } else if (sampleAesthetics) {
    console.log('Fields populated:');
    Object.entries(sampleAesthetics).forEach(([key, value]) => {
      if (value !== null && value !== undefined && key !== 'id' && key !== 'room_id' && key !== 'created_at' && key !== 'updated_at') {
        console.log(`  - ${key}: ${value}`);
      }
    });
  }
}

checkRoomAesthetics().catch(console.error);
