//
//  PinterestComponents.swift
//  IzzIco
//
//  Composants UI style Pinterest - Carte blanche totale
//  Inspiré: Alena, Home app, Finance apps modernes
//

import SwiftUI

// MARK: - Pinterest Button Styles

struct PinterestPrimaryButton: View {
    let title: String
    let role: Theme.UserRole
    let icon: String?
    let action: () -> Void

    init(
        _ title: String,
        role: Theme.UserRole,
        icon: String? = nil,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.role = role
        self.icon = icon
        self.action = action
    }

    var body: some View {
        Button(action: {
            Haptic.light()
            action()
        }) {
            HStack(spacing: 12) {
                if let icon = icon {
                    Image(systemName: icon)
                        .font(.system(size: 20, weight: .semibold))
                }

                Text(title)
                    .font(Theme.PinterestTypography.bodyLarge(.semibold))
            }
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .frame(height: 60)
            .background(role.gradient)
            .clipShape(RoundedRectangle(cornerRadius: Theme.PinterestRadius.large))
            .pinterestShadow(Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.35))
        }
    }
}

struct PinterestSecondaryButton: View {
    let title: String
    let role: Theme.UserRole
    let icon: String?
    let action: () -> Void

    init(
        _ title: String,
        role: Theme.UserRole,
        icon: String? = nil,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.role = role
        self.icon = icon
        self.action = action
    }

    var body: some View {
        Button(action: {
            Haptic.light()
            action()
        }) {
            HStack(spacing: 12) {
                if let icon = icon {
                    Image(systemName: icon)
                        .font(.system(size: 18, weight: .medium))
                }

                Text(title)
                    .font(Theme.PinterestTypography.bodyRegular(.medium))
            }
            .foregroundColor(role.primaryColor)
            .frame(maxWidth: .infinity)
            .frame(height: 56)
            .background(
                RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                    .fill(Color.white.opacity(0.75))
                    .overlay(
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                            .stroke(role.primaryColor.opacity(0.3), lineWidth: 1.5)
                    )
            )
            .pinterestShadow(Theme.PinterestShadows.subtle)
        }
    }
}

struct PinterestIconButton: View {
    let icon: String
    let role: Theme.UserRole
    let size: CGFloat
    let action: () -> Void

    init(
        _ icon: String,
        role: Theme.UserRole,
        size: CGFloat = 52,
        action: @escaping () -> Void
    ) {
        self.icon = icon
        self.role = role
        self.size = size
        self.action = action
    }

    var body: some View {
        Button(action: {
            Haptic.light()
            action()
        }) {
            Image(systemName: icon)
                .font(.system(size: size * 0.4, weight: .semibold))
                .foregroundColor(role.primaryColor)
                .frame(width: size, height: size)
                .background(
                    Circle()
                        .fill(Color.white.opacity(0.8))
                        .overlay(
                            Circle()
                                .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                        )
                )
                .pinterestShadow(Theme.PinterestShadows.soft)
        }
    }
}

// MARK: - Pinterest Hero Card (Style Finance Apps)

struct PinterestHeroCard: View {
    let title: String
    let amount: String
    let change: String
    let isPositive: Bool
    let role: Theme.UserRole

    var body: some View {
        VStack(alignment: .leading, spacing: Theme.PinterestSpacing.lg) {
            // Title
            Text(title)
                .font(Theme.PinterestTypography.bodyLarge(.medium))
                .foregroundColor(.white.opacity(0.9))

            // Amount avec badge de changement
            HStack(alignment: .firstTextBaseline, spacing: 12) {
                Text(amount)
                    .font(Theme.PinterestTypography.heroLarge(.heavy))
                    .foregroundColor(.white)

                // Change badge
                HStack(spacing: 6) {
                    Image(systemName: isPositive ? "arrow.up.right" : "arrow.down.right")
                        .font(.system(size: 12, weight: .bold))

                    Text(change)
                        .font(Theme.PinterestTypography.caption(.bold))
                }
                .foregroundColor(isPositive ? Color(hex: "10B981") : Color(hex: "EF4444"))
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .background(
                    Capsule()
                        .fill((isPositive ? Color(hex: "10B981") : Color(hex: "EF4444")).opacity(0.2))
                )
            }

            // Mini visualization (simple bars)
            HStack(alignment: .bottom, spacing: 6) {
                ForEach(0..<12, id: \.self) { index in
                    RoundedRectangle(cornerRadius: 3)
                        .fill(Color.white.opacity(0.3))
                        .frame(width: 6, height: CGFloat.random(in: 20...50))
                }
            }
            .frame(height: 50)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(Theme.PinterestSpacing.xl)
        .background(
            RoundedRectangle(cornerRadius: Theme.PinterestRadius.xxLarge)
                .fill(role.gradient)
                .pinterestShadow(Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.4))
        )
    }
}

