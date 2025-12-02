import SwiftUI

// MARK: - Animation Presets
// Centralized animation configurations for consistent motion design

struct AnimationPresets {

    // MARK: - Spring Animations

    /// Standard spring animation - Most common use case
    static let spring = Animation.spring(
        response: 0.4,
        dampingFraction: 0.8
    )

    /// Bouncy spring - For playful interactions
    static let springBouncy = Animation.spring(
        response: 0.5,
        dampingFraction: 0.6
    )

    /// Smooth spring - For elegant transitions
    static let springSmooth = Animation.spring(
        response: 0.6,
        dampingFraction: 0.9
    )

    /// Quick spring - For snappy interactions
    static let springQuick = Animation.spring(
        response: 0.3,
        dampingFraction: 0.7
    )

    /// Gentle spring - For subtle animations
    static let springGentle = Animation.spring(
        response: 0.7,
        dampingFraction: 0.95
    )

    // MARK: - Easing Animations

    /// Fast ease out - For quick reveals
    static let easeOutFast = Animation.easeOut(duration: DesignTokens.Duration.fast)

    /// Normal ease out - Standard transitions
    static let easeOut = Animation.easeOut(duration: DesignTokens.Duration.normal)

    /// Slow ease out - For dramatic reveals
    static let easeOutSlow = Animation.easeOut(duration: DesignTokens.Duration.slow)

    /// Ease in out - For smooth bidirectional animations
    static let easeInOut = Animation.easeInOut(duration: DesignTokens.Duration.normal)

    // MARK: - Linear Animations

    /// Linear animation - For continuous progress
    static let linear = Animation.linear(duration: DesignTokens.Duration.normal)

    /// Linear slow - For loaders
    static let linearSlow = Animation.linear(duration: DesignTokens.Duration.slow)

    // MARK: - Transition Animations

    /// Slide from bottom with spring
    static let slideFromBottom: AnyTransition = .asymmetric(
        insertion: .move(edge: .bottom).combined(with: .opacity),
        removal: .move(edge: .bottom).combined(with: .opacity)
    )

    /// Slide from top with spring
    static let slideFromTop: AnyTransition = .asymmetric(
        insertion: .move(edge: .top).combined(with: .opacity),
        removal: .move(edge: .top).combined(with: .opacity)
    )

    /// Slide from trailing (right)
    static let slideFromTrailing: AnyTransition = .asymmetric(
        insertion: .move(edge: .trailing).combined(with: .opacity),
        removal: .move(edge: .trailing).combined(with: .opacity)
    )

    /// Slide from leading (left)
    static let slideFromLeading: AnyTransition = .asymmetric(
        insertion: .move(edge: .leading).combined(with: .opacity),
        removal: .move(edge: .leading).combined(with: .opacity)
    )

    /// Scale with fade
    static let scaleWithFade: AnyTransition = .asymmetric(
        insertion: .scale(scale: 0.8).combined(with: .opacity),
        removal: .scale(scale: 0.8).combined(with: .opacity)
    )

    /// Pop effect (scale from small)
    static let pop: AnyTransition = .scale(scale: 0.1).combined(with: .opacity)

    /// Fade transition
    static let fade: AnyTransition = .opacity
}

// MARK: - Animated View Modifiers

// Scale on tap modifier
struct ScaleOnTapModifier: ViewModifier {
    @State private var isPressed = false
    let scale: CGFloat

    func body(content: Content) -> some View {
        content
            .scaleEffect(isPressed ? scale : 1.0)
            .animation(AnimationPresets.springQuick, value: isPressed)
            .simultaneousGesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { _ in
                        if !isPressed {
                            isPressed = true
                        }
                    }
                    .onEnded { _ in
                        isPressed = false
                    }
            )
    }
}

extension View {
    /// Add scale-on-tap animation (default: 0.95)
    func scaleOnTap(scale: CGFloat = 0.95) -> some View {
        self.modifier(ScaleOnTapModifier(scale: scale))
    }
}

// MARK: - Appear Animation

struct AppearAnimationModifier: ViewModifier {
    @State private var appeared = false
    let delay: Double
    let animation: Animation

