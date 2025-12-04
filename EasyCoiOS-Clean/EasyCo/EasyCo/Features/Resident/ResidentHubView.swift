import SwiftUI

// MARK: - Resident Hub View (Dashboard Principal)

struct ResidentHubView: View {
    @StateObject private var viewModel = ResidentHubViewModel()
    @State private var showSettings = false

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading {
                    LoadingView(message: "Chargement du dashboard...")
                } else if let error = viewModel.error {
                    VStack(spacing: 24) {
                        Spacer()

                        Image(systemName: "exclamationmark.triangle")
                            .font(.system(size: 60))
                            .foregroundColor(Color(hex: "EF4444"))

                        VStack(spacing: 12) {
                            Text("Oups !")
                                .font(.system(size: 24, weight: .bold))
                                .foregroundColor(Color(hex: "111827"))

                            Text(error)
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "6B7280"))
                                .multilineTextAlignment(.center)
                                .padding(.horizontal, 32)
                        }

                        Button(action: {
                            _Concurrency.Task {
                                await viewModel.refresh()
                            }
                        }) {
                            HStack(spacing: 8) {
                                Image(systemName: "arrow.clockwise")
                                Text("Réessayer")
                            }
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 24)
                            .padding(.vertical, 12)
                            .background(Color(hex: "E8865D"))
                            .cornerRadius(12)
                        }

                        Spacer()
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color(hex: "F9FAFB"))
                } else {
                    contentView
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Hub")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    HStack(spacing: 16) {
                        // Badge d'alertes si présentes
                        if viewModel.getTotalAlerts() > 0 {
                            ZStack(alignment: .topTrailing) {
                                Image(systemName: "bell.fill")
                                    .font(.system(size: 20))
                                    .foregroundColor(Color(hex: "E8865D"))

                                Circle()
                                    .fill(Color(hex: "EF4444"))
                                    .frame(width: 18, height: 18)
                                    .overlay(
                                        Text("\(viewModel.getTotalAlerts())")
                                            .font(.system(size: 10, weight: .bold))
                                            .foregroundColor(.white)
                                    )
                                    .offset(x: 8, y: -8)
                            }
                        }

                        // Profile button
                        ProfileButton { showSettings = true }
                    }
                }
            }
            .sheet(isPresented: $showSettings) {
                SettingsView()
            }
        }
        .refreshable {
            await viewModel.refresh()
        }
    }

    private var contentView: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Welcome Card
                welcomeCard

                // Household Info Card
                if let household = viewModel.household, let lease = viewModel.lease {
                    householdInfoCard(household: household, lease: lease)
                }

                // Today's Tasks Section
                if !viewModel.todaysTasks.isEmpty {
                    todaysTasksSection
                }

                // Balance Summary
                if !viewModel.balance.isEmpty {
                    balanceSummaryCard
                }

                // Upcoming Events
                if !viewModel.upcomingEvents.isEmpty {
                    upcomingEventsSection
                }

                // Quick Actions
                quickActionsSection

                // Recent Expenses
                if !viewModel.recentExpenses.isEmpty {
                    recentExpensesSection
                }
            }
            .padding(16)
        }
        .background(Color(hex: "F9FAFB"))
    }

    // MARK: - Welcome Card

    private var welcomeCard: some View {
        ZStack {
            // Gradient de fond
            LinearGradient(
                colors: [
                    Color(hex: "E8865D").opacity(0.2),
                    Color(hex: "FF8C4B").opacity(0.1)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    VStack(alignment: .leading, spacing: 8) {
                        Text(viewModel.getWelcomeMessage())
                            .font(.system(size: 24, weight: .bold))
                            .foregroundColor(Color(hex: "111827"))

                        if let household = viewModel.household {
                            Text(household.name)
                                .font(.system(size: 15, weight: .medium))
                                .foregroundColor(Color(hex: "E8865D"))
                        }
                    }

                    Spacer()

                    Image(systemName: "house.fill")
                        .font(.system(size: 40))
                        .foregroundColor(Color(hex: "E8865D"))
                }
            }
            .padding(20)
        }
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 2)
    }

    // MARK: - Household Info Card

    private func householdInfoCard(household: Household, lease: Lease) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Votre logement")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            VStack(spacing: 12) {
                // Adresse
                HStack(spacing: 12) {
                    Image(systemName: "mappin.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "E8865D"))

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Adresse")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "6B7280"))
                        Text(household.fullAddress)
                            .font(.system(size: 15, weight: .medium))
                            .foregroundColor(Color(hex: "111827"))
                    }

                    Spacer()
                }

                Divider()

                // Loyer
                HStack(spacing: 12) {
                    Image(systemName: "eurosign.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "10B981"))

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Loyer mensuel")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "6B7280"))
                        Text(String(format: "%.2f€ + %.2f€ charges", lease.monthlyRent, lease.charges))
                            .font(.system(size: 15, weight: .medium))
                            .foregroundColor(Color(hex: "111827"))
                    }

                    Spacer()
                }

                Divider()

                // Fin du bail
                HStack(spacing: 12) {
                    Image(systemName: "calendar.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(lease.isExpiringSoon ? Color(hex: "F59E0B") : Color(hex: "3B82F6"))

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Fin du bail")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "6B7280"))

                        if let endDate = lease.endDate {
                            Text(formatDate(endDate))
                                .font(.system(size: 15, weight: .medium))
                                .foregroundColor(Color(hex: "111827"))

                            if lease.isExpiringSoon, let days = lease.daysUntilEnd {
                                HStack(spacing: 4) {
                                    Image(systemName: "exclamationmark.triangle.fill")
                                        .font(.system(size: 12))
                                    Text("Dans \(days) jours")
                                }
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "F59E0B"))
                            }
                        } else {
                            Text("Indéterminée")
                                .font(.system(size: 15, weight: .medium))
                                .foregroundColor(Color(hex: "111827"))
                        }
                    }

                    Spacer()
                }

                Divider()

                // Colocataires
                HStack(spacing: 12) {
                    Image(systemName: "person.2.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "8B5CF6"))

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Colocataires")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "6B7280"))
                        Text("\(household.currentOccupants) / \(household.maxOccupants)")
                            .font(.system(size: 15, weight: .medium))
                            .foregroundColor(Color(hex: "111827"))
                    }

                    Spacer()
                }
            }
            .padding(16)
            .background(Color.white)
            .cornerRadius(12)
            .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        }
    }

    // MARK: - Today's Tasks Section

    private var todaysTasksSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Tâches d'aujourd'hui")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                if !viewModel.incompleteTodayTasks.isEmpty {
                    Text("\(viewModel.incompleteTodayTasks.count) restante\(viewModel.incompleteTodayTasks.count > 1 ? "s" : "")")
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                NavigationLink(destination: TasksView()) {
                    Text("Tout voir")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "E8865D"))
                }
            }

            VStack(spacing: 12) {
                ForEach(viewModel.todaysTasks.prefix(3)) { task in
                    TaskCompactCard(task: task, onComplete: {
                        _Concurrency.Task {
                            await viewModel.completeTask(task)
                        }
                    })
                }
            }
        }
    }

    // MARK: - Balance Summary Card

    private var balanceSummaryCard: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Balance")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                NavigationLink(destination: Text("Dépenses")) {
                    Text("Détails")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "E8865D"))
                }
            }

            HStack(spacing: 16) {
                // Montant dû
                VStack(alignment: .leading, spacing: 8) {
                    Text("Vous devez")
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "6B7280"))

                    Text(String(format: "%.2f€", viewModel.totalOwed))
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(Color(hex: "EF4444"))
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(16)
                .background(Color(hex: "FEF2F2"))
                .cornerRadius(12)

                // Montant dû à vous
                VStack(alignment: .leading, spacing: 8) {
                    Text("On vous doit")
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "6B7280"))

                    Text(String(format: "%.2f€", viewModel.totalOwedToMe))
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(Color(hex: "10B981"))
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(16)
                .background(Color(hex: "F0FDF4"))
                .cornerRadius(12)
            }

            // Liste des balances
            if !viewModel.balance.isEmpty {
                VStack(spacing: 8) {
                    ForEach(viewModel.balance.prefix(3)) { balance in
                        HStack(spacing: 12) {
                            Image(systemName: "arrow.right.circle.fill")
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "E8865D"))

                            Text(balance.description)
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "111827"))

                            Spacer()
                        }
                        .padding(.vertical, 4)
                    }
                }
            }
        }
    }

    // MARK: - Upcoming Events Section

    private var upcomingEventsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Événements à venir")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                NavigationLink(destination: Text("Calendrier")) {
                    Text("Voir tout")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "E8865D"))
                }
            }

            VStack(spacing: 12) {
                ForEach(viewModel.upcomingEvents) { event in
                    EventCompactCard(event: event)
                }
            }
        }
    }

    // MARK: - Quick Actions

    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Actions rapides")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                NavigationLink(destination: AddExpenseView(viewModel: ExpensesViewModel())) {
                    QuickActionCard(icon: "eurosign.circle.fill", title: "Ajouter une dépense", color: Color(hex: "10B981"), action: {})
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: CreateTaskView(viewModel: TasksViewModel())) {
                    QuickActionCard(icon: "checkmark.circle.fill", title: "Créer une tâche", color: Color(hex: "E8865D"), action: {})
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: CreateEventView(viewModel: CalendarViewModel())) {
                    QuickActionCard(icon: "calendar.badge.plus", title: "Nouvel événement", color: Color(hex: "6E56CF"), action: {})
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: GroupChatView()) {
                    QuickActionCard(icon: "message.fill", title: "Messages", color: Color(hex: "3B82F6"), action: {})
                }
                .buttonStyle(PlainButtonStyle())
            }

            // Second row with new actions
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                NavigationLink(destination: HubMembersView()) {
                    QuickActionCard(icon: "person.3.fill", title: "Membres", color: Color(hex: "8B5CF6"), action: {})
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: HubInviteView()) {
                    QuickActionCard(icon: "person.badge.plus", title: "Inviter", color: Color(hex: "EC4899"), action: {})
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: CalendarView()) {
                    QuickActionCard(icon: "calendar", title: "Calendrier", color: Color(hex: "F59E0B"), action: {})
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: ProfileEnhancementView(userRole: .resident)) {
                    QuickActionCard(icon: "sparkles", title: "Mon Profil", color: Color(hex: "10B981"), action: {})
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
    }

    // MARK: - Recent Expenses Section

    private var recentExpensesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Dépenses récentes")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                NavigationLink(destination: Text("Toutes les dépenses")) {
                    Text("Voir tout")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "E8865D"))
                }
            }

            VStack(spacing: 12) {
                ForEach(viewModel.recentExpenses) { expense in
                    ExpenseCompactCard(expense: expense)
                }
            }
        }
    }

}

