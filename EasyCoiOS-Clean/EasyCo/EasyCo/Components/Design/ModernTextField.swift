import SwiftUI

// MARK: - Modern Text Field Component

/// Modern text field matching web app design
struct ModernTextField: View {
    let placeholder: String
    @Binding var text: String
    let icon: String?
    let isSecure: Bool
    let keyboardType: UIKeyboardType
    let autocapitalization: TextInputAutocapitalization
    let error: String?
    let role: UserType?

    @FocusState private var isFocused: Bool
    @State private var isPasswordVisible = false

    init(
        _ placeholder: String,
        text: Binding<String>,
        icon: String? = nil,
        isSecure: Bool = false,
        keyboardType: UIKeyboardType = .default,
        autocapitalization: TextInputAutocapitalization = .sentences,
        error: String? = nil,
        role: UserType? = nil
    ) {
        self.placeholder = placeholder
        self._text = text
        self.icon = icon
        self.isSecure = isSecure
        self.keyboardType = keyboardType
        self.autocapitalization = autocapitalization
        self.error = error
        self.role = role
    }

    var body: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._1) {
            HStack(spacing: Theme.Spacing._3) {
                // Leading icon
                if let icon = icon {
                    Image(systemName: icon)
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(iconColor)
                }

                // Text field
                Group {
                    if isSecure && !isPasswordVisible {
                        SecureField(placeholder, text: $text)
                            .textContentType(.password)
                    } else {
                        TextField(placeholder, text: $text)
                            .keyboardType(keyboardType)
                            .textInputAutocapitalization(autocapitalization)
                    }
                }
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textPrimary)
                .focused($isFocused)

                // Password visibility toggle
                if isSecure {
                    Button(action: {
                        isPasswordVisible.toggle()
                    }) {
                        Image(systemName: isPasswordVisible ? "eye.slash.fill" : "eye.fill")
                            .font(.system(size: 16, weight: .medium))
                            .foregroundColor(Theme.GrayColors._500)
                    }
                }

                // Clear button
                if !text.isEmpty && isFocused && !isSecure {
                    Button(action: {
                        text = ""
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 16, weight: .medium))
                            .foregroundColor(Theme.GrayColors._400)
                    }
                }
            }
            .padding(.horizontal, Theme.Spacing._4)
            .frame(height: 48)
            .background(Color.white)
            .cornerRadius(Theme.CornerRadius.full)
            .overlay(
                RoundedRectangle(cornerRadius: Theme.CornerRadius.full)
                    .stroke(borderColor, lineWidth: 2)
            )
            .animation(Theme.Animations.fast, value: isFocused)
            .animation(Theme.Animations.fast, value: error)

            // Error message
            if let error = error {
                HStack(spacing: Theme.Spacing._1) {
                    Image(systemName: "exclamationmark.circle.fill")
                        .font(.system(size: 12))
                    Text(error)
                        .font(Theme.Typography.caption())
                }
                .foregroundColor(Theme.SemanticColors.error)
                .padding(.leading, Theme.Spacing._4)
            }
        }
    }

    private var iconColor: Color {
        if error != nil {
            return Theme.SemanticColors.error
        }
        if isFocused {
            return role != nil ? roleColor : Theme.OwnerColors._500
        }
        return Theme.GrayColors._500
    }

    private var borderColor: Color {
        if error != nil {
            return Theme.SemanticColors.error
        }
        if isFocused {
            return role != nil ? roleColor : Theme.OwnerColors._500
        }
        return Theme.GrayColors._300
    }

    private var roleColor: Color {
        guard let role = role else { return Theme.OwnerColors._500 }
        switch role {
        case .searcher: return Theme.SearcherColors._500
        case .owner: return Theme.OwnerColors._500
        case .resident: return Theme.ResidentColors._500
        }
    }
}

// MARK: - Modern Text Area

struct ModernTextArea: View {
    let placeholder: String
    @Binding var text: String
    let minHeight: CGFloat
    let error: String?
    let role: UserType?

    @FocusState private var isFocused: Bool

