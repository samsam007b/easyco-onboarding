//
//  CalendarViewModel.swift
//  EasyCo
//
//  ViewModel pour la gestion du calendrier partagé
//

import Foundation
import SwiftUI

@MainActor
class CalendarViewModel: ObservableObject {
    // MARK: - Published Properties

    @Published var events: [Event] = []
    @Published var filteredEvents: [Event] = []
    @Published var selectedDate = Date()
    @Published var currentMonth = Date()
    @Published var viewMode: CalendarViewMode = .month

    // UI State
    @Published var isLoading = false
    @Published var showCreateEvent = false
    @Published var selectedEvent: Event?
    @Published var showEventDetail = false
    @Published var errorMessage: String?
    @Published var showError = false

    // Filters
    @Published var selectedEventType: EventType?

    // MARK: - Computed Properties

    var eventsForSelectedDate: [Event] {
        events.filter { event in
            Calendar.current.isDate(event.startDate, inSameDayAs: selectedDate)
        }
    }

    var upcomingEvents: [Event] {
        events.filter { $0.isUpcoming }.sorted { $0.startDate < $1.startDate }
    }

    // MARK: - Initialization

    init() {
        loadEvents()
    }

    // MARK: - Data Loading

    func loadEvents() {
        isLoading = true

        _Concurrency.Task {
            do {
                if AppConfig.FeatureFlags.demoMode {
                    try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
                    self.events = Event.mockEvents
                } else {
                    // TODO: API call
                    self.events = []
                }

                self.applyFilters()
                self.isLoading = false
            } catch {
                self.errorMessage = "Erreur lors du chargement des événements"
                self.showError = true
                self.isLoading = false
            }
        }
    }

    func refresh() async {
        loadEvents()
    }

    // MARK: - CRUD Operations

    func createEvent(_ event: Event) async {
        do {
            if AppConfig.FeatureFlags.demoMode {
                try? await _Concurrency.Task.sleep(nanoseconds: 300_000_000)
                events.append(event)
                events.sort { $0.startDate < $1.startDate }
            } else {
                // TODO: API call
            }

            applyFilters()
        } catch {
            errorMessage = "Erreur lors de la création de l'événement"
            showError = true
        }
    }

    func updateEvent(_ event: Event) async {
        do {
            if AppConfig.FeatureFlags.demoMode {
                try? await _Concurrency.Task.sleep(nanoseconds: 300_000_000)
                if let index = events.firstIndex(where: { $0.id == event.id }) {
                    events[index] = event
                }
            } else {
                // TODO: API call
            }

            applyFilters()
        } catch {
            errorMessage = "Erreur lors de la mise à jour"
            showError = true
        }
    }

    func deleteEvent(_ eventId: UUID) async {
        do {
            if AppConfig.FeatureFlags.demoMode {
                try? await _Concurrency.Task.sleep(nanoseconds: 300_000_000)
                events.removeAll { $0.id == eventId }
            } else {
                // TODO: API call
            }

            applyFilters()
        } catch {
            errorMessage = "Erreur lors de la suppression"
            showError = true
        }
    }

    func updateRSVP(eventId: UUID, status: RSVPStatus) async {
        guard let index = events.firstIndex(where: { $0.id == eventId }) else { return }

        // TODO: Update with real user ID
        if var attendees = events[index].attendees,
           let attendeeIndex = attendees.firstIndex(where: { _ in true }) {
            attendees[attendeeIndex].rsvpStatus = status
            attendees[attendeeIndex].respondedAt = Date()
            events[index].attendees = attendees

            await updateEvent(events[index])
        }
    }

    // MARK: - Filtering

    func applyFilters() {
        var result = events

        if let type = selectedEventType {
            result = result.filter { $0.type == type }
        }

        filteredEvents = result
    }

    // MARK: - Calendar Helpers

    func getEventsForDate(_ date: Date) -> [Event] {
        events.filter { event in
            Calendar.current.isDate(event.startDate, inSameDayAs: date)
        }
    }

    func hasEventsOnDate(_ date: Date) -> Bool {
        !getEventsForDate(date).isEmpty
    }

    func moveToNextMonth() {
        if let newDate = Calendar.current.date(byAdding: .month, value: 1, to: currentMonth) {
            currentMonth = newDate
        }
    }

    func moveToPreviousMonth() {
        if let newDate = Calendar.current.date(byAdding: .month, value: -1, to: currentMonth) {
            currentMonth = newDate
        }
    }

    func moveToToday() {
        currentMonth = Date()
        selectedDate = Date()
    }
}

// MARK: - Calendar View Mode

enum CalendarViewMode: String, CaseIterable {
    case month = "month"
    case week = "week"
    case list = "list"

    var displayName: String {
        switch self {
        case .month: return "Mois"
        case .week: return "Semaine"
        case .list: return "Liste"
        }
    }

    var icon: String {
        switch self {
        case .month: return "calendar"
        case .week: return "calendar.day.timeline.left"
        case .list: return "list.bullet"
        }
    }
}
