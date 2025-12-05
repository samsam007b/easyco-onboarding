//
//  ConversationsViewModel.swift
//  EasyCo
//
//  ViewModel for conversations list with role-based filtering
//

import Foundation
import SwiftUI

@MainActor
class ConversationsViewModel: ObservableObject {
    @Published var conversations: [Conversation] = []
    @Published var isLoading = false
    @Published var error: AppError?

    private let service = MessagingService()
    private var currentUserId: String?
    private var currentUserType: String?

    func loadConversations() async {
        isLoading = true
        error = nil

        do {
            // Get current user
            guard let user = AuthManager.shared.currentUser else {
                print("⚠️ No user logged in")
                loadMockConversations()
                isLoading = false
                return
            }

            // Get access token
            guard let accessToken = EasyCoKeychainManager.shared.getAuthToken() else {
                print("⚠️ No access token found")
                loadMockConversations()
                isLoading = false
                return
            }

            currentUserId = user.id.uuidString
            currentUserType = user.userType

            // Fetch conversations from Supabase
            let conversationsResponse = try await service.fetchConversations(
                userId: user.id.uuidString,
                userType: user.userType ?? "resident",
                accessToken: accessToken
            )

            // Convert to Conversation model
            conversations = conversationsResponse.map { conv in
                // Determine who the other person is based on role
                let otherPerson: ConversationResponse.ProfileEmbedded?
                let isOwner = user.userType == "owner"

                if isOwner {
                    // I'm the owner, show tenant
                    otherPerson = conv.tenant
                } else {
                    // I'm tenant/searcher, show owner
                    otherPerson = conv.owner
                }

                // Determine unread count
                let unreadCount: Int
                if isOwner {
                    unreadCount = conv.unreadCountOwner ?? 0
                } else {
                    unreadCount = conv.unreadCountTenant ?? 0
                }

                return Conversation(
                    id: conv.id,
                    propertyId: conv.propertyId,
                    propertyTitle: conv.property?.title ?? "Propriété",
                    propertyAddress: conv.property?.address ?? "",
                    propertyImage: conv.property?.mainImage,
                    otherPersonName: otherPerson?.fullName ?? "Utilisateur",
                    otherPersonAvatar: otherPerson?.avatarUrl,
                    lastMessage: conv.lastMessage ?? "Commencer la conversation",
                    lastMessageDate: conv.parsedLastMessageAt ?? Date(),
                    unreadCount: unreadCount,
                    isOwnerConversation: isOwner
                )
            }

            isLoading = false
            print("✅ Conversations loaded from Supabase")

        } catch {
            print("❌ Error loading conversations: \(error.localizedDescription)")
            self.error = AppError.unknown(error)
            loadMockConversations()
            isLoading = false
        }
    }

    private func loadMockConversations() {
        // Fallback mock data
        conversations = [
            Conversation(
                id: "1",
                propertyId: "prop1",
                propertyTitle: "Appartement 2 chambres - Ixelles",
                propertyAddress: "Rue de la Paix 42, 1050 Ixelles",
                propertyImage: nil,
                otherPersonName: "Jean Dupont",
                otherPersonAvatar: nil,
                lastMessage: "Bonjour, est-ce que la propriété est toujours disponible ?",
                lastMessageDate: Date().addingTimeInterval(-3600),
                unreadCount: 2,
                isOwnerConversation: false
            ),
            Conversation(
                id: "2",
                propertyId: "prop2",
                propertyTitle: "Studio meublé - Centre",
                propertyAddress: "Avenue Louise 123, 1050 Bruxelles",
                propertyImage: nil,
                otherPersonName: "Marie Martin",
                otherPersonAvatar: nil,
                lastMessage: "Merci pour les informations !",
                lastMessageDate: Date().addingTimeInterval(-86400),
                unreadCount: 0,
                isOwnerConversation: false
            )
        ]
    }
}

// MARK: - Model

struct Conversation: Identifiable {
    let id: String
    let propertyId: String
    let propertyTitle: String
    let propertyAddress: String
    let propertyImage: String?
    let otherPersonName: String
    let otherPersonAvatar: String?
    let lastMessage: String
    let lastMessageDate: Date
    let unreadCount: Int
    let isOwnerConversation: Bool

    var timeAgo: String {
        let interval = Date().timeIntervalSince(lastMessageDate)
        let minutes = Int(interval / 60)
        let hours = Int(interval / 3600)
        let days = Int(interval / 86400)

        if minutes < 60 {
            return "\(minutes)m"
        } else if hours < 24 {
            return "\(hours)h"
        } else if days < 7 {
            return "\(days)j"
        } else {
            let formatter = DateFormatter()
            formatter.dateFormat = "dd/MM"
            return formatter.string(from: lastMessageDate)
        }
    }

    var hasUnread: Bool {
        unreadCount > 0
    }
}
