import SwiftUI
import UIKit

// MARK: - Haptic Feedback Extensions
// Note: HapticManager is now defined in Core/DesignSystem/HapticManager.swift

// MARK: - View Extension for Haptics

extension View {
    /// Add haptic feedback on tap
    func hapticFeedback(onTap action: @escaping () -> Void) -> some View {
        self.onTapGesture {
            HapticManager.shared.light()
            action()
        }
    }

    /// Add haptic on button press
    func hapticOnPress() -> some View {
        self.simultaneousGesture(
            TapGesture().onEnded { _ in
                HapticManager.shared.light()
            }
        )
    }
}

// MARK: - Button Style with Haptic

struct HapticButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.spring(response: 0.3, dampingFraction: 0.7), value: configuration.isPressed)
            .onChange(of: configuration.isPressed) { isPressed in
                if isPressed {
                    HapticManager.shared.light()
                }
            }
    }
}

extension ButtonStyle where Self == HapticButtonStyle {
    static var haptic: HapticButtonStyle {
        HapticButtonStyle()
    }
}
