#!/usr/bin/env python3
"""
Simple script to remove duplicate PBXBuildFile entries
"""

import re
import shutil
from collections import defaultdict

def main():
    pbxproj_path = "EasyCoiOS-Clean/EasyCo/EasyCo.xcodeproj/project.pbxproj"

    # Create backup
    backup_path = pbxproj_path + ".backup-simple-clean"
    shutil.copy2(pbxproj_path, backup_path)
    print(f"✅ Created backup: {backup_path.split('/')[-1]}")
    print()

    with open(pbxproj_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Track fileRef occurrences in PBXBuildFile section
    file_refs = defaultdict(list)
    in_build_section = False

    for i, line in enumerate(lines):
        if '/* Begin PBXBuildFile section */' in line:
            in_build_section = True
        elif '/* End PBXBuildFile section */' in line:
            in_build_section = False
        elif in_build_section and 'fileRef =' in line:
            # Extract fileRef UUID
            match = re.search(r'fileRef = ([A-F0-9]+)', line)
            if match:
                file_ref_uuid = match.group(1)
                build_uuid_match = re.search(r'^\s*([A-F0-9]+)\s*/\*', line)
                if build_uuid_match:
                    build_uuid = build_uuid_match.group(1)
                    file_refs[file_ref_uuid].append((i, build_uuid, line.strip()))

    # Find duplicates
    lines_to_remove = set()
    dup_count = 0

    for file_ref_uuid, entries in file_refs.items():
        if len(entries) > 1:
            dup_count += 1
            filename = entries[0][2].split('/*')[1].split('*/')[0].strip() if '/*' in entries[0][2] else 'unknown'
            print(f"📄 {filename}: {len(entries)} occurrences")

            # Keep first, remove rest
            for line_num, build_uuid, line_content in entries[1:]:
                lines_to_remove.add(line_num)
                print(f"   ❌ Remove line {line_num}: ...{build_uuid}...")

    print()
    print(f"🗑️  Removing {len(lines_to_remove)} duplicate lines from {dup_count} files")

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
