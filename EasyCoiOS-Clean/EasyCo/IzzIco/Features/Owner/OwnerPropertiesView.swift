import SwiftUI

// MARK: - Owner Properties View (Modern Pinterest Style)

struct OwnerPropertiesView: View {
    @State private var properties: [Property] = []
    @State private var isLoading = false
    @State private var showAddProperty = false
    @State private var searchText = ""
    @State private var selectedStatus: PropertyStatus? = nil
    @State private var sortOption: OwnerPropertySortOption = .newest

    // Sheet states
    @State private var showProfileSheet = false
    @State private var showAlertsSheet = false
    @State private var showMenuSheet = false

    private let role: Theme.UserRole = .owner

    var body: some View {
        ZStack(alignment: .top) {
            // Pinterest Background
            PinterestBackground(role: role, intensity: 0.18)
                .ignoresSafeArea()

            Group {
                if isLoading {
                    LoadingView(message: "Chargement de vos propriétés...")
                } else if properties.isEmpty {
                    emptyStateView
                } else {
                    propertiesList
                }
            }

            // Floating Header
            FloatingHeaderView(
                role: role,
                showAddButton: true,
                onProfileTap: { showProfileSheet = true },
                onAlertTap: { showAlertsSheet = true },
                onMenuTap: { showMenuSheet = true },
                onAddTap: {
                    showAddProperty = true
                }
            )
        }
        .sheet(isPresented: $showAddProperty) {
            CreatePropertyView()
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
            await loadProperties()
        }
    }

    // MARK: - Properties List

