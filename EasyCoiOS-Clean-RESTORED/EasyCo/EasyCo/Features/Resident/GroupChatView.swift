//
//  GroupChatView.swift
//  EasyCo
//
//  Chat de groupe de la colocation en temps réel
//

import SwiftUI

struct GroupChatView: View {
    @StateObject private var viewModel = GroupChatViewModel()
    @FocusState private var isInputFocused: Bool

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Pinned messages banner
                if !viewModel.pinnedMessages.isEmpty {
                    pinnedMessagesBanner
                }

                // Messages list
                messagesListSection

                // Input bar
                inputSection
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    VStack(spacing: 2) {
                        Text("Chat de groupe")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "111827"))

                        if !viewModel.typingUsers.isEmpty {
                            Text("\(viewModel.typingUsers.joined(separator: ", ")) en train d'écrire...")
                                .font(.system(size: 11))
                                .foregroundColor(Color(hex: "6B7280"))
                        }
                    }
                }
            }
            .onTapGesture {
                isInputFocused = false
            }
        }
    }

    // MARK: - Pinned Messages Banner

    private var pinnedMessagesBanner: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(viewModel.pinnedMessages) { message in
                    PinnedMessageCard(message: message)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
        .background(Color(hex: "FFF4ED"))
        .overlay(
            Rectangle()
                .fill(Color(hex: "E8865D"))
                .frame(height: 1),
            alignment: .bottom
        )
    }

    // MARK: - Messages List

    private var messagesListSection: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(spacing: 16) {
                    ForEach(viewModel.messages) { message in
                        MessageBubble(message: message, viewModel: viewModel)
                            .id(message.id)
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
    }

    // MARK: - Input Section

    private var inputSection: some View {
        HStack(spacing: 12) {
            // Text field
            HStack {
                TextField("Envoyer un message...", text: $viewModel.newMessageText, axis: .vertical)
                    .font(.system(size: 16))
                    .lineLimit(1...5)
                    .focused($isInputFocused)
                    .onChange(of: viewModel.newMessageText) { newValue in
                        if !newValue.isEmpty {
                            viewModel.userStartedTyping()
                        } else {
                            viewModel.userStoppedTyping()
                        }
                    }

                // Attach button (photo/file)
                Button(action: {}) {
                    Image(systemName: "paperclip")
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "6B7280"))
                }
            }
            .padding(12)
            .background(Color.white)
            .cornerRadius(24)

            // Send button
            Button(action: {
                viewModel.sendMessage()
                isInputFocused = false
            }) {
                Image(systemName: viewModel.isSending ? "arrow.up.circle" : "arrow.up.circle.fill")
                    .font(.system(size: 32))
                    .foregroundColor(viewModel.newMessageText.isEmpty ? Color(hex: "9CA3AF") : Color(hex: "E8865D"))
            }
            .disabled(viewModel.newMessageText.isEmpty || viewModel.isSending)
        }
        .padding(16)
        .background(Color(hex: "F9FAFB"))
    }
}

// MARK: - Pinned Message Card

struct PinnedMessageCard: View {
    let message: Message

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: "pin.fill")
                .font(.system(size: 12))
                .foregroundColor(Color(hex: "E8865D"))

            VStack(alignment: .leading, spacing: 2) {
                Text(message.senderName)
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(Color(hex: "E8865D"))

                Text(message.content)
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "111827"))
                    .lineLimit(1)
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(Color.white)
        .cornerRadius(12)
    }
}

// MARK: - Message Bubble

struct MessageBubble: View {
    let message: Message
    @ObservedObject var viewModel: GroupChatViewModel
    @State private var showActions = false

    private var isCurrentUser: Bool {
        message.senderName == "Moi"
    }

    var body: some View {
        HStack(alignment: .bottom, spacing: 8) {
            if !isCurrentUser {
                // Avatar
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color(hex: "E8865D"), Color(hex: "E8865D").opacity(0.7)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 32, height: 32)
                    .overlay(
                        Text(String(message.senderName.prefix(1)))
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(.white)
                    )
            }

            VStack(alignment: isCurrentUser ? .trailing : .leading, spacing: 4) {
                // Sender name (if not current user)
                if !isCurrentUser {
                    Text(message.senderName)
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                // Message content
                Text(message.content)
                    .font(.system(size: 15))
                    .foregroundColor(isCurrentUser ? .white : Color(hex: "111827"))
                    .padding(.horizontal, 16)
                    .padding(.vertical, 10)
                    .background(isCurrentUser ? Color(hex: "E8865D") : Color.white)
                    .cornerRadius(20)
                    .contextMenu {
                        Button(action: {
                            _Concurrency.Task {
                                await viewModel.togglePin(message)
                            }
                        }) {
                            Label(message.isPinned ? "Désépingler" : "Épingler", systemImage: "pin")
                        }

                        Button(role: .destructive, action: {
                            _Concurrency.Task {
                                await viewModel.deleteMessage(message.id)
                            }
                        }) {
                            Label("Supprimer", systemImage: "trash")
                        }
                    }

                // Timestamp
                Text(message.timestamp, style: .time)
                    .font(.system(size: 10))
                    .foregroundColor(Color(hex: "9CA3AF"))
            }

            if isCurrentUser {
                Spacer()
            }
        }
        .frame(maxWidth: .infinity, alignment: isCurrentUser ? .trailing : .leading)
    }
}

// MARK: - Preview

struct GroupChatView_Previews: PreviewProvider {
    static var previews: some View {
        GroupChatView()
    }
}
