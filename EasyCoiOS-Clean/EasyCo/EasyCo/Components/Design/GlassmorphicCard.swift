import SwiftUI

// MARK: - Glassmorphic Card Component (Web App Style)

struct GlassmorphicCard<Content: View>: View {
    let gradient: [Color]
    let cornerRadius: CGFloat
    let content: Content

    init(
        gradient: [Color] = [Color(hex: "6E56CF"), Color(hex: "FF6F3C"), Color(hex: "FFD249")],
        cornerRadius: CGFloat = 40,
        @ViewBuilder content: () -> Content
    ) {
        self.gradient = gradient
        self.cornerRadius = cornerRadius
        self.content = content()
    }

    var body: some View {
        ZStack {
            // Glassmorphic background with gradient
            RoundedRectangle(cornerRadius: cornerRadius)
                .fill(.ultraThinMaterial)
                .background(
                    LinearGradient(
                        colors: gradient.map { $0.opacity(0.25) },
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .overlay(
                    // Inner glow
                    RoundedRectangle(cornerRadius: cornerRadius)
                        .stroke(
                            LinearGradient(
                                colors: [
                                    Color.white.opacity(0.6),
                                    Color.white.opacity(0.2),
                                    Color.white.opacity(0.1)
                                ],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ),
                            lineWidth: 1
                        )
                )
                .shadow(color: Color.black.opacity(0.1), radius: 20, x: 0, y: 8)
                .shadow(color: gradient.first?.opacity(0.15) ?? Color.clear, radius: 30, x: 0, y: 12)

            // Content
            content
                .padding(24)
        }
        .clipShape(RoundedRectangle(cornerRadius: cornerRadius))
    }
}

// MARK: - Solid Card with Modern Style

struct ModernCard<Content: View>: View {
    let backgroundColor: Color
    let cornerRadius: CGFloat
    let hasShadow: Bool
    let content: Content

    init(
        backgroundColor: Color = .white,
        cornerRadius: CGFloat = 32,
        hasShadow: Bool = true,
        @ViewBuilder content: () -> Content
    ) {
        self.backgroundColor = backgroundColor
        self.cornerRadius = cornerRadius
        self.hasShadow = hasShadow
        self.content = content()
    }

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: cornerRadius)
                .fill(backgroundColor)
                .overlay(
                    RoundedRectangle(cornerRadius: cornerRadius)
                        .stroke(Color.gray.opacity(0.1), lineWidth: 1)
                )
                .shadow(
                    color: hasShadow ? Color.black.opacity(0.08) : Color.clear,
                    radius: hasShadow ? 16 : 0,
                    x: 0,
                    y: hasShadow ? 4 : 0
                )

            content
                .padding(20)
        }
        .clipShape(RoundedRectangle(cornerRadius: cornerRadius))
    }
}

// MARK: - Search Box with Glassmorphism (Like Web Hero)

struct GlassmorphicSearchBox<Content: View>: View {
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        VStack(spacing: 16) {
            content
        }
        .padding(20)
        .background(
            ZStack {
                // Background blur
                RoundedRectangle(cornerRadius: 24)
                    .fill(.ultraThinMaterial)

                // Gradient overlay
                RoundedRectangle(cornerRadius: 24)
                    .fill(
                        LinearGradient(
                            colors: [
                                Color.white.opacity(0.4),
                                Color.white.opacity(0.1)
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )

                // Border
                RoundedRectangle(cornerRadius: 24)
                    .stroke(Color.white.opacity(0.5), lineWidth: 1)
            }
        )
        .shadow(color: Color.black.opacity(0.1), radius: 20, x: 0, y: 8)
    }
}

// MARK: - Convenience Modifiers

extension View {
    /// Apply glassmorphic card style
    func glassmorphicCard(
        gradient: [Color] = [Color(hex: "6E56CF"), Color(hex: "FF6F3C"), Color(hex: "FFD249")],
        cornerRadius: CGFloat = 40
    ) -> some View {
        GlassmorphicCard(gradient: gradient, cornerRadius: cornerRadius) {
            self
        }
    }

    /// Apply modern solid card style
    func modernCard(
        backgroundColor: Color = .white,
        cornerRadius: CGFloat = 32,
        hasShadow: Bool = true
    ) -> some View {
        ModernCard(
            backgroundColor: backgroundColor,
            cornerRadius: cornerRadius,
            hasShadow: hasShadow
        ) {
            self
        }
    }
}
