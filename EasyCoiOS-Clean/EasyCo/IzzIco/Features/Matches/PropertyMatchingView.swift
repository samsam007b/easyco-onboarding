import SwiftUI

// MARK: - Property Matching View (Algorithmic Recommendations)

struct PropertyMatchingView: View {
    @StateObject private var viewModel = PropertyMatchingViewModel()
    @State private var selectedSortOption: MatchSortOption = .matchScore
    @State private var showFilters = false
    @State private var showPropertyDetail: Property?

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Match summary header
                if !viewModel.isLoading {
                    matchSummaryHeader
                }

                // Sort options
                sortOptionsBar

                // Content
                if viewModel.isLoading {
                    loadingState
                } else if viewModel.matchedProperties.isEmpty {
                    emptyState
                } else {
                    matchedPropertiesList
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationTitle("Mes matchs")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showFilters = true }) {
                        Image(systemName: "slider.horizontal.3")
                            .font(.system(size: 18))
                            .foregroundColor(Color(hex: "FFA040"))
                    }
                }
            }
            .sheet(isPresented: $showFilters) {
                MatchingPreferencesSheet(viewModel: viewModel)
            }
            .sheet(item: $showPropertyDetail) { property in
                PropertyDetailSheetView(property: property)
            }
        }
        .task {
            await viewModel.loadMatches()
        }
    }

    // MARK: - Match Summary Header

    private var matchSummaryHeader: some View {
        VStack(spacing: 12) {
            HStack(spacing: 16) {
                // Match score circle
                ZStack {
                    Circle()
                        .stroke(Color(hex: "E5E7EB"), lineWidth: 8)
                        .frame(width: 80, height: 80)

                    Circle()
                        .trim(from: 0, to: CGFloat(viewModel.averageMatchScore) / 100)
                        .stroke(
                            LinearGradient(
                                colors: [Color(hex: "FFA040"), Color(hex: "F59E0B")],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ),
                            style: StrokeStyle(lineWidth: 8, lineCap: .round)
                        )
                        .frame(width: 80, height: 80)
                        .rotationEffect(.degrees(-90))

                    VStack(spacing: 0) {
                        Text("\(viewModel.averageMatchScore)%")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(Color(hex: "FFA040"))

                        Text("moyen")
                            .font(.system(size: 10))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }

                VStack(alignment: .leading, spacing: 8) {
                    Text("\(viewModel.matchedProperties.count) propriétés")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "111827"))

                    Text("correspondent à vos critères")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))

                    // Quick stats
                    HStack(spacing: 12) {
                        MatchQuickStat(
                            icon: "star.fill",
                            value: "\(viewModel.excellentMatches)",
                            label: "90%+",
                            color: Color(hex: "10B981")
                        )

                        MatchQuickStat(
                            icon: "hand.thumbsup.fill",
                            value: "\(viewModel.goodMatches)",
                            label: "70-89%",
                            color: Color(hex: "FFA040")
                        )

                        MatchQuickStat(
                            icon: "questionmark.circle.fill",
                            value: "\(viewModel.fairMatches)",
                            label: "<70%",
                            color: Color(hex: "6B7280")
                        )
                    }
                }

                Spacer()
            }
            .padding(16)
            .background(Color.white)

            // Criteria summary
            criteriaRibbon
        }
    }

    private var criteriaRibbon: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                CriteriaPill(icon: "eurosign.circle", text: "€\(viewModel.criteria.minBudget)-\(viewModel.criteria.maxBudget)")
                CriteriaPill(icon: "location.fill", text: viewModel.criteria.locations.joined(separator: ", "))
                CriteriaPill(icon: "bed.double.fill", text: "\(viewModel.criteria.minRooms)+ ch.")

                if viewModel.criteria.furnished {
                    CriteriaPill(icon: "sofa.fill", text: "Meublé")
                }

                Button(action: { showFilters = true }) {
                    HStack(spacing: 4) {
                        Image(systemName: "pencil")
                            .font(.system(size: 12))
                        Text("Modifier")
                            .font(.system(size: 12, weight: .medium))
                    }
                    .foregroundColor(Color(hex: "FFA040"))
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(Color(hex: "FFA040").opacity(0.1))
                    .cornerRadius(999)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
        }
        .background(Color(hex: "F9FAFB"))
    }

    // MARK: - Sort Options Bar

    private var sortOptionsBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(MatchSortOption.allCases, id: \.self) { option in
                    Button(action: {
                        withAnimation {
                            selectedSortOption = option
                            viewModel.sortMatches(by: option)
                        }
                    }) {
                        HStack(spacing: 4) {
                            Image(systemName: option.icon)
                                .font(.system(size: 12))

                            Text(option.title)
                                .font(.system(size: 13, weight: .medium))
                        }
                        .foregroundColor(selectedSortOption == option ? .white : Color(hex: "6B7280"))
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(
                            selectedSortOption == option
                                ? Color(hex: "FFA040")
                                : Color.white
                        )
                        .cornerRadius(999)
                        .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
        }
        .background(Color.white)
    }

    // MARK: - Matched Properties List

    private var matchedPropertiesList: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(viewModel.matchedProperties) { match in
                    MatchedPropertyCard(
                        match: match,
                        onTap: {
                            showPropertyDetail = match.property
                        },
                        onLike: {
                            viewModel.likeProperty(match)
                        },
                        onDismiss: {
                            viewModel.dismissProperty(match)
                        }
                    )
                }
            }
            .padding(16)
        }
    }

    // MARK: - Loading State

    private var loadingState: some View {
        VStack(spacing: 20) {
            Spacer()

            ProgressView()
                .scaleEffect(1.5)

            Text("Analyse de vos critères...")
                .font(.system(size: 16))
                .foregroundColor(Color(hex: "6B7280"))

            Spacer()
        }
    }

    // MARK: - Empty State

    private var emptyState: some View {
        VStack(spacing: 24) {
            Spacer()

            ZStack {
                Circle()
                    .fill(Color(hex: "FFA040").opacity(0.1))
                    .frame(width: 120, height: 120)

                Image(systemName: "house.fill")
                    .font(.system(size: 50))
                    .foregroundColor(Color(hex: "FFA040"))
            }

            VStack(spacing: 8) {
                Text("Aucun match trouvé")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Essayez d'élargir vos critères de recherche pour voir plus de propriétés")
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }

            Button(action: { showFilters = true }) {
                HStack(spacing: 8) {
                    Image(systemName: "slider.horizontal.3")
                    Text("Modifier mes critères")
                }
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(.white)
                .padding(.horizontal, 24)
                .padding(.vertical, 14)
                .background(Color(hex: "FFA040"))
                .cornerRadius(12)
            }

            Spacer()
        }
    }
}

