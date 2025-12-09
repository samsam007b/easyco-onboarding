//
//  ModernResidentHubView.swift
//  IzzIco
//
//  Version modernisée du Resident Hub avec le nouveau design system
//  Glassmorphism + Gradients signature EasyCo
//

import SwiftUI

struct ModernResidentHubView: View {
    @StateObject private var viewModel = ResidentHubViewModel()
    @State private var showSettings = false
    @State private var showNotifications = false

    var body: some View {
        NavigationStack {
            ZStack {
                // Background moderne avec gradient Resident
                Theme.ModernBackgrounds.residentGradient
                    .ignoresSafeArea()

                Group {
                    if viewModel.isLoading {
                        LoadingView(message: "Chargement...")
                    } else if let error = viewModel.error {
                        errorView(error)
                    } else {
                        contentView
                    }
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Hub")
                        .font(Theme.ModernTypography.sectionTitle(.bold))
                        .foregroundColor(Theme.Colors.textPrimary)
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    HStack(spacing: 12) {
                        // Notification badge moderne
                        Button(action: { showNotifications = true }) {
                            ZStack(alignment: .topTrailing) {
                                ModernIconButton(
                                    systemName: "bell.fill",
                                    role: .resident,
                                    action: { showNotifications = true }
                                )

                                if viewModel.getTotalAlerts() > 0 {
                                    ModernNotificationBadge(
                                        count: viewModel.getTotalAlerts(),
                                        role: .resident
                                    )
                                    .offset(x: 8, y: -8)
                                }
                            }
                        }

                        // Profile button moderne
                        ModernIconButton(
                            systemName: "person.circle.fill",
                            role: .resident,
                            action: { showSettings = true }
                        )
                    }
                }
            }
            .sheet(isPresented: $showSettings) {
                SettingsView()
            }
            .sheet(isPresented: $showNotifications) {
                // TODO: Create NotificationsView
                Text("Notifications")
            }
        }
        .refreshable {
            await viewModel.refresh()
        }
    }

    // MARK: - Content View

    private var contentView: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Welcome Card Moderne
                welcomeCard

                // Household Quick Stats
                if let household = viewModel.household, let lease = viewModel.lease {
                    householdStatsGrid(household: household, lease: lease)
                }

                // Balance Card (style finance app)
                if !viewModel.balance.isEmpty {
                    modernBalanceCard
                }

                // Today's Tasks
                if !viewModel.todaysTasks.isEmpty {
                    todaysTasksSection
                }

                // Quick Actions Grid
                quickActionsGrid

                // Upcoming Events
                if !viewModel.upcomingEvents.isEmpty {
                    upcomingEventsSection
                }

