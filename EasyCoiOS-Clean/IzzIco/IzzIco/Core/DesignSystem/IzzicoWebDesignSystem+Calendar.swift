//
//  IzzicoWebDesignSystem+Calendar.swift
//  IzzIco
//
//  Composants Calendar pour le design system Izzico
//  Created on 2026-01-25
//

import SwiftUI

// MARK: - Calendar Models

struct CalendarEvent: Identifiable {
    let id: UUID
    let title: String
    let date: Date
    let type: EventType
    let color: Color

    enum CalendarEventType {
        case visit, task, event, maintenance

        var icon: String {
            switch self {
            case .visit: return "eye.fill"
            case .task: return "checkmark.circle.fill"
            case .event: return "calendar"
            case .maintenance: return "wrench.fill"
            }
        }
    }

    init(id: UUID = UUID(), title: String, date: Date, type: EventType, color: Color) {
        self.id = id
        self.title = title
        self.date = date
        self.type = type
        self.color = color
    }
}

// MARK: - Web Calendar View

/// Calendrier mensuel web-style
struct WebCalendarView: View {
    @Binding var selectedDate: Date
    let events: [CalendarEvent]
    var roleColor: Color = IzzicoWeb.Colors.resident500
    var onDateTap: ((Date) -> Void)? = nil

    @State private var currentMonth: Date = Date()

    private let calendar = Calendar.current
    private let daysOfWeek = ["L", "M", "M", "J", "V", "S", "D"]

    private var monthYearText: String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "fr_FR")
        formatter.dateFormat = "MMMM yyyy"
        return formatter.string(from: currentMonth).capitalized
    }

    private var daysInMonth: [Date] {
        guard let range = calendar.range(of: .day, in: .month, for: currentMonth),
              let firstDay = calendar.date(from: calendar.dateComponents([.year, .month], from: currentMonth))
        else {
            return []
        }

        let firstWeekday = calendar.component(.weekday, from: firstDay)
        let paddingDays = (firstWeekday + 5) % 7 // Adjust for Monday start

        var days: [Date] = []

        // Add padding days from previous month
        for i in 0..<paddingDays {
            if let date = calendar.date(byAdding: .day, value: -(paddingDays - i), to: firstDay) {
                days.append(date)
            }
        }

        // Add current month days
        for day in range {
            if let date = calendar.date(byAdding: .day, value: day - 1, to: firstDay) {
                days.append(date)
            }
        }

        return days
    }

    private func eventsForDate(_ date: Date) -> [CalendarEvent] {
        events.filter { calendar.isDate($0.date, inSameDayAs: date) }
    }

    var body: some View {
        VStack(spacing: IzzicoWeb.Spacing.lg) {
            // Header avec navigation mois
            HStack {
                Button(action: previousMonth) {
                    Image(systemName: "chevron.left")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(roleColor)
                        .frame(width: 40, height: 40)
                }

                Spacer()

                Text(monthYearText)
                    .font(IzzicoWeb.Typography.titleMedium(.bold))
                    .foregroundColor(IzzicoWeb.Colors.gray900)

                Spacer()

                Button(action: nextMonth) {
                    Image(systemName: "chevron.right")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(roleColor)
                        .frame(width: 40, height: 40)
                }
            }

            // Days of week header
            HStack(spacing: 4) {
                ForEach(daysOfWeek, id: \.self) { day in
                    Text(day)
                        .font(IzzicoWeb.Typography.caption(.semibold))
                        .foregroundColor(IzzicoWeb.Colors.gray600)
                        .frame(maxWidth: .infinity)
                }
            }

            // Calendar grid
            LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 4), count: 7), spacing: 4) {
                ForEach(daysInMonth, id: \.self) { date in
                    WebCalendarDayCell(
                        date: date,
                        isSelected: calendar.isDate(date, inSameDayAs: selectedDate),
                        isToday: calendar.isDateInToday(date),
                        isCurrentMonth: calendar.isDate(date, equalTo: currentMonth, toGranularity: .month),
                        events: eventsForDate(date),
                        roleColor: roleColor,
                        onTap: {
                            selectedDate = date
                            onDateTap?(date)
                        }
                    )
                }
            }
        }
        .padding(IzzicoWeb.Spacing.lg)
        .background(IzzicoWeb.Colors.white)
        .cornerRadius(IzzicoWeb.Radius.xLarge)
        .webShadow(IzzicoWeb.Shadows.soft)
    }

    private func previousMonth() {
        if let newMonth = calendar.date(byAdding: .month, value: -1, to: currentMonth) {
            currentMonth = newMonth
        }
    }

    private func nextMonth() {
        if let newMonth = calendar.date(byAdding: .month, value: 1, to: currentMonth) {
            currentMonth = newMonth
        }
    }
}

