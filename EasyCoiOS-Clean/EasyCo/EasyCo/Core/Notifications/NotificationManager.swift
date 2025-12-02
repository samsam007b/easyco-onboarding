import Foundation
import UserNotifications
import SwiftUI
import UIKit

// MARK: - Notification Manager

@MainActor
class NotificationManager: NSObject, ObservableObject {
    static let shared = NotificationManager()

    @Published var hasNotificationPermission = false
    @Published var unreadNotificationsCount = 0
    @Published var deviceToken: String?
    @Published var authorizationStatus: UNAuthorizationStatus = .notDetermined

    private let center = UNUserNotificationCenter.current()

    override private init() {
        super.init()
        center.delegate = self
        checkPermissionStatus()
        registerNotificationCategories()
    }

    // MARK: - Permission

    func requestPermission() async -> Bool {
        do {
            let granted = try await center.requestAuthorization(options: [.alert, .badge, .sound])
            await MainActor.run {
                hasNotificationPermission = granted
                authorizationStatus = granted ? .authorized : .denied
            }

            if granted {
                await registerForRemoteNotifications()
            }

            return granted
        } catch {
            print("❌ Error requesting notification permission: \(error)")
            return false
        }
    }

    func checkPermissionStatus() {
        Task {
            let settings = await center.notificationSettings()
            await MainActor.run {
                hasNotificationPermission = settings.authorizationStatus == .authorized
                authorizationStatus = settings.authorizationStatus
            }
        }
    }

    // MARK: - APNs Registration

    /// Register for remote notifications with APNs
    private func registerForRemoteNotifications() async {
        await UIApplication.shared.registerForRemoteNotifications()
    }

    /// Handle successful device token registration (call from AppDelegate)
    func didRegisterForRemoteNotifications(withDeviceToken deviceToken: Data) {
        let tokenString = deviceToken.map { String(format: "%02.2hhx", $0) }.joined()

        Task { @MainActor in
            self.deviceToken = tokenString
            print("🔔 APNs Device Token: \(tokenString)")

            // Send token to Supabase backend
            await sendDeviceTokenToBackend(tokenString)
        }
    }

    /// Handle device token registration failure (call from AppDelegate)
    func didFailToRegisterForRemoteNotifications(withError error: Error) {
        print("❌ Failed to register for APNs: \(error.localizedDescription)")
    }

    /// Send device token to backend for push notification delivery
    private func sendDeviceTokenToBackend(_ token: String) async {
        guard let authToken = EasyCoKeychainManager.shared.getAuthToken() else {
            print("⚠️ No auth token - cannot save device token")
            return
        }

        // TODO: Re-enable when APIClient and SupabaseClient are fully implemented
        // For now, just log the token
        print("📱 Device token received: \(token)")
        print("⚠️ Token saving to backend disabled (stub mode)")

        /*
        do {
            let userId = try APIClient.shared.getUserIdFromToken(authToken)

            struct DeviceTokenPayload: Codable {
                let deviceToken: String
                let platform: String
                let updatedAt: String

                enum CodingKeys: String, CodingKey {
                    case deviceToken = "device_token"
                    case platform
                    case updatedAt = "updated_at"
                }
            }

            let payload = DeviceTokenPayload(
                deviceToken: token,
                platform: "ios",
                updatedAt: ISO8601DateFormatter().string(from: Date())
            )

            // Update user_profiles with device token
            try await SupabaseClient.shared
                .from("user_profiles")
                .eq("user_id", value: userId)
                .update(payload)

            print("✅ Device token saved to Supabase")
        } catch {
            print("❌ Error saving device token: \(error)")
        }
        */
    }

    // MARK: - Notification Categories & Actions

