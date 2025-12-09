//
//  Event.swift
//  IzzIco
//
//  Modèle représentant un événement dans le calendrier de la colocation
//  Utilisé pour gérer les événements, soirées, invités, etc.
//

import Foundation

struct Event: Identifiable, Codable {
    let id: UUID
    var householdId: UUID
    var title: String
    var description: String?
    var type: EventType
    var startDate: Date
    var endDate: Date?
    var isAllDay: Bool
    var location: String?
    var organizerId: UUID
    var organizerName: String?
    var attendeeIds: [UUID]
    var attendees: [EventAttendee]?
    var isRecurring: Bool
    var recurringPattern: RecurringPattern?
    var reminderMinutesBefore: Int?
    var createdAt: Date
    var updatedAt: Date

    // Computed properties
    var isPast: Bool {
        if let endDate = endDate {
            return endDate < Date()
        }
        return startDate < Date()
    }

    var isToday: Bool {
        Calendar.current.isDateInToday(startDate)
    }

    var isTomorrow: Bool {
        let tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: Date())!
        return Calendar.current.isDate(startDate, inSameDayAs: tomorrow)
    }

    var isUpcoming: Bool {
        startDate > Date()
    }

    // Alias for views that use eventType instead of type
    var eventType: EventType {
        type
    }

    // Color from event type
    var color: String {
        type.color
    }

    // RSVP helpers
    var rsvpRequired: Bool {
        attendees != nil && !(attendees?.isEmpty ?? true)
    }

    var participants: [EventAttendee] {
        attendees ?? []
    }

    var acceptedCount: Int {
        participants.filter { $0.rsvpStatus == .accepted }.count
    }

    var formattedDuration: String {
        duration ?? ""
    }

    // Alias for views that use createdByName instead of organizerName
    var createdByName: String {
        organizerName ?? "Inconnu"
    }

    // Alias for views that use recurrencePattern instead of recurringPattern
    var recurrencePattern: RecurringPattern? {
        recurringPattern
    }

    // Guest-related computed properties for EventDetailView
    var hasGuests: Bool {
        type == .guest
    }

    var numberOfGuests: Int {
        attendees?.count ?? attendeeIds.count
    }

    var guestNames: [String] {
        attendees?.map { $0.userName } ?? []
    }

    var isThisWeek: Bool {
        let calendar = Calendar.current
        let now = Date()
        return calendar.isDate(startDate, equalTo: now, toGranularity: .weekOfYear)
    }

    var formattedDate: String {
        let formatter = DateFormatter()
        if isAllDay {
            formatter.dateStyle = .medium
            formatter.timeStyle = .none
            return formatter.string(from: startDate)
        } else {
            formatter.dateStyle = .medium
            formatter.timeStyle = .short
            let start = formatter.string(from: startDate)
            if let end = endDate {
                let timeFormatter = DateFormatter()
                timeFormatter.dateStyle = .none
                timeFormatter.timeStyle = .short
                return "\(start) - \(timeFormatter.string(from: end))"
            }
            return start
        }
    }

    var duration: String? {
        guard let endDate = endDate else { return nil }
        let components = Calendar.current.dateComponents([.hour, .minute], from: startDate, to: endDate)
        if let hours = components.hour, let minutes = components.minute {
            if hours > 0 && minutes > 0 {
                return "\(hours)h\(minutes)"
            } else if hours > 0 {
                return "\(hours)h"
            } else if minutes > 0 {
                return "\(minutes)min"
            }
        }
        return nil
    }

    init(
        id: UUID = UUID(),
        householdId: UUID,
        title: String,
        description: String? = nil,
        type: EventType,
        startDate: Date,
        endDate: Date? = nil,
        isAllDay: Bool = false,
        location: String? = nil,
        organizerId: UUID,
        organizerName: String? = nil,
        attendeeIds: [UUID] = [],
        attendees: [EventAttendee]? = nil,
        isRecurring: Bool = false,
        recurringPattern: RecurringPattern? = nil,
        reminderMinutesBefore: Int? = nil,
        createdAt: Date = Date(),
        updatedAt: Date = Date()
    ) {
        self.id = id
        self.householdId = householdId
        self.title = title
        self.description = description
        self.type = type
        self.startDate = startDate
        self.endDate = endDate
        self.isAllDay = isAllDay
        self.location = location
        self.organizerId = organizerId
        self.organizerName = organizerName
        self.attendeeIds = attendeeIds
        self.attendees = attendees
        self.isRecurring = isRecurring
        self.recurringPattern = recurringPattern
        self.reminderMinutesBefore = reminderMinutesBefore
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
}

