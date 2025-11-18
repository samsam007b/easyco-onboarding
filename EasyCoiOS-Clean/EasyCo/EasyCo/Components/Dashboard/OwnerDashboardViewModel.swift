import Foundation
import SwiftUI

// MARK: - Owner Dashboard ViewModel

@MainActor
class OwnerDashboardViewModel: ObservableObject {
    @Published var analytics: OwnerAnalytics?
    @Published var insights: [AnalyticsInsight] = []
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
            analytics = OwnerAnalytics.mock
            loadInsights()

            print("✅ Loaded owner analytics for period: \(period)")
        } catch {
            self.error = error as? NetworkError ?? .unknown(error)
            print("❌ Error loading owner analytics: \(error)")
        }

        isLoading = false
    }

    // MARK: - Generate Insights

    private func loadInsights() {
        guard let analytics = analytics else { return }

        var newInsights: [AnalyticsInsight] = []

        // Occupancy rate insight
        if analytics.occupancyRate < 70 {
            newInsights.append(AnalyticsInsight(
                id: UUID(),
                type: .recommendation,
                title: "Optimiser le taux d'occupation",
                message: "Votre taux d'occupation est de \(Int(analytics.occupancyRate))%. Considérez ajuster vos prix ou améliorer vos annonces.",
                priority: .medium
            ))
        }

        // Response time insight
        if let responseTime = analytics.averageResponseTime, responseTime > 7200 {
            newInsights.append(AnalyticsInsight(
                id: UUID(),
                type: .warning,
                title: "Temps de réponse élevé",
                message: "Votre temps de réponse moyen est de \(Int(responseTime / 3600))h. Les réponses rapides améliorent le taux de conversion.",
                priority: .high
            ))
        }

        // Views trend insight
        if analytics.viewsTrend > 20 {
            newInsights.append(AnalyticsInsight(
                id: UUID(),
                type: .achievement,
                title: "Excellente visibilité !",
                message: "Vos annonces ont \(Int(analytics.viewsTrend))% de vues en plus. Continuez comme ça !",
                priority: .low
            ))
        }

        // Conversion rate insight
        if analytics.conversionRate > 50 {
            newInsights.append(AnalyticsInsight(
                id: UUID(),
                type: .achievement,
                title: "Excellent taux de conversion",
                message: "Votre taux de conversion de \(Int(analytics.conversionRate))% est supérieur à la moyenne !",
                priority: .low
            ))
        }

        // Pending applications
        if analytics.pendingApplications > 5 {
            newInsights.append(AnalyticsInsight(
                id: UUID(),
                type: .opportunity,
                title: "Candidatures en attente",
                message: "Vous avez \(analytics.pendingApplications) candidatures en attente. Répondez rapidement pour ne pas perdre de locataires potentiels.",
                priority: .high
            ))
        }

        insights = newInsights
    }
}
