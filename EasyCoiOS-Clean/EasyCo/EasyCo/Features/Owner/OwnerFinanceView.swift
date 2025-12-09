import SwiftUI

// MARK: - Owner Finance View (Pinterest Modern)

struct OwnerFinanceView: View {
    @StateObject private var viewModel = OwnerFinanceViewModel()
    @State private var selectedPeriod: FinancePeriod = .thisMonth
    @State private var showAddExpense = false
    @State private var showAddIncome = false

    // Sheet states
    @State private var showProfileSheet = false
    @State private var showAlertsSheet = false
    @State private var showMenuSheet = false

    private let role: Theme.UserRole = .owner

    enum FinancePeriod: String, CaseIterable {
        case thisMonth = "Ce mois"
        case lastMonth = "Mois dernier"
        case thisYear = "Cette année"
        case allTime = "Tout"

        var icon: String {
            switch self {
            case .thisMonth: return "calendar"
            case .lastMonth: return "calendar.badge.minus"
            case .thisYear: return "calendar.badge.clock"
            case .allTime: return "infinity"
            }
        }
    }

    var body: some View {
        NavigationStack {
            ZStack(alignment: .top) {
                // Pinterest Background
                PinterestBackground(role: role, intensity: 0.18)
                    .ignoresSafeArea()

                ScrollView(.vertical, showsIndicators: false) {
                    VStack(spacing: 20) {
                        // Spacer for floating header
                        Color.clear.frame(height: 70)

                        // Hero Section
                        heroSection

                        // Period Selector
                        periodSelectorSection

                        // Main Balance Card
                        mainBalanceCard

                        // Quick Stats
                        quickStatsGrid

                        // Revenue Breakdown
                        revenueBreakdownSection

                        // Properties Performance
                        propertiesPerformanceSection

                        // Recent Transactions
                        recentTransactionsSection
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 20)
                    .padding(.bottom, 100)
                }

                // Floating Header with Add button that shows menu
                FloatingHeaderView(
                    role: role,
                    showAddButton: true,
                    onProfileTap: { showProfileSheet = true },
                    onAlertTap: { showAlertsSheet = true },
                    onMenuTap: { showMenuSheet = true },
                    onAddTap: {
                        showAddIncome = true
                    }
                )
            }
            .sheet(isPresented: $showAddExpense) {
                AddOwnerExpenseSheet(onAdd: { expense in
                    viewModel.addExpense(expense)
                    showAddExpense = false
                })
            }
            .sheet(isPresented: $showAddIncome) {
                AddOwnerIncomeSheet(onAdd: { income in
                    viewModel.addIncome(income)
                    showAddIncome = false
                })
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
        }
        .task {
            await viewModel.loadFinanceData()
        }
        .onChange(of: selectedPeriod) { _ in
            Task {
                await viewModel.loadFinanceData()
            }
        }
    }

    // MARK: - Hero Section

    private var heroSection: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Vue d'ensemble")
                .font(Theme.PinterestTypography.heroMedium(.bold))
                .foregroundColor(Theme.Colors.textPrimary)

            Text("Gestion financière de vos propriétés")
                .font(Theme.PinterestTypography.bodyRegular(.medium))
                .foregroundColor(Theme.Colors.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    // MARK: - Period Selector

    private var periodSelectorSection: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 4) {
                ForEach(FinancePeriod.allCases, id: \.self) { period in
                    Button(action: {
                        withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                            selectedPeriod = period
                        }
                        Haptic.selection()
                    }) {
                        HStack(spacing: 6) {
                            Image(systemName: period.icon)
                                .font(.system(size: 12, weight: .medium))
                            Text(period.rawValue)
                                .font(Theme.PinterestTypography.bodySmall(.semibold))
                        }
                        .foregroundColor(selectedPeriod == period ? .white : Theme.Colors.textSecondary)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(
                            selectedPeriod == period ?
                            LinearGradient(
                                colors: [Theme.Colors.Owner.primary, Theme.Colors.Owner._400],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ) :
                            LinearGradient(
                                colors: [Color.white.opacity(0.7), Color.white.opacity(0.5)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .cornerRadius(8)
                        .shadow(
                            color: selectedPeriod == period ? Theme.Colors.Owner.primary.opacity(0.25) : Color.black.opacity(0.03),
                            radius: selectedPeriod == period ? 8 : 4,
                            x: 0,
                            y: selectedPeriod == period ? 4 : 2
                        )
                    }
                }
            }
        }
    }

    // MARK: - Main Balance Card

    private var mainBalanceCard: some View {
        PinterestCard(role: role) {
            VStack(spacing: 12) {
                // Header with balance and trend
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("SOLDE NET")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(Theme.Colors.textSecondary)
                            .tracking(0.5)

                        Text("€\(viewModel.netBalance, specifier: "%.2f")")
                            .font(.system(size: 36, weight: .bold))
                            .foregroundColor(viewModel.netBalance >= 0 ? Color(hex: "10B981") : Color(hex: "EF4444"))
                    }

                    Spacer()

                    // Trend Badge
                    HStack(spacing: 4) {
                        Image(systemName: viewModel.trend >= 0 ? "arrow.up.right" : "arrow.down.right")
                            .font(.system(size: 13, weight: .bold))
                        Text("\(abs(viewModel.trend), specifier: "%.1f")%")
                            .font(.system(size: 15, weight: .bold))
                    }
                    .foregroundColor(.white)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(
                        Capsule()
                            .fill(viewModel.trend >= 0 ? Color(hex: "10B981") : Color(hex: "EF4444"))
                    )
                    .shadow(
                        color: (viewModel.trend >= 0 ? Color(hex: "10B981") : Color(hex: "EF4444")).opacity(0.3),
                        radius: 8,
                        x: 0,
                        y: 4
                    )
                }

                Divider()
                    .padding(.vertical, 4)

                // Income vs Expenses
                HStack(spacing: 20) {
                    VStack(alignment: .leading, spacing: 4) {
                        HStack(spacing: 6) {
                            Circle()
                                .fill(Color(hex: "10B981"))
                                .frame(width: 10, height: 10)
                            Text("REVENUS")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(Theme.Colors.textSecondary)
                                .tracking(0.3)
                        }

                        Text("€\(viewModel.totalIncome, specifier: "%.2f")")
                            .font(.system(size: 22, weight: .bold))
                            .foregroundColor(Theme.Colors.textPrimary)
                    }

                    Spacer()

                    VStack(alignment: .trailing, spacing: 4) {
                        HStack(spacing: 6) {
                            Text("DÉPENSES")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(Theme.Colors.textSecondary)
                                .tracking(0.3)
                            Circle()
                                .fill(Color(hex: "EF4444"))
                                .frame(width: 10, height: 10)
                        }

                        Text("€\(viewModel.totalExpenses, specifier: "%.2f")")
                            .font(.system(size: 22, weight: .bold))
                            .foregroundColor(Theme.Colors.textPrimary)
                    }
                }
            }
        }
    }

    // MARK: - Quick Stats Grid

    private var quickStatsGrid: some View {
        HStack(spacing: 12) {
            ModernQuickStatCard(
                title: "Occupation",
                value: "\(viewModel.occupancyRate)%",
                icon: "house.fill",
                color: Theme.Colors.Owner.primary,
                role: role
            )

            ModernQuickStatCard(
                title: "Loyers perçus",
                value: "\(viewModel.collectedRentsCount)/\(viewModel.totalRentsCount)",
                icon: "checkmark.circle.fill",
                color: Color(hex: "10B981"),
                role: role
            )
        }
    }

    // MARK: - Revenue Breakdown Section

    private var revenueBreakdownSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Répartition des revenus")
                .font(Theme.PinterestTypography.titleMedium(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)

            PinterestCard(role: role) {
                VStack(spacing: 12) {
                    ForEach(viewModel.revenueBreakdown) { item in
                        ModernRevenueBreakdownRow(
                            item: item,
                            total: viewModel.totalIncome
                        )

                        if item.id != viewModel.revenueBreakdown.last?.id {
                            Divider()
                        }
                    }
                }
            }
        }
    }

    // MARK: - Properties Performance Section

    private var propertiesPerformanceSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Performance par propriété")
                    .font(Theme.PinterestTypography.titleMedium(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                NavigationLink(destination: Text("Détails")) {
                    HStack(spacing: 4) {
                        Text("Voir tout")
                            .font(Theme.PinterestTypography.bodySmall(.semibold))
                        Image(systemName: "chevron.right")
                            .font(.system(size: 12, weight: .semibold))
                    }
                    .foregroundColor(Theme.Colors.Owner.primary)
                }
            }

            VStack(spacing: 8) {
                ForEach(viewModel.propertiesPerformance) { property in
                    ModernPropertyPerformanceCard(property: property, role: role)
                }
            }
        }
    }

    // MARK: - Recent Transactions Section

    private var recentTransactionsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Transactions récentes")
                    .font(Theme.PinterestTypography.titleMedium(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                NavigationLink(destination: Text("Historique")) {
                    HStack(spacing: 4) {
                        Text("Historique")
                            .font(Theme.PinterestTypography.bodySmall(.semibold))
                        Image(systemName: "chevron.right")
                            .font(.system(size: 12, weight: .semibold))
                    }
                    .foregroundColor(Theme.Colors.Owner.primary)
                }
            }

            PinterestCard(role: role) {
                VStack(spacing: 0) {
                    ForEach(viewModel.recentTransactions.prefix(5)) { transaction in
                        ModernFinanceTransactionRow(transaction: transaction)

                        if transaction.id != viewModel.recentTransactions.prefix(5).last?.id {
                            Divider()
                                .padding(.horizontal, 12)
                        }
                    }
                }
            }
        }
    }
}

