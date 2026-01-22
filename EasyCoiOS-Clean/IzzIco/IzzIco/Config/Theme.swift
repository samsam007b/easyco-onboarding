import SwiftUI

// ============================================
// THEME.SWIFT - LEGACY COMPATIBILITY BRIDGE
// ============================================
// This file now forwards all values to DesignTokens.swift
// DO NOT add new values here - add them to DesignTokens instead
// This file exists for backward compatibility with existing code
// Plan: Gradually migrate all Theme.* usages to DesignTokens.*
// ============================================

/// Design System de l'application Izzico
/// DEPRECATED: Use DesignTokens instead for new code
struct Theme {

    // MARK: - User Role (bridges to DesignTokens.UserRole)

    enum UserRole {
        case searcher
        case owner
        case resident

        var primaryColor: Color {
            switch self {
            case .searcher: return DesignTokens.Searcher.primary
            case .owner: return DesignTokens.Owner.primary
            case .resident: return DesignTokens.Resident.primary
            }
        }

        var gradient: LinearGradient {
            switch self {
            case .searcher: return DesignTokens.Searcher.gradient
            case .owner: return DesignTokens.Owner.gradient
            case .resident: return DesignTokens.Resident.gradient
            }
        }

        var lightBackground: Color {
            switch self {
            case .searcher: return DesignTokens.Searcher.color100
            case .owner: return DesignTokens.Owner.color100
            case .resident: return DesignTokens.Resident.color100
            }
        }

        /// Convert to new UserRole enum
        var asDesignTokenRole: IzzIco.UserRole {
            switch self {
            case .searcher: return .searcher
            case .owner: return .owner
            case .resident: return .resident
            }
        }
    }

    // MARK: - Colors (bridges to DesignTokens)

    struct Colors {
        // Legacy compatibility - now uses correct values from DesignTokens
        static let primary = DesignTokens.Owner.primary
        static let secondary = DesignTokens.Searcher.primary
        static let accent = DesignTokens.Resident.primary

        // MARK: - Searcher Colors (bridges to DesignTokens.Searcher)
        struct Searcher {
            static let _50 = DesignTokens.Searcher.color50
            static let _100 = DesignTokens.Searcher.color100
            static let _200 = DesignTokens.Searcher.color200
            static let _300 = DesignTokens.Searcher.color300
            static let _400 = DesignTokens.Searcher.color400
            static let primary = DesignTokens.Searcher.primary  // #ffa000
            static let _600 = DesignTokens.Searcher.color600
            static let _700 = DesignTokens.Searcher.color700
            static let _800 = DesignTokens.Searcher.color800
            static let _900 = DesignTokens.Searcher.color900
        }

        // MARK: - Owner Colors (bridges to DesignTokens.Owner)
        struct Owner {
            static let _50 = DesignTokens.Owner.color50
            static let _100 = DesignTokens.Owner.color100
            static let _200 = DesignTokens.Owner.color200
            static let _300 = DesignTokens.Owner.color300
            static let _400 = DesignTokens.Owner.color400
            static let primary = DesignTokens.Owner.primary  // #9c5698
            static let _600 = DesignTokens.Owner.color600
            static let _700 = DesignTokens.Owner.color700
            static let _800 = DesignTokens.Owner.color800
            static let _900 = DesignTokens.Owner.color900
        }

        // MARK: - Resident Colors (bridges to DesignTokens.Resident)
        struct Resident {
            static let _50 = DesignTokens.Resident.color50
            static let _100 = DesignTokens.Resident.color100
            static let _200 = DesignTokens.Resident.color200
            static let _300 = DesignTokens.Resident.color300
            static let _400 = DesignTokens.Resident.color400
            static let primary = DesignTokens.Resident.primary  // #e05747
            static let _600 = DesignTokens.Resident.color600
            static let _700 = DesignTokens.Resident.color700
            static let _800 = DesignTokens.Resident.color800
            static let _900 = DesignTokens.Resident.color900
        }

