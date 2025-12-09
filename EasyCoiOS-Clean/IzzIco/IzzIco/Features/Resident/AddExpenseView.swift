//
//  AddExpenseView.swift
//  IzzIco
//
//  Formulaire moderne pour ajouter une dépense - Pinterest Style
//  Nouveau système de présentation smooth et design
//

import SwiftUI
import PhotosUI

struct AddExpenseView: View {
    @ObservedObject var viewModel: ExpensesViewModel
    @Environment(\.dismiss) var dismiss

    private let role: Theme.UserRole = .resident

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

    // Roommates (mock data)
    @State private var roommates: [ExpenseRoommate] = [
        ExpenseRoommate(id: UUID(), name: "Marie"),
        ExpenseRoommate(id: UUID(), name: "Thomas"),
        ExpenseRoommate(id: UUID(), name: "Julie"),
        ExpenseRoommate(id: UUID(), name: "Marc")
    ]
    @State private var selectedPayer: ExpenseRoommate?

    // Validation
    @State private var showValidationError = false
    @State private var validationMessage = ""

    var body: some View {
        PinterestFormContainer(
            title: "Nouvelle Dépense",
            role: role,
            isPresented: .constant(true),
            onSave: createExpense
        ) {
            VStack(spacing: Theme.PinterestSpacing.xl) {
                basicInfoSection
                amountSection
                categorySection
                dateSection
                payerSection
                splitTypeSection
                receiptSection
                validationErrorSection
            }
        }
        .onAppear {
            selectedPayer = roommates.first
        }
    }

    // MARK: - View Components

    private var basicInfoSection: some View {
        PinterestFormSection("Informations") {
            VStack(spacing: Theme.PinterestSpacing.md) {
                PinterestFormTextField(
                    placeholder: "Titre",
                    text: $title,
                    icon: "text.alignleft",
                    role: role,
                    isRequired: true
                )

                PinterestFormTextEditor(
                    placeholder: "Description",
                    text: $description,
                    role: role
                )
            }
        }
    }

    private var amountSection: some View {
        PinterestFormSection("Montant") {
            HStack(spacing: 12) {
                Image(systemName: "eurosign.circle.fill")
                    .font(.system(size: 24, weight: .medium))
                    .foregroundColor(role.primaryColor)

                TextField("0.00", text: $amount)
                    .font(Theme.PinterestTypography.heroMedium(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .keyboardType(.decimalPad)

                Text("€")
                    .font(Theme.PinterestTypography.heroMedium(.bold))
                    .foregroundColor(Theme.Colors.textSecondary)
            }
            .padding(Theme.PinterestSpacing.lg)
            .background(
                RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                    .fill(Color.white)
                    .overlay(
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                            .stroke(role.primaryColor.opacity(0.3), lineWidth: 2)
                    )
            )
            .pinterestShadow(Theme.PinterestShadows.medium)
        }
    }

    private var categorySection: some View {
        PinterestFormPickerGrid(
            title: "Catégorie",
            items: ExpenseCategory.allCases,
            selectedItem: $selectedCategory,
            icon: { $0.icon },
            label: { $0.displayName },
            color: { Color(hex: $0.color) },
            role: role,
            isRequired: true
        )
    }

    private var dateSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Date")
                .font(Theme.PinterestTypography.bodyLarge(.bold))
                .foregroundColor(Theme.Colors.textPrimary)

            DatePicker("", selection: $date, displayedComponents: .date)
                .datePickerStyle(.compact)
                .labelsHidden()
                .padding(Theme.PinterestSpacing.md)
                .background(
                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                        .fill(Color.white)
                        .overlay(
                            RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                                .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                        )
                )
                .pinterestShadow(Theme.PinterestShadows.subtle)
        }
    }

