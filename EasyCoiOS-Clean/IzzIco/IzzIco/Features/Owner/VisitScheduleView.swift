//
//  VisitScheduleView.swift
//  IzzIco
//
//  Owner visit schedule management view
//

import SwiftUI

struct VisitScheduleView: View {
    @State private var visits: [Visit] = []
    @State private var isLoading = false
    @State private var selectedFilter: VisitFilter = .upcoming
    @State private var showingScheduleSheet = false
    @State private var selectedVisit: Visit?
    @State private var showingCancelAlert = false
    @State private var showingNotesSheet = false

    var body: some View {
        NavigationStack {
            Group {
                if isLoading {
                    LoadingView(message: "Chargement des visites...")
                } else if filteredVisits.isEmpty {
                    emptyStateView
                } else {
                    visitsContent
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Visites")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }
            }
            .sheet(isPresented: $showingScheduleSheet) {
                if let visit = selectedVisit {
                    VisitCalendarView(visit: visit)
                }
            }
            .sheet(isPresented: $showingNotesSheet) {
                if let visit = selectedVisit {
                    VisitNotesView(visit: visit)
                }
            }
            .alert("Annuler la visite", isPresented: $showingCancelAlert) {
                Button("Annuler", role: .cancel) { }
                Button("Confirmer", role: .destructive) {
                    if let visit = selectedVisit {
                        cancelVisit(visit)
                    }
                }
            } message: {
                Text("Êtes-vous sûr de vouloir annuler cette visite ?")
            }
        }
        .task {
            await loadVisits()
        }
    }

    // MARK: - Visits Content

    private var visitsContent: some View {
        VStack(spacing: 0) {
            // Filters
            filtersSection

            // Stats summary
            statsSection

            // List
            ScrollView {
                LazyVStack(spacing: 12) {
                    ForEach(filteredVisits) { visit in
                        VisitCard(
                            visit: visit,
                            onCancel: {
                                selectedVisit = visit
                                showingCancelAlert = true
                            },
                            onReschedule: {
                                selectedVisit = visit
                                showingScheduleSheet = true
                            },
                            onAddNotes: {
                                selectedVisit = visit
                                showingNotesSheet = true
                            }
                        )
                    }
                }
                .padding(16)
            }
        }
    }

    // MARK: - Filters Section

    private var filtersSection: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(VisitFilter.allCases, id: \.self) { filter in
                    VisitFilterChip(
                        title: filter.displayName,
                        count: countForFilter(filter),
                        isSelected: selectedFilter == filter,
                        action: { selectedFilter = filter }
                    )
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
        .background(Color.white)
    }

    // MARK: - Stats Section

    private var statsSection: some View {
        HStack(spacing: 16) {
            VisitStatCard(
                title: "Aujourd'hui",
                value: "\(todayVisits.count)",
                icon: "calendar.badge.clock",
                color: Color(hex: "6E56CF")
            )

            VisitStatCard(
                title: "Cette semaine",
                value: "\(thisWeekVisits.count)",
                icon: "calendar",
                color: Color(hex: "3B82F6")
            )

            VisitStatCard(
                title: "En attente",
                value: "\(pendingVisits.count)",
                icon: "clock.fill",
                color: Color(hex: "FBBF24")
            )
        }
        .padding(16)
        .background(Color(hex: "F9FAFB"))
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 24) {
            Spacer()

            ZStack {
                Circle()
                    .fill(Color(hex: "F3F0FF"))
                    .frame(width: 120, height: 120)

                Image(systemName: "calendar.badge.clock")
                    .font(.system(size: 48))
                    .foregroundColor(Color(hex: "6E56CF"))
            }

            VStack(spacing: 12) {
                Text("Aucune visite")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Les visites planifiées apparaîtront ici")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Computed Properties

    private var filteredVisits: [Visit] {
        switch selectedFilter {
        case .all:
            return visits.sorted { $0.scheduledDate < $1.scheduledDate }
        case .upcoming:
            return visits.filter { !$0.isPast && $0.status != .cancelled }
                .sorted { $0.scheduledDate < $1.scheduledDate }
        case .today:
            return todayVisits
        case .past:
            return visits.filter { $0.isPast || $0.status == .completed }
                .sorted { $0.scheduledDate > $1.scheduledDate }
        case .cancelled:
            return visits.filter { $0.status == .cancelled }
                .sorted { $0.scheduledDate > $1.scheduledDate }
        }
    }

    private var todayVisits: [Visit] {
        visits.filter { $0.isToday }
            .sorted { $0.scheduledDate < $1.scheduledDate }
    }

    private var thisWeekVisits: [Visit] {
        let calendar = Calendar.current
        let now = Date()
        let weekFromNow = calendar.date(byAdding: .day, value: 7, to: now)!

        return visits.filter { visit in
            visit.scheduledDate >= now && visit.scheduledDate <= weekFromNow && visit.status != .cancelled
        }
    }

    private var pendingVisits: [Visit] {
        visits.filter { $0.status == .pending || $0.status == .scheduled }
    }

    private func countForFilter(_ filter: VisitFilter) -> Int {
        switch filter {
        case .all: return visits.count
        case .upcoming: return visits.filter { !$0.isPast && $0.status != .cancelled }.count
        case .today: return todayVisits.count
        case .past: return visits.filter { $0.isPast || $0.status == .completed }.count
        case .cancelled: return visits.filter { $0.status == .cancelled }.count
        }
    }

    // MARK: - Data Methods

    private func loadVisits() async {
        isLoading = true

        // Demo mode
        if AppConfig.FeatureFlags.demoMode {
            try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
            visits = Visit.mockVisits
        }

        isLoading = false
    }

    private func cancelVisit(_ visit: Visit) {
        if let index = visits.firstIndex(where: { $0.id == visit.id }) {
            visits[index].status = .cancelled
            visits[index].cancelledAt = Date()
        }
    }
}

// MARK: - Visit Filter

enum VisitFilter: String, CaseIterable {
    case all = "Toutes"
    case upcoming = "À venir"
    case today = "Aujourd'hui"
    case past = "Passées"
    case cancelled = "Annulées"

    var displayName: String {
        self.rawValue
    }
}

// MARK: - Visit Filter Chip

struct VisitFilterChip: View {
    let title: String
    let count: Int
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Text(title)
                    .font(.system(size: 14, weight: .medium))

                Text("\(count)")
                    .font(.system(size: 12, weight: .bold))
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(isSelected ? Color.white.opacity(0.3) : Color(hex: "E5E7EB"))
                    .cornerRadius(10)
            }
            .foregroundColor(isSelected ? .white : Color(hex: "6B7280"))
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(isSelected ? Color(hex: "6E56CF") : Color(hex: "F3F4F6"))
            .cornerRadius(20)
        }
    }
}

