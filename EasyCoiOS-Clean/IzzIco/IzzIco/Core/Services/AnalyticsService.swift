//
//  AnalyticsService.swift
//  IzzIco
//

import Foundation

class AnalyticsService {
    static let shared = AnalyticsService()

    private init() {}

    func trackEvent(_ event: String, properties: [String: Any]? = nil) {
        // TODO: Implement analytics tracking
    }

    func trackScreen(_ screenName: String) {
        // TODO: Implement screen tracking
    }

    func getSearcherStats() async throws -> SearcherStats {
        // TODO: Implement API call to get searcher stats
        return SearcherStats.mock
    }

    func getRecentlyViewedProperties() async throws -> [Property] {
        // TODO: Implement API call to get recently viewed properties
        return []
    }
}
