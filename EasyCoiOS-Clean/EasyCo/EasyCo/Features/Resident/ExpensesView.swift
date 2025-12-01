//
//  ExpensesView.swift
//  EasyCo
//
//  Vue principale pour la gestion des dépenses partagées
//  Affiche la liste des dépenses avec filtres, recherche et statistiques
//

import SwiftUI

struct ExpensesView: View {
    @StateObject private var viewModel = ExpensesViewModel()

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Stats Summary
                statsSummarySection

                // Filters and Search
                filtersSection

                // Expenses List
                if viewModel.isLoading {
                    loadingView
                } else if viewModel.filteredExpenses.isEmpty {
                    emptyStateView
                } else {
                    expensesListSection
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Dépenses")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { viewModel.showAddExpense = true }) {
                        Image(systemName: "plus.circle.fill")
                            .font(.system(size: 24))
                            .foregroundColor(Color(hex: "E8865D"))
                    }
                }
            }
            .refreshable {
                await viewModel.refresh()
            }
            .sheet(isPresented: $viewModel.showAddExpense) {
                AddExpenseView(viewModel: viewModel)
            }
            .alert("Erreur", isPresented: $viewModel.showError) {
                Button("OK", role: .cancel) {}
            } message: {
                Text(viewModel.errorMessage ?? "Une erreur est survenue")
            }
        }
        .onChange(of: viewModel.selectedFilter) { _ in
            viewModel.applyFiltersAndSort()
        }
        .onChange(of: viewModel.selectedSort) { _ in
            viewModel.applyFiltersAndSort()
        }
        .onChange(of: viewModel.searchText) { _ in
            viewModel.applyFiltersAndSort()
        }
        .onChange(of: viewModel.selectedCategory) { _ in
            viewModel.applyFiltersAndSort()
        }
    }

    // MARK: - Stats Summary Section

    private var statsSummarySection: some View {
        VStack(spacing: 12) {
            HStack(spacing: 12) {
                // Total dépenses
                ExpenseStatCard(
                    title: "Total",
                    value: String(format: "%.2f€", viewModel.totalExpenses),
                    icon: "creditcard.fill",
                    color: Color(hex: "E8865D")
                )

                // Ce que je dois
                ExpenseStatCard(
                    title: "Je dois",
                    value: String(format: "%.2f€", viewModel.iOwe),
                    icon: "arrow.up.circle.fill",
                    color: Color(hex: "EF4444")
                )
            }

            HStack(spacing: 12) {
                // On me doit
                ExpenseStatCard(
                    title: "On me doit",
                    value: String(format: "%.2f€", viewModel.oweMe),
                    icon: "arrow.down.circle.fill",
                    color: Color(hex: "10B981")
                )

                // Ma part
                ExpenseStatCard(
                    title: "Ma part",
                    value: String(format: "%.2f€", viewModel.myShare),
                    icon: "person.fill",
                    color: Color(hex: "3B82F6")
                )
            }
        }
        .padding(16)
    }

    // MARK: - Filters Section

    private var filtersSection: some View {
        VStack(spacing: 12) {
            // Search Bar
            HStack(spacing: 12) {
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(Color(hex: "9CA3AF"))
                    TextField("Rechercher une dépense...", text: $viewModel.searchText)
                        .font(.system(size: 16))
                    if !viewModel.searchText.isEmpty {
                        Button(action: { viewModel.searchText = "" }) {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(Color(hex: "9CA3AF"))
                        }
                    }
                }
                .padding(12)
                .background(Color.white)
                .cornerRadius(12)
            }

            // Filter Chips
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(ExpenseFilter.allCases, id: \.self) { filter in
                        ExpenseFilterChip(
                            title: filter.displayName,
                            icon: filter.icon,
                            isSelected: viewModel.selectedFilter == filter,
                            count: viewModel.getCount(for: filter)
                        ) {
                            viewModel.selectedFilter = filter
                        }
                    }
                }
            }

            // Category Filter + Sort
            HStack(spacing: 12) {
                // Category Filter
                Menu {
                    Button("Toutes les catégories") {
                        viewModel.selectedCategory = nil
                    }
                    ForEach(ExpenseCategory.allCases, id: \.self) { category in
                        Button(action: {
                            viewModel.selectedCategory = category
                        }) {
                            Label(category.displayName, systemImage: category.icon)
                        }
                    }
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "folder")
                            .font(.system(size: 14))
                        Text(viewModel.selectedCategory?.displayName ?? "Catégorie")
                            .font(.system(size: 14, weight: .medium))
                        Image(systemName: "chevron.down")
                            .font(.system(size: 12))
                    }
                    .foregroundColor(viewModel.selectedCategory != nil ? Color(hex: "E8865D") : Color(hex: "6B7280"))
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(viewModel.selectedCategory != nil ? Color(hex: "E8865D").opacity(0.1) : Color.white)
                    .cornerRadius(8)
                }

                Spacer()

                // Sort Menu
                Menu {
                    ForEach(ExpenseSort.allCases, id: \.self) { sort in
                        Button(action: {
                            viewModel.selectedSort = sort
                        }) {
                            Label(sort.displayName, systemImage: sort.icon)
                        }
                    }
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "arrow.up.arrow.down")
                            .font(.system(size: 14))
                        Text(viewModel.selectedSort.displayName)
                            .font(.system(size: 14, weight: .medium))
                    }
                    .foregroundColor(Color(hex: "6B7280"))
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(Color.white)
                    .cornerRadius(8)
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.bottom, 12)
    }

    // MARK: - Expenses List

    private var expensesListSection: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                ForEach(viewModel.filteredExpenses) { expense in
                    ExpenseCard(expense: expense, viewModel: viewModel)
                }
            }
            .padding(16)
        }
    }

    // MARK: - Loading View

    private var loadingView: some View {
        VStack(spacing: 16) {
            ProgressView()
                .scaleEffect(1.5)
            Text("Chargement des dépenses...")
                .font(.system(size: 16))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 20) {
            Image(systemName: "creditcard")
                .font(.system(size: 60))
                .foregroundColor(Color(hex: "E8865D").opacity(0.5))

            Text("Aucune dépense")
                .font(.system(size: 20, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            Text("Ajoutez votre première dépense\npour commencer à partager les frais")
                .font(.system(size: 15))
                .foregroundColor(Color(hex: "6B7280"))
                .multilineTextAlignment(.center)

            Button(action: { viewModel.showAddExpense = true }) {
                HStack {
                    Image(systemName: "plus.circle.fill")
                    Text("Ajouter une dépense")
                }
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(.white)
                .padding(.horizontal, 24)
                .padding(.vertical, 12)
                .background(Color(hex: "E8865D"))
                .cornerRadius(12)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(32)
    }
}

// MARK: - Expense Stat Card Component

struct ExpenseStatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: icon)
                    .font(.system(size: 16))
                    .foregroundColor(color)
                Spacer()
            }

            Text(value)
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            Text(title)
                .font(.system(size: 12))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(12)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Filter Chip Component

struct ExpenseFilterChip: View {
    let title: String
    let icon: String
    let isSelected: Bool
    let count: Int
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Image(systemName: icon)
                    .font(.system(size: 12))
                Text(title)
                    .font(.system(size: 13, weight: .medium))
                if count > 0 {
                    Text("\(count)")
                        .font(.system(size: 11, weight: .semibold))
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(isSelected ? Color.white.opacity(0.3) : Color(hex: "E5E7EB"))
                        .cornerRadius(10)
                }
            }
            .foregroundColor(isSelected ? .white : Color(hex: "6B7280"))
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(isSelected ? Color(hex: "E8865D") : Color.white)
            .cornerRadius(20)
        }
    }
}

