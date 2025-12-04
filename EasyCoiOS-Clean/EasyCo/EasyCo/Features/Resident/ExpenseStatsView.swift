//
//  ExpenseStatsView.swift
//  EasyCo
//
//  Vue des statistiques des dépenses avec graphiques
//  Affiche les dépenses par catégorie, par période, tendances
//

import SwiftUI
import Charts

struct ExpenseStatsView: View {
    @ObservedObject var viewModel: ExpensesViewModel

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Period selector
                    periodSelectorSection

                    // Total for period
                    totalSection

                    // By Category Chart
                    byCategorySection

                    // Recent expenses list
                    recentExpensesSection
                }
                .padding(16)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Statistiques")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }
            }
        }
    }

    // MARK: - Period Selector

    private var periodSelectorSection: some View {
        HStack(spacing: 12) {
            ForEach(ExpenseTimePeriod.allCases, id: \.self) { period in
                periodButton(for: period)
            }
        }
    }

    private func periodButton(for period: ExpenseTimePeriod) -> some View {
        let isSelected = viewModel.selectedPeriod == period
        let textColor = isSelected ? Color.white : Color(hex: "6B7280")
        let backgroundColor = isSelected ? Color(hex: "E8865D") : Color.white

        return Button(action: { viewModel.selectedPeriod = period }) {
            Text(period.displayName)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(textColor)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(backgroundColor)
                .cornerRadius(20)
        }
    }

    // MARK: - Total Section

    private var totalSection: some View {
        VStack(spacing: 12) {
            Text("Total dépenses")
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "6B7280"))

            Text(String(format: "%.2f€", viewModel.getTotalForPeriod()))
                .font(.system(size: 36, weight: .bold))
                .foregroundColor(Color(hex: "E8865D"))

            Text(viewModel.selectedPeriod.displayName.lowercased())
                .font(.system(size: 13))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity)
        .padding(24)
        .background(Color.white)
        .cornerRadius(16)
    }

    // MARK: - By Category Section

    private var byCategorySection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Par catégorie")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            let categoryData = viewModel.getExpensesByCategory()

            if #available(iOS 16.0, *) {
                Chart {
                    ForEach(Array(categoryData.keys), id: \.self) { category in
                        BarMark(
                            x: .value("Montant", categoryData[category] ?? 0),
                            y: .value("Catégorie", category.displayName)
                        )
                        .foregroundStyle(Color(hex: category.color))
                    }
                }
                .frame(height: 300)
                .padding(16)
                .background(Color.white)
                .cornerRadius(16)
            } else {
                // Fallback for iOS 15
                VStack(spacing: 12) {
                    ForEach(Array(categoryData.keys.sorted(by: { (categoryData[$0] ?? 0) > (categoryData[$1] ?? 0) })), id: \.self) { category in
                        CategoryRow(
                            category: category,
                            amount: categoryData[category] ?? 0,
                            total: viewModel.getTotalForPeriod()
                        )
                    }
                }
                .padding(16)
                .background(Color.white)
                .cornerRadius(16)
            }
        }
    }

    // MARK: - Recent Expenses

    private var recentExpensesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Dernières dépenses")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            VStack(spacing: 12) {
                ForEach(viewModel.getExpensesForPeriod().prefix(5)) { expense in
                    HStack {
                        Circle()
                            .fill(Color(hex: expense.category.color).opacity(0.2))
                            .frame(width: 36, height: 36)
                            .overlay(
                                Image(systemName: expense.category.icon)
                                    .font(.system(size: 14))
                                    .foregroundColor(Color(hex: expense.category.color))
                            )

                        VStack(alignment: .leading, spacing: 2) {
                            Text(expense.title)
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(Color(hex: "111827"))

                            Text(expense.date, style: .date)
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "6B7280"))
                        }

                        Spacer()

                        Text(String(format: "%.2f€", expense.amount))
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundColor(Color(hex: "E8865D"))
                    }
                    .padding(12)
                    .background(Color.white)
                    .cornerRadius(12)
                }
            }
        }
    }
}

// MARK: - Category Row (Fallback for iOS 15)

struct CategoryRow: View {
    let category: ExpenseCategory
    let amount: Double
    let total: Double

    var percentage: Double {
        total > 0 ? (amount / total) * 100 : 0
    }

    var body: some View {
        VStack(spacing: 8) {
            HStack {
                HStack(spacing: 8) {
                    Image(systemName: category.icon)
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: category.color))

                    Text(category.displayName)
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "111827"))
                }

                Spacer()

                Text(String(format: "%.2f€", amount))
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                Text(String(format: "(%.0f%%)", percentage))
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    Rectangle()
                        .fill(Color(hex: "E5E7EB"))
                        .frame(height: 8)
                        .cornerRadius(4)

                    Rectangle()
                        .fill(Color(hex: category.color))
                        .frame(width: geometry.size.width * (percentage / 100), height: 8)
                        .cornerRadius(4)
                }
            }
            .frame(height: 8)
        }
    }
}

// MARK: - Preview

struct ExpenseStatsView_Previews: PreviewProvider {
    static var previews: some View {
        ExpenseStatsView(viewModel: ExpensesViewModel())
    }
}
