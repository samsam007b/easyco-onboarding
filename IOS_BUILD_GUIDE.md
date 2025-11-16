# Guide de Construction de l'Application iOS EasyCo

Ce guide explique comment construire et déployer l'application EasyCo sur l'App Store iOS.

## Prérequis

Avant de commencer, assurez-vous d'avoir :

1. **Un Mac** avec macOS (requis pour le développement iOS)
2. **Xcode** installé (dernière version recommandée)
3. **Node.js** et npm installés
4. **Un compte Apple Developer** ($99/an)
5. **CocoaPods** installé : `sudo gem install cocoapods`

## Architecture

L'application utilise **Capacitor** pour transformer l'application Next.js en application native iOS.

### Mode de fonctionnement

⚠️ **Important** : Votre application utilise des fonctionnalités serveur (Supabase SSR, API routes, etc.).

Vous avez deux options :

### Option 1 : Application Web Wrappée (Recommandé pour démarrer)
- L'app iOS charge votre site web déployé dans une WebView native
- Configuration actuelle dans `capacitor.config.ts`
- Avantages : Tous les features fonctionnent, mises à jour sans resoumission
- Inconvénients : Nécessite une connexion internet

### Option 2 : Export Statique (Nécessite des modifications)
- L'app contient tous les fichiers HTML/CSS/JS
- Nécessite de réécrire les routes API en client-only
- Avantages : Fonctionne offline
- Inconvénients : Beaucoup de travail de refactoring

## Construction de l'Application

### Méthode Rapide

```bash
# Construction complète + ouverture dans Xcode
./scripts/build-ios.sh
```

### Méthode Détaillée

```bash
# 1. Construire Next.js avec export statique
next build -c next.config.capacitor.mjs

# 2. Synchroniser avec Capacitor
npx cap sync ios

# 3. Ouvrir dans Xcode
npx cap open ios
```

## Configuration pour l'App Store

### 1. Identifiants Apple

Dans Xcode, configurez votre Team :
1. Ouvrir le projet dans Xcode : `npx cap open ios`
2. Sélectionner le projet "App" dans le navigateur
3. Onglet "Signing & Capabilities"
4. Cocher "Automatically manage signing"
5. Sélectionner votre Team (compte Apple Developer)

### 2. Modifier l'App ID

Si vous voulez changer `com.easyco.app` :

1. Éditer `capacitor.config.ts` :
```typescript
const config: CapacitorConfig = {
  appId: 'com.votreentreprise.easyco', // Modifier ici
  // ...
};
```

2. Resynchroniser : `npx cap sync ios`

### 3. Icônes et Splash Screens

Les icônes sont déjà générées dans `public/icons/`.

Pour les personnaliser :
1. Remplacer `public/icons/icon.svg`
2. Exécuter : `node scripts/generate-ios-icons.js`

### 4. Métadonnées de l'App

Éditer dans Xcode :
- **Display Name** : Le nom affiché sous l'icône
- **Version** : Version de l'app (ex: 1.0.0)
- **Build** : Numéro de build (ex: 1)

## Test sur Simulateur iOS

```bash
# 1. Build et ouvrir Xcode
./scripts/build-ios.sh

# 2. Dans Xcode
# - Sélectionner un simulateur (ex: iPhone 15 Pro)
# - Cliquer sur Play (▶️)
```

## Test sur un Appareil Physique

1. Connecter votre iPhone via USB
2. Dans Xcode, sélectionner votre iPhone dans la liste des devices
3. Cliquer sur Play (▶️)
4. Sur l'iPhone : Réglages > Général > Gestion des appareils > Trust developer

## Déploiement sur TestFlight

1. Dans Xcode : Product > Archive
2. Une fois archivé : Distribute App
3. Choisir "App Store Connect"
4. Upload
5. Se connecter sur [App Store Connect](https://appstoreconnect.apple.com)
6. Ajouter des testeurs dans TestFlight

## Soumission à l'App Store

### Checklist Avant Soumission

- [ ] Les métadonnées sont complètes (nom, description, screenshots)
- [ ] Les icônes et splash screens sont corrects
- [ ] L'app fonctionne correctement sur plusieurs appareils
- [ ] Les liens de politique de confidentialité sont configurés
- [ ] Les captures d'écran sont prêtes (voir tailles ci-dessous)

### Tailles de Screenshots Requises

Pour l'App Store Connect, vous aurez besoin de :
- **iPhone 6.7"** : 1290 x 2796 pixels (iPhone 15 Pro Max)
- **iPhone 6.5"** : 1284 x 2778 pixels (iPhone 14 Pro Max)
- **iPhone 5.5"** : 1242 x 2208 pixels (iPhone 8 Plus)

Vous pouvez les générer avec les simulateurs Xcode.

### Dans App Store Connect

1. Aller sur [App Store Connect](https://appstoreconnect.apple.com)
2. Créer une nouvelle app
3. Remplir toutes les métadonnées :
   - Nom de l'app
   - Description
   - Mots-clés
   - Captures d'écran
   - URL de politique de confidentialité
   - Catégorie : "Lifestyle" ou "Social Networking"
4. Choisir le build uploadé depuis Xcode
5. Soumettre pour review

## Mode Développement vs Production

### Développement (charger depuis localhost)

Décommenter dans `capacitor.config.ts` :

```typescript
server: {
  url: 'http://localhost:3000',
  cleartext: true
}
```

Puis `npx cap sync ios`

### Production (fichiers embarqués)

Commentez les lignes ci-dessus et rebuild.

## Problèmes Courants

### L'app ne se lance pas

1. Vérifier les logs dans Xcode (panneau Console)
2. Vérifier que le dossier `out` existe et contient les fichiers
3. Essayer : `npx cap sync ios --force`

### Les API routes ne fonctionnent pas

C'est normal en mode export statique ! Deux solutions :
1. Utiliser le mode "wrapper" (charger depuis votre domaine)
2. Réécrire les API routes en client-only avec Supabase direct

### Erreurs de signing

1. Vérifier que vous avez un compte Apple Developer actif
2. Dans Xcode : Clean Build Folder (Cmd + Shift + K)
3. Réessayer

## Scripts Disponibles

```bash
# Build iOS complet
npm run build:ios

# Synchroniser uniquement
npm run cap:sync

# Ouvrir Xcode
npm run cap:open:ios

# Générer les icônes
node scripts/generate-ios-icons.js
```

## Ressources Utiles

- [Documentation Capacitor](https://capacitorjs.com/docs)
- [Guide Apple Developer](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

## Support

Pour toute question :
1. Vérifier la documentation Capacitor
2. Consulter les logs Xcode
3. Tester sur un simulateur d'abord

---

Bonne chance avec votre soumission à l'App Store ! 🚀
