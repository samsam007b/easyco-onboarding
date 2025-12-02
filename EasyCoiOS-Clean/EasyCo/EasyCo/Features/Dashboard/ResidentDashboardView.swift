//
//  ResidentDashboardView.swift
//  EasyCo
//
//  Dashboard for current residents with rent, maintenance, documents
//

import SwiftUI

struct ResidentDashboardView: View {
    @State private var currentProperty: ResidentProperty?
    @State private var nextPayment: RentPayment?
    @State private var paymentHistory: [RentPayment] = []
    @State private var maintenanceRequests: [MaintenanceRequest] = []
    @State private var documents: [Document] = []
    @State private var expenses: [ExpenseData] = []

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    headerSection

                    // Current property card
                    if let property = currentProperty {
                        currentPropertySection(property)
                    }

                    // Next payment
                    if let payment = nextPayment {
                        nextPaymentSection(payment)
                    }

                    // Expenses breakdown
                    if !expenses.isEmpty {
                        expensesSection
                    }

                    // Quick actions
                    quickActionsSection

                    // Payment history
                    if !paymentHistory.isEmpty {
                        paymentHistorySection
                    }

                    // Maintenance requests
                    if !maintenanceRequests.isEmpty {
                        maintenanceSection
                    }

                    // Documents
                    if !documents.isEmpty {
                        documentsSection
                    }
                }
                .padding(.vertical, 20)
            }
            .background(Theme.Colors.backgroundSecondary)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Mon Logement")
                        .font(Theme.Typography.title3())
                        .foregroundColor(Theme.Colors.textPrimary)
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        // Settings
                    }) {
                        Image.lucide("settings")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 22, height: 22)
                            .foregroundColor(Theme.Colors.textPrimary)
                    }
                }
            }
        }
        .onAppear {
            loadDashboardData()
        }
    }

    // MARK: - Header Section

    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Bienvenue chez vous ! 🏠")
                .font(Theme.Typography.title2())
                .foregroundColor(Theme.Colors.textPrimary)

            Text("Gérez votre location en toute simplicité")
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal)
    }

    // MARK: - Current Property Section

    @ViewBuilder
    private func currentPropertySection(_ property: ResidentProperty) -> some View {
        VStack(spacing: 0) {
            // Property image
            AsyncImage(url: URL(string: property.imageURL)) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                Rectangle()
                    .fill(Theme.Colors.gray200)
            }
            .frame(height: 200)
            .clipped()

            VStack(alignment: .leading, spacing: 16) {
                // Title and location
                VStack(alignment: .leading, spacing: 6) {
                    Text(property.title)
                        .font(Theme.Typography.title3())
                        .foregroundColor(Theme.Colors.textPrimary)

                    HStack(spacing: 6) {
                        Image.lucide("map-pin")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 14, height: 14)
                            .foregroundColor(Theme.Colors.textTertiary)

                        Text(property.location)
                            .font(Theme.Typography.body())
                            .foregroundColor(Theme.Colors.textSecondary)
                    }
                }

                // Property details
                HStack(spacing: 20) {
                    PropertyDetail(icon: "bed", label: "\(property.bedrooms) chambres")
                    PropertyDetail(icon: "bath", label: "\(property.bathrooms) SDB")
                    PropertyDetail(icon: "ruler", label: "\(property.area)m²")
                }

                // Lease info
                VStack(spacing: 12) {
                    InfoRow(icon: "calendar", label: "Début du bail", value: property.formattedLeaseStart)
                    InfoRow(icon: "calendar-check", label: "Fin du bail", value: property.formattedLeaseEnd)
                    InfoRow(icon: "euro", label: "Loyer mensuel", value: "\(property.monthlyRent)€")
                }
            }
            .padding(20)
        }
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
        .padding(.horizontal)
    }

    // MARK: - Next Payment Section

    @ViewBuilder
    private func nextPaymentSection(_ payment: RentPayment) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Prochain paiement")
                        .font(Theme.Typography.title3())
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text("Échéance le \(payment.formattedDueDate)")
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 4) {
                    Text("\(payment.amount)€")
                        .font(.system(size: 28, weight: .bold))
                        .foregroundColor(Theme.Colors.primary)

                    if payment.daysUntilDue <= 7 {
                        HStack(spacing: 4) {
                            Image.lucide("clock")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 12, height: 12)

                            Text("Dans \(payment.daysUntilDue)j")
                                .font(Theme.Typography.bodySmall(.semibold))
                        }
                        .foregroundColor(payment.daysUntilDue <= 3 ? Theme.Colors.error : Theme.Colors.warning)
                    }
                }
            }

            Button(action: {
                Haptic.impact(.medium)
            }) {
                HStack {
                    Image.lucide("credit-card")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 20, height: 20)

                    Text("Payer maintenant")
                        .font(Theme.Typography.body(.semibold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .frame(height: Theme.Size.buttonHeight)
                .background(Theme.Colors.primaryGradient)
                .cornerRadius(Theme.CornerRadius.button)
            }
        }
        .padding(20)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
        .padding(.horizontal)
    }

    // MARK: - Expenses Section

    private var expensesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Répartition des charges")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            DonutChart(
                data: expenses,
                size: 140,
                lineWidth: 20,
                showLegend: true
            )
        }
        .padding(20)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
        .padding(.horizontal)
    }

    // MARK: - Quick Actions Section

    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Actions rapides")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)
                .padding(.horizontal)

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                QuickActionCard(
                    icon: "tool",
                    title: "Maintenance",
                    color: Color(hex: "F59E0B")
                ) {
                    // Navigate to maintenance
                }

                QuickActionCard(
                    icon: "file-text",
                    title: "Documents",
                    color: Color(hex: "60A5FA")
                ) {
                    // Navigate to documents
                }

                QuickActionCard(
                    icon: "message-circle",
                    title: "Contacter",
                    color: Color(hex: "10B981")
                ) {
                    // Navigate to messages
                }

                QuickActionCard(
                    icon: "calendar",
                    title: "Historique",
                    color: Color(hex: "8B5CF6")
                ) {
                    // Navigate to payment history
                }
            }
            .padding(.horizontal)
        }
    }

    // MARK: - Payment History Section

    private var paymentHistorySection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Historique des paiements")
                    .font(Theme.Typography.title3())
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                NavigationLink(destination: Text("Tous les paiements")) {
                    Text("Voir tout")
                        .font(Theme.Typography.bodySmall(.semibold))
                        .foregroundColor(Theme.Colors.primary)
                }
            }
            .padding(.horizontal)

            VStack(spacing: 12) {
                ForEach(paymentHistory.prefix(4)) { payment in
                    PaymentHistoryCard(payment: payment)
                }
            }
            .padding(.horizontal)
        }
    }

    // MARK: - Maintenance Section

    private var maintenanceSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Demandes de maintenance")
                    .font(Theme.Typography.title3())
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                Button(action: {
                    Haptic.impact(.light)
                }) {
                    HStack(spacing: 6) {
                        Image.lucide("plus")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 14, height: 14)

                        Text("Nouvelle")
                            .font(Theme.Typography.bodySmall(.semibold))
                    }
                    .foregroundColor(Theme.Colors.primary)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(Theme.Colors.primary.opacity(0.1))
                    .cornerRadius(8)
                }
            }
            .padding(.horizontal)

            VStack(spacing: 12) {
                ForEach(maintenanceRequests) { request in
                    MaintenanceCard(request: request)
                }
            }
            .padding(.horizontal)
        }
    }

    // MARK: - Documents Section

    private var documentsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Documents")
                    .font(Theme.Typography.title3())
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                NavigationLink(destination: Text("Tous les documents")) {
                    Text("Voir tout")
                        .font(Theme.Typography.bodySmall(.semibold))
                        .foregroundColor(Theme.Colors.primary)
                }
            }
            .padding(.horizontal)

            VStack(spacing: 12) {
                ForEach(documents.prefix(3)) { document in
                    DocumentCard(document: document)
                }
            }
            .padding(.horizontal)
        }
    }

    // MARK: - Data Loading

    private func loadDashboardData() {
        let calendar = Calendar.current
        let now = Date()

        // Current property
        currentProperty = ResidentProperty(
            id: "1",
            title: "Appartement 2 chambres - Ixelles",
            location: "Rue de la Paix 42, 1050 Ixelles",
            bedrooms: 2,
            bathrooms: 1,
            area: 75,
            monthlyRent: 950,
            leaseStart: calendar.date(byAdding: .year, value: -1, to: now)!,
            leaseEnd: calendar.date(byAdding: .year, value: 2, to: now)!,
            imageURL: "https://via.placeholder.com/600x400/FFB6C1"
        )

        // Next payment
        nextPayment = RentPayment(
            id: "next",
            amount: 950,
            dueDate: calendar.date(byAdding: .day, value: 5, to: now)!,
            status: .pending
        )

        // Payment history
        paymentHistory = [
            RentPayment(
                id: "1",
                amount: 950,
                dueDate: calendar.date(byAdding: .month, value: -1, to: now)!,
                status: .paid,
                paidDate: calendar.date(byAdding: .month, value: -1, to: now)!
            ),
            RentPayment(
                id: "2",
                amount: 950,
                dueDate: calendar.date(byAdding: .month, value: -2, to: now)!,
                status: .paid,
                paidDate: calendar.date(byAdding: .month, value: -2, to: now)!
            ),
            RentPayment(
                id: "3",
                amount: 950,
                dueDate: calendar.date(byAdding: .month, value: -3, to: now)!,
                status: .paid,
                paidDate: calendar.date(byAdding: .month, value: -3, to: now)!
            ),
            RentPayment(
                id: "4",
                amount: 950,
                dueDate: calendar.date(byAdding: .month, value: -4, to: now)!,
                status: .paid,
                paidDate: calendar.date(byAdding: .month, value: -4, to: now)!
            )
        ]

        // Expenses breakdown
        expenses = [
            DonutChartData(label: "Loyer", value: 950, color: Theme.Colors.primary),
            DonutChartData(label: "Charges", value: 150, color: Color(hex: "60A5FA")),
            DonutChartData(label: "Internet", value: 40, color: Color(hex: "10B981")),
            DonutChartData(label: "Électricité", value: 80, color: Color(hex: "F59E0B"))
        ]

        // Maintenance requests
        maintenanceRequests = [
            MaintenanceRequest(
                id: "1",
                title: "Fuite d'eau dans la cuisine",
                description: "Le robinet goutte depuis 2 jours",
                status: .inProgress,
                createdAt: calendar.date(byAdding: .day, value: -3, to: now)!,
                priority: .high
            ),
            MaintenanceRequest(
                id: "2",
                title: "Ampoule grillée dans le salon",
                description: "L'ampoule du plafonnier ne fonctionne plus",
                status: .pending,
                createdAt: calendar.date(byAdding: .day, value: -1, to: now)!,
                priority: .low
            )
        ]

        // Documents
        documents = [
            Document(
                id: "1",
                title: "Contrat de location",
                type: .contract,
                uploadedAt: calendar.date(byAdding: .year, value: -1, to: now)!,
                size: "2.4 MB"
            ),
            Document(
                id: "2",
                title: "État des lieux d'entrée",
                type: .inventory,
                uploadedAt: calendar.date(byAdding: .year, value: -1, to: now)!,
                size: "5.1 MB"
            ),
            Document(
                id: "3",
                title: "Quittance Novembre 2025",
                type: .receipt,
                uploadedAt: calendar.date(byAdding: .month, value: -1, to: now)!,
                size: "245 KB"
            )
        ]
    }
}

