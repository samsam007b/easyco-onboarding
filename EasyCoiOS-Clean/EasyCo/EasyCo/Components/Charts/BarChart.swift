//
//  BarChart.swift
//  EasyCo
//
//  Simple bar chart component for analytics
//

import SwiftUI

struct BarChart: View {
    let data: [BarChartData]
    let maxValue: Double?
    let barColor: Color
    let showValues: Bool

    init(
        data: [BarChartData],
        maxValue: Double? = nil,
        barColor: Color = Theme.Colors.primary,
        showValues: Bool = false
    ) {
        self.data = data
        self.maxValue = maxValue
        self.barColor = barColor
        self.showValues = showValues
    }

    private var computedMaxValue: Double {
        maxValue ?? (data.map { $0.value }.max() ?? 1.0)
    }

    var body: some View {
        VStack(spacing: 0) {
            // Chart area
            HStack(alignment: .bottom, spacing: 8) {
                ForEach(data) { item in
                    barColumn(item)
                }
            }
            .frame(height: 200)
            .padding(.bottom, 12)

            // Labels
            HStack(alignment: .top, spacing: 8) {
                ForEach(data) { item in
                    Text(item.label)
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)
                        .frame(maxWidth: .infinity)
                        .lineLimit(2)
                        .multilineTextAlignment(.center)
                }
            }
        }
    }

    @ViewBuilder
    private func barColumn(_ item: BarChartData) -> some View {
        VStack(spacing: 8) {
            // Value label
            if showValues {
                Text(item.formattedValue)
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .opacity(item.value > 0 ? 1 : 0)
            }

            // Bar
            ZStack(alignment: .bottom) {
                // Background
                RoundedRectangle(cornerRadius: 6)
                    .fill(Theme.Colors.gray100)
                    .frame(maxWidth: .infinity)

                // Value bar with animation
                GeometryReader { geometry in
                    let height = (item.value / computedMaxValue) * geometry.size.height
                    RoundedRectangle(cornerRadius: 6)
                        .fill(
                            LinearGradient(
                                colors: [barColor, barColor.opacity(0.7)],
                                startPoint: .top,
                                endPoint: .bottom
                            )
                        )
                        .frame(height: max(0, height))
                        .frame(maxWidth: .infinity)
                        .animation(.spring(response: 0.6, dampingFraction: 0.8), value: item.value)
                }
            }
        }
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Bar Chart Data Model

struct BarChartData: Identifiable {
    let id: String
    let label: String
    let value: Double
    let formattedValue: String

    init(id: String = UUID().uuidString, label: String, value: Double, formattedValue: String? = nil) {
        self.id = id
        self.label = label
        self.value = value
        self.formattedValue = formattedValue ?? "\(Int(value))"
    }
}

// MARK: - Preview

struct BarChart_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 32) {
            VStack(alignment: .leading, spacing: 12) {
                Text("Vues par jour")
                    .font(Theme.Typography.title3())

                BarChart(
                    data: [
                        BarChartData(label: "Lun", value: 45),
                        BarChartData(label: "Mar", value: 67),
                        BarChartData(label: "Mer", value: 52),
                        BarChartData(label: "Jeu", value: 89),
                        BarChartData(label: "Ven", value: 73),
                        BarChartData(label: "Sam", value: 34),
                        BarChartData(label: "Dim", value: 28)
                    ],
                    barColor: Theme.Colors.primary,
                    showValues: true
                )
            }
            .padding()
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.card)
            .cardShadow()

            VStack(alignment: .leading, spacing: 12) {
                Text("Revenus mensuels")
                    .font(Theme.Typography.title3())

                BarChart(
                    data: [
                        BarChartData(label: "Jan", value: 4200, formattedValue: "4.2k€"),
                        BarChartData(label: "Fév", value: 3800, formattedValue: "3.8k€"),
                        BarChartData(label: "Mar", value: 5100, formattedValue: "5.1k€"),
                        BarChartData(label: "Avr", value: 4650, formattedValue: "4.7k€"),
                        BarChartData(label: "Mai", value: 5300, formattedValue: "5.3k€"),
                        BarChartData(label: "Jun", value: 4900, formattedValue: "4.9k€")
                    ],
                    barColor: Theme.Colors.success,
                    showValues: true
                )
            }
            .padding()
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.card)
            .cardShadow()
        }
        .padding()
        .background(Theme.Colors.backgroundSecondary)
    }
}
