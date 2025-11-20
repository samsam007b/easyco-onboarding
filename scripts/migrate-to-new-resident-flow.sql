-- Migration: New Resident Creator Flow
-- Allow properties without owners, add invitation codes, track creators

-- 1. Make owner_id nullable (properties can exist without owner)
ALTER TABLE properties
  ALTER COLUMN owner_id DROP NOT NULL;

-- 2. Add invitation codes
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS invitation_code VARCHAR(20) UNIQUE,
  ADD COLUMN IF NOT EXISTS owner_code VARCHAR(50) UNIQUE,
  ADD COLUMN IF NOT EXISTS owner_verified BOOLEAN DEFAULT FALSE;

-- 3. Add is_creator flag to property_members
ALTER TABLE property_members
  ADD COLUMN IF NOT EXISTS is_creator BOOLEAN DEFAULT FALSE;

-- 4. Create function to generate invitation code
CREATE OR REPLACE FUNCTION generate_invitation_code()
RETURNS VARCHAR(20)
LANGUAGE plpgsql
AS $$
DECLARE
  code VARCHAR(20);
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate code like "EZC-4829"
    code := 'EZC-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');

    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM properties WHERE invitation_code = code) INTO exists;

    EXIT WHEN NOT exists;
  END LOOP;

  RETURN code;
END;
$$;

-- 5. Create function to generate owner code
CREATE OR REPLACE FUNCTION generate_owner_code()
RETURNS VARCHAR(50)
LANGUAGE plpgsql
AS $$
DECLARE
  code VARCHAR(50);
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate code like "OWNER-a7f3-9d2e-4c1b"
    code := 'OWNER-' ||
            SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4) || '-' ||
            SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4) || '-' ||
            SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4);

    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM properties WHERE owner_code = code) INTO exists;

    EXIT WHEN NOT exists;
  END LOOP;

  RETURN code;
END;
$$;

-- 6. Update existing properties to have codes (for backward compatibility)
UPDATE properties
SET
  invitation_code = generate_invitation_code(),
  owner_code = generate_owner_code()
WHERE invitation_code IS NULL;

-- 7. Set existing first members as creators (best guess based on created_at)
WITH first_members AS (
  SELECT DISTINCT ON (property_id)
    id, property_id
  FROM property_members
  ORDER BY property_id, created_at ASC
)
UPDATE property_members
SET is_creator = TRUE
WHERE id IN (SELECT id FROM first_members);

-- 8. Verify migration
SELECT
  'Properties with codes' as check_name,
  COUNT(*) as count
FROM properties
WHERE invitation_code IS NOT NULL AND owner_code IS NOT NULL

UNION ALL

SELECT
  'Property creators' as check_name,
  COUNT(*) as count
FROM property_members
WHERE is_creator = TRUE;
