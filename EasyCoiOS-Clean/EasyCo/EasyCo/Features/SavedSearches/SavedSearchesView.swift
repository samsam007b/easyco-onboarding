//
//  SavedSearchesView.swift
//  EasyCo
//
//  Saved property searches for quick access
//

import SwiftUI

struct SavedSearchesView: View {
    @StateObject private var viewModel = SavedSearchesViewModel()
    @State private var showCreateSearch = false

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                if viewModel.savedSearches.isEmpty {
                    emptyStateView
                } else {
                    ForEach(viewModel.savedSearches) { search in
                        SavedSearchCard(
                            search: search,
                            onTap: {
                                viewModel.executeSearch(search)
                            },
                            onDelete: {
                                viewModel.deleteSearch(search)
                            }
                        )
                    }
                }
            }
            .padding(16)
        }
        .background(Color(hex: "F9FAFB"))
        .navigationTitle("Recherches sauvegardées")
        .navigationBarTitleDisplayMode(.large)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button(action: { showCreateSearch = true }) {
                    Image(systemName: "plus")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "FFA040"))
                }
            }
        }
        .sheet(isPresented: $showCreateSearch) {
            CreateSavedSearchView(viewModel: viewModel)
        }
        .task {
            await viewModel.loadSavedSearches()
        }
    }

    private var emptyStateView: some View {
        VStack(spacing: 16) {
            Image(systemName: "bookmark.slash")
                .font(.system(size: 64))
                .foregroundColor(Color(hex: "D1D5DB"))

            Text("Aucune recherche sauvegardée")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(Color(hex: "374151"))

            Text("Sauvegardez vos critères de recherche pour y accéder rapidement")
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "6B7280"))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)

            Button(action: { showCreateSearch = true }) {
                HStack(spacing: 8) {
                    Image(systemName: "plus")
                    Text("Créer une recherche")
                }
                .font(.system(size: 15, weight: .semibold))
                .foregroundColor(.white)
                .padding(.horizontal, 24)
                .padding(.vertical, 12)
                .background(
                    LinearGradient(
                        colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(999)
            }
            .padding(.top, 8)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 64)
    }
}

// MARK: - Saved Search Card

struct SavedSearchCard: View {
    let search: SavedSearch
    let onTap: () -> Void
    let onDelete: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    Image(systemName: "bookmark.fill")
                        .font(.system(size: 16))
                        .foregroundColor(Color(hex: "6E56CF"))

                    Text(search.name)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    Spacer()

                    Button(action: onDelete) {
                        Image(systemName: "trash")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "EF4444"))
                    }
                }

                // Search criteria
                VStack(alignment: .leading, spacing: 8) {
                    if let location = search.location {
                        HStack(spacing: 8) {
                            Image(systemName: "mappin.circle.fill")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "9CA3AF"))
                            Text(location)
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "6B7280"))
                        }
                    }

                    if let priceRange = search.priceRange {
                        HStack(spacing: 8) {
                            Image(systemName: "eurosign.circle.fill")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "9CA3AF"))
                            Text(priceRange)
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "6B7280"))
                        }
                    }

                    if let propertyType = search.propertyType {
                        HStack(spacing: 8) {
                            Image(systemName: "building.2.fill")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "9CA3AF"))
                            Text(propertyType)
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "6B7280"))
                        }
                    }
                }

                // Notification toggle
                HStack {
                    Image(systemName: search.notificationsEnabled ? "bell.fill" : "bell.slash.fill")
                        .font(.system(size: 12))
                        .foregroundColor(search.notificationsEnabled ? Color(hex: "3B82F6") : Color(hex: "9CA3AF"))

                    Text(search.notificationsEnabled ? "Alertes activées" : "Alertes désactivées")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(Color(hex: "6B7280"))

                    Spacer()

                    Text(search.formattedDate)
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "9CA3AF"))
                }
            }
            .padding(16)
            .background(Color.white)
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 2)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Create Saved Search View

struct CreateSavedSearchView: View {
    @ObservedObject var viewModel: SavedSearchesViewModel
    @Environment(\.dismiss) private var dismiss

