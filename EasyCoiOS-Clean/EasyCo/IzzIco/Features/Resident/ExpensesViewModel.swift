//
//  ExpensesViewModel.swift
//  IzzIco
//
//  ViewModel pour la gestion des dépenses partagées
//  Gère le CRUD, les filtres, le calcul des balances et les statistiques
//

import Foundation
import SwiftUI
import Combine

@MainActor
class ExpensesViewModel: ObservableObject {
    // MARK: - Published Properties

    @Published var expenses: [Expense] = []
    @Published var filteredExpenses: [Expense] = []
    @Published var balances: [Balance] = []

    // UI State
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var showError = false
    @Published var showAddExpense = false

    // Filters
    @Published var selectedFilter: ExpenseFilter = .all
    @Published var selectedSort: ExpenseSort = .dateDescending
    @Published var searchText = ""
    @Published var selectedCategory: ExpenseCategory?
    @Published var selectedPeriod: ExpenseTimePeriod = .month

    // Stats
    @Published var totalExpenses: Double = 0
    @Published var myShare: Double = 0
    @Published var iOwe: Double = 0
    @Published var oweMe: Double = 0

    // MARK: - Initialization

    init() {
        loadExpenses()
    }

    // MARK: - Data Loading

    func loadExpenses() {
        isLoading = true

        _Concurrency.Task {
            do {
                if AppConfig.FeatureFlags.demoMode {
                    // Mode démo
                    try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
                    self.expenses = Expense.mockExpenses
                    self.balances = Expense.mockBalances
                } else {
                    // TODO: API call
                    // self.expenses = try await APIClient.shared.getExpenses()
                    self.expenses = []
                }

                self.applyFiltersAndSort()
                self.calculateStats()
                self.calculateBalances()
                self.isLoading = false
            } catch {
                self.errorMessage = "Erreur lors du chargement des dépenses"
                self.showError = true
                self.isLoading = false
            }
        }
    }

    func refresh() async {
        loadExpenses()
    }

    // MARK: - CRUD Operations

    func addExpense(_ expense: Expense) async {
        do {
            if AppConfig.FeatureFlags.demoMode {
                try? await _Concurrency.Task.sleep(nanoseconds: 300_000_000)
                expenses.insert(expense, at: 0)
            } else {
                // TODO: API call
                // let newExpense = try await APIClient.shared.createExpense(expense)
                // expenses.insert(newExpense, at: 0)
            }

            applyFiltersAndSort()
            calculateStats()
            calculateBalances()
        } catch {
            errorMessage = "Erreur lors de l'ajout de la dépense"
            showError = true
        }
    }

    func updateExpense(_ expense: Expense) async {
        do {
            if AppConfig.FeatureFlags.demoMode {
                try? await _Concurrency.Task.sleep(nanoseconds: 300_000_000)
                if let index = expenses.firstIndex(where: { $0.id == expense.id }) {
                    expenses[index] = expense
                }
            } else {
                // TODO: API call
                // try await APIClient.shared.updateExpense(expense)
            }

            applyFiltersAndSort()
            calculateStats()
            calculateBalances()
        } catch {
            errorMessage = "Erreur lors de la mise à jour de la dépense"
            showError = true
        }
    }

    func deleteExpense(_ expenseId: UUID) async {
        do {
            if AppConfig.FeatureFlags.demoMode {
                try? await _Concurrency.Task.sleep(nanoseconds: 300_000_000)
                expenses.removeAll { $0.id == expenseId }
            } else {
                // TODO: API call
                // try await APIClient.shared.deleteExpense(expenseId)
            }

            applyFiltersAndSort()
            calculateStats()
            calculateBalances()
        } catch {
            errorMessage = "Erreur lors de la suppression de la dépense"
            showError = true
        }
    }

    func markSplitAsPaid(_ expenseId: UUID, _ splitId: UUID) async {
        if let expenseIndex = expenses.firstIndex(where: { $0.id == expenseId }),
           let splitIndex = expenses[expenseIndex].splits.firstIndex(where: { $0.id == splitId }) {
            expenses[expenseIndex].splits[splitIndex].isPaid = true
            expenses[expenseIndex].splits[splitIndex].paidAt = Date()

            await updateExpense(expenses[expenseIndex])
        }
    }

    // MARK: - Filtering & Sorting

    func applyFiltersAndSort() {
        var result = expenses

        // Apply filter
        switch selectedFilter {
        case .all:
            break
        case .pending:
            result = result.filter { expense in
                expense.splits.contains { !$0.isPaid }
            }
        case .settled:
            result = result.filter { expense in
                expense.splits.allSatisfy { $0.isPaid }
            }
        case .recent:
            result = result.filter { $0.isRecent }
        }

        // Apply category filter
        if let category = selectedCategory {
            result = result.filter { $0.category == category }
        }

        // Apply search
        if !searchText.isEmpty {
            result = result.filter {
                $0.title.localizedCaseInsensitiveContains(searchText) ||
                ($0.description?.localizedCaseInsensitiveContains(searchText) ?? false) ||
                ($0.paidByName?.localizedCaseInsensitiveContains(searchText) ?? false)
            }
        }

        // Apply sort
        switch selectedSort {
        case .dateDescending:
            result.sort { $0.date > $1.date }
        case .dateAscending:
            result.sort { $0.date < $1.date }
        case .amountDescending:
            result.sort { $0.amount > $1.amount }
        case .amountAscending:
            result.sort { $0.amount < $1.amount }
        case .category:
            result.sort { $0.category.displayName < $1.category.displayName }
        }

        filteredExpenses = result
    }

