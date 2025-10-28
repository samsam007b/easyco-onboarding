# 🔍 DEBUG FINAL - Analyse Approfondie CORS

**Date**: 28 Octobre 2025
**Status**: Variables Vercel ✅ CORRECTES - Erreurs persistent ❌

---

## ✅ Ce qui est CORRECT

### 1. Variables Vercel ✅
```
NEXT_PUBLIC_SUPABASE_URL = https://fgthoyilfupywmpmiuwd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbG... (correcte)
```

### 2. Configuration Supabase ✅
```
Site URL: https://easyco-onboarding.vercel.app
Redirect URLs:
  - https://easyco-onboarding.vercel.app
  - https://easyco-onboarding.vercel.app/**
  - http://localhost:3001/**
  - http://localhost:3000/**
```

### 3. CSP next.config.mjs ✅
```javascript
"connect-src 'self' https://fgthoyilfupywmpmiuwd.supabase.co wss://fgthoyilfupywmpmiuwd.supabase.co"
```

### 4. Politiques RLS Supabase ✅
```
notifications: 4 policies (simplifiées)
user_profiles: 4 policies (simplifiées)
group_members: 3 policies (simplifiées)
```

---

## ❌ Le Problème Persist

### Erreur Console Vercel:
```
[Error] Fetch API cannot load https://fgthoyilfupywmpmiuwd.supabase.co/rest/v1/notifications
due to access control checks
```

**Répété 15+ fois** → Hook retry loop

---

## 🎯 NOUVELLE HYPOTHÈSE

### Le vrai problème: API Key Configuration Supabase

**Théorie**: L'ANON_KEY n'a pas les bonnes permissions sur Supabase

**Symptômes qui correspondent**:
1. ✅ "access control checks" → Supabase vérifie le JWT (ANON_KEY)
2. ✅ Erreurs CORS → Supabase rejette la requête avant de répondre
3. ✅ Tout fonctionne en local → Même ANON_KEY, mais...
4. ❌ Ne fonctionne pas sur Vercel → Différence: l'origine (origin header)

### Explication Technique:

Quand une requête vient de Vercel:
```
Origin: https://easyco-onboarding.vercel.app
Authorization: Bearer eyJhbG... (ANON_KEY)
```

Supabase vérifie:
1. ✅ JWT valide? → OUI (ANON_KEY correcte)
2. ✅ Origin dans Redirect URLs? → OUI (configuré)
3. ❌ API KEY autorisée pour cet origin? → **PEUT-ÊTRE NON**

---

## 🚨 ACTION: Vérifier API Settings Supabase

### Étape 1: Aller sur Supabase API Settings

1. **Dashboard**: https://supabase.com/dashboard/project/fgthoyilfupywmpmiuwd
2. **Cliquer**: **Settings** (icône engrenage en bas gauche)
3. **Cliquer**: **API**

### Étape 2: Vérifier CORS Configuration

**Chercher une section nommée**:
- "CORS"
- "Allowed Origins"
- "API Configuration"
- "Cross-Origin Resource Sharing"

**Si vous trouvez ce champ:**

#### Option A: Ajouter l'URL Vercel
```
https://easyco-onboarding.vercel.app
```

#### Option B: Autoriser tous les domaines (pour test)
```
*
```

**Sauvegarder** et **attendre 30 secondes**

### Étape 3: Vérifier que l'API est activée

**Sur la même page (Settings → API)**:

Vérifier:
- [ ] API Status: **ENABLED** (pas disabled)
- [ ] Project URL: `https://fgthoyilfupywmpmiuwd.supabase.co`
- [ ] anon/public key visible et copiable

---

## 🔧 ALTERNATIVE: Régénérer les API Keys

**Si rien d'autre ne fonctionne:**

### Pourquoi?
Parfois les API keys deviennent corrompues ou ont des permissions incorrectes.

### Comment?

1. **Dashboard Supabase**: Settings → API
2. **Trouver**: Section "Project API keys"
3. **Chercher**: Bouton "Regenerate" ou "Reset"
4. **ATTENTION**: Cela va casser toutes les connexions existantes!
5. **Copier la nouvelle ANON_KEY**
6. **Mettre à jour**:
   - `.env.local`
   - Variables Vercel
7. **Redéployer**

**NE FAITES CECI QUE SI TOUT LE RESTE ÉCHOUE!**

---

## 🧪 TEST: Utiliser curl pour diagnostiquer

**Test direct de l'API Supabase depuis terminal:**

