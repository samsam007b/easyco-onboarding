import SwiftUI

// MARK: - Custom Button

struct CustomButton: View {
    let title: String
    let icon: String?
    let style: ButtonStyle
    let isLoading: Bool
    let action: () -> Void

    init(
        _ title: String,
        icon: String? = nil,
        style: ButtonStyle = .primary,
        isLoading: Bool = false,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.icon = icon
        self.style = style
        self.isLoading = isLoading
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            HStack(spacing: Theme.Spacing.sm) {
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: style.foregroundColor))
                } else {
                    if let icon = icon {
                        Image(systemName: icon)
                    }
                    Text(title)
                }
            }
            .font(Theme.Typography.body(.semibold))
            .foregroundColor(style.foregroundColor)
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(style.backgroundColor)
            .cornerRadius(Theme.CornerRadius.md)
            .overlay(
                RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                    .stroke(style.borderColor, lineWidth: style.borderWidth)
            )
        }
        .disabled(isLoading)
        .opacity(isLoading ? 0.7 : 1.0)
    }

    enum ButtonStyle {
        case primary
        case secondary
        case outline
        case destructive
        case ghost

        var backgroundColor: Color {
            switch self {
            case .primary: return Theme.Colors.primary
            case .secondary: return Theme.Colors.secondary
            case .outline: return .clear
            case .destructive: return Theme.Colors.error
            case .ghost: return .clear
            }
        }

        var foregroundColor: Color {
            switch self {
            case .primary, .secondary, .destructive: return .white
            case .outline: return Theme.Colors.primary
            case .ghost: return Theme.Colors.textPrimary
            }
        }

        var borderColor: Color {
            switch self {
            case .outline: return Theme.Colors.primary
            default: return .clear
            }
        }

        var borderWidth: CGFloat {
            switch self {
            case .outline: return 2
            default: return 0
            }
        }
    }
}

// MARK: - Preview

#Preview {
    VStack(spacing: Theme.Spacing.md) {
        CustomButton("Connexion", icon: "arrow.right", style: .primary) {}
        CustomButton("Annuler", style: .outline) {}
        CustomButton("Supprimer", icon: "trash", style: .destructive) {}
        CustomButton("Chargement...", style: .primary, isLoading: true) {}
    }
    .padding()
}
