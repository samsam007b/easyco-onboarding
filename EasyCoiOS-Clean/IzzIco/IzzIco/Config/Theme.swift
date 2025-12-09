import SwiftUI

/// Design System de l'application EasyCo
/// Basé sur la charte graphique de la web app
/// Centralise toutes les couleurs, fonts et styles pour une cohérence visuelle
struct Theme {

    // MARK: - User Role

    enum UserRole {
        case searcher
        case owner
        case resident

        var primaryColor: Color {
            switch self {
            case .searcher: return Colors.Searcher.primary
            case .owner: return Colors.Owner.primary
            case .resident: return Colors.Resident.primary
            }
        }

        var gradient: LinearGradient {
            switch self {
            case .searcher: return Gradients.searcherCTA
            case .owner: return Gradients.ownerCTA
            case .resident: return Gradients.residentCTA
            }
        }

        var lightBackground: Color {
            switch self {
            case .searcher: return Colors.Searcher._100
            case .owner: return Colors.Owner._100
            case .resident: return Colors.Resident._100
            }
        }
    }

    // MARK: - Colors

    struct Colors {
        // Legacy compatibility
        static let primary = Owner.primary
        static let secondary = Searcher.primary
        static let accent = Resident.primary

        // MARK: - Searcher Colors (Yellow/Gold/Amber)
        struct Searcher {
            static let _50 = Color(hex: "FFFEF0")
            static let _100 = Color(hex: "FFF9E6")
            static let _200 = Color(hex: "FFF59D")
            static let _300 = Color(hex: "FFEB3B")
            static let _400 = Color(hex: "FFD249")
            static let primary = Color(hex: "FFB10B")  // _500 - Updated to #FFB10B
            static let _600 = Color(hex: "F9A825")
            static let _700 = Color(hex: "F57F17")
            static let _800 = Color(hex: "E65100")
            static let _900 = Color(hex: "BF360C")
        }

        // MARK: - Owner Colors (Mauve/Purple/Indigo)
        struct Owner {
            static let _50 = Color(hex: "F9F8FF")
            static let _100 = Color(hex: "F3F1FF")
            static let _200 = Color(hex: "E0D9FF")
            static let _300 = Color(hex: "BAB2E3")
            static let _400 = Color(hex: "8E7AD6")
            static let primary = Color(hex: "9256A4")  // _500 - Updated to #9256A4
            static let _600 = Color(hex: "5B45B8")
            static let _700 = Color(hex: "4A148C")
            static let _800 = Color(hex: "38006B")
            static let _900 = Color(hex: "1A0033")
        }

        // MARK: - Resident Colors (Orange/Coral/Terracotta)
        struct Resident {
            static let _50 = Color(hex: "FFFAF8")
            static let _100 = Color(hex: "FFF3EF")
            static let _200 = Color(hex: "FFB88C")
            static let _300 = Color(hex: "FF8C5C")
            static let _400 = Color(hex: "FF6F3C")
            static let primary = Color(hex: "FF5722")  // _500
            static let _600 = Color(hex: "E64A19")
            static let _700 = Color(hex: "D84315")
            static let _800 = Color(hex: "BF360C")
            static let _900 = Color(hex: "8D2A0E")
        }

        // MARK: - Neutral Colors (Gray scale)
        struct Gray {
            static let _50 = Color(hex: "F9F9F9")
            static let _100 = Color(hex: "F2F2F2")
            static let _200 = Color(hex: "E5E5E5")
            static let _300 = Color(hex: "D9D9D9")
            static let _400 = Color(hex: "BFBFBF")
            static let _500 = Color(hex: "8C8C8C")
            static let _600 = Color(hex: "666666")
            static let _700 = Color(hex: "404040")
            static let _800 = Color(hex: "2D2D2D")
            static let _900 = Color(hex: "1A1A1A")
        }

        // Backgrounds
        static let background = Color(hex: "FFFFFF")
        static let backgroundSecondary = Color(hex: "F9FAFB")
        static let backgroundTertiary = Color(hex: "F3F4F6")

        // Text Colors
        static let textPrimary = Color(hex: "111827")
        static let textSecondary = Color(hex: "6B7280")
        static let textTertiary = Color(hex: "9CA3AF")

        // Semantic Colors
        static let success = Color(hex: "10B981")
        static let successLight = Color(hex: "D1FAE5")
        static let warning = Color(hex: "F59E0B")
        static let warningLight = Color(hex: "FEF3C7")
        static let error = Color(hex: "EF4444")
        static let errorLight = Color(hex: "FEE2E2")
        static let info = Color(hex: "3B82F6")
        static let infoLight = Color(hex: "DBEAFE")

        // UI Elements
        static let border = Color(hex: "E5E7EB")
        static let divider = Color(hex: "F3F4F6")
        static let overlay = Color.black.opacity(0.5)

