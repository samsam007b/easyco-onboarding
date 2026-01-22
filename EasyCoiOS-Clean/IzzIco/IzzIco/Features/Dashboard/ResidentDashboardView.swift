//
//  ResidentDashboardView.swift
//  IzzIco
//
//  Dashboard for current residents with rent, maintenance, documents
//  Migrated to DesignTokens v3.3 on 2026-01-22
//

import SwiftUI

struct ResidentDashboardView: View {
    @StateObject private var viewModel = ResidentDashboardViewModel()

    // Animation states
    @State private var headerAppear = false
    @State private var propertyAppear = false
    @State private var paymentAppear = false
    @State private var expensesAppear = false
    @State private var quickActionsAppear = false

    // Sheet states
    @State private var showProfileSheet = false
    @State private var showAlertsSheet = false
    @State private var showMenuSheet = false

    private let role: Theme.UserRole = .resident

    var body: some View {
        ZStack(alignment: .top) {
            // Background
            PinterestBackground(role: role, intensity: 0.15)
                .ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                VStack(spacing: 24) {
                    // Spacer for floating header
                    Color.clear.frame(height: 70)

                    // Header
                    headerSection

                    // KPI Cards
                    kpiCardsSection

                    // Current property card
                    if let property = viewModel.currentProperty {
                        currentPropertySection(property)
                    }

                    // Next payment
                    if let payment = viewModel.nextPayment {
                        nextPaymentSection(payment)
                    }

                    // Hub de colocation
                    hubSection

                    // Expenses breakdown
                    if !viewModel.expensesData.isEmpty {
                        expensesSection
                    }

                    // Quick actions
                    quickActionsSection

                    // Payment history
                    if !viewModel.paymentHistory.isEmpty {
                        paymentHistorySection
                    }

                    // Maintenance requests
                    if !viewModel.maintenanceRequests.isEmpty {
                        maintenanceSection
                    }

                    // Documents
                    if !viewModel.documents.isEmpty {
                        documentsSection
                    }
                }
                .padding(.vertical, 20)
                .padding(.bottom, 100)
            }

            // Floating Header
            FloatingHeaderView(
                role: role,
                showAddButton: false,
                onProfileTap: { showProfileSheet = true },
                onAlertTap: { showAlertsSheet = true },
                onMenuTap: { showMenuSheet = true },
                onAddTap: nil
            )
        }
        .sheet(isPresented: $showProfileSheet) {
            ProfileView()
        }
        .sheet(isPresented: $showAlertsSheet) {
            AlertsView()
        }
        .sheet(isPresented: $showMenuSheet) {
            MenuView()
        }
        .task {
            await viewModel.loadDashboard()
            triggerAnimations()
        }
    }

    private func triggerAnimations() {
        withAnimation {
            headerAppear = true
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            withAnimation {
                propertyAppear = true
            }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
            withAnimation {
                paymentAppear = true
            }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            withAnimation {
                expensesAppear = true
            }
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) {
            withAnimation {
                quickActionsAppear = true
            }
        }
    }

    // MARK: - KPI Cards Section

    private var kpiCardsSection: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                NavigationLink(destination: ResidentHubView()) {
                    KPICardCompact(
                        icon: "users",
                        title: "Colocataires",
                        value: "\(viewModel.roommatesCount)",
                        color: Theme.Colors.Resident.primary
                    )
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: MessagesListView()) {
                    KPICardCompact(
                        icon: "message-circle",
                        title: "Messages",
                        value: "\(viewModel.unreadMessages)",
                        color: DesignTokens.Semantic.warning,
                        hasNotification: viewModel.unreadMessages > 0
                    )
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: TasksView()) {
                    KPICardCompact(
                        icon: "check-square",
                        title: "Tâches",
                        value: "\(viewModel.pendingTasks)",
                        color: DesignTokens.Semantic.success
                    )
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: ExpensesView()) {
                    KPICardCompact(
                        icon: "euro",
                        title: "Charges",
                        value: "\(viewModel.sharedExpenses)€",
                        color: Theme.Colors.Resident._400
                    )
                }
                .buttonStyle(PlainButtonStyle())
            }
            .padding(.horizontal)
        }
    }

    // MARK: - Hub Section

    private var hubSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                HStack(spacing: 8) {
                    Image.lucide("home")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 20, height: 20)
                        .foregroundColor(Theme.Colors.Resident.primary)

                    Text("Hub de colocation")
                        .font(Theme.Typography.title3())
                        .foregroundColor(Theme.Colors.textPrimary)
                }

                Spacer()

                NavigationLink(destination: ResidentHubView()) {
                    Text("Voir tout")
                        .font(Theme.Typography.bodySmall(.semibold))
                        .foregroundColor(Theme.Colors.Resident.primary)
                }
            }
            .padding(.horizontal)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    NavigationLink(destination: TasksView()) {
                        HubQuickCard(
                            icon: "check-square",
                            title: "Tâches",
                            subtitle: "\(viewModel.pendingTasks) en cours",
                            color: DesignTokens.Semantic.success
                        )
                    }
                    .buttonStyle(PlainButtonStyle())

                    NavigationLink(destination: ExpensesView()) {
                        HubQuickCard(
                            icon: "receipt",
                            title: "Dépenses",
                            subtitle: "\(viewModel.sharedExpenses)€ ce mois",
                            color: Theme.Colors.Resident._400
                        )
                    }
                    .buttonStyle(PlainButtonStyle())

                    NavigationLink(destination: CalendarView()) {
                        HubQuickCard(
                            icon: "calendar",
                            title: "Calendrier",
                            subtitle: "\(viewModel.upcomingEvents) événements",
                            color: DesignTokens.UIAccent.lavender
                        )
                    }
                    .buttonStyle(PlainButtonStyle())

                    NavigationLink(destination: RoommatesView()) {
                        HubQuickCard(
                            icon: "users",
                            title: "Colocataires",
                            subtitle: "\(viewModel.roommatesCount) personnes",
                            color: Theme.Colors.Resident.primary
                        )
                    }
                    .buttonStyle(PlainButtonStyle())
                }
                .padding(.horizontal)
            }
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
        .opacity(headerAppear ? 1 : 0)
        .offset(y: headerAppear ? 0 : -20)
        .animation(.spring(response: 0.6, dampingFraction: 0.8), value: headerAppear)
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
        .opacity(propertyAppear ? 1 : 0)
        .scaleEffect(propertyAppear ? 1 : 0.95)
        .animation(.spring(response: 0.6, dampingFraction: 0.8).delay(0.1), value: propertyAppear)
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
                        .foregroundColor(Theme.Colors.Resident.primary)

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

            NavigationLink(destination: PaymentsView()) {
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
                .background(Theme.Gradients.residentCTA)
                .cornerRadius(Theme.CornerRadius.button)
            }
        }
        .padding(20)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
        .padding(.horizontal)
        .opacity(paymentAppear ? 1 : 0)
        .scaleEffect(paymentAppear ? 1 : 0.95)
        .animation(.spring(response: 0.6, dampingFraction: 0.8).delay(0.2), value: paymentAppear)
    }

    // MARK: - Expenses Section

    private var expensesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Répartition des charges")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            DonutChart(
                data: viewModel.expensesData,
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
        .opacity(expensesAppear ? 1 : 0)
        .scaleEffect(expensesAppear ? 1 : 0.95)
        .animation(.spring(response: 0.6, dampingFraction: 0.8).delay(0.3), value: expensesAppear)
    }

    // MARK: - Quick Actions Section

    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Actions rapides")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)
                .padding(.horizontal)

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                NavigationLink(destination: MaintenanceView()) {
                    QuickActionCard(
                        icon: "tool",
                        title: "Maintenance",
                        color: Theme.Colors.Resident._400
                    ) {}
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: DocumentsListView()) {
                    QuickActionCard(
                        icon: "file-text",
                        title: "Documents",
                        color: Theme.Colors.Resident._300
                    ) {}
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: MessagesListView()) {
                    QuickActionCard(
                        icon: "message-circle",
                        title: "Contacter",
                        color: Theme.Colors.Resident._600
                    ) {}
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: PaymentHistoryView()) {
                    QuickActionCard(
                        icon: "calendar",
                        title: "Historique",
                        color: Theme.Colors.Resident._700
                    ) {}
                }
                .buttonStyle(PlainButtonStyle())
            }
            .padding(.horizontal)
        }
        .opacity(quickActionsAppear ? 1 : 0)
        .offset(y: quickActionsAppear ? 0 : 20)
        .animation(.spring(response: 0.6, dampingFraction: 0.8).delay(0.4), value: quickActionsAppear)
    }

    // MARK: - Payment History Section

    private var paymentHistorySection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Historique des paiements")
                    .font(Theme.Typography.title3())
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                NavigationLink(destination: PaymentsFullHistoryView()) {
                    Text("Voir tout")
                        .font(Theme.Typography.bodySmall(.semibold))
                        .foregroundColor(Theme.Colors.Resident.primary)
                }
            }
            .padding(.horizontal)

            VStack(spacing: 12) {
                ForEach(viewModel.paymentHistory.prefix(4)) { payment in
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

                NavigationLink(destination: CreateMaintenanceRequestView()) {
                    HStack(spacing: 6) {
                        Image.lucide("plus")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 14, height: 14)

                        Text("Nouvelle")
                            .font(Theme.Typography.bodySmall(.semibold))
                    }
                    .foregroundColor(Theme.Colors.Resident.primary)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(Theme.Colors.Resident.primary.opacity(0.1))
                    .cornerRadius(8)
                }
            }
            .padding(.horizontal)

            VStack(spacing: 12) {
                ForEach(viewModel.maintenanceRequests) { request in
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

                NavigationLink(destination: DocumentsFullListView()) {
                    Text("Voir tout")
                        .font(Theme.Typography.bodySmall(.semibold))
                        .foregroundColor(Theme.Colors.Resident.primary)
                }
            }
            .padding(.horizontal)

            VStack(spacing: 12) {
                ForEach(viewModel.documents.prefix(3)) { document in
                    DocumentCard(document: document)
                }
            }
            .padding(.horizontal)
        }
    }

}

