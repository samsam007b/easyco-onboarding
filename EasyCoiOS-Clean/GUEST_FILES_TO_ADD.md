# Fichiers Guest à ajouter au projet Xcode

Ouvre le projet dans Xcode et ajoute ces 3 nouveaux fichiers :

## Fichiers à ajouter

1. **GuestTabView.swift**
   - Chemin: `EasyCo/Features/Guest/GuestTabView.swift`
   - Groupe: Features/Guest

2. **ResidentFeatureView.swift**
   - Chemin: `EasyCo/Features/Guest/ResidentFeatureView.swift`
   - Groupe: Features/Guest

3. **OwnerFeatureView.swift**
   - Chemin: `EasyCo/Features/Guest/OwnerFeatureView.swift`
   - Groupe: Features/Guest

## Comment ajouter les fichiers

1. Ouvre `EasyCo.xcodeproj` dans Xcode
2. Clique droit sur le dossier "Features" dans le navigateur de projet
3. Sélectionne "Add Files to EasyCo..."
4. Navigate vers `EasyCoiOS-Clean/EasyCo/EasyCo/Features/Guest/`
5. Sélectionne les 3 fichiers
6. Coche "Copy items if needed"
7. Assure-toi que "Create groups" est sélectionné
8. Clique "Add"

Ou simplement drag & drop le dossier `Guest` depuis le Finder vers le dossier "Features" dans Xcode.

## Verification

Après avoir ajouté les fichiers, rebuild le projet. Tous les fichiers doivent compiler sans erreur.
