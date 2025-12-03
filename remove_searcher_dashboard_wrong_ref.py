#!/usr/bin/env python3
"""
Remove wrong reference to SearcherDashboardView.swift in Features/Dashboard/
The correct location is Features/Searcher/
"""

import re
import shutil

def main():
    pbxproj_path = "EasyCoiOS-Clean/EasyCo/EasyCo.xcodeproj/project.pbxproj"

    # Create backup
    backup_path = pbxproj_path + ".backup-searcher-fix"
    shutil.copy2(pbxproj_path, backup_path)
    print(f"✅ Created backup: {backup_path.split('/')[-1]}")
    print()

    with open(pbxproj_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Find UUID for Features/Dashboard/SearcherDashboardView.swift
    uuids_to_remove = set()
    in_file_ref_section = False

    for i, line in enumerate(lines):
        if '/* Begin PBXFileReference section */' in line:
            in_file_ref_section = True
        elif '/* End PBXFileReference section */' in line:
            in_file_ref_section = False
        elif in_file_ref_section:
            # Look for SearcherDashboardView.swift with path containing Dashboard
            if 'SearcherDashboardView.swift' in line and 'Dashboard' in line and 'path =' in line:
                # Check if it's the wrong path (Features/Dashboard instead of Features/Searcher)
                if 'Dashboard/SearcherDashboardView.swift' in line or ('Dashboard' in line and 'Searcher' not in line.replace('SearcherDashboardView', '')):
                    match = re.search(r'^\s*([A-F0-9]+)\s*/\*', line)
                    if match:
                        uuid = match.group(1)
                        uuids_to_remove.add(uuid)
                        print(f"  ❌ Found wrong reference: {uuid} /* SearcherDashboardView.swift in Dashboard */")

    print()
    print(f"🗑️  Removing {len(uuids_to_remove)} wrong SearcherDashboardView references...")
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
