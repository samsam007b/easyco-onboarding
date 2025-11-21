# 🔄 Guide de Restauration des Données Demo EasyCo

## 📋 Résumé
Ce guide explique comment restaurer les **12 utilisateurs demo** et **5 propriétés** pour tester la fonctionnalité "tinder" (swipe) d'EasyCo.

---

## 🎯 Ce qui sera créé

### 👥 12 Utilisateurs Demo

**5 Chercheurs (Searchers):**
- Sophie Laurent - Marketing Manager (€600-900)
- Ahmed El Mansouri - Étudiant ULB (€400-600)
- Emma Van Der Berg - Designer Freelance (€700-1000)
- Lucas Dubois - Comptable en couple (€900-1300)
- Maria Santos - EU Policy Advisor (€750-1100)

**4 Propriétaires (Owners):**
- Jean-Marc Petit - Appt Ixelles
- Isabelle Moreau - Multi-propriétés
- Thomas Janssens - Studio Schaerbeek
- Sophie Vermeulen - Coliving Forest

**3 Colocataires (Residents):**
- Pierre Lecomte - Ingénieur Civil
- Laura Gonzalez - Doctorante
- Maxime Dubois - Développeur

### 🏠 5 Propriétés à Bruxelles
1. **Appartement 2ch - Ixelles** (€1,250/mois) - Jean-Marc
2. **Studio - Schaerbeek** (€650/mois) - Thomas
3. **Coliving - Forest** (€695/mois) - Sophie V.
4. **Appartement 3ch - Woluwe** (€1,800/mois) - Isabelle
5. **Maison 4ch - Saint-Gilles** (€2,100/mois) - Isabelle

**Tous les comptes:**
- 📧 Email: `prenom.nom@demo.easyco.com`
- 🔐 Mot de passe: `Demo123!`

---

## 🚀 Méthode 1: Exécution SQL dans Supabase (RECOMMANDÉ)

### Étapes:

1. **Ouvre ton dashboard Supabase**
   - Va sur: https://supabase.com/dashboard
   - Connecte-toi à ton compte
   - Sélectionne le projet **EasyCo** (fgthoyilfupywmpmiuwd)

2. **Ouvre l'éditeur SQL**
   - Dans le menu de gauche, clique sur **SQL Editor**
   - Clique sur **New query** pour créer une nouvelle requête

3. **Copie-colle le fichier SQL**
   - Ouvre le fichier: `supabase/seed-complete-with-auth.sql`
   - Copie TOUT le contenu (362 lignes)
   - Colle dans l'éditeur SQL de Supabase

4. **Exécute la requête**
   - Clique sur le bouton **Run** (ou Ctrl+Enter)
   - Attends environ 5-10 secondes

5. **Vérifie les résultats**
   - Tu devrais voir en bas:
     ```
     ✅ SEED COMPLETE!
     auth_users: 12
     profiles: 12
     properties: 5
     ```

6. **Vérifie dans les tables**
   - Va dans **Table Editor** dans le menu de gauche
   - Clique sur la table `user_profiles` → Tu devrais voir 12 lignes
   - Clique sur la table `properties` → Tu devrais voir 5 lignes
   - Va dans **Authentication** → Tu devrais voir 12 utilisateurs avec `@demo.easyco.com`

---

## 🔧 Méthode 2: Script Node.js (SI PROBLÈME RÉSEAU RÉSOLU)

Si tu veux utiliser le script TypeScript automatisé:

```bash
# 1. Installe les dépendances (déjà fait)
npm install

# 2. Vérifie que .env.local existe avec tes credentials
cat .env.local

# 3. Exécute le script de seed
npm run seed:demo
```

**Note:** Cette méthode a actuellement un problème de résolution DNS dans l'environnement de développement. Utilise la Méthode 1 à la place.

---

## ✅ Vérification après restauration

### Test de connexion:

1. **Lance l'application**
   ```bash
   npm run dev
   ```

2. **Ouvre le navigateur**
   - Va sur: http://localhost:3000/login

