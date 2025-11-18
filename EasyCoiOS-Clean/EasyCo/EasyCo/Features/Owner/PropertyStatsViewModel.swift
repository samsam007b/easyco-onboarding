//
//  PropertyStatsViewModel.swift
//  EasyCo
//
//  ViewModel pour les statistiques d'une propriété
//

import SwiftUI

@MainActor
class PropertyStatsViewModel: ObservableObject {
    let propertyId: UUID

    @Published var stats: PropertyStats = .empty
    @Published var isLoading = false
    @Published var selectedPeriod: StatsPeriod = .week

    init(propertyId: UUID) {
        self.propertyId = propertyId
    }

    func loadStats() async {
        isLoading = true

        // Demo mode
        if AppConfig.FeatureFlags.demoMode {
            try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
            stats = PropertyStats.mock
        } else {
            // TODO: Fetch from API
            // stats = try await APIClient.shared.getPropertyStats(propertyId: propertyId)
        }

        isLoading = false
    }
}

// MARK: - Stats Period

enum StatsPeriod {
    case week
    case month

    var displayName: String {
        switch self {
        case .week: return "7 jours"
        case .month: return "30 jours"
        }
    }
}

// MARK: - Property Stats Model

struct PropertyStats {
    let totalViews: Int
    let viewsTrend: Double
    let totalFavorites: Int
    let favoritesTrend: Double
    let totalApplications: Int
    let applicationsTrend: Double
    let conversionRate: Double

    let dailyViews: [DailyViewData]

    let newApplications: Int
    let underReviewApplications: Int
    let acceptedApplications: Int
    let rejectedApplications: Int

    let avgTimeToApplication: Int
    let visibilityScore: Double
    let lastViewedAt: Date
    let lastApplicationAt: Date?

    static var empty: PropertyStats {
        PropertyStats(
            totalViews: 0,
            viewsTrend: 0,
            totalFavorites: 0,
            favoritesTrend: 0,
            totalApplications: 0,
            applicationsTrend: 0,
            conversionRate: 0,
            dailyViews: [],
            newApplications: 0,
            underReviewApplications: 0,
            acceptedApplications: 0,
            rejectedApplications: 0,
            avgTimeToApplication: 0,
            visibilityScore: 0,
            lastViewedAt: Date(),
            lastApplicationAt: nil
        )
    }

    static var mock: PropertyStats {
        let calendar = Calendar.current
        let today = Date()

        let dailyViews = (0..<7).reversed().map { daysAgo in
            let date = calendar.date(byAdding: .day, value: -daysAgo, to: today)!
            return DailyViewData(
                date: date,
                count: Int.random(in: 15...45)
            )
        }

        return PropertyStats(
            totalViews: 287,
            viewsTrend: 12.5,
            totalFavorites: 34,
            favoritesTrend: 8.3,
            totalApplications: 12,
            applicationsTrend: -5.2,
            conversionRate: 4.2,
            dailyViews: dailyViews,
            newApplications: 3,
            underReviewApplications: 5,
            acceptedApplications: 2,
            rejectedApplications: 2,
            avgTimeToApplication: 3,
            visibilityScore: 78,
            lastViewedAt: calendar.date(byAdding: .hour, value: -2, to: today)!,
            lastApplicationAt: calendar.date(byAdding: .day, value: -1, to: today)
        )
    }
}

struct DailyViewData {
    let date: Date
    let count: Int
}
