import SwiftUI

// MARK: - My Visits View (Searcher)

struct MyVisitsView: View {
    @StateObject private var viewModel = MyVisitsViewModel()
    @State private var selectedTab: VisitTab = .upcoming
    @State private var showBookVisit = false

    enum VisitTab: String, CaseIterable {
        case upcoming = "À venir"
        case past = "Passées"
        case cancelled = "Annulées"

        var icon: String {
            switch self {
            case .upcoming: return "calendar.badge.clock"
            case .past: return "checkmark.circle"
            case .cancelled: return "xmark.circle"
            }
        }
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Tab selector
                tabSelector

                // Content
                Group {
                    if viewModel.isLoading {
                        loadingView
                    } else if filteredVisits.isEmpty {
                        emptyStateView
                    } else {
                        visitsList
                    }
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Mes Visites")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }

                ToolbarItem(placement: .topBarTrailing) {
                    Button(action: { showBookVisit = true }) {
                        Image(systemName: "plus.circle.fill")
                            .font(.system(size: 20))
                            .foregroundColor(Color(hex: "FFA040"))
                    }
                }
            }
            .sheet(isPresented: $showBookVisit) {
                BookVisitSheet(onBook: { visit in
                    viewModel.addVisit(visit)
                    showBookVisit = false
                })
            }
        }
        .task {
            await viewModel.loadVisits()
        }
    }

    // MARK: - Tab Selector

    private var tabSelector: some View {
        HStack(spacing: 0) {
            ForEach(VisitTab.allCases, id: \.self) { tab in
                Button(action: { selectedTab = tab }) {
                    VStack(spacing: 8) {
                        HStack(spacing: 6) {
                            Image(systemName: tab.icon)
                                .font(.system(size: 14))
                            Text(tab.rawValue)
                                .font(.system(size: 14, weight: .medium))

                            // Badge count
                            if let count = viewModel.countForTab(tab), count > 0 {
                                Text("\(count)")
                                    .font(.system(size: 11, weight: .bold))
                                    .foregroundColor(.white)
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 2)
                                    .background(Color(hex: "FFA040"))
                                    .cornerRadius(10)
                            }
                        }
                        .foregroundColor(selectedTab == tab ? Color(hex: "FFA040") : Color(hex: "6B7280"))

                        // Indicator
                        Rectangle()
                            .fill(selectedTab == tab ? Color(hex: "FFA040") : Color.clear)
                            .frame(height: 3)
                            .cornerRadius(1.5)
                    }
                }
                .frame(maxWidth: .infinity)
            }
        }
        .padding(.horizontal, 16)
        .padding(.top, 8)
        .background(Color.white)
    }

    // MARK: - Filtered Visits

    private var filteredVisits: [PropertyVisit] {
        switch selectedTab {
        case .upcoming:
            return viewModel.visits.filter { $0.status == .confirmed || $0.status == .pending }
        case .past:
            return viewModel.visits.filter { $0.status == .completed }
        case .cancelled:
            return viewModel.visits.filter { $0.status == .cancelled }
        }
    }

    // MARK: - Loading View

    private var loadingView: some View {
        VStack(spacing: 16) {
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: Color(hex: "FFA040")))
                .scaleEffect(1.5)
            Text("Chargement de vos visites...")
                .font(.system(size: 16))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 24) {
            Spacer()

            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color(hex: "FFA040").opacity(0.2), Color(hex: "FFB85C").opacity(0.1)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 120, height: 120)

                Image(systemName: selectedTab.icon)
                    .font(.system(size: 48))
                    .foregroundColor(Color(hex: "FFA040"))
            }

            VStack(spacing: 12) {
                Text(emptyStateTitle)
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text(emptyStateMessage)
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }

            if selectedTab == .upcoming {
                Button(action: { showBookVisit = true }) {
                    HStack(spacing: 8) {
                        Image(systemName: "calendar.badge.plus")
                            .font(.system(size: 16, weight: .semibold))
                        Text("Réserver une visite")
                            .font(.system(size: 16, weight: .semibold))
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: 280)
                    .padding(.vertical, 16)
                    .background(
                        LinearGradient(
                            colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .cornerRadius(999)
                    .shadow(color: Color(hex: "FFA040").opacity(0.3), radius: 8, x: 0, y: 4)
                }
            }

            Spacer()
        }
    }

    private var emptyStateTitle: String {
        switch selectedTab {
        case .upcoming: return "Aucune visite prévue"
        case .past: return "Aucune visite passée"
        case .cancelled: return "Aucune annulation"
        }
    }

    private var emptyStateMessage: String {
        switch selectedTab {
        case .upcoming: return "Planifiez une visite pour découvrir vos propriétés favorites en personne"
        case .past: return "Vos visites terminées apparaîtront ici"
        case .cancelled: return "Les visites annulées s'afficheront ici"
        }
    }

    // MARK: - Visits List

    private var visitsList: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(filteredVisits) { visit in
                    MyVisitCard(
                        visit: visit,
                        onCancel: {
                            Task {
                                await viewModel.cancelVisit(visit)
                            }
                        },
                        onReschedule: {
                            // TODO: Show reschedule sheet
                        }
                    )
                }
            }
            .padding(16)
        }
    }
}

