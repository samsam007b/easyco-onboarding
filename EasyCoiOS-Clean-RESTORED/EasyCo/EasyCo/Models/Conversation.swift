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
    var propertyID: UUID?
    var otherParticipantData: ParticipantData?

    struct ParticipantData: Codable {
        let name: String
        let initials: String
    }

    // Helper computed properties for UI
    var otherParticipantName: String {
        otherParticipantData?.name ?? "Utilisateur"
    }

    var otherParticipantInitials: String {
        otherParticipantData?.initials ?? "U"
    }

    var propertyTitle: String? {
        // In a real app, this would fetch from property ID
        // For demo, we'll use mock data
        guard propertyID != nil else { return nil }
        return "Appartement 3 pièces"
    }

    // Mock data for demo mode
    static var mockConversations: [Conversation] {
        let now = Date()
        let yesterday = Calendar.current.date(byAdding: .day, value: -1, to: now)!
        let lastWeek = Calendar.current.date(byAdding: .day, value: -7, to: now)!
        let lastMonth = Calendar.current.date(byAdding: .month, value: -1, to: now)!

        return [
            Conversation(
                id: UUID(),
                participants: [UUID(), UUID()],
                lastMessage: Message(
                    id: UUID(),
                    conversationID: UUID(),
                    senderID: UUID(),
                    content: "Bonjour, je suis intéressé par votre appartement. Est-il toujours disponible ?",
                    isRead: false,
                    createdAt: now
                ),
                unreadCount: 2,
                createdAt: now,
                updatedAt: now,
                propertyID: UUID(),
                otherParticipantData: ParticipantData(name: "Marie Dubois", initials: "MD")
            ),
            Conversation(
                id: UUID(),
                participants: [UUID(), UUID()],
                lastMessage: Message(
                    id: UUID(),
                    conversationID: UUID(),
                    senderID: UUID(),
                    content: "Merci pour votre réponse, je pense que ça me convient parfaitement !",
                    isRead: true,
                    createdAt: yesterday
                ),
                unreadCount: 0,
                createdAt: yesterday,
                updatedAt: yesterday,
                propertyID: UUID(),
                otherParticipantData: ParticipantData(name: "Thomas Martin", initials: "TM")
            ),
            Conversation(
                id: UUID(),
                participants: [UUID(), UUID()],
                lastMessage: Message(
                    id: UUID(),
                    conversationID: UUID(),
                    senderID: UUID(),
                    content: "D'accord, quand puis-je venir visiter ?",
                    isRead: false,
                    createdAt: lastWeek
                ),
                unreadCount: 1,
                createdAt: lastWeek,
                updatedAt: lastWeek,
                propertyID: UUID(),
                otherParticipantData: ParticipantData(name: "Sophie Bernard", initials: "SB")
            ),
            Conversation(
                id: UUID(),
                participants: [UUID(), UUID()],
                lastMessage: Message(
                    id: UUID(),
                    conversationID: UUID(),
                    senderID: UUID(),
                    content: "Parfait, à bientôt alors !",
                    isRead: true,
                    createdAt: lastMonth
                ),
                unreadCount: 0,
                createdAt: lastMonth,
                updatedAt: lastMonth,
                propertyID: nil,
                otherParticipantData: ParticipantData(name: "Julien Petit", initials: "JP")
            ),
            Conversation(
                id: UUID(),
                participants: [UUID(), UUID()],
                lastMessage: Message(
                    id: UUID(),
                    conversationID: UUID(),
                    senderID: UUID(),
                    content: "Bonjour, pouvez-vous me donner plus d'informations sur les charges ?",
                    isRead: true,
                    createdAt: lastMonth
                ),
                unreadCount: 0,
                createdAt: lastMonth,
                updatedAt: lastMonth,
                propertyID: UUID(),
                otherParticipantData: ParticipantData(name: "Emma Rousseau", initials: "ER")
            )
        ]
    }
}

struct Message: Identifiable, Codable {
    let id: UUID
    var conversationID: UUID
    var senderID: UUID
    var content: String
    var isRead: Bool
    var createdAt: Date

    // Mock messages for a conversation
    static func mockMessages(for conversationID: UUID, currentUserID: UUID) -> [Message] {
        let now = Date()
        let fiveMinAgo = Calendar.current.date(byAdding: .minute, value: -5, to: now)!
        let tenMinAgo = Calendar.current.date(byAdding: .minute, value: -10, to: now)!
        let fifteenMinAgo = Calendar.current.date(byAdding: .minute, value: -15, to: now)!

        let otherUserID = UUID()

        return [
            Message(
                id: UUID(),
                conversationID: conversationID,
                senderID: otherUserID,
                content: "Bonjour ! Je suis intéressé par votre appartement.",
                isRead: true,
                createdAt: fifteenMinAgo
            ),
            Message(
                id: UUID(),
                conversationID: conversationID,
                senderID: currentUserID,
                content: "Bonjour ! Merci pour votre intérêt. L'appartement est toujours disponible.",
                isRead: true,
                createdAt: tenMinAgo
            ),
            Message(
                id: UUID(),
                conversationID: conversationID,
                senderID: otherUserID,
                content: "Parfait ! Serait-il possible de planifier une visite ?",
                isRead: true,
                createdAt: fiveMinAgo
            ),
            Message(
                id: UUID(),
                conversationID: conversationID,
                senderID: currentUserID,
                content: "Bien sûr ! Je suis disponible cette semaine. Quand vous convient-il ?",
                isRead: true,
                createdAt: now
            )
        ]
    }
}
