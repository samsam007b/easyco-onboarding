#!/usr/bin/env python3
"""
Script to clean up Xcode project.pbxproj:
- Remove duplicate file references
- Remove references to deleted files
"""

import re
import os

def cleanup_project(pbxproj_path, easyco_root):
    """Clean up project.pbxproj"""

    with open(pbxproj_path, 'r') as f:
        lines = f.readlines()

    new_lines = []
    removed_count = 0

    # Files that were deleted from disk
    deleted_patterns = [
        'Core/Network/NetworkError.swift',
        'Core/Network/APIClient.swift',
        'Core/Network/APIClient+Messages.swift',
        'Core/Network/APIEndpoint.swift',
        'Core/Auth/GoogleSignInManager.swift',
    ]

    for line in lines:
        should_keep = True

        # Check if line references a deleted file
        for pattern in deleted_patterns:
            if pattern in line:
                print(f"Removing reference to deleted file: {pattern}")
                should_keep = False
                removed_count += 1
                break

        if should_keep:
            new_lines.append(line)

    # Write back
    with open(pbxproj_path, 'w') as f:
        f.writelines(new_lines)

    print(f"✅ Removed {removed_count} references to deleted files")

if __name__ == '__main__':
    pbxproj_path = '/Users/samuelbaudon/.claude-worktrees/easyco-onboarding/gracious-euler/EasyCoiOS-Clean/EasyCo/EasyCo.xcodeproj/project.pbxproj'
    easyco_root = '/Users/samuelbaudon/.claude-worktrees/easyco-onboarding/gracious-euler/EasyCoiOS-Clean/EasyCo/EasyCo'

    print("🔧 Cleaning up Xcode project references...")
    cleanup_project(pbxproj_path, easyco_root)
    print("✅ Done! You can now build the project.")