    private var propertiesList: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 12) {
                // Spacer for floating header
                Color.clear.frame(height: 70)

                // Search Bar
                searchBar

                // Filters Row
                filtersRow

                // Properties Grid
                LazyVStack(spacing: 12) {
                    ForEach(filteredAndSortedProperties) { property in
                        NavigationLink(destination: OwnerPropertyDetailView(property: property)) {
                            ModernOwnerPropertyCard(property: property, role: role)
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 12)
            .padding(.bottom, 32)
        }
    }

    // MARK: - Search Bar

    private var searchBar: some View {
        HStack(spacing: 12) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(Color(hex: "9CA3AF"))

            TextField("Rechercher une propriété...", text: $searchText)
                .font(Theme.PinterestTypography.bodyRegular(.regular))
                .foregroundColor(Theme.Colors.textPrimary)

            if !searchText.isEmpty {
                Button(action: {
                    searchText = ""
                    Haptic.selection()
                }) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 16))
                        .foregroundColor(Color(hex: "9CA3AF"))
                }
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.white.opacity(0.9))
                .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 2)
        )
    }

    // MARK: - Filters Row

    private var filtersRow: some View {
        HStack(spacing: 8) {
            // Status Filter
            Menu {
                Button("Tous les statuts") {
                    selectedStatus = nil
                    Haptic.selection()
                }
                ForEach(PropertyStatus.allCases, id: \.self) { status in
                    Button(status.displayName) {
                        selectedStatus = status
                        Haptic.selection()
                    }
                }
            } label: {
                HStack(spacing: 6) {
                    Image(systemName: "line.3.horizontal.decrease.circle")
                        .font(.system(size: 14, weight: .medium))
                    Text(selectedStatus?.displayName ?? "Tous")
                        .font(Theme.PinterestTypography.bodySmall(.semibold))
                    Image(systemName: "chevron.down")
                        .font(.system(size: 10, weight: .semibold))
                }
                .foregroundColor(Theme.Colors.Owner.primary)
                .padding(.horizontal, 8)
                .padding(.vertical, 8)
                .background(
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Theme.Colors.Owner.primary.opacity(0.1))
                )
            }

            // Sort Menu
            Menu {
                ForEach(OwnerPropertySortOption.allCases, id: \.self) { option in
                    Button(action: {
                        sortOption = option
                        Haptic.selection()
                    }) {
                        HStack {
                            Text(option.displayName)
                            if sortOption == option {
                                Image(systemName: "checkmark")
                            }
                        }
                    }
                }
            } label: {
                HStack(spacing: 6) {
                    Image(systemName: "arrow.up.arrow.down")
                        .font(.system(size: 14, weight: .medium))
                    Text(sortOption.displayName)
                        .font(Theme.PinterestTypography.bodySmall(.semibold))
                    Image(systemName: "chevron.down")
                        .font(.system(size: 10, weight: .semibold))
                }
                .foregroundColor(Theme.Colors.Owner.primary)
                .padding(.horizontal, 8)
                .padding(.vertical, 8)
                .background(
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Theme.Colors.Owner.primary.opacity(0.1))
                )
            }

            Spacer()

            // Results count
            Text("\(filteredAndSortedProperties.count)")
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(Theme.Colors.textSecondary)
        }
    }

    // MARK: - Computed Properties

    private var filteredAndSortedProperties: [Property] {
        var result = properties

        // Filter by search text
        if !searchText.isEmpty {
            result = result.filter { property in
                property.title.localizedCaseInsensitiveContains(searchText) ||
                property.address.localizedCaseInsensitiveContains(searchText) ||
                property.city.localizedCaseInsensitiveContains(searchText)
            }
        }

        // Filter by status
        if let status = selectedStatus {
            result = result.filter { $0.status == status }
        }

        // Sort
        switch sortOption {
        case .newest:
            result.sort { $0.createdAt > $1.createdAt }
        case .oldest:
            result.sort { $0.createdAt < $1.createdAt }
        case .priceHighToLow:
            result.sort { $0.monthlyRent > $1.monthlyRent }
        case .priceLowToHigh:
            result.sort { $0.monthlyRent < $1.monthlyRent }
        case .mostViews:
            result.sort { $0.viewsCount > $1.viewsCount }
        case .mostApplications:
            result.sort { $0.applicationsCount > $1.applicationsCount }
        }

        return result
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 24) {
            Spacer()

            // Icon
            ZStack {
                Circle()
                    .fill(Theme.Colors.Owner.primary.opacity(0.1))
                    .frame(width: 120, height: 120)

                Image(systemName: "building.2.fill")
                    .font(.system(size: 48, weight: .medium))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Theme.Colors.Owner.primary, Theme.Colors.Owner._400],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            }

            // Text
            VStack(spacing: 8) {
                Text("Aucune propriété")
                    .font(Theme.PinterestTypography.heroMedium(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Commencez à ajouter vos propriétés pour recevoir des candidatures")
                    .font(Theme.PinterestTypography.bodyRegular(.medium))
                    .foregroundColor(Theme.Colors.textSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 24)
            }

            // CTA Button
            PinterestPrimaryButton(
                "Ajouter une propriété",
                role: role,
                icon: "plus.circle.fill"
            ) {
                showAddProperty = true
            }
            .padding(.horizontal, 24)

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Data Methods

    private func loadProperties() async {
        isLoading = true

        // Demo mode
        if AppConfig.FeatureFlags.demoMode {
            try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
            properties = Property.mockProperties
        }

        isLoading = false
    }
}

// MARK: - Modern Owner Property Card

struct ModernOwnerPropertyCard: View {
    let property: Property
    let role: Theme.UserRole

    var body: some View {
        PinterestCard(role: role) {
            VStack(alignment: .leading, spacing: 0) {
                // Image
                if let imageURL = property.images.first {
                    AsyncImage(url: URL(string: imageURL)) { phase in
                        switch phase {
                        case .success(let image):
                            image
                                .resizable()
                                .scaledToFill()
                        case .failure(_), .empty:
                            Rectangle()
                                .fill(Color(hex: "F3F4F6"))
                                .overlay(
                                    Image(systemName: "photo")
                                        .font(.system(size: 40))
                                        .foregroundColor(Color(hex: "9CA3AF"))
                                )
                        @unknown default:
                            EmptyView()
                        }
                    }
                    .frame(height: 180)
                    .clipped()
                    .cornerRadius(12, corners: [.topLeft, .topRight])
                }

                // Content
                VStack(alignment: .leading, spacing: 8) {
                    // Title
                    Text(property.title)
                        .font(Theme.PinterestTypography.bodyRegular(.bold))
                        .foregroundColor(Theme.Colors.textPrimary)
                        .lineLimit(2)

                    // Location
                    HStack(spacing: 4) {
                        Image(systemName: "mappin.circle.fill")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "9CA3AF"))

                        Text("\(property.city)")
                            .font(Theme.PinterestTypography.bodySmall(.medium))
                            .foregroundColor(Theme.Colors.textSecondary)
                    }

                    // Stats Row
                    HStack(spacing: 8) {
                        PropertyStatBadge(
                            icon: "eye.fill",
                            value: "\(property.viewsCount)",
                            color: Theme.Colors.Owner.primary
                        )
                        PropertyStatBadge(
                            icon: "doc.text.fill",
                            value: "\(property.applicationsCount)",
                            color: Color(hex: "10B981")
                        )
                        PropertyStatBadge(
                            icon: "heart.fill",
                            value: "\(property.favoritesCount)",
                            color: Color(hex: "EF4444")
                        )
                    }

                    Divider()
                        .padding(.vertical, 4)

                    // Price & Status
                    HStack {
                        Text("€\(property.price)")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(Theme.Colors.Owner.primary)

                        Text("/mois")
                            .font(Theme.PinterestTypography.bodySmall(.medium))
                            .foregroundColor(Theme.Colors.textSecondary)

                        Spacer()

                        ModernStatusBadge(status: property.status)
                    }
                }
                .padding(12)
            }
        }
    }
}

