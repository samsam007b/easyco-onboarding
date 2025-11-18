//
//  Lease.swift
//  EasyCo
//
//  Modèle représentant un bail de location
//  Utilisé pour gérer les informations contractuelles des résidents
//

import Foundation

struct Lease: Identifiable, Codable {
    let id: UUID
    var householdId: UUID
    var residentId: UUID
    var monthlyRent: Double
    var charges: Double
    var deposit: Double
    var startDate: Date
    var endDate: Date?
    var isActive: Bool
    var roomNumber: String?
    var contractURL: String?
    var createdAt: Date
    var updatedAt: Date

    // Computed properties
    var totalMonthlyPayment: Double {
        monthlyRent + charges
    }

    var daysUntilEnd: Int? {
        guard let endDate = endDate else { return nil }
        return Calendar.current.dateComponents([.day], from: Date(), to: endDate).day
    }

    var isExpiringSoon: Bool {
        guard let days = daysUntilEnd else { return false }
        return days <= 30 && days > 0
    }

    var hasEnded: Bool {
        guard let endDate = endDate else { return false }
        return endDate < Date()
    }

    var duration: String {
        let months = Calendar.current.dateComponents([.month], from: startDate, to: endDate ?? Date()).month ?? 0
        if months < 12 {
            return "\(months) mois"
        } else {
            let years = months / 12
            let remainingMonths = months % 12
            if remainingMonths == 0 {
                return "\(years) an\(years > 1 ? "s" : "")"
            } else {
                return "\(years) an\(years > 1 ? "s" : "") et \(remainingMonths) mois"
            }
        }
    }

    init(
        id: UUID = UUID(),
        householdId: UUID,
        residentId: UUID,
        monthlyRent: Double,
        charges: Double,
        deposit: Double,
        startDate: Date,
        endDate: Date? = nil,
        isActive: Bool = true,
        roomNumber: String? = nil,
        contractURL: String? = nil,
        createdAt: Date = Date(),
        updatedAt: Date = Date()
    ) {
        self.id = id
        self.householdId = householdId
        self.residentId = residentId
        self.monthlyRent = monthlyRent
        self.charges = charges
        self.deposit = deposit
        self.startDate = startDate
        self.endDate = endDate
        self.isActive = isActive
        self.roomNumber = roomNumber
        self.contractURL = contractURL
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
}

// MARK: - Mock Data pour mode démo
extension Lease {
    static let mockLease = Lease(
        householdId: UUID(),
        residentId: UUID(),
        monthlyRent: 550.0,
        charges: 100.0,
        deposit: 1100.0,
        startDate: Calendar.current.date(byAdding: .month, value: -6, to: Date())!,
        endDate: Calendar.current.date(byAdding: .month, value: 6, to: Date())!,
        isActive: true,
        roomNumber: "Chambre 2"
    )

    static let mockLeases: [Lease] = [
        mockLease,
        Lease(
            householdId: UUID(),
            residentId: UUID(),
            monthlyRent: 600.0,
            charges: 120.0,
            deposit: 1200.0,
            startDate: Calendar.current.date(byAdding: .year, value: -1, to: Date())!,
            endDate: Calendar.current.date(byAdding: .month, value: 11, to: Date())!,
            isActive: true,
            roomNumber: "Chambre 1"
        ),
        Lease(
            householdId: UUID(),
            residentId: UUID(),
            monthlyRent: 500.0,
            charges: 90.0,
            deposit: 1000.0,
            startDate: Calendar.current.date(byAdding: .month, value: -3, to: Date())!,
            endDate: Calendar.current.date(byAdding: .month, value: 9, to: Date())!,
            isActive: true,
            roomNumber: "Chambre 3"
        )
    ]
}
