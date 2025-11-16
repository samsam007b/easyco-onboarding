import SwiftUI

/// Design System de l'application
/// Centralise toutes les couleurs, fonts et styles pour une cohérence visuelle
struct Theme {

    // MARK: - Colors

    struct Colors {
        // Brand Colors (from web app)
        static let primary = Color(hex: "4A148C") // Deep Purple (owner)
        static let secondary = Color(hex: "FFD700") // Gold/Yellow (searcher)
        static let accent = Color(hex: "FF6F3C") // Orange (resident)

        // Role-specific colors
        static let searcherPrimary = Color(hex: "FFD700") // Gold
        static let searcherGradientStart = Color(hex: "FFD700")
        static let searcherGradientEnd = Color(hex: "FFA500")

        static let ownerPrimary = Color(hex: "4A148C") // Deep Purple
        static let ownerGradientStart = Color(hex: "4A148C")
        static let ownerGradientEnd = Color(hex: "7B1FA2")

        static let residentPrimary = Color(hex: "FF6F3C") // Orange
        static let residentGradientStart = Color(hex: "FF6F3C")
        static let residentGradientEnd = Color(hex: "FF8C5A")

        // Neutral Colors
        static let background = Color(hex: "FFFFFF")
        static let backgroundSecondary = Color(hex: "F9FAFB")
        static let backgroundTertiary = Color(hex: "F3F4F6")

        // Text Colors
        static let textPrimary = Color(hex: "111827")
        static let textSecondary = Color(hex: "6B7280")
        static let textTertiary = Color(hex: "9CA3AF")

        // Semantic Colors
        static let success = Color(hex: "10B981")
        static let warning = Color(hex: "F59E0B")
        static let error = Color(hex: "EF4444")
        static let info = Color(hex: "3B82F6")

        // UI Elements
        static let border = Color(hex: "E5E7EB")
        static let divider = Color(hex: "F3F4F6")
        static let overlay = Color.black.opacity(0.5)

        // Property Status Colors
        static let available = Color(hex: "10B981")
        static let pending = Color(hex: "F59E0B")
        static let occupied = Color(hex: "EF4444")
    }

    // MARK: - Typography

    struct Typography {
        // Titles
        static func largeTitle(_ weight: Font.Weight = .bold) -> Font {
            .system(size: 34, weight: weight, design: .default)
        }

        static func title1(_ weight: Font.Weight = .bold) -> Font {
            .system(size: 28, weight: weight, design: .default)
        }

        static func title2(_ weight: Font.Weight = .semibold) -> Font {
            .system(size: 22, weight: weight, design: .default)
        }

        static func title3(_ weight: Font.Weight = .semibold) -> Font {
            .system(size: 20, weight: weight, design: .default)
        }

        // Body
        static func body(_ weight: Font.Weight = .regular) -> Font {
            .system(size: 17, weight: weight, design: .default)
        }

        static func bodySmall(_ weight: Font.Weight = .regular) -> Font {
            .system(size: 15, weight: weight, design: .default)
        }

        // Caption
        static func caption(_ weight: Font.Weight = .regular) -> Font {
            .system(size: 13, weight: weight, design: .default)
        }

        static func captionSmall(_ weight: Font.Weight = .regular) -> Font {
            .system(size: 11, weight: weight, design: .default)
        }
    }

    // MARK: - Spacing

    struct Spacing {
        static let xxs: CGFloat = 4
        static let xs: CGFloat = 8
        static let sm: CGFloat = 12
        static let md: CGFloat = 16
        static let lg: CGFloat = 24
        static let xl: CGFloat = 32
        static let xxl: CGFloat = 48
    }

    // MARK: - Corner Radius

    struct CornerRadius {
        static let sm: CGFloat = 8
        static let md: CGFloat = 12
        static let lg: CGFloat = 16
        static let xl: CGFloat = 24
        static let full: CGFloat = 999
    }

    // MARK: - Shadows

    struct Shadows {
        static let small = Shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        static let medium = Shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 4)
        static let large = Shadow(color: .black.opacity(0.15), radius: 16, x: 0, y: 8)
    }

    struct Shadow {
        let color: Color
        let radius: CGFloat
        let x: CGFloat
        let y: CGFloat
    }

    // MARK: - Animations

    struct Animations {
        static let quick = Animation.easeInOut(duration: 0.2)
        static let standard = Animation.easeInOut(duration: 0.3)
        static let slow = Animation.easeInOut(duration: 0.5)
        static let spring = Animation.spring(response: 0.3, dampingFraction: 0.7)
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

// MARK: - View Extensions for Theme

extension View {
    func themeShadow(_ shadow: Theme.Shadow) -> some View {
        self.shadow(color: shadow.color, radius: shadow.radius, x: shadow.x, y: shadow.y)
    }
}