// MARK: - Calendar Day Cell

/// Cellule de jour du calendrier
struct WebCalendarDayCell: View {
    let date: Date
    let isSelected: Bool
    let isToday: Bool
    let isCurrentMonth: Bool
    let events: [CalendarEvent]
    var roleColor: Color
    let onTap: () -> Void

    private let calendar = Calendar.current

    private var dayNumber: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "d"
        return formatter.string(from: date)
    }

    private var hasEvents: Bool {
        !events.isEmpty
    }

    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 4) {
                // Day number
                Text(dayNumber)
                    .font(IzzicoWeb.Typography.bodySmall(isSelected ? .bold : .regular))
                    .foregroundColor(textColor)

                // Event indicators (dots)
                if hasEvents {
                    HStack(spacing: 2) {
                        ForEach(events.prefix(3)) { event in
                            Circle()
                                .fill(event.color)
                                .frame(width: 4, height: 4)
                        }
                    }
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: 44)
            .background(backgroundColor)
            .cornerRadius(IzzicoWeb.Radius.small)
            .overlay(
                isToday && !isSelected ?
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.small)
                    .stroke(roleColor, lineWidth: 2)
                : nil
            )
        }
        .buttonStyle(PlainButtonStyle())
    }

    private var textColor: Color {
        if !isCurrentMonth {
            return IzzicoWeb.Colors.gray400
        } else if isSelected {
            return .white
        } else if isToday {
            return roleColor
        } else {
            return IzzicoWeb.Colors.gray900
        }
    }

    private var backgroundColor: Color {
        if isSelected {
            return roleColor
        } else if isToday {
            return roleColor.opacity(0.1)
        } else {
            return Color.clear
        }
    }
}

// MARK: - Event Card

/// Carte d'événement web-style
struct WebEventCard: View {
    let event: CalendarEvent
    let onTap: () -> Void
    var onDelete: (() -> Void)? = nil

