//
//  PendingPayment.swift
//  IzzIco
//

import Foundation

struct PendingPayment: Identifiable, Codable {
    let id: String
    let amount: Double
    let dueDate: Date
    let description: String
    let status: PaymentStatus
    var propertyTitle: String?
    var type: PaymentType

    enum PaymentStatus: String, Codable {
        case pending = "pending"
        case overdue = "overdue"
        case paid = "paid"
    }

    enum PaymentType: String, Codable {
        case rent
        case deposit
        case fee
        case utility

        var icon: String {
            switch self {
            case .rent: return "house.fill"
            case .deposit: return "banknote"
            case .fee: return "doc.text.fill"
            case .utility: return "bolt.fill"
            }
        }
    }

    var isOverdue: Bool {
        return status == .overdue
    }

    var formattedAmount: String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "EUR"
        return formatter.string(from: NSNumber(value: amount)) ?? "€\(amount)"
    }
}
