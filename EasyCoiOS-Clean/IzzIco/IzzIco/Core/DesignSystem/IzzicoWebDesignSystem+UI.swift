//
//  IzzicoWebDesignSystem+UI.swift
//  IzzIco
//
//  Composants UI avancés pour le design system Izzico
//  Created on 2026-01-25
//

import SwiftUI

// MARK: - Avatar Component

/// Avatar web-style avec initiales ou image
struct WebAvatar: View {
    let imageUrl: String?
    let name: String
    let size: CGFloat
    var isOnline: Bool = false
    var roleColor: Color = IzzicoWeb.Colors.resident500

    private var initials: String {
        let components = name.split(separator: " ")
        if components.count >= 2 {
            return String(components[0].prefix(1)) + String(components[1].prefix(1))
        }
        return String(name.prefix(2))
    }

    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            if let imageUrl = imageUrl, let url = URL(string: imageUrl) {
                AsyncImage(url: url) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Circle()
                        .fill(roleColor.opacity(0.15))
                        .overlay(
                            ProgressView()
                        )
                }
                .frame(width: size, height: size)
                .clipShape(Circle())
            } else {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [roleColor, roleColor.opacity(0.7)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: size, height: size)
                    .overlay(
                        Text(initials.uppercased())
                            .font(.system(size: size * 0.4, weight: .bold))
                            .foregroundColor(.white)
                    )
            }

            if isOnline {
                Circle()
                    .fill(IzzicoWeb.Colors.success)
                    .frame(width: size * 0.25, height: size * 0.25)
                    .overlay(
                        Circle()
                            .stroke(IzzicoWeb.Colors.white, lineWidth: 2)
                    )
            }
        }
    }
}

// MARK: - Badge Component

/// Badge web-style pour statuts, compteurs, etc.
struct WebBadge: View {
    enum Style {
        case filled, outline, subtle
    }

    let text: String
    let color: Color
    var style: Style = .filled
    var icon: String? = nil

    var body: some View {
        HStack(spacing: 4) {
            if let icon = icon {
                Image(systemName: icon)
                    .font(.system(size: 10, weight: .semibold))
            }
            Text(text)
                .font(IzzicoWeb.Typography.captionSmall(.bold))
        }
        .foregroundColor(foregroundColor)
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(backgroundColor)
        .clipShape(Capsule())
        .overlay(
            style == .outline ?
            Capsule().stroke(color, lineWidth: 1)
            : nil
        )
    }

    private var foregroundColor: Color {
        switch style {
        case .filled: return .white
        case .outline: return color
        case .subtle: return color
        }
    }

    private var backgroundColor: Color {
        switch style {
        case .filled: return color
        case .outline: return Color.clear
        case .subtle: return color.opacity(0.15)
        }
    }
}

// MARK: - Progress Ring Component

/// Cercle de progression web-style
struct WebProgressRing: View {
    let progress: Double // 0.0 to 1.0
    let lineWidth: CGFloat
    var roleColor: Color = IzzicoWeb.Colors.resident500
    var size: CGFloat = 100
    var showPercentage: Bool = true

    var body: some View {
        ZStack {
            // Background circle
            Circle()
                .stroke(roleColor.opacity(0.15), lineWidth: lineWidth)

            // Progress circle
            Circle()
                .trim(from: 0, to: progress)
                .stroke(
                    roleColor,
                    style: StrokeStyle(lineWidth: lineWidth, lineCap: .round)
                )
                .rotationEffect(.degrees(-90))
                .animation(IzzicoWeb.Animations.smoothSpring, value: progress)

            // Percentage text
            if showPercentage {
                Text("\(Int(progress * 100))%")
                    .font(.system(size: size * 0.25, weight: .bold))
                    .foregroundColor(roleColor)
            }
        }
        .frame(width: size, height: size)
    }
}

// MARK: - Dropdown Component

/// Menu déroulant web-style
struct WebDropdown<T: Hashable & CustomStringConvertible>: View {
    let label: String
    @Binding var selection: T
    let options: [T]
    var icon: String? = nil

    @State private var isExpanded = false