    private var timeText: String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "fr_FR")
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: event.date)
    }

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: IzzicoWeb.Spacing.md) {
                // Time bar
                VStack(spacing: 2) {
                    Text(timeText)
                        .font(IzzicoWeb.Typography.caption(.bold))
                        .foregroundColor(event.color)

                    Rectangle()
                        .fill(event.color)
                        .frame(width: 3)
                }
                .frame(width: 44)

                // Event content
                HStack(spacing: IzzicoWeb.Spacing.md) {
                    // Icon
                    ZStack {
                        Circle()
                            .fill(event.color.opacity(0.15))
                            .frame(width: 40, height: 40)

                        Image(systemName: event.type.icon)
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(event.color)
                    }

                    // Title
                    Text(event.title)
                        .font(IzzicoWeb.Typography.bodyRegular(.medium))
                        .foregroundColor(IzzicoWeb.Colors.gray900)
                        .lineLimit(2)

                    Spacer()

                    // Delete button
                    if let onDelete = onDelete {
                        Button(action: onDelete) {
                            Image(systemName: "trash")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(IzzicoWeb.Colors.error)
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
            }
            .padding(IzzicoWeb.Spacing.md)
            .background(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                    .fill(IzzicoWeb.Colors.white)
            )
            .overlay(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                    .stroke(event.color.opacity(0.2), lineWidth: 1)
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Calendar Month Picker

/// Sélecteur de mois web-style
struct WebMonthPicker: View {
    @Binding var selectedMonth: Date
    var roleColor: Color = IzzicoWeb.Colors.resident500

    private let calendar = Calendar.current
    private let months = Calendar.current.monthSymbols

    @State private var isExpanded = false

    private var currentMonthYear: String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "fr_FR")
        formatter.dateFormat = "MMMM yyyy"
        return formatter.string(from: selectedMonth).capitalized
    }

    var body: some View {
        VStack(spacing: 0) {
            // Header button
            Button(action: { isExpanded.toggle() }) {
                HStack {
                    Text(currentMonthYear)
                        .font(IzzicoWeb.Typography.titleSmall(.bold))
                        .foregroundColor(IzzicoWeb.Colors.gray900)

                    Image(systemName: "chevron.down")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(roleColor)
                        .rotationEffect(.degrees(isExpanded ? 180 : 0))
                }
                .padding(IzzicoWeb.Spacing.md)
                .frame(maxWidth: .infinity)
                .background(
                    RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                        .fill(IzzicoWeb.Colors.white)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                        .stroke(roleColor.opacity(0.2), lineWidth: 1)
                )
            }
            .buttonStyle(PlainButtonStyle())

            // Month grid
            if isExpanded {
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 3), spacing: IzzicoWeb.Spacing.sm) {
                    ForEach(0..<12, id: \.self) { month in
                        Button(action: {
                            if let newDate = calendar.date(bySetting: .month, value: month + 1, of: selectedMonth) {
                                selectedMonth = newDate
                                isExpanded = false
                            }
                        }) {
                            Text(months[month])
                                .font(IzzicoWeb.Typography.bodySmall(.medium))
                                .foregroundColor(
                                    calendar.component(.month, from: selectedMonth) == month + 1 ?
                                    .white : IzzicoWeb.Colors.gray700
                                )
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, IzzicoWeb.Spacing.sm)
                                .background(
                                    RoundedRectangle(cornerRadius: IzzicoWeb.Radius.small)
                                        .fill(
                                            calendar.component(.month, from: selectedMonth) == month + 1 ?
                                            roleColor : IzzicoWeb.Colors.gray100
                                        )
                                )
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
                .padding(IzzicoWeb.Spacing.md)
                .background(IzzicoWeb.Colors.white)
                .cornerRadius(IzzicoWeb.Radius.medium)
                .webShadow(IzzicoWeb.Shadows.medium)
                .padding(.top, 4)
            }
        }
        .animation(IzzicoWeb.Animations.smoothSpring, value: isExpanded)
    }
}

// MARK: - Event List for Day

/// Liste des événements pour un jour donné
struct WebDayEventsList: View {
    let date: Date
    let events: [CalendarEvent]
    let onEventTap: (CalendarEvent) -> Void
    let onAddEvent: () -> Void

    private var dateText: String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "fr_FR")
        formatter.dateFormat = "EEEE d MMMM yyyy"
        return formatter.string(from: date).capitalized
    }

    var body: some View {
        VStack(alignment: .leading, spacing: IzzicoWeb.Spacing.lg) {
            // Header
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(dateText)
                        .font(IzzicoWeb.Typography.titleSmall(.bold))
                        .foregroundColor(IzzicoWeb.Colors.gray900)

                    Text("\(events.count) événement\(events.count > 1 ? "s" : "")")
                        .font(IzzicoWeb.Typography.bodySmall())
                        .foregroundColor(IzzicoWeb.Colors.gray600)
                }

                Spacer()

                Button(action: onAddEvent) {
                    Image(systemName: "plus.circle.fill")
                        .font(.system(size: 28))
                        .foregroundColor(IzzicoWeb.Colors.resident500)
                }
            }

            // Events list
            if events.isEmpty {
                WebEmptyState(
                    icon: "calendar",
                    title: "Aucun événement",
                    subtitle: "Tape sur + pour ajouter",
                    color: IzzicoWeb.Colors.gray500
                )
                .padding(.vertical, IzzicoWeb.Spacing.xl)
            } else {
                VStack(spacing: IzzicoWeb.Spacing.md) {
                    ForEach(events) { event in
                        WebEventCard(
                            event: event,
                            onTap: { onEventTap(event) }
                        )
                    }
                }
            }
        }
        .padding(IzzicoWeb.Spacing.lg)
        .background(IzzicoWeb.Colors.white)
        .cornerRadius(IzzicoWeb.Radius.xLarge)
        .webShadow(IzzicoWeb.Shadows.soft)
    }
}

