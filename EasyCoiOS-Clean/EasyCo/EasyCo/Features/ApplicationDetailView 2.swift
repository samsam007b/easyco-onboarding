//
//  ApplicationDetailView.swift
//  EasyCo
//
//  Détail complet d'une candidature
//

import SwiftUI

struct ApplicationDetailView: View {
    let application: Application
    @State private var showRejectDialog = false
    @State private var showAcceptDialog = false
    @State private var showScheduleVisit = false
    @State private var privateNotes = ""

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                // Header avec profil
                applicantHeader

                // Informations de base
                basicInfoSection

                // Message de motivation
                messageSection

                // Documents (placeholder)
                documentsSection

                // Planifier une visite
                scheduleVisitSection

                // Notes privées
                privateNotesSection
            }
            .padding(16)
        }
        .background(Color(hex: "F9FAFB"))
        .navigationTitle("Candidature")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Menu {
                    Button(action: { showAcceptDialog = true }) {
                        Label("Accepter", systemImage: "checkmark.circle")
                    }

                    Button(action: { showRejectDialog = true }) {
                        Label("Refuser", systemImage: "xmark.circle")
                    }

                    Button(action: {}) {
                        Label("Demander plus d'infos", systemImage: "envelope")
                    }
                } label: {
                    Image(systemName: "ellipsis.circle")
                        .foregroundColor(Color(hex: "6E56CF"))
                }
            }
        }
        .safeAreaInset(edge: .bottom) {
            actionButtons
        }
        .alert("Accepter la candidature", isPresented: $showAcceptDialog) {
            Button("Annuler", role: .cancel) {}
            Button("Accepter") {
                acceptApplication()
            }
        } message: {
            Text("Voulez-vous vraiment accepter cette candidature ?")
        }
        .alert("Refuser la candidature", isPresented: $showRejectDialog) {
            Button("Annuler", role: .cancel) {}
            Button("Refuser", role: .destructive) {
                rejectApplication()
            }
        } message: {
            Text("Voulez-vous vraiment refuser cette candidature ?")
        }
        .sheet(isPresented: $showScheduleVisit) {
            VisitCalendarView(visit: createVisitFromApplication())
        }
    }

    // MARK: - Applicant Header

    private var applicantHeader: some View {
        VStack(spacing: 16) {
            // Avatar
            Circle()
                .fill(
                    LinearGradient(
                        colors: [Color(hex: "6E56CF"), Color(hex: "8B5CF6")],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(width: 80, height: 80)
                .overlay(
                    Text(String(application.applicantName.prefix(1)))
                        .font(.system(size: 32, weight: .bold))
                        .foregroundColor(.white)
                )
                .shadow(color: Color(hex: "6E56CF").opacity(0.3), radius: 12, x: 0, y: 4)

            // Name and Status
            VStack(spacing: 8) {
                HStack(spacing: 8) {
                    Text(application.applicantName)
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(Color(hex: "111827"))

                    if application.isNew {
                        Text("NOUVEAU")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(Color(hex: "EF4444"))
                            .cornerRadius(4)
                    }
                }

                HStack(spacing: 4) {
                    Circle()
                        .fill(application.status.color)
                        .frame(width: 8, height: 8)
                    Text(application.status.displayName)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(application.status.color)
                }

                Text(application.date.formatted(date: .long, time: .shortened))
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "6B7280"))
            }
        }
        .frame(maxWidth: .infinity)
        .padding(24)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 2)
    }

    // MARK: - Basic Info Section

    private var basicInfoSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Informations")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            VStack(spacing: 12) {
                ApplicationInfoRow(icon: "building.2", label: "Propriété", value: application.propertyTitle)
                ApplicationInfoRow(icon: "person.fill", label: "Âge", value: "\(application.applicantAge) ans")

                if application.isGroup {
                    ApplicationInfoRow(
                        icon: "person.2.fill",
                        label: "Groupe",
                        value: "\(application.groupSize ?? 0) personnes"
                    )
                }

                ApplicationInfoRow(icon: "calendar", label: "Date de candidature", value: application.date.formatted(date: .abbreviated, time: .omitted))
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }

    // MARK: - Message Section

    private var messageSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Image(systemName: "text.bubble")
                    .foregroundColor(Color(hex: "6E56CF"))
                Text("Message de motivation")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))
            }

            Text(application.message)
                .font(.system(size: 15))
                .foregroundColor(Color(hex: "374151"))
                .lineSpacing(4)
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }

    // MARK: - Documents Section

    private var documentsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Image(systemName: "doc.text.fill")
                    .foregroundColor(Color(hex: "6E56CF"))
                Text("Documents fournis")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))
            }

            VStack(spacing: 12) {
                ApplicationDocumentRow(
                    icon: "person.text.rectangle",
                    name: "Pièce d'identité",
                    status: .provided
                )

                ApplicationDocumentRow(
                    icon: "eurosign.circle",
                    name: "3 derniers bulletins de salaire",
                    status: .provided
                )

                ApplicationDocumentRow(
                    icon: "building.columns",
                    name: "Attestation employeur",
                    status: .provided
                )

                ApplicationDocumentRow(
                    icon: "person.fill.checkmark",
                    name: "Garant",
                    status: .notProvided
                )
            }

            Text("À implémenter : téléchargement et visualisation des documents")
                .font(.system(size: 12))
                .foregroundColor(Color(hex: "9CA3AF"))
                .padding(.top, 4)
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }

    // MARK: - Private Notes Section

    private var privateNotesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "note.text")
                    .foregroundColor(Color(hex: "6E56CF"))
                Text("Notes privées")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))
            }

            TextEditor(text: $privateNotes)
                .frame(height: 100)
                .padding(12)
                .background(Color(hex: "F9FAFB"))
                .cornerRadius(12)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                )

            Text("Ces notes ne sont visibles que par vous")
                .font(.system(size: 12))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }

    // MARK: - Schedule Visit Section

    private var scheduleVisitSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Image(systemName: "calendar.badge.clock")
                    .font(.system(size: 18))
                    .foregroundColor(Color(hex: "6E56CF"))

                Text("Visite")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()
            }

            Button(action: { showScheduleVisit = true }) {
                HStack {
                    Image(systemName: "plus.circle.fill")
                        .font(.system(size: 16))

                    Text("Planifier une visite")
                        .font(.system(size: 15, weight: .semibold))

                    Spacer()

                    Image(systemName: "chevron.right")
                        .font(.system(size: 14))
                }
                .foregroundColor(Color(hex: "6E56CF"))
                .padding(16)
                .background(Color(hex: "F3F0FF"))
                .cornerRadius(12)
            }

            Text("Proposez un créneau de visite au candidat")
                .font(.system(size: 12))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }

    // MARK: - Action Buttons

    private var actionButtons: some View {
        HStack(spacing: 12) {
            Button(action: { showRejectDialog = true }) {
                Text("Refuser")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "EF4444"))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(Color.white)
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color(hex: "EF4444"), lineWidth: 2)
                    )
            }

            Button(action: {}) {
                Text("Demander infos")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "6E56CF"))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(Color.white)
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color(hex: "6E56CF"), lineWidth: 2)
                    )
            }

            Button(action: { showAcceptDialog = true }) {
                Text("Accepter")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(
                        LinearGradient(
                            colors: [Color(hex: "6E56CF"), Color(hex: "8B5CF6")],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .cornerRadius(12)
                    .shadow(color: Color(hex: "6E56CF").opacity(0.3), radius: 8, x: 0, y: 4)
            }
        }
        .padding(16)
        .background(Color.white)
        .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: -2)
    }

    // MARK: - Actions

    private func acceptApplication() {
        // TODO: Call API to accept application
        print("Candidature acceptée: \(application.applicantName)")
    }

    private func rejectApplication() {
        // TODO: Call API to reject application
        print("Candidature refusée: \(application.applicantName)")
    }

    private func createVisitFromApplication() -> Visit {
        Visit(
            id: UUID(),
            applicationId: application.id,
            propertyId: application.propertyId,
            applicantName: application.applicantName,
            applicantAvatar: application.applicantAvatar,
            propertyTitle: application.propertyTitle,
            scheduledDate: Date().addingTimeInterval(86400), // Tomorrow by default
            status: .pending,
            duration: 30,
            notes: nil,
            ownerNotes: nil,
            createdAt: Date(),
            confirmedAt: nil,
            cancelledAt: nil,
            cancelReason: nil
        )
    }
}