// MARK: - Pinterest Stat Card (Style Home App)

struct PinterestStatCard: View {
    let icon: String
    let value: String
    let label: String
    let subtitle: String?
    let role: Theme.UserRole

    init(
        icon: String,
        value: String,
        label: String,
        subtitle: String? = nil,
        role: Theme.UserRole
    ) {
        self.icon = icon
        self.value = value
        self.label = label
        self.subtitle = subtitle
        self.role = role
    }

    var body: some View {
        VStack(alignment: .leading, spacing: Theme.PinterestSpacing.md) {
            // Icon avec gradient background
            ZStack {
                Circle()
                    .fill(role.gradient)
                    .frame(width: 56, height: 56)
                    .pinterestShadow(Theme.PinterestShadows.colored(role.primaryColor))

                Image(systemName: icon)
                    .font(.system(size: 26, weight: .semibold))
                    .foregroundColor(.white)
            }

            Spacer()

            // Value
            Text(value)
                .font(Theme.PinterestTypography.heroMedium(.heavy))
                .foregroundColor(Theme.Colors.textPrimary)

            // Label
            Text(label)
                .font(Theme.PinterestTypography.bodySmall(.medium))
                .foregroundColor(Theme.Colors.textSecondary)

            // Subtitle badge (optionnel)
            if let subtitle = subtitle {
                Text(subtitle)
                    .font(Theme.PinterestTypography.caption(.semibold))
                    .foregroundColor(role.primaryColor)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(
                        Capsule()
                            .fill(role.primaryColor.opacity(0.12))
                    )
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .frame(height: 220)
        .pinterestGlassCard(
            padding: Theme.PinterestSpacing.lg,
            radius: Theme.PinterestRadius.xLarge
        )
    }
}

// MARK: - Pinterest Action Tile (Grid item)

struct PinterestActionTile: View {
    let icon: String
    let title: String
    let role: Theme.UserRole
    let action: () -> Void

    var body: some View {
        Button(action: {
            Haptic.medium()
            action()
        }) {
            VStack(spacing: Theme.PinterestSpacing.md) {
                // Icon
                ZStack {
                    Circle()
                        .fill(role.primaryColor.opacity(0.15))
                        .frame(width: 68, height: 68)

                    Image(systemName: icon)
                        .font(.system(size: 30, weight: .semibold))
                        .foregroundColor(role.primaryColor)
                }

                // Title
                Text(title)
                    .font(Theme.PinterestTypography.bodySmall(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .multilineTextAlignment(.center)
                    .lineLimit(2)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .frame(maxWidth: .infinity)
            .frame(height: 140)
            .pinterestGlassCard(
                padding: Theme.PinterestSpacing.md,
                radius: Theme.PinterestRadius.medium
            )
        }
        .buttonStyle(ScaleButtonStyle())
    }
}

// MARK: - Pinterest List Item Card

struct PinterestListCard<Content: View>: View {
    let icon: String?
    let iconColor: Color?
    let role: Theme.UserRole
    let content: Content

    init(
        icon: String? = nil,
        iconColor: Color? = nil,
        role: Theme.UserRole,
        @ViewBuilder content: () -> Content
    ) {
        self.icon = icon
        self.iconColor = iconColor
        self.role = role
        self.content = content()
    }

    var body: some View {
        HStack(spacing: Theme.PinterestSpacing.md) {
            // Icon (optionnel)
            if let icon = icon {
                ZStack {
                    RoundedRectangle(cornerRadius: 14)
                        .fill((iconColor ?? role.primaryColor).opacity(0.15))
                        .frame(width: 52, height: 52)

                    Image(systemName: icon)
                        .font(.system(size: 24, weight: .semibold))
                        .foregroundColor(iconColor ?? role.primaryColor)
                }
            }

            // Content
            content

            // Chevron
            Image(systemName: "chevron.right")
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(Theme.Colors.textTertiary)
        }
        .padding(Theme.PinterestSpacing.md)
        .pinterestGlassCard(
            padding: 0,
            radius: Theme.PinterestRadius.medium
        )
    }
}

// MARK: - Pinterest Input Field

struct PinterestTextField: View {
    let placeholder: String
    @Binding var text: String
    let icon: String?
    let role: Theme.UserRole

    init(
        _ placeholder: String,
        text: Binding<String>,
        icon: String? = nil,
        role: Theme.UserRole
    ) {
        self.placeholder = placeholder
        self._text = text
        self.icon = icon
        self.role = role
    }

    var body: some View {
        HStack(spacing: Theme.PinterestSpacing.sm) {
            if let icon = icon {
                Image(systemName: icon)
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(Theme.Colors.textTertiary)
            }

            TextField(placeholder, text: $text)
                .font(Theme.PinterestTypography.bodyRegular(.regular))
                .foregroundColor(Theme.Colors.textPrimary)
        }
        .padding(.horizontal, Theme.PinterestSpacing.md)
        .padding(.vertical, Theme.PinterestSpacing.sm)
        .background(
            RoundedRectangle(cornerRadius: Theme.PinterestRadius.small)
                .fill(Color.white.opacity(0.75))
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.small)
                        .stroke(role.primaryColor.opacity(0.2), lineWidth: 1.5)
                )
        )
        .pinterestShadow(Theme.PinterestShadows.subtle)
    }
}

// MARK: - Pinterest Badge

struct PinterestBadge: View {
    let text: String
    let role: Theme.UserRole
    let style: BadgeStyle

    enum BadgeStyle {
        case filled
        case outlined
        case subtle
    }

    var body: some View {
        Text(text)
            .font(Theme.PinterestTypography.caption(.semibold))
            .foregroundColor(foregroundColor)
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(
                Capsule()
                    .fill(backgroundColor)
                    .overlay(
                        style == .outlined ?
                            Capsule().stroke(role.primaryColor.opacity(0.3), lineWidth: 1.5) : nil
                    )
            )
    }

    private var foregroundColor: Color {
        switch style {
        case .filled: return .white
        case .outlined, .subtle: return role.primaryColor
        }
    }

    private var backgroundColor: Color {
        switch style {
        case .filled: return role.primaryColor
        case .outlined: return .clear
        case .subtle: return role.primaryColor.opacity(0.12)
        }
    }
}

// MARK: - Scale Button Style (micro-interaction)

struct ScaleButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(Theme.PinterestAnimations.quickSpring, value: configuration.isPressed)
    }
}

// MARK: - Pinterest Segment Control

struct PinterestSegmentControl: View {
    let options: [String]
    @Binding var selectedIndex: Int
    let role: Theme.UserRole