// MARK: - Compact Calendar (Week View)

/// Vue calendrier compacte (semaine)
struct WebWeekCalendarView: View {
    @Binding var selectedDate: Date
    let events: [CalendarEvent]
    var roleColor: Color = IzzicoWeb.Colors.resident500

    private let calendar = Calendar.current

    private var weekDays: [Date] {
        guard let weekInterval = calendar.dateInterval(of: .weekOfYear, for: selectedDate) else {
            return []
        }

        var days: [Date] = []
        var currentDate = weekInterval.start

        for _ in 0..<7 {
            days.append(currentDate)
            guard let nextDate = calendar.date(byAdding: .day, value: 1, to: currentDate) else {
                break
            }
            currentDate = nextDate
        }

        return days
    }

    private func eventsForDate(_ date: Date) -> [CalendarEvent] {
        events.filter { calendar.isDate($0.date, inSameDayAs: date) }
    }

    var body: some View {
        HStack(spacing: IzzicoWeb.Spacing.sm) {
            ForEach(weekDays, id: \.self) { date in
                Button(action: { selectedDate = date }) {
                    VStack(spacing: 4) {
                        // Day name
                        Text(dayName(for: date))
                            .font(IzzicoWeb.Typography.caption(.medium))
                            .foregroundColor(IzzicoWeb.Colors.gray600)

                        // Day number
                        Text("\(calendar.component(.day, from: date))")
                            .font(IzzicoWeb.Typography.bodyRegular(.semibold))
                            .foregroundColor(
                                calendar.isDate(date, inSameDayAs: selectedDate) ?
                                .white : IzzicoWeb.Colors.gray900
                            )
                            .frame(width: 36, height: 36)
                            .background(
                                Circle()
                                    .fill(
                                        calendar.isDate(date, inSameDayAs: selectedDate) ?
                                        roleColor : Color.clear
                                    )
                            )

                        // Event dots
                        if !eventsForDate(date).isEmpty {
                            Circle()
                                .fill(roleColor)
                                .frame(width: 4, height: 4)
                        } else {
                            Spacer()
                                .frame(height: 4)
                        }
                    }
                    .frame(maxWidth: .infinity)
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
        .animation(IzzicoWeb.Animations.quickSpring, value: selectedDate)
    }

    private func dayName(for date: Date) -> String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "fr_FR")
        formatter.dateFormat = "EEE"
        return formatter.string(from: date).uppercased()
    }
}

// MARK: - Preview

struct IzzicoWebDesignSystemCalendar_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Full calendar
                WebCalendarView(
                    selectedDate: .constant(Date()),
                    events: [
                        CalendarEvent(title: "Visite appartement", date: Date(), type: .visit, color: IzzicoWeb.Colors.searcher500),
                        CalendarEvent(title: "Réunion co-living", date: Date(), type: .event, color: IzzicoWeb.Colors.resident500)
                    ],
                    roleColor: IzzicoWeb.Colors.resident500
                )

                // Week view
                WebWeekCalendarView(
                    selectedDate: .constant(Date()),
                    events: [
                        CalendarEvent(title: "Tâche ménage", date: Date(), type: .task, color: IzzicoWeb.Colors.resident500)
                    ]
                )
                .padding(.horizontal)

                // Day events list
                WebDayEventsList(
                    date: Date(),
                    events: [
                        CalendarEvent(title: "Visite 14h", date: Date(), type: .visit, color: IzzicoWeb.Colors.searcher500),
                        CalendarEvent(title: "Maintenance chauffage", date: Date(), type: .maintenance, color: IzzicoWeb.Colors.warning)
                    ],
                    onEventTap: { _ in },
                    onAddEvent: {}
                )
                .padding(.horizontal)
            }
            .padding(.vertical)
        }
        .background(IzzicoWeb.Colors.background)
    }
}
