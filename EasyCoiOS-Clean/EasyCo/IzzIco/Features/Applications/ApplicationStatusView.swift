//
//  ApplicationStatusView.swift
//  IzzIco
//
//  Track application status with timeline
//

import SwiftUI

struct ApplicationStatusView: View {
    let application: DetailedApplication

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Property card
                propertyCard

                // Status card
                statusCard

                // Timeline
                timeline

                // Documents section
                documentsSection

                // Actions
                actionsSection
            }
            .padding()
        }
        .background(Theme.Colors.backgroundSecondary)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .principal) {
                Text("Ma candidature")
                    .font(Theme.Typography.title3())
                    .foregroundColor(Theme.Colors.textPrimary)
            }
        }
    }

    // MARK: - Property Card

    private var propertyCard: some View {
        HStack(spacing: 12) {
            AsyncImage(url: URL(string: application.property.images.first ?? "")) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                Rectangle()
                    .fill(Theme.Colors.gray200)
            }
            .frame(width: 100, height: 100)
            .cornerRadius(12)

            VStack(alignment: .leading, spacing: 8) {
                Text(application.property.title)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .lineLimit(2)

                HStack(spacing: 4) {
                    Image.lucide("map-pin")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 12, height: 12)
                        .foregroundColor(Theme.Colors.textTertiary)

                    Text(application.property.locationString)
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)
                        .lineLimit(1)
                }

                HStack(alignment: .firstTextBaseline, spacing: 4) {
                    Text("\(application.property.price)€")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Theme.Colors.primary)

                    Text("/mois")
                        .font(Theme.Typography.caption())
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }

            Spacer()
        }
        .padding(16)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }

    // MARK: - Status Card

    private var statusCard: some View {
        VStack(spacing: 16) {
            HStack {
                Image.lucide(application.status.icon)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 28, height: 28)
                    .foregroundColor(application.status.color)
                    .frame(width: 60, height: 60)
                    .background(application.status.color.opacity(0.1))
                    .cornerRadius(16)

                VStack(alignment: .leading, spacing: 6) {
                    Text(application.status.title)
                        .font(Theme.Typography.title3())
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text(application.status.description)
                        .font(Theme.Typography.body())
                        .foregroundColor(Theme.Colors.textSecondary)
                }

                Spacer()
            }

            if let nextStep = application.status.nextStep {
                HStack(spacing: 12) {
                    Image.lucide("info")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 16, height: 16)
                        .foregroundColor(Theme.Colors.primary)

                    Text(nextStep)
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textPrimary)

                    Spacer()
                }
                .padding(12)
                .background(Theme.Colors.primary.opacity(0.1))
                .cornerRadius(8)
            }
        }
        .padding(20)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }

    // MARK: - Timeline

    private var timeline: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Suivi de candidature")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            VStack(spacing: 0) {
                ForEach(Array(application.timeline.enumerated()), id: \.element.id) { index, event in
                    TimelineEventView(
                        event: event,
                        isLast: index == application.timeline.count - 1
                    )
                }
            }
        }
        .padding(20)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }

    // MARK: - Documents Section

    private var documentsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Documents")
                    .font(Theme.Typography.title3())
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                Text("\(application.documents.count) fichiers")
                    .font(Theme.Typography.bodySmall())
                    .foregroundColor(Theme.Colors.textSecondary)
            }

            VStack(spacing: 12) {
                ForEach(application.documents) { document in
                    DocumentRow(document: document)
                }
            }
        }
        .padding(20)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }

    // MARK: - Actions Section

    private var actionsSection: some View {
        VStack(spacing: 12) {
            Button(action: {
                Haptic.impact(.medium)
            }) {
                HStack {
                    Image.lucide("message-circle")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 20, height: 20)

                    Text("Contacter le propriétaire")
                        .font(Theme.Typography.body(.semibold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .frame(height: Theme.Size.buttonHeight)
                .background(Theme.Colors.primaryGradient)
                .cornerRadius(Theme.CornerRadius.button)
            }

            if application.status == .pending || application.status == .underReview {
                Button(action: {
                    Haptic.impact(.light)
                }) {
                    HStack {
                        Image.lucide("x-circle")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 20, height: 20)

                        Text("Annuler ma candidature")
                            .font(Theme.Typography.body(.semibold))
                    }
                    .foregroundColor(Theme.Colors.error)
                    .frame(maxWidth: .infinity)
                    .frame(height: Theme.Size.buttonHeight)
                    .background(Theme.Colors.backgroundPrimary)
                    .cornerRadius(Theme.CornerRadius.button)
                    .overlay(
                        RoundedRectangle(cornerRadius: Theme.CornerRadius.button)
                            .stroke(Theme.Colors.error, lineWidth: 1.5)
                    )
                }
            }
        }
    }
}