    func body(content: Content) -> some View {
        content
            .opacity(appeared ? 1 : 0)
            .offset(y: appeared ? 0 : 20)
            .onAppear {
                withAnimation(animation.delay(delay)) {
                    appeared = true
                }
            }
    }
}

extension View {
    /// Animate appearance with fade + slide up
    func animateAppear(delay: Double = 0, animation: Animation = AnimationPresets.spring) -> some View {
        self.modifier(AppearAnimationModifier(delay: delay, animation: animation))
    }
}

// MARK: - Shimmer Loading Animation

struct ShimmerLoadingModifier: ViewModifier {
    @State private var phase: CGFloat = 0

    func body(content: Content) -> some View {
        content
            .overlay(
                GeometryReader { geometry in
                    LinearGradient(
                        colors: [
                            Color.white.opacity(0),
                            Color.white.opacity(0.4),
                            Color.white.opacity(0)
                        ],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                    .frame(width: geometry.size.width * 0.5)
                    .offset(x: phase)
                }
                .clipped()
                .allowsHitTesting(false)
            )
            .onAppear {
                withAnimation(
                    Animation.linear(duration: 1.5)
                        .repeatForever(autoreverses: false)
                ) {
                    phase = UIScreen.main.bounds.width
                }
            }
    }
}

extension View {
    /// Add shimmer loading animation
    func shimmerLoading() -> some View {
        self.modifier(ShimmerLoadingModifier())
    }
}

// MARK: - Bounce Animation

struct BounceAnimationModifier: ViewModifier {
    @State private var animate = false
    let trigger: Bool

    func body(content: Content) -> some View {
        content
            .scaleEffect(animate ? 1.1 : 1.0)
            .onChange(of: trigger) { _ in
                withAnimation(AnimationPresets.springBouncy) {
                    animate = true
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                    withAnimation(AnimationPresets.springBouncy) {
                        animate = false
                    }
                }
            }
    }
}

extension View {
    /// Add bounce animation on trigger change
    func bounceAnimation(trigger: Bool) -> some View {
        self.modifier(BounceAnimationModifier(trigger: trigger))
    }
}

// MARK: - Rotate Animation

struct RotateAnimationModifier: ViewModifier {
    @State private var rotation: Double = 0
    let duration: Double

    func body(content: Content) -> some View {
        content
            .rotationEffect(.degrees(rotation))
            .onAppear {
                withAnimation(
                    Animation.linear(duration: duration)
                        .repeatForever(autoreverses: false)
                ) {
                    rotation = 360
                }
            }
    }
}

extension View {
    /// Add continuous rotation animation
    func rotateAnimation(duration: Double = 2.0) -> some View {
        self.modifier(RotateAnimationModifier(duration: duration))
    }
}

// MARK: - Pulse Animation

struct PulseAnimationModifier: ViewModifier {
    @State private var scale: CGFloat = 1.0

    func body(content: Content) -> some View {
        content
            .scaleEffect(scale)
            .onAppear {
                withAnimation(
                    Animation.easeInOut(duration: 1.0)
                        .repeatForever(autoreverses: true)
                ) {
                    scale = 1.05
                }
            }
    }
}

extension View {
    /// Add subtle pulse animation
    func pulseAnimation() -> some View {
        self.modifier(PulseAnimationModifier())
    }
}

// MARK: - Card Flip Animation

struct FlipAnimationModifier: ViewModifier {
    let trigger: Bool
    let axis: (x: CGFloat, y: CGFloat, z: CGFloat)

    func body(content: Content) -> some View {
        content
            .rotation3DEffect(
                .degrees(trigger ? 180 : 0),
                axis: axis,
                perspective: 0.5
            )
            .animation(AnimationPresets.spring, value: trigger)
    }
}

extension View {
    /// Add 3D flip animation
    func flipAnimation(trigger: Bool, axis: (x: CGFloat, y: CGFloat, z: CGFloat) = (0, 1, 0)) -> some View {
        self.modifier(FlipAnimationModifier(trigger: trigger, axis: axis))
    }
}