// MARK: - Supporting Models

struct ResidentProperty: Identifiable {
    let id: String
    let title: String
    let location: String
    let bedrooms: Int
    let bathrooms: Int
    let area: Int
    let monthlyRent: Int
    let leaseStart: Date
    let leaseEnd: Date
    let imageURL: String

    var formattedLeaseStart: String {
        formatDate(leaseStart)
    }

    var formattedLeaseEnd: String {
        formatDate(leaseEnd)
    }

    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "d MMMM yyyy"
        formatter.locale = Locale(identifier: "fr_FR")
        return formatter.string(from: date)
    }
}

struct RentPayment: Identifiable {
    let id: String
    let amount: Int
    let dueDate: Date
    let status: PaymentStatus
    var paidDate: Date?

    var formattedDueDate: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "d MMMM"
        formatter.locale = Locale(identifier: "fr_FR")
        return formatter.string(from: dueDate)
    }

    var daysUntilDue: Int {
        let calendar = Calendar.current
        let now = Date()
        let components = calendar.dateComponents([.day], from: now, to: dueDate)
        return max(0, components.day ?? 0)
    }
}

enum PaymentStatus {
    case pending
    case paid
    case overdue

    var color: Color {
        switch self {
        case .pending: return Theme.Colors.warning
        case .paid: return Theme.Colors.success
        case .overdue: return Theme.Colors.error
        }
    }

