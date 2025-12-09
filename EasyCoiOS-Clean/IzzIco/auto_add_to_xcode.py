#!/usr/bin/env python3
"""
Auto-Add Files to Xcode Project
Automatically adds new Swift files to project.pbxproj with proper UUIDs and references
"""

import re
import uuid
from pathlib import Path

def generate_xcode_uuid():
    """Generate a 24-character hex UUID like Xcode uses"""
    return uuid.uuid4().hex[:24].upper()

def add_files_to_pbxproj():
    """Add new Swift files to the Xcode project"""

    pbxproj_path = Path("EasyCo.xcodeproj/project.pbxproj")

    if not pbxproj_path.exists():
        print(f"❌ Error: {pbxproj_path} not found!")
        return False

    # Files to add: (relative_path, filename, group_path)
    files_to_add = [
        ("EasyCo/Core/Errors/AppError.swift", "AppError.swift", "Core/Errors"),
        ("EasyCo/Core/Network/APIClient.swift", "APIClient.swift", "Core/Network"),
        ("EasyCo/Core/Services/AuthService.swift", "AuthService.swift", "Core/Services"),
        ("EasyCo/Core/Services/PropertyService.swift", "PropertyService.swift", "Core/Services"),
        ("EasyCo/Core/Services/NotificationService.swift", "NotificationService.swift", "Core/Services"),
        ("EasyCo/Core/Services/PushNotificationService.swift", "PushNotificationService.swift", "Core/Services"),
        ("EasyCo/Core/Services/AlertsManager.swift", "AlertsManager.swift", "Core/Services"),
        ("EasyCo/Core/Services/PropertyComparisonManager.swift", "PropertyComparisonManager.swift", "Core/Services"),
        ("EasyCo/Core/Services/WebSocketManager.swift", "WebSocketManager.swift", "Core/Services"),
        ("EasyCo/Core/Services/SupabaseClient.swift", "SupabaseClient.swift", "Core/Services"),
        ("EasyCo/Core/i18n/TranslationSections.swift", "TranslationSections.swift", "Core/i18n"),
        ("EasyCo/Core/DesignSystem/AnimationPresets.swift", "AnimationPresets.swift", "Core/DesignSystem"),
        ("EasyCo/Core/DesignSystem/HapticManager.swift", "HapticManager.swift", "Core/DesignSystem"),
        ("EasyCo/Models/Match.swift", "Match.swift", "Models"),
        ("EasyCo/Models/DashboardData.swift", "DashboardData.swift", "Models"),
        ("EasyCo/Models/MatchFilters.swift", "MatchFilters.swift", "Models"),
        ("EasyCo/Models/PropertyFilters.swift", "PropertyFilters.swift", "Models"),
    ]

    # Read the project file
    with open(pbxproj_path, 'r') as f:
        content = f.read()

    original_content = content

    # Track what we add
    file_refs_added = []
    build_files_added = []

    print("🔧 Adding files to Xcode project...\n")

    for rel_path, filename, group in files_to_add:
        # Check if file already exists in project
        if filename in content and f'/* {filename} */' in content:
            print(f"  ⏭️  {filename} - already in project")
            continue

        # Check if file exists on disk
        file_path = Path(rel_path)
        if not file_path.exists():
            print(f"  ❌ {filename} - file not found on disk!")
            continue

        # Generate UUIDs for this file
        file_ref_uuid = generate_xcode_uuid()
        build_file_uuid = generate_xcode_uuid()

        # Create PBXFileReference entry (use full relative path from EasyCo/ folder)
        # Extract path relative to EasyCo/ folder
        rel_from_easyco = rel_path.replace("EasyCo/", "")
        file_ref_entry = f'\t\t{file_ref_uuid} /* {filename} */ = {{isa = PBXFileReference; fileEncoding = 4; lastKnownFileType = sourcecode.swift; path = {filename}; sourceTree = "<group>"; }};\n'

        # Create PBXBuildFile entry
        build_file_entry = f'\t\t{build_file_uuid} /* {filename} in Sources */ = {{isa = PBXBuildFile; fileRef = {file_ref_uuid} /* {filename} */; }};\n'

        # Find the PBXFileReference section and add our entry
        file_ref_section_start = content.find('/* Begin PBXFileReference section */')
        if file_ref_section_start == -1:
            print(f"  ❌ Could not find PBXFileReference section!")
            continue

        # Insert after the section marker
        insert_pos = content.find('\n', file_ref_section_start) + 1
        content = content[:insert_pos] + file_ref_entry + content[insert_pos:]

        # Find the PBXBuildFile section and add our entry
        build_file_section_start = content.find('/* Begin PBXBuildFile section */')
        if build_file_section_start == -1:
            print(f"  ❌ Could not find PBXBuildFile section!")
            continue

        insert_pos = content.find('\n', build_file_section_start) + 1
        content = content[:insert_pos] + build_file_entry + content[insert_pos:]

        # Add to PBXSourcesBuildPhase (the files that get compiled)
        sources_section = content.find('/* Begin PBXSourcesBuildPhase section */')
        if sources_section != -1:
            # Find the files = ( array within this section
            files_array_start = content.find('files = (', sources_section)
            if files_array_start != -1:
                insert_pos = content.find('\n', files_array_start) + 1
                source_entry = f'\t\t\t\t{build_file_uuid} /* {filename} in Sources */,\n'
                content = content[:insert_pos] + source_entry + content[insert_pos:]

        file_refs_added.append(filename)
        print(f"  ✅ {filename} - added to project")

    # Only write if we made changes
    if content != original_content:
        # Backup original
        backup_path = pbxproj_path.with_suffix('.pbxproj.backup')
        with open(backup_path, 'w') as f:
            f.write(original_content)
        print(f"\n📦 Backup created: {backup_path}")

        # Write modified project
        with open(pbxproj_path, 'w') as f:
            f.write(content)

        print(f"\n✅ Successfully added {len(file_refs_added)} files to Xcode project!")
        print(f"\nAdded files:")
        for filename in file_refs_added:
            print(f"  • {filename}")

        print(f"\n⚠️  IMPORTANT: Close and reopen Xcode for changes to take effect")
        print(f"   If anything goes wrong, restore from: {backup_path}")

        return True
    else:
        print("\n⏭️  No new files to add - all files already in project")
        return False

if __name__ == '__main__':
    print("=" * 70)
    print("AUTO-ADD FILES TO XCODE PROJECT")
    print("=" * 70)
    print()

    success = add_files_to_pbxproj()

    if success:
        print("\n" + "=" * 70)
        print("✅ DONE! Now close Xcode and reopen it, then build the project")
        print("=" * 70)
    else:
        print("\n" + "=" * 70)
        print("⚠️  No changes made to project")
        print("=" * 70)
