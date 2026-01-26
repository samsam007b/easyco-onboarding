//
//  IzzicoWebDesignSystem+Finance.swift
//  IzzIco
//
//  Composants Finance & Subscription pour le design system Izzico
//  Created on 2026-01-25
//

import SwiftUI

// MARK: - Subscription Card

/// Carte de plan d'abonnement web-style (Owner/Resident)
struct WebSubscriptionCard: View {
    struct SubscriptionPlan {
        let name: String
        let monthlyPrice: Double
        let yearlyPrice: Double
        let trialMonths: Int
        let features: [String]
        let roleColor: Color
        let gradient: LinearGradient
    }

    enum BillingPeriod {
        case monthly, yearly

        var label: String {
            switch self {
            case .monthly: return "Mensuel"
            case .yearly: return "Annuel"
            }
        }
    }

    let plan: SubscriptionPlan
    let billingPeriod: BillingPeriod
    let isSelected: Bool
    let isCurrentPlan: Bool
    let onSelectPlan: () -> Void

    private var displayPrice: Double {
        billingPeriod == .monthly ? plan.monthlyPrice : plan.yearlyPrice
    }

    private var savingsPercentage: Int {
        Int(((plan.monthlyPrice * 12) - plan.yearlyPrice) / (plan.monthlyPrice * 12) * 100)
    }

    var body: some View {
        Button(action: onSelectPlan) {
            VStack(alignment: .leading, spacing: IzzicoWeb.Spacing.lg) {
                // Header
                HStack {
                    Text(plan.name)
                        .font(IzzicoWeb.Typography.titleMedium(.bold))
                        .foregroundColor(IzzicoWeb.Colors.gray900)

                    Spacer()

                    if isCurrentPlan {
                        WebBadge(text: "Actuel", color: IzzicoWeb.Colors.success, style: .subtle)
                    } else if billingPeriod == .yearly {
                        WebBadge(text: "-\(savingsPercentage)%", color: plan.roleColor, style: .filled)
                    }
                }

                // Price
                HStack(alignment: .firstTextBaseline, spacing: 4) {
                    Text("€")
                        .font(IzzicoWeb.Typography.titleSmall())
                        .foregroundColor(plan.roleColor)

                    Text(String(format: "%.2f", displayPrice))
                        .font(IzzicoWeb.Typography.heroLarge(.bold))
                        .foregroundColor(plan.roleColor)

                    Text("/" + billingPeriod.label.lowercased())
                        .font(IzzicoWeb.Typography.bodySmall())
                        .foregroundColor(IzzicoWeb.Colors.gray600)
                }

                // Trial info
                if plan.trialMonths > 0 && !isCurrentPlan {
                    HStack(spacing: 6) {
                        Image(systemName: "gift.fill")
                            .font(.system(size: 14))
                        Text("\(plan.trialMonths) mois gratuits")
                            .font(IzzicoWeb.Typography.bodySmall(.semibold))
                    }
                    .foregroundColor(IzzicoWeb.Colors.success)
                }

                Divider()

                // Features
                VStack(alignment: .leading, spacing: IzzicoWeb.Spacing.sm) {
                    ForEach(plan.features, id: \.self) { feature in
                        HStack(spacing: IzzicoWeb.Spacing.sm) {
                            Image(systemName: "checkmark")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(plan.roleColor)

                            Text(feature)
                                .font(IzzicoWeb.Typography.bodySmall())
                                .foregroundColor(IzzicoWeb.Colors.gray700)
                        }
                    }
                }
            }
            .padding(IzzicoWeb.Spacing.xl)
            .background(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.xLarge, style: .continuous)
                    .fill(IzzicoWeb.Colors.white)
            )
            .overlay(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.xLarge, style: .continuous)
                    .stroke(
                        isSelected ? plan.roleColor : IzzicoWeb.Colors.gray200,
                        lineWidth: isSelected ? 3 : 1
                    )
            )
            .webShadow(isSelected ? IzzicoWeb.Shadows.colored(plan.roleColor, intensity: 0.2) : IzzicoWeb.Shadows.soft)
        }
        .buttonStyle(PlainButtonStyle())
        .animation(IzzicoWeb.Animations.quickSpring, value: isSelected)
    }
}

