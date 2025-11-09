# 🚨 DIAGNOSTIC URGENT - Page "Oops! Something went wrong"

**Date**: 9 Novembre 2025, 21:30
**Problème**: L'interface affiche une page d'erreur générique au lieu de se charger

---

## 🔍 Ce que l'erreur signifie

La page que tu vois ([app/error.tsx](app/error.tsx)) est le **Error Boundary** de Next.js qui s'affiche quand:
- Une erreur JavaScript **plante** l'application côté client
- OU une erreur serveur **non gérée** se produit

**Important**: En production, le message d'erreur exact est **caché** pour la sécurité. On ne voit que "Something went wrong".

---

## 🎯 Actions URGENTES à faire MAINTENANT

### 1️⃣ Vérifier les logs Vercel (LE PLUS IMPORTANT)

**C'est là qu'on verra la VRAIE erreur**:

```bash
# Étapes:
1. Aller sur https://vercel.com/dashboard
2. Cliquer sur ton projet "easyco-onboarding"
3. Onglet "Deployments"
4. Cliquer sur le dernier déploiement (celui en "Ready")
5. Onglet "Functions" (pour voir les logs serveur)
   OU "Build Logs" (pour voir si le build a échoué)
6. CHERCHER les erreurs en rouge

# Ce qu'on cherche:
- Erreur Google Maps?
- Erreur Supabase?
- Erreur de build?
- Erreur d'environnement?
```

**TRÈS IMPORTANT**: Screenshot les logs d'erreur que tu vois!

---

### 2️⃣ Vérifier que le dernier commit est déployé

```bash
# Dans Vercel Dashboard → Deployments
# Vérifier que le commit SHA commence par: 1dd5201
```

Si ce n'est **PAS** le commit `1dd5201`, alors Vercel n'a pas encore déployé la correction!

**Solution**: Attendre 2-3 minutes OU forcer un redéploiement:
```bash
git commit --allow-empty -m "chore: force redeploy"
git push
```

---

### 3️⃣ Vérifier les variables d'environnement Vercel

```bash
# Vercel Dashboard → Settings → Environment Variables
# Vérifier que TOUTES ces variables existent pour "Production":

✓ NEXT_PUBLIC_SUPABASE_URL
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY
✓ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ← CRITIQUE!
✓ SUPABASE_SERVICE_ROLE_KEY
```

**Si `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` est manquante**:
1. L'ajouter dans Environment Variables
2. Sélectionner "Production, Preview, Development"
3. Redéployer (Deployments → ... → Redeploy)

---

### 4️⃣ Tester en mode développement local

Pour vérifier si le problème vient du déploiement ou du code:

```bash
# Dans ton terminal
npm run dev

# Puis ouvrir dans le navigateur:
# http://localhost:3000/dashboard/searcher

# Regarder la console (F12):
# - Y a-t-il des erreurs?
# - L'interface se charge?
```

**Si ça fonctionne en local mais pas en production** → Le problème est Vercel (variables d'env ou déploiement)

**Si ça plante aussi en local** → Le problème est dans le code

---

## 🔧 Solutions Possibles selon l'Erreur

### Si l'erreur est: "Google Maps API key is missing"

**Cause**: Variable `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` manquante dans Vercel

**Solution**:
1. Vercel Dashboard → Settings → Environment Variables
2. Add New → Name: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
3. Value: [Ta clé API Google Maps]
4. Environments: Production, Preview, Development
5. Save
6. Deployments → ... → Redeploy

---

### Si l'erreur est: "Cannot find module '@/lib/hooks/use-google-maps'"

**Cause**: Le fichier `use-google-maps.ts` n'est pas déployé

**Solution**:
1. Vérifier que le commit `4546d66` est bien dans le déploiement
2. Vérifier que le fichier existe sur GitHub
3. Forcer un redéploiement

**Vérification**:
```bash
# Dans ton terminal local
ls -la lib/hooks/use-google-maps.ts
# Devrait afficher le fichier

git log --oneline --all --grep="use-google-maps"
# Devrait montrer le commit 4546d66
```

---

### Si l'erreur est Supabase (infinite recursion)

**Cause**: L'appel `get_unread_count` n'est pas encore désactivé

**Solution**: Attendre que le commit `1dd5201` soit déployé

---

### Si l'erreur est: "Hydration failed"

**Cause**: Différence entre le HTML serveur et client (souvent un problème de date/heure)

**Solution**: Vérifier le code des composants React pour:
- `new Date()` dans le rendu
- `Math.random()` dans le rendu
- `window` ou `document` dans le rendu serveur

---

## 📊 Diagnostic Rapide

**Réponds à ces questions**:

1. **Le commit déployé sur Vercel est-il `1dd5201`?**
   - [ ] Oui → Passer à la question 2
   - [ ] Non → Attendre ou forcer redéploiement

2. **`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` existe dans Vercel?**
   - [ ] Oui → Passer à la question 3
   - [ ] Non → L'ajouter et redéployer

3. **L'application fonctionne en local (`npm run dev`)?**
   - [ ] Oui → Problème Vercel (env vars ou cache)
   - [ ] Non → Problème dans le code

4. **Quelle erreur vois-tu dans les logs Vercel?**
   - [ ] Aucun log / pas d'accès → Donner accès ou screenshot
   - [ ] Erreur visible → Screenshot et partager

---

## 🚀 Solution Express (1 minute)

Si tu n'as pas accès aux logs Vercel, essaie ceci:

```bash
# 1. Forcer un redéploiement complet
git commit --allow-empty -m "chore: force complete redeploy"
git push

# 2. Attendre 3-4 minutes que Vercel build et déploie

# 3. Vider le cache navigateur
# - Ouvrir DevTools (F12)
# - Clic droit sur Refresh
# - "Empty Cache and Hard Reload"

# 4. Tester l'URL en mode incognito
# Cmd+Shift+N (Mac) ou Ctrl+Shift+N (Windows)
```

---

## 📞 Besoin d'aide?

**Si rien ne fonctionne**, partage:
1. Screenshot des logs Vercel
2. Screenshot de la console navigateur (F12 → Console)
3. Le commit SHA déployé sur Vercel
4. Liste des variables d'environnement dans Vercel (noms seulement, pas les valeurs)

---

**Prochaine étape**: Vérifie les logs Vercel et dis-moi quelle erreur tu vois! 🔍
