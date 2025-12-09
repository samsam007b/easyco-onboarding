//
//  AuthService.swift
//  IzzIco
//

import Foundation
import Combine

@MainActor
class AuthService: ObservableObject {
    static let shared = AuthService()

    @Published var isAuthenticated = false
    @Published var currentUser: User?

    private init() {}

    // TODO: Implement authentication methods
}