// MARK: - Payment Method Card

/// Carte de moyen de paiement web-style
struct WebPaymentMethodCard: View {
    enum CardBrand {
        case visa, mastercard, amex, unknown

        var icon: String {
            switch self {
            case .visa: return "creditcard.fill"
            case .mastercard: return "creditcard.circle.fill"
            case .amex: return "creditcard"
            case .unknown: return "creditcard"
            }
        }

        var name: String {
            switch self {
            case .visa: return "Visa"
            case .mastercard: return "Mastercard"
            case .amex: return "American Express"
            case .unknown: return "Card"
            }
        }
    }

    let brand: CardBrand
    let last4: String
    let expiryMonth: Int
    let expiryYear: Int
    let isDefault: Bool
    let onTap: () -> Void
    let onDelete: (() -> Void)?

    private var expiryText: String {
        String(format: "%02d/%02d", expiryMonth, expiryYear % 100)
    }

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: IzzicoWeb.Spacing.lg) {
                // Card icon
                ZStack {
                    Circle()
                        .fill(IzzicoWeb.Gradients.resident)
                        .frame(width: 48, height: 48)

                    Image(systemName: brand.icon)
                        .font(.system(size: 22, weight: .semibold))
                        .foregroundColor(.white)
                }

                // Card info
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text(brand.name)
                            .font(IzzicoWeb.Typography.bodyRegular(.semibold))
                            .foregroundColor(IzzicoWeb.Colors.gray900)

                        if isDefault {
                            WebBadge(text: "Par défaut", color: IzzicoWeb.Colors.resident500, style: .subtle)
                        }
                    }

                    HStack(spacing: 12) {
                        Text("•••• \(last4)")
                            .font(IzzicoWeb.Typography.bodySmall())
                            .foregroundColor(IzzicoWeb.Colors.gray600)

                        Text(expiryText)
                            .font(IzzicoWeb.Typography.bodySmall())
                            .foregroundColor(IzzicoWeb.Colors.gray500)
                    }
                }

                Spacer()

                // Delete button
                if let onDelete = onDelete, !isDefault {
                    Button(action: onDelete) {
                        Image(systemName: "trash")
                            .font(.system(size: 16, weight: .medium))
                            .foregroundColor(IzzicoWeb.Colors.error)
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
            .padding(IzzicoWeb.Spacing.lg)
            .background(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.large, style: .continuous)
                    .fill(IzzicoWeb.Colors.white)
            )
            .overlay(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.large, style: .continuous)
                    .stroke(isDefault ? IzzicoWeb.Colors.resident500.opacity(0.3) : IzzicoWeb.Colors.gray200, lineWidth: 1)
            )
            .webShadow(IzzicoWeb.Shadows.subtle)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Transaction Item

/// Item de transaction/paiement web-style
struct WebTransactionItem: View {
    enum TransactionType {
        case rent, expense, refund, subscription

        var icon: String {
            switch self {
            case .rent: return "house.fill"
            case .expense: return "cart.fill"
            case .refund: return "arrow.counterclockwise"
            case .subscription: return "repeat"
            }
        }
    }

    let title: String
    let subtitle: String
    let amount: Double
    let date: Date
    let type: TransactionType
    let isIncome: Bool
    let onTap: () -> Void

