# OAuth Setup Checklist - EasyCo

Utilise cette checklist pour configurer OAuth Google et Apple étape par étape.

---

## ✅ DÉJÀ FAIT

- [x] Code d'implémentation OAuth complet
- [x] Google Sign-In SDK installé (v9.0.0)
- [x] Apple Sign-In framework intégré
- [x] Google Client ID dans Info.plist
- [x] URL Schemes configurés
- [x] OAuthButtonsView ajouté à LoginView

---

## 📋 À FAIRE - Configuration

### 1. Xcode Configuration

- [ ] **Ouvrir Xcode** et sélectionner le target EasyCo
- [ ] **Ajouter Capability**: Signing & Capabilities > + Capability > "Sign in with Apple"
- [ ] **Noter le Bundle ID** (probablement `com.easyco.app`)

---

### 2. Google Cloud Platform

- [ ] **Aller sur** [Google Cloud Console](https://console.cloud.google.com/)
- [ ] **Créer/Sélectionner** un projet
- [ ] **Activer** Google Sign-In API (APIs & Services > Library)
- [ ] **Configurer** l'écran de consentement OAuth (OAuth consent screen)
- [ ] **Créer credentials OAuth 2.0**:
  - Type: **Web application**
  - Redirect URI: `https://fgthoyilfupywmpmiuwd.supabase.co/auth/v1/callback`
- [ ] **Copier** Client ID (Web)
- [ ] **Copier** Client Secret (Web)
- [ ] *Optionnel*: Créer aussi un OAuth Client ID pour **iOS** avec Bundle ID `com.easyco.app`

**Credentials à sauvegarder:**
```
Web Client ID: _______________________________________
Web Client Secret: __________________________________
iOS Client ID: 923210800441-hnh9l9d30jh4tluv3cvmik6n3063pjdg.apps.googleusercontent.com (déjà configuré)
```

---

### 3. Apple Developer Account

- [ ] **Aller sur** [Apple Developer Portal](https://developer.apple.com/account/)
- [ ] **Créer App ID**:
  - Certificates, Identifiers & Profiles > Identifiers > +
  - Type: **App IDs**
  - Bundle ID: `com.easyco.app`
  - Capability: **Sign in with Apple** ✓
- [ ] **Créer Services ID**:
  - Type: **Services IDs**
  - Identifier: `com.easyco.app.web`
  - Configurer Sign in with Apple:
    - Domain: `fgthoyilfupywmpmiuwd.supabase.co`
    - Return URL: `https://fgthoyilfupywmpmiuwd.supabase.co/auth/v1/callback`
- [ ] **Créer Signing Key**:
  - Keys > +
  - Enable: **Sign in with Apple** ✓
  - **Télécharger** le fichier `.p8` (une seule chance!)
  - **Noter** le Key ID (10 caractères)
- [ ] **Noter** le Team ID (coin supérieur droit, 10 caractères)

**Credentials à sauvegarder:**
```
Team ID: __________
Services ID: com.easyco.app.web
Key ID: __________
Fichier .p8: [ ] Téléchargé et sauvegardé en sécurité
Bundle ID: com.easyco.app
```

---

### 4. Supabase Dashboard

- [ ] **Aller sur** [Supabase Dashboard](https://supabase.com/dashboard)
- [ ] **Sélectionner** le projet `fgthoyilfupywmpmiuwd`
- [ ] **Configurer Google**:
  - Authentication > Providers > **Google**
  - Enable Sign in with Google: **ON**
  - Client ID (for OAuth): [Coller Web Client ID]
  - Client Secret (for OAuth): [Coller Web Client Secret]
  - Authorized Client IDs: Ajouter `923210800441-hnh9l9d30jh4tluv3cvmik6n3063pjdg.apps.googleusercontent.com`
  - **Save**
- [ ] **Configurer Apple**:
  - Authentication > Providers > **Apple**
  - Enable Sign in with Apple: **ON**
  - Services ID: `com.easyco.app.web`
  - Team ID: [Coller Team ID]
  - Key ID: [Coller Key ID]
  - Secret Key: [Coller contenu fichier .p8]
  - **Save**

---

### 5. Tests

- [ ] **Build** le projet dans Xcode
- [ ] **Test Google**:
  - Cliquer "Continue with Google"
  - Sélectionner un compte Google
  - Vérifier que l'auth réussit
  - Vérifier que le profil se charge
- [ ] **Test Apple**:
  - Cliquer "Sign in with Apple"
  - Authentifier avec Apple ID
  - Vérifier que l'auth réussit
  - Vérifier que le profil se charge

---

## 🔍 Vérification Logs

Logs attendus dans Xcode:

### Google Sign-In
```
🔵 Starting Google Sign-In flow...
🔵 Got Google credentials, authenticating with Supabase...
🔵 Google Auth Response Status: 200
✅ Google Sign-In successful!
💾 Token saved to keychain
👤 Fetching user profile...
✅ User profile loaded: [email], type: [userType]
```

### Apple Sign-In
```
🍎 Starting Apple Sign-In flow...
🍎 Got Apple credential, authenticating with Supabase...
🍎 Apple Auth Response Status: 200
✅ Apple Sign-In successful!
💾 Token saved to keychain
👤 Fetching user profile...
✅ User profile loaded: [email], type: [userType]
```

---

## ⚠️ Troubleshooting

### ❌ "Invalid Client ID"
→ Vérifier que le GIDClientID dans Info.plist correspond au Client ID Google
→ Vérifier que l'iOS Client ID est ajouté dans Supabase "Authorized Client IDs"

### ❌ "Redirect URI mismatch"
→ Vérifier l'URL callback dans Google Cloud: `https://fgthoyilfupywmpmiuwd.supabase.co/auth/v1/callback`

### ❌ Apple popup ne s'ouvre pas
→ Vérifier que la capability est ajoutée dans Xcode
→ Redémarrer le simulateur/device
→ Vérifier que le Bundle ID correspond à l'App ID Apple

### ❌ "No value associated with key user_id"
→ Ce problème est résolu (migration de la base de données)
→ Si ça persiste, vérifier que SupabaseClient.swift se compile correctement

---

## 📝 Notes

- ⚠️ **NE JAMAIS COMMITER** les credentials (.p8, Client Secrets) dans Git
- ⚠️ Le fichier `.p8` ne peut être téléchargé qu'une seule fois
- 💡 Pour la production, crée des credentials OAuth séparés
- 💡 Les nouveaux utilisateurs OAuth auront `user_type: "searcher"` par défaut

---

## ✨ Après Configuration

Une fois OAuth configuré:
- [ ] Tester sur simulateur iOS
- [ ] Tester sur device physique
- [ ] Vérifier le flow onboarding pour nouveaux utilisateurs
- [ ] Implémenter la déconnexion OAuth si besoin
- [ ] Nettoyer les logs de débogage une fois stable

---

**Besoin d'aide ?** Consulte [OAUTH_SETUP_GUIDE.md](./OAUTH_SETUP_GUIDE.md) pour les instructions détaillées.

*Dernière mise à jour: 2025-11-17*
