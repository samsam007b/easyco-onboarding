//
//  ConversationView.swift
//  EasyCo
//
//  One-on-one conversation view with message bubbles
//

import SwiftUI

struct ConversationView: View {
    let conversation: Conversation
    @Environment(\.dismiss) private var dismiss

    @State private var messages: [Message] = []
    @State private var messageText = ""
    @State private var showPropertyCard = false
    @State private var keyboardHeight: CGFloat = 0

    var body: some View {
        NavigationStack {
            ZStack(alignment: .bottom) {
                Theme.Colors.backgroundSecondary
                    .ignoresSafeArea()

                VStack(spacing: 0) {
                    // Messages scroll view
                    ScrollViewReader { proxy in
                        ScrollView {
                            LazyVStack(spacing: 16) {
                                // Property card at top
                                propertyCard

                                // Messages
                                ForEach(messages) { message in
                                    MessageBubble(message: message)
                                        .id(message.id)
                                }

                                // Spacing for keyboard
                                Color.clear
                                    .frame(height: 100)
                                    .id("bottom")
                            }
                            .padding(.horizontal)
                            .padding(.top, 16)
                        }
                        .onAppear {
                            // Scroll to bottom on appear
                            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                                withAnimation {
                                    proxy.scrollTo("bottom", anchor: .bottom)
                                }
                            }
                        }
                        .onChange(of: messages.count) { _ in
                            // Scroll to bottom when new message
                            withAnimation {
                                proxy.scrollTo("bottom", anchor: .bottom)
                            }
                        }
                    }

                    // Message input bar
                    MessageInputBar(
                        text: $messageText,
                        onSend: sendMessage,
                        onAttachProperty: {
                            showPropertyCard = true
                        }
                    )
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: { dismiss() }) {
                        Image.lucide("arrow-left")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 20, height: 20)
                            .foregroundColor(Theme.Colors.textPrimary)
                    }
                }

                ToolbarItem(placement: .principal) {
                    HStack(spacing: 12) {
                        AsyncImage(url: URL(string: conversation.match.property.images.first ?? "")) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Rectangle()
                                .fill(Theme.Colors.gray200)
                        }
                        .frame(width: 36, height: 36)
                        .clipShape(RoundedRectangle(cornerRadius: 8))

                        VStack(alignment: .leading, spacing: 2) {
                            Text(conversation.match.property.title)
                                .font(Theme.Typography.body(.semibold))
                                .foregroundColor(Theme.Colors.textPrimary)
                                .lineLimit(1)

                            Text(conversation.match.property.location)
                                .font(Theme.Typography.caption())
                                .foregroundColor(Theme.Colors.textSecondary)
                                .lineLimit(1)
                        }
                    }
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Menu {
                        Button(action: {
                            showPropertyCard = true
                        }) {
                            Label("Voir la propriété", systemImage: "house")
                        }

                        Button(action: {
                            // Report conversation
                        }) {
                            Label("Signaler", systemImage: "exclamationmark.triangle")
                        }

                        Button(role: .destructive, action: {
                            // Block user
                        }) {
                            Label("Bloquer", systemImage: "hand.raised")
                        }
                    } label: {
                        Image.lucide("more-vertical")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 20, height: 20)
                            .foregroundColor(Theme.Colors.textPrimary)
                    }
                }
            }
            .sheet(isPresented: $showPropertyCard) {
                PropertyDetailView(property: conversation.match.property)
            }
        }
        .onAppear {
            loadMessages()
        }
    }

    // MARK: - Property Card

    private var propertyCard: some View {
        Button(action: {
            showPropertyCard = true
        }) {
            HStack(spacing: 12) {
                AsyncImage(url: URL(string: conversation.match.property.images.first ?? "")) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Rectangle()
                        .fill(Theme.Colors.gray200)
                }
                .frame(width: 80, height: 80)
                .clipShape(RoundedRectangle(cornerRadius: 12))

                VStack(alignment: .leading, spacing: 6) {
                    Text(conversation.match.property.title)
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)
                        .lineLimit(2)

                    HStack(alignment: .firstTextBaseline, spacing: 4) {
                        Text("\(conversation.match.property.price)€")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(Theme.Colors.primary)

                        Text("/mois")
                            .font(Theme.Typography.caption())
                            .foregroundColor(Theme.Colors.textSecondary)
                    }

                    HStack(spacing: 12) {
                        if conversation.match.property.bedrooms > 0 {
                            PropertyCardFeature(icon: "bed", value: "\(conversation.match.property.bedrooms)")
                        }

                        if conversation.match.property.bathrooms > 0 {
                            PropertyCardFeature(icon: "bath", value: "\(conversation.match.property.bathrooms)")
                        }

                        if let area = conversation.match.property.area {
                            PropertyCardFeature(icon: "ruler", value: "\(area)m²")
                        }
                    }
                }

                Spacer()

                Image.lucide("chevron-right")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 20, height: 20)
                    .foregroundColor(Theme.Colors.textTertiary)
            }
            .padding(16)
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.card)
            .cardShadow()
        }
        .buttonStyle(PlainButtonStyle())
    }

    // MARK: - Actions

    private func loadMessages() {
        messages = conversation.messages
    }

    private func sendMessage() {
        guard !messageText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }

        let newMessage = Message(
            id: UUID().uuidString,
            text: messageText,
            sentAt: Date(),
            isFromCurrentUser: true,
            isRead: false
        )

        messages.append(newMessage)
        messageText = ""

        Haptic.impact(.light)

        // Simulate response after 2 seconds
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            let response = Message(
                id: UUID().uuidString,
                text: "Merci pour votre message ! Je vous réponds au plus vite.",
                sentAt: Date(),
                isFromCurrentUser: false,
                isRead: false
            )
            messages.append(response)
        }
    }
}