// MARK: - Modern Quick Stat Card

struct ModernQuickStatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    let role: Theme.UserRole

    var body: some View {
        PinterestCard(role: role) {
            VStack(alignment: .leading, spacing: 8) {
                ZStack {
                    Circle()
                        .fill(color.opacity(0.15))
                        .frame(width: 44, height: 44)

                    Image(systemName: icon)
                        .font(.system(size: 20, weight: .semibold))
                        .foregroundColor(color)
                }

                Spacer()

                VStack(alignment: .leading, spacing: 4) {
                    Text(value)
                        .font(.system(size: 26, weight: .bold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text(title)
                        .font(Theme.PinterestTypography.bodySmall(.medium))
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }
            .frame(height: 130)
        }
    }
}

// MARK: - Modern Revenue Breakdown Row

struct ModernRevenueBreakdownRow: View {
    let item: RevenueItem
    let total: Double

    private var percentage: Double {
        guard total > 0 else { return 0 }
        return (item.amount / total) * 100
    }

    var body: some View {
        VStack(spacing: 4) {
            HStack {
                HStack(spacing: 8) {
                    Circle()
                        .fill(item.color)
                        .frame(width: 12, height: 12)

                    Text(item.category)
                        .font(Theme.PinterestTypography.bodyRegular(.medium))
                        .foregroundColor(Theme.Colors.textPrimary)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 2) {
                    Text("€\(item.amount, specifier: "%.0f")")
                        .font(Theme.PinterestTypography.bodyRegular(.bold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text("\(percentage, specifier: "%.0f")%")
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }

            // Progress bar
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 3)
                        .fill(Color(hex: "F3F4F6"))
                        .frame(height: 6)

                    RoundedRectangle(cornerRadius: 3)
                        .fill(item.color)
                        .frame(width: geometry.size.width * CGFloat(percentage / 100), height: 6)
                }
            }
            .frame(height: 6)
        }
    }
}

// MARK: - Modern Property Performance Card

struct ModernPropertyPerformanceCard: View {
    let property: PropertyPerformance
    let role: Theme.UserRole

    var body: some View {
        PinterestCard(role: role) {
            HStack(spacing: 12) {
                // Property image
                AsyncImage(url: URL(string: property.imageUrl ?? "")) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .scaledToFill()
                            .frame(width: 70, height: 70)
                            .clipped()
                            .cornerRadius(12)
                    case .failure(_), .empty:
                        ZStack {
                            RoundedRectangle(cornerRadius: 12)
                                .fill(
                                    LinearGradient(
                                        colors: [Theme.Colors.Owner.primary, Theme.Colors.Owner._400],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                )
                                .frame(width: 70, height: 70)

                            Image(systemName: "building.2")
                                .font(.system(size: 28))
                                .foregroundColor(.white.opacity(0.7))
                        }
                    @unknown default:
                        EmptyView()
                    }
                }

                VStack(alignment: .leading, spacing: 6) {
                    Text(property.name)
                        .font(Theme.PinterestTypography.bodyRegular(.bold))
                        .foregroundColor(Theme.Colors.textPrimary)
                        .lineLimit(1)

                    HStack(spacing: 6) {
                        Image(systemName: "bed.double.fill")
                            .font(.system(size: 12))
                            .foregroundColor(Theme.Colors.textSecondary)

                        Text("\(property.occupiedRooms)/\(property.totalRooms) chambres")
                            .font(Theme.PinterestTypography.bodySmall(.medium))
                            .foregroundColor(Theme.Colors.textSecondary)
                    }
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 4) {
                    Text("€\(property.monthlyRevenue, specifier: "%.0f")")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "10B981"))

                    Text("/mois")
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }
        }
    }
}

