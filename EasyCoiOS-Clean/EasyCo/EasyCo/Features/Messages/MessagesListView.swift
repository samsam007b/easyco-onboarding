import SwiftUI

// MARK: - Messages List View

struct MessagesListView: View {
    @StateObject private var viewModel = MessagesListViewModel()
    @State private var searchText = ""
    @State private var selectedFilter: MessageFilter = .all

    var body: some View {
        NavigationStack {
            ZStack {
                Color(hex: "F9FAFB")
                    .ignoresSafeArea()

                VStack(spacing: 0) {
                    // Search bar
                    searchBar

                    // Filter chips
                    filterChips

                    // Content
                    if viewModel.isLoading && viewModel.conversations.isEmpty {
                        loadingView
                    } else if filteredConversations.isEmpty {
                        emptyStateView
                    } else {
                        conversationsList
                    }
                }
            }
            .navigationTitle("Messages")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Menu {
                        Button(action: { viewModel.markAllAsRead() }) {
                            Label("Tout marquer comme lu", systemImage: "envelope.open")
                        }
                    } label: {
                        Image(systemName: "ellipsis.circle")
                            .foregroundColor(Theme.Colors.textPrimary)
                    }
                }
            }
            .refreshable {
                await viewModel.loadConversations()
            }
        }
        .task {
            await viewModel.loadConversations()
        }
    }

    // MARK: - Search Bar

    private var searchBar: some View {
        HStack(spacing: 12) {
            HStack(spacing: 8) {
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "9CA3AF"))

                TextField("Rechercher une conversation...", text: $searchText)
                    .font(.system(size: 15))

                if !searchText.isEmpty {
                    Button(action: { searchText = "" }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 16))
                            .foregroundColor(Color(hex: "9CA3AF"))
                    }
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
            .background(Color.white)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
            )
        }
        .padding(.horizontal, 16)
        .padding(.top, 8)
        .padding(.bottom, 12)
    }

    // MARK: - Filter Chips

    private var filterChips: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(MessageFilter.allCases, id: \.self) { filter in
                    FilterChipButton(
                        title: filter.title,
                        count: filter.count(from: viewModel.conversations),
                        isSelected: selectedFilter == filter
                    ) {
                        withAnimation(.spring(response: 0.3)) {
                            selectedFilter = filter
                        }
                    }
                }
            }
            .padding(.horizontal, 16)
        }
        .padding(.bottom, 12)
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        ZStack {
            // Background avec profondeur
            ZStack {
                LinearGradient(
                    colors: [
                        Color(hex: "FFF5F0"),
                        Color(hex: "FFF0E6"),
                        Color(hex: "FFE5D9")
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()

                // Organic shapes
                Circle()
                    .fill(Color(hex: "FFA040").opacity(0.08))
                    .frame(width: 400, height: 400)
                    .blur(radius: 100)
                    .offset(x: -100, y: -200)

                Circle()
                    .fill(Color(hex: "FACC15").opacity(0.06))
                    .frame(width: 300, height: 300)
                    .blur(radius: 80)
                    .offset(x: 150, y: 500)
            }

            VStack(spacing: 20) {
                Spacer()

                // Glassmorphism card with content
                VStack(spacing: 20) {
                    ZStack {
                        Circle()
                            .fill(Color(hex: "06B6D4").opacity(0.12))
                            .frame(width: 100, height: 100)

                        Image(systemName: "message")
                            .font(.system(size: 44, weight: .medium))
                            .foregroundColor(Color(hex: "06B6D4"))
                    }

                    VStack(spacing: 8) {
                        Text("Aucun message")
                            .font(.system(size: 22, weight: .bold))
                            .foregroundColor(Color(hex: "1F2937"))

                        Text("Contacte un propriétaire pour commencer une conversation")
                            .font(.system(size: 15, weight: .medium))
                            .foregroundColor(Color(hex: "6B7280"))
                            .multilineTextAlignment(.center)
                    }

                    // CTA Button
                    NavigationLink(destination: PropertiesListView()) {
                        HStack(spacing: 12) {
                            Image(systemName: "magnifyingglass")
                                .font(.system(size: 16, weight: .semibold))
                            Text("Explorer les propriétés")
                                .font(.system(size: 16, weight: .bold))
                        }
                        .foregroundColor(.white)
                        .padding(.horizontal, 24)
                        .padding(.vertical, 14)
                        .background(
                            RoundedRectangle(cornerRadius: 16)
                                .fill(LinearGradient(
                                    colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                ))
                        )
                        .richShadow(color: Color(hex: "FFA040"))
                    }
                }
                .padding(.vertical, 60)
                .padding(.horizontal, 30)
                .background(
                    RoundedRectangle(cornerRadius: 20)
                        .fill(Color.white.opacity(0.85))
                        .overlay(
                            RoundedRectangle(cornerRadius: 20)
                                .stroke(Color.white, lineWidth: 2)
                        )
                )
                .richShadow()
                .padding(.horizontal, 20)

                Spacer()
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Conversations List

    private var conversationsList: some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                ForEach(filteredConversations) { conversation in
                    NavigationLink(destination: ChatView(conversation: conversation)) {
                        EnhancedConversationRow(
                            conversation: conversation,
                            searchText: searchText
                        )
                    }
                    .buttonStyle(PlainButtonStyle())

                    if conversation.id != filteredConversations.last?.id {
                        Divider()
                            .padding(.leading, 76)
                    }
                }
            }
            .background(Color.white)
            .cornerRadius(16)
            .padding(.horizontal, 16)
        }
    }

    private var loadingView: some View {
        VStack(spacing: 16) {
            ProgressView()
            Text("Chargement des conversations...")
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Filtered Conversations

    private var filteredConversations: [Conversation] {
        var result = viewModel.conversations

        // Apply filter
        switch selectedFilter {
        case .all:
            break
        case .unread:
            result = result.filter { $0.unreadCount > 0 }
        case .properties:
            result = result.filter { $0.propertyId != nil }
        case .groups:
            result = result.filter { $0.isGroup }
        }

        // Apply search
        if !searchText.isEmpty {
            result = result.filter { conversation in
                conversation.otherUserName.localizedCaseInsensitiveContains(searchText) ||
                (conversation.lastMessage?.content.localizedCaseInsensitiveContains(searchText) ?? false) ||
                (conversation.propertyTitle?.localizedCaseInsensitiveContains(searchText) ?? false)
            }
        }

        return result
    }
}

// MARK: - Message Filter

enum MessageFilter: CaseIterable {
    case all, unread, properties, groups

    var title: String {
        switch self {
        case .all: return "Tous"
        case .unread: return "Non lus"
        case .properties: return "Propriétés"
        case .groups: return "Groupes"
        }
    }

    func count(from conversations: [Conversation]) -> Int? {
        switch self {
        case .all: return nil
        case .unread:
            let count = conversations.filter { $0.unreadCount > 0 }.count
            return count > 0 ? count : nil
        case .properties:
            let count = conversations.filter { $0.propertyId != nil }.count
            return count > 0 ? count : nil
        case .groups:
            let count = conversations.filter { $0.isGroup }.count
            return count > 0 ? count : nil
        }
    }
}

// MARK: - Filter Chip Button

struct FilterChipButton: View {
    let title: String
    let count: Int?
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Text(title)
                    .font(.system(size: 14, weight: .medium))

                if let count = count {
                    Text("\(count)")
                        .font(.system(size: 12, weight: .semibold))
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(
                            isSelected ? Color.white.opacity(0.3) : Color(hex: "FFA040").opacity(0.2)
                        )
                        .cornerRadius(8)
                }
            }
            .foregroundColor(isSelected ? .white : Color(hex: "374151"))
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(
                isSelected ?
                LinearGradient(colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")], startPoint: .leading, endPoint: .trailing) :
                LinearGradient(colors: [Color.white, Color.white], startPoint: .leading, endPoint: .trailing)
            )
            .cornerRadius(999)
            .overlay(
                RoundedRectangle(cornerRadius: 999)
                    .stroke(isSelected ? Color.clear : Color(hex: "E5E7EB"), lineWidth: 1)
            )
        }
    }
}

