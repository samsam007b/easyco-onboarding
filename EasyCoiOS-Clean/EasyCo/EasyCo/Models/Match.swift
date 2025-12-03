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
    var matchedAt: Date  // When the match was created
    var property: Property?  // The matched property details (optional, might be loaded separately)
    var hasUnreadMessages: Bool = false
    var lastMessage: String?

    var timeAgo: String {
        let interval = Date().timeIntervalSince(matchedAt)
        if interval < 60 {
            return "À l'instant"
        } else if interval < 3600 {
            return "\(Int(interval / 60))m"
        } else if interval < 86400 {
            return "\(Int(interval / 3600))h"
        } else if interval < 604800 {
            return "\(Int(interval / 86400))j"
        } else {
            let formatter = DateFormatter()
            formatter.dateFormat = "dd/MM"
            return formatter.string(from: matchedAt)
        }
    }

    init(id: UUID = UUID(), searcherId: UUID, propertyId: UUID, matchScore: Double, createdAt: Date = Date(), matchedAt: Date = Date(), property: Property? = nil, hasUnreadMessages: Bool = false, lastMessage: String? = nil) {
        self.id = id
        self.searcherId = searcherId
        self.propertyId = propertyId
        self.matchScore = matchScore
        self.createdAt = createdAt
        self.matchedAt = matchedAt
        self.property = property
        self.hasUnreadMessages = hasUnreadMessages
        self.lastMessage = lastMessage
    }

    enum CodingKeys: String, CodingKey {
        case id
        case searcherId = "searcher_id"
        case propertyId = "property_id"
        case matchScore = "match_score"
        case createdAt = "created_at"
        case matchedAt = "matched_at"
        case property
        case hasUnreadMessages = "has_unread_messages"
        case lastMessage = "last_message"
    }
}
