import SwiftUI

// MARK: - Custom Icons System
// Based on EasyCo Design System with 3 styling approaches

/// Icon style variants matching the design system
enum IconStyle {
    case muted      // Style 1: Terne (subtle, gray)
    case vivid      // Style 2: Vif (bright, colorful)
    case gradient   // Style 3: Gradient (signature EasyCo style)
}

/// Custom icon component that matches design system styles
struct CustomIcon: View {
    let systemName: String
    let style: IconStyle
    let color: Color
    let size: CGFloat

    init(_ systemName: String, style: IconStyle = .vivid, color: Color = Color(hex: "FFA040"), size: CGFloat = 20) {
        self.systemName = systemName
        self.style = style
        self.color = color
        self.size = size
    }

    var body: some View {
        Image(systemName: systemName)
            .font(.system(size: size, weight: .semibold))
            .foregroundColor(iconColor)
    }

    private var iconColor: Color {
        switch style {
        case .muted:
            return Color(hex: "9CA3AF") // slate-400
        case .vivid:
            return color
        case .gradient:
            return .white
        }
    }
}

/// Icon container with background matching design system styles
struct IconContainer: View {
    let systemName: String
    let style: IconStyle
    let color: Color
    let size: CGFloat
    let containerSize: CGFloat

    init(_ systemName: String, style: IconStyle = .vivid, color: Color = Color(hex: "FFA040"), size: CGFloat = 20, containerSize: CGFloat = 40) {
        self.systemName = systemName
        self.style = style
        self.color = color
        self.size = size
        self.containerSize = containerSize
    }

    var body: some View {
        ZStack {
            containerBackground

            Image(systemName: systemName)
                .font(.system(size: size, weight: .semibold))
                .foregroundColor(iconColor)
        }
        .frame(width: containerSize, height: containerSize)
        .cornerRadius(containerSize / 4)
    }

