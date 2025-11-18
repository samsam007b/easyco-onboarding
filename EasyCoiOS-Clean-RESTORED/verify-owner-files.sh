#!/bin/bash

echo "🔍 Vérification des fichiers Owner..."
echo ""

OWNER_DIR="EasyCo/EasyCo/Features/Owner"

# Liste des fichiers Owner qui doivent exister
OWNER_FILES=(
    "CreatePropertyView.swift"
    "CreatePropertyViewModel.swift"
    "PropertyFormStep1View.swift"
    "PropertyFormStep2View.swift"
    "PropertyFormStep3View.swift"
    "PropertyFormStep4View.swift"
    "PropertyFormStep5View.swift"
    "OwnerFormComponents.swift"
)

echo "📁 Vérification des fichiers physiques:"
ALL_EXIST=true
for file in "${OWNER_FILES[@]}"; do
    if [ -f "$OWNER_DIR/$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (manquant!)"
        ALL_EXIST=false
    fi
done

echo ""
echo "🔧 Vérification du projet Xcode:"
if grep -q "OwnerFormComponents.swift" EasyCo/EasyCo.xcodeproj/project.pbxproj; then
    echo "  ✅ OwnerFormComponents.swift dans le projet"
else
    echo "  ❌ OwnerFormComponents.swift pas dans le projet"
    ALL_EXIST=false
fi

echo ""
if [ "$ALL_EXIST" = true ]; then
    echo "✅ Tous les fichiers Owner sont en place!"
    echo ""
    echo "📋 Prochaines étapes:"
    echo "  1. Ferme Xcode (⌘Q) si ouvert"
    echo "  2. Rouvre: open EasyCo/EasyCo.xcodeproj"
    echo "  3. Clean (⇧⌘K)"
    echo "  4. Build (⌘B)"
    echo ""
    echo "🎯 Tous les fichiers Owner devraient compiler sans erreur"
else
    echo "⚠️  Il manque des fichiers, exécute le script add-owner-components.rb"
fi
