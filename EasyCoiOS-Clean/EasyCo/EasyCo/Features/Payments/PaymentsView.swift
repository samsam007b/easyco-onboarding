//
//  PaymentsView.swift
//  EasyCo
//
//  Main payments view with tabs for pending, history, and payment methods
//

import SwiftUI

struct PaymentsView: View {
    @StateObject private var paymentService = PaymentService.shared
    @State private var selectedTab = 0

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Tab selector
                Picker("", selection: $selectedTab) {
                    Text("À payer").tag(0)
                    Text("Historique").tag(1)
                    Text("Méthodes").tag(2)
                }
                .pickerStyle(.segmented)
                .padding(16)
                .background(Color.white)

                // Content
                Group {
                    switch selectedTab {
                    case 0:
                        PendingPaymentsView()
                    case 1:
                        TransactionHistoryView()
                    case 2:
                        PaymentMethodsView()
                    default:
                        EmptyView()
                    }
                }
            }
            .background(Theme.Colors.backgroundSecondary)
            .navigationTitle("Paiements")
            .navigationBarTitleDisplayMode(.inline)
        }
        .task {
            await paymentService.fetchPaymentMethods()
            await paymentService.fetchPendingPayments()
            await paymentService.fetchTransactions()
        }
    }
}

// MARK: - Pending Payments View

struct PendingPaymentsView: View {
    @ObservedObject private var paymentService = PaymentService.shared
    @State private var selectedPayment: PendingPayment?
    @State private var showPaymentSheet = false

    var body: some View {
        Group {
            if paymentService.isLoading {
                LoadingView(message: "Chargement...")
            } else if paymentService.pendingPayments.isEmpty {
                emptyState
            } else {
                ScrollView {
                    VStack(spacing: 16) {
                        // Summary card
                        summaryCard

                        // Pending payments list
                        ForEach(paymentService.pendingPayments) { payment in
                            PendingPaymentCard(payment: payment) {
                                selectedPayment = payment
                                showPaymentSheet = true
                            }
                        }
                    }
                    .padding(16)
                }
            }
        }
        .sheet(isPresented: $showPaymentSheet) {
            if let payment = selectedPayment {
                PayNowSheet(payment: payment)
            }
        }
    }

    private var summaryCard: some View {
        VStack(spacing: 16) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Total à payer")
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)

