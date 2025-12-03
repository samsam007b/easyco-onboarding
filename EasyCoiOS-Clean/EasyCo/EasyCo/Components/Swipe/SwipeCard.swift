//
//  SwipeCard.swift
//  EasyCo
//
//  Tinder-style swipe card for property matching
//

import SwiftUI

struct SwipeCard: View {
    let property: Property
    var onRemove: (SwipeDirection) -> Void

    @State private var offset: CGSize = .zero
    @State private var rotation: Angle = .zero
    @State private var scale: CGFloat = 1.0

    private let swipeThreshold: CGFloat = 120
    private let rotationMultiplier: Double = 0.15

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Background card with property info
                cardContent

                // Overlay indicators (Like/Nope/Super Like)
                swipeOverlays
            }
            .frame(width: geometry.size.width, height: geometry.size.height)
            .offset(offset)
            .rotationEffect(rotation)
            .scaleEffect(scale)
            .gesture(
                DragGesture()
                    .onChanged { gesture in
                        handleDragChanged(gesture, geometry: geometry)
                    }
                    .onEnded { gesture in
                        handleDragEnded(gesture, geometry: geometry)
                    }
            )
        }
    }

    // MARK: - Card Content

    private var cardContent: some View {
        ZStack(alignment: .bottom) {
            // Main image
            AsyncImage(url: URL(string: property.images.first ?? "")) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                Rectangle()
                    .fill(Theme.Colors.gray200)
                    .overlay(
                        ProgressView()
                    )
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .clipped()

            // Gradient overlay at bottom
            LinearGradient(
                colors: [
                    .clear,
                    .black.opacity(0.4),
                    .black.opacity(0.8)
                ],
                startPoint: .center,
                endPoint: .bottom
            )
            .frame(height: 300)

            // Info overlay
            infoOverlay
        }
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.xl)
        .shadow(color: .black.opacity(0.2), radius: 20, x: 0, y: 10)
    }

    private var infoOverlay: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Price & Match Score
            HStack(alignment: .top) {
                HStack(alignment: .firstTextBaseline, spacing: 4) {
                    Text("\(property.price)€")
                        .font(.system(size: 32, weight: .bold))
                        .foregroundColor(.white)

                    Text("/mois")
                        .font(Theme.Typography.body())
                        .foregroundColor(.white.opacity(0.9))
                }

                Spacer()

                if let matchScore = property.matchScore, matchScore > 0 {
                    HStack(spacing: 6) {
                        Circle()
                            .fill(Theme.Colors.success)
                            .frame(width: 8, height: 8)

                        Text("\(matchScore)%")
                            .font(Theme.Typography.bodySmall(.bold))
                    }
                    .foregroundColor(.white)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .background(Theme.Colors.primaryGradient)
                    .cornerRadius(20)
                }
            }

            // Title
            Text(property.title)
                .font(.system(size: 22, weight: .semibold))
                .foregroundColor(.white)
                .lineLimit(2)

            // Location
            HStack(spacing: 6) {
                Image.lucide("map-pin")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 16, height: 16)
                    .foregroundColor(.white.opacity(0.9))

                Text(property.location)
                    .font(Theme.Typography.body())
                    .foregroundColor(.white.opacity(0.9))

                if let distance = property.distance {
                    Text("• \(String(format: "%.1f", distance))km")
                        .font(Theme.Typography.body())
                        .foregroundColor(.white.opacity(0.8))
                }
            }

            // Features
            HStack(spacing: 20) {
                if property.bedrooms > 0 {
                    SwipeCardFeature(icon: "bed", value: "\(property.bedrooms)")
                }

                if property.bathrooms > 0 {
                    SwipeCardFeature(icon: "bath", value: "\(property.bathrooms)")
                }

                if let area = property.area {
                    SwipeCardFeature(icon: "ruler", value: "\(area)m²")
                }
            }

            // Badges
            HStack(spacing: 8) {
                if property.isNew {
                    SwipeCardBadge(text: "Nouveau", color: Theme.Colors.primary)
                }

                if property.isVerified {
                    SwipeCardBadge(text: "Vérifié", color: Theme.Colors.success, icon: "check")
                }

                if let availableFrom = property.availableFrom {
                    SwipeCardBadge(text: availableFrom, color: Theme.Colors.info, icon: "calendar")
                }
            }
        }
        .padding(24)
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    // MARK: - Swipe Overlays

    private var swipeOverlays: some View {
        ZStack {
            // LIKE (right swipe) - Green
            swipeOverlay(
                text: "J'AIME",
                color: Theme.Colors.success,
                icon: "heart",
                opacity: likeOpacity
            )
            .rotationEffect(.degrees(-20))
            .offset(x: -50, y: -120)

            // NOPE (left swipe) - Red
            swipeOverlay(
                text: "PASSER",
                color: Theme.Colors.error,
                icon: "x",
                opacity: nopeOpacity
            )
            .rotationEffect(.degrees(20))
            .offset(x: 50, y: -120)

            // SUPER LIKE (up swipe) - Orange
            swipeOverlay(
                text: "SUPER",
                color: Theme.Colors.primary,
                icon: "star",
                opacity: superLikeOpacity
            )
            .offset(y: -80)
        }
    }

    private func swipeOverlay(text: String, color: Color, icon: String, opacity: Double) -> some View {
        VStack(spacing: 8) {
            Image.lucide(icon)
                .resizable()
                .scaledToFit()
                .frame(width: 40, height: 40)

            Text(text)
                .font(.system(size: 28, weight: .heavy))
        }
        .foregroundColor(color)
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .stroke(color, lineWidth: 5)
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .fill(.white.opacity(0.95))
                )
        )
        .opacity(opacity)
    }

    // MARK: - Computed Properties

    private var likeOpacity: Double {
        guard offset.width > 0 else { return 0 }
        return Double(min(offset.width / swipeThreshold, 1.0))
    }

    private var nopeOpacity: Double {
        guard offset.width < 0 else { return 0 }
        return Double(min(abs(offset.width) / swipeThreshold, 1.0))
    }

    private var superLikeOpacity: Double {
        guard offset.height < 0 else { return 0 }
        return Double(min(abs(offset.height) / swipeThreshold, 1.0))
    }

    // MARK: - Gesture Handlers

    private func handleDragChanged(_ gesture: DragGesture.Value, geometry: GeometryProxy) {
        offset = gesture.translation

        // Calculate rotation based on horizontal drag
        let rotationAmount = Double(gesture.translation.width / geometry.size.width) * rotationMultiplier
        rotation = .degrees(rotationAmount * 20)

        // Add haptic feedback at threshold
        if abs(gesture.translation.width) > swipeThreshold || abs(gesture.translation.height) > swipeThreshold {
            Haptic.impact(.light)
        }
    }

    private func handleDragEnded(_ gesture: DragGesture.Value, geometry: GeometryProxy) {
        let width = gesture.translation.width
        let height = gesture.translation.height

        // Determine swipe direction
        var direction: SwipeDirection? = nil

        // Check for super like (up swipe) first
        if height < -swipeThreshold && abs(height) > abs(width) {
            direction = .up
        }
        // Check for like (right swipe)
        else if width > swipeThreshold {
            direction = .right
        }
        // Check for nope (left swipe)
        else if width < -swipeThreshold {
            direction = .left
        }

        if let direction = direction {
            // Swipe off screen
            swipeOffScreen(direction: direction, geometry: geometry)
        } else {
            // Return to center
            returnToCenter()
        }
    }

    private func swipeOffScreen(direction: SwipeDirection, geometry: GeometryProxy) {
        let targetOffset: CGSize

        switch direction {
        case .left:
            targetOffset = CGSize(width: -geometry.size.width * 1.5, height: offset.height)
            Haptic.notification(.error)
        case .right:
            targetOffset = CGSize(width: geometry.size.width * 1.5, height: offset.height)
            Haptic.notification(.success)
        case .up:
            targetOffset = CGSize(width: offset.width, height: -geometry.size.height * 1.5)
            Haptic.notification(.success)
        }

        withAnimation(Theme.Animation.spring) {
            offset = targetOffset
            scale = 0.8
        }

        // Remove card after animation
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            onRemove(direction)
        }
    }

    private func returnToCenter() {
        withAnimation(Theme.Animation.spring) {
            offset = .zero
            rotation = .zero
            scale = 1.0
        }
        Haptic.impact(.light)
    }
}