    init(
        _ placeholder: String,
        text: Binding<String>,
        minHeight: CGFloat = 100,
        error: String? = nil,
        role: UserType? = nil
    ) {
        self.placeholder = placeholder
        self._text = text
        self.minHeight = minHeight
        self.error = error
        self.role = role
    }

    var body: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._1) {
            ZStack(alignment: .topLeading) {
                // Placeholder
                if text.isEmpty {
                    Text(placeholder)
                        .font(Theme.Typography.body())
                        .foregroundColor(Theme.GrayColors._500)
                        .padding(.horizontal, Theme.Spacing._4)
                        .padding(.vertical, Theme.Spacing._3)
                }

                // Text Editor
                TextEditor(text: $text)
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textPrimary)
                    .focused($isFocused)
                    .scrollContentBackground(.hidden)
                    .padding(.horizontal, Theme.Spacing._3)
                    .padding(.vertical, Theme.Spacing._2)
            }
            .frame(minHeight: minHeight)
            .background(Color.white)
            .cornerRadius(Theme.CornerRadius.lg)
            .overlay(
                RoundedRectangle(cornerRadius: Theme.CornerRadius.lg)
                    .stroke(borderColor, lineWidth: 2)
            )
            .animation(Theme.Animations.fast, value: isFocused)

            // Error message
            if let error = error {
                HStack(spacing: Theme.Spacing._1) {
                    Image(systemName: "exclamationmark.circle.fill")
                        .font(.system(size: 12))
                    Text(error)
                        .font(Theme.Typography.caption())
                }
                .foregroundColor(Theme.SemanticColors.error)
                .padding(.leading, Theme.Spacing._4)
            }
        }
    }

    private var borderColor: Color {
        if error != nil {
            return Theme.SemanticColors.error
        }
        if isFocused {
            return role != nil ? roleColor : Theme.OwnerColors._500
        }
        return Theme.GrayColors._300
    }

    private var roleColor: Color {
        guard let role = role else { return Theme.OwnerColors._500 }
        switch role {
        case .searcher: return Theme.SearcherColors._500
        case .owner: return Theme.OwnerColors._500
        case .resident: return Theme.ResidentColors._500
        }
    }
}

// MARK: - Search Field

struct SearchField: View {
    @Binding var text: String
    let placeholder: String
    let onSubmit: (() -> Void)?

    @FocusState private var isFocused: Bool

    init(
        text: Binding<String>,
        placeholder: String = "Rechercher...",
        onSubmit: (() -> Void)? = nil
    ) {
        self._text = text
        self.placeholder = placeholder
        self.onSubmit = onSubmit
    }

    var body: some View {
        HStack(spacing: Theme.Spacing._3) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(Theme.GrayColors._500)

            TextField(placeholder, text: $text)
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textPrimary)
                .focused($isFocused)
                .onSubmit {
                    onSubmit?()
                }

            if !text.isEmpty {
                Button(action: {
                    text = ""
                }) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(Theme.GrayColors._400)
                }
            }
        }
        .padding(.horizontal, Theme.Spacing._4)
        .frame(height: 44)
        .background(Theme.Colors.backgroundSecondary)
        .cornerRadius(Theme.CornerRadius.full)
        .overlay(
            RoundedRectangle(cornerRadius: Theme.CornerRadius.full)
                .stroke(isFocused ? Theme.OwnerColors._500 : Color.clear, lineWidth: 2)
        )
        .animation(Theme.Animations.fast, value: isFocused)
    }
}

// MARK: - Previews

struct ModernTextField_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: Theme.Spacing._4) {
            // Standard text field
            ModernTextField("Email", text: .constant(""), icon: "envelope.fill", keyboardType: .emailAddress)

            // Password field
            ModernTextField("Mot de passe", text: .constant(""), icon: "lock.fill", isSecure: true)

            // Error state
            ModernTextField("Email", text: .constant("invalid@"), icon: "envelope.fill", error: "Email invalide")

            // With role color
            ModernTextField("Message", text: .constant(""), icon: "message.fill", role: .searcher)

            // Text area
            ModernTextArea("Description", text: .constant(""))

            // Search field
            SearchField(text: .constant(""))
            SearchField(text: .constant("Recherche active"))
        }
        .padding()
        .background(Theme.Colors.backgroundSecondary)
    }
}
