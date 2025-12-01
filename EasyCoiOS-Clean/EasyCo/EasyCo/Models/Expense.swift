//
//  Expense.swift
//  EasyCo
//
//  Modèle représentant une dépense partagée dans la colocation
//  Utilisé pour gérer les dépenses communes et calculer les remboursements
//

import Foundation

struct Expense: Identifiable, Codable {
    let id: UUID
    var householdId: UUID
    var title: String
    var description: String?
    var amount: Double
    var category: ExpenseCategory
    var paidById: UUID
    var paidByName: String? // Pour l'affichage
    var date: Date
    var receiptURL: String?
    var splitType: SplitType
    var splits: [ExpenseSplit] // Répartition de la dépense
    var isValidated: Bool
    var validatedAt: Date?
    var createdAt: Date
    var updatedAt: Date

    // Computed properties
    var isRecent: Bool {
        let daysSince = Calendar.current.dateComponents([.day], from: date, to: Date()).day ?? 0
        return daysSince <= 7
    }

    var formattedAmount: String {
        String(format: "%.2f€", amount)
    }

    var amountPerPerson: Double {
        if splitType == .equal {
            return amount / Double(splits.count)
        } else {
            return 0 // Pour custom split, voir splits individuels
        }
    }

    var hasReceipt: Bool {
        receiptURL != nil && !(receiptURL?.isEmpty ?? true)
    }

    init(
        id: UUID = UUID(),
        householdId: UUID,
        title: String,
        description: String? = nil,
        amount: Double,
        category: ExpenseCategory,
        paidById: UUID,
        paidByName: String? = nil,
        date: Date = Date(),
        receiptURL: String? = nil,
        splitType: SplitType = .equal,
        splits: [ExpenseSplit] = [],
        isValidated: Bool = true,
        validatedAt: Date? = nil,
        createdAt: Date = Date(),
        updatedAt: Date = Date()
    ) {
        self.id = id
        self.householdId = householdId
        self.title = title
        self.description = description
        self.amount = amount
        self.category = category
        self.paidById = paidById
        self.paidByName = paidByName
        self.date = date
        self.receiptURL = receiptURL
        self.splitType = splitType
        self.splits = splits
        self.isValidated = isValidated
        self.validatedAt = validatedAt
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
}

// MARK: - Expense Split
struct ExpenseSplit: Identifiable, Codable {
    let id: UUID
    var userId: UUID
    var userName: String?
    var amount: Double
    var isPaid: Bool
    var paidAt: Date?

    var formattedAmount: String {
        String(format: "%.2f€", amount)
    }

    init(
        id: UUID = UUID(),
        userId: UUID,
        userName: String? = nil,
        amount: Double,
        isPaid: Bool = false,
        paidAt: Date? = nil
    ) {
        self.id = id
        self.userId = userId
        self.userName = userName
        self.amount = amount
        self.isPaid = isPaid
        self.paidAt = paidAt
    }
}

// MARK: - Expense Category
enum ExpenseCategory: String, Codable, CaseIterable {
    case rent = "rent"
    case utilities = "utilities"
    case groceries = "groceries"
    case internet = "internet"
    case cleaning = "cleaning"
    case maintenance = "maintenance"
    case furniture = "furniture"
    case entertainment = "entertainment"
    case other = "other"

    var displayName: String {
        switch self {
        case .rent: return "Loyer"
        case .utilities: return "Charges"
        case .groceries: return "Courses"
        case .internet: return "Internet"
        case .cleaning: return "Produits ménagers"
        case .maintenance: return "Maintenance"
        case .furniture: return "Mobilier"
        case .entertainment: return "Divertissement"
        case .other: return "Autre"
        }
    }

    var icon: String {
        switch self {
        case .rent: return "house.fill"
        case .utilities: return "bolt.fill"
        case .groceries: return "cart.fill"
        case .internet: return "wifi"
        case .cleaning: return "sparkles"
        case .maintenance: return "wrench.and.screwdriver.fill"
        case .furniture: return "sofa.fill"
        case .entertainment: return "tv.fill"
        case .other: return "ellipsis.circle.fill"
        }
    }

    var color: String {
        switch self {
        case .rent: return "6E56CF"
        case .utilities: return "F59E0B"
        case .groceries: return "10B981"
        case .internet: return "3B82F6"
        case .cleaning: return "8B5CF6"
        case .maintenance: return "EF4444"
        case .furniture: return "F97316"
        case .entertainment: return "EC4899"
        case .other: return "9CA3AF"
        }
    }
}

// MARK: - Split Type
enum SplitType: String, Codable, CaseIterable {
    case equal = "equal"
    case custom = "custom"

    var displayName: String {
        switch self {
        case .equal: return "Égale"
        case .custom: return "Personnalisée"
        }
    }
}

// MARK: - Balance
struct Balance: Identifiable {
    let id = UUID()
    var fromUserId: UUID
    var fromUserName: String
    var toUserId: UUID
    var toUserName: String
    var amount: Double

    var formattedAmount: String {
        String(format: "%.2f€", amount)
    }

