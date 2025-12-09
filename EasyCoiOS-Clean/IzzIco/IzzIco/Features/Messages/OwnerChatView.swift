//
//  OwnerChatView.swift
//  IzzIco
//
//  Chat view adapted for Owner with templates and context badges
//

import SwiftUI

struct OwnerChatView: View {
    let conversation: OwnerConversation
    @State private var messageText = ""
    @State private var messages: [OwnerMessage] = []
    @State private var showingTemplates = false
    @State private var isLoading = false
    @FocusState private var isMessageFieldFocused: Bool

    var body: some View {
        VStack(spacing: 0) {
            // Context badge
            contextBadge

            // Messages list
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(spacing: 16) {
                        ForEach(messages) { message in
                            OwnerMessageBubble(message: message, isOwner: true)
                                .id(message.id)
                        }
                    }
                    .padding(16)
                }
                .background(Color(hex: "F9FAFB"))
                .onChange(of: messages.count) { _ in
                    if let lastMessage = messages.last {
                        withAnimation {
                            proxy.scrollTo(lastMessage.id, anchor: .bottom)
                        }
                    }
                }
            }

            // Input area
            inputArea
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .principal) {
                VStack(spacing: 2) {
                    Text(conversation.recipientName)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    if conversation.isOnline {
                        Text("En ligne")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "10B981"))
                    }
                }
            }

            ToolbarItem(placement: .navigationBarTrailing) {
                Button(action: {}) {
                    Image(systemName: "info.circle")
                        .foregroundColor(Color(hex: "6E56CF"))
                }
            }
        }
        .sheet(isPresented: $showingTemplates) {
            MessageTemplatesView { template in
                messageText = template.content
                isMessageFieldFocused = true
            }
        }
        .task {
            await loadMessages()
        }
    }

    // MARK: - Context Badge

    private var contextBadge: some View {
        HStack(spacing: 8) {
            Image(systemName: conversation.contextIcon)
                .font(.system(size: 12))

            Text(conversation.context)
                .font(.system(size: 13, weight: .medium))

            Spacer()

            if conversation.type == .candidate {
                Text("CANDIDAT")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(Color(hex: "6E56CF"))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(Color(hex: "F3F0FF"))
                    .cornerRadius(8)
            } else {
                Text("LOCATAIRE")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(Color(hex: "10B981"))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(Color(hex: "ECFDF5"))
                    .cornerRadius(8)
            }
        }
        .foregroundColor(Color(hex: "6B7280"))
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color(hex: "FEF3C7"))
        .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)
    }

    // MARK: - Input Area

    private var inputArea: some View {
        VStack(spacing: 0) {
            Divider()

            // Quick template buttons
            quickTemplatesBar

            Divider()

            // Message input
            HStack(spacing: 12) {
                // Templates button
                Button(action: { showingTemplates = true }) {
                    Image(systemName: "doc.text")
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "6E56CF"))
                        .frame(width: 40, height: 40)
                        .background(Color(hex: "F3F0FF"))
                        .cornerRadius(20)
                }

                // Text field
                HStack(spacing: 8) {
                    TextField("Votre message...", text: $messageText, axis: .vertical)
                        .focused($isMessageFieldFocused)
                        .font(.system(size: 15))
                        .lineLimit(1...5)

                    if !messageText.isEmpty {
                        Button(action: { messageText = "" }) {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(Color(hex: "9CA3AF"))
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(Color(hex: "F9FAFB"))
                .cornerRadius(20)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                )

                // Send button
                Button(action: sendMessage) {
                    Image(systemName: messageText.isEmpty ? "paperplane" : "paperplane.fill")
                        .font(.system(size: 18))
                        .foregroundColor(.white)
                        .frame(width: 40, height: 40)
                        .background(
                            messageText.isEmpty
                                ? Color(hex: "D1D5DB")
                                : Color(hex: "6E56CF")
                        )
                        .cornerRadius(20)
                }
                .disabled(messageText.isEmpty)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
        .background(Color.white)
    }

    // MARK: - Quick Templates Bar

    private var quickTemplatesBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                QuickReplyButton(text: "Merci !", icon: "hand.thumbsup") {
                    messageText = "Merci !"
                }

                QuickReplyButton(text: "OK", icon: "checkmark") {
                    messageText = "Parfait, merci !"
                }

                QuickReplyButton(text: "Visite", icon: "calendar") {
                    messageText = "Je vous propose une visite cette semaine. Quand seriez-vous disponible ?"
                }

                QuickReplyButton(text: "Documents", icon: "doc.text") {
                    messageText = "Pourriez-vous me fournir les documents manquants ?"
                }

                QuickReplyButton(text: "Plus d'infos", icon: "questionmark.circle") {
                    messageText = "Pouvez-vous me donner plus d'informations ?"
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
        }
    }

    // MARK: - Actions

    private func sendMessage() {
        guard !messageText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }

        let newMessage = OwnerMessage(
            id: UUID(),
            conversationId: conversation.id,
            senderId: "owner-id", // Would be from auth
            recipientId: conversation.recipientId,
            content: messageText,
            timestamp: Date(),
            isRead: false,
            isSent: true
        )

        messages.append(newMessage)
        messageText = ""
        isMessageFieldFocused = false

        // Simulate API call
        _Concurrency.Task {
            // In real app, would send to server
            try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
        }
    }

    private func loadMessages() async {
        isLoading = true

        // Demo mode
        if AppConfig.FeatureFlags.demoMode {
            try? await _Concurrency.Task.sleep(nanoseconds: 300_000_000)
            messages = OwnerMessage.mockMessages(for: conversation.id)
        }

        isLoading = false
    }
}

