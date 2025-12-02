//
//  DonutChart.swift
//  EasyCo
//
//  Donut chart component for distributions
//

import SwiftUI

struct DonutChart: View {
    let data: [DonutChartData]
    let size: CGFloat
    let lineWidth: CGFloat
    let showLegend: Bool

    init(
        data: [DonutChartData],
        size: CGFloat = 160,
        lineWidth: CGFloat = 24,
        showLegend: Bool = true
    ) {
        self.data = data
        self.size = size
        self.lineWidth = lineWidth
        self.showLegend = showLegend
    }

    private var total: Double {
        data.reduce(0) { $0 + $1.value }
    }

    var body: some View {
        VStack(spacing: 24) {
            ZStack {
                // Background circle
                Circle()
                    .stroke(Theme.Colors.gray100, lineWidth: lineWidth)
                    .frame(width: size, height: size)

                // Segments
                ForEach(Array(data.enumerated()), id: \.element.id) { index, item in
                    donutSegment(
                        item: item,
                        startAngle: startAngle(for: index),
                        endAngle: endAngle(for: index)
                    )
                }

                // Center content
                VStack(spacing: 4) {
                    Text("\(Int(total))")
                        .font(.system(size: 32, weight: .bold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text("Total")
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }

            if showLegend {
                legend
            }
        }
    }

    @ViewBuilder
    private func donutSegment(item: DonutChartData, startAngle: Angle, endAngle: Angle) -> some View {
        Circle()
            .trim(from: CGFloat(startAngle.degrees / 360), to: CGFloat(endAngle.degrees / 360))
            .stroke(
                item.color,
                style: StrokeStyle(lineWidth: lineWidth, lineCap: .round)
            )
            .frame(width: size, height: size)
            .rotationEffect(.degrees(-90))
            .animation(.spring(response: 0.8, dampingFraction: 0.8), value: item.value)
    }

    private var legend: some View {
        VStack(alignment: .leading, spacing: 12) {
            ForEach(data) { item in
                HStack(spacing: 12) {
                    Circle()
                        .fill(item.color)
                        .frame(width: 12, height: 12)

                    Text(item.label)
                        .font(Theme.Typography.body())
                        .foregroundColor(Theme.Colors.textPrimary)

                    Spacer()

                    VStack(alignment: .trailing, spacing: 2) {
                        Text("\(Int(item.value))")
                            .font(Theme.Typography.body(.semibold))
                            .foregroundColor(Theme.Colors.textPrimary)

                        Text(item.percentage(of: total))
                            .font(Theme.Typography.bodySmall())
                            .foregroundColor(Theme.Colors.textSecondary)
                    }
                }
            }
        }
    }

    // MARK: - Angle Calculations

    private func startAngle(for index: Int) -> Angle {
        let previousValues = data.prefix(index).reduce(0.0) { $0 + $1.value }
        let degrees = (previousValues / total) * 360
        return .degrees(degrees)
    }

    private func endAngle(for index: Int) -> Angle {
        let previousValues = data.prefix(index + 1).reduce(0.0) { $0 + $1.value }
        let degrees = (previousValues / total) * 360
        return .degrees(degrees)
    }
}

// MARK: - Donut Chart Data Model

struct DonutChartData: Identifiable {
    let id: String
    let label: String
    let value: Double
    let color: Color

    init(id: String = UUID().uuidString, label: String, value: Double, color: Color) {
        self.id = id
        self.label = label
        self.value = value
        self.color = color
    }

    func percentage(of total: Double) -> String {
        guard total > 0 else { return "0%" }
        let percent = (value / total) * 100
        return String(format: "%.1f%%", percent)
    }
}

// MARK: - Preview

struct DonutChart_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 32) {
            VStack(alignment: .leading, spacing: 16) {
                Text("Taux d'occupation")
                    .font(Theme.Typography.title3())

                DonutChart(
                    data: [
                        DonutChartData(label: "Occupé", value: 85, color: Theme.Colors.success),
                        DonutChartData(label: "Vacant", value: 15, color: Theme.Colors.warning)
                    ],
                    size: 140,
                    lineWidth: 20
                )
            }
            .padding()
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.card)
            .cardShadow()

            VStack(alignment: .leading, spacing: 16) {
                Text("Types de propriétés")
                    .font(Theme.Typography.title3())

                DonutChart(
                    data: [
                        DonutChartData(label: "Appartements", value: 12, color: Color(hex: "FFA040")),
                        DonutChartData(label: "Studios", value: 8, color: Color(hex: "60A5FA")),
                        DonutChartData(label: "Maisons", value: 5, color: Color(hex: "34D399")),
                        DonutChartData(label: "Lofts", value: 3, color: Color(hex: "F472B6"))
                    ]
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