// MARK: - Match Quick Stat

struct MatchQuickStat: View {
    let icon: String
    let value: String
    let label: String
    let color: Color

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: icon)
                .font(.system(size: 12))
                .foregroundColor(color)

            Text(value)
                .font(.system(size: 13, weight: .bold))
                .foregroundColor(color)

            Text(label)
                .font(.system(size: 11))
                .foregroundColor(Color(hex: "9CA3AF"))
        }
    }
}

// MARK: - Criteria Pill

struct CriteriaPill: View {
    let icon: String
    let text: String

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: icon)
                .font(.system(size: 11))

            Text(text)
                .font(.system(size: 12, weight: .medium))
                .lineLimit(1)
        }
        .foregroundColor(Color(hex: "374151"))
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(Color.white)
        .cornerRadius(999)
        .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)
    }
}

// MARK: - Matched Property Card

struct MatchedPropertyCard: View {
    let match: PropertyMatch
    let onTap: () -> Void
    let onLike: () -> Void
    let onDismiss: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 0) {
                // Image with match badge
                ZStack(alignment: .topLeading) {
                    AsyncImage(url: URL(string: match.property.images.first ?? "")) { phase in
                        switch phase {
                        case .success(let image):
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(height: 180)
                                .clipped()
                        case .failure(_), .empty:
                            Rectangle()
                                .fill(Color(hex: "E5E7EB"))
                                .frame(height: 180)
                                .overlay(
                                    Image(systemName: "photo")
                                        .font(.system(size: 40))
                                        .foregroundColor(Color(hex: "9CA3AF"))
                                )
                        @unknown default:
                            EmptyView()
                        }
                    }

                    // Match score badge
                    MatchScoreBadge(score: match.matchScore)
                        .padding(12)
                }

                // Content
                VStack(alignment: .leading, spacing: 10) {
                    // Title and price
                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(match.property.title)
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(Color(hex: "111827"))
                                .lineLimit(1)

                            HStack(spacing: 4) {
                                Image(systemName: "location.fill")
                                    .font(.system(size: 11))
                                Text(match.property.city)
                                    .font(.system(size: 13))
                            }
                            .foregroundColor(Color(hex: "6B7280"))
                        }

                        Spacer()

                        VStack(alignment: .trailing, spacing: 2) {
                            Text("€\(Int(match.property.monthlyRent))")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(Color(hex: "FFA040"))

                            Text("/mois")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "9CA3AF"))
                        }
                    }

                    // Property specs
                    HStack(spacing: 16) {
                        PropertySpec(icon: "ruler", value: "\(Int(match.property.surfaceArea ?? 0)) m²")
                        PropertySpec(icon: "bed.double.fill", value: "\(match.property.bedrooms) ch.")
                        PropertySpec(icon: "drop.fill", value: "\(match.property.bathrooms) sdb")

                        if match.property.furnished {
                            PropertySpec(icon: "sofa.fill", value: "Meublé")
                        }
                    }

                    // Match breakdown
                    matchBreakdown

                    // Action buttons
                    HStack(spacing: 12) {
                        Button(action: onDismiss) {
                            HStack(spacing: 6) {
                                Image(systemName: "xmark")
                                Text("Passer")
                            }
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(Color(hex: "6B7280"))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 10)
                            .background(Color(hex: "F3F4F6"))
                            .cornerRadius(8)
                        }

                        Button(action: onLike) {
                            HStack(spacing: 6) {
                                Image(systemName: match.isLiked ? "heart.fill" : "heart")
                                Text(match.isLiked ? "Favori" : "J'aime")
                            }
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 10)
                            .background(match.isLiked ? Color(hex: "EF4444") : Color(hex: "FFA040"))
                            .cornerRadius(8)
                        }
                    }
                }
                .padding(14)
            }
            .background(Color.white)
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.06), radius: 10, x: 0, y: 4)
        }
        .buttonStyle(PlainButtonStyle())
    }

    private var matchBreakdown: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("Correspondance")
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(Color(hex: "6B7280"))

            HStack(spacing: 8) {
                ForEach(match.matchDetails.prefix(4), id: \.criterion) { detail in
                    MatchDetailPill(detail: detail)
                }
            }
        }
        .padding(10)
        .background(Color(hex: "F9FAFB"))
        .cornerRadius(8)
    }
}

