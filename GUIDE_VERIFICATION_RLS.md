# 🔍 Guide de Vérification RLS - Supabase

**Date**: 28 Octobre 2025
**Objectif**: Vérifier et confirmer que les corrections RLS ont été appliquées correctement

---

## 📋 ÉTAPE 1: Vérifier l'État Actuel dans Supabase

### 1.1 Ouvrir Supabase SQL Editor

1. Allez sur: https://supabase.com/dashboard
2. Sélectionnez votre projet: **easyco-onboarding**
3. Dans le menu latéral, cliquez sur: **SQL Editor**

### 1.2 Exécuter le Diagnostic

1. Copiez **tout le contenu** du fichier: `supabase/DIAGNOSTIC_RLS_STATUS.sql`
2. Collez-le dans le SQL Editor
3. Cliquez sur **Run** (ou Cmd/Ctrl + Enter)

### 1.3 Analyser les Résultats

**Ce que vous devriez voir:**

#### ✅ Tables Existent:
```
table_name       | table_exists
-----------------|-------------
notifications    | true
user_profiles    | true
group_members    | true
groups           | true
```

#### ✅ RLS Activé:
```
tablename        | rls_enabled
-----------------|------------
notifications    | true
user_profiles    | true
group_members    | true
```

#### ✅ Politiques (notifications):
```
policy_name                    | command_type
-------------------------------|-------------
notifications_select_own       | SELECT
notifications_insert_own       | INSERT
notifications_insert_service   | INSERT
notifications_update_own       | UPDATE
notifications_delete_own       | DELETE
```

#### ✅ Politiques (user_profiles):
```
policy_name                    | command_type
-------------------------------|-------------
user_profiles_select_own       | SELECT
user_profiles_select_public    | SELECT
user_profiles_insert_own       | INSERT
user_profiles_update_own       | UPDATE
user_profiles_delete_own       | DELETE
```

#### ✅ Politiques (group_members):
```
policy_name                              | command_type
-----------------------------------------|-------------
group_members_select_own_groups          | SELECT
group_members_insert_by_creator          | INSERT
group_members_update_by_creator_or_self  | UPDATE
group_members_delete_by_creator_or_self  | DELETE
```

---

## 🔧 ÉTAPE 2: Appliquer la Migration (Si Non Appliquée)

### 2.1 Vérifier si la Migration est Nécessaire

Si le diagnostic montre:
- ❌ Des politiques manquantes
- ❌ Des noms de politiques différents (anciennes politiques)
- ❌ RLS désactivé

**Alors vous devez appliquer la migration.**

### 2.2 Appliquer la Migration

1. Dans le **SQL Editor** de Supabase
2. Copiez **tout le contenu** du fichier: `supabase/migrations/029_fix_cors_and_rls_notifications.sql`
3. Collez-le dans le SQL Editor
4. Cliquez sur **Run**
5. Attendez le message: **Success. No rows returned**

### 2.3 Vérifier Après Application

1. Re-exécutez le diagnostic (`DIAGNOSTIC_RLS_STATUS.sql`)
2. Comparez avec les résultats attendus ci-dessus
3. Toutes les politiques doivent être présentes

---

## ✅ ÉTAPE 3: Vérification Finale

### 3.1 Exécuter le Script de Vérification

1. Dans le **SQL Editor** de Supabase
2. Copiez **tout le contenu** du fichier: `supabase/VERIFY_FIX_FINAL.sql`
3. Collez-le dans le SQL Editor
4. Cliquez sur **Run**

### 3.2 Résultats Attendus

#### ✅ RLS Status:
```
check_type   | tablename      | status
-------------|----------------|---------------
✅ RLS Status| group_members  | ✅ ENABLED
✅ RLS Status| notifications  | ✅ ENABLED
✅ RLS Status| user_profiles  | ✅ ENABLED
```

