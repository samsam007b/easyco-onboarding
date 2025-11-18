//
//  GroupChatViewModel.swift
//  EasyCo
//
//  ViewModel pour le chat de groupe de la colocation
//

import Foundation
import SwiftUI
import Combine

@MainActor
class GroupChatViewModel: ObservableObject {
    // MARK: - Published Properties

    @Published var messages: [Message] = []
    @Published var newMessageText = ""
    @Published var isLoading = false
    @Published var isSending = false
    @Published var errorMessage: String?
    @Published var showError = false

    // Typing indicators
    @Published var typingUsers: [String] = []

    // Pinned messages
    @Published var pinnedMessages: [Message] = []

    // MARK: - Properties

    private var householdId: UUID
    private var currentUserId: UUID

    // MARK: - Initialization

    init(householdId: UUID = UUID(), currentUserId: UUID = UUID()) {
        self.householdId = householdId
        self.currentUserId = currentUserId
        loadMessages()
    }

    // MARK: - Data Loading

    func loadMessages() {
        isLoading = true

        _Concurrency.Task {
            do {
                if AppConfig.FeatureFlags.demoMode {
                    try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
                    self.messages = Message.mockGroupMessages
                    self.pinnedMessages = self.messages.filter { $0.isPinned }
                } else {
                    // TODO: API call + WebSocket setup
                    self.messages = []
                }

                self.isLoading = false
            } catch {
                self.errorMessage = "Erreur lors du chargement des messages"
                self.showError = true
                self.isLoading = false
            }
        }
    }

    func refresh() async {
        loadMessages()
    }

    // MARK: - Send Message

    func sendMessage() {
        guard !newMessageText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }

        isSending = true

        let message = Message(
            id: UUID(),
            conversationId: householdId,
            senderId: currentUserId,
            senderName: "Moi",
            content: newMessageText,
            messageType: .text,
            timestamp: Date(),
            isRead: true,
            isPinned: false
        )

        _Concurrency.Task {
            do {
                if AppConfig.FeatureFlags.demoMode {
                    try? await _Concurrency.Task.sleep(nanoseconds: 300_000_000)
                    self.messages.append(message)
                } else {
                    // TODO: WebSocket send
                }

                self.newMessageText = ""
                self.isSending = false
            } catch {
                self.errorMessage = "Erreur lors de l'envoi du message"
                self.showError = true
                self.isSending = false
            }
        }
    }

    // MARK: - Message Actions

    func togglePin(_ message: Message) async {
        guard let index = messages.firstIndex(where: { $0.id == message.id }) else { return }

        messages[index].isPinned.toggle()

        if messages[index].isPinned {
            pinnedMessages.append(messages[index])
        } else {
            pinnedMessages.removeAll { $0.id == message.id }
        }

        // TODO: API call to persist
    }

    func deleteMessage(_ messageId: UUID) async {
        messages.removeAll { $0.id == messageId }
        pinnedMessages.removeAll { $0.id == messageId }
        // TODO: API call
    }

    func reactToMessage(_ messageId: UUID, reaction: String) async {
        // TODO: Implement reactions
    }

    // MARK: - Typing Indicator

    func userStartedTyping() {
        // TODO: Send typing indicator via WebSocket
    }

    func userStoppedTyping() {
        // TODO: Stop typing indicator
    }
}

// MARK: - Message Extension for Mock Data

extension Message {
    static let mockGroupMessages: [Message] = [
        Message(
            conversationId: UUID(),
            senderId: UUID(),
            senderName: "Marie",
            content: "Salut tout le monde ! Qui est motivé pour une soirée pizza ce soir ? 🍕",
            messageType: .text,
            timestamp: Date().addingTimeInterval(-3600 * 5)
        ),
        Message(
            conversationId: UUID(),
            senderId: UUID(),
            senderName: "Thomas",
            content: "Moi je suis partant ! On commande où ?",
            messageType: .text,
            timestamp: Date().addingTimeInterval(-3600 * 4.5)
        ),
        Message(
            conversationId: UUID(),
            senderId: UUID(),
            senderName: "Julie",
            content: "Super idée ! Je propose Domino's, ils ont une promo en ce moment",
            messageType: .text,
            timestamp: Date().addingTimeInterval(-3600 * 4)
        ),
        Message(
            conversationId: UUID(),
            senderId: UUID(),
            senderName: "Marie",
            content: "RAPPEL IMPORTANT : Réunion mensuelle demain à 19h !",
            messageType: .text,
            timestamp: Date().addingTimeInterval(-3600 * 3),
            isPinned: true
        ),
        Message(
            conversationId: UUID(),
            senderId: UUID(),
            senderName: "Marc",
            content: "Ok pour la pizza ! Par contre je ne pourrai pas être là pour la réunion demain 😞",
            messageType: .text,
            timestamp: Date().addingTimeInterval(-3600 * 2)
        ),
        Message(
            conversationId: UUID(),
            senderId: UUID(),
            senderName: "Thomas",
            content: "Pas de soucis Marc. On prend en note pour demain",
            messageType: .text,
            timestamp: Date().addingTimeInterval(-3600 * 1.5)
        ),
        Message(
            conversationId: UUID(),
            senderId: UUID(),
            senderName: "Julie",
            content: "Au fait, quelqu'un a vu mes clés ? Je les cherche depuis ce matin...",
            messageType: .text,
            timestamp: Date().addingTimeInterval(-3600 * 1)
        ),
        Message(
            conversationId: UUID(),
            senderId: UUID(),
            senderName: "Marie",
            content: "Je crois les avoir vues sur la table de la cuisine 🔑",
            messageType: .text,
            timestamp: Date().addingTimeInterval(-1800)
        ),
        Message(
            conversationId: UUID(),
            senderId: UUID(),
            senderName: "Julie",
            content: "Merci Marie ! Trouvées 😊",
            messageType: .text,
            timestamp: Date().addingTimeInterval(-1200)
        ),
        Message(
            conversationId: UUID(),
            senderId: UUID(),
            senderName: "Marc",
            content: "Bon alors cette pizza, on commande ?",
            messageType: .text,
            timestamp: Date().addingTimeInterval(-600)
        )
    ]
}