// MARK: - Event Attendee
struct EventAttendee: Identifiable, Codable {
    let id: UUID
    var userId: UUID
    var userName: String
    var rsvpStatus: RSVPStatus
    var respondedAt: Date?

    init(
        id: UUID = UUID(),
        userId: UUID,
        userName: String,
        rsvpStatus: RSVPStatus = .pending,
        respondedAt: Date? = nil
    ) {
        self.id = id
        self.userId = userId
        self.userName = userName
        self.rsvpStatus = rsvpStatus
        self.respondedAt = respondedAt
    }
}

// MARK: - Event Type
enum EventType: String, Codable, CaseIterable {
    case party = "party"
    case meeting = "meeting"
    case maintenance = "maintenance"
    case guest = "guest"
    case cleaning = "cleaning"
    case birthday = "birthday"
    case other = "other"

    var displayName: String {
        switch self {
        case .party: return "Soirée"
        case .meeting: return "Réunion"
        case .maintenance: return "Maintenance"
        case .guest: return "Invités"
        case .cleaning: return "Ménage collectif"
        case .birthday: return "Anniversaire"
        case .other: return "Autre"
        }
    }

    var icon: String {
        switch self {
        case .party: return "party.popper.fill"
        case .meeting: return "person.3.fill"
        case .maintenance: return "wrench.and.screwdriver.fill"
        case .guest: return "person.badge.plus.fill"
        case .cleaning: return "sparkles"
        case .birthday: return "birthday.cake.fill"
        case .other: return "calendar"
        }
    }

    var color: String {
        switch self {
        case .party: return "EC4899"
        case .meeting: return "3B82F6"
        case .maintenance: return "EF4444"
        case .guest: return "8B5CF6"
        case .cleaning: return "10B981"
        case .birthday: return "F59E0B"
        case .other: return "9CA3AF"
        }
    }
}

// MARK: - RSVP Status
enum RSVPStatus: String, Codable {
    case pending = "pending"
    case accepted = "accepted"
    case declined = "declined"
    case maybe = "maybe"

    var displayName: String {
        switch self {
        case .pending: return "En attente"
        case .accepted: return "Accepté"
        case .declined: return "Refusé"
        case .maybe: return "Peut-être"
        }
    }

    var icon: String {
        switch self {
        case .pending: return "clock"
        case .accepted: return "checkmark.circle.fill"
        case .declined: return "xmark.circle.fill"
        case .maybe: return "questionmark.circle.fill"
        }
    }

    var color: String {
        switch self {
        case .pending: return "9CA3AF"
        case .accepted: return "10B981"
        case .declined: return "EF4444"
        case .maybe: return "F59E0B"
        }
    }
}