// MARK: - Application Info Row

struct ApplicationInfoRow: View {
    let icon: String
    let label: String
    let value: String

    var body: some View {
        HStack {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundColor(Color(hex: "6E56CF"))
                .frame(width: 24)

            Text(label)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "6B7280"))

            Spacer()

            Text(value)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Color(hex: "111827"))
        }
        .padding(12)
        .background(Color(hex: "F9FAFB"))
        .cornerRadius(8)
    }
}

// MARK: - Document Row

enum DocumentStatus {
    case provided
    case notProvided
    case pending

    var icon: String {
        switch self {
        case .provided: return "checkmark.circle.fill"
        case .notProvided: return "xmark.circle.fill"
        case .pending: return "clock.circle.fill"
        }
    }

    var color: Color {
        switch self {
        case .provided: return Color(hex: "10B981")
        case .notProvided: return Color(hex: "EF4444")
        case .pending: return Color(hex: "FBBF24")
        }
    }
}

struct ApplicationDocumentRow: View {
    let icon: String
    let name: String
    let status: DocumentStatus

    var body: some View {
        HStack {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundColor(Color(hex: "6E56CF"))
                .frame(width: 24)

            Text(name)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "374151"))

            Spacer()

            Image(systemName: status.icon)
                .font(.system(size: 14))
                .foregroundColor(status.color)

            if status == .provided {
                Button(action: {}) {
                    Image(systemName: "arrow.down.circle")
                        .font(.system(size: 18))
                        .foregroundColor(Color(hex: "6E56CF"))
                }
            }
        }
        .padding(12)
        .background(Color(hex: "F9FAFB"))
        .cornerRadius(8)
    }
}
