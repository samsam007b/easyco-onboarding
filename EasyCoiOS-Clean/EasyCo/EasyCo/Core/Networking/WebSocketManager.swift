//
//  WebSocketManager.swift
//  EasyCo
//
//  WebSocket manager for real-time communication
//

import Foundation
import Combine

class WebSocketManager: NSObject, ObservableObject {
    static let shared = WebSocketManager()

    @Published var isConnected = false
    @Published var connectionState: ConnectionState = .disconnected

    private var webSocketTask: URLSessionWebSocketTask?
    private var session: URLSession!
    private var reconnectTimer: Timer?
    private var reconnectAttempts = 0
    private let maxReconnectAttempts = 5

    private let baseURL: String
    private var messageSubject = PassthroughSubject<WebSocketMessage, Never>()

    enum ConnectionState {
        case disconnected
        case connecting
        case connected
        case reconnecting(attempt: Int)
        case failed(Error)
    }

    var messagePublisher: AnyPublisher<WebSocketMessage, Never> {
        messageSubject.eraseToAnyPublisher()
    }

    private override init() {
        // TODO: Replace with your actual WebSocket URL
        self.baseURL = ProcessInfo.processInfo.environment["WS_BASE_URL"] ?? "wss://api.easyco.fr/ws"

        super.init()

        let config = URLSessionConfiguration.default
        config.waitsForConnectivity = true
        self.session = URLSession(configuration: config, delegate: self, delegateQueue: OperationQueue())
    }

    // MARK: - Connection

    func connect() {
        guard connectionState != .connected && connectionState != .connecting else {
            return
        }

        // Get auth token
        guard let token = NetworkManager.shared.authToken else {
            print("❌ WebSocket: No auth token available")
            return
        }

        connectionState = .connecting

        // Build URL with token
        var urlComponents = URLComponents(string: baseURL)
        urlComponents?.queryItems = [URLQueryItem(name: "token", value: token)]

        guard let url = urlComponents?.url else {
            print("❌ WebSocket: Invalid URL")
            return
        }

        print("🔌 WebSocket: Connecting to \(url.absoluteString)")

        webSocketTask = session.webSocketTask(with: url)
        webSocketTask?.resume()

        // Start receiving messages
        receiveMessage()

        // Send ping to keep connection alive
        schedulePing()
    }

    func disconnect() {
        print("🔌 WebSocket: Disconnecting")
        reconnectTimer?.invalidate()
        reconnectTimer = nil
        webSocketTask?.cancel(with: .goingAway, reason: nil)
        webSocketTask = nil
        connectionState = .disconnected
        isConnected = false
    }

    // MARK: - Send Message

    func send(_ message: WebSocketMessage) {
        guard let data = try? JSONEncoder().encode(message),
              let string = String(data: data, encoding: .utf8) else {
            print("❌ WebSocket: Failed to encode message")
            return
        }

        webSocketTask?.send(.string(string)) { error in
            if let error = error {
                print("❌ WebSocket: Send error - \(error)")
            }
        }
    }

    // MARK: - Receive Message

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
                print("❌ WebSocket: Receive error - \(error)")
                self.handleDisconnection(error: error)
            }
        }
    }

    private func handleMessage(_ text: String) {
        guard let data = text.data(using: .utf8),
              let message = try? JSONDecoder().decode(WebSocketMessage.self, from: data) else {
            print("❌ WebSocket: Failed to decode message")
            return
        }

        print("📩 WebSocket: Received message - \(message.type)")

        // Publish to subscribers
        DispatchQueue.main.async {
            self.messageSubject.send(message)
        }
    }

    // MARK: - Ping/Pong

    private func schedulePing() {
        // Send ping every 30 seconds
        reconnectTimer = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) { [weak self] _ in
            self?.ping()
        }
    }

    private func ping() {
        webSocketTask?.sendPing { [weak self] error in
            if let error = error {
                print("❌ WebSocket: Ping error - \(error)")
                self?.handleDisconnection(error: error)
            }
        }
    }

    // MARK: - Reconnection

    private func handleDisconnection(error: Error) {
        DispatchQueue.main.async {
            self.isConnected = false

            if self.reconnectAttempts < self.maxReconnectAttempts {
                self.reconnectAttempts += 1
                self.connectionState = .reconnecting(attempt: self.reconnectAttempts)

                let delay = TimeInterval(min(pow(2.0, Double(self.reconnectAttempts)), 60))
                print("🔄 WebSocket: Reconnecting in \(delay)s (attempt \(self.reconnectAttempts)/\(self.maxReconnectAttempts))")

                DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
                    self.connect()
                }
            } else {
                print("❌ WebSocket: Max reconnect attempts reached")
                self.connectionState = .failed(error)
            }
        }
    }

    func resetReconnectAttempts() {
        reconnectAttempts = 0
    }
}

// MARK: - URLSessionWebSocketDelegate

extension WebSocketManager: URLSessionWebSocketDelegate {
    func urlSession(_ session: URLSession, webSocketTask: URLSessionWebSocketTask, didOpenWithProtocol protocol: String?) {
        print("✅ WebSocket: Connected")
        DispatchQueue.main.async {
            self.isConnected = true
            self.connectionState = .connected
            self.reconnectAttempts = 0
        }
    }

    func urlSession(_ session: URLSession, webSocketTask: URLSessionWebSocketTask, didCloseWith closeCode: URLSessionWebSocketTask.CloseCode, reason: Data?) {
        print("🔌 WebSocket: Closed with code \(closeCode)")

        let reasonString = reason.flatMap { String(data: $0, encoding: .utf8) } ?? "Unknown"
        print("Reason: \(reasonString)")

        DispatchQueue.main.async {
            self.isConnected = false
            self.connectionState = .disconnected
        }
    }
}

// MARK: - WebSocket Message

struct WebSocketMessage: Codable {
    let type: MessageType
    let data: MessageData?

    enum MessageType: String, Codable {
        case message = "MESSAGE"
        case messageRead = "MESSAGE_READ"
        case typing = "TYPING"
        case userOnline = "USER_ONLINE"
        case userOffline = "USER_OFFLINE"
        case matchCreated = "MATCH_CREATED"
        case applicationUpdate = "APPLICATION_UPDATE"
        case visitUpdate = "VISIT_UPDATE"
        case ping = "PING"
        case pong = "PONG"
    }

    struct MessageData: Codable {
        let conversationId: String?
        let message: Message?
        let userId: String?
        let isTyping: Bool?
        let match: Match?
        let applicationId: String?
        let visitId: String?
    }
}

// MARK: - WebSocket Events

extension WebSocketManager {
    func subscribeToMessages(conversationId: String) {
        let message = WebSocketMessage(
            type: .message,
            data: WebSocketMessage.MessageData(
                conversationId: conversationId,
                message: nil,
                userId: nil,
                isTyping: nil,
                match: nil,
                applicationId: nil,
                visitId: nil
            )
        )
        send(message)
    }

    func sendTypingIndicator(conversationId: String, isTyping: Bool) {
        let message = WebSocketMessage(
            type: .typing,
            data: WebSocketMessage.MessageData(
                conversationId: conversationId,
                message: nil,
                userId: nil,
                isTyping: isTyping,
                match: nil,
                applicationId: nil,
                visitId: nil
            )
        )
        send(message)
    }
}
