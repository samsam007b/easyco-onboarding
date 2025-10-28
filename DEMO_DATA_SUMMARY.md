# 📊 Résumé des Données de Démo - EasyCo

## ✅ Ce qui a été créé

### 1. Script Automatisé
**Fichier :** `scripts/seed-demo-data.ts`
- Crée automatiquement les utilisateurs Auth + profils + propriétés
- Utilise l'API Admin de Supabase
- Gère les doublons (ne recréé pas si existe déjà)

**Commande rapide :**
```bash
npm run seed:demo
```

### 2. Script SQL Manuel
**Fichier :** `supabase/seed-test-data.sql`
- Version SQL pour exécution manuelle
- Nécessite de remplacer les IDs utilisateurs
- Utile pour comprendre la structure des données

---

## 👥 PROFILS CRÉÉS (12 au total)

### Chercheurs (5) 🔍

| Nom | Email | Age | Job | Budget | Villes |
|-----|-------|-----|-----|--------|--------|
| Sophie Laurent | sophie.laurent@demo.easyco.com | 29 | Marketing Manager | €600-900 | Ixelles, St-Gilles |
| Ahmed El Mansouri | ahmed.elmansouri@demo.easyco.com | 23 | Étudiant ULB | €400-600 | Ixelles, Schaerbeek |
| Emma Van Der Berg | emma.vanderberg@demo.easyco.com | 36 | Designer Freelance | €700-1000 | Forest, Uccle |
| Lucas Dubois | lucas.dubois@demo.easyco.com | 32 | Comptable (couple) | €900-1300 | Woluwe, Etterbeek |
| Maria Santos | maria.santos@demo.easyco.com | 34 | EU Policy Advisor | €750-1100 | Centre, Ixelles |

**Caractéristiques variées :**
- 🎓 Étudiant (Ahmed)
- 💼 Professionnels (Sophie, Lucas, Maria)
- 🎨 Freelance (Emma)
- 👫 En couple (Lucas)
- 🌍 Nationalités diverses (BE, MA, FR, PT)

### Propriétaires (4) 🏠

| Nom | Email | Expérience | Spécialité |
|-----|-------|------------|-----------|
| Jean-Marc Petit | jeanmarc.petit@demo.easyco.com | 5 ans (Experienced) | Appt Ixelles |
| Isabelle Moreau | isabelle.moreau@demo.easyco.com | 15 ans (Expert) | Multi-propriétés |
| Thomas Janssens | thomas.janssens@demo.easyco.com | Débutant | Studio étudiant |
| Sophie Vermeulen | sophie.vermeulen@demo.easyco.com | 8 ans (Experienced) | Coliving |

**Niveaux d'expérience :**
- 🆕 Beginner : Thomas (premier investissement)
- ⭐ Experienced : Jean-Marc, Sophie (5-8 ans)
- 👑 Expert : Isabelle (15 ans, plusieurs biens)

### Colocataires (3) 🏘️

| Nom | Email | Job | Caractère |
|-----|-------|-----|-----------|
| Pierre Lecomte | pierre.lecomte@demo.easyco.com | Ingénieur Civil | Calme/Social équilibré |
| Laura Gonzalez | laura.gonzalez@demo.easyco.com | Doctorante | Studieuse, calme |
| Maxime Dubois | maxime.dubois@demo.easyco.com | Dev Startup | Dynamique, social |

---

## 🏠 PROPRIÉTÉS CRÉÉES (5 dans Bruxelles)

### 1. Appartement 2 Chambres - Ixelles
**Propriétaire :** Jean-Marc Petit
- 📍 Avenue de la Couronne 234, Flagey
- 🛏️ 2 chambres, 1 SDB, 85m²
- 💰 €1250/mois + €150 charges = **€1400 total**
- ✅ Meublé, ascenseur, balcon, lave-vaisselle
- 🎯 **Match parfait pour:** Sophie, Lucas, Maria

### 2. Studio - Schaerbeek
**Propriétaire :** Thomas Janssens
- 📍 Rue Josaphat 145, Diamant
- 🛏️ Studio 35m², 1 SDB
- 💰 €650/mois + €80 charges = **€730 total**
- ✅ Meublé, WiFi, chauffage
- 🎯 **Match parfait pour:** Ahmed (étudiant)

### 3. Coliving Maison - Forest
**Propriétaire :** Sophie Vermeulen
- 📍 Avenue Besme 89, Altitude 100
- 🛏️ 6 chambres privées, 3 SDB, 280m²
- 💰 €695/mois/chambre + €200 charges = **€895 total**
- ✅ Jardin 200m², buanderie, espaces communs
- 🎯 **Match parfait pour:** Maxime, Maria (sociables)

