# Guide de Configuration OAuth - EasyCo iOS

Ce guide détaille toutes les étapes nécessaires pour activer l'authentification Google et Apple dans l'app EasyCo iOS.

## État Actuel ✅

### Déjà Configuré
- ✅ Google Sign-In SDK installé (v9.0.0 via SPM)
- ✅ Apple Sign-In natif (AuthenticationServices framework)
- ✅ Google Client ID dans Info.plist: `923210800441-hnh9l9d30jh4tluv3cvmik6n3063pjdg.apps.googleusercontent.com`
- ✅ URL Scheme configuré: `com.googleusercontent.apps.923210800441-hnh9l9d30jh4tluv3cvmik6n3063pjdg`
- ✅ Code d'implémentation complet:
  - `GoogleSignInManager.swift` - Gestion Google OAuth
  - `AppleSignInManager.swift` - Gestion Apple OAuth
  - `SupabaseAuth+OAuth.swift` - Intégration Supabase
  - `AuthViewModel+OAuth.swift` - Logique ViewModel
  - `OAuthButtonsView.swift` - Interface utilisateur
  - `AuthManager+OAuth.swift` - Gestion session

### À Configurer
- ⏳ Capability "Sign in with Apple" dans Xcode
- ⏳ Configuration Google OAuth dans Supabase Dashboard
- ⏳ Configuration Apple Sign-In dans Supabase Dashboard
- ⏳ Configuration Apple Developer Account

---

## 1️⃣ Configuration Xcode - Sign in with Apple

### Étape 1.1: Ajouter la Capability
1. Ouvre le projet **EasyCo.xcodeproj** dans Xcode
2. Sélectionne le target **EasyCo** dans le Project Navigator
3. Va dans l'onglet **Signing & Capabilities**
4. Clique sur **+ Capability**
5. Recherche et ajoute **Sign in with Apple**

### Étape 1.2: Vérifier le Bundle ID
- Bundle ID actuel: `com.easyco.app` (ou vérifie dans Xcode)
- Note ce Bundle ID, tu en auras besoin pour la configuration Apple Developer

---

## 2️⃣ Configuration Google Cloud Platform

### Étape 2.1: Accéder à Google Cloud Console
1. Va sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionne ou crée un projet

### Étape 2.2: Activer Google Sign-In API
1. Dans le menu, va à **APIs & Services > Library**
2. Recherche "Google Sign-In API"
3. Clique sur **Enable**

### Étape 2.3: Configurer l'écran de consentement OAuth
1. Va à **APIs & Services > OAuth consent screen**
2. Configure les informations de l'app:
   - **App name**: EasyCo
   - **User support email**: Ton email
   - **Developer contact email**: Ton email

### Étape 2.4: Créer les Credentials OAuth
1. Va à **APIs & Services > Credentials**
2. Clique sur **+ CREATE CREDENTIALS > OAuth Client ID**
3. Choisis **Web application** (pour Supabase)
4. Configure:
   - **Name**: EasyCo Web
   - **Authorized JavaScript origins**: Laisse vide pour l'instant
   - **Authorized redirect URIs**:
     ```
     https://fgthoyilfupywmpmiuwd.supabase.co/auth/v1/callback
     ```
5. Clique sur **Create**
6. **COPIE** le **Client ID** et le **Client Secret** (tu en auras besoin pour Supabase)

### Étape 2.5: Créer OAuth Client ID iOS (optionnel mais recommandé)
1. Retourne à **Credentials > + CREATE CREDENTIALS > OAuth Client ID**
2. Choisis **iOS**
3. Configure:
   - **Name**: EasyCo iOS
   - **Bundle ID**: `com.easyco.app` (ou ton Bundle ID)
4. Clique sur **Create**

### Credentials à sauvegarder:
- ✅ **Web Client ID**: (pour Supabase)
- ✅ **Web Client Secret**: (pour Supabase)
- ✅ **iOS Client ID**: (déjà dans Info.plist: `923210800441-hnh9l9d30jh4tluv3cvmik6n3063pjdg.apps.googleusercontent.com`)

