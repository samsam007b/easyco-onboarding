//
//  ContentView.swift
//  EasyCo
//
//  Created by Samuel Baudon on 11/11/2025.
//

import SwiftUI

// MARK: - Root View (Auth Router)

struct RootView: View {
    @EnvironmentObject var authManager: AuthManager
    @AppStorage("hasSeenWelcome") private var hasSeenWelcome = false

    var body: some View {
        ZStack {
            if authManager.isLoading {
                LoadingView()
            } else if authManager.isAuthenticated {
                if let user = authManager.currentUser, !user.onboardingCompleted {
                    // Show onboarding if not completed
                    OnboardingContainerView(
                        coordinator: OnboardingCoordinator(userType: user.userType)
                    )
                } else {
                    // Show main app
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
    @State private var showSideMenu = false

    var body: some View {
        ZStack {
            TabView(selection: $selectedTab) {
                // Dashboard - Main home screen
                NavigationStack {
                    SearcherDashboardView()
                        .navigationTitle("Dashboard")
                        .toolbar {
                            ToolbarItem(placement: .navigationBarLeading) {
                                ProfileButton { showSettings = true }
                            }

                            ToolbarItem(placement: .navigationBarTrailing) {
                                Button(action: {
                                    withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                                        showSideMenu = true
                                    }
                                    Haptic.impact(.light)
                                }) {
                                    Image(systemName: "line.3.horizontal")
                                        .font(.system(size: 18, weight: .medium))
                                        .foregroundColor(Color(hex: "FFA040"))
                                }
                            }
                        }
                }
                .tabItem {
                    Label {
                        Text("Accueil")
                    } icon: {
                        Image("EasyCoHouseIcon")
                            .renderingMode(.template)
                    }
                }
                .tag(0)

                // Browse - Property search and exploration
                NavigationStack {
                    PropertiesListView()
                        .toolbar {
                            ToolbarItem(placement: .navigationBarLeading) {
                                ProfileButton { showSettings = true }
                            }

                            ToolbarItem(placement: .navigationBarTrailing) {
                                Button(action: {
                                    withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                                        showSideMenu = true
                                    }
                                    Haptic.impact(.light)
                                }) {
                                    Image(systemName: "line.3.horizontal")
                                        .font(.system(size: 18, weight: .medium))
                                        .foregroundColor(Color(hex: "FFA040"))
                                }
                            }
                        }
                }
                .tabItem {
                    Label {
                        Text("Explorer")
                    } icon: {
                        Image.lucide("magnifyingglass")
                            .renderingMode(.template)
                    }
                }
                .tag(1)

                // Matches - AI-powered property matches
                NavigationStack {
                    MatchesView()
                        .toolbar {
                            ToolbarItem(placement: .navigationBarLeading) {
                                ProfileButton { showSettings = true }
                            }

                            ToolbarItem(placement: .navigationBarTrailing) {
                                Button(action: {
                                    withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                                        showSideMenu = true
                                    }
                                    Haptic.impact(.light)
                                }) {
                                    Image(systemName: "line.3.horizontal")
                                        .font(.system(size: 18, weight: .medium))
                                        .foregroundColor(Color(hex: "FFA040"))
                                }
                            }
                        }
                }
                .tabItem {
                    Label {
                        Text("Matchs")
                    } icon: {
                        Image.lucide("sparkles")
                            .renderingMode(.template)
                    }
                }
                .tag(2)

                // Favorites
                NavigationStack {
                    FavoritesView()
                        .toolbar {
                            ToolbarItem(placement: .navigationBarLeading) {
                                ProfileButton { showSettings = true }
                            }

                            ToolbarItem(placement: .navigationBarTrailing) {
                                Button(action: {
                                    withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                                        showSideMenu = true
                                    }
                                    Haptic.impact(.light)
                                }) {
                                    Image(systemName: "line.3.horizontal")
                                        .font(.system(size: 18, weight: .medium))
                                        .foregroundColor(Color(hex: "FFA040"))
                                }
                            }
                        }
                }
                .tabItem {
                    Label {
                        Text("Favoris")
                    } icon: {
                        Image.lucide("heart.fill")
                            .renderingMode(.template)
                    }
                }
                .tag(3)

                // Messages
                NavigationStack {
                    MessagesListView()
                        .toolbar {
                            ToolbarItem(placement: .navigationBarLeading) {
                                ProfileButton { showSettings = true }
                            }

                            ToolbarItem(placement: .navigationBarTrailing) {
                                Button(action: {
                                    withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                                        showSideMenu = true
                                    }
                                    Haptic.impact(.light)
                                }) {
                                    Image(systemName: "line.3.horizontal")
                                        .font(.system(size: 18, weight: .medium))
                                        .foregroundColor(Color(hex: "FFA040"))
                                }
                            }
                        }
                }
                .tabItem {
                    Label {
                        Text("Messages")
                    } icon: {
                        Image.lucide("message.fill")
                            .renderingMode(.template)
                    }
                }
                .tag(4)
            }
            .tint(Theme.Colors.searcherPrimary)
            .onAppear {
                let appearance = UITabBarAppearance()

                // Glassomorphism effect using blur material
                appearance.configureWithOpaqueBackground()
                appearance.backgroundEffect = UIBlurEffect(style: .systemUltraThinMaterial)
                appearance.backgroundColor = .clear

                UITabBar.appearance().standardAppearance = appearance
                UITabBar.appearance().scrollEdgeAppearance = appearance
            }
            .sheet(isPresented: $showSettings) {
                SettingsView()
            }

            // Side menu - let it handle its own overlay and animations
            SideMenuView(isShowing: $showSideMenu)
                .zIndex(100)
        }
    }
}

