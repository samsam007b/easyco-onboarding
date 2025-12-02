//
//  MessagesViewModel.swift
//  EasyCo
//
//  ViewModel for messages/conversations
//

import Foundation
import Combine

@MainActor
class ConversationsViewModel: ObservableObject {
    @Published var conversations: [Conversation] = []
    @Published var isLoading = false
    @Published var error: AppError?

    private let messagingService = MessagingService.shared
    private var cancellables = Set<AnyCancellable>()

    init() {
        // Subscribe to messaging service updates
        messagingService.$conversations
            .assign(to: &$conversations)
    }

    // MARK: - Load Conversations

    func loadConversations() async {
        isLoading = true
        error = nil

        do {
            _ = try await messagingService.getConversations()
            isLoading = false
        } catch let apiError as APIError {
            error = apiError.toAppError
            isLoading = false
        } catch {
            self.error = .server
            isLoading = false
        }
    }

    // MARK: - Refresh

    func refresh() async {
        await loadConversations()
    }
}

@MainActor
class ConversationViewModel: ObservableObject {
    @Published var messages: [Message] = []
    @Published var isLoading = false
    @Published var isSending = false
    @Published var error: AppError?
    @Published var isTyping = false

    let conversationId: String

    private let messagingService = MessagingService.shared
    private let webSocketManager = WebSocketManager.shared
    private var cancellables = Set<AnyCancellable>()

    init(conversationId: String) {
        self.conversationId = conversationId
        subscribeToWebSocket()
    }

    // MARK: - WebSocket Subscription

    private func subscribeToWebSocket() {
        // Subscribe to conversation
        webSocketManager.subscribeToMessages(conversationId: conversationId)

        // Listen for incoming messages
        webSocketManager.messagePublisher
            .sink { [weak self] wsMessage in
                guard let self = self else { return }

                switch wsMessage.type {
                case .message:
                    if let message = wsMessage.data?.message,
                       message.conversationId == self.conversationId {
                        self.handleNewMessage(message)
                    }

                case .messageRead:
                    if let messageId = wsMessage.data?.message?.id {
                        self.handleMessageRead(messageId)
                    }

                case .typing:
                    if let isTyping = wsMessage.data?.isTyping,
                       wsMessage.data?.conversationId == self.conversationId {
                        self.isTyping = isTyping
                    }

                default:
                    break
                }
            }
            .store(in: &cancellables)
    }

    // MARK: - Load Messages

    func loadMessages() async {
        isLoading = true
        error = nil

        do {
            let loadedMessages = try await messagingService.getMessages(conversationId: conversationId)
            messages = loadedMessages.reversed() // Newest last
            isLoading = false
        } catch let apiError as APIError {
            error = apiError.toAppError
            isLoading = false
        } catch {
            self.error = .server
            isLoading = false
        }
    }

    // MARK: - Send Message

    func sendMessage(text: String) async {
        guard !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
            return
        }

        isSending = true

        do {
            let message = try await messagingService.sendMessage(
                conversationId: conversationId,
                text: text
            )

            // Add to local messages
            messages.append(message)

            isSending = false

            // Play haptic
            Haptic.impact(.light)

        } catch {
            print("Send message error: \(error)")
            isSending = false
        }
    }

    // MARK: - Mark Read

    func markAsRead(messageId: String) async {
        do {
            try await messagingService.markMessageAsRead(
                conversationId: conversationId,
                messageId: messageId
            )
        } catch {
            print("Mark read error: \(error)")
        }
    }

    // MARK: - Typing Indicator

    func setTyping(_ typing: Bool) {
        webSocketManager.sendTypingIndicator(conversationId: conversationId, isTyping: typing)
    }

    // MARK: - WebSocket Handlers

    private func handleNewMessage(_ message: Message) {
        // Check if message already exists
        guard !messages.contains(where: { $0.id == message.id }) else {
            return
        }

        messages.append(message)

        // Mark as read if from other user
        if message.senderId != AuthService.shared.currentUser?.id {
            Task {
                await markAsRead(messageId: message.id)
            }
        }
    }

    private func handleMessageRead(_ messageId: String) {
        if let index = messages.firstIndex(where: { $0.id == messageId }) {
            messages[index].isRead = true
        }
    }
}
