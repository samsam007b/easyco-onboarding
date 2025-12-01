import Foundation

// MARK: - Supabase Message Models

/// Message type for Supabase messages
enum SupabaseMessageType: String, Codable {
    case text
    case system
    case application
}

/// Message from Supabase database
struct SupabaseMessage: Identifiable, Codable {
    let id: UUID
    let conversationId: UUID
    let senderId: UUID
    let content: String
    let createdAt: Date
    let updatedAt: Date
    let isRead: Bool
    let attachments: [MessageAttachment]?
    let messageType: SupabaseMessageType

    enum CodingKeys: String, CodingKey {
        case id
        case conversationId = "conversation_id"
        case senderId = "sender_id"
        case content
        case createdAt = "created_at"
        case updatedAt = "updated_at"
        case isRead = "is_read"
        case attachments
        case messageType = "message_type"
    }
}

// Note: MessageAttachment is defined in Conversation.swift

/// Supabase conversation
struct SupabaseConversation: Identifiable, Codable {
    let id: UUID
    let createdAt: Date
    let updatedAt: Date
    let subject: String?
    let propertyId: UUID?
    let lastMessageAt: Date

    enum CodingKeys: String, CodingKey {
        case id
        case createdAt = "created_at"
        case updatedAt = "updated_at"
        case subject
        case propertyId = "property_id"
        case lastMessageAt = "last_message_at"
    }
}

/// Conversation participant
struct ConversationParticipant: Identifiable, Codable {
    let id: UUID
    let conversationId: UUID
    let userId: UUID
    let joinedAt: Date
    let lastReadAt: Date
    let isArchived: Bool

    enum CodingKeys: String, CodingKey {
        case id
        case conversationId = "conversation_id"
        case userId = "user_id"
        case joinedAt = "joined_at"
        case lastReadAt = "last_read_at"
        case isArchived = "is_archived"
    }
}

// MARK: - Extended Conversation for UI

/// Extended conversation with participant and message data
struct ConversationWithDetails: Identifiable {
    let conversation: SupabaseConversation
    let participants: [ConversationParticipant]
    let lastMessage: SupabaseMessage?
    let otherParticipant: User?
    let property: Property?

    var id: UUID { conversation.id }

    var otherUserName: String {
        if let participant = otherParticipant {
            return "\(participant.firstName ?? "") \(participant.lastName ?? "")".trimmingCharacters(in: .whitespaces)
        }
        return "Utilisateur"
    }

    var otherUserAvatarURL: String? {
        otherParticipant?.profileImageURL
    }

    var unreadCount: Int {
        // Calculate from participants and messages
        guard let myParticipant = participants.first(where: { $0.userId == getCurrentUserId() }) else {
            return 0
        }
        // This will be calculated server-side or from messages
        return 0 // TODO: Implement unread count
    }

    var formattedLastMessageTime: String {
        let calendar = Calendar.current
        let now = Date()
        let messageDate = conversation.lastMessageAt

        if calendar.isDateInToday(messageDate) {
            let formatter = DateFormatter()
            formatter.dateFormat = "HH:mm"
            return formatter.string(from: messageDate)
        } else if calendar.isDateInYesterday(messageDate) {
            return "Hier"
        } else if let daysAgo = calendar.dateComponents([.day], from: messageDate, to: now).day, daysAgo < 7 {
            let formatter = DateFormatter()
            formatter.dateFormat = "EEEE"
            formatter.locale = Locale(identifier: "fr_FR")
            return formatter.string(from: messageDate)
        } else {
            let formatter = DateFormatter()
            formatter.dateFormat = "dd/MM/yy"
            return formatter.string(from: messageDate)
        }
    }

    private func getCurrentUserId() -> UUID {
        // Get from AuthManager
        return AuthManager.shared.currentUser?.id ?? UUID()
    }
}

// MARK: - Message with Sender Info

/// Extended message with sender information
struct MessageWithSender: Identifiable {
    let message: SupabaseMessage
    let sender: User?

    var id: UUID { message.id }

    var senderName: String {
        if let sender = sender {
            return "\(sender.firstName ?? "") \(sender.lastName ?? "")".trimmingCharacters(in: .whitespaces)
        }
        return "Utilisateur"
    }

    var senderAvatarURL: String? {
        sender?.profileImageURL
    }

    var isSentByCurrentUser: Bool {
        message.senderId == getCurrentUserId()
    }

    private func getCurrentUserId() -> UUID {
        return AuthManager.shared.currentUser?.id ?? UUID()
    }
}
