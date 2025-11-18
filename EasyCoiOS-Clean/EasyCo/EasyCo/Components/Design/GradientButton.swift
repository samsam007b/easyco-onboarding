import SwiftUI

// MARK: - Gradient Button Component

/// Primary gradient button matching web app design
struct GradientButton: View {
    let title: String
    let role: UserType
    let size: Theme.ButtonSize
    let action: () -> Void
    let isLoading: Bool
    let isDisabled: Bool
    let icon: String?

    init(
        _ title: String,
        role: UserType,
        size: Theme.ButtonSize = .medium,
        icon: String? = nil,
        isLoading: Bool = false,
        isDisabled: Bool = false,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.role = role
        self.size = size
        self.icon = icon
        self.isLoading = isLoading
        self.isDisabled = isDisabled
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            HStack(spacing: Theme.Spacing._2) {
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        .scaleEffect(0.8)
                } else {
                    if let icon = icon {
                        Image(systemName: icon)
                            .font(.system(size: size.fontSize, weight: .semibold))
                    }
                    Text(title)
                        .font(.system(size: size.fontSize, weight: .semibold))
                }
            }
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding(.horizontal, 32)
            .padding(.vertical, 16)
            .background(
                Group {
                    if isDisabled {
                        Theme.GrayColors._300
                    } else {
                        Theme.Gradients.forRole(role)
                    }
                }
            )
            .clipShape(Capsule()) // Web app style - pill/capsule shape
            .shadow(
                color: isDisabled ? Color.clear : glowColor(for: role).opacity(0.3),
                radius: 12,
                x: 0,
                y: 4
            )
        }
        .disabled(isDisabled || isLoading)
        .opacity(isDisabled ? 0.6 : 1.0)
    }

    private func glowShadow(for role: UserType) -> Theme.Shadow {
        switch role {
        case .searcher: return Theme.Shadows.searcherGlow
        case .owner: return Theme.Shadows.ownerGlow
        case .resident: return Theme.Shadows.residentGlow
        }
    }

    private func glowColor(for role: UserType) -> Color {
        switch role {
        case .searcher: return Theme.SearcherColors._500
        case .owner: return Theme.OwnerColors._500
        case .resident: return Theme.ResidentColors._500
        }
    }
}

// MARK: - Secondary Button (Outline)

struct SecondaryButton: View {
    let title: String
    let color: Color
    let size: Theme.ButtonSize
    let action: () -> Void
    let isDisabled: Bool
    let icon: String?

    init(
        _ title: String,
        color: Color,
        size: Theme.ButtonSize = .medium,
        icon: String? = nil,
        isDisabled: Bool = false,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.color = color
        self.size = size
        self.icon = icon
        self.isDisabled = isDisabled
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            HStack(spacing: Theme.Spacing._2) {
                if let icon = icon {
                    Image(systemName: icon)
                        .font(.system(size: size.fontSize, weight: .semibold))
                }
                Text(title)
                    .font(.system(size: size.fontSize, weight: .semibold))
            }
            .foregroundColor(isDisabled ? Theme.GrayColors._400 : color)
            .frame(maxWidth: .infinity)
            .padding(.horizontal, 32)
            .padding(.vertical, 16)
            .background(Color.white)
            .overlay(
                Capsule()
                    .stroke(isDisabled ? Theme.GrayColors._300 : color, lineWidth: 2)
            )
            .clipShape(Capsule()) // Web app style - pill/capsule shape
            .shadow(
                color: Color.black.opacity(0.08),
                radius: 8,
                x: 0,
                y: 2
            )
        }
        .disabled(isDisabled)
        .opacity(isDisabled ? 0.6 : 1.0)
    }
}

// MARK: - Ghost Button (Text Only)

struct GhostButton: View {
    let title: String
    let size: Theme.ButtonSize
    let action: () -> Void
    let isDisabled: Bool
    let icon: String?

    init(
        _ title: String,
        size: Theme.ButtonSize = .medium,
        icon: String? = nil,
        isDisabled: Bool = false,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.size = size
        self.icon = icon
        self.isDisabled = isDisabled
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            HStack(spacing: Theme.Spacing._2) {
                if let icon = icon {
                    Image(systemName: icon)
                        .font(.system(size: size.fontSize, weight: .semibold))
                }
                Text(title)
                    .font(.system(size: size.fontSize, weight: .semibold))
            }
            .foregroundColor(isDisabled ? Theme.GrayColors._400 : Theme.GrayColors._700)
            .frame(height: size.height)
            .padding(.horizontal, size.paddingHorizontal)
            .background(Color.clear)
            .contentShape(Rectangle())
        }
        .disabled(isDisabled)
        .opacity(isDisabled ? 0.6 : 1.0)
    }
}

// MARK: - Icon Button

struct IconButton: View {
    let icon: String
    let role: UserType?
    let size: CGFloat
    let action: () -> Void
    let isDisabled: Bool

    init(
        icon: String,
        role: UserType? = nil,
        size: CGFloat = 40,
        isDisabled: Bool = false,
        action: @escaping () -> Void
    ) {
        self.icon = icon
        self.role = role
        self.size = size
        self.isDisabled = isDisabled
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            Image(systemName: icon)
                .font(.system(size: size * 0.5, weight: .semibold))
                .foregroundColor(role != nil ? .white : Theme.GrayColors._700)
                .frame(width: size, height: size)
                .background(
                    role != nil ?
                    AnyView(Theme.Gradients.forRole(role!)) :
                    AnyView(Theme.GrayColors._100)
                )
                .cornerRadius(Theme.CornerRadius.full)
                .themeShadow(role != nil ? glowShadow(for: role!) : Theme.Shadows.xs)
        }
        .disabled(isDisabled)
        .opacity(isDisabled ? 0.6 : 1.0)
    }

    private func glowShadow(for role: UserType) -> Theme.Shadow {
        switch role {
        case .searcher: return Theme.Shadows.searcherGlow
        case .owner: return Theme.Shadows.ownerGlow
        case .resident: return Theme.Shadows.residentGlow
        }
    }
}

// MARK: - Previews

struct GradientButton_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: Theme.Spacing._4) {
            // Gradient Buttons for each role
            GradientButton("Searcher Button", role: .searcher) {}
            GradientButton("Owner Button", role: .owner, icon: "house.fill") {}
            GradientButton("Resident Button", role: .resident) {}

            // Loading state
            GradientButton("Loading...", role: .owner, isLoading: true) {}

            // Disabled state
            GradientButton("Disabled", role: .searcher, isDisabled: true) {}

            // Secondary Buttons
            SecondaryButton("Secondary", color: Theme.OwnerColors._500) {}
            SecondaryButton("With Icon", color: Theme.SearcherColors._500, icon: "star.fill") {}

            // Ghost Button
            GhostButton("Ghost Button", icon: "arrow.right") {}

            // Icon Buttons
            HStack(spacing: Theme.Spacing._3) {
                IconButton(icon: "heart.fill", role: .owner) {}
                IconButton(icon: "star.fill", role: .searcher) {}
                IconButton(icon: "bell.fill", role: .resident) {}
                IconButton(icon: "gearshape.fill") {}
            }
        }
        .padding()
        .background(Theme.Colors.backgroundSecondary)
    }
}
