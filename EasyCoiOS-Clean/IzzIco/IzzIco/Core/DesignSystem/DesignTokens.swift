import SwiftUI

// MARK: - Izzico Design Tokens v3.3
// ============================================
// Source of Truth: brand-identity/izzico-design-system-unified.html
// Synchronized with Web (app/globals.css) on 2026-01-22
// ============================================
// DO NOT modify colors without updating the web design system first!
// Workflow: Design System HTML → globals.css → DesignTokens.swift
// ============================================

struct DesignTokens {

    // MARK: - Role Colors
    // Each role has a complete 50-900 scale with L* monotonic progression

    struct Searcher {
        // Gold/Amber scale - For users looking for housing
        static let color50 = Color(hex: "FFFAEB")   // L*=98 - Lightest backgrounds
        static let color100 = Color(hex: "FFF3C4")  // L*=95 - Light backgrounds
        static let color200 = Color(hex: "FCE588")  // L*=90 - Hover backgrounds
        static let color300 = Color(hex: "FADB5F")  // L*=85 - Subtle accents
        static let color400 = Color(hex: "F7C948")  // L*=78 - Accents
        static let color500 = Color(hex: "ffa000")  // L*=70 - PRIMARY (Brand Guidelines)
        static let color600 = Color(hex: "D98400")  // L*=58 - Hover on primary
        static let color700 = Color(hex: "A16300")  // L*=45 - Text-safe WCAG AA
        static let color800 = Color(hex: "6B4200")  // L*=30 - Dark text
        static let color900 = Color(hex: "3D2500")  // L*=18 - Darkest

        // Semantic aliases
        static let primary = color500
        static let hover = color600
        static let accent = color400
        static let subtle = color300
        static let light = color200
        static let dark = color700
        static let text = color700  // WCAG AA safe
        static let muted = Color(hex: "FFF8E0")
        static let border = Color(hex: "FCE588")

        // Gradient (135deg)
        static let gradient = LinearGradient(
            colors: [color500, color600],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        // Shadow color
        static let shadow = Color(hex: "ffa000").opacity(0.2)
    }

    struct Owner {
        // Mauve/Purple scale - For property owners (DEFAULT theme)
        static let color50 = Color(hex: "F8F0F7")   // L*=95 - Lightest backgrounds
        static let color100 = Color(hex: "F0E0EE")  // L*=90 - Light backgrounds
        static let color200 = Color(hex: "E0C0DC")  // L*=80 - Hover backgrounds
        static let color300 = Color(hex: "C990C2")  // L*=65 - Subtle accents
        static let color400 = Color(hex: "B070A8")  // L*=55 - Accents
        static let color500 = Color(hex: "9c5698")  // L*=45 - PRIMARY (Brand Guidelines)
        static let color600 = Color(hex: "7E4580")  // L*=38 - Hover on primary
        static let color700 = Color(hex: "633668")  // L*=30 - Text-safe WCAG AA
        static let color800 = Color(hex: "482850")  // L*=23 - Dark text
        static let color900 = Color(hex: "2E1A38")  // L*=15 - Darkest

        // Semantic aliases
        static let primary = color500
        static let hover = color600
        static let accent = color400
        static let subtle = color300
        static let light = color200
        static let dark = color700
        static let text = color700  // WCAG AA safe
        static let muted = Color(hex: "E0C0DC")
        static let border = Color(hex: "E0C0DC")

        // Gradient (135deg)
        static let gradient = LinearGradient(
            colors: [color500, color600],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        // Shadow color
        static let shadow = Color(hex: "9c5698").opacity(0.2)
    }

    struct Resident {
        // Coral/Orange scale - For current residents
        static let color50 = Color(hex: "FFF5F0")   // L*=98 - Lightest backgrounds
        static let color100 = Color(hex: "FFEBE0")  // L*=94 - Light backgrounds
        static let color200 = Color(hex: "F9B8A0")  // L*=80 - Hover backgrounds
        static let color300 = Color(hex: "F28B6A")  // L*=65 - Subtle accents
        static let color400 = Color(hex: "E96A50")  // L*=55 - Accents
        static let color500 = Color(hex: "e05747")  // L*=48 - PRIMARY (Brand Guidelines)
        static let color600 = Color(hex: "C04538")  // L*=38 - Hover on primary
        static let color700 = Color(hex: "9A362C")  // L*=30 - Text-safe WCAG AA
        static let color800 = Color(hex: "742820")  // L*=22 - Dark text
        static let color900 = Color(hex: "4E1A14")  // L*=14 - Darkest

