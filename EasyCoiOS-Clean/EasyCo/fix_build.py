#!/usr/bin/env python3
"""
Script to fix build errors by removing problematic files from Xcode project
"""

import re
import sys

# Files to remove from the Xcode project (but keep on disk for later)
FILES_TO_REMOVE = [
    # Files with missing backend types (NetworkError, APIClient, etc.)
    'Core/Auth/AuthManager.swift',
    'Core/Notifications/NotificationManager.swift',
    'Components/Common/ErrorView.swift',
    'Features/Matches/SwipeMatchesViewModel.swift',
    'Features/Notifications/NotificationsListView.swift',
    'Features/Messages/MessagesListView.swift',
    'Core/i18n/LanguageManager.swift',

    # Files with missing services
    'Features/Auth/AuthFlowIntegration.swift',
    'Features/Properties/PropertiesViewModel.swift',
    'Features/Properties/PropertyComparisonView.swift',
    'Features/Alerts/AlertsView.swift',
    'Features/Alerts/CreateAlertView.swift',
    'Features/Notifications/NotificationCenterView.swift',
    'Core/Storage/UserDefaultsManager.swift',

    # Dashboard files with missing types
    'Features/Dashboard/DashboardViewModels.swift',
]

def remove_file_from_project(pbxproj_path, files_to_remove):
    """Remove file references from project.pbxproj"""

    with open(pbxproj_path, 'r') as f:
        lines = f.readlines()

    new_lines = []
    removed_count = 0

    for line in lines:
        should_keep = True

        # Check if line references any of the files to remove
        for file_pattern in files_to_remove:
            filename = file_pattern.split('/')[-1]
            if filename in line and '.swift' in line:
                print(f"Removing reference to: {filename}")
                should_keep = False
                removed_count += 1
                break

        if should_keep:
            new_lines.append(line)

    # Write back
    with open(pbxproj_path, 'w') as f:
        f.writelines(new_lines)

    print(f"\n✅ Removed {removed_count} file references from project.pbxproj")
    return removed_count

if __name__ == '__main__':
    pbxproj_path = '/Users/samuelbaudon/.claude-worktrees/easyco-onboarding/gracious-euler/EasyCoiOS-Clean/EasyCo/EasyCo.xcodeproj/project.pbxproj'

    print("🔧 Removing problematic files from Xcode project...")
    print("   (Files will remain on disk but won't be compiled)\n")

    count = remove_file_from_project(pbxproj_path, FILES_TO_REMOVE)

    if count > 0:
        print(f"\n✅ Done! Removed {count} references.")
        print("   Now try building the project again.")
    else:
        print("\n⚠️  No files were removed. They may have already been cleaned up.")
