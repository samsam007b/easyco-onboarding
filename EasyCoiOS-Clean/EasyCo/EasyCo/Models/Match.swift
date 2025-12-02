//
//  Match.swift
//  EasyCo
//

import Foundation

struct Match: Identifiable, Codable {
    let id: UUID
    let searcherId: UUID
    let propertyId: UUID
    let matchScore: Double
    let createdAt: Date

    init(id: UUID = UUID(), searcherId: UUID, propertyId: UUID, matchScore: Double, createdAt: Date = Date()) {
        self.id = id
        self.searcherId = searcherId
        self.propertyId = propertyId
        self.matchScore = matchScore
        self.createdAt = createdAt
    }
}