// MARK: - Mock Data pour mode démo
extension Event {
    static let mockEvents: [Event] = [
        Event(
            householdId: UUID(),
            title: "Soirée jeux de société",
            description: "On se fait une soirée jeux à partir de 20h !",
            type: .party,
            startDate: Calendar.current.date(byAdding: .day, value: 2, to: Date())!,
            endDate: Calendar.current.date(byAdding: .hour, value: 3, to: Calendar.current.date(byAdding: .day, value: 2, to: Date())!)!,
            isAllDay: false,
            location: "Salon",
            organizerId: UUID(),
            organizerName: "Marie",
            attendeeIds: [UUID(), UUID(), UUID()],
            attendees: [
                EventAttendee(userId: UUID(), userName: "Marie", rsvpStatus: .accepted),
                EventAttendee(userId: UUID(), userName: "Thomas", rsvpStatus: .accepted),
                EventAttendee(userId: UUID(), userName: "Sophie", rsvpStatus: .maybe),
                EventAttendee(userId: UUID(), userName: "Marc", rsvpStatus: .pending)
            ],
            reminderMinutesBefore: 60
        ),
        Event(
            householdId: UUID(),
            title: "Réunion mensuelle",
            description: "Point sur les dépenses et les tâches du mois",
            type: .meeting,
            startDate: Calendar.current.date(byAdding: .day, value: 5, to: Date())!,
            endDate: Calendar.current.date(byAdding: .hour, value: 1, to: Calendar.current.date(byAdding: .day, value: 5, to: Date())!)!,
            isAllDay: false,
            organizerId: UUID(),
            organizerName: "Thomas",
            attendeeIds: [UUID(), UUID(), UUID(), UUID()],
            isRecurring: true,
            recurringPattern: .monthly,
            reminderMinutesBefore: 120
        ),
        Event(
            householdId: UUID(),
            title: "Visite technique - Chaudière",
            description: "Technicien pour l'entretien annuel de la chaudière",
            type: .maintenance,
            startDate: Calendar.current.date(byAdding: .day, value: 10, to: Date())!,
            isAllDay: false,
            organizerId: UUID(),
            organizerName: "Propriétaire",
            attendeeIds: [],
            reminderMinutesBefore: 1440
        ),
        Event(
            householdId: UUID(),
            title: "Invités de Sophie",
            description: "Ses parents viennent passer le weekend",
            type: .guest,
            startDate: Calendar.current.date(byAdding: .day, value: 7, to: Date())!,
            endDate: Calendar.current.date(byAdding: .day, value: 9, to: Date())!,
            isAllDay: true,
            organizerId: UUID(),
            organizerName: "Sophie",
            attendeeIds: [UUID(), UUID(), UUID()]
        ),
        Event(
            householdId: UUID(),
            title: "Grand ménage de printemps",
            description: "Nettoyage complet de la maison tous ensemble",
            type: .cleaning,
            startDate: Calendar.current.date(byAdding: .day, value: 15, to: Date())!,
            isAllDay: true,
            organizerId: UUID(),
            organizerName: "Marc",
            attendeeIds: [UUID(), UUID(), UUID(), UUID()]
        ),
        Event(
            householdId: UUID(),
            title: "Anniversaire de Thomas",
            description: "Fête surprise pour les 25 ans de Thomas 🎉",
            type: .birthday,
            startDate: Calendar.current.date(byAdding: .day, value: 20, to: Date())!,
            isAllDay: false,
            location: "Salon",
            organizerId: UUID(),
            organizerName: "Marie",
            attendeeIds: [UUID(), UUID(), UUID()],
            reminderMinutesBefore: 720
        ),
        Event(
            householdId: UUID(),
            title: "Barbecue sur la terrasse",
            description: "Si le temps est beau !",
            type: .party,
            startDate: Calendar.current.date(byAdding: .day, value: -3, to: Date())!,
            isAllDay: false,
            location: "Terrasse",
            organizerId: UUID(),
            organizerName: "Marc",
            attendeeIds: [UUID(), UUID(), UUID(), UUID()],
            attendees: [
                EventAttendee(userId: UUID(), userName: "Marie", rsvpStatus: .accepted),
                EventAttendee(userId: UUID(), userName: "Thomas", rsvpStatus: .accepted),
                EventAttendee(userId: UUID(), userName: "Sophie", rsvpStatus: .accepted),
                EventAttendee(userId: UUID(), userName: "Marc", rsvpStatus: .accepted)
            ]
        )
    ]
}
