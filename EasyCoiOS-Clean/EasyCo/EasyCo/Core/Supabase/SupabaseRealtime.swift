import Foundation

// MARK: - Supabase Realtime Client

/// Realtime client for Supabase subscriptions via WebSocket
@MainActor
class SupabaseRealtime: NSObject {
    static let shared = SupabaseRealtime()

    private var webSocketTask: URLSessionWebSocketTask?
    private var isConnected = false
    private var subscriptions: [String: RealtimeSubscription] = [:]
    private var heartbeatTimer: Timer?

    private let supabaseURL: String
    private let supabaseKey: String

    private override init() {
        self.supabaseURL = AppConfig.supabaseURL
        self.supabaseKey = AppConfig.supabaseAnonKey
        super.init()
    }

    // MARK: - Connection

    /// Connect to Realtime server
    func connect() {
        guard !isConnected else { return }

        let realtimeURL = supabaseURL
            .replacingOccurrences(of: "https://", with: "wss://")
            .replacingOccurrences(of: "http://", with: "ws://")

        var urlComponents = URLComponents(string: "\(realtimeURL)/realtime/v1/websocket")!
        urlComponents.queryItems = [
            URLQueryItem(name: "apikey", value: supabaseKey),
            URLQueryItem(name: "vsn", value: "1.0.0")
        ]

        guard let url = urlComponents.url else { return }

        let session = URLSession(configuration: .default, delegate: self, delegateQueue: nil)
        webSocketTask = session.webSocketTask(with: url)
        webSocketTask?.resume()

        isConnected = true
        receiveMessage()
        startHeartbeat()

        print("🔌 Connected to Supabase Realtime")
    }

    /// Disconnect from Realtime server
    func disconnect() {
        webSocketTask?.cancel(with: .goingAway, reason: nil)
        webSocketTask = nil
        isConnected = false
        heartbeatTimer?.invalidate()
        heartbeatTimer = nil

        print("🔌 Disconnected from Supabase Realtime")
    }

    // MARK: - Subscriptions

    /// Subscribe to table changes
    func subscribe<T: Decodable>(
        table: String,
        event: RealtimeEvent = .all,
        filter: String? = nil,
        callback: @escaping (RealtimePayload<T>) -> Void
    ) -> String {
        let subscriptionId = UUID().uuidString
        let topic = buildTopic(table: table, filter: filter)

        let subscription = RealtimeSubscription(
            id: subscriptionId,
            table: table,
            event: event,
            filter: filter,
            callback: { payload in
                if let typedPayload = payload as? RealtimePayload<T> {
                    callback(typedPayload)
                }
            }
        )

        subscriptions[subscriptionId] = subscription

        // Send join message
        let joinMessage: [String: Any] = [
            "topic": topic,
            "event": "phx_join",
            "payload": [:],
            "ref": subscriptionId
        ]

        sendMessage(joinMessage)

        print("📡 Subscribed to \(table) with ID: \(subscriptionId)")

        return subscriptionId
    }

    /// Unsubscribe from updates
    func unsubscribe(_ subscriptionId: String) {
        guard let subscription = subscriptions[subscriptionId] else { return }

        let topic = buildTopic(table: subscription.table, filter: subscription.filter)

        let leaveMessage: [String: Any] = [
            "topic": topic,
            "event": "phx_leave",
            "payload": [:],
            "ref": subscriptionId
        ]

        sendMessage(leaveMessage)
        subscriptions.removeValue(forKey: subscriptionId)

        print("📡 Unsubscribed from ID: \(subscriptionId)")
    }

    /// Unsubscribe from all
    func unsubscribeAll() {
        for subscriptionId in subscriptions.keys {
            unsubscribe(subscriptionId)
        }
    }

    // MARK: - Messaging

    private func sendMessage(_ message: [String: Any]) {
        guard let data = try? JSONSerialization.data(withJSONObject: message),
              let string = String(data: data, encoding: .utf8) else { return }

        let message = URLSessionWebSocketTask.Message.string(string)
        webSocketTask?.send(message) { error in
            if let error = error {
                print("❌ WebSocket send error: \(error)")
            }
        }
    }

