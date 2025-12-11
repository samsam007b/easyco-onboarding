//
//  ContentView.swift
//  IzzIco
//
//  Created by Samuel Baudon on 11/11/2025.
//

import SwiftUI

// MARK: - Root View (Auth Router)

struct RootView: View {
    @EnvironmentObject var authManager: AuthManager
    @AppStorage("hasSeenWelcome") private var hasSeenWelcome = false
    @State private var isUpdatingRole = false

    var body: some View {
        ZStack {
            if authManager.isLoading || isUpdatingRole {
                LoadingView()
            } else if authManager.isAuthenticated {
                if let user = authManager.currentUser {
                    // Check if user needs to select a role first
                    if user.userType == .searcher && !user.onboardingCompleted {
                        // Show role selection as first step for new users
                        // (New users default to .searcher but haven't explicitly chosen)
                        RoleSelectionView { selectedRole in
                            Task {
                                isUpdatingRole = true
                                do {
                                    try await authManager.updateUserType(selectedRole)
                                    print("✅ Role selected and saved: \(selectedRole)")
                                    isUpdatingRole = false
                                } catch {
                                    print("❌ Failed to save role: \(error)")
                                    isUpdatingRole = false
                                }
                            }
                        }
                    } else if !user.onboardingCompleted {
                        // Show onboarding if not completed
                        OnboardingContainerView(
                            coordinator: OnboardingCoordinator(userType: user.userType)
                        )
                    } else {
                        // Show main app
                        MainTabView()
                    }
                } else {
                    // Should not happen, but fallback to main tab
                    MainTabView()
                }
            } else {
                // Show welcome view with sliding auth sheet
                WelcomeView()
            }
        }
        .onAppear {
            print("🔍 RootView appeared")
            print("📱 Auth status - isLoading: \(authManager.isLoading), isAuthenticated: \(authManager.isAuthenticated)")
            if let user = authManager.currentUser {
                print("📱 User type: \(user.userType), onboarding: \(user.onboardingCompleted)")
            }
        }
    }
}

// MARK: - Main Tab View (Role-Based)

struct MainTabView: View {
    @EnvironmentObject var authManager: AuthManager

    var body: some View {
        Group {
            if let user = authManager.currentUser {
                switch user.userType {
                case .searcher:
                    SearcherTabView()
                case .owner:
                    OwnerTabView()
                case .resident:
                    ResidentTabView()
                }
            } else {
                // Fallback to searcher view
                SearcherTabView()
            }
        }
    }
}

// MARK: - Searcher Tab View

struct SearcherTabView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var selectedTab = 0
    @State private var showSettings = false

    var body: some View {
        ZStack {
            // Main content based on selected tab
            Group {
                switch selectedTab {
                case 0:
                    NavigationStack {
                        SearcherDashboardView()
                            .navigationTitle("Dashboard")
                            .navigationBarTitleDisplayMode(.large)
                    }
                case 1:
                    NavigationStack {
                        PropertiesListView()
                    }
                case 2:
                    NavigationStack {
                        MatchesView()
                    }
                case 3:
                    NavigationStack {
                        FavoritesView()
                    }
                case 4:
                    NavigationStack {
                        MessagesListView()
                    }
                default:
                    NavigationStack {
                        SearcherDashboardView()
                    }
                }
            }

            // Floating Tab Bar
            VStack {
                Spacer()
                FloatingTabBar(
                    selectedTab: $selectedTab,
                    primaryColor: Theme.Colors.searcherPrimary,
                    tabs: [
                        FloatingTabItem(id: 0, title: "Accueil", icon: "house.fill"),
                        FloatingTabItem(id: 1, title: "Explorer", icon: "magnifyingglass"),
                        FloatingTabItem(id: 2, title: "Matchs", icon: "sparkles"),
                        FloatingTabItem(id: 3, title: "Favoris", icon: "heart.fill"),
                        FloatingTabItem(id: 4, title: "Messages", icon: "message.fill")
                    ]
                )
            }
            .ignoresSafeArea(.keyboard)
        }
        .sheet(isPresented: $showSettings) {
            SettingsView()
        }
    }
}

// MARK: - Owner Tab View

