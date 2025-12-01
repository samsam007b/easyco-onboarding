import SwiftUI

// MARK: - Private Codes View

struct PrivateCodesView: View {
    @StateObject private var viewModel = PrivateCodesViewModel()
    @State private var showAddCode = false
    @State private var codeToEdit: PrivateCode?

    var body: some View {
        List {
            // Info section
            infoSection

            // Active codes section
            if !viewModel.activeCodes.isEmpty {
                activeCodesSection
            }

            // Used codes section
            if !viewModel.usedCodes.isEmpty {
                usedCodesSection
            }

            // Add code button
            addCodeSection
        }
        .listStyle(.insetGrouped)
        .navigationTitle("Codes privés")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showAddCode) {
            AddPrivateCodeSheet { code in
                viewModel.addCode(code)
            }
        }
        .sheet(item: $codeToEdit) { code in
            EditPrivateCodeSheet(code: code) { updatedCode in
                viewModel.updateCode(updatedCode)
            }
        }
        .task {
            await viewModel.loadCodes()
        }
    }

    // MARK: - Info Section

    private var infoSection: some View {
        Section {
            VStack(alignment: .leading, spacing: 12) {
                HStack(spacing: 10) {
                    Image(systemName: "key.fill")
                        .font(.system(size: 24))
                        .foregroundColor(Color(hex: "FFA040"))

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Codes d'accès privés")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "111827"))

                        Text("Pour accéder à des propriétés exclusives")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }

                Text("Les codes privés vous permettent d'accéder à des annonces réservées ou de bénéficier d'avantages exclusifs lors de vos candidatures.")
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "374151"))
            }
            .padding(.vertical, 4)
        }
    }

    // MARK: - Active Codes Section

    private var activeCodesSection: some View {
        Section {
            ForEach(viewModel.activeCodes) { code in
                PrivateCodeRow(code: code) {
                    codeToEdit = code
                } onDelete: {
                    viewModel.deleteCode(code)
                }
            }
        } header: {
            HStack {
                Text("Codes actifs")
                Spacer()
                Text("\(viewModel.activeCodes.count)")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 2)
                    .background(Color(hex: "10B981"))
                    .cornerRadius(999)
            }
        }
    }

    // MARK: - Used Codes Section

    private var usedCodesSection: some View {
        Section {
            ForEach(viewModel.usedCodes) { code in
                UsedCodeRow(code: code)
            }
        } header: {
            Text("Codes utilisés")
        } footer: {
            Text("Ces codes ont déjà été utilisés et ne peuvent plus être réactivés.")
        }
    }

    // MARK: - Add Code Section

    private var addCodeSection: some View {
        Section {
            Button(action: { showAddCode = true }) {
                HStack {
                    Image(systemName: "plus.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "FFA040"))

                    Text("Ajouter un code")
                        .font(.system(size: 15, weight: .medium))
                        .foregroundColor(Color(hex: "FFA040"))

                    Spacer()
                }
            }
        }
    }
}

// MARK: - Private Code Row

struct PrivateCodeRow: View {
    let code: PrivateCode
    let onEdit: () -> Void
    let onDelete: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            // Code icon
            ZStack {
                RoundedRectangle(cornerRadius: 10)
                    .fill(code.type.color.opacity(0.1))
                    .frame(width: 44, height: 44)

                Image(systemName: code.type.icon)
                    .font(.system(size: 20))
                    .foregroundColor(code.type.color)
            }

            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    Text(code.displayCode)
                        .font(.system(size: 15, weight: .semibold, design: .monospaced))
                        .foregroundColor(Color(hex: "111827"))

                    Text(code.type.label)
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(code.type.color)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(code.type.color.opacity(0.1))
                        .cornerRadius(4)
                }

                if let source = code.source {
                    Text("Via \(source)")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                // Expiry info
                HStack(spacing: 4) {
                    Image(systemName: code.isExpiringSoon ? "exclamationmark.circle.fill" : "clock")
                        .font(.system(size: 11))
                        .foregroundColor(code.isExpiringSoon ? Color(hex: "F59E0B") : Color(hex: "9CA3AF"))

                    Text(code.expiryText)
                        .font(.system(size: 11))
                        .foregroundColor(code.isExpiringSoon ? Color(hex: "F59E0B") : Color(hex: "9CA3AF"))
                }
            }

            Spacer()

            Menu {
                Button(action: onEdit) {
                    Label("Modifier", systemImage: "pencil")
                }

                Button(action: {
                    UIPasteboard.general.string = code.code
                }) {
                    Label("Copier", systemImage: "doc.on.doc")
                }

                Divider()

                Button(role: .destructive, action: onDelete) {
                    Label("Supprimer", systemImage: "trash")
                }
            } label: {
                Image(systemName: "ellipsis")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
                    .frame(width: 32, height: 32)
            }
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Used Code Row

