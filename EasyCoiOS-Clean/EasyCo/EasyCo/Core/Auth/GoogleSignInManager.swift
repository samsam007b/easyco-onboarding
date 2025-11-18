import Foundation
import GoogleSignIn
import GoogleSignInSwift

// MARK: - Google Sign-In Manager

@MainActor
class GoogleSignInManager: ObservableObject {
    static let shared = GoogleSignInManager()

    private init() {}

    /// Sign in with Google
    func signInWithGoogle() async throws -> (idToken: String, accessToken: String) {
        // Get the presenting view controller
        guard let presentingViewController = await getRootViewController() else {
            throw NSError(domain: "GoogleSignIn", code: -1, userInfo: [NSLocalizedDescriptionKey: "No presenting view controller"])
        }

        // Get the client ID from Info.plist
        guard let clientID = getClientID() else {
            throw NSError(domain: "GoogleSignIn", code: -1, userInfo: [NSLocalizedDescriptionKey: "Missing GIDClientID in Info.plist"])
        }

        // Configure Google Sign-In
        let config = GIDConfiguration(clientID: clientID)
        GIDSignIn.sharedInstance.configuration = config

        // Sign in
        return try await withCheckedThrowingContinuation { continuation in
            GIDSignIn.sharedInstance.signIn(withPresenting: presentingViewController) { signInResult, error in
                if let error = error {
                    continuation.resume(throwing: error)
                    return
                }

                guard let signInResult = signInResult else {
                    continuation.resume(throwing: NSError(domain: "GoogleSignIn", code: -1, userInfo: [NSLocalizedDescriptionKey: "No sign-in result"]))
                    return
                }

                guard let idToken = signInResult.user.idToken?.tokenString else {
                    continuation.resume(throwing: NSError(domain: "GoogleSignIn", code: -1, userInfo: [NSLocalizedDescriptionKey: "No ID token"]))
                    return
                }

                let accessToken = signInResult.user.accessToken.tokenString

                continuation.resume(returning: (idToken: idToken, accessToken: accessToken))
            }
        }
    }

    /// Sign out from Google
    func signOut() {
        GIDSignIn.sharedInstance.signOut()
    }

    // MARK: - Private Helpers

    private func getRootViewController() async -> UIViewController? {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let rootViewController = windowScene.windows.first?.rootViewController else {
            return nil
        }

        // If there's a presented view controller, use that
        var topController = rootViewController
        while let presentedViewController = topController.presentedViewController {
            topController = presentedViewController
        }

        return topController
    }

    private func getClientID() -> String? {
        guard let clientID = Bundle.main.object(forInfoDictionaryKey: "GIDClientID") as? String else {
            print("⚠️ GIDClientID not found in Info.plist")
            return nil
        }
        return clientID
    }
}
