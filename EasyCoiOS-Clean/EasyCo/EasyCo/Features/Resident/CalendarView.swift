//
//  CalendarView.swift
//  EasyCo
//
//  Vue calendrier complète - REDESIGN Pinterest Style
//  Vrai calendrier visuel mensuel + glassmorphism + profondeur
//

import SwiftUI

struct CalendarView: View {
    @StateObject private var viewModel = CalendarViewModel()
    @State private var selectedDate: Date = Date()
    @State private var showProfileSheet = false
    @State private var showAlertsSheet = false
    @State private var showMenuSheet = false

    private let role: Theme.UserRole = .resident

    var body: some View {
        ZStack(alignment: .top) {
            // Background Pinterest avec blobs organiques
            PinterestBackground(role: role, intensity: 0.15)
                .ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                VStack(spacing: Theme.PinterestSpacing.lg) {
                    // Spacer for floating header
                    Color.clear.frame(height: 70)

                    // Header avec navigation de mois
                    monthNavigationSection

                    // Vrai calendrier visuel
                    calendarGridSection

                    // Events du jour sélectionné
                    selectedDayEventsSection

                    // Upcoming events (si pas d'events aujourd'hui)
                    if viewModel.getEventsForDate(selectedDate).isEmpty && !viewModel.upcomingEvents.isEmpty {
                        upcomingEventsSection
                    }
                }
                .padding(.horizontal, Theme.PinterestSpacing.lg)
                .padding(.vertical, Theme.PinterestSpacing.md)
                .padding(.bottom, 100)
            }
            .refreshable {
                await viewModel.refresh()
            }

            // Floating Header
            FloatingHeaderView(
                role: role,
                showAddButton: true,
                onProfileTap: { showProfileSheet = true },
                onAlertTap: { showAlertsSheet = true },
                onMenuTap: { showMenuSheet = true },
                onAddTap: { viewModel.showCreateEvent = true }
            )
        }
        .sheet(isPresented: $showProfileSheet) {
            ProfileView()
        }
        .sheet(isPresented: $showAlertsSheet) {
            AlertsView()
        }
        .sheet(isPresented: $showMenuSheet) {
            MenuView()
        }
        .sheet(isPresented: $viewModel.showCreateEvent) {
            CreateEventView(viewModel: viewModel)
        }
        .sheet(item: $viewModel.selectedEvent) { event in
            EventDetailView(event: event, viewModel: viewModel)
        }
    }

    // MARK: - Month Navigation

    private var monthNavigationSection: some View {
        HStack {
            // Previous Month Button
            Button(action: {
                withAnimation(Theme.PinterestAnimations.smoothSpring) {
                    viewModel.moveToPreviousMonth()
                    Haptic.light()
                }
            }) {
                Image(systemName: "chevron.left")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(role.primaryColor)
                    .frame(width: 44, height: 44)
                    .background(
                        Circle()
                            .fill(Color.white.opacity(0.75))
                            .overlay(
                                Circle()
                                    .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                            )
                    )
                    .pinterestShadow(Theme.PinterestShadows.soft)
            }

            Spacer()

            // Current Month Display
            VStack(spacing: 4) {
                Text(viewModel.currentMonth, format: .dateTime.month(.wide))
                    .font(Theme.PinterestTypography.titleLarge(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(viewModel.currentMonth, format: .dateTime.year())
                    .font(Theme.PinterestTypography.caption(.medium))
                    .foregroundColor(Theme.Colors.textSecondary)
            }

            Spacer()

            // Next Month Button
            Button(action: {
                withAnimation(Theme.PinterestAnimations.smoothSpring) {
                    viewModel.moveToNextMonth()
                    Haptic.light()
                }
            }) {
                Image(systemName: "chevron.right")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(role.primaryColor)
                    .frame(width: 44, height: 44)
                    .background(
                        Circle()
                            .fill(Color.white.opacity(0.75))
                            .overlay(
                                Circle()
                                    .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                            )
                    )
                    .pinterestShadow(Theme.PinterestShadows.soft)
            }
        }
    }

    // MARK: - Calendar Grid

    private var calendarGridSection: some View {
        VStack(spacing: Theme.PinterestSpacing.xs) {
            // Jours de la semaine
            HStack(spacing: 0) {
                ForEach(["L", "M", "M", "J", "V", "S", "D"], id: \.self) { day in
                    Text(day)
                        .font(Theme.PinterestTypography.caption(.semibold))
                        .foregroundColor(Theme.Colors.textSecondary)
                        .frame(maxWidth: .infinity)
                }
            }
            .padding(.bottom, Theme.PinterestSpacing.xs)

            // Grille calendrier
            let daysInMonth = getDaysInMonth(for: viewModel.currentMonth)

            LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 4), count: 7), spacing: 4) {
                ForEach(daysInMonth, id: \.self) { day in
                    if let date = day {
                        CalendarDayCell(
                            date: date,
                            isSelected: Calendar.current.isDate(date, inSameDayAs: selectedDate),
                            isToday: Calendar.current.isDateInToday(date),
                            hasEvents: !viewModel.getEventsForDate(date).isEmpty,
                            role: role
                        ) {
                            withAnimation(Theme.PinterestAnimations.smoothSpring) {
                                selectedDate = date
                                Haptic.selection()
                            }
                        }
                    } else {
                        // Empty cell for padding
                        Color.clear
                            .frame(height: 44)
                    }
                }
            }
        }
        .padding(Theme.PinterestSpacing.md)
        .pinterestGlassCard(padding: 0, radius: Theme.PinterestRadius.xLarge)
    }

    // MARK: - Selected Day Events

    private var selectedDayEventsSection: some View {
        let events = viewModel.getEventsForDate(selectedDate)

        return VStack(alignment: .leading, spacing: Theme.PinterestSpacing.md) {
            // Section header
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(selectedDate, format: .dateTime.day().month(.wide))
                        .font(Theme.PinterestTypography.titleMedium(.bold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text("\(events.count) événement\(events.count > 1 ? "s" : "")")
                        .font(Theme.PinterestTypography.caption(.medium))
                        .foregroundColor(Theme.Colors.textSecondary)
                }

                Spacer()

                if Calendar.current.isDateInToday(selectedDate) {
                    HStack(spacing: 6) {
                        Circle()
                            .fill(role.primaryColor)
                            .frame(width: 8, height: 8)

                        Text("Aujourd'hui")
                            .font(Theme.PinterestTypography.caption(.semibold))
                            .foregroundColor(role.primaryColor)
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(
                        Capsule()
                            .fill(role.primaryColor.opacity(0.12))
                    )
                }
            }

            // Events list
            if events.isEmpty {
                emptyDayView
            } else {
                ForEach(events) { event in
                    PinterestEventCard(event: event, role: role) {
                        viewModel.selectedEvent = event
                    }
                }
            }
        }
    }

    // MARK: - Upcoming Events

    private var upcomingEventsSection: some View {
        VStack(alignment: .leading, spacing: Theme.PinterestSpacing.md) {
            Text("À venir")
                .font(Theme.PinterestTypography.titleMedium(.bold))
                .foregroundColor(Theme.Colors.textPrimary)

            ForEach(viewModel.upcomingEvents.prefix(3)) { event in
                PinterestEventCard(event: event, role: role) {
                    viewModel.selectedEvent = event
                }
            }
        }
    }

    // MARK: - Empty Day View

    private var emptyDayView: some View {
        VStack(spacing: Theme.PinterestSpacing.md) {
            ZStack {
                Circle()
                    .fill(role.primaryColor.opacity(0.15))
                    .frame(width: 80, height: 80)

                Image(systemName: "calendar")
                    .font(.system(size: 32, weight: .light))
                    .foregroundColor(role.primaryColor)
            }

            Text("Aucun événement")
                .font(Theme.PinterestTypography.bodyRegular(.medium))
                .foregroundColor(Theme.Colors.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(Theme.PinterestSpacing.xl)
        .pinterestGlassCard(padding: 0, radius: Theme.PinterestRadius.large)
    }

    // MARK: - Helpers

    private func getDaysInMonth(for date: Date) -> [Date?] {
        let calendar = Calendar.current
        let interval = calendar.dateInterval(of: .month, for: date)!
        let firstWeekday = calendar.component(.weekday, from: interval.start)

        // Adjust for Monday start (1 = Sunday in Calendar, we want Monday = 0)
        let offsetDays = (firstWeekday == 1) ? 6 : (firstWeekday - 2)

        let days = calendar.range(of: .day, in: .month, for: date)!
        var result: [Date?] = Array(repeating: nil, count: offsetDays)

        for day in days {
            if let date = calendar.date(byAdding: .day, value: day - 1, to: interval.start) {
                result.append(date)
            }
        }

        return result
    }
}

// MARK: - Calendar Day Cell

struct CalendarDayCell: View {
    let date: Date
    let isSelected: Bool
    let isToday: Bool
    let hasEvents: Bool
    let role: Theme.UserRole
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 4) {
                Text(date, format: .dateTime.day())
                    .font(Theme.PinterestTypography.bodySmall(isSelected || isToday ? .bold : .medium))
                    .foregroundColor(
                        isSelected ? .white :
                        isToday ? role.primaryColor :
                        Theme.Colors.textPrimary
                    )

                if hasEvents {
                    Circle()
                        .fill(isSelected ? .white : role.primaryColor)
                        .frame(width: 4, height: 4)
                }
            }
            .frame(height: 44)
            .frame(maxWidth: .infinity)
            .background(
                ZStack {
                    if isSelected {
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.small)
                            .fill(role.gradient)
                            .pinterestShadow(Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.3))
                    } else if isToday {
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.small)
                            .stroke(role.primaryColor.opacity(0.4), lineWidth: 2)
                    }
                }
            )
        }
        .buttonStyle(ScaleButtonStyle())
    }
}

