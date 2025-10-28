-- ============================================================================
-- UPDATE PROPERTY IMAGES - Real free stock photos from Unsplash
-- ============================================================================
-- This script updates all demo properties with realistic interior/exterior photos
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================================

-- Helper function to get property by title
CREATE OR REPLACE FUNCTION get_property_id_by_title(property_title TEXT)
RETURNS UUID AS $$
DECLARE
  prop_id UUID;
BEGIN
  SELECT id INTO prop_id FROM properties WHERE title = property_title;
  RETURN prop_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Property 1: Appartement 2 Chambres - Ixelles Flagey
-- Modern, bright apartment in trendy neighborhood
-- ============================================================================

UPDATE properties
SET
  images = ARRAY[
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',  -- Modern living room
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',  -- Bright bedroom
    'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=1200&q=80',  -- Kitchen with dining
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',  -- Modern bathroom
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80'   -- Balcony view
  ],
  main_image = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80'
WHERE title = 'Appartement 2 Chambres - Ixelles Flagey';

-- ============================================================================
-- Property 2: Studio Schaerbeek - Quartier Diamant
-- Compact, functional student studio
-- ============================================================================

UPDATE properties
SET
  images = ARRAY[
    'https://images.unsplash.com/photo-1551806235-a05dd14a54c7?w=1200&q=80',  -- Studio main area
    'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=80',  -- Cozy bedroom corner
    'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=1200&q=80',  -- Kitchenette
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'   -- Workspace area
  ],
  main_image = 'https://images.unsplash.com/photo-1551806235-a05dd14a54c7?w=1200&q=80'
WHERE title = 'Studio Schaerbeek - Quartier Diamant';

-- ============================================================================
-- Property 3: Coliving Forest - Maison Communautaire
-- Spacious house with shared spaces and garden
-- ============================================================================

UPDATE properties
SET
  images = ARRAY[
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',  -- House exterior
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',  -- Spacious living room
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&q=80',  -- Communal kitchen
    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80',  -- Private bedroom
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80',  -- Dining area
    'https://images.unsplash.com/photo-1585128792138-f10853655ca0?w=1200&q=80'   -- Garden
  ],
  main_image = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'
WHERE title = 'Coliving Forest - Maison Communautaire';

-- ============================================================================
-- Property 4: Appartement 3 Chambres - Woluwe Standing
-- High-end, spacious apartment with modern finishes
-- ============================================================================

UPDATE properties
SET
  images = ARRAY[
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',  -- Luxury living room
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80',  -- Master bedroom
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',  -- Modern bathroom
    'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=1200&q=80',  -- Gourmet kitchen
    'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=1200&q=80',  -- Second bedroom
    'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&q=80'   -- Terrace
  ],
  main_image = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80'
WHERE title = 'Appartement 3 Chambres - Woluwe Standing';

-- ============================================================================
-- Property 5: Maison 4 Chambres - Saint-Gilles Parvis
-- Traditional Brussels townhouse with character
-- ============================================================================

UPDATE properties
SET
  images = ARRAY[
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80',  -- House exterior
    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80',  -- Living room with fireplace
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80',  -- Traditional kitchen
    'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80',  -- Master bedroom
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',  -- Bathroom
    'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=1200&q=80',  -- Second bedroom
    'https://images.unsplash.com/photo-1585128792138-f10853655ca0?w=1200&q=80'   -- Garden
  ],
  main_image = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80'
WHERE title = 'Maison 4 Chambres - Saint-Gilles Parvis';

-- Cleanup
DROP FUNCTION IF EXISTS get_property_id_by_title(TEXT);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT
  title,
  array_length(images, 1) as image_count,
  CASE
    WHEN main_image IS NOT NULL THEN '✅ Set'
    ELSE '❌ Missing'
  END as main_image_status
FROM properties
WHERE title LIKE '%Ixelles%'
   OR title LIKE '%Schaerbeek%'
   OR title LIKE '%Forest%'
   OR title LIKE '%Woluwe%'
   OR title LIKE '%Saint-Gilles%'
ORDER BY monthly_rent;

-- Show first 2 images per property
SELECT
  title,
  city,
  main_image as "Main Image URL",
  images[1] as "Image 1",
  images[2] as "Image 2"
FROM properties
WHERE title LIKE '%Ixelles%'
   OR title LIKE '%Schaerbeek%'
   OR title LIKE '%Forest%'
   OR title LIKE '%Woluwe%'
   OR title LIKE '%Saint-Gilles%'
ORDER BY monthly_rent;
