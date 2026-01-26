//
//  UserRole.swift
//  IzzIco
//

import Foundation
import SwiftUI

enum UserRole: String, Codable {
    case searcher = "searcher"
    case owner = "owner"
    case resident = "resident"
    case admin = "admin"

    // Computed properties for IzzicoWeb compatibility
    var gradient: LinearGradient {
        switch self {
        case .searcher:
            return LinearGradient(
                colors: [Color(hex: "ffa000"), Color(hex: "FBBF24")],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        case .owner:
            return LinearGradient(
                colors: [Color(hex: "9c5698"), Color(hex: "B070A8")],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        case .resident:
            return LinearGradient(
                colors: [Color(hex: "e05747"), Color(hex: "E96A50")],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        case .admin:
            return LinearGradient(
                colors: [Color(hex: "3B82F6"), Color(hex: "60A5FA")],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        }
    }

    var primaryColor: Color {
        switch self {
        case .searcher: return Color(hex: "ffa000")
        case .owner: return Color(hex: "9c5698")
        case .resident: return Color(hex: "e05747")
        case .admin: return Color(hex: "3B82F6")
        }
    }
}