    private var dateText: String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "fr_FR")
        formatter.dateFormat = "d MMM yyyy"
        return formatter.string(from: date)
    }

    private var amountText: String {
        let prefix = isIncome ? "+" : "-"
        return "\(prefix)€\(String(format: "%.2f", abs(amount)))"
    }

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: IzzicoWeb.Spacing.md) {
                // Icon
                ZStack {
                    Circle()
                        .fill(
                            isIncome ?
                            IzzicoWeb.Colors.success.opacity(0.15) :
                            IzzicoWeb.Colors.gray100
                        )
                        .frame(width: 44, height: 44)

                    Image(systemName: type.icon)
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(
                            isIncome ?
                            IzzicoWeb.Colors.success :
                            IzzicoWeb.Colors.gray700
                        )
                }

                // Content
                VStack(alignment: .leading, spacing: 3) {
                    Text(title)
                        .font(IzzicoWeb.Typography.bodyRegular(.semibold))
                        .foregroundColor(IzzicoWeb.Colors.gray900)

                    Text(subtitle)
                        .font(IzzicoWeb.Typography.bodySmall())
                        .foregroundColor(IzzicoWeb.Colors.gray600)
                }

                Spacer()

                // Amount + date
                VStack(alignment: .trailing, spacing: 3) {
                    Text(amountText)
                        .font(IzzicoWeb.Typography.bodyRegular(.bold))
                        .foregroundColor(
                            isIncome ?
                            IzzicoWeb.Colors.success :
                            IzzicoWeb.Colors.gray900
                        )

                    Text(dateText)
                        .font(IzzicoWeb.Typography.caption())
                        .foregroundColor(IzzicoWeb.Colors.gray500)
                }
            }
            .padding(IzzicoWeb.Spacing.md)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Finance KPI Card (Enhanced)

/// Carte KPI financière web-style (revenus, dépenses, profit)
struct WebFinanceKPICard: View {
    enum KPIType {
        case revenue, expense, profit, pending

        var icon: String {
            switch self {
            case .revenue: return "arrow.down.circle.fill"
            case .expense: return "arrow.up.circle.fill"
            case .profit: return "chart.line.uptrend.xyaxis"
            case .pending: return "clock.fill"
            }
        }

        var color: Color {
            switch self {
            case .revenue: return IzzicoWeb.Colors.success
            case .expense: return IzzicoWeb.Colors.error
            case .profit: return IzzicoWeb.Colors.owner500
            case .pending: return IzzicoWeb.Colors.warning
            }
        }
    }

    let type: KPIType
    let amount: Double
    let label: String
    let subtitle: String?
    let trend: Double? // Percentage change
    let onTap: (() -> Void)?

    private var formattedAmount: String {
        "€\(String(format: "%.2f", amount))"
    }

    private var trendText: String? {
        guard let trend = trend else { return nil }
        let prefix = trend >= 0 ? "+" : ""
        return "\(prefix)\(String(format: "%.1f", trend))%"
    }