    var body: some View {
        VStack(alignment: .leading, spacing: IzzicoWeb.Spacing.sm) {
            // Label
            Text(label)
                .font(IzzicoWeb.Typography.bodySmall(.medium))
                .foregroundColor(IzzicoWeb.Colors.gray700)

            // Dropdown button
            Button(action: { isExpanded.toggle() }) {
                HStack(spacing: IzzicoWeb.Spacing.md) {
                    if let icon = icon {
                        Image(systemName: icon)
                            .font(.system(size: 18, weight: .medium))
                            .foregroundColor(IzzicoWeb.Colors.gray400)
                    }

                    Text(selection.description)
                        .font(IzzicoWeb.Typography.bodyRegular())
                        .foregroundColor(IzzicoWeb.Colors.gray900)

                    Spacer()

                    Image(systemName: "chevron.down")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(IzzicoWeb.Colors.gray500)
                        .rotationEffect(.degrees(isExpanded ? 180 : 0))
                }
                .padding(IzzicoWeb.Spacing.md)
                .background(
                    RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                        .fill(IzzicoWeb.Colors.white)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                        .stroke(IzzicoWeb.Colors.gray200, lineWidth: 1)
                )
            }
            .buttonStyle(PlainButtonStyle())

            // Options menu
            if isExpanded {
                VStack(spacing: 0) {
                    ForEach(options, id: \.self) { option in
                        Button(action: {
                            selection = option
                            isExpanded = false
                        }) {
                            HStack {
                                Text(option.description)
                                    .font(IzzicoWeb.Typography.bodyRegular())
                                    .foregroundColor(IzzicoWeb.Colors.gray900)

                                Spacer()

                                if option == selection {
                                    Image(systemName: "checkmark")
                                        .font(.system(size: 14, weight: .semibold))
                                        .foregroundColor(IzzicoWeb.Colors.resident500)
                                }
                            }
                            .padding(IzzicoWeb.Spacing.md)
                            .background(
                                option == selection ?
                                IzzicoWeb.Colors.resident50 :
                                IzzicoWeb.Colors.white
                            )
                        }
                        .buttonStyle(PlainButtonStyle())

                        if option != options.last {
                            Divider()
                        }
                    }
                }
                .background(IzzicoWeb.Colors.white)
                .cornerRadius(IzzicoWeb.Radius.medium)
                .overlay(
                    RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium)
                        .stroke(IzzicoWeb.Colors.gray200, lineWidth: 1)
                )
                .webShadow(IzzicoWeb.Shadows.medium)
            }
        }
        .animation(IzzicoWeb.Animations.quickSpring, value: isExpanded)
    }
}

// MARK: - Date Picker Component

/// Date picker web-style
struct WebDatePicker: View {
    let label: String
    @Binding var date: Date
    var displayedComponents: DatePickerComponents = [.date]
    var icon: String? = "calendar"

    var body: some View {
        VStack(alignment: .leading, spacing: IzzicoWeb.Spacing.sm) {
            // Label
            Text(label)
                .font(IzzicoWeb.Typography.bodySmall(.medium))
                .foregroundColor(IzzicoWeb.Colors.gray700)

            // Date picker
            HStack(spacing: IzzicoWeb.Spacing.md) {
                if let icon = icon {
                    Image(systemName: icon)
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(IzzicoWeb.Colors.gray400)
                }

                DatePicker(
                    "",
                    selection: $date,
                    displayedComponents: displayedComponents
                )
                .labelsHidden()
                .tint(IzzicoWeb.Colors.resident500)
            }
            .padding(IzzicoWeb.Spacing.md)
            .background(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                    .fill(IzzicoWeb.Colors.white)
            )
            .overlay(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                    .stroke(IzzicoWeb.Colors.gray200, lineWidth: 1)
            )
        }
    }
}

// MARK: - Sheet/Modal Component

/// Bottom sheet web-style
struct WebSheet<Content: View>: View {
    @Binding var isPresented: Bool
    let title: String
    var subtitle: String? = nil
    var showCloseButton: Bool = true
    @ViewBuilder let content: () -> Content