struct UsedCodeRow: View {
    let code: PrivateCode

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 20))
                .foregroundColor(Color(hex: "D1D5DB"))

            VStack(alignment: .leading, spacing: 2) {
                Text(code.displayCode)
                    .font(.system(size: 14, design: .monospaced))
                    .foregroundColor(Color(hex: "9CA3AF"))
                    .strikethrough()

                Text("Utilisé \(code.usedDate ?? "récemment")")
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "D1D5DB"))
            }

            Spacer()
        }
    }
}

// MARK: - Add Private Code Sheet

struct AddPrivateCodeSheet: View {
    let onAdd: (PrivateCode) -> Void
    @Environment(\.dismiss) private var dismiss
    @State private var code = ""
    @State private var selectedType: PrivateCodeType = .property
    @State private var source = ""
    @State private var isValidating = false
    @State private var validationError: String?

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    TextField("Code (ex: ABC123)", text: $code)
                        .textInputAutocapitalization(.characters)
                        .font(.system(size: 16, design: .monospaced))
                        .onChange(of: code) { newValue in
                            code = newValue.uppercased().filter { $0.isLetter || $0.isNumber }
                            validationError = nil
                        }

                    if let error = validationError {
                        HStack(spacing: 6) {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .foregroundColor(Color(hex: "EF4444"))
                            Text(error)
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "EF4444"))
                        }
                    }
                } header: {
                    Text("Code")
                } footer: {
                    Text("Entrez le code qui vous a été communiqué")
                }

                Section {
                    Picker("Type de code", selection: $selectedType) {
                        ForEach(PrivateCodeType.allCases, id: \.self) { type in
                            Label(type.label, systemImage: type.icon)
                                .tag(type)
                        }
                    }
                } header: {
                    Text("Type")
                }

                Section {
                    TextField("Source (optionnel)", text: $source)
                } header: {
                    Text("Origine")
                } footer: {
                    Text("Ex: Agence Immobilière Martin, Partenaire EasyCo...")
                }
            }
            .navigationTitle("Ajouter un code")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(
                leading: Button("Annuler") { dismiss() },
                trailing: Button(action: validateAndAdd) {
                    if isValidating {
                        ProgressView()
                    } else {
                        Text("Ajouter")
                            .font(.system(size: 16, weight: .semibold))
                    }
                }
                .foregroundColor(code.count >= 4 ? Color(hex: "FFA040") : Color(hex: "D1D5DB"))
                .disabled(code.count < 4 || isValidating)
            )
        }
    }

    private func validateAndAdd() {
        isValidating = true

        // Simulate validation
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
            isValidating = false

            // Demo: accept all codes except "INVALID"
            if code == "INVALID" {
                validationError = "Code invalide ou expiré"
                return
            }

            let newCode = PrivateCode(
                id: UUID(),
                code: code,
                type: selectedType,
                source: source.isEmpty ? nil : source,
                expiryDate: Calendar.current.date(byAdding: .day, value: 30, to: Date()),
                isUsed: false,
                usedDate: nil
            )

            onAdd(newCode)
            dismiss()
        }
    }
}

// MARK: - Edit Private Code Sheet

struct EditPrivateCodeSheet: View {
    let code: PrivateCode
    let onSave: (PrivateCode) -> Void
    @Environment(\.dismiss) private var dismiss
    @State private var source: String = ""
    @State private var selectedType: PrivateCodeType = .property

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    HStack {
                        Text("Code")
                        Spacer()
                        Text(code.displayCode)
                            .font(.system(size: 15, design: .monospaced))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }

                Section {
                    Picker("Type de code", selection: $selectedType) {
                        ForEach(PrivateCodeType.allCases, id: \.self) { type in
                            Label(type.label, systemImage: type.icon)
                                .tag(type)
                        }
                    }
                } header: {
                    Text("Type")
                }