// MARK: - Visit Card

private struct MyVisitCard: View {
    let visit: PropertyVisit
    let onCancel: () -> Void
    let onReschedule: () -> Void

    private var statusColor: Color {
        switch visit.status {
        case .pending: return Color(hex: "F59E0B")
        case .confirmed: return Color(hex: "10B981")
        case .completed: return Color(hex: "6B7280")
        case .cancelled: return Color(hex: "EF4444")
        }
    }

    private var statusText: String {
        switch visit.status {
        case .pending: return "En attente"
        case .confirmed: return "Confirmée"
        case .completed: return "Terminée"
        case .cancelled: return "Annulée"
        }
    }

    var body: some View {
        VStack(spacing: 0) {
            // Property info
            HStack(spacing: 12) {
                // Property image
                AsyncImage(url: URL(string: visit.propertyImage ?? "")) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(width: 80, height: 80)
                            .clipped()
                            .cornerRadius(12)
                    case .failure(_), .empty:
                        Rectangle()
                            .fill(Color(hex: "E5E7EB"))
                            .frame(width: 80, height: 80)
                            .cornerRadius(12)
                            .overlay(
                                Image(systemName: "building.2")
                                    .font(.system(size: 24))
                                    .foregroundColor(Color(hex: "9CA3AF"))
                            )
                    @unknown default:
                        EmptyView()
                    }
                }

                VStack(alignment: .leading, spacing: 6) {
                    Text(visit.propertyTitle)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                        .lineLimit(1)

                    HStack(spacing: 4) {
                        Image(systemName: "mappin")
                            .font(.system(size: 12))
                        Text(visit.propertyAddress)
                            .font(.system(size: 13))
                            .lineLimit(1)
                    }
                    .foregroundColor(Color(hex: "6B7280"))

                    // Status badge
                    HStack(spacing: 4) {
                        Circle()
                            .fill(statusColor)
                            .frame(width: 8, height: 8)
                        Text(statusText)
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(statusColor)
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(statusColor.opacity(0.1))
                    .cornerRadius(999)
                }

                Spacer()
            }
            .padding(16)

            Divider()
                .padding(.horizontal, 16)

            // Date and time
            HStack(spacing: 20) {
                HStack(spacing: 8) {
                    Image(systemName: "calendar")
                        .font(.system(size: 16))
                        .foregroundColor(Color(hex: "FFA040"))

                    Text(visit.formattedDate)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "111827"))
                }

