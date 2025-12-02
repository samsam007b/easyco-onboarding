//
//  VisitSchedulerView.swift
//  EasyCo
//
//  Schedule property visits with calendar and time slots
//

import SwiftUI

struct VisitSchedulerView: View {
    let property: Property
    @Environment(\.dismiss) private var dismiss

    @State private var selectedDate = Date()
    @State private var selectedTimeSlot: TimeSlot?
    @State private var visitType: VisitType = .physical
    @State private var notes = ""
    @State private var availableSlots: [TimeSlot] = []
    @State private var showConfirmation = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Property card
                    propertyCard

                    // Visit type selector
                    visitTypeSection

                    // Calendar
                    calendarSection

                    // Time slots
                    if !availableSlots.isEmpty {
                        timeSlotsSection
                    }

                    // Notes
                    notesSection
                }
                .padding()
                .padding(.bottom, 100)
            }
            .background(Theme.Colors.backgroundSecondary)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: { dismiss() }) {
                        Image.lucide("x")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 20, height: 20)
                            .foregroundColor(Theme.Colors.textPrimary)
                    }
                }

                ToolbarItem(placement: .principal) {
                    Text("Planifier une visite")
                        .font(Theme.Typography.title3())
                        .foregroundColor(Theme.Colors.textPrimary)
                }
            }
            .overlay(alignment: .bottom) {
                bottomButton
            }
            .sheet(isPresented: $showConfirmation) {
                if let slot = selectedTimeSlot {
                    VisitConfirmationView(
                        property: property,
                        date: selectedDate,
                        timeSlot: slot,
                        visitType: visitType,
                        notes: notes
                    )
                }
            }
        }
        .onAppear {
            loadAvailableSlots()
        }
        .onChange(of: selectedDate) { _ in
            loadAvailableSlots()
        }
    }

    // MARK: - Property Card

    private var propertyCard: some View {
        HStack(spacing: 12) {
            AsyncImage(url: URL(string: property.images.first ?? "")) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                Rectangle()
                    .fill(Theme.Colors.gray200)
            }
            .frame(width: 80, height: 80)
            .cornerRadius(12)

            VStack(alignment: .leading, spacing: 6) {
                Text(property.title)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .lineLimit(2)

                HStack(spacing: 4) {
                    Image.lucide("map-pin")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 12, height: 12)
                        .foregroundColor(Theme.Colors.textTertiary)

                    Text(property.location)
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)
                        .lineLimit(1)
                }
            }

            Spacer()
        }
        .padding(16)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }

    // MARK: - Visit Type Section

    private var visitTypeSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Type de visite")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            HStack(spacing: 12) {
                ForEach(VisitType.allCases, id: \.self) { type in
                    Button(action: {
                        visitType = type
                        Haptic.impact(.light)
                    }) {
                        VStack(spacing: 12) {
                            Image.lucide(type.icon)
                                .resizable()
                                .scaledToFit()
                                .frame(width: 24, height: 24)
                                .foregroundColor(visitType == type ? .white : Theme.Colors.primary)
                                .frame(width: 56, height: 56)
                                .background(
                                    visitType == type ?
                                    AnyView(Theme.Colors.primaryGradient) :
                                    AnyView(LinearGradient(colors: [Theme.Colors.primary.opacity(0.1)], startPoint: .leading, endPoint: .trailing))
                                )
                                .cornerRadius(16)

                            VStack(spacing: 4) {
                                Text(type.label)
                                    .font(Theme.Typography.bodySmall(.semibold))
                                    .foregroundColor(Theme.Colors.textPrimary)

                                Text(type.description)
                                    .font(Theme.Typography.caption())
                                    .foregroundColor(Theme.Colors.textSecondary)
                                    .multilineTextAlignment(.center)
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(Theme.Colors.backgroundPrimary)
                        .cornerRadius(Theme.CornerRadius.card)
                        .overlay(
                            RoundedRectangle(cornerRadius: Theme.CornerRadius.card)
                                .stroke(visitType == type ? Theme.Colors.primary : Color.clear, lineWidth: 2)
                        )
                    }
                }
            }
        }
    }

    // MARK: - Calendar Section

    private var calendarSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Choisir une date")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            DatePicker(
                "",
                selection: $selectedDate,
                in: Date()...,
                displayedComponents: .date
            )
            .datePickerStyle(.graphical)
            .tint(Theme.Colors.primary)
            .padding(16)
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.card)
            .cardShadow()
        }
    }

    // MARK: - Time Slots Section

    private var timeSlotsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Créneaux disponibles")
                    .font(Theme.Typography.title3())
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                Text(formattedDate)
                    .font(Theme.Typography.bodySmall())
                    .foregroundColor(Theme.Colors.textSecondary)
            }

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                ForEach(availableSlots) { slot in
                    Button(action: {
                        selectedTimeSlot = slot
                        Haptic.impact(.medium)
                    }) {
                        VStack(spacing: 8) {
                            Text(slot.time)
                                .font(Theme.Typography.body(.semibold))
                                .foregroundColor(selectedTimeSlot?.id == slot.id ? .white : Theme.Colors.textPrimary)

                            if slot.isFeatured {
                                Text("Populaire")
                                    .font(.system(size: 9, weight: .semibold))
                                    .foregroundColor(selectedTimeSlot?.id == slot.id ? .white : Theme.Colors.primary)
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 2)
                                    .background((selectedTimeSlot?.id == slot.id ? Color.white : Theme.Colors.primary).opacity(0.2))
                                    .cornerRadius(4)
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(
                            selectedTimeSlot?.id == slot.id ?
                            AnyView(Theme.Colors.primaryGradient) :
                            AnyView(LinearGradient(colors: [Theme.Colors.backgroundPrimary], startPoint: .leading, endPoint: .trailing))
                        )
                        .cornerRadius(Theme.CornerRadius.md)
                        .overlay(
                            RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                                .stroke(selectedTimeSlot?.id == slot.id ? Color.clear : Theme.Colors.gray200, lineWidth: 1)
                        )
                    }
                }
            }
        }
    }

    // MARK: - Notes Section

    private var notesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Notes pour le propriétaire")
                    .font(Theme.Typography.title3())
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Facultatif - Questions ou remarques particulières")
                    .font(Theme.Typography.bodySmall())
                    .foregroundColor(Theme.Colors.textSecondary)
            }

            TextEditor(text: $notes)
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textPrimary)
                .frame(height: 100)
                .padding(12)
                .background(Theme.Colors.backgroundPrimary)
                .cornerRadius(Theme.CornerRadius.md)
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                        .stroke(Theme.Colors.gray200, lineWidth: 1)
                )
        }
    }

    // MARK: - Bottom Button

    private var bottomButton: some View {
        VStack {
            Button(action: {
                showConfirmation = true
                Haptic.notification(.success)
            }) {
                HStack {
                    Image.lucide("calendar-check")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 20, height: 20)

                    Text("Confirmer la visite")
                        .font(Theme.Typography.body(.semibold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .frame(height: Theme.Size.buttonHeight)
                .background(Theme.Colors.primaryGradient)
                .cornerRadius(Theme.CornerRadius.button)
            }
            .disabled(selectedTimeSlot == nil)
            .opacity(selectedTimeSlot == nil ? 0.5 : 1)
            .padding()
            .background(.ultraThinMaterial)
        }
    }

    // MARK: - Helpers

    private var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEE d MMMM"
        formatter.locale = Locale(identifier: "fr_FR")
        return formatter.string(from: selectedDate)
    }

    private func loadAvailableSlots() {
        // Mock available time slots
        availableSlots = [
            TimeSlot(time: "09:00", isFeatured: false),
            TimeSlot(time: "10:00", isFeatured: true),
            TimeSlot(time: "11:00", isFeatured: false),
            TimeSlot(time: "14:00", isFeatured: true),
            TimeSlot(time: "15:00", isFeatured: false),
            TimeSlot(time: "16:00", isFeatured: false),
            TimeSlot(time: "17:00", isFeatured: true),
            TimeSlot(time: "18:00", isFeatured: false)
        ]
    }
}

