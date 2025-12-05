import Foundation
import AuthenticationServices

// MARK: - Auth ViewModel OAuth Extension

extension AuthViewModel {
    // MARK: - Apple Sign-In
    // TODO: Implement Apple Sign-In with Supabase integration

    func signInWithApple() async {
        isLoading = true
        error = nil

        print("🍎 Apple Sign-In not yet implemented")
        error = AppError.unknown(NSError(domain: "Apple Sign-In not yet implemented", code: -1))
        showError = true

        isLoading = false
    }

    // MARK: - Google Sign-In
    // TODO: Implement Google Sign-In with Supabase integration

    func signInWithGoogle() async {
        isLoading = true
        error = nil

        print("🔵 Google Sign-In not yet implemented")
        error = AppError.unknown(NSError(domain: "Google Sign-In not yet implemented", code: -1))
        showError = true

        isLoading = false
    }
}
