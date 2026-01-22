//
//  SecondaryButton.swift
//  IzzIco
//
//  Secondary button component with border style
//  Migrated to DesignTokens v3.3 on 2026-01-22
//

import SwiftUI

struct SecondaryButton: View {
    let title: String
    let icon: String?
    let action: () -> Void
    var isDisabled: Bool = false
    var fullWidth: Bool = true
    var color: Color = DesignTokens.Colors.primary
    var role: UserRole? = nil  // Optional: use role-specific color

    @State private var isPressed = false

    private var effectiveColor: Color {
        if let role = role {
            return role.primaryColor
        }
        return color
    }

    var body: some View {
        Button(action: {
            if !isDisabled {
                Haptic.impact(.light)
                action()
            }
        }) {
            HStack(spacing: 10) {
                if let icon = icon {
                    Image.lucide(icon)
                        .resizable()
                        .scaledToFit()
                        .frame(width: DesignTokens.Size.iconMedium, height: DesignTokens.Size.iconMedium)
                        .foregroundColor(isDisabled ? DesignTokens.Colors.gray400 : effectiveColor)
                }

                Text(title)
                    .font(DesignTokens.Typography.headline)
                    .foregroundColor(isDisabled ? DesignTokens.Colors.gray400 : effectiveColor)
            }
            .frame(maxWidth: fullWidth ? .infinity : nil)
            .frame(height: DesignTokens.Size.buttonHeight)
            .background(DesignTokens.Colors.backgroundPrimary)
            .overlay(
                RoundedRectangle(cornerRadius: DesignTokens.CornerRadius.button, style: .continuous)
                    .stroke(isDisabled ? DesignTokens.Colors.gray300 : effectiveColor, lineWidth: 2)
            )
            .continuousCornerRadius(DesignTokens.CornerRadius.button)
            .opacity(isPressed ? 0.7 : 1.0)
            .scaleEffect(isPressed ? 0.98 : 1.0)
        }
        .disabled(isDisabled)
        .buttonStyle(PlainButtonStyle())
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in
                    if !isDisabled {
                        isPressed = true
                    }
                }
                .onEnded { _ in
                    isPressed = false
                }
        )
        .animation(DesignTokens.Animation.snappy, value: isPressed)
    }
}

// MARK: - Convenience Initializers

extension SecondaryButton {
    /// Create a role-themed secondary button
    init(
        title: String,
        icon: String? = nil,
        role: UserRole,
        isDisabled: Bool = false,
        fullWidth: Bool = true,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.icon = icon
        self.action = action
        self.isDisabled = isDisabled
        self.fullWidth = fullWidth
        self.color = DesignTokens.Colors.primary
        self.role = role
    }
}

// MARK: - Preview

struct SecondaryButton_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 20) {
            SecondaryButton(title: "Annuler", icon: nil, action: {})

            SecondaryButton(title: "Modifier", icon: "edit", action: {})

            SecondaryButton(title: "Desactive", icon: nil, action: {}, isDisabled: true)

            // Role-specific buttons
            SecondaryButton(title: "Rechercher", icon: "search", role: .searcher, action: {})

            SecondaryButton(title: "Gerer", icon: "settings", role: .owner, action: {})

            SecondaryButton(title: "Partager", icon: "share", role: .resident, action: {})

            SecondaryButton(
                title: "Supprimer",
                icon: "trash",
                action: {},
                color: DesignTokens.Colors.error
            )

            SecondaryButton(
                title: "Compact",
                icon: "filter",
                action: {},
                fullWidth: false
            )
        }
        .padding()
    }
}
