//
//  DashboardData.swift
//  EasyCo
//

import Foundation

struct SearcherDashboardData: Codable {
    let newMatches: Int
    let upcomingVisits: Int
    let activeApplications: Int
}

struct OwnerDashboardData: Codable {
    let occupancyRate: Double
    let monthlyRevenue: Double
    let pendingApplications: Int
}

struct ApplicationDetail: Identifiable, Codable {
    let id: UUID
    let applicantName: String
    let propertyTitle: String
    let status: String
}
