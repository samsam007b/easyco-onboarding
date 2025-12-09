//
//  OwnerStats.swift
//  IzzIco
//
//  Owner statistics model for dashboard
//

import Foundation

// MARK: - Owner Stats

struct OwnerStats {
    let monthlyRevenue: Double
    let publishedProperties: Int
    let occupationRate: Double
    let pendingApplications: Int
    let revenueData: [MonthlyRevenue]
    let occupationData: [PropertyOccupation]

    static var mock: OwnerStats {
        OwnerStats(
            monthlyRevenue: 4850.0,
            publishedProperties: 5,
            occupationRate: 87.5,
            pendingApplications: 8,
            revenueData: MonthlyRevenue.mockData,
            occupationData: PropertyOccupation.mockData
        )
    }
}

// MARK: - Monthly Revenue

struct MonthlyRevenue: Identifiable {
    let id = UUID()
    let month: String
    let revenue: Double
    let expenses: Double

    static var mockData: [MonthlyRevenue] {
        [
            MonthlyRevenue(month: "Jan", revenue: 4200, expenses: 800),
            MonthlyRevenue(month: "Fév", revenue: 4500, expenses: 650),
            MonthlyRevenue(month: "Mar", revenue: 4300, expenses: 900),
            MonthlyRevenue(month: "Avr", revenue: 4800, expenses: 750),
            MonthlyRevenue(month: "Mai", revenue: 4600, expenses: 820),
            MonthlyRevenue(month: "Jun", revenue: 4900, expenses: 680),
            MonthlyRevenue(month: "Jul", revenue: 5100, expenses: 950),
            MonthlyRevenue(month: "Aoû", revenue: 4700, expenses: 600),
            MonthlyRevenue(month: "Sep", revenue: 4850, expenses: 720),
            MonthlyRevenue(month: "Oct", revenue: 5000, expenses: 850),
            MonthlyRevenue(month: "Nov", revenue: 4950, expenses: 780),
            MonthlyRevenue(month: "Déc", revenue: 4850, expenses: 700)
        ]
    }
}

// MARK: - Property Occupation

struct PropertyOccupation: Identifiable {
    let id: UUID
    let propertyName: String
    let occupation: Double // percentage 0-100

    static var mockData: [PropertyOccupation] {
        [
            PropertyOccupation(id: UUID(), propertyName: "Studio Ixelles", occupation: 100),
            PropertyOccupation(id: UUID(), propertyName: "Colocation Schaerbeek", occupation: 75),
            PropertyOccupation(id: UUID(), propertyName: "2 chambres St-Gilles", occupation: 100),
            PropertyOccupation(id: UUID(), propertyName: "Appartement Etterbeek", occupation: 50),
            PropertyOccupation(id: UUID(), propertyName: "Studio Uccle", occupation: 100)
        ]
    }
}