        // MARK: - Neutral Colors (bridges to DesignTokens.Neutral)
        struct Gray {
            static let _50 = DesignTokens.Neutral.gray50
            static let _100 = DesignTokens.Neutral.gray100
            static let _200 = DesignTokens.Neutral.gray200
            static let _300 = DesignTokens.Neutral.gray300
            static let _400 = DesignTokens.Neutral.gray400
            static let _500 = DesignTokens.Neutral.gray500
            static let _600 = DesignTokens.Neutral.gray600
            static let _700 = DesignTokens.Neutral.gray700
            static let _800 = DesignTokens.Neutral.gray800
            static let _900 = DesignTokens.Neutral.gray900
        }

        // Backgrounds
        static let background = DesignTokens.Neutral.surface
        static let backgroundSecondary = DesignTokens.Neutral.background
        static let backgroundTertiary = DesignTokens.Neutral.surfaceSecondary

        // Text Colors
        static let textPrimary = DesignTokens.Neutral.text
        static let textSecondary = DesignTokens.Neutral.textSecondary
        static let textTertiary = DesignTokens.Neutral.textTertiary

        // Semantic Colors
        static let success = DesignTokens.Semantic.success
        static let successLight = DesignTokens.Semantic.successLight
        static let warning = DesignTokens.Semantic.warning
        static let warningLight = DesignTokens.Semantic.warningLight
        static let error = DesignTokens.Semantic.error
        static let errorLight = DesignTokens.Semantic.errorLight
        static let info = DesignTokens.Semantic.info
        static let infoLight = DesignTokens.Semantic.infoLight

        // UI Elements
        static let border = DesignTokens.Neutral.border
        static let divider = DesignTokens.Neutral.divider
        static let overlay = Color.black.opacity(0.5)

        // Additional UI colors
        static let backgroundPrimary = Color.white
        static let primaryGradient = DesignTokens.Gradients.primary
        static let gray50 = DesignTokens.Neutral.gray50
        static let gray100 = DesignTokens.Neutral.gray100
        static let gray200 = DesignTokens.Neutral.gray200
        static let gray300 = DesignTokens.Neutral.gray300
        static let gray400 = DesignTokens.Neutral.gray400
        static let gray600 = DesignTokens.Neutral.gray600
        static let gray700 = DesignTokens.Neutral.gray700
        static let heartRed = DesignTokens.Semantic.error
        static let messageBlue = DesignTokens.UIAccent.sky
        static let matchPink = DesignTokens.UIAccent.dustyRose

        // Property Status Colors
        static let available = DesignTokens.Semantic.success
        static let pending = DesignTokens.Semantic.warning
        static let occupied = DesignTokens.Semantic.error

        // Legacy role-specific colors
        static let searcherPrimary = DesignTokens.Searcher.primary
        static let searcherGradientStart = DesignTokens.Searcher.color500
        static let searcherGradientEnd = DesignTokens.Searcher.color400

        static let ownerPrimary = DesignTokens.Owner.primary
        static let ownerGradientStart = DesignTokens.Owner.primary
        static let ownerGradientEnd = DesignTokens.Owner.color700

        static let residentPrimary = DesignTokens.Resident.primary
        static let residentGradientStart = DesignTokens.Resident.color400
        static let residentGradientEnd = DesignTokens.Resident.color500
    }

    // MARK: - Color Aliases (for component compatibility)
    typealias SearcherColors = Colors.Searcher
    typealias OwnerColors = Colors.Owner
    typealias ResidentColors = Colors.Resident
    typealias GrayColors = Colors.Gray

    // MARK: - Gradients (bridges to DesignTokens)

    struct Gradients {
        /// Gradient tricolore signature de la marque
        static let brand = DesignTokens.Brand.signatureGradient

        static let brandHorizontal = DesignTokens.Brand.signatureGradientHorizontal

        // Searcher CTA Gradient
        static let searcherCTA = DesignTokens.Gradients.searcherCTA

        static let searcherSoft = DesignTokens.Gradients.searcherSoft

        // Owner CTA Gradient
        static let ownerCTA = DesignTokens.Gradients.ownerCTA