### Test 1: Requête sans Origin (doit fonctionner)

```bash
curl -X GET "https://fgthoyilfupywmpmiuwd.supabase.co/rest/v1/notifications?select=*&limit=1" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndGhveWlsZnVweXdtcG1pdXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTE4OTAsImV4cCI6MjA3NTY2Nzg5MH0._X7ouZG-SqvQ-iU1zWTvFRJ1WRwbothNjMDUk5LkJMA" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndGhveWlsZnVweXdtcG1pdXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTE4OTAsImV4cCI6MjA3NTY2Nzg5MH0._X7ouZG-SqvQ-iU1zWTvFRJ1WRwbothNjMDUk5LkJMA" \
  -v
```

**Attendu**: Status 200 + données JSON

### Test 2: Requête avec Origin Vercel (simulation navigateur)

```bash
curl -X GET "https://fgthoyilfupywmpmiuwd.supabase.co/rest/v1/notifications?select=*&limit=1" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndGhveWlsZnVweXdtcG1pdXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTE4OTAsImV4cCI6MjA3NTY2Nzg5MH0._X7ouZG-SqvQ-iU1zWTvFRJ1WRwbothNjMDUk5LkJMA" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndGhveWlsZnVweXdtcG1pdXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTE4OTAsImV4cCI6MjA3NTY2Nzg5MH0._X7ouZG-SqvQ-iU1zWTvFRJ1WRwbothNjMDUk5LkJMA" \
  -H "Origin: https://easyco-onboarding.vercel.app" \
  -v
```

**Regarder les Response Headers**:
```
Access-Control-Allow-Origin: ?
Access-Control-Allow-Methods: ?
```

**Si absent** → CORS mal configuré sur Supabase!

---

## 📊 Diagnostic par Élimination

### ✅ Éliminé (déjà vérifié):
- [x] Redirect URLs Supabase
- [x] Variables environnement Vercel
- [x] CSP next.config.mjs
- [x] Politiques RLS

### ❓ À vérifier maintenant:
- [ ] API Settings → CORS Allowed Origins
- [ ] API Status (enabled/disabled)
- [ ] Headers CORS dans les réponses Supabase
- [ ] Network tab: Vérifier les headers de réponse

---

## 🎯 PLAN D'ACTION IMMÉDIAT

### Action 1: Vérifier Network Tab Headers (2 min)

1. **Vercel**: https://easyco-onboarding.vercel.app
2. **F12** → Onglet **Network**
3. **Filtrer**: `notifications`
4. **Hard refresh**: `Cmd+Shift+R`
5. **Cliquer** sur la requête `notifications?select=...`
6. **Onglet Headers**
7. **Regarder "Response Headers"**:

**Chercher ces headers**:
```
Access-Control-Allow-Origin: ?
Access-Control-Allow-Methods: ?
Access-Control-Allow-Headers: ?
```

**SCREENSHOT cette section et envoyez-moi!**

---

### Action 2: Vérifier Supabase API Settings (3 min)

1. **Dashboard**: https://supabase.com/dashboard/project/fgthoyilfupywmpmiuwd/settings/api
2. **Chercher**: Section CORS ou Allowed Origins
3. **Si existe**: Ajouter `https://easyco-onboarding.vercel.app` ou `*`
4. **Screenshot** et envoyez-moi

---

### Action 3: Test curl (1 min)

**Dans votre terminal local**:

```bash
curl -X GET "https://fgthoyilfupywmpmiuwd.supabase.co/rest/v1/notifications?select=*&limit=1" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndGhveWlsZnVweXdtcG1pdXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTE4OTAsImV4cCI6MjA3NTY2Nzg5MH0._X7ouZG-SqvQ-iU1zWTvFRJ1WRwbothNjMDUk5LkJMA" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndGhveWlsZnVweXdtcG1pdXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTE4OTAsImV4cCI6MjA3NTY2Nzg5MH0._X7ouZG-SqvQ-iU1zWTvFRJ1WRwbothNjMDUk5LkJMA" \
  -H "Origin: https://easyco-onboarding.vercel.app"
```

**Regardez la réponse**: Status 200? Ou erreur?

---

## 🔥 PROCHAINE ÉTAPE

**FAITES ACTION 1 EN PREMIER** (Network tab Response Headers)

C'est le plus révélateur! Les headers de réponse vont nous dire exactement pourquoi Supabase refuse la connexion.

**SCREENSHOT DES RESPONSE HEADERS ET ENVOYEZ-MOI!** 📸