    private var payerSection: some View {
        PinterestFormSection("Payé par") {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(roommates) { roommate in
                        roommateButton(roommate)
                    }
                }
            }
        }
    }

    private func roommateButton(_ roommate: ExpenseRoommate) -> some View {
        Button(action: {
            withAnimation(Theme.PinterestAnimations.quickSpring) {
                selectedPayer = roommate
                Haptic.selection()
            }
        }) {
            VStack(spacing: 8) {
                ZStack {
                    if selectedPayer?.id == roommate.id {
                        Circle()
                            .fill(role.gradient)
                    } else {
                        Circle()
                            .fill(Color.white)
                            .overlay(
                                Circle()
                                    .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                            )
                    }

                    Text(String(roommate.name.prefix(1)))
                        .font(Theme.PinterestTypography.titleMedium(.bold))
                        .foregroundColor(selectedPayer?.id == roommate.id ? .white : role.primaryColor)
                }
                .frame(width: 56, height: 56)
                .pinterestShadow(
                    selectedPayer?.id == roommate.id
                        ? Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.3)
                        : Theme.PinterestShadows.subtle
                )

                Text(roommate.name)
                    .font(Theme.PinterestTypography.caption(selectedPayer?.id == roommate.id ? .semibold : .medium))
                    .foregroundColor(Theme.Colors.textPrimary)
            }
        }
        .buttonStyle(ScaleButtonStyle())
    }

    private var splitTypeSection: some View {
        PinterestFormSection("Répartition") {
            VStack(spacing: 12) {
                splitTypeButton(.equal)
                splitTypeButton(.custom)
            }
        }
    }

    private func splitTypeButton(_ type: SplitType) -> some View {
        Button(action: {
            withAnimation(Theme.PinterestAnimations.quickSpring) {
                splitType = type
                Haptic.selection()
            }
        }) {
            HStack {
                Image(systemName: splitType == type ? "checkmark.circle.fill" : "circle")
                    .font(.system(size: 20))
                    .foregroundColor(splitType == type ? role.primaryColor : Theme.Colors.textTertiary)

                VStack(alignment: .leading, spacing: 4) {
                    Text(type == .equal ? "Égale" : "Personnalisée")
                        .font(Theme.PinterestTypography.bodyRegular(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text(type == .equal ? "Divisé équitablement entre tous" : "Définir les montants individuellement")
                        .font(Theme.PinterestTypography.caption(.regular))
                        .foregroundColor(Theme.Colors.textSecondary)
                }

                Spacer()
            }
            .padding(Theme.PinterestSpacing.md)
            .background(
                RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                    .fill(Color.white)
                    .overlay(
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                            .stroke(
                                splitType == type ? role.primaryColor.opacity(0.4) : Color.white.opacity(0.6),
                                lineWidth: splitType == type ? 2.5 : 1.5
                            )
                    )
            )
            .pinterestShadow(splitType == type ? Theme.PinterestShadows.medium : Theme.PinterestShadows.subtle)
        }
        .buttonStyle(ScaleButtonStyle())
    }

    private var receiptSection: some View {
        PinterestFormSection("Reçu (optionnel)") {
            PhotosPicker(selection: $selectedPhoto, matching: .images) {
                HStack {
                    ZStack {
                        Circle()
                            .fill(Color(hex: "3B82F6").opacity(0.15))
                            .frame(width: 48, height: 48)

                        Image(systemName: receiptImage == nil ? "camera.fill" : "checkmark.circle.fill")
                            .font(.system(size: 22, weight: .semibold))
                            .foregroundColor(Color(hex: "3B82F6"))
                    }

                    VStack(alignment: .leading, spacing: 4) {
                        Text(receiptImage == nil ? "Ajouter un reçu" : "Reçu ajouté")
                            .font(Theme.PinterestTypography.bodyRegular(.semibold))
                            .foregroundColor(Theme.Colors.textPrimary)

                        Text("Photo ou scan du reçu")
                            .font(Theme.PinterestTypography.caption(.regular))
                            .foregroundColor(Theme.Colors.textSecondary)
                    }

                    Spacer()

                    Image(systemName: "chevron.right")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(Theme.Colors.textTertiary)
                }
                .padding(Theme.PinterestSpacing.md)
                .background(
                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                        .fill(Color.white)
                        .overlay(
                            RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                                .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                        )
                )
                .pinterestShadow(Theme.PinterestShadows.subtle)
            }
            .onChange(of: selectedPhoto) { newValue in
                _Concurrency.Task {
                    if let data = try? await newValue?.loadTransferable(type: Data.self),
                       let uiImage = UIImage(data: data) {
                        receiptImage = Image(uiImage: uiImage)
                    }
                }
            }
        }
    }

    @ViewBuilder
    private var validationErrorSection: some View {
        if showValidationError {
            HStack(spacing: 12) {
                Image(systemName: "exclamationmark.triangle.fill")
                    .font(.system(size: 18))
                    .foregroundColor(Color(hex: "EF4444"))
                Text(validationMessage)
                    .font(Theme.PinterestTypography.bodySmall(.medium))
                    .foregroundColor(Color(hex: "EF4444"))
            }
            .padding(Theme.PinterestSpacing.md)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(
                RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                    .fill(Color(hex: "FEF2F2"))
            )
        }
    }

    // MARK: - Actions

    private func createExpense() {
        // Validation
        guard validateForm() else { return }

        // Parse amount
        guard let amountValue = Double(amount.replacingOccurrences(of: ",", with: ".")) else {
            validationMessage = "Montant invalide"
            showValidationError = true
            return
        }

        // Create expense
        let splits: [ExpenseSplit] = roommates.map { roommate in
            ExpenseSplit(
                userId: roommate.id,
                userName: roommate.name,
                amount: amountValue / Double(roommates.count),
                isPaid: roommate.id == selectedPayer?.id
            )
        }

        let newExpense = Expense(
            id: UUID(),
            householdId: UUID(),
            title: title,
            description: description.isEmpty ? nil : description,
            amount: amountValue,
            category: selectedCategory,
            paidById: selectedPayer?.id ?? roommates.first!.id,
            paidByName: selectedPayer?.name ?? roommates.first!.name,
            date: date,
            receiptURL: nil,
            splitType: splitType,
            splits: splits,
            isValidated: false,
            validatedAt: nil,
            createdAt: Date(),
            updatedAt: Date()
        )

        // Add to ViewModel
        _Concurrency.Task {
            await viewModel.addExpense(newExpense)
            dismiss()
        }
    }

    private func validateForm() -> Bool {
        showValidationError = false

        if title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            validationMessage = "Le titre est obligatoire"
            showValidationError = true
            return false
        }

        if amount.isEmpty {
            validationMessage = "Le montant est obligatoire"
            showValidationError = true
            return false
        }

        if selectedPayer == nil {
            validationMessage = "Veuillez sélectionner qui a payé"
            showValidationError = true
            return false
        }

        return true
    }
}

// MARK: - Supporting Types

struct ExpenseRoommate: Identifiable {
    let id: UUID
    let name: String
}
