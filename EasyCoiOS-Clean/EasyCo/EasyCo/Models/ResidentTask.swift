//
//  ResidentTask.swift
//  EasyCo
//
//  Modèle représentant une tâche ménagère dans la colocation
//  ATTENTION : Nommé "ResidentTask" pour éviter le conflit avec le type Task de Swift
//

import Foundation

struct ResidentTask: Identifiable, Codable {
    let id: UUID
    var householdId: UUID
    var title: String
    var description: String?
    var assigneeId: UUID?
    var assigneeName: String? // Pour l'affichage
    var category: TaskCategory
    var priority: TaskPriority
    var dueDate: Date?
    var isCompleted: Bool
    var completedAt: Date?
    var completedById: UUID?
    var proofImageURL: String?
    var isRecurring: Bool
    var recurringPattern: RecurringPattern?
    var recurringDays: [WeekDay]?
    var createdById: UUID
    var createdAt: Date
    var updatedAt: Date

    // Computed properties
    var isOverdue: Bool {
        guard let dueDate = dueDate, !isCompleted else { return false }
        return dueDate < Date()
    }

    var isDueToday: Bool {
        guard let dueDate = dueDate, !isCompleted else { return false }
        return Calendar.current.isDateInToday(dueDate)
    }

    var isDueSoon: Bool {
        guard let dueDate = dueDate, !isCompleted else { return false }
        let tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: Date())!
        return Calendar.current.isDate(dueDate, inSameDayAs: tomorrow)
    }

    var statusText: String {
        if isCompleted {
            return "Terminée"
        } else if isOverdue {
            return "En retard"
        } else if isDueToday {
            return "Aujourd'hui"
        } else if isDueSoon {
            return "Demain"
        } else {
            return "À faire"
        }
    }

    init(
        id: UUID = UUID(),
        householdId: UUID,
        title: String,
        description: String? = nil,
        assigneeId: UUID? = nil,
        assigneeName: String? = nil,
        category: TaskCategory = .cleaning,
        priority: TaskPriority = .normal,
        dueDate: Date? = nil,
        isCompleted: Bool = false,
        completedAt: Date? = nil,
        completedById: UUID? = nil,
        proofImageURL: String? = nil,
        isRecurring: Bool = false,
        recurringPattern: RecurringPattern? = nil,
        recurringDays: [WeekDay]? = nil,
        createdById: UUID,
        createdAt: Date = Date(),
        updatedAt: Date = Date()
    ) {
        self.id = id
        self.householdId = householdId
        self.title = title
        self.description = description
        self.assigneeId = assigneeId
        self.assigneeName = assigneeName
        self.category = category
        self.priority = priority
        self.dueDate = dueDate
        self.isCompleted = isCompleted
        self.completedAt = completedAt
        self.completedById = completedById
        self.proofImageURL = proofImageURL
        self.isRecurring = isRecurring
        self.recurringPattern = recurringPattern
        self.recurringDays = recurringDays
        self.createdById = createdById
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
}

// MARK: - Task Category
enum TaskCategory: String, Codable, CaseIterable {
    case cleaning = "cleaning"
    case cooking = "cooking"
    case shopping = "shopping"
    case maintenance = "maintenance"
    case trash = "trash"
    case laundry = "laundry"
    case dishes = "dishes"
    case other = "other"

    var displayName: String {
        switch self {
        case .cleaning: return "Ménage"
        case .cooking: return "Cuisine"
        case .shopping: return "Courses"
        case .maintenance: return "Maintenance"
        case .trash: return "Poubelles"
        case .laundry: return "Lessive"
        case .dishes: return "Vaisselle"
        case .other: return "Autre"
        }
    }

    var icon: String {
        switch self {
        case .cleaning: return "sparkles"
        case .cooking: return "fork.knife"
        case .shopping: return "cart.fill"
        case .maintenance: return "wrench.and.screwdriver.fill"
        case .trash: return "trash.fill"
        case .laundry: return "washer.fill"
        case .dishes: return "sink.fill"
        case .other: return "ellipsis.circle.fill"
        }
    }

    var color: String {
        switch self {
        case .cleaning: return "10B981"
        case .cooking: return "F59E0B"
        case .shopping: return "3B82F6"
        case .maintenance: return "EF4444"
        case .trash: return "6B7280"
        case .laundry: return "8B5CF6"
        case .dishes: return "06B6D4"
        case .other: return "9CA3AF"
        }
    }
}

// MARK: - Task Priority
enum TaskPriority: String, Codable, CaseIterable {
    case low = "low"
    case normal = "normal"
    case high = "high"
    case urgent = "urgent"

