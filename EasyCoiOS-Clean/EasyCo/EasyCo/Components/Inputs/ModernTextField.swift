//
//  ModernTextField.swift
//  EasyCo
//
//  Modern text input field component
//

import SwiftUI

struct ModernTextField: View {
    let placeholder: String
    @Binding var text: String
    var icon: String? = nil
    var keyboardType: UIKeyboardType = .default
    var isSecure: Bool = false
    var errorMessage: String? = nil
    var onCommit: (() -> Void)? = nil

    @State private var isSecureVisible = false
    @FocusState private var isFocused: Bool

    private var hasError: Bool {
        errorMessage != nil && !errorMessage!.isEmpty
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 12) {
                // Leading icon
                if let icon = icon {
                    Image.lucide(icon)
                        .resizable()
                        .scaledToFit()
                        .frame(width: Theme.Size.iconMedium, height: Theme.Size.iconMedium)
                        .foregroundColor(hasError ? Theme.Colors.error : (isFocused ? Theme.Colors.primary : Theme.Colors.gray400))
                }

                // Text field
                Group {
                    if isSecure && !isSecureVisible {
                        SecureField(placeholder, text: $text)
                            .focused($isFocused)
                    } else {
                        TextField(placeholder, text: $text)
                            .keyboardType(keyboardType)
                            .focused($isFocused)
                            .onSubmit {
                                onCommit?()
                            }
                    }
                }
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textPrimary)
                .accentColor(Theme.Colors.primary)

                // Trailing actions
                HStack(spacing: 8) {
                    // Clear button
                    if !text.isEmpty && isFocused {
                        Button(action: {
                            text = ""
                        }) {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(Theme.Colors.gray400)
                                .frame(width: 20, height: 20)
                        }
                    }

                    // Show/hide password
                    if isSecure {
                        Button(action: {
                            isSecureVisible.toggle()
                        }) {
                            Image(systemName: isSecureVisible ? "eye.slash.fill" : "eye.fill")
                                .foregroundColor(Theme.Colors.gray400)
                                .frame(width: 20, height: 20)
                        }
                    }
                }
            }
            .padding(.horizontal, Theme.Spacing.lg)
            .frame(height: Theme.Size.inputHeight)
            .background(isFocused ? Theme.Colors.backgroundPrimary : Theme.Colors.gray50)
            .overlay(
                RoundedRectangle(cornerRadius: Theme.CornerRadius.input)
                    .stroke(
                        hasError ? Theme.Colors.error :
                        (isFocused ? Theme.Colors.primary : Color.clear),
                        lineWidth: isFocused || hasError ? 2 : 0
                    )
            )
            .cornerRadius(Theme.CornerRadius.input)
            .animation(Theme.Animation.springFast, value: isFocused)
            .animation(Theme.Animation.springFast, value: hasError)

            // Error message
            if let errorMessage = errorMessage, !errorMessage.isEmpty {
                HStack(spacing: 6) {
                    Image(systemName: "exclamationmark.circle.fill")
                        .font(.system(size: 12))
                        .foregroundColor(Theme.Colors.error)

                    Text(errorMessage)
                        .font(Theme.Typography.bodySmall(.medium))
                        .foregroundColor(Theme.Colors.error)
                }
                .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
    }
}

// MARK: - Preview

struct ModernTextField_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 24) {
            ModernTextField(
                placeholder: "Email",
                text: .constant(""),
                icon: "mail",
                keyboardType: .emailAddress
            )

            ModernTextField(
                placeholder: "Mot de passe",
                text: .constant(""),
                icon: "lock",
                isSecure: true
            )

            ModernTextField(
                placeholder: "Téléphone",
                text: .constant("+33 6 12 34 56 78"),
                icon: "phone",
                keyboardType: .phonePad
            )

            ModernTextField(
                placeholder: "Prénom",
                text: .constant(""),
                icon: "user",
                errorMessage: "Ce champ est requis"
            )

            ModernTextField(
                placeholder: "Rechercher...",
                text: .constant(""),
                icon: "search"
            )
        }
        .padding()
    }
}
