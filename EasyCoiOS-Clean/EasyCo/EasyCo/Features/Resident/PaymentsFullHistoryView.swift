//
//  PaymentsFullHistoryView.swift
//  EasyCo
//
//  Full payment history for residents
//

import SwiftUI

struct PaymentsFullHistoryView: View {
    @StateObject private var viewModel = PaymentsHistoryViewModel()
    @State private var selectedFilter: PaymentFilterType = .all

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Filter chips
                filterSection

                // Stats overview
                statsSection

                // Payments list
                paymentsList
            }
            .padding()
        }
        .background(Theme.Colors.backgroundSecondary)
        .navigationTitle("Historique des paiements")
        .navigationBarTitleDisplayMode(.inline)
        .task {
            await viewModel.loadPayments()
        }
    }

    private var filterSection: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(PaymentFilterType.allCases, id: \.self) { filter in
                    FilterChip(
                        title: filter.label,
                        isSelected: selectedFilter == filter,
                        action: {
                            withAnimation(.spring(response: 0.3)) {
                                selectedFilter = filter
                            }
                            Haptic.impact(.light)
                        }
                    )
                }
            }
        }
    }

    private var statsSection: some View {
        HStack(spacing: 12) {
            StatCardPayments(
                title: "Total payé",
                value: "\(viewModel.totalPaid)€",
                icon: "check-circle",
                color: Theme.Colors.success
            )

            StatCardPayments(
                title: "En attente",
                value: "\(viewModel.totalPending)€",
                icon: "clock",
                color: Theme.Colors.warning
            )
        }
    }

    private var paymentsList: some View {
        VStack(spacing: 12) {
            ForEach(filteredPayments) { payment in
                PaymentFullCard(payment: payment)
            }
        }
    }

    private var filteredPayments: [RentPayment] {
        viewModel.payments.filter { payment in
            switch selectedFilter {
            case .all: return true
            case .paid: return payment.status == .paid
            case .pending: return payment.status == .pending
            case .overdue: return payment.status == .overdue
            }
        }
    }
}

// MARK: - Filter Type

enum PaymentFilterType: CaseIterable {
    case all, paid, pending, overdue

    var label: String {
        switch self {
        case .all: return "Tous"
        case .paid: return "Payés"
        case .pending: return "En attente"
        case .overdue: return "En retard"
        }
    }
}

// MARK: - Stat Card

private struct StatCardPayments: View {
    let title: String
    let value: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image.lucide(icon)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 20, height: 20)
                    .foregroundColor(color)

                Spacer()
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(value)
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(title)
                    .font(Theme.Typography.bodySmall())
                    .foregroundColor(Theme.Colors.textSecondary)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }
}

// MARK: - Payment Full Card

private struct PaymentFullCard: View {
    let payment: RentPayment

    var body: some View {
        VStack(spacing: 16) {
            HStack {
                Image.lucide(payment.status.icon)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 24, height: 24)
                    .foregroundColor(payment.status.color)
                    .frame(width: 56, height: 56)
                    .background(payment.status.color.opacity(0.1))
                    .cornerRadius(14)

                VStack(alignment: .leading, spacing: 4) {
                    Text("Loyer de \(payment.formattedDueDate)")
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text(payment.status.label)
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(payment.status.color)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 4) {
                    Text("\(payment.amount)€")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    if payment.status == .paid, let paidDate = payment.paidDate {
                        Text("Payé le \(formatDate(paidDate))")
                            .font(Theme.Typography.caption())
                            .foregroundColor(Theme.Colors.textSecondary)
                    }
                }
            }

            if payment.status != .paid {
                Button(action: {
                    Haptic.impact(.medium)
                }) {
                    HStack(spacing: 8) {
                        Image.lucide("credit-card")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 18, height: 18)

                        Text("Payer maintenant")
                            .font(Theme.Typography.body(.semibold))
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(Theme.Gradients.residentCTA)
                    .cornerRadius(Theme.CornerRadius.button)
                }
            }
        }
        .padding(20)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }

    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "d MMM yyyy"
        formatter.locale = Locale(identifier: "fr_FR")
        return formatter.string(from: date)
    }
}

// MARK: - View Model

@MainActor
class PaymentsHistoryViewModel: ObservableObject {
    @Published var payments: [RentPayment] = []
    @Published var isLoading = false

    var totalPaid: Int {
        payments.filter { $0.status == .paid }.reduce(0) { $0 + $1.amount }
    }

    var totalPending: Int {
        payments.filter { $0.status == .pending || $0.status == .overdue }.reduce(0) { $0 + $1.amount }
    }

    func loadPayments() async {
        isLoading = true
        defer { isLoading = false }

        // Demo mode - generate mock data
        let calendar = Calendar.current
        let now = Date()

        payments = (0..<12).map { monthOffset in
            let dueDate = calendar.date(byAdding: .month, value: -monthOffset, to: now)!
            let isPaid = monthOffset > 0
            let status: PaymentStatus = isPaid ? .paid : (monthOffset == 0 ? .pending : .overdue)

            return RentPayment(
                id: "payment_\(monthOffset)",
                amount: 850,
                dueDate: dueDate,
                status: status,
                paidDate: isPaid ? calendar.date(byAdding: .day, value: -3, to: dueDate) : nil
            )
        }
    }
}

// MARK: - Preview

struct PaymentsFullHistoryView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            PaymentsFullHistoryView()
        }
    }
}
