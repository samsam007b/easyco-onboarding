import SwiftUI

// MARK: - Signup View

struct SignupView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var viewModel = AuthViewModel()

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: Theme.Spacing.lg) {
                    // Header
                    VStack(spacing: Theme.Spacing.sm) {
                        Text("Créer un compte")
                            .font(Theme.Typography.title1())
                            .foregroundColor(Theme.Colors.textPrimary)

                        Text("Rejoins la communauté EasyCo")
                            .font(Theme.Typography.body())
                            .foregroundColor(Theme.Colors.textSecondary)
                    }
                    .padding(.top, Theme.Spacing.lg)

                    // Signup Form
                    VStack(spacing: Theme.Spacing.md) {
                        // Full Name
                        TextField("Nom complet", text: $viewModel.fullName)
                            .textContentType(.name)
                            .padding()
                            .background(Theme.Colors.backgroundSecondary)
                            .cornerRadius(Theme.CornerRadius.md)

                        // Email
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

                        // Password
                        VStack(alignment: .leading, spacing: Theme.Spacing.xs) {
                            SecureField("Mot de passe", text: $viewModel.password)
                                .textContentType(.newPassword)
                                .padding()
                                .background(Theme.Colors.backgroundSecondary)
                                .cornerRadius(Theme.CornerRadius.md)

                            if let error = viewModel.passwordError {
                                Text(error)
                                    .font(Theme.Typography.captionSmall())
                                    .foregroundColor(Theme.Colors.error)
                            }
                        }

                        // Confirm Password
                        VStack(alignment: .leading, spacing: Theme.Spacing.xs) {
                            SecureField("Confirmer le mot de passe", text: $viewModel.confirmPassword)
                                .textContentType(.newPassword)
                                .padding()
                                .background(Theme.Colors.backgroundSecondary)
                                .cornerRadius(Theme.CornerRadius.md)

                            if let error = viewModel.confirmPasswordError {
                                Text(error)
                                    .font(Theme.Typography.captionSmall())
                                    .foregroundColor(Theme.Colors.error)
                            }
                        }

                        // Terms
                        HStack(alignment: .top, spacing: Theme.Spacing.sm) {
                            Text("En créant un compte, vous acceptez nos")
                                .font(Theme.Typography.caption())
                                .foregroundColor(Theme.Colors.textSecondary)
                            +
                            Text(" Conditions d'utilisation")
                                .font(Theme.Typography.caption(.semibold))
                                .foregroundColor(Theme.Colors.primary)
                        }
                        .padding(.top, Theme.Spacing.sm)

                        // Signup Button
                        CustomButton(
                            "Créer mon compte",
                            style: .primary,
                            isLoading: viewModel.isLoading
                        ) {
                            _Concurrency.Task {
                                await viewModel.signUp()
                            }
                        }
                        .disabled(!viewModel.isSignupValid)
                        .padding(.top, Theme.Spacing.sm)
                    }
                    .padding(.horizontal, Theme.Spacing.xl)

                    Spacer()
                }
            }
            .dismissKeyboardOnTap()
            .errorAlert(error: $viewModel.error)
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

