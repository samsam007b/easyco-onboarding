#!/bin/bash

echo "🔧 Nettoyage du projet Xcode..."

cd /Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/EasyCo

# 1. Nettoyer DerivedData
echo "1. Suppression de DerivedData..."
rm -rf ~/Library/Developer/Xcode/DerivedData/EasyCo-*

# 2. Nettoyer le build folder du projet
echo "2. Nettoyage du build folder..."
rm -rf build/

# 3. Vérifier que les fichiers existent
echo "3. Vérification des fichiers..."
FILES=(
  "EasyCo/Features/Resident/CreateTaskView.swift"
  "EasyCo/Features/Resident/TaskRotationSettingsView.swift"
  "EasyCo/Features/Resident/TaskStatsView.swift"
  "EasyCo/Extensions/Date+Extensions.swift"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ MANQUANT: $file"
  fi
done

echo ""
echo "✅ Nettoyage terminé!"
echo ""
echo "📝 Prochaines étapes:"
echo "1. Ouvrir Xcode: open EasyCo.xcodeproj"
echo "2. Product > Clean Build Folder (⌘+Shift+K)"
echo "3. Product > Build (⌘+B)"
echo ""
echo "Si l'erreur persiste:"
echo "- Supprimer les 3 fichiers du projet (ne pas supprimer du disque)"
echo "- File > Add Files to 'EasyCo'..."
echo "- Sélectionner les 3 fichiers"
echo "- ✓ Copy items if needed: DÉCOCHER"
echo "- ✓ Add to targets: COCHER EasyCo uniquement"