// MARK: - Message Bubble

struct MessageBubble: View {
    let message: Message

    var body: some View {
        HStack {
            if message.isFromCurrentUser {
                Spacer(minLength: 60)
            }

            VStack(alignment: message.isFromCurrentUser ? .trailing : .leading, spacing: 4) {
                // Message bubble
                Text(message.text)
                    .font(Theme.Typography.body())
                    .foregroundColor(message.isFromCurrentUser ? .white : Theme.Colors.textPrimary)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    .background(
                        message.isFromCurrentUser ?
                        AnyView(Theme.Colors.primaryGradient) :
                        AnyView(LinearGradient(colors: [Theme.Colors.backgroundPrimary], startPoint: .leading, endPoint: .trailing))
                    )
                    .cornerRadius(20, corners: message.isFromCurrentUser ?
                        [.topLeft, .topRight, .bottomLeft] :
                        [.topLeft, .topRight, .bottomRight]
                    )
                    .shadow(color: .black.opacity(0.05), radius: 2, y: 1)

                // Timestamp and read receipt
                HStack(spacing: 4) {
                    Text(message.formattedTime)
                        .font(.system(size: 11))
                        .foregroundColor(Theme.Colors.textTertiary)

                    if message.isFromCurrentUser {
                        Image.lucide(message.isRead ? "check-check" : "check")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 12, height: 12)
                            .foregroundColor(message.isRead ? Theme.Colors.primary : Theme.Colors.textTertiary)
                    }
                }
                .padding(.horizontal, 4)
            }

            if !message.isFromCurrentUser {
                Spacer(minLength: 60)
            }
        }
    }
}

// MARK: - Message Input Bar

struct MessageInputBar: View {
    @Binding var text: String
    let onSend: () -> Void
    let onAttachProperty: () -> Void

    @FocusState private var isFocused: Bool
    @State private var inputHeight: CGFloat = 40

