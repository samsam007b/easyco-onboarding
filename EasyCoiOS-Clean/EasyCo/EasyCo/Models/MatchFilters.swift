//
//  MatchFilters.swift
//  EasyCo
//

import Foundation

struct MatchFilters: Codable {
    var minMatchScore: Double = 0.0
    var maxDistance: Double?

    static var `default`: MatchFilters {
        MatchFilters()
    }
}
