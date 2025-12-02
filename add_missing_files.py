#!/usr/bin/env python3
"""
Script to identify and add missing Swift files to Xcode project
"""

import os
import sys
import subprocess

def find_swift_files_on_disk(base_path):
    """Find all .swift files in the EasyCo directory"""
    swift_files = []
    easyco_path = os.path.join(base_path, "EasyCo")

    for root, dirs, files in os.walk(easyco_path):
        # Skip build directories
        if 'build' in root.lower() or '.build' in root.lower():
            continue
        if 'DerivedData' in root:
            continue

        for file in files:
            if file.endswith('.swift'):
                full_path = os.path.join(root, file)
                # Make path relative to base_path
                rel_path = os.path.relpath(full_path, base_path)
                swift_files.append(rel_path)

    return sorted(swift_files)

def find_swift_files_in_pbxproj(pbxproj_path):
    """Find all .swift files referenced in project.pbxproj"""
    swift_files = []

    with open(pbxproj_path, 'r', encoding='utf-8') as f:
        for line in f:
            if '.swift' in line and 'path = ' in line:
                # Extract filename from: path = "Filename.swift";
                start = line.find('path = "') + 8
                end = line.find('";', start)
                if start > 7 and end > start:
                    filename = line[start:end]
                    swift_files.append(filename)

    return sorted(set(swift_files))

def main():
    base_path = "/Users/samuelbaudon/.claude-worktrees/easyco-onboarding/gracious-euler/EasyCoiOS-Clean/EasyCo"
    pbxproj_path = os.path.join(base_path, "EasyCo.xcodeproj", "project.pbxproj")

    print("🔍 Analyzing Xcode project...")
    print()

    # Find files on disk
    disk_files = find_swift_files_on_disk(base_path)
    print(f"✅ Found {len(disk_files)} Swift files on disk")

    # Find files in project
    project_files = find_swift_files_in_pbxproj(pbxproj_path)
    print(f"📦 Found {len(project_files)} Swift files in Xcode project")
    print()

    # Find missing files (on disk but not in project)
    project_basenames = {os.path.basename(f) for f in project_files}
    missing_files = []

    for disk_file in disk_files:
        basename = os.path.basename(disk_file)
        if basename not in project_basenames:
            missing_files.append(disk_file)

    if not missing_files:
        print("✅ All Swift files are already in the Xcode project!")
        return 0

    print(f"⚠️  Found {len(missing_files)} files missing from Xcode project:")
    print()

    for i, file in enumerate(missing_files, 1):
        print(f"{i:2}. {file}")

    print()
    print("📋 Files that need to be added:")
    print()

    # Group by directory
    by_directory = {}
    for file in missing_files:
        dir_name = os.path.dirname(file)
        if dir_name not in by_directory:
            by_directory[dir_name] = []
        by_directory[dir_name].append(os.path.basename(file))

    for directory, files in sorted(by_directory.items()):
        print(f"📁 {directory}/")
        for file in sorted(files):
            print(f"   - {file}")
        print()

    print("=" * 70)
    print("TO ADD THESE FILES TO XCODE:")
    print("=" * 70)
    print()
    print("Option 1 - Manual (Recommended for first time):")
    print("  1. Open EasyCo.xcodeproj in Xcode")
    print("  2. For each directory above, right-click the matching group")
    print("  3. Select 'Add Files to EasyCo...'")
    print("  4. Navigate to the directory and select the files")
    print("  5. ⚠️  IMPORTANT: UNCHECK 'Copy items if needed'")
    print("  6. ✅ IMPORTANT: CHECK 'Add to targets: EasyCo'")
    print()

    return 0

if __name__ == "__main__":
    sys.exit(main())