    private func receiveMessage() {
        webSocketTask?.receive { [weak self] result in
            guard let self = self else { return }

            switch result {
            case .success(let message):
                switch message {
                case .string(let text):
                    self.handleMessage(text)
                case .data(let data):
                    if let text = String(data: data, encoding: .utf8) {
                        self.handleMessage(text)
                    }
                @unknown default:
                    break
                }

                // Continue receiving
                self.receiveMessage()

            case .failure(let error):
                print("❌ WebSocket receive error: \(error)")
                self.isConnected = false
            }
        }
    }

    private func handleMessage(_ text: String) {
        guard let data = text.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let event = json["event"] as? String else { return }

        // Handle different event types
        switch event {
        case "phx_reply":
            // Subscription acknowledgment
            print("✅ Subscription acknowledged")

        case "postgres_changes":
            // Database change event
            handlePostgresChange(json)

        default:
            break
        }
    }

    private func handlePostgresChange(_ json: [String: Any]) {
        guard let payload = json["payload"] as? [String: Any],
              let data = payload["data"] as? [String: Any],
              let eventType = data["type"] as? String else { return }

        let event: RealtimeEvent
        switch eventType {
        case "INSERT":
            event = .insert
        case "UPDATE":
            event = .update
        case "DELETE":
            event = .delete
        default:
            return
        }

        // Notify subscribers
        for subscription in subscriptions.values {
            if subscription.event == .all || subscription.event == event {
                // TODO: Re-enable when AnyCodable dependency is added
                // let realtimePayload = RealtimePayload<AnyCodable>(
                //     event: event,
                //     old: nil,
                //     new: data["record"] as? [String: Any],
                //     eventTime: Date()
                // )
                let realtimePayload = RealtimePayload<[String: Any]>(
                    event: event,
                    old: nil,
                    new: data["record"] as? [String: Any],
                    eventTime: Date()
                )

                Task { @MainActor in
                    subscription.callback(realtimePayload)
                }
            }
        }
    }

    // MARK: - Heartbeat

    private func startHeartbeat() {
        heartbeatTimer = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) { [weak self] _ in
            self?.sendHeartbeat()
        }
    }

    private func sendHeartbeat() {
        let heartbeatMessage: [String: Any] = [
            "topic": "phoenix",
            "event": "heartbeat",
            "payload": [:],
            "ref": UUID().uuidString
        ]

        sendMessage(heartbeatMessage)
    }

    // MARK: - Helpers

    private func buildTopic(table: String, filter: String?) -> String {
        var topic = "realtime:public:\(table)"
        if let filter = filter {
            topic += ":\(filter)"
        }
        return topic
    }
}

// MARK: - URLSessionWebSocketDelegate

extension SupabaseRealtime: URLSessionWebSocketDelegate {
    nonisolated func urlSession(
        _ session: URLSession,
        webSocketTask: URLSessionWebSocketTask,
        didOpenWithProtocol protocol: String?
    ) {
        print("🔌 WebSocket opened")
    }

    nonisolated func urlSession(
        _ session: URLSession,
        webSocketTask: URLSessionWebSocketTask,
        didCloseWith closeCode: URLSessionWebSocketTask.CloseCode,
        reason: Data?
    ) {
        print("🔌 WebSocket closed: \(closeCode)")
    }
}

// MARK: - Realtime Models

enum RealtimeEvent {
    case all
    case insert
    case update
    case delete
}

struct RealtimePayload<T: Decodable> {
    let event: RealtimeEvent
    let old: T?
    let new: T?
    let eventTime: Date

    init(event: RealtimeEvent, old: [String: Any]?, new: [String: Any]?, eventTime: Date) {
        self.event = event
        self.eventTime = eventTime

        // Decode old and new records
        if let old = old,
           let data = try? JSONSerialization.data(withJSONObject: old),
           let decoded = try? JSONDecoder().decode(T.self, from: data) {
            self.old = decoded
        } else {
            self.old = nil
        }

        if let new = new,
           let data = try? JSONSerialization.data(withJSONObject: new),
           let decoded = try? JSONDecoder().decode(T.self, from: data) {
            self.new = decoded
        } else {
            self.new = nil
        }
    }
}

struct RealtimeSubscription {
    let id: String
    let table: String
    let event: RealtimeEvent
    let filter: String?
    let callback: (Any) -> Void
}
