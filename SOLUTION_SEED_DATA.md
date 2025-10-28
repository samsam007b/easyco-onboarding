# ✅ Solution: Créer les Données de Démo

## Problème Rencontré

Le script TypeScript `npm run seed:demo` échoue à cause d'un problème de cache du schéma Supabase :
```
Could not find the 'email' column of 'user_profiles' in the schema cache
```

## 🎯 Solution Simple: Utiliser SQL Direct

Au lieu d'utiliser le script TypeScript, nous allons exécuter du SQL directement dans Supabase Dashboard.

### Étape 1: Ouvrir Supabase SQL Editor

1. Aller sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionner votre projet EasyCo
3. Cliquer sur **SQL Editor** dans la sidebar gauche

### Étape 2: Copier le SQL

1. Ouvrir le fichier: `supabase/seed-with-existing-users.sql`
2. Copier **TOUT le contenu** du fichier (Cmd+A puis Cmd+C)

### Étape 3: Exécuter le SQL

1. Dans le SQL Editor, coller le SQL (Cmd+V)
2. Cliquer sur **Run** (ou Cmd+Enter)

### Étape 4: Vérifier les Résultats

Le script affichera automatiquement un résumé à la fin :

```
✅ Résultats attendus:

user_type  | count | names
-----------|-------|------------------
searcher   | 5     | Sophie Laurent, Ahmed El Mansouri, Emma Van Der Berg, Lucas Dubois, Maria Santos
owner      | 4     | Jean-Marc Petit, Isabelle Moreau, Thomas Janssens, Sophie Vermeulen
resident   | 3     | Pierre Lecomte, Laura Gonzalez, Maxime Dubois

Properties:
- Studio Schaerbeek (€650)
- Coliving Forest (€695)
- Appartement Ixelles (€1250)
- Appartement Woluwe (€1800)
- Maison Saint-Gilles (€2100)
```

---

## 🔍 Vérification Après Exécution

### Dans le Terminal

```bash
# Lister toutes les propriétés créées
npm run property:list
```

Vous devriez voir **5 propriétés** listées.

### Dans l'Application

1. Démarrer l'app: `npm run dev`
2. Aller sur http://localhost:3000/login
3. Se connecter avec un compte demo:
   - Email: `sophie.laurent@demo.easyco.com`
   - Password: `Demo123!`
4. Aller sur http://localhost:3000/properties/browse
5. Vous devriez voir **les 5 propriétés publiées**

---

## 📊 Données Créées

### 12 Profils Utilisateurs

| Type | Nombre | Emails |
|------|--------|--------|
| **Searchers** | 5 | sophie.laurent@, ahmed.elmansouri@, emma.vanderberg@, lucas.dubois@, maria.santos@ |
| **Owners** | 4 | jeanmarc.petit@, isabelle.moreau@, thomas.janssens@, sophie.vermeulen@ |
| **Residents** | 3 | pierre.lecomte@, laura.gonzalez@, maxime.dubois@ |

*Tous les emails finissent par `@demo.easyco.com`*

### 5 Propriétés à Bruxelles

1. **Studio Schaerbeek** (€650/mois) - Thomas Janssens
2. **Coliving Forest** (€695/mois) - Sophie Vermeulen
3. **Appt 2ch Ixelles** (€1250/mois) - Jean-Marc Petit
4. **Appt 3ch Woluwe** (€1800/mois) - Isabelle Moreau
5. **Maison 4ch Saint-Gilles** (€2100/mois) - Isabelle Moreau

---

## 🔐 Connexion

**Tous les comptes utilisent le même mot de passe:**

```
Password: Demo123!
```

### Exemples

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

## ❓ Pourquoi cette Solution?

### Problème Technique

Après avoir recreé la table `properties` avec `DROP TABLE`, le cache PostgREST de Supabase n'a pas été immédiatement mis à jour. Le cache pensait que certaines colonnes n'existaient pas, alors qu'elles étaient bien présentes dans la base de données.

### Solution

En utilisant SQL **direct** via le SQL Editor au lieu de l'API PostgREST (utilisée par le script TypeScript), nous contournons complètement le problème de cache. Le SQL Editor communique directement avec PostgreSQL, sans passer par le cache.

### Avantages de cette Approche

✅ **Fonctionne toujours** - Pas de problème de cache
✅ **Plus rapide** - Une seule transaction pour tout
✅ **Plus fiable** - Pas de dépendance sur les API
✅ **Facile à débogger** - On voit exactement ce qui est exécuté
✅ **Réutilisable** - Peut être relancé plusieurs fois (upsert)

---

## 🧹 Nettoyage (Optionnel)

Si vous voulez supprimer toutes les données de test et recommencer :

```sql
-- Supprimer les propriétés
DELETE FROM properties
WHERE owner_id IN (
  SELECT user_id FROM user_profiles
  WHERE email LIKE '%@demo.easyco.com'
);

-- Supprimer les profils
DELETE FROM user_profiles
WHERE email LIKE '%@demo.easyco.com';

-- Supprimer les utilisateurs Auth (via Dashboard)
-- Authentication > Users > Filter @demo.easyco.com > Delete
```

---

## 🚀 Prochaines Étapes

Une fois les données créées avec succès :

1. ✅ Tester la navigation des propriétés
2. ✅ Tester le login avec différents types d'utilisateurs
3. ✅ Vérifier que les propriétaires voient leurs biens
4. ✅ Vérifier que les searchers voient toutes les propriétés publiées
5. ✅ Commencer à implémenter le système de matching
6. ✅ Développer le système de candidatures

---

**Bonne création de données ! 🎉**
