import Foundation
import Combine

// MARK: - Notification Service

/// Service for managing in-app notifications
@MainActor
class NotificationService: ObservableObject {
    static let shared = NotificationService()

    @Published var notifications: [AppNotification] = []
    @Published var unreadCount: Int = 0
    @Published var preferences: NotificationPreferences = .default
    @Published var isLoading: Bool = false
    @Published var error: Error?

    private let apiClient = APIClient.shared
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

    /// Fetch notifications from backend
    func fetchNotifications(limit: Int = 50) async {
        isLoading = true
        defer { isLoading = false }

        do {
            // TODO: Implement actual API call
            // let response = try await apiClient.getNotifications(limit: limit)

            // For now, use mock data
            try await Task.sleep(nanoseconds: 500_000_000) // Simulate network delay
            notifications = AppNotification.mockData
            print("✅ Loaded \(notifications.count) notifications (mock data)")
        } catch {
            self.error = error
            print("❌ Error fetching notifications: \(error)")

            // Fallback to mock data
            notifications = AppNotification.mockData
        }
    }

    /// Refresh notifications
    func refresh() async {
        await fetchNotifications()
    }

    // MARK: - Mark as Read

    /// Mark a notification as read
    func markAsRead(_ notification: AppNotification) async {
        guard !notification.isRead else { return }

        // TODO: Implement API call
        // try await apiClient.markNotificationRead(id: notification.id)

        // Update local state
        notifications = notifications.map { n in
            if n.id == notification.id {
                return AppNotification(
                    id: n.id,
                    userId: n.userId,
                    type: n.type,
                    title: n.title,
                    message: n.message,
                    isRead: true,
                    readAt: Date(),
                    createdAt: n.createdAt,
                    updatedAt: Date(),
                    expiresAt: n.expiresAt,
                    actionUrl: n.actionUrl,
                    actionLabel: n.actionLabel,
                    data: n.data,
                    relatedUserId: n.relatedUserId,
                    relatedPropertyId: n.relatedPropertyId,
                    relatedMessageId: n.relatedMessageId,
                    relatedConversationId: n.relatedConversationId
                )
            }
            return n
        }

        print("✅ Marked notification as read: \(notification.id)")
    }

    /// Mark all notifications as read
    func markAllAsRead() async {
        // TODO: Implement API call
        // try await apiClient.markAllNotificationsRead()

        // Update local state
        notifications = notifications.map { n in
            AppNotification(
                id: n.id,
                userId: n.userId,
                type: n.type,
                title: n.title,
                message: n.message,
                isRead: true,
                readAt: Date(),
                createdAt: n.createdAt,
                updatedAt: Date(),
                expiresAt: n.expiresAt,
                actionUrl: n.actionUrl,
                actionLabel: n.actionLabel,
                data: n.data,
                relatedUserId: n.relatedUserId,
                relatedPropertyId: n.relatedPropertyId,
                relatedMessageId: n.relatedMessageId,
                relatedConversationId: n.relatedConversationId
            )
        }

        print("✅ Marked all notifications as read")
    }

    // MARK: - Delete Notifications

    /// Delete a notification
    func deleteNotification(_ notification: AppNotification) async {
        // TODO: Implement API call
        // try await apiClient.deleteNotification(id: notification.id)

        // Update local state
        notifications.removeAll { $0.id == notification.id }

        print("✅ Deleted notification: \(notification.id)")
    }

    /// Clear all notifications
    func clearAll() async {
        // TODO: Implement API call
        // try await apiClient.clearAllNotifications()

        // Update local state
        notifications.removeAll()

        print("✅ Cleared all notifications")
    }

    // MARK: - Get Unread Count

    /// Get unread count
    func getUnreadCount() async -> Int {
        // Already computed from $notifications publisher
        return unreadCount
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

    // MARK: - Real-time Updates (Disabled - TODO: Implement)

    /// Start listening for real-time notification updates
    func startListening() {
        // TODO: Implement real-time updates via WebSocket or polling
        print("📡 Real-time listening not yet implemented")
    }

    /// Stop listening for real-time updates
    func stopListening() {
        // TODO: Implement real-time updates teardown
        print("📡 Stopped listening")
    }
}
