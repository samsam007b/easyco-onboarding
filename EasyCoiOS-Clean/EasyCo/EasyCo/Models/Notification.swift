import Foundation

// MARK: - AnyCodable for JSONB support

/// Type-erased Codable value for handling JSONB data
struct AnyCodable: Codable {
    let value: Any

    init(_ value: Any) {
        self.value = value
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()

        if let bool = try? container.decode(Bool.self) {
            value = bool
        } else if let int = try? container.decode(Int.self) {
            value = int
        } else if let double = try? container.decode(Double.self) {
            value = double
        } else if let string = try? container.decode(String.self) {
            value = string
        } else if let array = try? container.decode([AnyCodable].self) {
            value = array.map { $0.value }
        } else if let dictionary = try? container.decode([String: AnyCodable].self) {
            value = dictionary.mapValues { $0.value }
        } else {
            throw DecodingError.dataCorruptedError(
                in: container,
                debugDescription: "AnyCodable value cannot be decoded"
            )
        }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()

        switch value {
        case let bool as Bool:
            try container.encode(bool)
        case let int as Int:
            try container.encode(int)
        case let double as Double:
            try container.encode(double)
        case let string as String:
            try container.encode(string)
        case let array as [Any]:
            try container.encode(array.map { AnyCodable($0) })
        case let dictionary as [String: Any]:
            try container.encode(dictionary.mapValues { AnyCodable($0) })
        default:
            let context = EncodingError.Context(
                codingPath: container.codingPath,
                debugDescription: "AnyCodable value cannot be encoded"
            )
            throw EncodingError.invalidValue(value, context)
        }
    }
}

// MARK: - Notification Models

/// Notification type enumeration
enum NotificationType: String, Codable {
    case message = "message"
    case propertyUpdate = "property_update"
    case newApplication = "new_application"
    case applicationStatusChange = "application_status_change"
    case taskAssignment = "task_assignment"
    case expenseAdded = "expense_added"
    case paymentReminder = "payment_reminder"
    case householdInvite = "household_invite"
    case systemAnnouncement = "system_announcement"

    var icon: String {
        switch self {
        case .message: return "envelope.fill"
        case .propertyUpdate: return "house.fill"
        case .newApplication: return "person.badge.plus"
        case .applicationStatusChange: return "checkmark.circle.fill"
        case .taskAssignment: return "list.bullet.circle.fill"
        case .expenseAdded: return "cart.fill"
        case .paymentReminder: return "bell.badge.fill"
        case .householdInvite: return "person.2.fill"
        case .systemAnnouncement: return "megaphone.fill"
        }
    }

    var color: String {
        switch self {
        case .message: return "3B82F6" // Blue
        case .propertyUpdate: return "10B981" // Green
        case .newApplication: return "8B5CF6" // Purple
        case .applicationStatusChange: return "F59E0B" // Yellow
        case .taskAssignment: return "EC4899" // Pink
        case .expenseAdded: return "06B6D4" // Cyan
        case .paymentReminder: return "EF4444" // Red
        case .householdInvite: return "14B8A6" // Teal
        case .systemAnnouncement: return "6366F1" // Indigo
        }
    }
}

/// Notification priority level
enum NotificationPriority: String, Codable {
    case low = "low"
    case normal = "normal"
    case high = "high"
    case urgent = "urgent"
}

/// App notification model (matches Supabase schema)
struct AppNotification: Codable, Identifiable {
    let id: UUID
    let userId: UUID
    let type: NotificationType
    let title: String
    let message: String
    let isRead: Bool
    let readAt: Date?
    let createdAt: Date
    let updatedAt: Date?
    let expiresAt: Date?
    let actionUrl: String?
    let actionLabel: String?
    let data: [String: AnyCodable]?
    let relatedUserId: UUID?
    let relatedPropertyId: UUID?
    let relatedMessageId: UUID?
    let relatedConversationId: UUID?

    // Computed property for priority (derived from type)
    var priority: NotificationPriority {
        switch type {
        case .paymentReminder, .message:
            return .high
        case .systemAnnouncement:
            return .low
        default:
            return .normal
        }
    }

    var timeAgo: String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: createdAt, relativeTo: Date())
    }

    enum CodingKeys: String, CodingKey {
        case id
        case userId = "user_id"
        case type
        case title
        case message
        case isRead = "is_read"
        case readAt = "read_at"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
        case expiresAt = "expires_at"
        case actionUrl = "action_url"
        case actionLabel = "action_label"
        case data
        case relatedUserId = "related_user_id"
        case relatedPropertyId = "related_property_id"
        case relatedMessageId = "related_message_id"
        case relatedConversationId = "related_conversation_id"
    }
}

// NotificationData is now replaced by the JSONB 'data' field in AppNotification
// Access data using: notification.data?["key"]?.value

/// Notification preferences
struct NotificationPreferences: Codable {
    var messagesEnabled: Bool
    var propertyUpdatesEnabled: Bool
    var applicationsEnabled: Bool
    var tasksEnabled: Bool
    var expensesEnabled: Bool
    var paymentsEnabled: Bool
    var householdEnabled: Bool
    var systemEnabled: Bool

    // Push notification settings
    var pushEnabled: Bool
    var emailEnabled: Bool
    var inAppEnabled: Bool