// MARK: - Helper Functions

private func formatDate(_ date: Date) -> String {
    let formatter = DateFormatter()
    formatter.dateStyle = .medium
    return formatter.string(from: date)
}

private func formatDateShort(_ date: Date) -> String {
    let formatter = DateFormatter()
    formatter.dateStyle = .short
    return formatter.string(from: date)
}

// MARK: - Quick Action Card

struct ResidentQuickActionCard: View {
    let icon: String
    let title: String
    let color: Color

    var body: some View {
        Button(action: {}) {
            VStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.system(size: 28))
                    .foregroundColor(color)

                Text(title)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "374151"))
                    .multilineTextAlignment(.center)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 20)
            .background(Color.white)
            .cornerRadius(12)
            .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        }
    }
}

// MARK: - Task Compact Card

struct TaskCompactCard: View {
    let task: ResidentTask
    let onComplete: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            Button(action: onComplete) {
                Image(systemName: task.isCompleted ? "checkmark.circle.fill" : "circle")
                    .font(.system(size: 24))
                    .foregroundColor(task.isCompleted ? Color(hex: "10B981") : Color(hex: "D1D5DB"))
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(task.title)
                    .font(.system(size: 15, weight: .medium))
                    .foregroundColor(Color(hex: "111827"))
                    .strikethrough(task.isCompleted)

                HStack(spacing: 8) {
                    if let assigneeName = task.assigneeName {
                        HStack(spacing: 4) {
                            Image(systemName: "person.fill")
                                .font(.system(size: 10))
                            Text(assigneeName)
                                .font(.system(size: 12))
                        }
                        .foregroundColor(Color(hex: "6B7280"))
                    }

                    Text(task.statusText)
                        .font(.system(size: 12))
                        .foregroundColor(task.isOverdue ? Color(hex: "EF4444") : Color(hex: "6B7280"))
                }
            }

