import SwiftUI

// MARK: - Guest Tab View

struct GuestTabView: View {
    @State private var selectedTab = 0
    @State private var showWelcome = false

    var body: some View {
        ZStack {
            // Main content based on selected tab
            Group {
                switch selectedTab {
                case 0:
                    NavigationStack {
                        PropertiesListView()
                    }
                case 1:
                    NavigationStack {
                        ResidentFeatureView()
                    }
                case 2:
                    NavigationStack {
                        OwnerFeatureView()
                    }
                default:
                    NavigationStack {
                        PropertiesListView()
                    }
                }
            }

            // Floating Tab Bar
            VStack {
                Spacer()
                GuestFloatingTabBar(
                    selectedTab: $selectedTab,
                    showWelcome: $showWelcome,
                    primaryColor: Color(hex: "FFA040")
                )
            }
            .ignoresSafeArea(.keyboard)
        }
        .fullScreenCover(isPresented: $showWelcome) {
            WelcomeView()
        }
    }
}

// MARK: - Guest Floating Tab Bar

struct GuestFloatingTabBar: View {
    @Binding var selectedTab: Int
    @Binding var showWelcome: Bool
    let primaryColor: Color
    @Namespace private var tabAnimation

    var body: some View {
        HStack(spacing: 0) {
            // Tab 1: Searcher (Orange - default primaryColor)
            GuestTabButton(
                icon: "magnifyingglass",
                label: "Chercheur",
                isSelected: selectedTab == 0,
                primaryColor: primaryColor  // #FFA040
            ) {
                withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                    selectedTab = 0
                }
                Haptic.selection()
            }

            // Tab 2: Resident (Orange/Coral)
            GuestTabButton(
                icon: "house.fill",
                label: "Résident",
                isSelected: selectedTab == 1,
                primaryColor: Theme.Colors.Resident.primary  // #FF5722
            ) {
                withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                    selectedTab = 1
                }
                Haptic.selection()
            }

            // Tab 3: Owner (Mauve)
            GuestTabButton(
                icon: "building.2.fill",
                label: "Propriétaire",
                isSelected: selectedTab == 2,
                primaryColor: Theme.Colors.Owner.primary  // #6E56CF
            ) {
                withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                    selectedTab = 2
                }
                Haptic.selection()
            }
        }
        .frame(height: 80)
        .background(
            RoundedRectangle(cornerRadius: 24)
                .fill(Color.white)
                .shadow(color: .black.opacity(0.08), radius: 16, x: 0, y: -4)
        )
        .padding(.horizontal, 16)
        .padding(.bottom, 8)
    }
}

// MARK: - Guest Tab Button

struct GuestTabButton: View {
    let icon: String
    let label: String
    let isSelected: Bool
    let primaryColor: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.system(size: 24, weight: .semibold))
                    .foregroundColor(isSelected ? primaryColor : Color(hex: "9CA3AF"))
                    .frame(height: 28)

                Text(label)
                    .font(.system(size: 11, weight: isSelected ? .semibold : .medium))
                    .foregroundColor(isSelected ? primaryColor : Color(hex: "6B7280"))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(isSelected ? primaryColor.opacity(0.12) : Color.clear)
            )
        }
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Guest Settings View

struct GuestSettingsView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var showWelcome = false
    @State private var showAbout = false
    @State private var showHelp = false
    @State private var showTerms = false
    @State private var showPrivacy = false
    @State private var showLanguage = false
    @State private var notificationsEnabled = true

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Create Account CTA Section
                    createAccountSection

                    // Informations Section
                    settingsSection(title: "Informations") {
                        SettingsRow(
                            icon: "info.circle.fill",
                            title: "À propos",
                            value: "",
                            color: Color(hex: "3B82F6")
                        ) {
                            showAbout = true
                        }

                        Divider()
                            .padding(.leading, 52)

                        SettingsRow(
                            icon: "questionmark.circle.fill",
                            title: "Aide & Support",
                            value: "",
                            color: Color(hex: "10B981")
                        ) {
                            showHelp = true
                        }

                        Divider()
                            .padding(.leading, 52)

                        SettingsRow(
                            icon: "doc.text.fill",
                            title: "Conditions d'utilisation",
                            value: "",
                            color: Color(hex: "6B7280")
                        ) {
                            showTerms = true
                        }

                        Divider()
                            .padding(.leading, 52)

                        SettingsRow(
                            icon: "shield.fill",
                            title: "Politique de confidentialité",
                            value: "",
                            color: Color(hex: "6B7280")
                        ) {
                            showPrivacy = true
                        }
                    }

                    // App Section
                    settingsSection(title: "App") {
                        SettingsRow(
                            icon: "globe",
                            title: "Langue",
                            value: "Français",
                            color: Color(hex: "6E56CF")
                        ) {
                            showLanguage = true
                        }

                        Divider()
                            .padding(.leading, 52)

                        SettingsToggleRow(
                            icon: "bell.fill",
                            title: "Notifications",
                            isOn: $notificationsEnabled,
                            color: Color(hex: "FBBF24")
                        )
                    }

                    // App Info
                    VStack(spacing: 12) {
                        Image("EasyCoHouseIcon")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 60, height: 60)

                        Text("Version 1.0.0")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "9CA3AF"))
                    }
                    .padding(.top, 16)
                    .padding(.bottom, 32)
                }
                .padding(16)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Paramètres")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: { dismiss() }) {
                        Image.lucide("xmark")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 16, height: 16)
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }
            }
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
    }

    // MARK: - Create Account Section

    private var createAccountSection: some View {
        Button(action: {
            showWelcome = true
        }) {
            HStack(spacing: 16) {
                // Icon with gradient background
                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 56, height: 56)

                    Image.lucide("user-plus")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 24, height: 24)
                        .foregroundColor(.white)
                }

                VStack(alignment: .leading, spacing: 6) {
                    Text("Créer un compte")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "111827"))

                    Text("Débloque toutes les fonctionnalités")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                Spacer()

                Image.lucide("chevron.right")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 12, height: 12)
                    .foregroundColor(Color(hex: "FFA040"))
            }
            .padding(20)
            .background(
                LinearGradient(
                    colors: [Color(hex: "FFF4ED"), Color(hex: "FFF9F5")],
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        }
    }

    // MARK: - Settings Section

    private func settingsSection<Content: View>(title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(Color(hex: "6B7280"))
                .padding(.leading, 4)

            VStack(spacing: 0) {
                content()
            }
            .background(Color.white)
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        }
    }
}

// MARK: - Preview

struct GuestTabView_Previews: PreviewProvider {
    static var previews: some View {
        GuestTabView()
            .environmentObject(AuthManager.shared)
    }
}
