#!/usr/bin/env python3
"""
Clean duplicate entries in PBXSourcesBuildPhase section
"""

import re
import shutil
from collections import defaultdict

def main():
    pbxproj_path = "EasyCoiOS-Clean/EasyCo/EasyCo.xcodeproj/project.pbxproj"

    # Create backup
    backup_path = pbxproj_path + ".backup-sources-clean"
    shutil.copy2(pbxproj_path, backup_path)
    print(f"✅ Created backup: {backup_path.split('/')[-1]}")
    print()

    with open(pbxproj_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Find PBXSourcesBuildPhase section
    in_sources_phase = False
    seen_files = set()
    lines_to_remove = set()
    removed_files = defaultdict(int)

    for i, line in enumerate(lines):
        if '/* Begin PBXSourcesBuildPhase section */' in line:
            in_sources_phase = True
            seen_files.clear()  # Reset for each phase
        elif '/* End PBXSourcesBuildPhase section */' in line:
            in_sources_phase = False
        elif in_sources_phase and ' in Sources */' in line:
            # Extract filename
            match = re.search(r'/\*\s*(.+?)\s*in Sources\s*\*/', line)
            if match:
                filename = match.group(1)

                if filename in seen_files:
                    # Duplicate! Mark for removal
                    lines_to_remove.add(i)
                    removed_files[filename] += 1
                else:
                    seen_files.add(filename)

    print(f"🗑️  Found duplicates for {len(removed_files)} files:")
    for filename, count in sorted(removed_files.items()):
        print(f"   - {filename}: {count} duplicate(s)")

    print()
    print(f"🗑️  Removing {len(lines_to_remove)} duplicate entries...")

    # Remove duplicate lines
    cleaned_lines = [line for i, line in enumerate(lines) if i not in lines_to_remove]

    # Write back
    with open(pbxproj_path, 'w', encoding='utf-8') as f:
        f.writelines(cleaned_lines)

    print(f"✅ Removed {len(lines) - len(cleaned_lines)} lines")
    print(f"✅ Saved cleaned project.pbxproj")
    print()

if __name__ == "__main__":
    main()
