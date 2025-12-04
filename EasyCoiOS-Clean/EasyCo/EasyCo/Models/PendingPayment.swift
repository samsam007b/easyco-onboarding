//
//  PendingPayment.swift
//  EasyCo
//

import Foundation

struct PendingPayment: Identifiable, Codable {
    let id: String
    let amount: Double
    let dueDate: Date
    let description: String
    let status: PaymentStatus

    enum PaymentStatus: String, Codable {
        case pending = "pending"
        case overdue = "overdue"
        case paid = "paid"
    }

    var isOverdue: Bool {
        return status == .overdue
    }
}
