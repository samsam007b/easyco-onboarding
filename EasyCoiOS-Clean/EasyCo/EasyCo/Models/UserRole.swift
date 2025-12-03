//
//  UserRole.swift
//  EasyCo
//

import Foundation

enum UserRole: String, Codable {
    case searcher = "searcher"
    case owner = "owner"
    case resident = "resident"
    case admin = "admin"
}
