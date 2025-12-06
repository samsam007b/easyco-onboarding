//
//  ProfileView_VersionB_PremiumSubtle.swift
//  EasyCo
//
//  VERSION B: Premium Subtle (Inspiré Design 3 - Doctor App)
//  - Équilibre élégant
//  - Multi-layer shadows sophistiquées
//  - Accents de couleur stratégiques (jaune fluo)
//  - Hiérarchie claire mais pas extrême
//

import SwiftUI

struct ProfileView_VersionB_PremiumSubtle: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var authManager: AuthManager
    private let role: Theme.UserRole = .resident

    @State private var showEditProfile = false
    @State private var showLogoutAlert = false

    // Accent color stratégique
    private let accentColor = Color(hex: "FACC15")  // Jaune fluo

    var body: some View {
        NavigationStack {
            ZStack(alignment: .top) {
                // Background neutre élégant
                LinearGradient(
                    colors: [Color(hex: "F9FAFB"), Color(hex: "F3F4F6")],
                    startPoint: .top,
                    endPoint: .bottom
                )
                .ignoresSafeArea()

                ScrollView(showsIndicators: false) {
                    VStack(spacing: 32) {
                        // Header avec avatar
                        headerSection
                            .padding(.top, 60)

                        // Stats rapides
                        statsSection

                        // Actions principales
                        mainActionsSection

                        // Settings section
                        settingsSection

                        // Logout
                        logoutButton
                    }
                    .padding(.horizontal, 24)
                    .padding(.bottom, 100)
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

    // MARK: - Header Section

    private var headerSection: some View {
        HStack(spacing: 20) {
            // Avatar avec accent
            ZStack(alignment: .bottomTrailing) {
                Circle()
                    .fill(LinearGradient(
                        colors: [Color(hex: "FF6B35"), Color(hex: "FF8C42")],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ))
                    .frame(width: 80, height: 80)
                    .overlay(
                        Text(displayName.prefix(2).uppercased())
                            .font(.system(size: 32, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                    )
                    .premiumShadow()

                // Badge accent
                Circle()
                    .fill(accentColor)
                    .frame(width: 24, height: 24)
                    .overlay(
                        Image(systemName: "checkmark")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                    )
                    .offset(x: 4, y: 4)
            }

            VStack(alignment: .leading, spacing: 6) {
                Text(displayName)
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Résident Premium")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            Spacer()
        }
    }

    // MARK: - Stats Section

    private var statsSection: some View {
        HStack(spacing: 16) {
            StatCardSubtle(
                value: "12",
                label: "Favoris",
                icon: "heart.fill",
                color: Color(hex: "EF4444")
            )

            StatCardSubtle(
                value: "5",
                label: "Matchs",
                icon: "person.2.fill",
                color: Color(hex: "10B981")
            )

            StatCardSubtle(
                value: "24",
                label: "Vues",
                icon: "eye.fill",
                color: Color(hex: "3B82F6")
            )
        }
    }

    // MARK: - Main Actions

    private var mainActionsSection: some View {
        VStack(spacing: 12) {
            SubtleActionCard(
                icon: "person.fill",
                title: "Profil",
                subtitle: "Mes informations",
                accentColor: accentColor,
                isPrimary: true
            ) {
                showEditProfile = true
            }

            SubtleActionCard(
                icon: "heart.fill",
                title: "Favoris",
                subtitle: "12 annonces",
                accentColor: Color(hex: "EF4444")
            ) {}
        }
    }

    // MARK: - Settings Section

    private var settingsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Paramètres")
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(Color(hex: "6B7280"))
                .padding(.horizontal, 4)

            VStack(spacing: 8) {
                SettingsRowSubtle(icon: "bell.fill", title: "Notifications") {}
                SettingsRowSubtle(icon: "shield.fill", title: "Confidentialité") {}
                SettingsRowSubtle(icon: "questionmark.circle.fill", title: "Aide") {}
            }
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
                    .font(.system(size: 18, weight: .medium))

                Text("Se déconnecter")
                    .font(.system(size: 16, weight: .medium))

                Spacer()
            }
            .foregroundColor(Color(hex: "EF4444"))
            .frame(height: 52)
            .padding(.horizontal, 20)
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color.white.opacity(0.5))
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(Color(hex: "EF4444").opacity(0.2), lineWidth: 1)
                    )
            )
            .premiumShadow()
        }
        .buttonStyle(PlainButtonStyle())
    }

    // MARK: - Helpers

    private var displayName: String {
        authManager.currentUser?.displayName ?? "Sam Jones"
    }
}

// MARK: - Stat Card Subtle

struct StatCardSubtle: View {
    let value: String
    let label: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(spacing: 10) {
            Image(systemName: icon)
                .font(.system(size: 20, weight: .semibold))
                .foregroundColor(color)

            Text(value)
                .font(.system(size: 24, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            Text(label)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 20)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color.white.opacity(0.6))
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(Color.white.opacity(0.8), lineWidth: 1)
                )
        )
        .premiumShadow()
    }
}

// MARK: - Subtle Action Card

struct SubtleActionCard: View {
    let icon: String
    let title: String
    let subtitle: String
    let accentColor: Color
    var isPrimary: Bool = false
    let action: () -> Void

    var body: some View {
        Button(action: {
            Haptic.light()
            action()
        }) {
            HStack(spacing: 16) {
                ZStack {
                    RoundedRectangle(cornerRadius: 12)
                        .fill(accentColor.opacity(isPrimary ? 0.15 : 0.08))
                        .frame(width: 52, height: 52)

                    Image(systemName: icon)
                        .font(.system(size: 22, weight: .semibold))
                        .foregroundColor(accentColor)
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                        .font(.system(size: 17, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    Text(subtitle)
                        .font(.system(size: 14, weight: .regular))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(hex: "9CA3AF"))
            }
            .padding(16)
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color.white.opacity(0.6))
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(Color.white.opacity(0.8), lineWidth: 1)
                    )
            )
            .premiumShadow()
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Settings Row Subtle

struct SettingsRowSubtle: View {
    let icon: String
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: {
            Haptic.light()
            action()
        }) {
            HStack(spacing: 14) {
                Image(systemName: icon)
                    .font(.system(size: 18, weight: .medium))
                    .foregroundColor(Color(hex: "6B7280"))
                    .frame(width: 24)

                Text(title)
                    .font(.system(size: 16, weight: .regular))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(Color(hex: "D1D5DB"))
            }
            .frame(height: 48)
            .padding(.horizontal, 16)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color.white.opacity(0.4))
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Premium Shadow Modifier

extension View {
    func premiumShadow() -> some View {
        self
            .shadow(color: .black.opacity(0.06), radius: 16, x: 0, y: 8)
            .shadow(color: .black.opacity(0.04), radius: 40, x: 0, y: 20)
            .shadow(color: .black.opacity(0.02), radius: 80, x: 0, y: 40)
    }
}

// MARK: - Preview

#Preview {
    ProfileView_VersionB_PremiumSubtle()
        .environmentObject(AuthManager.shared)
}
