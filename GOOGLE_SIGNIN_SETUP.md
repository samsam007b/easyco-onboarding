# Configuration Google Sign-In - EasyCo iOS

Guide simplifié pour configurer uniquement Google Sign-In.

---

## ✅ Ce qui est déjà fait

- [x] Google Sign-In SDK installé (v9.0.0)
- [x] Info.plist configuré avec Google Client ID
- [x] Code d'implémentation complet
- [x] Interface utilisateur (bouton Google)
- [x] Bouton Apple désactivé temporairement

---

## 📋 Configuration à faire

### Étape 1: Google Cloud Platform (~15 min)

#### 1.1 Accéder à Google Cloud Console
1. Va sur [Google Cloud Console](https://console.cloud.google.com/)
2. Connecte-toi avec ton compte Google
3. **Crée un nouveau projet** ou sélectionne un projet existant:
   - Clique sur le menu déroulant du projet (en haut)
   - Clique "NEW PROJECT"
   - Nom du projet: **EasyCo** (ou autre)
   - Clique "CREATE"

#### 1.2 Activer Google Sign-In API
1. Dans le menu de gauche (☰), va à **APIs & Services > Library**
2. Recherche "**Google Sign-In**"
3. Clique sur **Google Sign-In API**
4. Clique **ENABLE**

#### 1.3 Configurer l'écran de consentement OAuth
1. Va à **APIs & Services > OAuth consent screen**
2. Choisis **External** (sauf si tu as Google Workspace)
3. Clique **CREATE**
4. Remplis les informations:
   - **App name**: `EasyCo`
   - **User support email**: Ton email
   - **App logo**: (optionnel pour l'instant)
   - **Developer contact email**: Ton email
5. Clique **SAVE AND CONTINUE**
6. **Scopes**: Clique **SAVE AND CONTINUE** (on utilisera les scopes par défaut)
7. **Test users**: (optionnel) Ajoute ton email pour tester
8. Clique **SAVE AND CONTINUE**
9. Clique **BACK TO DASHBOARD**

#### 1.4 Créer OAuth Client ID (Web - pour Supabase)
1. Va à **APIs & Services > Credentials**
2. Clique **+ CREATE CREDENTIALS**
3. Choisis **OAuth client ID**
4. **Application type**: Choisis **Web application**
5. Configure:
   - **Name**: `EasyCo Web`
   - **Authorized JavaScript origins**: Laisse vide
   - **Authorized redirect URIs**: Clique **+ ADD URI** et ajoute:
     ```
     https://fgthoyilfupywmpmiuwd.supabase.co/auth/v1/callback
     ```
6. Clique **CREATE**
7. **IMPORTANT**: Une popup s'ouvre avec tes credentials:
   - **Copie le Client ID** et sauvegarde-le quelque part (Notepad, Notes, etc.)
   - **Copie le Client Secret** et sauvegarde-le aussi
   - ⚠️ Tu en auras besoin pour Supabase!

#### 1.5 (Optionnel) Créer OAuth Client ID iOS
Cette étape est optionnelle mais recommandée:
1. Retourne à **Credentials > + CREATE CREDENTIALS > OAuth client ID**
2. **Application type**: Choisis **iOS**
3. Configure:
   - **Name**: `EasyCo iOS`
   - **Bundle ID**: `com.easyco.app` (vérifie dans Xcode si différent)
4. Clique **CREATE**

---

### Étape 2: Supabase Dashboard (~5 min)

#### 2.1 Accéder au Dashboard
1. Va sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Connecte-toi
3. Sélectionne ton projet **fgthoyilfupywmpmiuwd**

#### 2.2 Configurer Google Provider
1. Dans le menu de gauche, va à **Authentication**
2. Clique sur l'onglet **Providers**
3. Trouve **Google** dans la liste des providers
4. Clique sur Google pour l'éditer
5. **Active** le toggle "Enable Sign in with Google" (en haut)
6. Remplis les champs:
   - **Client ID (for OAuth)**: Colle le **Client ID Web** que tu as copié de Google Cloud
   - **Client Secret (for OAuth)**: Colle le **Client Secret Web** que tu as copié de Google Cloud
   - **Authorized Client IDs**: Clique "Add" et ajoute aussi:
     ```
     923210800441-hnh9l9d30jh4tluv3cvmik6n3063pjdg.apps.googleusercontent.com
     ```
     (C'est l'iOS Client ID déjà dans ton Info.plist)
7. Clique **Save** en bas

---

### Étape 3: Test dans l'App (~5 min)

#### 3.1 Build et Run
1. Dans Xcode, **Clean Build Folder**: Product → Clean Build Folder (Cmd+Shift+K)
2. **Build**: Product → Build (Cmd+B)
3. **Run**: Product → Run (Cmd+R)

#### 3.2 Tester Google Sign-In
1. Sur l'écran de login, tu devrais voir le bouton **"Continue with Google"** (gris)
2. Clique dessus
3. Une popup Google devrait s'ouvrir
4. Choisis un compte Google pour te connecter
5. Accepte les permissions

#### 3.3 Vérifier les Logs Xcode
Dans la console Xcode, tu devrais voir:
```
🔵 Starting Google Sign-In flow...
🔵 Got Google credentials, authenticating with Supabase...
🔵 Google Auth Response Status: 200
✅ Google Sign-In successful!
📱 Handling OAuth session...
💾 Token saved to keychain
👤 Fetching user profile...
🚨🚨🚨 NEW VERSION OF getCurrentUser() IS RUNNING! 🚨🚨🚨
📡 Querying profiles WHERE user_id = [uuid]
✅ User profile loaded: [email], type: [userType]
```

Si tu vois ✅ partout, **c'est bon!** 🎉

---

## 🐛 Problèmes Courants

### ❌ "Invalid Client ID"
**Cause**: Le Client ID dans Supabase ne correspond pas à celui de Google Cloud

**Solution**:
1. Vérifie que tu as bien copié le **Web Client ID** (pas l'iOS Client ID)
2. Vérifie qu'il n'y a pas d'espaces au début/fin
3. Re-copie et re-colle dans Supabase

### ❌ "Redirect URI mismatch"
**Cause**: L'URL de callback Supabase n'est pas enregistrée dans Google Cloud

**Solution**:
1. Retourne dans Google Cloud Console
2. APIs & Services > Credentials
3. Clique sur "EasyCo Web" (ton OAuth client)
4. Dans "Authorized redirect URIs", vérifie que tu as bien:
   ```
   https://fgthoyilfupywmpmiuwd.supabase.co/auth/v1/callback
   ```
5. Clique **SAVE**

### ❌ "No presenting view controller"
**Cause**: L'app n'arrive pas à trouver le view controller pour afficher la popup

**Solution**:
1. Redémarre complètement l'app (Stop puis Run)
2. Si ça persiste, redémarre le simulateur

### ❌ Popup Google ne s'ouvre pas
**Solution**:
1. Vérifie les logs Xcode pour voir l'erreur exacte
2. Vérifie que le GIDClientID est bien dans Info.plist
3. Clean et rebuild le projet

### ❌ "keyNotFound: user_id"
**Cause**: Ancien problème de base de données (normalement résolu)

**Solution**:
1. Ce bug devrait être résolu après la migration de la BDD
2. Si ça persiste, vérifie que SupabaseClient.swift compile bien la nouvelle version
3. Regarde les logs pour voir si "🚨🚨🚨 NEW VERSION" apparaît

---

## 📊 Checklist Finale

Avant de dire que tout fonctionne:

- [ ] Google Cloud projet créé
- [ ] OAuth consent screen configuré
- [ ] OAuth Client ID (Web) créé
- [ ] Client ID et Secret copiés
- [ ] Redirect URI Supabase ajoutée dans Google Cloud
- [ ] Supabase provider Google activé
- [ ] Client ID et Secret ajoutés dans Supabase
- [ ] iOS Client ID ajouté aux Authorized Client IDs
- [ ] App build sans erreurs
- [ ] Bouton "Continue with Google" visible
- [ ] Popup Google s'ouvre au clic
- [ ] Authentification réussit (logs ✅)
- [ ] Profil utilisateur se charge
- [ ] Pas d'erreur dans les logs

---

## 🎯 Credentials à Sauvegarder

Garde ces informations en sécurité (gestionnaire de mots de passe):

```
=== GOOGLE CLOUD ===
Project Name: EasyCo
Web Client ID: ____________________________________
Web Client Secret: _________________________________

iOS Client ID (déjà dans Info.plist): 
923210800441-hnh9l9d30jh4tluv3cvmik6n3063pjdg.apps.googleusercontent.com

=== SUPABASE ===
Project ID: fgthoyilfupywmpmiuwd
Callback URL: https://fgthoyilfupywmpmiuwd.supabase.co/auth/v1/callback
```

---

## ✨ Après Configuration

Une fois que Google Sign-In fonctionne:

1. **Teste avec plusieurs comptes Google** pour vérifier que ça marche bien
2. **Teste un nouveau compte** qui n'a jamais utilisé EasyCo avant
3. **Vérifie** que le profil se crée bien dans Supabase (Dashboard > Authentication > Users)
4. Plus tard, tu pourras **réactiver Apple Sign-In** en décommentant le code dans OAuthButtonsView.swift

---

## 🔒 Sécurité

- ⚠️ **NE JAMAIS COMMITER** le Client Secret dans Git
- 💡 Pour la production, crée un nouveau projet Google Cloud avec des credentials séparés
- 💡 Active l'authentification à deux facteurs sur ton compte Google

---

**Temps estimé total: ~25 minutes**

*Dernière mise à jour: 2025-11-17*