            Spacer()

            if task.priority == .urgent || task.priority == .high {
                Image(systemName: "exclamationmark.circle.fill")
                    .font(.system(size: 18))
                    .foregroundColor(Color(hex: task.priority.color))
            }
        }
        .padding(12)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Event Compact Card

struct EventCompactCard: View {
    let event: Event

    var body: some View {
        HStack(spacing: 12) {
            VStack {
                Image(systemName: event.type.icon)
                    .font(.system(size: 20))
                    .foregroundColor(Color(hex: event.type.color))
                    .frame(width: 40, height: 40)
                    .background(Color(hex: event.type.color).opacity(0.1))
                    .cornerRadius(8)
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(event.title)
                    .font(.system(size: 15, weight: .medium))
                    .foregroundColor(Color(hex: "111827"))

                HStack(spacing: 8) {
                    HStack(spacing: 4) {
                        Image(systemName: "calendar")
                            .font(.system(size: 10))
                        Text(event.formattedDate)
                            .font(.system(size: 12))
                    }
                    .foregroundColor(Color(hex: "6B7280"))

                    if let organizerName = event.organizerName {
                        HStack(spacing: 4) {
                            Image(systemName: "person.fill")
                                .font(.system(size: 10))
                            Text(organizerName)
                                .font(.system(size: 12))
                        }
                        .foregroundColor(Color(hex: "6B7280"))
                    }
                }
            }

            Spacer()

            Image(systemName: "chevron.right")
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "9CA3AF"))
        }
        .padding(12)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Expense Compact Card

struct ExpenseCompactCard: View {
    let expense: Expense

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: expense.category.icon)
                .font(.system(size: 20))
                .foregroundColor(Color(hex: expense.category.color))
                .frame(width: 40, height: 40)
                .background(Color(hex: expense.category.color).opacity(0.1))
                .cornerRadius(8)

            VStack(alignment: .leading, spacing: 4) {
                Text(expense.title)
                    .font(.system(size: 15, weight: .medium))
                    .foregroundColor(Color(hex: "111827"))

                HStack(spacing: 8) {
                    if let paidByName = expense.paidByName {
                        Text("Payé par \(paidByName)")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "6B7280"))
                    }

                    Text(formatDateShort(expense.date))
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "9CA3AF"))
                }
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 4) {
                Text(expense.formattedAmount)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                if expense.splitType == .equal {
                    Text("\(String(format: "%.2f€", expense.amountPerPerson))/pers")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "6B7280"))
                }
            }
        }
        .padding(12)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}