// MARK: - Modern Finance Transaction Row

struct ModernFinanceTransactionRow: View {
    let transaction: FinanceTransaction

    var body: some View {
        HStack(spacing: 12) {
            // Icon
            ZStack {
                Circle()
                    .fill((transaction.isIncome ? Color(hex: "10B981") : Color(hex: "EF4444")).opacity(0.15))
                    .frame(width: 48, height: 48)

                Image(systemName: transaction.isIncome ? "arrow.down.circle.fill" : "arrow.up.circle.fill")
                    .font(.system(size: 22))
                    .foregroundColor(transaction.isIncome ? Color(hex: "10B981") : Color(hex: "EF4444"))
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(transaction.title)
                    .font(Theme.PinterestTypography.bodyRegular(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .lineLimit(1)

                Text(transaction.subtitle)
                    .font(Theme.PinterestTypography.bodySmall(.medium))
                    .foregroundColor(Theme.Colors.textSecondary)
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 4) {
                Text("\(transaction.isIncome ? "+" : "-")€\(abs(transaction.amount), specifier: "%.2f")")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(transaction.isIncome ? Color(hex: "10B981") : Color(hex: "EF4444"))

                Text(transaction.formattedDate)
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(Theme.Colors.textSecondary)
            }
        }
        .padding(12)
    }
}

// MARK: - Add Owner Expense Sheet

struct AddOwnerExpenseSheet: View {
    @Environment(\.dismiss) private var dismiss
    let onAdd: (FinanceTransaction) -> Void

    @State private var title = ""
    @State private var amount = ""
    @State private var category = "Maintenance"
    @State private var selectedProperty: String = "Toutes"
    @State private var date = Date()

    let categories = ["Maintenance", "Réparations", "Assurance", "Taxes", "Services", "Autre"]

    var body: some View {
        NavigationStack {
            Form {
                Section("Détails") {
                    TextField("Description", text: $title)
                    TextField("Montant (€)", text: $amount)
                        .keyboardType(.decimalPad)

                    Picker("Catégorie", selection: $category) {
                        ForEach(categories, id: \.self) { cat in
                            Text(cat).tag(cat)
                        }
                    }

                    DatePicker("Date", selection: $date, displayedComponents: .date)
                }

                Section("Propriété") {
                    Picker("Propriété", selection: $selectedProperty) {
                        Text("Toutes les propriétés").tag("Toutes")
                        Text("Appartement Bruxelles").tag("Appartement Bruxelles")
                        Text("Maison Lyon").tag("Maison Lyon")
                    }
                }
            }
            .navigationTitle("Ajouter une dépense")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Annuler") {
                        dismiss()
                        Haptic.selection()
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Ajouter") {
                        if let amountValue = Double(amount), !title.isEmpty {
                            let expense = FinanceTransaction(
                                id: UUID(),
                                title: title,
                                subtitle: category,
                                amount: -amountValue,
                                date: date,
                                isIncome: false
                            )
                            onAdd(expense)
                            Haptic.success()
                        }
                    }
                    .disabled(title.isEmpty || amount.isEmpty)
                }
            }
        }
    }
}

