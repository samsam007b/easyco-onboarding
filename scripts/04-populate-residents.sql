-- ============================================================================
-- PEUPLER LES 5 PROPRIÉTÉS AVEC DES RÉSIDENTS VARIÉS
-- ============================================================================

DO $$
DECLARE
  property_ids UUID[];
  prop1_id UUID; -- Party House
  prop2_id UUID; -- Zen House
  prop3_id UUID; -- Family House
  prop4_id UUID; -- Professional House
  prop5_id UUID; -- Student House
BEGIN
  -- Récupérer les IDs des 5 propriétés
  SELECT ARRAY_AGG(id ORDER BY created_at DESC)
  INTO property_ids
  FROM properties
  LIMIT 5;

  prop1_id := property_ids[1];
  prop2_id := property_ids[2];
  prop3_id := property_ids[3];
  prop4_id := property_ids[4];
  prop5_id := property_ids[5];

  -- ========================================================================
  -- PROPRIÉTÉ 1: "Party House" - Jeunes festifs et sociaux
  -- ========================================================================
  INSERT INTO property_residents (property_id, first_name, last_name, age, gender, occupation, bio, photo_url, interests, languages, is_smoker, has_pets, cleanliness_level, noise_tolerance, social_preference) VALUES
  (prop1_id, 'Lucas', 'Martin', 24, 'Homme', 'DJ & Producteur', 'Passionné de musique électro, j''organise des soirées et j''adore rencontrer de nouvelles personnes. Toujours partant pour une sortie!', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80', ARRAY['Musique', 'Festivals', 'Sorties', 'Gaming', 'Sport'], ARRAY['Français', 'Anglais', 'Espagnol'], true, false, 4, 9, 10),

  (prop1_id, 'Emma', 'Dubois', 23, 'Femme', 'Étudiante en Communication', 'Toujours de bonne humeur, j''aime organiser des soirées à la maison. Je suis sociable et j''adore cuisiner pour mes colocs!', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80', ARRAY['Cuisine', 'Yoga', 'Photographie', 'Voyages'], ARRAY['Français', 'Anglais'], false, false, 5, 8, 9),

  (prop1_id, 'Maxime', 'Leroy', 25, 'Homme', 'Développeur Web', 'Gamer le soir, sociable en soirée. J''aime alterner entre gaming sessions et sorties entre colocs. Toujours partant pour un apéro!', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80', ARRAY['Gaming', 'Tech', 'Bière artisanale', 'Cinéma'], ARRAY['Français', 'Anglais', 'Néerlandais'], false, false, 4, 8, 8);

  -- ========================================================================
  -- PROPRIÉTÉ 2: "Zen House" - Calmes, studieux, propres
  -- ========================================================================
  INSERT INTO property_residents (property_id, first_name, last_name, age, gender, occupation, bio, photo_url, interests, languages, is_smoker, has_pets, cleanliness_level, noise_tolerance, social_preference) VALUES
  (prop2_id, 'Sophie', 'Bernard', 28, 'Femme', 'Professeure de Yoga', 'Je valorise la paix et la propreté. J''aime méditer le matin et maintenir un espace harmonieux. Recherche colocs respectueux et calmes.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80', ARRAY['Yoga', 'Méditation', 'Lecture', 'Cuisine saine'], ARRAY['Français', 'Anglais', 'Italien'], false, false, 10, 2, 3),

  (prop2_id, 'Thomas', 'Petit', 27, 'Homme', 'Chercheur PhD', 'Doctorant en biologie, je passe beaucoup de temps à étudier. Je recherche un environnement calme et ordonné pour me concentrer.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&q=80', ARRAY['Sciences', 'Lecture', 'Échecs', 'Randonnée'], ARRAY['Français', 'Anglais', 'Allemand'], false, false, 9, 2, 4),

  (prop2_id, 'Marie', 'Laurent', 26, 'Femme', 'Architecte', 'Perfectionniste et organisée. J''aime un espace bien rangé et calme pour dessiner mes projets. Recherche des colocs respectueux.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&q=80', ARRAY['Design', 'Architecture', 'Art', 'Musées'], ARRAY['Français', 'Anglais'], false, false, 10, 1, 3);

  -- ========================================================================
  -- PROPRIÉTÉ 3: "Family House" - Équilibré, familial, animaux OK
  -- ========================================================================
  INSERT INTO property_residents (property_id, first_name, last_name, age, gender, occupation, bio, photo_url, interests, languages, is_smoker, has_pets, cleanliness_level, noise_tolerance, social_preference) VALUES
  (prop3_id, 'Julie', 'Moreau', 30, 'Femme', 'Vétérinaire', 'J''ai un adorable golden retriever nommé Max. J''aime l''équilibre entre moments conviviaux et temps calme. Animal lover!', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80', ARRAY['Animaux', 'Randonnée', 'Cuisine', 'Jardinage'], ARRAY['Français', 'Anglais', 'Espagnol'], false, true, 7, 6, 6),

  (prop3_id, 'Pierre', 'Rousseau', 29, 'Homme', 'Professeur d''Histoire', 'Calme mais sociable. J''aime partager des repas en commun et discuter de tout. Respectueux et ouvert d''esprit.', 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop&q=80', ARRAY['Histoire', 'Lecture', 'Voyages', 'Cuisine'], ARRAY['Français', 'Anglais', 'Italien'], false, false, 7, 5, 6),

  (prop3_id, 'Laura', 'Simon', 28, 'Femme', 'Infirmière', 'Je travaille en horaires décalés mais je suis très respectueuse. J''aime la vie en coloc et les moments de partage quand je suis libre.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80', ARRAY['Soins', 'Lecture', 'Séries TV', 'Cuisine'], ARRAY['Français', 'Anglais'], false, false, 8, 5, 6),

  (prop3_id, 'Antoine', 'Girard', 31, 'Homme', 'Graphiste freelance', 'Je travaille de chez moi, donc je suis souvent là. J''aime les colocs sympas pour discuter pendant les pauses café!', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&q=80', ARRAY['Design', 'Illustration', 'Café', 'Musique'], ARRAY['Français', 'Anglais', 'Néerlandais'], false, true, 6, 6, 7);

  -- ========================================================================
  -- PROPRIÉTÉ 4: "Professional House" - Professionnel, luxe, jeunes cadres
  -- ========================================================================
  INSERT INTO property_residents (property_id, first_name, last_name, age, gender, occupation, bio, photo_url, interests, languages, is_smoker, has_pets, cleanliness_level, noise_tolerance, social_preference) VALUES
  (prop4_id, 'Alexandre', 'Mercier', 32, 'Homme', 'Consultant en Finance', 'Je voyage souvent pour le travail. Recherche des colocs professionnels et respectueux. J''aime un environnement propre et calme.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80', ARRAY['Finance', 'Voyages', 'Golf', 'Vin'], ARRAY['Français', 'Anglais', 'Mandarin'], false, false, 9, 3, 5),

  (prop4_id, 'Camille', 'Fontaine', 29, 'Femme', 'Avocate', 'Professionnelle exigeante, je valorise la propreté et le respect. J''aime rentrer dans un environnement agréable après de longues journées.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80', ARRAY['Droit', 'Fitness', 'Lecture', 'Voyages'], ARRAY['Français', 'Anglais', 'Espagnol'], false, false, 10, 2, 4);

  -- ========================================================================
  -- PROPRIÉTÉ 5: "Student House" - Étudiant, budget, décontracté
  -- ========================================================================
  INSERT INTO property_residents (property_id, first_name, last_name, age, gender, occupation, bio, photo_url, interests, languages, is_smoker, has_pets, cleanliness_level, noise_tolerance, social_preference) VALUES
  (prop5_id, 'Hugo', 'Durand', 21, 'Homme', 'Étudiant en Informatique', 'Chill et sympa, j''aime coder tard le soir et jouer aux jeux vidéo. Toujours partant pour une pizza entre colocs!', 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop&q=80', ARRAY['Gaming', 'Programmation', 'Anime', 'Pizza'], ARRAY['Français', 'Anglais'], true, false, 3, 8, 7),

  (prop5_id, 'Léa', 'Gauthier', 20, 'Femme', 'Étudiante en Psychologie', 'Sociable et fun! J''aime organiser des soirées jeux de société et cuisiner pour mes colocs. La vie étudiante c''est génial!', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&q=80', ARRAY['Psychologie', 'Jeux de société', 'Cuisine', 'Musique'], ARRAY['Français', 'Anglais', 'Espagnol'], false, false, 4, 7, 9),

  (prop5_id, 'Nathan', 'Roux', 22, 'Homme', 'Étudiant en Commerce', 'Toujours de bonne humeur, j''aime faire la fête mais aussi bosser mes cours. Équilibre entre fun et études!', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&q=80', ARRAY['Business', 'Sport', 'Sorties', 'Voyages'], ARRAY['Français', 'Anglais', 'Néerlandais'], false, false, 4, 7, 8),

  (prop5_id, 'Chloé', 'Blanc', 21, 'Femme', 'Étudiante en Arts', 'Artiste créative, un peu bordélique mais adorable! J''aime peindre, écouter de la musique et partager des moments avec mes colocs.', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop&q=80', ARRAY['Art', 'Peinture', 'Musique indie', 'Café'], ARRAY['Français', 'Anglais'], false, true, 3, 6, 7);

  RAISE NOTICE '✅ Résidents ajoutés pour les 5 propriétés!';
END $$;

-- Vérification
SELECT
  '✅ VÉRIFICATION RÉSIDENTS' as check,
  p.title,
  COUNT(pr.id) as nb_residents
FROM properties p
LEFT JOIN property_residents pr ON p.id = pr.property_id
GROUP BY p.id, p.title
ORDER BY p.created_at DESC
LIMIT 5;
