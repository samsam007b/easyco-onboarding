//
//  MaintenanceTask.swift
//  IzzIco
//
//  Maintenance task model for property management
//

import Foundation
import SwiftUI

// MARK: - Maintenance Task

struct MaintenanceTask: Identifiable, Codable {
    let id: UUID
    let propertyId: UUID
    let propertyTitle: String
    var title: String
    var description: String
    var category: MaintenanceCategory
    var priority: MaintenancePriority
    var status: MaintenanceStatus
    var assignedTo: AssignedTo
    var contractorId: UUID?
    var contractorName: String?
    var dueDate: Date?
    var estimatedCost: Double?
    var actualCost: Double?
    var photos: [String]
    var createdAt: Date
    var updatedAt: Date
    var completedAt: Date?

    // Computed properties
    var isOverdue: Bool {
        guard let dueDate = dueDate, status != .completed else { return false }
        return dueDate < Date()
    }

    var isUrgent: Bool {
        priority == .urgent
    }

    var costDifference: Double? {
        guard let estimated = estimatedCost, let actual = actualCost else { return nil }
        return actual - estimated
    }

    var isPending: Bool {
        status == .pending
    }

    static var mockTasks: [MaintenanceTask] {
        [
            MaintenanceTask(
                id: UUID(),
                propertyId: UUID(),
                propertyTitle: "Studio meublé - Ixelles",
                title: "Fuite d'eau salle de bain",
                description: "Fuite au niveau du lavabo, nécessite intervention rapide",
                category: .plumbing,
                priority: .urgent,
                status: .inProgress,
                assignedTo: .contractor,
                contractorId: UUID(),
                contractorName: "PlomPro Services",
                dueDate: Date().addingTimeInterval(86400), // Tomorrow
                estimatedCost: 150.0,
                actualCost: nil,
                photos: [],
                createdAt: Date().addingTimeInterval(-172800),
                updatedAt: Date().addingTimeInterval(-3600),
                completedAt: nil
            ),
            MaintenanceTask(
                id: UUID(),
                propertyId: UUID(),
                propertyTitle: "2 chambres - Saint-Gilles",
                title: "Remplacement ampoules",
                description: "3 ampoules grillées dans le salon et la chambre",
                category: .electricity,
                priority: .low,
                status: .pending,
                assignedTo: .myself,
                contractorId: nil,
                contractorName: nil,
                dueDate: Date().addingTimeInterval(604800), // Next week
                estimatedCost: 20.0,
                actualCost: nil,
                photos: [],
                createdAt: Date().addingTimeInterval(-86400),
                updatedAt: Date().addingTimeInterval(-86400),
                completedAt: nil
            ),
            MaintenanceTask(
                id: UUID(),
                propertyId: UUID(),
                propertyTitle: "Colocation - Schaerbeek",
                title: "Peinture cuisine",
                description: "Rafraîchir la peinture de la cuisine avant nouvelle location",
                category: .painting,
                priority: .normal,
                status: .pending,
                assignedTo: .contractor,
                contractorId: UUID(),
                contractorName: "ColorPro",
                dueDate: Date().addingTimeInterval(1209600), // In 2 weeks
                estimatedCost: 450.0,
                actualCost: nil,
                photos: [],
                createdAt: Date().addingTimeInterval(-259200),
                updatedAt: Date().addingTimeInterval(-259200),
                completedAt: nil
            ),
            MaintenanceTask(
                id: UUID(),
                propertyId: UUID(),
                propertyTitle: "Studio meublé - Ixelles",
                title: "Nettoyage fin de bail",
                description: "Nettoyage complet après départ locataire",
                category: .cleaning,
                priority: .high,
                status: .completed,
                assignedTo: .contractor,
                contractorId: UUID(),
                contractorName: "CleanExpress",
                dueDate: Date().addingTimeInterval(-172800),
                estimatedCost: 120.0,
                actualCost: 115.0,
                photos: [],
                createdAt: Date().addingTimeInterval(-604800),
                updatedAt: Date().addingTimeInterval(-86400),
                completedAt: Date().addingTimeInterval(-86400)
            ),
            MaintenanceTask(
                id: UUID(),
                propertyId: UUID(),
                propertyTitle: "2 chambres - Saint-Gilles",
                title: "Réparation chauffage",
                description: "Radiateur de la chambre 2 ne chauffe plus",
                category: .heating,
                priority: .high,
                status: .inProgress,
                assignedTo: .contractor,
                contractorId: UUID(),
                contractorName: "Chauffage Plus",
                dueDate: Date().addingTimeInterval(172800), // In 2 days
                estimatedCost: 200.0,
                actualCost: nil,
                photos: [],
                createdAt: Date().addingTimeInterval(-432000),
                updatedAt: Date().addingTimeInterval(-3600),
                completedAt: nil
            )
        ]
    }
}

// MARK: - Maintenance Category

enum MaintenanceCategory: String, Codable, CaseIterable {
    case plumbing = "Plomberie"
    case electricity = "Électricité"
    case heating = "Chauffage"
    case painting = "Peinture"
    case cleaning = "Nettoyage"
    case appliances = "Électroménager"
    case locksmith = "Serrurerie"
    case carpentry = "Menuiserie"
    case roofing = "Toiture"
    case other = "Autre"

