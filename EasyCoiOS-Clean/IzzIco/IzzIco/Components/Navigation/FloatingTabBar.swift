//
//  FloatingTabBar.swift
//  IzzIco
//
//  Created by Claude on 12/07/2025.
//

import SwiftUI

// MARK: - Floating Tab Bar

struct FloatingTabBar: View {
    @Binding var selectedTab: Int
    @Binding var showSettings: Bool
    @Binding var showSideMenu: Bool
    let primaryColor: Color
    let tabs: [TabItem]
    let onCenterButtonTap: () -> Void

    var body: some View {
        HStack(spacing: 0) {
            // Left icon (Profile)
            Button(action: { showSettings = true }) {
                ZStack {
                    Circle()
                        .fill(primaryColor)
                        .frame(width: 48, height: 48)

                    Image(systemName: "person.fill")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(.white)
                }
            }
            .padding(.leading, 20)

            Spacer()

            // Notification icon
            Button(action: {
                // Handle notifications
            }) {
                ZStack {
                    Circle()
                        .fill(Color(hex: "F3F4F6"))
                        .frame(width: 48, height: 48)

                    Image(systemName: "bell.fill")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(Color(hex: "6B7280"))
                }
            }

            Spacer()

            // Center "+" button
            Button(action: onCenterButtonTap) {
                ZStack {
                    Circle()
                        .fill(primaryColor)
                        .frame(width: 56, height: 56)
                        .shadow(color: primaryColor.opacity(0.3), radius: 8, x: 0, y: 4)

                    Image(systemName: "plus")
                        .font(.system(size: 24, weight: .semibold))
                        .foregroundColor(.white)
                }
            }
            .offset(y: -8)

            Spacer()

            // Menu icon (hamburger)
            Button(action: {
                withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                    showSideMenu = true
                }
                Haptic.impact(.light)
            }) {
                ZStack {
                    Circle()
                        .fill(Color(hex: "F3F4F6"))
                        .frame(width: 48, height: 48)

                    Image(systemName: "line.3.horizontal")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(Color(hex: "6B7280"))
                }
            }
            .padding(.trailing, 20)
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

// MARK: - Tab Item Model

struct TabItem: Identifiable {
    let id: Int
    let title: String
    let icon: String
}

// MARK: - Preview

struct FloatingTabBar_Previews: PreviewProvider {
    static var previews: some View {
        VStack {
            Spacer()
            FloatingTabBar(
                selectedTab: .constant(0),
                showSettings: .constant(false),
                showSideMenu: .constant(false),
                primaryColor: Color(hex: "FFA040"),
                tabs: [
                    TabItem(id: 0, title: "Accueil", icon: "house.fill"),
                    TabItem(id: 1, title: "Explorer", icon: "magnifyingglass"),
                    TabItem(id: 2, title: "Messages", icon: "message.fill")
                ],
                onCenterButtonTap: {}
            )
        }
        .background(Color(hex: "F9FAFB"))
    }
}
