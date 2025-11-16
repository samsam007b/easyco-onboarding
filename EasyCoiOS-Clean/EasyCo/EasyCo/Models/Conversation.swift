//
//  Conversation.swift
//  EasyCo
//
//  Created by Claude on 11/11/2025.
//

import Foundation

struct Conversation: Identifiable, Codable {
    let id: UUID
    var participants: [UUID]
    var lastMessage: Message?
    var unreadCount: Int
    var createdAt: Date
    var updatedAt: Date
}

struct Message: Identifiable, Codable {
    let id: UUID
    var conversationID: UUID
    var senderID: UUID
    var content: String
    var isRead: Bool
    var createdAt: Date
}
