import SwiftUI

// MARK: - Search Bar

struct SearchBar: View {
    @Binding var text: String
    var placeholder: String = "Rechercher..."
    var onCommit: (() -> Void)?

    @FocusState private var isFocused: Bool

    var body: some View {
        HStack(spacing: Theme.Spacing.sm) {
            Image(systemName: "magnifyingglass")
                .foregroundColor(Theme.Colors.textSecondary)

            TextField(placeholder, text: $text, onCommit: {
                onCommit?()
            })
            .focused($isFocused)
            .font(Theme.Typography.body())
            .foregroundColor(Theme.Colors.textPrimary)
            .autocapitalization(.none)
            .disableAutocorrection(true)

            if !text.isEmpty {
                Button(action: {
                    text = ""
                    isFocused = false
                }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }
        }
        .padding(Theme.Spacing.sm)
        .background(Theme.Colors.backgroundSecondary)
        .cornerRadius(Theme.CornerRadius.md)
    }
}

// MARK: - Preview