### 4. Appartement 3 Chambres - Woluwe-Saint-Pierre
**Propriétaire :** Isabelle Moreau
- 📍 Avenue de Tervueren 412, Montgomery
- 🛏️ 3 chambres, 2 SDB, 120m²
- 💰 €1800/mois + €250 charges = **€2050 total**
- ✅ Standing, parking, gym, terrasse 15m²
- 🎯 **Match parfait pour:** Lucas (couple, haut budget)

### 5. Maison 4 Chambres - Saint-Gilles
**Propriétaire :** Isabelle Moreau
- 📍 Rue de la Victoire 78, Parvis
- 🛏️ 4 chambres, 2 SDB, 150m²
- 💰 €2100/mois + €200 charges = **€2300 total**
- ✅ Jardin 80m², cachet authentique, parquet
- 🎯 **Match parfait pour:** Colocation 4 personnes

---

## 🎯 SCÉNARIOS DE MATCHING

### Scénario 1 : Budget Étudiant
**Ahmed** (€400-600) ↔ **Studio Schaerbeek** (€730)
- ⚠️ Légèrement au-dessus du budget max
- ✅ Parfait pour étudiant
- ✅ Proche ULB (métro Diamant)

### Scénario 2 : Young Professional
**Sophie** (€600-900) ↔ **Appt Ixelles** (€1400)
- ⚠️ Au-dessus du budget si seule
- ✅ **COLOCATION avec Emma** = €700/personne ✅
- ✅ Quartier Flagey (Sophie aime yoga & cafés)

### Scénario 3 : Coliving International
**Maria** (€750-1100) ↔ **Coliving Forest** (€895)
- ✅ Dans le budget
- ✅ Ambiance internationale (EU bubble)
- ✅ Maria est sociable (rating élevé)

### Scénario 4 : Couple Établi
**Lucas** (€900-1300) ↔ **Appt Woluwe** (€2050)
- ⚠️ Au-dessus du budget individuel
- ✅ **EN COUPLE** = €1025/personne ✅
- ✅ Quartier résidentiel, sécurisé

### Scénario 5 : Colocation 4 Personnes
**Maxime + Pierre + Laura + 1** ↔ **Maison St-Gilles** (€2300)
- ✅ €575/personne = dans tous les budgets
- ✅ Mix de profils (équilibré)
- ✅ Quartier vivant (Maxime), calme (Laura)

---

## 🗺️ CARTE DE BRUXELLES

```
┌─────────────────────────────────┐
│  BRUXELLES - Communes           │
├─────────────────────────────────┤
│                                 │
│  🏢 WOLUWE-ST-PIERRE (€1800)   │
│     └─ Appt Standing Isabelle  │
│                                 │
│  🎓 SCHAERBEEK (€650)           │
│     └─ Studio Thomas            │
│                                 │
│  🎨 IXELLES (€1250)             │
│     └─ Appt 2ch Jean-Marc       │
│                                 │
│  🎭 SAINT-GILLES (€2100)        │
│     └─ Maison Isabelle          │
│                                 │
│  🌳 FOREST (€695)               │
│     └─ Coliving Sophie          │
│                                 │
└─────────────────────────────────┘
```

---

## 📸 IMAGES (Unsplash)

Toutes les propriétés ont des **vraies photos** :

| Propriété | Images |
|-----------|--------|
| Appt Ixelles | Salon moderne, parquet chêne, cuisine |
| Studio Schaerbeek | Studio fonctionnel, lumineux |
| Coliving Forest | Maison de maître, jardin, salon commun |
| Appt Woluwe | Luxury living room, terrasse |
| Maison St-Gilles | Maison typique bruxelloise, jardin |

**Source :** https://unsplash.com/ (licence commerciale gratuite)

---

## 🔐 CONNEXION UNIQUE

**Tous les comptes utilisent :**
- Email : `prénom.nom@demo.easyco.com`
- Password : `Demo123!`

### Exemples de Login

```bash
# Chercheur
Email: sophie.laurent@demo.easyco.com
Password: Demo123!

# Propriétaire
Email: jeanmarc.petit@demo.easyco.com
Password: Demo123!

# Colocataire
Email: pierre.lecomte@demo.easyco.com
Password: Demo123!
```

---

## 🚀 UTILISATION

### 1. Créer les données
```bash
npm run seed:demo
```

### 2. Vérifier dans Supabase
- Aller sur Supabase Dashboard
- Table Editor > `user_profiles` (12 lignes)
- Table Editor > `properties` (5 lignes)

### 3. Tester l'application
```bash
npm run dev
```

### 4. Login et navigation
- Aller sur http://localhost:3000/login
- Login avec un des emails ci-dessus
- Explorer dashboard selon le type d'utilisateur

