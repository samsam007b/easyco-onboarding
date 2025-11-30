import SwiftUI

// MARK: - Owner Properties View (Web App Design)

struct OwnerPropertiesView: View {
    @State private var properties: [Property] = []
    @State private var isLoading = false
    @State private var showAddProperty = false
    @State private var searchText = ""
    @State private var selectedStatus: PropertyStatus?  = nil
    @State private var sortOption: OwnerPropertySortOption = .newest

    var body: some View {
        NavigationStack {
            Group {
                if isLoading {
                    LoadingView(message: "Chargement de vos propriétés...")
                } else if properties.isEmpty {
                    emptyStateView
                } else {
                    propertiesList
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Mes Propriétés")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showAddProperty = true }) {
                        Image(systemName: "plus.circle.fill")
                            .font(.system(size: 24))
                            .foregroundColor(Color(hex: "6E56CF"))
                    }
                }
            }
            .sheet(isPresented: $showAddProperty) {
                CreatePropertyView()
            }
        }
        .task {
            await loadProperties()
        }
    }

    // MARK: - Properties List

    private var propertiesList: some View {
        VStack(spacing: 0) {
            // Search and Filters
            filtersSection

            // Properties List
            ScrollView {
                LazyVStack(spacing: 16) {
                    ForEach(filteredAndSortedProperties) { property in
                        NavigationLink(destination: OwnerPropertyDetailView(property: property)) {
                            OwnerPropertyCard(property: property)
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
                .padding(16)
            }
        }
    }

    // MARK: - Filters Section

    private var filtersSection: some View {
        VStack(spacing: 12) {
            // Search Bar
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(Color(hex: "9CA3AF"))
                TextField("Rechercher une propriété...", text: $searchText)
                    .font(.system(size: 16))

                if !searchText.isEmpty {
                    Button(action: { searchText = "" }) {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(Color(hex: "9CA3AF"))
                    }
                }
            }
            .padding(12)
            .background(Color.white)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
            )

            // Status and Sort Filters
            HStack(spacing: 12) {
                // Status Filter
                Menu {
                    Button("Tous les statuts") {
                        selectedStatus = nil
                    }
                    ForEach(PropertyStatus.allCases, id: \.self) { status in
                        Button(status.displayName) {
                            selectedStatus = status
                        }
                    }
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "line.3.horizontal.decrease.circle")
                            .font(.system(size: 14))
                        Text(selectedStatus?.displayName ?? "Tous")
                            .font(.system(size: 14, weight: .medium))
                        Image(systemName: "chevron.down")
                            .font(.system(size: 10))
                    }
                    .foregroundColor(Color(hex: "6E56CF"))
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(Color(hex: "F3F0FF"))
                    .cornerRadius(8)
                }

                // Sort Menu
                Menu {
                    ForEach(OwnerPropertySortOption.allCases, id: \.self) { option in
                        Button(action: { sortOption = option }) {
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
                            .font(.system(size: 14))
                        Text(sortOption.displayName)
                            .font(.system(size: 14, weight: .medium))
                        Image(systemName: "chevron.down")
                            .font(.system(size: 10))
                    }
                    .foregroundColor(Color(hex: "6E56CF"))
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(Color(hex: "F3F0FF"))
                    .cornerRadius(8)
                }

                Spacer()

                // Results count
                Text("\(filteredAndSortedProperties.count) propriété(s)")
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "6B7280"))
            }
        }
        .padding(16)
        .background(Color(hex: "F9FAFB"))
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
                    .fill(Color(hex: "F3F0FF"))
                    .frame(width: 120, height: 120)

                Image(systemName: "building.2")
                    .font(.system(size: 48))
                    .foregroundColor(Color(hex: "6E56CF"))
            }

            // Text
            VStack(spacing: 12) {
                Text("Aucune propriété")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Commencez à ajouter vos propriétés pour recevoir des candidatures")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }

            // CTA Button
            Button(action: { showAddProperty = true }) {
                HStack(spacing: 8) {
                    Image(systemName: "plus")
                        .font(.system(size: 16, weight: .semibold))
                    Text("Ajouter une propriété")
                        .font(.system(size: 16, weight: .semibold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: 280)
                .padding(.vertical, 16)
                .background(
                    LinearGradient(
                        colors: [Color(hex: "6E56CF"), Color(hex: "8B5CF6")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(999)
                .shadow(color: Color(hex: "6E56CF").opacity(0.3), radius: 8, x: 0, y: 4)
            }
            .padding(.top, 8)

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(hex: "F9FAFB"))
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

// MARK: - Owner Property Card

struct OwnerPropertyCard: View {
    let property: Property

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Image
            AsyncImage(url: URL(string: property.images.first ?? "")) { phase in
                switch phase {
                case .success(let image):
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(height: 200)
                        .clipped()
                case .failure(_), .empty:
                    Rectangle()
                        .fill(Color(hex: "E5E7EB"))
                        .frame(height: 200)
                @unknown default:
                    EmptyView()
                }
            }
            .cornerRadius(16, corners: [.topLeft, .topRight])

            // Content
            VStack(alignment: .leading, spacing: 12) {
                Text(property.title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                HStack(spacing: 16) {
                    StatBadge(icon: "eye.fill", value: "\(property.viewsCount)", color: Color(hex: "6E56CF"))
                    StatBadge(icon: "doc.text.fill", value: "\(property.applicationsCount)", color: Color(hex: "10B981"))
                    StatBadge(icon: "heart.fill", value: "\(property.favoritesCount)", color: Color(hex: "EF4444"))
                }

                Divider()

                HStack {
                    Text("€\(Int(property.monthlyRent))/mois")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(Color(hex: "6E56CF"))

                    Spacer()

                    StatusBadge(status: property.status)
                }
            }
            .padding(16)
        }
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 2)
    }
}

struct StatBadge: View {
    let icon: String
    let value: String
    let color: Color

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: icon)
                .font(.system(size: 12))
                .foregroundColor(color)
            Text(value)
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(Color(hex: "374151"))
        }
    }
}

