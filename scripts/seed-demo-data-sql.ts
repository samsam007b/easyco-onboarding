/**
 * Seed demo data using direct SQL to bypass PostgREST cache issues
 * Usage: npx tsx scripts/seed-demo-data-sql.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDataWithSQL() {
  console.log('🌱 Seeding demo data using SQL...\n');

  // First, get or create Auth users
  console.log('👥 Getting Auth users...\n');
  
  const demoEmails = [
    'sophie.laurent@demo.easyco.com',
    'ahmed.elmansouri@demo.easyco.com',
    'emma.vanderberg@demo.easyco.com',
    'lucas.dubois@demo.easyco.com',
    'maria.santos@demo.easyco.com',
    'jeanmarc.petit@demo.easyco.com',
    'isabelle.moreau@demo.easyco.com',
    'thomas.janssens@demo.easyco.com',
    'sophie.vermeulen@demo.easyco.com',
    'pierre.lecomte@demo.easyco.com',
    'laura.gonzalez@demo.easyco.com',
    'maxime.dubois@demo.easyco.com',
  ];

  const { data: allUsers } = await supabase.auth.admin.listUsers();
  const userMap = new Map();
  
  allUsers?.users.forEach(u => {
    if (u.email && demoEmails.includes(u.email)) {
      userMap.set(u.email, u.id);
    }
  });

  console.log(`✅ Found ${userMap.size} existing demo users\n`);

  if (userMap.size === 0) {
    console.log('⚠️  No demo users found. Please run the original seed script first to create Auth users.');
    console.log('   Or create them manually in Supabase Dashboard.\n');
    return;
  }

  // Now insert profiles using direct SQL
  console.log('📝 Inserting profiles using SQL...\n');

  const sql = `
-- Insert Searcher Profiles
INSERT INTO user_profiles (user_id, email, first_name, last_name, user_type, profile_status, has_property, bio, phone, nationality, occupation, budget_min, budget_max, preferred_cities, move_in_date, smoking, pets, cleanliness_level, social_level, searcher_status)
VALUES
  ('${userMap.get('sophie.laurent@demo.easyco.com')}', 'sophie.laurent@demo.easyco.com', 'Sophie', 'Laurent', 'searcher', 'complete', false, 'Marketing Manager de 29 ans, sociable et organisée, cherche colocation sympa proche du centre.', '+32 485 12 34 56', 'French', 'Marketing Manager', 600, 900, ARRAY['Ixelles', 'Saint-Gilles', 'Etterbeek'], '2024-12-01', false, false, 8, 7, 'searching'),
  
  ('${userMap.get('ahmed.elmansouri@demo.easyco.com')}', 'ahmed.elmansouri@demo.easyco.com', 'Ahmed', 'El Mansouri', 'searcher', 'complete', false, 'Étudiant ULB en économie, 23 ans, calme et studieux, cherche logement proche université.', '+32 485 23 45 67', 'Moroccan', 'Student', 400, 600, ARRAY['Ixelles', 'Schaerbeek', 'Etterbeek'], '2025-01-15', false, false, 7, 5, 'searching'),
  
  ('${userMap.get('emma.vanderberg@demo.easyco.com')}', 'emma.vanderberg@demo.easyco.com', 'Emma', 'Van Der Berg', 'searcher', 'complete', false, 'Designer freelance, 36 ans, créative et indépendante, cherche espace lumineux avec bureau.', '+32 485 34 56 78', 'Belgian', 'Designer', 700, 1000, ARRAY['Forest', 'Uccle', 'Saint-Gilles'], '2024-11-15', false, true, 8, 6, 'searching'),
  
  ('${userMap.get('lucas.dubois@demo.easyco.com')}', 'lucas.dubois@demo.easyco.com', 'Lucas', 'Dubois', 'searcher', 'complete', false, 'Comptable en couple, 32 ans, calme et organisé, cherche appartement spacieux quartier résidentiel.', '+32 485 45 67 89', 'Belgian', 'Accountant', 900, 1300, ARRAY['Woluwe-Saint-Pierre', 'Etterbeek', 'Auderghem'], '2025-02-01', false, false, 9, 4, 'searching'),
  
  ('${userMap.get('maria.santos@demo.easyco.com')}', 'maria.santos@demo.easyco.com', 'Maria', 'Santos', 'searcher', 'complete', false, 'EU Policy Advisor, 34 ans, internationale et sociable, cherche colocation multiculturelle.', '+32 485 56 78 90', 'Portuguese', 'Policy Advisor', 750, 1100, ARRAY['Centre', 'Ixelles', 'Etterbeek'], '2024-12-15', false, false, 8, 8, 'searching')
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  bio = EXCLUDED.bio;

-- Insert Owner Profiles  
INSERT INTO user_profiles (user_id, email, first_name, last_name, user_type, profile_status, has_property, bio, phone, hosting_experience, owner_type)
VALUES
  ('${userMap.get('jeanmarc.petit@demo.easyco.com')}', 'jeanmarc.petit@demo.easyco.com', 'Jean-Marc', 'Petit', 'owner', 'complete', true, 'Propriétaire depuis 5 ans, bienveillant et réactif. Propose appartement rénové à Ixelles.', '+32 486 12 34 56', 'experienced', 'individual'),
  
  ('${userMap.get('isabelle.moreau@demo.easyco.com')}', 'isabelle.moreau@demo.easyco.com', 'Isabelle', 'Moreau', 'owner', 'complete', true, 'Investisseuse immobilière depuis 15 ans, gère plusieurs propriétés à Bruxelles avec professionnalisme.', '+32 486 23 45 67', 'expert', 'professional'),
  
  ('${userMap.get('thomas.janssens@demo.easyco.com')}', 'thomas.janssens@demo.easyco.com', 'Thomas', 'Janssens', 'owner', 'complete', true, 'Premier investissement locatif, studio étudiant à Schaerbeek. Jeune propriétaire motivé.', '+32 486 34 56 78', 'beginner', 'individual'),
  
  ('${userMap.get('sophie.vermeulen@demo.easyco.com')}', 'sophie.vermeulen@demo.easyco.com', 'Sophie', 'Vermeulen', 'owner', 'complete', true, 'Spécialiste coliving depuis 8 ans, propose maison communautaire avec jardin à Forest.', '+32 486 45 67 89', 'experienced', 'coliving')
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  bio = EXCLUDED.bio;

-- Insert Resident Profiles
INSERT INTO user_profiles (user_id, email, first_name, last_name, user_type, profile_status, has_property, bio, phone, nationality, occupation, smoking, pets, cleanliness_level, social_level)
VALUES
  ('${userMap.get('pierre.lecomte@demo.easyco.com')}', 'pierre.lecomte@demo.easyco.com', 'Pierre', 'Lecomte', 'resident', 'complete', false, 'Ingénieur civil de 27 ans, calme et rangé, apprécie vie en colocation équilibrée.', '+32 487 12 34 56', 'Belgian', 'Civil Engineer', false, false, 8, 6),
  
  ('${userMap.get('laura.gonzalez@demo.easyco.com')}', 'laura.gonzalez@demo.easyco.com', 'Laura', 'Gonzalez', 'resident', 'complete', false, 'Doctorante en biologie, 26 ans, studieuse et respectueuse, cherche environnement calme.', '+32 487 23 45 67', 'Spanish', 'PhD Student', false, false, 9, 4),
  
  ('${userMap.get('maxime.dubois@demo.easyco.com')}', 'maxime.dubois@demo.easyco.com', 'Maxime', 'Dubois', 'resident', 'complete', false, 'Développeur en startup, 25 ans, sociable et tech-savvy, aime les colocations dynamiques.', '+32 487 34 56 78', 'Belgian', 'Software Developer', false, false, 7, 9)
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  bio = EXCLUDED.bio;
`;

  const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

  if (error) {
    console.error('❌ Error executing SQL:', error);
    console.log('\n💡 Trying alternative approach...\n');
    
    // Alternative: Use Supabase SQL Editor
    console.log('📋 Please copy this SQL and run it in Supabase Dashboard > SQL Editor:\n');
    console.log('═══════════════════════════════════════════════════════════════════\n');
    console.log(sql);
    console.log('\n═══════════════════════════════════════════════════════════════════\n');
    return;
  }

  console.log('✅ Profiles created successfully!\n');
  
  // Now create properties
  console.log('🏠 Creating properties...\n');
  
  const propertiesSQL = `
INSERT INTO properties (owner_id, title, description, property_type, address, city, neighborhood, postal_code, country, latitude, longitude, bedrooms, bathrooms, surface_area, floor_number, furnished, monthly_rent, charges, deposit, available_from, minimum_stay_months, amenities, smoking_allowed, pets_allowed, couples_allowed, images, main_image, status, is_available)
VALUES
  ('${userMap.get('jeanmarc.petit@demo.easyco.com')}', 
   'Appartement 2 Chambres - Ixelles Flagey', 
   'Magnifique appartement de 85m² au cœur du quartier Flagey. Rénové avec goût, parquet massif, cuisine équipée, grande luminosité. Proche trams 81, bus, commerces et vie culturelle animée.',
   'apartment',
   'Avenue de la Couronne 234',
   'Ixelles',
   'Flagey',
   '1050',
   'Belgium',
   50.8272,
   4.3719,
   2, 1, 85, 2, true,
   1250, 150, 2500,
   '2024-12-01',
   6,
   '["wifi", "elevator", "balcony", "washing_machine", "dishwasher", "heating", "furnished"]'::jsonb,
   false, false, true,
   ARRAY['https://images.unsplash.com/photo-1502672260066-6bc36a8baf37?w=800', 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800'],
   'https://images.unsplash.com/photo-1502672260066-6bc36a8baf37?w=800',
   'published', true),
   
  ('${userMap.get('thomas.janssens@demo.easyco.com')}',
   'Studio Schaerbeek - Quartier Diamant',
   'Studio fonctionnel de 35m² idéal étudiant. Meublé et équipé, kitchenette, salle de bain, Wi-Fi inclus. Proche métro Diamant, ULB, commerces. Quartier multiculturel et vivant.',
   'studio',
   'Rue Josaphat 145',
   'Schaerbeek',
   'Diamant',
   '1030',
   'Belgium',
   50.8571,
   4.3836,
   0, 1, 35, 3, true,
   650, 80, 1300,
   '2025-01-01',
   3,
   '["wifi", "heating", "furnished"]'::jsonb,
   false, false, false,
   ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
   'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
   'published', true),
   
  ('${userMap.get('sophie.vermeulen@demo.easyco.com')}',
   'Coliving Forest - Maison Communautaire',
   'Magnifique maison de maître de 280m² transformée en coliving. 6 chambres privées avec espaces communs partagés : salon, cuisine, jardin 200m². Ambiance internationale et conviviale.',
   'coliving',
   'Avenue Besme 89',
   'Forest',
   'Altitude 100',
   '1190',
   'Belgium',
   50.8143,
   4.3142,
   6, 3, 280, 0, true,
   695, 200, 1390,
   '2024-11-15',
   3,
   '["wifi", "garden", "laundry", "common_areas", "heating", "furnished"]'::jsonb,
   false, true, false,
   ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800'],
   'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
   'published', true),
   
  ('${userMap.get('isabelle.moreau@demo.easyco.com')}',
   'Appartement 3 Chambres - Woluwe Standing',
   'Spacieux 3 chambres de 120m² dans résidence sécurisée. Haut standing, terrasse 15m², parking, salle de gym. Quartier résidentiel calme proche Parc de Woluwe et transports.',
   'apartment',
   'Avenue de Tervueren 412',
   'Woluwe-Saint-Pierre',
   'Montgomery',
   '1150',
   'Belgium',
   50.8429,
   4.4089,
   3, 2, 120, 4, true,
   1800, 250, 3600,
   '2025-02-01',
   12,
   '["wifi", "elevator", "parking", "gym", "balcony", "heating", "dishwasher", "washing_machine", "furnished"]'::jsonb,
   false, false, true,
   ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
   'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
   'published', true),
   
  ('${userMap.get('isabelle.moreau@demo.easyco.com')}',
   'Maison 4 Chambres - Saint-Gilles Parvis',
   'Belle maison bruxelloise typique de 150m² avec jardin 80m². 4 chambres, 2 SDB, parquet d''origine, cheminée. Quartier Parvis de Saint-Gilles, artistique et vivant.',
   'house',
   'Rue de la Victoire 78',
   'Saint-Gilles',
   'Parvis',
   '1060',
   'Belgium',
   50.8283,
   4.3456,
   4, 2, 150, 0, false,
   2100, 200, 4200,
   '2024-12-15',
   12,
   '["wifi", "garden", "laundry", "dishwasher", "washing_machine", "heating", "balcony"]'::jsonb,
   false, false, true,
   ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'],
   'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
   'published', true)
ON CONFLICT DO NOTHING;
`;

  const { error: propError } = await supabase.rpc('exec_sql', { sql_query: propertiesSQL });
  
  if (propError) {
    console.error('❌ Error creating properties:', propError);
    console.log('\n💡 Please copy this SQL and run it in Supabase Dashboard > SQL Editor:\n');
    console.log('═══════════════════════════════════════════════════════════════════\n');
    console.log(propertiesSQL);
    console.log('\n═══════════════════════════════════════════════════════════════════\n');
    return;
  }

  console.log('✅ Properties created successfully!\n');
  console.log('🎉 Demo data seeding complete!\n');
  console.log('📊 Summary:');
  console.log('   - 5 Searchers');
  console.log('   - 4 Owners');
  console.log('   - 3 Residents');
  console.log('   - 5 Properties in Brussels\n');
  console.log('🔐 All accounts use password: Demo123!\n');
  console.log('🔗 Go to: http://localhost:3000/properties/browse\n');
}

seedDataWithSQL().catch(console.error);
