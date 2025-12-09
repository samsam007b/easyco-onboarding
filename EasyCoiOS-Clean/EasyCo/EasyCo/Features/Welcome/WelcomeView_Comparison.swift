//
//  WelcomeView_Comparison.swift
//  EasyCo
//
//  Document de comparaison - 5 variantes de WelcomeView
//  Pour choisir le meilleur design de l'écran d'accueil
//

import SwiftUI

// MARK: - Version 1: Current Purple Gradient (Actuelle)

struct WelcomeView_V1_PurpleGradient: View {
    @State private var showSignupSheet = false
    @State private var showLoginSheet = false
    @State private var showGuestMode = false
    @State private var sheetOffset: CGFloat = 0

    private let sheetHeight: CGFloat = UIScreen.main.bounds.height * 0.65
    private let dragThreshold: CGFloat = 150

    var body: some View {
        ZStack {
            // Background - Guest Mode
            GuestTabView()
                .opacity(showGuestMode ? 1 : 0.3)
                .scaleEffect(showGuestMode ? 1 : 0.95)
                .blur(radius: showGuestMode ? 0 : 2)

            // Gradient overlay
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

            // Bottom Sheet
            VStack {
                Spacer()

                AuthSheetView_V1_Purple(
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
                            if value.translation.height > 0 {
                                sheetOffset = value.translation.height
                            }
                        }
                        .onEnded { value in
                            if value.translation.height > dragThreshold {
                                withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
                                    showGuestMode = true
                                    sheetOffset = 0
                                }
                            } else {
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
}

struct AuthSheetView_V1_Purple: View {
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

            VStack(spacing: 24) {
                // Logo
                Image("IzzIcoHouseIcon")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 80, height: 80)

                VStack(spacing: 8) {
                    Text("EasyCo")
                        .font(.system(size: 36, weight: .bold))
                        .foregroundColor(.white)

                    Text("La colocation simplifiée")
                        .font(.system(size: 17))
                        .foregroundColor(.white.opacity(0.8))
                }

                Spacer().frame(height: 16)

                // Buttons
                VStack(spacing: 12) {
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
                                colors: [Color(hex: "FF6F3C"), Color(hex: "FFD249")],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(16)
                        .shadow(color: Color(hex: "FF6F3C").opacity(0.4), radius: 12, x: 0, y: 6)
                    }

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
                    Rectangle().frame(height: 1).foregroundColor(.white.opacity(0.2))
                    Text("ou").font(.system(size: 14)).foregroundColor(.white.opacity(0.6))
                    Rectangle().frame(height: 1).foregroundColor(.white.opacity(0.2))
                }
                .padding(.horizontal, 24)
                .padding(.vertical, 8)

                Button(action: onExploreGuest) {
                    HStack(spacing: 8) {
                        Text("Explorer en mode invité")
                            .font(.system(size: 15, weight: .medium))
                        Image(systemName: "arrow.down")
                            .font(.system(size: 14, weight: .semibold))
                    }
                    .foregroundColor(.white.opacity(0.8))
                }

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
            LinearGradient(
                colors: [
                    Color(hex: "6E56CF").opacity(0.95),
                    Color(hex: "4A148C").opacity(0.98)
                ],
                startPoint: .top,
                endPoint: .bottom
            )
        )
        .clipShape(RoundedCorner(radius: 32, corners: [.topLeft, .topRight]))
    }
}

// MARK: - Version 2: Glassmorphism Orange Signature ⭐ RECOMMANDÉE

struct WelcomeView_V2_GlassmorphismOrange: View {
    @State private var showSignupSheet = false
    @State private var showLoginSheet = false
    @State private var showGuestMode = false
    @State private var sheetOffset: CGFloat = 0

    private let sheetHeight: CGFloat = UIScreen.main.bounds.height * 0.65
    private let dragThreshold: CGFloat = 150

