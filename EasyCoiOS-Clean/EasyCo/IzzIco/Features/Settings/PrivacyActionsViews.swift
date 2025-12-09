//
//  PrivacyActionsViews.swift
//  IzzIco
//
//  Created by Claude on 11/18/2025.
//

import SwiftUI

// MARK: - Consent Management View

struct ConsentManagementView: View {
    @StateObject private var viewModel = ConsentManagementViewModel()
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        List {
            ForEach(ConsentType.allCases, id: \.self) { type in
                ConsentRow(
                    consentType: type,
                    consent: viewModel.consents.first { $0.consentType == type },
                    onToggle: { granted in
                        Task {
                            await viewModel.updateConsent(type, granted: granted)
                        }
                    }
                )
            }
        }
        .navigationTitle("Manage Consents")
        .navigationBarTitleDisplayMode(.inline)
        .task {
            await viewModel.loadConsents()
        }
    }
}

struct ConsentRow: View {
    let consentType: ConsentType
    let consent: UserConsent?
    let onToggle: (Bool) -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text(consentType.displayName)
                            .font(.body)
                            .fontWeight(.medium)

                        if consentType.isRequired {
                            Text("Required")
                                .font(.caption2)
                                .fontWeight(.semibold)
                                .foregroundColor(.white)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color.orange)
                                .clipShape(Capsule())
                        }
                    }

                    Text(consentType.description)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                Spacer()

                Toggle("", isOn: Binding(
                    get: { consent?.isGranted ?? false },
                    set: { onToggle($0) }
                ))
                .labelsHidden()
                .disabled(consentType.isRequired && (consent?.isGranted ?? false))
            }

            if let consent = consent, let grantedAt = consent.grantedAt {
                HStack(spacing: 4) {
                    Image(systemName: "clock")
                        .font(.caption2)
                    Text("Last updated: \(formatDate(grantedAt))")
                        .font(.caption2)
                }
                .foregroundColor(.secondary)
            }
        }
        .padding(.vertical, 4)
    }

    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
}

@MainActor
class ConsentManagementViewModel: ObservableObject {
    @Published var consents: [UserConsent] = []
    @Published var isLoading = false

    func loadConsents() async {
        isLoading = true

        // TODO: Load from API
        consents = UserConsent.mockConsents

        isLoading = false
    }

    func updateConsent(_ type: ConsentType, granted: Bool) async {
        // TODO: Update via API
        print("📋 Updating consent: \(type.displayName) = \(granted)")

        // Update local state
        if let index = consents.firstIndex(where: { $0.consentType == type }) {
            let old = consents[index]
            consents[index] = UserConsent(
                id: old.id,
                userId: old.userId,
                consentType: type,
                isGranted: granted,
                grantedAt: granted ? Date() : nil,
                revokedAt: granted ? nil : Date(),
                version: "1.0",
                ipAddress: old.ipAddress,
                userAgent: old.userAgent,
                createdAt: old.createdAt,
                updatedAt: Date()
            )
        } else {
            // Create new consent
            consents.append(UserConsent(
                id: UUID(),
                userId: UUID(),
                consentType: type,
                isGranted: granted,
                grantedAt: granted ? Date() : nil,
                revokedAt: granted ? nil : Date(),
                version: "1.0",
                ipAddress: nil,
                userAgent: "EasyCo iOS",
                createdAt: Date(),
                updatedAt: Date()
            ))
        }
    }
}

// MARK: - Data Export View