    var label: String {
        switch self {
        case .pending: return "En attente"
        case .paid: return "Payé"
        case .overdue: return "En retard"
        }
    }

    var icon: String {
        switch self {
        case .pending: return "clock"
        case .paid: return "check-circle"
        case .overdue: return "alert-circle"
        }
    }
}

struct MaintenanceRequest: Identifiable {
    let id: String
    let title: String
    let description: String
    let status: MaintenanceStatus
    let createdAt: Date
    let priority: MaintenancePriority

    var timeAgo: String {
        let now = Date()
        let interval = now.timeIntervalSince(createdAt)
        let days = Int(interval / 86400)
        if days == 0 {
            return "Aujourd'hui"
        } else {
            return "Il y a \(days)j"
        }
    }
}

enum MaintenanceStatus {
    case pending
    case inProgress
    case completed

    var color: Color {
        switch self {
        case .pending: return Theme.Colors.warning
        case .inProgress: return Color(hex: "60A5FA")
        case .completed: return Theme.Colors.success
        }
    }

    var label: String {
        switch self {
        case .pending: return "En attente"
        case .inProgress: return "En cours"
        case .completed: return "Terminé"
        }
    }
}

enum MaintenancePriority {
    case low
    case medium
    case high

    var color: Color {
        switch self {
        case .low: return Theme.Colors.success
        case .medium: return Theme.Colors.warning
        case .high: return Theme.Colors.error
        }
    }