    var description: String {
        "\(fromUserName) doit \(formattedAmount) à \(toUserName)"
    }
}

// MARK: - Mock Data pour mode démo
extension Expense {
    static let mockExpenses: [Expense] = [
        Expense(
            householdId: UUID(),
            title: "Courses de la semaine",
            description: "Carrefour - Courses hebdomadaires",
            amount: 85.50,
            category: .groceries,
            paidById: UUID(),
            paidByName: "Marie",
            date: Calendar.current.date(byAdding: .day, value: -2, to: Date())!,
            splitType: .equal,
            splits: [
                ExpenseSplit(userId: UUID(), userName: "Marie", amount: 21.38, isPaid: true),
                ExpenseSplit(userId: UUID(), userName: "Thomas", amount: 21.38, isPaid: false),
                ExpenseSplit(userId: UUID(), userName: "Sophie", amount: 21.38, isPaid: false),
                ExpenseSplit(userId: UUID(), userName: "Marc", amount: 21.36, isPaid: false)
            ]
        ),
        Expense(
            householdId: UUID(),
            title: "Facture d'électricité",
            amount: 120.00,
            category: .utilities,
            paidById: UUID(),
            paidByName: "Thomas",
            date: Calendar.current.date(byAdding: .day, value: -5, to: Date())!,
            splitType: .equal,
            splits: [
                ExpenseSplit(userId: UUID(), userName: "Marie", amount: 30.00, isPaid: true),
                ExpenseSplit(userId: UUID(), userName: "Thomas", amount: 30.00, isPaid: true),
                ExpenseSplit(userId: UUID(), userName: "Sophie", amount: 30.00, isPaid: false),
                ExpenseSplit(userId: UUID(), userName: "Marc", amount: 30.00, isPaid: false)
            ]
        ),
        Expense(
            householdId: UUID(),
            title: "Abonnement Internet",
            amount: 45.00,
            category: .internet,
            paidById: UUID(),
            paidByName: "Sophie",
            date: Calendar.current.date(byAdding: .day, value: -10, to: Date())!,
            splitType: .equal,
            splits: [
                ExpenseSplit(userId: UUID(), userName: "Marie", amount: 11.25, isPaid: true),
                ExpenseSplit(userId: UUID(), userName: "Thomas", amount: 11.25, isPaid: true),
                ExpenseSplit(userId: UUID(), userName: "Sophie", amount: 11.25, isPaid: true),
                ExpenseSplit(userId: UUID(), userName: "Marc", amount: 11.25, isPaid: false)
            ]
        ),
        Expense(
            householdId: UUID(),
            title: "Produits de nettoyage",
            amount: 32.90,
            category: .cleaning,
            paidById: UUID(),
            paidByName: "Marc",
            date: Calendar.current.date(byAdding: .day, value: -15, to: Date())!,
            splitType: .equal,
            splits: [
                ExpenseSplit(userId: UUID(), userName: "Marie", amount: 8.23, isPaid: true),
                ExpenseSplit(userId: UUID(), userName: "Thomas", amount: 8.23, isPaid: true),
                ExpenseSplit(userId: UUID(), userName: "Sophie", amount: 8.23, isPaid: true),
                ExpenseSplit(userId: UUID(), userName: "Marc", amount: 8.21, isPaid: true)
            ]
        ),
        Expense(
            householdId: UUID(),
            title: "Réparation lave-vaisselle",
            description: "Technicien pour réparer le lave-vaisselle",
            amount: 150.00,
            category: .maintenance,
            paidById: UUID(),
            paidByName: "Marie",
            date: Calendar.current.date(byAdding: .day, value: -20, to: Date())!,
            splitType: .equal,
            splits: [
                ExpenseSplit(userId: UUID(), userName: "Marie", amount: 37.50, isPaid: true),
                ExpenseSplit(userId: UUID(), userName: "Thomas", amount: 37.50, isPaid: true),
                ExpenseSplit(userId: UUID(), userName: "Sophie", amount: 37.50, isPaid: true),
                ExpenseSplit(userId: UUID(), userName: "Marc", amount: 37.50, isPaid: true)
            ]
        ),
        Expense(
            householdId: UUID(),
            title: "Pizza party",
            description: "Soirée entre colocataires",
            amount: 60.00,
            category: .entertainment,
            paidById: UUID(),
            paidByName: "Thomas",
            date: Calendar.current.date(byAdding: .day, value: -7, to: Date())!,
            splitType: .equal,
            splits: [
                ExpenseSplit(userId: UUID(), userName: "Marie", amount: 15.00, isPaid: true),
                ExpenseSplit(userId: UUID(), userName: "Thomas", amount: 15.00, isPaid: true),
                ExpenseSplit(userId: UUID(), userName: "Sophie", amount: 15.00, isPaid: false),
                ExpenseSplit(userId: UUID(), userName: "Marc", amount: 15.00, isPaid: false)
            ]
        )
    ]

    static let mockBalances: [Balance] = [
        Balance(fromUserId: UUID(), fromUserName: "Thomas", toUserId: UUID(), toUserName: "Marie", amount: 15.50),
        Balance(fromUserId: UUID(), fromUserName: "Sophie", toUserId: UUID(), toUserName: "Marie", amount: 42.30),
        Balance(fromUserId: UUID(), fromUserName: "Marc", toUserId: UUID(), toUserName: "Thomas", amount: 28.75),
        Balance(fromUserId: UUID(), fromUserName: "Marc", toUserId: UUID(), toUserName: "Sophie", amount: 11.25)
    ]
}
