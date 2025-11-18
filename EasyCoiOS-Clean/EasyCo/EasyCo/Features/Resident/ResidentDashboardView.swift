import SwiftUI

// MARK: - Resident Dashboard View

struct ResidentDashboardView: View {
    @StateObject private var viewModel = ResidentDashboardViewModel()
    @EnvironmentObject var languageManager: LanguageManager

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: Theme.Spacing._6) {
                    // Welcome Section
                    welcomeSection

                    // KPI Cards Grid
                    if viewModel.isLoading {
                        kpiCardsLoadingState
                    } else if let stats = viewModel.stats {
                        kpiCardsGrid(stats: stats)
                    }

                    // Rent Payment Progress
                    if let stats = viewModel.stats {
                        rentPaymentSection(stats: stats)
                    }

                    // Upcoming Tasks
                    if let stats = viewModel.stats, !stats.upcomingTasks.isEmpty {
                        upcomingTasksSection(tasks: stats.upcomingTasks)
                    }

                    // Recent Activity
                    if let stats = viewModel.stats, !stats.recentActivity.isEmpty {
                        recentActivitySection(activity: stats.recentActivity)
                    }

                    // Quick Actions
                    quickActionsSection
                }
                .padding(Theme.Spacing._4)
            }
            .background(Theme.Colors.backgroundSecondary)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Hub Résident")
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        Task { await viewModel.refresh() }
                    }) {
                        Image(systemName: "arrow.clockwise")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Theme.ResidentColors._600)
                    }
                }
            }
        }
        .task {
            await viewModel.loadData()
        }
    }

    // MARK: - Welcome Section

    private var welcomeSection: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._3) {
            HStack(spacing: 8) {
                Text("Bienvenue chez vous")
                    .font(Theme.Typography.title2(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)
                Image(systemName: "house.fill")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Theme.ResidentColors._500)
            }

            Text("Gérez votre colocation facilement")
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(Theme.Spacing._5)
        .background(
            LinearGradient(
                colors: [
                    Theme.ResidentColors._50,
                    Color.white
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .cornerRadius(Theme.CornerRadius.xl)
    }

    // MARK: - KPI Cards Grid

    private func kpiCardsGrid(stats: ResidentStats) -> some View {
        LazyVGrid(
            columns: [
                GridItem(.flexible(), spacing: Theme.Spacing._4),
                GridItem(.flexible(), spacing: Theme.Spacing._4)
            ],
            spacing: Theme.Spacing._4
        ) {
            KPICard(
                metric: KPIMetric(
                    id: "rent",
                    title: "Loyer",
                    value: "€\(Int(stats.rentPaid))/\(Int(stats.rentTotal))",
                    trend: stats.rentPaid >= stats.rentTotal ?
                        KPIMetric.Trend(value: "Payé", direction: .up) :
                        KPIMetric.Trend(value: "En attente", direction: .neutral),
                    icon: "house.fill",
                    color: .orange
                )
            )

            KPICard(
                metric: KPIMetric(
                    id: "expenses",
                    title: "Dépenses partagées",
                    value: "€\(Int(stats.sharedExpenses))",
                    trend: nil,
                    icon: "cart.fill",
                    color: .blue
                )
            )

            KPICard(
                metric: KPIMetric(
                    id: "balance",
                    title: "Solde personnel",
                    value: stats.personalBalance >= 0 ?
                        "+€\(Int(abs(stats.personalBalance)))" :
                        "-€\(Int(abs(stats.personalBalance)))",
                    trend: stats.personalBalance >= 0 ?
                        KPIMetric.Trend(value: "À recevoir", direction: .up) :
                        KPIMetric.Trend(value: "À payer", direction: .down),
                    icon: "dollarsign.circle.fill",
                    color: stats.personalBalance >= 0 ? .emerald : .red
                )
            )

            KPICard(
                metric: KPIMetric(
                    id: "tasks",
                    title: "Tâches en attente",
                    value: "\(stats.pendingTasks)",
                    trend: stats.pendingTasks > 0 ?
                        KPIMetric.Trend(value: "À faire", direction: .neutral) : nil,
                    icon: "checkmark.circle.fill",
                    color: .purple
                )
            ) {
                // Navigate to tasks
            }
        }
    }

    private var kpiCardsLoadingState: some View {
        LazyVGrid(
            columns: [
                GridItem(.flexible(), spacing: Theme.Spacing._4),
                GridItem(.flexible(), spacing: Theme.Spacing._4)
            ],
            spacing: Theme.Spacing._4
        ) {
            ForEach(0..<4, id: \.self) { _ in
                SkeletonView(height: 140)
            }
        }
    }

    // MARK: - Rent Payment Section

    private func rentPaymentSection(stats: ResidentStats) -> some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._4) {
            HStack {
                Text("Paiement du loyer")
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                Text("\(Int((stats.rentPaid / stats.rentTotal) * 100))%")
                    .font(Theme.Typography.bodySmall(.bold))
                    .foregroundColor(Theme.ResidentColors._700)
            }

            // Progress bar
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    // Background
                    RoundedRectangle(cornerRadius: Theme.CornerRadius.full)
                        .fill(Theme.GrayColors._200)
                        .frame(height: 12)

                    // Filled portion
                    RoundedRectangle(cornerRadius: Theme.CornerRadius.full)
                        .fill(
                            LinearGradient(
                                colors: [
                                    Theme.ResidentColors._400,
                                    Theme.ResidentColors._600
                                ],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(
                            width: geometry.size.width * CGFloat(stats.rentPaid / stats.rentTotal),
                            height: 12
                        )
                }
            }
            .frame(height: 12)

            // Details
            HStack {
                VStack(alignment: .leading, spacing: Theme.Spacing._1) {
                    Text("Payé")
                        .font(Theme.Typography.caption())
                        .foregroundColor(Theme.Colors.textSecondary)

                    Text("€\(Int(stats.rentPaid))")
                        .font(Theme.Typography.bodySmall(.bold))
                        .foregroundColor(Theme.Colors.textPrimary)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: Theme.Spacing._1) {
                    Text("Total")
                        .font(Theme.Typography.caption())
                        .foregroundColor(Theme.Colors.textSecondary)

                    Text("€\(Int(stats.rentTotal))")
                        .font(Theme.Typography.bodySmall(.bold))
                        .foregroundColor(Theme.Colors.textPrimary)
                }
            }
        }
        .padding(Theme.Spacing._5)
        .background(Color.white)
        .cornerRadius(Theme.CornerRadius.xl)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
    }

    // MARK: - Upcoming Tasks Section

    private func upcomingTasksSection(tasks: [ResidentTask]) -> some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._4) {
            HStack {
                Text("Tâches à venir")
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                NavigationLink("Voir tout") {
                    Text("Tasks View")
                }
                .font(Theme.Typography.bodySmall(.medium))
                .foregroundColor(Theme.ResidentColors._600)
            }

            VStack(spacing: Theme.Spacing._3) {
                ForEach(tasks.prefix(3)) { task in
                    TaskRow(task: task)
                }
            }
        }
    }

    // MARK: - Recent Activity Section

    private func recentActivitySection(activity: [ActivityItem]) -> some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._4) {
            Text("Activité récente")
                .font(Theme.Typography.body(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)

            VStack(spacing: Theme.Spacing._3) {
                ForEach(activity.prefix(5)) { item in
                    ActivityRow(item: item)
                }
            }
        }
    }

    // MARK: - Quick Actions Section

    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._4) {
            Text("Actions rapides")
                .font(Theme.Typography.body(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)

            VStack(spacing: Theme.Spacing._3) {
                QuickActionButton(
                    title: "Ajouter une dépense",
                    icon: "plus.circle.fill",
                    color: Theme.ResidentColors._600
                ) {
                    // Navigate to add expense
                }

                QuickActionButton(
                    title: "Créer une tâche",
                    icon: "checkmark.circle.fill",
                    color: Theme.ResidentColors._500
                ) {
                    // Navigate to create task
                }

                QuickActionButton(
                    title: "Voir les colocataires",
                    icon: "person.2.fill",
                    color: Theme.ResidentColors._400
                ) {
                    // Navigate to household
                }
            }
        }
    }
}

