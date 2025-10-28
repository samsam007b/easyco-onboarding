# 🌱 Guide de Seed de Données de Test

Ce dossier contient des scripts pour créer des données de test réalistes pour EasyCo.

## 📦 Contenu

### 1. **seed-test-data.sql** - Script SQL manuel
Fichier SQL complet avec 5 profils de chaque type + 5 propriétés diversifiées dans Bruxelles.

### 2. **seed-demo-data.ts** - Script automatisé (RECOMMANDÉ)
Script TypeScript qui crée automatiquement les utilisateurs Auth ET les profils/propriétés.

---

## 🚀 Méthode Recommandée : Script Automatisé

### Prérequis

1. Installer `tsx` (si pas déjà installé) :
```bash
npm install -D tsx
```

2. Avoir les variables d'environnement dans `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Exécution

```bash
npx tsx scripts/seed-demo-data.ts
```

### Résultat

Le script crée automatiquement :
- ✅ 5 Searchers (chercheurs de logement)
- ✅ 4 Owners (propriétaires)
- ✅ 3 Residents (colocataires actuels)
- ✅ 5 Properties (propriétés à Bruxelles)

Tous avec le mot de passe : **`Demo123!`**

---

## 📧 Comptes de Test Créés

### Searchers (Chercheurs)

| Nom | Email | Profil | Budget | Villes |
|-----|-------|--------|--------|--------|
| Sophie Laurent | sophie.laurent@demo.easyco.com | Marketing Manager, 28 ans | €600-900 | Ixelles, Saint-Gilles |
| Ahmed El Mansouri | ahmed.elmansouri@demo.easyco.com | Étudiant ULB, 23 ans | €400-600 | Ixelles, Schaerbeek |
| Emma Van Der Berg | emma.vanderberg@demo.easyco.com | Designer Freelance, 36 ans | €700-1000 | Forest, Uccle |
| Lucas Dubois | lucas.dubois@demo.easyco.com | Comptable en couple, 32 ans | €900-1300 | Woluwe, Etterbeek |
| Maria Santos | maria.santos@demo.easyco.com | EU Policy Advisor, 34 ans | €750-1100 | Centre, Ixelles |

### Owners (Propriétaires)

| Nom | Email | Expérience | Propriétés |
|-----|-------|------------|------------|
| Jean-Marc Petit | jeanmarc.petit@demo.easyco.com | 5 ans | Appt Ixelles |
| Isabelle Moreau | isabelle.moreau@demo.easyco.com | 15 ans | Maisons multiples |
| Thomas Janssens | thomas.janssens@demo.easyco.com | Débutant | Studio Schaerbeek |
| Sophie Vermeulen | sophie.vermeulen@demo.easyco.com | 8 ans | Coliving Forest |

### Residents (Colocataires)

| Nom | Email | Occupation |
|-----|-------|------------|
| Pierre Lecomte | pierre.lecomte@demo.easyco.com | Ingénieur Civil |
| Laura Gonzalez | laura.gonzalez@demo.easyco.com | Doctorante |
| Maxime Dubois | maxime.dubois@demo.easyco.com | Dev Startup |

---

## 🏠 Propriétés Créées

### 1. **Appartement Ixelles** - €1250/mois
- 2 chambres, 85m², meublé
- Quartier Flagey, rénové
- Propriétaire: Jean-Marc Petit
- Images: Appartement moderne avec parquet

### 2. **Studio Schaerbeek** - €650/mois
- Studio 35m², meublé
- Parfait étudiant
- Propriétaire: Thomas Janssens
- Images: Studio cosy et fonctionnel

### 3. **Coliving Forest** - €695/mois
- Maison 280m², 6 chambres
- Jardin, espaces communs
- Propriétaire: Sophie Vermeulen
- Images: Maison de maître avec jardin

### 4. **Appartement Woluwe** - €1800/mois
- 3 chambres, 120m², standing
- Résidence sécurisée
- Propriétaire: Isabelle Moreau
- Images: Appartement luxueux

### 5. **Maison Saint-Gilles** - €2100/mois
- 4 chambres, 150m², caractère
- Jardin 80m²
- Propriétaire: Isabelle Moreau
- Images: Maison bruxelloise typique

---

## 📸 Images

Toutes les images proviennent de [Unsplash](https://unsplash.com/) (libres de droits) :
- Photos d'appartements modernes
- Intérieurs lumineux
- Cuisines équipées
- Espaces de vie chaleureux

---

## 🧪 Utilisation pour les Tests

### Tester le Flow Searcher
```
1. Login avec: sophie.laurent@demo.easyco.com / Demo123!
2. Voir les propriétés disponibles
3. Postuler pour une propriété
4. Tester le matching
```

### Tester le Flow Owner
```
1. Login avec: jeanmarc.petit@demo.easyco.com / Demo123!
2. Voir ses propriétés
3. Gérer les candidatures
4. Ajouter une nouvelle propriété
```

### Tester le Flow Resident
```
1. Login avec: pierre.lecomte@demo.easyco.com / Demo123!
2. Voir son profil de colocataire
3. Rechercher des colocataires compatibles
```

---

## 🗑️ Nettoyage

Pour supprimer toutes les données de test :

```sql
-- Supprimer les propriétés
DELETE FROM properties WHERE owner_id IN (
  SELECT user_id FROM user_profiles
  WHERE email LIKE '%@demo.easyco.com'
);

-- Supprimer les profils
DELETE FROM user_profiles WHERE email LIKE '%@demo.easyco.com';

-- Supprimer les utilisateurs Auth (via Supabase Dashboard)
-- Authentication > Users > Filtrer par @demo.easyco.com > Delete
```

---

## 🎯 Prochaines Étapes

Une fois les données créées, vous pouvez :

1. **Tester le Matching** : Voir quels searchers matchent avec quelles propriétés
2. **Tester les Candidatures** : Créer des applications de searchers vers propriétés
3. **Tester les Messages** : Conversations entre owners et searchers
4. **Tester les Notifications** : Système de notifications pour nouvelles candidatures

---

## 💡 Conseils

- Les **emails finissent par @demo.easyco.com** pour faciliter l'identification
- Le **mot de passe est identique** pour tous : `Demo123!`
- Les **données sont réalistes** mais fictives
- Les **images sont de vraies photos** (Unsplash)
- Les **prix correspondent au marché bruxellois** 2024
- Les **quartiers sont réels** à Bruxelles

---

## 🐛 Troubleshooting

### Erreur: "User already exists"
✅ Normal - Le script détecte et réutilise les utilisateurs existants

### Erreur: "Missing environment variables"
❌ Vérifier `.env.local` contient `NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`

### Erreur: "Permission denied"
❌ Vérifier que `SUPABASE_SERVICE_ROLE_KEY` est correct (pas la clé anon)

### Les images ne s'affichent pas
⚠️ Les images Unsplash peuvent nécessiter une connexion internet

---

## 📝 Notes Importantes

- **Ne jamais commit le `.env.local`** dans Git
- **Service Role Key = Admin access** - Ne jamais l'exposer côté client
- **Données de demo uniquement** - Pas pour la production
- **Images Unsplash** - Respecter la [licence Unsplash](https://unsplash.com/license)

---

## 🎨 Personnalisation

Pour ajouter vos propres données :

1. Modifier `scripts/seed-demo-data.ts`
2. Ajouter de nouveaux objets dans `demoUsers` ou `properties`
3. Relancer le script

---

**Créé avec ❤️ pour faciliter le développement d'EasyCo**