    var displayName: String {
        self.rawValue
    }

    var icon: String {
        switch self {
        case .plumbing: return "drop.fill"
        case .electricity: return "bolt.fill"
        case .heating: return "flame.fill"
        case .painting: return "paintbrush.fill"
        case .cleaning: return "sparkles"
        case .appliances: return "refrigerator.fill"
        case .locksmith: return "key.fill"
        case .carpentry: return "hammer.fill"
        case .roofing: return "house.fill"
        case .other: return "wrench.and.screwdriver.fill"
        }
    }

    var color: String {
        switch self {
        case .plumbing: return "3B82F6"      // Blue
        case .electricity: return "FBBF24"   // Yellow
        case .heating: return "F97316"       // Orange
        case .painting: return "8B5CF6"      // Purple
        case .cleaning: return "10B981"      // Green
        case .appliances: return "6366F1"    // Indigo
        case .locksmith: return "EC4899"     // Pink
        case .carpentry: return "84CC16"     // Lime
        case .roofing: return "EF4444"       // Red
        case .other: return "6B7280"         // Gray
        }
    }
}

// MARK: - Maintenance Priority

enum MaintenancePriority: String, Codable, CaseIterable {
    case urgent = "Urgente"
    case high = "Haute"
    case normal = "Normale"
    case low = "Basse"

    var displayName: String {
        self.rawValue
    }

    var label: String {
        self.rawValue
    }

    var colorHex: String {
        switch self {
        case .urgent: return "EF4444"   // Red
        case .high: return "F97316"     // Orange
        case .normal: return "FBBF24"   // Yellow
        case .low: return "10B981"      // Green
        }
    }

    var color: Color {
        switch self {
        case .urgent: return Color(hex: "EF4444")
        case .high: return Color(hex: "F97316")
        case .normal: return Color(hex: "FBBF24")
        case .low: return Color(hex: "10B981")
        }
    }

    var icon: String {
        switch self {
        case .urgent: return "exclamationmark.3"
        case .high: return "exclamationmark.2"
        case .normal: return "exclamationmark"
        case .low: return "minus"
        }
    }
}

// MARK: - Maintenance Status

enum MaintenanceStatus: String, Codable, CaseIterable {
    case pending = "À faire"
    case inProgress = "En cours"
    case completed = "Terminée"
    case cancelled = "Annulée"

    var displayName: String {
        self.rawValue
    }

    var label: String {
        self.rawValue
    }

    var colorHex: String {
        switch self {
        case .pending: return "9CA3AF"      // Gray
        case .inProgress: return "3B82F6"   // Blue
        case .completed: return "10B981"    // Green
        case .cancelled: return "EF4444"    // Red
        }
    }

    var color: Color {
        switch self {
        case .pending: return Color(hex: "9CA3AF")
        case .inProgress: return Color(hex: "3B82F6")
        case .completed: return Color(hex: "10B981")
        case .cancelled: return Color(hex: "EF4444")
        }
    }

    var icon: String {
        switch self {
        case .pending: return "clock"
        case .inProgress: return "gear"
        case .completed: return "checkmark.circle.fill"
        case .cancelled: return "xmark.circle.fill"
        }
    }
}

// MARK: - Assigned To

enum AssignedTo: String, Codable, CaseIterable {
    case myself = "Moi-même"
    case contractor = "Prestataire"
    case tenant = "Locataire"

    var displayName: String {
        self.rawValue
    }

    var icon: String {
        switch self {
        case .myself: return "person.fill"
        case .contractor: return "person.2.fill"
        case .tenant: return "house.fill"
        }
    }
}

// MARK: - Maintenance Stats

struct MaintenanceStats {
    let totalTasks: Int
    let pendingTasks: Int
    let inProgressTasks: Int
    let completedTasks: Int
    let urgentTasks: Int
    let overdueTasks: Int
    let totalEstimatedCost: Double
    let totalActualCost: Double
    let monthlyAverageCost: Double

    var completionRate: Double {
        guard totalTasks > 0 else { return 0 }
        return Double(completedTasks) / Double(totalTasks) * 100
    }

    var costDifference: Double {
        totalActualCost - totalEstimatedCost
    }

    static func from(tasks: [MaintenanceTask]) -> MaintenanceStats {
        let pending = tasks.filter { $0.status == .pending }.count
        let inProgress = tasks.filter { $0.status == .inProgress }.count
        let completed = tasks.filter { $0.status == .completed }.count
        let urgent = tasks.filter { $0.priority == .urgent }.count
        let overdue = tasks.filter { $0.isOverdue }.count

        let estimated = tasks.compactMap { $0.estimatedCost }.reduce(0, +)
        let actual = tasks.compactMap { $0.actualCost }.reduce(0, +)

        return MaintenanceStats(
            totalTasks: tasks.count,
            pendingTasks: pending,
            inProgressTasks: inProgress,
            completedTasks: completed,
            urgentTasks: urgent,
            overdueTasks: overdue,
            totalEstimatedCost: estimated,
            totalActualCost: actual,
            monthlyAverageCost: actual / 12.0 // Simplified, would be based on date range
        )
    }
}
