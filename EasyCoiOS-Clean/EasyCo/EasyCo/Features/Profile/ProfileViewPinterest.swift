import SwiftUI

// MARK: - Profile View Pinterest Style

struct ProfileViewPinterest: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var authManager: AuthManager
    private let role: Theme.UserRole = .resident

    @State private var showEditProfile = false
    @State private var showLogoutAlert = false

    // Mock data
    private let statsData = [
        ("eye", "Vues", "24", Color(hex: "3B82F6")),
        ("heart", "Favoris", "12", Color(hex: "EF4444")),
        ("person.2", "Matchs", "5", Color(hex: "10B981"))
    ]

    var body: some View {
        NavigationStack {
            ZStack(alignment: .top) {
                // Background
                PinterestBackground(role: role, intensity: 0.15)
                    .ignoresSafeArea()

                ScrollView(showsIndicators: false) {
                    VStack(spacing: 0) {
                        // Profile Header
                        profileHeader
                            .padding(.top, Theme.PinterestSpacing.lg)
                            .padding(.horizontal, Theme.PinterestSpacing.lg)
                            .padding(.bottom, Theme.PinterestSpacing.xl)

                        // Stats Grid
                        statsGrid
                            .padding(.horizontal, Theme.PinterestSpacing.lg)
                            .padding(.bottom, Theme.PinterestSpacing.xl)

                        // Quick Actions
                        quickActionsSection
                            .padding(.horizontal, Theme.PinterestSpacing.lg)
                            .padding(.bottom, Theme.PinterestSpacing.xl)

                        // Account Section
                        accountSection
                            .padding(.horizontal, Theme.PinterestSpacing.lg)
                            .padding(.bottom, Theme.PinterestSpacing.xl)

                        // Support Section
                        supportSection
                            .padding(.horizontal, Theme.PinterestSpacing.lg)
                            .padding(.bottom, Theme.PinterestSpacing.xl)

                        // Logout
                        logoutButton
                            .padding(.horizontal, Theme.PinterestSpacing.lg)
                            .padding(.bottom, 100)
                    }
                }
            }
            .alert("Déconnexion", isPresented: $showLogoutAlert) {
                Button("Annuler", role: .cancel) {}
                Button("Déconnexion", role: .destructive) {
                    Task {
                        await authManager.logout()
                    }
                }
            } message: {
                Text("Êtes-vous sûr de vouloir vous déconnecter ?")
            }
        }
    }

    // MARK: - Profile Header

    private var profileHeader: some View {
        VStack(spacing: 16) {
            // Avatar
            ZStack(alignment: .bottomTrailing) {
                Circle()
                    .fill(role.gradient)
                    .frame(width: 100, height: 100)
                    .overlay(
                        Text(displayName.prefix(2).uppercased())
                            .font(.system(size: 36, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                    )
                    .pinterestShadow(Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.4))

                // Camera button
                Button(action: {
                    Haptic.light()
                    showEditProfile = true
                }) {
                    ZStack {
                        Circle()
                            .fill(Color.white)
                            .frame(width: 32, height: 32)

                        Image(systemName: "camera.fill")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(role.primaryColor)
                    }
                    .pinterestShadow(Theme.PinterestShadows.medium)
                }
            }

            // Name & Email
            VStack(spacing: 4) {
                Text(displayName)
                    .font(Theme.PinterestTypography.titleLarge(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(authManager.currentUser?.email ?? "sam7777jones@gmail.com")
                    .font(Theme.PinterestTypography.bodyRegular(.medium))
                    .foregroundColor(Theme.Colors.textSecondary)
            }

            // Edit Profile Button
            Button(action: {
                Haptic.light()
                showEditProfile = true
            }) {
                Text("Modifier le profil")
                    .font(Theme.PinterestTypography.bodyRegular(.semibold))
                    .foregroundColor(role.primaryColor)
                    .frame(height: 44)
                    .padding(.horizontal, Theme.PinterestSpacing.xl)
                    .background(
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                            .fill(Color.white.opacity(0.75))
                            .overlay(
                                RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                                    .stroke(role.primaryColor.opacity(0.4), lineWidth: 2)
                            )
                    )
                    .pinterestShadow(Theme.PinterestShadows.subtle)
            }
            .buttonStyle(ScaleButtonStyle())
        }
    }

    // MARK: - Stats Grid

    private var statsGrid: some View {
        HStack(spacing: 12) {
            ForEach(statsData, id: \.1) { stat in
                VStack(spacing: 12) {
                    Image(systemName: stat.0)
                        .font(.system(size: 24, weight: .semibold))
                        .foregroundColor(stat.3)

                    Text(stat.2)
                        .font(Theme.PinterestTypography.titleMedium(.bold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text(stat.1)
                        .font(Theme.PinterestTypography.caption(.medium))
                        .foregroundColor(Theme.Colors.textSecondary)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, Theme.PinterestSpacing.lg)
                .background(
                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                        .fill(Color.white.opacity(0.75))
                        .overlay(
                            RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                                .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                        )
                )
                .pinterestShadow(Theme.PinterestShadows.subtle)
            }
        }
    }

    // MARK: - Quick Actions

    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Actions rapides")
                .font(Theme.PinterestTypography.titleSmall(.bold))
                .foregroundColor(Theme.Colors.textPrimary)
                .padding(.horizontal, Theme.PinterestSpacing.md)

            HStack(spacing: 12) {
                NavigationLink(destination: FavoritesView()) {
                    PinterestQuickActionCard(
                        icon: "heart.fill",
                        title: "Favoris",
                        color: Color(hex: "EF4444"),
                        action: {}
                    )
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: AnnouncementsView()) {
                    PinterestQuickActionCard(
                        icon: "doc.text.fill",
                        title: "Annonces",
                        color: Color(hex: "8B5CF6"),
                        action: {}
                    )
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
    }

    // MARK: - Account Section

    private var accountSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Compte")
                .font(Theme.PinterestTypography.titleSmall(.bold))
                .foregroundColor(Theme.Colors.textPrimary)
                .padding(.horizontal, Theme.PinterestSpacing.md)

            VStack(spacing: 8) {
                NavigationLink(destination: PersonalInfoView()) {
                    PinterestProfileMenuItem(
                        icon: "person.fill",
                        title: "Informations personnelles",
                        subtitle: "Nom, email, téléphone",
                        iconColor: Color(hex: "8B5CF6"),
                        action: {}
                    )
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: NotificationSettingsView()) {
                    PinterestProfileMenuItem(
                        icon: "bell.fill",
                        title: "Notifications",
                        subtitle: "Gérer vos préférences",
                        iconColor: Color(hex: "3B82F6"),
                        action: {}
                    )
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: PrivacySettingsView()) {
                    PinterestProfileMenuItem(
                        icon: "shield.fill",
                        title: "Confidentialité",
                        subtitle: "Données et sécurité",
                        iconColor: Color(hex: "10B981"),
                        action: {}
                    )
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
    }

    // MARK: - Support Section

    private var supportSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Support")
                .font(Theme.PinterestTypography.titleSmall(.bold))
                .foregroundColor(Theme.Colors.textPrimary)
                .padding(.horizontal, Theme.PinterestSpacing.md)

            VStack(spacing: 8) {
                NavigationLink(destination: Text("Aide et FAQ")) {
                    PinterestProfileMenuItem(
                        icon: "questionmark.circle.fill",
                        title: "Aide et FAQ",
                        subtitle: "Besoin d'assistance ?",
                        iconColor: Color(hex: "F59E0B"),
                        action: {}
                    )
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: Text("Nous contacter")) {
                    PinterestProfileMenuItem(
                        icon: "bubble.left.and.bubble.right.fill",
                        title: "Nous contacter",
                        subtitle: "support@easyco.fr",
                        iconColor: Color(hex: "6366F1"),
                        action: {}
                    )
                }
                .buttonStyle(PlainButtonStyle())
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
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(Color(hex: "EF4444"))

                Text("Déconnexion")
                    .font(Theme.PinterestTypography.bodyLarge(.semibold))
                    .foregroundColor(Color(hex: "EF4444"))

                Spacer()
            }
            .padding(Theme.PinterestSpacing.lg)
            .background(
                RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                    .fill(Color(hex: "FEF2F2").opacity(0.75))
                    .overlay(
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                            .stroke(Color(hex: "EF4444").opacity(0.2), lineWidth: 1.5)
                    )
            )
            .pinterestShadow(Theme.PinterestShadows.subtle)
        }
        .buttonStyle(ScaleButtonStyle())
    }

    // MARK: - Helpers

    private var displayName: String {
        if let user = authManager.currentUser {
            return user.displayName
        }
        return "sam jones"
    }
}

// MARK: - Quick Action Card

private struct PinterestQuickActionCard: View {
    let icon: String
    let title: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: {
            Haptic.light()
            action()
        }) {
            VStack(spacing: 12) {
                ZStack {
                    RoundedRectangle(cornerRadius: 16)
                        .fill(color.opacity(0.15))
                        .frame(width: 64, height: 64)

                    Image(systemName: icon)
                        .font(.system(size: 28, weight: .semibold))
                        .foregroundColor(color)
                }

                Text(title)
                    .font(Theme.PinterestTypography.bodyRegular(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, Theme.PinterestSpacing.lg)
            .background(
                RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                    .fill(Color.white.opacity(0.75))
                    .overlay(
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                            .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                    )
            )
            .pinterestShadow(Theme.PinterestShadows.subtle)
        }
        .buttonStyle(ScaleButtonStyle())
    }
}

// MARK: - Profile Menu Item

private struct PinterestProfileMenuItem: View {
    let icon: String
    let title: String
    let subtitle: String
    let iconColor: Color
    let action: () -> Void

    var body: some View {
        Button(action: {
            Haptic.light()
            action()
        }) {
            HStack(spacing: 16) {
                // Icon
                ZStack {
                    RoundedRectangle(cornerRadius: 12)
                        .fill(iconColor.opacity(0.12))
                        .frame(width: 44, height: 44)

                    Image(systemName: icon)
                        .font(.system(size: 20, weight: .semibold))
                        .foregroundColor(iconColor)
                }

                // Text
                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                        .font(Theme.PinterestTypography.bodyLarge(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text(subtitle)
                        .font(Theme.PinterestTypography.caption(.regular))
                        .foregroundColor(Theme.Colors.textSecondary)
                }

                Spacer()

                // Chevron
                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Theme.Colors.textTertiary)
            }
            .padding(Theme.PinterestSpacing.md)
            .background(
                RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                    .fill(Color.white.opacity(0.75))
                    .overlay(
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                            .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                    )
            )
            .pinterestShadow(Theme.PinterestShadows.subtle)
        }
        .buttonStyle(ScaleButtonStyle())
    }
}