// MARK: - Owner Tab View

struct OwnerTabView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var selectedTab = 0
    @State private var showSettings = false
    @State private var showSideMenu = false

    var body: some View {
        ZStack {
            TabView(selection: $selectedTab) {
                // Dashboard - Overview with KPIs and analytics
                NavigationStack {
                    OwnerDashboardView()
                        .toolbar {
                            ToolbarItem(placement: .navigationBarLeading) {
                                ProfileButton { showSettings = true }
                            }

                            ToolbarItem(placement: .navigationBarTrailing) {
                                Button(action: {
                                    withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                                        showSideMenu = true
                                    }
                                    Haptic.impact(.light)
                                }) {
                                    Image(systemName: "line.3.horizontal")
                                        .font(.system(size: 18, weight: .medium))
                                        .foregroundColor(Color(hex: "6E56CF"))
                                }
                            }
                        }
                }
                .tabItem {
                    Label {
                        Text("Accueil")
                    } icon: {
                        Image("EasyCoHouseIcon")
                            .renderingMode(.template)
                    }
                }
                .tag(0)

                // Properties - Full featured property management
                NavigationStack {
                    OwnerPropertiesView()
                        .toolbar {
                            ToolbarItem(placement: .navigationBarLeading) {
                                ProfileButton { showSettings = true }
                            }

                            ToolbarItem(placement: .navigationBarTrailing) {
                                Button(action: {
                                    withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                                        showSideMenu = true
                                    }
                                    Haptic.impact(.light)
                                }) {
                                    Image(systemName: "line.3.horizontal")
                                        .font(.system(size: 18, weight: .medium))
                                        .foregroundColor(Color(hex: "6E56CF"))
                                }
                            }
                        }
                }
                .tabItem {
                    Label {
                        Text("Propriétés")
                    } icon: {
                        Image.lucide("building.2.fill")
                            .renderingMode(.template)
                    }
                }
                .tag(1)

                // Applications - Full featured applications management
                NavigationStack {
                    ApplicationsView()
                        .toolbar {
                            ToolbarItem(placement: .navigationBarLeading) {
                                ProfileButton { showSettings = true }
                            }

                            ToolbarItem(placement: .navigationBarTrailing) {
                                Button(action: {
                                    withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                                        showSideMenu = true
                                    }
                                    Haptic.impact(.light)
                                }) {
                                    Image(systemName: "line.3.horizontal")
                                        .font(.system(size: 18, weight: .medium))
                                        .foregroundColor(Color(hex: "6E56CF"))
                                }
                            }
                        }
                }
                .tabItem {
                    Label {
                        Text("Candidatures")
                    } icon: {
                        Image.lucide("doc.text.fill")
                            .renderingMode(.template)
                    }
                }
                .tag(2)

                // Finances - Revenue tracking and financial management
                NavigationStack {
                    OwnerFinanceView()
                        .toolbar {
                            ToolbarItem(placement: .navigationBarLeading) {
                                ProfileButton { showSettings = true }
                            }

                            ToolbarItem(placement: .navigationBarTrailing) {
                                Button(action: {
                                    withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                                        showSideMenu = true
                                    }
                                    Haptic.impact(.light)
                                }) {
                                    Image(systemName: "line.3.horizontal")
                                        .font(.system(size: 18, weight: .medium))
                                        .foregroundColor(Color(hex: "6E56CF"))
                                }
                            }
                        }
                }
                .tabItem {
                    Label {
                        Text("Finances")
                    } icon: {
                        Image.lucide("eurosign.circle.fill")
                            .renderingMode(.template)
                    }
                }
                .tag(3)

                // Messages
                NavigationStack {
                    MessagesListView()
                        .toolbar {
                            ToolbarItem(placement: .navigationBarLeading) {
                                ProfileButton { showSettings = true }
                            }

                            ToolbarItem(placement: .navigationBarTrailing) {
                                Button(action: {
                                    withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                                        showSideMenu = true
                                    }
                                    Haptic.impact(.light)
                                }) {
                                    Image(systemName: "line.3.horizontal")
                                        .font(.system(size: 18, weight: .medium))
                                        .foregroundColor(Color(hex: "6E56CF"))
                                }
                            }
                        }
                }
                .tabItem {
                    Label {
                        Text("Messages")
                    } icon: {
                        Image.lucide("message.fill")
                            .renderingMode(.template)
                    }
                }
                .tag(4)
            }
            .tint(Theme.Colors.ownerPrimary)
            .onAppear {
                let appearance = UITabBarAppearance()

                // Glassomorphism effect using blur material
                appearance.configureWithOpaqueBackground()
                appearance.backgroundEffect = UIBlurEffect(style: .systemUltraThinMaterial)
                appearance.backgroundColor = .clear

                UITabBar.appearance().standardAppearance = appearance
                UITabBar.appearance().scrollEdgeAppearance = appearance
            }
            .sheet(isPresented: $showSettings) {
                SettingsView()
            }

            // Side menu - let it handle its own overlay and animations
            SideMenuView(isShowing: $showSideMenu)
                .zIndex(100)
        }
    }
}

