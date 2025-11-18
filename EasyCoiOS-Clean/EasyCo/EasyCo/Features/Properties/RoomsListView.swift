import SwiftUI

// MARK: - Rooms List View

struct RoomsListView: View {
    let property: Property
    @StateObject private var viewModel: RoomsViewModel
    @State private var selectedRoom: Room?

    init(property: Property) {
        self.property = property
        _viewModel = StateObject(wrappedValue: RoomsViewModel(propertyID: property.id))
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Property Header
                propertyHeader

                // Filter Tabs
                filterTabs

                // Rooms List
                if viewModel.isLoading {
                    ProgressView("Chargement des chambres...")
                        .padding(.top, 40)
                } else if viewModel.filteredRooms.isEmpty {
                    emptyState
                } else {
                    roomsList
                }
            }
            .padding()
        }
        .background(Color(.systemGroupedBackground))
        .navigationTitle("Chambres disponibles")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(item: $selectedRoom) { room in
            RoomDetailSheet(room: room, property: property)
        }
        .task {
            await viewModel.loadRooms()
        }
    }

    // MARK: - Property Header

    private var propertyHeader: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(property.title)
                .font(.title2)
                .fontWeight(.bold)

            HStack(spacing: 16) {
                Label("\(property.city)", systemImage: "location")
                Label("\(viewModel.availableRoomsCount) disponibles", systemImage: "bed.double")
            }
            .font(.subheadline)
            .foregroundColor(.secondary)

            if let description = property.description {
                Text(description)
                    .font(.body)
                    .foregroundColor(.secondary)
                    .lineLimit(2)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    // MARK: - Filter Tabs

    private var filterTabs: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                FilterChip(
                    title: "Toutes (\(viewModel.rooms.count))",
                    isSelected: viewModel.selectedFilter == .all
                ) {
                    viewModel.selectedFilter = .all
                }

                FilterChip(
                    title: "Disponibles (\(viewModel.availableRoomsCount))",
                    isSelected: viewModel.selectedFilter == .available
                ) {
                    viewModel.selectedFilter = .available
                }

                FilterChip(
                    title: "Occupées (\(viewModel.occupiedRoomsCount))",
                    isSelected: viewModel.selectedFilter == .occupied
                ) {
                    viewModel.selectedFilter = .occupied
                }

                ForEach(RoomType.allCases, id: \.self) { type in
                    if viewModel.roomsCountByType(type) > 0 {
                        FilterChip(
                            title: "\(type.displayName) (\(viewModel.roomsCountByType(type)))",
                            isSelected: viewModel.selectedFilter == .type(type)
                        ) {
                            viewModel.selectedFilter = .type(type)
                        }
                    }
                }
            }
            .padding(.horizontal)
        }
    }

    // MARK: - Rooms List

    private var roomsList: some View {
        LazyVStack(spacing: 16) {
            ForEach(viewModel.filteredRooms) { room in
                RoomCardView(room: room) {
                    selectedRoom = room
                }
            }
        }
    }

    // MARK: - Empty State

    private var emptyState: some View {
        VStack(spacing: 20) {
            Image(systemName: "bed.double")
                .font(.system(size: 60))
                .foregroundColor(.secondary)

            Text("Aucune chambre trouvée")
                .font(.title3)
                .fontWeight(.semibold)

            Text("Aucune chambre ne correspond à vos critères de recherche.")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
        }
        .padding(.top, 60)
    }
}

// MARK: - Room Detail Sheet

struct RoomDetailSheet: View {
    let room: Room
    let property: Property
    @Environment(\.dismiss) private var dismiss
    @State private var showApplicationForm = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // Room Images
                    if !room.images.isEmpty {
                        TabView {
                            ForEach(room.images, id: \.self) { imageURL in
                                AsyncImage(url: URL(string: imageURL)) { image in
                                    image
                                        .resizable()
                                        .aspectRatio(contentMode: .fill)
                                } placeholder: {
                                    Rectangle()
                                        .fill(Color.gray.opacity(0.2))
                                }
                            }
                        }
                        .frame(height: 300)
                        .tabViewStyle(.page)
                    }