    var body: some View {
        ZStack {
            // Background - Guest Mode (plus visible)
            GuestTabView()
                .opacity(showGuestMode ? 1 : 0.5)
                .scaleEffect(showGuestMode ? 1 : 0.98)
                .blur(radius: showGuestMode ? 0 : 1)

            // Gradient overlay subtil
            if !showGuestMode {
                LinearGradient(
                    colors: [
                        Color.black.opacity(0.2),
                        Color.clear
                    ],
                    startPoint: .bottom,
                    endPoint: .top
                )
                .ignoresSafeArea()
                .allowsHitTesting(false)
            }

            // Bottom Sheet GLASSMORPHISM
            VStack {
                Spacer()

                AuthSheetView_V2_Glass(
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
                            if value.translation.height > 0 {
                                sheetOffset = value.translation.height
                            }
                        }
                        .onEnded { value in
                            if value.translation.height > dragThreshold {
                                withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
                                    showGuestMode = true
                                    sheetOffset = 0
                                }
                            } else {
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
}

struct AuthSheetView_V2_Glass: View {
    let onLogin: () -> Void
    let onSignup: () -> Void
    let onExploreGuest: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            // Drag indicator
            Capsule()
                .fill(Color.white.opacity(0.6))
                .frame(width: 40, height: 5)
                .padding(.top, 12)
                .padding(.bottom, 20)

            VStack(spacing: 24) {
                // Logo avec glow orange
                ZStack {
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [
                                    Color(hex: "FFA040").opacity(0.4),
                                    Color.clear
                                ],
                                center: .center,
                                startRadius: 0,
                                endRadius: 60
                            )
                        )
                        .frame(width: 120, height: 120)
                        .blur(radius: 20)

                    Image("IzzIcoHouseIcon")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 90, height: 90)
                }

                VStack(spacing: 8) {
                    Text("EasyCo")
                        .font(.system(size: 38, weight: .bold))
                        .foregroundColor(.white)

                    Text("La colocation simplifiée")
                        .font(.system(size: 17))
                        .foregroundColor(.white.opacity(0.9))
                }

                Spacer().frame(height: 16)

                // Buttons avec glassmorphism
                VStack(spacing: 12) {
                    // Signup button - Glass avec gradient orange
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
                            ZStack {
                                // Gradient signature
                                LinearGradient(
                                    colors: [
                                        Color(hex: "FFA040"),
                                        Color(hex: "FFD080")
                                    ],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )

                                // Glass overlay
                                RoundedRectangle(cornerRadius: 16)
                                    .fill(.ultraThinMaterial)
                                    .opacity(0.3)
                            }
                        )
                        .cornerRadius(16)
                        .shadow(color: Color(hex: "FFA040").opacity(0.4), radius: 12, x: 0, y: 6)
                    }

                    // Login button - Glass pur
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
                            ZStack {
                                RoundedRectangle(cornerRadius: 16)
                                    .fill(Color.white.opacity(0.15))
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color.white.opacity(0.4), lineWidth: 1.5)
                            }
                        )
                    }
                }
                .padding(.horizontal, 24)

                // Divider
                HStack(spacing: 16) {
                    Rectangle().frame(height: 1).foregroundColor(.white.opacity(0.3))
                    Text("ou").font(.system(size: 14)).foregroundColor(.white.opacity(0.7))
                    Rectangle().frame(height: 1).foregroundColor(.white.opacity(0.3))
                }
                .padding(.horizontal, 24)
                .padding(.vertical, 8)

                Button(action: onExploreGuest) {
                    HStack(spacing: 8) {
                        Text("Explorer en mode invité")
                            .font(.system(size: 15, weight: .medium))
                        Image(systemName: "arrow.down")
                            .font(.system(size: 14, weight: .semibold))
                    }
                    .foregroundColor(.white.opacity(0.9))
                }

                VStack(spacing: 8) {
                    Image(systemName: "chevron.compact.down")
                        .font(.system(size: 28, weight: .light))
                        .foregroundColor(.white.opacity(0.5))

                    Text("Glissez vers le bas pour explorer")
                        .font(.system(size: 13))
                        .foregroundColor(.white.opacity(0.5))
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
        .clipShape(RoundedCorner(radius: 32, corners: [.topLeft, .topRight]))
    }
}

// MARK: - Version 3: Glassmorphism Purple-Orange Mix

struct WelcomeView_V3_PurpleOrangeMix: View {
    @State private var showSignupSheet = false
    @State private var showLoginSheet = false
    @State private var showGuestMode = false
    @State private var sheetOffset: CGFloat = 0

    private let sheetHeight: CGFloat = UIScreen.main.bounds.height * 0.65
    private let dragThreshold: CGFloat = 150

