# 🗺️ Configuration Google Maps Platform - Guide Complet

## Étape 1: Créer un compte Google Cloud Platform

### 1.1 Accéder à Google Cloud Console

1. **Allez sur:** https://console.cloud.google.com/
2. **Connectez-vous** avec votre compte Google (Gmail)
3. **Acceptez** les conditions d'utilisation

### 1.2 Créer un nouveau projet

1. **Cliquez** sur le menu déroulant en haut (à côté de "Google Cloud")
2. **Cliquez** sur "Nouveau projet"
3. **Nom du projet:** `EasyCo-Production` (ou `EasyCo-Dev` pour développement)
4. **Organisation:** Laissez par défaut
5. **Cliquez** sur "Créer"
6. **Attendez** quelques secondes que le projet soit créé
7. **Sélectionnez** le projet dans le menu déroulant

✅ **Votre projet est créé!**

---

## Étape 2: Activer la facturation (avec $300 de crédits gratuits)

### 2.1 Configurer la facturation

1. **Menu** (☰) → "Facturation" → "Accéder au compte de facturation"
2. **Cliquez** sur "Ajouter un compte de facturation"
3. **Sélectionnez** "Activer l'essai gratuit" ou "Créer un compte de facturation"

### 2.2 Informations requises

**Informations personnelles:**
- Pays: Belgique (ou votre pays)
- Type de compte: Particulier
- Nom et adresse

**Carte bancaire:**
- Numéro de carte
- Date d'expiration
- CVC

⚠️ **IMPORTANT:**
- Google charge **€0** ou €1 pour vérifier la carte (remboursé immédiatement)
- Vous ne serez **PAS facturé** tant que vous n'activez pas manuellement la facturation post-essai
- $300 de crédits gratuits valables 90 jours
- $200/mois GRATUITS pour Google Maps Platform (pour toujours)

### 2.3 Associer la facturation au projet

1. **Menu** → "Facturation"
2. **Sélectionnez** votre compte de facturation
3. **Actions** → "Associer des projets"
4. **Cochez** votre projet EasyCo
5. **Cliquez** sur "Définir le compte"

✅ **La facturation est configurée!**

---

## Étape 3: Activer les APIs Google Maps nécessaires

### 3.1 APIs à activer

**Allez dans:** Menu → "APIs et services" → "Bibliothèque"

**Recherchez et activez ces APIs:**

1. **Maps JavaScript API** ⭐ (OBLIGATOIRE)
   - Pour afficher les cartes interactives
   - Cliquez sur "Activer"

2. **Places API** ⭐ (OBLIGATOIRE)
   - Pour les points d'intérêt, autocomplete d'adresses
   - Cliquez sur "Activer"

3. **Geocoding API** ⭐ (OBLIGATOIRE)
   - Pour convertir adresses → coordonnées (lat/lng)
   - Cliquez sur "Activer"

4. **Directions API** (RECOMMANDÉ)
   - Pour calculer les itinéraires et temps de trajet
   - Cliquez sur "Activer"

5. **Distance Matrix API** (OPTIONNEL)
   - Pour calculer distances entre plusieurs points
   - Cliquez sur "Activer"

✅ **Les APIs sont activées!**

---

## Étape 4: Créer une clé API sécurisée

### 4.1 Créer la clé API

1. **Menu** → "APIs et services" → "Identifiants"
2. **Cliquez** sur "Créer des identifiants" en haut
3. **Sélectionnez** "Clé API"
4. Une clé est générée (ex: `AIzaSyB1234567890abcdefghijklmnop`)
5. **⚠️ NE FERMEZ PAS** la fenêtre encore!

### 4.2 Sécuriser la clé API (CRITIQUE!)

**Dans la fenêtre de création:**

1. **Cliquez** sur "Modifier la clé API"
2. **Nom de la clé:** `EasyCo-Maps-Key`

**Restrictions d'application:**

**Option A: Restrictions par domaine (PRODUCTION)**
- Sélectionnez "Références HTTP (sites web)"
- Ajoutez vos domaines:
  ```
  https://easyco-onboarding.vercel.app/*
  https://*.vercel.app/*
  http://localhost:3000/*
  ```

**Option B: Restrictions par adresse IP (DÉVELOPPEMENT)**
- Sélectionnez "Adresses IP"
- Ajoutez: `0.0.0.0/0` (temporaire pour dev, à changer en prod!)

**Restrictions d'API:**
- Sélectionnez "Limiter la clé aux APIs sélectionnées"
- Cochez:
  - Maps JavaScript API
  - Places API
  - Geocoding API
  - Directions API
  - Distance Matrix API

3. **Cliquez** sur "Enregistrer"

✅ **Votre clé API est sécurisée!**

