import SwiftUI
import UIKit

// MARK: - Haptic Feedback Manager

/// Manager for haptic feedback throughout the app
class HapticManager {
    static let shared = HapticManager()

    private init() {}

    // MARK: - Impact Feedback

    /// Light impact (soft tap)
    func light() {
        let generator = UIImpactFeedbackGenerator(style: .light)
        generator.impactOccurred()
    }

    /// Medium impact (standard tap)
    func medium() {
        let generator = UIImpactFeedbackGenerator(style: .medium)
        generator.impactOccurred()
    }

    /// Heavy impact (strong tap)
    func heavy() {
        let generator = UIImpactFeedbackGenerator(style: .heavy)
        generator.impactOccurred()
    }

    /// Soft impact (iOS 13+)
    func soft() {
        if #available(iOS 13.0, *) {
            let generator = UIImpactFeedbackGenerator(style: .soft)
            generator.impactOccurred()
        } else {
            light()
        }
    }

    /// Rigid impact (iOS 13+)
    func rigid() {
        if #available(iOS 13.0, *) {
            let generator = UIImpactFeedbackGenerator(style: .rigid)
            generator.impactOccurred()
        } else {
            heavy()
        }
    }

    // MARK: - Notification Feedback

    /// Success notification (✓)
    func success() {
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(.success)
    }

    /// Warning notification (!)
    func warning() {
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(.warning)
    }

    /// Error notification (✗)
    func error() {
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(.error)
    }

    // MARK: - Selection Feedback

    /// Selection changed (picker, tab switch)
    func selection() {
        let generator = UISelectionFeedbackGenerator()
        generator.selectionChanged()
    }

    // MARK: - Composite Feedback

    /// Button tap feedback
    func buttonTap() {
        soft()
    }

    /// Toggle switch feedback
    func toggle() {
        light()
    }

    /// Swipe gesture feedback
    func swipe() {
        light()
    }

    /// Long press feedback
    func longPress() {
        medium()
    }

    /// Pull to refresh feedback
    func pullToRefresh() {
        light()
    }

    /// Card dismiss feedback
    func dismiss() {
        soft()
    }

    /// Modal present feedback
    func modalPresent() {
        light()
    }

    /// Delete action feedback
    func delete() {
        rigid()
    }

    /// Like/Favorite feedback
    func like() {
        soft()
    }

    /// Share feedback
    func share() {
        medium()
    }
}

// MARK: - View Extension for Haptics

extension View {
    /// Add haptic feedback on tap
    func hapticFeedback(_ style: HapticStyle = .soft, onTap action: @escaping () -> Void) -> some View {
        self.onTapGesture {
            HapticManager.shared.trigger(style)
            action()
        }
    }

    /// Add haptic on button press
    func hapticOnPress(_ style: HapticStyle = .soft) -> some View {
        self.simultaneousGesture(
            TapGesture().onEnded { _ in
                HapticManager.shared.trigger(style)
            }
        )
    }
}

// MARK: - Haptic Style Enum

enum HapticStyle {
    case light, medium, heavy, soft, rigid
    case success, warning, error
    case selection
    case buttonTap, toggle, swipe, longPress
    case delete, like, share
}

extension HapticManager {
    func trigger(_ style: HapticStyle) {
        switch style {
        case .light: light()
        case .medium: medium()
        case .heavy: heavy()
        case .soft: soft()
        case .rigid: rigid()
        case .success: success()
        case .warning: warning()
        case .error: error()
        case .selection: selection()
        case .buttonTap: buttonTap()
        case .toggle: toggle()
        case .swipe: swipe()
        case .longPress: longPress()
        case .delete: delete()
        case .like: like()
        case .share: share()
        }
    }
}

// MARK: - Button Style with Haptic

struct HapticButtonStyle: ButtonStyle {
    let haptic: HapticStyle

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.buttonPress, value: configuration.isPressed)
            .onChange(of: configuration.isPressed) { isPressed in
                if isPressed {
                    HapticManager.shared.trigger(haptic)
                }
            }
    }
}

extension ButtonStyle where Self == HapticButtonStyle {
    static func haptic(_ style: HapticStyle = .buttonTap) -> HapticButtonStyle {
        HapticButtonStyle(haptic: style)
    }
}
