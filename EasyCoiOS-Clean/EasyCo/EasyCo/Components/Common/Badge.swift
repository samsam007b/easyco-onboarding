//
//  Badge.swift
//  EasyCo
//
//  Badge component for labels and status
//

import SwiftUI

enum BadgeStyle {
    case success
    case warning
    case error
    case info
    case new
    case verified
    case custom(backgroundColor: Color, textColor: Color)

    var backgroundColor: Color {
        switch self {
        case .success:
            return Theme.Colors.successLight
        case .warning:
            return Theme.Colors.warningLight
        case .error:
            return Theme.Colors.errorLight
        case .info:
            return Theme.Colors.infoLight
        case .new:
            return Theme.Colors.primary
        case .verified:
            return Theme.Colors.success
        case .custom(let backgroundColor, _):
            return backgroundColor
        }
    }

    var textColor: Color {
        switch self {
        case .success:
            return Theme.Colors.success
        case .warning:
            return Color(hex: "92400E") // Dark yellow
        case .error:
            return Theme.Colors.error
        case .info:
            return Theme.Colors.info
        case .new, .verified:
            return .white
        case .custom(_, let textColor):
            return textColor
        }
    }
}

struct Badge: View {
    let text: String
    var style: BadgeStyle = .new
    var icon: String? = nil

    var body: some View {
        HStack(spacing: 4) {
            if let icon = icon {
                Image.lucide(icon)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 12, height: 12)
            }

            Text(text)
                .font(Theme.Typography.badge())
                .textCase(.uppercase)
        }
        .foregroundColor(style.textColor)
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(style.backgroundColor)
        .cornerRadius(8)
    }
}

// MARK: - Preview

struct Badge_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 16) {
            HStack(spacing: 12) {
                Badge(text: "Nouveau", style: .new)
                Badge(text: "Vérifié", style: .verified, icon: "check")
            }

            HStack(spacing: 12) {
                Badge(text: "Disponible", style: .success)
                Badge(text: "En attente", style: .warning)
                Badge(text: "Complet", style: .error)
            }

            HStack(spacing: 12) {
                Badge(text: "Info", style: .info)
                Badge(
                    text: "Custom",
                    style: .custom(
                        backgroundColor: Theme.Colors.secondary.opacity(0.2),
                        textColor: Theme.Colors.secondary
                    )
                )
            }

            // Badge avec gradient background
            HStack(spacing: 4) {
                Circle()
                    .fill(Color.green)
                    .frame(width: 6, height: 6)

                Text("85% Compatible")
                    .font(Theme.Typography.badge())
            }
            .foregroundColor(.white)
            .padding(.horizontal, 10)
            .padding(.vertical, 5)
            .background(Theme.Colors.primaryGradient)
            .cornerRadius(12)
        }
        .padding()
    }
}
