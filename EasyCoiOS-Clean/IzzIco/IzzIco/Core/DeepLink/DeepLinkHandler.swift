//
//  DeepLinkHandler.swift
//  IzzIco
//
//  Handles deep links and universal links for the app
//

import Foundation
import SwiftUI

// MARK: - Deep Link Types

enum DeepLinkType: Equatable {
    // Auth
    case magicLink(tokenHash: String, type: String)
    case emailConfirmation(tokenHash: String)
    case passwordReset(tokenHash: String)

    // Navigation
    case property(id: UUID)
    case application(id: UUID)
    case message(conversationId: UUID)
    case visit(id: UUID)

    // Features
    case matches
    case favorites
    case messages
    case profile
    case settings

    // Notifications
    case notification(id: String, type: String)
}

// MARK: - Deep Link Handler

@MainActor
class DeepLinkHandler: ObservableObject {
    static let shared = DeepLinkHandler()

    @Published var pendingDeepLink: DeepLinkType?
    @Published var isProcessing = false

    private let authManager = AuthManager.shared

    private init() {}

    // MARK: - URL Handling

    /// Handle incoming URL (from app delegate or scene delegate)
    func handleURL(_ url: URL) async {
        print("DeepLinkHandler: Received URL: \(url)")

        guard let deepLink = parseURL(url) else {
            print("DeepLinkHandler: Could not parse URL")
            return
        }

        await handleDeepLink(deepLink)
    }

    /// Parse URL into DeepLinkType
    func parseURL(_ url: URL) -> DeepLinkType? {
        // Handle Supabase auth callbacks
        // Format: easyco://auth/callback?token_hash=xxx&type=magiclink
        // Or: https://easyco.app/auth/callback?token_hash=xxx&type=magiclink

        let components = URLComponents(url: url, resolvingAgainstBaseURL: true)
        let path = url.path.isEmpty ? url.host ?? "" : url.path
        let queryItems = components?.queryItems ?? []

        // Auth callbacks
        if path.contains("auth") || path.contains("callback") {
            return parseAuthCallback(queryItems: queryItems)
        }

        // Property deep links
        if path.contains("property") || path.contains("properties") {
            if let idString = queryItems.first(where: { $0.name == "id" })?.value,
               let id = UUID(uuidString: idString) {
                return .property(id: id)
            }
            // Try path-based ID: /property/uuid
            let pathComponents = path.split(separator: "/")
            if let lastComponent = pathComponents.last,
               let id = UUID(uuidString: String(lastComponent)) {
                return .property(id: id)
            }
        }

        // Application deep links
        if path.contains("application") {
            if let idString = queryItems.first(where: { $0.name == "id" })?.value,
               let id = UUID(uuidString: idString) {
                return .application(id: id)
            }
        }

        // Message deep links
        if path.contains("message") || path.contains("chat") {
            if let idString = queryItems.first(where: { $0.name == "id" })?.value,
               let id = UUID(uuidString: idString) {
                return .message(conversationId: id)
            }
        }

        // Visit deep links
        if path.contains("visit") {
            if let idString = queryItems.first(where: { $0.name == "id" })?.value,
               let id = UUID(uuidString: idString) {
                return .visit(id: id)
            }
        }

        // Simple navigation deep links
        if path.contains("matches") { return .matches }
        if path.contains("favorites") { return .favorites }
        if path.contains("messages") { return .messages }
        if path.contains("profile") { return .profile }
        if path.contains("settings") { return .settings }

        // Notification deep links
        if path.contains("notification") {
            let notifId = queryItems.first(where: { $0.name == "id" })?.value ?? ""
            let notifType = queryItems.first(where: { $0.name == "type" })?.value ?? ""
            return .notification(id: notifId, type: notifType)
        }

        return nil
    }

    private func parseAuthCallback(queryItems: [URLQueryItem]) -> DeepLinkType? {
        let tokenHash = queryItems.first(where: { $0.name == "token_hash" })?.value
        let type = queryItems.first(where: { $0.name == "type" })?.value ?? "magiclink"

        // Also check for access_token (some Supabase flows)
        let accessToken = queryItems.first(where: { $0.name == "access_token" })?.value

        if let tokenHash = tokenHash {
            switch type {
            case "magiclink", "email":
                return .magicLink(tokenHash: tokenHash, type: type)
            case "signup", "email_confirm":
                return .emailConfirmation(tokenHash: tokenHash)
            case "recovery":
                return .passwordReset(tokenHash: tokenHash)
            default:
                return .magicLink(tokenHash: tokenHash, type: type)
            }
        }

        if let accessToken = accessToken {
            return .magicLink(tokenHash: accessToken, type: "access_token")
        }

        return nil
    }