// MARK: - Property Spec

struct PropertySpec: View {
    let icon: String
    let value: String

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: icon)
                .font(.system(size: 12))
                .foregroundColor(Color(hex: "9CA3AF"))

            Text(value)
                .font(.system(size: 13))
                .foregroundColor(Color(hex: "374151"))
        }
    }
}

// MARK: - Match Score Badge

struct MatchScoreBadge: View {
    let score: Int

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: "sparkles")
                .font(.system(size: 12))

            Text("\(score)%")
                .font(.system(size: 14, weight: .bold))
        }
        .foregroundColor(.white)
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(
            LinearGradient(
                colors: scoreGradient,
                startPoint: .leading,
                endPoint: .trailing
            )
        )
        .cornerRadius(999)
    }

    private var scoreGradient: [Color] {
        if score >= 90 {
            return [Color(hex: "10B981"), Color(hex: "34D399")]
        } else if score >= 70 {
            return [Color(hex: "FFA040"), Color(hex: "F59E0B")]
        } else {
            return [Color(hex: "6B7280"), Color(hex: "9CA3AF")]
        }
    }
}

// MARK: - Match Detail Pill

struct MatchDetailPill: View {
    let detail: MatchDetail

    var body: some View {
        HStack(spacing: 3) {
            Image(systemName: detail.isMatched ? "checkmark.circle.fill" : "xmark.circle.fill")
                .font(.system(size: 10))

            Text(detail.criterion)
                .font(.system(size: 11))
        }
        .foregroundColor(detail.isMatched ? Color(hex: "10B981") : Color(hex: "EF4444"))
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(detail.isMatched ? Color(hex: "10B981").opacity(0.1) : Color(hex: "EF4444").opacity(0.1))
        .cornerRadius(999)
    }
}

// MARK: - Matching Preferences Sheet

