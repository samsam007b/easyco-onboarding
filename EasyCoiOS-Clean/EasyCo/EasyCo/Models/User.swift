//
//  User.swift
//  EasyCo
//
//  Created by Claude on 11/11/2025.
//

import Foundation

struct User: Identifiable, Codable {
    let id: UUID
    var email: String
    var firstName: String?
    var lastName: String?
    var phoneNumber: String?
    var profileImageURL: String?
    var userType: UserType
    var onboardingCompleted: Bool
    var createdAt: Date
    var updatedAt: Date

    enum UserType: String, Codable {
        case searcher
        case owner
        case resident
    }

    init(id: UUID, email: String, firstName: String? = nil, lastName: String? = nil, phoneNumber: String? = nil, profileImageURL: String? = nil, userType: UserType, onboardingCompleted: Bool = false, createdAt: Date = Date(), updatedAt: Date = Date()) {
        self.id = id
        self.email = email
        self.firstName = firstName
        self.lastName = lastName
        self.phoneNumber = phoneNumber
        self.profileImageURL = profileImageURL
        self.userType = userType
        self.onboardingCompleted = onboardingCompleted
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
}

// MARK: - UserType Display Name Extension

extension User.UserType {
    var displayName: String {
        switch self {
        case .searcher: return "Chercheur"
        case .owner: return "Propriétaire"
        case .resident: return "Résident"
        }
    }
}

// MARK: - Global Type Alias for convenience
typealias UserType = User.UserType