                HStack(spacing: 8) {
                    Image(systemName: "clock")
                        .font(.system(size: 16))
                        .foregroundColor(Color(hex: "FFA040"))

                    Text(visit.formattedTime)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "111827"))
                }

                Spacer()

                // Visit type
                HStack(spacing: 4) {
                    Image(systemName: visit.isVirtual ? "video.fill" : "person.fill")
                        .font(.system(size: 12))
                    Text(visit.isVirtual ? "Virtuelle" : "En personne")
                        .font(.system(size: 12, weight: .medium))
                }
                .foregroundColor(Color(hex: "6B7280"))
                .padding(.horizontal, 10)
                .padding(.vertical, 4)
                .background(Color(hex: "F3F4F6"))
                .cornerRadius(999)
            }
            .padding(16)

            // Actions (only for upcoming visits)
            if visit.status == .confirmed || visit.status == .pending {
                Divider()
                    .padding(.horizontal, 16)

                HStack(spacing: 12) {
                    Button(action: onReschedule) {
                        HStack(spacing: 6) {
                            Image(systemName: "calendar.badge.clock")
                                .font(.system(size: 14))
                            Text("Reprogrammer")
                                .font(.system(size: 14, weight: .medium))
                        }
                        .foregroundColor(Color(hex: "FFA040"))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Color(hex: "FFA040").opacity(0.1))
                        .cornerRadius(10)
                    }

                    Button(action: onCancel) {
                        HStack(spacing: 6) {
                            Image(systemName: "xmark.circle")
                                .font(.system(size: 14))
                            Text("Annuler")
                                .font(.system(size: 14, weight: .medium))
                        }
                        .foregroundColor(Color(hex: "EF4444"))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Color(hex: "EF4444").opacity(0.1))
                        .cornerRadius(10)
                    }
                }
                .padding(16)
            }
        }
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.06), radius: 8, x: 0, y: 2)
    }
}

// MARK: - Book Visit Sheet

struct BookVisitSheet: View {
    @Environment(\.dismiss) private var dismiss
    let onBook: (PropertyVisit) -> Void

    @State private var selectedProperty: Property?
    @State private var selectedDate = Date()
    @State private var selectedTimeSlot: VisitTimeSlot?
    @State private var isVirtual = false
    @State private var notes = ""

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Property selection
                    propertySelectionSection

                    // Date selection
                    dateSelectionSection

                    // Time slot selection
                    timeSlotSection

                    // Visit type
                    visitTypeSection

                    // Notes
                    notesSection
                }
                .padding(16)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationTitle("Réserver une visite")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Annuler") { dismiss() }
                        .foregroundColor(Color(hex: "6B7280"))
                }

                ToolbarItem(placement: .confirmationAction) {
                    Button("Réserver") {
                        bookVisit()
                    }
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(canBook ? Color(hex: "FFA040") : Color(hex: "D1D5DB"))
                    .disabled(!canBook)
                }
            }
        }
    }

    private var canBook: Bool {
        selectedProperty != nil && selectedTimeSlot != nil
    }

    // MARK: - Property Selection

    private var propertySelectionSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Propriété")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            // Demo properties for selection
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(Property.mockProperties.prefix(5)) { property in
                        PropertySelectionCard(
                            property: property,
                            isSelected: selectedProperty?.id == property.id
                        ) {
                            selectedProperty = property
                        }
                    }
                }
            }
        }
    }

    // MARK: - Date Selection

    private var dateSelectionSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Date")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            DatePicker(
                "Sélectionner une date",
                selection: $selectedDate,
                in: Date()...,
                displayedComponents: .date
            )
            .datePickerStyle(.graphical)
            .tint(Color(hex: "FFA040"))
            .padding(16)
            .background(Color.white)
            .cornerRadius(16)
        }
    }

    // MARK: - Time Slot Section

    private var timeSlotSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Créneau horaire")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 12) {
                ForEach(VisitTimeSlot.availableSlots, id: \.self) { slot in
                    MyTimeSlotButton(
                        slot: slot,
                        isSelected: selectedTimeSlot == slot
                    ) {
                        selectedTimeSlot = slot
                    }
                }
            }
        }
    }

    // MARK: - Visit Type Section

    private var visitTypeSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Type de visite")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            HStack(spacing: 12) {
                VisitTypeButton(
                    icon: "person.fill",
                    title: "En personne",
                    isSelected: !isVirtual
                ) {
                    isVirtual = false
                }

                VisitTypeButton(
                    icon: "video.fill",
                    title: "Virtuelle",
                    isSelected: isVirtual
                ) {
                    isVirtual = true
                }
            }
        }
    }

    // MARK: - Notes Section

    private var notesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Notes (optionnel)")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            TextEditor(text: $notes)
                .frame(height: 100)
                .padding(12)
                .background(Color.white)
                .cornerRadius(12)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                )
        }
    }

    // MARK: - Book Visit

    private func bookVisit() {
        guard let property = selectedProperty, let timeSlot = selectedTimeSlot else { return }

        let visit = PropertyVisit(
            id: UUID(),
            propertyId: property.id,
            propertyTitle: property.title,
            propertyAddress: property.city,
            propertyImage: property.images.first,
            date: selectedDate,
            timeSlot: timeSlot,
            isVirtual: isVirtual,
            status: .pending,
            notes: notes.isEmpty ? nil : notes
        )

        onBook(visit)
    }
}