    var displayName: String {
        switch self {
        case .low: return "Basse"
        case .normal: return "Normale"
        case .high: return "Haute"
        case .urgent: return "Urgente"
        }
    }

    var color: String {
        switch self {
        case .low: return "9CA3AF"
        case .normal: return "3B82F6"
        case .high: return "F59E0B"
        case .urgent: return "EF4444"
        }
    }
}

// MARK: - Recurring Pattern
enum RecurringPattern: String, Codable {
    case daily = "daily"
    case weekly = "weekly"
    case biweekly = "biweekly"
    case monthly = "monthly"

    var displayName: String {
        switch self {
        case .daily: return "Tous les jours"
        case .weekly: return "Chaque semaine"
        case .biweekly: return "Toutes les 2 semaines"
        case .monthly: return "Chaque mois"
        }
    }
}

// MARK: - Week Day
enum WeekDay: String, Codable, CaseIterable {
    case monday = "monday"
    case tuesday = "tuesday"
    case wednesday = "wednesday"
    case thursday = "thursday"
    case friday = "friday"
    case saturday = "saturday"
    case sunday = "sunday"

    var displayName: String {
        switch self {
        case .monday: return "Lundi"
        case .tuesday: return "Mardi"
        case .wednesday: return "Mercredi"
        case .thursday: return "Jeudi"
        case .friday: return "Vendredi"
        case .saturday: return "Samedi"
        case .sunday: return "Dimanche"
        }
    }

    var shortName: String {
        switch self {
        case .monday: return "Lun"
        case .tuesday: return "Mar"
        case .wednesday: return "Mer"
        case .thursday: return "Jeu"
        case .friday: return "Ven"
        case .saturday: return "Sam"
        case .sunday: return "Dim"
        }
    }
}

// MARK: - Mock Data pour mode démo
extension ResidentTask {
    static let mockTasks: [ResidentTask] = [
        ResidentTask(
            householdId: UUID(),
            title: "Sortir les poubelles",
            description: "Les poubelles doivent être sorties avant 8h",
            assigneeId: UUID(),
            assigneeName: "Marie",
            category: .trash,
            priority: .normal,
            dueDate: Calendar.current.date(byAdding: .day, value: 0, to: Date())!,
            isCompleted: false,
            isRecurring: true,
            recurringPattern: .weekly,
            recurringDays: [.tuesday, .friday],
            createdById: UUID()
        ),
        ResidentTask(
            householdId: UUID(),
            title: "Nettoyer la cuisine",
            description: "Nettoyer le plan de travail, l'évier et la gazinière",
            assigneeId: UUID(),
            assigneeName: "Thomas",
            category: .cleaning,
            priority: .high,
            dueDate: Calendar.current.date(byAdding: .day, value: 0, to: Date())!,
            isCompleted: false,
            isRecurring: false,
            createdById: UUID()
        ),
        ResidentTask(
            householdId: UUID(),
            title: "Faire les courses",
            description: "Acheter du lait, pain, fruits et légumes",
            assigneeId: UUID(),
            assigneeName: "Sophie",
            category: .shopping,
            priority: .normal,
            dueDate: Calendar.current.date(byAdding: .day, value: 1, to: Date())!,
            isCompleted: false,
            isRecurring: false,
            createdById: UUID()
        ),
        ResidentTask(
            householdId: UUID(),
            title: "Passer l'aspirateur",
            description: "Salon et couloir",
            assigneeId: UUID(),
            assigneeName: "Marc",
            category: .cleaning,
            priority: .low,
            dueDate: Calendar.current.date(byAdding: .day, value: 2, to: Date())!,
            isCompleted: false,
            isRecurring: true,
            recurringPattern: .weekly,
            recurringDays: [.saturday],
            createdById: UUID()
        ),
        ResidentTask(
            householdId: UUID(),
            title: "Réparer le robinet qui fuit",
            description: "Appeler le plombier ou essayer de réparer soi-même",
            assigneeId: UUID(),
            assigneeName: "Julie",
            category: .maintenance,
            priority: .urgent,
            dueDate: Calendar.current.date(byAdding: .day, value: -1, to: Date())!,
            isCompleted: false,
            isRecurring: false,
            createdById: UUID()
        ),
        ResidentTask(
            householdId: UUID(),
            title: "Nettoyer la salle de bain",
            assigneeId: UUID(),
            assigneeName: "Thomas",
            category: .cleaning,
            priority: .normal,
            dueDate: Calendar.current.date(byAdding: .day, value: -3, to: Date())!,
            isCompleted: true,
            completedAt: Calendar.current.date(byAdding: .day, value: -3, to: Date())!,
            completedById: UUID(),
            isRecurring: false,
            createdById: UUID()
        )
    ]
}