// MARK: - Task Row

private struct TaskRow: View {
    let task: ResidentTask

    var body: some View {
        HStack(spacing: Theme.Spacing._3) {
            // Priority indicator
            Circle()
                .fill(priorityColor)
                .frame(width: 8, height: 8)

            // Task info
            VStack(alignment: .leading, spacing: Theme.Spacing._1) {
                Text(task.title)
                    .font(Theme.Typography.bodySmall(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                if let assignee = task.assignedUserName {
                    Text("Assigné à: \(assignee)")
                        .font(Theme.Typography.caption())
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }

            Spacer()

            // Due date
            if let dueDate = task.dueDate {
                Text(dueDate, style: .date)
                    .font(Theme.Typography.caption(.medium))
                    .foregroundColor(Theme.Colors.textSecondary)
            }
        }
        .padding(Theme.Spacing._4)
        .background(Color.white)
        .cornerRadius(Theme.CornerRadius.lg)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }

    private var priorityColor: Color {
        switch task.priority {
        case .high: return Color(hex: "EF4444")
        case .medium: return Color(hex: "F59E0B")
        case .low: return Color(hex: "10B981")
        }
    }
}

// MARK: - Activity Row

private struct ActivityRow: View {
    let item: ActivityItem

    var body: some View {
        HStack(spacing: Theme.Spacing._3) {
            // Icon
            Image(systemName: activityIcon)
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(activityColor)
                .frame(width: 36, height: 36)
                .background(activityColor.opacity(0.1))
                .cornerRadius(Theme.CornerRadius.lg)

            // Activity info
            VStack(alignment: .leading, spacing: Theme.Spacing._1) {
                Text(item.title)
                    .font(Theme.Typography.bodySmall(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                if let userName = item.userName {
                    Text(userName)
                        .font(Theme.Typography.caption())
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }

            Spacer()

            // Timestamp
            Text(item.timestamp, style: .relative)
                .font(Theme.Typography.caption())
                .foregroundColor(Theme.Colors.textSecondary)
        }
        .padding(Theme.Spacing._3)
    }

    private var activityIcon: String {
        switch item.type {
        case .taskCompleted: return "checkmark.circle.fill"
        case .expenseAdded: return "cart.fill"
        case .messageReceived: return "envelope.fill"
        case .eventCreated: return "calendar.badge.plus"
        case .paymentMade: return "dollarsign.circle.fill"
        }
    }

    private var activityColor: Color {
        switch item.type {
        case .taskCompleted: return Color(hex: "10B981")
        case .expenseAdded: return Theme.ResidentColors._500
        case .messageReceived: return Color(hex: "3B82F6")
        case .eventCreated: return Color(hex: "8B5CF6")
        case .paymentMade: return Color(hex: "F59E0B")
        }
    }
}

// MARK: - Quick Action Button

private struct QuickActionButton: View {
    let title: String
    let icon: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: Theme.Spacing._3) {
                Image(systemName: icon)
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(color)
                    .frame(width: 40, height: 40)
                    .background(color.opacity(0.1))
                    .cornerRadius(Theme.CornerRadius.lg)

                Text(title)
                    .font(Theme.Typography.body(.medium))
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Theme.Colors.textSecondary)
            }
            .padding(Theme.Spacing._4)
            .background(Color.white)
            .cornerRadius(Theme.CornerRadius.lg)
            .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - View Model

@MainActor
class ResidentDashboardViewModel: ObservableObject {
    @Published var stats: ResidentStats?
    @Published var isLoading = false
    @Published var error: NetworkError?

    private let analyticsService = AnalyticsService.shared

    func loadData() async {
        isLoading = true
        defer { isLoading = false }

        do {
            // Load stats
            stats = try await analyticsService.getResidentStats()
        } catch let error as NetworkError {
            self.error = error
        } catch {
            self.error = .unknown
        }
    }

    func refresh() async {
        await loadData()
    }
}

// MARK: - Preview

struct ResidentDashboardView_Previews: PreviewProvider {
    static var previews: some View {
        ResidentDashboardView()
            .environmentObject(LanguageManager.shared)
    }
}
