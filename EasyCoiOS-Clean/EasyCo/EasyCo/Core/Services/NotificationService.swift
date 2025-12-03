//
//  NotificationService.swift
//  EasyCo
//

import Foundation
import Combine

@MainActor
class NotificationService: ObservableObject {
    static let shared = NotificationService()

    @Published var notifications: [AppNotification] = []
    @Published var isLoading = false
    @Published var preferences: NotificationPreferences = .default

    private init() {}

    func fetchNotifications() async throws -> [AppNotification] {
        // TODO: Implement
        return []
    }

    func startListening() {
        // TODO: Implement real-time notification listening
    }

    func stopListening() {
        // TODO: Stop real-time notification listening
    }

    func markAsRead(_ notificationId: String) async throws {
        // TODO: Mark notification as read
    }

    func markAllAsRead() async throws {
        // TODO: Mark all notifications as read
    }

    func savePreferences(_ preferences: NotificationPreferences) async throws {
        // TODO: Save preferences to backend
        self.preferences = preferences
    }

    func refresh() async throws {
        _ = try await fetchNotifications()
    }

    func deleteNotification(_ notificationId: String) async throws {
        // TODO: Delete notification from backend
        notifications.removeAll { $0.id.uuidString == notificationId }
    }

    func clearAll() async throws {
        // TODO: Clear all notifications from backend
        notifications.removeAll()
    }
}