    var label: String {
        switch self {
        case .low: return "Basse"
        case .medium: return "Moyenne"
        case .high: return "Haute"
        }
    }
}

struct Document: Identifiable {
    let id: String
    let title: String
    let type: DocumentType
    let uploadedAt: Date
    let size: String

    var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "d MMM yyyy"
        formatter.locale = Locale(identifier: "fr_FR")
        return formatter.string(from: uploadedAt)
    }
}

enum DocumentType {
    case contract
    case inventory
    case receipt
    case other

    var icon: String {
        switch self {
        case .contract: return "file-text"
        case .inventory: return "clipboard-check"
        case .receipt: return "receipt"
        case .other: return "file"
        }
    }

    var color: Color {
        switch self {
        case .contract: return Theme.Colors.primary
        case .inventory: return Color(hex: "60A5FA")
        case .receipt: return Color(hex: "10B981")
        case .other: return Theme.Colors.gray400
        }
    }
}

typealias ExpenseData = DonutChartData

// MARK: - Supporting Views

struct PropertyDetail: View {
    let icon: String
    let label: String

    var body: some View {
        HStack(spacing: 6) {
            Image.lucide(icon)
                .resizable()
                .scaledToFit()
                .frame(width: 16, height: 16)
                .foregroundColor(Theme.Colors.textTertiary)

            Text(label)
                .font(Theme.Typography.bodySmall())
                .foregroundColor(Theme.Colors.textSecondary)
        }
    }
}

