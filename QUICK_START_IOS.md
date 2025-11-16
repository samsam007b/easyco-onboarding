# Quick Start - Application iOS EasyCo

## ⚡ Installation Rapide

### 1. Installer Xcode (Si pas déjà fait)

1. Ouvrir l'App Store sur votre Mac
2. Rechercher "Xcode"
3. Cliquer sur "Obtenir" / "Installer" (~15 GB, peut prendre du temps)
4. Une fois installé, ouvrir Xcode une fois pour accepter les termes
5. Installer les outils en ligne de commande :
   ```bash
   sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
   ```

### 2. Construire l'Application

```bash
# Option 1 : Script automatique (recommandé)
./scripts/build-ios.sh

# Option 2 : Manuelle
npm run build:ios
```

### 3. Ouvrir dans Xcode

Si le script ne l'ouvre pas automatiquement :
```bash
npx cap open ios
```

### 4. Tester sur Simulateur

1. Dans Xcode, en haut à gauche, sélectionner un simulateur (ex: "iPhone 15 Pro")
2. Cliquer sur le bouton Play ▶️
3. L'app va se lancer dans le simulateur

## 🚨 Note Importante sur l'Architecture

**Votre application actuelle ne peut PAS fonctionner en mode 100% offline** car elle utilise :
- Routes API Next.js (`/api/*`)
- Server-Side Rendering (SSR)
- Supabase avec cookies serveur

### Solutions :

#### Solution 1 : Application "Wrapper" (Recommandé - 0 modification)
L'app iOS charge votre site déployé (easyco.be) dans une WebView native.

**Avantages** :
- ✅ Aucune modification de code
- ✅ Toutes les features fonctionnent
- ✅ Mises à jour sans resoumission App Store

**Inconvénient** :
- ⚠️ Nécessite internet

**Configuration** :
Votre app est déjà configurée ainsi ! Il suffit de :
1. Déployer votre site sur easyco.be (Vercel, etc.)
2. Build l'app iOS
3. L'app chargera automatiquement depuis easyco.be

Pour tester en local, décommenter dans `capacitor.config.ts` :
```typescript
server: {
  url: 'http://localhost:3000',
  cleartext: true
}
```

#### Solution 2 : Export Statique (Beaucoup de travail)
Réécrire toute l'app pour être 100% client-side.

**Nécessite de** :
- ❌ Supprimer toutes les API routes
- ❌ Utiliser Supabase directement depuis le client
- ❌ Réécrire l'auth sans cookies serveur
- ❌ Gérer la sécurité côté client

**Configuration Next.js** :
Nous avons déjà créé `next.config.capacitor.mjs` pour cela, mais il faudra modifier beaucoup de code.

## 🎯 Prochaines Étapes pour l'App Store

1. **S'inscrire au Apple Developer Program** ($99/an)
   - https://developer.apple.com/programs/

2. **Configurer les métadonnées** dans Xcode :
   - Bundle Identifier (actuellement : `com.easyco.app`)
   - Version (1.0.0)
   - Display Name (EasyCo)
   - Signing & Capabilities (Team)

3. **Préparer les assets** :
   - Screenshots (différentes tailles d'iPhone)
   - Description de l'app
   - Mots-clés
   - Icône App Store (1024x1024) ✅ Déjà généré !

4. **Tester sur un vrai iPhone** :
   - Connecter iPhone via USB
   - Sélectionner dans Xcode
   - Trust developer sur l'iPhone

5. **Upload vers TestFlight** :
   - Product > Archive dans Xcode
   - Distribute > App Store Connect

6. **Soumettre pour Review**

## 📱 Test Rapide

Pour tester que tout fonctionne :

```bash
# 1. Démarrer votre serveur Next.js
npm run dev

# 2. Dans un autre terminal, builder l'app iOS
./scripts/build-ios.sh

# 3. L'app devrait charger localhost:3000
```

## 🔧 Commandes Utiles

```bash
# Regénérer les icônes
node scripts/generate-ios-icons.js

# Synchroniser les changements
npm run cap:sync

# Ouvrir Xcode
npm run cap:open:ios

# Build complet
./scripts/build-ios.sh
```

## 📚 Documentation Complète

Voir [IOS_BUILD_GUIDE.md](./IOS_BUILD_GUIDE.md) pour le guide complet.

## ❓ Problèmes ?

### "xcodebuild requires Xcode"
→ Installer Xcode depuis l'App Store

### "No such file or directory: out"
→ Lancer le build : `./scripts/build-ios.sh`

### "Unable to boot simulator"
→ Ouvrir l'app "Simulator" manuellement d'abord

### "Signing requires a development team"
→ S'inscrire au Apple Developer Program

---

**Besoin d'aide ?** Consultez la documentation Capacitor : https://capacitorjs.com/docs