    var body: some View {
        ZStack(alignment: .bottom) {
            // Backdrop
            if isPresented {
                Color.black.opacity(0.4)
                    .ignoresSafeArea()
                    .onTapGesture {
                        isPresented = false
                    }
                    .transition(.opacity)
            }

            // Sheet content
            if isPresented {
                VStack(spacing: 0) {
                    // Handle
                    RoundedRectangle(cornerRadius: 2.5)
                        .fill(IzzicoWeb.Colors.gray300)
                        .frame(width: 40, height: 5)
                        .padding(.top, IzzicoWeb.Spacing.md)

                    // Header
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(title)
                                .font(IzzicoWeb.Typography.titleMedium())
                                .foregroundColor(IzzicoWeb.Colors.gray900)

                            if let subtitle = subtitle {
                                Text(subtitle)
                                    .font(IzzicoWeb.Typography.bodySmall())
                                    .foregroundColor(IzzicoWeb.Colors.gray600)
                            }
                        }

                        Spacer()

                        if showCloseButton {
                            Button(action: { isPresented = false }) {
                                Image(systemName: "xmark")
                                    .font(.system(size: 16, weight: .semibold))
                                    .foregroundColor(IzzicoWeb.Colors.gray600)
                                    .frame(width: 32, height: 32)
                                    .background(
                                        Circle()
                                            .fill(IzzicoWeb.Colors.gray100)
                                    )
                            }
                        }
                    }
                    .padding(IzzicoWeb.Spacing.lg)

                    Divider()

                    // Content
                    ScrollView {
                        content()
                            .padding(IzzicoWeb.Spacing.lg)
                    }
                }
                .background(IzzicoWeb.Colors.white)
                .cornerRadius(IzzicoWeb.Radius.xxLarge, corners: [.topLeft, .topRight])
                .ignoresSafeArea(edges: .bottom)
                .transition(.move(edge: .bottom))
            }
        }
        .animation(IzzicoWeb.Animations.smoothSpring, value: isPresented)
    }
}

// Note: RoundedCorner extension already exists in View+Extensions.swift

// MARK: - Toast Notification Component

/// Toast notification web-style
struct WebToast: View {
    enum ToastType {
        case success, error, warning, info

        var color: Color {
            switch self {
            case .success: return IzzicoWeb.Colors.success
            case .error: return IzzicoWeb.Colors.error
            case .warning: return IzzicoWeb.Colors.warning
            case .info: return IzzicoWeb.Colors.info
            }
        }

        var icon: String {
            switch self {
            case .success: return "checkmark.circle.fill"
            case .error: return "xmark.circle.fill"
            case .warning: return "exclamationmark.triangle.fill"
            case .info: return "info.circle.fill"
            }
        }
    }

    let message: String
    let type: ToastType
    @Binding var isPresented: Bool

    var body: some View {
        if isPresented {
            HStack(spacing: IzzicoWeb.Spacing.md) {
                Image(systemName: type.icon)
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(type.color)

                Text(message)
                    .font(IzzicoWeb.Typography.bodyRegular(.medium))
                    .foregroundColor(IzzicoWeb.Colors.gray900)

                Spacer()

                Button(action: { isPresented = false }) {
                    Image(systemName: "xmark")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(IzzicoWeb.Colors.gray500)
                }
            }
            .padding(IzzicoWeb.Spacing.md)
            .background(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                    .fill(IzzicoWeb.Colors.white)
            )
            .overlay(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                    .stroke(type.color.opacity(0.2), lineWidth: 1)
            )
            .webShadow(IzzicoWeb.Shadows.strong)
            .padding(.horizontal, IzzicoWeb.Spacing.lg)
            .transition(.move(edge: .top).combined(with: .opacity))
            .onAppear {
                DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                    isPresented = false
                }
            }
        }
    }
}

// Toast modifier for easy use
extension View {
    func webToast(
        message: String,
        type: WebToast.ToastType,
        isPresented: Binding<Bool>
    ) -> some View {
        ZStack(alignment: .top) {
            self

            WebToast(message: message, type: type, isPresented: isPresented)
                .padding(.top, IzzicoWeb.Spacing.xxl)
        }
        .animation(IzzicoWeb.Animations.smoothSpring, value: isPresented.wrappedValue)
    }
}

// MARK: - Tag/Chip Component

/// Tag/chip interactif web-style
struct WebTag: View {
    let label: String
    let isSelected: Bool
    let action: () -> Void
    var icon: String? = nil
    var isDismissible: Bool = false
    var onDismiss: (() -> Void)? = nil
    var roleColor: Color = IzzicoWeb.Colors.resident500

    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                if let icon = icon {
                    Image(systemName: icon)
                        .font(.system(size: 12, weight: .semibold))
                }

                Text(label)
                    .font(IzzicoWeb.Typography.bodySmall(.medium))

                if isDismissible, let onDismiss = onDismiss {
                    Button(action: onDismiss) {
                        Image(systemName: "xmark")
                            .font(.system(size: 10, weight: .bold))
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
            .foregroundColor(isSelected ? .white : roleColor)
            .padding(.horizontal, IzzicoWeb.Spacing.md)
            .padding(.vertical, IzzicoWeb.Spacing.sm)
            .background(
                Capsule()
                    .fill(isSelected ? roleColor : roleColor.opacity(0.1))
            )
            .overlay(
                isSelected ? nil :
                Capsule()
                    .stroke(roleColor.opacity(0.3), lineWidth: 1)
            )
        }
        .buttonStyle(PlainButtonStyle())
        .animation(IzzicoWeb.Animations.quickSpring, value: isSelected)
    }
}

