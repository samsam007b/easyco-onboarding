#!/usr/bin/env python3
"""
Remove old root-level file references from project.pbxproj
These are files that were at /EasyCo/File.swift but are now in subdirectories
"""

import re
import shutil

def main():
    pbxproj_path = "EasyCoiOS-Clean/EasyCo/EasyCo.xcodeproj/project.pbxproj"

    # Create backup
    backup_path = pbxproj_path + ".backup-remove-old-refs"
    shutil.copy2(pbxproj_path, backup_path)
    print(f"✅ Created backup: {backup_path.split('/')[-1]}")
    print()

    # Files that should NOT be at root level
    # These are now in subdirectories
    root_files_to_remove = [
        "PropertyFilters.swift",
        "MatchFilters.swift",
        "DashboardData.swift",
        "Match.swift",
        "HapticManager.swift",
        "AnimationPresets.swift",
        "TranslationSections.swift",
        "SupabaseClient.swift",
        "WebSocketManager.swift",
        "PropertyComparisonManager.swift",
        "AlertsManager.swift",
        "PushNotificationService.swift",
        "NotificationService.swift",
        "PropertyService.swift",
        "AuthService.swift",
        "APIClient.swift",
        "AppError.swift",
    ]

    with open(pbxproj_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Find UUIDs of these root-level files in PBXFileReference
    uuids_to_remove = set()
    in_file_ref_section = False

    for i, line in enumerate(lines):
        if '/* Begin PBXFileReference section */' in line:
            in_file_ref_section = True
        elif '/* End PBXFileReference section */' in line:
            in_file_ref_section = False
        elif in_file_ref_section:
            # Look for pattern: UUID /* filename.swift */ = {isa = PBXFileReference; ...path = filename.swift;
            for filename in root_files_to_remove:
                if f'/* {filename} */' in line and f'path = {filename};' in line:
                    # This is a root-level reference (path = filename, not path = subdir/filename)
                    match = re.search(r'^\s*([A-F0-9]+)\s*/\*', line)
                    if match:
                        uuid = match.group(1)
                        uuids_to_remove.add(uuid)
                        print(f"  ❌ Found old root reference: {uuid} /* {filename} */")

    print()
    print(f"🗑️  Removing {len(uuids_to_remove)} old root-level file references...")
    print()

    # Remove all lines containing these UUIDs
    lines_to_remove = set()
    for i, line in enumerate(lines):
        for uuid in uuids_to_remove:
            if re.search(rf'\b{uuid}\b', line):
                lines_to_remove.add(i)
                break

    cleaned_lines = [line for i, line in enumerate(lines) if i not in lines_to_remove]

    # Write back
    with open(pbxproj_path, 'w', encoding='utf-8') as f:
        f.writelines(cleaned_lines)

    print(f"✅ Removed {len(lines) - len(cleaned_lines)} lines")
    print(f"✅ Saved cleaned project.pbxproj")
    print()

if __name__ == "__main__":
    main()