// MARK: - Visit Stat Card

struct VisitStatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: icon)
                    .font(.system(size: 16))
                    .foregroundColor(color)

                Spacer()
            }

            Text(value)
                .font(.system(size: 24, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            Text(title)
                .font(.system(size: 12))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(12)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Visit Card

struct VisitCard: View {
    let visit: Visit
    let onCancel: () -> Void
    let onReschedule: () -> Void
    let onAddNotes: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header with status
            HStack {
                HStack(spacing: 8) {
                    Image(systemName: visit.status.icon)
                        .font(.system(size: 14))
                    Text(visit.status.displayName)
                        .font(.system(size: 14, weight: .semibold))
                }
                .foregroundColor(Color(hex: visit.status.color))

                Spacer()

                if visit.isToday {
                    Text("AUJOURD'HUI")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color(hex: "EF4444"))
                        .cornerRadius(4)
                } else if visit.isTomorrow {
                    Text("DEMAIN")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color(hex: "FBBF24"))
                        .cornerRadius(4)
                }
            }

            Divider()

            // Applicant info
            HStack(spacing: 12) {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color(hex: "6E56CF"), Color(hex: "8B5CF6")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 48, height: 48)
                    .overlay(
                        Text(String(visit.applicantName.prefix(1)))
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.white)
                    )

                VStack(alignment: .leading, spacing: 4) {
                    Text(visit.applicantName)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    Text(visit.propertyTitle)
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                Spacer()
            }

            // Date and time
            HStack(spacing: 16) {
                HStack(spacing: 6) {
                    Image(systemName: "calendar")
                        .font(.system(size: 14))
                    Text(visit.scheduledDate.formatted(date: .abbreviated, time: .omitted))
                        .font(.system(size: 14))
                }
                .foregroundColor(Color(hex: "6B7280"))

                HStack(spacing: 6) {
                    Image(systemName: "clock")
                        .font(.system(size: 14))
                    Text(visit.scheduledDate.formatted(date: .omitted, time: .shortened))
                        .font(.system(size: 14))
                }
                .foregroundColor(Color(hex: "6B7280"))

                HStack(spacing: 6) {
                    Image(systemName: "timer")
                        .font(.system(size: 14))
                    Text("\(visit.duration) min")
                        .font(.system(size: 14))
                }
                .foregroundColor(Color(hex: "6B7280"))
            }

            // Notes if present
            if let notes = visit.notes, !notes.isEmpty {
                HStack(alignment: .top, spacing: 8) {
                    Image(systemName: "note.text")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "6E56CF"))

                    Text(notes)
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "6B7280"))
                        .lineLimit(2)
                }
                .padding(8)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color(hex: "F3F0FF"))
                .cornerRadius(8)
            }

            // Owner notes if present (for completed visits)
            if let ownerNotes = visit.ownerNotes, !ownerNotes.isEmpty {
                HStack(alignment: .top, spacing: 8) {
                    Image(systemName: "lock.fill")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "6E56CF"))

                    Text(ownerNotes)
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "6B7280"))
                        .lineLimit(2)
                }
                .padding(8)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color(hex: "FEF3C7"))
                .cornerRadius(8)
            }

            // Actions
            if visit.status == .scheduled || visit.status == .confirmed {
                HStack(spacing: 8) {
                    if visit.canCancel {
                        Button(action: onCancel) {
                            HStack(spacing: 4) {
                                Image(systemName: "xmark")
                                    .font(.system(size: 12))
                                Text("Annuler")
                                    .font(.system(size: 13, weight: .medium))
                            }
                            .foregroundColor(Color(hex: "EF4444"))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 8)
                            .background(Color(hex: "FEE2E2"))
                            .cornerRadius(8)
                        }
                    }

                    if visit.canReschedule {
                        Button(action: onReschedule) {
                            HStack(spacing: 4) {
                                Image(systemName: "calendar.badge.clock")
                                    .font(.system(size: 12))
                                Text("Replanifier")
                                    .font(.system(size: 13, weight: .medium))
                            }
                            .foregroundColor(Color(hex: "6E56CF"))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 8)
                            .background(Color(hex: "F3F0FF"))
                            .cornerRadius(8)
                        }
                    }
                }
            }

            // Add notes for completed visits
            if visit.status == .completed && (visit.ownerNotes == nil || visit.ownerNotes!.isEmpty) {
                Button(action: onAddNotes) {
                    HStack(spacing: 4) {
                        Image(systemName: "note.text.badge.plus")
                            .font(.system(size: 12))
                        Text("Ajouter des notes")
                            .font(.system(size: 13, weight: .medium))
                    }
                    .foregroundColor(Color(hex: "6E56CF"))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .background(Color(hex: "F3F0FF"))
                    .cornerRadius(8)
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}