// MARK: - Enhanced Conversation Row

struct EnhancedConversationRow: View {
    let conversation: Conversation
    let searchText: String

    var body: some View {
        HStack(spacing: 12) {
            // Avatar with online indicator
            ZStack(alignment: .bottomTrailing) {
                if let avatarURL = conversation.otherUserAvatarURL, let url = URL(string: avatarURL) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        avatarPlaceholder
                    }
                    .frame(width: 52, height: 52)
                    .clipShape(Circle())
                } else {
                    avatarPlaceholder
                }

                // Online indicator
                if conversation.isOtherUserOnline {
                    Circle()
                        .fill(Color(hex: "10B981"))
                        .frame(width: 14, height: 14)
                        .overlay(
                            Circle()
                                .stroke(Color.white, lineWidth: 2)
                        )
                }
            }

            // Content
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    // Name
                    Text(conversation.otherUserName)
                        .font(.system(size: 16, weight: conversation.unreadCount > 0 ? .bold : .semibold))
                        .foregroundColor(Color(hex: "111827"))
                        .lineLimit(1)

                    // Property badge
                    if let propertyTitle = conversation.propertyTitle {
                        Text(propertyTitle)
                            .font(.system(size: 11, weight: .medium))
                            .foregroundColor(Color(hex: "FFA040"))
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color(hex: "FFA040").opacity(0.1))
                            .cornerRadius(4)
                            .lineLimit(1)
                    }

                    Spacer()

                    // Timestamp
                    if let lastMessage = conversation.lastMessage {
                        Text(formatMessageDate(lastMessage.timestamp))
                            .font(.system(size: 12))
                            .foregroundColor(conversation.unreadCount > 0 ? Color(hex: "FFA040") : Color(hex: "9CA3AF"))
                    }
                }

                HStack(spacing: 4) {
                    // Last message preview with typing indicator
                    if conversation.isOtherUserTyping {
                        HStack(spacing: 4) {
                            TypingIndicatorDots()
                            Text("En train d'écrire...")
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "FFA040"))
                        }
                    } else if let lastMessage = conversation.lastMessage {
                        // Read status for sent messages
                        if lastMessage.isSentByCurrentUser {
                            Image(systemName: lastMessage.isRead ? "checkmark.circle.fill" : "checkmark.circle")
                                .font(.system(size: 12))
                                .foregroundColor(lastMessage.isRead ? Color(hex: "10B981") : Color(hex: "9CA3AF"))
                        }

                        Text(lastMessage.content)
                            .font(.system(size: 14, weight: conversation.unreadCount > 0 ? .medium : .regular))
                            .foregroundColor(conversation.unreadCount > 0 ? Color(hex: "374151") : Color(hex: "6B7280"))
                            .lineLimit(2)
                    }

                    Spacer()

                    // Unread badge
                    if conversation.unreadCount > 0 {
                        Text("\(conversation.unreadCount)")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                            .frame(minWidth: 22, minHeight: 22)
                            .background(
                                LinearGradient(colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")], startPoint: .topLeading, endPoint: .bottomTrailing)
                            )
                            .clipShape(Circle())
                    }
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(conversation.unreadCount > 0 ? Color(hex: "FFF4ED").opacity(0.5) : Color.clear)
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
            .frame(width: 52, height: 52)
            .overlay(
                Text(conversation.otherUserName.prefix(1).uppercased())
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(.white)
            )
    }

    private func formatMessageDate(_ date: Date) -> String {
        let calendar = Calendar.current

        if calendar.isDateInToday(date) {
            let formatter = DateFormatter()
            formatter.dateFormat = "HH:mm"
            return formatter.string(from: date)
        } else if calendar.isDateInYesterday(date) {
            return "Hier"
        } else if let daysAgo = calendar.dateComponents([.day], from: date, to: Date()).day, daysAgo < 7 {
            let formatter = DateFormatter()
            formatter.dateFormat = "EEEE"
            formatter.locale = Locale(identifier: "fr_FR")
            return formatter.string(from: date)
        } else {
            let formatter = DateFormatter()
            formatter.dateFormat = "dd/MM"
            return formatter.string(from: date)
        }
    }
}

