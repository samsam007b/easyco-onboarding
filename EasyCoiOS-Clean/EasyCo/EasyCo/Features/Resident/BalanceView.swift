//
//  BalanceView.swift
//  EasyCo
//
//  Vue affichant le calcul des remboursements "qui doit quoi à qui"
//  Optimise les transferts pour minimiser le nombre de transactions
//

import SwiftUI

struct BalanceView: View {
    @ObservedObject var viewModel: ExpensesViewModel

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Summary
                    summarySection

                    // Balances
                    if viewModel.balances.isEmpty {
                        emptyStateView
                    } else {
                        balancesSection
                    }
                }
                .padding(16)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Balance des Comptes")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }
            }
        }
    }

    // MARK: - Summary Section

    private var summarySection: some View {
        VStack(spacing: 16) {
            HStack(spacing: 12) {
                // Je dois
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Image(systemName: "arrow.up.circle.fill")
                            .font(.system(size: 20))
                            .foregroundColor(Color(hex: "EF4444"))
                        Spacer()
                    }
                    Text(String(format: "%.2f€", viewModel.iOwe))
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(Color(hex: "111827"))
                    Text("Je dois")
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "6B7280"))
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(16)
                .background(Color.white)
                .cornerRadius(16)

                // On me doit
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Image(systemName: "arrow.down.circle.fill")
                            .font(.system(size: 20))
                            .foregroundColor(Color(hex: "10B981"))
                        Spacer()
                    }
                    Text(String(format: "%.2f€", viewModel.oweMe))
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(Color(hex: "111827"))
                    Text("On me doit")
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "6B7280"))
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(16)
                .background(Color.white)
                .cornerRadius(16)
            }

            // Net balance
            let netBalance = viewModel.oweMe - viewModel.iOwe
            HStack {
                Image(systemName: netBalance >= 0 ? "checkmark.circle.fill" : "minus.circle.fill")
                    .font(.system(size: 16))
                    .foregroundColor(netBalance >= 0 ? Color(hex: "10B981") : Color(hex: "EF4444"))

                Text("Balance nette:")
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "6B7280"))

                Spacer()

                Text(String(format: "%+.2f€", netBalance))
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(netBalance >= 0 ? Color(hex: "10B981") : Color(hex: "EF4444"))
            }
            .padding(16)
            .background(netBalance >= 0 ? Color(hex: "10B981").opacity(0.1) : Color(hex: "EF4444").opacity(0.1))
            .cornerRadius(12)
        }
    }

    // MARK: - Balances Section

    private var balancesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Remboursements à effectuer")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            VStack(spacing: 12) {
                ForEach(viewModel.balances) { balance in
                    BalanceCard(balance: balance)
                }
            }
        }
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 16) {
            Image(systemName: "checkmark.circle")
                .font(.system(size: 60))
                .foregroundColor(Color(hex: "10B981"))

            Text("Tout est réglé !")
                .font(.system(size: 20, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            Text("Aucun remboursement en attente")
                .font(.system(size: 15))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity)
        .padding(40)
    }
}

// MARK: - Balance Card

struct BalanceCard: View {
    let balance: Balance

    var body: some View {
        HStack(spacing: 16) {
            // From person
            VStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color(hex: "EF4444"), Color(hex: "EF4444").opacity(0.7)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 48, height: 48)
                    .overlay(
                        Text(String(balance.fromUserName.prefix(1)))
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.white)
                    )

                Text(balance.fromUserName)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(Color(hex: "111827"))
            }

            // Arrow and amount
            VStack(spacing: 4) {
                Image(systemName: "arrow.right")
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(Color(hex: "E8865D"))

                Text(String(format: "%.2f€", balance.amount))
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(Color(hex: "E8865D"))
            }

            // To person
            VStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color(hex: "10B981"), Color(hex: "10B981").opacity(0.7)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 48, height: 48)
                    .overlay(
                        Text(String(balance.toUserName.prefix(1)))
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.white)
                    )

                Text(balance.toUserName)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(Color(hex: "111827"))
            }

            Spacer()

            // Mark as paid button
            Button(action: {}) {
                Image(systemName: "checkmark")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.white)
                    .frame(width: 36, height: 36)
                    .background(Color(hex: "E8865D"))
                    .cornerRadius(10)
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 2)
    }
}

// MARK: - Preview

struct BalanceView_Previews: PreviewProvider {
    static var previews: some View {
        BalanceView(viewModel: ExpensesViewModel())
    }
}