    var body: some View {
        HStack(spacing: 6) {
            ForEach(options.indices, id: \.self) { index in
                Button(action: {
                    withAnimation(Theme.PinterestAnimations.smoothSpring) {
                        selectedIndex = index
                        Haptic.selection()
                    }
                }) {
                    Text(options[index])
                        .font(Theme.PinterestTypography.bodySmall(
                            selectedIndex == index ? .semibold : .medium
                        ))
                        .foregroundColor(selectedIndex == index ? .white : role.primaryColor)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(
                            ZStack {
                                if selectedIndex == index {
                                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.small)
                                        .fill(role.gradient)
                                        .pinterestShadow(Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.3))
                                }
                            }
                        )
                }
            }
        }
        .padding(6)
        .background(
            RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                .fill(Color.white.opacity(0.75))
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                        .stroke(role.primaryColor.opacity(0.2), lineWidth: 1.5)
                )
        )
        .pinterestShadow(Theme.PinterestShadows.subtle)
    }
}

// MARK: - Pinterest Form Presentation Modifier

struct PinterestFormPresentation<FormContent: View>: ViewModifier {
    @Binding var isPresented: Bool
    let formContent: FormContent

    init(isPresented: Binding<Bool>, @ViewBuilder formContent: () -> FormContent) {
        self._isPresented = isPresented
        self.formContent = formContent()
    }

