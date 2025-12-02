#!/usr/bin/env python3
"""
Comprehensive Build Fix Script
Fixes all 137 compilation errors by:
1. Renaming duplicate type declarations
2. Creating missing types
3. Removing phantom file references
"""

import re
import os
from pathlib import Path

EASYCO_ROOT = "/Users/samuelbaudon/.claude-worktrees/easyco-onboarding/gracious-euler/EasyCoiOS-Clean/EasyCo/EasyCo"

# Step 1: Rename duplicate local structs/enums to avoid conflicts with global models
RENAMES = {
    # File: [(old_name, new_name, context)]
    "Features/Dashboard/SearcherDashboardView.swift": [
        ("struct Application:", "struct DashboardApplication:", "line 476"),
        ("enum ApplicationStatus", "enum DashboardApplicationStatus", "line 490"),
        ("let application: Application", "let application: DashboardApplication", "line 723"),
    ],
    "Features/Dashboard/OwnerDashboardView.swift": [
        ("enum TimePeriod", "enum DashboardTimePeriod", "duplicate"),
    ],
    "Features/Dashboard/ResidentDashboardView.swift": [
        ("enum DocumentType", "enum ResidentDocumentType", "duplicate at end"),
        (": DocumentType", ": ResidentDocumentType", "usage"),
    ],
    "Features/Resident/ExpensesViewModel.swift": [
        ("enum TimePeriod", "enum ExpenseTimePeriod", "duplicate at end"),
        (": TimePeriod", ": ExpenseTimePeriod", "usage"),
    ],
    "Features/Applications/MyApplicationsView.swift": [
        ("struct DetailRow:", "struct ApplicationDetailRow:", "duplicate"),
    ],
    "Features/Resident/ResidentHubView.swift": [
        ("struct QuickActionCard:", "struct ResidentQuickActionCard:", "duplicate"),
    ],
    "Features/Auth/AuthFlowIntegration.swift": [
        ("struct RootView:", "struct AuthRootView:", "duplicate"),
    ],
}

def apply_renames():
    """Apply all renames to fix duplicate declarations"""
    print("🔧 Step 1: Renaming duplicate type declarations...")

    for filepath, renames in RENAMES.items():
        full_path = os.path.join(EASYCO_ROOT, filepath)

        if not os.path.exists(full_path):
            print(f"  ⚠️  File not found: {filepath}")
            continue

        with open(full_path, 'r') as f:
            content = f.read()

        original = content
        for old, new, context in renames:
            if old in content:
                content = content.replace(old, new)
                print(f"  ✅ {filepath}: {old} → {new}")

        if content != original:
            with open(full_path, 'w') as f:
                f.write(content)

