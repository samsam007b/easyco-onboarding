#!/usr/bin/env python3
"""
Automated script to add all Swift files to Xcode project using mod-pbxproj
"""

import os
import sys

try:
    from pbxproj import XcodeProject
except ImportError:
    print("❌ Error: pbxproj module not installed")
    print()
    print("Please install it:")
    print("  pip3 install pbxproj")
    sys.exit(1)

def main():
    base_path = "/Users/samuelbaudon/.claude-worktrees/easyco-onboarding/gracious-euler/EasyCoiOS-Clean/EasyCo"
    project_path = os.path.join(base_path, "EasyCo.xcodeproj", "project.pbxproj")

    print("🔧 Loading Xcode project...")
    project = XcodeProject.load(project_path)

    # Create backup
    backup_path = project_path + ".backup-auto-add"
    import shutil
    shutil.copy2(project_path, backup_path)
    print(f"✅ Created backup: {os.path.basename(backup_path)}")
    print()

    # Find all Swift files
    easyco_path = os.path.join(base_path, "EasyCo")
    swift_files = []

    for root, dirs, files in os.walk(easyco_path):
        # Skip build directories
        if 'build' in root.lower() or '.build' in root.lower() or 'DerivedData' in root:
            continue

        for file in files:
            if file.endswith('.swift'):
                full_path = os.path.join(root, file)
                swift_files.append(full_path)

    print(f"📦 Found {len(swift_files)} Swift files to add")
    print()

    # Add files to project
    added_count = 0
    failed_count = 0

    for file_path in sorted(swift_files):
        try:
            # Add file to project
            project.add_file(file_path, parent=None, target_name='EasyCo')
            added_count += 1

            if added_count % 50 == 0:
                print(f"  Progress: {added_count}/{len(swift_files)} files added...")

        except Exception as e:
            failed_count += 1
            print(f"  ⚠️  Failed to add {os.path.basename(file_path)}: {e}")

    print()
    print(f"✅ Added {added_count} files successfully")

    if failed_count > 0:
        print(f"⚠️  Failed to add {failed_count} files")

    # Save project
    print()
    print("💾 Saving project...")
    project.save()

    print("✅ Project saved successfully!")
    print()
    print("=" * 70)
    print("NEXT STEPS:")
    print("=" * 70)
    print()
    print("1. Open Xcode and verify the files are there:")
    print(f"   open {os.path.join(base_path, 'EasyCo.xcodeproj')}")
    print()
    print("2. Clean build folder (in Xcode: Product → Clean Build Folder)")
    print()
    print("3. Build the project:")
    print("   cd", base_path)
    print("   xcodebuild -scheme EasyCo -configuration Debug \\")
    print("     -destination 'platform=iOS Simulator,name=iPhone 16 Pro' build")
    print()

    return 0

if __name__ == "__main__":
    sys.exit(main())
