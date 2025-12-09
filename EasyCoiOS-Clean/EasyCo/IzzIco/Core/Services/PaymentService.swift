//
//  PaymentService.swift
//  IzzIco
//

import Foundation
import Combine

@MainActor
class PaymentService: ObservableObject {
    static let shared = PaymentService()

    @Published var pendingPayments: [PendingPayment] = []
    @Published var paymentMethods: [PaymentMethod] = []
    @Published var transactions: [Transaction] = []
    @Published var isLoading = false

    private init() {}

    func payPendingPayment(_ payment: PendingPayment) async {
        // TODO: Implement payment logic
    }

    func fetchPaymentMethods() async {
        // TODO: Implement fetching payment methods
    }

    func fetchPendingPayments() async {
        // TODO: Implement fetching pending payments
    }

    func fetchTransactions() async {
        // TODO: Implement fetching transactions
    }

    func setDefaultPaymentMethod(id: String) async throws {
        // TODO: Implement setting default payment method
    }

    func removePaymentMethod(id: String) async throws {
        // TODO: Implement removing payment method
    }
}

// MARK: - Transaction Model
struct Transaction: Identifiable {
    let id: String
    let amount: Double
    let date: Date
    let description: String?
    let type: TransactionType
    let status: TransactionStatus

    var formattedAmount: String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "EUR"
        let prefix = type == .payment ? "-" : "+"
        let value = formatter.string(from: NSNumber(value: amount)) ?? "€\(amount)"
        return "\(prefix)\(value)"
    }

    enum TransactionType {
        case payment
        case refund
        case charge

        var displayName: String {
            switch self {
            case .payment: return "Paiement"
            case .refund: return "Remboursement"
            case .charge: return "Prélèvement"
            }
        }

        var icon: String {
            switch self {
            case .payment: return "arrow.down.circle.fill"
            case .refund: return "arrow.up.circle.fill"
            case .charge: return "creditcard.fill"
            }
        }
    }

    enum TransactionStatus {
        case completed
        case pending
        case failed
        case processing
        case cancelled
        case refunded

        var displayName: String {
            switch self {
            case .completed: return "Complété"
            case .pending: return "En attente"
            case .failed: return "Échoué"
            case .processing: return "En cours"
            case .cancelled: return "Annulé"
            case .refunded: return "Remboursé"
            }
        }
    }
}