struct StatusBadge: View {
    let status: PropertyStatus

    var body: some View {
        Text(status.displayName)
            .font(.system(size: 12, weight: .medium))
            .foregroundColor(statusColor)
            .padding(.horizontal, 10)
            .padding(.vertical, 5)
            .background(statusColor.opacity(0.1))
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
    case priceHighToLow = "Prix décroissant"
    case priceLowToHigh = "Prix croissant"
    case mostViews = "Plus vus"
    case mostApplications = "Plus de candidatures"

    var displayName: String {
        self.rawValue
    }
}

// MARK: - Owner Property Detail View

struct OwnerPropertyDetailView: View {
    let property: Property

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Photo principale
                AsyncImage(url: URL(string: property.images.first ?? "")) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(height: 250)
                            .clipped()
                    case .failure(_), .empty:
                        Rectangle()
                            .fill(Color(hex: "E5E7EB"))
                            .frame(height: 250)
                    @unknown default:
                        EmptyView()
                    }
                }

                VStack(alignment: .leading, spacing: 16) {
                    // Titre et prix
                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(property.title)
                                .font(.system(size: 24, weight: .bold))
                                .foregroundColor(Color(hex: "111827"))

                            Text("\(property.address), \(property.city)")
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "6B7280"))
                        }

                        Spacer()

                        VStack(alignment: .trailing, spacing: 4) {
                            Text("€\(Int(property.monthlyRent))")
                                .font(.system(size: 26, weight: .bold))
                                .foregroundColor(Color(hex: "6E56CF"))

                            Text("par mois")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "6B7280"))
                        }
                    }

                    Divider()

                    // Actions rapides
                    VStack(spacing: 12) {
                        NavigationLink(destination: PropertyStatsView(property: property)) {
                            HStack {
                                Image(systemName: "chart.bar.fill")
                                    .foregroundColor(Color(hex: "6E56CF"))
                                Text("Voir les statistiques")
                                    .font(.system(size: 16, weight: .medium))
                                Spacer()
                                Image(systemName: "chevron.right")
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "9CA3AF"))
                            }
                            .padding(16)
                            .background(Color.white)
                            .cornerRadius(12)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                            )
                        }
                        .buttonStyle(PlainButtonStyle())

                        Button(action: {}) {
                            HStack {
                                Image(systemName: "square.and.pencil")
                                    .foregroundColor(Color(hex: "6E56CF"))
                                Text("Modifier l'annonce")
                                    .font(.system(size: 16, weight: .medium))
                                Spacer()
                                Image(systemName: "chevron.right")
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "9CA3AF"))
                            }
                            .padding(16)
                            .background(Color.white)
                            .cornerRadius(12)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                            )
                        }
                        .buttonStyle(PlainButtonStyle())

                        Button(action: {}) {
                            HStack {
                                Image(systemName: "archivebox")
                                    .foregroundColor(Color(hex: "EF4444"))
                                Text("Archiver")
                                    .font(.system(size: 16, weight: .medium))
                                Spacer()
                                Image(systemName: "chevron.right")
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "9CA3AF"))
                            }
                            .padding(16)
                            .background(Color.white)
                            .cornerRadius(12)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                            )
                        }
                        .buttonStyle(PlainButtonStyle())
                    }

                    Text("Vue détaillée complète à implémenter")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "9CA3AF"))
                        .padding(.top, 8)
                }
                .padding()
            }
        }
        .background(Color(hex: "F9FAFB"))
        .navigationTitle("Détails")
        .navigationBarTitleDisplayMode(.inline)
    }
}