---

## 🧪 TESTS À EFFECTUER

### ✅ Test 1 : Browse Properties (Searcher)
1. Login avec Sophie
2. Aller sur `/properties/browse`
3. Filtrer par budget €600-900
4. Voir les propriétés matchées

### ✅ Test 2 : View My Properties (Owner)
1. Login avec Isabelle Moreau
2. Aller sur `/dashboard/owner/properties`
3. Voir ses 2 propriétés (Woluwe + St-Gilles)

### ✅ Test 3 : Apply to Property (Searcher)
1. Login avec Ahmed
2. Voir Studio Schaerbeek
3. Postuler pour le studio
4. Vérifier notification côté Thomas (owner)

### ✅ Test 4 : Matching Algorithm
1. Comparer profils vs propriétés
2. Calculer score de compatibilité
3. Afficher matches recommandés

### ✅ Test 5 : Add New Property (Owner)
1. Login avec Jean-Marc
2. Aller sur `/properties/add`
3. Créer une nouvelle propriété
4. Publier

---

## 📊 STATISTIQUES

| Métrique | Valeur |
|----------|--------|
| **Total Utilisateurs** | 12 |
| **Searchers** | 5 (42%) |
| **Owners** | 4 (33%) |
| **Residents** | 3 (25%) |
| **Propriétés** | 5 |
| **Prix moyen** | €1319/mois |
| **Prix min** | €650 (Studio) |
| **Prix max** | €2100 (Maison) |
| **Surface moyenne** | 134m² |
| **Communes couvertes** | 5 |

### Distribution des Budgets (Searchers)

```
€400-600   ■■■■■ (20%) - Ahmed
€600-900   ■■■■■ (20%) - Sophie
€700-1000  ■■■■■ (20%) - Emma
€750-1100  ■■■■■ (20%) - Maria
€900-1300  ■■■■■ (20%) - Lucas
```

### Distribution des Loyers (Properties)

```
€650       ■■■■■■■■■■ (1) Studio
€695       ■■■■■■■■■■ (1) Coliving
€1250      ■■■■■■■■■■■■■■■ (1) Appt 2ch
€1800      ■■■■■■■■■■■■■■■■■■■■■■ (1) Appt 3ch
€2100      ■■■■■■■■■■■■■■■■■■■■■■■■■ (1) Maison
```

---

## 🎨 DIVERSITÉ DES DONNÉES

### Nationalités
- 🇧🇪 Belgian (5)
- 🇫🇷 French (2)
- 🇲🇦 Moroccan (1)
- 🇵🇹 Portuguese (1)
- 🇪🇸 Spanish (1)

### Occupations
- 👨‍🎓 Étudiants (2): Ahmed, Laura
- 💻 Tech (2): Maxime, Emma
- 💼 Business (2): Sophie, Lucas
- 🏛️ EU/Gov (1): Maria
- 👷 Ingénierie (1): Pierre

### Préférences Lifestyle
- 🚭 Non-fumeurs (9)
- 🐕 Acceptent animaux (5)
- 🔇 Calmes (4)
- 🎉 Sociables (3)
- 🏡 Très propres (4)

---

## 🧹 NETTOYAGE

Pour supprimer toutes les données de test :

```sql
-- 1. Supprimer les propriétés
DELETE FROM properties
WHERE owner_id IN (
  SELECT user_id FROM user_profiles
  WHERE email LIKE '%@demo.easyco.com'
);

-- 2. Supprimer les profils
DELETE FROM user_profiles
WHERE email LIKE '%@demo.easyco.com';
```

Puis manuellement dans Supabase Dashboard :
- Authentication > Users > Filtrer `@demo.easyco.com` > Delete

---

## ✨ PROCHAINES ÉTAPES

Avec ces données, tu peux maintenant implémenter :

1. **Algorithme de Matching** 🎯
   - Comparer budgets vs loyers
   - Score de compatibilité lifestyle
   - Recommandations personnalisées

2. **Système de Candidatures** 📝
   - Searchers postulent aux propriétés
   - Owners gèrent les candidatures
   - Workflow d'approbation

3. **Messagerie** 💬
   - Conversations Owner ↔ Searcher
   - Notifications temps réel
   - Historique des échanges

4. **Dashboard Analytics** 📊
   - Stats pour owners (vues, candidatures)
   - Stats pour searchers (favoris, visites)
   - Graphiques et tendances

5. **Système de Reviews** ⭐
   - Owners notent searchers
   - Searchers notent propriétés
   - Système de réputation

---

**Données créées avec ❤️ pour faciliter le dev d'EasyCo ! 🚀**

*Dernière mise à jour: 2025-10-28*