3. **Teste une connexion**
   - Email: `sophie.laurent@demo.easyco.com`
   - Mot de passe: `Demo123!`
   - Tu devrais être redirigé vers le dashboard Searcher

4. **Teste la fonctionnalité Tinder**
   - Va sur: http://localhost:3000/properties/browse
   - Tu devrais voir les cartes de propriétés
   - Swipe à gauche = Passer (X)
   - Swipe à droite = J'aime (Coeur)
   - Swipe vers le haut = Super Like (Étoile)

---

## 🧪 Scénarios de test suggérés

### Scénario 1: Chercheur budget étudiant
- Login: `ahmed.elmansouri@demo.easyco.com`
- Va sur Browse Properties
- Le **Studio Schaerbeek** (€650) devrait matcher parfaitement

### Scénario 2: Chercheur professionnel
- Login: `sophie.laurent@demo.easyco.com`
- Va sur Browse Properties
- L'**Appt Ixelles** (€1,250) et le **Coliving Forest** (€695) devraient être suggérés

### Scénario 3: Propriétaire multi-biens
- Login: `isabelle.moreau@demo.easyco.com`
- Va sur Dashboard Owner
- Tu devrais voir tes **2 propriétés** (Woluwe + Saint-Gilles)

### Scénario 4: Matching Colocataires
- Login: `pierre.lecomte@demo.easyco.com`
- Va sur Roommate Matching
- Swipe sur d'autres residents pour tester la compatibilité

---

## 🗑️ Nettoyage des données (si besoin)

Si tu veux supprimer toutes les données demo:

```sql
-- 1. Supprimer les propriétés
DELETE FROM properties
WHERE owner_id IN (
  SELECT user_id FROM user_profiles
  WHERE user_id IN (
    SELECT id FROM auth.users WHERE email LIKE '%@demo.easyco.com'
  )
);

-- 2. Supprimer les profils
DELETE FROM user_profiles
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%@demo.easyco.com'
);

-- 3. Supprimer les utilisateurs Auth
-- (Faire manuellement via Dashboard > Authentication > Users)
```

---

## 🔐 Sécurité

- ✅ Le fichier `.env.local` contient tes credentials Supabase
- ✅ Il est déjà dans `.gitignore` (ligne 12: `.env*`)
- ✅ Il ne sera **JAMAIS** commité sur Git
- ⚠️ Ne partage jamais ta `SUPABASE_SERVICE_ROLE_KEY` publiquement

---

## 📚 Fichiers importants

- `scripts/seed-demo-data.ts` - Script TypeScript automatisé
- `supabase/seed-complete-with-auth.sql` - Fichier SQL complet (RECOMMANDÉ)
- `DEMO_DATA_SUMMARY.md` - Documentation détaillée des données
- `.env.local` - Credentials Supabase (NE PAS COMMITER)

---

## 🆘 Problèmes courants

### ❌ Erreur: "user already exists"
**Solution:** Les utilisateurs existent déjà. Le script gère automatiquement les doublons, tu peux réexécuter sans problème.

### ❌ Erreur: "fetch failed" / "EAI_AGAIN"
**Solution:** Problème de réseau DNS. Utilise la Méthode 1 (SQL direct dans Supabase).

### ❌ Erreur: "password authentication failed"
**Solution:** Vérifie que ta `SUPABASE_SERVICE_ROLE_KEY` est correcte dans `.env.local`.

### ❌ Les propriétés n'apparaissent pas
**Solution:** Vérifie que les propriétés ont `status = 'published'` et `is_available = true`.

---

## 📞 Besoin d'aide?

Si tu rencontres des problèmes:
1. Vérifie que toutes les migrations Supabase sont à jour
2. Vérifie les logs dans Supabase Dashboard > Logs
3. Teste la connexion avec `curl https://fgthoyilfupywmpmiuwd.supabase.co`

---

**Créé le:** 2025-11-21
**Dernière mise à jour:** 2025-11-21
