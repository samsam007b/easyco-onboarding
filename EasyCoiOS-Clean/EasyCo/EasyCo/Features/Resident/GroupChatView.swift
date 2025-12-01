import SwiftUI

// MARK: - Group Chat View (Resident Hub)

struct GroupChatView: View {
    @StateObject private var viewModel = GroupChatViewModel()
    @State private var messageText = ""
    @State private var showAttachmentPicker = false
    @State private var showMessageActions = false
    @State private var selectedMessage: GroupMessage?
    @FocusState private var isInputFocused: Bool

    var body: some View {
        VStack(spacing: 0) {
            // Messages list
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(spacing: 12) {
                        // Date header
                        if !viewModel.messages.isEmpty {
                            dateSeparator("Aujourd'hui")
                        }

                        ForEach(viewModel.messages) { message in
                            GroupChatMessageBubble(
                                message: message,
                                isCurrentUser: message.senderId == viewModel.currentUserId,
                                onLongPress: {
                                    selectedMessage = message
                                    showMessageActions = true
                                },
                                onReact: { emoji in
                                    viewModel.addReaction(to: message, emoji: emoji)
                                }
                            )
                            .id(message.id)
                        }

                        // Typing indicator
                        if viewModel.isOtherUserTyping {
                            TypingIndicator(userName: viewModel.typingUserName)
                        }
                    }
                    .padding(16)
                }
                .onChange(of: viewModel.messages.count) { _ in
                    if let lastMessage = viewModel.messages.last {
                        withAnimation {
                            proxy.scrollTo(lastMessage.id, anchor: .bottom)
                        }
                    }
                }
            }

            // Input area
            messageInputArea
        }
        .background(Color(hex: "F9FAFB"))
        .navigationTitle("Chat coloc")
        .navigationBarTitleDisplayMode(.inline)
        .navigationBarItems(trailing:
            Menu {
                Button(action: {}) {
                    Label("Rechercher", systemImage: "magnifyingglass")
                }

                Button(action: {}) {
                    Label("Médias partagés", systemImage: "photo.on.rectangle.angled")
                }

                Button(action: {}) {
                    Label("Notifications", systemImage: "bell")
                }

                Divider()

                Button(action: {}) {
                    Label("Membres", systemImage: "person.3")
                }
            } label: {
                Image(systemName: "ellipsis.circle")
                    .font(.system(size: 20))
                    .foregroundColor(Color(hex: "6B7280"))
            }
        )
        .sheet(isPresented: $showAttachmentPicker) {
            AttachmentPickerSheet { attachment in
                viewModel.sendAttachment(attachment)
            }
        }
        .confirmationDialog("Actions", isPresented: $showMessageActions, presenting: selectedMessage) { message in
            Button("Répondre") {
                viewModel.replyTo(message)
            }

            Button("Copier") {
                UIPasteboard.general.string = message.content
            }

            if message.senderId == viewModel.currentUserId {
                Button("Modifier") {
                    // Edit message
                }

                Button("Supprimer", role: .destructive) {
                    viewModel.deleteMessage(message)
                }
            }

            Button("Annuler", role: .cancel) {}
        }
        .task {
            await viewModel.loadMessages()
        }
    }

    // MARK: - Date Separator

    private func dateSeparator(_ text: String) -> some View {
        HStack {
            Rectangle()
                .fill(Color(hex: "E5E7EB"))
                .frame(height: 1)

            Text(text)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(Color(hex: "9CA3AF"))
                .padding(.horizontal, 12)

            Rectangle()
                .fill(Color(hex: "E5E7EB"))
                .frame(height: 1)
        }
        .padding(.vertical, 8)
    }

    // MARK: - Message Input Area

    private var messageInputArea: some View {
        VStack(spacing: 0) {
            // Reply preview if replying
            if let replyingTo = viewModel.replyingTo {
                HStack(spacing: 10) {
                    Rectangle()
                        .fill(Color(hex: "10B981"))
                        .frame(width: 3)

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Réponse à \(replyingTo.senderName)")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(Color(hex: "10B981"))

                        Text(replyingTo.content)
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "6B7280"))
                            .lineLimit(1)
                    }

                    Spacer()

                    Button(action: { viewModel.cancelReply() }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 20))
                            .foregroundColor(Color(hex: "D1D5DB"))
                    }
                }
                .padding(12)
                .background(Color(hex: "F3F4F6"))
            }

            Divider()

            HStack(spacing: 12) {
                // Attachment button
                Button(action: { showAttachmentPicker = true }) {
                    Image(systemName: "plus.circle.fill")
                        .font(.system(size: 28))
                        .foregroundColor(Color(hex: "10B981"))
                }

                // Text input
                HStack(spacing: 8) {
                    TextField("Message...", text: $messageText, axis: .vertical)
                        .font(.system(size: 16))
                        .lineLimit(1...4)
                        .focused($isInputFocused)
                        .onChange(of: messageText) { _ in
                            viewModel.updateTypingStatus(!messageText.isEmpty)
                        }

                    // Emoji button
                    Button(action: {}) {
                        Image(systemName: "face.smiling")
                            .font(.system(size: 20))
                            .foregroundColor(Color(hex: "9CA3AF"))
                    }
                }
                .padding(.horizontal, 14)
                .padding(.vertical, 10)
                .background(Color(hex: "F3F4F6"))
                .cornerRadius(20)

                // Send button
                Button(action: sendMessage) {
                    Image(systemName: messageText.isEmpty ? "mic.fill" : "arrow.up.circle.fill")
                        .font(.system(size: 28))
                        .foregroundColor(messageText.isEmpty ? Color(hex: "6B7280") : Color(hex: "10B981"))
                }
                .disabled(messageText.isEmpty)
            }
            .padding(12)
            .background(Color.white)
        }
    }

    private func sendMessage() {
        guard !messageText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }
        viewModel.sendMessage(messageText)
        messageText = ""
    }
}

