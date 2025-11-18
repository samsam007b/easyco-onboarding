#!/bin/bash

# Script pour nettoyer le project.pbxproj des références invalides

PROJECT_FILE="/Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/EasyCo/EasyCo.xcodeproj/project.pbxproj"
BACKUP_FILE="${PROJECT_FILE}.backup.$(date +%s)"

echo "🔧 Nettoyage du fichier projet Xcode..."
echo "📁 Fichier: $PROJECT_FILE"

# Créer une sauvegarde
echo "💾 Création sauvegarde: $BACKUP_FILE"
cp "$PROJECT_FILE" "$BACKUP_FILE"

# Liste des UUIDs à supprimer (Owner files qui n'existent pas)
UUIDS_TO_REMOVE=(
    "012E1C469FBE70AC37A7E4B4"  # PropertyFormStep2View
    "1C1AB90CBA510302FC64F7AA"  # CreatePropertyViewModel
    "4F3A7E900A7C961F322C0CAF"  # PropertyFormStep4View
    "769D13A06BCB67568894BA9A"  # PropertyFormStep5View
    "9716B554FA106365A0D78D37"  # CreatePropertyView
    "99701DC4F273EDBEC158A66B"  # PropertyFormStep3View
    "B7BE63EEBB49886719C014EF"  # PropertyFormStep1View
    "13354D2AC59EA9EB28EA3B25"  # PropertyFormStep1View ref
    "1AC5FF523979098EF57600D3"  # PropertyFormStep3View ref
    "2C7FB18E1B6816DED3A73BF5"  # PropertyFormStep2View ref
    "A7FA53C26499E4A9E657BA85"  # PropertyFormStep4View ref
    "B2A693065E61360B580952AD"  # PropertyFormStep5View ref
    "B90B0E73148913A0B7891FC2"  # CreatePropertyViewModel ref
    "C13368F22C33438BDFD6EE22"  # CreatePropertyView ref
)

# Créer un fichier temporaire
TEMP_FILE="${PROJECT_FILE}.tmp"
cp "$PROJECT_FILE" "$TEMP_FILE"

# Supprimer toutes les lignes contenant ces UUIDs
for uuid in "${UUIDS_TO_REMOVE[@]}"; do
    echo "🗑️  Suppression des références à $uuid"
    sed -i.bak "/$uuid/d" "$TEMP_FILE"
done

# Nettoyer les .bak créés par sed
rm -f "${TEMP_FILE}.bak"

# Remplacer le fichier original
mv "$TEMP_FILE" "$PROJECT_FILE"

echo ""
echo "✅ Nettoyage terminé!"
echo "📊 Sauvegarde disponible: $BACKUP_FILE"
echo ""
echo "🚀 Prochaines étapes:"
echo "   1. Ouvrir Xcode: open EasyCo.xcodeproj"
echo "   2. Clean: Cmd+Shift+K"
echo "   3. Build: Cmd+B"