        // Semantic aliases
        static let primary = color500
        static let hover = color600
        static let accent = color400
        static let subtle = color300
        static let light = color200
        static let dark = color700
        static let text = color700  // WCAG AA safe
        static let muted = Color(hex: "FFE8DC")
        static let border = Color(hex: "F9B8A0")

        // Gradient (135deg)
        static let gradient = LinearGradient(
            colors: [color500, color600],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        // Shadow color
        static let shadow = Color(hex: "e05747").opacity(0.2)
    }

    // MARK: - Brand Signature Gradient
    // The iconic Izzico gradient using all 3 role colors
    // LOCKED - Do not modify without explicit approval

    struct Brand {
        // Bridge color to avoid "muddy zone" between mauve and coral
        static let bridgeColor = Color(hex: "c85570")

        // Full signature gradient (Owner → Resident → Searcher)
        static let signatureGradient = LinearGradient(
            stops: [
                .init(color: Owner.primary, location: 0.0),
                .init(color: bridgeColor, location: 0.20),
                .init(color: Color(hex: "d15659"), location: 0.35),
                .init(color: Resident.primary, location: 0.50),
                .init(color: Color(hex: "ff7c10"), location: 0.75),
                .init(color: Searcher.primary, location: 1.0)
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        // Horizontal variant for headers
        static let signatureGradientHorizontal = LinearGradient(
            stops: [
                .init(color: Owner.primary, location: 0.0),
                .init(color: bridgeColor, location: 0.20),
                .init(color: Resident.primary, location: 0.50),
                .init(color: Searcher.primary, location: 1.0)
            ],
            startPoint: .leading,
            endPoint: .trailing
        )

        // Vertical variant
        static let signatureGradientVertical = LinearGradient(
            stops: [
                .init(color: Owner.primary, location: 0.0),
                .init(color: bridgeColor, location: 0.20),
                .init(color: Resident.primary, location: 0.50),
                .init(color: Searcher.primary, location: 1.0)
            ],
            startPoint: .top,
            endPoint: .bottom
        )
    }

    // MARK: - Semantic Colors

    struct Semantic {
        // Success - Green
        static let success = Color(hex: "10B981")
        static let successLight = Color(hex: "D1FAE5")
        static let successDark = Color(hex: "065F46")
        static let successGradient = LinearGradient(
            colors: [Color(hex: "10B981"), Color(hex: "059669")],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        // Warning - Amber (distinct from Searcher yellow)
        static let warning = Color(hex: "D97706")  // Darker amber to differentiate
        static let warningLight = Color(hex: "FEF3C7")
        static let warningDark = Color(hex: "92400E")
        static let warningGradient = LinearGradient(
            colors: [Color(hex: "F59E0B"), Color(hex: "D97706")],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        // Error - Red
        static let error = Color(hex: "EF4444")
        static let errorLight = Color(hex: "FEE2E2")
        static let errorDark = Color(hex: "991B1B")
        static let errorGradient = LinearGradient(
            colors: [Color(hex: "EF4444"), Color(hex: "DC2626")],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        // Info - Blue
        static let info = Color(hex: "3B82F6")
        static let infoLight = Color(hex: "DBEAFE")
        static let infoDark = Color(hex: "1E40AF")
        static let infoGradient = LinearGradient(
            colors: [Color(hex: "3B82F6"), Color(hex: "2563EB")],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        // Muted/Pastel variants (for interfaces where role color dominates)
        static let successMuted = Color(hex: "7CB89B")
        static let errorMuted = Color(hex: "D08080")
        static let pendingMuted = Color(hex: "9CA3AF")
    }

    // MARK: - UI Accent Colors
    // Functional colors for specific UX contexts

    struct UIAccent {
        // Sky (Blue) - Security, trust, stability
        // Usage: Bank info, passwords, trust elements
        static let sky = Color(hex: "5B8BD9")
        static let skyLight = Color(hex: "E0ECFA")
        static let skyDark = Color(hex: "3A5A8A")

        // Sage (Green) - Success, validation
        // Usage: Confirmations, validations
        static let sage = Color(hex: "7CB89B")
        static let sageLight = Color(hex: "E8F5EE")
        static let sageDark = Color(hex: "4A7A5F")

        // Amber (Orange) - Alerts, attention
        // Usage: Warnings, important notifications
        static let amber = Color(hex: "D9A870")
        static let amberLight = Color(hex: "FDF3E3")
        static let amberDark = Color(hex: "8A6A40")

        // Lavender (Violet) - Premium, exclusivity
        // Usage: Premium features, exclusive elements
        static let lavender = Color(hex: "9B7BD9")
        static let lavenderLight = Color(hex: "F0E8FA")
        static let lavenderDark = Color(hex: "5A4A8A")

        // Dusty Rose (Pink) - Social, community
        // Usage: Invitations, social, sharing
        static let dustyRose = Color(hex: "D08090")
        static let dustyRoseLight = Color(hex: "FAE8EC")
        static let dustyRoseDark = Color(hex: "8A505A")

        // Teal (Cyan) - Technical, connectivity
        // Usage: Settings, devices, connections
        static let teal = Color(hex: "70B0C0")
        static let tealLight = Color(hex: "E5F3F6")
        static let tealDark = Color(hex: "407080")

        // Terracotta (Orange earth) - Personal, profile
        // Usage: User profile, personal settings
        static let terracotta = Color(hex: "C87060")
        static let terracottaLight = Color(hex: "F9EBE8")
        static let terracottaDark = Color(hex: "7A4030")
    }

    // MARK: - Neutral Colors

    struct Neutral {
        static let gray50 = Color(hex: "F9F9F9")   // Page backgrounds
        static let gray100 = Color(hex: "F2F2F2")  // Subtle backgrounds
        static let gray200 = Color(hex: "E5E5E5")  // Dividers
        static let gray300 = Color(hex: "D9D9D9")  // Borders
        static let gray400 = Color(hex: "BFBFBF")  // Disabled text
        static let gray500 = Color(hex: "8C8C8C")  // Placeholder text
        static let gray600 = Color(hex: "666666")  // Text muted
        static let gray700 = Color(hex: "404040")  // Text tertiary
        static let gray800 = Color(hex: "2D2D2D")  // Text secondary
        static let gray900 = Color(hex: "1A1A1A")  // Text primary

        // Semantic aliases
        static let background = gray50
        static let surface = Color.white
        static let surfaceSecondary = gray100
        static let text = gray900
        static let textSecondary = gray700
        static let textTertiary = gray600
        static let textMuted = gray500
        static let border = gray300
        static let borderLight = gray200
        static let divider = gray200
    }

    // MARK: - Dark Mode Colors
    // "Warm Charcoal" palette - warm grays instead of pure black

    struct DarkMode {
        static let background = Color(hex: "1A1A2E")      // Main background
        static let surface = Color(hex: "252540")         // Cards, elevated surfaces
        static let surfaceElevated = Color(hex: "2F2F4A") // Modals, popovers

        static let text = Color(hex: "F5F5F7")            // Primary text
        static let textSecondary = Color(hex: "A0A0B0")   // Secondary text
        static let textMuted = Color(hex: "6B6B80")       // Muted/disabled text

        static let border = Color(hex: "3A3A50")          // Borders
        static let divider = Color(hex: "2A2A40")         // Dividers

        // Role colors adjusted for dark mode (slightly lighter for contrast)
        static let searcherPrimary = Color(hex: "FFB333")
        static let ownerPrimary = Color(hex: "B070A8")
        static let residentPrimary = Color(hex: "E96A50")
    }

    // MARK: - Typography
    // Fonts: Inter (body), Nunito (headings), Fredoka (brand wordmark)
    // Note: Custom fonts must be added to the project bundle and Info.plist

    struct Typography {
        // Font names (must match exactly what's in Info.plist)
        private static let interFont = "Inter"
        private static let nunitoFont = "Nunito"
        private static let fredokaFont = "Fredoka"

        // Fallback to system font if custom fonts not loaded
        private static func font(_ name: String, size: CGFloat, weight: Font.Weight) -> Font {
            if UIFont(name: "\(name)-\(weightName(weight))", size: size) != nil {
                return .custom(name, size: size).weight(weight)
            }
            return .system(size: size, weight: weight)
        }

        private static func weightName(_ weight: Font.Weight) -> String {
            switch weight {
            case .ultraLight: return "ExtraLight"
            case .thin: return "Thin"
            case .light: return "Light"
            case .regular: return "Regular"
            case .medium: return "Medium"
            case .semibold: return "SemiBold"
            case .bold: return "Bold"
            case .heavy: return "ExtraBold"
            case .black: return "Black"
            default: return "Regular"
            }
        }

        // Headings (Nunito)
        static let largeTitle = Font.custom(nunitoFont, size: 34).weight(.bold)
        static let title1 = Font.custom(nunitoFont, size: 28).weight(.bold)
        static let title2 = Font.custom(nunitoFont, size: 22).weight(.semibold)
        static let title3 = Font.custom(nunitoFont, size: 20).weight(.semibold)

        // Body (Inter)
        static let headline = Font.custom(interFont, size: 17).weight(.semibold)
        static let body = Font.custom(interFont, size: 17).weight(.regular)
        static let bodyMedium = Font.custom(interFont, size: 17).weight(.medium)
        static let callout = Font.custom(interFont, size: 16).weight(.regular)
        static let subheadline = Font.custom(interFont, size: 15).weight(.regular)
        static let footnote = Font.custom(interFont, size: 13).weight(.regular)
        static let caption = Font.custom(interFont, size: 12).weight(.regular)
        static let caption2 = Font.custom(interFont, size: 11).weight(.regular)

        // Brand wordmark (Fredoka) - ONLY for "Izzico" text
        static let brandWordmark = Font.custom(fredokaFont, size: 24).weight(.semibold)
        static let brandWordmarkLarge = Font.custom(fredokaFont, size: 32).weight(.semibold)
        static let brandWordmarkSmall = Font.custom(fredokaFont, size: 18).weight(.medium)

        // System font fallbacks (use these if custom fonts fail to load)
        struct System {
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
    }

    // MARK: - Spacing Scale (8px base)

    struct Spacing {
        static let none: CGFloat = 0
        static let xs: CGFloat = 4      // 0.5x
        static let sm: CGFloat = 8      // 1x (base)
        static let md: CGFloat = 16     // 2x
        static let lg: CGFloat = 24     // 3x
        static let xl: CGFloat = 32     // 4x
        static let xxl: CGFloat = 48    // 6x
        static let xxxl: CGFloat = 64   // 8x

        // Additional specific values
        static let spacing1: CGFloat = 4
        static let spacing2: CGFloat = 8
        static let spacing3: CGFloat = 12
        static let spacing4: CGFloat = 16
        static let spacing5: CGFloat = 20
        static let spacing6: CGFloat = 24
        static let spacing8: CGFloat = 32
        static let spacing10: CGFloat = 40
        static let spacing12: CGFloat = 48
        static let spacing16: CGFloat = 64
        static let spacing20: CGFloat = 80
        static let spacing24: CGFloat = 96
    }

    // MARK: - Corner Radius
    // Using iOS-style continuous corners (superellipse n=5)

    struct CornerRadius {
        static let none: CGFloat = 0
        static let xs: CGFloat = 4
        static let sm: CGFloat = 8
        static let md: CGFloat = 12
        static let lg: CGFloat = 16
        static let xl: CGFloat = 20
        static let xxl: CGFloat = 24
        static let xxxl: CGFloat = 28
        static let round: CGFloat = 9999  // Pill shape

        // Semantic aliases
        static let button: CGFloat = 12
        static let card: CGFloat = 24
        static let modal: CGFloat = 28
        static let input: CGFloat = 10
        static let badge: CGFloat = 20
    }

    // MARK: - Z-Index (for layering reference)
    // Note: SwiftUI uses zIndex() modifier

    struct ZIndex {
        static let dropdown: Double = 1000
        static let sticky: Double = 1020
        static let fixed: Double = 1030
        static let modalBackdrop: Double = 1040
        static let modal: Double = 1050
        static let popover: Double = 1060
        static let tooltip: Double = 1070
    }

    // MARK: - Shadows

    struct Shadows {
        // Level 1: Subtle (cards at rest)
        static let level1 = ShadowStyle(
            color: Color.black.opacity(0.06),
            radius: 3,
            x: 0,
            y: 1
        )

        // Level 2: Medium (cards on hover)
        static let level2 = ShadowStyle(
            color: Color.black.opacity(0.08),
            radius: 8,
            x: 0,
            y: 4
        )

        // Level 3: Elevated (floating elements)
        static let level3 = ShadowStyle(
            color: Color.black.opacity(0.12),
            radius: 20,
            x: 0,
            y: 10
        )

        // Level 4: Modal (modals, popovers)
        static let level4 = ShadowStyle(
            color: Color.black.opacity(0.16),
            radius: 40,
            x: 0,
            y: 20
        )

        // Role-colored shadows
        static let searcher = ShadowStyle(
            color: Searcher.shadow,
            radius: 20,
            x: 0,
            y: 4
        )

        static let owner = ShadowStyle(
            color: Owner.shadow,
            radius: 20,
            x: 0,
            y: 4
        )

        static let resident = ShadowStyle(
            color: Resident.shadow,
            radius: 20,
            x: 0,
            y: 4
        )
    }

    // MARK: - Blur Radius

    struct BlurRadius {
        static let light: CGFloat = 10
        static let medium: CGFloat = 15
        static let heavy: CGFloat = 20
        static let ultraHeavy: CGFloat = 30
    }

    // MARK: - Animation

    struct Animation {
        // Durations (matching CSS)
        static let fast: Double = 0.15      // 150ms - micro-interactions
        static let base: Double = 0.20      // 200ms - hovers, focus (DEFAULT)
        static let slow: Double = 0.30      // 300ms - modals, overlays
        static let verySlow: Double = 0.50  // 500ms - page transitions

        // Spring presets
        static let snappy = SwiftUI.Animation.spring(response: 0.3, dampingFraction: 0.7)
        static let bouncy = SwiftUI.Animation.spring(response: 0.4, dampingFraction: 0.6)
        static let smooth = SwiftUI.Animation.spring(response: 0.5, dampingFraction: 0.8)

        // Standard easing
        static let easeOut = SwiftUI.Animation.easeOut(duration: base)
        static let easeInOut = SwiftUI.Animation.easeInOut(duration: base)
    }

    // MARK: - Glassmorphism

    struct Glass {
        static let white = Color.white.opacity(0.15)
        static let whiteMedium = Color.white.opacity(0.25)
        static let whiteStrong = Color.white.opacity(0.40)
        static let border = Color.white.opacity(0.3)
        static let overlay = Color.black.opacity(0.05)
    }

    // MARK: - Sizes (Component dimensions)

    struct Size {
        static let buttonHeight: CGFloat = 48
        static let buttonHeightSmall: CGFloat = 36
        static let buttonHeightLarge: CGFloat = 56

        static let inputHeight: CGFloat = 48
        static let searchBarHeight: CGFloat = 44

        static let iconSmall: CGFloat = 16
        static let iconMedium: CGFloat = 20
        static let iconLarge: CGFloat = 24
        static let iconXLarge: CGFloat = 32

        static let touchTarget: CGFloat = 44  // Minimum touch target (Apple HIG)

        static let cardImageHeight: CGFloat = 240
        static let cardImageHeightCompact: CGFloat = 180

        static let avatarSmall: CGFloat = 32
        static let avatarMedium: CGFloat = 48
        static let avatarLarge: CGFloat = 64
        static let avatarXLarge: CGFloat = 96
    }

    // MARK: - Gradients (Legacy compatibility + new)

    struct Gradients {
        // Default primary gradient (Searcher-based for legacy compatibility)
        static let primary = LinearGradient(
            colors: [Searcher.color500, Searcher.color600],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        // Role CTA gradients (vibrant, for buttons)
        static let searcherCTA = LinearGradient(
            colors: [Searcher.color500, Searcher.color400, Searcher.color300],
            startPoint: .leading,
            endPoint: .trailing
        )

        static let ownerCTA = LinearGradient(
            colors: [Owner.color400, Owner.color500, Owner.color600],
            startPoint: .leading,
            endPoint: .trailing
        )

        static let residentCTA = LinearGradient(
            colors: [Resident.color400, Resident.color500, Resident.color600],
            startPoint: .leading,
            endPoint: .trailing
        )

        // Soft gradients (for backgrounds)
        static let searcherSoft = LinearGradient(
            colors: [Searcher.color50, Searcher.color100],
            startPoint: .top,
            endPoint: .bottom
        )

        static let ownerSoft = LinearGradient(
            colors: [Owner.color50, Owner.color100],
            startPoint: .top,
            endPoint: .bottom
        )

        static let residentSoft = LinearGradient(
            colors: [Resident.color50, Resident.color100],
            startPoint: .top,
            endPoint: .bottom
        )

        // Special purpose gradients
        static let pink = LinearGradient(
            colors: [UIAccent.dustyRose, UIAccent.dustyRoseLight],
            startPoint: .leading,
            endPoint: .trailing
        )

        static let success = Semantic.successGradient
        static let error = Semantic.errorGradient
        static let warning = Semantic.warningGradient
        static let info = Semantic.infoGradient

        // Disabled state gradient
        static let disabled = LinearGradient(
            colors: [Neutral.gray300, Neutral.gray400],
            startPoint: .leading,
            endPoint: .trailing
        )
    }

    // MARK: - Colors (Quick access aliases)

    struct Colors {
        // Primary (defaults to Owner as it's the "neutral" role)
        static let primary = Owner.primary
        static let secondary = Searcher.primary
        static let accent = Resident.primary

        // Backgrounds
        static let background = Neutral.gray50
        static let backgroundPrimary = Color.white
        static let backgroundSecondary = Neutral.gray100
        static let backgroundTertiary = Neutral.gray200

        // Text
        static let textPrimary = Neutral.gray900
        static let textSecondary = Neutral.gray700
        static let textTertiary = Neutral.gray600
        static let textMuted = Neutral.gray500

        // Semantic
        static let success = Semantic.success
        static let successLight = Semantic.successLight
        static let warning = Semantic.warning
        static let warningLight = Semantic.warningLight
        static let error = Semantic.error
        static let errorLight = Semantic.errorLight
        static let info = Semantic.info
        static let infoLight = Semantic.infoLight

        // UI Elements
        static let border = Neutral.gray300
        static let borderLight = Neutral.gray200
        static let divider = Neutral.gray200
        static let overlay = Color.black.opacity(0.5)

        // Gray scale shortcuts
        static let gray50 = Neutral.gray50
        static let gray100 = Neutral.gray100
        static let gray200 = Neutral.gray200
        static let gray300 = Neutral.gray300
        static let gray400 = Neutral.gray400
        static let gray500 = Neutral.gray500
        static let gray600 = Neutral.gray600
        static let gray700 = Neutral.gray700
        static let gray800 = Neutral.gray800
        static let gray900 = Neutral.gray900

        // Special UI colors
        static let heartRed = Semantic.error
        static let messageBlue = UIAccent.sky
        static let matchPink = UIAccent.dustyRose

        // Property status
        static let available = Semantic.success
        static let pending = Semantic.warning
        static let occupied = Semantic.error
    }
}

// MARK: - Shadow Style

struct ShadowStyle {
    let color: Color
    let radius: CGFloat
    let x: CGFloat
    let y: CGFloat
}

// MARK: - View Extensions

extension View {
    /// Apply a shadow style
    func applyShadow(_ style: ShadowStyle) -> some View {
        self.shadow(color: style.color, radius: style.radius, x: style.x, y: style.y)
    }

    /// Apply iOS-style continuous corner radius (superellipse)
    func continuousCornerRadius(_ radius: CGFloat) -> some View {
        self.clipShape(RoundedRectangle(cornerRadius: radius, style: .continuous))
    }

    /// Apply role-based gradient background
    func roleGradient(_ role: UserRole) -> some View {
        self.background(
            Group {
                switch role {
                case .searcher:
                    DesignTokens.Searcher.gradient
                case .owner:
                    DesignTokens.Owner.gradient
                case .resident:
                    DesignTokens.Resident.gradient
                case .admin:
                    DesignTokens.Owner.gradient  // Admin uses owner gradient
                }
            }
        )
    }

    /// Apply role-based colored shadow
    func roleShadow(_ role: UserRole) -> some View {
        switch role {
        case .searcher:
            return AnyView(self.applyShadow(DesignTokens.Shadows.searcher))
        case .owner:
            return AnyView(self.applyShadow(DesignTokens.Shadows.owner))
        case .resident:
            return AnyView(self.applyShadow(DesignTokens.Shadows.resident))
        case .admin:
            return AnyView(self.applyShadow(DesignTokens.Shadows.owner))  // Admin uses owner shadow
        }
    }
}

// MARK: - User Role Enum


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

    /// Get hex string from color (for debugging)
    var hexString: String {
        let components = UIColor(self).cgColor.components ?? [0, 0, 0, 1]
        let r = Int(components[0] * 255)
        let g = Int(components[1] * 255)
        let b = Int(components[2] * 255)
        return String(format: "#%02X%02X%02X", r, g, b)
    }
}

// MARK: - Convenience Color Extensions

extension Color {
    // Quick access to role colors
    static let searcherPrimary = DesignTokens.Searcher.primary
    static let ownerPrimary = DesignTokens.Owner.primary
    static let residentPrimary = DesignTokens.Resident.primary

    // Quick access to semantic colors
    static let semanticSuccess = DesignTokens.Semantic.success
    static let semanticWarning = DesignTokens.Semantic.warning
    static let semanticError = DesignTokens.Semantic.error
    static let semanticInfo = DesignTokens.Semantic.info
}