// MARK: - Skeleton Loader Component

/// Skeleton loader pour états de chargement
struct WebSkeleton: View {
    var width: CGFloat? = nil
    var height: CGFloat = 20
    var cornerRadius: CGFloat = IzzicoWeb.Radius.small

    @State private var isAnimating = false

    var body: some View {
        Rectangle()
            .fill(
                LinearGradient(
                    colors: [
                        IzzicoWeb.Colors.gray200,
                        IzzicoWeb.Colors.gray100,
                        IzzicoWeb.Colors.gray200
                    ],
                    startPoint: isAnimating ? .leading : .trailing,
                    endPoint: isAnimating ? .trailing : .leading
                )
            )
            .frame(width: width, height: height)
            .cornerRadius(cornerRadius)
            .onAppear {
                withAnimation(
                    Animation.easeInOut(duration: 1.5)
                        .repeatForever(autoreverses: false)
                ) {
                    isAnimating = true
                }
            }
    }
}

// MARK: - Divider Component

/// Divider web-style avec label optionnel
struct WebDivider: View {
    var label: String? = nil
    var color: Color = IzzicoWeb.Colors.gray200

    var body: some View {
        if let label = label {
            HStack(spacing: IzzicoWeb.Spacing.md) {
                Rectangle()
                    .fill(color)
                    .frame(height: 1)

                Text(label)
                    .font(IzzicoWeb.Typography.bodySmall())
                    .foregroundColor(IzzicoWeb.Colors.gray500)

                Rectangle()
                    .fill(color)
                    .frame(height: 1)
            }
        } else {
            Rectangle()
                .fill(color)
                .frame(height: 1)
        }
    }
}

// MARK: - Alert Banner Component

/// Banner d'alerte/info web-style
struct WebAlertBanner: View {
    enum AlertType {
        case info, warning, error, success

        var color: Color {
            switch self {
            case .info: return IzzicoWeb.Colors.info
            case .warning: return IzzicoWeb.Colors.warning
            case .error: return IzzicoWeb.Colors.error
            case .success: return IzzicoWeb.Colors.success
            }
        }

        var backgroundColor: Color {
            switch self {
            case .info: return IzzicoWeb.Colors.infoLight
            case .warning: return IzzicoWeb.Colors.warningLight
            case .error: return IzzicoWeb.Colors.errorLight
            case .success: return IzzicoWeb.Colors.successLight
            }
        }

        var icon: String {
            switch self {
            case .info: return "info.circle"
            case .warning: return "exclamationmark.triangle"
            case .error: return "xmark.octagon"
            case .success: return "checkmark.circle"
            }
        }
    }

    let message: String
    let type: AlertType
    var isDismissible: Bool = false
    @Binding var isPresented: Bool
    var action: (() -> Void)? = nil
    var actionLabel: String? = nil

    var body: some View {
        if isPresented {
            HStack(spacing: IzzicoWeb.Spacing.md) {
                Image(systemName: type.icon)
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(type.color)

                VStack(alignment: .leading, spacing: 4) {
                    Text(message)
                        .font(IzzicoWeb.Typography.bodyRegular(.medium))
                        .foregroundColor(IzzicoWeb.Colors.gray900)

                    if let actionLabel = actionLabel, let action = action {
                        Button(action: action) {
                            Text(actionLabel)
                                .font(IzzicoWeb.Typography.bodySmall(.semibold))
                                .foregroundColor(type.color)
                        }
                    }
                }

                Spacer()

                if isDismissible {
                    Button(action: { isPresented = false }) {
                        Image(systemName: "xmark")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(IzzicoWeb.Colors.gray500)
                    }
                }
            }
            .padding(IzzicoWeb.Spacing.md)
            .background(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                    .fill(type.backgroundColor)
            )
            .overlay(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                    .stroke(type.color.opacity(0.2), lineWidth: 1)
            )
        }
    }
}

// MARK: - Selection Field Component

/// Champ de sélection web-style (dropdown avec options)
struct WebAppSelectionField: View {
    let title: String
    let icon: String
    @Binding var selection: String
    let options: [String: String] // key: value pairs

    @State private var isExpanded = false

