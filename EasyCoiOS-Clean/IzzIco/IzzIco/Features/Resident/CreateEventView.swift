//
//  CreateEventView.swift
//  IzzIco
//
//  Formulaire de création d'événement - REDESIGN Pinterest Style
//  Glassmorphism, profondeur, contraste élevé
//

import SwiftUI

// MARK: - Local Enums

enum RecurrencePattern: String, CaseIterable {
    case daily = "daily"
    case weekly = "weekly"
    case monthly = "monthly"

    var displayName: String {
        switch self {
        case .daily: return "Quotidien"
        case .weekly: return "Hebdomadaire"
        case .monthly: return "Mensuel"
        }
    }
}

enum ReminderTime: String, CaseIterable {
    case fifteenMinutes = "15min"
    case oneHour = "1h"
    case oneDay = "1d"
    case oneWeek = "1w"

    var displayName: String {
        switch self {
        case .fifteenMinutes: return "15 minutes avant"
        case .oneHour: return "1 heure avant"
        case .oneDay: return "1 jour avant"
        case .oneWeek: return "1 semaine avant"
        }
    }
}

struct CreateEventView: View {
    @ObservedObject var viewModel: CalendarViewModel

    private let role: Theme.UserRole = .resident

    @State private var title = ""
    @State private var description = ""
    @State private var selectedType: EventType = .party
    @State private var startDate = Date()
    @State private var endDate = Date().addingTimeInterval(3600)
    @State private var isAllDay = false
    @State private var hasGuests = false
    @State private var numberOfGuests = 1
    @State private var guestNames = ""
    @State private var isRecurring = false
    @State private var recurrencePattern: RecurrencePattern = .weekly
    @State private var reminderBefore: ReminderTime? = .oneDay

    var body: some View {
        PinterestFormContainer(
            title: "Nouvel Événement",
            role: role,
            isPresented: $viewModel.showCreateEvent,
            onSave: createEvent
        ) {
            VStack(spacing: Theme.PinterestSpacing.xl) {
                basicInfoSection
                typeSection
                dateTimeSection

                if selectedType == .guest {
                    guestsSection
                }

                recurrenceSection
                reminderSection
            }
        }
    }

    // MARK: - Sections

    private var basicInfoSection: some View {
        PinterestFormSection("Informations") {
            VStack(spacing: Theme.PinterestSpacing.md) {
                PinterestFormTextField(
                    placeholder: "Titre de l'événement",
                    text: $title,
                    icon: "calendar",
                    role: role,
                    isRequired: true
                )

                PinterestFormTextEditor(
                    placeholder: "Description (optionnelle)",
                    text: $description,
                    role: role
                )
            }
        }
    }