// MARK: - Quick Reply Button

struct QuickReplyButton: View {
    let text: String
    let icon: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Image(systemName: icon)
                    .font(.system(size: 12))
                Text(text)
                    .font(.system(size: 13, weight: .medium))
            }
            .foregroundColor(Color(hex: "6E56CF"))
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(Color(hex: "F3F0FF"))
            .cornerRadius(16)
        }
    }
}

// MARK: - Message Bubble

struct OwnerMessageBubble: View {
    let message: OwnerMessage
    let isOwner: Bool

    private var isOutgoing: Bool {
        // In real app, would check if message.senderId matches current user
        message.isSent
    }

    var body: some View {
        HStack {
            if isOutgoing {
                Spacer(minLength: 60)
            }

            VStack(alignment: isOutgoing ? .trailing : .leading, spacing: 4) {
                Text(message.content)
                    .font(.system(size: 15))
                    .foregroundColor(isOutgoing ? .white : Color(hex: "111827"))
                    .padding(.horizontal, 16)
                    .padding(.vertical, 10)
                    .background(
                        isOutgoing
                            ? Color(hex: "6E56CF")
                            : Color.white
                    )
                    .cornerRadius(16, corners: isOutgoing
                        ? [.topLeft, .topRight, .bottomLeft]
                        : [.topLeft, .topRight, .bottomRight]
                    )
                    .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)

                HStack(spacing: 4) {
                    Text(message.timestamp.formatted(date: .omitted, time: .shortened))
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "9CA3AF"))

                    if isOutgoing {
                        Image(systemName: message.isRead ? "checkmark.circle.fill" : "checkmark.circle")
                            .font(.system(size: 11))
                            .foregroundColor(message.isRead ? Color(hex: "10B981") : Color(hex: "9CA3AF"))
                    }
                }
            }

            if !isOutgoing {
                Spacer(minLength: 60)
            }
        }
    }
}

// MARK: - Owner Message Model

struct OwnerMessage: Identifiable {
    let id: UUID
    let conversationId: UUID
    let senderId: String
    let recipientId: String
    let content: String
    let timestamp: Date
    var isRead: Bool
    let isSent: Bool // true if sent by owner

    static func mockMessages(for conversationId: UUID) -> [OwnerMessage] {
        [
            OwnerMessage(
                id: UUID(),
                conversationId: conversationId,
                senderId: "user-1",
                recipientId: "owner-id",
                content: "Bonjour, je suis très intéressée par votre logement. Serait-il possible de le visiter ?",
                timestamp: Date().addingTimeInterval(-7200),
                isRead: true,
                isSent: false
            ),
            OwnerMessage(
                id: UUID(),
                conversationId: conversationId,
                senderId: "owner-id",
                recipientId: "user-1",
                content: "Bonjour Sophie, avec plaisir ! Êtes-vous disponible cette semaine ?",
                timestamp: Date().addingTimeInterval(-7000),
                isRead: true,
                isSent: true
            ),
            OwnerMessage(
                id: UUID(),
                conversationId: conversationId,
                senderId: "user-1",
                recipientId: "owner-id",
                content: "Oui, je suis libre jeudi après-midi ou vendredi matin.",
                timestamp: Date().addingTimeInterval(-6800),
                isRead: true,
                isSent: false
            ),
            OwnerMessage(
                id: UUID(),
                conversationId: conversationId,
                senderId: "owner-id",
                recipientId: "user-1",
                content: "Parfait ! Je vous propose jeudi à 15h. L'adresse est 42 Rue de la Paix, 1050 Ixelles.",
                timestamp: Date().addingTimeInterval(-6600),
                isRead: true,
                isSent: true
            ),
            OwnerMessage(
                id: UUID(),
                conversationId: conversationId,
                senderId: "user-1",
                recipientId: "owner-id",
                content: "Merci, je serai là !",
                timestamp: Date().addingTimeInterval(-3600),
                isRead: false,
                isSent: false
            )
        ]
    }
}