// MARK: - Supporting Models

struct DetailedApplication: Identifiable {
    let id: String
    let property: Property
    let status: DetailedApplicationStatus
    let submittedAt: Date
    let timeline: [TimelineEvent]
    let documents: [ApplicationDocument]
}

enum DetailedApplicationStatus {
    case pending
    case underReview
    case documentsRequested
    case visitScheduled
    case accepted
    case rejected

    var icon: String {
        switch self {
        case .pending: return "clock"
        case .underReview: return "search"
        case .documentsRequested: return "file-text"
        case .visitScheduled: return "calendar-check"
        case .accepted: return "check-circle"
        case .rejected: return "x-circle"
        }
    }

    var color: Color {
        switch self {
        case .pending: return Theme.Colors.warning
        case .underReview: return Color(hex: "60A5FA")
        case .documentsRequested: return Color(hex: "F59E0B")
        case .visitScheduled: return Color(hex: "10B981")
        case .accepted: return Theme.Colors.success
        case .rejected: return Theme.Colors.error
        }
    }

    var title: String {
        switch self {
        case .pending: return "Candidature en attente"
        case .underReview: return "Dossier en cours d'examen"
        case .documentsRequested: return "Documents complémentaires requis"
        case .visitScheduled: return "Visite programmée"
        case .accepted: return "Candidature acceptée !"
        case .rejected: return "Candidature refusée"
        }
    }

    var description: String {
        switch self {
        case .pending:
            return "Votre dossier a été envoyé au propriétaire"
        case .underReview:
            return "Le propriétaire examine actuellement votre dossier"
        case .documentsRequested:
            return "Le propriétaire a besoin de documents supplémentaires"
        case .visitScheduled:
            return "Une visite du logement est prévue"
        case .accepted:
            return "Félicitations ! Vous pouvez signer le bail"
        case .rejected:
            return "Malheureusement votre candidature n'a pas été retenue"
        }
    }

    var nextStep: String? {
        switch self {
        case .pending:
            return "Le propriétaire vous répondra sous 48h"
        case .underReview:
            return "Vous recevrez une réponse prochainement"
        case .documentsRequested:
            return "Consultez la liste des documents demandés ci-dessous"
        case .visitScheduled:
            return "Préparez vos questions pour la visite"
        case .accepted:
            return "Contactez le propriétaire pour finaliser la location"
        case .rejected:
            return nil
        }
    }
}

struct TimelineEvent: Identifiable {
    let id = UUID().uuidString
    let title: String
    let description: String
    let date: Date
    let isCompleted: Bool

    var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "d MMM yyyy à HH:mm"
        formatter.locale = Locale(identifier: "fr_FR")
        return formatter.string(from: date)
    }
}

// struct ApplicationDocument: Identifiable {
//     let id = UUID().uuidString
//     let name: String
//     let type: String
//     let size: String
//     let uploadedAt: Date
//
//     var formattedDate: String {
//         let formatter = DateFormatter()
//         formatter.dateFormat = "d MMM yyyy"
//         formatter.locale = Locale(identifier: "fr_FR")
//         return formatter.string(from: uploadedAt)
//     }
// }

// MARK: - Supporting Views

struct TimelineEventView: View {
    let event: TimelineEvent
    let isLast: Bool

    var body: some View {
        HStack(alignment: .top, spacing: 16) {
            // Timeline indicator
            VStack(spacing: 0) {
                Circle()
                    .fill(event.isCompleted ? Theme.Colors.primary : Theme.Colors.gray300)
                    .frame(width: 12, height: 12)
                    .overlay(
                        Circle()
                            .stroke(event.isCompleted ? Theme.Colors.primary.opacity(0.3) : Theme.Colors.gray200, lineWidth: 4)
                    )

                if !isLast {
                    Rectangle()
                        .fill(Theme.Colors.gray200)
                        .frame(width: 2)
                        .frame(maxHeight: .infinity)
                }
            }
            .frame(height: isLast ? 12 : nil)

            // Event content
            VStack(alignment: .leading, spacing: 6) {
                Text(event.title)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(event.description)
                    .font(Theme.Typography.bodySmall())
                    .foregroundColor(Theme.Colors.textSecondary)

                Text(event.formattedDate)
                    .font(Theme.Typography.caption())
                    .foregroundColor(Theme.Colors.textTertiary)
            }
            .padding(.bottom, isLast ? 0 : 24)

            Spacer()
        }
    }
}

