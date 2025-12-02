//
//  MatchCelebrationView.swift
//  EasyCo
//
//  Match celebration modal with confetti animation
//

import SwiftUI

struct MatchCelebrationView: View {
    let property: Property
    var onSendMessage: () -> Void
    var onKeepSwiping: () -> Void

    @State private var scale: CGFloat = 0.5
    @State private var opacity: Double = 0
    @State private var confettiTrigger = 0

    var body: some View {
        ZStack {
            // Dimmed background
            Color.black.opacity(0.85)
                .ignoresSafeArea()
                .onTapGesture {
                    onKeepSwiping()
                }

            VStack(spacing: 0) {
                Spacer()

                // Celebration content
                celebrationContent

                Spacer()

                // Action buttons
                actionButtons
            }
            .padding(Theme.Spacing.xl)

            // Confetti overlay
            ConfettiView(trigger: confettiTrigger)
        }
        .onAppear {
            startCelebration()
        }
    }

    // MARK: - Celebration Content

    private var celebrationContent: some View {
        VStack(spacing: 32) {
            // "C'est un match!" title with gradient
            VStack(spacing: 16) {
                Image.lucide("heart")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 80, height: 80)
                    .foregroundStyle(Theme.Colors.primaryGradient)

                Text("C'est un match !")
                    .font(.system(size: 40, weight: .heavy))
                    .foregroundStyle(Theme.Colors.primaryGradient)
            }
            .scaleEffect(scale)
            .opacity(opacity)

            // Property info card
            matchCard
                .scaleEffect(scale)
                .opacity(opacity)

            // Match message
            Text("Vous avez tous les deux aimé cette propriété.\nC'est le moment de démarrer la conversation !")
                .font(Theme.Typography.body())
                .foregroundColor(.white.opacity(0.9))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 20)
                .opacity(opacity)
        }
    }

    private var matchCard: some View {
        HStack(spacing: 0) {
            // Property image
            AsyncImage(url: URL(string: property.images.first ?? "")) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                Rectangle()
                    .fill(Theme.Colors.gray200)
            }
            .frame(width: 140, height: 180)
            .clipped()

            // Property info
            VStack(alignment: .leading, spacing: 12) {
                VStack(alignment: .leading, spacing: 6) {
                    Text("\(property.price)€/mois")
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(Theme.Colors.primary)

                    Text(property.title)
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)
                        .lineLimit(2)

                    HStack(spacing: 4) {
                        Image.lucide("map-pin")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 12, height: 12)
                            .foregroundColor(Theme.Colors.textSecondary)

                        Text(property.location)
                            .font(Theme.Typography.bodySmall())
                            .foregroundColor(Theme.Colors.textSecondary)
                            .lineLimit(1)
                    }
                }

                Spacer()

                // Features
                HStack(spacing: 12) {
                    if property.bedrooms > 0 {
                        MatchCardFeature(icon: "bed", value: "\(property.bedrooms)")
                    }

                    if property.bathrooms > 0 {
                        MatchCardFeature(icon: "bath", value: "\(property.bathrooms)")
                    }

                    if let area = property.area {
                        MatchCardFeature(icon: "ruler", value: "\(area)m²")
                    }
                }
            }
            .padding(16)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .frame(maxWidth: 320, maxHeight: 180)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .shadow(color: Theme.Colors.primary.opacity(0.3), radius: 20, x: 0, y: 10)
    }

    // MARK: - Action Buttons

    private var actionButtons: some View {
        VStack(spacing: 16) {
            PrimaryButton(
                title: "Envoyer un message",
                icon: "send",
                action: {
                    Haptic.notification(.success)
                    onSendMessage()
                }
            )

            SecondaryButton(
                title: "Continuer à swiper",
                icon: nil,
                action: {
                    Haptic.impact(.light)
                    onKeepSwiping()
                }
            )
        }
        .opacity(opacity)
    }

    // MARK: - Animations

    private func startCelebration() {
        // Haptic feedback
        Haptic.notification(.success)

        // Scale and fade in animation
        withAnimation(Theme.Animation.spring.delay(0.1)) {
            scale = 1.0
            opacity = 1.0
        }

        // Trigger confetti
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
            confettiTrigger += 1
        }
    }
}

// MARK: - Supporting Views

private struct MatchCardFeature: View {
    let icon: String
    let value: String

    var body: some View {
        HStack(spacing: 4) {
            Image.lucide(icon)
                .resizable()
                .scaledToFit()
                .frame(width: 14, height: 14)
                .foregroundColor(Theme.Colors.textSecondary)

            Text(value)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(Theme.Colors.textSecondary)
        }
    }
}

// MARK: - Confetti View

struct ConfettiView: View {
    let trigger: Int

    @State private var confettiPieces: [ConfettiPiece] = []

    var body: some View {
        ZStack {
            ForEach(confettiPieces) { piece in
                ConfettiShape()
                    .fill(piece.color)
                    .frame(width: piece.size, height: piece.size)
                    .rotationEffect(piece.rotation)
                    .offset(x: piece.x, y: piece.y)
                    .opacity(piece.opacity)
            }
        }
        .ignoresSafeArea()
        .allowsHitTesting(false)
        .onChange(of: trigger) { _ in
            generateConfetti()
        }
    }

    private func generateConfetti() {
        let colors: [Color] = [
            Theme.Colors.primary,
            Theme.Colors.secondary,
            Theme.Colors.success,
            Theme.Colors.info,
            Color.pink,
            Color.purple,
            Color.yellow
        ]

        let screenWidth = UIScreen.main.bounds.width
        let screenHeight = UIScreen.main.bounds.height

        // Generate 50 confetti pieces
        for _ in 0..<50 {
            let piece = ConfettiPiece(
                color: colors.randomElement()!,
                size: CGFloat.random(in: 8...16),
                x: CGFloat.random(in: -screenWidth/2...screenWidth/2),
                y: -screenHeight/2,
                rotation: .degrees(Double.random(in: 0...360)),
                opacity: 1.0
            )
            confettiPieces.append(piece)

            // Animate piece falling
            let randomDuration = Double.random(in: 1.5...3.0)
            let randomDelay = Double.random(in: 0...0.5)

            withAnimation(.easeIn(duration: randomDuration).delay(randomDelay)) {
                if let index = confettiPieces.firstIndex(where: { $0.id == piece.id }) {
                    confettiPieces[index].y = screenHeight
                    confettiPieces[index].x += CGFloat.random(in: -100...100)
                    confettiPieces[index].rotation = .degrees(Double.random(in: 360...720))
                    confettiPieces[index].opacity = 0
                }
            }
        }

        // Clean up after animation
        DispatchQueue.main.asyncAfter(deadline: .now() + 4) {
            confettiPieces.removeAll()
        }
    }
}

// MARK: - Confetti Models

struct ConfettiPiece: Identifiable {
    let id = UUID()
    let color: Color
    let size: CGFloat
    var x: CGFloat
    var y: CGFloat
    var rotation: Angle
    var opacity: Double
}

struct ConfettiShape: Shape {
    func path(in rect: CGRect) -> Path {
        // Simple square/rectangle shape for confetti
        Path { path in
            path.addRect(rect)
        }
    }
}

// MARK: - Preview

struct MatchCelebrationView_Previews: PreviewProvider {
    static var previews: some View {
        MatchCelebrationView(
            property: .mock,
            onSendMessage: {
                print("Send message tapped")
            },
            onKeepSwiping: {
                print("Keep swiping tapped")
            }
        )
    }
}
