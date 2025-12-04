//
//  PropertyComparisonManager.swift
//  EasyCo
//

import Foundation
import Combine

@MainActor
class PropertyComparisonManager: ObservableObject {
    static let shared = PropertyComparisonManager()

    @Published var selectedProperties: [Property] = []

    private init() {}

    var count: Int {
        selectedProperties.count
    }

    func isInComparison(_ property: Property) -> Bool {
        selectedProperties.contains { $0.id == property.id }
    }

    func toggleProperty(_ property: Property) {
        if isInComparison(property) {
            selectedProperties.removeAll { $0.id == property.id }
        } else {
            selectedProperties.append(property)
        }
    }

    func clear() {
        selectedProperties.removeAll()
    }
}

struct ComparisonFeature: Identifiable, Hashable {
    let id = UUID()
    let name: String
    let values: [String]

    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }

    static func == (lhs: ComparisonFeature, rhs: ComparisonFeature) -> Bool {
        lhs.id == rhs.id
    }
}