        static let ownerSoft = DesignTokens.Gradients.ownerSoft

        // Resident CTA Gradient
        static let residentCTA = DesignTokens.Gradients.residentCTA

        static let residentSoft = DesignTokens.Gradients.residentSoft

        /// Gradient pour badge de score de compatibilite
        static let compatibilityScore = DesignTokens.Gradients.success

        /// Pink gradient for match-related features
        static let pinkGradient = DesignTokens.Gradients.pink
    }

    // MARK: - Typography (bridges to DesignTokens)

    struct Typography {
        // Titles
        static func largeTitle(_ weight: Font.Weight = .bold) -> Font {
            weight == .bold ? DesignTokens.Typography.largeTitle : .system(size: 34, weight: weight)
        }

        static func title1(_ weight: Font.Weight = .bold) -> Font {
            weight == .bold ? DesignTokens.Typography.title1 : .system(size: 28, weight: weight)
        }

        static func title2(_ weight: Font.Weight = .semibold) -> Font {
            weight == .semibold ? DesignTokens.Typography.title2 : .system(size: 22, weight: weight)
        }

        static func title3(_ weight: Font.Weight = .semibold) -> Font {
            weight == .semibold ? DesignTokens.Typography.title3 : .system(size: 20, weight: weight)
        }

        // Body
        static func bodyLarge(_ weight: Font.Weight = .regular) -> Font {
            .system(size: 17, weight: weight)
        }

        static func body(_ weight: Font.Weight = .regular) -> Font {
            weight == .regular ? DesignTokens.Typography.body :
            weight == .semibold ? DesignTokens.Typography.headline :
            .system(size: 15, weight: weight)
        }

        static func bodySmall(_ weight: Font.Weight = .regular) -> Font {
            DesignTokens.Typography.footnote
        }

        // Caption
        static func caption(_ weight: Font.Weight = .regular) -> Font {
            DesignTokens.Typography.caption
        }

        static func captionSmall(_ weight: Font.Weight = .regular) -> Font {
            DesignTokens.Typography.caption2
        }

        // Special purpose
        static func price(_ weight: Font.Weight = .bold) -> Font {
            .system(size: 20, weight: weight)
        }

        static func badge(_ weight: Font.Weight = .semibold) -> Font {
            DesignTokens.Typography.caption
        }
    }

    // MARK: - Spacing (bridges to DesignTokens)

    struct Spacing {
        static let _1: CGFloat = DesignTokens.Spacing.xs
        static let _2: CGFloat = DesignTokens.Spacing.sm
        static let _3: CGFloat = DesignTokens.Spacing.spacing3
        static let _4: CGFloat = DesignTokens.Spacing.md
        static let _5: CGFloat = DesignTokens.Spacing.spacing5
        static let _6: CGFloat = DesignTokens.Spacing.lg
        static let _8: CGFloat = DesignTokens.Spacing.xl
        static let _10: CGFloat = DesignTokens.Spacing.spacing10
        static let _12: CGFloat = DesignTokens.Spacing.xxl

        // Legacy names
        static let xxs: CGFloat = DesignTokens.Spacing.xs
        static let xs: CGFloat = DesignTokens.Spacing.sm
        static let sm: CGFloat = DesignTokens.Spacing.spacing3
        static let md: CGFloat = DesignTokens.Spacing.md
        static let lg: CGFloat = DesignTokens.Spacing.lg
        static let xl: CGFloat = DesignTokens.Spacing.xl
        static let xxl: CGFloat = DesignTokens.Spacing.xxl
    }

    // MARK: - Corner Radius (bridges to DesignTokens)

    struct CornerRadius {
        static let sm: CGFloat = DesignTokens.CornerRadius.sm
        static let md: CGFloat = DesignTokens.CornerRadius.md
        static let lg: CGFloat = DesignTokens.CornerRadius.lg
        static let xl: CGFloat = DesignTokens.CornerRadius.xl
        static let _2xl: CGFloat = DesignTokens.CornerRadius.xxl
        static let _3xl: CGFloat = DesignTokens.CornerRadius.xxxl
        static let full: CGFloat = DesignTokens.CornerRadius.round

