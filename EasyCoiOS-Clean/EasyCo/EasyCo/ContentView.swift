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
                LoginView()
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
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            // Browse
            PropertiesListView()
                .tabItem {
                    Label("Explorer", systemImage: "magnifyingglass")
                }
                .tag(0)

            // Favorites
            FavoritesView()
                .tabItem {
                    Label("Favoris", systemImage: "heart.fill")
                }
                .tag(1)

            // Matches
            Text("Matchs") // TODO: Create MatchesView
                .tabItem {
                    Label("Matchs", systemImage: "sparkles")
                }
                .tag(2)

            // Groups
            GroupsListView()
                .tabItem {
                    Label("Groupes", systemImage: "person.3.fill")
                }
                .tag(3)

            // Messages
            MessagesListView()
                .tabItem {
                    Label("Messages", systemImage: "message.fill")
                }
                .tag(4)
        }
        .accentColor(Theme.Colors.searcherPrimary)
    }
}

// MARK: - Owner Tab View

struct OwnerTabView: View {
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            // Properties
            Text("Mes Propriétés") // TODO: Create OwnerPropertiesView
                .tabItem {
                    Label("Propriétés", systemImage: "building.2.fill")
                }
                .tag(0)

            // Applications
            Text("Candidatures") // TODO: Create ApplicationsView
                .tabItem {
                    Label("Candidatures", systemImage: "doc.text.fill")
                }
                .tag(1)

            // Finance
            Text("Finance") // TODO: Create FinanceView
                .tabItem {
                    Label("Finance", systemImage: "dollarsign.circle.fill")
                }
                .tag(2)

            // Messages
            MessagesListView()
                .tabItem {
                    Label("Messages", systemImage: "message.fill")
                }
                .tag(3)
        }
        .accentColor(Theme.Colors.ownerPrimary)
    }
}

// MARK: - Resident Tab View

struct ResidentTabView: View {
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            // Hub
            Text("Hub") // TODO: Create ResidentHubView
                .tabItem {
                    Label("Hub", systemImage: "house.fill")
                }
                .tag(0)

            // Tasks
            Text("Tâches") // TODO: Create TasksView
                .tabItem {
                    Label("Tâches", systemImage: "checklist")
                }
                .tag(1)

            // Finances
            Text("Finances") // TODO: Create ResidentFinanceView
                .tabItem {
                    Label("Finances", systemImage: "creditcard.fill")
                }
                .tag(2)

            // Calendar
            Text("Calendrier") // TODO: Create CalendarView
                .tabItem {
                    Label("Calendrier", systemImage: "calendar")
                }
                .tag(3)

            // Messages
            MessagesListView()
                .tabItem {
                    Label("Messages", systemImage: "message.fill")
                }
                .tag(4)
        }
        .accentColor(Theme.Colors.residentPrimary)
    }
}

// MARK: - Previews

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        RootView()
            .environmentObject(AuthManager.shared)
    }
}
