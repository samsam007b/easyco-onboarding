import Foundation
import UserNotifications
import SwiftUI

// MARK: - Notification Manager

class NotificationManager: NSObject, ObservableObject {
    static let shared = NotificationManager()

    @Published var hasNotificationPermission = false
    @Published var unreadNotificationsCount = 0

    private let center = UNUserNotificationCenter.current()

    override private init() {
        super.init()
        center.delegate = self
        checkPermissionStatus()
    }

    // MARK: - Permission

    func requestPermission() async -> Bool {
        do {
            let granted = try await center.requestAuthorization(options: [.alert, .badge, .sound])
            await MainActor.run {
                hasNotificationPermission = granted
            }
            return granted
        } catch {
            print("Error requesting notification permission: \(error)")
            return false
        }
    }

    func checkPermissionStatus() {
        center.getNotificationSettings { settings in
            DispatchQueue.main.async {
                self.hasNotificationPermission = settings.authorizationStatus == .authorized
            }
        }
    }

    // MARK: - Local Notifications

    func scheduleNotification(
        id: String,
        title: String,
        body: String,
        timeInterval: TimeInterval = 5,
        badge: Int? = nil,
        data: [String: Any]? = nil
    ) {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = .default

        if let badge = badge {
            content.badge = NSNumber(value: badge)
        }

        if let data = data {
            content.userInfo = data
        }

        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: timeInterval, repeats: false)
        let request = UNNotificationRequest(identifier: id, content: content, trigger: trigger)

        center.add(request) { error in
            if let error = error {
                print("Error scheduling notification: \(error)")
            }
        }
    }

    func scheduleNewMatchNotification(propertyTitle: String, score: Int) {
        scheduleNotification(
            id: "match_\(UUID().uuidString)",
            title: "🎯 Nouveau Match !",
            body: "\(score)% compatible avec \(propertyTitle)",
            badge: unreadNotificationsCount + 1,
            data: ["type": "match", "propertyTitle": propertyTitle]
        )
    }

    func scheduleNewMessageNotification(senderName: String, preview: String) {
        scheduleNotification(
            id: "message_\(UUID().uuidString)",
            title: "💬 \(senderName)",
            body: preview,
            badge: unreadNotificationsCount + 1,
            data: ["type": "message", "senderName": senderName]
        )
    }

    func scheduleApplicationStatusNotification(propertyTitle: String, status: String) {
        let emoji: String
        switch status {
        case "accepted": emoji = "✅"
        case "rejected": emoji = "❌"
        case "reviewing": emoji = "👀"
        default: emoji = "📄"
        }

        scheduleNotification(
            id: "application_\(UUID().uuidString)",
            title: "\(emoji) Candidature mise à jour",
            body: "Votre candidature pour \(propertyTitle) : \(status)",
            badge: unreadNotificationsCount + 1,
            data: ["type": "application", "propertyTitle": propertyTitle]
        )
    }

    func scheduleGroupActivityNotification(groupName: String, activity: String) {
        scheduleNotification(
            id: "group_\(UUID().uuidString)",
            title: "👥 \(groupName)",
            body: activity,
            badge: unreadNotificationsCount + 1,
            data: ["type": "group", "groupName": groupName]
        )
    }

    // MARK: - Badge Management

    func updateBadgeCount(_ count: Int) {
        unreadNotificationsCount = count
        UNUserNotificationCenter.current().setBadgeCount(count)
    }

    func incrementBadge() {
        updateBadgeCount(unreadNotificationsCount + 1)
    }

    func decrementBadge() {
        updateBadgeCount(max(0, unreadNotificationsCount - 1))
    }

    func clearBadge() {
        updateBadgeCount(0)
    }

    // MARK: - Clear Notifications

    func clearAll() {
        center.removeAllPendingNotificationRequests()
        center.removeAllDeliveredNotifications()
        clearBadge()
    }

    func clearNotification(withId id: String) {
        center.removePendingNotificationRequests(withIdentifiers: [id])
        center.removeDeliveredNotifications(withIdentifiers: [id])
    }
}

// MARK: - UNUserNotificationCenterDelegate

extension NotificationManager: UNUserNotificationCenterDelegate {
    // Handle notification when app is in foreground
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        // Show notification even when app is in foreground
        completionHandler([.banner, .sound, .badge])
    }

    // Handle notification tap
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        didReceive response: UNNotificationResponse,
        withCompletionHandler completionHandler: @escaping () -> Void
    ) {
        let userInfo = response.notification.request.content.userInfo

        // Handle different notification types
        if let type = userInfo["type"] as? String {
            handleNotificationTap(type: type, userInfo: userInfo)
        }

        completionHandler()
    }

    private func handleNotificationTap(type: String, userInfo: [AnyHashable: Any]) {
        // Post notification to navigate to appropriate view
        NotificationCenter.default.post(
            name: Notification.Name("NavigateToNotification"),
            object: nil,
            userInfo: ["type": type, "data": userInfo]
        )
    }
}

// MARK: - Notification Preferences

struct NotificationPreferences: Codable {
    var newMatches: Bool = true
    var newMessages: Bool = true
    var applicationUpdates: Bool = true
    var groupActivity: Bool = true
    var savedSearches: Bool = true

    enum CodingKeys: String, CodingKey {
        case newMatches = "new_matches"
        case newMessages = "new_messages"
        case applicationUpdates = "application_updates"
        case groupActivity = "group_activity"
        case savedSearches = "saved_searches"
    }

    func save() {
        if let encoded = try? JSONEncoder().encode(self) {
            UserDefaults.standard.set(encoded, forKey: "notification_preferences")
        }
    }

    static func load() -> NotificationPreferences {
        guard let data = UserDefaults.standard.data(forKey: "notification_preferences"),
              let preferences = try? JSONDecoder().decode(NotificationPreferences.self, from: data) else {
            return NotificationPreferences()
        }
        return preferences
    }
}

// MARK: - Demo Notifications (for testing)

extension NotificationManager {
    func scheduleDemoNotifications() {
        guard AppConfig.FeatureFlags.demoMode else { return }

        // Match notification (5s)
        scheduleNewMatchNotification(propertyTitle: "Studio Lumineux Centre", score: 94)

        // Message notification (10s)
        _Concurrency.Task {
            try? await _Concurrency.Task.sleep(nanoseconds: 10_000_000_000)
            await MainActor.run {
                scheduleNewMessageNotification(
                    senderName: "Jean Martin",
                    preview: "Bonjour, la visite est confirmée pour samedi 14h !"
                )
            }
        }

        // Application update (15s)
        _Concurrency.Task {
            try? await _Concurrency.Task.sleep(nanoseconds: 15_000_000_000)
            await MainActor.run {
                scheduleApplicationStatusNotification(
                    propertyTitle: "Colocation 3 Chambres",
                    status: "accepted"
                )
            }
        }

        // Group activity (20s)
        _Concurrency.Task {
            try? await _Concurrency.Task.sleep(nanoseconds: 20_000_000_000)
            await MainActor.run {
                scheduleGroupActivityNotification(
                    groupName: "Groupe Paris Centre",
                    activity: "Sophie a voté 👍 sur une nouvelle propriété"
                )
            }
        }
    }
}