    // MARK: - Deep Link Processing

    func handleDeepLink(_ deepLink: DeepLinkType) async {
        isProcessing = true

        switch deepLink {
        case .magicLink(let tokenHash, let type):
            await handleMagicLink(tokenHash: tokenHash, type: type)

        case .emailConfirmation(let tokenHash):
            await handleEmailConfirmation(tokenHash: tokenHash)

        case .passwordReset(let tokenHash):
            await handlePasswordReset(tokenHash: tokenHash)

        default:
            // For navigation deep links, store for later processing
            pendingDeepLink = deepLink
        }

        isProcessing = false
    }

    private func handleMagicLink(tokenHash: String, type: String) async {
        do {
            if type == "access_token" {
                // Direct token - save and fetch user
                EasyCoKeychainManager.shared.saveAuthToken(tokenHash)
                // AuthManager will pick up the token
            } else {
                try await authManager.handleMagicLinkCallback(tokenHash: tokenHash, type: type)
            }
            print("DeepLinkHandler: Magic link authenticated successfully")
        } catch {
            print("DeepLinkHandler: Magic link error: \(error)")
            // Store error for display
        }
    }

    private func handleEmailConfirmation(tokenHash: String) async {
        do {
            try await authManager.handleMagicLinkCallback(tokenHash: tokenHash, type: "signup")
            print("DeepLinkHandler: Email confirmed successfully")
        } catch {
            print("DeepLinkHandler: Email confirmation error: \(error)")
        }
    }

    private func handlePasswordReset(tokenHash: String) async {
        // Store the token for the password reset flow
        pendingDeepLink = .passwordReset(tokenHash: tokenHash)
    }

    // MARK: - Pending Deep Link Consumption

    /// Consume and return the pending deep link (clears it)
    func consumePendingDeepLink() -> DeepLinkType? {
        let link = pendingDeepLink
        pendingDeepLink = nil
        return link
    }

    /// Check if there's a pending deep link of a specific type
    func hasPendingDeepLink(ofType type: DeepLinkType) -> Bool {
        pendingDeepLink == type
    }
}

// MARK: - Navigation Coordinator Extension

extension DeepLinkHandler {
    /// Get the destination view for a deep link
    @ViewBuilder
    func destinationView(for deepLink: DeepLinkType) -> some View {
        switch deepLink {
        case .property(let id):
            // PropertyDetailView(propertyId: id)
            Text("Property: \(id)")

        case .application(let id):
            // ApplicationDetailView(applicationId: id)
            Text("Application: \(id)")

        case .message(let conversationId):
            // ChatView(conversationId: conversationId)
            Text("Message: \(conversationId)")

        case .visit(let id):
            // VisitDetailView(visitId: id)
            Text("Visit: \(id)")

        case .matches:
            // SwipeMatchesView()
            Text("Matches")

        case .favorites:
            // FavoritesView()
            Text("Favorites")

        case .messages:
            // MessagesListView()
            Text("Messages")

        case .profile:
            // ProfileView()
            Text("Profile")

        case .settings:
            // SettingsView()
            Text("Settings")

        case .passwordReset(let tokenHash):
            PasswordResetView(tokenHash: tokenHash)

        default:
            EmptyView()
        }
    }
}

// MARK: - Password Reset View

