//
//  WebSocketManager.swift
//  EasyCo
//

import Foundation
import Combine

@MainActor
class WebSocketManager: ObservableObject {
    static let shared = WebSocketManager()

    @Published var isConnected = false

    private init() {}

    // TODO: Implement WebSocket connection methods
}
