# 🌟 Seed Data Enrichi - EasyCo Demo

## 📋 Vue d'ensemble

Ce dossier contient des **fichiers SQL ultra-détaillés** pour créer des données demo avec le **MAXIMUM de caractéristiques** possibles. Parfait pour tester les algorithmes de matching, la personnalisation et toutes les fonctionnalités d'EasyCo.

## 🎯 Contenu

### Profils Utilisateurs (12 au total)

**5 SEARCHERS (Chercheurs de logement):**
1. **Sophie Laurent** (29 ans) - Marketing Manager, sociable, yoga, végétarienne
   - 50+ champs remplis incluant habitudes quotidiennes, personnalité, préférences
2. **Ahmed El Mansouri** (23 ans) - Étudiant ULB, gamer, calme, halal
   - Profil étudiant complet avec garant, budget serré, préférences d'études
3. **Emma Van Der Berg** (36 ans) - Designer freelance, plantes, chat, work-from-home
   - Profil créatif avec animaux, besoin d'espace bureau, lifestyle calme
4. **Lucas Dubois** (32 ans) - Comptable en couple, organisé, randonnée
   - Profil couple avec revenus élevés, exigences de propreté spotless
5. **Maria Santos** (34 ans) - EU Policy Advisor, internationale, nightlife
   - Profil très social, 4 langues, ouverture culturelle maximale

**4 OWNERS (Propriétaires):**
1. **Jean-Marc Petit** - Individuel, 5 ans d'expérience, bienveillant
   - Banking, policies, préférences de locataires détaillées
2. **Isabelle Moreau** - Company, 15 ans expert, portfolio 8 propriétés
   - Profil professionnel complet, exigences strictes, long terme
3. **Thomas Janssens** - Débutant, flexible, étudiant-friendly
   - Nouveau propriétaire, communication WhatsApp, très disponible
4. **Sophie Vermeulen** - Coliving specialist, community-focused
   - Passion communauté, multilingue, accepte animaux

**3 RESIDENTS (Colocataires actuels):**
1. **Pierre Lecomte** - Ingénieur civil, équilibré, cinéma & vélo
2. **Laura Gonzalez** - Doctorante, studieuse, yoga, végane
3. **Maxime Dubois** - Dev startup, dynamique, gaming, social

### Propriétés (5 à Bruxelles)

1. **Appartement 2ch Ixelles** (€1,250) - Rénové 2022, Flagey, parfait young professionals
   - Description de 500+ mots, tous équipements, transport détaillé
2. **Studio Schaerbeek** (€650) - Budget étudiant, proche ULB/VUB
   - Parfait pour Ahmed, prix TTC, flexible bail 9-10 mois
3. **Coliving Forest 6ch** (€695/chambre) - Jardin 200m², communauté internationale
   - Concept unique, événements, 5 residents actuels présentés
4. **Appartement 3ch Woluwe** (€1,800) - Standing, gym, concierge, parking
   - Prestige, idéal couples/familles, résidence services
5. **Maison 4ch Saint-Gilles** (€2,100) - Cachet bruxellois, jardin, colocation 4
   - Authentique, artistique, parfait colocation mature

## 📁 Structure des fichiers

```
supabase/
├── seed-complete-enriched.sql         # PARTIE 1: 5 Searchers
├── seed-complete-enriched-part2.sql   # PARTIE 2: 4 Owners + 3 Residents
└── seed-complete-enriched-part3.sql   # PARTIE 3: 5 Properties
```

## 🚀 Comment utiliser

### Option 1: Exécuter les 3 parties séparément (RECOMMANDÉ)

**Dans Supabase Dashboard > SQL Editor:**

1. **Exécute PARTIE 1** (Searchers):
   ```sql
   -- Copie-colle le contenu de seed-complete-enriched.sql
   ```

2. **Exécute PARTIE 2** (Owners + Residents):
   ```sql
   -- Copie-colle le contenu de seed-complete-enriched-part2.sql
   ```

3. **Exécute PARTIE 3** (Properties):
   ```sql
   -- Copie-colle le contenu de seed-complete-enriched-part3.sql
   ```

### Option 2: Combiner les 3 parties

Tu peux combiner les 3 fichiers en un seul script SQL si tu préfères:

```bash
cat supabase/seed-complete-enriched.sql \
    supabase/seed-complete-enriched-part2.sql \
    supabase/seed-complete-enriched-part3.sql \
    > supabase/seed-complete-all.sql
```

Puis exécute `seed-complete-all.sql` dans Supabase.

## ✅ Vérification

Après l'exécution, tu devrais voir:

```sql
-- Vérifier les utilisateurs
SELECT user_type, COUNT(*) as count
FROM user_profiles
WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@demo.easyco.com')
GROUP BY user_type;

-- Résultat attendu:
-- owner    | 4
-- resident | 3
-- searcher | 5

-- Vérifier les propriétés
SELECT title, monthly_rent, city
FROM properties
WHERE owner_id IN (
  SELECT user_id FROM user_profiles
  WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@demo.easyco.com')
);

-- Résultat attendu: 5 propriétés
```

## 🎨 Détails des enrichissements

### Pour les SEARCHERS:

✅ **Informations personnelles complètes**
- Âge, genre, nationalité
- Langues parlées (2-4 langues)
- Ville actuelle, pays
- Bio détaillée (200-400 mots)
- Photo de profil (avatar)

✅ **Détails professionnels**
- Statut occupation (employed/student/self-employed)
- Domaine de travail spécifique
- Entreprise/Institution
- Tranche de revenus exacte
- Type d'emploi
- Garant disponible (oui/non + coordonnées)

✅ **Habitudes quotidiennes**
- Heure réveil (early/moderate/late)
- Heure coucher
- Planning travail (flexible/remote/traditional)
- Fréquence sport (0-7x/semaine)
- Fumeur (oui/non)
- Alcool (never/occasionally/socially/regularly)
- Régime alimentaire (omnivore/végétarien/végan/halal)

✅ **Style de vie à la maison**
- Niveau de propreté (relaxed → spotless)
- Fréquence invités (never → often)
- Habitudes musicales (quiet → loud)
- Animaux (oui/non + type)
- Fréquence cuisine (never → daily)

✅ **Personnalité détaillée**
- Échelle introversion/extraversion (1-10)
- Niveau sociabilité (1-10)
- Ouverture au partage (private → very-open)
- Style communication (direct/diplomatic/casual/formal)
- Ouverture culturelle (prefer-similar → love-diversity)
- Tolérance aux conflits (low/medium/high)
- 6-8 intérêts listés
- 4-6 hobbies
- 4-5 valeurs prioritaires

✅ **Préférences de logement**
- Type chambre (private/shared/studio/entire-apartment)
- Budget min et max (précis)
- Ville préférée
- 3-5 quartiers spécifiques
- Date d'emménagement souhaitée
- Durée minimum séjour (mois)
- Taille colocation préférée (small/medium/large)
- Mix de genre (male-only/female-only/mixed)
- Âge min/max colocataires
- Importance espaces partagés (1-10)
- Tolérance animaux, fumeurs
- Attentes propreté
- Heures calmes nécessaires?
- Intérêt repas partagés?
- Besoin coworking/gym?

✅ **Profil enrichi**
- About me (300-500 mots)
- Looking for (200-300 mots)
- 5 valeurs fondamentales
- 5 qualités importantes recherchées
- 3-4 deal breakers
- Intérêt événements communautaires
- Ouvert aux meetups

### Pour les OWNERS:

✅ **Informations professionnelles**
- Type propriétaire (individual/agency/company)
- Nom entreprise si applicable
- Numéro enregistrement, TVA
- Années d'expérience (0-15+)
- Taille du portfolio (1-8 propriétés)
- Type de gestion (self/agency/hybrid)

✅ **Banking & Finances**
- IBAN complet
- BIC/SWIFT
- Nom titulaire compte
- Adresse facturation
- Fréquence paiement
- Devise

✅ **Politiques de location**
- Accepte baux courts terme?
- Durée minimale (3-12 mois)
- Documents requis (liste détaillée)
- Garant requis?
- Ratio revenu minimum (2.5-3.5x)
- Check crédit requis?
- Montant dépôt (en mois)
- Politique animaux
- Responsabilité maintenance

✅ **Préférences & Communication**
- Style sélection locataires
- Types de locataires préférés
- Moyen de communication préféré
- Temps de réponse (heures)
- Visibilité reviews

### Pour les PROPERTIES:

✅ **Descriptions ultra-détaillées (500-1000 mots)**
- Titre accrocheur avec emojis
- Description structurée en sections:
  - 🏡 Vue d'ensemble
  - 📍 Emplacement détaillé
  - 🏠 Pièce par pièce
  - ✨ Équipements & rénovations
  - 🚇 Transports (distances exactes)
  - 🛍️ Commerces & services
  - 💰 Conditions financières
  - 👤 Profil locataire recherché

✅ **Spécifications techniques**
- Type propriété exact
- Adresse complète
- Coordonnées GPS (latitude/longitude)
- Nombre de chambres, salles de bain
- Nombre total de pièces
- Surface exacte (m²)
- Étage et nombre d'étages total
- Meublé ou non