// MARK: - Typing Indicator Dots

struct TypingIndicatorDots: View {
    @State private var animationPhase = 0

    var body: some View {
        HStack(spacing: 3) {
            ForEach(0..<3, id: \.self) { index in
                Circle()
                    .fill(Color(hex: "FFA040"))
                    .frame(width: 6, height: 6)
                    .scaleEffect(animationPhase == index ? 1.3 : 1.0)
                    .opacity(animationPhase == index ? 1.0 : 0.5)
            }
        }
        .onAppear {
            Timer.scheduledTimer(withTimeInterval: 0.4, repeats: true) { _ in
                withAnimation(.easeInOut(duration: 0.2)) {
                    animationPhase = (animationPhase + 1) % 3
                }
            }
        }
    }
}

// MARK: - Messages List ViewModel

@MainActor
class MessagesListViewModel: ObservableObject {
    @Published var conversations: [Conversation] = []
    @Published var isLoading = false
    @Published var error: NetworkError?

    func loadConversations() async {
        isLoading = true
        error = nil

        do {
            if AppConfig.FeatureFlags.demoMode {
                conversations = Conversation.mockConversations
            } else {
                conversations = try await APIClient.shared.getConversations()
            }
        } catch {
            self.error = error as? NetworkError ?? .unknown(error)
            // Use demo data as fallback
            conversations = Conversation.mockConversations
        }

        isLoading = false
    }

