#!/usr/bin/env python3
"""
Script pour nettoyer et corriger les références des fichiers Owner dans le projet Xcode
"""

import re
import uuid

project_file = "EasyCo/EasyCo.xcodeproj/project.pbxproj"

# Lire le fichier
with open(project_file, 'r') as f:
    content = f.read()

print("🧹 Nettoyage des anciennes références Owner...")

# Liste des fichiers Owner
owner_files = [
    'CreatePropertyView.swift',
    'CreatePropertyViewModel.swift',
    'PropertyFormStep1View.swift',
    'PropertyFormStep2View.swift',
    'PropertyFormStep3View.swift',
    'PropertyFormStep4View.swift',
    'PropertyFormStep5View.swift'
]

# Trouver tous les UUIDs associés aux fichiers Owner
uuids_to_remove = set()

for filename in owner_files:
    # Trouver les PBXFileReference
    pattern = r'([A-F0-9]{24}) \/\* ' + re.escape(filename) + r' \*\/ = \{[^}]+\};'
    matches = re.finditer(pattern, content)
    for match in matches:
        uuid_ref = match.group(1)
        uuids_to_remove.add(uuid_ref)
        print(f"  🗑️  Trouvé UUID pour {filename}: {uuid_ref}")

# Supprimer toutes les lignes contenant ces UUIDs
print("\n🗑️  Suppression des références...")
lines = content.split('\n')
cleaned_lines = []

for line in lines:
    should_keep = True
    for uuid_ref in uuids_to_remove:
        if uuid_ref in line:
            should_keep = False
            break
    if should_keep:
        cleaned_lines.append(line)

content = '\n'.join(cleaned_lines)

print(f"  ✅ {len(lines) - len(cleaned_lines)} lignes supprimées")

# Générer de nouveaux UUIDs
def generate_uuid():
    return uuid.uuid4().hex[:24].upper()

new_uuids = {filename: generate_uuid() for filename in owner_files}
build_uuids = {filename: generate_uuid() for filename in owner_files}

print("\n✨ Création des nouvelles références...")

# Trouver la section PBXBuildFile
pbx_build_section = re.search(r'\/\* Begin PBXBuildFile section \*\/', content)
if pbx_build_section:
    insert_pos = pbx_build_section.end()

    build_lines = []
    for filename in owner_files:
        file_uuid = new_uuids[filename]
        build_uuid = build_uuids[filename]
        build_lines.append(f"\n\t\t{build_uuid} /* {filename} in Sources */ = {{isa = PBXBuildFile; fileRef = {file_uuid} /* {filename} */; }};")

    content = content[:insert_pos] + ''.join(build_lines) + content[insert_pos:]
    print(f"  ✅ Ajouté {len(owner_files)} entrées PBXBuildFile")

# Trouver la section PBXFileReference
pbx_file_section = re.search(r'\/\* Begin PBXFileReference section \*\/', content)
if pbx_file_section:
    insert_pos = pbx_file_section.end()

    file_lines = []
    for filename in owner_files:
        file_uuid = new_uuids[filename]
        file_lines.append(f"\n\t\t{file_uuid} /* {filename} */ = {{isa = PBXFileReference; fileEncoding = 4; lastKnownFileType = sourcecode.swift; path = {filename}; sourceTree = \"<group>\"; }};")

    content = content[:insert_pos] + ''.join(file_lines) + content[insert_pos:]
    print(f"  ✅ Ajouté {len(owner_files)} entrées PBXFileReference")

# Trouver le groupe Owner
owner_group_pattern = r'([A-F0-9]{24}) \/\* Owner \*\/ = \{[^}]+children = \(\s*([^)]*)\s*\);'
owner_group_match = re.search(owner_group_pattern, content, re.DOTALL)

if owner_group_match:
    owner_group_uuid = owner_group_match.group(1)
    children_content = owner_group_match.group(2)

    # Ajouter les nouveaux fichiers au groupe Owner
    new_children = []
    for filename in owner_files:
        file_uuid = new_uuids[filename]
        new_children.append(f"\n\t\t\t\t{file_uuid} /* {filename} */,")

    # Remplacer les children du groupe Owner
    new_children_str = ''.join(new_children) + '\n\t\t\t'
    content = re.sub(
        r'(' + owner_group_uuid + r' \/\* Owner \*\/ = \{[^}]+children = \(\s*)([^)]*)\s*\);',
        r'\1' + new_children_str + ');',
        content,
        flags=re.DOTALL
    )
    print(f"  ✅ Ajouté {len(owner_files)} fichiers au groupe Owner")
else:
    print("  ⚠️  Groupe Owner non trouvé - devra être créé manuellement")

# Trouver la section PBXSourcesBuildPhase (Compile Sources)
sources_phase_pattern = r'([A-F0-9]{24}) \/\* Sources \*\/ = \{[^}]+files = \(\s*([^)]*)\s*\);'
sources_phase_match = re.search(sources_phase_pattern, content, re.DOTALL)

if sources_phase_match:
    sources_uuid = sources_phase_match.group(1)
    files_content = sources_phase_match.group(2)

    # Ajouter les nouveaux fichiers à la phase de compilation
    new_files = []
    for filename in owner_files:
        build_uuid = build_uuids[filename]
        new_files.append(f"\n\t\t\t\t{build_uuid} /* {filename} in Sources */,")

    new_files_str = ''.join(new_files) + '\n\t\t\t'
    content = re.sub(
        r'(' + sources_uuid + r' \/\* Sources \*\/ = \{[^}]+files = \(\s*)([^)]*)\s*\);',
        r'\1' + new_files_str + r'\2);',
        content,
        flags=re.DOTALL
    )
    print(f"  ✅ Ajouté {len(owner_files)} fichiers à Compile Sources")

# Sauvegarder
with open(project_file, 'w') as f:
    f.write(content)

print("\n🎉 Projet Xcode nettoyé et corrigé avec succès !")
print("\n📋 Prochaines étapes :")
print("  1. Ferme Xcode complètement (⌘Q)")
print("  2. Rouvre le projet: open EasyCo/EasyCo.xcodeproj")
print("  3. Build le projet (⌘B)")
print("\n✅ Les fichiers Owner devraient maintenant compiler correctement !")
