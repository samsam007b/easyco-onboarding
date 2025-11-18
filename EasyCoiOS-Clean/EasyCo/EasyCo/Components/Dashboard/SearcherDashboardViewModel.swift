import Foundation
import SwiftUI

// MARK: - Searcher Dashboard ViewModel

@MainActor
class SearcherDashboardViewModel: ObservableObject {
    @Published var analytics: SearcherAnalytics?
    @Published var recommendations: [AnalyticsInsight] = []
    @Published var isLoading = false
    @Published var error: NetworkError?

    private let apiClient = APIClient.shared

    // MARK: - Load Analytics

    func loadAnalytics(period: AnalyticsPeriod) async {
        isLoading = true
        error = nil

        do {
            // TODO: Replace with actual API call
            try await Task.sleep(nanoseconds: 500_000_000)
            
            // For now, use mock data
            analytics = SearcherAnalytics.mock
            loadRecommendations()

            print("✅ Loaded searcher analytics for period: \(period)")
        } catch {
            self.error = error as? NetworkError ?? .unknown(error)
            print("❌ Error loading searcher analytics: \(error)")
        }

        isLoading = false
    }

    // MARK: - Generate Recommendations

    private func loadRecommendations() {
        guard let analytics = analytics else { return }

        var newRecommendations: [AnalyticsInsight] = []

        // Profile completeness
        if analytics.profileCompleteness < 80 {
            newRecommendations.append(AnalyticsInsight(
                id: UUID(),
                type: .recommendation,
                title: "Complétez votre profil",
                message: "Votre profil n'est complété qu'à \(Int(analytics.profileCompleteness))%. Un profil complet augmente vos chances de trouver un match.",
                priority: .high
            ))
        }

        // Low application success rate
        if analytics.successRate < 30 && analytics.totalApplications > 3 {
            newRecommendations.append(AnalyticsInsight(
                id: UUID(),
                type: .warning,
                title: "Taux de réussite faible",
                message: "Votre taux d'acceptation est de \(Int(analytics.successRate))%. Essayez de cibler des propriétés plus compatibles avec votre profil.",
                priority: .medium
            ))
        }

        // Good compatibility score
        if analytics.averageCompatibilityScore > 80 {
            newRecommendations.append(AnalyticsInsight(
                id: UUID(),
                type: .achievement,
                title: "Excellents matches !",
                message: "Votre score de compatibilité moyen est de \(Int(analytics.averageCompatibilityScore))%. Vous ciblez bien vos recherches !",
                priority: .low
            ))
        }

        // New matches
        if analytics.newMatchesThisPeriod > 0 {
            newRecommendations.append(AnalyticsInsight(
                id: UUID(),
                type: .opportunity,
                title: "Nouveaux matches",
                message: "Vous avez \(analytics.newMatchesThisPeriod) nouveau(x) match(es) ! N'oubliez pas de contacter les propriétaires.",
                priority: .high
            ))
        }

        // Low activity
        if analytics.propertiesViewed < 10 {
            newRecommendations.append(AnalyticsInsight(
                id: UUID(),
                type: .recommendation,
                title: "Explorez plus de propriétés",
                message: "Vous n'avez vu que \(analytics.propertiesViewed) propriétés. Élargissez vos critères pour découvrir plus d'opportunités.",
                priority: .medium
            ))
        }

        recommendations = newRecommendations
    }
}