// MARK: - KPI Card Compact

private struct KPICardCompact: View {
    let icon: String
    let title: String
    let value: String
    let color: Color
    var hasNotification: Bool = false

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image.lucide(icon)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 22, height: 22)
                    .foregroundColor(color)

                Spacer()

                if hasNotification {
                    Circle()
                        .fill(color)
                        .frame(width: 8, height: 8)
                }
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(value)
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(title)
                    .font(Theme.Typography.bodySmall())
                    .foregroundColor(Theme.Colors.textSecondary)
            }
        }
        .frame(width: 140)
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                .fill(Color.white.opacity(0.75))
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                        .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                )
        )
        .pinterestShadow(Theme.PinterestShadows.subtle)
    }
}

// MARK: - Hub Quick Card

private struct HubQuickCard: View {
    let icon: String
    let title: String
    let subtitle: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Image.lucide(icon)
                .resizable()
                .scaledToFit()
                .frame(width: 24, height: 24)
                .foregroundColor(.white)
                .frame(width: 56, height: 56)
                .background(
                    LinearGradient(
                        colors: [color, color.opacity(0.8)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .cornerRadius(14)

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(subtitle)
                    .font(Theme.Typography.bodySmall())
                    .foregroundColor(Theme.Colors.textSecondary)
            }
        }
        .frame(width: 160)
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                .fill(Color.white.opacity(0.75))
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                        .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                )
        )
        .pinterestShadow(Theme.PinterestShadows.subtle)
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

