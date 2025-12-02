#!/usr/bin/env python3
"""
Fix incorrect file paths in project.pbxproj
The auto_add_to_xcode.py script added files with wrong paths (missing subdirectories)
This script corrects all file paths to their actual locations
"""

import re
from pathlib import Path

def fix_file_paths():
    """Fix file paths in project.pbxproj to match actual file locations"""

    pbxproj_path = Path("EasyCo.xcodeproj/project.pbxproj")

    if not pbxproj_path.exists():
        print(f"❌ Error: {pbxproj_path} not found!")
        return False

    # Map of incorrect filename → correct relative path from EasyCo/
    file_corrections = {
        "AppError.swift": "Core/Errors/AppError.swift",
        "APIClient.swift": "Core/Network/APIClient.swift",
        "AuthService.swift": "Core/Services/AuthService.swift",
        "PropertyService.swift": "Core/Services/PropertyService.swift",
        "NotificationService.swift": "Core/Services/NotificationService.swift",
        "PushNotificationService.swift": "Core/Services/PushNotificationService.swift",
        "AlertsManager.swift": "Core/Services/AlertsManager.swift",
        "PropertyComparisonManager.swift": "Core/Services/PropertyComparisonManager.swift",
        "WebSocketManager.swift": "Core/Services/WebSocketManager.swift",
        "SupabaseClient.swift": "Core/Services/SupabaseClient.swift",
        "TranslationSections.swift": "Core/i18n/TranslationSections.swift",
        "AnimationPresets.swift": "Core/DesignSystem/AnimationPresets.swift",
        "HapticManager.swift": "Core/DesignSystem/HapticManager.swift",
        "Match.swift": "Models/Match.swift",
        "DashboardData.swift": "Models/DashboardData.swift",
        "MatchFilters.swift": "Models/MatchFilters.swift",
        "PropertyFilters.swift": "Models/PropertyFilters.swift",
    }

    # Read project file
    with open(pbxproj_path, 'r') as f:
        content = f.read()

    original_content = content
    fixes_made = []

    print("🔧 Fixing file paths in project.pbxproj...\n")

    for filename, correct_path in file_corrections.items():
        # Verify file exists on disk
        full_path = Path("EasyCo") / correct_path
        if not full_path.exists():
            print(f"  ⚠️  {filename} - file not found at {correct_path}")
            continue

        # Pattern to find PBXFileReference entries with just the filename
        # Example: ABC123 /* AppError.swift */ = {isa = PBXFileReference; ... path = AppError.swift; ...};
        pattern = rf'(\w{{24}}) /\* {re.escape(filename)} \*/ = \{{isa = PBXFileReference; ([^}}]+) path = {re.escape(filename)};'

        # Check if the incorrect pattern exists
        matches = list(re.finditer(pattern, content))

        if not matches:
            print(f"  ⏭️  {filename} - already has correct path or not found")
            continue

        for match in matches:
            uuid = match.group(1)
            properties = match.group(2)

            # Replace with correct path
            old_entry = match.group(0)
            new_entry = f'{uuid} /* {filename} */ = {{isa = PBXFileReference; {properties} path = {correct_path}; sourceTree = "<group>";'

            content = content.replace(old_entry, new_entry)
            fixes_made.append(filename)
            print(f"  ✅ {filename} → {correct_path}")

    # Only write if we made changes
    if content != original_content:
        # Backup original
        backup_path = pbxproj_path.with_suffix('.pbxproj.backup2')
        with open(backup_path, 'w') as f:
            f.write(original_content)
        print(f"\n📦 Backup created: {backup_path}")

        # Write modified project
        with open(pbxproj_path, 'w') as f:
            f.write(content)

        print(f"\n✅ Successfully fixed {len(fixes_made)} file paths!")
        print(f"\nFixed files:")
        for filename in fixes_made:
            print(f"  • {filename}")

        return True
    else:
        print("\n⏭️  No file paths to fix - all paths are correct")
        return False

if __name__ == '__main__':
    print("=" * 70)
    print("FIX FILE PATHS IN XCODE PROJECT")
    print("=" * 70)
    print()

    success = fix_file_paths()

    if success:
        print("\n" + "=" * 70)
        print("✅ DONE! File paths corrected in project.pbxproj")
        print("=" * 70)
    else:
        print("\n" + "=" * 70)
        print("⚠️  No changes made to project")
        print("=" * 70)
