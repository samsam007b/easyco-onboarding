//
//  TimePeriod.swift
//  IzzIco
//

import Foundation

enum TimePeriod: String, CaseIterable, Identifiable {
    case week = "week"
    case month = "month"
    case quarter = "quarter"
    case year = "year"

    var id: String { rawValue }

    var label: String {
        switch self {
        case .week: return "Semaine"
        case .month: return "Mois"
        case .quarter: return "Trimestre"
        case .year: return "Année"
        }
    }
}
