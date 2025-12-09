//
//  ContractorsView.swift
//  IzzIco
//
//  Contractors directory for Owner
//

import SwiftUI

struct ContractorsView: View {
    @State private var contractors: [Contractor] = []
    @State private var searchText = ""
    @State private var selectedSpecialty: MaintenanceCategory?
    @State private var showingFavoritesOnly = false
    @State private var sortBy: ContractorSort = .lastUsed
    @State private var isLoading = false

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Filters
                filtersSection

                // Contractors list
                if isLoading {
                    LoadingView(message: "Chargement...")
                } else if filteredContractors.isEmpty {
                    emptyStateView
                } else {
                    contractorsList
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Prestataires")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {}) {
                        Image(systemName: "plus.circle.fill")
                            .foregroundColor(Color(hex: "6E56CF"))
                    }
                }
            }
        }
        .task {
            await loadContractors()
        }
    }

    // MARK: - Filters Section

    private var filtersSection: some View {
        VStack(spacing: 12) {
            // Search
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(Color(hex: "9CA3AF"))

                TextField("Rechercher...", text: $searchText)
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

            // Filter buttons
            HStack(spacing: 12) {
                Button(action: { showingFavoritesOnly.toggle() }) {
                    HStack(spacing: 6) {
                        Image(systemName: showingFavoritesOnly ? "star.fill" : "star")
                            .font(.system(size: 12))
                        Text("Favoris")
                            .font(.system(size: 14, weight: .medium))
                    }
                    .foregroundColor(showingFavoritesOnly ? .white : Color(hex: "6E56CF"))
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(showingFavoritesOnly ? Color(hex: "6E56CF") : Color(hex: "F3F0FF"))
                    .cornerRadius(20)
                }

                Menu {
                    Button("Tous") { selectedSpecialty = nil }
                    ForEach(MaintenanceCategory.allCases, id: \.self) { category in
                        Button(category.displayName) {
                            selectedSpecialty = category
                        }
                    }
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "line.3.horizontal.decrease.circle")
                            .font(.system(size: 12))
                        Text(selectedSpecialty?.displayName ?? "Spécialité")
                            .font(.system(size: 14, weight: .medium))
                        Image(systemName: "chevron.down")
                            .font(.system(size: 10))
                    }
                    .foregroundColor(Color(hex: "6E56CF"))
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(Color(hex: "F3F0FF"))
                    .cornerRadius(20)
                }

                Spacer()

                Text("\(filteredContractors.count)")
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "6B7280"))
            }
        }
        .padding(16)
        .background(Color.white)
        .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)
    }

    // MARK: - Contractors List

    private var contractorsList: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                ForEach(filteredContractors) { contractor in
                    ContractorCard(contractor: contractor)
                }
            }
            .padding(16)
        }
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 24) {
            Spacer()

            ZStack {
                Circle()
                    .fill(Color(hex: "F3F0FF"))
                    .frame(width: 120, height: 120)

                Image(systemName: "person.2.fill")
                    .font(.system(size: 48))
                    .foregroundColor(Color(hex: "6E56CF"))
            }

            VStack(spacing: 12) {
                Text("Aucun prestataire")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Ajoutez vos prestataires de confiance")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Filtered Contractors

    private var filteredContractors: [Contractor] {
        var result = contractors

        // Filter by favorites
        if showingFavoritesOnly {
            result = result.filter { $0.isFavorite }
        }

        // Filter by specialty
        if let specialty = selectedSpecialty {
            result = result.filter { $0.specialty == specialty }
        }

        // Filter by search
        if !searchText.isEmpty {
            result = result.filter { contractor in
                contractor.name.localizedCaseInsensitiveContains(searchText) ||
                (contractor.company?.localizedCaseInsensitiveContains(searchText) ?? false)
            }
        }

        // Sort
        switch sortBy {
        case .name:
            return result.sorted { $0.displayName < $1.displayName }
        case .rating:
            return result.sorted { $0.rating > $1.rating }
        case .lastUsed:
            return result.sorted { ($0.lastUsed ?? Date.distantPast) > ($1.lastUsed ?? Date.distantPast) }
        case .totalJobs:
            return result.sorted { $0.totalJobs > $1.totalJobs }
        }
    }

    // MARK: - Data Methods

    private func loadContractors() async {
        isLoading = true

        if AppConfig.FeatureFlags.demoMode {
            try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
            contractors = Contractor.mockContractors
        }

        isLoading = false
    }
}

// MARK: - Contractor Sort

enum ContractorSort {
    case name
    case rating
    case lastUsed
    case totalJobs
}

// MARK: - Contractor Card

struct ContractorCard: View {
    let contractor: Contractor
    @State private var showingDetails = false

    var body: some View {
        Button(action: { showingDetails = true }) {
            VStack(alignment: .leading, spacing: 12) {
                // Header
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        HStack(spacing: 8) {
                            Text(contractor.displayName)
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(Color(hex: "111827"))

                            if contractor.isFavorite {
                                Image(systemName: "star.fill")
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "FBBF24"))
                            }
                        }

                        if contractor.company != nil && contractor.company != contractor.name {
                            Text(contractor.name)
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "6B7280"))
                        }
                    }

                    Spacer()

                    // Specialty badge
                    HStack(spacing: 6) {
                        Image(systemName: contractor.specialty.icon)
                            .font(.system(size: 10))
                        Text(contractor.specialty.displayName)
                            .font(.system(size: 11, weight: .medium))
                    }
                    .foregroundColor(Color(hex: contractor.specialty.color))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color(hex: contractor.specialty.color).opacity(0.1))
                    .cornerRadius(12)
                }

                // Rating
                HStack(spacing: 4) {
                    ForEach(0..<5) { index in
                        Image(systemName: index < Int(contractor.rating) ? "star.fill" : "star")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "FBBF24"))
                    }

                    Text(String(format: "%.1f", contractor.rating))
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(Color(hex: "6B7280"))

                    Text("• \(contractor.totalJobs) interventions")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "9CA3AF"))
                }

                Divider()

                // Contact info
                VStack(alignment: .leading, spacing: 6) {
                    HStack(spacing: 8) {
                        Image(systemName: "phone.fill")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "6E56CF"))
                            .frame(width: 16)

                        Text(contractor.formattedPhone)
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "374151"))

                        Spacer()

                        Button(action: {}) {
                            Image(systemName: "phone.circle.fill")
                                .font(.system(size: 24))
                                .foregroundColor(Color(hex: "10B981"))
                        }
                    }

                    if let email = contractor.email {
                        HStack(spacing: 8) {
                            Image(systemName: "envelope.fill")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "6E56CF"))
                                .frame(width: 16)

                            Text(email)
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "374151"))
                        }
                    }
                }

                // Pricing
                if let hourlyRate = contractor.hourlyRate {
                    HStack {
                        Text("Tarif horaire:")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "6B7280"))

                        Text(String(format: "%.0f€/h", hourlyRate))
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(Color(hex: "6E56CF"))

                        Spacer()
                    }
                }

                // Notes preview
                if let notes = contractor.notes, !notes.isEmpty {
                    Text(notes)
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "6B7280"))
                        .lineLimit(2)
                        .padding(8)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color(hex: "F3F0FF"))
                        .cornerRadius(8)
                }
            }
            .padding(16)
            .background(Color.white)
            .cornerRadius(12)
            .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        }
        .buttonStyle(PlainButtonStyle())
        .sheet(isPresented: $showingDetails) {
            ContractorDetailView(contractor: contractor)
        }
    }
}

