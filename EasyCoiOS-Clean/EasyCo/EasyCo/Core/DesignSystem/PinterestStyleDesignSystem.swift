//
//  PinterestStyleDesignSystem.swift
//  EasyCo
//
//  Design System complet inspiré des références Pinterest
//  Carte blanche créative avec préservation des gradients signature EasyCo
//

import SwiftUI

// MARK: - Pinterest-Inspired Design System

extension Theme {

    // MARK: - Modern Typography System

    struct PinterestTypography {
        // Hero titles (très grands, très bold)
        static func heroDisplay(_ weight: Font.Weight = .heavy) -> Font {
            .system(size: 48, weight: weight, design: .rounded)
        }

        static func heroLarge(_ weight: Font.Weight = .bold) -> Font {
            .system(size: 40, weight: weight, design: .rounded)
        }

        static func heroMedium(_ weight: Font.Weight = .bold) -> Font {
            .system(size: 34, weight: weight, design: .rounded)
        }

        static func heroSmall(_ weight: Font.Weight = .bold) -> Font {
            .system(size: 28, weight: weight, design: .rounded)
        }

        // Titles
        static func titleXL(_ weight: Font.Weight = .bold) -> Font {
            .system(size: 28, weight: weight, design: .rounded)
        }

        static func titleLarge(_ weight: Font.Weight = .semibold) -> Font {
            .system(size: 24, weight: weight, design: .rounded)
        }

        static func titleMedium(_ weight: Font.Weight = .semibold) -> Font {
            .system(size: 20, weight: weight, design: .rounded)
        }

        static func titleSmall(_ weight: Font.Weight = .semibold) -> Font {
            .system(size: 18, weight: weight, design: .rounded)
        }

        // Body
        static func bodyLarge(_ weight: Font.Weight = .regular) -> Font {
            .system(size: 18, weight: weight, design: .rounded)
        }

        static func bodyRegular(_ weight: Font.Weight = .regular) -> Font {
            .system(size: 16, weight: weight, design: .rounded)
        }

        static func bodySmall(_ weight: Font.Weight = .regular) -> Font {
            .system(size: 14, weight: weight, design: .rounded)
        }

        // Caption & Labels
        static func caption(_ weight: Font.Weight = .medium) -> Font {
            .system(size: 13, weight: weight, design: .rounded)
        }

        static func captionSmall(_ weight: Font.Weight = .medium) -> Font {
            .system(size: 11, weight: weight, design: .rounded)
        }
    }

    // MARK: - Pinterest Spacing (généreuxespacement)

    struct PinterestSpacing {
        static let micro: CGFloat = 4
        static let xxs: CGFloat = 8
        static let xs: CGFloat = 12
        static let sm: CGFloat = 16
        static let md: CGFloat = 20
        static let lg: CGFloat = 24
        static let xl: CGFloat = 32
        static let xxl: CGFloat = 40
        static let xxxl: CGFloat = 48
        static let huge: CGFloat = 64
    }

    // MARK: - Pinterest Corner Radius (très arrondis)

    struct PinterestRadius {
        static let small: CGFloat = 16
        static let medium: CGFloat = 20
        static let large: CGFloat = 24
        static let xLarge: CGFloat = 28
        static let xxLarge: CGFloat = 32
        static let xxxLarge: CGFloat = 40
        static let full: CGFloat = 9999
    }

    // MARK: - Pinterest Shadows (subtiles et douces)

    struct PinterestShadows {
        static let subtle = ShadowStyle(
            color: Color.black.opacity(0.04),
            radius: 8,
            y: 4
        )

        static let soft = ShadowStyle(
            color: Color.black.opacity(0.06),
            radius: 12,
            y: 6
        )

        static let medium = ShadowStyle(
            color: Color.black.opacity(0.08),
            radius: 16,
            y: 8
        )

        static let strong = ShadowStyle(
            color: Color.black.opacity(0.12),
            radius: 24,
            y: 12
        )

        // Colored shadows pour CTAs
        static func colored(_ color: Color, intensity: Double = 0.3) -> ShadowStyle {
            ShadowStyle(
                color: color.opacity(intensity),
                radius: 20,
                y: 10
            )
        }
    }

    struct ShadowStyle {
        let color: Color
        let radius: CGFloat
        let y: CGFloat
        var x: CGFloat = 0
    }

    // MARK: - Pinterest Animations

    struct PinterestAnimations {
        static let quickSpring: SwiftUI.Animation = .spring(response: 0.25, dampingFraction: 0.7, blendDuration: 0)
        static let smoothSpring: SwiftUI.Animation = .spring(response: 0.35, dampingFraction: 0.75, blendDuration: 0)
        static let bouncySpring: SwiftUI.Animation = .spring(response: 0.4, dampingFraction: 0.6, blendDuration: 0)
        static let gentleSpring: SwiftUI.Animation = .spring(response: 0.5, dampingFraction: 0.8, blendDuration: 0)

        static let quick: SwiftUI.Animation = .easeOut(duration: 0.2)
        static let smooth: SwiftUI.Animation = .easeInOut(duration: 0.3)
        static let slow: SwiftUI.Animation = .easeInOut(duration: 0.4)
    }
}

// MARK: - View Modifier Extensions

extension View {
    // Pinterest-style shadow
    func pinterestShadow(_ style: Theme.ShadowStyle = Theme.PinterestShadows.soft) -> some View {
        self.shadow(color: style.color, radius: style.radius, x: style.x, y: style.y)
    }

