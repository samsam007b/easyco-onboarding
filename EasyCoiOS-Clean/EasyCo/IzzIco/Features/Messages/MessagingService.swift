//
//  MessagingService.swift
//  IzzIco
//
//  Service for messaging between residents/searchers and property owners
//  Role-based conversations
//

import Foundation

class MessagingService {

    private let supabaseURL: String
    private let supabaseKey: String

    init() {
        self.supabaseURL = AppConfig.supabaseURL
        self.supabaseKey = AppConfig.supabaseAnonKey
    }

    // MARK: - Fetch Conversations

    /// Fetch all conversations for a user based on their role
    func fetchConversations(userId: String, userType: String, accessToken: String) async throws -> [ConversationResponse] {
        let url = URL(string: "\(supabaseURL)/rest/v1/conversations")!
        var components = URLComponents(url: url, resolvingAgainstBaseURL: false)!

        // Filter based on user role
        let userFilter: String
        switch userType {
        case "resident", "searcher":
            // As tenant/searcher, see conversations where I'm the tenant
            userFilter = "tenant_id.eq.\(userId)"
        case "owner":
            // As owner, see conversations where I'm the owner
            userFilter = "owner_id.eq.\(userId)"
        default:
            userFilter = "or=(tenant_id.eq.\(userId),owner_id.eq.\(userId))"
        }

        components.queryItems = [
            URLQueryItem(name: userFilter, value: nil),
            URLQueryItem(name: "select", value: """
                id,
                property_id,
                tenant_id,
                owner_id,
                last_message,
                last_message_at,
                unread_count_tenant,
                unread_count_owner,
                created_at,
                property:properties(id,title,address,main_image),
                tenant:profiles!tenant_id(id,first_name,last_name,avatar_url),
                owner:profiles!owner_id(id,first_name,last_name,avatar_url)
            """),
            URLQueryItem(name: "order", value: "last_message_at.desc.nullslast,created_at.desc")
        ]

        var request = URLRequest(url: components.url!)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")

        print("💬 Fetching conversations for user: \(userId) (role: \(userType))")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 200 {
            print("❌ Conversations fetch failed: \(httpResponse.statusCode)")
            if let responseStr = String(data: data, encoding: .utf8) {
                print("Response: \(responseStr.prefix(500))")
            }
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        let decoder = JSONDecoder()
        let conversations = try decoder.decode([ConversationResponse].self, from: data)
        print("✅ Loaded \(conversations.count) conversations")

        return conversations
    }

    // MARK: - Fetch Messages

    /// Fetch all messages for a conversation
    func fetchMessages(conversationId: String, accessToken: String) async throws -> [MessageResponse] {
        let url = URL(string: "\(supabaseURL)/rest/v1/messages")!
        var components = URLComponents(url: url, resolvingAgainstBaseURL: false)!

        components.queryItems = [
            URLQueryItem(name: "conversation_id", value: "eq.\(conversationId)"),
            URLQueryItem(name: "select", value: "id,conversation_id,sender_id,content,created_at,read_at,sender:profiles!sender_id(id,first_name,last_name,avatar_url)"),
            URLQueryItem(name: "order", value: "created_at.asc")
        ]

        var request = URLRequest(url: components.url!)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")

        print("💬 Fetching messages for conversation: \(conversationId)")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 200 {
            print("❌ Messages fetch failed: \(httpResponse.statusCode)")
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        let decoder = JSONDecoder()
        let messages = try decoder.decode([MessageResponse].self, from: data)
        print("✅ Loaded \(messages.count) messages")

        return messages
    }

    // MARK: - Send Message

    /// Send a message in a conversation
    func sendMessage(conversationId: String, senderId: String, content: String, accessToken: String) async throws -> MessageResponse {
        let url = URL(string: "\(supabaseURL)/rest/v1/messages")!

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("return=representation", forHTTPHeaderField: "Prefer")

        let body: [String: Any] = [
            "conversation_id": conversationId,
            "sender_id": senderId,
            "content": content
        ]

        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        print("💬 Sending message in conversation: \(conversationId)")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 201 {
            print("❌ Message send failed: \(httpResponse.statusCode)")
            if let responseStr = String(data: data, encoding: .utf8) {
                print("Response: \(responseStr.prefix(500))")
            }
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        let decoder = JSONDecoder()
        let message = try decoder.decode([MessageResponse].self, from: data).first!
        print("✅ Message sent")

        return message
    }

    // MARK: - Create Conversation

    /// Create a new conversation between tenant and owner about a property
    func createConversation(
        propertyId: String,
        tenantId: String,
        ownerId: String,
        accessToken: String
    ) async throws -> ConversationResponse {
        let url = URL(string: "\(supabaseURL)/rest/v1/conversations")!

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("return=representation", forHTTPHeaderField: "Prefer")

        let body: [String: Any] = [
            "property_id": propertyId,
            "tenant_id": tenantId,
            "owner_id": ownerId
        ]

        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        print("💬 Creating conversation: tenant \(tenantId) → owner \(ownerId) about property \(propertyId)")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 201 {
            print("❌ Conversation creation failed: \(httpResponse.statusCode)")
            if let responseStr = String(data: data, encoding: .utf8) {
                print("Response: \(responseStr.prefix(500))")
            }
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        let decoder = JSONDecoder()
        let conversation = try decoder.decode([ConversationResponse].self, from: data).first!
        print("✅ Conversation created: \(conversation.id)")

        return conversation
    }

    // MARK: - Mark as Read

    /// Mark messages as read
    func markMessagesAsRead(conversationId: String, userId: String, accessToken: String) async throws {
        let url = URL(string: "\(supabaseURL)/rest/v1/messages")!
        var components = URLComponents(url: url, resolvingAgainstBaseURL: false)!

        components.queryItems = [
            URLQueryItem(name: "conversation_id", value: "eq.\(conversationId)"),
            URLQueryItem(name: "sender_id", value: "neq.\(userId)"), // Not sent by me
            URLQueryItem(name: "read_at", value: "is.null") // Not yet read
        ]

        var request = URLRequest(url: components.url!)
        request.httpMethod = "PATCH"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")

        let body: [String: Any] = [
            "read_at": ISO8601DateFormatter().string(from: Date())
        ]

        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        print("💬 Marking messages as read in conversation: \(conversationId)")

        let (_, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 204 && httpResponse.statusCode != 200 {
            print("❌ Mark as read failed: \(httpResponse.statusCode)")
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: nil)
        }

        print("✅ Messages marked as read")
    }
}

// MARK: - Response Models

struct ConversationResponse: Codable, Identifiable {
    let id: String
    let propertyId: String
    let tenantId: String
    let ownerId: String
    let lastMessage: String?
    let lastMessageAt: String?
    let unreadCountTenant: Int?
    let unreadCountOwner: Int?
    let createdAt: String
    let property: PropertyEmbedded?
    let tenant: ProfileEmbedded?
    let owner: ProfileEmbedded?

    enum CodingKeys: String, CodingKey {
        case id
        case propertyId = "property_id"
        case tenantId = "tenant_id"
        case ownerId = "owner_id"
        case lastMessage = "last_message"
        case lastMessageAt = "last_message_at"
        case unreadCountTenant = "unread_count_tenant"
        case unreadCountOwner = "unread_count_owner"
        case createdAt = "created_at"
        case property, tenant, owner
    }

    struct PropertyEmbedded: Codable {
        let id: String
        let title: String
        let address: String
        let mainImage: String?

        enum CodingKeys: String, CodingKey {
            case id, title, address
            case mainImage = "main_image"
        }
    }

    struct ProfileEmbedded: Codable {
        let id: String
        let firstName: String?
        let lastName: String?
        let avatarUrl: String?

        enum CodingKeys: String, CodingKey {
            case id
            case firstName = "first_name"
            case lastName = "last_name"
            case avatarUrl = "avatar_url"
        }

        var fullName: String {
            [firstName, lastName].compactMap { $0 }.joined(separator: " ")
        }
    }

    var parsedLastMessageAt: Date? {
        guard let lastMessageAt = lastMessageAt else { return nil }
        return ISO8601DateFormatter().date(from: lastMessageAt)
    }
}

struct MessageResponse: Codable, Identifiable {
    let id: String
    let conversationId: String
    let senderId: String
    let content: String
    let createdAt: String
    let readAt: String?
    let sender: ConversationResponse.ProfileEmbedded?

    enum CodingKeys: String, CodingKey {
        case id
        case conversationId = "conversation_id"
        case senderId = "sender_id"
        case content
        case createdAt = "created_at"
        case readAt = "read_at"
        case sender
    }

    var parsedCreatedAt: Date? {
        return ISO8601DateFormatter().date(from: createdAt)
    }

    var isRead: Bool {
        return readAt != nil
    }
}