    @ViewBuilder
    private var containerBackground: some View {
        switch style {
        case .muted:
            Color(hex: "F3F4F6") // gray-100
        case .vivid:
            color.opacity(0.15)
        case .gradient:
            LinearGradient(
                colors: [
                    color.opacity(0.3),
                    color.adjustBrightness(by: -0.1).opacity(0.3)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .overlay(
                RoundedRectangle(cornerRadius: containerSize / 4)
                    .stroke(color.opacity(0.2), lineWidth: 1)
            )
        }
    }

    private var iconColor: Color {
        switch style {
        case .muted:
            return Color(hex: "9CA3AF") // gray-400
        case .vivid:
            return color
        case .gradient:
            return .white
        }
    }
}

// MARK: - Icon Mappings (Design System → SF Symbols)

enum AppIcon {
    // Navigation
    case home
    case search
    case menu
    case chevronLeft
    case chevronRight
    case arrowRight
    case externalLink

    // Users
    case user
    case users
    case crown
    case baby
    case accessibility

    // Property
    case building
    case building2
    case houseIcon
    case bed
    case bath
    case key

    // Actions
    case plus
    case minus
    case xmark
    case check
    case edit
    case trash
    case copy
    case download

    // Security
    case shield
    case shieldCheck
    case lock
    case unlock
    case eye
    case eyeOff
    case fingerprint

    // Communication
    case message
    case mail
    case phone
    case bell
    case bellBadge

    // Finance
    case euro
    case creditCard
    case chartBar
    case scale

    // Property Features
    case sparkles
    case heart
    case heartFill
    case bookmark
    case bookmarkFill
    case calendar
    case clock
    case mapPin
    case star
    case starFill

    // Settings & Tools
    case settings
    case gear
    case sliders
    case wrench
    case hammer
    case toggleLeft

    // Other
    case checkList
    case doc
    case folder
    case image
    case video
    case megaphone
    case layers

    var sfSymbol: String {
        switch self {
        // Navigation
        case .home: return "house.fill"
        case .search: return "magnifyingglass"
        case .menu: return "line.3.horizontal"
        case .chevronLeft: return "chevron.left"
        case .chevronRight: return "chevron.right"
        case .arrowRight: return "arrow.right"
        case .externalLink: return "arrow.up.right.square"

        // Users
        case .user: return "person.fill"
        case .users: return "person.3.fill"
        case .crown: return "crown.fill"
        case .baby: return "figure.child"
        case .accessibility: return "accessibility.fill"

        // Property
        case .building: return "building.fill"
        case .building2: return "building.2.fill"
        case .houseIcon: return "house.fill"
        case .bed: return "bed.double.fill"
        case .bath: return "shower.fill"
        case .key: return "key.fill"

        // Actions
        case .plus: return "plus"
        case .minus: return "minus"
        case .xmark: return "xmark"
        case .check: return "checkmark"
        case .edit: return "pencil"
        case .trash: return "trash.fill"
        case .copy: return "doc.on.doc.fill"
        case .download: return "arrow.down.circle.fill"

        // Security
        case .shield: return "shield.fill"
        case .shieldCheck: return "shield.checkered"
        case .lock: return "lock.fill"
        case .unlock: return "lock.open.fill"
        case .eye: return "eye.fill"
        case .eyeOff: return "eye.slash.fill"
        case .fingerprint: return "touchid"

        // Communication
        case .message: return "message.fill"
        case .mail: return "envelope.fill"
        case .phone: return "phone.fill"
        case .bell: return "bell.fill"
        case .bellBadge: return "bell.badge.fill"

        // Finance
        case .euro: return "eurosign.circle.fill"
        case .creditCard: return "creditcard.fill"
        case .chartBar: return "chart.bar.fill"
        case .scale: return "scale.3d"

        // Property Features
        case .sparkles: return "sparkles"
        case .heart: return "heart"
        case .heartFill: return "heart.fill"
        case .bookmark: return "bookmark"
        case .bookmarkFill: return "bookmark.fill"
        case .calendar: return "calendar"
        case .clock: return "clock.fill"
        case .mapPin: return "mappin.circle.fill"
        case .star: return "star"
        case .starFill: return "star.fill"

        // Settings & Tools
        case .settings: return "gearshape.fill"
        case .gear: return "gear"
        case .sliders: return "slider.horizontal.3"
        case .wrench: return "wrench.and.screwdriver.fill"
        case .hammer: return "hammer.fill"
        case .toggleLeft: return "togglepower"

        // Other
        case .checkList: return "checklist"
        case .doc: return "doc.text.fill"
        case .folder: return "folder.fill"
        case .image: return "photo.fill"
        case .video: return "video.fill"
        case .megaphone: return "megaphone.fill"
        case .layers: return "square.stack.3d.up.fill"
        }
    }
}

// MARK: - Predefined Color Mappings

extension Color {
    static let iconColors = IconColors()

    struct IconColors {
        // Primary brand colors
        let orange = Color(hex: "FFA040")
        let purple = Color(hex: "6E56CF")

        // Semantic colors
        let success = Color(hex: "10B981")
        let error = Color(hex: "EF4444")
        let warning = Color(hex: "F59E0B")
        let info = Color(hex: "3B82F6")

        // User types
        let user = Color(hex: "FFA040")      // Orange
        let owner = Color(hex: "6E56CF")     // Purple
        let resident = Color(hex: "3B82F6")  // Blue

        // Features
        let property = Color(hex: "10B981")  // Green
        let message = Color(hex: "3B82F6")   // Blue
        let finance = Color(hex: "F59E0B")   // Amber
        let security = Color(hex: "EF4444")  // Red
    }
}

// MARK: - Convenience Extensions

extension Color {
    func adjustBrightness(by amount: CGFloat) -> Color {
        var red: CGFloat = 0
        var green: CGFloat = 0
        var blue: CGFloat = 0
        var alpha: CGFloat = 0

        #if canImport(UIKit)
        UIColor(self).getRed(&red, green: &green, blue: &blue, alpha: &alpha)
        #endif

        return Color(
            red: min(max(red + amount, 0), 1),
            green: min(max(green + amount, 0), 1),
            blue: min(max(blue + amount, 0), 1),
            opacity: alpha
        )
    }
}

// MARK: - Preview

struct CustomIcons_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Muted Style
                VStack(alignment: .leading, spacing: 12) {
                    Text("Style 1: Muted")
                        .font(.headline)

                    HStack(spacing: 16) {
                        IconContainer(.user, style: .muted, color: .iconColors.user)
                        IconContainer(.settings, style: .muted, color: .iconColors.info)
                        IconContainer(.bell, style: .muted, color: .iconColors.warning)
                        IconContainer(.shield, style: .muted, color: .iconColors.error)
                    }
                }

                // Vivid Style
                VStack(alignment: .leading, spacing: 12) {
                    Text("Style 2: Vivid")
                        .font(.headline)

                    HStack(spacing: 16) {
                        IconContainer(.user, style: .vivid, color: .iconColors.orange)
                        IconContainer(.settings, style: .vivid, color: .iconColors.purple)
                        IconContainer(.bell, style: .vivid, color: .iconColors.info)
                        IconContainer(.shield, style: .vivid, color: .iconColors.error)
                    }
                }

                // Gradient Style
                VStack(alignment: .leading, spacing: 12) {
                    Text("Style 3: Gradient")
                        .font(.headline)

                    HStack(spacing: 16) {
                        IconContainer(.user, style: .gradient, color: .iconColors.orange)
                        IconContainer(.settings, style: .gradient, color: .iconColors.purple)
                        IconContainer(.bell, style: .gradient, color: .iconColors.info)
                        IconContainer(.shield, style: .gradient, color: .iconColors.error)
                    }
                }

                // All icons grid
                VStack(alignment: .leading, spacing: 12) {
                    Text("All Icons (Vivid)")
                        .font(.headline)

                    LazyVGrid(columns: [GridItem(.adaptive(minimum: 50))], spacing: 16) {
                        ForEach([
                            (AppIcon.home, Color.iconColors.orange),
                            (AppIcon.search, Color.iconColors.purple),
                            (AppIcon.user, Color.iconColors.user),
                            (AppIcon.building, Color.iconColors.property),
                            (AppIcon.message, Color.iconColors.message),
                            (AppIcon.euro, Color.iconColors.finance),
                            (AppIcon.heart, Color.iconColors.error),
                            (AppIcon.star, Color.iconColors.warning),
                        ], id: \.0.sfSymbol) { icon, color in
                            IconContainer(icon.sfSymbol, style: .vivid, color: color, size: 20, containerSize: 48)
                        }
                    }
                }
            }
            .padding()
        }
        .background(Color(hex: "F9FAFB"))
    }
}
