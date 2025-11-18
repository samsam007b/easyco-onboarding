# OAuth Quick Test Guide - EasyCo iOS

Tests rapides pour vérifier que tout fonctionne après configuration.

---

## 🔍 Pré-requis

Avant de tester, assure-toi que:
- [ ] Xcode capability "Sign in with Apple" ajoutée
- [ ] Google OAuth configuré dans Supabase
- [ ] Apple OAuth configuré dans Supabase
- [ ] Projet build sans erreurs

---

## 🧪 Test 1: Build Vérification

Vérifie que le projet se compile correctement:

```bash
# Dans le terminal, à la racine du projet
cd /Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/EasyCo

# Vérifier que les fichiers OAuth sont présents
ls -la EasyCo/Core/Auth/*OAuth*.swift
ls -la EasyCo/Features/Auth/*OAuth*.swift
ls -la EasyCo/Supabase/SupabaseClient.swift
```

**Résultat attendu:**
```
GoogleSignInManager.swift
AppleSignInManager.swift
SupabaseAuth+OAuth.swift
AuthManager+OAuth.swift
AuthViewModel+OAuth.swift
OAuthButtonsView.swift
SupabaseClient.swift
```

---

## 🧪 Test 2: Info.plist Vérification

Vérifie la configuration Info.plist:

```bash
# Vérifier GIDClientID
grep -A 1 "GIDClientID" EasyCo/Info.plist

# Vérifier URL Schemes
grep -A 5 "CFBundleURLTypes" EasyCo/Info.plist
```

**Résultat attendu:**
- GIDClientID présent
- CFBundleURLSchemes contient le reverse client ID Google

---

## 🧪 Test 3: Packages Vérification

Vérifie que le Google Sign-In SDK est installé:

```bash
# Vérifier Package.resolved
cat EasyCo.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved | grep -A 5 "googlesignin"
```

**Résultat attendu:**
```json
"identity" : "googlesignin-ios",
"version" : "9.0.0"
```

---

## 🧪 Test 4: Build dans Xcode

1. Ouvre le projet dans Xcode:
```bash
open EasyCo.xcodeproj
```

2. Dans Xcode:
   - Sélectionne un simulateur (iPhone 15 Pro ou similaire)
   - Product → Clean Build Folder (Cmd+Shift+K)
   - Product → Build (Cmd+B)

3. Vérifie qu'il n'y a **aucune erreur de compilation**

**Erreurs possibles:**
- "Cannot find GoogleSignIn" → Vérifier SPM packages
- "Use of undeclared type GIDSignIn" → Clean DerivedData
- "Missing capability" → Ajouter "Sign in with Apple" capability

---

## 🧪 Test 5: Run et Interface Check

1. Lance l'app (Cmd+R)

2. Sur l'écran de login, vérifie que tu vois:
   - [ ] Un bouton noir "Sign in with Apple" (en haut)
   - [ ] Un bouton gris "Continue with Google" (juste en dessous)
   - [ ] Une ligne de séparation "Or"
   - [ ] Les champs Email et Password

**Si les boutons OAuth n'apparaissent pas:**
→ Vérifier que OAuthButtonsView est bien importé dans LoginView.swift
→ Vérifier les logs pour des erreurs de rendu

---

## 🧪 Test 6: Google Sign-In Flow

1. Clique sur le bouton "Continue with Google"

2. **Logs attendus dans Xcode:**
```
🔵 Starting Google Sign-In flow...
```

3. **Behavior attendu:**
   - Une popup Google devrait s'ouvrir
   - Liste des comptes Google disponibles
   - Sélectionne un compte de test

4. **Si ça fonctionne, logs suivants:**
```
🔵 Got Google credentials, authenticating with Supabase...
🔵 Google Auth Response Status: 200
🔵 Google Auth Response Body: {"access_token":"...
✅ Google Sign-In successful!
📱 Handling OAuth session...
💾 Token saved to keychain
👤 Fetching user profile...
✅ User profile loaded: [email], type: searcher
```

5. **Si ça échoue, logs possibles:**
```
❌ Google Sign-In error: [error message]
```

**Erreurs communes:**
- "No presenting view controller" → Redémarrer l'app
- "Missing GIDClientID" → Vérifier Info.plist
- "Invalid client ID" → Vérifier Supabase configuration

---

## 🧪 Test 7: Apple Sign-In Flow

1. **Sur simulateur:** Va dans Settings → Sign in to your iPhone
   - Utilise un Apple ID de test
   - Ou utilise ton propre Apple ID

2. Retourne à l'app, clique sur "Sign in with Apple"

3. **Logs attendus:**
```
🍎 Starting Apple Sign-In flow...
```

