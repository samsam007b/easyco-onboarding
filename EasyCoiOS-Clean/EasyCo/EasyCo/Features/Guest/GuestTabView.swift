import SwiftUI

// MARK: - Guest Tab View

struct GuestTabView: View {
    @State private var selectedTab = 0
    @State private var showWelcome = false

    init() {
        // Configure glassmorphism tab bar appearance (same as authenticated views)
        let appearance = UITabBarAppearance()

        // Glassomorphism effect using blur material
        appearance.configureWithOpaqueBackground()
        appearance.backgroundEffect = UIBlurEffect(style: .systemUltraThinMaterial)
        appearance.backgroundColor = .clear

        UITabBar.appearance().standardAppearance = appearance
        UITabBar.appearance().scrollEdgeAppearance = appearance
    }

    var body: some View {
        ZStack(alignment: .bottom) {
            // Tab Content
            TabView(selection: $selectedTab) {
                // 1. Explorer (Properties)
                PropertiesListView()
                    .tabItem {
                        Label("Explorer", systemImage: AppIcon.search.sfSymbol)
                    }
                    .tag(0)

                // 2. Resident Feature
                ResidentFeatureView()
                    .tabItem {
                        Label("Résident", systemImage: AppIcon.userGroup.sfSymbol)
                    }
                    .tag(1)

                // 3. Connexion (Center Button)
                Color.clear
                    .tabItem {
                        Label("Connexion", systemImage: AppIcon.userPlus.sfSymbol)
                    }
                    .tag(2)

                // 4. Owner Feature
                OwnerFeatureView()
                    .tabItem {
                        Label("Propriétaire", systemImage: AppIcon.building2.sfSymbol)
                    }
                    .tag(3)

                // 5. Settings/Profile
                GuestSettingsView()
                    .tabItem {
                        Label("Profil", systemImage: AppIcon.user.sfSymbol)
                    }
                    .tag(4)
            }
            .accentColor(Color(hex: "FFA040"))
            .onChange(of: selectedTab) { newValue in
                // When "Connexion" tab (tag 2) is tapped, show WelcomeView
                if newValue == 2 {
                    showWelcome = true
                    // Reset to previous tab (Explorer) after showing sheet
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                        selectedTab = 0
                    }
                }
            }
        }
        .fullScreenCover(isPresented: $showWelcome) {
            WelcomeView()
        }
    }
}

// MARK: - Guest Settings View

struct GuestSettingsView: View {
    @State private var showWelcome = false
    @State private var showAbout = false
    @State private var showHelp = false
    @State private var showTerms = false
    @State private var showPrivacy = false
    @State private var showLanguage = false
    @State private var showNotifications = false

    var body: some View {
        NavigationStack {
            List {
                Section {
                    Button(action: {
                        showWelcome = true
                    }) {
                        HStack(spacing: 16) {
                            // Icon with signature style
                            ZStack {
                                Circle()
                                    .fill(
                                        LinearGradient(
                                            colors: [
                                                Color(hex: "FFA040").opacity(0.15),
                                                Color(hex: "FFB85C").opacity(0.15)
                                            ],
                                            startPoint: .topLeading,
                                            endPoint: .bottomTrailing
                                        )
                                    )
                                    .frame(width: 56, height: 56)

                                Image(systemName: AppIcon.userPlus.sfSymbol)
                                    .font(.system(size: 28, weight: .medium))
                                    .foregroundColor(Color(hex: "FFA040"))
                            }

                            VStack(alignment: .leading, spacing: 6) {
                                Text("Créer un compte")
                                    .font(.system(size: 18, weight: .bold))
                                    .foregroundColor(Color(hex: "111827"))

                                Text("Débloque toutes les fonctionnalités")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(Color(hex: "6B7280"))
                            }

                            Spacer()

                            Image(systemName: AppIcon.chevronRight.sfSymbol)
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(Color(hex: "FFA040"))
                        }
                        .padding(.vertical, 12)
                    }
                    .listRowBackground(
                        LinearGradient(
                            colors: [
                                Color(hex: "FFF4ED"),
                                Color(hex: "FFF9F5")
                            ],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                }

                Section {
                    Button(action: { showAbout = true }) {
                        GuestSettingsRow(icon: AppIcon.info.sfSymbol, title: "À propos", value: "", color: Color(hex: "3B82F6"))
                    }

                    Button(action: { showHelp = true }) {
                        GuestSettingsRow(icon: AppIcon.questionmark.sfSymbol, title: "Aide & Support", value: "", color: Color(hex: "10B981"))
                    }

                    Button(action: { showTerms = true }) {
                        GuestSettingsRow(icon: AppIcon.doc.sfSymbol, title: "Conditions d'utilisation", value: "", color: Color(hex: "6B7280"))
                    }

                    Button(action: { showPrivacy = true }) {
                        GuestSettingsRow(icon: AppIcon.shield.sfSymbol, title: "Politique de confidentialité", value: "", color: Color(hex: "6B7280"))
                    }
                } header: {
                    Text("Informations")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(Color(hex: "6B7280"))
                        .textCase(.uppercase)
                        .tracking(0.5)
                }

                Section {
                    Button(action: { showLanguage = true }) {
                        GuestSettingsRow(icon: AppIcon.globe.sfSymbol, title: "Langue", value: "Français", color: Color(hex: "6E56CF"))
                    }

                    Button(action: { showNotifications = true }) {
                        GuestSettingsRow(icon: AppIcon.bell.sfSymbol, title: "Notifications", value: "", color: Color(hex: "F59E0B"))
                    }
                } header: {
                    Text("App")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(Color(hex: "6B7280"))
                        .textCase(.uppercase)
                        .tracking(0.5)
                }
            }
            .listStyle(.insetGrouped)
            .navigationTitle("Profil")
            .navigationBarTitleDisplayMode(.large)
        }
        .fullScreenCover(isPresented: $showWelcome) {
            WelcomeView()
        }
        .sheet(isPresented: $showAbout) {
            AboutView()
        }
        .sheet(isPresented: $showHelp) {
            HelpSupportView()
        }
        .sheet(isPresented: $showTerms) {
            GuestTermsOfServiceView()
        }
        .sheet(isPresented: $showPrivacy) {
            GuestPrivacyPolicyView()
        }
        .sheet(isPresented: $showLanguage) {
            LanguageSettingsGuestView()
        }
        .sheet(isPresented: $showNotifications) {
            NotificationSettingsGuestView()
        }
    }
}

// MARK: - Guest Settings Row Component

struct GuestSettingsRow: View {
    let icon: String
    let title: String
    let value: String
    var color: Color = Color(hex: "6B7280")

    var body: some View {
        HStack(spacing: 16) {
            // Icon container with color
            ZStack {
                Circle()
                    .fill(color.opacity(0.12))
                    .frame(width: 36, height: 36)

                Image(systemName: icon)
                    .font(.system(size: 18, weight: .medium))
                    .foregroundColor(color)
            }

            Text(title)
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(Color(hex: "111827"))

            Spacer()

            if !value.isEmpty {
                Text(value)
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            Image(systemName: AppIcon.chevronRight.sfSymbol)
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(Color(hex: "D1D5DB"))
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Preview

struct GuestTabView_Previews: PreviewProvider {
    static var previews: some View {
        GuestTabView()
            .environmentObject(AuthManager.shared)
    }
}
