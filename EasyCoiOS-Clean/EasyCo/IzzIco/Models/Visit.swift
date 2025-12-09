//
//  Visit.swift
//  IzzIco
//
//  Model for property visits
//

import Foundation

// MARK: - Visit Model

struct Visit: Identifiable, Codable {
    let id: UUID
    let applicationId: UUID
    let propertyId: UUID
    let applicantName: String
    let applicantAvatar: String?
    let propertyTitle: String
    var scheduledDate: Date
    var status: VisitStatus
    var duration: Int // in minutes
    var notes: String?
    var ownerNotes: String? // Private notes after visit
    var createdAt: Date
    var confirmedAt: Date?
    var cancelledAt: Date?
    var cancelReason: String?

    // Computed
    var isPast: Bool {
        scheduledDate < Date()
    }

    var isToday: Bool {
        Calendar.current.isDateInToday(scheduledDate)
    }

    var isTomorrow: Bool {
        Calendar.current.isDateInTomorrow(scheduledDate)
    }

    var canCancel: Bool {
        status == .scheduled && !isPast
    }

    var canReschedule: Bool {
        status == .scheduled && !isPast
    }

    static var mockVisits: [Visit] {
        [
            Visit(
                id: UUID(),
                applicationId: UUID(),
                propertyId: UUID(),
                applicantName: "Sophie Martin",
                applicantAvatar: nil,
                propertyTitle: "Studio meublé - Ixelles",
                scheduledDate: Date().addingTimeInterval(3600 * 2), // Dans 2h
                status: .scheduled,
                duration: 30,
                notes: "Visite demandée pour ce week-end",
                ownerNotes: nil,
                createdAt: Date().addingTimeInterval(-86400),
                confirmedAt: Date().addingTimeInterval(-3600),
                cancelledAt: nil,
                cancelReason: nil
            ),
            Visit(
                id: UUID(),
                applicationId: UUID(),
                propertyId: UUID(),
                applicantName: "Thomas & Marie",
                applicantAvatar: nil,
                propertyTitle: "2 chambres - Saint-Gilles",
                scheduledDate: Date().addingTimeInterval(86400), // Demain
                status: .scheduled,
                duration: 45,
                notes: "Préfère le matin",
                ownerNotes: nil,
                createdAt: Date().addingTimeInterval(-172800),
                confirmedAt: Date().addingTimeInterval(-86400),
                cancelledAt: nil,
                cancelReason: nil
            ),
            Visit(
                id: UUID(),
                applicationId: UUID(),
                propertyId: UUID(),
                applicantName: "Lucas Dubois",
                applicantAvatar: nil,
                propertyTitle: "Colocation - Schaerbeek",
                scheduledDate: Date().addingTimeInterval(-3600), // Il y a 1h (passée)
                status: .completed,
                duration: 30,
                notes: nil,
                ownerNotes: "Candidat très intéressé, profil sérieux",
                createdAt: Date().addingTimeInterval(-259200),
                confirmedAt: Date().addingTimeInterval(-172800),
                cancelledAt: nil,
                cancelReason: nil
            ),
            Visit(
                id: UUID(),
                applicationId: UUID(),
                propertyId: UUID(),
                applicantName: "Emma Petit",
                applicantAvatar: nil,
                propertyTitle: "Studio meublé - Ixelles",
                scheduledDate: Date().addingTimeInterval(-86400 * 2), // Il y a 2 jours
                status: .cancelled,
                duration: 30,
                notes: nil,
                ownerNotes: nil,
                createdAt: Date().addingTimeInterval(-86400 * 3),
                confirmedAt: Date().addingTimeInterval(-86400 * 2.5),
                cancelledAt: Date().addingTimeInterval(-86400 * 2),
                cancelReason: "Candidat a trouvé un autre logement"
            )
        ]
    }
}

// MARK: - Visit Status

enum VisitStatus: String, Codable, CaseIterable {
    case pending = "pending"
    case scheduled = "scheduled"
    case confirmed = "confirmed"
    case completed = "completed"
    case cancelled = "cancelled"
    case noShow = "no_show"

    var displayName: String {
        switch self {
        case .pending: return "En attente"
        case .scheduled: return "Planifiée"
        case .confirmed: return "Confirmée"
        case .completed: return "Terminée"
        case .cancelled: return "Annulée"
        case .noShow: return "Absent"
        }
    }

    var color: String {
        switch self {
        case .pending: return "FBBF24" // Yellow
        case .scheduled: return "3B82F6" // Blue
        case .confirmed: return "10B981" // Green
        case .completed: return "6B7280" // Gray
        case .cancelled: return "EF4444" // Red
        case .noShow: return "F97316" // Orange
        }
    }

    var icon: String {
        switch self {
        case .pending: return "clock.fill"
        case .scheduled: return "calendar"
        case .confirmed: return "checkmark.circle.fill"
        case .completed: return "checkmark.seal.fill"
        case .cancelled: return "xmark.circle.fill"
        case .noShow: return "exclamationmark.triangle.fill"
        }
    }
}

// MARK: - Time Slot

struct TimeSlot: Identifiable {
    let id = UUID()
    let date: Date
    let isAvailable: Bool
    let isSelected: Bool
    var isFeatured: Bool = false

    var displayTime: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: date)
    }

    var time: String {
        return displayTime
    }
}