    // Quiet hours
    var quietHoursEnabled: Bool
    var quietHoursStart: String // Format: "22:00"
    var quietHoursEnd: String   // Format: "08:00"

    static var `default`: NotificationPreferences {
        NotificationPreferences(
            messagesEnabled: true,
            propertyUpdatesEnabled: true,
            applicationsEnabled: true,
            tasksEnabled: true,
            expensesEnabled: true,
            paymentsEnabled: true,
            householdEnabled: true,
            systemEnabled: true,
            pushEnabled: true,
            emailEnabled: true,
            inAppEnabled: true,
            quietHoursEnabled: false,
            quietHoursStart: "22:00",
            quietHoursEnd: "08:00"
        )
    }
}

/// Push notification registration payload
struct PushNotificationToken: Codable {
    let token: String
    let deviceId: String
    let platform: String // "ios"
    let appVersion: String

    enum CodingKeys: String, CodingKey {
        case token
        case deviceId = "device_id"
        case platform
        case appVersion = "app_version"
    }
}

// MARK: - Mock Data

extension AppNotification {
    static var mockData: [AppNotification] {
        [
            AppNotification(
                id: UUID(),
                userId: UUID(),
                type: .message,
                title: "Nouveau message",
                message: "Sophie vous a envoyé un message concernant la visite",
                isRead: false,
                readAt: nil,
                createdAt: Date().addingTimeInterval(-300),
                updatedAt: nil,
                expiresAt: nil,
                actionUrl: "/messages",
                actionLabel: "Voir le message",
                data: nil,
                relatedUserId: UUID(),
                relatedPropertyId: nil,
                relatedMessageId: UUID(),
                relatedConversationId: UUID()
            ),
            AppNotification(
                id: UUID(),
                userId: UUID(),
                type: .newApplication,
                title: "Nouvelle demande",
                message: "Marc a postulé pour votre propriété 'Appart Centre-Ville'",
                isRead: false,
                readAt: nil,
                createdAt: Date().addingTimeInterval(-3600),
                updatedAt: nil,
                expiresAt: nil,
                actionUrl: "/applications",
                actionLabel: "Voir la demande",
                data: ["application_id": AnyCodable(UUID().uuidString)],
                relatedUserId: UUID(),
                relatedPropertyId: UUID(),
                relatedMessageId: nil,
                relatedConversationId: nil
            ),
            AppNotification(
                id: UUID(),
                userId: UUID(),
                type: .taskAssignment,
                title: "Nouvelle tâche",
                message: "Vous avez été assigné à 'Sortir les poubelles'",
                isRead: true,
                readAt: Date().addingTimeInterval(-7000),
                createdAt: Date().addingTimeInterval(-7200),
                updatedAt: Date().addingTimeInterval(-7000),
                expiresAt: nil,
                actionUrl: "/household/tasks",
                actionLabel: "Voir la tâche",
                data: ["task_id": AnyCodable(UUID().uuidString)],
                relatedUserId: nil,
                relatedPropertyId: nil,
                relatedMessageId: nil,
                relatedConversationId: nil
            ),
            AppNotification(
                id: UUID(),
                userId: UUID(),
                type: .expenseAdded,
                title: "Nouvelle dépense",
                message: "Alex a ajouté une dépense: Courses (€45.50)",
                isRead: true,
                readAt: Date().addingTimeInterval(-86000),
                createdAt: Date().addingTimeInterval(-86400),
                updatedAt: Date().addingTimeInterval(-86000),
                expiresAt: nil,
                actionUrl: "/household/expenses",
                actionLabel: "Voir la dépense",
                data: ["expense_id": AnyCodable(UUID().uuidString), "amount": AnyCodable(45.50)],
                relatedUserId: UUID(),
                relatedPropertyId: nil,
                relatedMessageId: nil,
                relatedConversationId: nil
            ),
            AppNotification(
                id: UUID(),
                userId: UUID(),
                type: .paymentReminder,
                title: "Rappel de paiement",
                message: "Le loyer de ce mois est dû dans 3 jours",
                isRead: true,
                readAt: Date().addingTimeInterval(-172400),
                createdAt: Date().addingTimeInterval(-172800),
                updatedAt: Date().addingTimeInterval(-172400),
                expiresAt: Date().addingTimeInterval(86400 * 3),
                actionUrl: "/household/payments",
                actionLabel: "Payer maintenant",
                data: ["days_remaining": AnyCodable(3)],
                relatedUserId: nil,
                relatedPropertyId: nil,
                relatedMessageId: nil,
                relatedConversationId: nil
            ),
            AppNotification(
                id: UUID(),
                userId: UUID(),
                type: .systemAnnouncement,
                title: "Mise à jour disponible",
                message: "Une nouvelle version de l'app est disponible avec des améliorations",
                isRead: true,
                readAt: Date().addingTimeInterval(-258800),
                createdAt: Date().addingTimeInterval(-259200),
                updatedAt: Date().addingTimeInterval(-258800),
                expiresAt: nil,
                actionUrl: nil,
                actionLabel: nil,
                data: ["version": AnyCodable("1.2.0")],
                relatedUserId: nil,
                relatedPropertyId: nil,
                relatedMessageId: nil,
                relatedConversationId: nil
            )
        ]
    }
}
