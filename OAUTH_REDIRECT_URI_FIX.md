# Fix: OAuth Redirect URI Mismatch - Google

## Erreur
```
Erreur 400 : redirect_uri_mismatch
Vous ne pouvez pas vous connecter à cette appli car elle ne respecte pas 
le règlement OAuth 2.0 de Google.
```

## Cause
L'URL de redirection Supabase n'est pas enregistrée dans Google Cloud Console.

## Solution (5 minutes)

### Étape 1: Accéder à Google Cloud Console
1. Va sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionne ton projet **EasyCo**

### Étape 2: Ouvrir les Credentials
1. Menu de gauche (☰) → `APIs & Services` → `Credentials`
2. Trouve ton **OAuth 2.0 Client ID** (probablement nommé "EasyCo Web")
3. **Clique** dessus pour l'éditer

### Étape 3: Ajouter l'URI de Redirection
1. Scroll jusqu'à **"Authorized redirect URIs"**
2. **Vérifie** si cette URI existe:
   ```
   https://fgthoyilfupywmpmiuwd.supabase.co/auth/v1/callback
   ```
3. **Si elle n'existe PAS**, clique `+ ADD URI`
4. **Colle** exactement:
   ```
   https://fgthoyilfupywmpmiuwd.supabase.co/auth/v1/callback
   ```
5. **Clique** `SAVE` en bas de la page

### Étape 4: Attendre la Propagation
- Les changements peuvent prendre **quelques minutes** (généralement 1-5 min)
- Attends 2-3 minutes avant de retester

### Étape 5: Retester
1. **Rafraîchis** ta web app
2. **Clique** sur "Sign in with Google"
3. Cette fois ça devrait fonctionner! ✅

---

## Vérification Rapide

**URIs qui DOIVENT être dans "Authorized redirect URIs":**

Pour **Web Client ID** (utilisé par Supabase):
```
https://fgthoyilfupywmpmiuwd.supabase.co/auth/v1/callback
```

Pour **développement local** (si besoin):
```
http://localhost:3000/auth/v1/callback
```

---

## Erreurs Courantes

### ❌ URI mal formatée
- **Mauvais**: `http://...` (sans `s`)
- **Bon**: `https://...`

### ❌ Slash à la fin
- **Mauvais**: `.../callback/`
- **Bon**: `.../callback`

### ❌ Espace ou caractère invisible
- Copie-colle directement, pas de caractères invisibles

### ❌ Mauvais OAuth Client ID
- Tu dois modifier le **Web Client ID**, pas l'iOS Client ID
- Vérifie que c'est bien "Application type: Web application"

---

## Si ça ne marche toujours pas

### 1. Vérifie que tu as le bon Client ID dans Supabase
1. Va sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Authentication → Providers → Google
3. Le **Client ID** doit correspondre exactement au Client ID du **Web Client** dans Google Cloud

### 2. Vérifie le Client Secret
- Le **Client Secret** doit aussi correspondre

### 3. Vérifie que le provider est activé
- Toggle "Enable Sign in with Google" doit être **ON** (vert)

### 4. Clear cache navigateur
- Vide le cache de ton navigateur
- Ou teste en navigation privée

---

## Test Rapide

Une fois l'URI ajoutée:

1. **Attends 2-3 minutes**
2. **Ouvre** ta web app en navigation privée
3. **Clique** "Sign in with Google"
4. **Sélectionne** un compte Google
5. **Résultat attendu**: Authentification réussie et redirection vers l'app

---

**Temps estimé: 5 minutes + 2 minutes d'attente pour propagation**

*Dernière mise à jour: 2025-11-17*
