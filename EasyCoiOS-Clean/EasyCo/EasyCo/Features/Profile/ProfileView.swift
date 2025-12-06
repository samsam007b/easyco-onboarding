//
//  ProfileView.swift
//  EasyCo
//
//  Information Rich Premium Design
//  - Density maîtrisée mais riche en info
//  - Multiples cards raffinées
//  - Profondeur visuelle avec layers
//  - Fonctionnel ET beau
//

import SwiftUI

struct ProfileView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var authManager: AuthManager
    @EnvironmentObject var languageManager: LanguageManager
    private let role: Theme.UserRole = .resident

    @State private var showEditProfile = false
    @State private var showLogoutAlert = false
    @State private var showRoleSwitcher = false
    @State private var showLanguageSettings = false
    @State private var showPrivacySettings = false
    @State private var showNotificationSettings = false
    @State private var showHelpSupport = false

    var body: some View {
        NavigationStack {
            ZStack(alignment: .top) {
                // Background avec profondeur
                ZStack {
                    LinearGradient(
                        colors: [
                            Color(hex: "FFF5F0"),
                            Color(hex: "FFF0E6"),
                            Color(hex: "FFE5D9")
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                    .ignoresSafeArea()

                    // Organic shapes
                    Circle()
                        .fill(Color(hex: "FF6B35").opacity(0.08))
                        .frame(width: 400, height: 400)
                        .blur(radius: 100)
                        .offset(x: -100, y: -200)

                    Circle()
                        .fill(Color(hex: "FACC15").opacity(0.06))
                        .frame(width: 300, height: 300)
                        .blur(radius: 80)
                        .offset(x: 150, y: 400)
                }

                ScrollView(showsIndicators: false) {
                    VStack(spacing: 20) {
                        // Hero Card
                        heroCard
                            .padding(.top, 40)

                        // Activity Grid
                        activityGrid

                        // Quick Actions
                        quickActionsGrid

                        // Settings List
                        settingsList

                        // Logout
                        logoutSection
                    }
                    .padding(.horizontal, 20)
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
            .sheet(isPresented: $showRoleSwitcher) {
                RoleSwitcherView()
                    .environmentObject(authManager)
            }
            .sheet(isPresented: $showLanguageSettings) {
                LanguageSettingsView()
                    .environmentObject(languageManager)
            }
            .sheet(isPresented: $showPrivacySettings) {
                PrivacySettingsView()
            }
            .sheet(isPresented: $showNotificationSettings) {
                NotificationSettingsView()
            }
            .sheet(isPresented: $showHelpSupport) {
                HelpView()
            }
        }
    }

    // MARK: - Hero Card

    private var heroCard: some View {
        VStack(spacing: 20) {
            HStack(spacing: 16) {
                // Avatar avec gradient
                Circle()
                    .fill(LinearGradient(
                        colors: [Color(hex: "FF6B35"), Color(hex: "FF8C42")],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ))
                    .frame(width: 70, height: 70)
                    .overlay(
                        Text(displayName.prefix(2).uppercased())
                            .font(.system(size: 28, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                    )
                    .richShadow(color: Color(hex: "FF6B35"))

                VStack(alignment: .leading, spacing: 6) {
                    Text(displayName)
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(Color(hex: "1F2937"))

                    HStack(spacing: 6) {
                        Circle()
                            .fill(Color(hex: "10B981"))
                            .frame(width: 8, height: 8)

                        Text("Compte vérifié")
                            .font(.system(size: 13, weight: .medium))
                            .foregroundColor(Color(hex: "6B7280"))
                    }

                    // Current Role - Tappable
                    Button(action: { showRoleSwitcher = true }) {
                        HStack(spacing: 6) {
                            Image(systemName: "person.crop.circle")
                                .font(.system(size: 11, weight: .semibold))
                                .foregroundColor(Color(hex: "FF6B35"))

                            Text(authManager.currentUser?.userType.displayName ?? "Chercheur")
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundColor(Color(hex: "FF6B35"))

                            Image(systemName: "chevron.right")
                                .font(.system(size: 9, weight: .bold))
                                .foregroundColor(Color(hex: "FF6B35"))
                        }
                        .padding(.horizontal, 10)
                        .padding(.vertical, 4)
                        .background(
                            RoundedRectangle(cornerRadius: 6)
                                .fill(Color(hex: "FF6B35").opacity(0.1))
                        )
                    }
                    .padding(.top, 4)
                }

                Spacer()

                Button(action: { showEditProfile = true }) {
                    Image(systemName: "gearshape.fill")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(Color(hex: "6B7280"))
                        .frame(width: 40, height: 40)
                        .background(
                            Circle()
                                .fill(Color.white.opacity(0.8))
                        )
                }
            }

            // Progress bar
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text("Profil complété")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(Color(hex: "1F2937"))

                    Spacer()

                    Text("85%")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(Color(hex: "FF6B35"))
                }

                GeometryReader { geometry in
                    ZStack(alignment: .leading) {
                        RoundedRectangle(cornerRadius: 8)
                            .fill(Color(hex: "E5E7EB"))
                            .frame(height: 8)

                        RoundedRectangle(cornerRadius: 8)
                            .fill(LinearGradient(
                                colors: [Color(hex: "FF6B35"), Color(hex: "FACC15")],
                                startPoint: .leading,
                                endPoint: .trailing
                            ))
                            .frame(width: geometry.size.width * 0.85, height: 8)
                    }
                }
                .frame(height: 8)
            }
        }
        .padding(20)
        .background(
            RoundedRectangle(cornerRadius: 20)
                .fill(Color.white.opacity(0.85))
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(Color.white, lineWidth: 2)
                )
        )
        .richShadow()
        .sheet(isPresented: $showEditProfile) {
            PersonalInfoView()
        }
    }

    // MARK: - Activity Grid

    private var activityGrid: some View {
        LazyVGrid(columns: [
            GridItem(.flexible()),
            GridItem(.flexible()),
            GridItem(.flexible())
        ], spacing: 12) {
            RichStatCard(
                icon: "heart.fill",
                value: "12",
                label: "Favoris",
                color: Color(hex: "EF4444")
            )

            RichStatCard(
                icon: "person.2.fill",
                value: "5",
                label: "Matchs",
                color: Color(hex: "10B981")
            )

            RichStatCard(
                icon: "eye.fill",
                value: "24",
                label: "Vues",
                color: Color(hex: "3B82F6")
            )
        }
    }

    // MARK: - Quick Actions Grid

    private var quickActionsGrid: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Actions rapides")
                .font(.system(size: 15, weight: .bold))
                .foregroundColor(Color(hex: "1F2937"))
                .padding(.horizontal, 4)

            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 12) {
                QuickActionCardRich(
                    icon: "doc.text.fill",
                    title: "Mes annonces",
                    count: "3",
                    color: Color(hex: "8B5CF6")
                ) {}

                QuickActionCardRich(
                    icon: "bell.fill",
                    title: "Alertes",
                    count: "7",
                    color: Color(hex: "F59E0B")
                ) {}

                QuickActionCardRich(
                    icon: "message.fill",
                    title: "Messages",
                    count: "12",
                    color: Color(hex: "06B6D4")
                ) {}

                QuickActionCardRich(
                    icon: "calendar.badge.clock",
                    title: "Visites",
                    count: "2",
                    color: Color(hex: "EC4899")
                ) {}
            }
        }
    }

    // MARK: - Settings List

    private var settingsList: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Paramètres")
                .font(.system(size: 15, weight: .bold))
                .foregroundColor(Color(hex: "1F2937"))
                .padding(.horizontal, 4)

            VStack(spacing: 1) {
                SettingsRowRich(icon: "person.fill", title: "Informations personnelles", color: Color(hex: "8B5CF6")) {
                    showEditProfile = true
                }
                SettingsRowRich(icon: "globe", title: "Langue", color: Color(hex: "10B981")) {
                    showLanguageSettings = true
                }
                SettingsRowRich(icon: "shield.fill", title: "Confidentialité", color: Color(hex: "6B7280")) {
                    showPrivacySettings = true
                }
                SettingsRowRich(icon: "bell.fill", title: "Notifications", color: Color(hex: "3B82F6")) {
                    showNotificationSettings = true
                }
                SettingsRowRich(icon: "questionmark.circle.fill", title: "Aide & Support", color: Color(hex: "F59E0B")) {
                    showHelpSupport = true
                }
            }
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color.white.opacity(0.85))
            )
            .richShadow()
        }
    }

    // MARK: - Logout Section

    private var logoutSection: some View {
        Button(action: {
            Haptic.warning()
            showLogoutAlert = true
        }) {
            HStack(spacing: 12) {
                Image(systemName: "rectangle.portrait.and.arrow.right")
                    .font(.system(size: 18, weight: .semibold))

                Text("Se déconnecter")
                    .font(.system(size: 16, weight: .semibold))

                Spacer()
            }
            .foregroundColor(Color(hex: "EF4444"))
            .padding(16)
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color(hex: "FEF2F2").opacity(0.9))
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(Color(hex: "EF4444").opacity(0.2), lineWidth: 1.5)
                    )
            )
            .richShadow()
        }
        .buttonStyle(PlainButtonStyle())
    }

    // MARK: - Helpers

    private var displayName: String {
        authManager.currentUser?.displayName ?? "Sam Jones"
    }
}

