import SwiftUI

// MARK: - Advanced Animation Extensions

extension Animation {

    // MARK: - Spring Animations

    /// Bouncy spring animation (playful)
    static var bouncy: Animation {
        .spring(response: 0.4, dampingFraction: 0.6, blendDuration: 0)
    }

    /// Smooth spring animation (natural)
    static var smooth: Animation {
        .spring(response: 0.3, dampingFraction: 0.7, blendDuration: 0)
    }

    /// Snappy spring animation (responsive)
    static var snappy: Animation {
        .spring(response: 0.25, dampingFraction: 0.75, blendDuration: 0)
    }

    /// Gentle spring animation (subtle)
    static var gentle: Animation {
        .spring(response: 0.5, dampingFraction: 0.8, blendDuration: 0)
    }

    // MARK: - Easing Animations

    /// Quick fade animation
    static var quickFade: Animation {
        .easeInOut(duration: 0.15)
    }

    /// Smooth fade animation
    static var smoothFade: Animation {
        .easeInOut(duration: 0.3)
    }

    /// Slow fade animation
    static var slowFade: Animation {
        .easeInOut(duration: 0.5)
    }

    // MARK: - Interactive Animations

    /// Animation for button press
    static var buttonPress: Animation {
        .spring(response: 0.2, dampingFraction: 0.6, blendDuration: 0)
    }

    /// Animation for card expand
    static var cardExpand: Animation {
        .spring(response: 0.35, dampingFraction: 0.7, blendDuration: 0)
    }

    /// Animation for sheet presentation
    static var sheetPresent: Animation {
        .spring(response: 0.4, dampingFraction: 0.8, blendDuration: 0)
    }
}

// MARK: - View Modifiers for Animations
// Note: ScaleButtonStyle is defined in Components/Design/ModernCard.swift

struct BounceEffect: ViewModifier {
    @State private var scale: CGFloat = 1.0

    func body(content: Content) -> some View {
        content
            .scaleEffect(scale)
            .onAppear {
                withAnimation(.bouncy) {
                    scale = 1.05
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                    withAnimation(.gentle) {
                        scale = 1.0
                    }
                }
            }
    }
}

struct ShakeEffect: GeometryEffect {
    var amount: CGFloat = 10
    var shakesPerUnit = 3
    var animatableData: CGFloat

    func effectValue(size: CGSize) -> ProjectionTransform {
        ProjectionTransform(
            CGAffineTransform(
                translationX: amount * sin(animatableData * .pi * CGFloat(shakesPerUnit)),
                y: 0
            )
        )
    }
}

struct SlideIn: ViewModifier {
    let edge: Edge
    @State private var offset: CGFloat = 100

    func body(content: Content) -> some View {
        content
            .offset(
                x: edge == .leading ? offset : (edge == .trailing ? -offset : 0),
                y: edge == .top ? offset : (edge == .bottom ? -offset : 0)
            )
            .opacity(offset == 0 ? 1 : 0)
            .onAppear {
                withAnimation(.smooth) {
                    offset = 0
                }
            }
    }
}

// MARK: - View Extensions

extension View {
    /// Apply bounce effect on appear
    func bounceOnAppear() -> some View {
        modifier(BounceEffect())
    }

    /// Apply shake effect
    func shake<T: Hashable>(amount: CGFloat = 10, trigger: T) -> some View {
        modifier(ShakeEffect(amount: amount, animatableData: CGFloat(trigger.hashValue)))
    }

    /// Slide in from edge
    func slideIn(from edge: Edge = .bottom) -> some View {
        modifier(SlideIn(edge: edge))
    }

    /// Animated gradient background
    func animatedGradientBackground(colors: [Color]) -> some View {
        self.background(
            AnimatedGradient(colors: colors)
        )
    }
}

// MARK: - Animated Gradient

struct AnimatedGradient: View {
    let colors: [Color]
    @State private var startPoint = UnitPoint.topLeading
    @State private var endPoint = UnitPoint.bottomTrailing

    var body: some View {
        LinearGradient(
            gradient: Gradient(colors: colors),
            startPoint: startPoint,
            endPoint: endPoint
        )
        .onAppear {
            withAnimation(
                Animation.easeInOut(duration: 3.0).repeatForever(autoreverses: true)
            ) {
                startPoint = .topTrailing
                endPoint = .bottomLeading
            }
        }
    }
}

// MARK: - Transition Extensions

extension AnyTransition {
    /// Slide and fade transition
    static var slideAndFade: AnyTransition {
        .asymmetric(
            insertion: .move(edge: .trailing).combined(with: .opacity),
            removal: .move(edge: .leading).combined(with: .opacity)
        )
    }

    /// Scale and fade transition
    static var scaleAndFade: AnyTransition {
        .scale(scale: 0.8).combined(with: .opacity)
    }

    /// Slide up transition
    static var slideUp: AnyTransition {
        .move(edge: .bottom).combined(with: .opacity)
    }

    /// Slide down transition
    static var slideDown: AnyTransition {
        .move(edge: .top).combined(with: .opacity)
    }
}
