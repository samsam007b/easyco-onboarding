import Foundation
import SwiftUI
import Combine

// MARK: - Chat ViewModel (Real-time)

/// ViewModel for managing real-time chat with Supabase Realtime
@MainActor
class ChatViewModel: ObservableObject {
    @Published var messages: [Message] = []
    @Published var isLoading = false
    @Published var isSending = false
    @Published var isOtherUserTyping = false
    @Published var error: NetworkError?

    private let conversation: Conversation
    private var currentUserId: UUID
    private var messageSubscriptionId: String?
    private var typingSubscriptionId: String?
    private var typingTimer: Timer?

    init(conversation: Conversation) {
        self.conversation = conversation
        // Get current user ID from auth token
        if let token = EasyCoKeychainManager.shared.getAuthToken(),
           let userId = try? Self.getUserIdFromToken(token) {
            self.currentUserId = UUID(uuidString: userId) ?? UUID()
        } else {
            self.currentUserId = UUID()
        }
    }

    // Helper to decode user ID from JWT token
    private static func getUserIdFromToken(_ token: String) throws -> String {
        let parts = token.components(separatedBy: ".")
        guard parts.count == 3 else {
            throw NSError(domain: "Invalid token", code: -1)
        }

        let payload = parts[1]
        var base64 = payload
            .replacingOccurrences(of: "-", with: "+")
            .replacingOccurrences(of: "_", with: "/")

        while base64.count % 4 != 0 {
            base64.append("=")
        }

        guard let data = Data(base64Encoded: base64),
              let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let sub = json["sub"] as? String else {
            throw NSError(domain: "Cannot decode token", code: -1)
        }

        return sub
    }

    // MARK: - Lifecycle

    func onAppear() async {
        await loadMessages()
        subscribeToMessages()
        subscribeToTypingIndicators()
    }

    func onDisappear() {
        unsubscribeFromAll()
    }

    // MARK: - Load Messages

    func loadMessages() async {
        isLoading = true
        error = nil

        do {
            messages = try await APIClient.shared.getMessages(conversationId: conversation.id)
        } catch {
            self.error = error as? NetworkError ?? .unknown(error)
            print("Error loading messages: \(error)")
        }

        isLoading = false
    }

    // MARK: - Send Message

    func sendMessage(_ content: String) async {
        guard !content.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }

        isSending = true

        do {
            let message = try await APIClient.shared.sendMessage(
                conversationId: conversation.id,
                content: content
            )

            // Optimistically add to local messages
            withAnimation {
                messages.append(message)
            }

            // Stop typing indicator
            stopTyping()

        } catch {
            self.error = error as? NetworkError ?? .unknown(error)
            print("Error sending message: \(error)")
        }

        isSending = false
    }

    // MARK: - Real-time Subscriptions

    private func subscribeToMessages() {
        // Subscribe to new messages in this conversation
        messageSubscriptionId = SupabaseRealtime.shared.subscribe(
            table: "messages",
            event: .insert,
            filter: "conversation_id=eq.\(conversation.id.uuidString)"
        ) { [weak self] (payload: RealtimePayload<MessageRealtimeData>) in
            guard let self = self, let newMessage = payload.new else { return }

            Task { @MainActor in
                // Only add if it's not from current user (we already added it optimistically)
                if newMessage.senderId != self.currentUserId.uuidString {
                    let message = Message(
                        id: UUID(uuidString: newMessage.id) ?? UUID(),
                        conversationId: self.conversation.id,
                        senderId: UUID(uuidString: newMessage.senderId) ?? UUID(),
                        senderName: "Unknown", // TODO: Get sender name from newMessage
                        content: newMessage.content,
                        timestamp: self.parseDate(newMessage.createdAt) ?? Date(),
                        isRead: newMessage.readByRecipient
                    )

                    withAnimation {
                        self.messages.append(message)
                    }
                }
            }
        }

        print("📡 Subscribed to messages for conversation: \(conversation.id)")
    }

    private func subscribeToTypingIndicators() {
        // Subscribe to typing indicators for this conversation
        typingSubscriptionId = SupabaseRealtime.shared.subscribe(
            table: "typing_indicators",
            event: .all,
            filter: "conversation_id=eq.\(conversation.id.uuidString)"
        ) { [weak self] (payload: RealtimePayload<TypingIndicatorData>) in
            guard let self = self, let data = payload.new else { return }

            Task { @MainActor in
                // Only show typing if it's the other user
                if data.userId != self.currentUserId.uuidString {
                    self.isOtherUserTyping = true

                    // Auto-hide after 5 seconds
                    DispatchQueue.main.asyncAfter(deadline: .now() + 5) {
                        self.isOtherUserTyping = false
                    }
                }
            }
        }

        print("📡 Subscribed to typing indicators for conversation: \(conversation.id)")
    }

    private func unsubscribeFromAll() {
        if let messageSubscriptionId = messageSubscriptionId {
            SupabaseRealtime.shared.unsubscribe(messageSubscriptionId)
        }

        if let typingSubscriptionId = typingSubscriptionId {
            SupabaseRealtime.shared.unsubscribe(typingSubscriptionId)
        }

        print("📡 Unsubscribed from all subscriptions")
    }

    // MARK: - Typing Indicators

    func startTyping() {
        // Debounce typing indicator
        typingTimer?.invalidate()

        // Send typing indicator to Supabase
        Task {
            await sendTypingIndicator()
        }

        // Auto-stop typing after 5 seconds
        typingTimer = Timer.scheduledTimer(withTimeInterval: 5, repeats: false) { [weak self] _ in
            Task { @MainActor in
                self?.stopTyping()
            }
        }
    }

    func stopTyping() {
        typingTimer?.invalidate()
        typingTimer = nil
    }

    private func sendTypingIndicator() async {
        // Insert/update typing indicator in Supabase
        struct TypingIndicator: Codable {
            let conversationId: String
            let userId: String

            enum CodingKeys: String, CodingKey {
                case conversationId = "conversation_id"
                case userId = "user_id"
            }
        }

        let indicator = TypingIndicator(
            conversationId: conversation.id.uuidString,
            userId: currentUserId.uuidString
        )

        // TODO: Re-enable when Supabase insert method is available
        // do {
        //     let _: [TypingIndicator] = try await SupabaseClient.shared
        //         .from("typing_indicators")
        //         .insert(indicator)
        // } catch {
        //     print("Error sending typing indicator: \(error)")
        // }
    }

    // MARK: - Helpers

    private func parseDate(_ dateString: String) -> Date? {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return formatter.date(from: dateString)
    }
}

// MARK: - Realtime Data Models

struct MessageRealtimeData: Codable {
    let id: String
    let conversationId: String
    let senderId: String
    let content: String
    let readByRecipient: Bool
    let createdAt: String

    enum CodingKeys: String, CodingKey {
        case id
        case conversationId = "conversation_id"
        case senderId = "sender_id"
        case content
        case readByRecipient = "read_by_recipient"
        case createdAt = "created_at"
    }
}

struct TypingIndicatorData: Codable {
    let conversationId: String
    let userId: String

    enum CodingKeys: String, CodingKey {
        case conversationId = "conversation_id"
        case userId = "user_id"
    }
}
