//
//  PaymentHistoryView.swift
//  IzzIco
//
//  Payment history for residents
//

import SwiftUI

struct PaymentHistoryView: View {
    @State private var payments: [RentPayment] = []
    @State private var selectedFilter: PaymentFilter = .all

    enum PaymentFilter: String, CaseIterable {
        case all = "Tous"
        case paid = "Payés"
        case pending = "En attente"
        case overdue = "En retard"
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Filter pills
                filterSection

                // Payments list
                if filteredPayments.isEmpty {
                    emptyState
                } else {
                    VStack(spacing: 12) {
                        ForEach(filteredPayments) { payment in
                            PaymentRow(payment: payment)
                        }
                    }
                }
            }
            .padding()
        }
        .background(Theme.Colors.backgroundSecondary)
        .navigationTitle("Historique des paiements")
        .navigationBarTitleDisplayMode(.large)
        .onAppear {
            loadPayments()
        }
    }

    private var filterSection: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(PaymentFilter.allCases, id: \.self) { filter in
                    Button(action: {
                        selectedFilter = filter
                    }) {
                        Text(filter.rawValue)
                            .font(Theme.Typography.bodySmall(.semibold))
                            .foregroundColor(selectedFilter == filter ? .white : Theme.Colors.textPrimary)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                            .background(selectedFilter == filter ? Theme.Colors.primary : Theme.Colors.backgroundPrimary)
                            .cornerRadius(20)
                    }
                }
            }
        }
    }

    private var emptyState: some View {
        VStack(spacing: 16) {
            Image(systemName: "eurosign.circle")
                .font(.system(size: 60))
                .foregroundColor(Theme.Colors.textTertiary)

            Text("Aucun paiement")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            Text("Votre historique de paiements apparaîtra ici")
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textSecondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(.top, 100)
    }

    private var filteredPayments: [RentPayment] {
        switch selectedFilter {
        case .all:
            return payments
        case .paid:
            return payments.filter { $0.status == .paid }
        case .pending:
            return payments.filter { $0.status == .pending }
        case .overdue:
            return payments.filter { $0.status == .overdue }
        }
    }

    private func loadPayments() {
        // Load payments from API
        // For now, use mock data
        payments = [
            RentPayment(
                id: "1",
                amount: 850,
                dueDate: Date(),
                status: .pending
            ),
            RentPayment(
                id: "2",
                amount: 850,
                dueDate: Calendar.current.date(byAdding: .month, value: -1, to: Date())!,
                status: .paid,
                paidDate: Calendar.current.date(byAdding: .month, value: -1, to: Date())
            )
        ]
    }
}

private struct PaymentRow: View {
    let payment: RentPayment

    var body: some View {
        HStack(spacing: 16) {
            // Status icon
            Image(systemName: iconForStatus(payment.status))
                .font(.system(size: 24))
                .foregroundColor(colorForStatus(payment.status))
                .frame(width: 48, height: 48)
                .background(colorForStatus(payment.status).opacity(0.1))
                .cornerRadius(12)

            // Payment info
            VStack(alignment: .leading, spacing: 4) {
                Text("Loyer de \(payment.formattedDueDate)")
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Échéance le \(payment.formattedDueDate)")
                    .font(Theme.Typography.bodySmall())
                    .foregroundColor(Theme.Colors.textSecondary)

                Text(statusText(payment.status))
                    .font(Theme.Typography.bodySmall(.semibold))
                    .foregroundColor(colorForStatus(payment.status))
            }

            Spacer()

            // Amount
            Text("\(payment.amount)€")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(Theme.Colors.textPrimary)
        }
        .padding(16)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }

    private func iconForStatus(_ status: PaymentStatus) -> String {
        switch status {
        case .paid: return "checkmark.circle.fill"
        case .pending: return "clock.fill"
        case .overdue: return "exclamationmark.circle.fill"
        }
    }

    private func colorForStatus(_ status: PaymentStatus) -> Color {
        switch status {
        case .paid: return Theme.Colors.success
        case .pending: return Theme.Colors.warning
        case .overdue: return Theme.Colors.error
        }
    }

    private func statusText(_ status: PaymentStatus) -> String {
        switch status {
        case .paid: return "Payé"
        case .pending: return "En attente"
        case .overdue: return "En retard"
        }
    }
}
