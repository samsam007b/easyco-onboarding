//
//  AuthFlowIntegration.swift
//  EasyCo
//
//  Complete authentication flow integration example
//  Shows how to integrate AuthService with login/register views
//

import SwiftUI

// MARK: - Root App View with Auth State

/// This is the root view that handles authentication state
/// Replace your current App's main view with this pattern
struct AuthRootView: View {
    @StateObject private var authService = AuthService.shared
    @StateObject private var webSocketManager = WebSocketManager.shared

    var body: some View {
        Group {
            if authService.isAuthenticated {
                // User is logged in - show main app
                MainTabView()
                    .transition(.opacity)
            } else {
                // User is not logged in - show auth flow
                AuthNavigationView()
                    .transition(.opacity)
            }
        }
        .animation(.easeInOut(duration: 0.3), value: authService.isAuthenticated)
        .onAppear {
            setupWebSocket()
        }
        .onChange(of: authService.isAuthenticated) { isAuth in
            if isAuth {
                webSocketManager.connect()
            } else {
                webSocketManager.disconnect()
            }
        }
    }

    private func setupWebSocket() {
        if authService.isAuthenticated {
            webSocketManager.connect()
        }
    }
}

// MARK: - Auth Navigation View

struct AuthNavigationView: View {
    @State private var showRegister = false

    var body: some View {
        NavigationStack {
            LoginViewIntegrated(showRegister: $showRegister)
                .navigationDestination(isPresented: $showRegister) {
                    RegisterViewIntegrated(showRegister: $showRegister)
                }
        }
    }
}

// MARK: - Login View Integrated

struct LoginViewIntegrated: View {
    @StateObject private var viewModel = LoginViewModel()
    @Binding var showRegister: Bool

    @FocusState private var focusedField: Field?

    enum Field {
        case email, password
    }

    var body: some View {
        ZStack {
            Theme.Colors.backgroundSecondary
                .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 32) {
                    // Logo & Title
                    header

                    // Form
                    VStack(spacing: 20) {
                        // Email field
                        ModernTextField(
                            text: $viewModel.email,
                            placeholder: "Email",
                            icon: "mail"
                        )
                        .textContentType(.emailAddress)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)
                        .focused($focusedField, equals: .email)
                        .accessibilityIdentifier(AccessibilityID.emailField)

                        // Password field
                        ModernTextField(
                            text: $viewModel.password,
                            placeholder: "Mot de passe",
                            icon: "lock",
                            isSecure: true
                        )
                        .textContentType(.password)
                        .focused($focusedField, equals: .password)
                        .accessibilityIdentifier(AccessibilityID.passwordField)

                        // Forgot password
                        HStack {
                            Spacer()
                            Button("Mot de passe oublié ?") {
                                // TODO: Implement forgot password
                            }
                            .font(Theme.Typography.bodySmall())
                            .foregroundColor(Theme.Colors.primary)
                        }
                    }

                    // Error message
                    if let error = viewModel.error {
                        ErrorBanner(message: error.errorDescription ?? "Erreur de connexion")
                    }

                    // Login button
                    PrimaryButton(
                        title: viewModel.isLoading ? "Connexion..." : "Se connecter",
                        isLoading: viewModel.isLoading,
                        action: {
                            Task {
                                await viewModel.login()
                            }
                        }
                    )
                    .disabled(viewModel.isLoading || !viewModel.canLogin)

                    // Register link
                    HStack(spacing: 4) {
                        Text("Pas encore de compte ?")
                            .font(Theme.Typography.body())
                            .foregroundColor(Theme.Colors.textSecondary)

                        Button("S'inscrire") {
                            showRegister = true
                        }
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.primary)
                    }
                }
                .padding(24)
            }
        }
        .navigationBarHidden(true)
    }

    private var header: some View {
        VStack(spacing: 16) {
            // Logo placeholder
            Circle()
                .fill(Theme.Colors.primaryGradient)
                .frame(width: 80, height: 80)
                .overlay(
                    Image.lucide("home")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 40, height: 40)
                        .foregroundColor(.white)
                )

            VStack(spacing: 8) {
                Text("Bienvenue sur EasyCo")
                    .font(Theme.Typography.title1())
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Trouvez votre logement idéal")
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
            }
        }
    }
}

// MARK: - Login ViewModel

@MainActor
class LoginViewModel: ObservableObject {
    @Published var email = ""
    @Published var password = ""
    @Published var isLoading = false
    @Published var error: AppError?

    private let authService = AuthService.shared

    var canLogin: Bool {
        !email.isEmpty && !password.isEmpty
    }

    func login() async {
        guard canLogin else { return }

        isLoading = true
        error = nil

        do {
            try await authService.login(email: email, password: password)

            // Success - AuthService will update isAuthenticated
            // Navigation happens automatically via RootView

        } catch let apiError as APIError {
            error = apiError.toAppError
            isLoading = false
        } catch {
            self.error = .server
            isLoading = false
        }
    }
}

// MARK: - Register View Integrated