    var body: some View {
        ZStack {
            GuestTabView()
                .opacity(showGuestMode ? 1 : 0.5)
                .scaleEffect(showGuestMode ? 1 : 0.98)
                .blur(radius: showGuestMode ? 0 : 1)

            if !showGuestMode {
                LinearGradient(
                    colors: [Color.black.opacity(0.2), Color.clear],
                    startPoint: .bottom,
                    endPoint: .top
                )
                .ignoresSafeArea()
                .allowsHitTesting(false)
            }

            VStack {
                Spacer()

                AuthSheetView_V3_Mix(
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
                            if value.translation.height > 0 { sheetOffset = value.translation.height }
                        }
                        .onEnded { value in
                            if value.translation.height > dragThreshold {
                                withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
                                    showGuestMode = true
                                    sheetOffset = 0
                                }
                            } else {
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
}

struct AuthSheetView_V3_Mix: View {
    let onLogin: () -> Void
    let onSignup: () -> Void
    let onExploreGuest: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            Capsule()
                .fill(Color.white.opacity(0.6))
                .frame(width: 40, height: 5)
                .padding(.top, 12)
                .padding(.bottom, 20)

            VStack(spacing: 24) {
                // Logo avec double glow (purple + orange)
                ZStack {
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [
                                    Color(hex: "6E56CF").opacity(0.3),
                                    Color(hex: "FFA040").opacity(0.3),
                                    Color.clear
                                ],
                                center: .center,
                                startRadius: 0,
                                endRadius: 70
                            )
                        )
                        .frame(width: 140, height: 140)
                        .blur(radius: 25)

                    Image("IzzIcoHouseIcon")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 90, height: 90)
                }

                VStack(spacing: 8) {
                    Text("EasyCo")
                        .font(.system(size: 38, weight: .bold))
                        .foregroundColor(.white)

                    Text("La colocation simplifiée")
                        .font(.system(size: 17))
                        .foregroundColor(.white.opacity(0.9))
                }

                Spacer().frame(height: 16)

                VStack(spacing: 12) {
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
                                    Color(hex: "FFA040"),
                                    Color(hex: "FFD080")
                                ],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(16)
                        .shadow(color: Color(hex: "FFA040").opacity(0.4), radius: 12, x: 0, y: 6)
                    }

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
                            ZStack {
                                RoundedRectangle(cornerRadius: 16)
                                    .fill(Color.white.opacity(0.15))
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color.white.opacity(0.4), lineWidth: 1.5)
                            }
                        )
                    }
                }
                .padding(.horizontal, 24)

                HStack(spacing: 16) {
                    Rectangle().frame(height: 1).foregroundColor(.white.opacity(0.3))
                    Text("ou").font(.system(size: 14)).foregroundColor(.white.opacity(0.7))
                    Rectangle().frame(height: 1).foregroundColor(.white.opacity(0.3))
                }
                .padding(.horizontal, 24)
                .padding(.vertical, 8)

                Button(action: onExploreGuest) {
                    HStack(spacing: 8) {
                        Text("Explorer en mode invité")
                            .font(.system(size: 15, weight: .medium))
                        Image(systemName: "arrow.down")
                            .font(.system(size: 14, weight: .semibold))
                    }
                    .foregroundColor(.white.opacity(0.9))
                }

                VStack(spacing: 8) {
                    Image(systemName: "chevron.compact.down")
                        .font(.system(size: 28, weight: .light))
                        .foregroundColor(.white.opacity(0.5))

                    Text("Glissez vers le bas pour explorer")
                        .font(.system(size: 13))
                        .foregroundColor(.white.opacity(0.5))
                }
                .padding(.top, 16)
                .padding(.bottom, 32)
            }
        }
        .frame(maxWidth: .infinity)
        .background(
            ZStack {
                // Mix purple + orange
                LinearGradient(
                    colors: [
                        Color(hex: "8B7ADB").opacity(0.4),
                        Color(hex: "FFA040").opacity(0.35),
                        Color(hex: "FFB85C").opacity(0.3)
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )

                Rectangle()
                    .fill(.ultraThinMaterial)
                    .opacity(0.8)

                RoundedCorner(radius: 32, corners: [.topLeft, .topRight])
                    .stroke(Color.white.opacity(0.3), lineWidth: 1.5)
            }
        )
        .clipShape(RoundedCorner(radius: 32, corners: [.topLeft, .topRight]))
    }
}

// MARK: - Version 4: Clean White Glassmorphism

struct WelcomeView_V4_WhiteGlass: View {
    @State private var showSignupSheet = false
    @State private var showLoginSheet = false
    @State private var showGuestMode = false
    @State private var sheetOffset: CGFloat = 0

    private let sheetHeight: CGFloat = UIScreen.main.bounds.height * 0.65
    private let dragThreshold: CGFloat = 150