// MARK: - Rich Stat Card

private struct RichStatCard: View {
    let icon: String
    let value: String
    let label: String
    let color: Color

    var body: some View {
        VStack(spacing: 10) {
            ZStack {
                Circle()
                    .fill(color.opacity(0.12))
                    .frame(width: 44, height: 44)

                Image(systemName: icon)
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(color)
            }

            Text(value)
                .font(.system(size: 22, weight: .bold))
                .foregroundColor(Color(hex: "1F2937"))

            Text(label)
                .font(.system(size: 11, weight: .medium))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
        .background(
            RoundedRectangle(cornerRadius: 14)
                .fill(Color.white.opacity(0.85))
                .overlay(
                    RoundedRectangle(cornerRadius: 14)
                        .stroke(Color.white, lineWidth: 1.5)
                )
        )
        .richShadow()
    }
}

// MARK: - Quick Action Card Rich

private struct QuickActionCardRich: View {
    let icon: String
    let title: String
    let count: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: {
            Haptic.light()
            action()
        }) {
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    ZStack {
                        RoundedRectangle(cornerRadius: 10)
                            .fill(color.opacity(0.12))
                            .frame(width: 40, height: 40)

                        Image(systemName: icon)
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(color)
                    }

                    Spacer()

                    Text(count)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(color)
                }

