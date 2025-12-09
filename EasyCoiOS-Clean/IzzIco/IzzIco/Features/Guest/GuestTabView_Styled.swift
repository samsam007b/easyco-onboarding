import SwiftUI

// MARK: - Guest Tab View (Figma Styled with Signature Icons)

struct GuestTabView_Styled: View {
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
                PropertiesListView_Styled()
                    .tabItem {
                        VStack(spacing: 4) {
                            // Signature Icon - Search
                            Image(systemName: AppIcon.search.sfSymbol)
                                .font(.system(size: 24))
                            Text("Découvrir")
                                .font(.system(size: 11, weight: .medium))
                        }
                    }
                    .tag(0)

                // 2. Resident Feature
                ResidentFeatureView()
                    .tabItem {
                        VStack(spacing: 4) {
                            // Signature Icon - Home
                            Image(systemName: AppIcon.home.sfSymbol)
                                .font(.system(size: 24))
                            Text("Résident")
                                .font(.system(size: 11, weight: .medium))
                        }
                    }
                    .tag(1)

                // 3. EasyCo Logo (Create Account) - Hidden tab, replaced by custom center button
                Color.clear
                    .tabItem {
                        VStack(spacing: 4) {
                            Image(systemName: "circle.fill")
                                .font(.system(size: 24))
                            Text(" ")
                                .font(.system(size: 11))
                        }
                    }
                    .tag(2)

                // 4. Owner Feature
                OwnerFeatureView()
                    .tabItem {
                        VStack(spacing: 4) {
                            // Signature Icon - Building
                            Image(systemName: AppIcon.building2.sfSymbol)
                                .font(.system(size: 24))
                            Text("Propriétaire")
                                .font(.system(size: 11, weight: .medium))
                        }
                    }
                    .tag(3)

                // 5. Settings/Profile
                GuestSettingsView_Styled()
                    .tabItem {
                        VStack(spacing: 4) {
                            // Signature Icon - User
                            Image(systemName: AppIcon.user.sfSymbol)
                                .font(.system(size: 24))
                            Text("Profil")
                                .font(.system(size: 11, weight: .medium))
                        }
                    }
                    .tag(4)
            }
            .accentColor(Color(hex: "FFA040"))

            // Custom Center Button (EasyCo Logo) - Figma Style
            VStack {
                Spacer()

                HStack {
                    Spacer()
                    Spacer()

                    // Center Button with signature gradient
                    Button(action: {
                        showWelcome = true
                    }) {
                        ZStack {
                            // Outer glow
                            Circle()
                                .fill(Color(hex: "FFA040").opacity(0.2))
                                .frame(width: 76, height: 76)
                                .blur(radius: 8)

                            // Main button
                            Circle()
                                .fill(
                                    LinearGradient(
                                        colors: [
                                            Color(hex: "FFA040"),
                                            Color(hex: "FFB85C")
                                        ],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                )
                                .frame(width: 68, height: 68)
                                .shadow(
                                    color: Color(hex: "FFA040").opacity(0.4),
                                    radius: 16,
                                    x: 0,
                                    y: 8
                                )

                            // Icon
                            Image("IzzIcoHouseIcon")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 48, height: 48)
                        }
                    }
                    .offset(y: -24)

                    Spacer()
                    Spacer()
                }
            }
            .padding(.bottom, 0)
        }
        .fullScreenCover(isPresented: $showWelcome) {
            WelcomeView()
        }
    }
}

// MARK: - Guest Settings View (Figma Styled with Signature Icons)

struct GuestSettingsView_Styled: View {
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
                // Hero CTA Section
                Section {
                    Button(action: {
                        showWelcome = true
                    }) {
                        HStack(spacing: 16) {
                            // Signature Icon Container
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

                                Image(systemName: "person.crop.circle.fill.badge.plus")
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

                            // Chevron
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

                // Informations Section
                Section {
                    Button(action: { showAbout = true }) {
                        GuestSettingsRow_Styled(
                            icon: "info.circle",
                            title: "À propos",
                            value: "",
                            color: Color(hex: "3B82F6")
                        )
                    }

                    Button(action: { showHelp = true }) {
                        GuestSettingsRow_Styled(
                            icon: "questionmark.circle",
                            title: "Aide & Support",
                            value: "",
                            color: Color(hex: "10B981")
                        )
                    }

                    Button(action: { showTerms = true }) {
                        GuestSettingsRow_Styled(
                            icon: "doc.text",
                            title: "Conditions d'utilisation",
                            value: "",
                            color: Color(hex: "6B7280")
                        )
                    }

                    Button(action: { showPrivacy = true }) {
                        GuestSettingsRow_Styled(
                            icon: "hand.raised",
                            title: "Politique de confidentialité",
                            value: "",
                            color: Color(hex: "6B7280")
                        )
                    }
                } header: {
                    Text("Informations")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(Color(hex: "6B7280"))
                        .textCase(.uppercase)
                        .tracking(0.5)
                }

                // App Settings Section
                Section {
                    Button(action: { showLanguage = true }) {
                        GuestSettingsRow_Styled(
                            icon: "globe",
                            title: "Langue",
                            value: "Français",
                            color: Color(hex: "6E56CF")
                        )
                    }

                    Button(action: { showNotifications = true }) {
                        GuestSettingsRow_Styled(
                            icon: AppIcon.bell.sfSymbol,
                            title: "Notifications",
                            value: "",
                            color: Color(hex: "F59E0B")
                        )
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

// MARK: - Guest Settings Row Component (Figma Styled with Signature Icons)

struct GuestSettingsRow_Styled: View {
    let icon: String
    let title: String
    let value: String
    let color: Color

    init(icon: String, title: String, value: String, color: Color = Color(hex: "6B7280")) {
        self.icon = icon
        self.title = title
        self.value = value
        self.color = color
    }

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

struct GuestTabView_Styled_Previews: PreviewProvider {
    static var previews: some View {
        GuestTabView_Styled()
            .environmentObject(AuthManager.shared)
    }
}
