import SwiftUI

// MARK: - Messages List View (Enhanced)

struct MessagesListView: View {
    @StateObject private var viewModel = MessagesViewModel()
    @State private var searchText = ""

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading {
                    LoadingView(message: "Chargement des messages...")
                } else if filteredConversations.isEmpty && searchText.isEmpty {
                    emptyStateView
                } else if filteredConversations.isEmpty {
                    searchEmptyView
                } else {
                    conversationsList
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    VStack(spacing: 2) {
                        Text("Messages")
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(Color(hex: "111827"))

                        if viewModel.totalUnreadCount > 0 {
                            Text("\(viewModel.totalUnreadCount) non lu\(viewModel.totalUnreadCount > 1 ? "s" : "")")
                                .font(.system(size: 11))
                                .foregroundColor(Color(hex: "FFA040"))
                        }
                    }
                }
            }
            .searchable(text: $searchText, prompt: "Rechercher une conversation")
        }
        .task {
            await viewModel.loadConversations()
        }
    }

    // MARK: - Conversations List

    private var conversationsList: some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                ForEach(filteredConversations) { conversation in
                    NavigationLink(destination: ChatView(conversation: conversation)) {
                        ConversationRow(conversation: conversation)
                    }
                    .buttonStyle(PlainButtonStyle())
                    .swipeActions(edge: .trailing, allowsFullSwipe: false) {
                        Button(role: .destructive) {
                            _Concurrency.Task {
                                await viewModel.deleteConversation(conversation)
                            }
                        } label: {
                            Label("Supprimer", systemImage: "trash")
                        }

                        Button {
                            _Concurrency.Task {
                                await viewModel.toggleReadStatus(conversation)
                            }
                        } label: {
                            Label(
                                conversation.unreadCount > 0 ? "Marquer lu" : "Marquer non lu",
                                systemImage: conversation.unreadCount > 0 ? "envelope.open" : "envelope.badge"
                            )
                        }
                        .tint(Color(hex: "FFA040"))
                    }

                    if conversation.id != filteredConversations.last?.id {
                        Divider()
                            .padding(.leading, 82)
                    }
                }
            }
            .background(Color.white)
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
            .padding(16)
        }
        .refreshable {
            await viewModel.loadConversations()
        }
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 24) {
            Spacer()

            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color(hex: "FFA040").opacity(0.2), Color(hex: "FFB85C").opacity(0.1)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 120, height: 120)

                Image(systemName: "message")
                    .font(.system(size: 48))
                    .foregroundColor(Color(hex: "FFA040"))
            }

            VStack(spacing: 12) {
                Text("Aucun message")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Contactez un propriétaire pour commencer une conversation")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Search Empty View

    private var searchEmptyView: some View {
        VStack(spacing: 16) {
            Spacer()

            Image(systemName: "magnifyingglass")
                .font(.system(size: 48))
                .foregroundColor(Color(hex: "D1D5DB"))

            Text("Aucune conversation trouvée")
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(Color(hex: "6B7280"))

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Filtered Conversations

    private var filteredConversations: [Conversation] {
        if searchText.isEmpty {
            return viewModel.conversations
        }
        return viewModel.conversations.filter { conversation in
            conversation.otherUserName.localizedCaseInsensitiveContains(searchText) ||
            (conversation.propertyTitle?.localizedCaseInsensitiveContains(searchText) ?? false)
        }
    }
}

// MARK: - Conversation Row

struct ConversationRow: View {
    let conversation: Conversation

    var body: some View {
        HStack(spacing: 12) {
            // Avatar avec badge non lu
            ZStack(alignment: .topTrailing) {
                if let avatarURL = conversation.otherUserAvatarURL, let url = URL(string: avatarURL) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        avatarPlaceholder
                    }
                    .frame(width: 56, height: 56)
                    .clipShape(Circle())
                } else {
                    avatarPlaceholder
                }

                if conversation.unreadCount > 0 {
                    Circle()
                        .fill(Color(hex: "EF4444"))
                        .frame(width: 20, height: 20)
                        .overlay(
                            Text("\(min(conversation.unreadCount, 99))")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(.white)
                        )
                        .offset(x: 8, y: -8)
                }
            }

            // Content
            VStack(alignment: .leading, spacing: 6) {
                HStack(alignment: .top) {
                    Text(conversation.otherUserName)
                        .font(.system(size: 16, weight: conversation.unreadCount > 0 ? .bold : .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    Spacer()

                    Text(conversation.formattedLastMessageTime)
                        .font(.system(size: 13))
                        .foregroundColor(conversation.unreadCount > 0 ? Color(hex: "FFA040") : Color(hex: "6B7280"))
                }

                if let lastMessage = conversation.lastMessage {
                    HStack(spacing: 4) {
                        if lastMessage.isSentByCurrentUser {
                            Image(systemName: lastMessage.isRead ? "checkmark.circle.fill" : "checkmark.circle")
                                .font(.system(size: 12))
                                .foregroundColor(lastMessage.isRead ? Color(hex: "10B981") : Color(hex: "9CA3AF"))
                        }

                        Text(lastMessage.content)
                            .font(.system(size: 14))
                            .foregroundColor(conversation.unreadCount > 0 ? Color(hex: "374151") : Color(hex: "6B7280"))
                            .lineLimit(2)
                            .fontWeight(conversation.unreadCount > 0 ? .medium : .regular)
                    }
                }

                if let propertyTitle = conversation.propertyTitle {
                    HStack(spacing: 4) {
                        Image(systemName: "house.fill")
                            .font(.system(size: 11))
                        Text(propertyTitle)
                            .font(.system(size: 12))
                            .lineLimit(1)
                    }
                    .foregroundColor(Color(hex: "FFA040"))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color(hex: "FFF4ED"))
                    .cornerRadius(6)
                }

                if conversation.isTyping {
                    HStack(spacing: 4) {
                        TypingIndicator()
                        Text("En train d'écrire...")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "FFA040"))
                    }
                }
            }
        }
        .padding(16)
        .contentShape(Rectangle())
    }

    private var avatarPlaceholder: some View {
        Circle()
            .fill(
                LinearGradient(
                    colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .frame(width: 56, height: 56)
            .overlay(
                Text(conversation.otherUserName.prefix(1))
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(.white)
            )
    }
}

// MARK: - Typing Indicator

struct TypingIndicator: View {
    @State private var animating = false

    var body: some View {
        HStack(spacing: 3) {
            ForEach(0..<3) { index in
                Circle()
                    .fill(Color(hex: "FFA040"))
                    .frame(width: 6, height: 6)
                    .opacity(animating ? 0.3 : 1.0)
                    .animation(
                        Animation.easeInOut(duration: 0.6)
                            .repeatForever()
                            .delay(Double(index) * 0.2),
                        value: animating
                    )
            }
        }
        .onAppear {
            animating = true
        }
    }
}

// MARK: - Messages ViewModel

class MessagesViewModel: ObservableObject {
    @Published var conversations: [Conversation] = []
    @Published var isLoading = false

    var totalUnreadCount: Int {
        conversations.reduce(0) { $0 + $1.unreadCount }
    }

    func loadConversations() async {
        isLoading = true

        if AppConfig.FeatureFlags.demoMode {
            try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
            conversations = Conversation.mockConversations
        } else {
            do {
                conversations = try await APIClient.shared.getConversations()
            } catch {
                print("Error loading conversations: \(error)")
            }
        }

        isLoading = false
    }

    func deleteConversation(_ conversation: Conversation) async {
        withAnimation {
            conversations.removeAll { $0.id == conversation.id }
        }

        if !AppConfig.FeatureFlags.demoMode {
            do {
                try await APIClient.shared.deleteConversation(conversationId: conversation.id.uuidString)
            } catch {
                print("Error deleting conversation: \(error)")
                withAnimation {
                    conversations.append(conversation)
                }
            }
        }
    }

    func toggleReadStatus(_ conversation: Conversation) async {
        if let index = conversations.firstIndex(where: { $0.id == conversation.id }) {
            withAnimation {
                conversations[index].unreadCount = conversations[index].unreadCount > 0 ? 0 : 1
            }

            if !AppConfig.FeatureFlags.demoMode {
                do {
                    if conversations[index].unreadCount == 0 {
                        try await APIClient.shared.markConversationAsRead(conversationId: conversation.id.uuidString)
                    } else {
                        try await APIClient.shared.markConversationAsUnread(conversationId: conversation.id.uuidString)
                    }
                } catch {
                    print("Error toggling read status: \(error)")
                }
            }
        }
    }
}

// MARK: - Preview

struct MessagesListView_Previews: PreviewProvider {
    static var previews: some View {
        MessagesListView()
    }
}
