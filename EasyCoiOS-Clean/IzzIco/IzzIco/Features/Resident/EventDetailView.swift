//
//  EventDetailView.swift
//  IzzIco
//
//  Vue détaillée d'un événement avec RSVP
//

import SwiftUI

struct EventDetailView: View {
    let event: Event
    @ObservedObject var viewModel: CalendarViewModel
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    headerSection
                    dateTimeSection
                    descriptionSection
                    if event.rsvpRequired {
                        rsvpSection
                    }
                    if event.hasGuests {
                        guestsSection
                    }
                    participantsSection
                }
                .padding(16)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Fermer") { dismiss() }
                        .foregroundColor(Color(hex: "6B7280"))
                }
            }
        }
    }

    private var headerSection: some View {
        VStack(spacing: 16) {
            Circle()
                .fill(Color(hex: event.color).opacity(0.2))
                .frame(width: 80, height: 80)
                .overlay(
                    Image(systemName: event.eventType.icon)
                        .font(.system(size: 36))
                        .foregroundColor(Color(hex: event.color))
                )

            Text(event.title)
                .font(.system(size: 24, weight: .bold))
                .foregroundColor(Color(hex: "111827"))
                .multilineTextAlignment(.center)

            HStack(spacing: 6) {
                Image(systemName: "person.fill")
                    .font(.system(size: 12))
                Text("Créé par \(event.createdByName)")
                    .font(.system(size: 14))
            }
            .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity)
        .padding(24)
        .background(Color.white)
        .cornerRadius(16)
    }

    private var dateTimeSection: some View {
        VStack(spacing: 12) {
            EventInfoRow(icon: "calendar", title: "Date", value: event.startDate.formatted(date: .long, time: .omitted))

            if !event.isAllDay {
                if let endDate = event.endDate {
                    EventInfoRow(icon: "clock", title: "Heure", value: "\(event.startDate.formatted(date: .omitted, time: .shortened)) - \(endDate.formatted(date: .omitted, time: .shortened))")
                } else {
                    EventInfoRow(icon: "clock", title: "Heure", value: event.startDate.formatted(date: .omitted, time: .shortened))
                }
                EventInfoRow(icon: "hourglass", title: "Durée", value: event.formattedDuration)
            }

            if event.isRecurring, let pattern = event.recurrencePattern {
                EventInfoRow(icon: "repeat", title: "Récurrence", value: pattern.displayName)
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
    }

    private var descriptionSection: some View {
        Group {
            if let description = event.description, !description.isEmpty {
                VStack(alignment: .leading, spacing: 12) {
                    Text("Description")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    Text(description)
                        .font(.system(size: 15))
                        .foregroundColor(Color(hex: "6B7280"))
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(16)
                .background(Color.white)
                .cornerRadius(16)
            }
        }
    }

    private var rsvpSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Répondre")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            HStack(spacing: 12) {
                ForEach([RSVPStatus.accepted, .declined, .maybe], id: \.self) { status in
                    RSVPButton(status: status) {
                        _Concurrency.Task {
                            await viewModel.updateRSVP(eventId: event.id, status: status)
                            dismiss()
                        }
                    }
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
    }

    private var guestsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Invités")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            HStack(spacing: 8) {
                Image(systemName: "person.2.fill")
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "3B82F6"))

                Text("\(event.numberOfGuests) invité(s)")
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "111827"))
            }

            if !event.guestNames.isEmpty {
                VStack(alignment: .leading, spacing: 6) {
                    ForEach(event.guestNames, id: \.self) { name in
                        Text("• \(name)")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
    }

    private var participantsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Participants")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                Text("\(event.acceptedCount)/\(event.participants.count)")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "10B981"))
            }

            VStack(spacing: 12) {
                ForEach(event.participants) { participant in
                    HStack {
                        Circle()
                            .fill(Color(hex: participant.rsvpStatus.color).opacity(0.2))
                            .frame(width: 36, height: 36)
                            .overlay(
                                Text(String(participant.userName.prefix(1)))
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(Color(hex: participant.rsvpStatus.color))
                            )

                        Text(participant.userName)
                            .font(.system(size: 15))
                            .foregroundColor(Color(hex: "111827"))

                        Spacer()

                        Image(systemName: participant.rsvpStatus.icon)
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: participant.rsvpStatus.color))

                        Text(participant.rsvpStatus.displayName)
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: participant.rsvpStatus.color))
                    }
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
    }
}

struct EventInfoRow: View {
    let icon: String
    let title: String
    let value: String

    var body: some View {
        HStack {
            Image(systemName: icon)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "E8865D"))
                .frame(width: 24)

            Text(title)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Color(hex: "6B7280"))

            Spacer()

            Text(value)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "111827"))
        }
    }
}

struct RSVPButton: View {
    let status: RSVPStatus
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: status.icon)
                    .font(.system(size: 20))
                    .foregroundColor(Color(hex: status.color))

                Text(status.displayName)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(Color(hex: "111827"))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(Color(hex: status.color).opacity(0.1))
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color(hex: status.color), lineWidth: 1)
            )
        }
    }
}
