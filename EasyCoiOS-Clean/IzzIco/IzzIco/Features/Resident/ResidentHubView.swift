//
//  ResidentHubView.swift
//  IzzIco
//
//  Dashboard Resident REDESIGNED - Style Pinterest avec glassmorphism
//  Background organic orange/corail, animations smooth, identité forte
//

import SwiftUI

// MARK: - Resident Hub View (Dashboard Principal)

struct ResidentHubView: View {
    @StateObject private var viewModel = ResidentHubViewModel()
    @State private var showSettings = false
    @State private var showProfileSheet = false
    @State private var showAlertsSheet = false
    @State private var showMenuSheet = false
    @State private var selectedSegment = 0

    private let role: Theme.UserRole = .resident

    var body: some View {
        ZStack(alignment: .top) {
            Group {
                if viewModel.isLoading {
                    ZStack {
                        PinterestBackground(role: role, intensity: 0.18)
                            .ignoresSafeArea()

                        LoadingView(message: "Chargement du dashboard...")
                    }
                } else if let error = viewModel.error {
                    errorView(error)
                } else {
                    contentView
                }
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
        .sheet(isPresented: $showSettings) {
            SettingsView()
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
        .refreshable {
            await viewModel.refresh()
        }
    }

    // MARK: - Error View

    private func errorView(_ error: String) -> some View {
        ZStack {
            PinterestBackground(role: role, intensity: 0.18)
                .ignoresSafeArea()

            VStack(spacing: 24) {
                Spacer()

                Image(systemName: "exclamationmark.triangle.fill")
                    .font(.system(size: 60, weight: .semibold))
                    .foregroundColor(Color(hex: "EF4444"))

                VStack(spacing: 12) {
                    Text("Oups !")
                        .font(Theme.PinterestTypography.heroMedium(.heavy))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text(error)
                        .font(Theme.PinterestTypography.bodyRegular(.regular))
                        .foregroundColor(Theme.Colors.textSecondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 32)
                }

                PinterestPrimaryButton("Réessayer", role: role, icon: "arrow.clockwise") {
                    Task {
                        await viewModel.refresh()
                    }
                }
                .padding(.horizontal, 40)

                Spacer()
            }
        }
    }

    // MARK: - Content View

    private var contentView: some View {
        ZStack {
            // Background Pinterest avec blobs organiques orange/corail
            PinterestBackground(role: role, intensity: 0.18)
                .ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                VStack(spacing: 0) {
                    // Spacer for floating header
                    Color.clear.frame(height: 70)

                    VStack(spacing: Theme.PinterestSpacing.lg) {
                        // Hero Welcome Section
                        heroWelcomeSection

                    // Hero Balance Card (Finance app style)
                    if !viewModel.balance.isEmpty {
                        heroBalanceCard
                    }

                    // Stats Grid (Home app style)
                    if viewModel.household != nil && viewModel.lease != nil {
                        statsGrid
                    }

                    // Segment Control
                    segmentControl

                    // Content selon segment sélectionné
                    if selectedSegment == 0 {
                        todayContent
                    } else if selectedSegment == 1 {
                        tasksContent
                    } else {
                        activityContent
                    }

                    // Quick Actions Grid
                    quickActionsSection
                    }
                    .padding(.horizontal, Theme.PinterestSpacing.lg)
                    .padding(.top, Theme.PinterestSpacing.md)
                    .padding(.bottom, Theme.PinterestSpacing.xxxl)
                }
            }
        }
    }

    // MARK: - Hero Welcome Section

    private var heroWelcomeSection: some View {
        VStack(alignment: .leading, spacing: Theme.PinterestSpacing.sm) {
            Text(viewModel.getWelcomeMessage())
                .font(Theme.PinterestTypography.heroMedium(.heavy))
                .foregroundColor(Theme.Colors.textPrimary)

            if let household = viewModel.household {
                HStack(spacing: 8) {
                    Image(systemName: "house.fill")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(role.primaryColor)

                    Text(household.name)
                        .font(Theme.PinterestTypography.bodyLarge(.medium))
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.top, Theme.PinterestSpacing.sm)
    }

    // MARK: - Hero Balance Card

    private var heroBalanceCard: some View {
        PinterestHeroCard(
            title: "Votre Balance",
            amount: String(format: "%.0f€", abs(viewModel.totalOwed - viewModel.totalOwedToMe)),
            change: viewModel.totalOwed > viewModel.totalOwedToMe
                ? "-\(String(format: "%.0f€", viewModel.totalOwed - viewModel.totalOwedToMe))"
                : "+\(String(format: "%.0f€", viewModel.totalOwedToMe - viewModel.totalOwed))",
            isPositive: viewModel.totalOwedToMe >= viewModel.totalOwed,
            role: role
        )
    }

    // MARK: - Stats Grid

    private var statsGrid: some View {
        Group {
            if let household = viewModel.household, let lease = viewModel.lease {
                LazyVGrid(columns: [
                    GridItem(.flexible()),
                    GridItem(.flexible())
                ], spacing: Theme.PinterestSpacing.md) {
                    PinterestStatCard(
                        icon: "person.2.fill",
                        value: "\(household.currentOccupants)/\(household.maxOccupants)",
                        label: "Colocataires",
                        role: role
                    )

                    PinterestStatCard(
                        icon: "eurosign.circle.fill",
                        value: "\(Int(lease.monthlyRent))€",
                        label: "Loyer",
                        subtitle: "+\(Int(lease.charges))€",
                        role: role
                    )
                }
            }
        }
    }

    // MARK: - Segment Control

    private var segmentControl: some View {
        PinterestSegmentControl(
            options: ["Aujourd'hui", "Tâches", "Activité"],
            selectedIndex: $selectedSegment,
            role: role
        )
    }

    // MARK: - Today Content

    private var todayContent: some View {
        VStack(alignment: .leading, spacing: Theme.PinterestSpacing.md) {
            Text("Aujourd'hui")
                .font(Theme.PinterestTypography.titleLarge(.bold))
                .foregroundColor(Theme.Colors.textPrimary)

            // Today's tasks
            if !viewModel.todaysTasks.isEmpty {
                ForEach(viewModel.todaysTasks.prefix(3)) { task in
                    PinterestListCard(
                        icon: task.isCompleted ? "checkmark.circle.fill" : "circle",
                        iconColor: task.isCompleted ? Color(hex: "10B981") : role.primaryColor,
                        role: role
                    ) {
                        VStack(alignment: .leading, spacing: 6) {
                            Text(task.title)
                                .font(Theme.PinterestTypography.bodyRegular(.semibold))
                                .foregroundColor(Theme.Colors.textPrimary)
                                .strikethrough(task.isCompleted)

                            if let assigneeName = task.assigneeName {
                                HStack(spacing: 6) {
                                    Image(systemName: "person.fill")
                                        .font(.system(size: 11))
                                    Text(assigneeName)
                                        .font(Theme.PinterestTypography.caption(.regular))
                                }
                                .foregroundColor(Theme.Colors.textSecondary)
                            }
                        }
                    }
                    .onTapGesture {
                        Task {
                            await viewModel.completeTask(task)
                        }
                    }
                }
            } else {
                emptyStateCard("Aucune tâche aujourd'hui")
            }

            // Upcoming events
            if !viewModel.upcomingEvents.isEmpty {
                Text("Événements à venir")
                    .font(Theme.PinterestTypography.titleMedium(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .padding(.top, Theme.PinterestSpacing.sm)

                ForEach(viewModel.upcomingEvents.prefix(2)) { event in
                    PinterestListCard(
                        icon: event.type.icon,
                        iconColor: Color(hex: event.type.color),
                        role: role
                    ) {
                        VStack(alignment: .leading, spacing: 6) {
                            Text(event.title)
                                .font(Theme.PinterestTypography.bodyRegular(.semibold))
                                .foregroundColor(Theme.Colors.textPrimary)

                            Text(event.formattedDate)
                                .font(Theme.PinterestTypography.caption(.regular))
                                .foregroundColor(Theme.Colors.textSecondary)
                        }
                    }
                }
            }
        }
    }

    // MARK: - Tasks Content

    private var tasksContent: some View {
        VStack(alignment: .leading, spacing: Theme.PinterestSpacing.md) {
            Text("Toutes les tâches")
                .font(Theme.PinterestTypography.titleLarge(.bold))
                .foregroundColor(Theme.Colors.textPrimary)

            if !viewModel.incompleteTodayTasks.isEmpty {
                Text("\(viewModel.incompleteTodayTasks.count) tâche\(viewModel.incompleteTodayTasks.count > 1 ? "s" : "") restante\(viewModel.incompleteTodayTasks.count > 1 ? "s" : "")")
                    .font(Theme.PinterestTypography.bodyRegular(.medium))
                    .foregroundColor(Theme.Colors.textSecondary)

                ForEach(viewModel.todaysTasks) { task in
                    PinterestListCard(
                        icon: task.isCompleted ? "checkmark.circle.fill" : "circle",
                        iconColor: task.isCompleted ? Color(hex: "10B981") : role.primaryColor,
                        role: role
                    ) {
                        VStack(alignment: .leading, spacing: 6) {
                            Text(task.title)
                                .font(Theme.PinterestTypography.bodyRegular(.semibold))
                                .foregroundColor(Theme.Colors.textPrimary)
                                .strikethrough(task.isCompleted)

                            HStack(spacing: 8) {
                                if let assigneeName = task.assigneeName {
                                    HStack(spacing: 4) {
                                        Image(systemName: "person.fill")
                                            .font(.system(size: 11))
                                        Text(assigneeName)
                                    }
                                }

                                if task.priority == .urgent || task.priority == .high {
                                    PinterestBadge(
                                        text: task.priority == .urgent ? "Urgent" : "Prioritaire",
                                        role: role,
                                        style: .subtle
                                    )
                                }
                            }
                            .font(Theme.PinterestTypography.caption(.regular))
                            .foregroundColor(Theme.Colors.textSecondary)
                        }
                    }
                }
            } else {
                emptyStateCard("Aucune tâche en cours")
            }
        }
    }

    // MARK: - Activity Content

    private var activityContent: some View {
        VStack(alignment: .leading, spacing: Theme.PinterestSpacing.md) {
            Text("Activité récente")
                .font(Theme.PinterestTypography.titleLarge(.bold))
                .foregroundColor(Theme.Colors.textPrimary)

            if !viewModel.recentExpenses.isEmpty {
                ForEach(viewModel.recentExpenses.prefix(5)) { expense in
                    PinterestListCard(
                        icon: expense.category.icon,
                        iconColor: Color(hex: expense.category.color),
                        role: role
                    ) {
                        HStack {
                            VStack(alignment: .leading, spacing: 6) {
                                Text(expense.title)
                                    .font(Theme.PinterestTypography.bodyRegular(.semibold))
                                    .foregroundColor(Theme.Colors.textPrimary)

                                if let paidByName = expense.paidByName {
                                    Text("Payé par \(paidByName)")
                                        .font(Theme.PinterestTypography.caption(.regular))
                                        .foregroundColor(Theme.Colors.textSecondary)
                                }
                            }

                            Spacer()

                            Text(expense.formattedAmount)
                                .font(Theme.PinterestTypography.bodyLarge(.bold))
                                .foregroundColor(Theme.Colors.textPrimary)
                        }
                    }
                }
            } else {
                emptyStateCard("Aucune activité récente")
            }
        }
    }

    // MARK: - Quick Actions

    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: Theme.PinterestSpacing.md) {
            Text("Actions rapides")
                .font(Theme.PinterestTypography.titleLarge(.bold))
                .foregroundColor(Theme.Colors.textPrimary)

            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: Theme.PinterestSpacing.md) {
                NavigationLink(destination: AddExpenseView(viewModel: ExpensesViewModel())) {
                    PinterestActionTile(
                        icon: "plus.circle.fill",
                        title: "Dépense",
                        role: role,
                        action: {}
                    )
                }

                NavigationLink(destination: CreateTaskView(viewModel: TasksViewModel())) {
                    PinterestActionTile(
                        icon: "checkmark.circle.fill",
                        title: "Tâche",
                        role: role,
                        action: {}
                    )
                }

                NavigationLink(destination: CreateEventView(viewModel: CalendarViewModel())) {
                    PinterestActionTile(
                        icon: "calendar.badge.plus",
                        title: "Événement",
                        role: role,
                        action: {}
                    )
                }

                NavigationLink(destination: GroupChatView()) {
                    PinterestActionTile(
                        icon: "message.fill",
                        title: "Messages",
                        role: role,
                        action: {}
                    )
                }
            }
        }
    }

    // MARK: - Empty State

    private func emptyStateCard(_ message: String) -> some View {
        VStack(spacing: Theme.PinterestSpacing.md) {
            Image(systemName: "checkmark.circle")
                .font(.system(size: 48, weight: .light))
                .foregroundColor(Theme.Colors.textTertiary)

            Text(message)
                .font(Theme.PinterestTypography.bodyRegular(.medium))
                .foregroundColor(Theme.Colors.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(Theme.PinterestSpacing.xl)
        .pinterestGlassCard(padding: 0, radius: Theme.PinterestRadius.large)
    }
}

// MARK: - Preview

#if DEBUG
struct ResidentHubView_Previews: PreviewProvider {
    static var previews: some View {
        ResidentHubView()
    }
}
#endif