    // Pinterest-style card
    func pinterestCard(
        padding: CGFloat = Theme.PinterestSpacing.lg,
        radius: CGFloat = Theme.PinterestRadius.large,
        background: Color = .white
    ) -> some View {
        self
            .padding(padding)
            .background(
                RoundedRectangle(cornerRadius: radius)
                    .fill(background.opacity(0.75))
                    .overlay(
                        RoundedRectangle(cornerRadius: radius)
                            .stroke(Color.white.opacity(0.5), lineWidth: 1.5)
                    )
            )
            .pinterestShadow(Theme.PinterestShadows.soft)
    }

    // Pinterest-style glass card
    func pinterestGlassCard(
        padding: CGFloat = Theme.PinterestSpacing.lg,
        radius: CGFloat = Theme.PinterestRadius.large,
        opacity: Double = 0.70
    ) -> some View {
        self
            .padding(padding)
            .background(
                RoundedRectangle(cornerRadius: radius)
                    .fill(Color.white.opacity(opacity))
                    .overlay(
                        RoundedRectangle(cornerRadius: radius)
                            .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                    )
            )
            .pinterestShadow(Theme.PinterestShadows.medium)
    }

    // Pinterest-style elevated card (plus opaque)
    func pinterestElevatedCard(
        padding: CGFloat = Theme.PinterestSpacing.lg,
        radius: CGFloat = Theme.PinterestRadius.large
    ) -> some View {
        self
            .padding(padding)
            .background(
                RoundedRectangle(cornerRadius: radius)
                    .fill(Color.white.opacity(0.85))
                    .overlay(
                        RoundedRectangle(cornerRadius: radius)
                            .stroke(Color.white.opacity(0.7), lineWidth: 1.5)
                    )
            )
            .pinterestShadow(Theme.PinterestShadows.strong)
    }

    // Haptic feedback helper
    func withHaptic(_ style: UIImpactFeedbackGenerator.FeedbackStyle = .light) -> some View {
        self.simultaneousGesture(
            TapGesture().onEnded { _ in
                let generator = UIImpactFeedbackGenerator(style: style)
                generator.impactOccurred()
            }
        )
    }
}

// MARK: - Pinterest Background Components

struct PinterestBackground: View {
    let role: Theme.UserRole
    let intensity: Double // 0.0 to 1.0

    init(role: Theme.UserRole, intensity: Double = 0.15) {
        self.role = role
        self.intensity = intensity
    }

    var body: some View {
        ZStack {
            // Base gradient très léger
            baseGradient
                .opacity(intensity)

            // Organic blobs
            GeometryReader { geometry in
                ZStack {
                    // Blob 1 - Top Right
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [
                                    blobColor1.opacity(intensity * 1.3),
                                    Color.clear
                                ],
                                center: .center,
                                startRadius: 0,
                                endRadius: 300
                            )
                        )
                        .frame(width: 500, height: 500)
                        .offset(
                            x: geometry.size.width * 0.65,
                            y: -geometry.size.height * 0.1
                        )
                        .blur(radius: 80)

                    // Blob 2 - Middle Left
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [
                                    blobColor2.opacity(intensity * 1.1),
                                    Color.clear
                                ],
                                center: .center,
                                startRadius: 0,
                                endRadius: 250
                            )
                        )
                        .frame(width: 400, height: 400)
                        .offset(
                            x: -geometry.size.width * 0.15,
                            y: geometry.size.height * 0.4
                        )
                        .blur(radius: 70)

                    // Blob 3 - Bottom Right
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [
                                    blobColor3.opacity(intensity * 0.9),
                                    Color.clear
                                ],
                                center: .center,
                                startRadius: 0,
                                endRadius: 200
                            )
                        )
                        .frame(width: 350, height: 350)
                        .offset(
                            x: geometry.size.width * 0.7,
                            y: geometry.size.height * 0.75
                        )
                        .blur(radius: 60)
                }
            }
        }
        .background(baseColor)
    }

    // Colors based on role
    private var baseColor: Color {
        switch role {
        case .searcher: return Color(hex: "FFFEF8")
        case .owner: return Color(hex: "FEFBFF")
        case .resident: return Color(hex: "FFFCFB")
        }
    }

    private var baseGradient: LinearGradient {
        switch role {
        case .searcher:
            return LinearGradient(
                colors: [
                    Color(hex: "FFF9E6"),
                    Color(hex: "FFEFCC"),
                    Color(hex: "FFE4B3")
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        case .owner:
            return LinearGradient(
                colors: [
                    Color(hex: "F9F8FF"),
                    Color(hex: "F3F1FF"),
                    Color(hex: "EDE9FF")
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        case .resident:
            return LinearGradient(
                colors: [
                    Color(hex: "FFF8F6"),
                    Color(hex: "FFF0EB"),
                    Color(hex: "FFE8DD")
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        }
    }

    private var blobColor1: Color {
        switch role {
        case .searcher: return Color(hex: "FFB10B")
        case .owner: return Color(hex: "9256A4")
        case .resident: return Color(hex: "FF6F3C")
        }
    }

    private var blobColor2: Color {
        switch role {
        case .searcher: return Color(hex: "FFD249")
        case .owner: return Color(hex: "BAB2E3")
        case .resident: return Color(hex: "FF8C5C")
        }
    }

    private var blobColor3: Color {
        switch role {
        case .searcher: return Color(hex: "FFA040")
        case .owner: return Color(hex: "8E7AD6")
        case .resident: return Color(hex: "FFB88C")
        }
    }
}

// MARK: - Pinterest Card Component

struct PinterestCard<Content: View>: View {
    let role: Theme.UserRole
    let content: Content

    init(role: Theme.UserRole, @ViewBuilder content: () -> Content) {
        self.role = role
        self.content = content()
    }

    var body: some View {
        content
            .pinterestGlassCard()
    }
}
