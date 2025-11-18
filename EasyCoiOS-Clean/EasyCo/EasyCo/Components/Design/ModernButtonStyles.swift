import SwiftUI

// MARK: - Modern Button Styles (Web App Aligned)

/// Primary button style with gradient and capsule shape - matches web app
struct PrimaryButtonStyle: ButtonStyle {
    let gradient: [Color]

    init(gradient: [Color] = [Color(hex: "FFA040"), Color(hex: "FFB85C")]) {
        self.gradient = gradient
    }

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 16, weight: .semibold))
            .foregroundColor(.white)
            .padding(.horizontal, 32)
            .padding(.vertical, 16)
            .background(
                LinearGradient(
                    colors: gradient,
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
            .clipShape(Capsule())
            .shadow(
                color: gradient.first?.opacity(0.3) ?? Color.black.opacity(0.3),
                radius: 12,
                x: 0,
                y: 4
            )
            .scaleEffect(configuration.isPressed ? 0.96 : 1.0)
            .animation(.spring(response: 0.3), value: configuration.isPressed)
    }
}

/// Secondary button style - outlined with capsule shape
struct SecondaryButtonStyle: ButtonStyle {
    let color: Color

    init(color: Color = Color(hex: "6E56CF")) {
        self.color = color
    }

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 16, weight: .semibold))
            .foregroundColor(color)
            .padding(.horizontal, 32)
            .padding(.vertical, 16)
            .background(Color.white)
            .overlay(
                Capsule()
                    .stroke(color, lineWidth: 2)
            )
            .clipShape(Capsule())
            .shadow(
                color: Color.black.opacity(0.08),
                radius: 8,
                x: 0,
                y: 2
            )
            .scaleEffect(configuration.isPressed ? 0.96 : 1.0)
            .animation(.spring(response: 0.3), value: configuration.isPressed)
    }
}

/// Chip/Tag button style - small capsule
struct ChipButtonStyle: ButtonStyle {
    let isSelected: Bool
    let accentColor: Color

    init(isSelected: Bool = false, accentColor: Color = Color(hex: "FFA040")) {
        self.isSelected = isSelected
        self.accentColor = accentColor
    }

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 14, weight: .medium))
            .foregroundColor(isSelected ? .white : Color(hex: "374151"))
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(
                isSelected
                    ? LinearGradient(
                        colors: [accentColor, accentColor.opacity(0.8)],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                    : LinearGradient(
                        colors: [Color(hex: "F3F4F6"), Color(hex: "F3F4F6")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
            )
            .clipShape(Capsule())
            .shadow(
                color: isSelected ? accentColor.opacity(0.3) : Color.black.opacity(0.05),
                radius: isSelected ? 8 : 4,
                x: 0,
                y: 2
            )
            .scaleEffect(configuration.isPressed ? 0.94 : 1.0)
            .animation(.spring(response: 0.25), value: configuration.isPressed)
    }
}

// MARK: - Convenience Extensions

extension Button {
    /// Apply primary button style with default gradient
    func primaryButton(gradient: [Color] = [Color(hex: "FFA040"), Color(hex: "FFB85C")]) -> some View {
        self.buttonStyle(PrimaryButtonStyle(gradient: gradient))
    }

    /// Apply secondary button style
    func secondaryButton(color: Color = Color(hex: "6E56CF")) -> some View {
        self.buttonStyle(SecondaryButtonStyle(color: color))
    }

    /// Apply chip/tag button style
    func chipButton(isSelected: Bool = false, accentColor: Color = Color(hex: "FFA040")) -> some View {
        self.buttonStyle(ChipButtonStyle(isSelected: isSelected, accentColor: accentColor))
    }
}

// MARK: - Role-specific Gradients

extension Array where Element == Color {
    static let searcherGradient = [Color(hex: "FFA040"), Color(hex: "FFB85C"), Color(hex: "FFD080")]
    static let ownerGradient = [Color(hex: "7B5FB8"), Color(hex: "A67BB8"), Color(hex: "C98B9E")]
    static let residentGradient = [Color(hex: "D97B6F"), Color(hex: "E8865D"), Color(hex: "FF8C4B")]
}
