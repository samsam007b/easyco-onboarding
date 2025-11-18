import SwiftUI
import AuthenticationServices

// MARK: - OAuth Buttons View

struct OAuthButtonsView: View {
    @ObservedObject var viewModel: AuthViewModel
    @EnvironmentObject var languageManager: LanguageManager

    private var auth: AuthTranslations {
        languageManager.getSection(\.auth)
    }

    var body: some View {
        VStack(spacing: Theme.Spacing._3) {
            // TODO: Apple Sign-In - Temporairement désactivé
            // SignInWithAppleButton(
            //     onRequest: { request in
            //         // Configuration is handled by AppleSignInManager
            //     },
            //     onCompletion: { result in
            //         // Handled by viewModel
            //     }
            // )
            // .signInWithAppleButtonStyle(.black)
            // .frame(height: 50)
            // .cornerRadius(Theme.CornerRadius.lg)
            // .onTapGesture {
            //     Task {
            //         await viewModel.signInWithApple()
            //     }
            // }

            // Google OAuth Button
            SecondaryButton(
                auth.continueWithGoogle,
                color: Theme.GrayColors._800,
                icon: "g.circle.fill"
            ) {
                Task {
                    await viewModel.signInWithGoogle()
                }
            }
        }
    }
}
