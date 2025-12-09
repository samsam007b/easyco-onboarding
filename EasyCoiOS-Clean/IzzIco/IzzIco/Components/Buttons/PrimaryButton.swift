//
//  PrimaryButton.swift
//  IzzIco
//
//  Primary button component with gradient background
//

import SwiftUI

struct PrimaryButton: View {
    let title: String
    let icon: String?
    let action: () -> Void
    var isLoading: Bool = false
    var isDisabled: Bool = false
    var fullWidth: Bool = true
    var gradient: LinearGradient = Theme.Colors.primaryGradient

    @State private var isPressed = false

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
                        .frame(width: Theme.Size.iconMedium, height: Theme.Size.iconMedium)
                        .foregroundColor(.white)
                }

                Text(isLoading ? "Chargement..." : title)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(.white)
            }
            .frame(maxWidth: fullWidth ? .infinity : nil)
            .frame(height: Theme.Size.buttonHeight)
            .background(
                Group {
                    if isDisabled {
                        LinearGradient(
                            colors: [Theme.Colors.gray300, Theme.Colors.gray400],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    } else {
                        gradient
                    }
                }
            )
            .cornerRadius(Theme.CornerRadius.button)
            .opacity(isDisabled ? 0.6 : (isPressed ? 0.9 : 1.0))
            .scaleEffect(isPressed ? 0.97 : 1.0)
            .buttonShadow()
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
        .animation(Theme.Animation.springFast, value: isPressed)
    }
}

// MARK: - Preview

struct PrimaryButton_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 20) {
            PrimaryButton(title: "Postuler", icon: nil, action: {})

            PrimaryButton(title: "Envoyer", icon: "send", action: {})

            PrimaryButton(title: "En cours...", icon: nil, action: {}, isLoading: true)

            PrimaryButton(title: "Désactivé", icon: nil, action: {}, isDisabled: true)

            PrimaryButton(
                title: "Match",
                icon: "heart",
                action: {},
                gradient: Theme.Gradients.pinkGradient
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
