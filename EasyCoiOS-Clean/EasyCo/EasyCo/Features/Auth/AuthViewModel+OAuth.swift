import Foundation
import AuthenticationServices

// MARK: - Auth ViewModel OAuth Extension

extension AuthViewModel {
    // MARK: - Apple Sign-In

    func signInWithApple() async {
        isLoading = true
        error = nil

        do {
            print("🍎 Starting Apple Sign-In flow...")

            // Get Apple ID credential
            let credential = try await AppleSignInManager.shared.signInWithApple()

            guard let identityToken = credential.identityToken,
                  let tokenString = String(data: identityToken, encoding: .utf8) else {
                throw NetworkError.unknown(NSError(domain: "Failed to get identity token", code: -1))
            }

            // Get the nonce from AppleSignInManager
            // Note: You'll need to expose currentNonce from AppleSignInManager
            guard let nonce = AppleSignInManager.shared.currentNonce else {
                throw NetworkError.unknown(NSError(domain: "Failed to get nonce", code: -1))
            }

            print("🍎 Got Apple credential, authenticating with Supabase...")

            // Authenticate with Supabase
            let session = try await SupabaseAuth.shared.signInWithApple(
                idToken: tokenString,
                nonce: nonce
            )

            // Save session
            try await authManager.handleOAuthSession(session)

            print("✅ Apple Sign-In completed successfully!")

        } catch let asError as ASAuthorizationError {
            // Handle specific Apple Sign-In errors
            switch asError.code {
            case .canceled:
                print("ℹ️ User canceled Apple Sign-In")
                // Don't show error for cancellation
                break
            case .failed:
                self.error = .unknown(NSError(domain: "Apple Sign-In failed", code: -1))
                self.showError = true
            case .invalidResponse:
                self.error = .unknown(NSError(domain: "Invalid response from Apple", code: -1))
                self.showError = true
            case .notHandled:
                self.error = .unknown(NSError(domain: "Apple Sign-In not handled", code: -1))
                self.showError = true
            case .unknown:
                self.error = .unknown(NSError(domain: "Unknown Apple Sign-In error", code: -1))
                self.showError = true
            @unknown default:
                self.error = .unknown(NSError(domain: "Unknown Apple Sign-In error", code: -1))
                self.showError = true
            }
        } catch {
            print("❌ Apple Sign-In error: \(error.localizedDescription)")
            self.error = error as? NetworkError ?? .unknown(error)
            self.showError = true
        }

        isLoading = false
    }

    // MARK: - Google Sign-In

    func signInWithGoogle() async {
        isLoading = true
        error = nil

        do {
            print("🔵 Starting Google Sign-In flow...")

            // Get Google credentials
            let tokens = try await GoogleSignInManager.shared.signInWithGoogle()

            print("🔵 Got Google credentials, authenticating with Supabase...")

            // Authenticate with Supabase
            let session = try await SupabaseAuth.shared.signInWithGoogle(
                idToken: tokens.idToken,
                accessToken: tokens.accessToken
            )

            // Save session
            try await authManager.handleOAuthSession(session)

            print("✅ Google Sign-In completed successfully!")

        } catch {
            print("❌ Google Sign-In error: \(error.localizedDescription)")
            self.error = error as? NetworkError ?? .unknown(error)
            self.showError = true
        }

        isLoading = false
    }
}
