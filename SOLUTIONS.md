# Solutions aux Problèmes Identifiés

Ce document explique toutes les solutions implémentées pour résoudre vos problèmes.

---

## 🎯 Problèmes Résolus

### 1. ✅ Impossible de changer de rôle (Searcher/Owner/Resident)

**Problème** : Une fois un rôle choisi, impossible de le modifier.

**Solution** :
- **Page Profile** : Nouveau "Role Switcher" ajouté
- Vous pouvez maintenant changer de rôle à tout moment
- Changement de rôle → réinitialise l'onboarding automatiquement
- Redirection vers le nouvel onboarding

**Comment utiliser** :
1. Aller sur `/profile`
2. Section "Account Role"
3. Sélectionner nouveau rôle dans le dropdown
4. Cliquer "Change Role"
5. Vous serez redirigé vers l'onboarding du nouveau rôle

---

### 2. ✅ Delete Account ne fonctionne pas

**Problème** : Le bouton "Delete My Account" ne supprimait pas le compte correctement.

**Solution** :
- Nouvelle API route `/api/user/delete`
- Utilise Supabase Admin API avec Service Role Key
- Supprime correctement de :
  - `auth.users` (Supabase Auth)
  - `users` table
  - `user_profiles` table
- Logout automatique après suppression

**Setup requis** :
1. Lire [ENV_SETUP.md](ENV_SETUP.md)
2. Obtenir `SUPABASE_SERVICE_ROLE_KEY` depuis Supabase Dashboard
3. Ajouter à `.env.local` :
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Redémarrer le serveur : `npm run dev`

**Comment utiliser** :
1. Aller sur `/profile`
2. Scroll jusqu'à "Danger Zone"
3. Cliquer "Delete Account"
4. Taper "DELETE" pour confirmer
5. Cliquer "Delete My Account"

---

### 3. ✅ Mode Guest / Testing rapide

**Problème** : Pas de moyen de tester rapidement sans refaire l'onboarding.

**Solution** : **DevTools Component** 🛠️

Un panneau de développement flottant (coin bas-droit) avec :
- Bouton violet avec icône "Settings"
- Quick Switch Role (Searcher/Owner/Resident)
  - Change de rôle INSTANTANÉMENT
  - Pas besoin de refaire l'onboarding
  - Marque automatiquement onboarding comme complété
- Reset Onboarding
- Quick Logout
- Navigate to Profile

**Caractéristiques** :
- ⚠️ **Visible uniquement en mode développement** (NODE_ENV=development)
- Invisible en production
- Flottant sur toutes les pages
- Super pratique pour tester rapidement

**Comment utiliser** :
1. Cliquer sur le bouton violet (bas-droit)
2. Panneau DevTools s'ouvre
3. Cliquer sur "Searcher" / "Owner" / "Resident" → Switch instantané
4. Ou utiliser "Reset Onboarding" pour refaire le parcours

---

### 4. ✅ Pas de Logout accessible partout

**Problème** : Logout disponible uniquement dans `/profile`.

**Solution** :
- **DevTools** : Bouton Logout (toutes les pages en dev mode)
- **Profile Page** : Header avec bouton Logout
- Chaque dashboard a maintenant accès au DevTools avec Logout

---

### 5. ✅ Redo Onboarding

**Problème** : Impossible de refaire l'onboarding si on veut tester.

**Solution** :
- **Profile Page** : Nouveau bouton "Redo Onboarding"
- **DevTools** : Bouton "Reset Onboarding"
- Réinitialise `onboarding_completed = false`
- Redirige vers l'onboarding du rôle actuel

---

## 🚀 Nouvelles Fonctionnalités

### DevTools Panel

