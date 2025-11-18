//
//  CalendarView.swift
//  EasyCo
//
//  Vue du calendrier partagé avec liste d'événements
//

import SwiftUI

struct CalendarView: View {
    @StateObject private var viewModel = CalendarViewModel()

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Header with month navigation
                monthHeaderSection

                // Upcoming events summary
                upcomingSection

                // Events list
                if viewModel.isLoading {
                    loadingView
                } else if viewModel.filteredEvents.isEmpty {
                    emptyStateView
                } else {
                    eventsListSection
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Calendrier")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { viewModel.showCreateEvent = true }) {
                        Image(systemName: "plus.circle.fill")
                            .font(.system(size: 24))
                            .foregroundColor(Color(hex: "E8865D"))
                    }
                }
            }
            .sheet(isPresented: $viewModel.showCreateEvent) {
                CreateEventView(viewModel: viewModel)
            }
            .sheet(item: $viewModel.selectedEvent) { event in
                EventDetailView(event: event, viewModel: viewModel)
            }
            .refreshable {
                await viewModel.refresh()
            }
        }
    }

    // MARK: - Month Header

    private var monthHeaderSection: some View {
        HStack {
            Button(action: { viewModel.moveToPreviousMonth() }) {
                Image(systemName: "chevron.left")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "E8865D"))
                    .frame(width: 32, height: 32)
                    .background(Color.white)
                    .cornerRadius(8)
            }

            Spacer()

            Text(viewModel.currentMonth, format: .dateTime.month(.wide).year())
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            Spacer()

            Button(action: { viewModel.moveToNextMonth() }) {
                Image(systemName: "chevron.right")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "E8865D"))
                    .frame(width: 32, height: 32)
                    .background(Color.white)
                    .cornerRadius(8)
            }
        }
        .padding(16)
    }

    // MARK: - Upcoming Section

    private var upcomingSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("À venir")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(viewModel.upcomingEvents.prefix(5)) { event in
                        UpcomingEventCard(event: event) {
                            viewModel.selectedEvent = event
                        }
                    }
                }
            }
        }
        .padding(16)
    }

    // MARK: - Events List

    private var eventsListSection: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                ForEach(viewModel.filteredEvents.sorted { $0.startDate < $1.startDate }) { event in
                    EventCard(event: event) {
                        viewModel.selectedEvent = event
                    }
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
            Text("Chargement...")
                .font(.system(size: 16))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 20) {
            Image(systemName: "calendar")
                .font(.system(size: 60))
                .foregroundColor(Color(hex: "E8865D").opacity(0.5))

            Text("Aucun événement")
                .font(.system(size: 20, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            Text("Ajoutez votre premier événement\npour partager avec vos colocataires")
                .font(.system(size: 15))
                .foregroundColor(Color(hex: "6B7280"))
                .multilineTextAlignment(.center)

            Button(action: { viewModel.showCreateEvent = true }) {
                HStack {
                    Image(systemName: "plus.circle.fill")
                    Text("Créer un événement")
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

// MARK: - Upcoming Event Card

struct UpcomingEventCard: View {
    let event: Event
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Circle()
                        .fill(Color(hex: event.color))
                        .frame(width: 8, height: 8)

                    Text(event.eventType.displayName)
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(Color(hex: "6B7280"))
                        .textCase(.uppercase)
                }

                Text(event.title)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))
                    .lineLimit(2)

                HStack(spacing: 4) {
                    Image(systemName: "calendar")
                        .font(.system(size: 11))
                    Text(event.startDate, style: .date)
                        .font(.system(size: 12))
                }
                .foregroundColor(Color(hex: "6B7280"))
            }
            .frame(width: 140)
            .padding(12)
            .background(Color.white)
            .cornerRadius(12)
            .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        }
    }
}

// MARK: - Event Card

struct EventCard: View {
    let event: Event
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                // Date badge
                VStack(spacing: 2) {
                    Text(event.startDate, format: .dateTime.day())
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(Color(hex: event.color))

                    Text(event.startDate, format: .dateTime.month(.abbreviated))
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(Color(hex: "6B7280"))
                        .textCase(.uppercase)
                }
                .frame(width: 50)
                .padding(.vertical, 8)
                .background(Color(hex: event.color).opacity(0.1))
                .cornerRadius(8)

                // Event info
                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Image(systemName: event.eventType.icon)
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: event.color))

                        Text(event.eventType.displayName)
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(Color(hex: "6B7280"))

                        Spacer()

                        if event.rsvpRequired {
                            HStack(spacing: 4) {
                                Image(systemName: "person.2.fill")
                                    .font(.system(size: 10))
                                Text("\(event.acceptedCount)/\(event.participants.count)")
                                    .font(.system(size: 11, weight: .medium))
                            }
                            .foregroundColor(Color(hex: "10B981"))
                        }
                    }

                    Text(event.title)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                        .lineLimit(2)

                    HStack(spacing: 8) {
                        Image(systemName: "clock")
                            .font(.system(size: 11))
                        Text(event.startDate, style: .time)
                            .font(.system(size: 13))

                        if !event.isAllDay {
                            Text("•")
                            Text(event.formattedDuration)
                                .font(.system(size: 13))
                        }
                    }
                    .foregroundColor(Color(hex: "6B7280"))
                }

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "9CA3AF"))
            }
            .padding(12)
            .background(Color.white)
            .cornerRadius(12)
            .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        }
    }
}

// MARK: - Preview

struct CalendarView_Previews: PreviewProvider {
    static var previews: some View {
        CalendarView()
    }
}
