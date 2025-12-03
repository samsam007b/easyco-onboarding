#!/usr/bin/env python3
"""
Clean duplicate build file entries in project.pbxproj
"""

import re
import shutil
from collections import defaultdict

def main():
    pbxproj_path = "EasyCoiOS-Clean/EasyCo/EasyCo.xcodeproj/project.pbxproj"

    # Create backup
    backup_path = pbxproj_path + ".backup-clean-dups"
    shutil.copy2(pbxproj_path, backup_path)
    print(f"✅ Created backup: {backup_path}")
    print()

    with open(pbxproj_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_lines = content.splitlines()

    # Find PBXBuildFile section
    in_build_section = False
    build_files = {}  # filename -> list of (UUID, full_line)
    file_refs = {}  # UUID -> filename

    # First pass: collect all file references
    for line in original_lines:
        if 'PBXFileReference' in line:
            in_file_ref = True
        elif in_file_ref and 'path = ' in line and '.swift' in line:
            match = re.search(r'path = "(.+?)";', line)
            if match:
                filename = match.group(1)
                # Get UUID from previous lines context
                # We'll need to track this differently

    # Second pass: find PBXBuildFile duplicates by fileRef
    build_file_refs = defaultdict(list)

    for i, line in enumerate(original_lines):
        if '/* Begin PBXBuildFile section */' in line:
            in_build_section = True
        elif '/* End PBXBuildFile section */' in line:
            in_build_section = False
        elif in_build_section and 'fileRef =' in line:
            # Extract UUID and fileRef UUID
            # Format: UUID /* filename */ = {isa = PBXBuildFile; fileRef = UUID2 /* filename */; };
            match = re.search(r'^\s*([A-F0-9]+)\s*/\*\s*(.+?)\s*\*/.*fileRef = ([A-F0-9]+)', line)
            if match:
                build_uuid = match.group(1)
                filename = match.group(2)
                file_ref_uuid = match.group(3)
                build_file_refs[file_ref_uuid].append((build_uuid, i, line))

    # Find duplicates
    duplicates_to_remove = set()
    for file_ref_uuid, entries in build_file_refs.items():
        if len(entries) > 1:
            # Keep first, mark rest for removal
            filename = entries[0][2].split('/*')[1].split('*/')[0].strip()
            print(f"⚠️  Found {len(entries)} duplicates of: {filename}")
            for build_uuid, line_num, line in entries[1:]:
                duplicates_to_remove.add(build_uuid)
                print(f"    Removing: {build_uuid}")

    print()
    print(f"🗑️  Removing {len(duplicates_to_remove)} duplicate build file entries...")

    # Remove duplicates
    cleaned_lines = []
    for line in original_lines:
        # Check if this line contains a UUID we want to remove
        should_remove = False
        for dup_uuid in duplicates_to_remove:
            if re.search(rf'\b{dup_uuid}\b', line):
                should_remove = True
                break

        if not should_remove:
            cleaned_lines.append(line)

    # Write cleaned content
    with open(pbxproj_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(cleaned_lines))

    print(f"✅ Cleaned {len(original_lines) - len(cleaned_lines)} lines")
    print(f"✅ Saved cleaned project.pbxproj")
    print()

if __name__ == "__main__":
    main()