        // Semantic aliases
        static let card: CGFloat = DesignTokens.CornerRadius.card
        static let button: CGFloat = DesignTokens.CornerRadius.button
        static let modal: CGFloat = DesignTokens.CornerRadius.modal
        static let input: CGFloat = DesignTokens.CornerRadius.input
    }

    // MARK: - Shadows (bridges to DesignTokens)

    struct Shadows {
        static let small = Shadow(
            color: DesignTokens.Shadows.level1.color,
            radius: DesignTokens.Shadows.level1.radius,
            x: DesignTokens.Shadows.level1.x,
            y: DesignTokens.Shadows.level1.y
        )
        static let medium = Shadow(
            color: DesignTokens.Shadows.level2.color,
            radius: DesignTokens.Shadows.level2.radius,
            x: DesignTokens.Shadows.level2.x,
            y: DesignTokens.Shadows.level2.y
        )
        static let large = Shadow(
            color: DesignTokens.Shadows.level3.color,
            radius: DesignTokens.Shadows.level3.radius,
            x: DesignTokens.Shadows.level3.x,
            y: DesignTokens.Shadows.level3.y
        )

        // Role-specific glow shadows
        static func glow(for role: UserRole) -> Shadow {
            switch role {
            case .searcher:
                return Shadow(color: DesignTokens.Searcher.shadow, radius: 12, x: 0, y: 4)
            case .owner:
                return Shadow(color: DesignTokens.Owner.shadow, radius: 12, x: 0, y: 4)
            case .resident:
                return Shadow(color: DesignTokens.Resident.shadow, radius: 12, x: 0, y: 4)
            }
        }
    }

    struct Shadow {
        let color: Color
        let radius: CGFloat
        let x: CGFloat
        let y: CGFloat
    }

    // MARK: - Sizes (bridges to DesignTokens)

    struct Size {
        static let buttonHeight: CGFloat = DesignTokens.Size.buttonHeight
        static let cardImageHeight: CGFloat = DesignTokens.Size.cardImageHeight
        static let cardImageHeightCompact: CGFloat = DesignTokens.Size.cardImageHeightCompact
        static let iconSmall: CGFloat = DesignTokens.Size.iconSmall
        static let iconMedium: CGFloat = DesignTokens.Size.iconMedium
        static let iconLarge: CGFloat = DesignTokens.Size.iconLarge
        static let touchTarget: CGFloat = DesignTokens.Size.touchTarget
        static let inputHeight: CGFloat = DesignTokens.Size.inputHeight
        static let searchBarHeight: CGFloat = DesignTokens.Size.searchBarHeight
    }

    // MARK: - Animations (bridges to DesignTokens)

    struct Animations {
        static let fast = DesignTokens.Animation.easeOut
        static let quick = DesignTokens.Animation.easeInOut
        static let standard = SwiftUI.Animation.easeInOut(duration: DesignTokens.Animation.slow)
        static let slow = SwiftUI.Animation.easeInOut(duration: DesignTokens.Animation.verySlow)
        static let spring = DesignTokens.Animation.snappy
        static let bouncy = DesignTokens.Animation.bouncy
        static let springFast = DesignTokens.Animation.snappy
    }

    // Alias for backward compatibility
    typealias Animation = Animations
}

// MARK: - View Extensions for Theme (bridges to DesignTokens extensions)

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
            .continuousCornerRadius(cornerRadius)
            .applyShadow(DesignTokens.Shadows.level1)
    }

    /// Apply card shadow
    func cardShadow() -> some View {
        self.applyShadow(DesignTokens.Shadows.level2)
    }

    /// Apply button shadow
    func buttonShadow() -> some View {
        self.applyShadow(DesignTokens.Shadows.level1)
    }

    /// Apply soft shadow
    func softShadow() -> some View {
        self.applyShadow(DesignTokens.Shadows.level1)
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
