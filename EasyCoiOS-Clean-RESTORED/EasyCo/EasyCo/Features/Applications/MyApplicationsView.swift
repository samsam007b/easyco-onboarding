import SwiftUI

// MARK: - My Applications View

struct MyApplicationsView: View {
    @StateObject private var viewModel = MyApplicationsViewModel()
    @State private var selectedFilter: ApplicationStatus?

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Filters
                filterBar

                // Content
                Group {
                    if viewModel.isLoading {
                        LoadingView(message: "Chargement de vos candidatures...")
                    } else if viewModel.filteredApplications.isEmpty {
                        emptyStateView
                    } else {
                        applicationsList
                    }
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationTitle("Mes Candidatures")
            .navigationBarTitleDisplayMode(.inline)
        }
        .task {
            await viewModel.loadApplications()
        }
    }

    // MARK: - Filter Bar

    private var filterBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                FilterChip(
                    title: "Toutes",
                    isSelected: selectedFilter == nil,
                    count: viewModel.applications.count
                ) {
                    selectedFilter = nil
                    viewModel.filterApplications(by: nil)
                }

                ForEach([ApplicationStatus.pending, .reviewing, .accepted, .rejected], id: \.self) { status in
                    FilterChip(
                        title: status.displayName,
                        isSelected: selectedFilter == status,
                        count: viewModel.applications.filter { $0.status == status }.count
                    ) {
                        selectedFilter = status
                        viewModel.filterApplications(by: status)
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
        .background(Color.white)
    }

    // MARK: - Applications List

    private var applicationsList: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(viewModel.filteredApplications) { application in
                    NavigationLink(destination: SearcherApplicationDetailView(application: application)) {
                        SearcherApplicationCard(
                            application: application,
                            onWithdraw: {
                                viewModel.withdrawApplication(application.id)
                            }
                        )
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
            .padding(16)
        }
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 24) {
            Spacer()

            ZStack {
                Circle()
                    .fill(Color(hex: "FFF4ED"))
                    .frame(width: 120, height: 120)

                Image(systemName: "doc.text.magnifyingglass")
                    .font(.system(size: 48))
                    .foregroundColor(Color(hex: "FFA040"))
            }

            VStack(spacing: 12) {
                Text(selectedFilter == nil ? "Aucune candidature" : "Aucune candidature \(selectedFilter!.displayName.lowercased())")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Explorez les propriétés et postulez pour commencer votre recherche")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// MARK: - Searcher Application Card

struct SearcherApplicationCard: View {
    let application: SearcherApplication
    let onWithdraw: () -> Void
    @State private var showWithdrawAlert = false

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Candidature pour")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "6B7280"))

                    Text("Studio Paris 15e") // TODO: Get property title
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Color(hex: "111827"))
                        .lineLimit(2)

                    Text("Envoyée le \(application.submittedAt.formatted(date: .abbreviated, time: .omitted))")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                Spacer()

                // Status badge
                Text(application.status.displayName)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 5)
                    .background(Color(hex: application.status.color))
                    .cornerRadius(999)
            }

            Divider()

            // Quick info
            HStack(spacing: 24) {
                InfoItem(
                    icon: "doc.text",
                    value: "\(application.documents.count)",
                    label: "Documents"
                )

                InfoItem(
                    icon: "person",
                    value: application.personalInfo.firstName,
                    label: "Candidat"
                )
            }

            // Actions
            if application.status == .pending || application.status == .reviewing {
                HStack(spacing: 12) {
                    Button(action: { showWithdrawAlert = true }) {
                        HStack(spacing: 6) {
                            Image(systemName: "xmark")
                            Text("Retirer")
                        }
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(Color(hex: "EF4444"))
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(Color(hex: "FEF2F2"))
                        .cornerRadius(999)
                    }

                    Spacer()

                    Button(action: {}) {
                        HStack(spacing: 6) {
                            Text("Voir détails")
                            Image(systemName: "chevron.right")
                        }
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(Color(hex: "FFA040"))
                    }
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 2)
        .alert("Retirer la candidature", isPresented: $showWithdrawAlert) {
            Button("Annuler", role: .cancel) {}
            Button("Retirer", role: .destructive) {
                onWithdraw()
            }
        } message: {
            Text("Êtes-vous sûr de vouloir retirer cette candidature ?")
        }
    }
}

// MARK: - Info Item

struct InfoItem: View {
    let icon: String
    let value: String
    let label: String

    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "6B7280"))

            VStack(alignment: .leading, spacing: 2) {
                Text(value)
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))
                Text(label)
                    .font(.system(size: 11))
                    .foregroundColor(Color(hex: "6B7280"))
            }
        }
    }
}

// MARK: - Searcher Application Detail View

