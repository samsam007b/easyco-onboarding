import SwiftUI

// MARK: - Owner Finance View

struct OwnerFinanceView: View {
    @StateObject private var viewModel = OwnerFinanceViewModel()
    @State private var selectedPeriod: FinancePeriod = .thisMonth
    @State private var showAddExpense = false
    @State private var showAddIncome = false

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
            ScrollView(.vertical, showsIndicators: true) {
                VStack(spacing: 20) {
                    // Period selector
                    periodSelector

                    // Summary cards
                    summaryCardsSection

                    // Revenue breakdown chart
                    revenueBreakdownSection

                    // Properties performance
                    propertiesPerformanceSection

                    // Recent transactions
                    recentTransactionsSection
                }
                .padding(16)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationTitle("Finances")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(trailing:
                Menu {
                    Button(action: { showAddIncome = true }) {
                        Label("Ajouter un revenu", systemImage: "plus.circle")
                    }
                    Button(action: { showAddExpense = true }) {
                        Label("Ajouter une dépense", systemImage: "minus.circle")
                    }
                } label: {
                    Image(systemName: "plus.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "6E56CF"))
                }
            )
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
        }
        .task {
            await viewModel.loadFinanceData()
        }
        .onChange(of: selectedPeriod) { newValue in
            Task {
                await viewModel.loadFinanceData()
            }
        }
    }

    // MARK: - Period Selector

    private var periodSelector: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(FinancePeriod.allCases, id: \.self) { period in
                    Button(action: { selectedPeriod = period }) {
                        HStack(spacing: 6) {
                            Image(systemName: period.icon)
                                .font(.system(size: 12))
                            Text(period.rawValue)
                                .font(.system(size: 14, weight: .medium))
                        }
                        .foregroundColor(selectedPeriod == period ? .white : Color(hex: "374151"))
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                        .background(selectedPeriod == period ? Color(hex: "6E56CF") : Color.white)
                        .cornerRadius(999)
                        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
                    }
                }
            }
        }
    }

    // MARK: - Summary Cards Section

    private var summaryCardsSection: some View {
        VStack(spacing: 16) {
            // Main balance card
            VStack(spacing: 16) {
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Solde net")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "6B7280"))
                        Text("€\(viewModel.netBalance, specifier: "%.2f")")
                            .font(.system(size: 32, weight: .bold))
                            .foregroundColor(viewModel.netBalance >= 0 ? Color(hex: "10B981") : Color(hex: "EF4444"))
                    }

                    Spacer()

                    // Trend indicator
                    VStack(alignment: .trailing, spacing: 4) {
                        HStack(spacing: 4) {
                            Image(systemName: viewModel.trend >= 0 ? "arrow.up.right" : "arrow.down.right")
                                .font(.system(size: 14, weight: .bold))
                            Text("\(abs(viewModel.trend), specifier: "%.1f")%")
                                .font(.system(size: 16, weight: .bold))
                        }
                        .foregroundColor(viewModel.trend >= 0 ? Color(hex: "10B981") : Color(hex: "EF4444"))

                        Text("vs période précédente")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "9CA3AF"))
                    }
                }

                Divider()

                // Income vs Expenses
                HStack(spacing: 20) {
                    VStack(alignment: .leading, spacing: 4) {
                        HStack(spacing: 6) {
                            Circle()
                                .fill(Color(hex: "10B981"))
                                .frame(width: 10, height: 10)
                            Text("Revenus")
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "6B7280"))
                        }
                        Text("€\(viewModel.totalIncome, specifier: "%.2f")")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(Color(hex: "111827"))
                    }

                    Spacer()

                    VStack(alignment: .trailing, spacing: 4) {
                        HStack(spacing: 6) {
                            Text("Dépenses")
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "6B7280"))
                            Circle()
                                .fill(Color(hex: "EF4444"))
                                .frame(width: 10, height: 10)
                        }
                        Text("€\(viewModel.totalExpenses, specifier: "%.2f")")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(Color(hex: "111827"))
                    }
                }
            }
            .padding(20)
            .background(Color.white)
            .cornerRadius(20)
            .shadow(color: .black.opacity(0.06), radius: 10, x: 0, y: 4)

            // Quick stats
            HStack(spacing: 12) {
                QuickStatCard(
                    title: "Taux d'occupation",
                    value: "\(viewModel.occupancyRate)%",
                    icon: "house.fill",
                    color: Color(hex: "6E56CF")
                )

                QuickStatCard(
                    title: "Loyers perçus",
                    value: "\(viewModel.collectedRentsCount)/\(viewModel.totalRentsCount)",
                    icon: "checkmark.circle.fill",
                    color: Color(hex: "10B981")
                )
            }
        }
    }

    // MARK: - Revenue Breakdown Section

    private var revenueBreakdownSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Répartition des revenus")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))
                Spacer()
            }

            VStack(spacing: 12) {
                ForEach(viewModel.revenueBreakdown) { item in
                    RevenueBreakdownRow(item: item, total: viewModel.totalIncome)
                }
            }
            .padding(16)
            .background(Color.white)
            .cornerRadius(16)
        }
    }

    // MARK: - Properties Performance Section

    private var propertiesPerformanceSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Performance par propriété")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                NavigationLink(destination: Text("Détails")) {
                    Text("Voir tout")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "6E56CF"))
                }
            }

            VStack(spacing: 12) {
                ForEach(viewModel.propertiesPerformance) { property in
                    PropertyPerformanceCard(property: property)
                }
            }
        }
    }

    // MARK: - Recent Transactions Section

    private var recentTransactionsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Transactions récentes")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                NavigationLink(destination: Text("Historique")) {
                    Text("Historique")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "6E56CF"))
                }
            }

            VStack(spacing: 0) {
                ForEach(viewModel.recentTransactions.prefix(5)) { transaction in
                    TransactionRow(transaction: transaction)

                    if transaction.id != viewModel.recentTransactions.prefix(5).last?.id {
                        Divider()
                            .padding(.horizontal, 16)
                    }
                }
            }
            .background(Color.white)
            .cornerRadius(16)
        }
    }
}