struct RegisterViewIntegrated: View {
    @StateObject private var viewModel = RegisterViewModel()
    @Binding var showRegister: Bool
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ZStack {
            Theme.Colors.backgroundSecondary
                .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    VStack(spacing: 8) {
                        Text("Créer un compte")
                            .font(Theme.Typography.title1())
                            .foregroundColor(Theme.Colors.textPrimary)

                        Text("Rejoignez EasyCo dès aujourd'hui")
                            .font(Theme.Typography.body())
                            .foregroundColor(Theme.Colors.textSecondary)
                    }
                    .padding(.top, 32)

                    // Form
                    VStack(spacing: 16) {
                        ModernTextField(
                            text: $viewModel.firstName,
                            placeholder: "Prénom",
                            icon: "user"
                        )
                        .textContentType(.givenName)

                        ModernTextField(
                            text: $viewModel.lastName,
                            placeholder: "Nom",
                            icon: "user"
                        )
                        .textContentType(.familyName)

                        ModernTextField(
                            text: $viewModel.email,
                            placeholder: "Email",
                            icon: "mail"
                        )
                        .textContentType(.emailAddress)
                        .keyboardType(.emailAddress)
                        .autocapitalization(.none)

                        ModernTextField(
                            text: $viewModel.password,
                            placeholder: "Mot de passe",
                            icon: "lock",
                            isSecure: true
                        )
                        .textContentType(.newPassword)

                        // Role selection
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Je suis...")
                                .font(Theme.Typography.body(.semibold))
                                .foregroundColor(Theme.Colors.textPrimary)

                            ForEach([UserRole.searcher, UserRole.owner], id: \.self) { role in
                                RoleSelectionCard(
                                    role: role,
                                    isSelected: viewModel.selectedRole == role
                                ) {
                                    viewModel.selectedRole = role
                                }
                            }
                        }
                    }

                    // Error message
                    if let error = viewModel.error {
                        ErrorBanner(message: error.errorDescription ?? "Erreur d'inscription")
                    }

                    // Register button
                    PrimaryButton(
                        title: viewModel.isLoading ? "Inscription..." : "S'inscrire",
                        isLoading: viewModel.isLoading,
                        action: {
                            Task {
                                await viewModel.register()
                            }
                        }
                    )
                    .disabled(viewModel.isLoading || !viewModel.canRegister)

                    // Login link
                    HStack(spacing: 4) {
                        Text("Déjà un compte ?")
                            .font(Theme.Typography.body())
                            .foregroundColor(Theme.Colors.textSecondary)

                        Button("Se connecter") {
                            dismiss()
                        }
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.primary)
                    }
                }
                .padding(24)
            }
        }
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button(action: { dismiss() }) {
                    Image.lucide("arrow-left")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 20, height: 20)
                        .foregroundColor(Theme.Colors.textPrimary)
                }
            }
        }
    }
}

// MARK: - Register ViewModel

@MainActor
class RegisterViewModel: ObservableObject {
    @Published var firstName = ""
    @Published var lastName = ""
    @Published var email = ""
    @Published var password = ""
    @Published var selectedRole: UserRole = .searcher
    @Published var isLoading = false
    @Published var error: AppError?

    private let authService = AuthService.shared

    var canRegister: Bool {
        !firstName.isEmpty && !lastName.isEmpty && !email.isEmpty && password.count >= 6
    }

    func register() async {
        guard canRegister else { return }

        isLoading = true
        error = nil

        do {
            try await authService.register(
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                role: selectedRole
            )

            // Success - AuthService will update isAuthenticated

        } catch let apiError as APIError {
            error = apiError.toAppError
            isLoading = false
        } catch {
            self.error = .server
            isLoading = false
        }
    }
}

// MARK: - Supporting Views

struct RoleSelectionCard: View {
    let role: UserRole
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: {
            action()
            Haptic.impact(.light)
        }) {
            HStack(spacing: 16) {
                Image.lucide(role == .searcher ? "search" : "home")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 24, height: 24)
                    .foregroundColor(isSelected ? .white : Theme.Colors.primary)
                    .frame(width: 48, height: 48)
                    .background(isSelected ? Theme.Colors.primary : Theme.Colors.primary.opacity(0.1))
                    .cornerRadius(12)

                VStack(alignment: .leading, spacing: 4) {
                    Text(role.displayName)
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text(role.description)
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)
                }

                Spacer()

                if isSelected {
                    Image.lucide("check-circle")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 20, height: 20)
                        .foregroundColor(Theme.Colors.primary)
                }
            }
            .padding(16)
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(isSelected ? Theme.Colors.primary : Color.clear, lineWidth: 2)
            )
        }
    }
}

struct ErrorBanner: View {
    let message: String

    var body: some View {
        HStack(spacing: 12) {
            Image.lucide("alert-circle")
                .resizable()
                .scaledToFit()
                .frame(width: 20, height: 20)
                .foregroundColor(Theme.Colors.error)

            Text(message)
                .font(Theme.Typography.bodySmall())
                .foregroundColor(Theme.Colors.error)

            Spacer()
        }
        .padding(12)
        .background(Theme.Colors.error.opacity(0.1))
        .cornerRadius(8)
    }
}

// MARK: - UserRole Extension

extension UserRole {
    var displayName: String {
        switch self {
        case .searcher: return "Locataire"
        case .owner: return "Propriétaire"
        case .resident: return "Résident"
        }
    }

    var description: String {
        switch self {
        case .searcher: return "Je cherche un logement"
        case .owner: return "Je loue mon bien"
        case .resident: return "Je suis déjà locataire"
        }
    }
}

// MARK: - Preview

struct AuthFlowIntegration_Previews: PreviewProvider {
    static var previews: some View {
        RootView()
    }
}
