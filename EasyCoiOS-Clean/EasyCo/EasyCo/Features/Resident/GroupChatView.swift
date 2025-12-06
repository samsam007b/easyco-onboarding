//
//  GroupChatView.swift
//  EasyCo
//
//  Vue chat de groupe - REDESIGN Pinterest Style
//  Glassmorphism, profondeur, bulles modernes
//

import SwiftUI

struct GroupChatView: View {
    @StateObject private var viewModel = GroupChatViewModel()
    @State private var messageText = ""
    @State private var showAttachmentPicker = false
    @State private var showMessageActions = false
    @State private var selectedMessage: GroupMessage?
    @FocusState private var isInputFocused: Bool

    private let role: Theme.UserRole = .resident

    var body: some View {
        ZStack {
            // Background Pinterest avec blobs organiques
            PinterestBackground(role: role, intensity: 0.12)
                .ignoresSafeArea()

            VStack(spacing: 0) {
                // Messages list
                ScrollViewReader { proxy in
                    ScrollView(showsIndicators: false) {
                        LazyVStack(spacing: Theme.PinterestSpacing.md) {
                            // Date header
                            if !viewModel.messages.isEmpty {
                                dateSeparator("Aujourd'hui")
                            }

                            ForEach(viewModel.messages) { message in
                                PinterestChatBubble(
                                    message: message,
                                    isCurrentUser: message.senderId == viewModel.currentUserId,
                                    role: role,
                                    onLongPress: {
                                        selectedMessage = message
                                        showMessageActions = true
                                        Haptic.medium()
                                    },
                                    onReact: { emoji in
                                        viewModel.addReaction(to: message, emoji: emoji)
                                    }
                                )
                                .id(message.id)
                            }

                            // Typing indicator
                            if viewModel.isOtherUserTyping {
                                PinterestTypingIndicator(userName: viewModel.typingUserName)
                            }
                        }
                        .padding(Theme.PinterestSpacing.lg)
                    }
                    .onChange(of: viewModel.messages.count) { _ in
                        if let lastMessage = viewModel.messages.last {
                            withAnimation(Theme.PinterestAnimations.smoothSpring) {
                                proxy.scrollTo(lastMessage.id, anchor: .bottom)
                            }
                        }
                    }
                }

                // Input area
                messageInputArea
            }
        }
        .navigationTitle("Chat coloc")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
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
                    Circle()
                        .fill(Color.white.opacity(0.75))
                        .frame(width: 36, height: 36)
                        .overlay(
                            Image(systemName: "ellipsis")
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(role.primaryColor)
                        )
                        .pinterestShadow(Theme.PinterestShadows.soft)
                }
            }
        }
        .sheet(isPresented: $showAttachmentPicker) {
            PinterestAttachmentPicker(role: role) { attachment in
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
                .fill(Color.white.opacity(0.5))
                .frame(height: 1.5)

            Text(text)
                .font(Theme.PinterestTypography.caption(.semibold))
                .foregroundColor(Theme.Colors.textSecondary)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(
                    Capsule()
                        .fill(Color.white.opacity(0.75))
                        .overlay(
                            Capsule()
                                .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                        )
                )
                .pinterestShadow(Theme.PinterestShadows.subtle)

            Rectangle()
                .fill(Color.white.opacity(0.5))
                .frame(height: 1.5)
        }
        .padding(.vertical, Theme.PinterestSpacing.md)
    }

    // MARK: - Message Input Area

    private var messageInputArea: some View {
        VStack(spacing: 0) {
            // Reply preview if replying
            if let replyingTo = viewModel.replyingTo {
                HStack(spacing: 12) {
                    Rectangle()
                        .fill(role.gradient)
                        .frame(width: 3)
                        .cornerRadius(1.5)

                    VStack(alignment: .leading, spacing: 4) {
                        Text("Réponse à \(replyingTo.senderName)")
                            .font(Theme.PinterestTypography.caption(.semibold))
                            .foregroundColor(role.primaryColor)

                        Text(replyingTo.content)
                            .font(Theme.PinterestTypography.bodySmall(.regular))
                            .foregroundColor(Theme.Colors.textSecondary)
                            .lineLimit(1)
                    }

                    Spacer()

                    Button(action: {
                        withAnimation(Theme.PinterestAnimations.quickSpring) {
                            viewModel.cancelReply()
                        }
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 20))
                            .foregroundColor(Theme.Colors.textTertiary)
                    }
                }
                .padding(Theme.PinterestSpacing.md)
                .background(
                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                        .fill(Color.white.opacity(0.6))
                )
                .padding(.horizontal, Theme.PinterestSpacing.lg)
                .padding(.top, Theme.PinterestSpacing.sm)
            }

            HStack(spacing: 12) {
                // Attachment button
                Button(action: {
                    showAttachmentPicker = true
                    Haptic.light()
                }) {
                    Circle()
                        .fill(role.gradient)
                        .frame(width: 40, height: 40)
                        .overlay(
                            Image(systemName: "plus")
                                .font(.system(size: 18, weight: .semibold))
                                .foregroundColor(.white)
                        )
                        .pinterestShadow(Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.3))
                }

                // Text input avec glassmorphism
                HStack(spacing: 8) {
                    TextField("Message...", text: $messageText, axis: .vertical)
                        .font(Theme.PinterestTypography.bodyRegular(.regular))
                        .foregroundColor(Theme.Colors.textPrimary)
                        .lineLimit(1...4)
                        .focused($isInputFocused)
                        .onChange(of: messageText) { _ in
                            viewModel.updateTypingStatus(!messageText.isEmpty)
                        }

                    // Emoji button
                    Button(action: {}) {
                        Image(systemName: "face.smiling")
                            .font(.system(size: 20))
                            .foregroundColor(Theme.Colors.textTertiary)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(
                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                        .fill(Color.white.opacity(0.75))
                        .overlay(
                            RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                                .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                        )
                )
                .pinterestShadow(Theme.PinterestShadows.subtle)

                // Send button
                Button(action: {
                    sendMessage()
                    Haptic.light()
                }) {
                    ZStack {
                        if messageText.isEmpty {
                            Circle()
                                .fill(Color.white.opacity(0.75))
                                .frame(width: 40, height: 40)
                                .pinterestShadow(Theme.PinterestShadows.subtle)
                        } else {
                            Circle()
                                .fill(role.gradient)
                                .frame(width: 40, height: 40)
                                .pinterestShadow(Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.3))
                        }

                        Image(systemName: messageText.isEmpty ? "mic.fill" : "arrow.up")
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(messageText.isEmpty ? Theme.Colors.textTertiary : .white)
                    }
                }
                .disabled(messageText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            }
            .padding(Theme.PinterestSpacing.lg)
            .background(
                Rectangle()
                    .fill(Color.white.opacity(0.5))
                    .ignoresSafeArea()
            )
        }
    }

    private func sendMessage() {
        guard !messageText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }
        viewModel.sendMessage(messageText)
        messageText = ""
    }
}

