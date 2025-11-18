//
//  AddExpenseView.swift
//  EasyCo
//
//  Formulaire pour ajouter une nouvelle dépense partagée
//  Inclut: montant, catégorie, répartition, upload de reçu
//

import SwiftUI
import PhotosUI

struct AddExpenseView: View {
    @ObservedObject var viewModel: ExpensesViewModel
    @Environment(\.dismiss) var dismiss

    // Form fields
    @State private var title = ""
    @State private var description = ""
    @State private var amount = ""
    @State private var selectedCategory: ExpenseCategory = .groceries
    @State private var date = Date()
    @State private var splitType: SplitType = .equal

    // Photo picker
    @State private var selectedPhoto: PhotosPickerItem?
    @State private var receiptImage: Image?
    @State private var hasReceipt = false

    // Roommates (mock data - à remplacer par données réelles)
    @State private var roommates: [Roommate] = [
        Roommate(id: UUID(), name: "Marie"),
        Roommate(id: UUID(), name: "Thomas"),
        Roommate(id: UUID(), name: "Julie"),
        Roommate(id: UUID(), name: "Marc")
    ]
    @State private var selectedPayer: Roommate?

    // Custom split
    @State private var customSplits: [UUID: String] = [:] // RoommateID -> amount string

    // Validation
    @State private var showValidationError = false
    @State private var validationMessage = ""

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Basic Info
                    basicInfoSection

                    // Amount
                    amountSection

                    // Category
                    categorySection

                    // Date
                    dateSection

                    // Who paid
                    whoPaidSection

                    // Split Type
                    splitTypeSection

                    // Custom splits if needed
                    if splitType == .custom {
                        customSplitsSection
                    }