struct OwnerTabView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var selectedTab = 0
    @State private var showSettings = false

    var body: some View {
        ZStack {
            // Main content based on selected tab
            Group {
                switch selectedTab {
                case 0:
                    NavigationStack {
                        OwnerDashboardView()
                            .toolbar(.hidden, for: .navigationBar)
                    }
                case 1:
                    NavigationStack {
                        OwnerPropertiesView()
                    }
                case 2:
                    NavigationStack {
                        ApplicationsView()
                    }
                case 3:
                    NavigationStack {
                        OwnerFinanceView()
                    }
                case 4:
                    NavigationStack {
                        MessagesListView()
                    }
                default:
                    NavigationStack {
                        OwnerDashboardView()
                    }
                }
            }

            // Floating Tab Bar
            VStack {
                Spacer()
                FloatingTabBar(
                    selectedTab: $selectedTab,
                    primaryColor: Theme.Colors.ownerPrimary,
                    tabs: [
                        FloatingTabItem(id: 0, title: "Accueil", icon: "house.fill"),
                        FloatingTabItem(id: 1, title: "Propriétés", icon: "building.2.fill"),
                        FloatingTabItem(id: 2, title: "Candidatures", icon: "doc.text.fill"),
                        FloatingTabItem(id: 3, title: "Finances", icon: "eurosign.circle.fill"),
                        FloatingTabItem(id: 4, title: "Messages", icon: "message.fill")
                    ]
                )
            }
            .ignoresSafeArea(.keyboard)
        }
        .sheet(isPresented: $showSettings) {
            SettingsView()
        }
    }
}

// MARK: - Resident Tab View

struct ResidentTabView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var selectedTab = 0
    @State private var showSettings = false

    var body: some View {
        ZStack {
            // Main content based on selected tab
            Group {
                switch selectedTab {
                case 0:
                    ResidentHubView()
                case 1:
                    TasksView()
                case 2:
                    ExpensesView()
                case 3:
                    CalendarView()
                case 4:
                    NavigationStack {
                        MessagesListView()
                    }
                default:
                    ResidentHubView()
                }
            }

            // Floating Tab Bar
            VStack {
                Spacer()
                FloatingTabBar(
                    selectedTab: $selectedTab,
                    primaryColor: Theme.Colors.residentPrimary,
                    tabs: [
                        FloatingTabItem(id: 0, title: "Accueil", icon: "house.fill"),
                        FloatingTabItem(id: 1, title: "Tâches", icon: "checklist"),
                        FloatingTabItem(id: 2, title: "Finances", icon: "creditcard.fill"),
                        FloatingTabItem(id: 3, title: "Calendrier", icon: "calendar"),
                        FloatingTabItem(id: 4, title: "Messages", icon: "message.fill")
                    ]
                )
            }
            .ignoresSafeArea(.keyboard)
        }
        .sheet(isPresented: $showSettings) {
            SettingsView()
        }
    }
}

// MARK: - Profile Button Component

struct ProfileButton: View {
    @EnvironmentObject var authManager: AuthManager
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            if let imageUrl = authManager.currentUser?.profileImageURL,
               !imageUrl.isEmpty {
                AsyncImage(url: URL(string: imageUrl)) { image in
                    image
                        .resizable()
                        .scaledToFill()
                } placeholder: {
                    profilePlaceholder
                }
                .frame(width: 32, height: 32)
                .clipShape(Circle())
            } else {
                profilePlaceholder
            }
        }
    }

    private var profilePlaceholder: some View {
        ZStack {
            Circle()
                .fill(
                    LinearGradient(
                        colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(width: 32, height: 32)

            Text(initials)
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(.white)
        }
    }

    private var initials: String {
        let firstName = authManager.currentUser?.firstName ?? ""
        let lastName = authManager.currentUser?.lastName ?? ""

        if firstName.isEmpty && lastName.isEmpty {
            return String(authManager.currentUser?.email.prefix(1).uppercased() ?? "?")
        }

        let firstInitial = firstName.prefix(1).uppercased()
        let lastInitial = lastName.prefix(1).uppercased()
        return "\(firstInitial)\(lastInitial)"
    }
}

// MARK: - Resident Hub Placeholder View

struct ResidentHubPlaceholderView: View {
    @EnvironmentObject var authManager: AuthManager

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Welcome Header
                VStack(spacing: 8) {
                    Text("Bienvenue, \(authManager.currentUser?.firstName ?? "Résident") !")
                        .font(.system(size: 28, weight: .bold))
                        .foregroundColor(Color(hex: "111827"))

                    Text("Votre espace colocation")
                        .font(.system(size: 16))
                        .foregroundColor(Color(hex: "6B7280"))
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, 20)
                .padding(.top, 20)

                // Quick Stats Cards
                HStack(spacing: 16) {
                    StatCardView(
                        title: "Tâches",
                        value: "3",
                        subtitle: "à faire",
                        icon: "checklist",
                        color: Color(hex: "E8865D")
                    )

                    StatCardView(
                        title: "Événements",
                        value: "2",
                        subtitle: "cette semaine",
                        icon: "calendar",
                        color: Color(hex: "6E56CF")
                    )
                }
                .padding(.horizontal, 20)

                HStack(spacing: 16) {
                    StatCardView(
                        title: "Dépenses",
                        value: "€125",
                        subtitle: "ce mois",
                        icon: "creditcard",
                        color: Color(hex: "10B981")
                    )

                    StatCardView(
                        title: "Messages",
                        value: "5",
                        subtitle: "non lus",
                        icon: "message.fill",
                        color: Color(hex: "3B82F6")
                    )
                }
                .padding(.horizontal, 20)

                // Coming Soon Section
                VStack(spacing: 16) {
                    Text("Fonctionnalités à venir")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                        .frame(maxWidth: .infinity, alignment: .leading)

                    VStack(spacing: 12) {
                        FeatureRowView(icon: "person.3.fill", title: "Gestion des colocataires")
                        FeatureRowView(icon: "doc.text.fill", title: "Documents partagés")
                        FeatureRowView(icon: "bell.fill", title: "Rappels automatiques")
                        FeatureRowView(icon: "chart.pie.fill", title: "Statistiques de dépenses")
                    }
                    .padding(16)
                    .background(Color.white)
                    .cornerRadius(16)
                    .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
                }
                .padding(.horizontal, 20)

                Spacer(minLength: 32)
            }
        }
        .background(Color(hex: "F9FAFB"))
        .navigationTitle("Hub")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Stat Card View

