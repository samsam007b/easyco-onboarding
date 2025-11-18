import Foundation
import Combine

// MARK: - Notification Service

/// Service for managing in-app notifications with Supabase
@MainActor
class NotificationService: ObservableObject {
    static let shared = NotificationService()

    @Published var notifications: [AppNotification] = []
    @Published var unreadCount: Int = 0
    @Published var preferences: NotificationPreferences = .default
    @Published var isLoading: Bool = false
    @Published var error: SupabaseError?

    private let supabase = SupabaseClient.shared
    private let realtime = SupabaseRealtime.shared
    private var realtimeSubscriptionId: String?
    private var cancellables = Set<AnyCancellable>()

    private init() {
        // Load preferences
        loadPreferences()

        // Update unread count when notifications change
        $notifications
            .map { $0.filter { !$0.isRead }.count }
            .assign(to: &$unreadCount)
    }

    // MARK: - Fetch Notifications

    /// Fetch notifications from Supabase
    func fetchNotifications(limit: Int = 50) async {
        isLoading = true
        defer { isLoading = false }

        do {
            // Query Supabase directly
            let response: [AppNotification] = try await supabase
                .from("notifications")
                .select()
                .order("created_at", ascending: false)
                .limit(limit)
                .execute()

            notifications = response
            print("✅ Fetched \(response.count) notifications from Supabase")
        } catch let error as SupabaseError {
            self.error = error
            print("❌ Error fetching notifications: \(error)")

            // Fallback to mock data for development
            if AppConfig.FeatureFlags.demoMode {
                notifications = AppNotification.mockData
            }
        } catch {
            print("❌ Unknown error fetching notifications: \(error)")

            // Fallback to mock data for development
            if AppConfig.FeatureFlags.demoMode {
                notifications = AppNotification.mockData
            }
        }
    }

    /// Refresh notifications
    func refresh() async {
        await fetchNotifications()
    }

    // MARK: - Mark as Read

    /// Mark a notification as read using Supabase RPC function
    func markAsRead(_ notification: AppNotification) async {
        guard !notification.isRead else { return }

        do {
            // Call Supabase RPC function
            let _: Bool = try await supabase.rpcSingle(
                "mark_notification_read",
                params: ["notification_id": notification.id.uuidString]
            )

            // Update local state
            if let index = notifications.firstIndex(where: { $0.id == notification.id }) {
                notifications[index] = AppNotification(
                    id: notification.id,
                    userId: notification.userId,
                    type: notification.type,
                    title: notification.title,
                    message: notification.message,
                    isRead: true,
                    readAt: Date(),
                    createdAt: notification.createdAt,
                    updatedAt: Date(),
                    expiresAt: notification.expiresAt,
                    actionUrl: notification.actionUrl,
                    actionLabel: notification.actionLabel,
                    data: notification.data,
                    relatedUserId: notification.relatedUserId,
                    relatedPropertyId: notification.relatedPropertyId,
                    relatedMessageId: notification.relatedMessageId,
                    relatedConversationId: notification.relatedConversationId
                )
            }

            print("✅ Marked notification as read: \(notification.id)")
        } catch {
            print("❌ Error marking notification as read: \(error)")
        }
    }

    /// Mark all notifications as read using Supabase RPC function
    func markAllAsRead() async {
        do {
            // Call Supabase RPC function
            let _: Bool = try await supabase.rpcSingle("mark_all_notifications_read")

            // Update local state
            notifications = notifications.map { notification in
                AppNotification(
                    id: notification.id,
                    userId: notification.userId,
                    type: notification.type,
                    title: notification.title,
                    message: notification.message,
                    isRead: true,
                    readAt: Date(),
                    createdAt: notification.createdAt,
                    updatedAt: Date(),
                    expiresAt: notification.expiresAt,
                    actionUrl: notification.actionUrl,
                    actionLabel: notification.actionLabel,
                    data: notification.data,
                    relatedUserId: notification.relatedUserId,
                    relatedPropertyId: notification.relatedPropertyId,
                    relatedMessageId: notification.relatedMessageId,
                    relatedConversationId: notification.relatedConversationId
                )
            }

            print("✅ Marked all notifications as read")
        } catch {
            print("❌ Error marking all as read: \(error)")
        }
    }

    // MARK: - Delete Notifications

    /// Delete a notification from Supabase
    func deleteNotification(_ notification: AppNotification) async {
        do {
            // Delete from Supabase
            try await supabase
                .from("notifications")
                .eq("id", value: notification.id.uuidString)
                .delete()

            // Update local state
            notifications.removeAll { $0.id == notification.id }

            print("✅ Deleted notification: \(notification.id)")
        } catch {
            print("❌ Error deleting notification: \(error)")
        }
    }

