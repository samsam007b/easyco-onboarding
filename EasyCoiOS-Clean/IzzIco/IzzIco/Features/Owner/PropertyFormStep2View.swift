//
//  PropertyFormStep2View.swift
//  IzzIco
//
//  Étape 2 : Informations financières
//

import SwiftUI

struct PropertyFormStep2View: View {
    @ObservedObject var viewModel: CreatePropertyViewModel

    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            // Header
            VStack(alignment: .leading, spacing: 8) {
                Text("Informations financières")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Définissez le loyer et les charges")
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            // Loyer mensuel
            OwnerFormField(label: "Loyer mensuel", required: true) {
                HStack(spacing: 12) {
                    TextField("850", text: $viewModel.monthlyRent)
                        .keyboardType(.decimalPad)
                        .textFieldStyle(OwnerCustomTextFieldStyle())

                    Text("€")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "6E56CF"))
                        .padding(.trailing, 8)
                }
            }

            // Charges incluses
            Toggle(isOn: $viewModel.chargesIncluded) {
                HStack(spacing: 8) {
                    Image(systemName: viewModel.chargesIncluded ? "checkmark.circle.fill" : "circle")
                        .foregroundColor(viewModel.chargesIncluded ? Color(hex: "6E56CF") : Color(hex: "9CA3AF"))
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Charges incluses dans le loyer")
                            .font(.system(size: 16))
                            .foregroundColor(Color(hex: "111827"))
                        Text("Électricité, eau, internet, etc.")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }
            }
            .toggleStyle(SwitchToggleStyle(tint: Color(hex: "6E56CF")))
            .padding(16)
            .background(Color.white)
            .cornerRadius(12)

            // Montant des charges (si non incluses)
            if !viewModel.chargesIncluded {
                OwnerFormField(label: "Montant des charges mensuelles", required: true) {
                    HStack(spacing: 12) {
                        TextField("150", text: $viewModel.charges)
                            .keyboardType(.decimalPad)
                            .textFieldStyle(OwnerCustomTextFieldStyle())

                        Text("€")
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(Color(hex: "6E56CF"))
                            .padding(.trailing, 8)
                    }
                }
                .transition(.opacity.combined(with: .move(edge: .top)))
            }

            // Dépôt de garantie
            OwnerFormField(label: "Dépôt de garantie", required: false) {
                VStack(alignment: .leading, spacing: 8) {
                    HStack(spacing: 12) {
                        TextField("1700", text: $viewModel.deposit)
                            .keyboardType(.decimalPad)
                            .textFieldStyle(OwnerCustomTextFieldStyle())

                        Text("€")
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(Color(hex: "6E56CF"))
                            .padding(.trailing, 8)
                    }

                    Text("Généralement 1-2 mois de loyer")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "6B7280"))
                }
            }

            // Frais d'agence
            OwnerFormField(label: "Frais d'agence (optionnel)", required: false) {
                VStack(alignment: .leading, spacing: 8) {
                    HStack(spacing: 12) {
                        TextField("0", text: $viewModel.agencyFees)
                            .keyboardType(.decimalPad)
                            .textFieldStyle(OwnerCustomTextFieldStyle())

                        Text("€")
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(Color(hex: "6E56CF"))
                            .padding(.trailing, 8)
                    }

                    Text("À la charge du locataire")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "6B7280"))
                }
            }

            // Récapitulatif
            if let rent = Double(viewModel.monthlyRent), rent > 0 {
                VStack(alignment: .leading, spacing: 16) {
                    Text("Récapitulatif")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    VStack(spacing: 12) {
                        PropertySummaryRow(
                            label: "Loyer",
                            value: formatEuro(rent)
                        )

                        if !viewModel.chargesIncluded, let charges = Double(viewModel.charges), charges > 0 {
                            PropertySummaryRow(
                                label: "Charges",
                                value: formatEuro(charges)
                            )
                            Divider()
                            PropertySummaryRow(
                                label: "Total mensuel",
                                value: formatEuro(rent + charges),
                                isTotal: true
                            )
                        } else {
                            PropertySummaryRow(
                                label: "Charges",
                                value: "Incluses",
                                valueColor: Color(hex: "10B981")
                            )
                        }
                    }
                }
                .padding(16)
                .background(Color(hex: "F3F0FF"))
                .cornerRadius(12)
            }

            Spacer(minLength: 40)
        }
    }

    // MARK: - Helpers

    private func formatEuro(_ amount: Double) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "EUR"
        formatter.locale = Locale(identifier: "fr_FR")
        return formatter.string(from: NSNumber(value: amount)) ?? "€\(Int(amount))"
    }
}

// SummaryRow est probablement défini ailleurs - renommer pour éviter conflit

struct PropertySummaryRow: View {
    let label: String
    let value: String
    var valueColor: Color = Color(hex: "6E56CF")
    var isTotal: Bool = false

    var body: some View {
        HStack {
            Text(label)
                .font(.system(size: isTotal ? 16 : 14, weight: isTotal ? .semibold : .regular))
                .foregroundColor(Color(hex: "374151"))

            Spacer()

            Text(value)
                .font(.system(size: isTotal ? 18 : 16, weight: isTotal ? .bold : .semibold))
                .foregroundColor(valueColor)
        }
    }
}