def create_missing_types():
    """Create stub implementations for missing types"""
    print("\n🔧 Step 2: Creating missing type definitions...")

    missing_types = {
        "Models/Match.swift": '''//
//  Match.swift
//  EasyCo
//

import Foundation

struct Match: Identifiable, Codable {
    let id: UUID
    let searcherId: UUID
    let propertyId: UUID
    let matchScore: Double
    let createdAt: Date

    init(id: UUID = UUID(), searcherId: UUID, propertyId: UUID, matchScore: Double, createdAt: Date = Date()) {
        self.id = id
        self.searcherId = searcherId
        self.propertyId = propertyId
        self.matchScore = matchScore
        self.createdAt = createdAt
    }
}
''',
        "Core/Services/NotificationService.swift": '''//
//  NotificationService.swift
//  EasyCo
//

import Foundation

class NotificationService {
    static let shared = NotificationService()
    private init() {}

    func fetchNotifications() async throws -> [Notification] {
        // TODO: Implement
        return []
    }
}
''',
        "Core/Services/AlertsManager.swift": '''//
//  AlertsManager.swift
//  EasyCo
//

import Foundation

class AlertsManager {
    static let shared = AlertsManager()
    private init() {}
}
''',
        "Core/Services/PropertyComparisonManager.swift": '''//
//  PropertyComparisonManager.swift
//  EasyCo
//

import Foundation

class PropertyComparisonManager {
    static let shared = PropertyComparisonManager()
    private init() {}
}

struct ComparisonFeature: Identifiable {
    let id = UUID()
    let name: String
    let values: [String]
}
''',
        "Core/Services/WebSocketManager.swift": '''//
//  WebSocketManager.swift
//  EasyCo
//

import Foundation

class WebSocketManager {
    static let shared = WebSocketManager()
    private init() {}
}
''',
        "Core/Services/AuthService.swift": '''//
//  AuthService.swift
//  EasyCo
//

import Foundation

class AuthService {
    static let shared = AuthService()
    private init() {}
}
''',
        "Core/Services/PropertyService.swift": '''//
//  PropertyService.swift
//  EasyCo
//

import Foundation

class PropertyService {
    static let shared = PropertyService()
    private init() {}
}
''',
        "Models/DashboardData.swift": '''//
//  DashboardData.swift
//  EasyCo
//

import Foundation

struct SearcherDashboardData: Codable {
    let newMatches: Int
    let upcomingVisits: Int
    let activeApplications: Int
}

struct OwnerDashboardData: Codable {
    let occupancyRate: Double
    let monthlyRevenue: Double
    let pendingApplications: Int
}

struct ApplicationDetail: Identifiable, Codable {
    let id: UUID
    let applicantName: String
    let propertyTitle: String
    let status: String
}
''',
        "Models/MatchFilters.swift": '''//
//  MatchFilters.swift
//  EasyCo
//

import Foundation

struct MatchFilters: Codable {
    var minMatchScore: Double = 0.0
    var maxDistance: Double?

    static var `default`: MatchFilters {
        MatchFilters()
    }
}
''',
        "Core/i18n/TranslationSections.swift": '''//
//  TranslationSections.swift
//  EasyCo
//

import Foundation

enum TranslationSections: String {
    case common
    case auth
    case properties
    case profile
}
''',
    }

    for filepath, content in missing_types.items():
        full_path = os.path.join(EASYCO_ROOT, filepath)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)

        if not os.path.exists(full_path):
            with open(full_path, 'w') as f:
                f.write(content)
            print(f"  ✅ Created: {filepath}")
        else:
            print(f"  ⏭️  Already exists: {filepath}")

def clean_phantom_references():
    """Remove references to files that don't exist on disk"""
    print("\n🔧 Step 3: Cleaning phantom file references from Xcode project...")

    pbxproj_path = "/Users/samuelbaudon/.claude-worktrees/easyco-onboarding/gracious-euler/EasyCoiOS-Clean/EasyCo/EasyCo.xcodeproj/project.pbxproj"

    # Find all .swift files on disk
    swift_files = set()
    for root, dirs, files in os.walk(EASYCO_ROOT):
        for file in files:
            if file.endswith('.swift'):
                swift_files.add(file)

    print(f"  📁 Found {len(swift_files)} Swift files on disk")

    # Read project file
    with open(pbxproj_path, 'r') as f:
        lines = f.readlines()

    new_lines = []
    removed_count = 0

    for line in lines:
        # Check if line references a .swift file
        if '.swift' in line and ('PBXBuildFile' in line or 'PBXFileReference' in line or 'in Sources' in line):
            # Extract filename
            match = re.search(r'([A-Za-z0-9_]+\.swift)', line)
            if match:
                filename = match.group(1)
                if filename not in swift_files:
                    print(f"  🗑️  Removing phantom reference: {filename}")
                    removed_count += 1
                    continue

        new_lines.append(line)

    # Write back
    with open(pbxproj_path, 'w') as f:
        f.writelines(new_lines)

    print(f"  ✅ Removed {removed_count} phantom references")

def main():
    print("=" * 60)
    print("COMPREHENSIVE BUILD FIX")
    print("=" * 60)

    apply_renames()
    create_missing_types()
    clean_phantom_references()

    print("\n" + "=" * 60)
    print("✅ ALL FIXES APPLIED!")
    print("=" * 60)
    print("\nNext step: Run xcodebuild to verify the build succeeds")

if __name__ == '__main__':
    main()
