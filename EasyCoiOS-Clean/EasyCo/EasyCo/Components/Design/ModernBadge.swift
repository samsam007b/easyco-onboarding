import SwiftUI

// MARK: - Modern Badge Component

/// Reusable badge/chip component matching web app design
struct ModernBadge: View {
    let text: String
    let color: Color
    let textColor: Color
    let borderColor: Color
    let icon: String?
    let size: BadgeSize

    init(
        _ text: String,
        color: Color = Theme.GrayColors._100,
        textColor: Color = Theme.GrayColors._800,
        borderColor: Color = Theme.GrayColors._200,
        icon: String? = nil,
        size: BadgeSize = .medium
    ) {
        self.text = text
        self.color = color
        self.textColor = textColor
        self.borderColor = borderColor
        self.icon = icon
        self.size = size
    }

    var body: some View {
        HStack(spacing: Theme.Spacing._1) {
            if let icon = icon {
                Image(systemName: icon)
                    .font(.system(size: size.iconSize, weight: .medium))
            }
            Text(text)
                .font(size.font)
        }
        .foregroundColor(textColor)
        .padding(.horizontal, size.paddingHorizontal)
        .padding(.vertical, size.paddingVertical)
        .background(color)
        .cornerRadius(Theme.CornerRadius.full)
        .overlay(
            RoundedRectangle(cornerRadius: Theme.CornerRadius.full)
                .stroke(borderColor, lineWidth: 1)
        )
    }

    enum BadgeSize {
        case small
        case medium
        case large

        var font: Font {
            switch self {
            case .small: return Theme.Typography.caption(.medium)
            case .medium: return Theme.Typography.bodySmall(.medium)
            case .large: return Theme.Typography.body(.medium)
            }
        }

        var iconSize: CGFloat {
            switch self {
            case .small: return 10
            case .medium: return 12
            case .large: return 14
            }
        }

        var paddingHorizontal: CGFloat {
            switch self {
            case .small: return Theme.Spacing._2
            case .medium: return Theme.Spacing._3
            case .large: return Theme.Spacing._4
            }
        }

        var paddingVertical: CGFloat {
            switch self {
            case .small: return Theme.Spacing._1 / 2
            case .medium: return Theme.Spacing._1
            case .large: return Theme.Spacing._2
            }
        }
    }
}

// MARK: - Role Badge

struct RoleBadge: View {
    let role: UserType
    let size: ModernBadge.BadgeSize

    init(_ role: UserType, size: ModernBadge.BadgeSize = .medium) {
        self.role = role
        self.size = size
    }

    var body: some View {
        ModernBadge(
            role.displayName,
            color: backgroundColor,
            textColor: textColor,
            borderColor: borderColor,
            icon: role.icon,
            size: size
        )
    }

    private var backgroundColor: Color {
        switch role {
        case .searcher: return Theme.SearcherColors._100
        case .owner: return Theme.OwnerColors._100
        case .resident: return Theme.ResidentColors._100
        }
    }

    private var textColor: Color {
        switch role {
        case .searcher: return Theme.SearcherColors._800
        case .owner: return Theme.OwnerColors._700
        case .resident: return Theme.ResidentColors._700
        }
    }

    private var borderColor: Color {
        switch role {
        case .searcher: return Theme.SearcherColors._200
        case .owner: return Theme.OwnerColors._200
        case .resident: return Theme.ResidentColors._200
        }
    }
}

// MARK: - Semantic Status Badge

struct SemanticStatusBadge: View {
    let status: Status
    let size: ModernBadge.BadgeSize

    init(_ status: Status, size: ModernBadge.BadgeSize = .medium) {
        self.status = status
        self.size = size
    }

    var body: some View {
        ModernBadge(
            status.displayName,
            color: status.backgroundColor,
            textColor: status.textColor,
            borderColor: status.borderColor,
            icon: status.icon,
            size: size
        )
    }

    enum Status {
        case success
        case error
        case warning
        case info
        case pending
        case active
        case inactive

        var displayName: String {
            switch self {
            case .success: return "Succès"
            case .error: return "Erreur"
            case .warning: return "Attention"
            case .info: return "Info"
            case .pending: return "En attente"
            case .active: return "Actif"
            case .inactive: return "Inactif"
            }
        }

