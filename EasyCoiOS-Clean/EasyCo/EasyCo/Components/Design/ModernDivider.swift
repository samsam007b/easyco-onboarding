import SwiftUI

// MARK: - Modern Divider Component

/// Reusable divider component matching web app design
struct ModernDivider: View {
    let color: Color
    let thickness: CGFloat
    let padding: CGFloat

    init(
        color: Color = Theme.Colors.divider,
        thickness: CGFloat = 1,
        padding: CGFloat = 0
    ) {
        self.color = color
        self.thickness = thickness
        self.padding = padding
    }

    var body: some View {
        Rectangle()
            .fill(color)
            .frame(height: thickness)
            .padding(.horizontal, padding)
    }
}

// MARK: - Section Divider (with text)

struct SectionDivider: View {
    let text: String
    let color: Color

    init(_ text: String, color: Color = Theme.GrayColors._400) {
        self.text = text
        self.color = color
    }

    var body: some View {
        HStack(spacing: Theme.Spacing._3) {
            Rectangle()
                .fill(color)
                .frame(height: 1)

            Text(text)
                .font(Theme.Typography.bodySmall(.medium))
                .foregroundColor(color)

            Rectangle()
                .fill(color)
                .frame(height: 1)
        }
    }
}

// MARK: - Gradient Divider

struct GradientDivider: View {
    let role: UserType

    init(role: UserType) {
        self.role = role
    }

    var body: some View {
        Rectangle()
            .fill(Theme.Gradients.forRole(role))
            .frame(height: 2)
    }
}

// MARK: - Vertical Divider

struct VerticalDivider: View {
    let color: Color
    let thickness: CGFloat
    let height: CGFloat?

    init(
        height: CGFloat? = nil,
        color: Color = Theme.Colors.divider,
        thickness: CGFloat = 1
    ) {
        self.height = height
        self.color = color
        self.thickness = thickness
    }

    var body: some View {
        Rectangle()
            .fill(color)
            .frame(width: thickness)
            .if(height != nil) { view in
                view.frame(height: height!)
            }
    }
}

// MARK: - Previews

struct ModernDivider_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: Theme.Spacing._6) {
            // Standard divider
            VStack(spacing: Theme.Spacing._2) {
                Text("Before divider")
                ModernDivider()
                Text("After divider")
            }

            // Thick divider
            VStack(spacing: Theme.Spacing._2) {
                Text("Before thick divider")
                ModernDivider(thickness: 2)
                Text("After thick divider")
            }

            // Colored divider
            VStack(spacing: Theme.Spacing._2) {
                Text("Before colored divider")
                ModernDivider(color: Theme.OwnerColors._300)
                Text("After colored divider")
            }

            // Section divider with text
            SectionDivider("OR")

            // Gradient dividers
            VStack(spacing: Theme.Spacing._2) {
                GradientDivider(role: .searcher)
                GradientDivider(role: .owner)
                GradientDivider(role: .resident)
            }

            // Vertical dividers
            HStack(spacing: Theme.Spacing._4) {
                Text("Left")
                VerticalDivider(height: 40)
                Text("Middle")
                VerticalDivider(height: 40, thickness: 2)
                Text("Right")
            }
        }
        .padding()
        .background(Theme.Colors.backgroundSecondary)
    }
}