    func body(content: Content) -> some View {
        ZStack {
            content

            if isPresented {
                // Backdrop glassmorphism
                Color.black.opacity(0.3)
                    .ignoresSafeArea()
                    .transition(.opacity)
                    .onTapGesture {
                        withAnimation(Theme.PinterestAnimations.smoothSpring) {
                            isPresented = false
                            Haptic.light()
                        }
                    }

                // Form content
                formContent
                    .transition(.asymmetric(
                        insertion: .move(edge: .bottom).combined(with: .opacity),
                        removal: .move(edge: .bottom).combined(with: .opacity)
                    ))
            }
        }
        .animation(Theme.PinterestAnimations.smoothSpring, value: isPresented)
    }
}

extension View {
    func pinterestFormPresentation<FormContent: View>(
        isPresented: Binding<Bool>,
        @ViewBuilder formContent: @escaping () -> FormContent
    ) -> some View {
        self.modifier(PinterestFormPresentation(isPresented: isPresented, formContent: formContent))
    }
}

// MARK: - Pinterest Form Container

struct PinterestFormContainer<Content: View>: View {
    let title: String
    let role: Theme.UserRole
    @Binding var isPresented: Bool
    let onSave: () -> Void
    let content: Content

    init(
        title: String,
        role: Theme.UserRole,
        isPresented: Binding<Bool>,
        onSave: @escaping () -> Void,
        @ViewBuilder content: () -> Content
    ) {
        self.title = title
        self.role = role
        self._isPresented = isPresented
        self.onSave = onSave
        self.content = content()
    }