// MARK: - Chat Message Bubble

private struct GroupChatMessageBubble: View {
    let message: GroupMessage
    let isCurrentUser: Bool
    let onLongPress: () -> Void
    let onReact: (String) -> Void

    @State private var showReactionPicker = false

    var body: some View {
        HStack(alignment: .bottom, spacing: 8) {
            if isCurrentUser {
                Spacer(minLength: 60)
            } else {
                // Avatar
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color(hex: "10B981"), Color(hex: "34D399")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 32, height: 32)
                    .overlay(
                        Text(message.senderInitials)
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(.white)
                    )
            }

            VStack(alignment: isCurrentUser ? .trailing : .leading, spacing: 4) {
                // Sender name (only for others)
                if !isCurrentUser {
                    Text(message.senderName)
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                // Reply reference
                if let replyTo = message.replyTo {
                    HStack(spacing: 6) {
                        Rectangle()
                            .fill(Color(hex: "10B981").opacity(0.5))
                            .frame(width: 2)

                        VStack(alignment: .leading, spacing: 2) {
                            Text(replyTo.senderName)
                                .font(.system(size: 11, weight: .semibold))
                                .foregroundColor(Color(hex: "10B981"))

                            Text(replyTo.content)
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "9CA3AF"))
                                .lineLimit(1)
                        }
                    }
                    .padding(8)
                    .background(Color(hex: "F3F4F6"))
                    .cornerRadius(8)
                }

                // Message content
                VStack(alignment: isCurrentUser ? .trailing : .leading, spacing: 4) {
                    // Attachment if any
                    if let attachment = message.attachment {
                        AttachmentView(attachment: attachment)
                    }

                    // Text content
                    if !message.content.isEmpty {
                        Text(message.content)
                            .font(.system(size: 15))
                            .foregroundColor(isCurrentUser ? .white : Color(hex: "111827"))
                    }

                    // Time and status
                    HStack(spacing: 4) {
                        Text(message.timeString)
                            .font(.system(size: 11))
                            .foregroundColor(isCurrentUser ? .white.opacity(0.7) : Color(hex: "9CA3AF"))

                        if isCurrentUser {
                            Image(systemName: message.isRead ? "checkmark.circle.fill" : "checkmark.circle")
                                .font(.system(size: 10))
                                .foregroundColor(.white.opacity(0.7))
                        }
                    }
                }
                .padding(.horizontal, 14)
                .padding(.vertical, 10)
                .background(
                    isCurrentUser
                        ? Color(hex: "10B981")
                        : Color.white
                )
                .cornerRadius(16)
                .shadow(color: .black.opacity(0.04), radius: 3, x: 0, y: 1)
                .onLongPressGesture {
                    onLongPress()
                }

                // Reactions
                if !message.reactions.isEmpty {
                    HStack(spacing: 4) {
                        ForEach(message.reactions, id: \.emoji) { reaction in
                            HStack(spacing: 2) {
                                Text(reaction.emoji)
                                    .font(.system(size: 12))
                                if reaction.count > 1 {
                                    Text("\(reaction.count)")
                                        .font(.system(size: 11))
                                        .foregroundColor(Color(hex: "6B7280"))
                                }
                            }
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color.white)
                            .cornerRadius(10)
                            .shadow(color: .black.opacity(0.05), radius: 2)
                        }
                    }
                    .offset(y: -4)
                }
            }

            if !isCurrentUser {
                Spacer(minLength: 60)
            }
        }
    }
}

// MARK: - Attachment View

struct AttachmentView: View {
    let attachment: ChatAttachment