    func markAllAsRead() {
        Task {
            for i in 0..<conversations.count where conversations[i].unreadCount > 0 {
                conversations[i].unreadCount = 0
            }
        }
    }
}

// MARK: - Chat View

struct ChatView: View {
    let conversation: Conversation
    @State private var messageText = ""
    @State private var messages: [Message] = []
    @FocusState private var isInputFocused: Bool

    var body: some View {
        VStack(spacing: 0) {
            // Messages list
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(spacing: 16) {
                        ForEach(messages) { message in
                            ChatMessageBubble(message: message)
                                .id(message.id)
                        }
                    }
                    .padding(16)
                }
                .onChange(of: messages.count) { _ in
                    if let lastMessage = messages.last {
                        withAnimation {
                            proxy.scrollTo(lastMessage.id, anchor: .bottom)
                        }
                    }
                }
            }

            // Input bar
            messageInputBar
        }
        .background(Color(hex: "F9FAFB"))
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .principal) {
                chatHeader
            }
        }
        .task {
            await loadMessages()
        }
    }

    private var chatHeader: some View {
        HStack(spacing: 12) {
            Circle()
                .fill(
                    LinearGradient(
                        colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(width: 36, height: 36)
                .overlay(
                    Text(conversation.otherUserName.prefix(1).uppercased())
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.white)
                )

            VStack(alignment: .leading, spacing: 2) {
                Text(conversation.otherUserName)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                if let propertyTitle = conversation.propertyTitle {
                    Text(propertyTitle)
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "6B7280"))
                        .lineLimit(1)
                }
            }
        }
    }

    private var messageInputBar: some View {
        VStack(spacing: 0) {
            Divider()

            HStack(spacing: 12) {
                Button(action: {}) {
                    Image(systemName: "photo")
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "6B7280"))
                }

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

    private func loadMessages() async {
        // Demo mode - load mock messages
        if AppConfig.FeatureFlags.demoMode {
            try? await _Concurrency.Task.sleep(nanoseconds: 300_000_000)
            messages = Message.mockMessages
        }
    }

    private func sendMessage() {
        guard !messageText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }

        let newMessage = Message(
            conversationId: conversation.id,
            senderId: UUID(),
            senderName: "Moi",
            content: messageText,
            timestamp: Date(),
            isRead: true,
            isSentByCurrentUser: true
        )

        messages.append(newMessage)
        messageText = ""
        isInputFocused = false
    }
}

// MARK: - Chat Message Bubble

struct ChatMessageBubble: View {
    let message: Message

    var body: some View {
        HStack(alignment: .bottom, spacing: 8) {
            if message.isSentByCurrentUser {
                Spacer(minLength: 50)
            }

            VStack(alignment: message.isSentByCurrentUser ? .trailing : .leading, spacing: 4) {
                Text(message.content)
                    .font(.system(size: 15))
                    .foregroundColor(message.isSentByCurrentUser ? .white : Color(hex: "111827"))
                    .padding(.horizontal, 14)
                    .padding(.vertical, 10)
                    .background(
                        message.isSentByCurrentUser ?
                        AnyShapeStyle(
                            LinearGradient(
                                colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        ) :
                        AnyShapeStyle(Color(hex: "F3F4F6"))
                    )
                    .clipShape(
                        RoundedRectangle(cornerRadius: 18)
                    )

                Text(formatMessageTime(message.timestamp))
                    .font(.system(size: 11))
                    .foregroundColor(Color(hex: "9CA3AF"))
            }

            if !message.isSentByCurrentUser {
                Spacer(minLength: 50)
            }
        }
    }

    private func formatMessageTime(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: date)
    }
}

// MARK: - Preview

struct MessagesListView_Previews: PreviewProvider {
    static var previews: some View {
        MessagesListView()
    }
}