struct DataExportView: View {
    @StateObject private var viewModel = DataExportViewModel()
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        List {
            Section {
                VStack(alignment: .leading, spacing: 12) {
                    Text("Download a copy of your data")
                        .font(.headline)

                    Text("We'll prepare a file containing all your data in a readable format (JSON). You'll receive a download link when it's ready.")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .padding(.vertical, 8)
            }

            Section("Select Data Categories") {
                ForEach(DataCategory.allCategories) { category in
                    Toggle(isOn: Binding(
                        get: { viewModel.selectedCategories.contains(category.name) },
                        set: { isSelected in
                            if isSelected {
                                viewModel.selectedCategories.insert(category.name)
                            } else {
                                viewModel.selectedCategories.remove(category.name)
                            }
                        }
                    )) {
                        HStack {
                            Image(systemName: category.icon)
                                .font(.title3)
                                .foregroundColor(.blue)
                                .frame(width: 32)

                            VStack(alignment: .leading, spacing: 2) {
                                Text(category.name)
                                    .font(.body)

                                Text(category.description)
                                    .font(.caption)
                                    .foregroundColor(.secondary)

                                if let size = category.estimatedSize {
                                    Text(size)
                                        .font(.caption2)
                                        .foregroundColor(.secondary)
                                }
                            }
                        }
                    }
                }
            }

            if !viewModel.previousRequests.isEmpty {
                Section("Previous Requests") {
                    ForEach(viewModel.previousRequests.filter { $0.requestType == .export }) { request in
                        DataRequestRow(request: request)
                    }
                }
            }

            Section {
                Button {
                    Task { await viewModel.requestDataExport() }
                } label: {
                    if viewModel.isLoading {
                        ProgressView()
                            .frame(maxWidth: .infinity)
                    } else {
                        Label("Request Data Export", systemImage: "arrow.down.doc.fill")
                            .frame(maxWidth: .infinity)
                            .foregroundColor(.blue)
                    }
                }
                .disabled(viewModel.selectedCategories.isEmpty || viewModel.isLoading)
            } footer: {
                Text("Processing typically takes 24-48 hours. You'll be notified when your data is ready to download.")
                    .font(.caption)
            }
        }
        .navigationTitle("Export My Data")
        .navigationBarTitleDisplayMode(.inline)
        .task {
            await viewModel.loadPreviousRequests()
        }
        .alert("Export Requested", isPresented: $viewModel.showingSuccessAlert) {
            Button("OK") {
                dismiss()
            }
        } message: {
            Text("Your data export request has been submitted. You'll receive a notification when it's ready.")
        }
    }
}

@MainActor
class DataExportViewModel: ObservableObject {
    @Published var selectedCategories: Set<String> = Set(
        DataCategory.allCategories.filter { $0.isIncludedByDefault }.map { $0.name }
    )
    @Published var previousRequests: [DataRequest] = []
    @Published var isLoading = false
    @Published var showingSuccessAlert = false

    func loadPreviousRequests() async {
        // TODO: Load from API
        previousRequests = DataRequest.mockRequests
    }

    func requestDataExport() async {
        isLoading = true

        // TODO: Submit request to API
        print("📤 Requesting data export for categories: \(selectedCategories)")

        try? await Task.sleep(nanoseconds: 1_000_000_000)

        isLoading = false
        showingSuccessAlert = true
    }
}

// MARK: - Data Deletion View

struct DataDeletionView: View {
    @StateObject private var viewModel = DataDeletionViewModel()
    @Environment(\.dismiss) private var dismiss
    @State private var showingConfirmation = false