### 4.3 Copier la clé API

**Copiez la clé API** (ressemble à: `AIzaSyB1234567890abcdefghijklmnop`)

⚠️ **IMPORTANT:**
- NE JAMAIS commit cette clé dans Git!
- On va la mettre dans `.env.local`

---

## Étape 5: Configurer des quotas et alertes (Protection)

### 5.1 Configurer des quotas

1. **Menu** → "APIs et services" → "Quotas et limites du système"
2. **Filtrez** par "Maps JavaScript API"
3. **Cliquez** sur "Map loads per day"
4. **Définissez** une limite: 10,000/jour (largement suffisant)
5. **Enregistrez**

### 5.2 Configurer des alertes budgétaires

1. **Menu** → "Facturation" → "Budgets et alertes"
2. **Cliquez** sur "Créer un budget"
3. **Nom:** "Alert Google Maps"
4. **Montant:** $50/mois
5. **Seuils d'alerte:**
   - 50% → $25
   - 90% → $45
   - 100% → $50
6. **Email de notification:** Votre email
7. **Créer**

✅ **Vous serez alerté si ça consomme trop!**

---

## Étape 6: Ajouter la clé API à votre projet EasyCo

### 6.1 Créer/modifier `.env.local`

Dans votre projet EasyCo, créez ou éditez le fichier `.env.local`:

```bash
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyB1234567890abcdefghijklmnop

# Remplacez par votre vraie clé!
```

### 6.2 Vérifier `.gitignore`

Assurez-vous que `.env.local` est dans `.gitignore`:

```
# .gitignore
.env.local
.env*.local
```

✅ **La clé est configurée localement!**

---

## Étape 7: Configurer Vercel (Production)

### 7.1 Ajouter la clé API dans Vercel

1. **Allez sur:** https://vercel.com/dashboard
2. **Sélectionnez** votre projet `easyco-onboarding`
3. **Settings** → "Environment Variables"
4. **Ajoutez:**
   - **Key:** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - **Value:** `AIzaSyB1234567890abcdefghijklmnop` (votre vraie clé)
   - **Environment:** Production, Preview, Development (cochez les 3)
5. **Save**

### 7.2 Redéployer

Vercel redéploiera automatiquement avec la nouvelle variable d'environnement.

✅ **Google Maps est configuré en production!**

---

## 📊 Estimation des coûts

### Utilisation typique pour EasyCo:

**Développement (vous):**
- ~100 map loads/jour
- **Coût:** $0 (largement sous $200/mois gratuit)

**100 utilisateurs actifs/mois:**
- ~3,000 map loads/mois
- **Coût:** $0 (sous le seuil gratuit)

**1,000 utilisateurs actifs/mois:**
- ~30,000 map loads/mois
- **Coût:** ~$7-10/mois (après déduction des $200 gratuits)

**10,000 utilisateurs actifs/mois:**
- ~300,000 map loads/mois
- **Coût:** ~$70-100/mois

---

## 🔍 Vérifier que tout fonctionne

### Test dans la console Google Cloud

1. **Menu** → "APIs et services" → "Tableau de bord"
2. Vous devriez voir:
   - Maps JavaScript API: ✅ Activée
   - Places API: ✅ Activée
   - Geocoding API: ✅ Activée
3. **Menu** → "APIs et services" → "Identifiants"
4. Vous devriez voir votre clé API avec restrictions

### Test dans votre app (après implémentation)

Une fois qu'on aura codé le composant carte, vous verrez une carte Google Maps s'afficher!

---

## ⚠️ Sécurité - Checklist finale

- [ ] Clé API avec restrictions de domaine (pas `0.0.0.0/0` en prod!)
- [ ] Clé API avec restrictions d'API (seulement Maps, Places, etc.)
- [ ] `.env.local` dans `.gitignore`
- [ ] Quotas configurés (10,000 loads/jour max)
- [ ] Alertes budgétaires ($50/mois)
- [ ] Variable d'environnement dans Vercel

---

## 🆘 Problèmes courants

### "This API key is not authorized..."
→ Vérifiez les restrictions de domaine (ajoutez votre domaine)

### "Maps JavaScript API has not been used..."
→ Attendez 5 minutes après activation de l'API

### La carte ne s'affiche pas
→ Vérifiez la console browser (F12) pour les erreurs
→ Vérifiez que `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` est bien définie

---

## ✅ Prochaines étapes

Une fois cette configuration terminée:
1. Je vais installer les packages NPM
2. Créer le composant `PropertyMap`
3. Intégrer la carte dans Browse Properties
4. Ajouter les markers pour chaque propriété

---

**Êtes-vous prêt à commencer la configuration?** Suivez les étapes ci-dessus et dites-moi quand vous avez votre clé API! 🚀
