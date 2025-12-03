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

    // TODO: Implement property comparison methods
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