// MARK: - Property Stat Badge

private struct PropertyStatBadge: View {
    let icon: String
    let value: String
    let color: Color

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: icon)
                .font(.system(size: 11, weight: .semibold))
                .foregroundColor(color)
            Text(value)
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(Theme.Colors.textSecondary)
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(color.opacity(0.1))
        .cornerRadius(6)
    }
}

// MARK: - Modern Status Badge

struct ModernStatusBadge: View {
    let status: PropertyStatus

    var body: some View {
        Text(status.displayName)
            .font(.system(size: 11, weight: .bold))
            .foregroundColor(statusColor)
            .padding(.horizontal, 10)
            .padding(.vertical, 5)
            .background(statusColor.opacity(0.15))
            .cornerRadius(999)
    }

    private var statusColor: Color {
        switch status {
        case .published: return Color(hex: "10B981")
        case .draft: return Color(hex: "6B7280")
        case .archived: return Color(hex: "EF4444")
        case .rented: return Color(hex: "3B82F6")
        case .underReview: return Color(hex: "FBBF24")
        }
    }
}

// MARK: - Owner Property Sort Option

enum OwnerPropertySortOption: String, CaseIterable {
    case newest = "Plus récents"
    case oldest = "Plus anciens"
    case priceHighToLow = "Prix ↓"
    case priceLowToHigh = "Prix ↑"
    case mostViews = "Plus vus"
    case mostApplications = "Candidatures"

    var displayName: String {
        self.rawValue
    }
}

// MARK: - Owner Property Detail View

struct OwnerPropertyDetailView: View {
    let property: Property
    private let role: Theme.UserRole = .owner

    var body: some View {
        ZStack {
            // Pinterest Background
            PinterestBackground(role: role, intensity: 0.18)
                .ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 20) {
                    // Hero Image
                    if let imageURL = property.images.first {
                        AsyncImage(url: URL(string: imageURL)) { phase in
                            switch phase {
                            case .success(let image):
                                image
                                    .resizable()
                                    .scaledToFill()
                            case .failure(_), .empty:
                                Rectangle()
                                    .fill(Color(hex: "F3F4F6"))
                            @unknown default:
                                EmptyView()
                            }
                        }
                        .frame(height: 250)
                        .clipped()
                        .cornerRadius(16)
                    }

                    // Title & Price Card
                    PinterestCard(role: role) {
                        VStack(alignment: .leading, spacing: 12) {
                            HStack(alignment: .top) {
                                VStack(alignment: .leading, spacing: 6) {
                                    Text(property.title)
                                        .font(Theme.PinterestTypography.heroSmall(.bold))
                                        .foregroundColor(Theme.Colors.textPrimary)

                                    Text("\(property.address), \(property.city)")
                                        .font(Theme.PinterestTypography.bodySmall(.medium))
                                        .foregroundColor(Theme.Colors.textSecondary)
                                }

                                Spacer()

                                VStack(alignment: .trailing, spacing: 4) {
                                    Text("€\(property.price)")
                                        .font(.system(size: 26, weight: .bold))
                                        .foregroundColor(Theme.Colors.Owner.primary)

                                    Text("/mois")
                                        .font(.system(size: 12, weight: .medium))
                                        .foregroundColor(Theme.Colors.textSecondary)
                                }
                            }
                        }
                    }

                    // Quick Actions
                    VStack(spacing: 8) {
                        PinterestSecondaryButton("Voir les statistiques", role: role, icon: "chart.bar.fill") {
                            // Navigate to stats
                        }

                        PinterestSecondaryButton("Modifier l'annonce", role: role, icon: "square.and.pencil") {
                            // Edit property
                        }

                        PinterestSecondaryButton("Archiver", role: role, icon: "archivebox") {
                            // Archive property
                        }
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 12)
                .padding(.bottom, 32)
            }
        }
        .navigationTitle("Détails")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Preview

struct OwnerPropertiesView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            OwnerPropertiesView()
        }
    }
}
