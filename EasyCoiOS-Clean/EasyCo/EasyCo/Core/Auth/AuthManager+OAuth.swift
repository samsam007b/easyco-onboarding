import Foundation

// MARK: - Auth Manager OAuth Extension

extension AuthManager {
    /// Handle OAuth session after successful authentication
    func handleOAuthSession(_ session: AuthSession) async throws {
        print("📱 Handling OAuth session...")

        // Save token
        EasyCoKeychainManager.shared.saveAuthToken(session.accessToken)
        print("💾 Token saved to keychain")

        // Fetch user profile
        print("👤 Fetching user profile...")
        let user = try await apiClient.getCurrentUser()
        print("✅ User profile loaded: \(user.email), type: \(user.userType?.rawValue ?? "not set")")

        self.currentUser = user
        self.isAuthenticated = true
    }
}
