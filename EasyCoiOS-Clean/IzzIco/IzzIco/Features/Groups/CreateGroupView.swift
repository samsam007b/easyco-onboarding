import SwiftUI

// MARK: - Create Group View

struct CreateGroupView: View {
    @StateObject private var viewModel = CreateGroupViewModel()
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    // Header
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            ZStack {
                                Circle()
                                    .fill(Color(hex: "FFF4ED"))
                                    .frame(width: 60, height: 60)

                                Image(systemName: "person.3.fill")
                                    .font(.system(size: 24))
                                    .foregroundColor(Color(hex: "FFA040"))
                            }

                            VStack(alignment: .leading, spacing: 4) {
                                Text("Créer un groupe de recherche")
                                    .font(.system(size: 20, weight: .bold))
                                    .foregroundColor(Color(hex: "111827"))

                                Text("Cherchez ensemble avec vos futurs colocataires")
                                    .font(.system(size: 14))
                                    .foregroundColor(Color(hex: "6B7280"))
                            }
                        }
                    }
                    .padding(.horizontal, 24)
                    .padding(.top, 24)

                    // Group Info
                    VStack(alignment: .leading, spacing: 20) {
                        Text("Informations du groupe")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "111827"))

                        FormField(label: "Nom du groupe") {
                            TextField("Ex: Coloc Paris Centre", text: $viewModel.groupName)
                        }

                        FormField(label: "Description") {
                            TextEditor(text: $viewModel.groupDescription)
                                .frame(height: 100)
                        }

                        FormField(label: "Nombre de colocataires") {
                            Picker("", selection: $viewModel.numberOfMembers) {
                                ForEach(2...8, id: \.self) { count in
                                    Text("\(count) personnes").tag(count)
                                }
                            }
                            .pickerStyle(.menu)
                        }
                    }
                    .padding(.horizontal, 24)

                    // Criteria
                    VStack(alignment: .leading, spacing: 20) {
                        Text("Critères de recherche communs")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "111827"))

                        // Budget
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Budget total par mois")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(Color(hex: "374151"))

                            HStack {
                                Text("€\(Int(viewModel.minBudget))")
                                    .font(.system(size: 14, weight: .semibold))
                                Spacer()
                                Text("€\(Int(viewModel.maxBudget))")
                                    .font(.system(size: 14, weight: .semibold))
                            }
                            .foregroundColor(Color(hex: "FFA040"))

                            VStack(spacing: 8) {
                                Text("Minimum")
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "6B7280"))
                                    .frame(maxWidth: .infinity, alignment: .leading)

                                Slider(
                                    value: $viewModel.minBudget,
                                    in: 500...5000,
                                    step: 100
                                )
                                .tint(Color(hex: "FFA040"))
                            }

                            VStack(spacing: 8) {
                                Text("Maximum")
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "6B7280"))
                                    .frame(maxWidth: .infinity, alignment: .leading)

                                Slider(
                                    value: $viewModel.maxBudget,
                                    in: 500...5000,
                                    step: 100
                                )
                                .tint(Color(hex: "FFA040"))
                            }
                        }
                        .padding(16)
                        .background(Color.white)
                        .cornerRadius(12)

                        // Cities
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Villes souhaitées")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(Color(hex: "374151"))

                            FlowLayout(spacing: 8) {
                                ForEach(["Paris", "Lyon", "Bruxelles", "Marseille", "Toulouse", "Bordeaux"], id: \.self) { city in
                                    Button(action: {
                                        if viewModel.selectedCities.contains(city) {
                                            viewModel.selectedCities.removeAll { $0 == city }
                                        } else {
                                            viewModel.selectedCities.append(city)
                                        }
                                    }) {
                                        Text(city)
                                            .font(.system(size: 14, weight: .medium))
                                            .foregroundColor(viewModel.selectedCities.contains(city) ? .white : Color(hex: "374151"))
                                            .padding(.horizontal, 16)
                                            .padding(.vertical, 8)
                                            .background(viewModel.selectedCities.contains(city) ? Color(hex: "FFA040") : Color(hex: "F3F4F6"))
                                            .cornerRadius(999)
                                    }
                                }
                            }
                        }
                        .padding(16)
                        .background(Color.white)
                        .cornerRadius(12)
                    }
                    .padding(.horizontal, 24)

                    // Invite Members
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Inviter des membres (optionnel)")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "111827"))

                        Text("Vous pourrez inviter des personnes par email après la création du groupe")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                    .padding(.horizontal, 24)
                }
                .padding(.bottom, 100)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: { dismiss() }) {
                        Text("Annuler")
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }
            }
            .safeAreaInset(edge: .bottom) {
                createButton
            }
        }
    }

    // MARK: - Create Button

    private var createButton: some View {
        Button(action: {
            _Concurrency.Task {
                await viewModel.createGroup()
                dismiss()
            }
        }) {
            Text("Créer le groupe")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
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
                .opacity(viewModel.isValid ? 1.0 : 0.5)
        }
        .disabled(!viewModel.isValid)
        .padding(16)
        .background(Color.white)
        .shadow(color: .black.opacity(0.05), radius: 10, x: 0, y: -5)
    }
}

// MARK: - ViewModel

class CreateGroupViewModel: ObservableObject {
    @Published var groupName = ""
    @Published var groupDescription = ""
    @Published var numberOfMembers = 3
    @Published var minBudget: Double = 1000
    @Published var maxBudget: Double = 2000
    @Published var selectedCities: [String] = []

    var isValid: Bool {
        !groupName.isEmpty &&
        !groupDescription.isEmpty &&
        !selectedCities.isEmpty &&
        minBudget < maxBudget
    }

    func createGroup() async {
        // TODO: API call
        try? await _Concurrency.Task.sleep(nanoseconds: 1_000_000_000)
    }
}

// MARK: - Preview

struct CreateGroupView_Previews: PreviewProvider {
    static var previews: some View {
        CreateGroupView()
    }
}
