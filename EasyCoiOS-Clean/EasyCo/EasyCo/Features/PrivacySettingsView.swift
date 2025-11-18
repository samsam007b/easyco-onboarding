//
//  PrivacySettingsView.swift
//  EasyCo
//
//  Created by Claude on 11/18/2025.
//

import SwiftUI

// MARK: - Privacy Settings View

struct PrivacySettingsView: View {
    @StateObject private var viewModel = PrivacySettingsViewModel()
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            Form {
                // Profile Visibility
                profileVisibilitySection

                // Communication Settings
                communicationSection

                // Data Sharing
                dataSharingSection

                // Consent Management
                consentSection

                // Data Rights
                dataRightsSection

                // Legal Documents
                legalSection
            }
            .navigationTitle("Privacy & Data")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Save") {
                        Task {
                            await viewModel.saveSettings()
                            dismiss()
                        }
                    }
                    .fontWeight(.semibold)
                    .disabled(!viewModel.hasChanges)
                }
            }
            .task {
                await viewModel.loadSettings()
            }
        }
    }

    // MARK: - Profile Visibility Section

    private var profileVisibilitySection: some View {
        Section {
            Picker("Profile Visibility", selection: $viewModel.profileVisibility) {
                ForEach(ProfileVisibility.allCases, id: \.self) { visibility in
                    VStack(alignment: .leading, spacing: 4) {
                        Text(visibility.displayName)
                            .font(.body)
                        Text(visibility.description)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .tag(visibility)
                }
            }
            .pickerStyle(.menu)

            Toggle("Show Online Status", isOn: $viewModel.showOnlineStatus)

            Toggle("Show Last Seen", isOn: $viewModel.showLastSeen)
        } header: {
            Text("Profile Visibility")
        } footer: {
            Text("Control who can see your profile and activity")
        }
    }

    // MARK: - Communication Section

    private var communicationSection: some View {
        Section {
            Picker("Who Can Message You", selection: $viewModel.allowMessagesFrom) {
                ForEach(MessagePermission.allCases, id: \.self) { permission in
                    Text(permission.displayName).tag(permission)
                }
            }
            .pickerStyle(.menu)

            Toggle("Show Read Receipts", isOn: $viewModel.showReadReceipts)
        } header: {
            Text("Communication")
        } footer: {
            Text("Manage your messaging preferences")
        }
    }

    // MARK: - Data Sharing Section

    private var dataSharingSection: some View {
        Section {
            Toggle("Share Location Data", isOn: $viewModel.shareLocationData)

            Toggle("Share Usage Analytics", isOn: $viewModel.shareAnalytics)

            Toggle("Personalized Ads", isOn: $viewModel.personalizedAds)
        } header: {
            Text("Data Sharing")
        } footer: {
            Text("Help us improve the app by sharing anonymized usage data")
        }
    }

    // MARK: - Consent Section

    private var consentSection: some View {
        Section {
            NavigationLink {
                ConsentManagementView()
            } label: {
                Label("Manage Consents", systemImage: "checkmark.shield")
            }

            ForEach(viewModel.consents.filter { $0.consentType.isRequired }) { consent in
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(consent.consentType.displayName)
                            .font(.body)

                        if let grantedAt = consent.grantedAt {
                            Text("Accepted \(formatDate(grantedAt))")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }

                    Spacer()

                    if consent.isGranted {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundColor(.green)
                    }
                }
            }
        } header: {
            Text("Consents")
        } footer: {
            Text("Review and manage your consents")
        }
    }

    // MARK: - Data Rights Section

    private var dataRightsSection: some View {
        Section {
            NavigationLink {
                DataExportView()
            } label: {
                Label("Download My Data", systemImage: "arrow.down.doc")
            }

            NavigationLink {
                DataDeletionView()
            } label: {
                Label("Delete My Account", systemImage: "trash")
                    .foregroundColor(.red)
            }
        } header: {
            Text("Your Data Rights")
        } footer: {
            Text("Exercise your rights under GDPR")
        }
    }

    // MARK: - Legal Section

    private var legalSection: some View {
        Section {
            NavigationLink {
                LegalDocumentView(type: .privacyPolicy)
            } label: {
                Label("Privacy Policy", systemImage: "doc.text")
            }

            NavigationLink {
                LegalDocumentView(type: .termsOfService)
            } label: {
                Label("Terms of Service", systemImage: "doc.text")
            }

            NavigationLink {
                LegalDocumentView(type: .cookiePolicy)
            } label: {
                Label("Cookie Policy", systemImage: "doc.text")
            }
        } header: {
            Text("Legal")
        }
    }

    // MARK: - Helpers

    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter.string(from: date)
    }
}

// MARK: - View Model

@MainActor
class PrivacySettingsViewModel: ObservableObject {
    @Published var profileVisibility: ProfileVisibility = .public
    @Published var showOnlineStatus = true
    @Published var showLastSeen = true
    @Published var allowMessagesFrom: MessagePermission = .everyone
    @Published var showReadReceipts = true
    @Published var shareLocationData = false
    @Published var shareAnalytics = true
    @Published var personalizedAds = false

    @Published var consents: [UserConsent] = []
    @Published var hasChanges = false
    @Published var isLoading = false

    func loadSettings() async {
        isLoading = true

        // TODO: Load from API
        let settings = PrivacySettings.default
        profileVisibility = settings.profileVisibility
        showOnlineStatus = settings.showOnlineStatus
        showLastSeen = settings.showLastSeen
        allowMessagesFrom = settings.allowMessagesFrom
        showReadReceipts = settings.showReadReceipts
        shareLocationData = settings.shareLocationData
        shareAnalytics = settings.shareAnalytics
        personalizedAds = settings.personalizedAds

        consents = UserConsent.mockConsents

        isLoading = false
    }

    func saveSettings() async {
        let settings = PrivacySettings(
            profileVisibility: profileVisibility,
            showOnlineStatus: showOnlineStatus,
            showLastSeen: showLastSeen,
            allowMessagesFrom: allowMessagesFrom,
            showReadReceipts: showReadReceipts,
            shareLocationData: shareLocationData,
            shareAnalytics: shareAnalytics,
            personalizedAds: personalizedAds,
            dataRetentionDays: 30
        )

        // TODO: Save to API
        print("💾 Saving privacy settings: \(settings)")

        hasChanges = false
    }
}

// MARK: - Preview

#Preview {
    PrivacySettingsView()
}
