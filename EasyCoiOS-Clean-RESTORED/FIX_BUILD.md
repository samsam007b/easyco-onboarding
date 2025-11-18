# 🔧 Fix Build Error - MatchesView.swift

## Problème
L'ancien fichier `MatchesView.swift` dans `Features/Profile/` a été supprimé, mais Xcode le référence toujours, causant l'erreur :
```
Build input file cannot be found: '.../Features/Profile/MatchesView.swift'
```

## ✅ Solution (2 minutes)

### Option 1 : Ajouter le bon fichier dans Xcode (Recommandé)

1. **Ouvrir le projet** :
   ```bash
   open EasyCo.xcodeproj
   ```

2. **Dans Xcode** :
   - Dans le Project Navigator (panneau de gauche)
   - Clic droit sur le dossier **Features**
   - Sélectionner **"New Group"**
   - Nommer le groupe : **Matches**

3. **Ajouter le fichier** :
   - Clic droit sur le nouveau dossier **Matches**
   - **"Add Files to EasyCo"**
   - Naviguer vers : `EasyCo/Features/Matches/MatchesView.swift`
   - **IMPORTANT** : Décocher "Copy items if needed"
   - **IMPORTANT** : Cocher "Add to targets: EasyCo"
   - Cliquer **Add**

4. **Clean et Build** :
   - Menu : **Product > Clean Build Folder** (Cmd+Shift+K)
   - Menu : **Product > Build** (Cmd+B)

### Option 2 : Nettoyer complètement le projet

Si l'option 1 ne fonctionne pas, essayez ceci dans Xcode :

1. **Supprimer les fichiers problématiques** :
   - Dans Project Navigator, chercher "MatchesView.swift" dans Profile
   - Si trouvé, cliquer droit > **Delete** > **Remove Reference**
   - Faire de même pour "SettingsView 2.swift" si présent

2. **Clean Build Folder** :
   - **Product > Clean Build Folder** (Cmd+Shift+K)
   - Ou : Maintenir **Option** et cliquer **Product > Clean Build Folder**

3. **Supprimer DerivedData** :
   - Fermer Xcode
   - Dans Terminal :
     ```bash
     rm -rf ~/Library/Developer/Xcode/DerivedData/EasyCo-*
     ```
   - Rouvrir Xcode

4. **Ajouter le bon fichier** (voir Option 1, étape 3)

### Option 3 : Build en ligne de commande (Test rapide)

Si vous voulez juste vérifier si ça compile sans ouvrir Xcode :

```bash
cd /Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/EasyCo

# Clean
xcodebuild clean -project EasyCo.xcodeproj -scheme EasyCo

# Build
xcodebuild build -project EasyCo.xcodeproj -scheme EasyCo -destination 'platform=iOS Simulator,name=iPhone 15'
```

## 📁 Structure correcte

Après correction, votre structure devrait être :

```
Features/
├── Auth/
├── Onboarding/
├── Properties/
├── Favorites/
├── Matches/              ← Nouveau dossier
│   └── MatchesView.swift ← Bon fichier ici
├── Owner/
├── Resident/
├── Messages/
├── Groups/
└── Profile/
    ├── ProfileView.swift
    └── SettingsView.swift  ← Pas de "2.swift"
```

## ✅ Vérification

Pour vérifier que tout est OK :

1. **Build réussit** (pas d'erreurs)
2. **Run sur simulateur** (Cmd+R)
3. **L'onglet "Matchs"** apparaît dans le TabView Searcher (3ème onglet)

## 🆘 Si ça ne marche toujours pas

Contactez-moi avec :
- La sortie complète de l'erreur de build
- Une capture d'écran du Project Navigator
- Le résultat de :
  ```bash
  find EasyCo/Features -name "MatchesView.swift"
  ```

---

**Note** : Les fichiers ont déjà été nettoyés côté système de fichiers. Il ne reste qu'à synchroniser Xcode.
