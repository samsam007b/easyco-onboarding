//
//  PropertyComparisonManager.swift
//  EasyCo
//

import Foundation

class PropertyComparisonManager {
    static let shared = PropertyComparisonManager()
    private init() {}
}

struct ComparisonFeature: Identifiable {
    let id = UUID()
    let name: String
    let values: [String]
}
