import SwiftUI

// MARK: - EasyCo Design Tokens
// Centralized design system tokens for consistent styling across the app

struct DesignTokens {

    // MARK: - Colors

    struct Colors {
        // Role-based gradients
        static let searcherGradient = LinearGradient(
            colors: [Color(hex: "FFA040"), Color(hex: "FFB366")],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        static let ownerGradient = LinearGradient(
            colors: [Color(hex: "6E56CF"), Color(hex: "8B7DE8")],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        static let residentGradient = LinearGradient(
            colors: [Color(hex: "E8865D"), Color(hex: "F0A078")],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        // Primary colors
        static let searcherPrimary = Color(hex: "FFA040")
        static let ownerPrimary = Color(hex: "6E56CF")
        static let residentPrimary = Color(hex: "E8865D")

        // Semantic colors
        static let success = Color(hex: "10B981")
        static let warning = Color(hex: "F59E0B")
        static let error = Color(hex: "EF4444")
        static let info = Color(hex: "3B82F6")

        // Neutral colors
        static let background = Color(hex: "F9FAFB")
        static let surface = Color.white
        static let surfaceSecondary = Color(hex: "F3F4F6")

        static let text = Color(hex: "111827")
        static let textSecondary = Color(hex: "6B7280")
        static let textTertiary = Color(hex: "9CA3AF")

        static let border = Color(hex: "E5E7EB")
        static let borderLight = Color(hex: "F3F4F6")

        // Glassmorphism colors
        static let glassWhite = Color.white.opacity(0.15)
        static let glassBorder = Color.white.opacity(0.3)
        static let glassOverlay = Color.black.opacity(0.05)
    }

    // MARK: - Typography

    struct Typography {
        static let largeTitle = Font.system(size: 34, weight: .bold)
        static let title1 = Font.system(size: 28, weight: .bold)
        static let title2 = Font.system(size: 22, weight: .semibold)
        static let title3 = Font.system(size: 20, weight: .semibold)
        static let headline = Font.system(size: 17, weight: .semibold)
        static let body = Font.system(size: 17, weight: .regular)
        static let callout = Font.system(size: 16, weight: .regular)
        static let subheadline = Font.system(size: 15, weight: .regular)
        static let footnote = Font.system(size: 13, weight: .regular)
        static let caption = Font.system(size: 12, weight: .regular)
        static let caption2 = Font.system(size: 11, weight: .regular)
    }

    // MARK: - Spacing

    struct Spacing {
        static let xs: CGFloat = 4
        static let sm: CGFloat = 8
        static let md: CGFloat = 16
        static let lg: CGFloat = 24
        static let xl: CGFloat = 32
        static let xxl: CGFloat = 48
        static let xxxl: CGFloat = 64
    }

    // MARK: - Corner Radius

    struct CornerRadius {
        static let xs: CGFloat = 4
        static let sm: CGFloat = 8
        static let md: CGFloat = 12
        static let lg: CGFloat = 16
        static let xl: CGFloat = 20
        static let xxl: CGFloat = 24
        static let round: CGFloat = 999
    }

    // MARK: - Shadows

    struct Shadows {
        // Level 1: Cards
        static let level1 = ShadowStyle(
            color: Color.black.opacity(0.1),
            radius: 3,
            x: 0,
            y: 1
        )

        // Level 2: Elevated elements
        static let level2 = ShadowStyle(
            color: Color.black.opacity(0.1),
            radius: 6,
            x: 0,
            y: 4
        )

        // Level 3: Floating elements
        static let level3 = ShadowStyle(
            color: Color.black.opacity(0.15),
            radius: 20,
            x: 0,
            y: 10
        )

        // Level 4: Modals
        static let level4 = ShadowStyle(
            color: Color.black.opacity(0.2),
            radius: 40,
            x: 0,
            y: 20
        )
    }

    // MARK: - Blur Radius

    struct BlurRadius {
        static let light: CGFloat = 10
        static let medium: CGFloat = 15
        static let heavy: CGFloat = 20
        static let ultraHeavy: CGFloat = 30
    }

    // MARK: - Animation Durations

    struct Duration {
        static let fast: Double = 0.2
        static let normal: Double = 0.3
        static let slow: Double = 0.5
        static let verySlow: Double = 0.8
    }
}

// MARK: - Shadow Style

struct ShadowStyle {
    let color: Color
    let radius: CGFloat
    let x: CGFloat
    let y: CGFloat
}

// MARK: - View Extension for Shadows

extension View {
    func applyShadow(_ style: ShadowStyle) -> some View {
        self.shadow(color: style.color, radius: style.radius, x: style.x, y: style.y)
    }
}

// MARK: - Color Extension for Hex

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
            (a, r, g, b) = (1, 1, 1, 0)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