// MARK: - Add Owner Income Sheet

struct AddOwnerIncomeSheet: View {
    @Environment(\.dismiss) private var dismiss
    let onAdd: (FinanceTransaction) -> Void

    @State private var title = ""
    @State private var amount = ""
    @State private var category = "Loyer"
    @State private var selectedProperty: String = "Toutes"
    @State private var date = Date()

    let categories = ["Loyer", "Dépôt de garantie", "Frais annexes", "Autre"]

    var body: some View {
        NavigationStack {
            Form {
                Section("Détails") {
                    TextField("Description", text: $title)
                    TextField("Montant (€)", text: $amount)
                        .keyboardType(.decimalPad)

                    Picker("Catégorie", selection: $category) {
                        ForEach(categories, id: \.self) { cat in
                            Text(cat).tag(cat)
                        }
                    }

                    DatePicker("Date", selection: $date, displayedComponents: .date)
                }

                Section("Propriété") {
                    Picker("Propriété", selection: $selectedProperty) {
                        Text("Toutes les propriétés").tag("Toutes")
                        Text("Appartement Bruxelles").tag("Appartement Bruxelles")
                        Text("Maison Lyon").tag("Maison Lyon")
                    }
                }
            }
            .navigationTitle("Ajouter un revenu")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Annuler") {
                        dismiss()
                        Haptic.selection()
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Ajouter") {
                        if let amountValue = Double(amount), !title.isEmpty {
                            let income = FinanceTransaction(
                                id: UUID(),
                                title: title,
                                subtitle: category,
                                amount: amountValue,
                                date: date,
                                isIncome: true
                            )
                            onAdd(income)
                            Haptic.success()
                        }
                    }
                    .disabled(title.isEmpty || amount.isEmpty)
                }
            }
        }
    }
}