    var body: some View {
        VStack(spacing: 0) {
            // Handle bar
            RoundedRectangle(cornerRadius: 3)
                .fill(Color.black.opacity(0.15))
                .frame(width: 40, height: 5)
                .padding(.top, 12)
                .padding(.bottom, 8)

            // Header
            HStack {
                Button(action: {
                    withAnimation(Theme.PinterestAnimations.smoothSpring) {
                        isPresented = false
                        Haptic.light()
                    }
                }) {
                    Text("Annuler")
                        .font(Theme.PinterestTypography.bodyRegular(.medium))
                        .foregroundColor(Theme.Colors.textSecondary)
                }

                Spacer()

                Text(title)
                    .font(Theme.PinterestTypography.titleMedium(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                Button(action: {
                    Haptic.light()
                    onSave()
                }) {
                    Text("Créer")
                        .font(Theme.PinterestTypography.bodyRegular(.semibold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 20)
                        .padding(.vertical, 10)
                        .background(
                            Capsule()
                                .fill(role.gradient)
                        )
                        .pinterestShadow(Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.3))
                }
            }
            .padding(.horizontal, Theme.PinterestSpacing.lg)
            .padding(.vertical, Theme.PinterestSpacing.sm)

            Divider()
                .background(Color.black.opacity(0.05))

            // Content
            ScrollView(showsIndicators: false) {
                VStack(spacing: Theme.PinterestSpacing.lg) {
                    content
                }
                .padding(Theme.PinterestSpacing.lg)
                .padding(.bottom, Theme.PinterestSpacing.xxxl)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(
            RoundedRectangle(cornerRadius: Theme.PinterestRadius.xxxLarge)
                .fill(Color.white)
        )
        .overlay(
            RoundedRectangle(cornerRadius: Theme.PinterestRadius.xxxLarge)
                .stroke(Color.white.opacity(0.8), lineWidth: 1.5)
        )
        .pinterestShadow(Theme.PinterestShadows.strong)
        .padding(.top, 60)
        .ignoresSafeArea(edges: .bottom)
    }
}

// MARK: - Pinterest Form Section

struct PinterestFormSection<Content: View>: View {
    let title: String
    let content: Content

    init(_ title: String, @ViewBuilder content: () -> Content) {
        self.title = title
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: Theme.PinterestSpacing.sm) {
            Text(title)
                .font(Theme.PinterestTypography.bodyLarge(.bold))
                .foregroundColor(Theme.Colors.textPrimary)

            content
        }
    }
}

// MARK: - Pinterest Form Input Field

struct PinterestFormTextField: View {
    let placeholder: String
    @Binding var text: String
    let icon: String?
    let role: Theme.UserRole
    var isRequired: Bool = false

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if !placeholder.isEmpty {
                HStack(spacing: 4) {
                    Text(placeholder)
                        .font(Theme.PinterestTypography.bodySmall(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)
                    if isRequired {
                        Text("*")
                            .font(Theme.PinterestTypography.bodySmall(.semibold))
                            .foregroundColor(Color(hex: "EF4444"))
                    }
                }
            }

            HStack(spacing: 12) {
                if let icon = icon {
                    Image(systemName: icon)
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(Theme.Colors.textTertiary)
                }

                TextField("", text: $text)
                    .font(Theme.PinterestTypography.bodyRegular(.regular))
                    .foregroundColor(Theme.Colors.textPrimary)
            }
            .padding(Theme.PinterestSpacing.md)
            .background(
                RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                    .fill(Color.white)
                    .overlay(
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                            .stroke(
                                text.isEmpty && isRequired
                                    ? Color(hex: "EF4444").opacity(0.3)
                                    : role.primaryColor.opacity(0.2),
                                lineWidth: 1.5
                            )
                    )
            )
            .pinterestShadow(Theme.PinterestShadows.subtle)
        }
    }
}

// MARK: - Pinterest Form Text Editor

struct PinterestFormTextEditor: View {
    let placeholder: String
    @Binding var text: String
    let role: Theme.UserRole
    var isRequired: Bool = false

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if !placeholder.isEmpty {
                HStack(spacing: 4) {
                    Text(placeholder)
                        .font(Theme.PinterestTypography.bodySmall(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)
                    if isRequired {
                        Text("*")
                            .font(Theme.PinterestTypography.bodySmall(.semibold))
                            .foregroundColor(Color(hex: "EF4444"))
                    }
                }
            }

            ZStack(alignment: .topLeading) {
                if text.isEmpty {
                    Text("Détails supplémentaires...")
                        .font(Theme.PinterestTypography.bodyRegular(.regular))
                        .foregroundColor(Theme.Colors.textTertiary)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                }

                TextEditor(text: $text)
                    .font(Theme.PinterestTypography.bodyRegular(.regular))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .frame(minHeight: 100)
                    .scrollContentBackground(.hidden)
            }
            .background(
                RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                    .fill(Color.white)
                    .overlay(
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                            .stroke(role.primaryColor.opacity(0.2), lineWidth: 1.5)
                    )
            )
            .pinterestShadow(Theme.PinterestShadows.subtle)
        }
    }
}

// MARK: - Pinterest Form Picker Grid

struct PinterestFormPickerGrid<T: Hashable>: View {
    let title: String
    let items: [T]
    @Binding var selectedItem: T
    let icon: (T) -> String
    let label: (T) -> String
    let color: (T) -> Color
    let role: Theme.UserRole
    var isRequired: Bool = false
    var columns: Int = 2

    var body: some View {
        VStack(alignment: .leading, spacing: Theme.PinterestSpacing.sm) {
            HStack(spacing: 4) {
                Text(title)
                    .font(Theme.PinterestTypography.bodyLarge(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)
                if isRequired {
                    Text("*")
                        .font(Theme.PinterestTypography.bodyLarge(.bold))
                        .foregroundColor(Color(hex: "EF4444"))
                }
            }

            LazyVGrid(
                columns: Array(repeating: GridItem(.flexible(), spacing: 12), count: columns),
                spacing: 12
            ) {
                ForEach(items, id: \.self) { item in
                    PinterestFormPickerItem(
                        icon: icon(item),
                        label: label(item),
                        color: color(item),
                        isSelected: selectedItem == item,
                        role: role
                    ) {
                        withAnimation(Theme.PinterestAnimations.quickSpring) {
                            selectedItem = item
                            Haptic.selection()
                        }
                    }
                }
            }
        }
    }
}

struct PinterestFormPickerItem: View {
    let icon: String
    let label: String
    let color: Color
    let isSelected: Bool
    let role: Theme.UserRole
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: Theme.PinterestSpacing.sm) {
                ZStack {
                    Circle()
                        .fill(color.opacity(isSelected ? 0.2 : 0.1))
                        .frame(width: 56, height: 56)

                    Image(systemName: icon)
                        .font(.system(size: 24, weight: .semibold))
                        .foregroundColor(color)
                }

                Text(label)
                    .font(Theme.PinterestTypography.caption(isSelected ? .semibold : .medium))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .lineLimit(1)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, Theme.PinterestSpacing.md)
            .background(
                RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                    .fill(Color.white)
                    .overlay(
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                            .stroke(
                                isSelected ? color.opacity(0.4) : Color.white.opacity(0.6),
                                lineWidth: isSelected ? 2.5 : 1.5
                            )
                    )
            )
            .pinterestShadow(isSelected ? Theme.PinterestShadows.medium : Theme.PinterestShadows.subtle)
        }
        .buttonStyle(ScaleButtonStyle())
    }
}

