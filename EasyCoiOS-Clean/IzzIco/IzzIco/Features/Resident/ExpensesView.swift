//
//  ExpensesView.swift
//  IzzIco
//
//  Vue complète des dépenses - REDESIGN Pinterest Style Clean
//  Architecture simplifiée pour éviter les bugs d'affichage
//

import SwiftUI

struct ExpensesView: View {
    @StateObject private var viewModel = ExpensesViewModel()
    private let role: Theme.UserRole = .resident
    @State private var showProfileSheet = false
    @State private var showAlertsSheet = false
    @State private var showMenuSheet = false

    var body: some View {
        ZStack(alignment: .top) {
            // Background
            PinterestBackground(role: role, intensity: 0.15)
                .ignoresSafeArea()

            // Content
            ScrollView(showsIndicators: false) {
                VStack(spacing: Theme.PinterestSpacing.lg) {
                    // Spacer for floating header
                    Color.clear.frame(height: 70)

                    heroSection
                    quickFiltersSection

                    if viewModel.isLoading {
                        loadingSection
                    } else if viewModel.filteredExpenses.isEmpty {
                        emptySection
                    } else {
                        expensesSection
                    }
                }
                .padding(.horizontal, Theme.PinterestSpacing.lg)
                .padding(.bottom, 100)
            }

            // Floating Header
            FloatingHeaderView(
                role: role,
                showAddButton: true,
                onProfileTap: { showProfileSheet = true },
                onAlertTap: { showAlertsSheet = true },
                onMenuTap: { showMenuSheet = true },
                onAddTap: { viewModel.showAddExpense = true }
            )
        }
        .pinterestFormPresentation(isPresented: $viewModel.showAddExpense) {
            AddExpenseView(viewModel: viewModel)
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

    // MARK: - Hero Section

    private var heroSection: some View {
        VStack(spacing: Theme.PinterestSpacing.md) {
            balanceCard
            statsGrid
        }
    }

    private var balanceCard: some View {
        VStack(alignment: .leading, spacing: Theme.PinterestSpacing.sm) {
            Text("Balance totale")
                .font(Theme.PinterestTypography.bodyRegular(.medium))
                .foregroundColor(.white.opacity(0.9))

            Text(String(format: "%.0f€", viewModel.totalExpenses))
                .font(Theme.PinterestTypography.heroLarge(.heavy))
                .foregroundColor(.white)

            Text("Ce mois-ci")
                .font(Theme.PinterestTypography.caption(.medium))
                .foregroundColor(.white.opacity(0.75))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(Theme.PinterestSpacing.xl)
        .background(
            RoundedRectangle(cornerRadius: Theme.PinterestRadius.xxLarge)
                .fill(role.gradient)
        )
        .pinterestShadow(Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.4))
    }

    private var statsGrid: some View {
        HStack(spacing: Theme.PinterestSpacing.sm) {
            statCard(
                title: "Je dois",
                value: String(format: "%.0f€", viewModel.iOwe),
                icon: "arrow.up.circle.fill",
                color: Color(hex: "EF4444")
            )

            statCard(
                title: "On me doit",
                value: String(format: "%.0f€", viewModel.oweMe),
                icon: "arrow.down.circle.fill",
                color: Color(hex: "10B981")
            )

            statCard(
                title: "Ma part",
                value: String(format: "%.0f€", viewModel.myShare),
                icon: "person.fill",
                color: role.primaryColor
            )
        }
    }

    private func statCard(title: String, value: String, icon: String, color: Color) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            ZStack {
                Circle()
                    .fill(color.opacity(0.15))
                    .frame(width: 32, height: 32)

                Image(systemName: icon)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(color)
            }

            Spacer()

            Text(value)
                .font(Theme.PinterestTypography.bodyLarge(.bold))
                .foregroundColor(Theme.Colors.textPrimary)
                .minimumScaleFactor(0.8)
                .lineLimit(1)

            Text(title)
                .font(Theme.PinterestTypography.captionSmall(.medium))
                .foregroundColor(Theme.Colors.textSecondary)
                .lineLimit(1)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .frame(height: 110)
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                .fill(Color.white.opacity(0.7))
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                        .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                )
        )
        .pinterestShadow(Theme.PinterestShadows.medium)
    }

    // MARK: - Filters Section

    private var quickFiltersSection: some View {
        VStack(spacing: Theme.PinterestSpacing.md) {
            searchBar
            filterChips
        }
    }

    private var searchBar: some View {
        HStack(spacing: 12) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(Theme.Colors.textTertiary)

            TextField("Rechercher...", text: $viewModel.searchText)
                .font(Theme.PinterestTypography.bodyRegular(.regular))
                .foregroundColor(Theme.Colors.textPrimary)

            if !viewModel.searchText.isEmpty {
                Button(action: {
                    withAnimation(Theme.PinterestAnimations.quickSpring) {
                        viewModel.searchText = ""
                    }
                }) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 18))
                        .foregroundColor(Theme.Colors.textTertiary)
                }
            }
        }
        .padding(Theme.PinterestSpacing.md)
        .background(
            RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                .fill(Color.white.opacity(0.7))
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                        .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                )
        )
        .pinterestShadow(Theme.PinterestShadows.medium)
    }

    private var filterChips: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(ExpenseFilter.allCases, id: \.self) { filter in
                    filterChip(filter)
                }
            }
        }
    }

    private func filterChip(_ filter: ExpenseFilter) -> some View {
        let isSelected = viewModel.selectedFilter == filter
        let count = viewModel.getCount(for: filter)

        return Button(action: {
            withAnimation(Theme.PinterestAnimations.smoothSpring) {
                viewModel.selectedFilter = filter
                Haptic.selection()
            }
        }) {
            HStack(spacing: 8) {
                Image(systemName: filter.icon)
                    .font(.system(size: 13, weight: .semibold))

                Text(filter.displayName)
                    .font(Theme.PinterestTypography.bodySmall(isSelected ? .semibold : .medium))

                if count > 0 {
                    Text("\(count)")
                        .font(Theme.PinterestTypography.captionSmall(.bold))
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(
                            Capsule()
                                .fill(isSelected ? Color.white.opacity(0.25) : role.primaryColor.opacity(0.12))
                        )
                }
            }
            .foregroundColor(isSelected ? .white : role.primaryColor)
            .padding(.horizontal, Theme.PinterestSpacing.md)
            .padding(.vertical, 12)
            .background(
                Group {
                    if isSelected {
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                            .fill(role.gradient)
                            .pinterestShadow(Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.35))
                    } else {
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                            .fill(Color.white.opacity(0.75))
                            .overlay(
                                RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                                    .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                            )
                            .pinterestShadow(Theme.PinterestShadows.subtle)
                    }
                }
            )
        }
        .buttonStyle(ScaleButtonStyle())
    }

    // MARK: - Content Sections

    private var loadingSection: some View {
        VStack(spacing: Theme.PinterestSpacing.lg) {
            ProgressView()
                .scaleEffect(1.5)
                .tint(role.primaryColor)

            Text("Chargement...")
                .font(Theme.PinterestTypography.bodyRegular(.medium))
                .foregroundColor(Theme.Colors.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .frame(height: 300)
    }

    private var emptySection: some View {
        VStack(spacing: Theme.PinterestSpacing.xl) {
            ZStack {
                Circle()
                    .fill(role.primaryColor.opacity(0.15))
                    .frame(width: 120, height: 120)
                    .blur(radius: 30)

                Circle()
                    .fill(Color.white.opacity(0.75))
                    .frame(width: 100, height: 100)
                    .overlay(
                        Circle()
                            .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                    )
                    .pinterestShadow(Theme.PinterestShadows.medium)

                Image(systemName: "creditcard")
                    .font(.system(size: 44, weight: .light))
                    .foregroundColor(role.primaryColor)
            }

            VStack(spacing: Theme.PinterestSpacing.sm) {
                Text("Aucune dépense")
                    .font(Theme.PinterestTypography.heroMedium(.heavy))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Ajoutez votre première dépense\npour commencer")
                    .font(Theme.PinterestTypography.bodyRegular(.regular))
                    .foregroundColor(Theme.Colors.textSecondary)
                    .multilineTextAlignment(.center)
            }

            Button(action: {
                viewModel.showAddExpense = true
            }) {
                HStack(spacing: 8) {
                    Image(systemName: "plus.circle.fill")
                    Text("Ajouter une dépense")
                }
                .font(Theme.PinterestTypography.bodyRegular(.semibold))
                .foregroundColor(.white)
                .padding(.horizontal, Theme.PinterestSpacing.xl)
                .padding(.vertical, Theme.PinterestSpacing.md)
                .background(
                    Capsule()
                        .fill(role.gradient)
                )
                .pinterestShadow(Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.3))
            }
        }
        .frame(maxWidth: .infinity)
        .frame(height: 400)
    }

    private var expensesSection: some View {
        VStack(spacing: Theme.PinterestSpacing.md) {
            ForEach(viewModel.filteredExpenses) { expense in
                ExpenseCard(expense: expense, viewModel: viewModel, role: role)
            }
        }
    }
}

