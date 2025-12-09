//
//  CustomTabBar.swift
//  IzzIco
//
//  Modern custom tab bar with Lucide icons
//

import SwiftUI

// MARK: - Tab Item Model

struct TabItem: Identifiable {
    let id = UUID()
    let icon: String
    let title: String
    let tag: Int
    var badgeCount: Int = 0
}

// MARK: - Custom Tab Bar

struct CustomTabBar: View {
    @Binding var selectedTab: Int
    let tabs: [TabItem]

    var body: some View {
        HStack(spacing: 0) {
            ForEach(tabs) { tab in
                TabBarButton(
                    tab: tab,
                    isSelected: selectedTab == tab.tag,
                    action: {
                        withAnimation(Theme.Animation.springFast) {
                            selectedTab = tab.tag
                        }
                        Haptic.selection()
                    }
                )
            }
        }
        .frame(height: 80)
        .background(
            .ultraThinMaterial,
            in: Rectangle()
        )
        .overlay(
            Divider()
                .frame(height: 1)
                .background(Theme.Colors.gray200),
            alignment: .top
        )
        .ignoresSafeArea(edges: .bottom)
    }
}

// MARK: - Tab Bar Button

struct TabBarButton: View {
    let tab: TabItem
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 4) {
                ZStack(alignment: .topTrailing) {
                    Image.lucide(tab.icon)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 24, height: 24)
                        .foregroundColor(isSelected ? Theme.Colors.primary : Theme.Colors.gray400)

                    // Badge
                    if tab.badgeCount > 0 {
                        ZStack {
                            Circle()
                                .fill(Theme.Colors.error)
                                .frame(width: 18, height: 18)

                            Text("\(min(tab.badgeCount, 99))")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.white)
                        }
                        .offset(x: 8, y: -8)
                    }
                }
                .frame(height: 28)

                Text(tab.title)
                    .font(.system(size: 11, weight: isSelected ? .semibold : .medium))
                    .foregroundColor(isSelected ? Theme.Colors.primary : Theme.Colors.gray400)
            }
            .frame(maxWidth: .infinity)
            .padding(.top, 8)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Helper to Get Tabs Based on User Type

extension CustomTabBar {
    static func tabs(for userType: User.UserType, unreadMessages: Int = 0) -> [TabItem] {
        switch userType {
        case .searcher:
            return [
                TabItem(icon: "search", title: "Recherche", tag: 0),
                TabItem(icon: "sparkles", title: "Matchs", tag: 1),
                TabItem(icon: "home", title: "Hub", tag: 2),
                TabItem(icon: "message-circle", title: "Messages", tag: 3, badgeCount: unreadMessages),
                TabItem(icon: "user", title: "Profil", tag: 4)
            ]

        case .owner:
            return [
                TabItem(icon: "home", title: "Accueil", tag: 0),
                TabItem(icon: "building-2", title: "Propriétés", tag: 1),
                TabItem(icon: "users", title: "Candidats", tag: 2),
                TabItem(icon: "message-circle", title: "Messages", tag: 3, badgeCount: unreadMessages),
                TabItem(icon: "user", title: "Profil", tag: 4)
            ]

        case .resident:
            return [
                TabItem(icon: "home", title: "Hub", tag: 0),
                TabItem(icon: "credit-card", title: "Dépenses", tag: 1),
                TabItem(icon: "list-checks", title: "Tâches", tag: 2),
                TabItem(icon: "message-circle", title: "Messages", tag: 3, badgeCount: unreadMessages),
                TabItem(icon: "user", title: "Profil", tag: 4)
            ]
        }
    }
}

// MARK: - Preview

struct CustomTabBar_Previews: PreviewProvider {
    static var previews: some View {
        VStack {
            Spacer()

            VStack(spacing: 40) {
                // Searcher tabs
                CustomTabBar(
                    selectedTab: .constant(0),
                    tabs: CustomTabBar.tabs(for: .searcher, unreadMessages: 3)
                )

                // Owner tabs
                CustomTabBar(
                    selectedTab: .constant(2),
                    tabs: CustomTabBar.tabs(for: .owner)
                )

                // Resident tabs
                CustomTabBar(
                    selectedTab: .constant(1),
                    tabs: CustomTabBar.tabs(for: .resident, unreadMessages: 12)
                )
            }
        }
        .background(Theme.Colors.gray50)
    }
}
