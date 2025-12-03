//
//  PaymentMethod.swift
//  EasyCo
//

import Foundation

struct PaymentMethod: Identifiable, Codable {
    let id: String
    let type: PaymentMethodType
    let last4: String?
    let expiryMonth: Int?
    let expiryYear: Int?
    let isDefault: Bool
}

enum PaymentMethodType: String, Codable {
    case card = "card"
    case bankAccount = "bank_account"
    case sepa = "sepa_debit"
}
