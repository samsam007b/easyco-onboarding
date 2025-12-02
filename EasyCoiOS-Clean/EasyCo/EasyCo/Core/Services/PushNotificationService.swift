//
//  PushNotificationService.swift
//  EasyCo
//

import Foundation
import UserNotifications

class PushNotificationService {
    static let shared = PushNotificationService()
    private init() {}

    func requestAuthorization() async throws -> Bool {
        let options: UNAuthorizationOptions = [.alert, .sound, .badge]
        return try await UNUserNotificationCenter.current().requestAuthorization(options: options)
    }
}
