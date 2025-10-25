# 🗄️ Guide de Configuration de la Base de Données Supabase

Ce guide te permettra de configurer complètement la base de données pour l'application EasyCo.

---

## 📋 Prérequis

- ✅ Compte Supabase actif
- ✅ Projet Supabase : `fgthoyilfupywmpmiuwd`
- ✅ Accès au Dashboard Supabase

---

## 🎯 Étapes à Suivre

### ✅ Étape 1 : Vérifier le Schéma de Base (déjà fait normalement)

1. Va sur **Supabase Dashboard** : https://supabase.com/dashboard
2. Sélectionne ton projet : **fgthoyilfupywmpmiuwd**
3. Va dans **Table Editor** (icône de tableau à gauche)
4. Vérifie que les tables suivantes existent :
   - ✅ `users`
   - ✅ `user_profiles`
   - ✅ `user_sessions`

Si ces tables existent → **Passe à l'étape 2**
Si elles n'existent pas → Exécute d'abord `supabase/schema.sql`

---

### 🏠 Étape 2 : Créer la Table des Propriétés

1. Dans le Dashboard Supabase, va dans **SQL Editor** (icône </> à gauche)
2. Clique sur **"New Query"**
3. Copie TOUT le contenu du fichier : `supabase/properties-schema.sql`
4. Colle-le dans l'éditeur SQL
5. Clique sur **"Run"** (bouton vert en bas à droite)
6. ✅ Tu devrais voir : **"Success. No rows returned"**

**Vérification :**
- Retourne dans **Table Editor**
- Tu devrais maintenant voir la table **`properties`** avec toutes ses colonnes

---

### 📦 Étape 3 : Créer le Bucket de Storage

1. Dans le Dashboard, va dans **Storage** (icône de dossier à gauche)
2. Clique sur **"Create a new bucket"**
3. Configure le bucket :
   - **Name** : `property-images`
   - **Public bucket** : ✅ **OUI** (cocher la case)
   - **File size limit** : `5 MB` (optionnel)
   - **Allowed MIME types** : `image/*` (optionnel)
4. Clique sur **"Create bucket"**

**Vérification :**
- Tu devrais voir le bucket **property-images** dans la liste
- Le badge **"public"** doit apparaître à côté

---

### 🔐 Étape 4 : Appliquer les Politiques RLS du Storage

1. Reste dans **Storage**
2. Clique sur le bucket **property-images**
3. Va dans l'onglet **"Policies"** en haut
4. Clique sur **"New Policy"**

**Option A : Via l'interface (recommandé pour débutants)**

Pour chaque policy, clique sur "New Policy" → "Create a policy from scratch" :

**Policy 1 : Anyone can view**
- **Policy name** : `Anyone can view property images`
- **Allowed operation** : `SELECT`
- **Policy definition** :
  ```sql
  bucket_id = 'property-images'
  ```

**Policy 2 : Owners can upload**
- **Policy name** : `Owners can upload property images`
- **Allowed operation** : `INSERT`
- **WITH CHECK definition** :
  ```sql
  bucket_id = 'property-images' AND auth.uid() IS NOT NULL
  ```

**Policy 3 : Owners can update**
- **Policy name** : `Owners can update own property images`
- **Allowed operation** : `UPDATE`
- **USING definition** :
  ```sql
  bucket_id = 'property-images' AND auth.uid() IS NOT NULL
  ```
- **WITH CHECK definition** :
  ```sql
  bucket_id = 'property-images' AND auth.uid() IS NOT NULL
  ```

**Policy 4 : Owners can delete**
- **Policy name** : `Owners can delete own property images`
- **Allowed operation** : `DELETE`
- **USING definition** :
  ```sql
  bucket_id = 'property-images' AND auth.uid() IS NOT NULL
  ```

**Option B : Via SQL (pour utilisateurs avancés)**

1. Va dans **SQL Editor**
2. Copie le contenu de `supabase/storage-setup.sql`
3. Colle et exécute

**Vérification :**
- Retourne dans **Storage** → **property-images** → **Policies**
- Tu devrais voir 4 policies listées

---

## ✅ Vérification Finale

### Check-list complète :

- [ ] Table **users** existe
- [ ] Table **user_profiles** existe
- [ ] Table **properties** existe avec ~30 colonnes
- [ ] Bucket **property-images** existe et est PUBLIC
- [ ] 4 policies RLS configurées sur storage.objects
- [ ] Variable `SUPABASE_SERVICE_ROLE_KEY` dans `.env.local`

### Test rapide dans SQL Editor :

```sql
-- Vérifier que la table properties existe
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'properties';

-- Devrait retourner ~30 lignes avec les noms des colonnes

-- Vérifier les policies
SELECT * FROM pg_policies WHERE tablename = 'properties';

-- Devrait retourner 5 policies
```

---

## 🚀 Prochaines Étapes

Une fois tout configuré :

1. Redémarre le serveur de développement :
   ```bash
   npm run dev
   ```

2. Teste les fonctionnalités :
   - Login en tant qu'Owner
   - Va sur `/dashboard/owner`
   - Clique "Add New Property"
   - Remplis le formulaire et upload une image
   - Vérifie que tout fonctionne

---

## 🆘 En Cas de Problème

### Erreur : "relation 'properties' does not exist"
→ La table n'a pas été créée. Retourne à l'étape 2.

### Erreur : "new row violates row-level security policy"
→ Les RLS policies ne sont pas correctes. Vérifie l'étape 2.

### Erreur : "Storage bucket does not exist"
→ Le bucket n'a pas été créé. Retourne à l'étape 3.

### Erreur lors de l'upload d'images : "Access denied"
→ Les storage policies ne sont pas appliquées. Retourne à l'étape 4.

### Erreur : "service_role key not found"
→ Vérifie que `.env.local` contient bien la `SUPABASE_SERVICE_ROLE_KEY`

---

## 📞 Contact

Si tu rencontres des problèmes, partage :
1. Le message d'erreur exact
2. L'étape où ça bloque
3. Un screenshot du Dashboard Supabase

---

**Créé le** : 26 octobre 2025
**Projet** : EasyCo Onboarding Platform
**Version** : 1.0