private struct StatCardView: View {
    let title: String
    let value: String
    let subtitle: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: icon)
                    .font(.system(size: 20))
                    .foregroundColor(color)
                Spacer()
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(value)
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text(subtitle)
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            Text(title)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Color(hex: "374151"))
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Feature Row View

private struct FeatureRowView: View {
    let icon: String
    let title: String

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundColor(Color(hex: "E8865D"))
                .frame(width: 24)

            Text(title)
                .font(.system(size: 15))
                .foregroundColor(Color(hex: "374151"))

            Spacer()

            Text("Bientôt")
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(Color(hex: "9CA3AF"))
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(Color(hex: "F3F4F6"))
                .cornerRadius(6)
        }
    }
}

// MARK: - Floating Tab Bar

struct FloatingTabBar: View {
    @Binding var selectedTab: Int
    let primaryColor: Color
    let tabs: [FloatingTabItem]
    @Namespace private var tabAnimation

    var body: some View {
        GeometryReader { geometry in
            let tabWidth = geometry.size.width / CGFloat(tabs.count)
            let indicatorWidth = tabWidth - 20
            let indicatorOffset = CGFloat(selectedTab) * tabWidth + (tabWidth - indicatorWidth) / 2

            ZStack(alignment: .top) {
                // Tab buttons
                HStack(spacing: 0) {
                    ForEach(tabs) { tab in
                        ZStack {
                            // Indicator background for selected tab
                            if selectedTab == tab.id {
                                RoundedRectangle(cornerRadius: 12)
                                    .fill(primaryColor.opacity(0.15))
                                    .padding(.horizontal, 16)
                                    .padding(.vertical, 16)
                                    .matchedGeometryEffect(id: "tab_indicator", in: tabAnimation)
                            }

                            FloatingTabButton(
                                tab: tab,
                                isSelected: selectedTab == tab.id,
                                primaryColor: primaryColor
                            ) {
                                withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                                    selectedTab = tab.id
                                }
                                Haptic.selection()
                            }
                        }
                        .frame(width: tabWidth)
                    }
                }
            }
        }
        .frame(height: 80)
        .background(
            RoundedRectangle(cornerRadius: 24)
                .fill(Color.white.opacity(0.5))
                .background(.ultraThinMaterial)
                .clipShape(RoundedRectangle(cornerRadius: 24))
                .overlay(
                    RoundedRectangle(cornerRadius: 24)
                        .fill(Color.white.opacity(0.3))
                        .frame(height: 0.5),
                    alignment: .top
                )
                .shadow(color: .black.opacity(0.08), radius: 16, x: 0, y: -4)
        )
        .padding(.horizontal, 16)
        .padding(.bottom, 8)
    }
}

// MARK: - Floating Tab Button

struct FloatingTabButton: View {
    let tab: FloatingTabItem
    let isSelected: Bool
    let primaryColor: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 4) {
                Image(systemName: tab.icon)
                    .font(.system(size: 22, weight: isSelected ? .semibold : .medium))
                    .foregroundColor(isSelected ? primaryColor : Color(hex: "9CA3AF"))
                    .frame(width: 24, height: 24)

                Text(tab.title)
                    .font(.system(size: 11, weight: isSelected ? .semibold : .medium))
                    .foregroundColor(isSelected ? primaryColor : Color(hex: "9CA3AF"))
                    .lineLimit(1)
                    .minimumScaleFactor(0.8)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .padding(.vertical, 12)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Floating Tab Item Model

struct FloatingTabItem: Identifiable {
    let id: Int
    let title: String
    let icon: String
}

// MARK: - Previews

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        RootView()
            .environmentObject(AuthManager.shared)
    }
}
