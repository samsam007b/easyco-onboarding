//
//  SwipeCardStack.swift
//  EasyCo
//
//  Card stack manager with stacking animations
//

import SwiftUI

struct SwipeCardStack: View {
    @Binding var properties: [Property]
    var onSwipe: (Property, SwipeDirection) -> Void
    var onMatch: (Property) -> Void

    @State private var topCardIndex: Int = 0

    private let maxVisibleCards = 3
    private let cardOffset: CGFloat = 10
    private let scaleDecrement: CGFloat = 0.05

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                if properties.isEmpty {
                    emptyState
                } else {
                    // Show up to 3 cards in stack
                    ForEach(Array(visibleProperties.enumerated()), id: \.element.id) { index, property in
                        SwipeCard(property: property) { direction in
                            handleSwipe(property: property, direction: direction)
                        }
                        .frame(width: geometry.size.width - 40, height: geometry.size.height - 120)
                        .zIndex(Double(visibleProperties.count - index))
                        .offset(y: CGFloat(index) * cardOffset)
                        .scaleEffect(1.0 - (CGFloat(index) * scaleDecrement))
                        .opacity(index < maxVisibleCards ? 1.0 : 0.0)
                        .animation(Theme.Animation.spring, value: topCardIndex)
                    }
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }

    // MARK: - Empty State

    private var emptyState: some View {
        VStack(spacing: 24) {
            Image.lucide("search-x")
                .resizable()
                .scaledToFit()
                .frame(width: 100, height: 100)
                .foregroundColor(Theme.Colors.gray300)

            VStack(spacing: 12) {
                Text("Plus de propriétés")
                    .font(Theme.Typography.title2())
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Vous avez vu toutes les propriétés disponibles.\nRevenez bientôt pour de nouvelles annonces !")
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
                    .multilineTextAlignment(.center)
            }

            PrimaryButton(
                title: "Ajuster mes filtres",
                icon: "sliders",
                action: {
                    // Handle filter adjustment
                }
            )
            .frame(maxWidth: 300)
        }
        .padding(40)
    }

    // MARK: - Computed Properties

    private var visibleProperties: [Property] {
        let startIndex = topCardIndex
        let endIndex = min(startIndex + maxVisibleCards, properties.count)
        guard startIndex < properties.count else { return [] }
        return Array(properties[startIndex..<endIndex])
    }

    // MARK: - Actions

    private func handleSwipe(property: Property, direction: SwipeDirection) {
        // Trigger match for likes and super likes (simulate 30% match rate)
        if (direction == .right || direction == .up) && Bool.random() {
            // Delay to allow card to animate off screen first
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) {
                onMatch(property)
            }
        }

        // Call parent callback
        onSwipe(property, direction)

        // Move to next card
        withAnimation(Theme.Animation.spring) {
            topCardIndex += 1
        }
    }

    // MARK: - Public Methods

    func undo() {
        guard topCardIndex > 0 else { return }
        withAnimation(Theme.Animation.spring) {
            topCardIndex -= 1
        }
        Haptic.impact(.medium)
    }

    func swipeTop(direction: SwipeDirection) {
        guard !visibleProperties.isEmpty else { return }
        let topProperty = visibleProperties[0]
        handleSwipe(property: topProperty, direction: direction)
    }
}

// MARK: - Preview

struct SwipeCardStack_Previews: PreviewProvider {
    static var previews: some View {
        ZStack {
            Theme.Colors.backgroundSecondary
                .ignoresSafeArea()

            SwipeCardStack(
                properties: .constant(Property.mockProperties),
                onSwipe: { property, direction in
                    print("Swiped \(property.title): \(direction)")
                },
                onMatch: { property in
                    print("Match with \(property.title)!")
                }
            )
        }
    }
}