// MARK: - Expense Card

struct ExpenseCard: View {
    let expense: Expense
    @ObservedObject var viewModel: ExpensesViewModel
    let role: Theme.UserRole
    @State private var showDetails = false

    var body: some View {
        VStack(alignment: .leading, spacing: Theme.PinterestSpacing.md) {
            headerSection
            paidBySection
            progressSection
            actionsSection

            if showDetails {
                detailsSection
                    .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
        .padding(Theme.PinterestSpacing.md)
        .background(
            RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                .fill(Color.white.opacity(0.7))
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                        .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                )
        )
        .pinterestShadow(Theme.PinterestShadows.medium)
    }

    private var headerSection: some View {
        HStack(spacing: Theme.PinterestSpacing.md) {
            ZStack {
                RoundedRectangle(cornerRadius: 14)
                    .fill(Color(hex: expense.category.color).opacity(0.15))
                    .frame(width: 52, height: 52)

                Image(systemName: expense.category.icon)
                    .font(.system(size: 22, weight: .semibold))
                    .foregroundColor(Color(hex: expense.category.color))
            }

            VStack(alignment: .leading, spacing: 6) {
                Text(expense.title)
                    .font(Theme.PinterestTypography.bodyRegular(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                HStack(spacing: 6) {
                    HStack(spacing: 4) {
                        Image(systemName: expense.category.icon)
                            .font(.system(size: 10, weight: .semibold))
                        Text(expense.category.displayName)
                            .font(Theme.PinterestTypography.captionSmall(.semibold))
                    }
                    .foregroundColor(Color(hex: expense.category.color))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(
                        Capsule()
                            .fill(Color(hex: expense.category.color).opacity(0.15))
                    )

                    Circle()
                        .fill(Theme.Colors.textTertiary)
                        .frame(width: 3, height: 3)

                    Text(expense.date, style: .date)
                        .font(Theme.PinterestTypography.caption(.regular))
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }

            Spacer()

            Text(String(format: "%.2f€", expense.amount))
                .font(Theme.PinterestTypography.titleMedium(.heavy))
                .foregroundColor(role.primaryColor)
        }
    }

    private var paidBySection: some View {
        HStack(spacing: 6) {
            Image(systemName: "person.fill")
                .font(.system(size: 11))
                .foregroundColor(Theme.Colors.textTertiary)
            Text("Payé par \(expense.paidByName ?? "Inconnu")")
                .font(Theme.PinterestTypography.caption(.medium))
                .foregroundColor(Theme.Colors.textSecondary)
        }
    }

    private var progressSection: some View {
        let paidCount = expense.splits.filter { $0.isPaid }.count
        let totalCount = expense.splits.count
        let progressPercent = Double(paidCount) / Double(totalCount)

        return VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("\(paidCount)/\(totalCount) remboursés")
                    .font(Theme.PinterestTypography.caption(.semibold))
                    .foregroundColor(Theme.Colors.textSecondary)

                Spacer()

                Text(String(format: "%.0f%%", progressPercent * 100))
                    .font(Theme.PinterestTypography.caption(.bold))
                    .foregroundColor(paidCount == totalCount ? Color(hex: "10B981") : Color(hex: "F59E0B"))
            }

            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.small)
                        .fill(Color.white.opacity(0.5))
                        .frame(height: 8)
                        .overlay(
                            RoundedRectangle(cornerRadius: Theme.PinterestRadius.small)
                                .stroke(Color.white.opacity(0.6), lineWidth: 1)
                        )

                    if progressPercent > 0 {
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.small)
                            .fill(
                                paidCount == totalCount
                                    ? LinearGradient(
                                        colors: [Color(hex: "10B981"), Color(hex: "059669")],
                                        startPoint: .leading,
                                        endPoint: .trailing
                                    )
                                    : role.gradient
                            )
                            .frame(width: geometry.size.width * progressPercent, height: 8)
                            .pinterestShadow(
                                Theme.PinterestShadows.colored(
                                    paidCount == totalCount ? Color(hex: "10B981") : role.primaryColor,
                                    intensity: 0.25
                                )
                            )
                    }
                }
            }
            .frame(height: 8)
        }
    }

    private var actionsSection: some View {
        HStack(spacing: 12) {
            Button(action: {
                withAnimation(Theme.PinterestAnimations.smoothSpring) {
                    showDetails.toggle()
                    Haptic.light()
                }
            }) {
                HStack(spacing: 4) {
                    Image(systemName: showDetails ? "chevron.up" : "chevron.down")
                    Text(showDetails ? "Masquer" : "Détails")
                }
                .font(Theme.PinterestTypography.caption(.semibold))
                .foregroundColor(role.primaryColor)
            }

            Spacer()

            if expense.hasReceipt {
                HStack(spacing: 4) {
                    Image(systemName: "paperclip")
                        .font(.system(size: 12))
                    Text("Reçu")
                        .font(Theme.PinterestTypography.captionSmall(.medium))
                }
                .foregroundColor(Theme.Colors.textSecondary)
            }
        }
    }

    @ViewBuilder
    private var detailsSection: some View {
        VStack(alignment: .leading, spacing: Theme.PinterestSpacing.sm) {
            Rectangle()
                .fill(Color.white.opacity(0.5))
                .frame(height: 1)
                .padding(.vertical, 4)

            Text("Répartition")
                .font(Theme.PinterestTypography.bodySmall(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)

            ForEach(expense.splits) { split in
                HStack(spacing: 12) {
                    ZStack {
                        if split.isPaid {
                            Circle()
                                .fill(Color(hex: "10B981"))
                                .frame(width: 24, height: 24)
                                .pinterestShadow(Theme.PinterestShadows.colored(Color(hex: "10B981"), intensity: 0.3))

                            Image(systemName: "checkmark")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(.white)
                        } else {
                            Circle()
                                .stroke(Theme.Colors.textTertiary, lineWidth: 2)
                                .frame(width: 24, height: 24)
                        }
                    }

                    Text(split.userName ?? "Inconnu")
                        .font(Theme.PinterestTypography.bodySmall(.regular))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Spacer()

                    Text(String(format: "%.2f€", split.amount))
                        .font(Theme.PinterestTypography.bodySmall(.bold))
                        .foregroundColor(split.isPaid ? Theme.Colors.textSecondary : role.primaryColor)
                }
                .padding(.vertical, 6)
            }
        }
    }
}