// MARK: - Pinterest Chat Bubble

private struct PinterestChatBubble: View {
    let message: GroupMessage
    let isCurrentUser: Bool
    let role: Theme.UserRole
    let onLongPress: () -> Void
    let onReact: (String) -> Void

    @State private var showReactionPicker = false

    var body: some View {
        HStack(alignment: .bottom, spacing: Theme.PinterestSpacing.sm) {
            if isCurrentUser {
                Spacer(minLength: 60)
            } else {
                // Avatar avec gradient
                Circle()
                    .fill(role.gradient)
                    .frame(width: 36, height: 36)
                    .overlay(
                        Text(message.senderInitials)
                            .font(Theme.PinterestTypography.caption(.bold))
                            .foregroundColor(.white)
                    )
                    .pinterestShadow(Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.25))
            }

            VStack(alignment: isCurrentUser ? .trailing : .leading, spacing: 6) {
                // Sender name (only for others)
                if !isCurrentUser {
                    Text(message.senderName)
                        .font(Theme.PinterestTypography.caption(.semibold))
                        .foregroundColor(Theme.Colors.textSecondary)
                        .padding(.leading, 4)
                }

                // Reply reference
                if let replyTo = message.replyTo {
                    HStack(spacing: 8) {
                        Rectangle()
                            .fill(role.primaryColor.opacity(0.6))
                            .frame(width: 3)
                            .cornerRadius(1.5)

                        VStack(alignment: .leading, spacing: 2) {
                            Text(replyTo.senderName)
                                .font(Theme.PinterestTypography.captionSmall(.bold))
                                .foregroundColor(role.primaryColor)

                            Text(replyTo.content)
                                .font(Theme.PinterestTypography.caption(.regular))
                                .foregroundColor(Theme.Colors.textSecondary)
                                .lineLimit(1)
                        }
                    }
                    .padding(10)
                    .background(
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.small)
                            .fill(Color.white.opacity(0.5))
                    )
                }

                // Message content
                VStack(alignment: isCurrentUser ? .trailing : .leading, spacing: 6) {
                    // Attachment if any
                    if let attachment = message.attachment {
                        PinterestAttachmentView(attachment: attachment)
                    }

                    // Text content
                    if !message.content.isEmpty {
                        Text(message.content)
                            .font(Theme.PinterestTypography.bodyRegular(.regular))
                            .foregroundColor(isCurrentUser ? .white : Theme.Colors.textPrimary)
                    }

                    // Time and status
                    HStack(spacing: 6) {
                        Text(message.timeString)
                            .font(Theme.PinterestTypography.captionSmall(.medium))
                            .foregroundColor(isCurrentUser ? .white.opacity(0.8) : Theme.Colors.textTertiary)

                        if isCurrentUser {
                            Image(systemName: message.isRead ? "checkmark.circle.fill" : "checkmark.circle")
                                .font(.system(size: 11))
                                .foregroundColor(.white.opacity(0.8))
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(
                    ZStack {
                        if isCurrentUser {
                            RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                                .fill(role.gradient)
                        } else {
                            RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                                .fill(Color.white.opacity(0.8))
                                .overlay(
                                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                                        .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                                )
                        }
                    }
                )
                .pinterestShadow(
                    isCurrentUser
                        ? Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.3)
                        : Theme.PinterestShadows.medium
                )
                .onLongPressGesture {
                    onLongPress()
                }

                // Reactions
                if !message.reactions.isEmpty {
                    HStack(spacing: 6) {
                        ForEach(message.reactions, id: \.emoji) { reaction in
                            HStack(spacing: 4) {
                                Text(reaction.emoji)
                                    .font(.system(size: 13))
                                if reaction.count > 1 {
                                    Text("\(reaction.count)")
                                        .font(Theme.PinterestTypography.captionSmall(.bold))
                                        .foregroundColor(Theme.Colors.textSecondary)
                                }
                            }
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(
                                Capsule()
                                    .fill(Color.white.opacity(0.9))
                                    .overlay(
                                        Capsule()
                                            .stroke(Color.white.opacity(0.6), lineWidth: 1)
                                    )
                            )
                            .pinterestShadow(Theme.PinterestShadows.soft)
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

// MARK: - Pinterest Attachment View

struct PinterestAttachmentView: View {
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
                        .frame(maxWidth: 220, maxHeight: 220)
                        .clipped()
                        .cornerRadius(Theme.PinterestRadius.medium)
                        .pinterestShadow(Theme.PinterestShadows.medium)
                case .failure(_), .empty:
                    Rectangle()
                        .fill(Color.white.opacity(0.5))
                        .frame(width: 220, height: 160)
                        .cornerRadius(Theme.PinterestRadius.medium)
                        .overlay(
                            Image(systemName: "photo")
                                .font(.system(size: 40))
                                .foregroundColor(Theme.Colors.textTertiary)
                        )
                @unknown default:
                    EmptyView()
                }
            }

        case .file:
            HStack(spacing: 12) {
                ZStack {
                    Circle()
                        .fill(Color(hex: "6366F1").opacity(0.15))
                        .frame(width: 44, height: 44)

                    Image(systemName: "doc.fill")
                        .font(.system(size: 20, weight: .semibold))
                        .foregroundColor(Color(hex: "6366F1"))
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text(attachment.name)
                        .font(Theme.PinterestTypography.bodySmall(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)
                        .lineLimit(1)

                    Text(attachment.sizeString)
                        .font(Theme.PinterestTypography.caption(.regular))
                        .foregroundColor(Theme.Colors.textSecondary)
                }

                Spacer()
            }
            .padding(12)
            .background(
                RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                    .fill(Color.white.opacity(0.7))
                    .overlay(
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                            .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                    )
            )
            .pinterestShadow(Theme.PinterestShadows.soft)

        case .location:
            HStack(spacing: 12) {
                ZStack {
                    Circle()
                        .fill(Color(hex: "EF4444").opacity(0.15))
                        .frame(width: 44, height: 44)

                    Image(systemName: "location.fill")
                        .font(.system(size: 20, weight: .semibold))
                        .foregroundColor(Color(hex: "EF4444"))
                }

                Text(attachment.name)
                    .font(Theme.PinterestTypography.bodySmall(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
            }
            .padding(12)
            .background(
                RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                    .fill(Color.white.opacity(0.7))
                    .overlay(
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                            .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                    )
            )
            .pinterestShadow(Theme.PinterestShadows.soft)
        }
    }
}

// MARK: - Pinterest Typing Indicator

struct PinterestTypingIndicator: View {
    let userName: String
    @State private var animationOffset = 0

    var body: some View {
        HStack(alignment: .bottom, spacing: Theme.PinterestSpacing.sm) {
            Circle()
                .fill(
                    LinearGradient(
                        colors: [Color(hex: "E5E7EB"), Color(hex: "D1D5DB")],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(width: 36, height: 36)

            HStack(spacing: 6) {
                ForEach(0..<3, id: \.self) { index in
                    Circle()
                        .fill(Theme.Colors.textTertiary)
                        .frame(width: 8, height: 8)
                        .offset(y: animationOffset == index ? -6 : 0)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 14)
            .background(
                RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                    .fill(Color.white.opacity(0.8))
                    .overlay(
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                            .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                    )
            )
            .pinterestShadow(Theme.PinterestShadows.medium)
            .onAppear {
                withAnimation(Theme.PinterestAnimations.smoothSpring.repeatForever()) {
                    animationOffset = (animationOffset + 1) % 3
                }
            }

            Spacer()
        }
    }
}

// MARK: - Pinterest Attachment Picker

struct PinterestAttachmentPicker: View {
    let role: Theme.UserRole
    let onSelect: (ChatAttachment) -> Void
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ZStack {
                PinterestBackground(role: role, intensity: 0.1)
                    .ignoresSafeArea()

                ScrollView {
                    VStack(spacing: Theme.PinterestSpacing.md) {
                        attachmentOption(
                            title: "Galerie photo",
                            icon: "photo.fill",
                            color: Color(hex: "10B981"),
                            action: {
                                // Photo library
                                dismiss()
                            }
                        )

                        attachmentOption(
                            title: "Prendre une photo",
                            icon: "camera.fill",
                            color: Color(hex: "6366F1"),
                            action: {
                                // Camera
                                dismiss()
                            }
                        )

                        attachmentOption(
                            title: "Document",
                            icon: "doc.fill",
                            color: Color(hex: "F59E0B"),
                            action: {
                                // Document
                                dismiss()
                            }
                        )

                        attachmentOption(
                            title: "Position",
                            icon: "location.fill",
                            color: Color(hex: "EF4444"),
                            action: {
                                // Location
                                dismiss()
                            }
                        )
                    }
                    .padding(Theme.PinterestSpacing.lg)
                }
            }
            .navigationTitle("Ajouter")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") {
                        dismiss()
                    }
                    .foregroundColor(role.primaryColor)
                }
            }
        }
        .presentationDetents([.medium])
    }

    private func attachmentOption(title: String, icon: String, color: Color, action: @escaping () -> Void) -> some View {
        Button(action: {
            Haptic.light()
            action()
        }) {
            HStack(spacing: Theme.PinterestSpacing.md) {
                ZStack {
                    Circle()
                        .fill(color.opacity(0.15))
                        .frame(width: 56, height: 56)

                    Image(systemName: icon)
                        .font(.system(size: 24, weight: .semibold))
                        .foregroundColor(color)
                }

                Text(title)
                    .font(Theme.PinterestTypography.bodyLarge(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Theme.Colors.textTertiary)
            }
            .padding(Theme.PinterestSpacing.md)
            .pinterestGlassCard(padding: 0, radius: Theme.PinterestRadius.large)
        }
        .buttonStyle(ScaleButtonStyle())
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
