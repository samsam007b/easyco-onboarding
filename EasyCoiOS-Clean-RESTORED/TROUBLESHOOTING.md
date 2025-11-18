# 🔧 Guide de Dépannage - EasyCo iOS

## 🐛 Erreurs Xcode Courantes

### Erreur : "Build input files cannot be found"

**Symptômes** :
```
Build input files cannot be found:
'/path/to/EasyCo/Features/Resident/EasyCo/Features/Resident/CreateTaskView.swift'
```

**Cause** : Chemins de fichiers dupliqués dans Xcode project

**Solution** :
```bash
cd /Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/EasyCo
./fix-xcode-build.sh
```

Puis dans Xcode :
1. Product > Clean Build Folder (⌘+Shift+K)
2. Product > Build (⌘+B)

---

### Erreur : "Invalid redeclaration of 'timeAgo'"

**Symptômes** :
```
/path/to/Date+Extensions.swift:15:9 Invalid redeclaration of 'timeAgo'
```

**Cause** : Fichier référencé plusieurs fois ou import dupliqué

**Solution** :
1. Exécuter le script de nettoyage :
```bash
./fix-xcode-build.sh
```

2. Dans Xcode, vérifier qu'il n'y a qu'une seule référence à Date+Extensions.swift :
   - Project Navigator > Extensions > Date+Extensions.swift
   - Si dupliqué, supprimer les références en trop (clic droit > Delete > Remove Reference)

3. Clean & Build :
```
⌘+Shift+K  # Clean
⌘+B        # Build
```

---

### Erreur : "No such module 'Charts'"

**Symptômes** :
```
import Charts
       ^ No such module 'Charts'
```

**Cause** : TaskStatsView utilise Charts (iOS 16+ framework)

**Solution Option 1** : Commenter temporairement l'import
```swift
// import Charts  // Commenté pour l'instant
```

**Solution Option 2** : Utiliser iOS 16+ simulator
- Xcode > Product > Destination > Choose Device
- Sélectionner iPhone 14/15 avec iOS 16+

---

### Erreur : "Module compiled with Swift X expected Y"

**Symptômes** :
```
Module compiled with Swift 5.9 cannot be imported by Swift 5.8
```

**Solution** :
1. Xcode > Build Settings
2. Rechercher "Swift Language Version"
3. Définir à "Swift 5.9" (ou version actuelle)
4. Clean & Build

---

## 🔄 Procédure de Nettoyage Complète

Si plusieurs erreurs persistent, suivre cette procédure :

### 1. Fermer Xcode
```bash
killall Xcode
```

### 2. Nettoyer tout
```bash
cd /Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/EasyCo

# DerivedData
rm -rf ~/Library/Developer/Xcode/DerivedData/EasyCo-*

# Build folder
rm -rf build/

# Pods (si utilisé)
rm -rf Pods/
rm Podfile.lock

# SPM (si utilisé)
rm -rf .swiftpm/
rm -rf .build/
```

### 3. Vérifier les fichiers
```bash
ls -la EasyCo/Features/Resident/
# Doit montrer:
# - CreateTaskView.swift
# - TaskRotationSettingsView.swift
# - TaskStatsView.swift
# - TasksView.swift
# - TasksViewModel.swift
```

### 4. Ouvrir et rebuilder
```bash
open EasyCo.xcodeproj
```

Dans Xcode :
1. ⌘+Shift+K (Clean Build Folder)
2. ⌘+B (Build)

---

## 📝 Vérifications Git

### Vérifier les fichiers commitées
```bash
cd /Users/samuelbaudon/easyco-onboarding
git status
git log --oneline -5
```

### Si des fichiers manquent
```bash
# Voir les fichiers non trackés
git status

# Ajouter les fichiers manquants
git add EasyCoiOS-Clean/EasyCo/EasyCo/Features/Resident/*.swift

# Commit
git commit -m "fix: add missing files"
```

---

## 🔍 Diagnostic Détaillé

### Vérifier Structure du Projet

```bash
cd /Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/EasyCo

# Liste des fichiers Swift Resident
find EasyCo/Features/Resident -name "*.swift" -type f

# Doit afficher:
# EasyCo/Features/Resident/CreateTaskView.swift
# EasyCo/Features/Resident/ResidentHubView.swift
# EasyCo/Features/Resident/ResidentHubViewModel.swift
# EasyCo/Features/Resident/TaskRotationSettingsView.swift
# EasyCo/Features/Resident/TaskStatsView.swift
# EasyCo/Features/Resident/TasksView.swift
# EasyCo/Features/Resident/TasksViewModel.swift
```

