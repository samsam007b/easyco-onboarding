//
//  PaymentService.swift
//  EasyCo
//
//  Handles all payment-related operations with Stripe
//

import Foundation

// MARK: - Payment Service

@MainActor
class PaymentService: ObservableObject {
    static let shared = PaymentService()

    @Published var paymentMethods: [PaymentMethod] = []
    @Published var transactions: [Transaction] = []
    @Published var pendingPayments: [PendingPayment] = []
    @Published var isLoading = false
    @Published var error: NetworkError?

    private let apiClient = APIClient.shared

    private init() {}

    // MARK: - Payment Methods

    /// Fetch all payment methods for current user
    func fetchPaymentMethods() async {
        isLoading = true
        error = nil

        do {
            let methods: [PaymentMethod] = try await apiClient.request(.getPaymentMethods)
            self.paymentMethods = methods
        } catch let networkError as NetworkError {
            self.error = networkError
            // Load mock data in demo mode
            if AppConfig.FeatureFlags.demoMode {
                self.paymentMethods = PaymentMethod.mockMethods
            }
        } catch {
            self.error = .unknown(error)
        }

        isLoading = false
    }

    /// Add a new payment method
    func addPaymentMethod(type: PaymentMethodType, details: PaymentMethodDetails) async throws -> PaymentMethod {
        isLoading = true
        error = nil

        do {
            let body: [String: Any] = [
                "type": type.rawValue,
                "details": details.toDictionary()
            ]
            let method: PaymentMethod = try await apiClient.request(.addPaymentMethod(data: body))
            paymentMethods.append(method)
            isLoading = false
            return method
        } catch let networkError as NetworkError {
            isLoading = false
            self.error = networkError
            throw networkError
        } catch {
            isLoading = false
            let networkError = NetworkError.unknown(error)
            self.error = networkError
            throw networkError
        }
    }

    /// Remove a payment method
    func removePaymentMethod(id: UUID) async throws {
        isLoading = true

        do {
            try await apiClient.request(.deletePaymentMethod(id: id))
            paymentMethods.removeAll { $0.id == id }
        } catch {
            self.error = error as? NetworkError ?? .unknown(error)
            throw error
        }

        isLoading = false
    }

    /// Set default payment method
    func setDefaultPaymentMethod(id: UUID) async throws {
        do {
            try await apiClient.request(.setDefaultPaymentMethod(id: id))

            // Update local state
            for i in 0..<paymentMethods.count {
                paymentMethods[i].isDefault = (paymentMethods[i].id == id)
            }
        } catch {
            self.error = error as? NetworkError ?? .unknown(error)
            throw error
        }
    }

    // MARK: - Transactions

    /// Fetch transaction history
    func fetchTransactions(page: Int = 1, limit: Int = 20) async {
        isLoading = true
        error = nil

        do {
            let result: TransactionsResponse = try await apiClient.request(
                .getTransactions(page: page, limit: limit)
            )
            if page == 1 {
                self.transactions = result.transactions
            } else {
                self.transactions.append(contentsOf: result.transactions)
            }
        } catch let networkError as NetworkError {
            self.error = networkError
            if AppConfig.FeatureFlags.demoMode && page == 1 {
                self.transactions = Transaction.mockTransactions
            }
        } catch {
            self.error = .unknown(error)
        }

        isLoading = false
    }

    /// Get transaction details
    func getTransactionDetails(id: UUID) async throws -> Transaction {
        let transaction: Transaction = try await apiClient.request(.getTransactionDetails(id: id))
        return transaction
    }

    // MARK: - Payments

    /// Create a payment intent
    func createPaymentIntent(amount: Decimal, currency: String = "EUR", description: String? = nil) async throws -> PaymentIntent {
        var body: [String: Any] = [
            "amount": NSDecimalNumber(decimal: amount * 100).intValue, // Convert to cents
            "currency": currency.lowercased()
        ]
        if let description = description {
            body["description"] = description
        }

        let intent: PaymentIntent = try await apiClient.request(.createPaymentIntent(data: body))
        return intent
    }

    /// Process a payment
    func processPayment(intentId: String, paymentMethodId: UUID) async throws -> PaymentResult {
        let body: [String: Any] = [
            "payment_intent_id": intentId,
            "payment_method_id": paymentMethodId.uuidString
        ]

        let result: PaymentResult = try await apiClient.request(.confirmPayment(data: body))

        // Refresh transactions after payment
        await fetchTransactions()

        return result
    }

    /// Fetch pending payments (rent, utilities, etc.)
    func fetchPendingPayments() async {
        isLoading = true

        do {
            let payments: [PendingPayment] = try await apiClient.request(.getPendingPayments)
            self.pendingPayments = payments
        } catch {
            if AppConfig.FeatureFlags.demoMode {
                self.pendingPayments = PendingPayment.mockPayments
            }
        }

        isLoading = false
    }