    var body: some View {
        Button(action: { onTap?() }) {
            VStack(alignment: .leading, spacing: IzzicoWeb.Spacing.md) {
                // Icon + trend
                HStack {
                    ZStack {
                        Circle()
                            .fill(type.color.opacity(0.15))
                            .frame(width: 52, height: 52)

                        Image(systemName: type.icon)
                            .font(.system(size: 22, weight: .semibold))
                            .foregroundColor(type.color)
                    }

                    Spacer()

                    if let trendText = trendText, let trend = trend {
                        HStack(spacing: 4) {
                            Image(systemName: trend >= 0 ? "arrow.up.right" : "arrow.down.right")
                                .font(.system(size: 12, weight: .bold))
                            Text(trendText)
                                .font(IzzicoWeb.Typography.caption(.bold))
                        }
                        .foregroundColor(trend >= 0 ? IzzicoWeb.Colors.success : IzzicoWeb.Colors.error)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(
                            Capsule()
                                .fill(
                                    trend >= 0 ?
                                    IzzicoWeb.Colors.successLight :
                                    IzzicoWeb.Colors.errorLight
                                )
                        )
                    }
                }

                Spacer()

                // Amount
                Text(formattedAmount)
                    .font(IzzicoWeb.Typography.heroMedium(.bold))
                    .foregroundColor(IzzicoWeb.Colors.gray900)

                // Label + subtitle
                VStack(alignment: .leading, spacing: 2) {
                    Text(label)
                        .font(IzzicoWeb.Typography.bodySmall())
                        .foregroundColor(IzzicoWeb.Colors.gray600)

                    if let subtitle = subtitle {
                        Text(subtitle)
                            .font(IzzicoWeb.Typography.caption(.medium))
                            .foregroundColor(type.color)
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .frame(height: 180)
            .padding(IzzicoWeb.Spacing.lg)
            .background(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.xLarge, style: .continuous)
                    .fill(IzzicoWeb.Colors.white)
            )
            .webShadow(IzzicoWeb.Shadows.soft)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Billing Period Toggle

/// Toggle mensuel/annuel pour subscriptions
struct WebBillingPeriodToggle: View {
    enum Period {
        case monthly, yearly
    }

    @Binding var selectedPeriod: Period
    let savingsPercentage: Int

    var body: some View {
        HStack(spacing: 0) {
            // Monthly
            Button(action: { selectedPeriod = .monthly }) {
                Text("Mensuel")
                    .font(IzzicoWeb.Typography.bodyRegular(.semibold))
                    .foregroundColor(
                        selectedPeriod == .monthly ?
                        .white : IzzicoWeb.Colors.gray700
                    )
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, IzzicoWeb.Spacing.md)
                    .background(monthlyBackground)
                    .cornerRadius(IzzicoWeb.Radius.medium, corners: [.topLeft, .bottomLeft])
            }

            // Yearly
            Button(action: { selectedPeriod = .yearly }) {
                HStack(spacing: 6) {
                    Text("Annuel")
                        .font(IzzicoWeb.Typography.bodyRegular(.semibold))

                    if selectedPeriod == .yearly {
                        WebBadge(text: "-\(savingsPercentage)%", color: .white, style: .filled, icon: nil)
                    }
                }
                .foregroundColor(
                    selectedPeriod == .yearly ?
                    .white : IzzicoWeb.Colors.gray700
                )
                .frame(maxWidth: .infinity)
                .padding(.vertical, IzzicoWeb.Spacing.md)
                .background(yearlyBackground)
                .cornerRadius(IzzicoWeb.Radius.medium, corners: [.topRight, .bottomRight])
            }
        }
        .background(
            RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                .fill(IzzicoWeb.Colors.gray100)
        )
        .animation(IzzicoWeb.Animations.smoothSpring, value: selectedPeriod)
    }

    private var monthlyBackground: LinearGradient {
        if selectedPeriod == .monthly {
            return IzzicoWeb.Gradients.resident
        } else {
            return LinearGradient(colors: [Color.clear], startPoint: .leading, endPoint: .trailing)
        }
    }

    private var yearlyBackground: LinearGradient {
        if selectedPeriod == .yearly {
            return IzzicoWeb.Gradients.resident
        } else {
            return LinearGradient(colors: [Color.clear], startPoint: .leading, endPoint: .trailing)
        }
    }
}

// MARK: - Invoice Card

/// Carte de facture web-style
struct WebInvoiceCard: View {
    let invoiceNumber: String
    let date: Date
    let amount: Double
    let status: InvoiceStatus
    let onDownload: () -> Void

    enum InvoiceStatus {
        case paid, pending, overdue

        var color: Color {
            switch self {
            case .paid: return IzzicoWeb.Colors.success
            case .pending: return IzzicoWeb.Colors.warning
            case .overdue: return IzzicoWeb.Colors.error
            }
        }

        var label: String {
            switch self {
            case .paid: return "Payée"
            case .pending: return "En attente"
            case .overdue: return "En retard"
            }
        }

        var icon: String {
            switch self {
            case .paid: return "checkmark.circle.fill"
            case .pending: return "clock.fill"
            case .overdue: return "exclamationmark.circle.fill"
            }
        }
    }

    private var dateText: String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "fr_FR")
        formatter.dateFormat = "d MMM yyyy"
        return formatter.string(from: date)
    }

    var body: some View {
        HStack(spacing: IzzicoWeb.Spacing.md) {
            // Invoice icon
            ZStack {
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.small, style: .continuous)
                    .fill(IzzicoWeb.Colors.owner500.opacity(0.15))
                    .frame(width: 44, height: 44)

                Image(systemName: "doc.text.fill")
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(IzzicoWeb.Colors.owner500)
            }

            // Info
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(invoiceNumber)
                        .font(IzzicoWeb.Typography.bodyRegular(.semibold))
                        .foregroundColor(IzzicoWeb.Colors.gray900)

                    WebBadge(text: status.label, color: status.color, style: .subtle, icon: status.icon)
                }

                Text(dateText + " • €\(String(format: "%.2f", amount))")
                    .font(IzzicoWeb.Typography.bodySmall())
                    .foregroundColor(IzzicoWeb.Colors.gray600)
            }

            Spacer()

            // Download button
            Button(action: onDownload) {
                Image(systemName: "arrow.down.circle.fill")
                    .font(.system(size: 24))
                    .foregroundColor(IzzicoWeb.Colors.owner500)
            }
            .buttonStyle(PlainButtonStyle())
        }
        .padding(IzzicoWeb.Spacing.md)
        .background(
            RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                .fill(IzzicoWeb.Colors.white)
        )
        .overlay(
            RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                .stroke(IzzicoWeb.Colors.gray200, lineWidth: 1)
        )
        .webShadow(IzzicoWeb.Shadows.subtle)
    }
}

