# Migration 041: Saved Searches - Guide d'application

## ⚠️ MIGRATION NON APPLIQUÉE

La migration `041_create_saved_searches.sql` n'a **pas encore été appliquée** à la base de données distante Supabase.

---

## Comment appliquer la migration

### Option 1 : Via Dashboard Supabase (⭐ RECOMMANDÉ)

1. **Connecte-toi au Dashboard Supabase** :
   ```
   https://supabase.com/dashboard/project/fgthoyilfupywmpmiuwd/sql/new
   ```

2. **Copie le contenu de la migration** :
   - Ouvre : `supabase/migrations/041_create_saved_searches.sql`
   - Sélectionne tout et copie (Cmd+A, Cmd+C)

3. **Exécute dans le SQL Editor** :
   - Colle le SQL dans l'éditeur
   - Clique sur le bouton vert "Run" en bas à droite
   - Attends le message de succès

4. **Vérifie que ça a marché** :
   ```sql
   SELECT * FROM saved_searches LIMIT 1;
   ```
   Si aucune erreur → Succès ! ✅

---

### Option 2 : Via Supabase CLI

```bash
# 1. Link ton projet (si pas déjà fait)
npx supabase link --project-ref fgthoyilfupywmpmiuwd

# 2. Applique les migrations
npx supabase db push
```

---

## Qu'est-ce que cette migration crée ?

### Table `saved_searches`
- ✅ `id` (UUID) - Identifiant unique
- ✅ `user_id` (UUID) - Référence à l'utilisateur
- ✅ `name` (VARCHAR) - Nom de la recherche sauvegardée
- ✅ `filters` (JSONB) - Filtres de recherche (ville, prix, chambres, etc.)
- ✅ `email_alerts` (BOOLEAN) - Activer/désactiver les alertes
- ✅ `alert_frequency` (VARCHAR) - Fréquence: instant, daily, weekly
- ✅ `properties_found_count` (INTEGER) - Nombre total de propriétés trouvées
- ✅ `last_match_count` (INTEGER) - Propriétés dans la dernière vérification
- ✅ Timestamps: `created_at`, `updated_at`, `last_checked_at`

### Sécurité (RLS Policies)
- ✅ Les utilisateurs peuvent voir uniquement leurs propres recherches
- ✅ Les utilisateurs peuvent créer leurs propres recherches
- ✅ Les utilisateurs peuvent modifier/supprimer leurs propres recherches
- ✅ Aucun accès cross-user

### Performance (Indexes)
- ✅ Index sur `user_id` pour requêtes rapides
- ✅ Index sur `created_at` pour tri chronologique
- ✅ Index conditionnel sur `email_alerts = true`

### Automatisation
- ✅ Trigger pour auto-update du champ `updated_at`

---

## Fonctionnalités qui nécessitent cette migration

Sans cette migration, les pages suivantes **ne fonctionneront pas** :

### 1. Page Recherches Sauvegardées
```
/dashboard/searcher/saved-searches
```
**Fonctionnalités** :
- Afficher toutes les recherches sauvegardées
- Activer/désactiver les alertes email
- Supprimer une recherche
- Lancer une recherche (applique les filtres)

### 2. Page Browse Properties - Bouton "Sauvegarder"
```
/properties/browse
```
**Fonctionnalités** :
- Bouton "Sauvegarder la recherche" (utilisateurs connectés uniquement)
- Modal pour nommer et sauvegarder la recherche
- Capture automatique des filtres actifs

### 3. Header Searcher - Lien "Mes Recherches"
```
Dans le menu déroulant du profil
```
**Fonctionnalités** :
- Lien vers la page des recherches sauvegardées

---

## Vérification post-migration

### Test 1 : Vérifier que la table existe
```sql
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'saved_searches';
```