---

## 3️⃣ Configuration Apple Developer Account

### Étape 3.1: Créer un App ID
1. Va sur [Apple Developer Portal](https://developer.apple.com/account/)
2. Va à **Certificates, Identifiers & Profiles**
3. Clique sur **Identifiers**, puis **+**
4. Choisis **App IDs**, puis **Continue**
5. Choisis **App**, puis **Continue**
6. Configure:
   - **Description**: EasyCo iOS
   - **Bundle ID**: `com.easyco.app` (doit correspondre à Xcode)
   - **Capabilities**: Coche **Sign in with Apple**
7. Clique sur **Continue**, puis **Register**

### Étape 3.2: Créer un Services ID (pour Supabase)
1. Toujours dans **Identifiers**, clique sur **+**
2. Choisis **Services IDs**, puis **Continue**
3. Configure:
   - **Description**: EasyCo Web Service
   - **Identifier**: `com.easyco.app.web` (différent du Bundle ID)
4. Coche **Sign in with Apple**
5. Clique sur **Configure** à côté de Sign in with Apple
6. Configure:
   - **Primary App ID**: Sélectionne `com.easyco.app`
   - **Website URLs**:
     - **Domains**: `fgthoyilfupywmpmiuwd.supabase.co`
     - **Return URLs**: `https://fgthoyilfupywmpmiuwd.supabase.co/auth/v1/callback`
7. Clique sur **Save**, puis **Continue**, puis **Register**

### Étape 3.3: Créer une Signing Key
1. Dans le menu, va à **Keys**, puis clique sur **+**
2. Configure:
   - **Key Name**: EasyCo Apple Sign-In Key
   - **Enable**: Coche **Sign in with Apple**
3. Clique sur **Configure** à côté de Sign in with Apple
4. Sélectionne **Primary App ID**: `com.easyco.app`
5. Clique sur **Save**, puis **Continue**, puis **Register**
6. **TÉLÉCHARGE** le fichier `.p8` (tu ne pourras le télécharger qu'une seule fois!)
7. **NOTE** le **Key ID** (10 caractères, ex: ABCDE12345)

### Étape 3.4: Récupérer le Team ID
1. En haut à droite de la page Apple Developer, clique sur ton nom
2. **NOTE** le **Team ID** (10 caractères alphanumériques)

### Credentials à sauvegarder:
- ✅ **Team ID**: (10 caractères)
- ✅ **Services ID**: `com.easyco.app.web`
- ✅ **Key ID**: (10 caractères)
- ✅ **Fichier .p8**: Sauvegarde-le en sécurité
- ✅ **Client ID (Bundle ID)**: `com.easyco.app`

---

## 4️⃣ Configuration Supabase Dashboard

### Étape 4.1: Configurer Google OAuth
1. Va sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionne ton projet **fgthoyilfupywmpmiuwd**
3. Va à **Authentication > Providers**
4. Trouve **Google** dans la liste
5. Active le toggle **Enable Sign in with Google**
6. Configure:
   - **Client ID (for OAuth)**: Colle le **Web Client ID** de Google Cloud
   - **Client Secret (for OAuth)**: Colle le **Web Client Secret** de Google Cloud
   - **Authorized Client IDs**: Ajoute aussi le **iOS Client ID** (`923210800441-hnh9l9d30jh4tluv3cvmik6n3063pjdg.apps.googleusercontent.com`)
7. Clique sur **Save**

### Étape 4.2: Configurer Apple Sign-In
1. Toujours dans **Authentication > Providers**
2. Trouve **Apple** dans la liste
3. Active le toggle **Enable Sign in with Apple**
4. Configure:
   - **Services ID**: `com.easyco.app.web`
   - **Team ID**: Ton Team ID Apple (10 caractères)
   - **Key ID**: Le Key ID de ta Signing Key (10 caractères)
   - **Secret Key**: Ouvre le fichier `.p8` dans un éditeur de texte et colle tout le contenu (commence par `-----BEGIN PRIVATE KEY-----`)
5. Clique sur **Save**

---

## 5️⃣ Test de l'Authentification

### Test Google Sign-In
1. Dans Xcode, build et lance l'app sur simulateur ou device
2. Sur l'écran de login, clique sur le bouton **Continue with Google**
3. Une popup Google devrait s'ouvrir
4. Choisis un compte Google pour te connecter
5. Accepte les permissions
6. L'app devrait te connecter et charger ton profil

### Test Apple Sign-In
1. Lance l'app
2. Sur l'écran de login, clique sur le bouton noir **Sign in with Apple**
3. Une popup Apple devrait s'ouvrir
4. Choisis **Continue** ou **Use Different Apple ID**
5. L'app devrait te connecter et charger ton profil

### Débogage
Si l'authentification échoue, vérifie les logs Xcode:
- `🔵 Starting Google Sign-In flow...`
- `🍎 Starting Apple Sign-In flow...`
- `✅ Google Sign-In successful!`
- `✅ Apple Sign-In successful!`
- `❌` = regarde le message d'erreur détaillé

---

## 6️⃣ Vérifications Finales

### Checklist Xcode
- [ ] Capability "Sign in with Apple" ajoutée
- [ ] Bundle ID correspond à Apple Developer App ID
- [ ] Info.plist contient GIDClientID
- [ ] Info.plist contient CFBundleURLSchemes

### Checklist Google Cloud
- [ ] OAuth Client ID créé (Web)
- [ ] OAuth Client ID créé (iOS) - optionnel
- [ ] Redirect URI Supabase ajoutée
- [ ] Client ID et Secret copiés

### Checklist Apple Developer
- [ ] App ID créé avec Sign in with Apple activé
- [ ] Services ID créé et configuré
- [ ] Signing Key créée et fichier .p8 téléchargé
- [ ] Team ID noté
- [ ] Key ID noté

### Checklist Supabase
- [ ] Provider Google activé avec Client ID/Secret
- [ ] Provider Apple activé avec Services ID, Team ID, Key ID, et Secret Key
- [ ] Authorized Client IDs incluent l'iOS Client ID

---

## 📝 Notes Importantes

### Sécurité
- ⚠️ **NE JAMAIS COMMITER** les fichiers `.p8` ou les Client Secrets dans Git
- ⚠️ Garde tes credentials en sécurité (utilise un gestionnaire de mots de passe)
- ⚠️ Le fichier `.p8` ne peut être téléchargé qu'une seule fois - sauvegarde-le!

### Environnement de Production
- Pour la production, crée des credentials OAuth séparés
- Utilise des redirect URIs différentes pour dev/staging/prod
- Active l'authentification à deux facteurs sur tes comptes Google/Apple

### Dépannage Commun

**Erreur "Invalid Client ID":**
- Vérifie que le GIDClientID dans Info.plist correspond au Client ID Google
- Vérifie que le Client ID est bien ajouté dans Supabase "Authorized Client IDs"

**Erreur "Redirect URI mismatch":**
- Vérifie que l'URL de callback Supabase est bien ajoutée dans Google Cloud
- Format: `https://<project-id>.supabase.co/auth/v1/callback`

**Apple Sign-In popup ne s'ouvre pas:**
- Vérifie que la capability est bien ajoutée dans Xcode
- Vérifie que le Bundle ID correspond à l'App ID Apple Developer
- Redémarre le simulateur/device

**User type "searcher" par défaut:**
- Lors du premier OAuth login, Supabase crée un profil avec `user_type: "searcher"` par défaut
- Tu peux modifier le user_type ensuite via l'onboarding ou les settings

---

## 🚀 Prochaines Étapes

Une fois OAuth configuré et testé:
1. Améliore l'UX de l'onboarding pour les nouveaux utilisateurs OAuth
2. Ajoute la gestion de la déconnexion OAuth
3. Implémente le re-authentication flow si nécessaire
4. Configure les scopes OAuth supplémentaires si besoin (ex: accès calendrier Google)
5. Ajoute des analytics pour tracker les conversions OAuth vs Email

---

*Documentation créée le: 2025-11-17*
*Dernière mise à jour: 2025-11-17*
