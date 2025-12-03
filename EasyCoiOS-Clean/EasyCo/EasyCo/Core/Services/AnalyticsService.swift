//
//  AnalyticsService.swift
//  EasyCo
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
}