    var body: some View {
        switch attachment.type {
        case .image:
            AsyncImage(url: URL(string: attachment.url)) { phase in
                switch phase {
                case .success(let image):
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(maxWidth: 200, maxHeight: 200)
                        .clipped()
                        .cornerRadius(12)
                case .failure(_), .empty:
                    Rectangle()
                        .fill(Color(hex: "E5E7EB"))
                        .frame(width: 200, height: 150)
                        .cornerRadius(12)
                        .overlay(
                            Image(systemName: "photo")
                                .foregroundColor(Color(hex: "9CA3AF"))
                        )
                @unknown default:
                    EmptyView()
                }
            }

        case .file:
            HStack(spacing: 10) {
                Image(systemName: "doc.fill")
                    .font(.system(size: 24))
                    .foregroundColor(Color(hex: "6366F1"))

                VStack(alignment: .leading, spacing: 2) {
                    Text(attachment.name)
                        .font(.system(size: 14, weight: .medium))
                        .lineLimit(1)

                    Text(attachment.sizeString)
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "9CA3AF"))
                }
            }
            .padding(10)
            .background(Color(hex: "F3F4F6"))
            .cornerRadius(10)

        case .location:
            HStack(spacing: 10) {
                Image(systemName: "location.fill")
                    .font(.system(size: 20))
                    .foregroundColor(Color(hex: "EF4444"))

                Text(attachment.name)
                    .font(.system(size: 14))
            }
            .padding(10)
            .background(Color(hex: "F3F4F6"))
            .cornerRadius(10)
        }
    }
}

// MARK: - Typing Indicator

struct TypingIndicator: View {
    let userName: String
    @State private var animationOffset = 0

    var body: some View {
        HStack(alignment: .bottom, spacing: 8) {
            Circle()
                .fill(Color(hex: "E5E7EB"))
                .frame(width: 32, height: 32)

            HStack(spacing: 4) {
                ForEach(0..<3, id: \.self) { index in
                    Circle()
                        .fill(Color(hex: "9CA3AF"))
                        .frame(width: 8, height: 8)
                        .offset(y: animationOffset == index ? -4 : 0)
                }
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 12)
            .background(Color.white)
            .cornerRadius(16)
            .onAppear {
                withAnimation(.easeInOut(duration: 0.4).repeatForever()) {
                    animationOffset = (animationOffset + 1) % 3
                }
            }

            Spacer()
        }
    }
}

// MARK: - Attachment Picker Sheet

struct AttachmentPickerSheet: View {
    let onSelect: (ChatAttachment) -> Void
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            List {
                Section {
                    Button(action: {
                        // Photo library
                        dismiss()
                    }) {
                        HStack(spacing: 14) {
                            Image(systemName: "photo.fill")
                                .font(.system(size: 22))
                                .foregroundColor(Color(hex: "10B981"))
                                .frame(width: 32)

                            Text("Galerie photo")
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "111827"))
                        }
                    }

                    Button(action: {
                        // Camera
                        dismiss()
                    }) {
                        HStack(spacing: 14) {
                            Image(systemName: "camera.fill")
                                .font(.system(size: 22))
                                .foregroundColor(Color(hex: "6366F1"))
                                .frame(width: 32)

                            Text("Prendre une photo")
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "111827"))
                        }
                    }

                    Button(action: {
                        // Document
                        dismiss()
                    }) {
                        HStack(spacing: 14) {
                            Image(systemName: "doc.fill")
                                .font(.system(size: 22))
                                .foregroundColor(Color(hex: "F59E0B"))
                                .frame(width: 32)

                            Text("Document")
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "111827"))
                        }
                    }

                    Button(action: {
                        // Location
                        dismiss()
                    }) {
                        HStack(spacing: 14) {
                            Image(systemName: "location.fill")
                                .font(.system(size: 22))
                                .foregroundColor(Color(hex: "EF4444"))
                                .frame(width: 32)

                            Text("Position")
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "111827"))
                        }
                    }
                }
            }
            .navigationTitle("Ajouter")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") { dismiss() }
                }
            }
        }
        .presentationDetents([.medium])
    }
}

// MARK: - Models

struct GroupMessage: Identifiable {
    let id: UUID
    let senderId: UUID
    let senderName: String
    let content: String
    let timestamp: Date
    var isRead: Bool
    var reactions: [MessageReaction]
    var replyTo: MessageReplyRef?
    var attachment: ChatAttachment?

    var senderInitials: String {
        let components = senderName.components(separatedBy: " ")
        return components.compactMap { $0.first }.prefix(2).map { String($0) }.joined()
    }

    var timeString: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: timestamp)
    }
}

struct MessageReplyRef {
    let senderName: String
    let content: String
}

struct MessageReaction: Identifiable {
    let id = UUID()
    let emoji: String
    var count: Int
}

struct ChatAttachment {
    let type: AttachmentType
    let url: String
    let name: String
    let size: Int?

