//
//  WelcomeSheet.swift
//  EasyCo
//
//  Bottom sheet avec formulaire signup/login intégré
//

import SwiftUI

// MARK: - Welcome Sheet with Integrated Form

struct WelcomeSheet: View {
    @Binding var isPresented: Bool
    let onCreateAccount: () -> Void
    let onContinueAsGuest: () -> Void

    @StateObject private var viewModel = AuthViewModel()
    @State private var authMode: AuthMode = .signup
    @State private var dragOffset: CGFloat = 0

    enum AuthMode {
        case signup
        case login
    }

    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .bottom) {
                // Background blur
                Color.black.opacity(0.4)
                    .ignoresSafeArea()
                    .onTapGesture {
                        dismissSheet()
                    }

                // Bottom Sheet Content
                VStack(spacing: 0) {
                    // Compact Header with Logo
                    compactHeader

                    // Segmented Control
                    authModeToggle
                        .padding(.top, 16)
                        .padding(.horizontal, 20)

                    // Form Content
                    ScrollView(showsIndicators: false) {
                        VStack(spacing: 20) {
                            // Google Sign-in
                            googleSignInButton

                            // Divider
                            orDivider

                            // Form Fields
                            if authMode == .signup {
                                signupForm
                            } else {
                                loginForm
                            }

                            // CTA Button
                            ctaButton

                            // Continue as Guest
                            guestButton
                        }
                        .padding(.horizontal, 20)
                        .padding(.top, 24)
                        .padding(.bottom, 40)
                    }
                    .background(Color.white)
                }
                .frame(height: geometry.size.height * 0.75) // 75% of screen height
                .clipShape(RoundedRectangle(cornerRadius: 40)) // Web app style
                .shadow(color: .black.opacity(0.2), radius: 20, x: 0, y: -10)
                .offset(y: dragOffset)
                .gesture(
                    DragGesture()
                        .onChanged { value in
                            if value.translation.height > 0 {
                                dragOffset = value.translation.height
                            }
                        }
                        .onEnded { value in
                            if value.translation.height > 150 {
                                dismissSheet()
                            } else {
                                withAnimation(.spring(response: 0.3)) {
                                    dragOffset = 0
                                }
                            }
                        }
                )
            }
        }
        .ignoresSafeArea()
    }

    // MARK: - Compact Header

    private var compactHeader: some View {
        ZStack {
            // Gradient background
            LinearGradient(
                colors: [
                    Color(hex: "FFA040").opacity(0.15),
                    Color(hex: "FFB85C").opacity(0.12),
                    Color(hex: "FFD080").opacity(0.15)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            VStack(spacing: 12) {
                // Drag Indicator
                Capsule()
                    .fill(Color(hex: "D1D5DB").opacity(0.6))
                    .frame(width: 40, height: 5)
                    .padding(.top, 12)

                // Logo officiel
                Image("HouseIcon")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 80, height: 80)
                    .padding(.bottom, 8)
            }
        }
        .frame(height: 100)
    }

    // MARK: - Auth Mode Toggle

    private var authModeToggle: some View {
        HStack(spacing: 0) {
            // Signup Tab
            Button(action: {
                withAnimation(.spring(response: 0.3)) {
                    authMode = .signup
                }
            }) {
                Text("Bienvenue")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(authMode == .signup ? .white : Color(hex: "6B7280"))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(
                        authMode == .signup
                            ? LinearGradient(
                                colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                            : LinearGradient(
                                colors: [Color(hex: "F3F4F6"), Color(hex: "F3F4F6")],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                    )
                    .clipShape(Capsule()) // Web app pill style
            }

            Spacer().frame(width: 8)

            // Login Tab
            Button(action: {
                withAnimation(.spring(response: 0.3)) {
                    authMode = .login
                }
            }) {
                Text("Rejoignez EasyCo")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(authMode == .login ? .white : Color(hex: "6B7280"))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(
                        authMode == .login
                            ? LinearGradient(
                                colors: [Color(hex: "6E56CF"), Color(hex: "9B8AE3")],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                            : LinearGradient(
                                colors: [Color(hex: "F3F4F6"), Color(hex: "F3F4F6")],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                    )
                    .clipShape(Capsule()) // Web app pill style
            }
        }
        .padding(4)
        .background(Color(hex: "F3F4F6"))
        .clipShape(Capsule()) // Web app pill style
    }

    // MARK: - Google Sign-in Button

    private var googleSignInButton: some View {
        Button(action: {
            // TODO: Implement Google Sign-in
            print("Google Sign-in tapped")
        }) {
            HStack(spacing: 12) {
                Text("G")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(.white)
                    .frame(width: 24, height: 24)
                    .background(
                        LinearGradient(
                            colors: [Color(hex: "4285F4"), Color(hex: "34A853")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .clipShape(Circle())

                Text(authMode == .signup ? "Sign up with Google" : "Sign in with Google")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(Color(hex: "374151"))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .background(Color.white)
            .overlay(
                Capsule()
                    .stroke(Color(hex: "6E56CF"), lineWidth: 2)
            )
            .clipShape(Capsule()) // Web app pill style
        }
        .disabled(viewModel.isLoading)
    }

    // MARK: - Or Divider

    private var orDivider: some View {
        HStack(spacing: 12) {
            Rectangle()
                .fill(Color(hex: "E5E7EB"))
                .frame(height: 1)

            Text("Ou continuer avec email")
                .font(.system(size: 13))
                .foregroundColor(Color(hex: "9CA3AF"))

            Rectangle()
                .fill(Color(hex: "E5E7EB"))
                .frame(height: 1)
        }
    }

    // MARK: - Signup Form

    private var signupForm: some View {
        VStack(spacing: 16) {
            // Full Name
            VStack(alignment: .leading, spacing: 6) {
                Text("Nom complet")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "374151"))

                TextField("Jean Dupont", text: $viewModel.fullName)
                    .textContentType(.name)
                    .padding()
                    .background(Color(hex: "F9FAFB"))
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                    )
            }

            // Email
            VStack(alignment: .leading, spacing: 6) {
                Text("Adresse e-mail")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "374151"))

                TextField("votre@email.com", text: $viewModel.email)
                    .textContentType(.emailAddress)
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)
                    .padding()
                    .background(Color(hex: "F9FAFB"))
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(
                                viewModel.emailError != nil ? Color.red : Color(hex: "E5E7EB"),
                                lineWidth: 1
                            )
                    )

                if let error = viewModel.emailError {
                    Text(error)
                        .font(.system(size: 12))
                        .foregroundColor(.red)
                }
            }

            // Password
            VStack(alignment: .leading, spacing: 6) {
                Text("Mot de passe")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "374151"))

                SecureField("Entrez votre mot de passe", text: $viewModel.password)
                    .textContentType(.newPassword)
                    .padding()
                    .background(Color(hex: "F9FAFB"))
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                    )
            }

            // Confirm Password
            VStack(alignment: .leading, spacing: 6) {
                Text("Confirmer le mot de passe")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "374151"))

                SecureField("Confirmez votre mot de passe", text: $viewModel.confirmPassword)
                    .textContentType(.newPassword)
                    .padding()
                    .background(Color(hex: "F9FAFB"))
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(
                                viewModel.confirmPasswordError != nil ? Color.red : Color(hex: "E5E7EB"),
                                lineWidth: 1
                            )
                    )

                if let error = viewModel.confirmPasswordError {
                    Text(error)
                        .font(.system(size: 12))
                        .foregroundColor(.red)
                }
            }

            // Password Requirements
            if !viewModel.password.isEmpty {
                passwordRequirements
            }
        }
    }

    // MARK: - Password Requirements

    private var passwordRequirements: some View {
        VStack(alignment: .leading, spacing: 8) {
            PasswordRequirement(
                text: "Au moins 8 caractères",
                isMet: viewModel.password.count >= 8
            )
            PasswordRequirement(
                text: "Une majuscule",
                isMet: viewModel.password.range(of: "[A-Z]", options: .regularExpression) != nil
            )
            PasswordRequirement(
                text: "Une minuscule",
                isMet: viewModel.password.range(of: "[a-z]", options: .regularExpression) != nil
            )
            PasswordRequirement(
                text: "Un chiffre",
                isMet: viewModel.password.range(of: "[0-9]", options: .regularExpression) != nil
            )
        }
        .padding(12)
        .background(Color(hex: "F9FAFB"))
        .cornerRadius(12)
    }

    // MARK: - Login Form

    private var loginForm: some View {
        VStack(spacing: 16) {
            // Email
            VStack(alignment: .leading, spacing: 6) {
                Text("Adresse e-mail")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "374151"))

                TextField("votre@email.com", text: $viewModel.email)
                    .textContentType(.emailAddress)
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)
                    .padding()
                    .background(Color(hex: "F9FAFB"))
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                    )
            }

            // Password
            VStack(alignment: .leading, spacing: 6) {
                Text("Mot de passe")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "374151"))

                SecureField("Entrez votre mot de passe", text: $viewModel.password)
                    .textContentType(.password)
                    .padding()
                    .background(Color(hex: "F9FAFB"))
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                    )
            }
        }
    }

    // MARK: - CTA Button

    private var ctaButton: some View {
        Button(action: {
            Task {
                if authMode == .signup {
                    await viewModel.signUp()
                } else {
                    await viewModel.login()
                }
            }
        }) {
            HStack(spacing: 8) {
                if viewModel.isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                } else {
                    Text(authMode == .signup ? "Créer un compte" : "Se connecter")
                        .font(.system(size: 17, weight: .semibold))
                }
            }
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(
                authMode == .signup
                    ? LinearGradient(
                        colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                    : LinearGradient(
                        colors: [Color(hex: "6E56CF"), Color(hex: "9B8AE3")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
            )
            .cornerRadius(999)
            .shadow(
                color: (authMode == .signup ? Color(hex: "FFA040") : Color(hex: "6E56CF")).opacity(0.3),
                radius: 8,
                x: 0,
                y: 4
            )
        }
        .disabled(!isFormValid || viewModel.isLoading)
        .opacity(isFormValid ? 1.0 : 0.5)
        .padding(.top, 8)
    }

    // MARK: - Guest Button

    private var guestButton: some View {
        Button(action: {
            onContinueAsGuest()
            dismissSheet()
        }) {
            Text("Continuer en invité")
                .font(.system(size: 15, weight: .medium))
                .foregroundColor(Color(hex: "6B7280"))
                .underline()
        }
        .padding(.top, 8)
    }

    // MARK: - Helpers

    private var isFormValid: Bool {
        if authMode == .signup {
            return viewModel.isSignupValid
        } else {
            return viewModel.isLoginValid
        }
    }

    private func dismissSheet() {
        withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
            dragOffset = UIScreen.main.bounds.height
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            isPresented = false
            dragOffset = 0
        }
    }
}

// MARK: - Password Requirement Row

struct PasswordRequirement: View {
    let text: String
    let isMet: Bool

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: isMet ? "checkmark.circle.fill" : "xmark.circle")
                .font(.system(size: 14))
                .foregroundColor(isMet ? Color(hex: "10B981") : Color(hex: "EF4444"))

            Text(text)
                .font(.system(size: 13))
                .foregroundColor(Color(hex: "6B7280"))
        }
    }
}

// MARK: - Preview

struct WelcomeSheet_Previews: PreviewProvider {
    static var previews: some View {
        WelcomeSheet(
            isPresented: .constant(true),
            onCreateAccount: {
                print("Create account")
            },
            onContinueAsGuest: {
                print("Continue as guest")
            }
        )
    }
}