struct Document: Identifiable {
    let id: String
    let title: String
    let type: ResidentDocumentType
    let uploadedAt: Date
    let size: String

    var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "d MMM yyyy"
        formatter.locale = Locale(identifier: "fr_FR")
        return formatter.string(from: uploadedAt)
    }
}

enum ResidentDocumentType {
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
        case .contract: return Theme.Colors.Resident.primary
        case .inventory: return Theme.Colors.Resident._300
        case .receipt: return Theme.Colors.Resident._400
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

// struct QuickActionCard: View {
//     let icon: String
//     let title: String
//     let color: Color
//     let action: () -> Void
// 
//     var body: some View {
//         Button(action: {
//             Haptic.impact(.light)
//             action()
//         }) {
//             VStack(spacing: 12) {
//                 Image.lucide(icon)
//                     .resizable()
//                     .scaledToFit()
//                     .frame(width: 24, height: 24)
//                     .foregroundColor(.white)
//                     .frame(width: 60, height: 60)
//                     .background(
//                         LinearGradient(
//                             colors: [color, color.opacity(0.8)],
//                             startPoint: .topLeading,
//                             endPoint: .bottomTrailing
//                         )
//                     )
//                     .cornerRadius(16)
// 
//                 Text(title)
//                     .font(Theme.Typography.body(.semibold))
//                     .foregroundColor(Theme.Colors.textPrimary)
//             }
//             .frame(maxWidth: .infinity)
//             .padding(.vertical, 20)
//             .background(Theme.Colors.backgroundPrimary)
//             .cornerRadius(Theme.CornerRadius.card)
//             .cardShadow()
//         }
//     }
// }

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
                    .foregroundColor(Theme.Colors.Resident.primary)
            }
        }
        .padding(16)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }
}

// MARK: - Placeholder View

private struct PlaceholderView: View {
    let title: String

    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "hourglass")
                .font(.system(size: 60))
                .foregroundColor(Theme.Colors.textTertiary)

            Text(title)
                .font(Theme.Typography.title2())
                .foregroundColor(Theme.Colors.textPrimary)

            Text("Cette fonctionnalité sera bientôt disponible")
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textSecondary)
                .multilineTextAlignment(.center)
        }
        .padding()
        .navigationTitle(title)
        .navigationBarTitleDisplayMode(.large)
    }
}

// MARK: - Preview

struct ResidentDashboardView_Previews: PreviewProvider {
    static var previews: some View {
        ResidentDashboardView()
    }
}
