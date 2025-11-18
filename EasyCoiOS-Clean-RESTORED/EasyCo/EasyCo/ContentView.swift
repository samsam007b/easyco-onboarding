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
            // Browse Properties
            PropertiesListView()
                .tabItem {
                    Label("Explorer", systemImage: "magnifyingglass")
                }
                .tag(0)

            // Matches with Compatibility Scores
            MatchesView()
                .tabItem {
                    Label("Matchs", systemImage: "sparkles")
                }
                .tag(1)

            // My Applications
            // TODO: Implement MyApplicationsView
            Text("Candidatures")
                .tabItem {
                    Label("Candidatures", systemImage: "doc.text.fill")
                }
                .tag(2)

            // Search Groups
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

            // Profile
            ProfileView()
                .tabItem {
                    Label("Profil", systemImage: "person.fill")
                }
                .tag(5)
        }
        .accentColor(Color(hex: "FFA040"))
    }
}

// MARK: - Owner Tab View

struct OwnerTabView: View {
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            // Properties
            OwnerPropertiesView()
                .tabItem {
                    Label("Propriétés", systemImage: "building.2.fill")
                }
                .tag(0)

            // Applications
            ApplicationsView()
                .tabItem {
                    Label("Candidatures", systemImage: "doc.text.fill")
                }
                .tag(1)

            // Messages
            MessagesListView()
                .tabItem {
                    Label("Messages", systemImage: "message.fill")
                }
                .tag(2)

            // Profile
            ProfileView()
                .tabItem {
                    Label("Profil", systemImage: "person.fill")
                }
                .tag(3)
        }
        .accentColor(Color(hex: "6E56CF"))
    }
}

// MARK: - Resident Tab View

struct ResidentTabView: View {
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            // Hub
            ResidentHubView()
                .tabItem {
                    Label("Hub", systemImage: "house.fill")
                }
                .tag(0)

            // Tasks
            TasksView()
                .tabItem {
                    Label("Tâches", systemImage: "checklist")
                }
                .tag(1)

            // Messages
            MessagesListView()
                .tabItem {
                    Label("Messages", systemImage: "message.fill")
                }
                .tag(2)

            // Profile
            ProfileView()
                .tabItem {
                    Label("Profil", systemImage: "person.fill")
                }
                .tag(3)
        }
        .accentColor(Color(hex: "E8865D"))
    }
}

// MARK: - Previews

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        RootView()
            .environmentObject(AuthManager.shared)
    }
}