                Section {
                    TextField("Source (optionnel)", text: $source)
                } header: {
                    Text("Origine")
                }
            }
            .navigationTitle("Modifier le code")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") { dismiss() }
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Enregistrer") {
                        var updatedCode = code
                        updatedCode.type = selectedType
                        updatedCode.source = source.isEmpty ? nil : source
                        onSave(updatedCode)
                        dismiss()
                    }
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "FFA040"))
                }
            }
            .onAppear {
                source = code.source ?? ""
                selectedType = code.type
            }
        }
        .presentationDetents([.medium])
    }
}

// MARK: - Models

enum PrivateCodeType: String, CaseIterable {
    case property
    case agency
    case partner
    case promo

    var label: String {
        switch self {
        case .property: return "Propriété"
        case .agency: return "Agence"
        case .partner: return "Partenaire"
        case .promo: return "Promotion"
        }
    }

    var icon: String {
        switch self {
        case .property: return "house.fill"
        case .agency: return "building.2.fill"
        case .partner: return "handshake.fill"
        case .promo: return "tag.fill"
        }
    }

    var color: Color {
        switch self {
        case .property: return Color(hex: "FFA040")
        case .agency: return Color(hex: "6366F1")
        case .partner: return Color(hex: "10B981")
        case .promo: return Color(hex: "EC4899")
        }
    }
}

struct PrivateCode: Identifiable {
    let id: UUID
    let code: String
    var type: PrivateCodeType
    var source: String?
    let expiryDate: Date?
    var isUsed: Bool
    var usedDate: String?

    var displayCode: String {
        // Format: ABC-123
        if code.count == 6 {
            let index = code.index(code.startIndex, offsetBy: 3)
            return "\(code[..<index])-\(code[index...])"
        }
        return code
    }

    var expiryText: String {
        guard let expiry = expiryDate else { return "Pas d'expiration" }

        let formatter = RelativeDateTimeFormatter()
        formatter.locale = Locale(identifier: "fr_FR")
        formatter.unitsStyle = .short

        if expiry < Date() {
            return "Expiré"
        }

        return "Expire \(formatter.localizedString(for: expiry, relativeTo: Date()))"
    }

    var isExpiringSoon: Bool {
        guard let expiry = expiryDate else { return false }
        let daysUntilExpiry = Calendar.current.dateComponents([.day], from: Date(), to: expiry).day ?? 0
        return daysUntilExpiry <= 7 && daysUntilExpiry > 0
    }
}

// MARK: - ViewModel

@MainActor
class PrivateCodesViewModel: ObservableObject {
    @Published var activeCodes: [PrivateCode] = []
    @Published var usedCodes: [PrivateCode] = []

    func loadCodes() async {
        if AppConfig.FeatureFlags.demoMode {
            try? await Task.sleep(nanoseconds: 300_000_000)

            activeCodes = [
                PrivateCode(
                    id: UUID(),
                    code: "ABC123",
                    type: .property,
                    source: "Agence Centrale",
                    expiryDate: Calendar.current.date(byAdding: .day, value: 25, to: Date()),
                    isUsed: false,
                    usedDate: nil
                ),
                PrivateCode(
                    id: UUID(),
                    code: "PART42",
                    type: .partner,
                    source: "Newsletter EasyCo",
                    expiryDate: Calendar.current.date(byAdding: .day, value: 5, to: Date()),
                    isUsed: false,
                    usedDate: nil
                ),
                PrivateCode(
                    id: UUID(),
                    code: "PROMO2024",
                    type: .promo,
                    source: nil,
                    expiryDate: Calendar.current.date(byAdding: .month, value: 2, to: Date()),
                    isUsed: false,
                    usedDate: nil
                )
            ]

            usedCodes = [
                PrivateCode(
                    id: UUID(),
                    code: "OLD456",
                    type: .agency,
                    source: "Agence Martin",
                    expiryDate: nil,
                    isUsed: true,
                    usedDate: "il y a 2 mois"
                )
            ]
        }
    }

    func addCode(_ code: PrivateCode) {
        activeCodes.insert(code, at: 0)
    }

    func updateCode(_ code: PrivateCode) {
        if let index = activeCodes.firstIndex(where: { $0.id == code.id }) {
            activeCodes[index] = code
        }
    }

    func deleteCode(_ code: PrivateCode) {
        activeCodes.removeAll { $0.id == code.id }
    }
}

// MARK: - Preview

struct PrivateCodesView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            PrivateCodesView()
        }
    }
}