    var body: some View {
        List {
            Section {
                VStack(alignment: .leading, spacing: 12) {
                    HStack(spacing: 12) {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .font(.largeTitle)
                            .foregroundColor(.red)

                        VStack(alignment: .leading, spacing: 4) {
                            Text("Permanent Action")
                                .font(.headline)
                                .foregroundColor(.red)

                            Text("This action cannot be undone")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                    }
                    .padding(.vertical, 8)
                }
            }

            Section("What will be deleted") {
                ForEach(DataCategory.allCategories) { category in
                    HStack {
                        Image(systemName: category.icon)
                            .font(.body)
                            .foregroundColor(.red)
                            .frame(width: 32)

                        VStack(alignment: .leading, spacing: 2) {
                            Text(category.name)
                                .font(.body)

                            Text(category.description)
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }
                }
            }

            Section {
                VStack(alignment: .leading, spacing: 16) {
                    Text("Before you go...")
                        .font(.headline)

                    Text("• All your data will be permanently deleted")
                    Text("• Active applications will be cancelled")
                    Text("• Current leases will be terminated")
                    Text("• You won't be able to recover your account")

                    Text("Data retention: Your data will be kept for 30 days before permanent deletion. During this period, you can cancel the deletion request.")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .padding(.top, 8)
                }
                .font(.subheadline)
            }

            Section {
                TextField("Type DELETE to confirm", text: $viewModel.confirmationText)
                    .textInputAutocapitalization(.characters)
                    .autocorrectionDisabled()
            } header: {
                Text("Confirmation")
            }

            Section {
                Button(role: .destructive) {
                    showingConfirmation = true
                } label: {
                    if viewModel.isLoading {
                        ProgressView()
                            .frame(maxWidth: .infinity)
                    } else {
                        Label("Delete My Account", systemImage: "trash.fill")
                            .frame(maxWidth: .infinity)
                            .foregroundColor(.red)
                    }
                }
                .disabled(!viewModel.canDelete || viewModel.isLoading)
            }
        }
        .navigationTitle("Delete Account")
        .navigationBarTitleDisplayMode(.inline)
        .confirmationDialog(
            "Delete Account",
            isPresented: $showingConfirmation,
            titleVisibility: .visible
        ) {
            Button("Delete My Account", role: .destructive) {
                Task { await viewModel.requestAccountDeletion() }
            }
            Button("Cancel", role: .cancel) { }
        } message: {
            Text("Are you absolutely sure? This action cannot be undone.")
        }
        .alert("Deletion Requested", isPresented: $viewModel.showingSuccessAlert) {
            Button("OK") {
                dismiss()
            }
        } message: {
            Text("Your account deletion request has been submitted. You have 30 days to cancel this request before permanent deletion.")
        }
    }
}

@MainActor
class DataDeletionViewModel: ObservableObject {
    @Published var confirmationText = ""
    @Published var isLoading = false
    @Published var showingSuccessAlert = false

    var canDelete: Bool {
        confirmationText.uppercased() == "DELETE"
    }

    func requestAccountDeletion() async {
        isLoading = true

        // TODO: Submit deletion request to API
        print("🗑️ Requesting account deletion")

        try? await Task.sleep(nanoseconds: 1_000_000_000)

        isLoading = false
        showingSuccessAlert = true
    }
}

// MARK: - Data Request Row

struct DataRequestRow: View {
    let request: DataRequest

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: request.requestType.icon)
                    .foregroundColor(Color(hex: request.status.color))

                Text(request.requestType.displayName)
                    .font(.body)
                    .fontWeight(.medium)

                Spacer()

                Text(request.status.displayName)
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundColor(Color(hex: request.status.color))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color(hex: request.status.color).opacity(0.15))
                    .clipShape(Capsule())
            }

            Text("Requested: \(formatDate(request.requestedAt))")
                .font(.caption)
                .foregroundColor(.secondary)

            if request.status == .completed, let downloadUrl = request.downloadUrl {
                Button {
                    // TODO: Open download URL
                    print("📥 Downloading: \(downloadUrl)")
                } label: {
                    Label("Download", systemImage: "arrow.down.circle.fill")
                        .font(.subheadline)
                        .foregroundColor(.blue)
                }
            }
        }
        .padding(.vertical, 4)
    }

    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter.string(from: date)
    }
}

// MARK: - Legal Document View

struct LegalDocumentView: View {
    let type: LegalDocumentType

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text(type.title)
                    .font(.title)
                    .fontWeight(.bold)

                Text("Last updated: \(type.lastUpdated)")
                    .font(.subheadline)
                    .foregroundColor(.secondary)

                Divider()

                Text(type.content)
                    .font(.body)
                    .lineSpacing(4)
            }
            .padding()
        }
        .navigationTitle(type.title)
        .navigationBarTitleDisplayMode(.inline)
    }
}

enum LegalDocumentType {
    case privacyPolicy
    case termsOfService
    case cookiePolicy

    var title: String {
        switch self {
        case .privacyPolicy: return "Privacy Policy"
        case .termsOfService: return "Terms of Service"
        case .cookiePolicy: return "Cookie Policy"
        }
    }

    var lastUpdated: String {
        "November 18, 2025"
    }

