import SwiftUI

// MARK: - Forgot Password View

struct ForgotPasswordView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var viewModel = AuthViewModel()
    @State private var showSuccess = false

    var body: some View {
        NavigationStack {
            VStack(spacing: Theme.Spacing.xl) {
                // Header
                VStack(spacing: Theme.Spacing.md) {
                    Image(systemName: "lock.rotation")
                        .font(.system(size: 60))
                        .foregroundColor(Theme.Colors.primary)

                    VStack(spacing: Theme.Spacing.sm) {
                        Text("Mot de passe oublié ?")
                            .font(Theme.Typography.title1())
                            .foregroundColor(Theme.Colors.textPrimary)

                        Text("Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.")
                            .font(Theme.Typography.body())
                            .foregroundColor(Theme.Colors.textSecondary)
                            .multilineTextAlignment(.center)
                    }
                }
                .padding(.top, Theme.Spacing.xxl)

                // Email Field
                VStack(alignment: .leading, spacing: Theme.Spacing.xs) {
                    TextField("Email", text: $viewModel.email)
                        .textContentType(.emailAddress)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                        .padding()
                        .background(Theme.Colors.backgroundSecondary)
                        .cornerRadius(Theme.CornerRadius.md)

                    if let error = viewModel.emailError {
                        Text(error)
                            .font(Theme.Typography.captionSmall())
                            .foregroundColor(Theme.Colors.error)
                    }
                }
                .padding(.horizontal, Theme.Spacing.xl)

                // Reset Button
                CustomButton(
                    "Envoyer le lien",
                    style: .primary,
                    isLoading: viewModel.isLoading
                ) {
                    Task {
                        await viewModel.resetPassword()
                        showSuccess = true
                    }
                }
                .disabled(!viewModel.email.isValidEmail)
                .padding(.horizontal, Theme.Spacing.xl)

                Spacer()
            }
            .dismissKeyboardOnTap()
            .errorAlert(error: $viewModel.error)
            .alert("Email envoyé", isPresented: $showSuccess) {
                Button("OK") {
                    dismiss()
                }
            } message: {
                Text("Vérifiez votre boîte mail pour réinitialiser votre mot de passe.")
            }
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") {
                        dismiss()
                    }
                }
            }
        }
    }
}

// MARK: - Preview

#Preview {
    ForgotPasswordView()
}
