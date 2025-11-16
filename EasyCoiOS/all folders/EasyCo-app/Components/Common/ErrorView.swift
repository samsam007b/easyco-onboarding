import SwiftUI

// MARK: - Error View

struct ErrorView: View {
    let error: NetworkError
    var retryAction: (() -> Void)?

    var body: some View {
        VStack(spacing: Theme.Spacing.lg) {
            Image(systemName: errorIcon)
                .font(.system(size: 60))
                .foregroundColor(Theme.Colors.error)

            VStack(spacing: Theme.Spacing.sm) {
                Text(errorTitle)
                    .font(Theme.Typography.title2())
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(error.userMessage)
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
            }

            if let retryAction = retryAction, error.isRecoverable {
                Button(action: retryAction) {
                    HStack {
                        Image(systemName: "arrow.clockwise")
                        Text("Réessayer")
                    }
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Theme.Colors.primary)
                    .cornerRadius(Theme.CornerRadius.md)
                }
                .padding(.horizontal, Theme.Spacing.xl)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Theme.Colors.background)
    }

    private var errorIcon: String {
        switch error {
        case .networkUnavailable:
            return "wifi.slash"
        case .unauthorized:
            return "lock.shield"
        case .notFound:
            return "magnifyingglass"
        default:
            return "exclamationmark.triangle"
        }
    }

    private var errorTitle: String {
        switch error {
        case .networkUnavailable:
            return "Pas de connexion"
        case .unauthorized:
            return "Session expirée"
        case .notFound:
            return "Introuvable"
        default:
            return "Oups !"
        }
    }
}

// MARK: - Inline Error View

struct InlineErrorView: View {
    let message: String
    var retryAction: (() -> Void)?

    var body: some View {
        HStack(spacing: Theme.Spacing.sm) {
            Image(systemName: "exclamationmark.circle.fill")
                .foregroundColor(Theme.Colors.error)

            Text(message)
                .font(Theme.Typography.bodySmall())
                .foregroundColor(Theme.Colors.textSecondary)

            Spacer()

            if let retryAction = retryAction {
                Button("Réessayer") {
                    retryAction()
                }
                .font(Theme.Typography.bodySmall(.semibold))
                .foregroundColor(Theme.Colors.primary)
            }
        }
        .padding()
        .background(Theme.Colors.error.opacity(0.1))
        .cornerRadius(Theme.CornerRadius.sm)
    }
}

// MARK: - Preview

#Preview {
    ErrorView(error: .networkUnavailable) {
        print("Retry")
    }
}
