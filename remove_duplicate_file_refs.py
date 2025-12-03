#!/usr/bin/env python3
"""
Remove duplicate PBXFileReference entries for the same filename
Keep only the one with the full path (e.g., EasyCo/Models/Match.swift)
Remove the one with just the filename (e.g., Match.swift)
"""

import re
import shutil
from collections import defaultdict

def main():
    pbxproj_path = "EasyCoiOS-Clean/EasyCo/EasyCo.xcodeproj/project.pbxproj"

    # Create backup
    backup_path = pbxproj_path + ".backup-remove-dups"
    shutil.copy2(pbxproj_path, backup_path)
    print(f"✅ Created backup: {backup_path.split('/')[-1]}")
    print()

    with open(pbxproj_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # First pass: Find all PBXFileReference entries and group by filename
    file_refs = {}  # UUID -> {filename, path, line_index}
    in_file_ref_section = False

    for i, line in enumerate(lines):
        if '/* Begin PBXFileReference section */' in line:
            in_file_ref_section = True
        elif '/* End PBXFileReference section */' in line:
            in_file_ref_section = False
        elif in_file_ref_section and 'isa = PBXFileReference' in line:
            # Parse: UUID /* filename */ = {isa = PBXFileReference; ... path = ...; ...}
            match = re.search(r'^\s*([A-F0-9]+)\s*/\*\s*(.+?)\s*\*/', line)
            if match:
                uuid = match.group(1)
                filename = match.group(2)

                # Extract path from this line or next lines
                path_match = re.search(r'path\s*=\s*([^;]+);', line)
                if path_match:
                    path = path_match.group(1).strip().strip('"')
                    file_refs[uuid] = {
                        'filename': filename,
                        'path': path,
                        'line_index': i
                    }

    # Second pass: Group by filename and find duplicates
    filename_groups = defaultdict(list)
    for uuid, info in file_refs.items():
        filename_groups[info['filename']].append((uuid, info))

    # Third pass: For each filename with duplicates, keep the one with the longest/most specific path
    uuids_to_remove = set()

    for filename, refs in filename_groups.items():
        if len(refs) > 1:
            # Sort by path length (descending) - keep the longest path
            refs_sorted = sorted(refs, key=lambda x: len(x[1]['path']), reverse=True)

            # Keep the first (longest path), remove others
            keep_uuid = refs_sorted[0][0]
            keep_path = refs_sorted[0][1]['path']

            print(f"📁 {filename}:")
            print(f"   ✅ KEEP: {keep_uuid} (path: {keep_path})")

            for uuid, info in refs_sorted[1:]:
                uuids_to_remove.add(uuid)
                print(f"   ❌ REMOVE: {uuid} (path: {info['path']})")
            print()

    print(f"🗑️  Removing {len(uuids_to_remove)} duplicate file references...")
    print()

    # Fourth pass: Remove all lines containing the UUIDs to remove
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
    print(f"💡 Next step: Open Xcode and build the project")

if __name__ == "__main__":
    main()
