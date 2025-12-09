import Foundation
import Combine

// MARK: - Auth ViewModel

@MainActor
class AuthViewModel: ObservableObject {
    @Published var email = ""
    @Published var password = ""
    @Published var confirmPassword = ""
    @Published var fullName = ""

    @Published var isLoading = false
    @Published var error: AppError?
    @Published var showError = false

    private let authManager = AuthManager.shared
    private var cancellables = Set<AnyCancellable>()

    // MARK: - Validation

    var isLoginValid: Bool {
        email.isValidEmail && password.isValidPassword
    }

    var isSignupValid: Bool {
        email.isValidEmail &&
        password.isValidPassword &&
        password == confirmPassword &&
        !fullName.isBlank
    }

    var emailError: String? {
        guard !email.isEmpty else { return nil }
        return email.isValidEmail ? nil : "Email invalide"
    }

    var passwordError: String? {
        guard !password.isEmpty else { return nil }
        return password.isValidPassword ? nil : "Minimum \(AppConfig.Validation.minPasswordLength) caractères"
    }

    var confirmPasswordError: String? {
        guard !confirmPassword.isEmpty else { return nil }
        return password == confirmPassword ? nil : "Les mots de passe ne correspondent pas"
    }

    // MARK: - Actions

    func login() async {
        guard isLoginValid else { return }

        isLoading = true
        error = nil

        do {
            // Mode démo : accepte n'importe quel email/password
            if AppConfig.FeatureFlags.demoMode {
                try await Task.sleep(nanoseconds: 1_000_000_000) // Simule 1 seconde de chargement
                // Crée un faux utilisateur
                let demoUser = User(
                    id: UUID(),
                    email: email.trimmed,
                    firstName: "Demo",
                    lastName: "User",
                    phoneNumber: nil,
                    profileImageURL: nil,
                    userType: .searcher,
                    onboardingCompleted: false, // Force onboarding in demo mode
                    createdAt: Date(),
                    updatedAt: Date()
                )
                authManager.currentUser = demoUser
                authManager.isAuthenticated = true
            } else {
                try await authManager.login(email: email.trimmed, password: password)
            }
            // Success - navigation handled by RootView
        } catch {
            self.error = AppError.unknown(error)
            self.showError = true
        }

        isLoading = false
    }

    func signUp() async {
        guard isSignupValid else {
            print("❌ Signup validation failed")
            return
        }

        print("📝 Starting signup for email: \(email.trimmed)")
        isLoading = true
        error = nil

        let userData: [String: Any] = [
            "full_name": fullName.trimmed,
            "user_type": "searcher"
        ]

        do {
            try await authManager.signUp(
                email: email.trimmed,
                password: password,
                userData: userData
            )
            print("✅ Signup successful!")
            // Success - navigation handled by RootView
        } catch {
            print("❌ Signup failed with error: \(error)")
            self.error = AppError.unknown(error)
            self.showError = true
        }

        isLoading = false
    }

    func resetPassword() async {
        guard email.isValidEmail else {
            error = .unknown(NSError(domain: "Email invalide", code: -1))
            showError = true
            return
        }

        isLoading = true
        error = nil

        do {
            try await authManager.resetPassword(email: email.trimmed)
            // Show success message
        } catch {
            self.error = AppError.unknown(error)
            self.showError = true
        }

        isLoading = false
    }

    func clearError() {
        error = nil
        showError = false
    }
}