    private var typeSection: some View {
        PinterestFormSection("Type d'événement") {
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                ForEach(EventType.allCases, id: \.self) { type in
                    EventTypeCard(
                        type: type,
                        isSelected: selectedType == type,
                        role: role
                    ) {
                        withAnimation(Theme.PinterestAnimations.quickSpring) {
                            selectedType = type
                        }
                        Haptic.selection()
                    }
                }
            }
        }
    }

    private var dateTimeSection: some View {
        PinterestFormSection("Date et heure") {
            VStack(spacing: Theme.PinterestSpacing.md) {
                // Toggle Toute la journée
                PinterestToggle(
                    title: "Toute la journée",
                    isOn: $isAllDay,
                    role: role
                )

                // Date de début
                VStack(alignment: .leading, spacing: 8) {
                    Text("Début")
                        .font(Theme.PinterestTypography.bodySmall(.medium))
                        .foregroundColor(Theme.Colors.textSecondary)

                    DatePicker(
                        "",
                        selection: $startDate,
                        displayedComponents: isAllDay ? [.date] : [.date, .hourAndMinute]
                    )
                    .datePickerStyle(.compact)
                    .labelsHidden()
                    .padding(Theme.PinterestSpacing.md)
                    .background(Color.white)
                    .cornerRadius(Theme.PinterestRadius.medium)
                    .pinterestShadow(Theme.PinterestShadows.subtle)
                }

                // Date de fin
                VStack(alignment: .leading, spacing: 8) {
                    Text("Fin")
                        .font(Theme.PinterestTypography.bodySmall(.medium))
                        .foregroundColor(Theme.Colors.textSecondary)

                    DatePicker(
                        "",
                        selection: $endDate,
                        displayedComponents: isAllDay ? [.date] : [.date, .hourAndMinute]
                    )
                    .datePickerStyle(.compact)
                    .labelsHidden()
                    .padding(Theme.PinterestSpacing.md)
                    .background(Color.white)
                    .cornerRadius(Theme.PinterestRadius.medium)
                    .pinterestShadow(Theme.PinterestShadows.subtle)
                }
            }
        }
    }

    private var guestsSection: some View {
        PinterestFormSection("Invités") {
            VStack(spacing: Theme.PinterestSpacing.md) {
                PinterestToggle(
                    title: "Des invités viennent dormir",
                    isOn: $hasGuests,
                    role: role
                )

                if hasGuests {
                    // Stepper nombre d'invités
                    HStack {
                        Text("Nombre d'invités")
                            .font(Theme.PinterestTypography.bodyRegular(.medium))
                            .foregroundColor(Theme.Colors.textPrimary)

                        Spacer()

                        HStack(spacing: 16) {
                            Button(action: {
                                if numberOfGuests > 1 {
                                    numberOfGuests -= 1
                                    Haptic.light()
                                }
                            }) {
                                Image(systemName: "minus.circle.fill")
                                    .font(.system(size: 24))
                                    .foregroundColor(numberOfGuests > 1 ? role.primaryColor : Theme.Colors.textTertiary)
                            }

                            Text("\(numberOfGuests)")
                                .font(Theme.PinterestTypography.bodyRegular(.bold))
                                .foregroundColor(Theme.Colors.textPrimary)
                                .frame(minWidth: 30)

                            Button(action: {
                                if numberOfGuests < 10 {
                                    numberOfGuests += 1
                                    Haptic.light()
                                }
                            }) {
                                Image(systemName: "plus.circle.fill")
                                    .font(.system(size: 24))
                                    .foregroundColor(numberOfGuests < 10 ? role.primaryColor : Theme.Colors.textTertiary)
                            }
                        }
                    }
                    .padding(Theme.PinterestSpacing.md)
                    .background(Color.white)
                    .cornerRadius(Theme.PinterestRadius.medium)
                    .pinterestShadow(Theme.PinterestShadows.subtle)

                    PinterestFormTextField(
                        placeholder: "Noms des invités",
                        text: $guestNames,
                        icon: "person.2.fill",
                        role: role
                    )
                }
            }
        }
    }

    private var recurrenceSection: some View {
        PinterestFormSection("Récurrence") {
            VStack(spacing: Theme.PinterestSpacing.md) {
                PinterestToggle(
                    title: "Événement récurrent",
                    isOn: $isRecurring,
                    role: role
                )

                if isRecurring {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Fréquence")
                            .font(Theme.PinterestTypography.bodySmall(.medium))
                            .foregroundColor(Theme.Colors.textSecondary)

                        Picker("Fréquence", selection: $recurrencePattern) {
                            ForEach(RecurrencePattern.allCases, id: \.self) { pattern in
                                Text(pattern.displayName).tag(pattern)
                            }
                        }
                        .pickerStyle(.segmented)
                        .padding(Theme.PinterestSpacing.sm)
                        .background(Color.white)
                        .cornerRadius(Theme.PinterestRadius.medium)
                        .pinterestShadow(Theme.PinterestShadows.subtle)
                    }
                }
            }
        }
    }

    private var reminderSection: some View {
        PinterestFormSection("Rappel") {
            VStack(alignment: .leading, spacing: 8) {
                Text("Me rappeler")
                    .font(Theme.PinterestTypography.bodySmall(.medium))
                    .foregroundColor(Theme.Colors.textSecondary)

                Picker("Rappel", selection: $reminderBefore) {
                    Text("Aucun rappel").tag(nil as ReminderTime?)
                    ForEach(ReminderTime.allCases, id: \.self) { time in
                        Text(time.displayName).tag(time as ReminderTime?)
                    }
                }
                .pickerStyle(.menu)
                .padding(Theme.PinterestSpacing.md)
                .background(Color.white)
                .cornerRadius(Theme.PinterestRadius.medium)
                .pinterestShadow(Theme.PinterestShadows.subtle)
            }
        }
    }

    // MARK: - Actions

    private func createEvent() {
        // Convert local RecurrencePattern to model's RecurringPattern
        let modelRecurringPattern: RecurringPattern? = {
            guard isRecurring else { return nil }
            switch recurrencePattern {
            case .daily: return .daily
            case .weekly: return .weekly
            case .monthly: return .monthly
            }
        }()

        // Convert ReminderTime to minutes
        let reminderMinutes: Int? = {
            guard let reminder = reminderBefore else { return nil }
            switch reminder {
            case .fifteenMinutes: return 15
            case .oneHour: return 60
            case .oneDay: return 1440
            case .oneWeek: return 10080
            }
        }()

        let event = Event(
            householdId: UUID(),
            title: title,
            description: description.isEmpty ? nil : description,
            type: selectedType,
            startDate: startDate,
            endDate: endDate,
            isAllDay: isAllDay,
            organizerId: UUID(),
            organizerName: "Moi",
            isRecurring: isRecurring,
            recurringPattern: modelRecurringPattern,
            reminderMinutesBefore: reminderMinutes
        )

        Task {
            await viewModel.createEvent(event)
        }
    }
}

