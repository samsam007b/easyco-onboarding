-- EasyCo Demo Data Seeding Script
-- Run this in your Supabase SQL editor to populate demo data

-- ============================================
-- WARNING: This will insert demo/test data
-- Only run this in a dedicated demo database
-- ============================================

-- Insert demo properties
INSERT INTO properties (id, title, description, city, postal_code, monthly_rent, bedrooms, bathrooms, property_type, status, owner_id, created_at)
VALUES
  ('demo-prop-1', 'Modern Coliving Space in Brussels Center', 'Beautiful modern apartment perfect for young professionals. Fully furnished with high-speed internet, shared kitchen, and cozy common areas.', 'Brussels', '1000', 750, 1, 1, 'coliving', 'published', (SELECT id FROM auth.users WHERE email = 'demo.owner@easyco.demo'), '2024-01-15 10:00:00+00'),

  ('demo-prop-2', 'Spacious House Share in Ghent', 'Large house with private bedrooms and shared living spaces. Garden access, bike storage, and great public transport connections.', 'Ghent', '9000', 650, 3, 2, 'house', 'published', (SELECT id FROM auth.users WHERE email = 'demo.owner@easyco.demo'), '2024-01-20 10:00:00+00'),

  ('demo-prop-3', 'Studio Apartment near EU Quarter', 'Cozy studio perfect for students or interns. Walking distance to European institutions, metro, and shopping.', 'Brussels', '1040', 850, 1, 1, 'studio', 'published', (SELECT id FROM auth.users WHERE email = 'demo.owner@easyco.demo'), '2024-01-25 10:00:00+00'),

  ('demo-prop-4', 'Charming Apartment in Antwerp', 'Historic building with modern amenities. Shared rooftop terrace, laundry facilities, and friendly community atmosphere.', 'Antwerp', '2000', 700, 2, 1, 'apartment', 'published', (SELECT id FROM auth.users WHERE email = 'demo.owner@easyco.demo'), '2024-02-01 10:00:00+00'),

  ('demo-prop-5', 'Luxury Coliving in Brussels', 'Premium coliving space with gym, cinema room, and coworking space. All utilities included, weekly cleaning service.', 'Brussels', '1050', 1200, 1, 1, 'coliving', 'published', (SELECT id FROM auth.users WHERE email = 'demo.owner@easyco.demo'), '2024-02-05 10:00:00+00'),

  ('demo-prop-6', 'Student-Friendly House in Leuven', 'Perfect for students! Near university campus, bike-friendly, shared study room, and fast internet.', 'Leuven', '3000', 500, 4, 2, 'house', 'published', (SELECT id FROM auth.users WHERE email = 'demo.owner@easyco.demo'), '2024-02-10 10:00:00+00'),

  ('demo-prop-7', 'Eco-Friendly Apartment in Liège', 'Sustainable living space with solar panels, rainwater collection, and organic garden. Green community focused.', 'Liège', '4000', 680, 2, 1, 'apartment', 'published', (SELECT id FROM auth.users WHERE email = 'demo.owner@easyco.demo'), '2024-02-15 10:00:00+00'),

  ('demo-prop-8', 'Downtown Studio in Bruges', 'Perfectly located studio in the heart of historic Bruges. Close to restaurants, shops, and cultural attractions.', 'Bruges', '8000', 900, 1, 1, 'studio', 'published', (SELECT id FROM auth.users WHERE email = 'demo.owner@easyco.demo'), '2024-02-20 10:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- DEMO USER PROFILES
-- Note: Users must be created via Supabase Auth first
-- This script only adds profile data
-- ============================================

-- Demo Searcher Profile
INSERT INTO user_profiles (user_id, first_name, last_name, date_of_birth, nationality, phone_number, occupation_status, budget_min, budget_max, current_city, languages_spoken, bio, cleanliness_preference, introvert_extrovert_scale, is_smoker)
SELECT
  id,
  'Emma',
  'Searcher',
  '1995-06-15',
  'Belgian',
  '+32 123 456 789',
  'Young Professional',
  600,
  1000,
  'Brussels',
  ARRAY['English', 'French', 'Dutch'],
  'Looking for a friendly coliving space in Brussels. I work in tech and enjoy cooking and yoga.',
  8,
  7,
  false
FROM auth.users
WHERE email = 'demo.searcher@easyco.demo'
ON CONFLICT (user_id) DO NOTHING;

-- Demo Owner Profile
INSERT INTO user_profiles (user_id, first_name, last_name, landlord_type, company_name, phone_number, owner_type, primary_location, hosting_experience, has_property)
SELECT
  id,
  'Lucas',
  'Owner',
  'individual',
  'EasyCo Properties',
  '+32 987 654 321',
  'professional',
  'Brussels',
  'experienced',
  true
FROM auth.users
WHERE email = 'demo.owner@easyco.demo'
ON CONFLICT (user_id) DO NOTHING;

-- Demo Resident Profile
INSERT INTO user_profiles (user_id, first_name, last_name, date_of_birth, nationality, phone_number, current_city, move_in_date, bio, cleanliness_preference, introvert_extrovert_scale, smoker)
SELECT
  id,
  'Sophie',
  'Resident',
  '1998-03-20',
  'French',
  '+32 555 123 456',
  'Brussels',
  '2024-01-01',
  'Happy resident of our coliving community. Love organizing events and meeting new people!',
  9,
  8,
  false
FROM auth.users
WHERE email = 'demo.resident@easyco.demo'
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- DEMO USER ACCOUNTS INSTRUCTIONS
-- ============================================

/*
IMPORTANT: Create these user accounts via Supabase Auth Dashboard or API:

1. demo.searcher@easyco.demo (Password: Demo2024!)
2. demo.owner@easyco.demo (Password: Demo2024!)
3. demo.resident@easyco.demo (Password: Demo2024!)

After creating the accounts, run this script to populate their profile data.

Alternatively, use the Supabase JavaScript client:

```javascript
// Create demo users
const { data, error } = await supabase.auth.signUp({
  email: 'demo.searcher@easyco.demo',
  password: 'Demo2024!',
  options: {
    data: {
      full_name: 'Emma Searcher',
      user_type: 'searcher'
    }
  }
})
```
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check demo properties
SELECT title, city, monthly_rent, property_type FROM properties WHERE id LIKE 'demo-%';

-- Check demo users
SELECT email, full_name, user_type FROM auth.users WHERE email LIKE '%@easyco.demo';

-- Check demo profiles
SELECT first_name, last_name FROM user_profiles
WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@easyco.demo');

-- ============================================
-- CLEANUP SCRIPT (if needed)
-- ============================================

-- DELETE demo data (uncomment to use)
-- DELETE FROM properties WHERE id LIKE 'demo-%';
-- DELETE FROM user_profiles WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@easyco.demo');
-- Note: Users must be deleted via Supabase Auth Dashboard
