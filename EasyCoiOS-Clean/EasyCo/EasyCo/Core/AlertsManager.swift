import Foundation
import Combine

// MARK: - Alerts Manager

@MainActor
class AlertsManager: ObservableObject {
    static let shared = AlertsManager()

    @Published var alerts: [Alert] = []
    @Published var preferences: AlertPreferences?
    @Published var isLoading = false
    @Published var error: Error?

    private let apiClient = APIClient.shared
    private var cancellables = Set<AnyCancellable>()

    private init() {
        // Load alerts on initialization
        Task {
            await loadAlerts()
            await loadPreferences()
        }
    }

    // MARK: - Load Data

    func loadAlerts() async {
        isLoading = true
        defer { isLoading = false }

        do {
            // TODO: Replace with actual API call
            // alerts = try await apiClient.getAlerts()

            // For now, use mock data
            try await Task.sleep(nanoseconds: 500_000_000) // Simulate network delay
            alerts = Alert.mockAlerts

            print("✅ Loaded \(alerts.count) alerts")
        } catch {
            self.error = error
            print("❌ Error loading alerts: \(error)")
        }
    }

    func loadPreferences() async {
        do {
            // TODO: Replace with actual API call
            // preferences = try await apiClient.getAlertPreferences()

            // For now, use mock data
            preferences = AlertPreferences.mock

            print("✅ Loaded alert preferences")
        } catch {
            self.error = error
            print("❌ Error loading alert preferences: \(error)")
        }
    }

    // MARK: - Create Alert

    func createAlert(type: AlertType, title: String, criteria: AlertCriteria, frequency: AlertFrequency) async -> Bool {
        do {
            let newAlert = Alert(
                id: UUID(),
                userID: UUID(), // TODO: Use actual user ID
                type: type,
                title: title,
                criteria: criteria,
                isActive: true,
                frequency: frequency,
                lastTriggered: nil,
                triggerCount: 0,
                createdAt: Date(),
                updatedAt: Date()
            )

            // TODO: Replace with actual API call
            // let createdAlert = try await apiClient.createAlert(newAlert)

            // For now, add to local array
            alerts.append(newAlert)

            print("✅ Created alert: \(title)")
            return true
        } catch {
            self.error = error
            print("❌ Error creating alert: \(error)")
            return false
        }
    }

    // MARK: - Update Alert

    func updateAlert(_ alert: Alert) async -> Bool {
        do {
            // TODO: Replace with actual API call
            // try await apiClient.updateAlert(alert)

            // For now, update local array
            if let index = alerts.firstIndex(where: { $0.id == alert.id }) {
                alerts[index] = alert
            }

            print("✅ Updated alert: \(alert.title)")
            return true
        } catch {
            self.error = error
            print("❌ Error updating alert: \(error)")
            return false
        }
    }

    // MARK: - Delete Alert

    func deleteAlert(_ alert: Alert) async -> Bool {
        do {
            // TODO: Replace with actual API call
            // try await apiClient.deleteAlert(id: alert.id.uuidString)

            // For now, remove from local array
            alerts.removeAll { $0.id == alert.id }

            print("✅ Deleted alert: \(alert.title)")
            return true
        } catch {
            self.error = error
            print("❌ Error deleting alert: \(error)")
            return false
        }
    }

    // MARK: - Toggle Alert

    func toggleAlert(_ alert: Alert) async {
        var updatedAlert = alert
        updatedAlert.isActive.toggle()
        updatedAlert.updatedAt = Date()

        _ = await updateAlert(updatedAlert)
    }

    // MARK: - Update Preferences

    func updatePreferences(_ newPreferences: AlertPreferences) async -> Bool {
        do {
            // TODO: Replace with actual API call
            // try await apiClient.updateAlertPreferences(newPreferences)

            // For now, update local preferences
            preferences = newPreferences

            print("✅ Updated alert preferences")
            return true
        } catch {
            self.error = error
            print("❌ Error updating preferences: \(error)")
            return false
        }
    }

    // MARK: - Check Property Against Alerts

    func checkPropertyAgainstAlerts(_ property: Property) async -> [Alert] {
        let matchingAlerts = alerts.filter { alert in
            guard alert.isActive else { return false }
            guard alert.type == .newProperty || alert.type == .savedSearch else { return false }
            return alert.criteria.matches(property: property)
        }

        // Trigger notifications for matching alerts
        for alert in matchingAlerts {
            await triggerAlert(alert, for: property)
        }

        return matchingAlerts
    }

    // MARK: - Trigger Alert

    private func triggerAlert(_ alert: Alert, for property: Property) async {
        var updatedAlert = alert
        updatedAlert.lastTriggered = Date()
        updatedAlert.triggerCount += 1

        _ = await updateAlert(updatedAlert)

        // Send push notification if enabled
        if let preferences = preferences, preferences.pushNotificationsEnabled {
            await sendPushNotification(for: alert, property: property)
        }
    }

    private func sendPushNotification(for alert: Alert, property: Property) async {
        // TODO: Implement push notification via NotificationManager
        print("🔔 Sending push notification for alert: \(alert.title)")
        print("   Property: \(property.title)")
    }

    // MARK: - Helper Methods

    var activeAlertsCount: Int {
        alerts.filter { $0.isActive }.count
    }

    var inactiveAlertsCount: Int {
        alerts.filter { !$0.isActive }.count
    }

    func alertsByType(_ type: AlertType) -> [Alert] {
        alerts.filter { $0.type == type }
    }
}
