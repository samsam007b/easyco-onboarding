import SwiftUI

// MARK: - Notification Settings View

struct NotificationSettingsView: View {
    @StateObject private var viewModel = NotificationSettingsViewModel()
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: Theme.Spacing._6) {
                    // Permission Status
                    if !viewModel.hasPermission {
                        permissionBanner
                    }

                    // Push Notifications Toggle
                    generalSettingsSection

                    // Notification Types
                    notificationTypesSection

                    // Quiet Hours
                    quietHoursSection

                    // Communication Preferences
                    communicationSection
                }
                .padding(Theme.Spacing._4)
            }
            .background(Theme.Colors.backgroundSecondary)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Paramètres notifications")
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Fermer") {
                        dismiss()
                    }
                    .font(Theme.Typography.bodySmall(.medium))
                    .foregroundColor(Theme.ResidentColors._600)
                }
            }
        }
    }

    // MARK: - Permission Banner

    private var permissionBanner: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._3) {
            HStack(spacing: Theme.Spacing._3) {
                Image(systemName: "bell.badge.fill")
                    .font(.system(size: 24, weight: .semibold))
                    .foregroundColor(.white)

                VStack(alignment: .leading, spacing: Theme.Spacing._1) {
                    Text("Activez les notifications")
                        .font(Theme.Typography.bodySmall(.semibold))
                        .foregroundColor(.white)

                    Text("Ne manquez aucune mise à jour importante")
                        .font(Theme.Typography.caption())
                        .foregroundColor(.white.opacity(0.9))
                }

                Spacer()
            }

            Button(action: {
                Task { await viewModel.requestPermission() }
            }) {
                Text("Activer")
                    .font(Theme.Typography.bodySmall(.semibold))
                    .foregroundColor(Theme.ResidentColors._600)
                    .padding(.horizontal, Theme.Spacing._5)
                    .padding(.vertical, Theme.Spacing._3)
                    .background(Color.white)
                    .cornerRadius(Theme.CornerRadius.lg)
            }
        }
        .padding(Theme.Spacing._5)
        .background(
            LinearGradient(
                colors: [
                    Theme.ResidentColors._600,
                    Theme.ResidentColors._600.opacity(0.8)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .cornerRadius(Theme.CornerRadius.xl)
    }

    // MARK: - General Settings

    private var generalSettingsSection: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._4) {
            Text("Général")
                .font(Theme.Typography.bodySmall(.semibold))
                .foregroundColor(Theme.Colors.textSecondary)
                .textCase(.uppercase)
                .padding(.horizontal, Theme.Spacing._2)

            VStack(spacing: 0) {
                NotificationToggleRow(
                    icon: "bell.fill",
                    title: "Notifications push",
                    subtitle: "Recevoir des notifications push",
                    isOn: $viewModel.pushEnabled,
                    color: Color(hex: "3B82F6")
                )

                Divider()
                    .padding(.leading, Theme.Spacing._16)

                NotificationToggleRow(
                    icon: "app.badge.fill",
                    title: "Notifications dans l'app",
                    subtitle: "Afficher les notifications dans l'application",
                    isOn: $viewModel.inAppEnabled,
                    color: Color(hex: "8B5CF6")
                )
            }
            .background(Color.white)
            .cornerRadius(Theme.CornerRadius.xl)
            .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        }
    }

    // MARK: - Notification Types

    private var notificationTypesSection: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._4) {
            Text("Types de notifications")
                .font(Theme.Typography.bodySmall(.semibold))
                .foregroundColor(Theme.Colors.textSecondary)
                .textCase(.uppercase)
                .padding(.horizontal, Theme.Spacing._2)

            VStack(spacing: 0) {
                NotificationToggleRow(
                    icon: "envelope.fill",
                    title: "Messages",
                    subtitle: "Nouveaux messages et réponses",
                    isOn: $viewModel.messagesEnabled,
                    color: Color(hex: "3B82F6")
                )

                Divider().padding(.leading, Theme.Spacing._16)

                NotificationToggleRow(
                    icon: "house.fill",
                    title: "Propriétés",
                    subtitle: "Mises à jour de propriétés",
                    isOn: $viewModel.propertyUpdatesEnabled,
                    color: Color(hex: "10B981")
                )

                Divider().padding(.leading, Theme.Spacing._16)

                NotificationToggleRow(
                    icon: "person.badge.plus",
                    title: "Candidatures",
                    subtitle: "Nouvelles candidatures et changements",
                    isOn: $viewModel.applicationsEnabled,
                    color: Color(hex: "8B5CF6")
                )

                Divider().padding(.leading, Theme.Spacing._16)

                NotificationToggleRow(
                    icon: "list.bullet.circle.fill",
                    title: "Tâches",
                    subtitle: "Assignations et rappels de tâches",
                    isOn: $viewModel.tasksEnabled,
                    color: Color(hex: "EC4899")
                )

                Divider().padding(.leading, Theme.Spacing._16)

                NotificationToggleRow(
                    icon: "cart.fill",
                    title: "Dépenses",
                    subtitle: "Nouvelles dépenses partagées",
                    isOn: $viewModel.expensesEnabled,
                    color: Color(hex: "06B6D4")
                )

                Divider().padding(.leading, Theme.Spacing._16)

                NotificationToggleRow(
                    icon: "bell.badge.fill",
                    title: "Paiements",
                    subtitle: "Rappels de paiement",
                    isOn: $viewModel.paymentsEnabled,
                    color: Color(hex: "EF4444")
                )

                Divider().padding(.leading, Theme.Spacing._16)

                NotificationToggleRow(
                    icon: "person.2.fill",
                    title: "Colocation",
                    subtitle: "Invitations et événements",
                    isOn: $viewModel.householdEnabled,
                    color: Color(hex: "14B8A6")
                )

                Divider().padding(.leading, Theme.Spacing._16)

                NotificationToggleRow(
                    icon: "megaphone.fill",
                    title: "Système",
                    subtitle: "Annonces et mises à jour",
                    isOn: $viewModel.systemEnabled,
                    color: Color(hex: "6366F1")
                )
            }
            .background(Color.white)
            .cornerRadius(Theme.CornerRadius.xl)
            .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        }
    }

    // MARK: - Quiet Hours

    private var quietHoursSection: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._4) {
            Text("Heures silencieuses")
                .font(Theme.Typography.bodySmall(.semibold))
                .foregroundColor(Theme.Colors.textSecondary)
                .textCase(.uppercase)
                .padding(.horizontal, Theme.Spacing._2)

            VStack(spacing: 0) {
                NotificationToggleRow(
                    icon: "moon.fill",
                    title: "Activer les heures silencieuses",
                    subtitle: "Pas de notifications pendant ces heures",
                    isOn: $viewModel.quietHoursEnabled,
                    color: Color(hex: "8B5CF6")
                )

                if viewModel.quietHoursEnabled {
                    Divider().padding(.leading, Theme.Spacing._16)

                    HStack(spacing: Theme.Spacing._4) {
                        Image(systemName: "sunset.fill")
                            .font(.system(size: 20, weight: .semibold))
                            .foregroundColor(Color(hex: "F59E0B"))
                            .frame(width: 40, height: 40)
                            .background(Color(hex: "F59E0B").opacity(0.1))
                            .cornerRadius(Theme.CornerRadius.lg)

                        VStack(alignment: .leading, spacing: Theme.Spacing._1) {
                            Text("Début")
                                .font(Theme.Typography.caption(.medium))
                                .foregroundColor(Theme.Colors.textSecondary)

                            Text(viewModel.quietHoursStart)
                                .font(Theme.Typography.bodySmall(.semibold))
                                .foregroundColor(Theme.Colors.textPrimary)
                        }

                        Spacer()

                        Text("→")
                            .foregroundColor(Theme.Colors.textTertiary)

                        VStack(alignment: .leading, spacing: Theme.Spacing._1) {
                            Text("Fin")
                                .font(Theme.Typography.caption(.medium))
                                .foregroundColor(Theme.Colors.textSecondary)

                            Text(viewModel.quietHoursEnd)
                                .font(Theme.Typography.bodySmall(.semibold))
                                .foregroundColor(Theme.Colors.textPrimary)
                        }
                    }
                    .padding(Theme.Spacing._4)
                }
            }
            .background(Color.white)
            .cornerRadius(Theme.CornerRadius.xl)
            .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        }
    }

    // MARK: - Communication Preferences

    private var communicationSection: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._4) {
            Text("Canaux de communication")
                .font(Theme.Typography.bodySmall(.semibold))
                .foregroundColor(Theme.Colors.textSecondary)
                .textCase(.uppercase)
                .padding(.horizontal, Theme.Spacing._2)

            VStack(spacing: 0) {
                NotificationToggleRow(
                    icon: "envelope.badge.fill",
                    title: "Email",
                    subtitle: "Recevoir aussi des emails",
                    isOn: $viewModel.emailEnabled,
                    color: Color(hex: "3B82F6")
                )
            }
            .background(Color.white)
            .cornerRadius(Theme.CornerRadius.xl)
            .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        }
    }
}