        var icon: String {
            switch self {
            case .success: return "checkmark.circle.fill"
            case .error: return "xmark.circle.fill"
            case .warning: return "exclamationmark.triangle.fill"
            case .info: return "info.circle.fill"
            case .pending: return "clock.fill"
            case .active: return "circle.fill"
            case .inactive: return "circle"
            }
        }

        var backgroundColor: Color {
            switch self {
            case .success: return Theme.SemanticColors.successBg
            case .error: return Theme.SemanticColors.errorBg
            case .warning: return Theme.SemanticColors.warningBg
            case .info: return Theme.SemanticColors.infoBg
            case .pending: return Theme.GrayColors._100
            case .active: return Theme.SemanticColors.successBg
            case .inactive: return Theme.GrayColors._100
            }
        }

        var textColor: Color {
            switch self {
            case .success: return Theme.SemanticColors.success
            case .error: return Theme.SemanticColors.error
            case .warning: return Theme.SemanticColors.warning
            case .info: return Theme.SemanticColors.info
            case .pending: return Theme.GrayColors._700
            case .active: return Theme.SemanticColors.success
            case .inactive: return Theme.GrayColors._600
            }
        }

        var borderColor: Color {
            switch self {
            case .success: return Theme.SemanticColors.success.opacity(0.3)
            case .error: return Theme.SemanticColors.error.opacity(0.3)
            case .warning: return Theme.SemanticColors.warning.opacity(0.3)
            case .info: return Theme.SemanticColors.info.opacity(0.3)
            case .pending: return Theme.GrayColors._200
            case .active: return Theme.SemanticColors.success.opacity(0.3)
            case .inactive: return Theme.GrayColors._200
            }
        }
    }
}

// MARK: - Count Badge

struct CountBadge: View {
    let count: Int
    let role: UserType?

    init(_ count: Int, role: UserType? = nil) {
        self.count = count
        self.role = role
    }

    var body: some View {
        Text("\(count)")
            .font(Theme.Typography.caption(.bold))
            .foregroundColor(.white)
            .frame(minWidth: 20, minHeight: 20)
            .padding(.horizontal, 6)
            .background(
                Group {
                    if let role = role {
                        roleColor(for: role)
                    } else {
                        Theme.SemanticColors.error
                    }
                }
            )
            .cornerRadius(Theme.CornerRadius.full)
    }

    private func roleColor(for role: UserType) -> Color {
        switch role {
        case .searcher: return Theme.SearcherColors._500
        case .owner: return Theme.OwnerColors._500
        case .resident: return Theme.ResidentColors._500
        }
    }
}

// MARK: - Previews

struct ModernBadge_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: Theme.Spacing._4) {
            // Standard badges
            HStack {
                ModernBadge("Default")
                ModernBadge("With Icon", icon: "star.fill")
                ModernBadge("Small", size: .small)
                ModernBadge("Large", size: .large)
            }

            // Role badges
            HStack {
                RoleBadge(.searcher)
                RoleBadge(.owner)
                RoleBadge(.resident)
            }

            // Semantic Status badges
            VStack(alignment: .leading, spacing: Theme.Spacing._2) {
                SemanticStatusBadge(.success)
                SemanticStatusBadge(.error)
                SemanticStatusBadge(.warning)
                SemanticStatusBadge(.info)
                SemanticStatusBadge(.pending)
                SemanticStatusBadge(.active)
                SemanticStatusBadge(.inactive)
            }

            // Count badges
            HStack {
                CountBadge(5)
                CountBadge(12, role: .owner)
                CountBadge(99, role: .searcher)
            }

            // Custom badges
            HStack {
                ModernBadge(
                    "Premium",
                    color: Theme.OwnerColors._100,
                    textColor: Theme.OwnerColors._700,
                    borderColor: Theme.OwnerColors._300,
                    icon: "crown.fill"
                )

                ModernBadge(
                    "Nouveau",
                    color: Theme.SearcherColors._100,
                    textColor: Theme.SearcherColors._700,
                    borderColor: Theme.SearcherColors._300,
                    icon: "sparkles"
                )
            }
        }
        .padding()
        .background(Theme.Colors.backgroundSecondary)
    }
}