// MARK: - Quick Stat Card

struct QuickStatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: icon)
                    .font(.system(size: 18))
                    .foregroundColor(color)
                Spacer()
            }

            VStack(alignment: .leading, spacing: 2) {
                Text(value)
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text(title)
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "6B7280"))
            }
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.04), radius: 6, x: 0, y: 2)
    }
}

// MARK: - Revenue Breakdown Row

struct RevenueBreakdownRow: View {
    let item: RevenueItem
    let total: Double

    private var percentage: Double {
        guard total > 0 else { return 0 }
        return (item.amount / total) * 100
    }

    var body: some View {
        VStack(spacing: 8) {
            HStack {
                HStack(spacing: 8) {
                    Circle()
                        .fill(item.color)
                        .frame(width: 12, height: 12)

                    Text(item.category)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "374151"))
                }

                Spacer()

                Text("€\(item.amount, specifier: "%.0f")")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))
            }

            // Progress bar
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    Rectangle()
                        .fill(Color(hex: "F3F4F6"))
                        .frame(height: 6)
                        .cornerRadius(3)

                    Rectangle()
                        .fill(item.color)
                        .frame(width: geometry.size.width * CGFloat(percentage / 100), height: 6)
                        .cornerRadius(3)
                }
            }
            .frame(height: 6)
        }
    }
}

// MARK: - Property Performance Card

struct PropertyPerformanceCard: View {
    let property: PropertyPerformance

    var body: some View {
        HStack(spacing: 16) {
            // Property image
            AsyncImage(url: URL(string: property.imageUrl ?? "")) { phase in
                switch phase {
                case .success(let image):
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: 60, height: 60)
                        .clipped()
                        .cornerRadius(10)
                case .failure(_), .empty:
                    Rectangle()
                        .fill(
                            LinearGradient(
                                colors: [Color(hex: "6E56CF"), Color(hex: "9F7AEA")],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 60, height: 60)
                        .cornerRadius(10)
                        .overlay(
                            Image(systemName: "building.2")
                                .foregroundColor(.white.opacity(0.7))
                        )
                @unknown default:
                    EmptyView()
                }
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(property.name)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))
                    .lineLimit(1)

                Text("\(property.occupiedRooms)/\(property.totalRooms) chambres occupées")
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 4) {
                Text("€\(property.monthlyRevenue, specifier: "%.0f")")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(Color(hex: "10B981"))

                Text("/mois")
                    .font(.system(size: 11))
                    .foregroundColor(Color(hex: "9CA3AF"))
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(14)
        .shadow(color: .black.opacity(0.04), radius: 6, x: 0, y: 2)
    }
}

// MARK: - Transaction Row

struct TransactionRow: View {
    let transaction: FinanceTransaction

    var body: some View {
        HStack(spacing: 14) {
            // Icon
            Image(systemName: transaction.isIncome ? "arrow.down.circle.fill" : "arrow.up.circle.fill")
                .font(.system(size: 28))
                .foregroundColor(transaction.isIncome ? Color(hex: "10B981") : Color(hex: "EF4444"))

            VStack(alignment: .leading, spacing: 4) {
                Text(transaction.title)
                    .font(.system(size: 15, weight: .medium))
                    .foregroundColor(Color(hex: "111827"))

                Text(transaction.subtitle)
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 4) {
                Text("\(transaction.isIncome ? "+" : "-")€\(abs(transaction.amount), specifier: "%.2f")")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(transaction.isIncome ? Color(hex: "10B981") : Color(hex: "EF4444"))

                Text(transaction.formattedDate)
                    .font(.system(size: 11))
                    .foregroundColor(Color(hex: "9CA3AF"))
            }
        }
        .padding(16)
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
                    Button("Annuler") { dismiss() }
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
                    Button("Annuler") { dismiss() }
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
                RevenueItem(category: "Loyers", amount: 4200, color: Color(hex: "6E56CF")),
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