// MARK: - Notification Toggle Row

private struct NotificationToggleRow: View {
    let icon: String
    let title: String
    let subtitle: String
    @Binding var isOn: Bool
    let color: Color

    var body: some View {
        HStack(spacing: Theme.Spacing._4) {
            Image(systemName: icon)
                .font(.system(size: 20, weight: .semibold))
                .foregroundColor(color)
                .frame(width: 40, height: 40)
                .background(color.opacity(0.1))
                .cornerRadius(Theme.CornerRadius.lg)

            VStack(alignment: .leading, spacing: Theme.Spacing._1) {
                Text(title)
                    .font(Theme.Typography.bodySmall(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(subtitle)
                    .font(Theme.Typography.caption())
                    .foregroundColor(Theme.Colors.textSecondary)
            }

            Spacer()

            Toggle("", isOn: $isOn)
                .labelsHidden()
        }
        .padding(Theme.Spacing._4)
    }
}

// MARK: - View Model

@MainActor
class NotificationSettingsViewModel: ObservableObject {
    @Published var pushEnabled: Bool
    @Published var emailEnabled: Bool
    @Published var inAppEnabled: Bool

    @Published var messagesEnabled: Bool
    @Published var propertyUpdatesEnabled: Bool
    @Published var applicationsEnabled: Bool
    @Published var tasksEnabled: Bool
    @Published var expensesEnabled: Bool
    @Published var paymentsEnabled: Bool
    @Published var householdEnabled: Bool
    @Published var systemEnabled: Bool

    @Published var quietHoursEnabled: Bool
    @Published var quietHoursStart: String
    @Published var quietHoursEnd: String

    @Published var hasPermission: Bool = false

    private let notificationService = NotificationService.shared
    private let pushService = PushNotificationService.shared

    init() {
        let prefs = notificationService.preferences

        pushEnabled = prefs.pushEnabled
        emailEnabled = prefs.emailEnabled
        inAppEnabled = prefs.inAppEnabled

        messagesEnabled = prefs.messagesEnabled
        propertyUpdatesEnabled = prefs.propertyUpdatesEnabled
        applicationsEnabled = prefs.applicationsEnabled
        tasksEnabled = prefs.tasksEnabled
        expensesEnabled = prefs.expensesEnabled
        paymentsEnabled = prefs.paymentsEnabled
        householdEnabled = prefs.householdEnabled
        systemEnabled = prefs.systemEnabled

        quietHoursEnabled = prefs.quietHoursEnabled
        quietHoursStart = prefs.quietHoursStart
        quietHoursEnd = prefs.quietHoursEnd

        hasPermission = pushService.hasPermission

        // Observe changes and save
        observeChanges()
    }

    private func observeChanges() {
        // Save preferences whenever any setting changes
        Task {
            for await _ in NotificationCenter.default.notifications(named: UIApplication.willResignActiveNotification) {
                await savePreferences()
            }
        }
    }

    func requestPermission() async {
        let granted = await pushService.requestPermission()
        hasPermission = granted
    }

    private func savePreferences() async {
        let newPreferences = NotificationPreferences(
            messagesEnabled: messagesEnabled,
            propertyUpdatesEnabled: propertyUpdatesEnabled,
            applicationsEnabled: applicationsEnabled,
            tasksEnabled: tasksEnabled,
            expensesEnabled: expensesEnabled,
            paymentsEnabled: paymentsEnabled,
            householdEnabled: householdEnabled,
            systemEnabled: systemEnabled,
            pushEnabled: pushEnabled,
            emailEnabled: emailEnabled,
            inAppEnabled: inAppEnabled,
            quietHoursEnabled: quietHoursEnabled,
            quietHoursStart: quietHoursStart,
            quietHoursEnd: quietHoursEnd
        )

        await notificationService.savePreferences(newPreferences)
    }
}

// MARK: - Preview

struct NotificationSettingsView_Previews: PreviewProvider {
    static var previews: some View {
        NotificationSettingsView()
    }
}
