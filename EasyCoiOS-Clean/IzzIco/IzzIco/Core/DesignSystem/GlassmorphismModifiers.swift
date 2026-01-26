import SwiftUI

// MARK: - Glassmorphism View Modifiers
// Reusable modifiers for creating glassmorphic effects

// MARK: - Glass Effect Modifier

struct GlassEffectModifier: ViewModifier {
    let blurRadius: CGFloat
    let opacity: Double
    let cornerRadius: CGFloat
    let borderOpacity: Double

    func body(content: Content) -> some View {
        content
            .background(
                ZStack {
                    // Blur backdrop
                    Color.white.opacity(opacity)
                        .background(.ultraThinMaterial)

                    // Subtle gradient overlay
                    LinearGradient(
                        colors: [
                            Color.white.opacity(0.3),
                            Color.white.opacity(0.1)
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                }
            )
            .cornerRadius(cornerRadius)
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius)
                    .stroke(Color.white.opacity(borderOpacity), lineWidth: 1)
            )
    }
}

// MARK: - Glass Card Variants

extension View {
    /// Apply standard glass effect
    func glassEffect(
        blur: CGFloat = DesignTokens.BlurRadius.medium,
        opacity: Double = 0.15,
        cornerRadius: CGFloat = DesignTokens.CornerRadius.lg,
        borderOpacity: Double = 0.3
    ) -> some View {
        self.modifier(GlassEffectModifier(
            blurRadius: blur,
            opacity: opacity,
            cornerRadius: cornerRadius,
            borderOpacity: borderOpacity
        ))
    }

    /// Glass card with shadow (most common)
    func glassCard(
        cornerRadius: CGFloat = DesignTokens.CornerRadius.lg,
        shadow: ShadowStyle = DesignTokens.Shadows.level2
    ) -> some View {
        self
            .glassEffect(cornerRadius: cornerRadius)
            .applyShadow(shadow)
    }

    /// Elevated glass card (for floating elements)
    func glassCardElevated() -> some View {
        self
            .glassEffect(
                blur: DesignTokens.BlurRadius.heavy,
                opacity: 0.2,
                cornerRadius: DesignTokens.CornerRadius.xl
            )
            .applyShadow(DesignTokens.Shadows.level3)
    }

    /// Subtle glass card (for backgrounds)
    func glassCardSubtle() -> some View {
        self
            .glassEffect(
                blur: DesignTokens.BlurRadius.light,
                opacity: 0.1,
                cornerRadius: DesignTokens.CornerRadius.md,
                borderOpacity: 0.2
            )
            .applyShadow(DesignTokens.Shadows.level1)
    }
}

// MARK: - Gradient Overlay Modifier

struct GradientOverlayModifier: ViewModifier {
    let gradient: LinearGradient
    let opacity: Double

    func body(content: Content) -> some View {
        content
            .overlay(
                gradient
                    .opacity(opacity)
                    .allowsHitTesting(false)
            )
    }
}

extension View {
    func gradientOverlay(_ gradient: LinearGradient, opacity: Double = 0.1) -> some View {
        self.modifier(GradientOverlayModifier(gradient: gradient, opacity: opacity))
    }

    func searcherGradientOverlay(opacity: Double = 0.1) -> some View {
        self.gradientOverlay(DesignTokens.Searcher.gradient, opacity: opacity)
    }

    func ownerGradientOverlay(opacity: Double = 0.1) -> some View {
        self.gradientOverlay(DesignTokens.Owner.gradient, opacity: opacity)
    }

    func residentGradientOverlay(opacity: Double = 0.1) -> some View {
        self.gradientOverlay(DesignTokens.Resident.gradient, opacity: opacity)
    }
}

// MARK: - Interactive Glass Effect

struct InteractiveGlassModifier: ViewModifier {
    @State private var isPressed = false

    func body(content: Content) -> some View {
        content
            .glassCard()
            .scaleEffect(isPressed ? 0.97 : 1.0)
            .animation(.spring(response: 0.3, dampingFraction: 0.6), value: isPressed)
            .simultaneousGesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { _ in
                        if !isPressed {
                            isPressed = true
                            HapticFeedback.light()
                        }
                    }
                    .onEnded { _ in
                        isPressed = false
                    }
            )
    }
}

extension View {
    func interactiveGlass() -> some View {
        self.modifier(InteractiveGlassModifier())
    }
}

// MARK: - Frosted Glass Background

struct FrostedGlassBackground: View {
    let cornerRadius: CGFloat

    var body: some View {
        ZStack {
            Color.white.opacity(0.15)

            VisualEffectBlur(blurStyle: .systemUltraThinMaterial)
                .opacity(0.9)
        }
        .cornerRadius(cornerRadius)
        .overlay(
            RoundedRectangle(cornerRadius: cornerRadius)
                .stroke(
                    LinearGradient(
                        colors: [
                            Color.white.opacity(0.5),
                            Color.white.opacity(0.2)
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ),
                    lineWidth: 1
                )
        )
    }
}

// MARK: - Visual Effect Blur (UIKit Bridge)

struct VisualEffectBlur: UIViewRepresentable {
    var blurStyle: UIBlurEffect.Style

    func makeUIView(context: Context) -> UIVisualEffectView {
        return UIVisualEffectView(effect: UIBlurEffect(style: blurStyle))
    }

    func updateUIView(_ uiView: UIVisualEffectView, context: Context) {
        uiView.effect = UIBlurEffect(style: blurStyle)
    }
}

// MARK: - Shimmer Effect (for loading states)

struct ShimmerModifier: ViewModifier {
    @State private var phase: CGFloat = 0

    func body(content: Content) -> some View {
        content
            .overlay(
                LinearGradient(
                    colors: [
                        Color.clear,
                        Color.white.opacity(0.3),
                        Color.clear
                    ],
                    startPoint: .leading,
                    endPoint: .trailing
                )
                .offset(x: phase)
                .allowsHitTesting(false)
            )
            .onAppear {
                withAnimation(
                    .linear(duration: 1.5)
                    .repeatForever(autoreverses: false)
                ) {
                    phase = 500
                }
            }
    }
}

extension View {
    func shimmerEffect() -> some View {
        self.modifier(ShimmerModifier())
    }
}