struct MatchingPreferencesSheet: View {
    @ObservedObject var viewModel: PropertyMatchingViewModel
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text("Budget mensuel")
                            Spacer()
                            Text("€\(viewModel.criteria.minBudget) - €\(viewModel.criteria.maxBudget)")
                                .foregroundColor(Color(hex: "FFA040"))
                        }

                        // Slider would go here in production
                        HStack {
                            Text("€\(viewModel.criteria.minBudget)")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "6B7280"))
                            Spacer()
                            Text("€\(viewModel.criteria.maxBudget)")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "6B7280"))
                        }
                    }
                } header: {
                    Text("Budget")
                }

                Section {
                    Stepper("Chambres minimum: \(viewModel.criteria.minRooms)", value: $viewModel.criteria.minRooms, in: 1...6)

                    Stepper("Surface minimum: \(viewModel.criteria.minSurface) m²", value: $viewModel.criteria.minSurface, in: 10...200, step: 5)
                } header: {
                    Text("Caractéristiques")
                }

                Section {
                    Toggle("Meublé", isOn: $viewModel.criteria.furnished)
                    Toggle("Parking", isOn: $viewModel.criteria.parking)
                    Toggle("Balcon/Terrasse", isOn: $viewModel.criteria.balcony)
                    Toggle("Ascenseur", isOn: $viewModel.criteria.elevator)
                } header: {
                    Text("Équipements")
                }

                Section {
                    ForEach(viewModel.criteria.locations, id: \.self) { location in
                        HStack {
                            Image(systemName: "location.fill")
                                .foregroundColor(Color(hex: "6366F1"))
                            Text(location)
                        }
                    }
                } header: {
                    Text("Zones de recherche")
                }
            }
            .navigationTitle("Mes critères")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") { dismiss() }
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Appliquer") {
                        Task {
                            await viewModel.loadMatches()
                        }
                        dismiss()
                    }
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "FFA040"))
                }
            }
        }
    }
}

// MARK: - Property Detail Sheet View

struct PropertyDetailSheetView: View {
    let property: Property
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // Images
                    TabView {
                        ForEach(property.images, id: \.self) { imageUrl in
                            AsyncImage(url: URL(string: imageUrl)) { phase in
                                switch phase {
                                case .success(let image):
                                    image
                                        .resizable()
                                        .aspectRatio(contentMode: .fill)
                                case .failure(_), .empty:
                                    Rectangle()
                                        .fill(Color(hex: "E5E7EB"))
                                @unknown default:
                                    EmptyView()
                                }
                            }
                        }
                    }
                    .tabViewStyle(.page)
                    .frame(height: 250)

                    VStack(alignment: .leading, spacing: 16) {
                        // Title and price
                        VStack(alignment: .leading, spacing: 8) {
                            Text(property.title)
                                .font(.system(size: 22, weight: .bold))

                            HStack {
                                Image(systemName: "location.fill")
                                Text("\(property.address), \(property.city)")
                            }
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "6B7280"))

                            Text("€\(Int(property.monthlyRent))/mois")
                                .font(.system(size: 24, weight: .bold))
                                .foregroundColor(Color(hex: "FFA040"))
                        }

                        Divider()

                        // Specs grid
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                            PropertyDetailSpec(icon: "ruler", label: "Surface", value: "\(Int(property.surfaceArea ?? 0)) m²")
                            PropertyDetailSpec(icon: "bed.double.fill", label: "Chambres", value: "\(property.bedrooms)")
                            PropertyDetailSpec(icon: "drop.fill", label: "Salles de bain", value: "\(property.bathrooms)")
                            PropertyDetailSpec(icon: "square.grid.2x2", label: "Pièces", value: "\(property.totalRooms ?? 0)")
                        }

                        Divider()

                        // Description
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Description")
                                .font(.system(size: 16, weight: .semibold))

                            Text(property.description ?? "Aucune description disponible")
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "374151"))
                        }
                    }
                    .padding(16)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 24))
                            .foregroundColor(Color(hex: "D1D5DB"))
                    }
                }
            }
        }
    }
}

struct PropertyDetailSpec: View {
    let icon: String
    let label: String
    let value: String

    var body: some View {
        HStack(spacing: 10) {
            Image(systemName: icon)
                .font(.system(size: 18))
                .foregroundColor(Color(hex: "FFA040"))
                .frame(width: 24)

            VStack(alignment: .leading, spacing: 2) {
                Text(label)
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "6B7280"))

                Text(value)
                    .font(.system(size: 15, weight: .semibold))
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(12)
        .background(Color(hex: "F9FAFB"))
        .cornerRadius(10)
    }
}