        // Additional UI colors for new components
        static let backgroundPrimary = Color.white
        static let primaryGradient = LinearGradient(
            colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        static let gray50 = Color(hex: "F9FAFB")
        static let gray100 = Color(hex: "F3F4F6")
        static let gray200 = Color(hex: "E5E7EB")
        static let gray300 = Color(hex: "D1D5DB")
        static let gray400 = Color(hex: "9CA3AF")
        static let gray600 = Gray._600  // Alias to Gray._600
        static let gray700 = Gray._700  // Alias to Gray._700
        static let heartRed = Color(hex: "EF4444")
        static let messageBlue = Color(hex: "0EA5E9")
        static let matchPink = Color(hex: "EC4899")

        // Property Status Colors
        static let available = Color(hex: "10B981")
        static let pending = Color(hex: "F59E0B")
        static let occupied = Color(hex: "EF4444")

        // Legacy role-specific colors (for compatibility)
        static let searcherPrimary = Searcher.primary
        static let searcherGradientStart = Color(hex: "FFA040")
        static let searcherGradientEnd = Color(hex: "FFB85C")

        static let ownerPrimary = Owner.primary
        static let ownerGradientStart = Owner.primary
        static let ownerGradientEnd = Color(hex: "4A148C")

        static let residentPrimary = Resident.primary
        static let residentGradientStart = Color(hex: "D97B6F")
        static let residentGradientEnd = Color(hex: "FF8C4B")
    }

    // MARK: - Color Aliases (for component compatibility)
    typealias SearcherColors = Colors.Searcher
    typealias OwnerColors = Colors.Owner
    typealias ResidentColors = Colors.Resident
    typealias GrayColors = Colors.Gray

    // MARK: - Gradients

    struct Gradients {
        /// Gradient tricolore signature de la marque
        static let brand = LinearGradient(
            colors: [
                Color(hex: "9256A4"),  // Owner - Mauve (Updated to #9256A4)
                Color(hex: "FF6F3C"),  // Resident - Orange
                Color(hex: "FFB10B")   // Searcher - Yellow (Updated to #FFB10B)
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        static let brandHorizontal = LinearGradient(
            colors: [
                Color(hex: "9256A4"),  // Owner - Updated to #9256A4
                Color(hex: "FF6F3C"),  // Resident - Orange
                Color(hex: "FFB10B")   // Searcher - Updated to #FFB10B
            ],
            startPoint: .leading,
            endPoint: .trailing
        )

        // Searcher CTA Gradient
        static let searcherCTA = LinearGradient(
            colors: [Color(hex: "FFA040"), Color(hex: "FFB85C"), Color(hex: "FFD080")],
            startPoint: .leading,
            endPoint: .trailing
        )

        static let searcherSoft = LinearGradient(
            colors: [Color(hex: "FFF9E6"), Color(hex: "FFF4D9")],
            startPoint: .top,
            endPoint: .bottom
        )

        // Owner CTA Gradient
        static let ownerCTA = LinearGradient(
            colors: [Color(hex: "7B5FB8"), Color(hex: "A67BB8"), Color(hex: "C98B9E")],
            startPoint: .leading,
            endPoint: .trailing
        )

        static let ownerSoft = LinearGradient(
            colors: [Color(hex: "F3F1FF"), Color(hex: "EDE9FF")],
            startPoint: .top,
            endPoint: .bottom
        )

        // Resident CTA Gradient
        static let residentCTA = LinearGradient(
            colors: [Color(hex: "D97B6F"), Color(hex: "E8865D"), Color(hex: "FF8C4B")],
            startPoint: .leading,
            endPoint: .trailing
        )

        static let residentSoft = LinearGradient(
            colors: [Color(hex: "FFF3EF"), Color(hex: "FFEDE6")],
            startPoint: .top,
            endPoint: .bottom
        )

        /// Gradient pour badge de score de compatibilité
        static let compatibilityScore = LinearGradient(
            colors: [Color(hex: "10B981"), Color(hex: "059669")],
            startPoint: .leading,
            endPoint: .trailing
        )

        /// Pink gradient for match-related features
        static let pinkGradient = LinearGradient(
            colors: [Color(hex: "EC4899"), Color(hex: "F472B6")],
            startPoint: .leading,
            endPoint: .trailing
        )
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
        static func bodyLarge(_ weight: Font.Weight = .regular) -> Font {
            .system(size: 17, weight: weight, design: .default)
        }

        static func body(_ weight: Font.Weight = .regular) -> Font {
            .system(size: 15, weight: weight, design: .default)
        }

        static func bodySmall(_ weight: Font.Weight = .regular) -> Font {
            .system(size: 13, weight: weight, design: .default)
        }

        // Caption
        static func caption(_ weight: Font.Weight = .regular) -> Font {
            .system(size: 13, weight: weight, design: .default)
        }

        static func captionSmall(_ weight: Font.Weight = .regular) -> Font {
            .system(size: 11, weight: weight, design: .default)
        }

        // Special purpose
        static func price(_ weight: Font.Weight = .bold) -> Font {
            .system(size: 20, weight: weight, design: .default)
        }

        static func badge(_ weight: Font.Weight = .semibold) -> Font {
            .system(size: 12, weight: weight, design: .default)
        }
    }

    // MARK: - Spacing (Base 8px)

    struct Spacing {
        static let _1: CGFloat = 4
        static let _2: CGFloat = 8
        static let _3: CGFloat = 12
        static let _4: CGFloat = 16
        static let _5: CGFloat = 20
        static let _6: CGFloat = 24
        static let _8: CGFloat = 32
        static let _10: CGFloat = 40
        static let _12: CGFloat = 48

        // Legacy names
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
        static let sm: CGFloat = 6
        static let md: CGFloat = 8
        static let lg: CGFloat = 12
        static let xl: CGFloat = 16
        static let _2xl: CGFloat = 20
        static let _3xl: CGFloat = 24
        static let full: CGFloat = 9999

        // Additional aliases for new components
        static let card: CGFloat = 12
        static let button: CGFloat = 8
        static let modal: CGFloat = 24
        static let input: CGFloat = 8
    }

    // MARK: - Shadows

    struct Shadows {
        static let small = Shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        static let medium = Shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 4)
        static let large = Shadow(color: .black.opacity(0.15), radius: 16, x: 0, y: 8)

        // Role-specific glow shadows
        static func glow(for role: UserRole) -> Shadow {
            Shadow(color: role.primaryColor.opacity(0.3), radius: 12, x: 0, y: 4)
        }
    }