    var body: some View {
        VStack(spacing: 0) {
            Divider()
                .background(Theme.Colors.gray200)

            HStack(alignment: .bottom, spacing: 12) {
                // Attach property button
                Button(action: {
                    Haptic.impact(.light)
                    onAttachProperty()
                }) {
                    Image.lucide("paperclip")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 22, height: 22)
                        .foregroundColor(Theme.Colors.primary)
                        .frame(width: 40, height: 40)
                }

                // Text input
                ZStack(alignment: .leading) {
                    if text.isEmpty {
                        Text("Écrivez un message...")
                            .font(Theme.Typography.body())
                            .foregroundColor(Theme.Colors.textTertiary)
                            .padding(.leading, 16)
                            .padding(.vertical, 10)
                    }

                    TextEditor(text: $text)
                        .font(Theme.Typography.body())
                        .foregroundColor(Theme.Colors.textPrimary)
                        .focused($isFocused)
                        .frame(minHeight: 40, maxHeight: 120)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .scrollContentBackground(.hidden)
                        .background(Theme.Colors.backgroundSecondary)
                        .cornerRadius(20)
                }

                // Send button
                Button(action: {
                    onSend()
                    isFocused = false
                }) {
                    Image.lucide("send")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 20, height: 20)
                        .foregroundColor(.white)
                        .frame(width: 40, height: 40)
                        .background(
                            text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ?
                            LinearGradient(colors: [Theme.Colors.gray300], startPoint: .leading, endPoint: .trailing) :
                            Theme.Colors.primaryGradient
                        )
                        .clipShape(Circle())
                }
                .disabled(text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(.ultraThinMaterial)
        }
    }
}

// MARK: - Supporting Views

private struct PropertyCardFeature: View {
    let icon: String
    let value: String

    var body: some View {
        HStack(spacing: 4) {
            Image.lucide(icon)
                .resizable()
                .scaledToFit()
                .frame(width: 14, height: 14)
                .foregroundColor(Theme.Colors.textTertiary)

            Text(value)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(Theme.Colors.textSecondary)
        }
    }
}

// MARK: - Preview

struct ConversationView_Previews: PreviewProvider {
    static var previews: some View {
        let calendar = Calendar.current
        let now = Date()

        let mockMatch = Match(
            id: "1",
            property: .mock,
            matchedAt: calendar.date(byAdding: .day, value: -2, to: now)!,
            hasUnreadMessages: true,
            lastMessage: "Quand puis-je visiter ?",
            lastMessageAt: calendar.date(byAdding: .minute, value: -15, to: now)!
        )

        let mockConversation = Conversation(
            id: "1",
            match: mockMatch,
            messages: [
                Message(id: "1", text: "Bonjour ! Je suis intéressé par votre propriété.", sentAt: calendar.date(byAdding: .hour, value: -2, to: now)!, isFromCurrentUser: true, isRead: true),
                Message(id: "2", text: "Bonjour ! Merci pour votre intérêt. La propriété est toujours disponible.", sentAt: calendar.date(byAdding: .hour, value: -1, to: now)!, isFromCurrentUser: false, isRead: true),
                Message(id: "3", text: "Super ! Est-ce que je peux venir la visiter cette semaine ?", sentAt: calendar.date(byAdding: .minute, value: -45, to: now)!, isFromCurrentUser: true, isRead: true),
                Message(id: "4", text: "Bien sûr ! Êtes-vous disponible mercredi après-midi ?", sentAt: calendar.date(byAdding: .minute, value: -30, to: now)!, isFromCurrentUser: false, isRead: true),
                Message(id: "5", text: "Oui parfait, vers 15h ça vous convient ?", sentAt: calendar.date(byAdding: .minute, value: -15, to: now)!, isFromCurrentUser: true, isRead: false)
            ],
            lastReadAt: calendar.date(byAdding: .hour, value: -1, to: now)!
        )

        ConversationView(conversation: mockConversation)
    }
}
