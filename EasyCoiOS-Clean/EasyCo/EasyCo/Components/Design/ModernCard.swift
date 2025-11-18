import SwiftUI

// MARK: - Modern Card Component

/// Reusable card component matching web app design
struct ModernCard<Content: View>: View {
    let content: Content
    let padding: CGFloat
    let cornerRadius: CGFloat
    let shadow: Theme.Shadow
    let borderColor: Color

    init(
        padding: CGFloat = Theme.Spacing._6,
        cornerRadius: CGFloat = Theme.CornerRadius._3xl,
        shadow: Theme.Shadow = Theme.Shadows.sm,
        borderColor: Color = Theme.GrayColors._100,
        @ViewBuilder content: () -> Content
    ) {
        self.padding = padding
        self.cornerRadius = cornerRadius
        self.shadow = shadow
        self.borderColor = borderColor
        self.content = content()
    }

    var body: some View {
        content
            .padding(padding)
            .background(Color.white)
            .cornerRadius(cornerRadius)
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius)
                    .stroke(borderColor, lineWidth: 1)
            )
            .themeShadow(shadow)
    }
}

// MARK: - Interactive Card (with tap effect)

struct InteractiveCard<Content: View>: View {
    let content: Content
    let padding: CGFloat
    let cornerRadius: CGFloat
    let action: () -> Void

    @State private var isPressed = false

    init(
        padding: CGFloat = Theme.Spacing._6,
        cornerRadius: CGFloat = Theme.CornerRadius._3xl,
        action: @escaping () -> Void,
        @ViewBuilder content: () -> Content
    ) {
        self.padding = padding
        self.cornerRadius = cornerRadius
        self.action = action
        self.content = content()
    }

    var body: some View {
        Button(action: action) {
            ModernCard(padding: padding, cornerRadius: cornerRadius) {
                content
            }
        }
        .buttonStyle(ScaleButtonStyle())
    }
}

// MARK: - Elevated Card (with stronger shadow)

struct ElevatedCard<Content: View>: View {
    let content: Content
    let padding: CGFloat
    let cornerRadius: CGFloat

    init(
        padding: CGFloat = Theme.Spacing._6,
        cornerRadius: CGFloat = Theme.CornerRadius._3xl,
        @ViewBuilder content: () -> Content
    ) {
        self.padding = padding
        self.cornerRadius = cornerRadius
        self.content = content()
    }

    var body: some View {
        ModernCard(
            padding: padding,
            cornerRadius: cornerRadius,
            shadow: Theme.Shadows.md
        ) {
            content
        }
    }
}

// MARK: - Glass Card (with glassmorphism effect)

struct GlassCard<Content: View>: View {
    let content: Content
    let role: UserType
    let cornerRadius: CGFloat

    init(
        role: UserType,
        cornerRadius: CGFloat = Theme.CornerRadius._3xl,
        @ViewBuilder content: () -> Content
    ) {
        self.role = role
        self.cornerRadius = cornerRadius
        self.content = content()
    }

    var body: some View {
        content
            .premiumGlass(role: role, cornerRadius: cornerRadius)
    }
}

// MARK: - Scale Button Style

private struct ScaleButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.98 : 1.0)
            .animation(Theme.Animations.fast, value: configuration.isPressed)
    }
}

// MARK: - Previews

struct ModernCard_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: Theme.Spacing._4) {
            // Standard Card
            ModernCard {
                VStack(alignment: .leading, spacing: Theme.Spacing._2) {
                    Text("Standard Card")
                        .font(Theme.Typography.title3())
                    Text("This is a modern card matching the web app design")
                        .font(Theme.Typography.body())
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }

            // Interactive Card
            InteractiveCard(action: {}) {
                VStack(alignment: .leading, spacing: Theme.Spacing._2) {
                    Text("Interactive Card")
                        .font(Theme.Typography.title3())
                    Text("Tap me to see the scale effect")
                        .font(Theme.Typography.body())
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }

            // Elevated Card
            ElevatedCard {
                VStack(alignment: .leading, spacing: Theme.Spacing._2) {
                    Text("Elevated Card")
                        .font(Theme.Typography.title3())
                    Text("This card has a stronger shadow")
                        .font(Theme.Typography.body())
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }

            // Glass Card
            GlassCard(role: .owner) {
                VStack(alignment: .leading, spacing: Theme.Spacing._2) {
                    Text("Glass Card")
                        .font(Theme.Typography.title3())
                        .foregroundColor(.white)
                    Text("Premium glassmorphism effect")
                        .font(Theme.Typography.body())
                        .foregroundColor(.white.opacity(0.9))
                }
                .padding(Theme.Spacing._4)
            }
        }
        .padding()
        .background(Theme.Colors.backgroundSecondary)
    }
}
