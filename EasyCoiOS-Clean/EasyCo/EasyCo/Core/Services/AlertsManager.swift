//
//  AlertsManager.swift
//  EasyCo
//

import Foundation
import Combine

@MainActor
class AlertsManager: ObservableObject {
    static let shared = AlertsManager()

    @Published var alerts: [Alert] = []
    @Published var isLoading = false

    var activeAlertsCount: Int {
        alerts.filter { $0.isActive }.count
    }

    var inactiveAlertsCount: Int {
        alerts.filter { !$0.isActive }.count
    }

    func alertsByType(_ type: AlertType) -> [Alert] {
        alerts.filter { $0.type == type }
    }

    private init() {}

    func loadAlerts() async {
        // TODO: Implement
    }

    func toggleAlert(_ alert: Alert) {
        // TODO: Implement
    }
}
