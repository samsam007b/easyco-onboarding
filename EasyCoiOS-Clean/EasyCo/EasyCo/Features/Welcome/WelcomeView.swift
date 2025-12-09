//
//  WelcomeView.swift
//  EasyCo
//
//  Vue d'accueil avec sheet glassmorphism glissante
//  Permet de naviguer vers le mode Guest ou de se connecter/inscrire
//

import SwiftUI

// MARK: - Welcome View

struct WelcomeView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var sheetOffset: CGFloat = 0
    @State private var isDragging = false
    @State private var showGuestMode = false
    @State private var showLoginSheet = false
    @State private var showSignupSheet = false

    // Sheet configuration
    private let sheetHeight: CGFloat = UIScreen.main.bounds.height * 0.65
    private let minSheetHeight: CGFloat = 100
    private let dragThreshold: CGFloat = 150

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Background - Guest Mode View (behind the sheet)
                GuestTabView()
                    .opacity(showGuestMode ? 1 : 0.3)
                    .scaleEffect(showGuestMode ? 1 : 0.95)
                    .blur(radius: showGuestMode ? 0 : 2)

                // Gradient overlay when sheet is visible
                if !showGuestMode {
                    LinearGradient(
                        colors: [
                            Color.black.opacity(0.4),
                            Color.black.opacity(0.1),
                            Color.clear
                        ],
                        startPoint: .bottom,
                        endPoint: .top
                    )
                    .ignoresSafeArea()
                    .allowsHitTesting(false)
                }

                // Connexion button above tab bar (rectangle style)
                if showGuestMode {
                    VStack {
                        Spacer()

                        Button(action: {
                            withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
                                showGuestMode = false
                            }
                            HapticFeedback.light()
                        }) {
                            HStack(spacing: 10) {
                                Image(systemName: "person.circle.fill")
                                    .font(.system(size: 18, weight: .semibold))

                                Text("Connexion")
                                    .font(.system(size: 16, weight: .semibold))
                            }
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 16)
                            .background(
                                ZStack {
                                    // Gradient signature EasyCo - Diagonal
                                    LinearGradient(
                                        colors: [
                                            Color(hex: "A394E6"),  // Mauve
                                            Color(hex: "C99FD8"),
                                            Color(hex: "E8A8C8"),
                                            Color(hex: "FFB1B8"),
                                            Color(hex: "FFBAA0"),
                                            Color(hex: "FFC388"),
                                            Color(hex: "FFCC70"),
                                            Color(hex: "FFD558")   // Jaune
                                        ],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )

                                    // Frosted overlay subtil
                                    Color.white.opacity(0.08)
                                        .background(.ultraThinMaterial.opacity(0.25))
                                }
                            )
                            .cornerRadius(16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color.white.opacity(0.5), lineWidth: 1.5)
                            )
                            .shadow(
                                color: Color(hex: "A394E6").opacity(0.35),
                                radius: 16,
                                x: 0,
                                y: 8
                            )
                        }
                        .padding(.horizontal, 20)
                        .padding(.bottom, 96) // Position just above tab bar
                    }
                }

                // Glassmorphism Auth Sheet
                VStack(spacing: 0) {
                    Spacer()

                    AuthSheetView(
                        onLogin: { showLoginSheet = true },
                        onSignup: { showSignupSheet = true },
                        onExploreGuest: {
                            withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
                                showGuestMode = true
                            }
                        }
                    )
                    .frame(height: sheetHeight)
                    .offset(y: showGuestMode ? sheetHeight + 100 : sheetOffset)
                    .gesture(
                        DragGesture()
                            .onChanged { value in
                                isDragging = true
                                // Only allow dragging down
                                if value.translation.height > 0 {
                                    sheetOffset = value.translation.height
                                }
                            }
                            .onEnded { value in
                                isDragging = false
                                if value.translation.height > dragThreshold {
                                    // Show guest mode
                                    withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
                                        showGuestMode = true
                                        sheetOffset = 0
                                    }
                                    HapticFeedback.medium()
                                } else {
                                    // Snap back
                                    withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                                        sheetOffset = 0
                                    }
                                }
                            }
                    )
                }
                .ignoresSafeArea(.container, edges: .bottom)

            }
        }
        .sheet(isPresented: $showLoginSheet) {
            LoginSheetView(isPresented: $showLoginSheet)
                .presentationDetents([.large])
                .presentationDragIndicator(.visible)
        }
        .sheet(isPresented: $showSignupSheet) {
            SignupSheetView(isPresented: $showSignupSheet)
                .presentationDetents([.large])
                .presentationDragIndicator(.visible)
        }
    }
}

