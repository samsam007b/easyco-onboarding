import SwiftUI

// MARK: - Messages List View

struct MessagesListView: View {
    @State private var conversations: [Conversation] = []
    @State private var isLoading = false

    var body: some View {
        NavigationStack {
            Group {
                if conversations.isEmpty {
                    EmptyStateView.noMessages()
                } else {
                    conversationsList
                }
            }
            .navigationTitle("Messages")
        }
        .task {
            await loadConversations()
        }
    }

    private var conversationsList: some View {
        List(conversations) { conversation in
            NavigationLink(destination: ChatView(conversation: conversation)) {
                ConversationRow(conversation: conversation)
            }
        }
        .listStyle(.plain)
    }

    private func loadConversations() async {
        isLoading = true
        // Load conversations from API
        isLoading = false
    }
}

struct ConversationRow: View {
    let conversation: Conversation

    var body: some View {
        HStack(spacing: Theme.Spacing.md) {
            // Avatar
            Circle()
                .fill(Theme.Colors.primary.opacity(0.2))
                .frame(width: 50, height: 50)
                .overlay {
                    Text("?")
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.primary)
                }

            VStack(alignment: .leading, spacing: Theme.Spacing.xs) {
                HStack {
                    Text("Conversation")
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Spacer()

                    if let lastMessage = conversation.lastMessage {
                        Text(lastMessage.createdAt, style: .relative)
                            .font(Theme.Typography.caption())
                            .foregroundColor(Theme.Colors.textSecondary)
                    }
                }

                if let lastMessage = conversation.lastMessage {
                    Text(lastMessage.content)
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)
                        .lineLimit(2)
                }
            }

            if conversation.unreadCount > 0 {
                Circle()
                    .fill(Theme.Colors.primary)
                    .frame(width: 20, height: 20)
                    .overlay {
                        Text("\(conversation.unreadCount)")
                            .font(Theme.Typography.captionSmall(.bold))
                            .foregroundColor(.white)
                    }
            }
        }
        .padding(.vertical, Theme.Spacing.xs)
    }
}

struct ChatView: View {
    let conversation: Conversation

    var body: some View {
        VStack {
            ScrollView {
                // Messages
            }

            // Input
            HStack {
                TextField("Message...", text: .constant(""))
                    .padding(Theme.Spacing.sm)
                    .background(Theme.Colors.backgroundSecondary)
                    .cornerRadius(Theme.CornerRadius.full)

                Button {
                    // Send
                } label: {
                    Image(systemName: "paperplane.fill")
                        .foregroundColor(.white)
                        .padding(Theme.Spacing.sm)
                        .background(Circle().fill(Theme.Colors.primary))
                }
            }
            .padding()
        }
        .navigationTitle("Conversation")
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct MessagesListView_Previews: PreviewProvider {
    static var previews: some View {
        MessagesListView()
    }
}