    /// Register interactive notification categories
    private func registerNotificationCategories() {
        // Message category with quick reply
        let replyAction = UNTextInputNotificationAction(
            identifier: "REPLY_ACTION",
            title: "Répondre",
            options: [],
            textInputButtonTitle: "Envoyer",
            textInputPlaceholder: "Votre message..."
        )

        let messageCategory = UNNotificationCategory(
            identifier: "MESSAGE_CATEGORY",
            actions: [replyAction],
            intentIdentifiers: [],
            options: []
        )

        // Match category
        let viewMatchAction = UNNotificationAction(
            identifier: "VIEW_MATCH",
            title: "Voir le profil",
            options: [.foreground]
        )

        let matchCategory = UNNotificationCategory(
            identifier: "MATCH_CATEGORY",
            actions: [viewMatchAction],
            intentIdentifiers: [],
            options: []
        )

        // Visit category
        let confirmVisitAction = UNNotificationAction(
            identifier: "CONFIRM_VISIT",
            title: "Confirmer",
            options: [.foreground]
        )

        let rescheduleVisitAction = UNNotificationAction(
            identifier: "RESCHEDULE_VISIT",
            title: "Reporter",
            options: []
        )

        let visitCategory = UNNotificationCategory(
            identifier: "VISIT_CATEGORY",
            actions: [confirmVisitAction, rescheduleVisitAction],
            intentIdentifiers: [],
            options: []
        )

        center.setNotificationCategories([
            messageCategory,
            matchCategory,
            visitCategory
        ])

        print("✅ Notification categories registered")
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
            title: "Nouveau Match !",
            body: "\(score)% compatible avec \(propertyTitle)",
            badge: unreadNotificationsCount + 1,
            data: ["type": "match", "propertyTitle": propertyTitle]
        )
    }

    func scheduleNewMessageNotification(senderName: String, preview: String) {
        scheduleNotification(
            id: "message_\(UUID().uuidString)",
            title: senderName,
            body: preview,
            badge: unreadNotificationsCount + 1,
            data: ["type": "message", "senderName": senderName]
        )
    }

    func scheduleApplicationStatusNotification(propertyTitle: String, status: String) {
        let statusText: String
        switch status {
        case "accepted": statusText = "acceptée"
        case "rejected": statusText = "refusée"
        case "reviewing": statusText = "en cours d'examen"
        default: statusText = status
        }

        scheduleNotification(
            id: "application_\(UUID().uuidString)",
            title: "Candidature mise à jour",
            body: "Votre candidature pour \(propertyTitle) : \(statusText)",
            badge: unreadNotificationsCount + 1,
            data: ["type": "application", "propertyTitle": propertyTitle]
        )
    }

    func scheduleGroupActivityNotification(groupName: String, activity: String) {
        scheduleNotification(
            id: "group_\(UUID().uuidString)",
            title: groupName,
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
    nonisolated func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        print("📬 Received notification while app is in foreground")
        // Show notification even when app is in foreground
        completionHandler([.banner, .sound, .badge])
    }

    // Handle notification tap and actions
    nonisolated func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        didReceive response: UNNotificationResponse,
        withCompletionHandler completionHandler: @escaping () -> Void
    ) {
        let userInfo = response.notification.request.content.userInfo
        let actionIdentifier = response.actionIdentifier

        print("👆 User interacted with notification - Action: \(actionIdentifier)")

        Task { @MainActor in
            await handleNotificationResponse(response)
        }

        completionHandler()
    }

    // MARK: - Action Handlers

    @MainActor
    private func handleNotificationResponse(_ response: UNNotificationResponse) async {
        let userInfo = response.notification.request.content.userInfo
        let actionIdentifier = response.actionIdentifier

        switch actionIdentifier {
        case "REPLY_ACTION":
            if let textResponse = response as? UNTextInputNotificationResponse {
                await handleQuickReply(userInfo: userInfo, text: textResponse.userText)
            }

        case "VIEW_MATCH":
            handleViewMatch(userInfo: userInfo)

        case "CONFIRM_VISIT":
            await handleConfirmVisit(userInfo: userInfo)

        case "RESCHEDULE_VISIT":
            handleRescheduleVisit(userInfo: userInfo)

        case UNNotificationDefaultActionIdentifier:
            // User tapped notification banner (not an action button)
            handleNotificationTap(userInfo: userInfo)

        default:
            print("⚠️ Unknown notification action: \(actionIdentifier)")
        }
    }

    @MainActor
    private func handleQuickReply(userInfo: [AnyHashable: Any], text: String) async {
        guard let conversationId = userInfo["conversation_id"] as? String,
              let uuid = UUID(uuidString: conversationId) else {
            print("❌ Invalid conversation_id in notification")
            return
        }

        // TODO: Re-enable when APIClient.sendMessage() is implemented
        print("💬 Quick reply: \(text)")
        print("📧 Conversation ID: \(uuid)")
        print("⚠️ Message sending disabled (stub mode)")

        /*
        do {
            _ = try await APIClient.shared.sendMessage(
                conversationId: uuid,
                content: text
            )
            print("✅ Quick reply sent successfully")
        } catch {
            print("❌ Error sending quick reply: \(error)")
        }
        */
    }

    @MainActor
    private func handleViewMatch(userInfo: [AnyHashable: Any]) {
        print("👀 Opening match details")
        NotificationCenter.default.post(
            name: Notification.Name("NavigateToNotification"),
            object: nil,
            userInfo: ["type": "match", "data": userInfo]
        )
    }

    @MainActor
    private func handleConfirmVisit(userInfo: [AnyHashable: Any]) async {
        print("✅ Visit confirmed")
        // TODO: Call API to confirm visit
        NotificationCenter.default.post(
            name: Notification.Name("NavigateToNotification"),
            object: nil,
            userInfo: ["type": "visit_confirmed", "data": userInfo]
        )
    }

    @MainActor
    private func handleRescheduleVisit(userInfo: [AnyHashable: Any]) {
        print("📅 Rescheduling visit")
        NotificationCenter.default.post(
            name: Notification.Name("NavigateToNotification"),
            object: nil,
            userInfo: ["type": "visit_reschedule", "data": userInfo]
        )
    }

    @MainActor
    private func handleNotificationTap(userInfo: [AnyHashable: Any]) {
        // Navigate based on notification type
        if let type = userInfo["type"] as? String {
            print("🔔 Opening notification of type: \(type)")
            NotificationCenter.default.post(
                name: Notification.Name("NavigateToNotification"),
                object: nil,
                userInfo: ["type": type, "data": userInfo]
            )
        }
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