    struct Shadow {
        let color: Color
        let radius: CGFloat
        let x: CGFloat
        let y: CGFloat
    }

    // MARK: - Sizes

    struct Size {
        static let buttonHeight: CGFloat = 48
        static let cardImageHeight: CGFloat = 240
        static let cardImageHeightCompact: CGFloat = 180
        static let iconSmall: CGFloat = 16
        static let iconMedium: CGFloat = 20
        static let iconLarge: CGFloat = 24
        static let touchTarget: CGFloat = 44  // Minimum touch target size
        static let inputHeight: CGFloat = 48
        static let searchBarHeight: CGFloat = 44
    }

    // MARK: - Animations

    struct Animations {
        static let fast = SwiftUI.Animation.easeInOut(duration: 0.15)
        static let quick = SwiftUI.Animation.easeInOut(duration: 0.2)
        static let standard = SwiftUI.Animation.easeInOut(duration: 0.3)
        static let slow = SwiftUI.Animation.easeInOut(duration: 0.5)
        static let spring = SwiftUI.Animation.spring(response: 0.3, dampingFraction: 0.7)
        static let bouncy = SwiftUI.Animation.spring(response: 0.4, dampingFraction: 0.6)
        static let springFast = SwiftUI.Animation.spring(response: 0.25, dampingFraction: 0.7)
    }

    // Alias for backward compatibility
    typealias Animation = Animations
}

// MARK: - Color Extension for Hex
// NOTE: Color.init(hex:) is now defined in Core/DesignSystem/DesignTokens.swift
// This duplicate extension has been commented out to avoid ambiguity

/*
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
*/

// MARK: - View Extensions for Theme

extension View {
    func themeShadow(_ shadow: Theme.Shadow) -> some View {
        self.shadow(color: shadow.color, radius: shadow.radius, x: shadow.x, y: shadow.y)
    }

    /// Apply role-specific glow shadow
    func roleGlow(_ role: Theme.UserRole) -> some View {
        let glow = Theme.Shadows.glow(for: role)
        return self.shadow(color: glow.color, radius: glow.radius, x: glow.x, y: glow.y)
    }

    /// Apply card styling
    func cardStyle(cornerRadius: CGFloat = Theme.CornerRadius._3xl) -> some View {
        self
            .background(Color.white)
            .cornerRadius(cornerRadius)
            .themeShadow(Theme.Shadows.small)
    }

    /// Apply card shadow
    func cardShadow() -> some View {
        self.shadow(color: .black.opacity(0.08), radius: 8, x: 0, y: 4)
    }

    /// Apply button shadow
    func buttonShadow() -> some View {
        self.shadow(color: .black.opacity(0.12), radius: 4, x: 0, y: 2)
    }

    /// Apply soft shadow
    func softShadow() -> some View {
        self.shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 2)
    }
}

// MARK: - Haptic Feedback

struct HapticFeedback {
    static func light() {
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
    }

    static func medium() {
        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
    }

    static func heavy() {
        UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
    }

    static func success() {
        UINotificationFeedbackGenerator().notificationOccurred(.success)
    }

    static func error() {
        UINotificationFeedbackGenerator().notificationOccurred(.error)
    }

    static func warning() {
        UINotificationFeedbackGenerator().notificationOccurred(.warning)
    }

    static func selection() {
        UISelectionFeedbackGenerator().selectionChanged()
    }

    // MARK: - Convenience Methods

    enum ImpactStyle {
        case light, medium, heavy
    }

    enum NotificationStyle {
        case success, warning, error
    }

    static func impact(_ style: ImpactStyle) {
        switch style {
        case .light: light()
        case .medium: medium()
        case .heavy: heavy()
        }
    }

    static func notification(_ style: NotificationStyle) {
        switch style {
        case .success: success()
        case .warning: warning()
        case .error: error()
        }
    }
}

// Typealias for shorter syntax
typealias Haptic = HapticFeedback