// MARK: - Pinterest Form Toggle

struct PinterestFormToggle: View {
    let title: String
    let subtitle: String?
    @Binding var isOn: Bool
    let role: Theme.UserRole

    init(
        _ title: String,
        subtitle: String? = nil,
        isOn: Binding<Bool>,
        role: Theme.UserRole
    ) {
        self.title = title
        self.subtitle = subtitle
        self._isOn = isOn
        self.role = role
    }

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(Theme.PinterestTypography.bodyRegular(.medium))
                    .foregroundColor(Theme.Colors.textPrimary)

                if let subtitle = subtitle {
                    Text(subtitle)
                        .font(Theme.PinterestTypography.caption(.regular))
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }

            Spacer()

            Toggle("", isOn: $isOn)
                .labelsHidden()
                .tint(role.primaryColor)
        }
        .padding(Theme.PinterestSpacing.md)
        .background(
            RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                .fill(Color.white)
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                        .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                )
        )
        .pinterestShadow(Theme.PinterestShadows.subtle)
    }
}
//
//  PinterestFloatingHeader.swift
//  IzzIco
//
//  Floating header with glassmorphism - appears/disappears with scroll
//  Same effect as bottom tab bar
//

import SwiftUI

// MARK: - Floating Header

struct PinterestFloatingHeader: View {
    let role: Theme.UserRole
    let showAddButton: Bool
    let onProfileTap: () -> Void
    let onAlertTap: () -> Void
    let onMenuTap: () -> Void
    let onAddTap: (() -> Void)?

    @Binding var isVisible: Bool
    @State private var hasNotifications = false

    var body: some View {
        HStack(spacing: 16) {
            // Profile button
            Button(action: {
                Haptic.light()
                onProfileTap()
            }) {
                Circle()
                    .fill(role.gradient)
                    .frame(width: 40, height: 40)
                    .overlay(
                        Image(systemName: "person.fill")
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(.white)
                    )
                    .pinterestShadow(Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.3))
            }

            Spacer()

            // Alert button
            Button(action: {
                Haptic.light()
                onAlertTap()
            }) {
                ZStack(alignment: .topTrailing) {
                    Circle()
                        .fill(Color.white.opacity(0.5))
                        .frame(width: 40, height: 40)
                        .overlay(
                            Circle()
                                .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                        )
                        .overlay(
                            Image(systemName: "bell.fill")
                                .font(.system(size: 18, weight: .semibold))
                                .foregroundColor(hasNotifications ? role.primaryColor : Theme.Colors.textSecondary)
                        )
                        .pinterestShadow(Theme.PinterestShadows.subtle)

                    if hasNotifications {
                        Circle()
                            .fill(Color(hex: "EF4444"))
                            .frame(width: 12, height: 12)
                            .overlay(
                                Circle()
                                    .stroke(Color.white, lineWidth: 2)
                            )
                            .offset(x: 2, y: -2)
                    }
                }
            }

            // Menu hamburger button
            Button(action: {
                Haptic.light()
                onMenuTap()
            }) {
                Circle()
                    .fill(Color.white.opacity(0.5))
                    .frame(width: 40, height: 40)
                    .overlay(
                        Circle()
                            .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                    )
                    .overlay(
                        Image(systemName: "line.3.horizontal")
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(Theme.Colors.textPrimary)
                    )
                    .pinterestShadow(Theme.PinterestShadows.subtle)
            }

            // Add button (conditional)
            if showAddButton, let addAction = onAddTap {
                Button(action: {
                    Haptic.light()
                    addAction()
                }) {
                    Circle()
                        .fill(role.gradient)
                        .frame(width: 44, height: 44)
                        .overlay(
                            Image(systemName: "plus")
                                .font(.system(size: 20, weight: .semibold))
                                .foregroundColor(.white)
                        )
                        .pinterestShadow(Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.35))
                }
            }
        }
        .padding(.horizontal, Theme.PinterestSpacing.lg)
        .padding(.vertical, 12)
        .background(
            Rectangle()
                .fill(Color.white.opacity(0.5))
                .background(.ultraThinMaterial)
                .ignoresSafeArea()
        )
        .overlay(
            Rectangle()
                .fill(Color.white.opacity(0.3))
                .frame(height: 0.5),
            alignment: .bottom
        )
        .offset(y: isVisible ? 0 : -100)
        .opacity(isVisible ? 1 : 0)
        .animation(Theme.PinterestAnimations.smoothSpring, value: isVisible)
    }
}