// MARK: - Auth Sheet View (Glassmorphism)

struct AuthSheetView: View {
    let onLogin: () -> Void
    let onSignup: () -> Void
    let onExploreGuest: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            // Drag indicator
            Capsule()
                .fill(Color.white.opacity(0.5))
                .frame(width: 40, height: 5)
                .padding(.top, 12)
                .padding(.bottom, 20)

            // Content
            VStack(spacing: 24) {
                // Logo and title
                VStack(spacing: 16) {
                    // Logo avec glow subtil statique
                    ZStack {
                        // Glow statique orange
                        Circle()
                            .fill(
                                RadialGradient(
                                    colors: [
                                        Color(hex: "FFA040").opacity(0.3),
                                        Color.clear
                                    ],
                                    center: .center,
                                    startRadius: 0,
                                    endRadius: 60
                                )
                            )
                            .frame(width: 120, height: 120)
                            .blur(radius: 15)

                        // Logo officiel EasyCo
                        Image("EasyCoHouseIcon")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 80, height: 80)
                    }

                    VStack(spacing: 8) {
                        Text("EasyCo")
                            .font(.system(size: 36, weight: .bold))
                            .foregroundColor(.white)

                        Text("La colocation simplifiée")
                            .font(.system(size: 17))
                            .foregroundColor(.white.opacity(0.8))
                    }
                }

                Spacer()
                    .frame(height: 16)

                // Auth buttons
                VStack(spacing: 12) {
                    // Sign up button (Primary)
                    Button(action: onSignup) {
                        HStack(spacing: 10) {
                            Image(systemName: "person.badge.plus")
                                .font(.system(size: 18, weight: .semibold))
                            Text("Créer un compte")
                                .font(.system(size: 17, weight: .semibold))
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 56)
                        .background(
                            LinearGradient(
                                colors: [
                                    Color(hex: "FF6F3C"),
                                    Color(hex: "FFD249")
                                ],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(16)
                        .shadow(color: Color(hex: "FF6F3C").opacity(0.4), radius: 12, x: 0, y: 6)
                    }

                    // Login button (Secondary - Glass)
                    Button(action: onLogin) {
                        HStack(spacing: 10) {
                            Image(systemName: "person.fill")
                                .font(.system(size: 18, weight: .semibold))
                            Text("Se connecter")
                                .font(.system(size: 17, weight: .semibold))
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 56)
                        .background(
                            RoundedRectangle(cornerRadius: 16)
                                .fill(Color.white.opacity(0.2))
                                .background(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color.white.opacity(0.3), lineWidth: 1)
                                )
                        )
                    }
                }
                .padding(.horizontal, 24)

                // Divider
                HStack(spacing: 16) {
                    Rectangle()
                        .frame(height: 1)
                        .foregroundColor(.white.opacity(0.2))
                    Text("ou")
                        .font(.system(size: 14))
                        .foregroundColor(.white.opacity(0.6))
                    Rectangle()
                        .frame(height: 1)
                        .foregroundColor(.white.opacity(0.2))
                }
                .padding(.horizontal, 24)
                .padding(.vertical, 8)

                // Guest mode button
                Button(action: onExploreGuest) {
                    HStack(spacing: 8) {
                        Text("Explorer en mode invité")
                            .font(.system(size: 15, weight: .medium))
                        Image(systemName: "arrow.down")
                            .font(.system(size: 14, weight: .semibold))
                    }
                    .foregroundColor(.white.opacity(0.8))
                }

                // Swipe hint
                VStack(spacing: 8) {
                    Image(systemName: "chevron.compact.down")
                        .font(.system(size: 28, weight: .light))
                        .foregroundColor(.white.opacity(0.4))

                    Text("Glissez vers le bas pour explorer")
                        .font(.system(size: 13))
                        .foregroundColor(.white.opacity(0.4))
                }
                .padding(.top, 16)
                .padding(.bottom, 32)
            }
        }
        .frame(maxWidth: .infinity)
        .background(
            ZStack {
                // Dégradé signature EasyCo - Diagonale (comme Hero web app)
                // Mauve (top-left) → Rose → Orange → Jaune (bottom-right)
                LinearGradient(
                    colors: [
                        Color(hex: "A394E6"),  // Mauve clair (top-left)
                        Color(hex: "C99FD8"),  // Mauve-rose
                        Color(hex: "E8A8C8"),  // Rose-saumon
                        Color(hex: "FFB1B8"),  // Rose-orange
                        Color(hex: "FFBAA0"),  // Saumon
                        Color(hex: "FFC388"),  // Orange clair
                        Color(hex: "FFCC70"),  // Orange-jaune
                        Color(hex: "FFD558")   // Jaune doré (bottom-right)
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .opacity(0.75)  // Plus de transparence pour voir derrière

                // Glassmorphism - verre givré très léger
                Rectangle()
                    .fill(.ultraThinMaterial)
                    .opacity(0.35)  // Un peu plus opaque pour l'effet verre

                // Border subtile blanche
                RoundedCorner(radius: 32, corners: [.topLeft, .topRight])
                    .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
            }
        )
        .clipShape(
            RoundedCorner(radius: 32, corners: [.topLeft, .topRight])
        )
    }
}