### Vérifier Références Xcode

```bash
# Compter les références à CreateTaskView dans project.pbxproj
grep -c "CreateTaskView.swift" EasyCo.xcodeproj/project.pbxproj

# Devrait être ~3-4 (FileReference + BuildFile pour chaque target)
```

---

## 🆘 Si Rien ne Fonctionne

### Plan B : Re-créer les Références Manuellement

1. **Dans Xcode**, supprimer les 3 fichiers problématiques du projet :
   - CreateTaskView.swift
   - TaskRotationSettingsView.swift
   - TaskStatsView.swift

   ⚠️ Choisir "Remove Reference" (PAS "Move to Trash")

2. **File > Add Files to "EasyCo"...**
   - Naviguer vers `EasyCo/Features/Resident/`
   - Sélectionner les 3 fichiers
   - Options importantes :
     - ☐ Copy items if needed (DÉCOCHER)
     - ☑️ Create groups
     - ☑️ Add to targets: EasyCo (COCHER)
   - Click "Add"

3. **Clean & Build**
   ```
   ⌘+Shift+K
   ⌘+B
   ```

---

## 📊 Fichiers Critiques

Ces fichiers DOIVENT exister :

```
EasyCoiOS-Clean/EasyCo/
├── EasyCo.xcodeproj/
│   └── project.pbxproj          ← Références aux fichiers
├── EasyCo/
│   ├── Extensions/
│   │   └── Date+Extensions.swift
│   ├── Features/
│   │   └── Resident/
│   │       ├── CreateTaskView.swift         ← ~500 lignes
│   │       ├── TaskRotationSettingsView.swift ← ~450 lignes
│   │       ├── TaskStatsView.swift          ← ~550 lignes
│   │       ├── TasksView.swift              ← ~400 lignes
│   │       └── TasksViewModel.swift         ← ~400 lignes
│   └── Models/
│       └── ResidentTask.swift
└── fix-xcode-build.sh           ← Script de nettoyage
```

---

## 💡 Conseils de Prévention

### Avant d'Ajouter des Fichiers à Xcode

1. **Toujours vérifier le path**
   - Utiliser des chemins relatifs
   - Pas de duplication de dossiers

2. **Utiliser le script Ruby**
   ```ruby
   file_ref = group.new_file('relative/path/to/file.swift')
   ```

3. **Vérifier après ajout**
   ```bash
   grep "NewFile.swift" EasyCo.xcodeproj/project.pbxproj
   ```

### Pendant le Développement

1. **Commit souvent**
   - Permet de revenir en arrière facilement

2. **Tester le build régulièrement**
   - Ne pas attendre la fin pour builder

3. **Garder Xcode fermé**
   - Quand on modifie project.pbxproj manuellement

---

## 📞 Ressources

### Documentation
- [SPRINT_2_COMPLETE.md](SPRINT_2_COMPLETE.md) - Vue d'ensemble
- [TEST_SPRINT_2.md](TEST_SPRINT_2.md) - Tests
- [NEXT_STEPS.md](NEXT_STEPS.md) - Prochaines étapes

### Scripts
- `fix-xcode-build.sh` - Nettoyage automatique
- Scripts Ruby dans les commits précédents

### Logs Utiles
```bash
# Voir les derniers commits
git log --oneline -10

# Voir les fichiers changés
git diff HEAD~1 HEAD --name-only

# Voir le status
git status
```

---

## ✅ Checklist Debugging

Avant de demander de l'aide, vérifier :

- [ ] Script `fix-xcode-build.sh` exécuté
- [ ] DerivedData supprimée
- [ ] Build folder nettoyé
- [ ] Xcode redémarré
- [ ] Clean Build Folder effectué (⌘+Shift+K)
- [ ] Tous les fichiers existent sur le disque
- [ ] Pas de chemins dupliqués dans project.pbxproj
- [ ] Git status propre (pas de conflits)
- [ ] Derniers commits pulled
- [ ] Bon simulator sélectionné (iOS 16+)

---

**Dernière mise à jour** : 14 Novembre 2025
**Version Xcode** : 15+
**iOS Target** : 16.0+
