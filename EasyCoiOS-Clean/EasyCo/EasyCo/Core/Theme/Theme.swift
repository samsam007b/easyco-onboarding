//
//  Theme.swift
//  EasyCo
//
//  Complete Design System for EasyCo iOS
//  Based on web app design + iOS best practices
//

import SwiftUI

// MARK: - Theme Namespace

enum Theme {

    // MARK: - Colors

    enum Colors {

        // MARK: Brand Colors

        static let primary = Color(hex: "FFA040")
        static let primaryLight = Color(hex: "FFB85C")
        static let secondary = Color(hex: "6E56CF")
        static let accent = Color(hex: "E8865D")

        // Gradients
        static let primaryGradient = LinearGradient(
            colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        static let secondaryGradient = LinearGradient(
            colors: [Color(hex: "6E56CF"), Color(hex: "8B7BD8")],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        static let pinkGradient = LinearGradient(
            colors: [Color(hex: "EF4444"), Color(hex: "F87171")],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        // MARK: Semantic Colors

        static let success = Color(hex: "10B981")
        static let successLight = Color(hex: "D1FAE5")
        static let warning = Color(hex: "F59E0B")
        static let warningLight = Color(hex: "FEF3C7")
        static let error = Color(hex: "EF4444")
        static let errorLight = Color(hex: "FEE2E2")
        static let info = Color(hex: "3B82F6")
        static let infoLight = Color(hex: "DBEAFE")

        // MARK: Neutrals

        static let gray50 = Color(hex: "F9FAFB")
        static let gray100 = Color(hex: "F3F4F6")
        static let gray200 = Color(hex: "E5E7EB")
        static let gray300 = Color(hex: "D1D5DB")
        static let gray400 = Color(hex: "9CA3AF")
        static let gray500 = Color(hex: "6B7280")
        static let gray600 = Color(hex: "4B5563")
        static let gray700 = Color(hex: "374151")
        static let gray800 = Color(hex: "1F2937")
        static let gray900 = Color(hex: "111827")

        // MARK: Text Colors

        static let textPrimary = Color(hex: "111827")
        static let textSecondary = Color(hex: "6B7280")
        static let textTertiary = Color(hex: "9CA3AF")
        static let textInverse = Color.white

        // MARK: Background Colors

        static let backgroundPrimary = Color.white
        static let backgroundSecondary = Color(hex: "F9FAFB")
        static let backgroundTertiary = Color(hex: "F3F4F6")

        // MARK: Role-Specific Colors

        static let searcherPrimary = Color(hex: "FFA040")
        static let ownerPrimary = Color(hex: "6E56CF")
        static let residentPrimary = Color(hex: "E8865D")

        // MARK: Feature-Specific Colors

        static let heartRed = Color(hex: "EF4444")
        static let messageBlue = Color(hex: "0EA5E9")
        static let notificationBlue = Color(hex: "3B82F6")
        static let matchPink = Color(hex: "EC4899")
        static let starOrange = Color(hex: "F59E0B")

        // MARK: Chart Colors

        static let chartPurple = Color(hex: "8B5CF6")
        static let chartGreen = Color(hex: "10B981")
        static let chartBlue = Color(hex: "3B82F6")
        static let chartYellow = Color(hex: "F59E0B")
        static let chartRed = Color(hex: "EF4444")
        static let chartTeal = Color(hex: "14B8A6")
    }

    // MARK: - Typography

    enum Typography {

        // MARK: Headers

        static func largeTitle(_ weight: Font.Weight = .bold) -> Font {
            .system(size: 34, weight: weight, design: .default)
        }

        static func title1(_ weight: Font.Weight = .bold) -> Font {
            .system(size: 28, weight: weight, design: .default)
        }

        static func title2(_ weight: Font.Weight = .bold) -> Font {
            .system(size: 22, weight: weight, design: .default)
        }

        static func title3(_ weight: Font.Weight = .semibold) -> Font {
            .system(size: 20, weight: weight, design: .default)
        }

        // MARK: Body

        static func bodyLarge(_ weight: Font.Weight = .regular) -> Font {
            .system(size: 17, weight: weight, design: .default)
        }

        static func body(_ weight: Font.Weight = .regular) -> Font {
            .system(size: 15, weight: weight, design: .default)
        }

        static func bodySmall(_ weight: Font.Weight = .regular) -> Font {
            .system(size: 13, weight: weight, design: .default)
        }

        // MARK: Special

        static func caption(_ weight: Font.Weight = .medium) -> Font {
            .system(size: 11, weight: weight, design: .default)
        }

        static func price(_ weight: Font.Weight = .bold) -> Font {
            .system(size: 24, weight: weight, design: .default)
        }

        static func badge(_ weight: Font.Weight = .semibold) -> Font {
            .system(size: 12, weight: weight, design: .default)
        }
    }

    // MARK: - Spacing

    enum Spacing {
        static let xs: CGFloat = 4
        static let sm: CGFloat = 8
        static let md: CGFloat = 12
        static let lg: CGFloat = 16
        static let xl: CGFloat = 24
        static let xxl: CGFloat = 32
        static let xxxl: CGFloat = 48

        // Semantic spacing
        static let cardPadding: CGFloat = 16
        static let screenMargin: CGFloat = 16
        static let sectionSpacing: CGFloat = 24
    }

    // MARK: - Corner Radius

    enum CornerRadius {
        static let xs: CGFloat = 8
        static let sm: CGFloat = 12
        static let md: CGFloat = 16
        static let lg: CGFloat = 24
        static let pill: CGFloat = 999

        // Semantic radius
        static let card: CGFloat = 16
        static let button: CGFloat = 16
        static let input: CGFloat = 12
        static let chip: CGFloat = 18
        static let modal: CGFloat = 24
    }

    // MARK: - Shadows

    enum Shadow {
        static let card = ShadowStyle(
            color: .black.opacity(0.04),
            radius: 8,
            x: 0,
            y: 2
        )

        static let cardElevated = ShadowStyle(
            color: .black.opacity(0.08),
            radius: 12,
            x: 0,
            y: 4
        )

        static let button = ShadowStyle(
            color: Color(hex: "FFA040").opacity(0.3),
            radius: 16,
            x: 0,
            y: 4
        )

        static let modal = ShadowStyle(
            color: .black.opacity(0.2),
            radius: 40,
            x: 0,
            y: 20
        )

        static let soft = ShadowStyle(
            color: .black.opacity(0.06),
            radius: 4,
            x: 0,
            y: 2
        )

        struct ShadowStyle {
            let color: Color
            let radius: CGFloat
            let x: CGFloat
            let y: CGFloat
        }
    }

    // MARK: - Animation

    enum Animation {
        static let spring = SwiftUI.Animation.spring(response: 0.4, dampingFraction: 0.8)
        static let springFast = SwiftUI.Animation.spring(response: 0.25, dampingFraction: 0.7)
        static let springBouncy = SwiftUI.Animation.spring(response: 0.6, dampingFraction: 0.6)
        static let easeOut = SwiftUI.Animation.easeOut(duration: 0.3)
        static let easeIn = SwiftUI.Animation.easeIn(duration: 0.2)
    }

    // MARK: - Sizes

    enum Size {
        // Button heights
        static let buttonHeight: CGFloat = 52
        static let buttonHeightSmall: CGFloat = 40

        // Input heights
        static let inputHeight: CGFloat = 52
        static let searchBarHeight: CGFloat = 48

        // Icon sizes
        static let iconSmall: CGFloat = 16
        static let iconMedium: CGFloat = 20
        static let iconLarge: CGFloat = 24

        // Avatar sizes
        static let avatarSmall: CGFloat = 32
        static let avatarMedium: CGFloat = 48
        static let avatarLarge: CGFloat = 64
        static let avatarXLarge: CGFloat = 96

        // Touch target (minimum)
        static let touchTarget: CGFloat = 44

        // Card
        static let cardImageHeight: CGFloat = 200
        static let cardImageHeightCompact: CGFloat = 160
    }
}

// MARK: - Color Extension (Hex Support)

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - View Extensions (Modifiers)

extension View {

    // MARK: - Shadow Modifiers

    func cardShadow() -> some View {
        self.shadow(
            color: Theme.Shadow.card.color,
            radius: Theme.Shadow.card.radius,
            x: Theme.Shadow.card.x,
            y: Theme.Shadow.card.y
        )
    }

    func elevatedShadow() -> some View {
        self.shadow(
            color: Theme.Shadow.cardElevated.color,
            radius: Theme.Shadow.cardElevated.radius,
            x: Theme.Shadow.cardElevated.x,
            y: Theme.Shadow.cardElevated.y
        )
    }

    func buttonShadow() -> some View {
        self.shadow(
            color: Theme.Shadow.button.color,
            radius: Theme.Shadow.button.radius,
            x: Theme.Shadow.button.x,
            y: Theme.Shadow.button.y
        )
    }

    func softShadow() -> some View {
        self.shadow(
            color: Theme.Shadow.soft.color,
            radius: Theme.Shadow.soft.radius,
            x: Theme.Shadow.soft.x,
            y: Theme.Shadow.soft.y
        )
    }

    // MARK: - Card Style

    func cardStyle(padding: CGFloat = Theme.Spacing.cardPadding) -> some View {
        self
            .padding(padding)
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.card)
            .cardShadow()
    }

    // MARK: - Haptic Feedback

    func hapticFeedback(_ style: UIImpactFeedbackGenerator.FeedbackStyle = .light) -> some View {
        self.simultaneousGesture(
            TapGesture().onEnded {
                let generator = UIImpactFeedbackGenerator(style: style)
                generator.impactOccurred()
            }
        )
    }

    func hapticSelection() -> some View {
        self.onChange(of: true) { _ in
            let generator = UISelectionFeedbackGenerator()
            generator.selectionChanged()
        }
    }

    // MARK: - Conditional Modifiers

    @ViewBuilder
    func `if`<Transform: View>(_ condition: Bool, transform: (Self) -> Transform) -> some View {
        if condition {
            transform(self)
        } else {
            self
        }
    }
}

// MARK: - Haptic Feedback Helper

enum Haptic {
    static func impact(_ style: UIImpactFeedbackGenerator.FeedbackStyle = .light) {
        let generator = UIImpactFeedbackGenerator(style: style)
        generator.impactOccurred()
    }

    static func notification(_ type: UINotificationFeedbackGenerator.FeedbackType) {
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(type)
    }

    static func selection() {
        let generator = UISelectionFeedbackGenerator()
        generator.selectionChanged()
    }
}
