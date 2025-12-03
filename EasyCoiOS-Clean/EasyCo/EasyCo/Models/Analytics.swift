import Foundation

// MARK: - Analytics Models

/// Owner Analytics - Statistics for property owners
struct OwnerAnalytics: Codable {
    let ownerID: UUID
    let period: AnalyticsPeriod

    // Property Statistics
    var totalProperties: Int
    var activeProperties: Int
    var draftProperties: Int
    var totalRooms: Int
    var occupiedRooms: Int
    var availableRooms: Int

    // Performance Metrics
    var totalViews: Int
    var totalApplications: Int
    var totalFavorites: Int
    var averageRating: Double?
    var totalReviews: Int

    // Financial Metrics
    var totalRevenue: Double
    var projectedMonthlyRevenue: Double
    var occupancyRate: Double
    var averageRentPerRoom: Double

    // Application Metrics
    var pendingApplications: Int
    var acceptedApplications: Int
    var rejectedApplications: Int
    var conversionRate: Double

    // Engagement
    var messagesReceived: Int
    var messagesReplied: Int
    var averageResponseTime: TimeInterval?

    // Trends
    var viewsTrend: Double
    var applicationsTrend: Double
    var revenueTrend: Double
}

/// Searcher Analytics - Statistics for searchers
struct SearcherAnalytics: Codable {
    let searcherID: UUID
    let period: AnalyticsPeriod

    // Search Activity
    var totalSearches: Int
    var savedSearches: Int
    var propertiesViewed: Int
    var uniquePropertiesViewed: Int

    // Engagement
    var totalFavorites: Int
    var totalApplications: Int
    var messagesSent: Int
    var messagesReceived: Int

    // Application Status
    var pendingApplications: Int
    var acceptedApplications: Int
    var rejectedApplications: Int
    var successRate: Double

    // Matches
    var totalMatches: Int
    var newMatchesThisPeriod: Int
    var averageCompatibilityScore: Double

    // Active Status
    var daysActive: Int
    var lastActivityDate: Date
    var profileCompleteness: Double

    // Preferences Insights
    var averageBudget: Double
    var mostSearchedCities: [String]
    var preferredPropertyTypes: [String]
}

/// Period for analytics
enum AnalyticsPeriod: String, Codable, CaseIterable {
    case week, month, quarter, year, allTime = "all_time"

    var displayName: String {
        switch self {
        case .week: return "Cette semaine"
        case .month: return "Ce mois"
        case .quarter: return "Ce trimestre"
        case .year: return "Cette année"
        case .allTime: return "Depuis toujours"
        }
    }
}

/// Statistical insight/recommendation
struct AnalyticsInsight: Codable, Identifiable {
    let id: UUID
    let type: InsightType
    let title: String
    let message: String
    let priority: InsightPriority

    enum InsightType: String, Codable {
        case opportunity, warning, achievement, recommendation, trend
    }

    enum InsightPriority: String, Codable {
        case low, medium, high
    }

    var icon: String {
        switch type {
        case .opportunity: return "lightbulb.fill"
        case .warning: return "exclamationmark.triangle.fill"
        case .achievement: return "star.fill"
        case .recommendation: return "checkmark.circle.fill"
        case .trend: return "chart.line.uptrend.xyaxis"
        }
    }
}

// MARK: - Searcher Stats (Dashboard)

struct SearcherStats {
    let unreadMessages: Int
    let favoritesCount: Int
    let topMatches: Int
    let applicationsCount: Int
    let preferences: SearcherPreferences

    static var mock: SearcherStats {
        SearcherStats(
            unreadMessages: 3,
            favoritesCount: 12,
            topMatches: 8,
            applicationsCount: 5,
            preferences: SearcherPreferences.mock
        )
    }
}

struct SearcherPreferences: Codable {
    var favoriteCity: String?
    var priceRange: String?
    var preferredPropertyTypes: [String]

    static var mock: SearcherPreferences {
        SearcherPreferences(
            favoriteCity: "Bruxelles",
            priceRange: "600€ - 900€",
            preferredPropertyTypes: ["Colocation", "Studio"]
        )
    }

    static func load() -> SearcherPreferences {
        guard let data = UserDefaults.standard.data(forKey: "searcher_preferences"),
              let preferences = try? JSONDecoder().decode(SearcherPreferences.self, from: data) else {
            return mock
        }
        return preferences
    }

    func save() {
        if let encoded = try? JSONEncoder().encode(self) {
            UserDefaults.standard.set(encoded, forKey: "searcher_preferences")
        }
    }
}

// MARK: - Mock Data

extension OwnerAnalytics {
    static var mock: OwnerAnalytics {
        OwnerAnalytics(
            ownerID: UUID(),
            period: .month,
            totalProperties: 3,
            activeProperties: 3,
            draftProperties: 0,
            totalRooms: 12,
            occupiedRooms: 9,
            availableRooms: 3,
            totalViews: 486,
            totalApplications: 28,
            totalFavorites: 64,
            averageRating: 4.5,
            totalReviews: 18,
            totalRevenue: 12600,
            projectedMonthlyRevenue: 13200,
            occupancyRate: 75.0,
            averageRentPerRoom: 1100,
            pendingApplications: 8,
            acceptedApplications: 16,
            rejectedApplications: 4,
            conversionRate: 57.1,
            messagesReceived: 92,
            messagesReplied: 87,
            averageResponseTime: 3600,
            viewsTrend: 12.5,
            applicationsTrend: 8.3,
            revenueTrend: 5.2
        )
    }
}

extension SearcherAnalytics {
    static var mock: SearcherAnalytics {
        SearcherAnalytics(
            searcherID: UUID(),
            period: .month,
            totalSearches: 45,
            savedSearches: 3,
            propertiesViewed: 67,
            uniquePropertiesViewed: 42,
            totalFavorites: 12,
            totalApplications: 5,
            messagesSent: 18,
            messagesReceived: 15,
            pendingApplications: 2,
            acceptedApplications: 1,
            rejectedApplications: 2,
            successRate: 20.0,
            totalMatches: 8,
            newMatchesThisPeriod: 3,
            averageCompatibilityScore: 82.5,
            daysActive: 23,
            lastActivityDate: Date(),
            profileCompleteness: 85.0,
            averageBudget: 950,
            mostSearchedCities: ["Paris", "Lyon", "Marseille"],
            preferredPropertyTypes: ["Studio", "Colocation"]
        )
    }
}