**Localisation** : Bouton violet flottant (bas-droit de l'écran)

**Fonctions** :
```
┌─────────────────────────────────┐
│  🟢 Dev Tools                  │
├─────────────────────────────────┤
│ QUICK SWITCH ROLE               │
│ [Searcher] [Owner] [Resident]  │
│                                 │
│ QUICK ACTIONS                   │
│ • Reset Onboarding              │
│ • Go to Profile                 │
│ • Logout                        │
└─────────────────────────────────┘
```

**Avantages** :
- ⚡ Tests ultra-rapides
- 🔄 Changement de rôle instantané
- 🎯 Pas besoin de refaire l'onboarding à chaque fois
- 🔐 Invisible en production (sécurisé)

---

### Profile Page Améliorée

**Nouvelles sections** :

1. **Account Role** :
   - Voir le rôle actuel
   - Status onboarding (completed / not completed)
   - Dropdown pour changer de rôle
   - Bouton "Redo Onboarding"

2. **Personal Information** :
   - Edit full name (déjà existant)
   - Email avec status verified (déjà existant)

3. **Security** :
   - Change password (déjà existant, amélioré)

4. **Danger Zone** :
   - Delete Account (maintenant fonctionnel !)

---

## 📝 Workflow de Test Recommandé

### Scénario 1 : Tester rapidement différents rôles

```
1. Login avec votre compte
2. Cliquer sur DevTools (bouton violet)
3. Cliquer "Searcher" → Vous êtes Searcher
4. Explorer le dashboard Searcher
5. Cliquer DevTools → "Owner" → Vous êtes Owner
6. Explorer le dashboard Owner
7. Etc.
```

### Scénario 2 : Refaire un onboarding complet

```
1. Aller sur /profile
2. Section "Account Role"
3. Cliquer "Redo Onboarding"
4. Parcourir tout l'onboarding
5. Arriver au dashboard
```

### Scénario 3 : Changer définitivement de rôle

```
1. Aller sur /profile
2. Section "Account Role"
3. Sélectionner nouveau rôle (ex: Owner)
4. Cliquer "Change Role"
5. Faire l'onboarding Owner
6. Arriver au dashboard Owner
```

### Scénario 4 : Supprimer son compte

```
1. Aller sur /profile
2. Scroll jusqu'à "Danger Zone"
3. Cliquer "Delete Account"
4. Taper "DELETE"
5. Confirmer
6. Compte supprimé → logout automatique
```

---

## ⚙️ Configuration Requise

### Environment Variables

Fichier : `.env.local`

```bash
# Supabase Configuration (déjà existant)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# ⚠️ NOUVEAU : Required pour Delete Account
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Comment obtenir le Service Role Key** :
1. Aller sur Supabase Dashboard
2. Project Settings → API
3. Scroll jusqu'à "Service Role Key"
4. Cliquer "Reveal"
5. Copier la clé
6. Ajouter dans `.env.local`
7. **Redémarrer le serveur** : `npm run dev`

**⚠️ IMPORTANT** :
- Ne JAMAIS commit ce fichier sur Git
- Ne JAMAIS partager cette clé publiquement
- Cette clé bypasse Row Level Security
- Utilisée uniquement côté serveur (API routes)

---

## 🎨 Interface Utilisateur

### Profile Page
- `/profile`
- 4 sections principales
- Design cohérent avec le reste de l'app
- Toasts pour feedback utilisateur

### DevTools
- Floating button (violet)
- Panneau déroulant moderne
- Indicateur "Dev Mode" (point vert animé)
- Fermeture par bouton X

---

## 🔐 Sécurité

### Service Role Key
- Utilisée UNIQUEMENT dans `/api/user/delete/route.ts`
- Jamais exposée au client
- Stockée dans `.env.local` (ignoré par Git)
- Requise pour supprimer des comptes auth Supabase

### DevTools
- Visible uniquement en mode développement
- Check: `process.env.NODE_ENV !== 'development'`
- Invisible automatiquement en production
- Aucun risque de sécurité en prod

---

## 📊 Fichiers Modifiés/Créés

### Nouveaux Fichiers
```
✅ app/api/user/delete/route.ts    - API route pour supprimer compte
✅ components/DevTools.tsx          - Panneau DevTools flottant
✅ ENV_SETUP.md                     - Instructions Service Role Key
✅ SOLUTIONS.md                     - Ce document
```

### Fichiers Modifiés
```
✅ app/profile/page.tsx             - Rewrite complet avec nouvelles features
✅ app/layout.tsx                   - Ajout Toaster + DevTools
```

---

## 🐛 Troubleshooting

### Delete Account ne marche toujours pas

**Problème** : Erreur 500 ou "Failed to delete account"

**Solution** :
1. Vérifier que `SUPABASE_SERVICE_ROLE_KEY` est dans `.env.local`
2. Vérifier que la clé est correcte (copier/coller depuis Supabase)
3. Redémarrer le serveur : `npm run dev`
4. Vérifier dans la console du serveur s'il y a des erreurs

---

### DevTools n'apparaît pas

**Problème** : Pas de bouton violet

**Solution** :
1. Vérifier que vous êtes en mode développement
2. Check console : `console.log(process.env.NODE_ENV)` devrait afficher "development"
3. Vérifier que `npm run dev` est utilisé (pas `npm run build && npm start`)
4. Refresh la page (Cmd+R ou Ctrl+R)

---

### Role Switcher ne marche pas

**Problème** : Erreur ou pas de redirection

**Solution** :
1. Vérifier que vous êtes connecté (check `/profile`)
2. Vérifier que vous sélectionnez un NOUVEAU rôle (différent de l'actuel)
3. Check console pour erreurs
4. Vérifier permissions Supabase (RLS policies)

---

## ✨ Avantages des Solutions

### Avant
- ❌ Coincé avec un seul rôle
- ❌ Delete Account cassé
- ❌ Refaire l'onboarding = créer nouveau compte
- ❌ Logout pas accessible
- ❌ Tests lents et pénibles

### Après
- ✅ Changement de rôle à volonté
- ✅ Delete Account fonctionnel
- ✅ Redo Onboarding en 1 clic
- ✅ DevTools pour tests rapides
- ✅ Switch instantané entre rôles (dev mode)
- ✅ Logout accessible partout
- ✅ Tests ultra-rapides

---

## 🎯 Prochaines Étapes Recommandées

1. **Ajouter le Service Role Key** à `.env.local` (voir [ENV_SETUP.md](ENV_SETUP.md))
2. **Redémarrer le serveur** : `npm run dev`
3. **Tester le DevTools** : Cliquer bouton violet
4. **Tester Quick Switch** : Changer de rôle instantanément
5. **Tester Delete Account** : Créer compte test et le supprimer
6. **Tester Role Switcher** : Changer de rôle via Profile

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifier ce document (SOLUTIONS.md)
2. Vérifier ENV_SETUP.md pour la configuration
3. Vérifier SETUP.md pour le setup général
4. Check console navigateur et serveur pour erreurs

---

**Dernière mise à jour** : Octobre 2025
**Commit** : `251ecfc` - feat: add role switching, working delete account, and DevTools
