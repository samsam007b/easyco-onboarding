//
//  VisitCalendarView.swift
//  IzzIco
//
//  Calendar view for scheduling visits with available time slots
//

import SwiftUI

struct VisitCalendarView: View {
    let visit: Visit
    @Environment(\.dismiss) var dismiss

    @State private var selectedDate = Date()
    @State private var selectedTimeSlot: TimeSlot?
    @State private var duration: Int = 30
    @State private var notes: String = ""
    @State private var isScheduling = false

    let durationOptions = [15, 30, 45, 60, 90, 120]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Header info
                    headerSection

                    // Calendar
                    calendarSection

                    // Time slots
                    if !timeSlots.isEmpty {
                        timeSlotsSection
                    }

                    // Duration picker
                    durationSection

                    // Notes
                    notesSection
                }
                .padding(16)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Planifier une visite")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }

                ToolbarItem(placement: .cancellationAction) {
                    Button("Annuler") {
                        dismiss()
                    }
                    .foregroundColor(Color(hex: "6B7280"))
                }

                ToolbarItem(placement: .confirmationAction) {
                    Button("Confirmer") {
                        scheduleVisit()
                    }
                    .foregroundColor(Color(hex: "6E56CF"))
                    .disabled(selectedTimeSlot == nil || isScheduling)
                }
            }
        }
    }

    // MARK: - Header Section

    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 12) {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color(hex: "6E56CF"), Color(hex: "8B5CF6")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 56, height: 56)
                    .overlay(
                        Text(String(visit.applicantName.prefix(1)))
                            .font(.system(size: 24, weight: .bold))
                            .foregroundColor(.white)
                    )

                VStack(alignment: .leading, spacing: 4) {
                    Text(visit.applicantName)
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    Text(visit.propertyTitle)
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                Spacer()
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }

    // MARK: - Calendar Section

    private var calendarSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Sélectionnez une date")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            DatePicker(
                "Date de visite",
                selection: $selectedDate,
                in: Date()...,
                displayedComponents: [.date]
            )
            .datePickerStyle(.graphical)
            .tint(Color(hex: "6E56CF"))
            .onChange(of: selectedDate) { _ in
                selectedTimeSlot = nil
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }

    // MARK: - Time Slots Section

    private var timeSlotsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Sélectionnez un horaire")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 12) {
                ForEach(timeSlots) { slot in
                    CalendarTimeSlotButton(
                        slot: slot,
                        isSelected: selectedTimeSlot?.id == slot.id,
                        action: {
                            if slot.isAvailable {
                                selectedTimeSlot = slot
                            }
                        }
                    )
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }

    // MARK: - Duration Section

    private var durationSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Durée de la visite")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 12) {
                ForEach(durationOptions, id: \.self) { option in
                    Button(action: { duration = option }) {
                        VStack(spacing: 4) {
                            Text("\(option)")
                                .font(.system(size: 18, weight: .semibold))
                            Text("min")
                                .font(.system(size: 12))
                        }
                        .foregroundColor(duration == option ? .white : Color(hex: "6B7280"))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(duration == option ? Color(hex: "6E56CF") : Color(hex: "F3F4F6"))
                        .cornerRadius(8)
                    }
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }

    // MARK: - Notes Section

    private var notesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Notes (optionnel)")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            TextEditor(text: $notes)
                .frame(height: 100)
                .padding(12)
                .background(Color(hex: "F9FAFB"))
                .cornerRadius(8)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                )

            Text("Ajoutez des informations supplémentaires pour cette visite")
                .font(.system(size: 12))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }

    // MARK: - Time Slots Generation

    private var timeSlots: [TimeSlot] {
        var slots: [TimeSlot] = []
        let calendar = Calendar.current

        // Generate slots from 9:00 to 18:00
        let startHour = 9
        let endHour = 18

        for hour in startHour..<endHour {
            for minute in [0, 30] {
                var components = calendar.dateComponents([.year, .month, .day], from: selectedDate)
                components.hour = hour
                components.minute = minute

                if let slotDate = calendar.date(from: components) {
                    // Check if slot is in the future
                    let isAvailable = slotDate > Date()

                    let slot = TimeSlot(
                        date: slotDate,
                        isAvailable: isAvailable,
                        isSelected: false
                    )
                    slots.append(slot)
                }
            }
        }

        return slots
    }

    // MARK: - Actions

    private func scheduleVisit() {
        guard let timeSlot = selectedTimeSlot else { return }

        isScheduling = true

        // Demo mode - simulate API call
        _Concurrency.Task {
            try? await _Concurrency.Task.sleep(nanoseconds: 1_000_000_000)

            await MainActor.run {
                isScheduling = false
                dismiss()
            }
        }
    }
}

// MARK: - Time Slot Button

private struct CalendarTimeSlotButton: View {
    let slot: TimeSlot
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(slot.displayTime)
                .font(.system(size: 14, weight: isSelected ? .semibold : .regular))
                .foregroundColor(
                    slot.isAvailable
                        ? (isSelected ? .white : Color(hex: "111827"))
                        : Color(hex: "D1D5DB")
                )
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(
                    slot.isAvailable
                        ? (isSelected ? Color(hex: "6E56CF") : Color(hex: "F9FAFB"))
                        : Color(hex: "F3F4F6")
                )
                .cornerRadius(8)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(
                            isSelected ? Color(hex: "6E56CF") : Color(hex: "E5E7EB"),
                            lineWidth: isSelected ? 2 : 1
                        )
                )
        }
        .disabled(!slot.isAvailable)
    }
}

// MARK: - Visit Notes View

struct VisitNotesView: View {
    let visit: Visit
    @Environment(\.dismiss) var dismiss

    @State private var notes: String = ""
    @State private var isSaving = false

    var body: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 24) {
                // Visit info
                VStack(alignment: .leading, spacing: 8) {
                    Text(visit.applicantName)
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    Text(visit.propertyTitle)
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))

                    HStack(spacing: 6) {
                        Image(systemName: "calendar")
                            .font(.system(size: 12))
                        Text(visit.scheduledDate.formatted(date: .abbreviated, time: .shortened))
                            .font(.system(size: 12))
                    }
                    .foregroundColor(Color(hex: "6B7280"))
                }

                Divider()

                // Notes editor
                VStack(alignment: .leading, spacing: 12) {
                    Text("Notes privées")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    Text("Ces notes ne seront visibles que par vous")
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "6B7280"))

                    TextEditor(text: $notes)
                        .frame(height: 200)
                        .padding(12)
                        .background(Color(hex: "F9FAFB"))
                        .cornerRadius(8)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                        )
                }

                Spacer()

                // Save button
                Button(action: saveNotes) {
                    HStack {
                        if isSaving {
                            ProgressView()
                                .tint(.white)
                        } else {
                            Text("Enregistrer")
                                .font(.system(size: 16, weight: .semibold))
                        }
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(Color(hex: "6E56CF"))
                    .cornerRadius(12)
                }
                .disabled(isSaving)
            }
            .padding(16)
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Notes de visite")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }

                ToolbarItem(placement: .cancellationAction) {
                    Button("Annuler") {
                        dismiss()
                    }
                    .foregroundColor(Color(hex: "6B7280"))
                }
            }
        }
        .onAppear {
            notes = visit.ownerNotes ?? ""
        }
    }

    private func saveNotes() {
        isSaving = true

        // Demo mode - simulate API call
        _Concurrency.Task {
            try? await _Concurrency.Task.sleep(nanoseconds: 1_000_000_000)

            await MainActor.run {
                isSaving = false
                dismiss()
            }
        }
    }
}
