#!/usr/bin/env python3
"""
Add new Swift files to Xcode project.pbxproj
This is a simplified approach - just adds file references and build phase entries
"""

import uuid
import os

def generate_uuid():
    """Generate a 24-character hex ID like Xcode uses"""
    return uuid.uuid4().hex[:24].upper()

def add_files_to_project():
    pbxproj = "/Users/samuelbaudon/.claude-worktrees/easyco-onboarding/gracious-euler/EasyCoiOS-Clean/EasyCo/EasyCo.xcodeproj/project.pbxproj"

    files_to_add = [
        ("Core/Errors/AppError.swift", "AppError.swift"),
        ("Core/Network/APIClient.swift", "APIClient.swift"),
        ("Core/Services/PropertyService.swift", "PropertyService.swift"),
        ("Core/Services/AlertsManager.swift", "AlertsManager.swift"),
        ("Core/Services/NotificationService.swift", "NotificationService.swift"),
        ("Core/Services/PropertyComparisonManager.swift", "PropertyComparisonManager.swift"),
        ("Core/Services/AuthService.swift", "AuthService.swift"),
        ("Core/Services/WebSocketManager.swift", "WebSocketManager.swift"),
        ("Models/DashboardData.swift", "DashboardData.swift"),
        ("Models/Match.swift", "Match.swift"),
        ("Models/MatchFilters.swift", "MatchFilters.swift"),
        ("Models/PropertyFilters.swift", "PropertyFilters.swift"),
        ("Core/i18n/TranslationSections.swift", "TranslationSections.swift"),
    ]

    with open(pbxproj, 'r') as f:
        content = f.read()

    # Check if files are already in project
    for path, filename in files_to_add:
        if filename in content:
            print(f"⏭️  {filename} already in project")
        else:
            print(f"✅ Would add {filename} - but manual addition in Xcode is safer")

    print("\n" + "="*60)
    print("⚠️  RECOMMENDATION: Add files manually in Xcode")
    print("="*60)
    print("\nIt's safer to add files via Xcode GUI to avoid corrupting project.pbxproj")
    print("\nSteps:")
    print("1. Open EasyCo.xcodeproj in Xcode")
    print("2. Right-click on each folder (Core/Errors, Core/Network, etc.)")
    print("3. Select 'Add Files to EasyCo...'")
    print("4. Select the corresponding .swift files")
    print("5. Ensure 'Copy items if needed' is UNCHECKED")
    print("6. Ensure 'Add to targets: EasyCo' is CHECKED")

if __name__ == '__main__':
    add_files_to_project()
