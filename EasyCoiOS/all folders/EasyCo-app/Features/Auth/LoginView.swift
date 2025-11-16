import SwiftUI

// MARK: - Login View

struct LoginView: View {
    @StateObject private var viewModel = AuthViewModel()
    @State private var showSignup = false
    @State private var showForgotPassword = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: Theme.Spacing.xl) {
                    // Header
                    VStack(spacing: Theme.Spacing.md) {
                        Image(systemName: "house.fill")
                            .font(.system(size: 60))
                            .foregroundColor(Theme.Colors.primary)

                        Text("EasyCo")
                            .font(Theme.Typography.largeTitle())
                            .foregroundColor(Theme.Colors.primary)

                        Text("Trouve ta colocation idéale")
                            .font(Theme.Typography.body())
                            .foregroundColor(Theme.Colors.textSecondary)
                    }
                    .padding(.top, Theme.Spacing.xxl)

                    // Login Form
                    VStack(spacing: Theme.Spacing.md) {
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

                        // Password Field
                        VStack(alignment: .leading, spacing: Theme.Spacing.xs) {
                            SecureField("Mot de passe", text: $viewModel.password)
                                .textContentType(.password)
                                .padding()
                                .background(Theme.Colors.backgroundSecondary)
                                .cornerRadius(Theme.CornerRadius.md)

                            if let error = viewModel.passwordError {
                                Text(error)
                                    .font(Theme.Typography.captionSmall())
                                    .foregroundColor(Theme.Colors.error)
                            }
                        }

                        // Forgot Password
                        Button("Mot de passe oublié ?") {
                            showForgotPassword = true
                        }
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.primary)
                        .frame(maxWidth: .infinity, alignment: .trailing)

                        // Login Button
                        CustomButton(
                            "Se connecter",
                            style: .primary,
                            isLoading: viewModel.isLoading
                        ) {
                            Task {
                                await viewModel.login()
                            }
                        }
                        .disabled(!viewModel.isLoginValid)
                        .padding(.top, Theme.Spacing.sm)
                    }
                    .padding(.horizontal, Theme.Spacing.xl)

                    // Divider
                    HStack {
                        Rectangle()
                            .frame(height: 1)
                            .foregroundColor(Theme.Colors.divider)
                        Text("ou")
                            .font(Theme.Typography.caption())
                            .foregroundColor(Theme.Colors.textSecondary)
                        Rectangle()
                            .frame(height: 1)
                            .foregroundColor(Theme.Colors.divider)
                    }
                    .padding(.horizontal, Theme.Spacing.xl)

                    // Sign Up Button
                    Button {
                        showSignup = true
                    } label: {
                        Text("Créer un compte")
                            .font(Theme.Typography.body(.semibold))
                            .foregroundColor(Theme.Colors.primary)
                    }

                    Spacer()
                }
            }
            .dismissKeyboardOnTap()
            .errorAlert(error: $viewModel.error)
            .sheet(isPresented: $showSignup) {
                SignupView()
            }
            .sheet(isPresented: $showForgotPassword) {
                ForgotPasswordView()
            }
        }
    }
}

// MARK: - Preview

#Preview {
    LoginView()
}
