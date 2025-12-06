//
//  ProfileView_VersionA_UltraMinimal.swift
//  EasyCo
//
//  VERSION A: Ultra Minimal (Inspiré Design 2 - Login Pink)
//  - Typographie géante
//  - Espacement XXL
//  - Glassmorphisme ultra-léger (opacity 0.3)
//  - Monochrome + 1 accent orange
//

import SwiftUI

struct ProfileView_VersionA_UltraMinimal: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var authManager: AuthManager
    private let role: Theme.UserRole = .resident

    @State private var showEditProfile = false
    @State private var showLogoutAlert = false

    var body: some View {
        NavigationStack {
            ZStack(alignment: .top) {
                // Background ultra simple
                Color(hex: "F8F9FA")
                    .ignoresSafeArea()

                ScrollView(showsIndicators: false) {
                    VStack(spacing: 64) {  // XXL spacing
                        // Hero Section avec typographie géante
                        heroSection
                            .padding(.top, 80)

                        // Actions minimalistes
                        actionsSection

                        // Logout
                        logoutButton
                    }
                    .padding(.horizontal, 32)
                    .padding(.bottom, 120)
                }
            }
            .alert("Déconnexion", isPresented: $showLogoutAlert) {
                Button("Annuler", role: .cancel) {}
                Button("Déconnexion", role: .destructive) {
                    Task { await authManager.logout() }
                }
            } message: {
                Text("Êtes-vous sûr de vouloir vous déconnecter ?")
            }
        }
    }

    // MARK: - Hero Section

    private var heroSection: some View {
        VStack(spacing: 24) {
            // Avatar minimaliste
            Circle()
                .fill(LinearGradient(
                    colors: [Color(hex: "FF6B35"), Color(hex: "FF8C42")],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                ))
                .frame(width: 120, height: 120)
                .overlay(
                    Text(displayName.prefix(2).uppercased())
                        .font(.system(size: 48, weight: .heavy, design: .rounded))
                        .foregroundColor(.white)
                )
                .multiLayerShadow()

            VStack(spacing: 12) {
                // Nom en typographie géante
                Text(displayName)
                    .font(.system(size: 56, weight: .heavy, design: .rounded))
                    .foregroundColor(Color(hex: "1A1A1A"))
                    .multilineTextAlignment(.center)

                // Email discret
                Text(authManager.currentUser?.email ?? "sam7777jones@gmail.com")
                    .font(.system(size: 16, weight: .regular))
                    .foregroundColor(Color(hex: "6B7280"))
            }
        }
    }

    // MARK: - Actions Section

    private var actionsSection: some View {
        VStack(spacing: 20) {
            MinimalActionButton(
                title: "Modifier le profil",
                icon: "person.fill",
                accentColor: Color(hex: "FF6B35")
            ) {
                showEditProfile = true
            }

            MinimalActionButton(
                title: "Notifications",
                icon: "bell.fill",
                accentColor: Color(hex: "6B7280")
            ) {}

            MinimalActionButton(
                title: "Confidentialité",
                icon: "shield.fill",
                accentColor: Color(hex: "6B7280")
            ) {}

            MinimalActionButton(
                title: "Aide",
                icon: "questionmark.circle.fill",
                accentColor: Color(hex: "6B7280")
            ) {}
        }
    }

    // MARK: - Logout Button

    private var logoutButton: some View {
        Button(action: {
            Haptic.warning()
            showLogoutAlert = true
        }) {
            HStack(spacing: 12) {
                Image(systemName: "rectangle.portrait.and.arrow.right")
                    .font(.system(size: 20, weight: .medium))

                Text("Se déconnecter")
                    .font(.system(size: 18, weight: .medium))
            }
            .foregroundColor(Color(hex: "EF4444"))
            .frame(maxWidth: .infinity)
            .frame(height: 56)
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color(hex: "FEF2F2").opacity(0.5))
            )
        }
        .buttonStyle(PlainButtonStyle())
    }

    // MARK: - Helpers

    private var displayName: String {
        authManager.currentUser?.displayName ?? "Sam Jones"
    }
}

// MARK: - Minimal Action Button

struct MinimalActionButton: View {
    let title: String
    let icon: String
    let accentColor: Color
    let action: () -> Void

    var body: some View {
        Button(action: {
            Haptic.light()
            action()
        }) {
            HStack(spacing: 16) {
                // Icon
                ZStack {
                    Circle()
                        .fill(accentColor.opacity(0.1))
                        .frame(width: 48, height: 48)

                    Image(systemName: icon)
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(accentColor)
                }

                // Title
                Text(title)
                    .font(.system(size: 18, weight: .medium))
                    .foregroundColor(Color(hex: "1A1A1A"))

                Spacer()

                // Chevron
                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(hex: "9CA3AF"))
            }
            .frame(height: 72)
            .padding(.horizontal, 24)
            .background(
                RoundedRectangle(cornerRadius: 20)
                    .fill(Color.white.opacity(0.4))  // Ultra-light glass
                    .overlay(
                        RoundedRectangle(cornerRadius: 20)
                            .stroke(Color.white.opacity(0.3), lineWidth: 0.5)
                    )
                    .background(
                        RoundedRectangle(cornerRadius: 20)
                            .fill(.ultraThinMaterial)
                    )
            )
            .multiLayerShadow()
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Multi-Layer Shadow Modifier

extension View {
    func multiLayerShadow() -> some View {
        self
            .shadow(color: .black.opacity(0.05), radius: 20, x: 0, y: 10)
            .shadow(color: .black.opacity(0.03), radius: 60, x: 0, y: 30)
            .shadow(color: .black.opacity(0.01), radius: 100, x: 0, y: 50)
    }
}

// MARK: - Preview

#Preview {
    ProfileView_VersionA_UltraMinimal()
        .environmentObject(AuthManager.shared)
}