    @State private var name = ""
    @State private var location = ""
    @State private var minPrice = ""
    @State private var maxPrice = ""
    @State private var propertyType = "Tous types"
    @State private var notificationsEnabled = true

    let propertyTypes = ["Tous types", "Appartement", "Studio", "Maison", "Loft"]

    var body: some View {
        NavigationStack {
            Form {
                Section("Informations") {
                    TextField("Nom de la recherche", text: $name)
                }

                Section("Critères") {
                    TextField("Ville ou quartier", text: $location)

                    HStack {
                        TextField("Prix min", text: $minPrice)
                            .keyboardType(.numberPad)
                        Text("-")
                        TextField("Prix max", text: $maxPrice)
                            .keyboardType(.numberPad)
                    }

                    Picker("Type de bien", selection: $propertyType) {
                        ForEach(propertyTypes, id: \.self) { type in
                            Text(type).tag(type)
                        }
                    }
                }

                Section("Notifications") {
                    Toggle("Recevoir des alertes", isOn: $notificationsEnabled)
                }
            }
            .navigationTitle("Nouvelle recherche")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") {
                        dismiss()
                    }
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Sauvegarder") {
                        saveSearch()
                    }
                    .disabled(name.isEmpty)
                }
            }
        }
    }

    private func saveSearch() {
        let priceRange = !minPrice.isEmpty || !maxPrice.isEmpty ?
            "\(minPrice.isEmpty ? "0" : minPrice)€ - \(maxPrice.isEmpty ? "∞" : maxPrice + "€")" : nil

        viewModel.createSearch(
            name: name,
            location: location.isEmpty ? nil : location,
            priceRange: priceRange,
            propertyType: propertyType == "Tous types" ? nil : propertyType,
            notificationsEnabled: notificationsEnabled
        )
        dismiss()
    }
}

// MARK: - Saved Search Model

// struct SavedSearch: Identifiable {
//     let id: String
//     let name: String
//     let location: String?
//     let priceRange: String?
//     let propertyType: String?
//     let notificationsEnabled: Bool
//     let createdAt: Date
// 
//     var formattedDate: String {
//         let formatter = RelativeDateTimeFormatter()
//         formatter.unitsStyle = .short
//         return formatter.localizedString(for: createdAt, relativeTo: Date())
//     }
// }

// MARK: - View Model

@MainActor
class SavedSearchesViewModel: ObservableObject {
    @Published var savedSearches: [SavedSearch] = []
    @Published var isLoading = false

    func loadSavedSearches() async {
        isLoading = true

        // Simulate API call
        try? await Task.sleep(nanoseconds: 500_000_000)

        // Mock data
        savedSearches = [
            SavedSearch(
                id: "1",
                name: "Appartements Lyon 3",
                location: "Lyon 3ème",
                priceRange: "500€ - 800€",
                propertyType: "Appartement",
                notificationsEnabled: true,
                createdAt: Date().addingTimeInterval(-86400 * 3)
            ),
            SavedSearch(
                id: "2",
                name: "Studios centre-ville",
                location: "Lyon Centre",
                priceRange: "400€ - 600€",
                propertyType: "Studio",
                notificationsEnabled: false,
                createdAt: Date().addingTimeInterval(-86400 * 7)
            )
        ]

        isLoading = false
    }

    func createSearch(name: String, location: String?, priceRange: String?, propertyType: String?, notificationsEnabled: Bool) {
        let newSearch = SavedSearch(
            id: UUID().uuidString,
            name: name,
            location: location,
            priceRange: priceRange,
            propertyType: propertyType,
            notificationsEnabled: notificationsEnabled,
            createdAt: Date()
        )
        savedSearches.insert(newSearch, at: 0)
    }

    func executeSearch(_ search: SavedSearch) {
        // Navigate to properties list with filters applied
        print("Executing search: \(search.name)")
    }

    func deleteSearch(_ search: SavedSearch) {
        savedSearches.removeAll { $0.id == search.id }
    }
}

// MARK: - Wrapper for AnyView compatibility

struct SavedSearchesWrapper: View {
    var body: some View {
        SavedSearchesView()
    }
}