    var body: some View {
        VStack(alignment: .leading, spacing: IzzicoWeb.Spacing.sm) {
            // Label
            Text(title)
                .font(IzzicoWeb.Typography.bodySmall(.medium))
                .foregroundColor(IzzicoWeb.Colors.gray700)

            // Dropdown button
            Button(action: { isExpanded.toggle() }) {
                HStack(spacing: IzzicoWeb.Spacing.md) {
                    Image(systemName: icon)
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(IzzicoWeb.Colors.gray400)

                    Text(options[selection] ?? "Sélectionner")
                        .font(IzzicoWeb.Typography.bodyRegular())
                        .foregroundColor(IzzicoWeb.Colors.gray900)

                    Spacer()

                    Image(systemName: "chevron.down")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(IzzicoWeb.Colors.gray500)
                        .rotationEffect(.degrees(isExpanded ? 180 : 0))
                }
                .padding(IzzicoWeb.Spacing.md)
                .background(
                    RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                        .fill(IzzicoWeb.Colors.white)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                        .stroke(IzzicoWeb.Colors.gray200, lineWidth: 1)
                )
            }
            .buttonStyle(PlainButtonStyle())

            // Options menu
            if isExpanded {
                VStack(spacing: 0) {
                    ForEach(Array(options.keys.sorted()), id: \.self) { key in
                        Button(action: {
                            selection = key
                            isExpanded = false
                        }) {
                            HStack {
                                Text(options[key] ?? key)
                                    .font(IzzicoWeb.Typography.bodyRegular())
                                    .foregroundColor(IzzicoWeb.Colors.gray900)

                                Spacer()

                                if key == selection {
                                    Image(systemName: "checkmark")
                                        .font(.system(size: 14, weight: .semibold))
                                        .foregroundColor(IzzicoWeb.Colors.resident500)
                                }
                            }
                            .padding(IzzicoWeb.Spacing.md)
                            .background(
                                key == selection ?
                                IzzicoWeb.Colors.resident50 :
                                IzzicoWeb.Colors.white
                            )
                        }
                        .buttonStyle(PlainButtonStyle())

                        if key != Array(options.keys.sorted()).last {
                            Divider()
                        }
                    }
                }
                .background(IzzicoWeb.Colors.white)
                .cornerRadius(IzzicoWeb.Radius.medium)
                .overlay(
                    RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium)
                        .stroke(IzzicoWeb.Colors.gray200, lineWidth: 1)
                )
                .webShadow(IzzicoWeb.Shadows.medium)
            }
        }
        .animation(IzzicoWeb.Animations.quickSpring, value: isExpanded)
    }
}

// MARK: - Preview

struct IzzicoWebDesignSystemUI_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Avatar
                HStack(spacing: 16) {
                    WebAvatar(imageUrl: nil, name: "Samuel Baudon", size: 56, isOnline: true)
                    WebAvatar(imageUrl: nil, name: "Marie Dupont", size: 48)
                    WebAvatar(imageUrl: nil, name: "JD", size: 40, isOnline: true, roleColor: IzzicoWeb.Colors.owner500)
                }

                // Badges
                HStack(spacing: 8) {
                    WebBadge(text: "New", color: IzzicoWeb.Colors.success)
                    WebBadge(text: "Premium", color: IzzicoWeb.Colors.owner500, style: .outline)
                    WebBadge(text: "3", color: IzzicoWeb.Colors.error, style: .filled, icon: "bell.fill")
                }

                // Progress Ring
                WebProgressRing(progress: 0.65, lineWidth: 10, size: 120)

                // Dropdown
                WebDropdown(
                    label: "Sélectionner une ville",
                    selection: .constant("Bruxelles"),
                    options: ["Bruxelles", "Anvers", "Gand", "Liège"],
                    icon: "mappin.circle"
                )

                // Date Picker
                WebDatePicker(label: "Date de visite", date: .constant(Date()))

                // Alert Banner
                WebAlertBanner(
                    message: "Ton profil est complet à 65%",
                    type: .warning,
                    isDismissible: true,
                    isPresented: .constant(true),
                    action: {},
                    actionLabel: "Compléter"
                )

                // Skeleton
                VStack(spacing: 12) {
                    WebSkeleton(height: 120, cornerRadius: IzzicoWeb.Radius.large)
                    WebSkeleton(width: 200, height: 20)
                    WebSkeleton(width: 150, height: 16)
                }
            }
            .padding()
        }
        .background(IzzicoWeb.Colors.background)
    }
}
