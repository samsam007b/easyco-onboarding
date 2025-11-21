-- ============================================================================
-- COMPLETE ENRICHED SEED - PART 3: PROPERTIES
-- ============================================================================
-- Run this AFTER part 1 and part 2
-- This creates 5 detailed properties with maximum information
-- ============================================================================

DO $$
DECLARE
  jeanmarc_id UUID;
  isabelle_id UUID;
  thomas_id UUID;
  sophie_v_id UUID;
BEGIN

  -- Get owner IDs
  SELECT id INTO jeanmarc_id FROM auth.users WHERE email = 'jeanmarc.petit@demo.easyco.com';
  SELECT id INTO isabelle_id FROM auth.users WHERE email = 'isabelle.moreau@demo.easyco.com';
  SELECT id INTO thomas_id FROM auth.users WHERE email = 'thomas.janssens@demo.easyco.com';
  SELECT id INTO sophie_v_id FROM auth.users WHERE email = 'sophie.vermeulen@demo.easyco.com';

  -- ============================================================================
  -- PROPERTY #1 - APPARTEMENT 2 CHAMBRES IXELLES (Jean-Marc)
  -- ============================================================================
  -- Renovated apartment, Flagey area, perfect for young professionals/couples

  RAISE NOTICE '🏘️  Creating Property: Appartement 2ch Ixelles...';

  INSERT INTO properties (
    owner_id, title, description, property_type,
    address, city, neighborhood, postal_code, country,
    latitude, longitude,
    bedrooms, bathrooms, total_rooms, surface_area,
    floor_number, total_floors, furnished,
    monthly_rent, charges, deposit,
    available_from, minimum_stay_months, maximum_stay_months,
    amenities, smoking_allowed, pets_allowed, couples_allowed,
    children_allowed, images, main_image,
    status, is_available
  ) VALUES (
    jeanmarc_id,
    'Appartement Rénové 2 Chambres - Ixelles Flagey ✨',
    E'🏡 COUP DE CŒUR - Magnifique appartement de 85m² entièrement rénové en 2022 au cœur du quartier Flagey

📍 EMPLACEMENT IDÉAL
Situé dans le quartier le plus dynamique d''Ixelles, à 2 minutes à pied de la place Flagey et ses nombreux cafés, restaurants et commerces. Quartier vivant, culturel et parfaitement desservi par les transports en commun.

🏠 L''APPARTEMENT
• 2 grandes chambres lumineuses (15m² et 12m²)
• 1 spacieux salon/salle à manger de 28m² avec parquet massif
• Cuisine entièrement équipée (lave-vaisselle, four, micro-ondes, réfrigérateur)
• Salle de bain moderne avec douche italienne
• WC séparé
• Grand balcon de 6m² orienté SUD (soleil l''après-midi!)
• Cave privative pour stockage

✨ RÉNOVATION COMPLÈTE 2022
• Parquet massif dans toutes les pièces
• Double vitrage PVC
• Chauffage central gaz (très économique)
• Isolation renforcée (classe énergétique B)
• Peintures fraîches couleurs neutres
• Luminaires design LED

🎯 ÉQUIPEMENTS & COMMODITÉS
• Internet Fibre 500Mb/s inclus
• Lave-linge Bosch
• Lave-vaisselle Siemens
• Four micro-ondes
• Aspirateur Dyson fourni
• Fer à repasser + planche
• Nécessaire de cuisine complet

📱 TRANSPORTS & COMMODITÉS
• Tram 81: 100m (Place Flagey)
• Bus 38, 59, 60, 71: 150m
• Métro Porte de Namur: 12 min à pied
• Supermarché Delhaize: 200m
• Pharmacie, boulangerie, cafés: à 50m
• Cinéma Flagey: 200m
• Parc du Cinquantenaire: 15 min à vélo

💚 LE QUARTIER FLAGEY
Quartier cosmopolite et vivant, apprécié des jeunes professionnels et expatriés. Nombreux bars, restaurants internationaux, marchés bio. Ambiance conviviale et sécurisée. Idéal pour profiter de la vie bruxelloise!

👤 LOCATAIRES RECHERCHÉS
Jeunes professionnels, couples ou colocataires sérieux. Non-fumeurs. Revenus stables requis (minimum 3x le loyer). Excellent état général exigé. Bail minimum 6 mois.',
    'apartment',
    'Avenue de la Couronne 234',
    'Ixelles',
    'Flagey',
    '1050',
    'Belgium',
    50.8272,
    4.3719,
    2, -- bedrooms
    1, -- bathrooms
    5, -- total rooms (2 bed + 1 living + 1 kitchen + 1 bath)
    85, -- m²
    2, -- floor
    4, -- total floors
    true, -- furnished
    1250.00, -- rent
    150.00, -- charges (internet, building fees, water)
    2500.00, -- deposit (2 months)
    '2024-12-01', -- available from
    6, -- minimum stay
    24, -- maximum stay
    '["wifi", "fiber_internet", "elevator", "balcony", "dishwasher", "washing_machine", "heating_central", "furnished", "double_glazing", "parquet", "cellar", "bike_storage", "intercom", "secure_door"]'::jsonb,
    false, -- no smoking
    false, -- no pets
    true, -- couples allowed
    false, -- no children (2 bedrooms only)
    ARRAY[
      'https://images.unsplash.com/photo-1502672260066-6bc36a8baf37?w=800',
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800',
      'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'
    ],
    'https://images.unsplash.com/photo-1502672260066-6bc36a8baf37?w=800',
    'published',
    true
  );

  -- ============================================================================
  -- PROPERTY #2 - STUDIO SCHAERBEEK (Thomas)
  -- ============================================================================
  -- Student-friendly studio, budget-friendly, near ULB

  RAISE NOTICE '🏘️  Creating Property: Studio Schaerbeek...';

  INSERT INTO properties (
    owner_id, title, description, property_type,
    address, city, neighborhood, postal_code, country,
    latitude, longitude,
    bedrooms, bathrooms, total_rooms, surface_area,
    floor_number, total_floors, furnished,
    monthly_rent, charges, deposit,
    available_from, minimum_stay_months, maximum_stay_months,
    amenities, smoking_allowed, pets_allowed, couples_allowed,
    children_allowed, images, main_image,
    status, is_available
  ) VALUES (
    thomas_id,
    'Studio Moderne Schaerbeek - Idéal Étudiant 🎓',
    E'🎓 PARFAIT POUR ÉTUDIANT(E) - Studio fonctionnel de 35m² récemment rénové

📍 SUPER LOCALISATION
Quartier Diamant à Schaerbeek, très bien desservi. À 15 minutes de l''ULB en métro, 20 minutes de la VUB en tram. Quartier multiculturel, vivant et sécurisé avec tous commerces à proximité.

🏠 LE STUDIO
• Grande pièce principale de 25m² (espace nuit + salon)
• Coin cuisine équipé (plaques, frigo, micro-ondes)
• Salle de bain avec douche
• Nombreux rangements intégrés
• Grande fenêtre double vitrage orientée EST (lumineux le matin)

✨ ATOUTS
• Rénové en 2023
• Internet Wi-Fi INCLUS (100Mb/s)
• Chauffage gaz individuel avec thermostat
• Très lumineux et calme (cour intérieure)
• Meublé et équipé, prêt à vivre!

🛋️ MOBILIER FOURNI
• Lit 140x200 avec matelas neuf
• Bureau IKEA + chaise confortable
• Armoire 2 portes + étagères
• Petite table + 2 chaises
• Lampes de bureau et de chevet
• Rideaux occultants

📱 PROXIMITÉ
• Métro Diamant: 400m (ligne 3)
• Tram 25, 62: 200m
• Bus 66: 100m
• Supermarché Colruyt: 300m
• Boulangeries, kebabs, pizzerias: 50m
• Bibliothèque communale: 500m
• ULB Solbosch: 15 min en métro
• VUB: 20 min en tram

💰 BUDGET ÉTUDIANT
Loyer TTC charges comprises: 730€ (loyer 650€ + charges 80€)
Pas de mauvaise surprise! Charges incluent: eau, chauffage, internet, poubelles
Dépôt: 1300€ (2 mois)
Garantie locative ou garant parental acceptés

👤 PROFIL RECHERCHÉ
Étudiant(e) sérieux/sérieuse, calme et soigné(e). Garant parental requis. Non-fumeur. Bail 9-10 mois (année scolaire) possible. Propriétaire flexible et compréhensif.',
    'studio',
    'Rue Josaphat 145',
    'Schaerbeek',
    'Diamant',
    '1030',
    'Belgium',
    50.8571,
    4.3836,
    0, -- studio (no separate bedroom)
    1,
    2, -- total rooms (main + bath)
    35,
    3, -- floor
    5,
    true,
    650.00,
    80.00, -- water, heating, internet included
    1300.00,
    '2025-01-01',
    3, -- minimum 3 months (flexible for students)
    12,
    '["wifi", "furnished", "heating", "double_glazing", "storage", "desk", "close_to_university", "quiet", "bright"]'::jsonb,
    false,
    false,
    false, -- no couples (too small)
    false,
    ARRAY[
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
      'https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=800'
    ],
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'published',
    true
  );

  -- ============================================================================
  -- PROPERTY #3 - COLIVING FOREST (Sophie V.)
  -- ============================================================================
  -- Community house, international, garden, 6 rooms

  RAISE NOTICE '🏘️  Creating Property: Coliving Forest...';

  INSERT INTO properties (
    owner_id, title, description, property_type,
    address, city, neighborhood, postal_code, country,
    latitude, longitude,
    bedrooms, bathrooms, total_rooms, surface_area,
    floor_number, total_floors, furnished,
    monthly_rent, charges, deposit,
    available_from, minimum_stay_months, maximum_stay_months,
    amenities, smoking_allowed, pets_allowed, couples_allowed,
    children_allowed, images, main_image,
    status, is_available
  ) VALUES (
    sophie_v_id,
    'Coliving Maison de Maître - Forest 🌿 Jardin 200m²',
    E'🏡 COLIVING PREMIUM - Magnifique maison de maître de 280m² transformée en espace de coliving moderne

🌟 CONCEPT UNIQUE
Nous avons créé un espace de coliving exceptionnel dans une maison de maître de 1920. 6 chambres privées spacieuses + espaces communs généreux. Ambiance internationale, conviviale et respectueuse. Nous organisons des dîners communautaires mensuels, des soirées ciné et des BBQ l''été!

🏠 LA MAISON
• 6 chambres privées (12 à 18m²) entièrement meublées
• 3 salles de bain complètes + 1 WC séparé
• Salon de 40m² avec cheminée et espace TV
• Salle à manger de 30m² avec grande table pour 12 personnes
• Cuisine professionnelle ultra-équipée (2 frigos, 2 fours, lave-vaisselle commercial)
• Buanderie avec 2 lave-linge et sèche-linge
• Bureau/bibliothèque de 20m²
• Cave aménagée (stockage vélos et affaires)
• JARDIN EXCEPTIONNEL de 200m² avec terrasse, BBQ, tables, transats

✨ ÉQUIPEMENTS PREMIUM
• Internet Fibre 1Gb/s dans toute la maison
• Netflix, Spotify Premium partagés
• Cuisine équipée: mixeur, robot, machine à café, théière...
• Produits communs fournis: PQ, sopalin, produits ménage, épices
• Lave-linge & sèche-linge professionnels
• Aspirateurs par étage
• Système de son dans le salon
• Projecteur home cinema

🌱 VIE COMMUNAUTAIRE
• Dîner commun 1x/mois (chacun son tour cuisine)
• Groupe WhatsApp actif
• Board games & Netflix soirées
• BBQ d''été dans le jardin
• Anniversaires et événements célébrés ensemble
• Respect de l''intimité de chacun

👥 LA COMMUNAUTÉ ACTUELLE
5 colocataires internationaux (25-35 ans):
• Max (Belgique) - Dev startup
• Laura (Espagne) - Doctorante biologie
• Erik (Allemagne) - Designer
• Amira (Maroc) - Policy advisor
• Léa (France) - Architecte

📍 QUARTIER FOREST
Quartier résidentiel calme avec tous commerces. Parc Duden à 5 min à pied. Excellentes connexions transport: tram 82 (3 min), bus 48, 54, STIB Altitude 100 (8 min). 15 min du centre en tram.

🚇 TRANSPORTS
• Tram 82: 200m
• Bus 48, 54: 250m
• Gare Forest-Est: 800m
• Centre-ville: 15 min en tram
• ULB: 20 min
• Commission Européenne: 25 min

💰 TARIF ALL-INCLUSIVE
695€/mois + 200€ charges = 895€ TOUT COMPRIS
Charges incluent: eau, chauffage, électricité, internet fiber 1Gb, Netflix, Spotify, produits communs, entretien jardin, ménage parties communes 2x/mois

👤 PROFIL RECHERCHÉ
Personnes ouvertes d''esprit (25-35 ans), internationales, sociables mais respectueuses. Actif professionnellement ou en études. Envie de faire partie d''une vraie communauté. Non-fumeur inside (fumeurs acceptés dans le jardin). Animaux bienvenus (après rencontre)!',
    'coliving',
    'Avenue Besme 89',
    'Forest',
    'Altitude 100',
    '1190',
    'Belgium',
    50.8143,
    4.3142,
    6, -- 6 private bedrooms
    3, -- 3 full bathrooms
    12, -- many rooms
    280,
    0, -- ground floor + 2 levels
    2,
    true,
    695.00, -- per room
    200.00, -- all-inclusive: utilities, internet, Netflix, cleaning, garden
    1390.00,
    '2024-11-15',
    3, -- minimum 3 months
    24,
    '["wifi_fiber", "garden_200m2", "bbq", "laundry", "dryer", "dishwasher", "washing_machine", "heating_central", "furnished", "common_areas", "home_cinema", "fireplace", "bike_storage", "shared_living", "international_community", "cleaning_included", "netflix", "spotify"]'::jsonb,
    false, -- smoking outside only
    true, -- pets allowed after meeting
    false, -- single rooms
    false,
    ARRAY[
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800'
    ],
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    'published',
    true
  );

  -- ============================================================================
  -- PROPERTY #4 - APPARTEMENT 3CH WOLUWE (Isabelle)
  -- ============================================================================
  -- Luxury apartment, high standing, perfect for couples/families

  RAISE NOTICE '🏘️  Creating Property: Appartement 3ch Woluwe...';

  INSERT INTO properties (
    owner_id, title, description, property_type,
    address, city, neighborhood, postal_code, country,
    latitude, longitude,
    bedrooms, bathrooms, total_rooms, surface_area,
    floor_number, total_floors, furnished,
    monthly_rent, charges, deposit,
    available_from, minimum_stay_months, maximum_stay_months,
    amenities, smoking_allowed, pets_allowed, couples_allowed,
    children_allowed, images, main_image,
    status, is_available
  ) VALUES (
    isabelle_id,
    'Appartement de Standing 3ch - Woluwe Montgomery 👑',
    E'👑 PRESTIGE & CONFORT - Spacieux 3 chambres de 120m² dans résidence moderne et sécurisée

🌟 STANDING EXCEPTIONNEL
Résidence de 2018 avec services haut de gamme. Appartement au 4ème étage avec ascenseur, vue dégagée, terrasse de 15m². Idéal pour couple ou petite famille recherchant confort, sécurité et qualité de vie.

🏠 L''APPARTEMENT (120m²)
• 3 grandes chambres (16m², 14m², 12m²) avec placards intégrés
• Salon/séjour de 35m² très lumineux
• Cuisine ouverte entièrement équipée (Bosch, Miele)
• 2 salles de bain (1 avec baignoire, 1 avec douche)
• 2 WC séparés
• Terrasse de 15m² orientée SUD-OUEST (soleil après-midi/soir)
• Cave privative de 8m²
• Parking intérieur (1 place incluse)

✨ ÉQUIPEMENTS PREMIUM
• Cuisine Bosch/Miele: lave-vaisselle, four, micro-ondes, plaque induction
• 2 réfrigérateurs (américain + classique)
• Lave-linge et sèche-linge Miele
• Aspirateur central intégré
• Domotique (volets, lumières, chauffage via app)
• Vidéophone dernière génération
• Plancher chauffant dans toutes les pièces
• Climatisation réversible
• Double vitrage haute performance
• Parquet chêne massif et carrelage italien

🏢 SERVICES RÉSIDENCE
• Gardien/concierge 7j/7
• Vidéosurveillance 24/7
• Salle de fitness équipée (accès gratuit)
• Espace vélos sécurisé
• Local poussettes
• Packages courrier gardés
• Espaces verts communs entretenus
• Parking visiteurs

📍 QUARTIER MONTGOMERY - WOLUWE
Quartier résidentiel huppé, calme et verdoyant. À 2 min du métro Montgomery, 5 min du Parc de Woluwe (180 hectares). Zone sécurisée, idéale familles. Nombreuses écoles internationales à proximité.

🚇 TRANSPORTS EXCEPTIONNELS
• Métro Montgomery (lignes 1 et 5): 250m - 2 min à pied!
• Bus 36, 61, 79, 80: 150m
• Schuman/Institutions EU: 2 stations de métro (5 min)
• Aéroport Zaventem: 15 min en voiture
• Ring E40: 5 min
• Centre-ville: 15 min en métro

🛍️ COMMERCES & SERVICES
• Carrefour Express: 100m
• Delhaize: 300m
• Pharmacie, boulangerie, pressing: dans l''immeuble!
• Restaurants gastronomiques: à 200m
• Banques: 150m
• Médecins, dentistes: dans le quartier
• Écoles internationales: 500m-1km

🌳 LOISIRS & NATURE
• Parc de Woluwe: 400m (180 hectares, lac, aires de jeux)
• Piscine Wolu-Sports: 800m
• Tennis clubs: 1km
• Golfs: 5-10km
• Cinéma Aventure: 2km

💰 CONDITIONS FINANCIÈRES
Loyer: 1800€
Charges: 250€ (eau, chauffage, communs, parking, fitness)
Total: 2050€/mois
Dépôt: 3600€ (2 mois)
Bail minimum: 12 mois
Frais d''agence: 1 mois de loyer + TVA

📋 DOSSIER REQUIS
• 3 derniers bulletins de salaire
• Contrat de travail
• Extraits de compte (3 mois)
• Composition de ménage
• Pièce d''identité
• Check des antécédents de crédit (pas bloquant si expliqué)

👤 PROFIL RECHERCHÉ
Couple ou famille avec revenus stables (minimum 6300€/mois). Professionnels, expatriés, cadres. Sérieux, soigneux, long terme. Références exigées. Non-fumeurs préférés.',
    'apartment',
    'Avenue de Tervueren 412',
    'Woluwe-Saint-Pierre',
    'Montgomery',
    '1150',
    'Belgium',
    50.8429,
    4.4089,
    3,
    2,
    8, -- 3 bed + living + kitchen + 2 bath + 2 wc + terrace
    120,
    4,
    6,
    true,
    1800.00,
    250.00,
    3600.00,
    '2025-02-01',
    12, -- long term preferred
    36,
    '["wifi", "fiber_internet", "elevator", "parking_included", "gym_access", "terrace_15m2", "concierge", "security_24_7", "video_surveillance", "dishwasher", "washing_machine", "dryer", "air_conditioning", "floor_heating", "heating_central", "furnished", "double_glazing", "parquet_oak", "italian_tiles", "smart_home", "cellar", "bike_storage"]'::jsonb,
    false,
    false, -- no pets (building rules)
    true,
    true, -- families welcome
    ARRAY[
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'
    ],
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'published',
    true
  );

  -- ============================================================================
  -- PROPERTY #5 - MAISON 4CH SAINT-GILLES (Isabelle)
  -- ============================================================================
  -- Typical Brussels house, character, garden, colocation 4 people

  RAISE NOTICE '🏘️  Creating Property: Maison 4ch Saint-Gilles...';

  INSERT INTO properties (
    owner_id, title, description, property_type,
    address, city, neighborhood, postal_code, country,
    latitude, longitude,
    bedrooms, bathrooms, total_rooms, surface_area,
    floor_number, total_floors, furnished,
    monthly_rent, charges, deposit,
    available_from, minimum_stay_months, maximum_stay_months,
    amenities, smoking_allowed, pets_allowed, couples_allowed,
    children_allowed, images, main_image,
    status, is_available
  ) VALUES (
    isabelle_id,
    'Maison Bruxelloise 4ch - Saint-Gilles Parvis 🎨 Jardin',
    E'🎨 CHARME & AUTHENTICITÉ - Belle maison bruxelloise typique de 150m² sur 3 niveaux avec jardin

🏡 CARACTÈRE BRUXELLOIS
Maison de maître typique de 1900 préservant son cachet d''origine: parquet, moulures, cheminées, vitraux. Entièrement rénovée en 2020 tout en conservant son âme. 4 grandes chambres, parfaite pour colocation de qualité ou grande famille.

🏠 LA MAISON (150m² - 3 niveaux)

REZ-DE-CHAUSSÉE:
• Hall d''entrée avec vitraux d''époque
• Salon de 25m² avec cheminée et parquet massif
• Salle à manger de 20m² ouverte sur le jardin
• Cuisine équipée de 15m²
• WC séparé

1ER ÉTAGE:
• Chambre 1: 18m² (master avec balconnet)
• Chambre 2: 16m²
• Salle de bain complète avec baignoire et douche
• WC séparé

2ÈME ÉTAGE (sous combles aménagés):
• Chambre 3: 15m² avec velux
• Chambre 4: 14m² avec velux
• Salle de bain avec douche
• Espace buanderie

EXTÉRIEUR:
• Jardin de 80m² orienté SUD (soleil toute la journée!)
• Terrasse en bois de 20m²
• Abri vélos/moto
• Petit potager urbain aménagé
• Barbecue fixe

✨ CACHET & RÉNOVATION
• Parquet d''époque restauré
• Moulures et rosaces au plafond
• 2 cheminées fonctionnelles (salon et master)
• Vitraux d''origine
• Hauts plafonds (3m10 au RDC)
• Cuisine moderne équipée (2020)
• 2 salles de bain rénovées
• Double vitrage bois
• Isolation renforcée

🛋️ ÉQUIPEMENTS
• Cuisine: lave-vaisselle, four, plaque induction, grand frigo-congélateur
• Lave-linge et sèche-linge
• Chaudière gaz condensation récente
• Radiateurs dans toutes les pièces
• Internet VDSL 100Mb/s
• Stores et rideaux
• Cave pour stockage

🎨 QUARTIER PARVIS - SAINT-GILLES
Quartier artistique et multiculturel, cœur vibrant de Saint-Gilles. Cafés branchés, restaurants du monde, galeries d''art, cinéma. Ambiance bohème et cosmopolite. Marché du Parvis le dimanche. Idéal jeunes actifs et créatifs.

🚇 TRANSPORTS
• Tram 3, 4, 51, 81, 82, 97: Place Parvis (100m)
• Pré-métro: Parvis (150m)
• Bus 48: 200m
• Gare du Midi: 10 min en tram
• Centre-ville: 10 min en tram
• ULB: 15 min

🛍️ VIE DE QUARTIER
• Marché du Parvis (dimanche matin): 100m
• Supermarché Carrefour Express: 150m
• Boulangeries artisanales: nombreuses
• Restaurants: cuisine du monde à gogo!
• Cafés: Le Pantin, Le Parvis, La Porteuse d''Eau
• Cinéma Vendôme: 300m
• Parc de Forest: 800m

💰 COLOCATION IDÉALE 4 PERSONNES
Loyer total: 2100€
Charges: 200€ (eau, chauffage, poubelles)
Total: 2300€/mois
➡️ Soit 575€ par personne (charges comprises)!
Dépôt: 4200€ (2 mois)
Bail: 12 mois minimum

📋 FORMULE COLOCATION
Idéal pour colocation de 4 personnes (couples acceptés dans master)
Revenus cumulés minimum: 7000€/mois
Garantie locative solidaire ou 2 garants
Dossier complet requis pour chaque colocataire

👥 PROFIL RECHERCHÉ
Jeunes professionnels ou couples (25-40 ans), revenus stables, soigneux et respectueux. Colocation mature et organisée. Amoureux du cachet bruxellois et du quartier artistique. Envie de jardiner un plus! Non-fumeurs préférés (fumeurs OK dans le jardin). Animaux OK après discussion.',
    'house',
    'Rue de la Victoire 78',
    'Saint-Gilles',
    'Parvis',
    '1060',
    'Belgium',
    50.8283,
    4.3456,
    4,
    2,
    11, -- 4 bed + living + dining + kitchen + 2 bath + 2 wc + laundry
    150,
    0, -- 3 levels starting from ground
    2, -- +2 levels above ground
    false, -- unfurnished (or partially)
    2100.00,
    200.00,
    4200.00,
    '2024-12-15',
    12,
    36,
    '["wifi", "garden_80m2", "terrace_wood", "bbq", "laundry", "dryer", "dishwasher", "washing_machine", "heating_gas", "fireplace_x2", "parquet", "high_ceilings", "period_features", "double_glazing", "cellar", "bike_storage", "vegetable_garden", "balconies"]'::jsonb,
    false, -- smoking outside only
    true, -- pets after discussion
    true,
    true,
    ARRAY[
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
      'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
    ],
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    'published',
    true
  );

  RAISE NOTICE '✅ All 5 PROPERTIES created with maximum details!';

  -- ============================================================================
  -- FINAL SUMMARY
  -- ============================================================================

  RAISE NOTICE '==================================================================';
  RAISE NOTICE '✅ PROPERTIES COMPLETE!';
  RAISE NOTICE '==================================================================';
  RAISE NOTICE '1. Appt 2ch Ixelles Flagey - 1250€ (Jean-Marc)';
  RAISE NOTICE '2. Studio Schaerbeek Diamant - 650€ (Thomas)';
  RAISE NOTICE '3. Coliving Forest 6ch - 695€/room (Sophie V.)';
  RAISE NOTICE '4. Appt 3ch Woluwe Standing - 1800€ (Isabelle)';
  RAISE NOTICE '5. Maison 4ch Saint-Gilles - 2100€ (Isabelle)';
  RAISE NOTICE '==================================================================';

END $$;

-- Final Verification
SELECT
  p.title,
  '€' || p.monthly_rent as rent,
  p.city,
  p.neighborhood,
  p.bedrooms || ' bed, ' || p.surface_area || 'm²' as details,
  up.first_name || ' ' || up.last_name as owner
FROM properties p
JOIN user_profiles up ON p.owner_id = up.user_id
WHERE up.user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%@demo.easyco.com'
)
ORDER BY p.monthly_rent;

SELECT '✅ ALL ENRICHED DATA CREATED!' as status;
