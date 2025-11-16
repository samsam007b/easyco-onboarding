# 📱 Guide de Création du Projet Xcode - EasyCo iOS

## 🎯 Objectif

Créer le projet Xcode et importer tous les fichiers Swift pour avoir une application fonctionnelle.

---

## ⚡ Quick Start (5 minutes)

### 1. Créer le Projet Xcode

1. **Ouvrir Xcode**
2. **File > New > Project** (ou ⇧⌘N)
3. Choisir **iOS > App**
4. Cliquer **Next**

### 2. Configuration du Projet

Remplir les informations :

```
Product Name:              EasyCo
Team:                      [Sélectionner votre team]
Organization Identifier:   com.easyco
Bundle Identifier:         com.easyco.app (auto-généré)
Interface:                 SwiftUI
Language:                  Swift
Storage:                   None
Include Tests:             [Décocher]
```

Cliquer **Next**, choisir l'emplacement, puis **Create**

### 3. Nettoyer le Projet

Par défaut, Xcode crée des fichiers qu'on n'utilisera pas :

1. **Supprimer** ces fichiers (clic droit > Delete > Move to Trash) :
   - `ContentView.swift`
   - `EasyCoApp.swift` (on a le nôtre)
   - `Assets.xcassets` (optionnel, on peut le garder)

### 4. Importer les Fichiers Swift

#### Option A : Glisser-Déposer (Recommandé)

1. Ouvrir le Finder
2. Naviguer vers `/Users/samuelbaudon/easyco-onboarding/EasyCoiOS/`
3. **Glisser tout le contenu** du dossier dans Xcode (dans le navigateur de gauche)
4. Dans la popup :
   - ✅ Cocher **"Copy items if needed"**
   - ✅ Choisir **"Create groups"**
   - ✅ Cocher **"Add to targets: EasyCo"**
5. Cliquer **Finish**

#### Option B : Add Files (Alternative)

1. Clic droit sur le projet dans Xcode
2. **Add Files to "EasyCo"...**
3. Naviguer vers `/Users/samuelbaudon/easyco-onboarding/EasyCoiOS/`
4. Sélectionner **tous les fichiers et dossiers**
5. Cocher les mêmes options que ci-dessus
6. **Add**

### 5. Vérifier la Structure

Après import, vous devriez voir :

```
EasyCo/
├── EasyCoApp.swift
├── ContentView.swift
├── Config/
│   ├── AppConfig.swift
│   └── Theme.swift
├── Core/
│   ├── Network/
│   ├── Storage/
│   └── Auth/
├── Models/
├── Features/
├── Components/
└── Extensions/
```

### 6. Configurer l'App

Éditer **`Config/AppConfig.swift`** :

```swift
// Ligne 28-29
static let supabaseURL = "https://fgthoyilfupywmpmiuwd.supabase.co"
static let supabaseAnonKey = "VOTRE_SUPABASE_ANON_KEY_ICI"
```