// MARK: - Floating Header

struct FloatingHeaderView: View {
    let role: Theme.UserRole
    let showAddButton: Bool
    let onProfileTap: () -> Void
    let onAlertTap: () -> Void
    let onMenuTap: () -> Void
    let onAddTap: (() -> Void)?

    @State private var hasNotifications = false

    var body: some View {
        HStack(spacing: 16) {
            // Profile
            Button(action: {
                Haptic.light()
                onProfileTap()
            }) {
                Circle()
                    .fill(role.gradient)
                    .frame(width: 40, height: 40)
                    .overlay(
                        Image(systemName: "person.fill")
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(.white)
                    )
                    .pinterestShadow(Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.3))
            }

            Spacer()

            // Alert
            Button(action: {
                Haptic.light()
                onAlertTap()
            }) {
                ZStack(alignment: .topTrailing) {
                    Circle()
                        .fill(Color.white.opacity(0.5))
                        .frame(width: 40, height: 40)
                        .overlay(
                            Circle()
                                .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                        )
                        .overlay(
                            Image(systemName: "bell.fill")
                                .font(.system(size: 18, weight: .semibold))
                                .foregroundColor(hasNotifications ? role.primaryColor : Theme.Colors.textSecondary)
                        )
                        .pinterestShadow(Theme.PinterestShadows.subtle)

                    if hasNotifications {
                        Circle()
                            .fill(Color(hex: "EF4444"))
                            .frame(width: 12, height: 12)
                            .overlay(
                                Circle()
                                    .stroke(Color.white, lineWidth: 2)
                            )
                            .offset(x: 2, y: -2)
                    }
                }
            }

            // Menu
            Button(action: {
                Haptic.light()
                onMenuTap()
            }) {
                Circle()
                    .fill(Color.white.opacity(0.5))
                    .frame(width: 40, height: 40)
                    .overlay(
                        Circle()
                            .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                    )
                    .overlay(
                        Image(systemName: "line.3.horizontal")
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(Theme.Colors.textPrimary)
                    )
                    .pinterestShadow(Theme.PinterestShadows.subtle)
            }

            // Add button
            if showAddButton, let addAction = onAddTap {
                Button(action: {
                    Haptic.light()
                    addAction()
                }) {
                    Circle()
                        .fill(role.gradient)
                        .frame(width: 44, height: 44)
                        .overlay(
                            Image(systemName: "plus")
                                .font(.system(size: 20, weight: .semibold))
                                .foregroundColor(.white)
                        )
                        .pinterestShadow(Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.35))
                }
            }
        }
        .padding(.horizontal, Theme.PinterestSpacing.lg)
        .padding(.vertical, 12)
        .background(
            Rectangle()
                .fill(Color.white.opacity(0.5))
                .background(.ultraThinMaterial)
                .ignoresSafeArea()
        )
        .overlay(
            Rectangle()
                .fill(Color.white.opacity(0.3))
                .frame(height: 0.5),
            alignment: .bottom
        )
    }
}

// MARK: - Preview

struct ExpensesView_Previews: PreviewProvider {
    static var previews: some View {
        ExpensesView()
    }
}