// struct DocumentRow: View {
//     let document: ApplicationDocument
//
//     var body: some View {
//         HStack(spacing: 16) {
//             Image.lucide("file-text")
//                 .resizable()
//                 .scaledToFit()
//                 .frame(width: 20, height: 20)
//                 .foregroundColor(Theme.Colors.primary)
//                 .frame(width: 48, height: 48)
//                 .background(Theme.Colors.primary.opacity(0.1))
//                 .cornerRadius(12)
//
//             VStack(alignment: .leading, spacing: 4) {
//                 Text(document.name)
//                     .font(Theme.Typography.body(.semibold))
//                     .foregroundColor(Theme.Colors.textPrimary)
//                     .lineLimit(1)
//
//                 HStack(spacing: 8) {
//                     Text(document.type)
//                         .font(Theme.Typography.bodySmall())
//                         .foregroundColor(Theme.Colors.textSecondary)
//
//                     Text("•")
//                         .foregroundColor(Theme.Colors.textTertiary)
//
//                     Text(document.size)
//                         .font(Theme.Typography.bodySmall())
//                         .foregroundColor(Theme.Colors.textSecondary)
//
//                     Text("•")
//                         .foregroundColor(Theme.Colors.textTertiary)
//
//                     Text(document.formattedDate)
//                         .font(Theme.Typography.bodySmall())
//                         .foregroundColor(Theme.Colors.textSecondary)
//                 }
//             }
//
//             Spacer()
//
//             Button(action: {
//                 Haptic.impact(.light)
//             }) {
//                 Image.lucide("download")
//                     .resizable()
//                     .scaledToFit()
//                     .frame(width: 20, height: 20)
//                     .foregroundColor(Theme.Colors.primary)
//             }
//         }
//         .padding(12)
//         .background(Theme.Colors.backgroundSecondary)
//         .cornerRadius(8)
//     }
// }

// MARK: - Preview

struct ApplicationStatusView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            ApplicationStatusView(
                application: DetailedApplication(
                    id: "1",
                    property: .mock,
                    status: .underReview,
                    submittedAt: Calendar.current.date(byAdding: .day, value: -3, to: Date())!,
                    timeline: [
                        TimelineEvent(
                            title: "Candidature envoyée",
                            description: "Votre dossier a été transmis au propriétaire",
                            date: Calendar.current.date(byAdding: .day, value: -3, to: Date())!,
                            isCompleted: true
                        ),
                        TimelineEvent(
                            title: "Dossier en cours d'examen",
                            description: "Le propriétaire examine votre candidature",
                            date: Calendar.current.date(byAdding: .day, value: -2, to: Date())!,
                            isCompleted: true
                        ),
                        TimelineEvent(
                            title: "En attente de réponse",
                            description: "Vous serez notifié de la décision du propriétaire",
                            date: Date(),
                            isCompleted: false
                        )
                    ],
                    documents: [
                        ApplicationDocument(
                            type: .idCard,
                            fileName: "carte_identite.pdf",
                            fileURL: "https://example.com/documents/carte_identite.pdf",
                            uploadedAt: Calendar.current.date(byAdding: .day, value: -3, to: Date())!
                        ),
                        ApplicationDocument(
                            type: .payslip,
                            fileName: "fiches_paie_3mois.pdf",
                            fileURL: "https://example.com/documents/fiches_paie.pdf",
                            uploadedAt: Calendar.current.date(byAdding: .day, value: -3, to: Date())!
                        ),
                        ApplicationDocument(
                            type: .idCard,
                            fileName: "justificatif_domicile.pdf",
                            fileURL: "https://example.com/documents/justificatif_domicile.pdf",
                            uploadedAt: Calendar.current.date(byAdding: .day, value: -3, to: Date())!
                        )
                    ]
                )
            )
        }
    }
}
