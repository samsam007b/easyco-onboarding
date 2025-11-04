-- Quelle propriété a des chambres?
SELECT
  p.id,
  p.title,
  COUNT(pr.id) as nombre_chambres
FROM properties p
LEFT JOIN property_rooms pr ON p.id = pr.property_id
GROUP BY p.id, p.title
HAVING COUNT(pr.id) > 0
ORDER BY p.created_at DESC;

-- Vérifier spécifiquement Ixelles Flagey
SELECT
  'IXELLES FLAGEY' as check,
  p.id,
  p.title,
  (SELECT COUNT(*) FROM property_rooms WHERE property_id = p.id) as nb_chambres,
  (SELECT COUNT(*) FROM property_costs WHERE property_id = p.id) as nb_couts,
  (SELECT COUNT(*) FROM property_lifestyle_metrics WHERE property_id = p.id) as nb_metrics
FROM properties p
WHERE p.title ILIKE '%Ixelles%' OR p.title ILIKE '%Flagey%';
