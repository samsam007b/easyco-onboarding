//
//  MatchSwipeView.swift
//  EasyCo
//
//  Main swipe view with Tinder-style interaction
//

import SwiftUI

struct MatchSwipeView: View {
    @State private var properties: [Property] = []
    @State private var swipedProperties: [(Property, SwipeDirection)] = []
    @State private var matchedProperty: Property?
    @State private var showMatchCelebration = false
    @State private var showFilters = false
    @State private var activeFiltersCount = 0

    // Mock data
    private var mockProperties: [Property] {
        [
            .mock,
            Property(
                id: "2",
                title: "Studio lumineux avec balcon",
                location: "Bruxelles, Louise",
                price: 680,
                bedrooms: 1,
                bathrooms: 1,
                area: 35,
                images: ["https://via.placeholder.com/400x300/90EE90"],
                isNew: false,
                isVerified: true,
                matchScore: 92,
                distance: 0.8,
                availableFrom: "1er avril"
            ),
            Property(
                id: "3",
                title: "Grande maison de maître rénovée",
                location: "Bruxelles, Uccle",
                price: 1450,
                bedrooms: 4,
                bathrooms: 2,
                area: 150,
                images: ["https://via.placeholder.com/400x300/FFB6C1"],
                isNew: true,
                isVerified: true,
                matchScore: 78,
                distance: 5.2,
                availableFrom: "Immédiatement"
            ),
            Property(
                id: "4",
                title: "Appartement 2 chambres meublé",
                location: "Bruxelles, Etterbeek",
                price: 950,
                bedrooms: 2,
                bathrooms: 1,
                area: 80,
                images: ["https://via.placeholder.com/400x300/87CEEB"],
                isNew: false,
                isVerified: false,
                matchScore: 85,
                distance: 3.1,
                availableFrom: "15 mai"
            ),
            Property(
                id: "5",
                title: "Loft moderne avec terrasse",
                location: "Bruxelles, Flagey",
                price: 1100,
                bedrooms: 2,
                bathrooms: 1,
                area: 90,
                images: ["https://via.placeholder.com/400x300/DDA0DD"],
                isNew: true,
                isVerified: true,
                matchScore: 88,
                distance: 1.5,
                availableFrom: "1er juin"
            ),
            Property(
                id: "6",
                title: "Chambre en colocation",
                location: "Bruxelles, Saint-Gilles",
                price: 450,
                bedrooms: 1,
                bathrooms: 1,
                area: 12,
                images: ["https://via.placeholder.com/400x300/F0E68C"],
                isNew: false,
                isVerified: true,
                matchScore: 75,
                distance: 2.8,
                availableFrom: "Immédiatement"
            )
        ]
    }

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.Colors.backgroundSecondary
                    .ignoresSafeArea()

                VStack(spacing: 0) {
                    // Header
                    header
                        .padding(.horizontal)
                        .padding(.top, 8)

                    Spacer().frame(height: 20)

                    // Card stack
                    SwipeCardStack(
                        properties: $properties,
                        onSwipe: handleSwipe,
                        onMatch: handleMatch
                    )
                    .padding(.horizontal, 20)

                    Spacer().frame(height: 20)

                    // Action buttons
                    actionButtons
                        .padding(.horizontal)
                        .padding(.bottom, 20)
                }

