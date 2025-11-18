import Foundation
import UserNotifications
import UIKit

// MARK: - Push Notification Service

/// Service for managing push notifications
@MainActor
class PushNotificationService: NSObject, ObservableObject {
    static let shared = PushNotificationService()

    @Published var authorizationStatus: UNAuthorizationStatus = .notDetermined
    @Published var deviceToken: String?
    @Published var hasPermission: Bool = false

    private let apiClient = APIClient.shared
    private let notificationCenter = UNUserNotificationCenter.current()

    private override init() {
        super.init()
        notificationCenter.delegate = self
        Task {
            await checkAuthorizationStatus()
        }
    }

    // MARK: - Permission Management

    /// Request notification permission from user
    func requestPermission() async -> Bool {
        do {
            let granted = try await notificationCenter.requestAuthorization(
                options: [.alert, .badge, .sound]
            )

            await checkAuthorizationStatus()
            hasPermission = granted

            if granted {
                await registerForRemoteNotifications()
            }

            return granted
        } catch {
            print("❌ Error requesting notification permission: \(error)")
            return false
        }
    }

    /// Check current authorization status
    func checkAuthorizationStatus() async {
        let settings = await notificationCenter.notificationSettings()
        authorizationStatus = settings.authorizationStatus
        hasPermission = settings.authorizationStatus == .authorized
    }

    /// Register for remote push notifications
    private func registerForRemoteNotifications() async {
        await UIApplication.shared.registerForRemoteNotifications()
    }

    // MARK: - Token Management

    /// Register device token with backend
    func registerDeviceToken(_ token: Data) async {
        let tokenString = token.map { String(format: "%02.2hhx", $0) }.joined()
        deviceToken = tokenString

        print("📱 Device token: \(tokenString)")

        // Register with backend
        await sendTokenToBackend(tokenString)
    }

    /// Send device token to backend API (Supabase)
    private func sendTokenToBackend(_ token: String) async {
        guard let authToken = EasyCoKeychainManager.shared.getAuthToken() else {
            print("⚠️ No auth token - cannot save device token to Supabase")
            return
        }

        do {
            let userId = try apiClient.getUserIdFromToken(authToken)

            struct DeviceTokenPayload: Codable {
                let deviceToken: String
                let platform: String
                let deviceId: String
                let appVersion: String
                let updatedAt: String

                enum CodingKeys: String, CodingKey {
                    case deviceToken = "device_token"
                    case platform
                    case deviceId = "device_id"
                    case appVersion = "app_version"
                    case updatedAt = "updated_at"
                }
            }

            let deviceId = await UIDevice.current.identifierForVendor?.uuidString ?? UUID().uuidString
            let appVersion = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0.0"

            let payload = DeviceTokenPayload(
                deviceToken: token,
                platform: "ios",
                deviceId: deviceId,
                appVersion: appVersion,
                updatedAt: ISO8601DateFormatter().string(from: Date())
            )

            // Update user_profiles with device token
            try await SupabaseClient.shared
                .from("user_profiles")
                .eq("user_id", value: userId)
                .update(payload)

            print("✅ Device token registered with Supabase")
        } catch {
            print("❌ Error registering device token with Supabase: \(error)")
        }
    }

    /// Handle failed registration
    func handleRegistrationError(_ error: Error) {
        print("❌ Failed to register for remote notifications: \(error)")
    }

    // MARK: - Local Notifications

    /// Schedule a local notification
    func scheduleLocalNotification(
        title: String,
        body: String,
        timeInterval: TimeInterval,
        identifier: String,
        data: [String: Any]? = nil
    ) async {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = .default

        if let data = data {
            content.userInfo = data
        }

        let trigger = UNTimeIntervalNotificationTrigger(
            timeInterval: timeInterval,
            repeats: false
        )

        let request = UNNotificationRequest(
            identifier: identifier,
            content: content,
            trigger: trigger
        )

        do {
            try await notificationCenter.add(request)
            print("✅ Local notification scheduled: \(title)")
        } catch {
            print("❌ Error scheduling local notification: \(error)")
        }
    }

    /// Cancel local notification
    func cancelLocalNotification(identifier: String) {
        notificationCenter.removePendingNotificationRequests(withIdentifiers: [identifier])
        print("🗑️ Cancelled notification: \(identifier)")
    }

    /// Cancel all local notifications
    func cancelAllLocalNotifications() {
        notificationCenter.removeAllPendingNotificationRequests()
        print("🗑️ Cancelled all local notifications")
    }

    // MARK: - Badge Management

    /// Update app badge count
    func updateBadgeCount(_ count: Int) async {
        await UIApplication.shared.applicationIconBadgeNumber = count
    }

    /// Clear app badge
    func clearBadge() async {
        await updateBadgeCount(0)
    }

    // MARK: - Notification Handling

    /// Handle notification tap
    func handleNotificationTap(userInfo: [AnyHashable: Any]) {
        print("📬 Notification tapped: \(userInfo)")

        // Parse notification data
        guard let notificationType = userInfo["type"] as? String else {
            return
        }

        // Navigate based on notification type
        switch notificationType {
        case "message":
            if let messageId = userInfo["message_id"] as? String {
                NotificationCenter.default.post(
                    name: NSNotification.Name("NavigateToMessage"),
                    object: nil,
                    userInfo: ["messageId": messageId]
                )
            }

        case "new_application":
            if let applicationId = userInfo["application_id"] as? String {
                NotificationCenter.default.post(
                    name: NSNotification.Name("NavigateToApplication"),
                    object: nil,
                    userInfo: ["applicationId": applicationId]
                )
            }

        case "property_update":
            if let propertyId = userInfo["property_id"] as? String {
                NotificationCenter.default.post(
                    name: NSNotification.Name("NavigateToProperty"),
                    object: nil,
                    userInfo: ["propertyId": propertyId]
                )
            }

        case "task_assignment":
            NotificationCenter.default.post(
                name: NSNotification.Name("NavigateToTasks"),
                object: nil
            )

        case "expense_added":
            NotificationCenter.default.post(
                name: NSNotification.Name("NavigateToExpenses"),
                object: nil
            )

        default:
            break
        }
    }
}

// MARK: - UNUserNotificationCenterDelegate

extension PushNotificationService: UNUserNotificationCenterDelegate {
    /// Handle notification when app is in foreground
    nonisolated func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        print("📬 Received notification in foreground")

        // Show notification banner, badge, and play sound even in foreground
        completionHandler([.banner, .badge, .sound])
    }

    /// Handle notification tap
    nonisolated func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        didReceive response: UNNotificationResponse,
        withCompletionHandler completionHandler: @escaping () -> Void
    ) {
        let userInfo = response.notification.request.content.userInfo

        Task { @MainActor in
            handleNotificationTap(userInfo: userInfo)
        }

        completionHandler()
    }
}

// MARK: - Empty Response Model

private struct EmptyResponse: Codable {}