    // MARK: - Statistics

    func calculateStats() {
        totalExpenses = expenses.reduce(0) { $0 + $1.amount }

        // Calculer ma part (à implémenter avec userId réel)
        myShare = expenses.reduce(0) { total, expense in
            let mySplit = expense.splits.first(where: { _ in true }) // TODO: filtrer par userId
            return total + (mySplit?.amount ?? 0)
        }
    }

    // MARK: - Balance Calculation

    func calculateBalances() {
        var userBalances: [UUID: Double] = [:]

        // Calculer pour chaque dépense
        for expense in expenses {
            // Celui qui a payé est créditeur
            userBalances[expense.paidById, default: 0] += expense.amount

            // Chaque split diminue le crédit
            for split in expense.splits {
                userBalances[split.userId, default: 0] -= split.amount
            }
        }

        // Convertir en liste de balances
        var calculatedBalances: [Balance] = []

        let creditors = userBalances.filter { $0.value > 0.01 }
        let debtors = userBalances.filter { $0.value < -0.01 }

        for (creditorId, creditAmount) in creditors {
            for (debtorId, var debtAmount) in debtors {
                debtAmount = abs(debtAmount)
                let transferAmount = min(creditAmount, debtAmount)

                if transferAmount > 0.01 {
                    let balance = Balance(
                        fromUserId: debtorId,
                        fromUserName: getUserName(debtorId),
                        toUserId: creditorId,
                        toUserName: getUserName(creditorId),
                        amount: transferAmount
                    )
                    calculatedBalances.append(balance)
                }
            }
        }

        balances = calculatedBalances

        // Calculer ce que je dois / ce qu'on me doit
        // TODO: utiliser le vrai userId
        iOwe = balances.filter { _ in false }.reduce(0) { $0 + $1.amount }
        oweMe = balances.filter { _ in false }.reduce(0) { $0 + $1.amount }
    }

    // MARK: - Helper Methods

    private func getUserName(_ userId: UUID) -> String {
        // TODO: récupérer le vrai nom depuis les données utilisateur
        expenses.first { $0.paidById == userId }?.paidByName ?? "Inconnu"
    }

    func getExpensesByCategory() -> [ExpenseCategory: Double] {
        var result: [ExpenseCategory: Double] = [:]

        for expense in expenses {
            result[expense.category, default: 0] += expense.amount
        }

        return result
    }

    func getExpensesForPeriod() -> [Expense] {
        let calendar = Calendar.current
        let now = Date()

        return expenses.filter { expense in
            switch selectedPeriod {
            case .week:
                return calendar.isDate(expense.date, equalTo: now, toGranularity: .weekOfYear)
            case .month:
                return calendar.isDate(expense.date, equalTo: now, toGranularity: .month)
            case .year:
                return calendar.isDate(expense.date, equalTo: now, toGranularity: .year)
            case .all:
                return true
            }
        }
    }

    func getTotalForPeriod() -> Double {
        getExpensesForPeriod().reduce(0) { $0 + $1.amount }
    }

    func getCount(for filter: ExpenseFilter) -> Int {
        switch filter {
        case .all:
            return expenses.count
        case .pending:
            return expenses.filter { expense in
                expense.splits.contains { !$0.isPaid }
            }.count
        case .settled:
            return expenses.filter { expense in
                expense.splits.allSatisfy { $0.isPaid }
            }.count
        case .recent:
            return expenses.filter { $0.isRecent }.count
        }
    }
}

// MARK: - Filter Enums

enum ExpenseFilter: String, CaseIterable {
    case all = "all"
    case pending = "pending"
    case settled = "settled"
    case recent = "recent"

    var displayName: String {
        switch self {
        case .all: return "Toutes"
        case .pending: return "En attente"
        case .settled: return "Réglées"
        case .recent: return "Récentes"
        }
    }

    var icon: String {
        switch self {
        case .all: return "square.grid.2x2.fill"
        case .pending: return "clock.fill"
        case .settled: return "checkmark.circle.fill"
        case .recent: return "star.fill"
        }
    }
}

enum ExpenseSort: String, CaseIterable {
    case dateDescending = "date_desc"
    case dateAscending = "date_asc"
    case amountDescending = "amount_desc"
    case amountAscending = "amount_asc"
    case category = "category"

    var displayName: String {
        switch self {
        case .dateDescending: return "Plus récentes"
        case .dateAscending: return "Plus anciennes"
        case .amountDescending: return "Montant décroissant"
        case .amountAscending: return "Montant croissant"
        case .category: return "Catégorie"
        }
    }

    var icon: String {
        switch self {
        case .dateDescending: return "arrow.down"
        case .dateAscending: return "arrow.up"
        case .amountDescending: return "arrow.down.circle"
        case .amountAscending: return "arrow.up.circle"
        case .category: return "folder"
        }
    }
}

enum ExpenseTimePeriod: String, CaseIterable {
    case week = "week"
    case month = "month"
    case year = "year"
    case all = "all"

    var displayName: String {
        switch self {
        case .week: return "Semaine"
        case .month: return "Mois"
        case .year: return "Année"
        case .all: return "Tout"
        }
    }
}
