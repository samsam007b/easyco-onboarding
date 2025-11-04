-- Vérification rapide des résidents
SELECT
  p.title,
  COUNT(pr.id) as nb_residents,
  STRING_AGG(pr.first_name || ' ' || pr.last_name, ', ') as residents_names
FROM properties p
LEFT JOIN property_residents pr ON p.id = pr.property_id
GROUP BY p.id, p.title
ORDER BY p.created_at DESC
LIMIT 5;

-- Voir quelques résidents
SELECT
  pr.first_name,
  pr.last_name,
  pr.occupation,
  p.title as property
FROM property_residents pr
JOIN properties p ON pr.property_id = p.id
LIMIT 10;