    var body: some View {
        ZStack {
            GuestTabView()
                .opacity(showGuestMode ? 1 : 0.6)
                .scaleEffect(showGuestMode ? 1 : 0.98)
                .blur(radius: showGuestMode ? 0 : 0.5)

            VStack {
                Spacer()

                AuthSheetView_V4_White(
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
                            if value.translation.height > 0 { sheetOffset = value.translation.height }
                        }
                        .onEnded { value in
                            if value.translation.height > dragThreshold {
                                withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
                                    showGuestMode = true
                                    sheetOffset = 0
                                }
                            } else {
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
}

struct AuthSheetView_V4_White: View {
    let onLogin: () -> Void
    let onSignup: () -> Void
    let onExploreGuest: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            Capsule()
                .fill(Color(hex: "D1D5DB"))
                .frame(width: 40, height: 5)
                .padding(.top, 12)
                .padding(.bottom, 20)

            VStack(spacing: 24) {
                Image("IzzIcoHouseIcon")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 90, height: 90)

                VStack(spacing: 8) {
                    Text("EasyCo")
                        .font(.system(size: 38, weight: .bold))
                        .foregroundColor(Color(hex: "111827"))

                    Text("La colocation simplifiée")
                        .font(.system(size: 17))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                Spacer().frame(height: 16)

                VStack(spacing: 12) {
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
                                    Color(hex: "FFA040"),
                                    Color(hex: "FFD080")
                                ],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(16)
                        .shadow(color: Color(hex: "FFA040").opacity(0.3), radius: 12, x: 0, y: 6)
                    }

                    Button(action: onLogin) {
                        HStack(spacing: 10) {
                            Image(systemName: "person.fill")
                                .font(.system(size: 18, weight: .semibold))
                            Text("Se connecter")
                                .font(.system(size: 17, weight: .semibold))
                        }
                        .foregroundColor(Color(hex: "111827"))
                        .frame(maxWidth: .infinity)
                        .frame(height: 56)
                        .background(
                            ZStack {
                                RoundedRectangle(cornerRadius: 16)
                                    .fill(Color.white.opacity(0.8))
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color(hex: "E5E7EB"), lineWidth: 1.5)
                            }
                        )
                    }
                }
                .padding(.horizontal, 24)

                HStack(spacing: 16) {
                    Rectangle().frame(height: 1).foregroundColor(Color(hex: "E5E7EB"))
                    Text("ou").font(.system(size: 14)).foregroundColor(Color(hex: "9CA3AF"))
                    Rectangle().frame(height: 1).foregroundColor(Color(hex: "E5E7EB"))
                }
                .padding(.horizontal, 24)
                .padding(.vertical, 8)

                Button(action: onExploreGuest) {
                    HStack(spacing: 8) {
                        Text("Explorer en mode invité")
                            .font(.system(size: 15, weight: .medium))
                        Image(systemName: "arrow.down")
                            .font(.system(size: 14, weight: .semibold))
                    }
                    .foregroundColor(Color(hex: "6B7280"))
                }

                VStack(spacing: 8) {
                    Image(systemName: "chevron.compact.down")
                        .font(.system(size: 28, weight: .light))
                        .foregroundColor(Color(hex: "D1D5DB"))

                    Text("Glissez vers le bas pour explorer")
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "9CA3AF"))
                }
                .padding(.top, 16)
                .padding(.bottom, 32)
            }
        }
        .frame(maxWidth: .infinity)
        .background(
            ZStack {
                // Blanc pur
                Color.white.opacity(0.95)

                Rectangle()
                    .fill(.ultraThinMaterial)
                    .opacity(0.5)

                RoundedCorner(radius: 32, corners: [.topLeft, .topRight])
                    .stroke(Color(hex: "E5E7EB").opacity(0.8), lineWidth: 1.5)
            }
        )
        .clipShape(RoundedCorner(radius: 32, corners: [.topLeft, .topRight]))
    }
}

// MARK: - Version 5: Dark Elegant

struct WelcomeView_V5_DarkElegant: View {
    @State private var showSignupSheet = false
    @State private var showLoginSheet = false
    @State private var showGuestMode = false
    @State private var sheetOffset: CGFloat = 0

    private let sheetHeight: CGFloat = UIScreen.main.bounds.height * 0.65
    private let dragThreshold: CGFloat = 150

