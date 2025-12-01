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
    var createdAt: Date { timestamp }

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
    var isGroup: Bool
    var isOtherUserOnline: Bool
    var isOtherUserTyping: Bool

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
        isTyping: Bool = false,
        isGroup: Bool = false,
        isOtherUserOnline: Bool = false,
        isOtherUserTyping: Bool = false
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
        self.isGroup = isGroup
        self.isOtherUserOnline = isOtherUserOnline
        self.isOtherUserTyping = isOtherUserTyping
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
        )
    ]
}

// MARK: - Owner Conversation Type

enum OwnerConversationType: String, Codable {
    case candidate
    case tenant
}

// MARK: - Owner Conversation Model

struct OwnerConversation: Identifiable, Codable {
    let id: UUID
    let recipientId: String
    let recipientName: String
    let recipientAvatar: String?
    let lastMessage: String
    let lastMessageTime: Date
    var unreadCount: Int
    let isOnline: Bool
    let type: OwnerConversationType
    let context: String // Property or application context

    var contextIcon: String {
        switch type {
        case .candidate: return "doc.text"
        case .tenant: return "house.fill"
        }
    }

    static var mockConversations: [OwnerConversation] {
        [
            OwnerConversation(
                id: UUID(),
                recipientId: "user-1",
                recipientName: "Sophie Martin",
                recipientAvatar: nil,
                lastMessage: "Je suis très intéressée par l'appartement",
                lastMessageTime: Date().addingTimeInterval(-3600),
                unreadCount: 2,
                isOnline: true,
                type: .candidate,
                context: "Candidature pour Studio meublé - Ixelles"
            ),
            OwnerConversation(
                id: UUID(),
                recipientId: "user-2",
                recipientName: "Thomas Dubois",
                recipientAvatar: nil,
                lastMessage: "Le chauffage fonctionne bien maintenant, merci !",
                lastMessageTime: Date().addingTimeInterval(-86400),
                unreadCount: 0,
                isOnline: false,
                type: .tenant,
                context: "Locataire - 2 chambres Saint-Gilles"
            )
        ]
    }
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
                content: "Samedi 14h vous convient ?",
                timestamp: Date().addingTimeInterval(-300),
                isSentByCurrentUser: false
            ),
            unreadCount: 2,
            updatedAt: Date().addingTimeInterval(-300)
        ),
        Conversation(
            propertyId: UUID(),
            propertyTitle: "Colocation 3 Chambres",
            otherUserId: UUID(),
            otherUserName: "Sophie Lefebvre",
            otherUserRole: .owner,
            lastMessage: Message(
                conversationId: UUID(),
                senderId: UUID(),
                senderName: "Marie",
                content: "Merci pour les informations !",
                timestamp: Date().addingTimeInterval(-86400),
                isSentByCurrentUser: true
            ),
            unreadCount: 0,
            updatedAt: Date().addingTimeInterval(-86400)
        )
    ]
}