                // Match celebration overlay
                if showMatchCelebration, let property = matchedProperty {
                    MatchCelebrationView(
                        property: property,
                        onSendMessage: {
                            showMatchCelebration = false
                            // Navigate to conversation
                        },
                        onKeepSwiping: {
                            showMatchCelebration = false
                        }
                    )
                    .transition(.opacity)
                    .zIndex(100)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Découvrir")
                        .font(Theme.Typography.title3())
                        .foregroundColor(Theme.Colors.textPrimary)
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    IconButton(
                        icon: "sliders",
                        action: {
                            showFilters = true
                        },
                        size: 36,
                        iconSize: 18,
                        backgroundColor: Theme.Colors.backgroundPrimary,
                        hasShadow: true
                    )
                    .overlay(
                        // Filter count badge
                        activeFiltersCount > 0 ?
                        Circle()
                            .fill(Theme.Colors.primary)
                            .frame(width: 18, height: 18)
                            .overlay(
                                Text("\(activeFiltersCount)")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.white)
                            )
                            .offset(x: 12, y: -12)
                        : nil
                    )
                }
            }
            .sheet(isPresented: $showFilters) {
                FiltersView(
                    isPresented: $showFilters,
                    filters: .constant(PropertyFilters())
                )
            }
        }
        .onAppear {
            loadProperties()
        }
    }

    // MARK: - Header

    private var header: some View {
        VStack(spacing: 12) {
            // Stats row
            HStack(spacing: 20) {
                StatBadge(
                    icon: "eye",
                    value: "\(swipedProperties.count)",
                    label: "vues"
                )

                StatBadge(
                    icon: "heart",
                    value: "\(swipedProperties.filter { $0.1 == .right || $0.1 == .up }.count)",
                    label: "likes"
                )

                StatBadge(
                    icon: "users",
                    value: "3",
                    label: "matchs"
                )

                Spacer()
            }
        }
    }

    // MARK: - Action Buttons

    private var actionButtons: some View {
        HStack(spacing: 20) {
            // Undo
            SwipeActionButton(
                icon: "rotate-ccw",
                size: 50,
                iconSize: 22,
                backgroundColor: .white,
                foregroundColor: Theme.Colors.warning,
                action: {
                    // Undo last swipe
                    Haptic.impact(.medium)
                }
            )
            .disabled(swipedProperties.isEmpty)
            .opacity(swipedProperties.isEmpty ? 0.4 : 1.0)

            Spacer()

            // Nope
            SwipeActionButton(
                icon: "x",
                size: 60,
                iconSize: 28,
                backgroundColor: .white,
                foregroundColor: Theme.Colors.error,
                action: {
                    // Trigger left swipe programmatically
                }
            )

            // Super Like
            SwipeActionButton(
                icon: "star",
                size: 55,
                iconSize: 26,
                backgroundColor: Theme.Colors.primary,
                foregroundColor: .white,
                action: {
                    // Trigger up swipe programmatically
                }
            )

            // Like
            SwipeActionButton(
                icon: "heart",
                size: 60,
                iconSize: 28,
                backgroundColor: .white,
                foregroundColor: Theme.Colors.success,
                action: {
                    // Trigger right swipe programmatically
                }
            )

            Spacer()

            // Info/Details
            SwipeActionButton(
                icon: "info",
                size: 50,
                iconSize: 22,
                backgroundColor: .white,
                foregroundColor: Theme.Colors.info,
                action: {
                    // Show property details
                    Haptic.impact(.light)
                }
            )
        }
    }

    // MARK: - Actions

    private func loadProperties() {
        properties = mockProperties
    }

    private func handleSwipe(property: Property, direction: SwipeDirection) {
        swipedProperties.append((property, direction))

        // Log the swipe
        let actionText = switch direction {
        case .left: "passed"
        case .right: "liked"
        case .up: "super liked"
        }
        print("User \(actionText) \(property.title)")
    }

    private func handleMatch(property: Property) {
        matchedProperty = property
        withAnimation(Theme.Animation.spring) {
            showMatchCelebration = true
        }
    }
}

// MARK: - Supporting Views

struct StatBadge: View {
    let icon: String
    let value: String
    let label: String

    var body: some View {
        HStack(spacing: 8) {
            Image.lucide(icon)
                .resizable()
                .scaledToFit()
                .frame(width: 16, height: 16)
                .foregroundColor(Theme.Colors.primary)

            VStack(alignment: .leading, spacing: 2) {
                Text(value)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(label)
                    .font(.system(size: 11))
                    .foregroundColor(Theme.Colors.textSecondary)
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, y: 2)
    }
}

struct SwipeActionButton: View {
    let icon: String
    let size: CGFloat
    let iconSize: CGFloat
    let backgroundColor: Color
    let foregroundColor: Color
    let action: () -> Void

    var body: some View {
        Button(action: {
            Haptic.impact(.medium)
            action()
        }) {
            Image.lucide(icon)
                .resizable()
                .scaledToFit()
                .frame(width: iconSize, height: iconSize)
                .foregroundColor(foregroundColor)
                .frame(width: size, height: size)
                .background(backgroundColor)
                .cornerRadius(size / 2)
                .shadow(color: foregroundColor.opacity(0.3), radius: 8, x: 0, y: 4)
        }
        .buttonStyle(ScaleButtonStyle())
    }
}

struct ScaleButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.9 : 1.0)
            .animation(Theme.Animation.springFast, value: configuration.isPressed)
    }
}

// MARK: - Preview

struct MatchSwipeView_Previews: PreviewProvider {
    static var previews: some View {
        MatchSwipeView()
    }
}