// MARK: - Property Selection Card

struct PropertySelectionCard: View {
    let property: Property
    let isSelected: Bool
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 8) {
                AsyncImage(url: URL(string: property.images.first ?? "")) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(width: 140, height: 90)
                            .clipped()
                            .cornerRadius(10)
                    case .failure(_), .empty:
                        Rectangle()
                            .fill(Color(hex: "E5E7EB"))
                            .frame(width: 140, height: 90)
                            .cornerRadius(10)
                            .overlay(
                                Image(systemName: "building.2")
                                    .foregroundColor(Color(hex: "9CA3AF"))
                            )
                    @unknown default:
                        EmptyView()
                    }
                }

                Text(property.title)
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(Color(hex: "111827"))
                    .lineLimit(1)

                Text(property.city)
                    .font(.system(size: 11))
                    .foregroundColor(Color(hex: "6B7280"))
            }
            .frame(width: 140)
            .padding(10)
            .background(Color.white)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(isSelected ? Color(hex: "FFA040") : Color(hex: "E5E7EB"), lineWidth: isSelected ? 2 : 1)
            )
        }
    }
}

// MARK: - Time Slot Button

private struct MyTimeSlotButton: View {
    let slot: VisitTimeSlot
    let isSelected: Bool
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            Text(slot.displayText)
                .font(.system(size: 14, weight: isSelected ? .semibold : .medium))
                .foregroundColor(isSelected ? .white : Color(hex: "374151"))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(isSelected ? Color(hex: "FFA040") : Color.white)
                .cornerRadius(10)
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(isSelected ? Color.clear : Color(hex: "E5E7EB"), lineWidth: 1)
                )
        }
    }
}

// MARK: - Visit Type Button

struct VisitTypeButton: View {
    let icon: String
    let title: String
    let isSelected: Bool
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 10) {
                Image(systemName: icon)
                    .font(.system(size: 18))
                Text(title)
                    .font(.system(size: 15, weight: .medium))
            }
            .foregroundColor(isSelected ? .white : Color(hex: "374151"))
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(isSelected ? Color(hex: "FFA040") : Color.white)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(isSelected ? Color.clear : Color(hex: "E5E7EB"), lineWidth: 1)
            )
        }
    }
}

// MARK: - Models

struct PropertyVisit: Identifiable {
    let id: UUID
    let propertyId: UUID
    let propertyTitle: String
    let propertyAddress: String
    let propertyImage: String?
    let date: Date
    let timeSlot: VisitTimeSlot
    let isVirtual: Bool
    var status: PropertyVisitStatus
    let notes: String?

