//
//  SecondaryButton.swift
//  IzzIco
//
//  Secondary button component with border style
//

import SwiftUI

struct SecondaryButton: View {
    let title: String
    let icon: String?
    let action: () -> Void
    var isDisabled: Bool = false
    var fullWidth: Bool = true
    var color: Color = Theme.Colors.primary

    @State private var isPressed = false

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
                        .frame(width: Theme.Size.iconMedium, height: Theme.Size.iconMedium)
                        .foregroundColor(isDisabled ? Theme.Colors.gray400 : color)
                }

                Text(title)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(isDisabled ? Theme.Colors.gray400 : color)
            }
            .frame(maxWidth: fullWidth ? .infinity : nil)
            .frame(height: Theme.Size.buttonHeight)
            .background(Theme.Colors.backgroundPrimary)
            .overlay(
                RoundedRectangle(cornerRadius: Theme.CornerRadius.button)
                    .stroke(isDisabled ? Theme.Colors.gray300 : color, lineWidth: 2)
            )
            .cornerRadius(Theme.CornerRadius.button)
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
        .animation(Theme.Animation.springFast, value: isPressed)
    }
}

// MARK: - Preview

struct SecondaryButton_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 20) {
            SecondaryButton(title: "Annuler", icon: nil, action: {})

            SecondaryButton(title: "Modifier", icon: "edit", action: {})

            SecondaryButton(title: "Désactivé", icon: nil, action: {}, isDisabled: true)

            SecondaryButton(
                title: "Supprimer",
                icon: "trash",
                action: {},
                color: Theme.Colors.error
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