// MARK: - ScrollView with Header Detection

struct ScrollViewWithFloatingHeader<Content: View>: View {
    let role: Theme.UserRole
    let showAddButton: Bool
    let onProfileTap: () -> Void
    let onAlertTap: () -> Void
    let onMenuTap: () -> Void
    let onAddTap: (() -> Void)?
    let content: Content

    @State private var scrollOffset: CGFloat = 0
    @State private var showHeader = false

    init(
        role: Theme.UserRole,
        showAddButton: Bool = false,
        onProfileTap: @escaping () -> Void,
        onAlertTap: @escaping () -> Void,
        onMenuTap: @escaping () -> Void,
        onAddTap: (() -> Void)? = nil,
        @ViewBuilder content: () -> Content
    ) {
        self.role = role
        self.showAddButton = showAddButton
        self.onProfileTap = onProfileTap
        self.onAlertTap = onAlertTap
        self.onMenuTap = onMenuTap
        self.onAddTap = onAddTap
        self.content = content()
    }

    var body: some View {
        ZStack(alignment: .top) {
            // ScrollView with offset tracking
            ScrollView(showsIndicators: false) {
                GeometryReader { geometry in
                    Color.clear.preference(
                        key: ScrollOffsetPreferenceKey.self,
                        value: geometry.frame(in: .named("scroll")).minY
                    )
                }
                .frame(height: 0)

                content
            }
            .coordinateSpace(name: "scroll")
            .onPreferenceChange(ScrollOffsetPreferenceKey.self) { value in
                let offset = value

                withAnimation(Theme.PinterestAnimations.smoothSpring) {
                    // Show header when scrolling up, hide when scrolling down
                    if offset < -50 { // Scrolled down more than 50pts
                        showHeader = true
                    } else if offset > -20 { // Near top
                        showHeader = false
                    }
                }

                scrollOffset = offset
            }

            // Floating header
            if showHeader {
                PinterestFloatingHeader(
                    role: role,
                    showAddButton: showAddButton,
                    onProfileTap: onProfileTap,
                    onAlertTap: onAlertTap,
                    onMenuTap: onMenuTap,
                    onAddTap: onAddTap,
                    isVisible: $showHeader
                )
                .zIndex(999)
            }
        }
    }
}

// MARK: - Scroll Offset Preference Key

struct ScrollOffsetPreferenceKey: PreferenceKey {
    static var defaultValue: CGFloat = 0

    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}

// MARK: - View Extension

extension View {
    func withFloatingHeader(
        role: Theme.UserRole,
        showAddButton: Bool = false,
        onProfileTap: @escaping () -> Void,
        onAlertTap: @escaping () -> Void,
        onMenuTap: @escaping () -> Void,
        onAddTap: (() -> Void)? = nil
    ) -> some View {
        ScrollViewWithFloatingHeader(
            role: role,
            showAddButton: showAddButton,
            onProfileTap: onProfileTap,
            onAlertTap: onAlertTap,
            onMenuTap: onMenuTap,
            onAddTap: onAddTap
        ) {
            self
        }
    }
}
