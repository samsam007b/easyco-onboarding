//
//  MigrationCoordinator.swift
//  IzzIco
//
//  Coordonnateur de migration incrémentale vers IzzicoWeb Design System
//  Pattern: Strangler Fig (remplacement progressif avec feature flags)
//  Created on 2026-01-26
//

import Foundation
import SwiftUI

// MARK: - Migration Coordinator

/// Gère la migration progressive des vues vers IzzicoWeb Design System
struct MigrationCoordinator {

    // MARK: - Feature Flags (1 par vue)

    /// Auth & Onboarding
    static var useIzzicoWebLogin: Bool {
        UserDefaults.standard.bool(forKey: "migration.izzicoweb.login")
    }

    static var useIzzicoWebSignup: Bool {
        UserDefaults.standard.bool(forKey: "migration.izzicoweb.signup")
    }

    static var useIzzicoWebForgotPassword: Bool {
        UserDefaults.standard.bool(forKey: "migration.izzicoweb.forgotPassword")
    }

    static var useIzzicoWebRoleSelection: Bool {
        UserDefaults.standard.bool(forKey: "migration.izzicoweb.roleSelection")
    }

    static var useIzzicoWebOnboarding: Bool {
        UserDefaults.standard.bool(forKey: "migration.izzicoweb.onboarding")
    }

    /// Dashboards
    static var useIzzicoWebSearcherDashboard: Bool {
        UserDefaults.standard.bool(forKey: "migration.izzicoweb.searcherDashboard")
    }

    static var useIzzicoWebOwnerDashboard: Bool {
        UserDefaults.standard.bool(forKey: "migration.izzicoweb.ownerDashboard")
    }

    static var useIzzicoWebResidentDashboard: Bool {
        UserDefaults.standard.bool(forKey: "migration.izzicoweb.residentDashboard")
    }

    /// Properties
    static var useIzzicoWebPropertiesList: Bool {
        UserDefaults.standard.bool(forKey: "migration.izzicoweb.propertiesList")
    }

    static var useIzzicoWebPropertyDetail: Bool {
        UserDefaults.standard.bool(forKey: "migration.izzicoweb.propertyDetail")
    }

    /// Messages
    static var useIzzicoWebConversationsList: Bool {
        UserDefaults.standard.bool(forKey: "migration.izzicoweb.conversationsList")
    }

    static var useIzzicoWebChat: Bool {
        UserDefaults.standard.bool(forKey: "migration.izzicoweb.chat")
    }

    /// Profile & Settings
    static var useIzzicoWebProfile: Bool {
        UserDefaults.standard.bool(forKey: "migration.izzicoweb.profile")
    }

    static var useIzzicoWebSettings: Bool {
        UserDefaults.standard.bool(forKey: "migration.izzicoweb.settings")
    }

    // MARK: - Helpers

    /// Activer une feature
    static func enable(_ key: String) {
        UserDefaults.standard.set(true, forKey: "migration.izzicoweb.\(key)")
    }

    /// Désactiver une feature (rollback)
    static func disable(_ key: String) {
        UserDefaults.standard.set(false, forKey: "migration.izzicoweb.\(key)")
    }

    /// Activer toutes les features (mode production)
    static func enableAll() {
        let flags = [
            "login", "signup", "forgotPassword", "roleSelection", "onboarding",
            "searcherDashboard", "ownerDashboard", "residentDashboard",
            "propertiesList", "propertyDetail",
            "conversationsList", "chat",
            "profile", "settings"
        ]

        flags.forEach { enable($0) }
    }

    /// Désactiver toutes les features (mode legacy)
    static func disableAll() {
        let flags = [
            "login", "signup", "forgotPassword", "roleSelection", "onboarding",
            "searcherDashboard", "ownerDashboard", "residentDashboard",
            "propertiesList", "propertyDetail",
            "conversationsList", "chat",
            "profile", "settings"
        ]

        flags.forEach { disable($0) }
    }

    /// Progression de la migration (%)
    static var migrationProgress: Int {
        let total = 14  // Nombre total de vues principales
        let migrated = [
            useIzzicoWebLogin,
            useIzzicoWebSignup,
            useIzzicoWebForgotPassword,
            useIzzicoWebRoleSelection,
            useIzzicoWebOnboarding,
            useIzzicoWebSearcherDashboard,
            useIzzicoWebOwnerDashboard,
            useIzzicoWebResidentDashboard,
            useIzzicoWebPropertiesList,
            useIzzicoWebPropertyDetail,
            useIzzicoWebConversationsList,
            useIzzicoWebChat,
            useIzzicoWebProfile,
            useIzzicoWebSettings
        ].filter { $0 }.count

        return Int((Double(migrated) / Double(total)) * 100)
    }
}

// MARK: - Migration Status View (Debug)

/// Vue de debug pour voir l'état de la migration
struct MigrationStatusView: View {
    var body: some View {
        List {
            Section("Progression") {
                HStack {
                    Text("Migration")
                    Spacer()
                    Text("\(MigrationCoordinator.migrationProgress)%")
                        .bold()
                }
            }

            Section("Auth & Onboarding") {
                FeatureFlagRow(title: "Login", isEnabled: MigrationCoordinator.useIzzicoWebLogin)
                FeatureFlagRow(title: "Signup", isEnabled: MigrationCoordinator.useIzzicoWebSignup)
                FeatureFlagRow(title: "Forgot Password", isEnabled: MigrationCoordinator.useIzzicoWebForgotPassword)
                FeatureFlagRow(title: "Role Selection", isEnabled: MigrationCoordinator.useIzzicoWebRoleSelection)
                FeatureFlagRow(title: "Onboarding", isEnabled: MigrationCoordinator.useIzzicoWebOnboarding)
            }

            Section("Dashboards") {
                FeatureFlagRow(title: "Searcher Dashboard", isEnabled: MigrationCoordinator.useIzzicoWebSearcherDashboard)
                FeatureFlagRow(title: "Owner Dashboard", isEnabled: MigrationCoordinator.useIzzicoWebOwnerDashboard)
                FeatureFlagRow(title: "Resident Dashboard", isEnabled: MigrationCoordinator.useIzzicoWebResidentDashboard)
            }

            Section("Properties") {
                FeatureFlagRow(title: "Properties List", isEnabled: MigrationCoordinator.useIzzicoWebPropertiesList)
                FeatureFlagRow(title: "Property Detail", isEnabled: MigrationCoordinator.useIzzicoWebPropertyDetail)
            }

            Section("Messages") {
                FeatureFlagRow(title: "Conversations List", isEnabled: MigrationCoordinator.useIzzicoWebConversationsList)
                FeatureFlagRow(title: "Chat", isEnabled: MigrationCoordinator.useIzzicoWebChat)
            }

            Section("Profile") {
                FeatureFlagRow(title: "Profile", isEnabled: MigrationCoordinator.useIzzicoWebProfile)
                FeatureFlagRow(title: "Settings", isEnabled: MigrationCoordinator.useIzzicoWebSettings)
            }

            Section("Actions") {
                Button("Enable All") {
                    MigrationCoordinator.enableAll()
                }

                Button("Disable All") {
                    MigrationCoordinator.disableAll()
                }
                .foregroundColor(.red)
            }
        }
        .navigationTitle("Migration Status")
    }
}

struct FeatureFlagRow: View {
    let title: String
    let isEnabled: Bool

    var body: some View {
        HStack {
            Text(title)
            Spacer()
            Image(systemName: isEnabled ? "checkmark.circle.fill" : "circle")
                .foregroundColor(isEnabled ? .green : .gray)
        }
    }
}