    var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEE d MMMM"
        formatter.locale = Locale(identifier: "fr_FR")
        return formatter.string(from: date).capitalized
    }

    var formattedTime: String {
        timeSlot.displayText
    }
}

enum PropertyVisitStatus {
    case pending
    case confirmed
    case completed
    case cancelled
}

struct VisitTimeSlot: Hashable {
    let hour: Int
    let minute: Int

    var displayText: String {
        String(format: "%02d:%02d", hour, minute)
    }

    static var availableSlots: [VisitTimeSlot] {
        [
            VisitTimeSlot(hour: 9, minute: 0),
            VisitTimeSlot(hour: 10, minute: 0),
            VisitTimeSlot(hour: 11, minute: 0),
            VisitTimeSlot(hour: 14, minute: 0),
            VisitTimeSlot(hour: 15, minute: 0),
            VisitTimeSlot(hour: 16, minute: 0),
            VisitTimeSlot(hour: 17, minute: 0),
            VisitTimeSlot(hour: 18, minute: 0),
            VisitTimeSlot(hour: 19, minute: 0)
        ]
    }
}

// MARK: - ViewModel

@MainActor
class MyVisitsViewModel: ObservableObject {
    @Published var visits: [PropertyVisit] = []
    @Published var isLoading = false

    func loadVisits() async {
        isLoading = true

        // Demo mode
        if AppConfig.FeatureFlags.demoMode {
            try? await Task.sleep(nanoseconds: 500_000_000)

            let properties = Property.mockProperties

            visits = [
                PropertyVisit(
                    id: UUID(),
                    propertyId: properties[0].id,
                    propertyTitle: properties[0].title,
                    propertyAddress: properties[0].city,
                    propertyImage: properties[0].images.first,
                    date: Calendar.current.date(byAdding: .day, value: 2, to: Date())!,
                    timeSlot: VisitTimeSlot(hour: 14, minute: 0),
                    isVirtual: false,
                    status: .confirmed,
                    notes: nil
                ),
                PropertyVisit(
                    id: UUID(),
                    propertyId: properties[1].id,
                    propertyTitle: properties[1].title,
                    propertyAddress: properties[1].city,
                    propertyImage: properties[1].images.first,
                    date: Calendar.current.date(byAdding: .day, value: 5, to: Date())!,
                    timeSlot: VisitTimeSlot(hour: 10, minute: 0),
                    isVirtual: true,
                    status: .pending,
                    notes: "Visite virtuelle par Zoom"
                ),
                PropertyVisit(
                    id: UUID(),
                    propertyId: properties[2].id,
                    propertyTitle: properties[2].title,
                    propertyAddress: properties[2].city,
                    propertyImage: properties[2].images.first,
                    date: Calendar.current.date(byAdding: .day, value: -3, to: Date())!,
                    timeSlot: VisitTimeSlot(hour: 15, minute: 0),
                    isVirtual: false,
                    status: .completed,
                    notes: nil
                )
            ]
        }

        isLoading = false
    }

    func countForTab(_ tab: MyVisitsView.VisitTab) -> Int? {
        switch tab {
        case .upcoming:
            let count = visits.filter { $0.status == .confirmed || $0.status == .pending }.count
            return count > 0 ? count : nil
        case .past:
            return nil
        case .cancelled:
            return nil
        }
    }

    func addVisit(_ visit: PropertyVisit) {
        visits.insert(visit, at: 0)
    }

    func cancelVisit(_ visit: PropertyVisit) async {
        if let index = visits.firstIndex(where: { $0.id == visit.id }) {
            visits[index].status = .cancelled
        }
    }
}

// MARK: - Preview

struct MyVisitsView_Previews: PreviewProvider {
    static var previews: some View {
        MyVisitsView()
    }
}
