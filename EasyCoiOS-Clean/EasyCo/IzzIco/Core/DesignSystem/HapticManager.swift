import UIKit
import SwiftUI

// MARK: - Haptic Manager
// Centralized haptic feedback management for consistent tactile responses

class HapticManager {
    static let shared = HapticManager()

    private init() {}

    // MARK: - Impact Generators

    private let lightImpact = UIImpactFeedbackGenerator(style: .light)
    private let mediumImpact = UIImpactFeedbackGenerator(style: .medium)
    private let heavyImpact = UIImpactFeedbackGenerator(style: .heavy)
    private let softImpact: UIImpactFeedbackGenerator = {
        if #available(iOS 13.0, *) {
            return UIImpactFeedbackGenerator(style: .soft)
        } else {
            return UIImpactFeedbackGenerator(style: .light)
        }
    }()
    private let rigidImpact: UIImpactFeedbackGenerator = {
        if #available(iOS 13.0, *) {
            return UIImpactFeedbackGenerator(style: .rigid)
        } else {
            return UIImpactFeedbackGenerator(style: .medium)
        }
    }()

    private let notificationGenerator = UINotificationFeedbackGenerator()
    private let selectionGenerator = UISelectionFeedbackGenerator()

    // MARK: - Impact Feedback

    /// Light impact - For subtle interactions (e.g., button taps)
    func light() {
        lightImpact.prepare()
        lightImpact.impactOccurred()
    }

    /// Medium impact - For standard interactions (e.g., swipe actions)
    func medium() {
        mediumImpact.prepare()
        mediumImpact.impactOccurred()
    }

    /// Heavy impact - For important interactions (e.g., match found)
    func heavy() {
        heavyImpact.prepare()
        heavyImpact.impactOccurred()
    }

    /// Soft impact - For very subtle feedback
    func soft() {
        softImpact.prepare()
        softImpact.impactOccurred()
    }

    /// Rigid impact - For precise interactions
    func rigid() {
        rigidImpact.prepare()
        rigidImpact.impactOccurred()
    }

    // MARK: - Notification Feedback

    /// Success notification - For successful actions
    func success() {
        notificationGenerator.prepare()
        notificationGenerator.notificationOccurred(.success)
    }

    /// Warning notification - For warning states
    func warning() {
        notificationGenerator.prepare()
        notificationGenerator.notificationOccurred(.warning)
    }

    /// Error notification - For error states
    func error() {
        notificationGenerator.prepare()
        notificationGenerator.notificationOccurred(.error)
    }

    // MARK: - Selection Feedback

    /// Selection changed - For picker/selector interactions
    func selection() {
        selectionGenerator.prepare()
        selectionGenerator.selectionChanged()
    }

    // MARK: - Custom Patterns

    /// Double tap pattern
    func doubleTap() {
        light()
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            self.light()
        }
    }

    /// Triple tap pattern
    func tripleTap() {
        light()
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            self.light()
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                self.light()
            }
        }
    }

    /// Success pattern - Light + Success
    func successPattern() {
        light()
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            self.success()
        }
    }

    /// Error pattern - Medium + Error
    func errorPattern() {
        medium()
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            self.error()
        }
    }

    /// Match found pattern - Celebration haptic
    func matchFound() {
        medium()
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) {
            self.heavy()
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                self.success()
            }
        }
    }

    /// Swipe pattern - For card swipes
    func swipe() {
        soft()
    }

    /// Swipe complete - For completed swipe actions
    func swipeComplete() {
        rigid()
    }
}

// MARK: - Global Convenience Functions

enum HapticHelper {
    // Impact
    static func light() { HapticManager.shared.light() }
    static func medium() { HapticManager.shared.medium() }
    static func heavy() { HapticManager.shared.heavy() }
    static func soft() { HapticManager.shared.soft() }
    static func rigid() { HapticManager.shared.rigid() }

    // Notification
    static func success() { HapticManager.shared.success() }
    static func warning() { HapticManager.shared.warning() }
    static func error() { HapticManager.shared.error() }

    // Selection
    static func selection() { HapticManager.shared.selection() }

    // Patterns
    static func doubleTap() { HapticManager.shared.doubleTap() }
    static func tripleTap() { HapticManager.shared.tripleTap() }
    static func successPattern() { HapticManager.shared.successPattern() }
    static func errorPattern() { HapticManager.shared.errorPattern() }
    static func matchFound() { HapticManager.shared.matchFound() }
    static func swipe() { HapticManager.shared.swipe() }
    static func swipeComplete() { HapticManager.shared.swipeComplete() }
}

// MARK: - View Extension for Haptic Feedback

extension View {
    /// Add haptic feedback on tap
    func hapticOnTap(_ haptic: HapticStyle = .light) -> some View {
        self.simultaneousGesture(
            TapGesture()
                .onEnded { _ in
                    switch haptic {
                    case .light: HapticHelper.light()
                    case .medium: HapticHelper.medium()
                    case .heavy: HapticHelper.heavy()
                    case .soft: HapticHelper.soft()
                    case .rigid: HapticHelper.rigid()
                    case .selection: HapticHelper.selection()
                    case .success: HapticHelper.success()
                    case .warning: HapticHelper.warning()
                    case .error: HapticHelper.error()
                    }
                }
        )
    }
}

// MARK: - Haptic Style Enum

enum HapticStyle {
    case light
    case medium
    case heavy
    case soft
    case rigid
    case selection
    case success
    case warning
    case error
}

// MARK: - Button Haptic Modifier

struct ButtonHapticModifier: ViewModifier {
    let action: () -> Void
    let haptic: HapticStyle

    func body(content: Content) -> some View {
        Button(action: {
            // Trigger haptic
            switch haptic {
            case .light: HapticHelper.light()
            case .medium: HapticHelper.medium()
            case .heavy: HapticHelper.heavy()
            case .soft: HapticHelper.soft()
            case .rigid: HapticHelper.rigid()
            case .selection: HapticHelper.selection()
            case .success: HapticHelper.success()
            case .warning: HapticHelper.warning()
            case .error: HapticHelper.error()
            }
            // Execute action
            action()
        }) {
            content
        }
    }
}

extension View {
    /// Convert any view to a button with haptic feedback
    func asButton(action: @escaping () -> Void, haptic: HapticStyle = .light) -> some View {
        self.modifier(ButtonHapticModifier(action: action, haptic: haptic))
    }
}
