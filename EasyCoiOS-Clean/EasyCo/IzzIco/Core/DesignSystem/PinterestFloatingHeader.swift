//
//  PinterestFloatingHeader.swift
//  IzzIco
//
//  Floating header with glassmorphism - appears/disappears with scroll
//  Same effect as bottom tab bar
//

import SwiftUI

// MARK: - Floating Header

struct PinterestFloatingHeader: View {
    let role: Theme.UserRole
    let showAddButton: Bool
    let onProfileTap: () -> Void
    let onAlertTap: () -> Void
    let onMenuTap: () -> Void
    let onAddTap: (() -> Void)?

    @Binding var isVisible: Bool
    @State private var hasNotifications = false

    var body: some View {
        HStack(spacing: 16) {
            // Profile button
            Button(action: {
                Haptic.light()
                onProfileTap()
            }) {
                Circle()
                    .fill(role.gradient)
                    .frame(width: 40, height: 40)
                    .overlay(
                        Image(systemName: "person.fill")
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(.white)
                    )
                    .pinterestShadow(Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.3))
            }

            Spacer()

            // Alert button
            Button(action: {
                Haptic.light()
                onAlertTap()
            }) {
                ZStack(alignment: .topTrailing) {
                    Circle()
                        .fill(Color.white.opacity(0.5))
                        .frame(width: 40, height: 40)
                        .overlay(
                            Circle()
                                .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                        )
                        .overlay(
                            Image(systemName: "bell.fill")
                                .font(.system(size: 18, weight: .semibold))
                                .foregroundColor(hasNotifications ? role.primaryColor : Theme.Colors.textSecondary)
                        )
                        .pinterestShadow(Theme.PinterestShadows.subtle)

                    if hasNotifications {
                        Circle()
                            .fill(Color(hex: "EF4444"))
                            .frame(width: 12, height: 12)
                            .overlay(
                                Circle()
                                    .stroke(Color.white, lineWidth: 2)
                            )
                            .offset(x: 2, y: -2)
                    }
                }
            }

            // Menu hamburger button
            Button(action: {
                Haptic.light()
                onMenuTap()
            }) {
                Circle()
                    .fill(Color.white.opacity(0.5))
                    .frame(width: 40, height: 40)
                    .overlay(
                        Circle()
                            .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                    )
                    .overlay(
                        Image(systemName: "line.3.horizontal")
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(Theme.Colors.textPrimary)
                    )
                    .pinterestShadow(Theme.PinterestShadows.subtle)
            }

            // Add button (conditional)
            if showAddButton, let addAction = onAddTap {
                Button(action: {
                    Haptic.light()
                    addAction()
                }) {
                    Circle()
                        .fill(role.gradient)
                        .frame(width: 44, height: 44)
                        .overlay(
                            Image(systemName: "plus")
                                .font(.system(size: 20, weight: .semibold))
                                .foregroundColor(.white)
                        )
                        .pinterestShadow(Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.35))
                }
            }
        }
        .padding(.horizontal, Theme.PinterestSpacing.lg)
        .padding(.vertical, 12)
        .background(
            Rectangle()
                .fill(Color.white.opacity(0.5))
                .background(.ultraThinMaterial)
                .ignoresSafeArea()
        )
        .overlay(
            Rectangle()
                .fill(Color.white.opacity(0.3))
                .frame(height: 0.5),
            alignment: .bottom
        )
        .offset(y: isVisible ? 0 : -100)
        .opacity(isVisible ? 1 : 0)
        .animation(Theme.PinterestAnimations.smoothSpring, value: isVisible)
    }
}

// MARK: - ScrollView with Header Detection

struct ScrollViewWithFloatingHeader<Content: View>: View {
    let role: Theme.UserRole
    let showAddButton: Bool
    let onProfileTap: () -> Void
    let onAlertTap: () -> Void
    let onMenuTap: () -> Void
    let onAddTap: (() -> Void)?
    let content: Content

    @State private var scrollOffset: CGFloat = 0
    @State private var showHeader = false

    init(
        role: Theme.UserRole,
        showAddButton: Bool = false,
        onProfileTap: @escaping () -> Void,
        onAlertTap: @escaping () -> Void,
        onMenuTap: @escaping () -> Void,
        onAddTap: (() -> Void)? = nil,
        @ViewBuilder content: () -> Content
    ) {
        self.role = role
        self.showAddButton = showAddButton
        self.onProfileTap = onProfileTap
        self.onAlertTap = onAlertTap
        self.onMenuTap = onMenuTap
        self.onAddTap = onAddTap
        self.content = content()
    }

    var body: some View {
        ZStack(alignment: .top) {
            // ScrollView with offset tracking
            ScrollView(showsIndicators: false) {
                GeometryReader { geometry in
                    Color.clear.preference(
                        key: ScrollOffsetPreferenceKey.self,
                        value: geometry.frame(in: .named("scroll")).minY
                    )
                }
                .frame(height: 0)

                content
            }
            .coordinateSpace(name: "scroll")
            .onPreferenceChange(ScrollOffsetPreferenceKey.self) { value in
                let offset = value

                withAnimation(Theme.PinterestAnimations.smoothSpring) {
                    // Show header when scrolling up, hide when scrolling down
                    if offset < -50 { // Scrolled down more than 50pts
                        showHeader = true
                    } else if offset > -20 { // Near top
                        showHeader = false
                    }
                }

                scrollOffset = offset
            }

            // Floating header
            if showHeader {
                PinterestFloatingHeader(
                    role: role,
                    showAddButton: showAddButton,
                    onProfileTap: onProfileTap,
                    onAlertTap: onAlertTap,
                    onMenuTap: onMenuTap,
                    onAddTap: onAddTap,
                    isVisible: $showHeader
                )
                .zIndex(999)
            }
        }
    }
}

// MARK: - Scroll Offset Preference Key

struct ScrollOffsetPreferenceKey: PreferenceKey {
    static var defaultValue: CGFloat = 0

    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}

// MARK: - View Extension

extension View {
    func withFloatingHeader(
        role: Theme.UserRole,
        showAddButton: Bool = false,
        onProfileTap: @escaping () -> Void,
        onAlertTap: @escaping () -> Void,
        onMenuTap: @escaping () -> Void,
        onAddTap: (() -> Void)? = nil
    ) -> some View {
        ScrollViewWithFloatingHeader(
            role: role,
            showAddButton: showAddButton,
            onProfileTap: onProfileTap,
            onAlertTap: onAlertTap,
            onMenuTap: onMenuTap,
            onAddTap: onAddTap
        ) {
            self
        }
    }
}