// MARK: - Models

enum MatchSortOption: String, CaseIterable {
    case matchScore
    case priceAsc
    case priceDesc
    case newest
    case surface

    var title: String {
        switch self {
        case .matchScore: return "Match"
        case .priceAsc: return "Prix ↑"
        case .priceDesc: return "Prix ↓"
        case .newest: return "Récent"
        case .surface: return "Surface"
        }
    }

    var icon: String {
        switch self {
        case .matchScore: return "sparkles"
        case .priceAsc: return "arrow.up"
        case .priceDesc: return "arrow.down"
        case .newest: return "clock"
        case .surface: return "ruler"
        }
    }
}

struct PropertyMatch: Identifiable {
    let id: UUID
    let property: Property
    let matchScore: Int
    let matchDetails: [MatchDetail]
    var isLiked: Bool
}

struct MatchDetail {
    let criterion: String
    let isMatched: Bool
}

struct MatchingCriteria {
    var minBudget: Int = 500
    var maxBudget: Int = 1500
    var locations: [String] = ["Paris", "Lyon"]
    var minRooms: Int = 2
    var minSurface: Int = 30
    var furnished: Bool = false
    var parking: Bool = false
    var balcony: Bool = false
    var elevator: Bool = false
}

// MARK: - ViewModel

@MainActor
class PropertyMatchingViewModel: ObservableObject {
    @Published var matchedProperties: [PropertyMatch] = []
    @Published var criteria = MatchingCriteria()
    @Published var isLoading = false

    var averageMatchScore: Int {
        guard !matchedProperties.isEmpty else { return 0 }
        let total = matchedProperties.reduce(0) { $0 + $1.matchScore }
        return total / matchedProperties.count
    }

    var excellentMatches: Int {
        matchedProperties.filter { $0.matchScore >= 90 }.count
    }

    var goodMatches: Int {
        matchedProperties.filter { $0.matchScore >= 70 && $0.matchScore < 90 }.count
    }

    var fairMatches: Int {
        matchedProperties.filter { $0.matchScore < 70 }.count
    }

    func loadMatches() async {
        isLoading = true
        try? await Task.sleep(nanoseconds: 800_000_000)

        if AppConfig.FeatureFlags.demoMode {
            let properties = Property.mockProperties

            matchedProperties = properties.prefix(8).enumerated().map { index, property in
                let score = max(50, 95 - (index * 7))
                return PropertyMatch(
                    id: UUID(),
                    property: property,
                    matchScore: score,
                    matchDetails: generateMatchDetails(score: score),
                    isLiked: false
                )
            }
        }

        isLoading = false
    }

    private func generateMatchDetails(score: Int) -> [MatchDetail] {
        var details: [MatchDetail] = []

        details.append(MatchDetail(criterion: "Prix", isMatched: score > 60))
        details.append(MatchDetail(criterion: "Zone", isMatched: score > 50))
        details.append(MatchDetail(criterion: "Surface", isMatched: score > 70))
        details.append(MatchDetail(criterion: "Chambres", isMatched: score > 65))

        if criteria.furnished {
            details.append(MatchDetail(criterion: "Meublé", isMatched: score > 75))
        }

        return details
    }

    func sortMatches(by option: MatchSortOption) {
        switch option {
        case .matchScore:
            matchedProperties.sort { $0.matchScore > $1.matchScore }
        case .priceAsc:
            matchedProperties.sort { $0.property.monthlyRent < $1.property.monthlyRent }
        case .priceDesc:
            matchedProperties.sort { $0.property.monthlyRent > $1.property.monthlyRent }
        case .newest:
            // Would sort by date in production
            break
        case .surface:
            matchedProperties.sort { ($0.property.surfaceArea ?? 0) > ($1.property.surfaceArea ?? 0) }
        }
    }

    func likeProperty(_ match: PropertyMatch) {
        if let index = matchedProperties.firstIndex(where: { $0.id == match.id }) {
            matchedProperties[index].isLiked.toggle()
        }
    }

    func dismissProperty(_ match: PropertyMatch) {
        matchedProperties.removeAll { $0.id == match.id }
    }
}

// MARK: - Preview

struct PropertyMatchingView_Previews: PreviewProvider {
    static var previews: some View {
        PropertyMatchingView()
    }
}