// MARK: - Pull Up Indicator

struct PullUpIndicator: View {
    let action: () -> Void

    @State private var isAnimating = false

    var body: some View {
        Button(action: action) {
            VStack(spacing: 6) {
                Image(systemName: "chevron.compact.up")
                    .font(.system(size: 24, weight: .semibold))
                    .offset(y: isAnimating ? -3 : 0)

                Text("Connexion")
                    .font(.system(size: 12, weight: .medium))
            }
            .foregroundColor(.white)
            .padding(.horizontal, 20)
            .padding(.vertical, 12)
            .background(
                Capsule()
                    .fill(
                        LinearGradient(
                            colors: [
                                Color(hex: "6E56CF"),
                                Color(hex: "4A148C")
                            ],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
                    .shadow(color: Color(hex: "6E56CF").opacity(0.5), radius: 10, x: 0, y: 4)
            )
        }
        .onAppear {
            withAnimation(.easeInOut(duration: 1).repeatForever(autoreverses: true)) {
                isAnimating = true
            }
        }
    }
}

// MARK: - Login Sheet View

struct LoginSheetView: View {
    @Binding var isPresented: Bool
    @StateObject private var viewModel = AuthViewModel()
    @State private var animateGradient = false

    var body: some View {
        NavigationStack {
            ZStack {
                // Glassmorphism Background
                ZStack {
                    // Signature gradient background (8 colors diagonal: Mauve → Jaune)
                    LinearGradient(
                        colors: [
                            Color(hex: "A394E6"),  // Mauve
                            Color(hex: "C99FD8"),
                            Color(hex: "E8A8C8"),
                            Color(hex: "FFB1B8"),
                            Color(hex: "FFBAA0"),
                            Color(hex: "FFC388"),
                            Color(hex: "FFCC70"),
                            Color(hex: "FFD558")   // Jaune
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )

                    // Glassmorphism overlay
                    Rectangle()
                        .fill(.ultraThinMaterial)
                        .opacity(0.3)

                    // Decorative gradient blobs
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [
                                    Color(hex: "FF6F3C").opacity(0.3),
                                    Color.clear
                                ],
                                center: .center,
                                startRadius: 0,
                                endRadius: 150
                            )
                        )
                        .frame(width: 300, height: 300)
                        .offset(x: 120, y: -100)
                        .blur(radius: 40)

                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [
                                    Color(hex: "FFD249").opacity(0.25),
                                    Color.clear
                                ],
                                center: .center,
                                startRadius: 0,
                                endRadius: 120
                            )
                        )
                        .frame(width: 240, height: 240)
                        .offset(x: -100, y: 200)
                        .blur(radius: 30)

                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [
                                    Color(hex: "6E56CF").opacity(0.4),
                                    Color.clear
                                ],
                                center: .center,
                                startRadius: 0,
                                endRadius: 100
                            )
                        )
                        .frame(width: 200, height: 200)
                        .offset(x: 80, y: 350)
                        .blur(radius: 25)
                }
                .ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 32) {
                        // Logo with glow effect
                        VStack(spacing: 16) {
                            ZStack {
                                Circle()
                                    .fill(
                                        LinearGradient(
                                            colors: [
                                                Color(hex: "6E56CF").opacity(0.3),
                                                Color(hex: "FF6F3C").opacity(0.3),
                                                Color(hex: "FFD249").opacity(0.3)
                                            ],
                                            startPoint: animateGradient ? .topLeading : .bottomTrailing,
                                            endPoint: animateGradient ? .bottomTrailing : .topLeading
                                        )
                                    )
                                    .frame(width: 100, height: 100)
                                    .blur(radius: 20)

                                Image("EasyCoHouseIcon")
                                    .resizable()
                                    .scaledToFit()
                                    .frame(width: 80, height: 80)
                            }
                            .onAppear {
                                withAnimation(.easeInOut(duration: 3).repeatForever(autoreverses: true)) {
                                    animateGradient = true
                                }
                            }

                            Text("Connexion")
                                .font(.system(size: 28, weight: .bold))
                                .foregroundColor(.white)

                            Text("Heureux de vous revoir !")
                                .font(.system(size: 16))
                                .foregroundColor(.white.opacity(0.8))
                        }
                        .padding(.top, 40)

                        // Form with glass effect
                        VStack(spacing: 16) {
                            // Email
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Email")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.white.opacity(0.9))

                                HStack(spacing: 12) {
                                    Image(systemName: "envelope.fill")
                                        .foregroundColor(.white.opacity(0.6))
                                    TextField("votre@email.com", text: $viewModel.email)
                                        .textContentType(.emailAddress)
                                        .keyboardType(.emailAddress)
                                        .autocapitalization(.none)
                                        .foregroundColor(.white)
                                }
                                .padding(16)
                                .background(Color.white.opacity(0.15))
                                .cornerRadius(16)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color.white.opacity(0.3), lineWidth: 1)
                                )
                            }

                            // Password
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Mot de passe")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.white.opacity(0.9))

                                HStack(spacing: 12) {
                                    Image(systemName: "lock.fill")
                                        .foregroundColor(.white.opacity(0.6))
                                    SecureField("••••••••", text: $viewModel.password)
                                        .textContentType(.password)
                                        .foregroundColor(.white)
                                }
                                .padding(16)
                                .background(Color.white.opacity(0.15))
                                .cornerRadius(16)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color.white.opacity(0.3), lineWidth: 1)
                                )
                            }

                            // Forgot password
                            HStack {
                                Spacer()
                                Button("Mot de passe oublié ?") {
                                    // TODO: Forgot password
                                }
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.white.opacity(0.8))
                            }
                        }
                        .padding(.horizontal, 24)

                        // Login button with gradient
                        Button {
                            Task {
                                await viewModel.login()
                                if !viewModel.showError {
                                    isPresented = false
                                }
                            }
                        } label: {
                            HStack {
                                if viewModel.isLoading {
                                    ProgressView()
                                        .tint(.white)
                                }
                                Text("Se connecter")
                                    .font(.system(size: 17, weight: .semibold))
                            }
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 56)
                            .background(
                                LinearGradient(
                                    colors: [Color(hex: "FF6F3C"), Color(hex: "FFD249")],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .cornerRadius(999)
                            .shadow(color: Color(hex: "FF6F3C").opacity(0.4), radius: 12, x: 0, y: 6)
                        }
                        .disabled(!viewModel.isLoginValid || viewModel.isLoading)
                        .opacity(viewModel.isLoginValid ? 1 : 0.6)
                        .padding(.horizontal, 24)

                        Spacer()
                    }
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        isPresented = false
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 28))
                            .foregroundStyle(.white.opacity(0.6))
                    }
                }
            }
        }
        .errorAlert(error: $viewModel.error)
    }
}