// MARK: - Swipe Direction
// Note: SwipeDirection is defined in Features/Matches/SwipeCardView.swift

// MARK: - Supporting Views

private struct SwipeCardFeature: View {
    let icon: String
    let value: String

    var body: some View {
        HStack(spacing: 6) {
            Image.lucide(icon)
                .resizable()
                .scaledToFit()
                .frame(width: 18, height: 18)
                .foregroundColor(.white.opacity(0.9))

            Text(value)
                .font(Theme.Typography.body(.semibold))
                .foregroundColor(.white.opacity(0.9))
        }
    }
}

private struct SwipeCardBadge: View {
    let text: String
    let color: Color
    var icon: String? = nil

    var body: some View {
        HStack(spacing: 6) {
            if let icon = icon {
                Image.lucide(icon)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 12, height: 12)
            }

            Text(text)
                .font(Theme.Typography.caption(.semibold))
        }
        .foregroundColor(.white)
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(color)
        .cornerRadius(12)
    }
}

// MARK: - Preview

struct SwipeCard_Previews: PreviewProvider {
    static var previews: some View {
        ZStack {
            Theme.Colors.backgroundSecondary
                .ignoresSafeArea()

            SwipeCard(property: .mock) { direction in
                print("Swiped: \(direction)")
            }
            .frame(width: 350, height: 600)
            .padding()
        }
    }
}
