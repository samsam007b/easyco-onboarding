//
//  CreateEventView.swift
//  EasyCo
//
//  Formulaire de création d'événement
//

import SwiftUI

struct CreateEventView: View {
    @ObservedObject var viewModel: CalendarViewModel
    @Environment(\.dismiss) var dismiss

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
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    basicInfoSection
                    typeSection
                    dateTimeSection
                    if selectedType == .guests {
                        guestsSection
                    }
                    recurrenceSection
                    reminderSection
                }
                .padding(16)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Nouvel Événement")
                        .font(.system(size: 18, weight: .semibold))
                }
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") { dismiss() }
                        .foregroundColor(Color(hex: "6B7280"))
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: createEvent) {
                        Text("Créer")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 20)
                            .padding(.vertical, 8)
                            .background(Color(hex: "E8865D"))
                            .cornerRadius(10)
                    }
                }
            }
        }
    }

    private var basicInfoSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Informations")
                .font(.system(size: 16, weight: .semibold))

            TextField("Titre de l'événement", text: $title)
                .padding(12)
                .background(Color.white)
                .cornerRadius(12)

            TextField("Description (optionnelle)", text: $description, axis: .vertical)
                .lineLimit(3...6)
                .padding(12)
                .background(Color.white)
                .cornerRadius(12)
        }
    }

    private var typeSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Type d'événement")
                .font(.system(size: 16, weight: .semibold))

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                ForEach(EventType.allCases, id: \.self) { type in
                    EventTypeButton(type: type, isSelected: selectedType == type) {
                        selectedType = type
                    }
                }
            }
        }
    }

    private var dateTimeSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Date et heure")
                .font(.system(size: 16, weight: .semibold))

            Toggle("Toute la journée", isOn: $isAllDay)
                .padding(12)
                .background(Color.white)
                .cornerRadius(12)

            DatePicker("Début", selection: $startDate, displayedComponents: isAllDay ? [.date] : [.date, .hourAndMinute])
                .padding(12)
                .background(Color.white)
                .cornerRadius(12)

            DatePicker("Fin", selection: $endDate, displayedComponents: isAllDay ? [.date] : [.date, .hourAndMinute])
                .padding(12)
                .background(Color.white)
                .cornerRadius(12)
        }
    }

    private var guestsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Invités")
                .font(.system(size: 16, weight: .semibold))

            Toggle("Des invités viennent dormir", isOn: $hasGuests)
                .padding(12)
                .background(Color.white)
                .cornerRadius(12)

            if hasGuests {
                Stepper("Nombre: \(numberOfGuests)", value: $numberOfGuests, in: 1...10)
                    .padding(12)
                    .background(Color.white)
                    .cornerRadius(12)

                TextField("Noms des invités", text: $guestNames)
                    .padding(12)
                    .background(Color.white)
                    .cornerRadius(12)
            }
        }
    }

    private var recurrenceSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Toggle("Récurrent", isOn: $isRecurring)
                .padding(12)
                .background(Color.white)
                .cornerRadius(12)

            if isRecurring {
                Picker("Fréquence", selection: $recurrencePattern) {
                    ForEach(RecurrencePattern.allCases, id: \.self) { pattern in
                        Text(pattern.displayName).tag(pattern)
                    }
                }
                .pickerStyle(.segmented)
            }
        }
    }

    private var reminderSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Rappel")
                .font(.system(size: 16, weight: .semibold))

            Picker("Rappel", selection: $reminderBefore) {
                Text("Aucun").tag(nil as ReminderTime?)
                ForEach(ReminderTime.allCases, id: \.self) { time in
                    Text(time.displayName).tag(time as ReminderTime?)
                }
            }
            .pickerStyle(.menu)
            .padding(12)
            .background(Color.white)
            .cornerRadius(12)
        }
    }

    private func createEvent() {
        let event = Event(
            householdId: UUID(),
            title: title,
            description: description.isEmpty ? nil : description,
            eventType: selectedType,
            startDate: startDate,
            endDate: endDate,
            isAllDay: isAllDay,
            createdBy: UUID(),
            createdByName: "Moi",
            hasGuests: hasGuests,
            numberOfGuests: numberOfGuests,
            guestNames: hasGuests ? guestNames.components(separatedBy: ",").map { $0.trimmingCharacters(in: .whitespaces) } : [],
            isRecurring: isRecurring,
            recurrencePattern: isRecurring ? recurrencePattern : nil,
            reminderBefore: reminderBefore
        )

        _Concurrency.Task {
            await viewModel.createEvent(event)
            dismiss()
        }
    }
}

struct EventTypeButton: View {
    let type: EventType
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Circle()
                    .fill(isSelected ? Color(hex: type.defaultColor) : Color(hex: type.defaultColor).opacity(0.1))
                    .frame(width: 48, height: 48)
                    .overlay(
                        Image(systemName: type.icon)
                            .font(.system(size: 20))
                            .foregroundColor(isSelected ? .white : Color(hex: type.defaultColor))
                    )

                Text(type.displayName)
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(isSelected ? Color(hex: "111827") : Color(hex: "6B7280"))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(Color.white)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(isSelected ? Color(hex: type.defaultColor) : Color(hex: "E5E7EB"), lineWidth: isSelected ? 2 : 1)
            )
        }
    }
}