                Text(title)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(hex: "1F2937"))
                    .multilineTextAlignment(.leading)
            }
            .padding(14)
            .frame(height: 100)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(
                RoundedRectangle(cornerRadius: 14)
                    .fill(Color.white.opacity(0.85))
                    .overlay(
                        RoundedRectangle(cornerRadius: 14)
                            .stroke(Color.white, lineWidth: 1.5)
                    )
            )
            .richShadow()
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Settings Row Rich

private struct SettingsRowRich: View {
    let icon: String
    let title: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: {
            Haptic.light()
            action()
        }) {
            HStack(spacing: 14) {
                ZStack {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(color.opacity(0.12))
                        .frame(width: 36, height: 36)

                    Image(systemName: icon)
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(color)
                }

                Text(title)
                    .font(.system(size: 15, weight: .medium))
                    .foregroundColor(Color(hex: "1F2937"))

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(Color(hex: "9CA3AF"))
            }
            .padding(.horizontal, 16)
            .frame(height: 56)
            .background(Color.white.opacity(0.01))
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Rich Shadow Modifier

extension View {
    func richShadow(color: Color = .black) -> some View {
        self
            .shadow(color: color.opacity(0.08), radius: 12, x: 0, y: 6)
            .shadow(color: color.opacity(0.05), radius: 30, x: 0, y: 15)
            .shadow(color: color.opacity(0.02), radius: 60, x: 0, y: 30)
    }
}

// MARK: - Preview

#Preview {
    ProfileView()
        .environmentObject(AuthManager.shared)
}