// MARK: - Resident Tab View

struct ResidentTabView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var selectedTab = 0
    @State private var showSettings = false
    @State private var showSideMenu = false

    var body: some View {
        ZStack {
            TabView(selection: $selectedTab) {
                // Hub - Full featured dashboard (already has toolbar built-in)
                ResidentHubView()
                    .tabItem {
                        Label {
                        Text("Accueil")
                    } icon: {
                        Image("EasyCoHouseIcon")
                            .renderingMode(.template)
                    }
                    }
                    .tag(0)

                // Tasks - Full featured task management
                NavigationStack {
                    TasksView()
                        .toolbar {
                            ToolbarItem(placement: .navigationBarLeading) {
                                ProfileButton { showSettings = true }
                            }

                            ToolbarItem(placement: .navigationBarTrailing) {
                                Button(action: {
                                    withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                                        showSideMenu = true
                                    }
                                    Haptic.impact(.light)
                                }) {
                                    Image(systemName: "line.3.horizontal")
                                        .font(.system(size: 18, weight: .medium))
                                        .foregroundColor(Color(hex: "E8865D"))
                                }
                            }
                        }
                }
                .tabItem {
                    Label {
                        Text("Tâches")
                    } icon: {
                        Image.lucide("checklist")
                            .renderingMode(.template)
                    }
                }
                .tag(1)

                // Finances - Full featured expense management
                NavigationStack {
                    ExpensesView()
                        .toolbar {
                            ToolbarItem(placement: .navigationBarLeading) {
                                ProfileButton { showSettings = true }
                            }

                            ToolbarItem(placement: .navigationBarTrailing) {
                                Button(action: {
                                    withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                                        showSideMenu = true
                                    }
                                    Haptic.impact(.light)
                                }) {
                                    Image(systemName: "line.3.horizontal")
                                        .font(.system(size: 18, weight: .medium))
                                        .foregroundColor(Color(hex: "E8865D"))
                                }
                            }
                        }
                }
                .tabItem {
                    Label {
                        Text("Finances")
                    } icon: {
                        Image.lucide("creditcard.fill")
                            .renderingMode(.template)
                    }
                }
                .tag(2)

                // Calendar - Full featured event calendar
                NavigationStack {
                    CalendarView()
                        .toolbar {
                            ToolbarItem(placement: .navigationBarLeading) {
                                ProfileButton { showSettings = true }
                            }

                            ToolbarItem(placement: .navigationBarTrailing) {
                                Button(action: {
                                    withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                                        showSideMenu = true
                                    }
                                    Haptic.impact(.light)
                                }) {
                                    Image(systemName: "line.3.horizontal")
                                        .font(.system(size: 18, weight: .medium))
                                        .foregroundColor(Color(hex: "E8865D"))
                                }
                            }
                        }
                }
                .tabItem {
                    Label {
                        Text("Calendrier")
                    } icon: {
                        Image.lucide("calendar")
                            .renderingMode(.template)
                    }
                }
                .tag(3)

                // Messages
                NavigationStack {
                    MessagesListView()
                        .toolbar {
                            ToolbarItem(placement: .navigationBarLeading) {
                                ProfileButton { showSettings = true }
                            }

                            ToolbarItem(placement: .navigationBarTrailing) {
                                Button(action: {
                                    withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                                        showSideMenu = true
                                    }
                                    Haptic.impact(.light)
                                }) {
                                    Image(systemName: "line.3.horizontal")
                                        .font(.system(size: 18, weight: .medium))
                                        .foregroundColor(Color(hex: "E8865D"))
                                }
                            }
                        }
                }
                .tabItem {
                    Label {
                        Text("Messages")
                    } icon: {
                        Image.lucide("message.fill")
                            .renderingMode(.template)
                    }
                }
                .tag(4)
            }
            .tint(Theme.Colors.residentPrimary)
            .onAppear {
                let appearance = UITabBarAppearance()

                // Glassomorphism effect using blur material
                appearance.configureWithOpaqueBackground()
                appearance.backgroundEffect = UIBlurEffect(style: .systemUltraThinMaterial)
                appearance.backgroundColor = .clear

                UITabBar.appearance().standardAppearance = appearance
                UITabBar.appearance().scrollEdgeAppearance = appearance
            }
            .sheet(isPresented: $showSettings) {
                SettingsView()
            }

            // Side menu - let it handle its own overlay and animations
            SideMenuView(isShowing: $showSideMenu)
                .zIndex(100)
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

// MARK: - Previews

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        RootView()
            .environmentObject(AuthManager.shared)
    }
}