✅ **Pricing détaillé**
- Loyer mensuel
- Charges (avec détail de ce qu'elles incluent)
- Dépôt
- Date disponibilité
- Durée min/max

✅ **20-30 amenities listées**
Exemples: wifi, fiber, elevator, parking, gym, garden, balcony, dishwasher, washing_machine, heating, AC, furnished, double_glazing, etc.

✅ **5-6 photos Unsplash**
Images haute qualité représentatives

## 🎯 Cas d'usage pour tester le matching

### Match Parfait #1: Ahmed ↔ Studio Schaerbeek
- Budget: €400-600 (Studio: €730 légèrement au-dessus)
- Profil: Étudiant ULB
- Proximité: Métro Diamant → ULB 15 min
- **Score attendu: 85/100**

### Match Parfait #2: Sophie + Emma ↔ Appt Ixelles (colocation)
- Budget combiné: €1,300-1,900 (Appt: €1,400 ✅)
- Profils compatibles: sociables, respectueuses, créatives
- Quartier: Flagey (préféré de Sophie)
- **Score attendu: 92/100**

### Match Parfait #3: Maria ↔ Coliving Forest
- Budget: €750-1,100 (Coliving: €895 ✅)
- Profil: Internationale, très sociale, aime communauté
- Ambiance: Coliving international, événements
- **Score attendu: 95/100**

### Match Parfait #4: Lucas (couple) ↔ Appt Woluwe
- Budget: €900-1,300 × 2 personnes = €1,800-2,600 (Appt: €2,050 ✅)
- Profil: Calme, organisé, quartier résidentiel
- Standing: Résidence prestige, services
- **Score attendu: 88/100**

### Match Parfait #5: Pierre + Laura + Maxime + 1 ↔ Maison St-Gilles
- Budget: €575/personne × 4 = €2,300 (Maison: €2,300 ✅)
- Profils: Mix équilibré (calme + social)
- Espace: 4 chambres, jardin, cachet
- **Score attendu: 90/100**

## 🧪 Tests de personnalisation suggérés

1. **Algorithme de matching budget**
   - Tester si Sophie/Emma match bien ensemble pour Ixelles
   - Vérifier qu'Ahmed voit le Studio Schaerbeek en priorité

2. **Matching lifestyle**
   - Maria devrait scorer haut avec Coliving (social)
   - Laura devrait scorer bas avec Maxime (trop bruyant)
   - Emma/Sophie devraient bien matcher (créatives, rangées)

3. **Filtres avancés**
   - Animaux: Emma (chat) → Coliving Forest OK, Woluwe NO
   - Fumeurs: Tous non-fumeurs sauf Maria (occasionnelle)
   - Couples: Lucas/Léa → Woluwe OK, Studio NO

4. **Recommandations personnalisées**
   - Basées sur core_values matching
   - Basées sur interests overlap
   - Basées sur deal_breakers (élimination)

5. **Interface Tinder/Swipe**
   - Afficher compatibility score avec emoji
   - Pourquoi ce match? (montrer facteurs)
   - Filtrer selon préférences utilisateur

## 📊 Statistiques des données enrichies

| Métrique | Valeur |
|----------|--------|
| **Champs par Searcher** | 50-60 champs |
| **Champs par Owner** | 35-40 champs |
| **Champs par Resident** | 45-50 champs |
| **Champs par Property** | 30-35 champs |
| **Mots par bio utilisateur** | 200-500 mots |
| **Mots par description propriété** | 500-1000 mots |
| **Photos par propriété** | 5-6 images |
| **Amenities par propriété** | 14-23 items |
| **Langues par utilisateur** | 2-4 langues |

## 🔧 Maintenance

Pour mettre à jour ou ajouter des utilisateurs:

1. Copie la structure d'un utilisateur existant
2. Change les IDs et emails
3. Remplis TOUS les champs possibles
4. Assure-toi que les données sont cohérentes (ex: budget étudiant + revenu étudiant)
5. Teste le matching avant de commit

## 💡 Tips pour tester

- **Commence simple**: Teste d'abord le matching Sophie → Appt Ixelles
- **Augmente la complexité**: Teste colocation 2-4 personnes
- **Vérifie les edge cases**: Utilisateurs avec deal breakers stricts
- **Teste les filtres**: Animaux, fumeurs, budget strict
- **Performance**: Avec 12 users, le matching devrait être < 100ms

## 🆘 Support

Si les données ne se créent pas:
1. Vérifie que les migrations sont à jour
2. Vérifie les contraintes de la base (CHECK, NOT NULL)
3. Regarde les logs Supabase pour les erreurs spécifiques
4. Assure-toi que les auth.users sont créés avant les profils

---

**Créé le:** 2025-11-21
**Auteur:** Claude (Assistant IA)
**Version:** 1.0 - Enrichi au maximum ✨