    /// Clear all notifications
    func clearAll() async {
        do {
            // Delete all user's notifications from Supabase
            try await supabase
                .from("notifications")
                .delete()

            // Update local state
            notifications.removeAll()

            print("✅ Cleared all notifications")
        } catch {
            print("❌ Error clearing all notifications: \(error)")
        }
    }

    // MARK: - Get Unread Count

    /// Get unread count from Supabase using RPC function
    func getUnreadCount() async -> Int {
        do {
            let count: Int = try await supabase.rpcSingle("get_unread_notifications_count")
            return count
        } catch {
            print("❌ Error getting unread count: \(error)")
            return 0
        }
    }

    // MARK: - Filter Notifications

    /// Get notifications by type
    func notifications(ofType type: NotificationType) -> [AppNotification] {
        notifications.filter { $0.type == type }
    }

    /// Get unread notifications
    var unreadNotifications: [AppNotification] {
        notifications.filter { !$0.isRead }
    }

    /// Get notifications by priority
    func notifications(withPriority priority: NotificationPriority) -> [AppNotification] {
        notifications.filter { $0.priority == priority }
    }

    // MARK: - Preferences

    /// Load notification preferences from UserDefaults
    private func loadPreferences() {
        if let data = UserDefaults.standard.data(forKey: "notification_preferences"),
           let decoded = try? JSONDecoder().decode(NotificationPreferences.self, from: data) {
            preferences = decoded
        }
    }

    /// Save notification preferences
    func savePreferences(_ newPreferences: NotificationPreferences) async {
        preferences = newPreferences

        // Save to UserDefaults
        if let encoded = try? JSONEncoder().encode(newPreferences) {
            UserDefaults.standard.set(encoded, forKey: "notification_preferences")
        }

        // TODO: Sync with Supabase (create user_notification_preferences table)
        print("✅ Saved notification preferences")
    }

    /// Toggle notification type
    func toggleNotificationType(_ type: NotificationType, enabled: Bool) async {
        var updatedPreferences = preferences

        switch type {
        case .message:
            updatedPreferences.messagesEnabled = enabled
        case .propertyUpdate:
            updatedPreferences.propertyUpdatesEnabled = enabled
        case .newApplication, .applicationStatusChange:
            updatedPreferences.applicationsEnabled = enabled
        case .taskAssignment:
            updatedPreferences.tasksEnabled = enabled
        case .expenseAdded:
            updatedPreferences.expensesEnabled = enabled
        case .paymentReminder:
            updatedPreferences.paymentsEnabled = enabled
        case .householdInvite:
            updatedPreferences.householdEnabled = enabled
        case .systemAnnouncement:
            updatedPreferences.systemEnabled = enabled
        }

        await savePreferences(updatedPreferences)
    }

    // MARK: - Real-time Updates

    /// Start listening for real-time notification updates via Supabase Realtime
    func startListening() {
        // Connect to Realtime
        realtime.connect()

        // Subscribe to notifications table changes
        realtimeSubscriptionId = realtime.subscribe(
            table: "notifications",
            event: .all
        ) { [weak self] (payload: RealtimePayload<AppNotification>) in
            Task { @MainActor in
                await self?.handleRealtimeUpdate(payload)
            }
        }

        print("📡 Started listening for notification updates via Supabase Realtime")
    }

    /// Stop listening for real-time updates
    func stopListening() {
        if let subscriptionId = realtimeSubscriptionId {
            realtime.unsubscribe(subscriptionId)
            realtimeSubscriptionId = nil
        }

        realtime.disconnect()
        print("📡 Stopped listening for notification updates")
    }

    /// Handle real-time update from Supabase
    private func handleRealtimeUpdate(_ payload: RealtimePayload<AppNotification>) async {
        switch payload.event {
        case .insert:
            // New notification received
            if let newNotification = payload.new {
                notifications.insert(newNotification, at: 0)
                print("📬 New notification received via Realtime")

                // Update badge count
                await PushNotificationService.shared.updateBadgeCount(unreadCount)
            }

        case .update:
            // Notification updated
            if let updatedNotification = payload.new,
               let index = notifications.firstIndex(where: { $0.id == updatedNotification.id }) {
                notifications[index] = updatedNotification
                print("🔄 Notification updated via Realtime")
            }

        case .delete:
            // Notification deleted
            if let deletedNotification = payload.old {
                notifications.removeAll { $0.id == deletedNotification.id }
                print("🗑️ Notification deleted via Realtime")
            }

        case .all:
            break
        }
    }
}