#### 📊 Policy Count:
```
check_type      | tablename      | policy_count | status
----------------|----------------|--------------|------------------
📊 Policy Count | group_members  | 4           | ✅ OK (4+ policies)
📊 Policy Count | notifications  | 5           | ✅ OK (4+ policies)
📊 Policy Count | user_profiles  | 5           | ✅ OK (4+ policies)
```

#### 🔐 Permissions:
```
check_type    | table_name     | grantee       | permissions
--------------|----------------|---------------|-------------------------
🔐 Permissions| group_members  | authenticated | DELETE, INSERT, SELECT, UPDATE
🔐 Permissions| group_members  | service_role  | DELETE, INSERT, SELECT, UPDATE
🔐 Permissions| notifications  | authenticated | DELETE, INSERT, SELECT, UPDATE
🔐 Permissions| notifications  | service_role  | DELETE, INSERT, SELECT, UPDATE
🔐 Permissions| user_profiles  | authenticated | DELETE, INSERT, SELECT, UPDATE
🔐 Permissions| user_profiles  | service_role  | DELETE, INSERT, SELECT, UPDATE
```

#### 🛡️ Security Test:
```
check_type       | tablename      | security_status
-----------------|----------------|--------------------------------
🛡️ Security Test| group_members  | ✅ SECURE (RLS enabled + SELECT policy exists)
🛡️ Security Test| notifications  | ✅ SECURE (RLS enabled + SELECT policy exists)
🛡️ Security Test| user_profiles  | ✅ SECURE (RLS enabled + SELECT policy exists)
```

---

## 🧪 ÉTAPE 4: Tester l'Application

### 4.1 Vérifier que le Serveur Dev Tourne

```bash
# Le serveur dev devrait déjà tourner
# Sinon, démarrez-le:
npm run dev
```

Ouvrez: http://localhost:3000

### 4.2 Ouvrir la Console Développeur

1. **Mac**: Cmd + Option + J
2. **Windows/Linux**: Ctrl + Shift + J
3. Ou: Clic droit → Inspecter → Console

### 4.3 Vérifier les Erreurs

**AVANT LES CORRECTIONS** (ce que vous aviez):
```
❌ Fetch API cannot load https://...supabase.co/rest/v1/notifications due to access control checks
❌ Error loading notifications: Object
❌ Failed to load resource: the server responded with a status of 400 (Bad Request) - user_profiles
❌ Failed to load resource: the server responded with a status of 406 (Not Acceptable) - group_members
```

**APRÈS LES CORRECTIONS** (ce que vous devez voir):
```
✅ Aucune erreur CORS
✅ Aucune erreur 400/406
✅ Les requêtes vers notifications réussissent
✅ Les requêtes vers user_profiles réussissent
✅ Les requêtes vers group_members réussissent
```

### 4.4 Tester les Fonctionnalités

#### Test 1: Notifications Dropdown
1. Cliquez sur l'icône 🔔 (cloche) en haut à droite
2. Le dropdown doit s'ouvrir **sans erreurs**
3. Vérifiez la console: **aucune erreur rouge**

**Résultat attendu**: ✅ Dropdown s'ouvre, pas d'erreur

#### Test 2: Dashboard Searcher
1. Allez sur: http://localhost:3000/dashboard/searcher
2. Vérifiez que la page charge complètement
3. Vérifiez la console: **aucune erreur 400/406**

**Résultat attendu**: ✅ Page charge, profils visibles

#### Test 3: Group Management
1. Sur le dashboard searcher, cherchez la section "Group Management"
2. Vérifiez que les groupes s'affichent
3. Vérifiez la console: **aucune erreur sur group_members**

**Résultat attendu**: ✅ Groupes visibles, pas d'erreur

#### Test 4: Profils Utilisateurs
1. Allez sur: http://localhost:3000/dashboard/my-profile
2. Vérifiez que votre profil charge
3. Vérifiez la console: **aucune erreur sur user_profiles**

**Résultat attendu**: ✅ Profil charge, pas d'erreur

---

