# 🚀 Quick Start - Données de Démo

## Installation Rapide

### 1. Installer les dépendances
```bash
npm install
```

### 2. Créer les données de test
```bash
npx tsx scripts/seed-demo-data.ts
```

## ✅ Ce qui sera créé

### 👥 Profils Utilisateurs

#### Chercheurs (Searchers) - 5 profils
- **Sophie Laurent** - Marketing Manager (€600-900/mois)
- **Ahmed El Mansouri** - Étudiant ULB (€400-600/mois)
- **Emma Van Der Berg** - Designer Freelance (€700-1000/mois)
- **Lucas Dubois** - Comptable en couple (€900-1300/mois)
- **Maria Santos** - EU Policy Advisor (€750-1100/mois)

#### Propriétaires (Owners) - 4 profils
- **Jean-Marc Petit** - Proprio expérimenté (5 ans)
- **Isabelle Moreau** - Multi-propriétés (15 ans d'exp)
- **Thomas Janssens** - Premier investissement
- **Sophie Vermeulen** - Spécialiste coliving (8 ans)

#### Colocataires (Residents) - 3 profils
- **Pierre Lecomte** - Ingénieur Civil
- **Laura Gonzalez** - Doctorante ULB
- **Maxime Dubois** - Developer Startup

---

### 🏠 Propriétés à Bruxelles - 5 annonces

| Propriété | Propriétaire | Prix | Détails |
|-----------|--------------|------|---------|
| **Appt 2ch Ixelles** | Jean-Marc Petit | €1250 | 85m², meublé, Flagey |
| **Studio Schaerbeek** | Thomas Janssens | €650 | 35m², parfait étudiant |
| **Coliving Forest** | Sophie Vermeulen | €695 | 280m², 6ch, jardin |
| **Appt 3ch Woluwe** | Isabelle Moreau | €1800 | 120m², standing |
| **Maison St-Gilles** | Isabelle Moreau | €2100 | 150m², 4ch, jardin |

---

## 🔐 Connexion

**Tous les comptes utilisent le même mot de passe :** `Demo123!`

### Exemples de login

**Chercheur :**
```
Email: sophie.laurent@demo.easyco.com
Password: Demo123!
```

**Propriétaire :**
```
Email: jeanmarc.petit@demo.easyco.com
Password: Demo123!
```

**Colocataire :**
```
Email: pierre.lecomte@demo.easyco.com
Password: Demo123!
```

---

## 🎯 Scénarios de Test

### Scénario 1 : Chercheur trouvant un logement
1. Login avec Sophie Laurent
2. Parcourir les propriétés disponibles
3. Filtrer par budget (€600-900)
4. Voir les matches compatibles
5. Postuler pour l'appartement Ixelles

### Scénario 2 : Propriétaire gérant ses biens
1. Login avec Isabelle Moreau
2. Voir ses 2 propriétés (Woluwe + St-Gilles)
3. Gérer les candidatures
4. Publier/dépublier une annonce

### Scénario 3 : Coliving
1. Login avec Sophie Vermeulen
2. Voir sa maison de coliving
3. Gérer les 6 chambres disponibles
4. Créer une ambiance communautaire

---

## 📊 Correspondance Propriétaires ↔ Propriétés

```
Jean-Marc Petit (jeanmarc.petit@demo.easyco.com)
└── Appartement 2ch Ixelles - €1250/mois

Isabelle Moreau (isabelle.moreau@demo.easyco.com)
├── Appartement 3ch Woluwe - €1800/mois
└── Maison 4ch Saint-Gilles - €2100/mois

Thomas Janssens (thomas.janssens@demo.easyco.com)
└── Studio Schaerbeek - €650/mois

Sophie Vermeulen (sophie.vermeulen@demo.easyco.com)
└── Coliving Forest - €695/mois (chambre privée)
```

---

## 🗺️ Localisation à Bruxelles

Toutes les propriétés sont situées dans de vraies communes bruxelloises :

- 🏘️ **Ixelles** - Quartier Flagey (bohème, cafés)
- 🏢 **Schaerbeek** - Quartier Diamant (multiculturel)
- 🌳 **Forest** - Altitude 100 (résidentiel, verdoyant)
- 💼 **Woluwe-Saint-Pierre** - Montgomery (haut standing)
- 🎨 **Saint-Gilles** - Parvis (artistique, vivant)

---

## 🧹 Nettoyage des Données

Pour supprimer toutes les données de test :

```bash
# Via SQL (Supabase Dashboard > SQL Editor)
DELETE FROM properties WHERE owner_id IN (
  SELECT user_id FROM user_profiles WHERE email LIKE '%@demo.easyco.com'
);
DELETE FROM user_profiles WHERE email LIKE '%@demo.easyco.com';
```

Puis supprimer les users Auth manuellement dans le dashboard.

---

## 📸 Sources des Images

- Toutes les images viennent de [Unsplash](https://unsplash.com/)
- Libres de droits pour usage commercial
- Photos haute qualité d'intérieurs modernes
- URLs directes (pas de download requis)

---

## ⚙️ Configuration Requise

Fichier `.env.local` doit contenir :
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxxx...
```

> ⚠️ **IMPORTANT:** Le Service Role Key est sensible, ne jamais le commit !

---

## 🎨 Diversité des Profils

### Budget Range
- Étudiant : €400-600 (Ahmed)
- Jeune Pro : €600-1000 (Sophie, Emma)
- Pro Établi : €900-1300 (Lucas, Maria)

### Types de Logement
- Studio étudiant (€650)
- Appartement 2ch (€1250)
- Coliving communautaire (€695)
- Appartement standing (€1800)
- Maison familiale (€2100)

### Nationalités
- Belgian (4)
- French (2)
- Moroccan (1)
- Portuguese (1)
- Spanish (1)

### Occupations
- Étudiants (2)
- Tech/Startup (2)
- Marketing/Design (2)
- Finance/EU (2)
- Healthcare (1)
- Art (1)

---

## 💡 Tips

✅ Les profils sont **complémentaires** pour tester le matching
✅ Les budgets **correspondent aux loyers** disponibles
✅ Les préférences sont **variées** (calme/social, fumeur/non-fumeur)
✅ Les propriétés couvrent **tous les types** de logement

---

**Prêt à tester EasyCo avec des données réalistes ! 🎉**