                    VStack(alignment: .leading, spacing: 16) {
                        // Title & Status
                        HStack(alignment: .top) {
                            VStack(alignment: .leading, spacing: 4) {
                                if let roomNumber = room.roomNumber {
                                    Text("Chambre \(roomNumber)")
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                                Text(room.title)
                                    .font(.title2)
                                    .fontWeight(.bold)
                            }

                            Spacer()

                            Text(room.status.displayName)
                                .font(.caption)
                                .fontWeight(.semibold)
                                .foregroundColor(.white)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 6)
                                .background(Color(hex: room.status.color))
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                        }

                        // Description
                        if let description = room.description {
                            Text(description)
                                .font(.body)
                                .foregroundColor(.secondary)
                        }

                        Divider()

                        // Details Grid
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                            DetailRow(icon: "square", label: "Surface", value: "\(Int(room.surfaceArea))m²")
                            DetailRow(icon: room.roomType.icon, label: "Type", value: room.roomType.displayName)
                            DetailRow(icon: "shower", label: "Salle de bain", value: room.hasPrivateBathroom ? "Privée" : "Partagée")
                            DetailRow(icon: "building.2", label: "Étage", value: room.floor != nil ? "\(room.floor!)" : "N/A")
                        }

                        Divider()

                        // Furniture
                        if !room.furniture.isEmpty {
                            VStack(alignment: .leading, spacing: 12) {
                                Text("Mobilier")
                                    .font(.headline)

                                FlowLayout(spacing: 8) {
                                    ForEach(room.furniture, id: \.self) { furniture in
                                        HStack(spacing: 4) {
                                            Image(systemName: furniture.icon)
                                            Text(furniture.displayName)
                                        }
                                        .font(.caption)
                                        .foregroundColor(Theme.Colors.primary)
                                        .padding(.horizontal, 10)
                                        .padding(.vertical, 6)
                                        .background(Theme.Colors.primary.opacity(0.1))
                                        .clipShape(RoundedRectangle(cornerRadius: 8))
                                    }
                                }
                            }

                            Divider()
                        }

                        // Price
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Loyer")
                                .font(.headline)

                            HStack(alignment: .firstTextBaseline) {
                                Text("\(Int(room.monthlyRent))€")
                                    .font(.title)
                                    .fontWeight(.bold)
                                    .foregroundColor(Theme.Colors.primary)

                                Text("/mois")
                                    .font(.body)
                                    .foregroundColor(.secondary)
                            }

                            if room.charges > 0 {
                                Text("+ \(Int(room.charges))€ de charges")
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                            }

                            if let deposit = room.deposit {
                                Text("Caution: \(Int(deposit))€")
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                    .padding()
                }
            }
            .navigationTitle("Détails de la chambre")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Fermer") {
                        dismiss()
                    }
                }
            }
            .safeAreaInset(edge: .bottom) {
                if room.isAvailable {
                    Button(action: {
                        showApplicationForm = true
                    }) {
                        Text("Candidater")
                            .fontWeight(.semibold)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 50)
                            .background(Theme.Colors.primary)
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                    }
                    .padding()
                    .background(Color(.systemBackground))
                }
            }
        }
        .sheet(isPresented: $showApplicationForm) {
            Text("Formulaire de candidature")
                // TODO: Implement application form
        }
    }
}

// MARK: - Detail Row

private struct DetailRow: View {
    let icon: String
    let label: String
    let value: String

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundColor(Theme.Colors.primary)
                .frame(width: 30)

            VStack(alignment: .leading, spacing: 2) {
                Text(label)
                    .font(.caption)
                    .foregroundColor(.secondary)
                Text(value)
                    .font(.body)
                    .fontWeight(.medium)
            }
        }
    }
}

// MARK: - Preview

#Preview {
    NavigationStack {
        RoomsListView(property: Property(
            id: UUID(),
            ownerID: UUID(),
            title: "Colocation 4 chambres - Bastille",
            description: "Belle colocation dans quartier animé",
            propertyType: .coliving,
            address: "15 Rue de la Roquette",
            city: "Paris",
            neighborhood: "Bastille",
            postalCode: "75011",
            country: "France",
            latitude: 48.8566,
            longitude: 2.3522,
            bedrooms: 4,
            bathrooms: 2,
            totalRooms: 6,
            surfaceArea: 95,
            floorNumber: 3,
            totalFloors: 6,
            furnished: true,
            monthlyRent: 2800,
            charges: 300,
            deposit: 2800,
            availableFrom: Date(),
            availableUntil: nil,
            minimumStayMonths: 3,
            maximumStayMonths: 12,
            isAvailable: true,
            amenities: [.wifi, .elevator, .washingMachine],
            smokingAllowed: false,
            petsAllowed: false,
            couplesAllowed: false,
            childrenAllowed: false,
            images: [],
            mainImage: nil,
            status: .published,
            viewsCount: 145,
            applicationsCount: 23,
            favoritesCount: 38,
            rating: 4.5,
            reviewsCount: 12,
            createdAt: Date(),
            updatedAt: Date(),
            publishedAt: Date(),
            archivedAt: nil,
            compatibilityScore: 88,
            matchInsights: ["Quartier dynamique", "Proche métro"],
            isFavorited: false,
            residents: nil
        ))
    }
}
