//
//  OwnerMessagesListView.swift
//  IzzIco
//
//  Messages list view for Owner with Candidates/Tenants tabs
//

import SwiftUI

struct OwnerMessagesListView: View {
    @State private var selectedTab: MessageTab = .candidates
    @State private var conversations: [OwnerConversation] = []
    @State private var searchText = ""
    @State private var isLoading = false

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Tabs
                tabsSection

                // Search bar
                searchBar

                // Conversations list
                if isLoading {
                    LoadingView(message: "Chargement des messages...")
                } else if filteredConversations.isEmpty {
                    emptyStateView
                } else {
                    conversationsList
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Messages")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {}) {
                        Image(systemName: "square.and.pencil")
                            .foregroundColor(Color(hex: "6E56CF"))
                    }
                }
            }
        }
        .task {
            await loadConversations()
        }
    }

    // MARK: - Tabs Section

    private var tabsSection: some View {
        HStack(spacing: 0) {
            ForEach(MessageTab.allCases, id: \.self) { tab in
                TabButton(
                    title: tab.displayName,
                    count: countFor(tab),
                    isSelected: selectedTab == tab,
                    action: { selectedTab = tab }
                )
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color.white)
        .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)
    }

    // MARK: - Search Bar

    private var searchBar: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(Color(hex: "9CA3AF"))

            TextField("Rechercher une conversation...", text: $searchText)
                .font(.system(size: 16))

            if !searchText.isEmpty {
                Button(action: { searchText = "" }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(Color(hex: "9CA3AF"))
                }
            }
        }
        .padding(12)
        .background(Color.white)
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
        )
        .padding(16)
    }

    // MARK: - Conversations List

    private var conversationsList: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                ForEach(filteredConversations) { conversation in
                    NavigationLink(destination: OwnerChatView(conversation: conversation)) {
                        OwnerConversationRow(conversation: conversation)
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
            .padding(16)
        }
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 24) {
            Spacer()

            ZStack {
                Circle()
                    .fill(Color(hex: "F3F0FF"))
                    .frame(width: 120, height: 120)

                Image(systemName: selectedTab == .candidates ? "doc.text" : "house")
                    .font(.system(size: 48))
                    .foregroundColor(Color(hex: "6E56CF"))
            }

            VStack(spacing: 12) {
                Text("Aucune conversation")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text(selectedTab == .candidates
                    ? "Les conversations avec les candidats apparaîtront ici"
                    : "Les conversations avec les locataires apparaîtront ici")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Filtered Conversations

    private var filteredConversations: [OwnerConversation] {
        var result = conversations

        // Filter by tab
        switch selectedTab {
        case .candidates:
            result = result.filter { $0.type == .candidate }
        case .tenants:
            result = result.filter { $0.type == .tenant }
        }

        // Filter by search
        if !searchText.isEmpty {
            result = result.filter { conversation in
                conversation.recipientName.localizedCaseInsensitiveContains(searchText) ||
                conversation.context.localizedCaseInsensitiveContains(searchText) ||
                conversation.lastMessage.localizedCaseInsensitiveContains(searchText)
            }
        }

        // Sort by last message time
        return result.sorted { $0.lastMessageTime > $1.lastMessageTime }
    }

    private func countFor(_ tab: MessageTab) -> Int {
        switch tab {
        case .candidates:
            return conversations.filter { $0.type == .candidate }.reduce(0) { $0 + $1.unreadCount }
        case .tenants:
            return conversations.filter { $0.type == .tenant }.reduce(0) { $0 + $1.unreadCount }
        }
    }

    // MARK: - Data Methods

    private func loadConversations() async {
        isLoading = true

        // Demo mode
        if AppConfig.FeatureFlags.demoMode {
            try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
            conversations = OwnerConversation.mockConversations + [
                OwnerConversation(
                    id: UUID(),
                    recipientId: "user-3",
                    recipientName: "Lucas Bernard",
                    recipientAvatar: nil,
                    lastMessage: "Quand puis-je emménager ?",
                    lastMessageTime: Date().addingTimeInterval(-172800),
                    unreadCount: 1,
                    isOnline: false,
                    type: .candidate,
                    context: "Candidature pour Colocation - Schaerbeek"
                ),
                OwnerConversation(
                    id: UUID(),
                    recipientId: "user-4",
                    recipientName: "Marie Laurent",
                    recipientAvatar: nil,
                    lastMessage: "Merci pour votre réponse",
                    lastMessageTime: Date().addingTimeInterval(-259200),
                    unreadCount: 0,
                    isOnline: true,
                    type: .tenant,
                    context: "Locataire - Studio meublé Ixelles"
                )
            ]
        }

        isLoading = false
    }
}

// MARK: - Message Tab

enum MessageTab: CaseIterable {
    case candidates
    case tenants

    var displayName: String {
        switch self {
        case .candidates: return "Candidats"
        case .tenants: return "Locataires"
        }
    }
}

// MARK: - Tab Button

struct TabButton: View {
    let title: String
    let count: Int
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                HStack(spacing: 6) {
                    Text(title)
                        .font(.system(size: 15, weight: isSelected ? .semibold : .medium))

                    if count > 0 {
                        Text("\(count)")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color(hex: "EF4444"))
                            .cornerRadius(10)
                    }
                }
                .foregroundColor(isSelected ? Color(hex: "6E56CF") : Color(hex: "6B7280"))

                Rectangle()
                    .fill(isSelected ? Color(hex: "6E56CF") : Color.clear)
                    .frame(height: 2)
            }
        }
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Conversation Row

struct OwnerConversationRow: View {
    let conversation: OwnerConversation

    var body: some View {
        HStack(spacing: 12) {
            // Avatar
            ZStack(alignment: .bottomTrailing) {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color(hex: "6E56CF"), Color(hex: "8B5CF6")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 56, height: 56)
                    .overlay(
                        Text(String(conversation.recipientName.prefix(1)))
                            .font(.system(size: 22, weight: .bold))
                            .foregroundColor(.white)
                    )

                if conversation.isOnline {
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
            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Text(conversation.recipientName)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    Spacer()

                    Text(conversation.lastMessageTime.timeAgo)
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "9CA3AF"))
                }

                // Context badge
                HStack(spacing: 6) {
                    Image(systemName: conversation.contextIcon)
                        .font(.system(size: 10))

                    Text(conversation.context)
                        .font(.system(size: 11, weight: .medium))
                        .lineLimit(1)
                }
                .foregroundColor(
                    conversation.type == .candidate
                        ? Color(hex: "6E56CF")
                        : Color(hex: "10B981")
                )
                .padding(.horizontal, 8)
                .padding(.vertical, 3)
                .background(
                    conversation.type == .candidate
                        ? Color(hex: "F3F0FF")
                        : Color(hex: "ECFDF5")
                )
                .cornerRadius(8)

                // Last message
                HStack {
                    Text(conversation.lastMessage)
                        .font(.system(size: 14))
                        .foregroundColor(
                            conversation.unreadCount > 0
                                ? Color(hex: "111827")
                                : Color(hex: "6B7280")
                        )
                        .fontWeight(conversation.unreadCount > 0 ? .medium : .regular)
                        .lineLimit(1)

                    Spacer()

                    if conversation.unreadCount > 0 {
                        Text("\(conversation.unreadCount)")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 7)
                            .padding(.vertical, 3)
                            .background(Color(hex: "6E56CF"))
                            .cornerRadius(10)
                    }
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}