                    // Receipt
                    receiptSection
                }
                .padding(16)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Nouvelle Dépense")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") {
                        dismiss()
                    }
                    .foregroundColor(Color(hex: "6B7280"))
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: createExpense) {
                        Text("Créer")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 20)
                            .padding(.vertical, 8)
                            .background(Color(hex: "E8865D"))
                            .cornerRadius(10)
                    }
                }
            }
            .alert("Erreur", isPresented: $showValidationError) {
                Button("OK", role: .cancel) {}
            } message: {
                Text(validationMessage)
            }
        }
        .onAppear {
            // Select first roommate as default payer
            selectedPayer = roommates.first
            // Initialize custom splits
            for roommate in roommates {
                customSplits[roommate.id] = "0"
            }
        }
    }

    // MARK: - Basic Info Section

    private var basicInfoSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Informations")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            VStack(spacing: 16) {
                // Title
                VStack(alignment: .leading, spacing: 8) {
                    Text("Titre *")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "374151"))

                    TextField("Ex: Courses de la semaine", text: $title)
                        .font(.system(size: 16))
                        .padding(12)
                        .background(Color.white)
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                        )
                }

                // Description (optional)
                VStack(alignment: .leading, spacing: 8) {
                    Text("Description")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "374151"))

                    TextField("Détails supplémentaires...", text: $description, axis: .vertical)
                        .font(.system(size: 16))
                        .lineLimit(3...6)
                        .padding(12)
                        .background(Color.white)
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                        )
                }
            }
        }
    }

    // MARK: - Amount Section

    private var amountSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Montant")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            HStack {
                TextField("0.00", text: $amount)
                    .font(.system(size: 24, weight: .bold))
                    .keyboardType(.decimalPad)
                    .multilineTextAlignment(.trailing)
                    .padding(16)
                    .background(Color.white)
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color(hex: "E8865D"), lineWidth: 2)
                    )

                Text("€")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "E8865D"))
            }
        }
    }

    // MARK: - Category Section

    private var categorySection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Catégorie")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                ForEach(ExpenseCategory.allCases, id: \.self) { category in
                    CategoryButton(
                        category: category,
                        isSelected: selectedCategory == category,
                        action: { selectedCategory = category }
                    )
                }
            }
        }
    }

    // MARK: - Date Section

    private var dateSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Date")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            DatePicker(
                "",
                selection: $date,
                in: ...Date(),
                displayedComponents: .date
            )
            .datePickerStyle(.graphical)
            .padding(12)
            .background(Color.white)
            .cornerRadius(12)
        }
    }

    // MARK: - Who Paid Section

    private var whoPaidSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Payé par")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            VStack(spacing: 8) {
                ForEach(roommates) { roommate in
                    Button(action: { selectedPayer = roommate }) {
                        HStack {
                            Circle()
                                .fill(selectedPayer?.id == roommate.id ? Color(hex: "E8865D") : Color.white)
                                .frame(width: 20, height: 20)
                                .overlay(
                                    Circle()
                                        .stroke(selectedPayer?.id == roommate.id ? Color(hex: "E8865D") : Color(hex: "E5E7EB"), lineWidth: 2)
                                )
                                .overlay(
                                    Circle()
                                        .fill(Color.white)
                                        .frame(width: 8, height: 8)
                                        .opacity(selectedPayer?.id == roommate.id ? 1 : 0)
                                )

                            Text(roommate.name)
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "111827"))

                            Spacer()
                        }
                        .padding(12)
                        .background(Color.white)
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(selectedPayer?.id == roommate.id ? Color(hex: "E8865D") : Color(hex: "E5E7EB"), lineWidth: 1)
                        )
                    }
                }
            }
        }
    }

    // MARK: - Split Type Section

    private var splitTypeSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Répartition")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            VStack(spacing: 8) {
                ForEach(SplitType.allCases, id: \.self) { type in
                    Button(action: { splitType = type }) {
                        HStack {
                            Circle()
                                .fill(splitType == type ? Color(hex: "E8865D") : Color.white)
                                .frame(width: 20, height: 20)
                                .overlay(
                                    Circle()
                                        .stroke(splitType == type ? Color(hex: "E8865D") : Color(hex: "E5E7EB"), lineWidth: 2)
                                )
                                .overlay(
                                    Circle()
                                        .fill(Color.white)
                                        .frame(width: 8, height: 8)
                                        .opacity(splitType == type ? 1 : 0)
                                )

                            VStack(alignment: .leading, spacing: 2) {
                                Text(type.displayName)
                                    .font(.system(size: 16, weight: .medium))
                                    .foregroundColor(Color(hex: "111827"))

                                if let desc = type.description {
                                    Text(desc)
                                        .font(.system(size: 13))
                                        .foregroundColor(Color(hex: "6B7280"))
                                }
                            }

                            Spacer()
                        }
                        .padding(12)
                        .background(Color.white)
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(splitType == type ? Color(hex: "E8865D") : Color(hex: "E5E7EB"), lineWidth: 1)
                        )
                    }
                }
            }
        }
    }

    // MARK: - Custom Splits Section

    private var customSplitsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Montants personnalisés")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            VStack(spacing: 12) {
                ForEach(roommates) { roommate in
                    HStack {
                        Text(roommate.name)
                            .font(.system(size: 15))
                            .foregroundColor(Color(hex: "111827"))
                            .frame(width: 80, alignment: .leading)

                        TextField("0.00", text: Binding(
                            get: { customSplits[roommate.id] ?? "0" },
                            set: { customSplits[roommate.id] = $0 }
                        ))
                        .font(.system(size: 16))
                        .keyboardType(.decimalPad)
                        .multilineTextAlignment(.trailing)
                        .padding(12)
                        .background(Color.white)
                        .cornerRadius(8)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                        )

                        Text("€")
                            .font(.system(size: 16))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }

                // Total custom
                let customTotal = customSplits.values.compactMap { Double($0) }.reduce(0, +)
                let mainAmount = Double(amount) ?? 0
                let difference = mainAmount - customTotal

                HStack {
                    Text("Total")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    Spacer()

                    Text(String(format: "%.2f€", customTotal))
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(abs(difference) < 0.01 ? Color(hex: "10B981") : Color(hex: "EF4444"))

                    if abs(difference) > 0.01 {
                        Text("(reste \(String(format: "%.2f€", difference)))")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "EF4444"))
                    }
                }
                .padding(12)
                .background(Color(hex: "F9FAFB"))
                .cornerRadius(8)
            }
        }
    }

    // MARK: - Receipt Section

    private var receiptSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Reçu (optionnel)")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            PhotosPicker(selection: $selectedPhoto, matching: .images) {
                HStack {
                    Image(systemName: hasReceipt ? "checkmark.circle.fill" : "camera")
                        .font(.system(size: 20))
                        .foregroundColor(hasReceipt ? Color(hex: "10B981") : Color(hex: "6B7280"))

                    Text(hasReceipt ? "Reçu ajouté" : "Ajouter un reçu")
                        .font(.system(size: 16))
                        .foregroundColor(Color(hex: "111827"))

                    Spacer()

                    Image(systemName: "chevron.right")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "9CA3AF"))
                }
                .padding(16)
                .background(Color.white)
                .cornerRadius(12)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(hasReceipt ? Color(hex: "10B981") : Color(hex: "E5E7EB"), lineWidth: 1)
                )
            }
            .onChange(of: selectedPhoto) { _ in
                _Concurrency.Task {
                    if let data = try? await selectedPhoto?.loadTransferable(type: Data.self),
                       let uiImage = UIImage(data: data) {
                        receiptImage = Image(uiImage: uiImage)
                        hasReceipt = true
                    }
                }
            }

            if let image = receiptImage {
                image
                    .resizable()
                    .scaledToFit()
                    .frame(maxHeight: 200)
                    .cornerRadius(12)
            }
        }
    }

    // MARK: - Create Expense

    private func createExpense() {
        guard validateForm() else { return }

        guard let amountValue = Double(amount),
              let payer = selectedPayer else { return }

        // Calculate splits
        let splits: [ExpenseSplit]
        if splitType == .equal {
            let perPerson = amountValue / Double(roommates.count)
            splits = roommates.map { roommate in
                ExpenseSplit(
                    userId: roommate.id,
                    userName: roommate.name,
                    amount: perPerson,
                    isPaid: roommate.id == payer.id
                )
            }
        } else {
            splits = roommates.compactMap { roommate in
                guard let amountStr = customSplits[roommate.id],
                      let splitAmount = Double(amountStr),
                      splitAmount > 0 else { return nil }
                return ExpenseSplit(
                    userId: roommate.id,
                    userName: roommate.name,
                    amount: splitAmount,
                    isPaid: roommate.id == payer.id
                )
            }
        }

        let expense = Expense(
            householdId: UUID(), // TODO: use real household ID
            title: title,
            description: description.isEmpty ? nil : description,
            amount: amountValue,
            category: selectedCategory,
            paidById: payer.id,
            paidByName: payer.name,
            date: date,
            splitType: splitType,
            splits: splits,
            isValidated: true
        )

        _Concurrency.Task {
            await viewModel.addExpense(expense)
            dismiss()
        }
    }

    // MARK: - Validation

    private func validateForm() -> Bool {
        if title.isEmpty {
            validationMessage = "Veuillez entrer un titre"
            showValidationError = true
            return false
        }

        guard let amountValue = Double(amount), amountValue > 0 else {
            validationMessage = "Veuillez entrer un montant valide"
            showValidationError = true
            return false
        }

        if selectedPayer == nil {
            validationMessage = "Veuillez sélectionner qui a payé"
            showValidationError = true
            return false
        }

        if splitType == .custom {
            let customTotal = customSplits.values.compactMap { Double($0) }.reduce(0, +)
            if abs(customTotal - amountValue) > 0.01 {
                validationMessage = "La somme des montants personnalisés doit égaler le montant total"
                showValidationError = true
                return false
            }
        }

        return true
    }
}

// MARK: - Category Button Component

struct CategoryButton: View {
    let category: ExpenseCategory
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                ZStack {
                    Circle()
                        .fill(isSelected ? Color(hex: category.color) : Color(hex: category.color).opacity(0.1))
                        .frame(width: 48, height: 48)

                    Image(systemName: category.icon)
                        .font(.system(size: 20))
                        .foregroundColor(isSelected ? .white : Color(hex: category.color))
                }

                Text(category.displayName)
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(isSelected ? Color(hex: "111827") : Color(hex: "6B7280"))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(Color.white)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(isSelected ? Color(hex: category.color) : Color(hex: "E5E7EB"), lineWidth: isSelected ? 2 : 1)
            )
        }
    }
}

// MARK: - Roommate Model

struct Roommate: Identifiable {
    let id: UUID
    let name: String
}

// MARK: - SplitType Extension

extension SplitType {
    var description: String? {
        switch self {
        case .equal: return "Divisé équitablement entre tous"
        case .custom: return "Définir les montants individuellement"
        }
    }
}

// MARK: - Preview

struct AddExpenseView_Previews: PreviewProvider {
    static var previews: some View {
        AddExpenseView(viewModel: ExpensesViewModel())
    }
}
