//
//  PaymentService.swift
//  EasyCo
//

import Foundation
import Combine

@MainActor
class PaymentService: ObservableObject {
    static let shared = PaymentService()

    @Published var pendingPayments: [PendingPayment] = []
    @Published var paymentMethods: [PaymentMethod] = []
    @Published var isLoading = false

    private init() {}

    // TODO: Implement payment service methods
}
