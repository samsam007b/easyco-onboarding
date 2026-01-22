//
//  PrimaryButton.swift
//  IzzIco
//
//  Primary button component with gradient background
//  Migrated to DesignTokens v3.3 on 2026-01-22
//

import SwiftUI

struct PrimaryButton: View {
    let title: String
    let icon: String?
    let action: () -> Void
    var isLoading: Bool = false
    var isDisabled: Bool = false
    var fullWidth: Bool = true
    var gradient: LinearGradient = DesignTokens.Gradients.primary
    var role: UserRole? = nil  // Optional: use role-specific gradient

    @State private var isPressed = false

    private var effectiveGradient: LinearGradient {
        if let role = role {
            return role.gradient
        }
        return gradient
    }

    var body: some View {
        Button(action: {
            if !isDisabled && !isLoading {
                Haptic.impact(.medium)
                action()
            }
        }) {
            HStack(spacing: 10) {
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        .scaleEffect(0.9)
                } else if let icon = icon {
                    Image.lucide(icon)
                        .resizable()
                        .scaledToFit()
                        .frame(width: DesignTokens.Size.iconMedium, height: DesignTokens.Size.iconMedium)
                        .foregroundColor(.white)
                }

                Text(isLoading ? "Chargement..." : title)
                    .font(DesignTokens.Typography.headline)
                    .foregroundColor(.white)
            }
            .frame(maxWidth: fullWidth ? .infinity : nil)
            .frame(height: DesignTokens.Size.buttonHeight)
            .background(
                Group {
                    if isDisabled {
                        DesignTokens.Gradients.disabled
                    } else {
                        effectiveGradient
                    }
                }
            )
            .continuousCornerRadius(DesignTokens.CornerRadius.button)
            .opacity(isDisabled ? 0.6 : (isPressed ? 0.9 : 1.0))
            .scaleEffect(isPressed ? 0.97 : 1.0)
            .applyShadow(DesignTokens.Shadows.level2)
        }
        .disabled(isDisabled || isLoading)
        .buttonStyle(PlainButtonStyle())
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in
                    if !isDisabled && !isLoading {
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

extension PrimaryButton {
    /// Create a role-themed button (uses role gradient automatically)
    init(
        title: String,
        icon: String? = nil,
        role: UserRole,
        isLoading: Bool = false,
        isDisabled: Bool = false,
        fullWidth: Bool = true,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.icon = icon
        self.action = action
        self.isLoading = isLoading
        self.isDisabled = isDisabled
        self.fullWidth = fullWidth
        self.gradient = DesignTokens.Gradients.primary
        self.role = role
    }
}

// MARK: - Preview

struct PrimaryButton_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 20) {
            PrimaryButton(title: "Postuler", icon: nil, action: {})

            PrimaryButton(title: "Envoyer", icon: "send", action: {})

            PrimaryButton(title: "En cours...", icon: nil, action: {}, isLoading: true)

            PrimaryButton(title: "Desactive", icon: nil, action: {}, isDisabled: true)

            // Role-specific buttons
            PrimaryButton(title: "Chercher", icon: "search", role: .searcher, action: {})

            PrimaryButton(title: "Proprietes", icon: "home", role: .owner, action: {})

            PrimaryButton(title: "Mon Hub", icon: "users", role: .resident, action: {})

            PrimaryButton(
                title: "Match",
                icon: "heart",
                action: {},
                gradient: DesignTokens.Gradients.pink
            )

            PrimaryButton(
                title: "Compact",
                icon: "plus",
                action: {},
                fullWidth: false
            )
        }
        .padding()
    }
}
