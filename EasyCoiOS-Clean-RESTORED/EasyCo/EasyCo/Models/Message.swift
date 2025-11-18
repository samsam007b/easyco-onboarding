import Foundation

// MARK: - Message Model

struct Message: Identifiable, Codable, Equatable {
    let id: UUID
    let conversationId: UUID
    let senderId: UUID
    let senderName: String
    let senderAvatarURL: String?
    let content: String
    let attachments: [MessageAttachment]
    let timestamp: Date
    var isRead: Bool
    var isSentByCurrentUser: Bool

    init(
        id: UUID = UUID(),
        conversationId: UUID,
        senderId: UUID,
        senderName: String,
        senderAvatarURL: String? = nil,
        content: String,
        attachments: [MessageAttachment] = [],
        timestamp: Date = Date(),
        isRead: Bool = false,
        isSentByCurrentUser: Bool = false
    ) {
        self.id = id
        self.conversationId = conversationId
        self.senderId = senderId
        self.senderName = senderName
        self.senderAvatarURL = senderAvatarURL
        self.content = content
        self.attachments = attachments
        self.timestamp = timestamp
        self.isRead = isRead
        self.isSentByCurrentUser = isSentByCurrentUser
    }
}

// MARK: - Message Attachment

struct MessageAttachment: Identifiable, Codable, Equatable {
    let id: UUID
    let type: AttachmentType
    let url: String
    let thumbnailURL: String?
    let filename: String?
    let fileSize: Int?

    enum AttachmentType: String, Codable {
        case image
        case document
        case location
    }
}

// MARK: - Conversation Model

struct Conversation: Identifiable, Codable, Equatable {
    let id: UUID
    let propertyId: UUID?
    let propertyTitle: String?
    let propertyImageURL: String?
    let otherUserId: UUID
    let otherUserName: String
    let otherUserAvatarURL: String?
    let otherUserRole: UserType
    var lastMessage: Message?
    var unreadCount: Int
    var updatedAt: Date
    var isTyping: Bool

    init(
        id: UUID = UUID(),
        propertyId: UUID? = nil,
        propertyTitle: String? = nil,
        propertyImageURL: String? = nil,
        otherUserId: UUID,
        otherUserName: String,
        otherUserAvatarURL: String? = nil,
        otherUserRole: UserType,
        lastMessage: Message? = nil,
        unreadCount: Int = 0,
        updatedAt: Date = Date(),
        isTyping: Bool = false
    ) {
        self.id = id
        self.propertyId = propertyId
        self.propertyTitle = propertyTitle
        self.propertyImageURL = propertyImageURL
        self.otherUserId = otherUserId
        self.otherUserName = otherUserName
        self.otherUserAvatarURL = otherUserAvatarURL
        self.otherUserRole = otherUserRole
        self.lastMessage = lastMessage
        self.unreadCount = unreadCount
        self.updatedAt = updatedAt
        self.isTyping = isTyping
    }

    var formattedLastMessageTime: String {
        let calendar = Calendar.current
        let now = Date()

        if calendar.isDateInToday(updatedAt) {
            let formatter = DateFormatter()
            formatter.timeStyle = .short
            return formatter.string(from: updatedAt)
        } else if calendar.isDateInYesterday(updatedAt) {
            return "Hier"
        } else if let days = calendar.dateComponents([.day], from: updatedAt, to: now).day, days < 7 {
            let formatter = DateFormatter()
            formatter.dateFormat = "EEEE"
            return formatter.string(from: updatedAt)
        } else {
            let formatter = DateFormatter()
            formatter.dateFormat = "dd/MM/yy"
            return formatter.string(from: updatedAt)
        }
    }
}

// MARK: - Mock Data

extension Message {
    static let mockMessages: [Message] = [
        Message(
            conversationId: UUID(),
            senderId: UUID(),
            senderName: "Marie Dubois",
            content: "Bonjour, je suis intéressée par votre propriété. Est-elle toujours disponible ?",
            timestamp: Date().addingTimeInterval(-3600),
            isRead: true,
            isSentByCurrentUser: true
        ),
        Message(
            conversationId: UUID(),
            senderId: UUID(),
            senderName: "Jean Martin",
            content: "Oui, elle est encore disponible ! Voulez-vous planifier une visite ?",
            timestamp: Date().addingTimeInterval(-1800),
            isRead: true,
            isSentByCurrentUser: false
        ),
        Message(
            conversationId: UUID(),
            senderId: UUID(),
            senderName: "Marie Dubois",
            content: "Parfait ! Je serais disponible ce samedi après-midi si possible.",
            timestamp: Date().addingTimeInterval(-900),
            isRead: true,
            isSentByCurrentUser: true
        ),
        Message(
            conversationId: UUID(),
            senderId: UUID(),
            senderName: "Jean Martin",
            content: "Samedi 14h vous convient ? Je vous envoie l'adresse exacte.",
            timestamp: Date().addingTimeInterval(-300),
            isRead: false,
            isSentByCurrentUser: false
        )
    ]
}

extension Conversation {
    static let mockConversations: [Conversation] = [
        Conversation(
            propertyId: UUID(),
            propertyTitle: "Studio Lumineux - Centre Ville",
            propertyImageURL: "https://picsum.photos/400/300",
            otherUserId: UUID(),
            otherUserName: "Jean Martin",
            otherUserAvatarURL: nil,
            otherUserRole: .owner,
            lastMessage: Message(
                conversationId: UUID(),
                senderId: UUID(),
                senderName: "Jean Martin",
                content: "Samedi 14h vous convient ? Je vous envoie l'adresse exacte.",
                timestamp: Date().addingTimeInterval(-300),
                isSentByCurrentUser: false
            ),
            unreadCount: 2,
            updatedAt: Date().addingTimeInterval(-300)
        ),
        Conversation(
            propertyId: UUID(),
            propertyTitle: "Colocation 3 Chambres",
            propertyImageURL: "https://picsum.photos/401/300",
            otherUserId: UUID(),
            otherUserName: "Sophie Lefebvre",
            otherUserAvatarURL: nil,
            otherUserRole: .owner,
            lastMessage: Message(
                conversationId: UUID(),
                senderId: UUID(),
                senderName: "Marie",
                content: "Merci pour les informations ! Je vais réfléchir.",
                timestamp: Date().addingTimeInterval(-86400),
                isSentByCurrentUser: true
            ),
            unreadCount: 0,
            updatedAt: Date().addingTimeInterval(-86400)
        ),
        Conversation(
            propertyId: UUID(),
            propertyTitle: "Appartement 2 Pièces - Quartier Calme",
            propertyImageURL: "https://picsum.photos/402/300",
            otherUserId: UUID(),
            otherUserName: "Thomas Durand",
            otherUserAvatarURL: nil,
            otherUserRole: .owner,
            lastMessage: Message(
                conversationId: UUID(),
                senderId: UUID(),
                senderName: "Thomas Durand",
                content: "Bonjour, n'hésitez pas si vous avez des questions !",
                timestamp: Date().addingTimeInterval(-172800),
                isSentByCurrentUser: false
            ),
            unreadCount: 0,
            updatedAt: Date().addingTimeInterval(-172800)
        )
    ]
}