// MARK: - Pinterest Event Card

struct PinterestEventCard: View {
    let event: Event
    let role: Theme.UserRole
    let action: () -> Void

    var body: some View {
        Button(action: {
            Haptic.light()
            action()
        }) {
            HStack(spacing: Theme.PinterestSpacing.md) {
                // Time badge avec gradient
                VStack(spacing: 4) {
                    if event.isAllDay {
                        Image(systemName: "sun.max.fill")
                            .font(.system(size: 20, weight: .semibold))
                            .foregroundColor(Color(hex: event.type.color))

                        Text("Toute la journée")
                            .font(Theme.PinterestTypography.captionSmall(.semibold))
                            .foregroundColor(Color(hex: event.type.color))
                            .multilineTextAlignment(.center)
                            .lineLimit(2)
                    } else {
                        Text(event.startDate, format: .dateTime.hour().minute())
                            .font(Theme.PinterestTypography.bodySmall(.bold))
                            .foregroundColor(Color(hex: event.type.color))

                        if let endDate = event.endDate {
                            Text(endDate, format: .dateTime.hour().minute())
                                .font(Theme.PinterestTypography.captionSmall(.medium))
                                .foregroundColor(Theme.Colors.textSecondary)
                        }
                    }
                }
                .frame(width: 70)
                .padding(.vertical, Theme.PinterestSpacing.sm)
                .background(
                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                        .fill(Color(hex: event.type.color).opacity(0.15))
                )

                // Event info
                VStack(alignment: .leading, spacing: 6) {
                    // Type badge
                    HStack(spacing: 4) {
                        Image(systemName: event.type.icon)
                            .font(.system(size: 10, weight: .semibold))
                        Text(event.type.displayName)
                            .font(Theme.PinterestTypography.captionSmall(.semibold))
                    }
                    .foregroundColor(Color(hex: event.type.color))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(
                        Capsule()
                            .fill(Color(hex: event.type.color).opacity(0.15))
                    )

                    // Title
                    Text(event.title)
                        .font(Theme.PinterestTypography.bodyRegular(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)
                        .lineLimit(2)

                    // Participants
                    if event.rsvpRequired {
                        HStack(spacing: 6) {
                            Image(systemName: "person.2.fill")
                                .font(.system(size: 11))
                            Text("\(event.acceptedCount)/\(event.participants.count) confirmés")
                                .font(Theme.PinterestTypography.caption(.medium))
                        }
                        .foregroundColor(
                            event.acceptedCount == event.participants.count
                                ? Color(hex: "10B981")
                                : Theme.Colors.textSecondary
                        )
                    }
                }

                Spacer()

                // Chevron
                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Theme.Colors.textTertiary)
            }
            .padding(Theme.PinterestSpacing.md)
            .pinterestGlassCard(padding: 0, radius: Theme.PinterestRadius.medium)
        }
        .buttonStyle(ScaleButtonStyle())
    }
}

// MARK: - Preview

struct CalendarView_Previews: PreviewProvider {
    static var previews: some View {
        CalendarView()
    }
}