// MARK: - Models

struct RevenueItem: Identifiable {
    let id = UUID()
    let category: String
    let amount: Double
    let color: Color
}

struct PropertyPerformance: Identifiable {
    let id = UUID()
    let name: String
    let imageUrl: String?
    let occupiedRooms: Int
    let totalRooms: Int
    let monthlyRevenue: Double
}

struct FinanceTransaction: Identifiable {
    let id: UUID
    let title: String
    let subtitle: String
    let amount: Double
    let date: Date
    let isIncome: Bool

    var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "dd MMM"
        formatter.locale = Locale(identifier: "fr_FR")
        return formatter.string(from: date)
    }
}

// MARK: - ViewModel

@MainActor
class OwnerFinanceViewModel: ObservableObject {
    @Published var totalIncome: Double = 0
    @Published var totalExpenses: Double = 0
    @Published var netBalance: Double = 0
    @Published var trend: Double = 0
    @Published var occupancyRate: Int = 0
    @Published var collectedRentsCount: Int = 0
    @Published var totalRentsCount: Int = 0
    @Published var revenueBreakdown: [RevenueItem] = []
    @Published var propertiesPerformance: [PropertyPerformance] = []
    @Published var recentTransactions: [FinanceTransaction] = []
    @Published var isLoading = false

    func loadFinanceData() async {
        isLoading = true

        // Demo data
        if AppConfig.FeatureFlags.demoMode {
            try? await Task.sleep(nanoseconds: 500_000_000)

            totalIncome = 4850.00
            totalExpenses = 1230.50
            netBalance = totalIncome - totalExpenses
            trend = 12.5
            occupancyRate = 87
            collectedRentsCount = 7
            totalRentsCount = 8

            revenueBreakdown = [
                RevenueItem(category: "Loyers", amount: 4200, color: Theme.Colors.Owner.primary),
                RevenueItem(category: "Charges", amount: 450, color: Color(hex: "10B981")),
                RevenueItem(category: "Dépôts", amount: 200, color: Color(hex: "F59E0B"))
            ]

            propertiesPerformance = [
                PropertyPerformance(
                    name: "Appartement Bruxelles Centre",
                    imageUrl: nil,
                    occupiedRooms: 4,
                    totalRooms: 5,
                    monthlyRevenue: 2800
                ),
                PropertyPerformance(
                    name: "Maison Lyon Confluence",
                    imageUrl: nil,
                    occupiedRooms: 3,
                    totalRooms: 3,
                    monthlyRevenue: 2050
                )
            ]

            recentTransactions = [
                FinanceTransaction(
                    id: UUID(),
                    title: "Loyer - Marie D.",
                    subtitle: "Appartement Bruxelles",
                    amount: 650,
                    date: Date(),
                    isIncome: true
                ),
                FinanceTransaction(
                    id: UUID(),
                    title: "Réparation plomberie",
                    subtitle: "Maintenance",
                    amount: -180,
                    date: Calendar.current.date(byAdding: .day, value: -2, to: Date())!,
                    isIncome: false
                ),
                FinanceTransaction(
                    id: UUID(),
                    title: "Loyer - Thomas L.",
                    subtitle: "Maison Lyon",
                    amount: 580,
                    date: Calendar.current.date(byAdding: .day, value: -3, to: Date())!,
                    isIncome: true
                ),
                FinanceTransaction(
                    id: UUID(),
                    title: "Assurance habitation",
                    subtitle: "Assurance",
                    amount: -95,
                    date: Calendar.current.date(byAdding: .day, value: -5, to: Date())!,
                    isIncome: false
                ),
                FinanceTransaction(
                    id: UUID(),
                    title: "Loyer - Julie M.",
                    subtitle: "Appartement Bruxelles",
                    amount: 620,
                    date: Calendar.current.date(byAdding: .day, value: -7, to: Date())!,
                    isIncome: true
                )
            ]
        }

        isLoading = false
    }

    func addExpense(_ expense: FinanceTransaction) {
        recentTransactions.insert(expense, at: 0)
        totalExpenses += abs(expense.amount)
        netBalance = totalIncome - totalExpenses
    }

    func addIncome(_ income: FinanceTransaction) {
        recentTransactions.insert(income, at: 0)
        totalIncome += income.amount
        netBalance = totalIncome - totalExpenses
    }
}

// MARK: - Preview

struct OwnerFinanceView_Previews: PreviewProvider {
    static var previews: some View {
        OwnerFinanceView()
    }
}
