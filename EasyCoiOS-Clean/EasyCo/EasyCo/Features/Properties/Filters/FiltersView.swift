import SwiftUI

// MARK: - Filters View

struct FiltersView: View {
    @ObservedObject var viewModel: PropertiesViewModel
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Localisation")) {
                    TextField("Ville", text: Binding(
                        get: { viewModel.filters.city ?? "" },
                        set: { viewModel.filters.city = $0.isEmpty ? nil : $0 }
                    ))
                }

                Section(header: Text("Prix")) {
                    TextField("Prix minimum", value: Binding(
                        get: { viewModel.filters.minPrice },
                        set: { viewModel.filters.minPrice = $0 }
                    ), format: .number)

                    TextField("Prix maximum", value: Binding(
                        get: { viewModel.filters.maxPrice },
                        set: { viewModel.filters.maxPrice = $0 }
                    ), format: .number)
                }

                Section(header: Text("Type de bien")) {
                    Picker("Type", selection: Binding(
                        get: { viewModel.filters.propertyType ?? .apartment },
                        set: { viewModel.filters.propertyType = $0 }
                    )) {
                        ForEach(PropertyType.allCases, id: \.self) { type in
                            Text(type.rawValue).tag(type)
                        }
                    }
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
                        Task {
                            await viewModel.loadProperties()
                        }
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
