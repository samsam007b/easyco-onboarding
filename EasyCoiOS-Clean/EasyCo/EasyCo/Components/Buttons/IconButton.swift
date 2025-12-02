//
//  IconButton.swift
//  EasyCo
//
//  Icon-only button component
//

import SwiftUI

struct IconButton: View {
    let icon: String
    let action: () -> Void
    var size: CGFloat = Theme.Size.touchTarget
    var iconSize: CGFloat = Theme.Size.iconMedium
    var color: Color = Theme.Colors.gray700
    var backgroundColor: Color = .white
    var hasShadow: Bool = true

    @State private var isPressed = false

    var body: some View {
        Button(action: {
            Haptic.impact(.light)
            action()
        }) {
            ZStack {
                Circle()
                    .fill(backgroundColor)
                    .frame(width: size, height: size)
                    .if(hasShadow) { view in
                        view.softShadow()
                    }

                Image.lucide(icon)
                    .resizable()
                    .scaledToFit()
                    .frame(width: iconSize, height: iconSize)
                    .foregroundColor(color)
            }
            .scaleEffect(isPressed ? 0.9 : 1.0)
        }
        .buttonStyle(PlainButtonStyle())
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in isPressed = true }
                .onEnded { _ in isPressed = false }
        )
        .animation(Theme.Animation.springFast, value: isPressed)
    }
}

// MARK: - Preview

struct IconButton_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 30) {
            HStack(spacing: 20) {
                IconButton(icon: "heart", action: {})

                IconButton(
                    icon: "heart",
                    action: {},
                    color: Theme.Colors.heartRed
                )

                IconButton(
                    icon: "share",
                    action: {},
                    color: Theme.Colors.primary
                )
            }

            HStack(spacing: 20) {
                IconButton(
                    icon: "xmark",
                    action: {},
                    size: 36,
                    iconSize: 16,
                    backgroundColor: Theme.Colors.gray100,
                    hasShadow: false
                )

                IconButton(
                    icon: "filter",
                    action: {},
                    size: 48,
                    iconSize: 24
                )

                IconButton(
                    icon: "settings",
                    action: {},
                    backgroundColor: Theme.Colors.primary,
                    color: .white
                )
            }
        }
        .padding()
        .background(Theme.Colors.gray50)
    }
}