// MARK: - Contractor Detail View

struct ContractorDetailView: View {
    let contractor: Contractor
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    // Header
                    VStack(spacing: 16) {
                        Circle()
                            .fill(
                                LinearGradient(
                                    colors: [Color(hex: "6E56CF"), Color(hex: "8B5CF6")],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .frame(width: 80, height: 80)
                            .overlay(
                                Text(String(contractor.displayName.prefix(1)))
                                    .font(.system(size: 32, weight: .bold))
                                    .foregroundColor(.white)
                            )

                        VStack(spacing: 4) {
                            Text(contractor.displayName)
                                .font(.system(size: 22, weight: .bold))
                                .foregroundColor(Color(hex: "111827"))

                            Text(contractor.specialty.displayName)
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "6B7280"))
                        }

                        // Rating
                        HStack(spacing: 4) {
                            ForEach(0..<5) { index in
                                Image(systemName: index < Int(contractor.rating) ? "star.fill" : "star")
                                    .font(.system(size: 16))
                                    .foregroundColor(Color(hex: "FBBF24"))
                            }
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.top, 20)

                    // Stats
                    HStack(spacing: 16) {
                        StatBox(value: "\(contractor.totalJobs)", label: "Interventions")
                        if let lastUsed = contractor.lastUsed {
                            StatBox(value: lastUsed.timeAgo, label: "Dernière intervention")
                        }
                    }

                    // Contact details would go here
                }
                .padding(16)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Fermer") { dismiss() }
                }
            }
        }
    }
}

struct StatBox: View {
    let value: String
    let label: String

    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(Color(hex: "6E56CF"))

            Text(label)
                .font(.system(size: 12))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
        .background(Color.white)
        .cornerRadius(12)
    }
}