    /// Pay a pending payment
    func payPendingPayment(id: UUID, paymentMethodId: UUID) async throws -> PaymentResult {
        let body: [String: Any] = [
            "pending_payment_id": id.uuidString,
            "payment_method_id": paymentMethodId.uuidString
        ]

        let result: PaymentResult = try await apiClient.request(.payPendingPayment(data: body))

        // Remove from pending
        pendingPayments.removeAll { $0.id == id }

        return result
    }

    // MARK: - Auto-Pay

    /// Enable auto-pay for rent
    func enableAutoPay(paymentMethodId: UUID, dayOfMonth: Int = 1) async throws {
        let body: [String: Any] = [
            "payment_method_id": paymentMethodId.uuidString,
            "day_of_month": dayOfMonth,
            "enabled": true
        ]

        try await apiClient.request(.updateAutoPaySettings(data: body))
    }

    /// Disable auto-pay
    func disableAutoPay() async throws {
        let body: [String: Any] = [
            "enabled": false
        ]

        try await apiClient.request(.updateAutoPaySettings(data: body))
    }
}

// MARK: - Payment Models

struct PaymentMethod: Identifiable, Codable {
    let id: UUID
    let type: PaymentMethodType
    let last4: String
    let brand: String?
    var isDefault: Bool
    let expiryMonth: Int?
    let expiryYear: Int?
    let holderName: String?
    let bankName: String?
    let iban: String?
    let createdAt: Date

    enum CodingKeys: String, CodingKey {
        case id
        case type
        case last4
        case brand
        case isDefault = "is_default"
        case expiryMonth = "expiry_month"
        case expiryYear = "expiry_year"
        case holderName = "holder_name"
        case bankName = "bank_name"
        case iban
        case createdAt = "created_at"
    }

    var displayName: String {
        switch type {
        case .card:
            return "\(brand ?? "Card") •••• \(last4)"
        case .sepa:
            return "\(bankName ?? "Bank") •••• \(last4)"
        case .bankTransfer:
            return "Virement bancaire"
        }
    }

    var icon: String {
        switch type {
        case .card:
            return "creditcard.fill"
        case .sepa:
            return "building.columns.fill"
        case .bankTransfer:
            return "arrow.left.arrow.right"
        }
    }

    static var mockMethods: [PaymentMethod] {
        [
            PaymentMethod(
                id: UUID(),
                type: .card,
                last4: "4242",
                brand: "Visa",
                isDefault: true,
                expiryMonth: 12,
                expiryYear: 2025,
                holderName: "John Doe",
                bankName: nil,
                iban: nil,
                createdAt: Date()
            ),
            PaymentMethod(
                id: UUID(),
                type: .sepa,
                last4: "1234",
                brand: nil,
                isDefault: false,
                expiryMonth: nil,
                expiryYear: nil,
                holderName: "John Doe",
                bankName: "BNP Paribas",
                iban: "FR76•••••••••1234",
                createdAt: Date()
            )
        ]
    }
}

enum PaymentMethodType: String, Codable, CaseIterable {
    case card = "card"
    case sepa = "sepa_debit"
    case bankTransfer = "bank_transfer"

    var displayName: String {
        switch self {
        case .card: return "Carte bancaire"
        case .sepa: return "Prélèvement SEPA"
        case .bankTransfer: return "Virement bancaire"
        }
    }
}

struct PaymentMethodDetails {
    var cardNumber: String?
    var expiryMonth: Int?
    var expiryYear: Int?
    var cvc: String?
    var holderName: String?
    var iban: String?
    var bic: String?

    func toDictionary() -> [String: Any] {
        var dict: [String: Any] = [:]
        if let cardNumber = cardNumber { dict["card_number"] = cardNumber }
        if let expiryMonth = expiryMonth { dict["expiry_month"] = expiryMonth }
        if let expiryYear = expiryYear { dict["expiry_year"] = expiryYear }
        if let cvc = cvc { dict["cvc"] = cvc }
        if let holderName = holderName { dict["holder_name"] = holderName }
        if let iban = iban { dict["iban"] = iban }
        if let bic = bic { dict["bic"] = bic }
        return dict
    }
}

struct Transaction: Identifiable, Codable {
    let id: UUID
    let type: TransactionType
    let amount: Decimal
    let currency: String
    let status: TransactionStatus
    let description: String?
    let propertyId: UUID?
    let propertyTitle: String?
    let paymentMethodLast4: String?
    let createdAt: Date
    let completedAt: Date?

    enum CodingKeys: String, CodingKey {
        case id
        case type
        case amount
        case currency
        case status
        case description
        case propertyId = "property_id"
        case propertyTitle = "property_title"
        case paymentMethodLast4 = "payment_method_last4"
        case createdAt = "created_at"
        case completedAt = "completed_at"
    }