struct SearcherApplicationDetailView: View {
    let application: SearcherApplication

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                // Status
                VStack(alignment: .leading, spacing: 12) {
                    Text("Statut de la candidature")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(Color(hex: "374151"))

                    HStack {
                        Image(systemName: statusIcon)
                            .font(.system(size: 20))
                            .foregroundColor(Color(hex: application.status.color))

                        VStack(alignment: .leading, spacing: 4) {
                            Text(application.status.displayName)
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(Color(hex: "111827"))

                            Text(statusDescription)
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "6B7280"))
                        }

                        Spacer()
                    }
                    .padding(16)
                    .background(Color(hex: application.status.color).opacity(0.1))
                    .cornerRadius(12)
                }

                // Personal Info
                InfoSection(title: "Informations personnelles") {
                    DetailRow(label: "Nom", value: "\(application.personalInfo.firstName) \(application.personalInfo.lastName)")
                    DetailRow(label: "Email", value: application.personalInfo.email)
                    DetailRow(label: "Téléphone", value: application.personalInfo.phone)
                    DetailRow(label: "Nationalité", value: application.personalInfo.nationality)
                }

                // Professional Info
                InfoSection(title: "Situation professionnelle") {
                    DetailRow(label: "Statut", value: application.professionalInfo.employmentStatus.displayName)
                    DetailRow(label: "Entreprise", value: application.professionalInfo.companyName)
                    DetailRow(label: "Poste", value: application.professionalInfo.position)
                    DetailRow(label: "Revenus", value: "€\(Int(application.professionalInfo.monthlyIncome))/mois")
                }

                // Documents
                InfoSection(title: "Documents fournis") {
                    ForEach(application.documents) { document in
                        DocumentRow(document: document)
                    }
                }

                // Motivation
                if !application.motivationMessage.isEmpty {
                    InfoSection(title: "Message de motivation") {
                        Text(application.motivationMessage)
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "374151"))
                            .padding(16)
                            .background(Color(hex: "F9FAFB"))
                            .cornerRadius(8)
                    }
                }
            }
            .padding(16)
        }
        .background(Color(hex: "F9FAFB"))
        .navigationTitle("Détails de la candidature")
        .navigationBarTitleDisplayMode(.inline)
    }

    private var statusIcon: String {
        switch application.status {
        case .pending: return "clock.fill"
        case .reviewing: return "eye.fill"
        case .accepted: return "checkmark.circle.fill"
        case .rejected: return "xmark.circle.fill"
        case .withdrawn: return "arrow.uturn.backward.circle.fill"
        }
    }

    private var statusDescription: String {
        switch application.status {
        case .pending: return "Votre candidature est en attente d'examen"
        case .reviewing: return "Le propriétaire examine votre dossier"
        case .accepted: return "Félicitations ! Votre candidature a été acceptée"
        case .rejected: return "Votre candidature n'a pas été retenue"
        case .withdrawn: return "Vous avez retiré cette candidature"
        }
    }
}

// MARK: - Info Section

struct InfoSection<Content: View>: View {
    let title: String
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            VStack(spacing: 0) {
                content
            }
            .background(Color.white)
            .cornerRadius(12)
        }
    }
}

// MARK: - Detail Row

struct DetailRow: View {
    let label: String
    let value: String

    var body: some View {
        HStack {
            Text(label)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "6B7280"))
            Spacer()
            Text(value)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Color(hex: "111827"))
                .multilineTextAlignment(.trailing)
        }
        .padding(16)
    }
}

// MARK: - Document Row

struct DocumentRow: View {
    let document: ApplicationDocument

    var body: some View {
        HStack {
            Image(systemName: document.type.icon)
                .foregroundColor(Color(hex: "10B981"))

            Text(document.type.displayName)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "111827"))

            Spacer()

            Image(systemName: "checkmark.circle.fill")
                .foregroundColor(Color(hex: "10B981"))
        }
        .padding(16)
    }
}

// MARK: - ViewModel

class MyApplicationsViewModel: ObservableObject {
    @Published var applications: [SearcherApplication] = []
    @Published var filteredApplications: [SearcherApplication] = []
    @Published var isLoading = false

    func loadApplications() async {
        isLoading = true

        if AppConfig.FeatureFlags.demoMode {
            try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
            applications = SearcherApplication.mockApplications
            filteredApplications = applications
        }

        isLoading = false
    }

    func filterApplications(by status: ApplicationStatus?) {
        if let status = status {
            filteredApplications = applications.filter { $0.status == status }
        } else {
            filteredApplications = applications
        }
    }

    func withdrawApplication(_ id: UUID) {
        if let index = applications.firstIndex(where: { $0.id == id }) {
            applications[index].status = .withdrawn
            filterApplications(by: nil)
        }
    }
}