// MARK: - Supporting Models

enum VisitType: String, CaseIterable {
    case physical
    case virtual

    var label: String {
        switch self {
        case .physical: return "Physique"
        case .virtual: return "Virtuelle"
        }
    }

    var description: String {
        switch self {
        case .physical: return "Sur place"
        case .virtual: return "Vidéo"
        }
    }

    var icon: String {
        switch self {
        case .physical: return "home"
        case .virtual: return "video"
        }
    }
}

struct TimeSlot: Identifiable {
    let id = UUID().uuidString
    let time: String
    let isFeatured: Bool
}

// MARK: - Confirmation View

struct VisitConfirmationView: View {
    let property: Property
    let date: Date
    let timeSlot: TimeSlot
    let visitType: VisitType
    let notes: String

    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 32) {
                    // Success icon
                    Image.lucide("calendar-check")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 80, height: 80)
                        .foregroundColor(Theme.Colors.success)
                        .padding(24)
                        .background(Theme.Colors.success.opacity(0.1))
                        .clipShape(Circle())

                    VStack(spacing: 12) {
                        Text("Visite programmée !")
                            .font(Theme.Typography.title1())
                            .foregroundColor(Theme.Colors.textPrimary)

                        Text("Votre demande de visite a été envoyée au propriétaire")
                            .font(Theme.Typography.body())
                            .foregroundColor(Theme.Colors.textSecondary)
                            .multilineTextAlignment(.center)
                    }

                    // Visit details card
                    VStack(alignment: .leading, spacing: 20) {
                        DetailRow(
                            icon: "home",
                            label: "Logement",
                            value: property.title
                        )

                        DetailRow(
                            icon: "calendar",
                            label: "Date",
                            value: formattedDate
                        )

                        DetailRow(
                            icon: "clock",
                            label: "Heure",
                            value: timeSlot.time
                        )

                        DetailRow(
                            icon: visitType.icon,
                            label: "Type",
                            value: "\(visitType.label) - \(visitType.description)"
                        )

                        if !notes.isEmpty {
                            DetailRow(
                                icon: "message-square",
                                label: "Notes",
                                value: notes
                            )
                        }
                    }
                    .padding(20)
                    .background(Theme.Colors.backgroundPrimary)
                    .cornerRadius(Theme.CornerRadius.card)
                    .cardShadow()

                    // Info box
                    HStack(spacing: 12) {
                        Image.lucide("info")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 20, height: 20)
                            .foregroundColor(Theme.Colors.primary)

                        Text("Vous recevrez une confirmation par email une fois que le propriétaire aura accepté votre demande")
                            .font(Theme.Typography.bodySmall())
                            .foregroundColor(Theme.Colors.textPrimary)
                    }
                    .padding(16)
                    .background(Theme.Colors.primary.opacity(0.1))
                    .cornerRadius(12)
                }
                .padding()
            }
            .background(Theme.Colors.backgroundSecondary)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { dismiss() }) {
                        Text("Fermer")
                            .font(Theme.Typography.body(.semibold))
                            .foregroundColor(Theme.Colors.primary)
                    }
                }
            }
            .overlay(alignment: .bottom) {
                VStack(spacing: 12) {
                    Button(action: {
                        // Add to calendar
                        Haptic.impact(.medium)
                    }) {
                        HStack {
                            Image.lucide("calendar-plus")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 20, height: 20)

                            Text("Ajouter au calendrier")
                                .font(Theme.Typography.body(.semibold))
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: Theme.Size.buttonHeight)
                        .background(Theme.Colors.primaryGradient)
                        .cornerRadius(Theme.CornerRadius.button)
                    }

                    Button(action: {
                        // View all visits
                        dismiss()
                    }) {
                        Text("Voir mes visites")
                            .font(Theme.Typography.body(.semibold))
                            .foregroundColor(Theme.Colors.primary)
                            .frame(maxWidth: .infinity)
                            .frame(height: Theme.Size.buttonHeight)
                            .background(Theme.Colors.backgroundPrimary)
                            .cornerRadius(Theme.CornerRadius.button)
                            .overlay(
                                RoundedRectangle(cornerRadius: Theme.CornerRadius.button)
                                    .stroke(Theme.Colors.gray200, lineWidth: 1)
                            )
                    }
                }
                .padding()
                .background(.ultraThinMaterial)
            }
        }
    }

    private var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEE d MMMM yyyy"
        formatter.locale = Locale(identifier: "fr_FR")
        return formatter.string(from: date)
    }
}

struct DetailRow: View {
    let icon: String
    let label: String
    let value: String

    var body: some View {
        HStack(alignment: .top, spacing: 16) {
            Image.lucide(icon)
                .resizable()
                .scaledToFit()
                .frame(width: 20, height: 20)
                .foregroundColor(Theme.Colors.textTertiary)

            VStack(alignment: .leading, spacing: 4) {
                Text(label)
                    .font(Theme.Typography.bodySmall())
                    .foregroundColor(Theme.Colors.textSecondary)

                Text(value)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
            }

            Spacer()
        }
    }
}

// MARK: - Preview

struct VisitSchedulerView_Previews: PreviewProvider {
    static var previews: some View {
        VisitSchedulerView(property: .mock)
    }
}
