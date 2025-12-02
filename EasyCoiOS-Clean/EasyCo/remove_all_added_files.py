#!/usr/bin/env python3
"""
Remove all files that were incorrectly added by auto_add_to_xcode.py
This will clean up the project.pbxproj so we can add files manually via Xcode GUI
"""

import re
from pathlib import Path

def remove_auto_added_files():
    """Remove all file references added by the auto_add script"""

    pbxproj_path = Path("EasyCo.xcodeproj/project.pbxproj")

    if not pbxproj_path.exists():
        print(f"❌ Error: {pbxproj_path} not found!")
        return False

    # Files that need to be removed
    files_to_remove = [
        "AppError.swift",
        "APIClient.swift",
        "AuthService.swift",
        "PropertyService.swift",
        "NotificationService.swift",
        "PushNotificationService.swift",
        "AlertsManager.swift",
        "PropertyComparisonManager.swift",
        "WebSocketManager.swift",
        "SupabaseClient.swift",
        "TranslationSections.swift",
        "AnimationPresets.swift",
        "HapticManager.swift",
        "Match.swift",
        "DashboardData.swift",
        "MatchFilters.swift",
        "PropertyFilters.swift",
    ]

    # Read project file
    with open(pbxproj_path, 'r') as f:
        content = f.read()

    original_content = content
    removed_count = 0

    print("🔧 Removing auto-added file references from project.pbxproj...\n")

    # Store UUIDs to remove from build phase
    uuids_to_remove = set()

    for filename in files_to_remove:
        # Find all PBXFileReference entries for this file
        # Pattern: UUID /* filename */ = {isa = PBXFileReference; ... path = ...; ...};
        pattern = rf'(\w{{24}}) /\* {re.escape(filename)} \*/ = \{{isa = PBXFileReference;[^}}]+path = [^;]+; sourceTree = "[^"]+"; \}};'

        matches = list(re.finditer(pattern, content, re.MULTILINE))

        for match in matches:
            uuid = match.group(1)
            uuids_to_remove.add(uuid)

            # Remove the entire line
            content = content.replace(match.group(0) + '\n', '')
            removed_count += 1
            print(f"  ✅ Removed PBXFileReference: {filename} ({uuid})")

        # Find all PBXBuildFile entries for this file
        # Pattern: UUID /* filename in Sources */ = {isa = PBXBuildFile; fileRef = ...};
        pattern = rf'(\w{{24}}) /\* {re.escape(filename)} in Sources \*/ = \{{isa = PBXBuildFile; fileRef = \w{{24}} /\* {re.escape(filename)} \*/; \}};'

        matches = list(re.finditer(pattern, content, re.MULTILINE))

        for match in matches:
            uuid = match.group(1)
            uuids_to_remove.add(uuid)

            # Remove the entire line
            content = content.replace(match.group(0) + '\n', '')
            print(f"  ✅ Removed PBXBuildFile: {filename} ({uuid})")

    # Remove from PBXSourcesBuildPhase
    for uuid in uuids_to_remove:
        # Pattern in build phase: UUID /* filename in Sources */,
        pattern = rf'\t\t\t\t{uuid} /\* [^*]+ \*/,\n'
        matches = list(re.finditer(pattern, content))
        for match in matches:
            content = content.replace(match.group(0), '')
            print(f"  ✅ Removed from build phase: {uuid}")

    # Only write if we made changes
    if content != original_content:
        # Backup original
        backup_path = pbxproj_path.with_suffix('.pbxproj.backup3')
        with open(backup_path, 'w') as f:
            f.write(original_content)
        print(f"\n📦 Backup created: {backup_path}")

        # Write modified project
        with open(pbxproj_path, 'w') as f:
            f.write(content)

        print(f"\n✅ Successfully cleaned project.pbxproj!")
        print(f"   Removed {removed_count} file reference entries")

        return True
    else:
        print("\n⏭️  No entries to remove - project already clean")
        return False

if __name__ == '__main__':
    print("=" * 70)
    print("REMOVE AUTO-ADDED FILES FROM PROJECT")
    print("=" * 70)
    print()

    success = remove_auto_added_files()

    if success:
        print("\n" + "=" * 70)
        print("✅ DONE! Project is clean - ready for manual file addition")
        print("=" * 70)
        print("\nNEXT STEP: Add files manually via Xcode GUI")
        print("This is the safest approach for proper PBXGroup associations")
    else:
        print("\n" + "=" * 70)
        print("⚠️  No changes made to project")
        print("=" * 70)