// MARK: - Event Type Card

struct EventTypeCard: View {
    let type: EventType
    let isSelected: Bool
    let role: Theme.UserRole
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 12) {
                // Icon circle
                Circle()
                    .fill(isSelected ? Color(hex: type.color) : Color(hex: type.color).opacity(0.15))
                    .frame(width: 52, height: 52)
                    .overlay(
                        Image(systemName: type.icon)
                            .font(.system(size: 22, weight: .semibold))
                            .foregroundColor(isSelected ? .white : Color(hex: type.color))
                    )
                    .pinterestShadow(
                        isSelected ?
                        Theme.PinterestShadows.colored(Color(hex: type.color), intensity: 0.3) :
                        Theme.PinterestShadows.subtle
                    )

                // Label
                Text(type.displayName)
                    .font(Theme.PinterestTypography.bodySmall(.semibold))
                    .foregroundColor(isSelected ? Theme.Colors.textPrimary : Theme.Colors.textSecondary)
                    .lineLimit(1)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, Theme.PinterestSpacing.md)
            .background(Color.white)
            .cornerRadius(Theme.PinterestRadius.medium)
            .overlay(
                RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                    .stroke(
                        isSelected ? Color(hex: type.color) : Color.white.opacity(0.6),
                        lineWidth: isSelected ? 2 : 1.5
                    )
            )
            .pinterestShadow(isSelected ? Theme.PinterestShadows.medium : Theme.PinterestShadows.subtle)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Pinterest Toggle Component

struct PinterestToggle: View {
    let title: String
    @Binding var isOn: Bool
    let role: Theme.UserRole

    var body: some View {
        HStack {
            Text(title)
                .font(Theme.PinterestTypography.bodyRegular(.medium))
                .foregroundColor(Theme.Colors.textPrimary)

            Spacer()

            Toggle("", isOn: $isOn)
                .labelsHidden()
                .tint(role.primaryColor)
        }
        .padding(Theme.PinterestSpacing.md)
        .background(Color.white)
        .cornerRadius(Theme.PinterestRadius.medium)
        .pinterestShadow(Theme.PinterestShadows.subtle)
    }
}