    var formattedAmount: String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = currency
        return formatter.string(from: amount as NSDecimalNumber) ?? "€\(amount)"
    }

    static var mockTransactions: [Transaction] {
        [
            Transaction(
                id: UUID(),
                type: .rent,
                amount: 850,
                currency: "EUR",
                status: .completed,
                description: "Loyer Novembre 2024",
                propertyId: UUID(),
                propertyTitle: "Appartement Bruxelles",
                paymentMethodLast4: "4242",
                createdAt: Date().addingTimeInterval(-86400 * 5),
                completedAt: Date().addingTimeInterval(-86400 * 5)
            ),
            Transaction(
                id: UUID(),
                type: .utilities,
                amount: 75.50,
                currency: "EUR",
                status: .completed,
                description: "Charges Novembre 2024",
                propertyId: UUID(),
                propertyTitle: "Appartement Bruxelles",
                paymentMethodLast4: "4242",
                createdAt: Date().addingTimeInterval(-86400 * 10),
                completedAt: Date().addingTimeInterval(-86400 * 10)
            ),
            Transaction(
                id: UUID(),
                type: .deposit,
                amount: 1700,
                currency: "EUR",
                status: .completed,
                description: "Caution",
                propertyId: UUID(),
                propertyTitle: "Appartement Bruxelles",
                paymentMethodLast4: "1234",
                createdAt: Date().addingTimeInterval(-86400 * 60),
                completedAt: Date().addingTimeInterval(-86400 * 60)
            )
        ]
    }
}

enum TransactionType: String, Codable {
    case rent = "rent"
    case utilities = "utilities"
    case deposit = "deposit"
    case refund = "refund"
    case fee = "fee"
    case other = "other"

    var displayName: String {
        switch self {
        case .rent: return "Loyer"
        case .utilities: return "Charges"
        case .deposit: return "Caution"
        case .refund: return "Remboursement"
        case .fee: return "Frais"
        case .other: return "Autre"
        }
    }

    var icon: String {
        switch self {
        case .rent: return "house.fill"
        case .utilities: return "bolt.fill"
        case .deposit: return "lock.shield.fill"
        case .refund: return "arrow.uturn.backward"
        case .fee: return "percent"
        case .other: return "ellipsis.circle.fill"
        }
    }
}

enum TransactionStatus: String, Codable {
    case pending = "pending"
    case processing = "processing"
    case completed = "completed"
    case failed = "failed"
    case refunded = "refunded"
    case cancelled = "cancelled"

    var displayName: String {
        switch self {
        case .pending: return "En attente"
        case .processing: return "En cours"
        case .completed: return "Complété"
        case .failed: return "Échoué"
        case .refunded: return "Remboursé"
        case .cancelled: return "Annulé"
        }
    }

    var color: Theme.Colors.Type.Type {
        switch self {
        case .completed: return Theme.Colors.self
        case .pending, .processing: return Theme.Colors.self
        case .failed, .cancelled: return Theme.Colors.self
        case .refunded: return Theme.Colors.self
        }
    }
}

struct TransactionsResponse: Codable {
    let transactions: [Transaction]
    let total: Int
    let page: Int
    let hasMore: Bool

    enum CodingKeys: String, CodingKey {
        case transactions
        case total
        case page
        case hasMore = "has_more"
    }
}

struct PendingPayment: Identifiable, Codable {
    let id: UUID
    let type: TransactionType
    let amount: Decimal
    let currency: String
    let dueDate: Date
    let description: String
    let propertyId: UUID?
    let propertyTitle: String?
    let isOverdue: Bool

    enum CodingKeys: String, CodingKey {
        case id
        case type
        case amount
        case currency
        case dueDate = "due_date"
        case description
        case propertyId = "property_id"
        case propertyTitle = "property_title"
        case isOverdue = "is_overdue"
    }

    var formattedAmount: String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = currency
        return formatter.string(from: amount as NSDecimalNumber) ?? "€\(amount)"
    }

    static var mockPayments: [PendingPayment] {
        [
            PendingPayment(
                id: UUID(),
                type: .rent,
                amount: 850,
                currency: "EUR",
                dueDate: Date().addingTimeInterval(86400 * 5),
                description: "Loyer Décembre 2024",
                propertyId: UUID(),
                propertyTitle: "Appartement Bruxelles",
                isOverdue: false
            ),
            PendingPayment(
                id: UUID(),
                type: .utilities,
                amount: 85,
                currency: "EUR",
                dueDate: Date().addingTimeInterval(86400 * 10),
                description: "Charges Décembre 2024",
                propertyId: UUID(),
                propertyTitle: "Appartement Bruxelles",
                isOverdue: false
            )
        ]
    }
}

struct PaymentIntent: Codable {
    let id: String
    let clientSecret: String
    let amount: Int
    let currency: String
    let status: String

    enum CodingKeys: String, CodingKey {
        case id
        case clientSecret = "client_secret"
        case amount
        case currency
        case status
    }
}

struct PaymentResult: Codable {
    let success: Bool
    let transactionId: UUID?
    let message: String?
    let errorCode: String?

    enum CodingKeys: String, CodingKey {
        case success
        case transactionId = "transaction_id"
        case message
        case errorCode = "error_code"
    }
}