                // Recent Expenses
                if !viewModel.recentExpenses.isEmpty {
                    recentExpensesSection
                }
            }
            .padding(20)
            .padding(.bottom, 20)
        }
    }

    // MARK: - Welcome Card (Modern)

    private var welcomeCard: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(alignment: .top, spacing: 16) {
                VStack(alignment: .leading, spacing: 8) {
                    Text(viewModel.getWelcomeMessage())
                        .font(Theme.ModernTypography.sectionTitle(.bold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    if let household = viewModel.household {
                        Text(household.name)
                            .font(Theme.ModernTypography.bodyRounded(.medium))
                            .foregroundColor(Theme.ResidentColors.primary)
                    }
                }

                Spacer()

                // Icon avec gradient
                ZStack {
                    Circle()
                        .fill(Theme.Gradients.residentCTA)
                        .frame(width: 56, height: 56)
                        .shadow(
                            color: Theme.ResidentColors.primary.opacity(0.3),
                            radius: 12,
                            x: 0,
                            y: 6
                        )

                    Image(systemName: "house.fill")
                        .font(.system(size: 26, weight: .semibold))
                        .foregroundColor(.white)
                }
            }
        }
        .padding(24)
        .glassCardElevated()
    }

    // MARK: - Household Stats Grid (Modern)

    private func householdStatsGrid(household: Household, lease: Lease) -> some View {
        LazyVGrid(columns: [
            GridItem(.flexible()),
            GridItem(.flexible())
        ], spacing: 16) {
            // Roommates count
            ModernStatsCard(
                title: "Colocataires",
                value: "\(household.currentOccupants)/\(household.maxOccupants)",
                icon: "person.2.fill",
                role: .resident
            )

            // Rent info
            ModernStatsCard(
                title: "Loyer",
                value: "\(Int(lease.monthlyRent))€",
                icon: "eurosign.circle.fill",
                role: .resident,
                subtitle: "+\(Int(lease.charges))€ charges"
            )
        }
    }

    // MARK: - Modern Balance Card

    private var modernBalanceCard: some View {
        ModernBalanceCard(
            title: "Balance",
            balance: String(format: "%.2f€", viewModel.totalOwed - viewModel.totalOwedToMe),
            change: viewModel.totalOwed > viewModel.totalOwedToMe
                ? "-\(String(format: "%.2f€", viewModel.totalOwed - viewModel.totalOwedToMe))"
                : "+\(String(format: "%.2f€", viewModel.totalOwedToMe - viewModel.totalOwed))",
            isPositive: viewModel.totalOwedToMe >= viewModel.totalOwed,
            role: .resident,
            chartData: [12, 19, 15, 28, 25, 35, 30, 38, 32, 42] // Données mock
        )
    }

    // MARK: - Today's Tasks Section

    private var todaysTasksSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Tâches d'aujourd'hui")
                    .font(Theme.ModernTypography.sectionTitle(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                if !viewModel.incompleteTodayTasks.isEmpty {
                    Text("\(viewModel.incompleteTodayTasks.count)")
                        .font(Theme.ModernTypography.captionRounded(.bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 4)
                        .background(
                            Capsule()
                                .fill(Theme.Gradients.residentCTA)
                        )
                }

                NavigationLink(destination: TasksView()) {
                    Text("Tout voir")
                        .font(Theme.ModernTypography.bodyRounded(.medium))
                        .foregroundColor(Theme.ResidentColors.primary)
                }
            }
            .padding(.horizontal, 4)

            VStack(spacing: 12) {
                ForEach(viewModel.todaysTasks.prefix(3)) { task in
                    ModernTaskCard(task: task, role: .resident, onComplete: {
                        Task {
                            await viewModel.completeTask(task)
                        }
                    })
                }
            }
        }
    }

    // MARK: - Quick Actions Grid (Modern)

    private var quickActionsGrid: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Actions rapides")
                .font(Theme.ModernTypography.sectionTitle(.bold))
                .foregroundColor(Theme.Colors.textPrimary)
                .padding(.horizontal, 4)

            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 16) {
                NavigationLink(destination: AddExpenseView(viewModel: ExpensesViewModel())) {
                    ModernActionButton(
                        title: "Dépense",
                        icon: "plus.circle.fill",
                        role: .resident,
                        action: {}
                    )
                }

                NavigationLink(destination: CreateTaskView(viewModel: TasksViewModel())) {
                    ModernActionButton(
                        title: "Tâche",
                        icon: "checkmark.circle.fill",
                        role: .resident,
                        action: {}
                    )
                }

                NavigationLink(destination: CreateEventView(viewModel: CalendarViewModel())) {
                    ModernActionButton(
                        title: "Événement",
                        icon: "calendar.badge.plus",
                        role: .resident,
                        action: {}
                    )
                }

                NavigationLink(destination: GroupChatView()) {
                    ModernActionButton(
                        title: "Messages",
                        icon: "message.fill",
                        role: .resident,
                        action: {}
                    )
                }
            }
        }
    }

    // MARK: - Upcoming Events Section

    private var upcomingEventsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Événements à venir")
                    .font(Theme.ModernTypography.sectionTitle(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                NavigationLink(destination: CalendarView()) {
                    Text("Calendrier")
                        .font(Theme.ModernTypography.bodyRounded(.medium))
                        .foregroundColor(Theme.ResidentColors.primary)
                }
            }
            .padding(.horizontal, 4)

            VStack(spacing: 12) {
                ForEach(viewModel.upcomingEvents.prefix(3)) { event in
                    ModernEventCard(event: event, role: .resident)
                }
            }
        }
    }

    // MARK: - Recent Expenses Section

    private var recentExpensesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Dépenses récentes")
                    .font(Theme.ModernTypography.sectionTitle(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                NavigationLink(destination: ExpensesView()) {
                    Text("Tout voir")
                        .font(Theme.ModernTypography.bodyRounded(.medium))
                        .foregroundColor(Theme.ResidentColors.primary)
                }
            }
            .padding(.horizontal, 4)

            VStack(spacing: 12) {
                ForEach(viewModel.recentExpenses.prefix(3)) { expense in
                    ModernExpenseCard(expense: expense, role: .resident)
                }
            }
        }
    }

    // MARK: - Error View

    private func errorView(_ error: String) -> some View {
        VStack(spacing: 24) {
            Spacer()

            ZStack {
                Circle()
                    .fill(Color(hex: "EF4444").opacity(0.15))
                    .frame(width: 100, height: 100)

                Image(systemName: "exclamationmark.triangle.fill")
                    .font(.system(size: 48, weight: .semibold))
                    .foregroundColor(Color(hex: "EF4444"))
            }

            VStack(spacing: 12) {
                Text("Oups !")
                    .font(Theme.ModernTypography.hero(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(error)
                    .font(Theme.ModernTypography.bodyRounded(.regular))
                    .foregroundColor(Theme.Colors.textSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }

            ModernPrimaryButton(
                role: .resident,
                title: "Réessayer",
                action: {
                    Task {
                        await viewModel.refresh()
                    }
                }
            )
            .padding(.horizontal, 40)

            Spacer()
        }
        .padding(20)
    }
}

// MARK: - Modern Task Card

struct ModernTaskCard: View {
    let task: ResidentTask
    let role: Theme.UserRole
    let onComplete: () -> Void

    var body: some View {
        HStack(spacing: 16) {
            // Checkbox
            Button(action: onComplete) {
                ZStack {
                    Circle()
                        .stroke(
                            task.isCompleted
                                ? Color(hex: "10B981")
                                : role.primaryColor.opacity(0.3),
                            lineWidth: 2.5
                        )
                        .frame(width: 28, height: 28)

                    if task.isCompleted {
                        Image(systemName: "checkmark")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(Color(hex: "10B981"))
                    }
                }
            }

            // Content
            VStack(alignment: .leading, spacing: 6) {
                Text(task.title)
                    .font(Theme.ModernTypography.bodyRounded(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .strikethrough(task.isCompleted)

                if let assigneeName = task.assigneeName {
                    HStack(spacing: 6) {
                        Image(systemName: "person.fill")
                            .font(.system(size: 11))
                        Text(assigneeName)
                            .font(Theme.ModernTypography.captionRounded(.regular))
                    }
                    .foregroundColor(Theme.Colors.textSecondary)
                }
            }

            Spacer()

            // Priority indicator
            if task.priority == .urgent || task.priority == .high {
                Circle()
                    .fill(Color(hex: task.priority.color))
                    .frame(width: 8, height: 8)
            }
        }
        .padding(16)
        .glassCard(cornerRadius: 16)
    }
}

// MARK: - Modern Event Card

struct ModernEventCard: View {
    let event: Event
    let role: Theme.UserRole

    var body: some View {
        HStack(spacing: 16) {
            // Icon
            ZStack {
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color(hex: event.type.color).opacity(0.15))
                    .frame(width: 48, height: 48)

                Image(systemName: event.type.icon)
                    .font(.system(size: 22, weight: .semibold))
                    .foregroundColor(Color(hex: event.type.color))
            }

            // Content
            VStack(alignment: .leading, spacing: 6) {
                Text(event.title)
                    .font(Theme.ModernTypography.bodyRounded(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                HStack(spacing: 8) {
                    HStack(spacing: 4) {
                        Image(systemName: "calendar")
                            .font(.system(size: 11))
                        Text(event.formattedDate)
                            .font(Theme.ModernTypography.captionRounded(.regular))
                    }
                    .foregroundColor(Theme.Colors.textSecondary)

                    if let organizerName = event.organizerName {
                        Text("•")
                            .foregroundColor(Theme.Colors.textTertiary)

                        Text(organizerName)
                            .font(Theme.ModernTypography.captionRounded(.regular))
                            .foregroundColor(Theme.Colors.textSecondary)
                    }
                }
            }

            Spacer()

            Image(systemName: "chevron.right")
                .font(.system(size: 13, weight: .semibold))
                .foregroundColor(Theme.Colors.textTertiary)
        }
        .padding(16)
        .glassCard(cornerRadius: 16)
    }
}

// MARK: - Modern Expense Card

struct ModernExpenseCard: View {
    let expense: Expense
    let role: Theme.UserRole

    var body: some View {
        HStack(spacing: 16) {
            // Icon
            ZStack {
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color(hex: expense.category.color).opacity(0.15))
                    .frame(width: 48, height: 48)

                Image(systemName: expense.category.icon)
                    .font(.system(size: 22, weight: .semibold))
                    .foregroundColor(Color(hex: expense.category.color))
            }

            // Content
            VStack(alignment: .leading, spacing: 6) {
                Text(expense.title)
                    .font(Theme.ModernTypography.bodyRounded(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                if let paidByName = expense.paidByName {
                    HStack(spacing: 4) {
                        Image(systemName: "person.fill")
                            .font(.system(size: 11))
                        Text("Payé par \(paidByName)")
                            .font(Theme.ModernTypography.captionRounded(.regular))
                    }
                    .foregroundColor(Theme.Colors.textSecondary)
                }
            }

            Spacer()

            // Amount
            VStack(alignment: .trailing, spacing: 4) {
                Text(expense.formattedAmount)
                    .font(Theme.ModernTypography.bodyRounded(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                if expense.splitType == .equal {
                    Text("\(String(format: "%.2f€", expense.amountPerPerson))/pers")
                        .font(Theme.ModernTypography.captionRounded(.medium))
                        .foregroundColor(role.primaryColor)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(
                            Capsule()
                                .fill(role.primaryColor.opacity(0.12))
                        )
                }
            }
        }
        .padding(16)
        .glassCard(cornerRadius: 16)
    }
}

// MARK: - Preview

#if DEBUG
struct ModernResidentHubView_Previews: PreviewProvider {
    static var previews: some View {
        ModernResidentHubView()
    }
}
#endif
