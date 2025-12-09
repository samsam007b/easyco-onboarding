//
//  ConversationsListView.swift
//  IzzIco
//
//  List of all conversations with matches
//

import SwiftUI

// MARK: - Conversation Model

// struct Conversation: Identifiable {
//     let id: String
//     let match: Match
//     let messages: [Message]
//     let lastReadAt: Date?
// 
//     var unreadCount: Int {
//         guard let lastReadAt = lastReadAt else { return messages.count }
//         return messages.filter { $0.sentAt > lastReadAt && !$0.isFromCurrentUser }.count
//     }
// 
//     var lastMessage: Message? {
//         messages.last
//     }
// }

// MARK: - Message Model

// struct Message: Identifiable {
//     let id: String
//     let text: String
//     let sentAt: Date
//     let isFromCurrentUser: Bool
//     var isRead: Bool
//     var attachmentURL: String?
// 
//     var timeAgo: String {
//         let now = Date()
//         let interval = now.timeIntervalSince(sentAt)
// 
//         if interval < 60 {
//             return "À l'instant"
//         } else if interval < 3600 {
//             let minutes = Int(interval / 60)
//             return "\(minutes)m"
//         } else if interval < 86400 {
//             let hours = Int(interval / 3600)
//             return "\(hours)h"
//         } else {
//             let days = Int(interval / 86400)
//             return "\(days)j"
//         }
//     }
// 
//     var formattedTime: String {
//         let formatter = DateFormatter()
//         formatter.timeStyle = .short
//         return formatter.string(from: sentAt)
//     }
// }

// MARK: - Conversations List View

struct ConversationsListView: View {
    @State private var conversations: [Conversation] = []
    @State private var selectedConversation: Conversation?
    @State private var searchText = ""

    private var filteredConversations: [Conversation] {
        if searchText.isEmpty {
            return conversations
        }
        return conversations.filter { conversation in
            (conversation.propertyTitle?.localizedCaseInsensitiveContains(searchText) ?? false) ||
            conversation.otherUserName.localizedCaseInsensitiveContains(searchText)
        }
    }

    private var unreadCount: Int {
        conversations.reduce(0) { $0 + $1.unreadCount }
    }

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.Colors.backgroundSecondary
                    .ignoresSafeArea()

                VStack(spacing: 0) {
                    // Search bar
                    SearchBar(
                        text: $searchText,
                        placeholder: "Rechercher une conversation...",
                        filterCount: 0,
                        onFilterTap: {}
                    )
                    .padding(.horizontal)
                    .padding(.vertical, 8)
                    .background(Theme.Colors.backgroundPrimary)

                    if conversations.isEmpty {
                        emptyState
                    } else {
                        conversationsList
                    }
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    HStack(spacing: 8) {
                        Text("Messages")
                            .font(Theme.Typography.title3())
                            .foregroundColor(Theme.Colors.textPrimary)

                        if unreadCount > 0 {
                            Text("\(unreadCount)")
                                .font(Theme.Typography.bodySmall(.bold))
                                .foregroundColor(.white)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Theme.Colors.error)
                                .cornerRadius(10)
                        }
                    }
                }
            }
            .sheet(item: $selectedConversation) { conversation in
                ConversationView(conversation: conversation)
            }
        }
        .onAppear {
            loadConversations()
        }
    }

    // MARK: - Conversations List

    private var conversationsList: some View {
        ScrollView {
            LazyVStack(spacing: 1) {
                ForEach(filteredConversations) { conversation in
                    ConversationRow(conversation: conversation) {
                        selectedConversation = conversation
                    }
                }
            }
        }
        .background(Theme.Colors.backgroundSecondary)
    }

    // MARK: - Empty State

    private var emptyState: some View {
        VStack(spacing: 24) {
            Spacer()

            Image.lucide("message-circle-off")
                .resizable()
                .scaledToFit()
                .frame(width: 100, height: 100)
                .foregroundColor(Theme.Colors.gray300)

            VStack(spacing: 12) {
                Text("Aucune conversation")
                    .font(Theme.Typography.title2())
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Vos conversations avec vos matchs\napparaîtront ici")
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
                    .multilineTextAlignment(.center)
            }

            PrimaryButton(
                title: "Découvrir des logements",
                icon: "search",
                action: {
                    // Navigate to swipe view
                }
            )
            .frame(maxWidth: 300)

            Spacer()
        }
        .padding(40)
    }

    // MARK: - Data Loading

    private func loadConversations() {
        // Use mock data
        conversations = Conversation.mockConversations
    }
}

// MARK: - Conversation Row

struct ConversationRow: View {
    let conversation: Conversation
    let onTap: () -> Void

    var body: some View {
        Button(action: {
            Haptic.impact(.light)
            onTap()
        }) {
            HStack(spacing: 16) {
                // Property image
                AsyncImage(url: URL(string: conversation.propertyImageURL ?? "")) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Rectangle()
                        .fill(Theme.Colors.gray200)
                        .overlay(
                            ProgressView()
                        )
                }
                .frame(width: 70, height: 70)
                .clipShape(RoundedRectangle(cornerRadius: 12))

                // Conversation info
                VStack(alignment: .leading, spacing: 6) {
                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(conversation.propertyTitle ?? "Sans titre")
                                .font(Theme.Typography.body(.semibold))
                                .foregroundColor(Theme.Colors.textPrimary)
                                .lineLimit(1)

                            Text(conversation.otherUserName)
                                .font(Theme.Typography.bodySmall())
                                .foregroundColor(Theme.Colors.textSecondary)
                                .lineLimit(1)
                        }

                        Spacer()

                        VStack(alignment: .trailing, spacing: 4) {
                            if let lastMessage = conversation.lastMessage {
                                Text(lastMessage.timeAgo)
                                    .font(Theme.Typography.caption())
                                    .foregroundColor(Theme.Colors.textTertiary)
                            }

                            if conversation.unreadCount > 0 {
                                Text("\(conversation.unreadCount)")
                                    .font(.system(size: 11, weight: .bold))
                                    .foregroundColor(.white)
                                    .frame(minWidth: 20, minHeight: 20)
                                    .padding(.horizontal, 6)
                                    .background(Theme.Colors.primary)
                                    .clipShape(Circle())
                            }
                        }
                    }

                    // Last message
                    if let lastMessage = conversation.lastMessage {
                        HStack(spacing: 4) {
                            if lastMessage.isSentByCurrentUser {
                                Image.lucide(lastMessage.isRead ? "check-check" : "check")
                                    .resizable()
                                    .scaledToFit()
                                    .frame(width: 14, height: 14)
                                    .foregroundColor(lastMessage.isRead ? Theme.Colors.primary : Theme.Colors.textTertiary)
                            }

                            Text(lastMessage.content)
                                .font(Theme.Typography.bodySmall())
                                .foregroundColor(conversation.unreadCount > 0 ? Theme.Colors.textPrimary : Theme.Colors.textSecondary)
                                .fontWeight(conversation.unreadCount > 0 ? .semibold : .regular)
                                .lineLimit(1)
                        }
                    }
                }
            }
            .padding(16)
            .background(Theme.Colors.backgroundPrimary)
            .contentShape(Rectangle())
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Preview

struct ConversationsListView_Previews: PreviewProvider {
    static var previews: some View {
        ConversationsListView()
    }
}
