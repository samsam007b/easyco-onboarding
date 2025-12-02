#!/usr/bin/env python3
"""
Remove duplicate file references from project.pbxproj
Keep files in proper subdirectories, remove root-level duplicates
"""

import os
import sys

try:
    from pbxproj import XcodeProject
except ImportError:
    print("❌ Error: pbxproj module not installed")
    sys.exit(1)

def main():
    base_path = "/Users/samuelbaudon/.claude-worktrees/easyco-onboarding/gracious-euler/EasyCoiOS-Clean/EasyCo"
    project_path = os.path.join(base_path, "EasyCo.xcodeproj", "project.pbxproj")

    print("🔧 Loading Xcode project...")
    project = XcodeProject.load(project_path)

    # Create backup
    backup_path = project_path + ".backup-remove-dups"
    import shutil
    shutil.copy2(project_path, backup_path)
    print(f"✅ Created backup: {os.path.basename(backup_path)}")
    print()

    # Files to remove (root level duplicates)
    root_duplicates = [
        "EasyCo/AnimationPresets.swift",  # Keep Core/DesignSystem version
        "EasyCo/GlassmorphismModifiers.swift",  # Keep Core/DesignSystem version
        "EasyCo/Supabase/SupabaseClient.swift",  # Keep Core/Services version
        "EasyCo/Supabase/SupabaseRealtime.swift",  # Keep Core/Supabase version
        "EasyCo/Features/Properties/FiltersView.swift",  # Keep Filters/ subdirectory
        "EasyCo/Features/Properties/PropertiesListView.swift",  # Keep List/ subdirectory
        "EasyCo/Features/Properties/PropertyDetailView.swift",  # Keep Detail/ subdirectory
        "EasyCo/Features/Dashboard/SearcherDashboardView.swift",  # Keep Searcher/ subdirectory
    ]

    print("🗑️  Removing duplicate file references...")
    removed_count = 0

    for dup_path in root_duplicates:
        full_path = os.path.join(base_path, dup_path)

        try:
            # Remove file from project (not from disk)
            project.remove_file(full_path, target_name='EasyCo')
            removed_count += 1
            print(f"  ✅ Removed reference: {dup_path}")
        except Exception as e:
            print(f"  ⚠️  Could not remove {dup_path}: {e}")

    print()
    print(f"✅ Removed {removed_count} duplicate references")

    # Save project
    print()
    print("💾 Saving project...")
    project.save()

    print("✅ Project saved successfully!")
    print()

    return 0

if __name__ == "__main__":
    sys.exit(main())