                    Text(totalAmount)
                        .font(Theme.Typography.title1(.bold))
                        .foregroundColor(Theme.Colors.textPrimary)
                }

                Spacer()

                ZStack {
                    Circle()
                        .fill(Theme.Colors.Owner._100)
                        .frame(width: 56, height: 56)

                    Image(systemName: "creditcard.fill")
                        .font(.system(size: 24))
                        .foregroundColor(Theme.Colors.Owner.primary)
                }
            }

            if hasOverdue {
                HStack(spacing: 8) {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .foregroundColor(Theme.Colors.error)

                    Text("Vous avez des paiements en retard")
                        .font(Theme.Typography.bodySmall(.medium))
                        .foregroundColor(Theme.Colors.error)

                    Spacer()
                }
                .padding(12)
                .background(Theme.Colors.errorLight)
                .cornerRadius(Theme.CornerRadius.lg)
            }
        }
        .padding(20)
        .background(Color.white)
        .cornerRadius(Theme.CornerRadius.xl)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
    }

    private var emptyState: some View {
        VStack(spacing: 24) {
            Spacer()

            ZStack {
                Circle()
                    .fill(Theme.Colors.success.opacity(0.1))
                    .frame(width: 100, height: 100)

                Image(systemName: "checkmark.circle.fill")
                    .font(.system(size: 48))
                    .foregroundColor(Theme.Colors.success)
            }

            VStack(spacing: 8) {
                Text("Tout est réglé !")
                    .font(Theme.Typography.title3(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Vous n'avez aucun paiement en attente")
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
            }

            Spacer()
        }
    }

    private var totalAmount: String {
        let total = paymentService.pendingPayments.reduce(Decimal(0)) { $0 + Decimal($1.amount) }
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "EUR"
        return formatter.string(from: total as NSDecimalNumber) ?? "€0"
    }

    private var hasOverdue: Bool {
        paymentService.pendingPayments.contains { $0.isOverdue }
    }
}

// MARK: - Pending Payment Card

struct PendingPaymentCard: View {
    let payment: PendingPayment
    let onPay: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            HStack(alignment: .top) {
                // Icon
                ZStack {
                    Circle()
                        .fill(payment.isOverdue ? Theme.Colors.errorLight : Theme.Colors.Owner._100)
                        .frame(width: 44, height: 44)

                    Image(systemName: payment.type.icon)
                        .font(.system(size: 20))
                        .foregroundColor(payment.isOverdue ? Theme.Colors.error : Theme.Colors.Owner.primary)
                }

                // Info
                VStack(alignment: .leading, spacing: 4) {
                    Text(payment.description)
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    if let propertyTitle = payment.propertyTitle {
                        Text(propertyTitle)
                            .font(Theme.Typography.bodySmall())
                            .foregroundColor(Theme.Colors.textSecondary)
                    }

                    HStack(spacing: 4) {
                        Image(systemName: "calendar")
                            .font(.system(size: 12))

                        Text("Échéance: \(payment.dueDate.formatted(date: .abbreviated, time: .omitted))")
                            .font(Theme.Typography.caption())
                    }
                    .foregroundColor(payment.isOverdue ? Theme.Colors.error : Theme.Colors.textTertiary)
                }

                Spacer()

                // Amount
                Text(payment.formattedAmount)
                    .font(Theme.Typography.body(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)
            }

            // Pay button
            Button(action: onPay) {
                Text("Payer maintenant")
                    .font(Theme.Typography.bodySmall(.semibold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(Theme.Gradients.ownerCTA)
                    .cornerRadius(Theme.CornerRadius.lg)
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(Theme.CornerRadius.xl)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Transaction History View

struct TransactionHistoryView: View {
    @ObservedObject private var paymentService = PaymentService.shared

    var body: some View {
        Group {
            if paymentService.isLoading && paymentService.transactions.isEmpty {
                LoadingView(message: "Chargement...")
            } else if paymentService.transactions.isEmpty {
                emptyState
            } else {
                List {
                    ForEach(groupedTransactions.keys.sorted().reversed(), id: \.self) { month in
                        Section(header: Text(month)) {
                            ForEach(groupedTransactions[month] ?? []) { transaction in
                                TransactionRow(transaction: transaction)
                            }
                        }
                    }
                }
                .listStyle(.insetGrouped)
            }
        }
    }

    private var emptyState: some View {
        VStack(spacing: 24) {
            Spacer()

            ZStack {
                Circle()
                    .fill(Theme.GrayColors._100)
                    .frame(width: 100, height: 100)

                Image(systemName: "doc.text")
                    .font(.system(size: 48))
                    .foregroundColor(Theme.GrayColors._400)
            }

            VStack(spacing: 8) {
                Text("Aucune transaction")
                    .font(Theme.Typography.title3(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Votre historique de paiements apparaîtra ici")
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
            }

            Spacer()
        }
    }

    private var groupedTransactions: [String: [Transaction]] {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMMM yyyy"
        formatter.locale = Locale(identifier: "fr_FR")

        return Dictionary(grouping: paymentService.transactions) { transaction in
            formatter.string(from: transaction.date)
        }
    }
}

// MARK: - Transaction Row

struct TransactionRow: View {
    let transaction: Transaction

    var body: some View {
        HStack(spacing: 12) {
            // Icon
            ZStack {
                Circle()
                    .fill(statusColor.opacity(0.1))
                    .frame(width: 40, height: 40)

                Image(systemName: transaction.type.icon)
                    .font(.system(size: 16))
                    .foregroundColor(statusColor)
            }

            // Info
            VStack(alignment: .leading, spacing: 2) {
                Text(transaction.description ?? transaction.type.displayName)
                    .font(Theme.Typography.bodySmall(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(transaction.createdAt.formatted(date: .abbreviated, time: .shortened))
                    .font(Theme.Typography.caption())
                    .foregroundColor(Theme.Colors.textTertiary)
            }

            Spacer()

            // Amount and status
            VStack(alignment: .trailing, spacing: 2) {
                Text(transaction.formattedAmount)
                    .font(Theme.Typography.bodySmall(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(transaction.status.displayName)
                    .font(Theme.Typography.caption(.medium))
                    .foregroundColor(statusColor)
            }
        }
        .padding(.vertical, 4)
    }

    private var statusColor: Color {
        switch transaction.status {
        case .completed: return Theme.Colors.success
        case .pending, .processing: return Theme.Colors.warning
        case .failed, .cancelled: return Theme.Colors.error
        case .refunded: return Theme.Colors.info
        }
    }
}

// MARK: - Payment Methods View

struct PaymentMethodsView: View {
    @ObservedObject private var paymentService = PaymentService.shared
    @State private var showAddMethod = false

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Payment methods list
                ForEach(paymentService.paymentMethods) { method in
                    PaymentMethodCard(method: method)
                }

                // Add new method button
                Button(action: { showAddMethod = true }) {
                    HStack(spacing: 12) {
                        ZStack {
                            Circle()
                                .fill(Theme.Colors.Owner._100)
                                .frame(width: 44, height: 44)

                            Image(systemName: "plus")
                                .font(.system(size: 20, weight: .semibold))
                                .foregroundColor(Theme.Colors.Owner.primary)
                        }

                        Text("Ajouter un moyen de paiement")
                            .font(Theme.Typography.body(.semibold))
                            .foregroundColor(Theme.Colors.Owner.primary)

                        Spacer()

                        Image(systemName: "chevron.right")
                            .font(.system(size: 14))
                            .foregroundColor(Theme.Colors.textTertiary)
                    }
                    .padding(16)
                    .background(Color.white)
                    .cornerRadius(Theme.CornerRadius.xl)
                }

                // Auto-pay section
                autoPaySection
            }
            .padding(16)
        }
        .sheet(isPresented: $showAddMethod) {
            AddPaymentMethodView()
        }
    }

    private var autoPaySection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Paiement automatique")
                .font(Theme.Typography.body(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)

            VStack(spacing: 12) {
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Prélèvement automatique")
                            .font(Theme.Typography.bodySmall(.medium))
                            .foregroundColor(Theme.Colors.textPrimary)

                        Text("Payez votre loyer automatiquement chaque mois")
                            .font(Theme.Typography.caption())
                            .foregroundColor(Theme.Colors.textSecondary)
                    }

                    Spacer()

                    Toggle("", isOn: .constant(false))
                        .tint(Theme.Colors.Owner.primary)
                }
            }
            .padding(16)
            .background(Color.white)
            .cornerRadius(Theme.CornerRadius.lg)
        }
    }
}

// MARK: - Payment Method Card

struct PaymentMethodCard: View {
    let method: PaymentMethod
    @ObservedObject private var paymentService = PaymentService.shared

    var body: some View {
        HStack(spacing: 12) {
            // Icon
            ZStack {
                RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                    .fill(Theme.Colors.Owner._100)
                    .frame(width: 44, height: 44)

                Image(systemName: method.icon)
                    .font(.system(size: 20))
                    .foregroundColor(Theme.Colors.Owner.primary)
            }

            // Info
            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 8) {
                    Text(method.displayName)
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    if method.isDefault {
                        Text("Par défaut")
                            .font(Theme.Typography.caption(.medium))
                            .foregroundColor(Theme.Colors.Owner.primary)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 2)
                            .background(Theme.Colors.Owner._100)
                            .cornerRadius(Theme.CornerRadius.sm)
                    }
                }

                if let expiry = expiryText {
                    Text(expiry)
                        .font(Theme.Typography.caption())
                        .foregroundColor(Theme.Colors.textTertiary)
                }
            }

            Spacer()

            // Menu
            Menu {
                if !method.isDefault {
                    Button(action: {
                        Task {
                            try? await paymentService.setDefaultPaymentMethod(id: method.id)
                        }
                    }) {
                        Label("Définir par défaut", systemImage: "star")
                    }
                }

                Button(role: .destructive, action: {
                    Task {
                        try? await paymentService.removePaymentMethod(id: method.id)
                    }
                }) {
                    Label("Supprimer", systemImage: "trash")
                }
            } label: {
                Image(systemName: "ellipsis")
                    .font(.system(size: 16))
                    .foregroundColor(Theme.Colors.textSecondary)
                    .padding(8)
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(Theme.CornerRadius.xl)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }

    private var expiryText: String? {
        guard let month = method.expiryMonth, let year = method.expiryYear else { return nil }
        return "Expire \(String(format: "%02d", month))/\(year)"
    }
}

// MARK: - Add Payment Method View

struct AddPaymentMethodView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var selectedType: PaymentMethodType = .card
    @State private var cardNumber = ""
    @State private var expiryDate = ""
    @State private var cvc = ""
    @State private var holderName = ""
    @State private var iban = ""
    @State private var isLoading = false
    @State private var showError = false
    @State private var errorMessage = ""

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Type selector
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Type de paiement")
                            .font(Theme.Typography.body(.semibold))
                            .foregroundColor(Theme.Colors.textPrimary)

                        HStack(spacing: 12) {
                            PaymentTypeButton(type: .card, isSelected: selectedType == .card) {
                                selectedType = .card
                            }

                            PaymentTypeButton(type: .sepa, isSelected: selectedType == .sepa) {
                                selectedType = .sepa
                            }
                        }
                    }

                    // Form fields based on type
                    if selectedType == .card {
                        cardForm
                    } else {
                        sepaForm
                    }
                }
                .padding(24)
            }
            .background(Theme.Colors.backgroundSecondary)
            .navigationTitle("Ajouter un moyen de paiement")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Annuler") { dismiss() }
                }

                ToolbarItem(placement: .confirmationAction) {
                    Button("Ajouter") {
                        addPaymentMethod()
                    }
                    .disabled(!isValid || isLoading)
                }
            }
            .alert("Erreur", isPresented: $showError) {
                Button("OK", role: .cancel) {}
            } message: {
                Text(errorMessage)
            }
        }
    }

    private var cardForm: some View {
        VStack(spacing: 16) {
            FormTextField(
                label: "Numéro de carte",
                placeholder: "1234 5678 9012 3456",
                text: $cardNumber,
                keyboardType: .numberPad
            )

            HStack(spacing: 16) {
                FormTextField(
                    label: "Date d'expiration",
                    placeholder: "MM/AA",
                    text: $expiryDate
                )

                FormTextField(
                    label: "CVC",
                    placeholder: "123",
                    text: $cvc,
                    keyboardType: .numberPad
                )
            }

            FormTextField(
                label: "Nom du titulaire",
                placeholder: "John Doe",
                text: $holderName,
                textContentType: .name
            )
        }
    }

    private var sepaForm: some View {
        VStack(spacing: 16) {
            FormTextField(
                label: "IBAN",
                placeholder: "FR76 1234 5678 9012 3456 7890 123",
                text: $iban
            )

            FormTextField(
                label: "Nom du titulaire",
                placeholder: "John Doe",
                text: $holderName,
                textContentType: .name
            )

            Text("En ajoutant ce compte bancaire, vous autorisez EasyCo à débiter votre compte pour les paiements futurs conformément aux conditions générales.")
                .font(Theme.Typography.caption())
                .foregroundColor(Theme.Colors.textTertiary)
        }
    }

    private var isValid: Bool {
        if selectedType == .card {
            return cardNumber.count >= 16 && expiryDate.count >= 5 && cvc.count >= 3 && !holderName.isEmpty
        } else {
            return iban.count >= 15 && !holderName.isEmpty
        }
    }

    private func addPaymentMethod() {
        isLoading = true

        Task {
            do {
                // TODO: Implement payment method addition
                // For now, just simulate success
                try? await Task.sleep(nanoseconds: 1_000_000_000)
                dismiss()
            } catch {
                errorMessage = error.localizedDescription
                showError = true
            }

            isLoading = false
        }
    }
}

