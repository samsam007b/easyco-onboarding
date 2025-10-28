# ✅ CHECKLIST COMPLÈTE - Configuration Vercel + Supabase

**Date**: 28 Octobre 2025
**URL Vercel**: https://easyco-onboarding.vercel.app
**URL Supabase**: https://fgthoyilfupywmpmiuwd.supabase.co

---

## ✅ Étape 1: Configuration Supabase (FAIT)

Vous venez d'ajouter dans **Authentication → URL Configuration**:

```
Site URL: https://easyco-onboarding.vercel.app
```

### Vérifications supplémentaires à faire sur Supabase:

#### A) Redirect URLs
Dans la même page **URL Configuration**, vérifiez que vous avez:

```
https://easyco-onboarding.vercel.app/**
http://localhost:3001/**
http://localhost:3000/**
```

**Comment ajouter**:
1. Dans le champ **"Redirect URLs"**
2. Tapez: `https://easyco-onboarding.vercel.app/**`
3. Cliquez **"Add"** ou appuyez sur **Entrée**
4. Répétez pour les autres URLs

#### B) Additional Redirect URLs (si le champ existe)
Ajoutez (sans les `/**`):
```
https://easyco-onboarding.vercel.app
http://localhost:3001
http://localhost:3000
```

#### C) Sauvegarder
- [ ] Cliquez sur **"Save"** en bas de la page
- [ ] Attendez le message de confirmation (vert)

---

## ✅ Étape 2: Variables d'environnement Vercel

### Vérifier sur Vercel Dashboard:

1. **Aller sur**: https://vercel.com/dashboard
2. **Sélectionner**: Votre projet **easyco-onboarding**
3. **Cliquer**: **Settings** → **Environment Variables**

### Variables requises:

#### Variables Supabase (CRITIQUES):
```
NEXT_PUBLIC_SUPABASE_URL = https://fgthoyilfupywmpmiuwd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndGhveWlsZnVweXdtcG1pdXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTE4OTAsImV4cCI6MjA3NTY2Nzg5MH0._X7ouZG-SqvQ-iU1zWTvFRJ1WRwbothNjMDUk5LkJMA
```

#### Variables Email:
```
NEXT_PUBLIC_SUPPORT_EMAIL = support@easyco.be
NEXT_PUBLIC_SALES_EMAIL = sales@easyco.be
NEXT_PUBLIC_INFO_EMAIL = info@easyco.be
```

#### Vérifier:
- [ ] Toutes les variables sont présentes
- [ ] Les valeurs sont EXACTEMENT les mêmes que dans `.env.local`
- [ ] Pas d'espaces avant/après les valeurs
- [ ] Pas de guillemets autour des valeurs

### Si une variable manque ou est incorrecte:

1. **Ajouter/Modifier** la variable
2. **Sélectionner**: `Production`, `Preview`, et `Development`
3. **Sauvegarder**
4. **IMPORTANT**: Redéployer l'application après modification:
   - Aller dans **Deployments**
   - Cliquer sur les 3 points (**...**) du dernier déploiement
   - Cliquer **"Redeploy"**

---

## ✅ Étape 3: Attendre la propagation

### Après avoir sauvegardé sur Supabase:

- **Attendre**: 30-60 secondes
- **Pourquoi**: Les changements Supabase doivent se propager dans leur CDN

---

## ✅ Étape 4: TEST sur Vercel

### A) Hard Refresh (Critique):

1. **Ouvrir**: https://easyco-onboarding.vercel.app
2. **Vider le cache**: `Cmd + Shift + R` (Mac) ou `Ctrl + Shift + R` (Windows)
3. **Ouvrir Console**: `F12` ou `Cmd + Option + J`

### B) Vérifier la Console:

#### ✅ SUCCÈS si vous voyez:
```
✅ Aucune erreur "Fetch API cannot load"
✅ Aucune erreur 400/406
✅ Logs normaux de chargement
```

#### ❌ ÉCHEC si vous voyez:
```
❌ Fetch API cannot load ...notifications due to access control checks
❌ Failed to load resource: status of 400
❌ Failed to load resource: status of 406
```

### C) Tester les Notifications:

1. **Se connecter** sur le site Vercel (si pas déjà connecté)
2. **Cliquer** sur l'icône 🔔 (notifications)
3. **Vérifier**:
   - [ ] Le dropdown s'ouvre
   - [ ] Pas d'erreur dans la console
   - [ ] "No notifications yet" s'affiche (ou vos notifications)

### D) Vérifier l'Onglet Network:

1. **Ouvrir**: Developer Tools → **Network**
2. **Filtrer**: Tapez "supabase" dans le filtre
3. **Recharger** la page: `Cmd + R`
4. **Vérifier**:
   - [ ] Requêtes à `/rest/v1/notifications`: Status **200 OK**
   - [ ] Requêtes à `/rest/v1/user_profiles`: Status **200 OK**
   - [ ] Requêtes à `/rest/v1/group_members`: Status **200 OK**
   - [ ] Headers de réponse contiennent `Access-Control-Allow-Origin`

---

## 🔧 Troubleshooting

### Si les erreurs CORS persistent:

#### Option 1: Vérifier les Redirect URLs sur Supabase
Retournez sur Supabase et assurez-vous que **Redirect URLs** contient:
```
https://easyco-onboarding.vercel.app/**
```
(Avec les `/**` à la fin!)

#### Option 2: Mode Incognito
Testez en **mode navigation privée** pour éliminer le cache:
- Mac: `Cmd + Shift + N`
- Windows: `Ctrl + Shift + N`

#### Option 3: Vérifier JWT Settings
Sur Supabase Dashboard:
1. **Settings** → **API**
2. Vérifier que **JWT Settings** est configuré correctement
3. Vérifier que **JWT Secret** n'est pas expiré

#### Option 4: Redéployer sur Vercel
Forcer un nouveau déploiement:
1. Vercel Dashboard → **Deployments**
2. Dernier déploiement → **...** → **Redeploy**

#### Option 5: Vérifier CORS Allowed Origins
Sur Supabase (si le champ existe):
1. **Settings** → **API**
2. Chercher **"CORS"** ou **"Allowed Origins"**
3. Ajouter: `https://easyco-onboarding.vercel.app`
4. Ou mettre: `*` (autoriser tous - OK pour test)

---

## 📊 Diagnostic Avancé

### Si rien ne fonctionne, vérifiez:

#### A) Headers de réponse Supabase
Dans Network tab, cliquez sur une requête Supabase et vérifiez les **Response Headers**:

Doit contenir:
```
Access-Control-Allow-Origin: https://easyco-onboarding.vercel.app
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
```

Si ces headers sont absents → **Problème de configuration Supabase**

#### B) Status de la requête OPTIONS
Le navigateur envoie d'abord une requête **OPTIONS** (preflight):
- [ ] Requête OPTIONS: Status **200 OK**
- [ ] Puis requête GET/POST: Status **200 OK**

Si OPTIONS échoue → **CORS mal configuré**

#### C) Console Errors Détaillées
Copiez-moi l'erreur complète si elle persiste:
```
[Copier toute la ligne d'erreur rouge de la console]
```

---

## 🎯 Résumé des Actions

### Fait ✅:
1. [x] Site URL configuré sur Supabase: `https://easyco-onboarding.vercel.app`

### À faire maintenant 🔄:
1. [ ] Ajouter Redirect URLs sur Supabase (avec `/**`)
2. [ ] Sauvegarder les changements Supabase
3. [ ] Vérifier variables d'environnement Vercel
4. [ ] Attendre 30-60 secondes
5. [ ] Hard refresh sur Vercel (`Cmd+Shift+R`)
6. [ ] Vérifier console (aucune erreur CORS)
7. [ ] Tester notifications (clic sur 🔔)

---

## 🚀 Timeline Attendue

- **0-30 sec**: Propagation Supabase
- **30-60 sec**: Cache CDN refresh
- **Après 60 sec**: Tout doit fonctionner

**Si après 2 minutes ça ne marche pas** → Envoyez-moi screenshot de:
1. Console (avec erreurs)
2. Network tab (requêtes supabase)
3. Supabase URL Configuration page

---

## 📸 Screenshots à vérifier

### Screenshot 1: Supabase URL Configuration
Montrez-moi toute la page avec:
- Site URL
- Redirect URLs (avec les `/**`)
- Additional Redirect URLs

### Screenshot 2: Console Vercel
Après hard refresh, montrez-moi:
- La console complète
- Les erreurs (s'il y en a)

### Screenshot 3: Network Tab
Filtré sur "supabase", montrez-moi:
- Les requêtes notifications/user_profiles/group_members
- Leurs status codes

---

**PROCHAINE ÉTAPE**:

1. **Ajoutez les Redirect URLs** sur Supabase (avec `/**`)
2. **Sauvegardez**
3. **Attendez 1 minute**
4. **Testez sur Vercel**
5. **Dites-moi le résultat!**

🔥 **On est proche de la solution!** 🔥
