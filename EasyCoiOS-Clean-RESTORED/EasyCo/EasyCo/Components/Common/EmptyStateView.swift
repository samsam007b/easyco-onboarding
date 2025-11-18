import SwiftUI

// MARK: - Empty State View

struct EmptyStateView: View {
    let icon: String
    let title: String
    let message: String
    var actionTitle: String?
    var action: (() -> Void)?

    var body: some View {
        VStack(spacing: Theme.Spacing.lg) {
            Image(systemName: icon)
                .font(.system(size: 60))
                .foregroundColor(Theme.Colors.textTertiary)

            VStack(spacing: Theme.Spacing.sm) {
                Text(title)
                    .font(Theme.Typography.title2())
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(message)
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
            }

            if let actionTitle = actionTitle, let action = action {
                Button(action: action) {
                    Text(actionTitle)
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
        .background(Theme.Colors.backgroundSecondary)
    }
}

// MARK: - Presets

extension EmptyStateView {
    static func noProperties(action: @escaping () -> Void) -> EmptyStateView {
        EmptyStateView(
            icon: "house.slash",
            title: "Aucune propriété",
            message: "Aucune propriété ne correspond à vos critères. Essayez de modifier vos filtres.",
            actionTitle: "Modifier les filtres",
            action: action
        )
    }

    static func noFavorites() -> EmptyStateView {
        EmptyStateView(
            icon: "heart.slash",
            title: "Aucun favori",
            message: "Vous n'avez pas encore de propriétés favorites. Explorez les propriétés et ajoutez celles qui vous plaisent."
        )
    }

    static func noMessages() -> EmptyStateView {
        EmptyStateView(
            icon: "message",
            title: "Aucun message",
            message: "Vous n'avez pas encore de conversations. Contactez un propriétaire pour commencer."
        )
    }

    static func noGroups(action: @escaping () -> Void) -> EmptyStateView {
        EmptyStateView(
            icon: "person.3",
            title: "Aucun groupe",
            message: "Rejoignez un groupe existant ou créez le vôtre pour trouver des colocataires.",
            actionTitle: "Créer un groupe",
            action: action
        )
    }
}

// MARK: - Preview