4. **Behavior attendu:**
   - Popup Apple s'ouvre
   - Demande Face ID / Touch ID / Password
   - Choix de partager ou masquer email

5. **Si ça fonctionne, logs suivants:**
```
🍎 Got Apple credential, authenticating with Supabase...
🍎 Apple Auth Response Status: 200
🍎 Apple Auth Response Body: {"access_token":"...
✅ Apple Sign-In successful!
📱 Handling OAuth session...
💾 Token saved to keychain
👤 Fetching user profile...
✅ User profile loaded: [email], type: searcher
```

6. **Si ça échoue, logs possibles:**
```
❌ Apple Sign-In Error: [error message]
```

**Erreurs communes:**
- "Authorization error" → User a annulé, c'est normal
- "Invalid response" → Vérifier Supabase configuration Apple
- "No credential" → Redémarrer le simulateur

---

## 🧪 Test 8: Profile Loading

Après authentification réussie:

1. **Vérifie que l'app charge:**
   - Le profil utilisateur
   - L'écran principal de l'app
   - Pas d'écran d'erreur

2. **Logs attendus:**
```
📡 Querying profiles WHERE user_id = [uuid]
✅ User profile loaded: [email], type: [userType]
```

3. **Si échec:**
```
❌ Login error: keyNotFound(CodingKeys(...
```
→ Ce problème devrait être résolu après la migration de la BDD
→ Si ça persiste, vérifier que SupabaseClient.swift compile correctement

---

## 🧪 Test 9: Déconnexion et Re-authentification

1. Déconnecte-toi de l'app (si l'option existe)

2. Essaie de te reconnecter avec Google

3. **Behavior attendu:**
   - Pas de popup cette fois (déjà autorisé)
   - Authentification automatique rapide
   - Profil chargé immédiatement

4. Répète avec Apple Sign-In

---

## 🧪 Test 10: Nouvel Utilisateur OAuth

1. Utilise un compte Google/Apple qui n'a jamais été utilisé dans EasyCo

2. Authentifie-toi

3. **Vérifie:**
   - Un nouveau profil est créé dans Supabase
   - `user_type` par défaut est "searcher"
   - L'utilisateur est redirigé vers onboarding (si implémenté)

4. **Dans Supabase Dashboard:**
   - Va à Authentication → Users
   - Vérifie que le nouvel utilisateur apparaît
   - Provider doit être "google" ou "apple"

---

## ✅ Checklist Finale

Après tous les tests:

- [ ] Google Sign-In fonctionne
- [ ] Apple Sign-In fonctionne
- [ ] Profil utilisateur se charge correctement
- [ ] Pas d'erreur de compilation
- [ ] Pas d'erreur d'exécution
- [ ] Logs de débogage clairs
- [ ] Redirection après auth fonctionne
- [ ] Nouvel utilisateur peut s'inscrire

---

## 🐛 Debugging

### Activer les Logs Détaillés

Si tu rencontres des problèmes, vérifie tous les logs:

1. **Console Xcode**: Tous les logs print()
2. **Network tab**: Requêtes HTTP vers Supabase
3. **Breakpoints**: Ajoute des breakpoints dans:
   - `GoogleSignInManager.signInWithGoogle()`
   - `AppleSignInManager.signInWithApple()`
   - `SupabaseAuth+OAuth.signInWithGoogle()`
   - `SupabaseAuth+OAuth.signInWithApple()`
   - `AuthManager.handleOAuthSession()`

### Vérifier Requêtes Supabase

Si l'authentification échoue côté Supabase:

```bash
# Tester la requête Google OAuth manuellement
curl -X POST 'https://fgthoyilfupywmpmiuwd.supabase.co/auth/v1/token?grant_type=id_token' \
  -H "apikey: YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"provider": "google", "id_token": "YOUR_GOOGLE_ID_TOKEN"}'

# Résultat attendu: JSON avec access_token
```

### Reset Tests

Si nécessaire, reset tout:

```bash
# Supprimer DerivedData
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Clean et rebuild
cd /Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/EasyCo
```

Puis dans Xcode:
- Product → Clean Build Folder
- Product → Build
- Run

---

## 📊 Résultats Attendus

### Test Réussi ✅
```
✅ Tous les tests passent
✅ Google Sign-In fonctionne
✅ Apple Sign-In fonctionne
✅ Profil se charge correctement
✅ Aucune erreur
```

### Test Échoué ❌

Si un test échoue:
1. Note l'erreur exacte dans les logs
2. Consulte OAUTH_SETUP_GUIDE.md section Troubleshooting
3. Vérifie OAUTH_SETUP_CHECKLIST.md
4. Vérifie que toutes les configurations sont correctes

---

**Temps estimé pour tous les tests: ~15 minutes**

*Dernière mise à jour: 2025-11-17*