// MARK: - Signup Sheet View

struct SignupSheetView: View {
    @Binding var isPresented: Bool
    @StateObject private var viewModel = AuthViewModel()
    @State private var animateGradient = false

    var body: some View {
        NavigationStack {
            ZStack {
                // Glassmorphism Background (Orange/Coral theme for signup)
                ZStack {
                    // Base gradient - warmer tones for signup
                    LinearGradient(
                        colors: [
                            Color(hex: "FF6F3C").opacity(0.95),
                            Color(hex: "E64A19").opacity(0.98)
                        ],
                        startPoint: .top,
                        endPoint: .bottom
                    )

                    // Glassmorphism overlay
                    Rectangle()
                        .fill(.ultraThinMaterial)
                        .opacity(0.3)

                    // Decorative gradient blobs
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [
                                    Color(hex: "FFD249").opacity(0.35),
                                    Color.clear
                                ],
                                center: .center,
                                startRadius: 0,
                                endRadius: 150
                            )
                        )
                        .frame(width: 300, height: 300)
                        .offset(x: -100, y: -80)
                        .blur(radius: 40)

                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [
                                    Color(hex: "6E56CF").opacity(0.25),
                                    Color.clear
                                ],
                                center: .center,
                                startRadius: 0,
                                endRadius: 120
                            )
                        )
                        .frame(width: 240, height: 240)
                        .offset(x: 120, y: 150)
                        .blur(radius: 30)

                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [
                                    Color(hex: "FF6F3C").opacity(0.4),
                                    Color.clear
                                ],
                                center: .center,
                                startRadius: 0,
                                endRadius: 100
                            )
                        )
                        .frame(width: 200, height: 200)
                        .offset(x: -80, y: 400)
                        .blur(radius: 25)
                }
                .ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 28) {
                        // Logo with glow effect
                        VStack(spacing: 16) {
                            ZStack {
                                Circle()
                                    .fill(
                                        LinearGradient(
                                            colors: [
                                                Color(hex: "FFD249").opacity(0.3),
                                                Color(hex: "FF6F3C").opacity(0.3),
                                                Color(hex: "6E56CF").opacity(0.3)
                                            ],
                                            startPoint: animateGradient ? .topLeading : .bottomTrailing,
                                            endPoint: animateGradient ? .bottomTrailing : .topLeading
                                        )
                                    )
                                    .frame(width: 100, height: 100)
                                    .blur(radius: 20)

                                Image("EasyCoHouseIcon")
                                    .resizable()
                                    .scaledToFit()
                                    .frame(width: 80, height: 80)
                            }
                            .onAppear {
                                withAnimation(.easeInOut(duration: 3).repeatForever(autoreverses: true)) {
                                    animateGradient = true
                                }
                            }

                            Text("Créer un compte")
                                .font(.system(size: 28, weight: .bold))
                                .foregroundColor(.white)

                            Text("Rejoignez la communauté EasyCo")
                                .font(.system(size: 16))
                                .foregroundColor(.white.opacity(0.8))
                        }
                        .padding(.top, 30)

                        // Form with glass effect
                        VStack(spacing: 14) {
                            // Full name
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Nom complet")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.white.opacity(0.9))

                                HStack(spacing: 12) {
                                    Image(systemName: "person.fill")
                                        .foregroundColor(.white.opacity(0.6))
                                    TextField("Jean Dupont", text: $viewModel.fullName)
                                        .textContentType(.name)
                                        .foregroundColor(.white)
                                }
                                .padding(16)
                                .background(Color.white.opacity(0.15))
                                .cornerRadius(16)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color.white.opacity(0.3), lineWidth: 1)
                                )
                            }

                            // Email
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Email")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.white.opacity(0.9))

                                HStack(spacing: 12) {
                                    Image(systemName: "envelope.fill")
                                        .foregroundColor(.white.opacity(0.6))
                                    TextField("votre@email.com", text: $viewModel.email)
                                        .textContentType(.emailAddress)
                                        .keyboardType(.emailAddress)
                                        .autocapitalization(.none)
                                        .foregroundColor(.white)
                                }
                                .padding(16)
                                .background(Color.white.opacity(0.15))
                                .cornerRadius(16)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color.white.opacity(0.3), lineWidth: 1)
                                )
                            }

                            // Password
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Mot de passe")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.white.opacity(0.9))

                                HStack(spacing: 12) {
                                    Image(systemName: "lock.fill")
                                        .foregroundColor(.white.opacity(0.6))
                                    SecureField("Minimum 8 caractères", text: $viewModel.password)
                                        .textContentType(.newPassword)
                                        .foregroundColor(.white)
                                }
                                .padding(16)
                                .background(Color.white.opacity(0.15))
                                .cornerRadius(16)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color.white.opacity(0.3), lineWidth: 1)
                                )
                            }

                            // Confirm Password
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Confirmer le mot de passe")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.white.opacity(0.9))

                                HStack(spacing: 12) {
                                    Image(systemName: "lock.fill")
                                        .foregroundColor(.white.opacity(0.6))
                                    SecureField("Confirmez votre mot de passe", text: $viewModel.confirmPassword)
                                        .textContentType(.newPassword)
                                        .foregroundColor(.white)
                                }
                                .padding(16)
                                .background(Color.white.opacity(0.15))
                                .cornerRadius(16)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color.white.opacity(0.3), lineWidth: 1)
                                )
                            }
                        }
                        .padding(.horizontal, 24)

                        // Signup button with gradient
                        Button {
                            Task {
                                await viewModel.signUp()
                                if !viewModel.showError {
                                    isPresented = false
                                }
                            }
                        } label: {
                            HStack {
                                if viewModel.isLoading {
                                    ProgressView()
                                        .tint(Color(hex: "FF6F3C"))
                                }
                                Text("Créer mon compte")
                                    .font(.system(size: 17, weight: .semibold))
                            }
                            .foregroundColor(Color(hex: "FF6F3C"))
                            .frame(maxWidth: .infinity)
                            .frame(height: 56)
                            .background(Color.white)
                            .cornerRadius(999)
                            .shadow(color: Color.black.opacity(0.2), radius: 12, x: 0, y: 6)
                        }
                        .disabled(!viewModel.isSignupValid || viewModel.isLoading)
                        .opacity(viewModel.isSignupValid ? 1 : 0.6)
                        .padding(.horizontal, 24)

                        // Terms
                        Text("En créant un compte, vous acceptez nos [Conditions d'utilisation](https://easyco.be/terms) et notre [Politique de confidentialité](https://easyco.be/privacy)")
                            .font(.system(size: 12))
                            .foregroundColor(.white.opacity(0.7))
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 24)
                            .tint(.white)

                        Spacer()
                            .frame(height: 20)
                    }
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        isPresented = false
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 28))
                            .foregroundStyle(.white.opacity(0.6))
                    }
                }
            }
        }
        .errorAlert(error: $viewModel.error)
    }
}

// RoundedCorner is defined in View+Extensions.swift

// MARK: - Preview

struct WelcomeView_Previews: PreviewProvider {
    static var previews: some View {
        WelcomeView()
            .environmentObject(AuthManager.shared)
    }
}