### Test 2 : Vérifier les colonnes
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'saved_searches'
ORDER BY ordinal_position;
```
**Attendu** : 11 colonnes

### Test 3 : Vérifier les RLS policies
```sql
SELECT policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'saved_searches';
```
**Attendu** : 4 policies (SELECT, INSERT, UPDATE, DELETE)

### Test 4 : Vérifier les indexes
```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'saved_searches';
```
**Attendu** : 4 indexes (PK + 3 custom)

### Test 5 : Test fonctionnel via script
```bash
node scripts/check-and-apply-migration.js
```

---

## Test de la fonctionnalité dans l'app

Une fois la migration appliquée :

### 1. Redémarre le serveur de dev
```bash
npm run dev
```

### 2. Connecte-toi avec un compte searcher

### 3. Va sur Browse Properties
```
http://localhost:3000/properties/browse
```

### 4. Applique des filtres
- Choisis une ville
- Définis un budget
- Sélectionne nombre de chambres, etc.

### 5. Clique sur "Sauvegarder la recherche"
- Donne un nom à ta recherche
- Clique sur "Sauvegarder"

### 6. Va sur Mes Recherches Sauvegardées
```
http://localhost:3000/dashboard/searcher/saved-searches
```

### 7. Vérifie que tu peux :
- ✅ Voir ta recherche sauvegardée
- ✅ Voir les filtres affichés
- ✅ Activer/désactiver les alertes
- ✅ Lancer la recherche (retour sur Browse avec filtres)
- ✅ Supprimer la recherche

---

## Données de test SQL (Optionnel)

Si tu veux créer des données de test directement en SQL :

```sql
-- Récupère ton user_id
SELECT id, email FROM auth.users WHERE email = 'ton@email.com';

-- Crée une recherche de test
INSERT INTO saved_searches (
  user_id,
  name,
  filters,
  email_alerts,
  alert_frequency
) VALUES (
  '[TON_USER_ID]',
  'Appartement à Bruxelles',
  '{
    "city": "Brussels",
    "minPrice": 500,
    "maxPrice": 1000,
    "bedrooms": 2,
    "propertyType": "Apartment"
  }'::jsonb,
  true,
  'daily'
);

-- Vérifie
SELECT id, name, filters, email_alerts
FROM saved_searches
WHERE user_id = '[TON_USER_ID]';
```

---

## Dépannage

### Erreur : "table saved_searches does not exist"
**Cause** : La migration n'a pas été appliquée
**Solution** : Suis les étapes dans "Comment appliquer la migration"

### Erreur : "permission denied for table saved_searches"
**Cause** : RLS policies non créées
**Solution** : Réapplique toute la migration (pas juste CREATE TABLE)

### Erreur : "Could not find the table 'public.saved_searches' in the schema cache"
**Cause** : Table pas encore créée ou pas encore synchronisée
**Solution** :
1. Vérifie dans le Dashboard Supabase → Table Editor
2. Si la table existe, rafraîchis le cache Supabase
3. Redémarre ton serveur Next.js

### Les recherches ne s'affichent pas
**Cause** : Problème de RLS ou de user_id
**Solution** :
```sql
-- Vérifie les RLS policies
SELECT * FROM pg_policies WHERE tablename = 'saved_searches';

-- Teste sans RLS (admin only, pour debug)
ALTER TABLE saved_searches DISABLE ROW LEVEL SECURITY;
SELECT * FROM saved_searches;
-- NE PAS OUBLIER DE RÉACTIVER:
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
```

---

## Résumé

- 📄 **Fichier migration** : `supabase/migrations/041_create_saved_searches.sql`
- 🎯 **Objectif** : Permettre aux utilisateurs de sauvegarder leurs recherches
- ⚡ **Impact** : Nouvelle fonctionnalité (pas de breaking change)
- 🔒 **Sécurité** : RLS policies + indexes
- ⏱️ **Temps d'application** : ~5 secondes
- 📊 **Taille** : Petite table, grandit avec l'usage

---

**Status actuel** : ❌ Non appliqué
**Action requise** : Appliquer via Dashboard Supabase SQL Editor
**Priorité** : Moyenne (fonctionnalité non critique mais déjà codée)
