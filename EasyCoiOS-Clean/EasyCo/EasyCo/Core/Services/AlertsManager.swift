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

    func createAlert(type: AlertType, title: String, criteria: PropertyFilters, frequency: AlertFrequency) async -> Bool {
        // TODO: Implement API call to create alert

        // Convert PropertyFilters to AlertCriteria
        let alertCriteria = AlertCriteria(
            cities: criteria.city.map { [$0] },
            neighborhoods: nil,
            radius: nil,
            propertyTypes: criteria.propertyTypes,
            minPrice: criteria.minPrice.map { Double($0) },
            maxPrice: criteria.maxPrice.map { Double($0) },
            minBedrooms: criteria.minBedrooms,
            maxBedrooms: criteria.maxBedrooms,
            minSurfaceArea: criteria.minSurface.map { Double($0) },
            requiredAmenities: nil,
            availableFrom: criteria.availableFrom,
            minimumStay: criteria.minLeaseDuration,
            maximumStay: nil,
            furnished: criteria.furnished,
            petsAllowed: criteria.petsAllowed,
            smokingAllowed: criteria.smokingAllowed
        )

        let newAlert = Alert(
            id: UUID(),
            userID: UUID(), // TODO: Get from current user session
            type: type,
            title: title,
            criteria: alertCriteria,
            isActive: true,
            frequency: frequency,
            lastTriggered: nil,
            triggerCount: 0,
            createdAt: Date(),
            updatedAt: Date()
        )
        alerts.append(newAlert)
        return true
    }
}
