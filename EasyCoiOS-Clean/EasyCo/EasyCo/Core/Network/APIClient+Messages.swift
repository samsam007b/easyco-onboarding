import Foundation

// MARK: - APIClient Messages Extension

extension APIClient {
    // MARK: - Conversations

    /// Get all conversations for the current user
    func getConversationsWithDetails() async throws -> [ConversationWithDetails] {
        guard let currentUserId = AuthManager.shared.currentUser?.id else {
            throw NetworkError.unauthorized
        }

        // Get conversations where user is a participant
        let participants: [ConversationParticipant] = try await SupabaseClient.shared
            .from("conversation_participants")
            .select()
            .eq("user_id", value: currentUserId.uuidString)
            .execute()

        // Get conversation IDs
        let conversationIds = participants.map { $0.conversationId.uuidString }
        guard !conversationIds.isEmpty else {
            return []
        }

        // Get full conversations
        let conversations: [SupabaseConversation] = try await SupabaseClient.shared
            .from("conversations")
            .select()
            .in("id", values: conversationIds)
            .order("last_message_at", ascending: false)
            .execute()

        // For each conversation, get the other participant and last message
        var results: [ConversationWithDetails] = []

        for conversation in conversations {
            // Get all participants for this conversation
            let convParticipants: [ConversationParticipant] = try await SupabaseClient.shared
                .from("conversation_participants")
                .select()
                .eq("conversation_id", value: conversation.id.uuidString)
                .execute()

            // Find other participant
            let otherParticipantId = convParticipants.first(where: { $0.userId != currentUserId })?.userId

            var otherUser: User?
            if let otherId = otherParticipantId {
                // Use helper that handles email field absence
                otherUser = try? await APIClient.shared.getUserById(otherId)
            }

            // Get last message
            let messages: [SupabaseMessage] = try await SupabaseClient.shared
                .from("messages")
                .select()
                .eq("conversation_id", value: conversation.id.uuidString)
                .order("created_at", ascending: false)
                .limit(1)
                .execute()

            // Get property if exists
            var property: Property?
            if let propertyId = conversation.propertyId {
                let properties: [Property] = try await SupabaseClient.shared
                    .from("properties")
                    .select()
                    .eq("id", value: propertyId.uuidString)
                    .limit(1)
                    .execute()
                property = properties.first
            }

            let details = ConversationWithDetails(
                conversation: conversation,
                participants: convParticipants,
                lastMessage: messages.first,
                otherParticipant: otherUser,
                property: property
            )
            results.append(details)
        }

        return results
    }

    /// Delete (archive) a conversation
    func deleteConversationById(id: UUID) async throws {
        guard let currentUserId = AuthManager.shared.currentUser?.id else {
            throw NetworkError.unauthorized
        }

        // Update participant record to archived
        struct UpdateData: Codable {
            let isArchived: Bool

            enum CodingKeys: String, CodingKey {
                case isArchived = "is_archived"
            }
        }

        try await SupabaseClient.shared
            .from("conversation_participants")
            .eq("conversation_id", value: id.uuidString)
            .eq("user_id", value: currentUserId.uuidString)
            .update(UpdateData(isArchived: true))
    }

    /// Mark conversation as read
    func markConversationAsReadById(id: UUID) async throws {
        guard let currentUserId = AuthManager.shared.currentUser?.id else {
            throw NetworkError.unauthorized
        }

        struct UpdateData: Codable {
            let lastReadAt: String

            enum CodingKeys: String, CodingKey {
                case lastReadAt = "last_read_at"
            }
        }

        let dateString = ISO8601DateFormatter().string(from: Date())
        try await SupabaseClient.shared
            .from("conversation_participants")
            .eq("conversation_id", value: id.uuidString)
            .eq("user_id", value: currentUserId.uuidString)
            .update(UpdateData(lastReadAt: dateString))
    }

    /// Mark conversation as unread
    func markConversationAsUnreadById(id: UUID) async throws {
        guard let currentUserId = AuthManager.shared.currentUser?.id else {
            throw NetworkError.unauthorized
        }

        struct UpdateData: Codable {
            let lastReadAt: String

            enum CodingKeys: String, CodingKey {
                case lastReadAt = "last_read_at"
            }
        }

        let pastDate = Calendar.current.date(byAdding: .day, value: -1, to: Date()) ?? Date()
        let dateString = ISO8601DateFormatter().string(from: pastDate)
        try await SupabaseClient.shared
            .from("conversation_participants")
            .eq("conversation_id", value: id.uuidString)
            .eq("user_id", value: currentUserId.uuidString)
            .update(UpdateData(lastReadAt: dateString))
    }

    // MARK: - Messages

    /// Get messages for a conversation
    func getMessagesForConversation(conversationId: UUID) async throws -> [MessageWithSender] {
        // Get messages for conversation
        let messages: [SupabaseMessage] = try await SupabaseClient.shared
            .from("messages")
            .select()
            .eq("conversation_id", value: conversationId.uuidString)
            .order("created_at", ascending: true)
            .execute()

        // Get unique sender IDs
        let senderIds = Array(Set(messages.map { $0.senderId.uuidString }))

        // Fetch all senders using helper
        var senders: [UUID: User] = [:]
        for senderId in senderIds {
            if let uuid = UUID(uuidString: senderId),
               let user = try? await APIClient.shared.getUserById(uuid) {
                senders[uuid] = user
            }
        }

        // Combine messages with sender info
        return messages.map { message in
            MessageWithSender(
                message: message,
                sender: senders[message.senderId]
            )
        }
    }

    /// Send a message to a conversation
    func sendMessageToConversation(conversationId: UUID, content: String) async throws -> SupabaseMessage {
        guard let currentUserId = AuthManager.shared.currentUser?.id else {
            throw NetworkError.unauthorized
        }

        // Struct for inserting new message
        struct NewMessage: Codable {
            let conversationId: String
            let senderId: String
            let content: String
            let messageType: String

            enum CodingKeys: String, CodingKey {
                case conversationId = "conversation_id"
                case senderId = "sender_id"
                case content
                case messageType = "message_type"
            }
        }

        let newMessage = NewMessage(
            conversationId: conversationId.uuidString,
            senderId: currentUserId.uuidString,
            content: content,
            messageType: "text"
        )

        let result: [SupabaseMessage] = try await SupabaseClient.shared
            .from("messages")
            .insert(newMessage)

        guard let message = result.first else {
            throw NetworkError.unknown(NSError(domain: "Message not created", code: -1))
        }

        return message
    }
}