// MARK: - Payment Type Button

struct PaymentTypeButton: View {
    let type: PaymentMethodType
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: type == .card ? "creditcard.fill" : "building.columns.fill")
                    .font(.system(size: 24))
                    .foregroundColor(isSelected ? Theme.Colors.Owner.primary : Theme.Colors.textSecondary)

                Text(type.displayName)
                    .font(Theme.Typography.caption(.medium))
                    .foregroundColor(isSelected ? Theme.Colors.Owner.primary : Theme.Colors.textSecondary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(isSelected ? Theme.Colors.Owner._100 : Color.white)
            .cornerRadius(Theme.CornerRadius.lg)
            .overlay(
                RoundedRectangle(cornerRadius: Theme.CornerRadius.lg)
                    .stroke(isSelected ? Theme.Colors.Owner.primary : Theme.Colors.border, lineWidth: isSelected ? 2 : 1)
            )
        }
    }
}

// MARK: - Form Text Field

struct FormTextField: View {
    let label: String
    let placeholder: String
    @Binding var text: String
    var keyboardType: UIKeyboardType = .default
    var textContentType: UITextContentType? = nil

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label)
                .font(Theme.Typography.bodySmall(.medium))
                .foregroundColor(Theme.Colors.textSecondary)

            TextField(placeholder, text: $text)
                .font(Theme.Typography.body())
                .keyboardType(keyboardType)
                .textContentType(textContentType)
                .padding(16)
                .background(Color.white)
                .cornerRadius(Theme.CornerRadius.lg)
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.CornerRadius.lg)
                        .stroke(Theme.Colors.border, lineWidth: 1)
                )
        }
    }
}