// MARK: - Expense Card Component

struct ExpenseCard: View {
    let expense: Expense
    @ObservedObject var viewModel: ExpensesViewModel
    @State private var showDetails = false

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                // Category Icon
                Circle()
                    .fill(Color(hex: expense.category.color).opacity(0.2))
                    .frame(width: 40, height: 40)
                    .overlay(
                        Image(systemName: expense.category.icon)
                            .font(.system(size: 16))
                            .foregroundColor(Color(hex: expense.category.color))
                    )

                VStack(alignment: .leading, spacing: 4) {
                    Text(expense.title)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    HStack(spacing: 8) {
                        Text(expense.category.displayName)
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "6B7280"))

                        Circle()
                            .fill(Color(hex: "9CA3AF"))
                            .frame(width: 3, height: 3)

                        Text(expense.date, style: .date)
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }

                Spacer()

                // Amount
                Text(String(format: "%.2f€", expense.amount))
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "E8865D"))
            }

            // Paid By
            HStack(spacing: 6) {
                Image(systemName: "person.fill")
                    .font(.system(size: 11))
                    .foregroundColor(Color(hex: "9CA3AF"))
                Text("Payé par \(expense.paidByName ?? "Inconnu")")
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            // Splits Progress
            let paidCount = expense.splits.filter { $0.isPaid }.count
            let totalCount = expense.splits.count

            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Text("\(paidCount)/\(totalCount) remboursés")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(Color(hex: "6B7280"))

                    Spacer()

                    Text(String(format: "%.0f%%", Double(paidCount) / Double(totalCount) * 100))
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(paidCount == totalCount ? Color(hex: "10B981") : Color(hex: "F59E0B"))
                }

                GeometryReader { geometry in
                    ZStack(alignment: .leading) {
                        Rectangle()
                            .fill(Color(hex: "E5E7EB"))
                            .frame(height: 6)
                            .cornerRadius(3)

                        Rectangle()
                            .fill(paidCount == totalCount ? Color(hex: "10B981") : Color(hex: "E8865D"))
                            .frame(width: geometry.size.width * CGFloat(paidCount) / CGFloat(totalCount), height: 6)
                            .cornerRadius(3)
                    }
                }
                .frame(height: 6)
            }

            // Actions
            HStack(spacing: 12) {
                Button(action: { showDetails.toggle() }) {
                    HStack(spacing: 4) {
                        Image(systemName: showDetails ? "chevron.up" : "chevron.down")
                        Text(showDetails ? "Masquer" : "Détails")
                    }
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(Color(hex: "E8865D"))
                }

                Spacer()

                if expense.hasReceipt {
                    Image(systemName: "paperclip")
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "6B7280"))
                }
            }

            // Details (expandable)
            if showDetails {
                Divider()

                VStack(alignment: .leading, spacing: 8) {
                    Text("Répartition")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    ForEach(expense.splits) { split in
                        HStack {
                            Image(systemName: split.isPaid ? "checkmark.circle.fill" : "circle")
                                .font(.system(size: 14))
                                .foregroundColor(split.isPaid ? Color(hex: "10B981") : Color(hex: "9CA3AF"))

                            Text(split.userName ?? "Inconnu")
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "111827"))

                            Spacer()

                            Text(String(format: "%.2f€", split.amount))
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(split.isPaid ? Color(hex: "6B7280") : Color(hex: "111827"))
                        }
                    }
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 2)
    }
}

// MARK: - Preview

struct ExpensesView_Previews: PreviewProvider {
    static var previews: some View {
        ExpensesView()
    }
}
