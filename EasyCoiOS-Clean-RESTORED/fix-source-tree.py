#!/usr/bin/env python3
"""
Script pour corriger le sourceTree des fichiers Owner
Le problème : sourceTree = "<group>" fait que Xcode duplique les chemins
La solution : sourceTree = "SOURCE_ROOT" avec chemin absolu depuis la racine
"""

import re

project_file = "EasyCo/EasyCo.xcodeproj/project.pbxproj"

print("🔧 Correction du sourceTree pour les fichiers Owner...")

# Lire le fichier
with open(project_file, 'r') as f:
    content = f.read()

# Backup
with open(project_file + '.backup2', 'w') as f:
    f.write(content)

owner_files = [
    'CreatePropertyView.swift',
    'CreatePropertyViewModel.swift',
    'PropertyFormStep1View.swift',
    'PropertyFormStep2View.swift',
    'PropertyFormStep3View.swift',
    'PropertyFormStep4View.swift',
    'PropertyFormStep5View.swift'
]

# Pour chaque fichier Owner, trouver sa PBXFileReference et corriger le sourceTree
for filename in owner_files:
    # Pattern pour trouver la PBXFileReference
    # On cherche quelque chose comme: ABC123 /* filename */ = {isa = PBXFileReference; ... path = ...; sourceTree = ...; };
    pattern = r'([A-F0-9]{24}) \/\* ' + re.escape(filename) + r' \*\/ = \{([^}]+)\};'

    def fix_reference(match):
        uuid = match.group(1)
        inner_content = match.group(2)

        # Extraire les propriétés actuelles
        properties = {}
        for prop_match in re.finditer(r'(\w+) = ([^;]+);', inner_content):
            properties[prop_match.group(1)] = prop_match.group(2)

        # Corriger le path et sourceTree
        # Le path doit être relatif à EasyCo/ (le dossier contenant le .xcodeproj)
        new_path = f'EasyCo/Features/Owner/{filename}'

        # Reconstruire la référence avec le bon sourceTree
        new_inner = f'isa = PBXFileReference; fileEncoding = 4; lastKnownFileType = sourcecode.swift; path = {new_path}; sourceTree = SOURCE_ROOT; '

        result = f'{uuid} /* {filename} */ = {{{new_inner}}};'
        print(f'  ✅ Corrigé: {filename}')
        return result

    content = re.sub(pattern, fix_reference, content)

# Sauvegarder
with open(project_file, 'w') as f:
    f.write(content)

print("\n🎉 sourceTree corrigé pour tous les fichiers Owner !")
print("\n📋 Prochaines étapes :")
print("  1. Ferme Xcode (⌘Q)")
print("  2. Rouvre: open EasyCo/EasyCo.xcodeproj")
print("  3. Clean Build Folder (⇧⌘K)")
print("  4. Build (⌘B)")
