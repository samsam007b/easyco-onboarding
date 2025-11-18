#!/usr/bin/env python3
"""
Script pour ajouter les nouveaux fichiers du workstream RESIDENT au projet Xcode
"""

import sys
import os
import uuid

# Fichiers à ajouter au projet
NEW_FILES = [
    # Modèles
    ("EasyCo/Models/Household.swift", "Models"),
    ("EasyCo/Models/Lease.swift", "Models"),
    ("EasyCo/Models/ResidentTask.swift", "Models"),
    ("EasyCo/Models/Expense.swift", "Models"),
    ("EasyCo/Models/Event.swift", "Models"),

    # Features Resident
    ("EasyCo/Features/Resident/ResidentHubViewModel.swift", "Features/Resident"),
]

def generate_uuid():
    """Génère un UUID au format Xcode (24 caractères hex en majuscules)"""
    return uuid.uuid4().hex[:24].upper()

def add_files_to_xcode(pbxproj_path):
    """Ajoute les fichiers au projet Xcode"""

    # Lire le fichier project.pbxproj
    with open(pbxproj_path, 'r', encoding='utf-8') as f:
        content = f.read()

    print(f"📖 Lecture du fichier {pbxproj_path}")
    print(f"   Taille: {len(content)} caractères")

    # Générer les UUIDs pour chaque fichier
    file_refs = {}
    build_files = {}

    for file_path, group in NEW_FILES:
        file_name = os.path.basename(file_path)

        # Vérifier si le fichier existe déjà dans le projet
        if file_name in content:
            print(f"⚠️  {file_name} existe déjà dans le projet, skip...")
            continue

        file_ref_uuid = generate_uuid()
        build_file_uuid = generate_uuid()

        file_refs[file_name] = {
            'uuid': file_ref_uuid,
            'path': file_path,
            'group': group
        }
        build_files[file_name] = build_file_uuid

        print(f"✅ {file_name}")
        print(f"   FileRef UUID: {file_ref_uuid}")
        print(f"   BuildFile UUID: {build_file_uuid}")

    if not file_refs:
        print("\n✅ Tous les fichiers sont déjà dans le projet!")
        return

    print(f"\n📝 Ajout de {len(file_refs)} fichiers au projet...")

    # Trouver la section PBXFileReference
    pbx_file_ref_section = content.find("/* Begin PBXFileReference section */")
    if pbx_file_ref_section == -1:
        print("❌ Section PBXFileReference non trouvée!")
        return

    # Trouver la fin de la section
    pbx_file_ref_end = content.find("/* End PBXFileReference section */", pbx_file_ref_section)

    # Construire les nouvelles entrées PBXFileReference
    new_file_refs = ""
    for file_name, info in file_refs.items():
        new_file_refs += f"\t\t{info['uuid']} /* {file_name} */ = {{isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = {file_name}; sourceTree = \"<group>\"; }};\n"

    # Insérer les nouvelles FileReferences
    content = content[:pbx_file_ref_end] + new_file_refs + content[pbx_file_ref_end:]

    # Trouver la section PBXBuildFile
    pbx_build_file_section = content.find("/* Begin PBXBuildFile section */")
    if pbx_build_file_section == -1:
        print("❌ Section PBXBuildFile non trouvée!")
        return

    pbx_build_file_end = content.find("/* End PBXBuildFile section */", pbx_build_file_section)

    # Construire les nouvelles entrées PBXBuildFile
    new_build_files = ""
    for file_name, build_uuid in build_files.items():
        file_ref_uuid = file_refs[file_name]['uuid']
        new_build_files += f"\t\t{build_uuid} /* {file_name} in Sources */ = {{isa = PBXBuildFile; fileRef = {file_ref_uuid} /* {file_name} */; }};\n"

    # Insérer les nouvelles BuildFiles
    content = content[:pbx_build_file_end] + new_build_files + content[pbx_build_file_end:]

    # Trouver la section PBXSourcesBuildPhase et ajouter les fichiers
    sources_build_phase = content.find("/* Sources */,")
    if sources_build_phase != -1:
        # Chercher la section files = (
        files_section_start = content.find("files = (", sources_build_phase - 500)
        if files_section_start != -1:
            files_section_end = content.find(");", files_section_start)

            # Construire la liste des fichiers à ajouter
            new_sources = ""
            for file_name, build_uuid in build_files.items():
                new_sources += f"\t\t\t\t{build_uuid} /* {file_name} in Sources */,\n"

            # Insérer avant le );
            content = content[:files_section_end] + new_sources + content[files_section_end:]

    # Sauvegarder le fichier modifié
    with open(pbxproj_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"\n✅ Fichier {pbxproj_path} mis à jour avec succès!")
    print(f"   {len(file_refs)} nouveaux fichiers ajoutés")

def main():
    # Chemin vers le projet Xcode
    project_path = "/Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/EasyCo/EasyCo.xcodeproj/project.pbxproj"

    if not os.path.exists(project_path):
        print(f"❌ Fichier projet non trouvé: {project_path}")
        sys.exit(1)

    # Créer une sauvegarde
    backup_path = project_path + ".backup." + str(int(os.path.getmtime(project_path)))

    print("🔄 Création d'une sauvegarde...")
    with open(project_path, 'r') as src, open(backup_path, 'w') as dst:
        dst.write(src.read())
    print(f"✅ Sauvegarde créée: {backup_path}")

    print("\n" + "="*60)
    print("🚀 Ajout des fichiers RESIDENT au projet Xcode")
    print("="*60 + "\n")

    try:
        add_files_to_xcode(project_path)
        print("\n✅ Opération terminée avec succès!")
        print("\n📱 Prochaines étapes:")
        print("   1. Ouvrez Xcode: open EasyCo.xcodeproj")
        print("   2. Vérifiez que les fichiers apparaissent dans le navigator")
        print("   3. Build le projet: Cmd+B")
        print("   4. Run sur simulateur: Cmd+R")
    except Exception as e:
        print(f"\n❌ Erreur: {e}")
        print(f"   Restauration de la sauvegarde...")
        with open(backup_path, 'r') as src, open(project_path, 'w') as dst:
            dst.write(src.read())
        print("   ✅ Sauvegarde restaurée")
        sys.exit(1)

if __name__ == "__main__":
    main()