    var content: String {
        switch self {
        case .privacyPolicy:
            return """
            # Privacy Policy

            ## 1. Information We Collect

            We collect information that you provide directly to us, including:
            - Account information (name, email, phone number)
            - Profile information (bio, photos, preferences)
            - Messages and communications
            - Property search history
            - Application information

            ## 2. How We Use Your Information

            We use the information we collect to:
            - Provide, maintain, and improve our services
            - Match you with compatible roommates and properties
            - Send you technical notices and support messages
            - Communicate with you about products, services, and events

            ## 3. Information Sharing

            We do not sell your personal information. We may share your information:
            - With other users (as part of your profile)
            - With property owners (when you apply)
            - With service providers who assist us
            - When required by law

            ## 4. Your Rights

            Under GDPR, you have the right to:
            - Access your personal data
            - Correct inaccurate data
            - Request deletion of your data
            - Object to processing
            - Data portability

            ## 5. Data Retention

            We retain your information for as long as your account is active or as needed to provide services. You can request deletion of your account at any time.

            ## 6. Security

            We use appropriate technical and organizational measures to protect your personal information.

            ## 7. Contact Us

            For privacy-related questions, contact us at: privacy@easyco.com
            """

        case .termsOfService:
            return """
            # Terms of Service

            ## 1. Acceptance of Terms

            By accessing or using EasyCo, you agree to be bound by these Terms of Service.

            ## 2. Description of Service

            EasyCo is a platform that connects people looking for shared housing with property owners and potential roommates.

            ## 3. User Accounts

            You must create an account to use certain features. You are responsible for:
            - Maintaining the security of your account
            - All activities under your account
            - Providing accurate information

            ## 4. User Conduct

            You agree not to:
            - Violate any laws or regulations
            - Impersonate others
            - Harass or harm other users
            - Post false or misleading information
            - Use the service for unauthorized purposes

            ## 5. Property Listings

            Property owners must:
            - Provide accurate property information
            - Have legal right to list the property
            - Comply with fair housing laws
            - Respond to inquiries in a timely manner

            ## 6. Applications and Agreements

            - Applications through EasyCo are not binding contracts
            - Final agreements must be made directly between parties
            - EasyCo is not responsible for disputes between users

            ## 7. Fees and Payments

            - Service fees are clearly disclosed
            - Payments are processed securely
            - Refund policy applies as stated

            ## 8. Termination

            We may suspend or terminate your account if you violate these terms.

            ## 9. Disclaimers

            EasyCo is provided "as is" without warranties of any kind.

            ## 10. Contact

            For questions about these terms, contact: legal@easyco.com
            """

        case .cookiePolicy:
            return """
            # Cookie Policy

            ## 1. What Are Cookies

            Cookies are small text files stored on your device when you visit our website or use our app.

            ## 2. How We Use Cookies

            We use cookies to:
            - Keep you signed in
            - Remember your preferences
            - Understand how you use our service
            - Improve our service

            ## 3. Types of Cookies We Use

            ### Essential Cookies
            Required for the service to function properly.

            ### Performance Cookies
            Help us understand how users interact with our service.

            ### Functional Cookies
            Remember your preferences and settings.

            ### Targeting Cookies
            Used to deliver relevant advertisements (with your consent).

            ## 4. Your Choices

            You can control cookies through your browser settings or app preferences.

            ## 5. Third-Party Cookies

            Some cookies are placed by third-party services that appear on our pages.

            ## 6. Updates

            We may update this Cookie Policy from time to time.

            ## 7. Contact

            For questions about cookies, contact: privacy@easyco.com
            """
        }
    }
}

// MARK: - Previews

#Preview("Consent Management") {
    NavigationStack {
        ConsentManagementView()
    }
}

#Preview("Data Export") {
    NavigationStack {
        DataExportView()
    }
}

#Preview("Data Deletion") {
    NavigationStack {
        DataDeletionView()
    }
}

#Preview("Privacy Policy") {
    NavigationStack {
        LegalDocumentView(type: .privacyPolicy)
    }
}