Pour obtenir la clé Supabase :
1. Aller sur [supabase.com](https://supabase.com)
2. Sélectionner votre projet
3. Settings > API
4. Copier "anon public"

### 7. Build & Run

1. Sélectionner un simulateur : **iPhone 15 Pro**
2. Appuyer sur **⌘R** (ou cliquer sur ▶️)
3. Attendre la compilation (30-60 secondes la première fois)
4. 🎉 **L'app se lance !**

---

## 🔧 Résolution de Problèmes

### Erreur : "Cannot find 'Theme' in scope"

**Solution** : Vérifier que tous les fichiers sont bien dans le projet
1. Clic sur le projet (racine bleue)
2. Onglet "Build Phases"
3. Ouvrir "Compile Sources"
4. Vérifier que tous les `.swift` sont listés

### Erreur : "Missing required module"

**Solution** : Clean Build Folder
1. Product > Clean Build Folder (⇧⌘K)
2. Rebuild (⌘B)

### Erreur : "No such module 'SwiftUI'"

**Solution** : Vérifier le Deployment Target
1. Sélectionner le projet
2. Build Settings
3. iOS Deployment Target = **iOS 16.0** minimum

### L'app crash au lancement

**Solution** : Vérifier les logs
1. Ouvrir la Console (View > Debug Area > Activate Console)
2. Lire le message d'erreur
3. Vérifier que `AppConfig.supabaseURL` est correct

---

## 📱 Tester l'Application

### Sur Simulateur

**Simulateurs recommandés :**
- iPhone 15 Pro (6.1")
- iPhone 15 Pro Max (6.7")
- iPad Pro 12.9"

**Tester :**
1. Onboarding
2. Inscription
3. Connexion
4. Navigation dans les tabs
5. Recherche de propriétés

### Sur Device Réel

1. Connecter iPhone via USB
2. Dans Xcode, sélectionner votre iPhone (en haut)
3. ⌘R
4. Sur l'iPhone :
   - Réglages > Général > Gestion des appareils
   - Trust "[Votre nom]"
5. Relancer l'app

---

## 🎨 Personnalisation

### Changer les Couleurs

Éditer `Config/Theme.swift` :

```swift
static let primary = Color(hex: "7c3aed") // Votre couleur
static let secondary = Color(hex: "ec4899")
```

### Changer le Nom de l'App

1. Sélectionner le projet (icône bleue)
2. General > Display Name
3. Changer "EasyCo" par votre nom

### Changer l'Icône

1. Préparer les icônes (utilisez les PNG générés dans `public/icons/`)
2. Assets.xcassets > AppIcon
3. Glisser les icônes aux bonnes tailles

---

## 🚀 Prochaines Étapes

### 1. Configurer Signing

Pour tester sur device et publier :

1. Sélectionner le projet
2. Signing & Capabilities
3. Team > Sélectionner votre team
4. Si pas de team :
   - Xcode > Preferences > Accounts
   - Ajouter votre Apple ID
   - Download Manual Profiles

### 2. Configurer le Bundle ID

Si `com.easyco.app` est déjà pris :

1. Signing & Capabilities
2. Bundle Identifier > `com.votreentreprise.easyco`
3. Également changer dans `AppConfig.swift` :
   ```swift
   static let bundleIdentifier = "com.votreentreprise.easyco"
   ```

### 3. Ajouter des Capabilities (optionnel)

Si besoin de :
- Push Notifications
- iCloud
- Apple Pay
- etc.

1. Signing & Capabilities
2. + Capability
3. Sélectionner

---

## 📊 Checklist de Vérification

Avant de considérer le projet prêt :

### Build
- [ ] Le projet compile sans erreur
- [ ] Aucun warning critique
- [ ] Build time < 2 minutes

### Runtime
- [ ] L'app se lance sans crash
- [ ] Onboarding s'affiche
- [ ] Login fonctionne
- [ ] Navigation entre tabs fonctionne

### UI
- [ ] Pas de texte coupé
- [ ] Images se chargent
- [ ] Animations fluides
- [ ] Responsive sur différents écrans

### Data
- [ ] API calls fonctionnent (avec backend)
- [ ] Erreurs gérées proprement
- [ ] Loading states affichés

---

## 🎓 Conseils Pro

### Performance

1. **Build en Release** pour tester les perfs :
   - Product > Scheme > Edit Scheme
   - Run > Build Configuration > Release

2. **Profiling** :
   - Product > Profile (⌘I)
   - Choisir "Time Profiler" ou "Allocations"

### Debugging

1. **Breakpoints** : Clic sur la ligne de numéro
2. **Print debugging** : Les `print()` s'affichent en Console
3. **View Hierarchy** :
   - Debug > View Debugging > Capture View Hierarchy

### Keyboard Shortcuts

```
⌘R        Build & Run
⌘B        Build
⇧⌘K       Clean Build Folder
⌘.        Stop
⌘/        Comment
⌘⌥[       Move line up
⌘⌥]       Move line down
^I        Re-indent
```

---

## 📚 Ressources

### Documentation Apple

- [SwiftUI Tutorials](https://developer.apple.com/tutorials/swiftui)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

### Outils

- [SF Symbols](https://developer.apple.com/sf-symbols/) - Icônes Apple
- [Xcode Tips](https://xcode-tips.github.io/) - Raccourcis et astuces

---

## 🎉 Félicitations !

Si vous êtes arrivé ici, vous avez maintenant :

✅ Un projet Xcode configuré
✅ Tous les fichiers Swift importés
✅ Une app fonctionnelle
✅ Prêt pour le développement/tests

**Next step** : Tester l'app et la soumettre à l'App Store ! 🚀

---

*Des questions ? Consultez les autres guides ou les commentaires dans le code.*