    var sizeString: String {
        guard let size = size else { return "" }
        if size < 1024 {
            return "\(size) o"
        } else if size < 1024 * 1024 {
            return "\(size / 1024) Ko"
        } else {
            return String(format: "%.1f Mo", Double(size) / (1024 * 1024))
        }
    }
}

enum AttachmentType {
    case image
    case file
    case location
}

// MARK: - ViewModel

@MainActor
class GroupChatViewModel: ObservableObject {
    @Published var messages: [GroupMessage] = []
    @Published var isOtherUserTyping = false
    @Published var typingUserName = ""
    @Published var replyingTo: GroupMessage?

    let currentUserId = UUID()

    func loadMessages() async {
        if AppConfig.FeatureFlags.demoMode {
            try? await Task.sleep(nanoseconds: 300_000_000)

            let otherUser1Id = UUID()
            let otherUser2Id = UUID()

            messages = [
                GroupMessage(
                    id: UUID(),
                    senderId: otherUser1Id,
                    senderName: "Marie Dupont",
                    content: "Salut tout le monde ! Quelqu'un pour faire les courses ce soir ? 🛒",
                    timestamp: Calendar.current.date(byAdding: .hour, value: -2, to: Date())!,
                    isRead: true,
                    reactions: [MessageReaction(emoji: "👍", count: 2)],
                    replyTo: nil,
                    attachment: nil
                ),
                GroupMessage(
                    id: UUID(),
                    senderId: currentUserId,
                    senderName: "Vous",
                    content: "Je peux y aller vers 19h si ça vous va !",
                    timestamp: Calendar.current.date(byAdding: .hour, value: -1, to: Date())!,
                    isRead: true,
                    reactions: [],
                    replyTo: nil,
                    attachment: nil
                ),
                GroupMessage(
                    id: UUID(),
                    senderId: otherUser2Id,
                    senderName: "Thomas Martin",
                    content: "Parfait ! Tu peux prendre du lait et du pain stp ? 🥖",
                    timestamp: Calendar.current.date(byAdding: .minute, value: -45, to: Date())!,
                    isRead: true,
                    reactions: [],
                    replyTo: MessageReplyRef(senderName: "Vous", content: "Je peux y aller vers 19h..."),
                    attachment: nil
                ),
                GroupMessage(
                    id: UUID(),
                    senderId: otherUser1Id,
                    senderName: "Marie Dupont",
                    content: "Voici la liste des courses",
                    timestamp: Calendar.current.date(byAdding: .minute, value: -30, to: Date())!,
                    isRead: true,
                    reactions: [MessageReaction(emoji: "✅", count: 1)],
                    replyTo: nil,
                    attachment: ChatAttachment(type: .file, url: "", name: "liste_courses.pdf", size: 45000)
                ),
                GroupMessage(
                    id: UUID(),
                    senderId: currentUserId,
                    senderName: "Vous",
                    content: "C'est noté ! Je vous tiens au courant 👌",
                    timestamp: Calendar.current.date(byAdding: .minute, value: -10, to: Date())!,
                    isRead: true,
                    reactions: [],
                    replyTo: nil,
                    attachment: nil
                )
            ]
        }
    }

    func sendMessage(_ content: String) {
        let message = GroupMessage(
            id: UUID(),
            senderId: currentUserId,
            senderName: "Vous",
            content: content,
            timestamp: Date(),
            isRead: false,
            reactions: [],
            replyTo: replyingTo.map { MessageReplyRef(senderName: $0.senderName, content: $0.content) },
            attachment: nil
        )
        messages.append(message)
        replyingTo = nil
    }

    func sendAttachment(_ attachment: ChatAttachment) {
        let message = GroupMessage(
            id: UUID(),
            senderId: currentUserId,
            senderName: "Vous",
            content: "",
            timestamp: Date(),
            isRead: false,
            reactions: [],
            replyTo: nil,
            attachment: attachment
        )
        messages.append(message)
    }

    func addReaction(to message: GroupMessage, emoji: String) {
        if let index = messages.firstIndex(where: { $0.id == message.id }) {
            if let reactionIndex = messages[index].reactions.firstIndex(where: { $0.emoji == emoji }) {
                messages[index].reactions[reactionIndex].count += 1
            } else {
                messages[index].reactions.append(MessageReaction(emoji: emoji, count: 1))
            }
        }
    }

    func replyTo(_ message: GroupMessage) {
        replyingTo = message
    }

    func cancelReply() {
        replyingTo = nil
    }

    func deleteMessage(_ message: GroupMessage) {
        messages.removeAll { $0.id == message.id }
    }

    func updateTypingStatus(_ isTyping: Bool) {
        // TODO: Send typing status to server
    }
}

// MARK: - Preview

struct GroupChatView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            GroupChatView()
        }
    }
}
