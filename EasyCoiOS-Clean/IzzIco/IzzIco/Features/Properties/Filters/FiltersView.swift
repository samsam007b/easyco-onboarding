import SwiftUI

// MARK: - Filters View

struct FiltersView: View {
    @ObservedObject var viewModel: PropertiesViewModel
    @Environment(\.dismiss) private var dismiss

    @State private var tempFilters: PropertyFilters

    init(viewModel: PropertiesViewModel) {
        self.viewModel = viewModel
        _tempFilters = State(initialValue: viewModel.filters ?? PropertyFilters())
    }

    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Localisation")) {
                    TextField("Ville", text: Binding(
                        get: { tempFilters.city ?? "" },
                        set: { tempFilters.city = $0.isEmpty ? nil : $0 }
                    ))
                }

                Section(header: Text("Prix")) {
                    TextField("Prix minimum", value: Binding(
                        get: { tempFilters.minPrice },
                        set: { tempFilters.minPrice = $0 }
                    ), format: .number)

                    TextField("Prix maximum", value: Binding(
                        get: { tempFilters.maxPrice },
                        set: { tempFilters.maxPrice = $0 }
                    ), format: .number)
                }

                Section(header: Text("Type de bien")) {
                    // Property types is an array, we'll show multi-select later
                    // For now, just showing a simple note
                    Text("Tous types")
                        .foregroundColor(.secondary)
                }
            }
            .navigationTitle("Filtres")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Appliquer") {
                        viewModel.filters = tempFilters
                        dismiss()
                    }
                }
            }
        }
    }
}

struct FiltersView_Previews: PreviewProvider {
    static var previews: some View {
        FiltersView(viewModel: PropertiesViewModel())
    }
}
