//
//  MessagingService.swift
//  EasyCo
//
//  Messaging service
//

import Foundation
import Combine

class MessagingService: ObservableObject {
    static let shared = MessagingService()

    @Published var conversations: [Conversation] = []
    @Published var unreadCount: Int = 0

    private let networkManager = NetworkManager.shared
    private var cancellables = Set<AnyCancellable>()

    private init() {}

    // MARK: - Get Conversations

    func getConversations() async throws -> [Conversation] {
        let request = GetConversationsRequest()
        let response = try await networkManager.execute(request)

        await MainActor.run {
            self.conversations = response.conversations
            self.updateUnreadCount()
        }

        return response.conversations
    }

    // MARK: - Get Conversation

    func getConversation(id: String) async throws -> Conversation {
        let request = GetConversationRequest(id: id)
        return try await networkManager.execute(request)
    }

    // MARK: - Get Messages

    func getMessages(conversationId: String, page: Int = 1, limit: Int = 50) async throws -> [Message] {
        let request = GetMessagesRequest(conversationId: conversationId, page: page, limit: limit)
        let response = try await networkManager.execute(request)
        return response.messages
    }

    // MARK: - Send Message

    func sendMessage(conversationId: String, text: String, attachments: [String]? = nil) async throws -> Message {
        let request = SendMessageRequest(conversationId: conversationId, text: text, attachments: attachments)
        let message = try await networkManager.execute(request)

        // Update local conversation
        await MainActor.run {
            if let index = conversations.firstIndex(where: { $0.id == conversationId }) {
                conversations[index].lastMessage = message
                conversations[index].lastMessageAt = message.createdAt
            }
        }

        return message
    }

    // MARK: - Mark Read

    func markMessageAsRead(conversationId: String, messageId: String) async throws {
        let request = MarkMessageReadRequest(conversationId: conversationId, messageId: messageId)
        _ = try await networkManager.execute(request)

        // Update local unread count
        await MainActor.run {
            if let index = conversations.firstIndex(where: { $0.id == conversationId }) {
                conversations[index].unreadCount = max(0, conversations[index].unreadCount - 1)
                updateUnreadCount()
            }
        }
    }

    // MARK: - Helpers

    private func updateUnreadCount() {
        unreadCount = conversations.reduce(0) { $0 + $1.unreadCount }
    }
}
