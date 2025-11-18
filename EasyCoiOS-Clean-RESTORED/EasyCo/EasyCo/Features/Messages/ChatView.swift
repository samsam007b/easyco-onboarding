import SwiftUI

// MARK: - Chat View

struct ChatView: View {
    let conversation: Conversation
    @StateObject private var viewModel: ChatViewModel
    @State private var messageText = ""
    @State private var showImagePicker = false
    @FocusState private var isInputFocused: Bool

    init(conversation: Conversation) {
        self.conversation = conversation
        self._viewModel = StateObject(wrappedValue: ChatViewModel(conversation: conversation))
    }

    var body: some View {
        VStack(spacing: 0) {
            // Messages list
            messagesScrollView

            // Input bar
            messageInputBar
        }
        .background(Color(hex: "F9FAFB"))
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .principal) {
                conversationHeader
            }
        }
        .task {
            await viewModel.loadMessages()
            await viewModel.markAsRead()
        }
    }

    // MARK: - Conversation Header

    private var conversationHeader: some View {
        HStack(spacing: 12) {
            // Avatar
            if let avatarURL = conversation.otherUserAvatarURL, let url = URL(string: avatarURL) {
                AsyncImage(url: url) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Circle()
                        .fill(Color(hex: "FFA040"))
                        .overlay(
                            Text(conversation.otherUserName.prefix(1))
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(.white)
                        )
                }
                .frame(width: 36, height: 36)
                .clipShape(Circle())
            } else {
                Circle()
                    .fill(Color(hex: "FFA040"))
                    .frame(width: 36, height: 36)
                    .overlay(
                        Text(conversation.otherUserName.prefix(1))
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                    )
            }

            VStack(alignment: .leading, spacing: 2) {
                Text(conversation.otherUserName)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                if conversation.isTyping {
                    Text("En train d'écrire...")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "FFA040"))
                } else if let propertyTitle = conversation.propertyTitle {
                    Text(propertyTitle)
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "6B7280"))
                        .lineLimit(1)
                }
            }
        }
    }

    // MARK: - Messages Scroll View

    private var messagesScrollView: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(spacing: 16) {
                    ForEach(viewModel.messages) { message in
                        MessageBubble(message: message)
                            .id(message.id)
                    }
                }
                .padding(16)
                .onChange(of: viewModel.messages.count) { _ in
                    if let lastMessage = viewModel.messages.last {
                        withAnimation {
                            proxy.scrollTo(lastMessage.id, anchor: .bottom)
                        }
                    }
                }
            }
        }
    }

    // MARK: - Message Input Bar

    private var messageInputBar: some View {
        VStack(spacing: 0) {
            Divider()

            HStack(spacing: 12) {
                // Attach button
                Button(action: { showImagePicker = true }) {
                    Image(systemName: "photo")
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                // Text field
                HStack(spacing: 8) {
                    TextField("Message...", text: $messageText, axis: .vertical)
                        .font(.system(size: 15))
                        .lineLimit(1...5)
                        .focused($isInputFocused)
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(Color(hex: "F3F4F6"))
                .cornerRadius(20)

                // Send button
                Button(action: sendMessage) {
                    Image(systemName: "arrow.up.circle.fill")
                        .font(.system(size: 32))
                        .foregroundColor(messageText.isEmpty ? Color(hex: "D1D5DB") : Color(hex: "FFA040"))
                }
                .disabled(messageText.isEmpty)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color.white)
        }
    }

    // MARK: - Actions

    private func sendMessage() {
        guard !messageText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }

        _Concurrency.Task {
            await viewModel.sendMessage(messageText)
            messageText = ""
        }
    }
}

// MARK: - Message Bubble

struct MessageBubble: View {
    let message: Message

    var body: some View {
        HStack(alignment: .bottom, spacing: 8) {
            if message.isSentByCurrentUser {
                Spacer(minLength: 50)
            }

            VStack(alignment: message.isSentByCurrentUser ? .trailing : .leading, spacing: 4) {
                // Message bubble
                Text(message.content)
                    .font(.system(size: 15))
                    .foregroundColor(message.isSentByCurrentUser ? .white : Color(hex: "111827"))
                    .padding(.horizontal, 14)
                    .padding(.vertical, 10)
                    .background(
                        message.isSentByCurrentUser ?
                        LinearGradient(
                            colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                        .any :
                        Color(hex: "F3F4F6").any
                    )
                    .cornerRadius(18, corners: message.isSentByCurrentUser ?
                        [.topLeft, .topRight, .bottomLeft] :
                        [.topLeft, .topRight, .bottomRight]
                    )

                // Timestamp
                Text(message.timestamp.formatted(date: .omitted, time: .shortened))
                    .font(.system(size: 11))
                    .foregroundColor(Color(hex: "9CA3AF"))
            }

            if !message.isSentByCurrentUser {
                Spacer(minLength: 50)
            }
        }
    }
}

// MARK: - Chat ViewModel

class ChatViewModel: ObservableObject {
    @Published var messages: [Message] = []
    @Published var isLoading = false
    @Published var isTyping = false

    private let conversation: Conversation

    init(conversation: Conversation) {
        self.conversation = conversation
    }

    func loadMessages() async {
        isLoading = true

        if AppConfig.FeatureFlags.demoMode {
            try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
            // Generate messages for this conversation
            messages = Message.mockMessages.map { message in
                var updatedMessage = message
                updatedMessage.isSentByCurrentUser = [true, false].randomElement() ?? false
                return updatedMessage
            }
        } else {
            do {
                messages = try await APIClient.shared.getMessages(conversationId: conversation.id.uuidString)
            } catch {
                print("Error loading messages: \(error)")
            }
        }

        isLoading = false
    }

    func sendMessage(_ content: String) async {
        let newMessage = Message(
            conversationId: conversation.id,
            senderId: UUID(), // Current user ID
            senderName: "Me",
            content: content,
            timestamp: Date(),
            isRead: true,
            isSentByCurrentUser: true
        )

        // Optimistic update
        withAnimation {
            messages.append(newMessage)
        }

        if !AppConfig.FeatureFlags.demoMode {
            do {
                _ = try await APIClient.shared.sendMessage(
                    conversationId: conversation.id.uuidString,
                    content: content
                )
            } catch {
                print("Error sending message: \(error)")
                // Remove optimistic message on error
                withAnimation {
                    messages.removeAll { $0.id == newMessage.id }
                }
            }
        }
    }

    func markAsRead() async {
        if !AppConfig.FeatureFlags.demoMode {
            do {
                try await APIClient.shared.markConversationAsRead(conversationId: conversation.id.uuidString)
            } catch {
                print("Error marking as read: \(error)")
            }
        }
    }
}

// MARK: - Helper Extensions

extension ShapeStyle where Self == AnyShapeStyle {
    static var any: AnyShapeStyle { AnyShapeStyle(Color.clear) }
}

extension LinearGradient {
    var any: AnyShapeStyle { AnyShapeStyle(self) }
}

extension Color {
    var any: AnyShapeStyle { AnyShapeStyle(self) }
}

// MARK: - Preview

struct ChatView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            ChatView(conversation: Conversation.mockConversations[0])
        }
    }
}