    var body: some View {
        ZStack {
            GuestTabView()
                .opacity(showGuestMode ? 1 : 0.3)
                .scaleEffect(showGuestMode ? 1 : 0.98)
                .blur(radius: showGuestMode ? 0 : 2)

            if !showGuestMode {
                LinearGradient(
                    colors: [Color.black.opacity(0.5), Color.clear],
                    startPoint: .bottom,
                    endPoint: .top
                )
                .ignoresSafeArea()
                .allowsHitTesting(false)
            }

            VStack {
                Spacer()

                AuthSheetView_V5_Dark(
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
                            if value.translation.height > 0 { sheetOffset = value.translation.height }
                        }
                        .onEnded { value in
                            if value.translation.height > dragThreshold {
                                withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
                                    showGuestMode = true
                                    sheetOffset = 0
                                }
                            } else {
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
}

struct AuthSheetView_V5_Dark: View {
    let onLogin: () -> Void
    let onSignup: () -> Void
    let onExploreGuest: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            Capsule()
                .fill(Color.white.opacity(0.4))
                .frame(width: 40, height: 5)
                .padding(.top, 12)
                .padding(.bottom, 20)

            VStack(spacing: 24) {
                ZStack {
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [
                                    Color(hex: "FFA040").opacity(0.5),
                                    Color.clear
                                ],
                                center: .center,
                                startRadius: 0,
                                endRadius: 60
                            )
                        )
                        .frame(width: 120, height: 120)
                        .blur(radius: 20)

                    Image("IzzIcoHouseIcon")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 90, height: 90)
                }

                VStack(spacing: 8) {
                    Text("EasyCo")
                        .font(.system(size: 38, weight: .bold))
                        .foregroundColor(.white)

                    Text("La colocation simplifiée")
                        .font(.system(size: 17))
                        .foregroundColor(.white.opacity(0.8))
                }

                Spacer().frame(height: 16)

                VStack(spacing: 12) {
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
                                    Color(hex: "FFA040"),
                                    Color(hex: "FFD080")
                                ],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(16)
                        .shadow(color: Color(hex: "FFA040").opacity(0.5), radius: 12, x: 0, y: 6)
                    }

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
                            ZStack {
                                RoundedRectangle(cornerRadius: 16)
                                    .fill(Color(hex: "374151").opacity(0.8))
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color(hex: "6B7280"), lineWidth: 1.5)
                            }
                        )
                    }
                }
                .padding(.horizontal, 24)

                HStack(spacing: 16) {
                    Rectangle().frame(height: 1).foregroundColor(Color(hex: "4B5563"))
                    Text("ou").font(.system(size: 14)).foregroundColor(Color(hex: "9CA3AF"))
                    Rectangle().frame(height: 1).foregroundColor(Color(hex: "4B5563"))
                }
                .padding(.horizontal, 24)
                .padding(.vertical, 8)

                Button(action: onExploreGuest) {
                    HStack(spacing: 8) {
                        Text("Explorer en mode invité")
                            .font(.system(size: 15, weight: .medium))
                        Image(systemName: "arrow.down")
                            .font(.system(size: 14, weight: .semibold))
                    }
                    .foregroundColor(Color(hex: "D1D5DB"))
                }

                VStack(spacing: 8) {
                    Image(systemName: "chevron.compact.down")
                        .font(.system(size: 28, weight: .light))
                        .foregroundColor(Color(hex: "6B7280"))

                    Text("Glissez vers le bas pour explorer")
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "6B7280"))
                }
                .padding(.top, 16)
                .padding(.bottom, 32)
            }
        }
        .frame(maxWidth: .infinity)
        .background(
            ZStack {
                LinearGradient(
                    colors: [
                        Color(hex: "1F2937"),
                        Color(hex: "111827")
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )

                Rectangle()
                    .fill(.ultraThinMaterial)
                    .opacity(0.3)

                RoundedCorner(radius: 32, corners: [.topLeft, .topRight])
                    .stroke(Color(hex: "374151"), lineWidth: 1.5)
            }
        )
        .clipShape(RoundedCorner(radius: 32, corners: [.topLeft, .topRight]))
    }
}

// MARK: - Preview Comparison
// Note: RoundedCorner is defined in WelcomeView.swift

struct WelcomeView_Comparison_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            WelcomeView_V1_PurpleGradient()
                .previewDisplayName("V1 - Purple Gradient (Actuelle)")

            WelcomeView_V2_GlassmorphismOrange()
                .previewDisplayName("V2 - Glassmorphism Orange ⭐")

            WelcomeView_V3_PurpleOrangeMix()
                .previewDisplayName("V3 - Purple-Orange Mix")

            WelcomeView_V4_WhiteGlass()
                .previewDisplayName("V4 - White Clean")

            WelcomeView_V5_DarkElegant()
                .previewDisplayName("V5 - Dark Elegant")
        }
        .environmentObject(AuthManager.shared)
    }
}