struct PasswordResetView: View {
    let tokenHash: String
    @State private var newPassword = ""
    @State private var confirmPassword = ""
    @State private var isLoading = false
    @State private var showSuccess = false
    @State private var showError = false
    @State private var errorMessage = ""
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            VStack(spacing: 32) {
                // Header
                VStack(spacing: 16) {
                    ZStack {
                        Circle()
                            .fill(Theme.Colors.Owner._100)
                            .frame(width: 80, height: 80)

                        Image(systemName: "lock.rotation")
                            .font(.system(size: 36))
                            .foregroundColor(Theme.Colors.Owner.primary)
                    }

                    Text("Nouveau mot de passe")
                        .font(Theme.Typography.title2(.bold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text("Choisissez un nouveau mot de passe sécurisé")
                        .font(Theme.Typography.body())
                        .foregroundColor(Theme.Colors.textSecondary)
                        .multilineTextAlignment(.center)
                }

                // Password fields
                VStack(spacing: 16) {
                    SecureField("Nouveau mot de passe", text: $newPassword)
                        .textContentType(.newPassword)
                        .padding(16)
                        .background(Color.white)
                        .cornerRadius(Theme.CornerRadius.lg)
                        .overlay(
                            RoundedRectangle(cornerRadius: Theme.CornerRadius.lg)
                                .stroke(Theme.Colors.border, lineWidth: 1)
                        )

                    SecureField("Confirmer le mot de passe", text: $confirmPassword)
                        .textContentType(.newPassword)
                        .padding(16)
                        .background(Color.white)
                        .cornerRadius(Theme.CornerRadius.lg)
                        .overlay(
                            RoundedRectangle(cornerRadius: Theme.CornerRadius.lg)
                                .stroke(Theme.Colors.border, lineWidth: 1)
                        )

                    // Password requirements
                    VStack(alignment: .leading, spacing: 8) {
                        passwordRequirement("8 caractères minimum", met: newPassword.count >= 8)
                        passwordRequirement("Une majuscule", met: newPassword.contains(where: { $0.isUppercase }))
                        passwordRequirement("Un chiffre", met: newPassword.contains(where: { $0.isNumber }))
                        passwordRequirement("Mots de passe identiques", met: !newPassword.isEmpty && newPassword == confirmPassword)
                    }
                    .padding(16)
                    .background(Theme.Colors.backgroundTertiary)
                    .cornerRadius(Theme.CornerRadius.lg)
                }

                Spacer()

                // Submit button
                Button(action: resetPassword) {
                    HStack {
                        if isLoading {
                            ProgressView()
                                .tint(.white)
                        } else {
                            Text("Réinitialiser le mot de passe")
                                .font(Theme.Typography.body(.semibold))
                        }
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(isValid ? Theme.Gradients.ownerCTA : LinearGradient(colors: [Theme.GrayColors._300], startPoint: .leading, endPoint: .trailing))
                    .cornerRadius(Theme.CornerRadius.xl)
                }
                .disabled(!isValid || isLoading)
            }
            .padding(24)
            .background(Theme.Colors.backgroundSecondary)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark")
                            .foregroundColor(Theme.Colors.textSecondary)
                    }
                }
            }
            .alert("Mot de passe réinitialisé", isPresented: $showSuccess) {
                Button("OK") { dismiss() }
            } message: {
                Text("Votre mot de passe a été modifié avec succès.")
            }
            .alert("Erreur", isPresented: $showError) {
                Button("OK", role: .cancel) {}
            } message: {
                Text(errorMessage)
            }
        }
    }

    private func passwordRequirement(_ text: String, met: Bool) -> some View {
        HStack(spacing: 8) {
            Image(systemName: met ? "checkmark.circle.fill" : "circle")
                .font(.system(size: 14))
                .foregroundColor(met ? Theme.Colors.success : Theme.Colors.textTertiary)

            Text(text)
                .font(Theme.Typography.caption())
                .foregroundColor(met ? Theme.Colors.textPrimary : Theme.Colors.textTertiary)
        }
    }

    private var isValid: Bool {
        newPassword.count >= 8 &&
        newPassword.contains(where: { $0.isUppercase }) &&
        newPassword.contains(where: { $0.isNumber }) &&
        newPassword == confirmPassword
    }

    private func resetPassword() {
        isLoading = true

        Task {
            do {
                // First verify the token
                try await AuthManager.shared.handleMagicLinkCallback(tokenHash: tokenHash, type: "recovery")
                // Then update the password
                try await AuthManager.shared.updatePassword(newPassword: newPassword)
                showSuccess = true
            } catch {
                errorMessage = error.localizedDescription
                showError = true
            }
            isLoading = false
        }
    }
}

// MARK: - Preview

#Preview {
    PasswordResetView(tokenHash: "test-token")
}