// MARK: - Pay Now Sheet

struct PayNowSheet: View {
    let payment: PendingPayment
    @Environment(\.dismiss) private var dismiss
    @ObservedObject private var paymentService = PaymentService.shared
    @State private var selectedMethodId: UUID?
    @State private var isProcessing = false
    @State private var showSuccess = false
    @State private var showError = false
    @State private var errorMessage = ""

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                // Payment details
                VStack(spacing: 16) {
                    HStack {
                        Text(payment.description)
                            .font(Theme.Typography.title3(.bold))
                            .foregroundColor(Theme.Colors.textPrimary)

                        Spacer()

                        Text(payment.formattedAmount)
                            .font(Theme.Typography.title2(.bold))
                            .foregroundColor(Theme.Colors.Owner.primary)
                    }

                    if let propertyTitle = payment.propertyTitle {
                        HStack {
                            Image(systemName: "house.fill")
                                .foregroundColor(Theme.Colors.textTertiary)
                            Text(propertyTitle)
                                .font(Theme.Typography.bodySmall())
                                .foregroundColor(Theme.Colors.textSecondary)
                            Spacer()
                        }
                    }
                }
                .padding(20)
                .background(Color.white)
                .cornerRadius(Theme.CornerRadius.xl)

                // Payment methods
                VStack(alignment: .leading, spacing: 12) {
                    Text("Moyen de paiement")
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    ForEach(paymentService.paymentMethods) { method in
                        Button(action: { selectedMethodId = method.id }) {
                            HStack(spacing: 12) {
                                Image(systemName: method.icon)
                                    .font(.system(size: 20))
                                    .foregroundColor(Theme.Colors.Owner.primary)

                                Text(method.displayName)
                                    .font(Theme.Typography.body())
                                    .foregroundColor(Theme.Colors.textPrimary)

                                Spacer()

                                Image(systemName: selectedMethodId == method.id ? "checkmark.circle.fill" : "circle")
                                    .font(.system(size: 22))
                                    .foregroundColor(selectedMethodId == method.id ? Theme.Colors.Owner.primary : Theme.Colors.border)
                            }
                            .padding(16)
                            .background(Color.white)
                            .cornerRadius(Theme.CornerRadius.lg)
                            .overlay(
                                RoundedRectangle(cornerRadius: Theme.CornerRadius.lg)
                                    .stroke(selectedMethodId == method.id ? Theme.Colors.Owner.primary : Theme.Colors.border, lineWidth: selectedMethodId == method.id ? 2 : 1)
                            )
                        }
                    }
                }