struct InfoRow: View {
    let icon: String
    let label: String
    let value: String

    var body: some View {
        HStack(spacing: 12) {
            Image.lucide(icon)
                .resizable()
                .scaledToFit()
                .frame(width: 16, height: 16)
                .foregroundColor(Theme.Colors.textTertiary)

            Text(label)
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textSecondary)

            Spacer()

            Text(value)
                .font(Theme.Typography.body(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)
        }
        .padding(.vertical, 4)
    }
}

struct QuickActionCard: View {
    let icon: String
    let title: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: {
            Haptic.impact(.light)
            action()
        }) {
            VStack(spacing: 12) {
                Image.lucide(icon)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 24, height: 24)
                    .foregroundColor(.white)
                    .frame(width: 60, height: 60)
                    .background(
                        LinearGradient(
                            colors: [color, color.opacity(0.8)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .cornerRadius(16)

                Text(title)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 20)
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.card)
            .cardShadow()
        }
    }
}

struct PaymentHistoryCard: View {
    let payment: RentPayment

    var body: some View {
        HStack(spacing: 16) {
            Image.lucide(payment.status.icon)
                .resizable()
                .scaledToFit()
                .frame(width: 20, height: 20)
                .foregroundColor(payment.status.color)
                .frame(width: 48, height: 48)
                .background(payment.status.color.opacity(0.1))
                .cornerRadius(12)

            VStack(alignment: .leading, spacing: 4) {
                Text("Loyer de \(payment.formattedDueDate)")
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(payment.status.label)
                    .font(Theme.Typography.bodySmall())
                    .foregroundColor(payment.status.color)
            }

            Spacer()

            Text("\(payment.amount)€")
                .font(Theme.Typography.body(.bold))
                .foregroundColor(Theme.Colors.textPrimary)
        }
        .padding(16)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }
}

struct MaintenanceCard: View {
    let request: MaintenanceRequest

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                HStack(spacing: 6) {
                    Circle()
                        .fill(request.status.color)
                        .frame(width: 8, height: 8)

                    Text(request.status.label)
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(request.status.color)
                }
                .padding(.horizontal, 10)
                .padding(.vertical, 5)
                .background(request.status.color.opacity(0.1))
                .cornerRadius(8)

                Spacer()

                HStack(spacing: 4) {
                    Image.lucide("alert-circle")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 12, height: 12)

                    Text(request.priority.label)
                        .font(.system(size: 11, weight: .semibold))
                }
                .foregroundColor(request.priority.color)
            }

            VStack(alignment: .leading, spacing: 6) {
                Text(request.title)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(request.description)
                    .font(Theme.Typography.bodySmall())
                    .foregroundColor(Theme.Colors.textSecondary)
                    .lineLimit(2)
            }

            Text(request.timeAgo)
                .font(Theme.Typography.caption())
                .foregroundColor(Theme.Colors.textTertiary)
        }
        .padding(16)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }
}

struct DocumentCard: View {
    let document: Document

    var body: some View {
        HStack(spacing: 16) {
            Image.lucide(document.type.icon)
                .resizable()
                .scaledToFit()
                .frame(width: 20, height: 20)
                .foregroundColor(document.type.color)
                .frame(width: 48, height: 48)
                .background(document.type.color.opacity(0.1))
                .cornerRadius(12)

            VStack(alignment: .leading, spacing: 4) {
                Text(document.title)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .lineLimit(1)

                HStack(spacing: 8) {
                    Text(document.formattedDate)
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)

                    Text("•")
                        .foregroundColor(Theme.Colors.textTertiary)

                    Text(document.size)
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }

            Spacer()

            Button(action: {
                Haptic.impact(.light)
            }) {
                Image.lucide("download")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 20, height: 20)
                    .foregroundColor(Theme.Colors.primary)
            }
        }
        .padding(16)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }
}

// MARK: - Preview

struct ResidentDashboardView_Previews: PreviewProvider {
    static var previews: some View {
        ResidentDashboardView()
    }
}