## 📊 RÉSUMÉ DES VÉRIFICATIONS

### Checklist Complète

- [ ] **Supabase**: Diagnostic exécuté, toutes les tables existent
- [ ] **Supabase**: RLS activé sur les 3 tables (notifications, user_profiles, group_members)
- [ ] **Supabase**: 4+ politiques par table
- [ ] **Supabase**: Permissions GRANT pour authenticated
- [ ] **Supabase**: Vérification finale passée (VERIFY_FIX_FINAL.sql)
- [ ] **App**: Serveur dev tourne sur localhost:3000
- [ ] **App**: Console sans erreurs CORS
- [ ] **App**: Console sans erreurs 400/406
- [ ] **App**: Notifications dropdown fonctionne
- [ ] **App**: Dashboard searcher charge
- [ ] **App**: Group management visible
- [ ] **App**: Profils utilisateurs accessibles

---

## 🚨 Si Problèmes Persistent

### Problème: Erreurs CORS persistent après migration

**Solution**:
1. Videz le cache du navigateur (Cmd+Shift+Delete)
2. Fermez et rouvrez le navigateur
3. Ouvrez en mode Incognito
4. Vérifiez que vous avez bien exécuté la migration dans Supabase

### Problème: Politiques n'apparaissent pas après migration

**Solution**:
1. Re-exécutez le diagnostic pour voir l'état actuel
2. Vérifiez les erreurs dans l'onglet "Messages" du SQL Editor
3. Si des anciennes politiques existent, la migration les supprime automatiquement
4. Re-exécutez la migration 029

### Problème: 400/406 errors persistent

**Solution**:
1. Vérifiez que les permissions GRANT ont été appliquées:
   ```sql
   SELECT table_name, grantee, privilege_type
   FROM information_schema.table_privileges
   WHERE table_schema = 'public'
   AND table_name IN ('notifications', 'user_profiles', 'group_members')
   AND grantee = 'authenticated';
   ```
2. Si aucune permission pour 'authenticated', re-exécutez la migration

### Problème: Dev server ne démarre pas

**Solution**:
```bash
# Tuer les processus Node existants
killall node

# Redémarrer
npm run dev
```

---

## 📝 Commandes Utiles

### Vérifier le serveur dev
```bash
# Voir si le serveur tourne
lsof -i :3000

# Logs en temps réel
npm run dev
```

### Vérifier les variables d'environnement
```bash
# Afficher les variables Supabase
grep SUPABASE .env.local
```

### Redémarrer proprement
```bash
# Tuer Node, nettoyer, redémarrer
killall node && npm run dev
```

---

## ✅ SUCCÈS: Comment Savoir que Tout Fonctionne?

### Signes de Succès

1. ✅ **Console propre**: Aucune erreur rouge dans Developer Console
2. ✅ **Notifications**: Le dropdown s'ouvre sans erreur
3. ✅ **Dashboards**: Tous les dashboards chargent rapidement
4. ✅ **Groupes**: Les membres des groupes sont visibles
5. ✅ **Profils**: Les profils se chargent correctement
6. ✅ **Network tab**: Toutes les requêtes Supabase retournent 200 OK

### Vérification Network (Optionnelle mais Recommandée)

1. Ouvrez Developer Tools → **Network**
2. Filtrez par: **supabase**
3. Rechargez la page
4. Vérifiez que toutes les requêtes sont **200 OK** (pas 400/406)

---

## 🎉 Prochaines Étapes

Une fois tout vérifié et fonctionnel:

1. ✅ Committer le fichier VERIFY_FIX_FINAL.sql
2. ✅ Documenter dans SESSION_SUMMARY
3. ✅ Continuer le développement

**Commande Git:**
```bash
git add supabase/VERIFY_FIX_FINAL.sql
git commit -m "docs: add final RLS verification script

✅ All RLS policies verified and working correctly

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

**Créé le**: 28 Octobre 2025
**Par**: Claude Code
**Status**: Ready for verification
