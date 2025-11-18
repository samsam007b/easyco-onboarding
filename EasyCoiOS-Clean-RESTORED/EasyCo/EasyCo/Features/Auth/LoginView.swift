import SwiftUI

// MARK: - Login View (Web App Replica)

struct LoginView: View {
    @StateObject private var viewModel = AuthViewModel()
    @State private var isLoginMode = true
    @State private var showForgotPassword = false

    var body: some View {
        NavigationStack {
            ZStack {
                // Gradient background matching web app
                LinearGradient(
                    colors: [
                        Color(hex: "F3E5F5"), // purple-50
                        Color(hex: "FFF9E6")  // yellow-50
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 0) {
                        // Back to home link
                        HStack {
                            Button(action: {}) {
                                HStack(spacing: 6) {
                                    Image(systemName: "chevron.left")
                                        .font(.system(size: 14, weight: .semibold))
                                    Text("Retour à l'accueil")
                                        .font(.system(size: 15, weight: .medium))
                                }
                                .foregroundColor(Color(hex: "4A148C"))
                            }
                            Spacer()
                        }
                        .padding(.horizontal, 24)
                        .padding(.top, 20)

                        Spacer()
                            .frame(height: 40)

                        // White card container
                        VStack(spacing: 0) {
                            // Logo and title
                            VStack(spacing: 16) {
                                Image(systemName: "house.fill")
                                    .font(.system(size: 56, weight: .bold))
                                    .foregroundColor(Color(hex: "4A148C"))

                                Text("EasyCo")
                                    .font(.system(size: 32, weight: .bold))
                                    .foregroundColor(Color(hex: "4A148C"))

                                Text(isLoginMode ? "Connectez-vous à votre compte" : "Créez votre compte")
                                    .font(.system(size: 16))
                                    .foregroundColor(.gray)
                                    .multilineTextAlignment(.center)
                            }
                            .padding(.bottom, 32)

                            // Login/Signup toggle
                            HStack(spacing: 0) {
                                Button {
                                    withAnimation(.easeInOut(duration: 0.2)) {
                                        isLoginMode = true
                                    }
                                } label: {
                                    Text("Connexion")
                                        .font(.system(size: 15, weight: .semibold))
                                        .foregroundColor(isLoginMode ? .white : .gray)
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 12)
                                        .background(
                                            isLoginMode ?
                                            Color(hex: "4A148C") :
                                            Color.gray.opacity(0.1)
                                        )
                                        .cornerRadius(12)
                                }

                                Button {
                                    withAnimation(.easeInOut(duration: 0.2)) {
                                        isLoginMode = false
                                    }
                                } label: {
                                    Text("Inscription")
                                        .font(.system(size: 15, weight: .semibold))
                                        .foregroundColor(!isLoginMode ? .white : .gray)
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 12)
                                        .background(
                                            !isLoginMode ?
                                            Color(hex: "4A148C") :
                                            Color.gray.opacity(0.1)
                                        )
                                        .cornerRadius(12)
                                }
                            }
                            .padding(4)
                            .background(Color.gray.opacity(0.1))
                            .cornerRadius(12)
                            .padding(.bottom, 24)

                            // Google OAuth button
                            Button {
                                // TODO: Implement Google OAuth
                            } label: {
                                HStack(spacing: 12) {
                                    Image(systemName: "g.circle.fill")
                                        .font(.system(size: 20))
                                    Text("Continuer avec Google")
                                        .font(.system(size: 15, weight: .semibold))
                                }
                                .foregroundColor(.black.opacity(0.8))
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(Color.white)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(Color.gray.opacity(0.3), lineWidth: 2)
                                )
                                .cornerRadius(12)
                            }
                            .padding(.bottom, 24)

                            // Divider
                            HStack(spacing: 16) {
                                Rectangle()
                                    .frame(height: 1)
                                    .foregroundColor(.gray.opacity(0.3))
                                Text("ou")
                                    .font(.system(size: 14))
                                    .foregroundColor(.gray)
                                Rectangle()
                                    .frame(height: 1)
                                    .foregroundColor(.gray.opacity(0.3))
                            }
                            .padding(.bottom, 24)

                            // Email field with icon
                            HStack(spacing: 12) {
                                Image(systemName: "envelope.fill")
                                    .font(.system(size: 18))
                                    .foregroundColor(.gray)
                                    .frame(width: 24)

                                TextField("Adresse email", text: $viewModel.email)
                                    .textContentType(.emailAddress)
                                    .keyboardType(.emailAddress)
                                    .autocapitalization(.none)
                                    .font(.system(size: 15))
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 14)
                            .background(Color.white)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                            )
                            .cornerRadius(12)
                            .padding(.bottom, 16)

                            // Password field with icon
                            HStack(spacing: 12) {
                                Image(systemName: "lock.fill")
                                    .font(.system(size: 18))
                                    .foregroundColor(.gray)
                                    .frame(width: 24)

                                SecureField("Mot de passe", text: $viewModel.password)
                                    .textContentType(.password)
                                    .font(.system(size: 15))
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 14)
                            .background(Color.white)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                            )
                            .cornerRadius(12)
                            .padding(.bottom, 8)

                            // Forgot password
                            if isLoginMode {
                                Button("Mot de passe oublié ?") {
                                    showForgotPassword = true
                                }
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(Color(hex: "4A148C"))
                                .frame(maxWidth: .infinity, alignment: .trailing)
                                .padding(.bottom, 24)
                            } else {
                                Spacer()
                                    .frame(height: 24)
                            }

                            // Submit button
                            Button {
                                _Concurrency.Task {
                                    if isLoginMode {
                                        await viewModel.login()
                                    } else {
                                        // TODO: Implement signup
                                    }
                                }
                            } label: {
                                HStack {
                                    if viewModel.isLoading {
                                        ProgressView()
                                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                            .frame(width: 20, height: 20)
                                    }
                                    Text(isLoginMode ? "Se connecter" : "Créer un compte")
                                        .font(.system(size: 16, weight: .semibold))
                                }
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(
                                    LinearGradient(
                                        colors: [Color(hex: "4A148C"), Color(hex: "6A1B9A")],
                                        startPoint: .leading,
                                        endPoint: .trailing
                                    )
                                )
                                .cornerRadius(12)
                            }
                            .disabled(!viewModel.isLoginValid || viewModel.isLoading)
                            .opacity((viewModel.isLoginValid && !viewModel.isLoading) ? 1 : 0.6)

                            // Terms text for signup
                            if !isLoginMode {
                                Text("En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité")
                                    .font(.system(size: 12))
                                    .foregroundColor(.gray)
                                    .multilineTextAlignment(.center)
                                    .padding(.top, 16)
                            }
                        }
                        .padding(32)
                        .background(Color.white)
                        .cornerRadius(24)
                        .shadow(color: .black.opacity(0.1), radius: 20, x: 0, y: 10)
                        .padding(.horizontal, 20)

                        Spacer()
                            .frame(height: 40)
                    }
                }
                .dismissKeyboardOnTap()
            }
            .errorAlert(error: $viewModel.error)
            .sheet(isPresented: $showForgotPassword) {
                ForgotPasswordView()
            }
        }
    }
}

// MARK: - Preview

