import Foundation
import SwiftUI

// MARK: - Rooms ViewModel

@MainActor
class RoomsViewModel: ObservableObject {
    @Published var rooms: [Room] = []
    @Published var filteredRooms: [Room] = []
    @Published var isLoading = false
    @Published var error: NetworkError?
    @Published var selectedFilter: RoomFilter = .all {
        didSet {
            applyFilter()
        }
    }

    let propertyID: UUID
    private let apiClient = APIClient.shared

    init(propertyID: UUID) {
        self.propertyID = propertyID
    }

    // MARK: - Load Rooms

    func loadRooms() async {
        isLoading = true
        error = nil

        do {
            // Fetch rooms from Supabase
            rooms = try await apiClient.getRooms(propertyId: propertyID.uuidString)
            applyFilter()

            print("✅ Loaded \(rooms.count) rooms for property \(propertyID)")
        } catch {
            self.error = error as? NetworkError ?? .unknown(error)
            print("❌ Error loading rooms: \(error)")
        }

        isLoading = false
    }

    // MARK: - Filtering

    private func applyFilter() {
        switch selectedFilter {
        case .all:
            filteredRooms = rooms
        case .available:
            filteredRooms = rooms.filter { $0.isAvailable }
        case .occupied:
            filteredRooms = rooms.filter { !$0.isAvailable }
        case .type(let roomType):
            filteredRooms = rooms.filter { $0.roomType == roomType }
        }
    }

    // MARK: - Computed Properties

    var availableRoomsCount: Int {
        rooms.filter { $0.isAvailable }.count
    }

    var occupiedRoomsCount: Int {
        rooms.filter { !$0.isAvailable }.count
    }

    func roomsCountByType(_ type: RoomType) -> Int {
        rooms.filter { $0.roomType == type }.count
    }

    // MARK: - Actions

    func refreshRooms() async {
        await loadRooms()
    }
}

// MARK: - Room Filter

enum RoomFilter: Equatable {
    case all
    case available
    case occupied
    case type(RoomType)
}
