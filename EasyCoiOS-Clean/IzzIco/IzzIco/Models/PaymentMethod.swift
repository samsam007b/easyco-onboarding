//
//  PaymentMethod.swift
//  IzzIco
//

import Foundation

struct PaymentMethod: Identifiable, Codable {
    let id: String
    let type: PaymentMethodType
    let last4: String?
    let expiryMonth: Int?
    let expiryYear: Int?
    let isDefault: Bool

    var icon: String {
        switch type {
        case .card:
            return "creditcard"
        case .bankAccount:
            return "building.columns"
        case .sepa:
            return "banknote"
        }
    }
}

enum PaymentMethodType: String, Codable {
    case card = "card"
    case bankAccount = "bank_account"
    case sepa = "sepa_debit"

    var displayName: String {
        switch self {
        case .card:
            return "Carte bancaire"
        case .bankAccount:
            return "Compte bancaire"
        case .sepa:
            return "Prélèvement SEPA"
        }
    }
}