                Spacer()

                // Pay button
                Button(action: processPayment) {
                    HStack {
                        if isProcessing {
                            ProgressView()
                                .tint(.white)
                        } else {
                            Text("Payer \(payment.formattedAmount)")
                                .font(Theme.Typography.body(.semibold))
                        }
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(
                        selectedMethodId != nil
                            ? Theme.Gradients.ownerCTA
                            : LinearGradient(colors: [Theme.GrayColors._300], startPoint: .leading, endPoint: .trailing)
                    )
                    .cornerRadius(Theme.CornerRadius.xl)
                }
                .disabled(selectedMethodId == nil || isProcessing)
            }
            .padding(24)
            .background(Theme.Colors.backgroundSecondary)
            .navigationTitle("Paiement")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Annuler") { dismiss() }
                }
            }
            .alert("Paiement réussi", isPresented: $showSuccess) {
                Button("OK") { dismiss() }
            } message: {
                Text("Votre paiement a été effectué avec succès.")
            }
            .alert("Erreur", isPresented: $showError) {
                Button("OK", role: .cancel) {}
            } message: {
                Text(errorMessage)
            }
        }
        .onAppear {
            selectedMethodId = paymentService.paymentMethods.first(where: { $0.isDefault })?.id
        }
    }

    private func processPayment() {
        guard let methodId = selectedMethodId else { return }

        isProcessing = true

        Task {
            do {
                // TODO: Implement actual payment processing
                try? await Task.sleep(nanoseconds: 1_000_000_000)
                showSuccess = true
            } catch {
                errorMessage = error.localizedDescription
                showError = true
            }

            isProcessing = false
        }
    }
}

// MARK: - Preview

#Preview {
    PaymentsView()
}
