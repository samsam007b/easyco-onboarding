-- Vérifier si des résidents existent pour nos propriétés
SELECT
  '1️⃣ RÉSIDENTS PAR PROPRIÉTÉ' as section,
  p.id,
  p.title,
  COUNT(pr.id) as nb_residents
FROM properties p
LEFT JOIN property_residents pr ON p.id = pr.property_id
GROUP BY p.id, p.title
ORDER BY p.created_at DESC
LIMIT 5;

-- Vérifier si la table property_residents existe
SELECT
  '2️⃣ STRUCTURE TABLE RESIDENTS' as section,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'property_residents'
ORDER BY ordinal_position;

-- Voir tous les résidents existants
SELECT
  '3️⃣ TOUS LES RÉSIDENTS' as section,
  pr.*
FROM property_residents pr
LIMIT 10;
