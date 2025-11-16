import SwiftUI

// MARK: - Loading View

struct LoadingView: View {
    var message: String = "Chargement..."
    var showMessage: Bool = true

    var body: some View {
        VStack(spacing: Theme.Spacing.md) {
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: Theme.Colors.primary))
                .scaleEffect(1.5)

            if showMessage {
                Text(message)
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Theme.Colors.background)
    }
}

// MARK: - Inline Loading View

struct InlineLoadingView: View {
    var body: some View {
        HStack {
            Spacer()
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: Theme.Colors.primary))
            Spacer()
        }
        .padding()
    }
}

// MARK: - Preview

#Preview {
    LoadingView()
}