// MARK: - Preview

struct IzzicoWebDesignSystemFinance_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Subscription cards
                HStack(spacing: 16) {
                    WebSubscriptionCard(
                        plan: WebSubscriptionCard.SubscriptionPlan(
                            name: "Owner",
                            monthlyPrice: 15.99,
                            yearlyPrice: 159.90,
                            trialMonths: 3,
                            features: ["Gestion propriétés", "Analytics", "Support prioritaire"],
                            roleColor: IzzicoWeb.Colors.owner500,
                            gradient: IzzicoWeb.Gradients.owner
                        ),
                        billingPeriod: .yearly,
                        isSelected: true,
                        isCurrentPlan: false,
                        onSelectPlan: {}
                    )
                }
                .padding(.horizontal)

                // Payment method
                WebPaymentMethodCard(
                    brand: .visa,
                    last4: "4242",
                    expiryMonth: 12,
                    expiryYear: 2027,
                    isDefault: true,
                    onTap: {},
                    onDelete: nil
                )
                .padding(.horizontal)

                // Transaction
                WebTransactionItem(
                    title: "Loyer Janvier",
                    subtitle: "Appartement Ixelles",
                    amount: 1250.00,
                    date: Date(),
                    type: .rent,
                    isIncome: false,
                    onTap: {}
                )
                .padding(.horizontal)

                // Finance KPI
                HStack(spacing: 12) {
                    WebFinanceKPICard(
                        type: .revenue,
                        amount: 3750.00,
                        label: "Revenus",
                        subtitle: "Ce mois",
                        trend: 12.5,
                        onTap: {}
                    )

                    WebFinanceKPICard(
                        type: .expense,
                        amount: 1240.00,
                        label: "Dépenses",
                        subtitle: "Ce mois",
                        trend: -5.3,
                        onTap: {}
                    )
                }
                .padding(.horizontal)

                // Invoice
                WebInvoiceCard(
                    invoiceNumber: "INV-2026-001",
                    date: Date(),
                    amount: 1250.00,
                    status: .paid,
                    onDownload: {}
                )
                .padding(.horizontal)
            }
            .padding(.vertical)
        }
        .background(IzzicoWeb.Colors.background)
    }
}
