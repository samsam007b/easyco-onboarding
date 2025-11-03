-- Add latitude and longitude to properties table if columns don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE properties ADD COLUMN latitude DECIMAL(10, 8);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE properties ADD COLUMN longitude DECIMAL(11, 8);
  END IF;
END $$;

-- Add approximate coordinates for Brussels properties (demo data)
-- Center of Brussels: 50.8503, 4.3517

-- Update properties with approximate coordinates based on their city
UPDATE properties
SET
  latitude = CASE
    -- Brussels neighborhoods
    WHEN LOWER(city) LIKE '%bruxelles%' OR LOWER(city) LIKE '%brussels%' THEN 50.8503 + (RANDOM() * 0.05 - 0.025)
    WHEN LOWER(city) LIKE '%schaerbeek%' THEN 50.8676 + (RANDOM() * 0.02 - 0.01)
    WHEN LOWER(city) LIKE '%ixelles%' THEN 50.8263 + (RANDOM() * 0.02 - 0.01)
    WHEN LOWER(city) LIKE '%etterbeek%' THEN 50.8361 + (RANDOM() * 0.02 - 0.01)
    WHEN LOWER(city) LIKE '%uccle%' THEN 50.7989 + (RANDOM() * 0.02 - 0.01)
    WHEN LOWER(city) LIKE '%saint-gilles%' THEN 50.8276 + (RANDOM() * 0.02 - 0.01)
    WHEN LOWER(city) LIKE '%anderlecht%' THEN 50.8366 + (RANDOM() * 0.02 - 0.01)
    WHEN LOWER(city) LIKE '%molenbeek%' THEN 50.8583 + (RANDOM() * 0.02 - 0.01)
    -- Other Belgian cities
    WHEN LOWER(city) LIKE '%antwerp%' OR LOWER(city) LIKE '%antwerpen%' THEN 51.2194 + (RANDOM() * 0.05 - 0.025)
    WHEN LOWER(city) LIKE '%ghent%' OR LOWER(city) LIKE '%gent%' THEN 51.0543 + (RANDOM() * 0.05 - 0.025)
    WHEN LOWER(city) LIKE '%liege%' OR LOWER(city) LIKE '%li%ge%' THEN 50.6326 + (RANDOM() * 0.05 - 0.025)
    WHEN LOWER(city) LIKE '%leuven%' THEN 50.8798 + (RANDOM() * 0.03 - 0.015)
    WHEN LOWER(city) LIKE '%namur%' THEN 50.4674 + (RANDOM() * 0.03 - 0.015)
    -- Default to Brussels center
    ELSE 50.8503 + (RANDOM() * 0.1 - 0.05)
  END,
  longitude = CASE
    -- Brussels neighborhoods
    WHEN LOWER(city) LIKE '%bruxelles%' OR LOWER(city) LIKE '%brussels%' THEN 4.3517 + (RANDOM() * 0.05 - 0.025)
    WHEN LOWER(city) LIKE '%schaerbeek%' THEN 4.3732 + (RANDOM() * 0.02 - 0.01)
    WHEN LOWER(city) LIKE '%ixelles%' THEN 4.3661 + (RANDOM() * 0.02 - 0.01)
    WHEN LOWER(city) LIKE '%etterbeek%' THEN 4.3881 + (RANDOM() * 0.02 - 0.01)
    WHEN LOWER(city) LIKE '%uccle%' THEN 4.3448 + (RANDOM() * 0.02 - 0.01)
    WHEN LOWER(city) LIKE '%saint-gilles%' THEN 4.3447 + (RANDOM() * 0.02 - 0.01)
    WHEN LOWER(city) LIKE '%anderlecht%' THEN 4.3124 + (RANDOM() * 0.02 - 0.01)
    WHEN LOWER(city) LIKE '%molenbeek%' THEN 4.3146 + (RANDOM() * 0.02 - 0.01)
    -- Other Belgian cities
    WHEN LOWER(city) LIKE '%antwerp%' OR LOWER(city) LIKE '%antwerpen%' THEN 4.4025 + (RANDOM() * 0.05 - 0.025)
    WHEN LOWER(city) LIKE '%ghent%' OR LOWER(city) LIKE '%gent%' THEN 3.7174 + (RANDOM() * 0.05 - 0.025)
    WHEN LOWER(city) LIKE '%liege%' OR LOWER(city) LIKE '%li%ge%' THEN 5.5797 + (RANDOM() * 0.05 - 0.025)
    WHEN LOWER(city) LIKE '%leuven%' THEN 4.7005 + (RANDOM() * 0.03 - 0.015)
    WHEN LOWER(city) LIKE '%namur%' THEN 4.8719 + (RANDOM() * 0.03 - 0.015)
    -- Default to Brussels center
    ELSE 4.3517 + (RANDOM() * 0.1 - 0.05)
  END
WHERE latitude IS NULL OR longitude IS NULL;

-- Verify the update
SELECT
  COUNT(*) as total_properties,
  COUNT(latitude) as properties_with_lat,
  COUNT(longitude) as properties_with_lng,
  COUNT(CASE WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN 1 END) as properties_with_coordinates
FROM properties;

-- Show sample of updated properties
SELECT id, title, city, latitude, longitude
FROM properties
WHERE latitude IS NOT NULL AND longitude IS NOT NULL
LIMIT 10;
