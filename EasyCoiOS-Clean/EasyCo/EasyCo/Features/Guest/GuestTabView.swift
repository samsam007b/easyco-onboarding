import SwiftUI

// MARK: - Guest Tab View

struct GuestTabView: View {
    @State private var selectedTab = 0
    @State private var showWelcomeSheet = false

    var body: some View {
        ZStack(alignment: .bottom) {
            // Tab Content
            TabView(selection: $selectedTab) {
                // 1. Explorer (Properties)
                PropertiesListView()
                    .tabItem {
                        Label("Explorer", systemImage: "magnifyingglass")
                    }
                    .tag(0)

                // 2. Resident Feature
                ResidentFeatureView()
                    .tabItem {
                        Label("Résident", systemImage: "house.fill")
                    }
                    .tag(1)

                // 3. EasyCo Logo (Create Account) - Hidden tab, replaced by custom center button
                Color.clear
                    .tabItem {
                        Label(" ", systemImage: "circle.fill")
                    }
                    .tag(2)

                // 4. Owner Feature
                OwnerFeatureView()
                    .tabItem {
                        Label("Propriétaire", systemImage: "building.2.fill")
                    }
                    .tag(3)

                // 5. Settings/Profile
                GuestSettingsView()
                    .tabItem {
                        Label("Profil", systemImage: "person.fill")
                    }
                    .tag(4)
            }
            .accentColor(Color(hex: "FFA040"))

            // Custom Center Button (EasyCo Logo)
            VStack {
                Spacer()

                HStack {
                    Spacer()
                    Spacer()

                    // Center Button
                    Button(action: {
                        showWelcomeSheet = true
                    }) {
                        ZStack {
                            Circle()
                                .fill(
                                    LinearGradient(
                                        colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                )
                                .frame(width: 64, height: 64)
                                .shadow(color: Color(hex: "FFA040").opacity(0.4), radius: 12, x: 0, y: 4)

                            Image("HouseIcon")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 44, height: 44)
                        }
                    }
                    .offset(y: -20)

                    Spacer()
                    Spacer()
                }
            }
            .padding(.bottom, 0)
        }
        .sheet(isPresented: $showWelcomeSheet) {
            WelcomeSheet(
                isPresented: $showWelcomeSheet,
                onCreateAccount: {
                    showWelcomeSheet = false
                },
                onContinueAsGuest: {
                    showWelcomeSheet = false
                }
            )
        }
    }
}

// MARK: - Guest Settings View

struct GuestSettingsView: View {
    @State private var showWelcomeSheet = false

    var body: some View {
        NavigationStack {
            List {
                Section {
                    Button(action: {
                        showWelcomeSheet = true
                    }) {
                        HStack(spacing: 12) {
                            Image(systemName: "person.crop.circle.fill.badge.plus")
                                .font(.system(size: 24))
                                .foregroundColor(Color(hex: "FFA040"))

                            VStack(alignment: .leading, spacing: 4) {
                                Text("Créer un compte")
                                    .font(.system(size: 17, weight: .semibold))
                                    .foregroundColor(Color(hex: "111827"))

                                Text("Débloque toutes les fonctionnalités")
                                    .font(.system(size: 14))
                                    .foregroundColor(Color(hex: "6B7280"))
                            }

                            Spacer()

                            Image(systemName: "chevron.right")
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "9CA3AF"))
                        }
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

                Section("Informations") {
                    GuestSettingsRow(icon: "info.circle", title: "À propos", value: "")
                    GuestSettingsRow(icon: "questionmark.circle", title: "Aide & Support", value: "")
                    GuestSettingsRow(icon: "doc.text", title: "Conditions d'utilisation", value: "")
                    GuestSettingsRow(icon: "hand.raised", title: "Politique de confidentialité", value: "")
                }

                Section("App") {
                    GuestSettingsRow(icon: "globe", title: "Langue", value: "Français")
                    GuestSettingsRow(icon: "bell", title: "Notifications", value: "")
                }
            }
            .navigationTitle("Profil")
            .navigationBarTitleDisplayMode(.inline)
        }
        .sheet(isPresented: $showWelcomeSheet) {
            WelcomeSheet(
                isPresented: $showWelcomeSheet,
                onCreateAccount: {
                    showWelcomeSheet = false
                },
                onContinueAsGuest: {
                    showWelcomeSheet = false
                }
            )
        }
    }
}

// MARK: - Guest Settings Row Component

struct GuestSettingsRow: View {
    let icon: String
    let title: String
    let value: String

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 20))
                .foregroundColor(Color(hex: "6B7280"))
                .frame(width: 28)

            Text(title)
                .font(.system(size: 16))
                .foregroundColor(Color(hex: "111827"))

            Spacer()

            if !value.isEmpty {
                Text(value)
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            Image(systemName: "chevron.right")
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "9CA3AF"))
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
