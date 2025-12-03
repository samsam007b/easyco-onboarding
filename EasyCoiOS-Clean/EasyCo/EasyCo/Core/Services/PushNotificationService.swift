//
//  PushNotificationService.swift
//  EasyCo
//

import Foundation
import UserNotifications

@MainActor
class PushNotificationService {
    static let shared = PushNotificationService()
    private init() {}

    func requestAuthorization() async throws -> Bool {
        let options: UNAuthorizationOptions = [.alert, .sound, .badge]
        return try await UNUserNotificationCenter.current().requestAuthorization(options: options)
    }

    func clearBadge() {
        UNUserNotificationCenter.current().setBadgeCount(0)
    }

    func hasPermission() async -> Bool {
        let settings = await UNUserNotificationCenter.current().notificationSettings()
        return settings.authorizationStatus == .authorized
    }

    func requestPermission() async throws -> Bool {
        return try await requestAuthorization()
    }

    func handleNotificationTap(_ notification: AppNotification) async {
        // TODO: Handle notification tap and navigation
    }
}
