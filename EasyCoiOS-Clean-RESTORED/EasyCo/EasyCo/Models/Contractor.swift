//
//  Contractor.swift
//  EasyCo
//
//  Contractor model for maintenance service providers
//

import Foundation

// MARK: - Contractor

struct Contractor: Identifiable, Codable {
    let id: UUID
    var name: String
    var company: String?
    var specialty: MaintenanceCategory
    var phone: String
    var email: String?
    var address: String?
    var rating: Double // 0-5
    var totalJobs: Int
    var notes: String?
    var isFavorite: Bool
    var createdAt: Date
    var lastUsed: Date?

    // Price info
    var hourlyRate: Double?
    var flatRate: Double?

    var displayName: String {
        company ?? name
    }

    var formattedPhone: String {
        // Simple formatting, in real app would use proper phone formatter
        phone
    }

    var ratingStars: String {
        let fullStars = Int(rating)
        let halfStar = (rating - Double(fullStars)) >= 0.5
        var stars = String(repeating: "★", count: fullStars)
        if halfStar {
            stars += "½"
        }
        let emptyStars = 5 - fullStars - (halfStar ? 1 : 0)
        stars += String(repeating: "☆", count: emptyStars)
        return stars
    }

    static var mockContractors: [Contractor] {
        [
            Contractor(
                id: UUID(),
                name: "Jean Dupont",
                company: "PlomPro Services",
                specialty: .plumbing,
                phone: "+32 2 123 45 67",
                email: "contact@plompro.be",
                address: "Rue de la Plomberie 42, 1000 Bruxelles",
                rating: 4.5,
                totalJobs: 12,
                notes: "Très réactif, prix corrects. Toujours disponible pour urgences.",
                isFavorite: true,
                createdAt: Date().addingTimeInterval(-15552000), // 6 months ago
                lastUsed: Date().addingTimeInterval(-172800),
                hourlyRate: 45.0,
                flatRate: nil
            ),
            Contractor(
                id: UUID(),
                name: "Marie Martin",
                company: "Chauffage Plus",
                specialty: .heating,
                phone: "+32 2 234 56 78",
                email: "info@chauffageplus.be",
                address: "Avenue du Chauffage 15, 1050 Ixelles",
                rating: 5.0,
                totalJobs: 8,
                notes: "Excellente prestataire, très professionnelle. Un peu cher mais qualité irréprochable.",
                isFavorite: true,
                createdAt: Date().addingTimeInterval(-20736000), // 8 months ago
                lastUsed: Date().addingTimeInterval(-432000),
                hourlyRate: 55.0,
                flatRate: nil
            ),
            Contractor(
                id: UUID(),
                name: "Thomas Leclerc",
                company: "ElectroFix",
                specialty: .electricity,
                phone: "+32 2 345 67 89",
                email: "thomas@electrofix.be",
                address: nil,
                rating: 4.0,
                totalJobs: 15,
                notes: "Bon rapport qualité/prix. Parfois un peu en retard.",
                isFavorite: false,
                createdAt: Date().addingTimeInterval(-31104000), // 1 year ago
                lastUsed: Date().addingTimeInterval(-1209600),
                hourlyRate: 40.0,
                flatRate: nil
            ),
            Contractor(
                id: UUID(),
                name: "Sophie Bernard",
                company: "ColorPro",
                specialty: .painting,
                phone: "+32 2 456 78 90",
                email: "contact@colorpro.be",
                address: "Rue des Peintres 8, 1060 Saint-Gilles",
                rating: 4.5,
                totalJobs: 6,
                notes: "Travail soigné, respect des délais.",
                isFavorite: true,
                createdAt: Date().addingTimeInterval(-10368000), // 4 months ago
                lastUsed: Date().addingTimeInterval(-259200),
                hourlyRate: nil,
                flatRate: 350.0
            ),
            Contractor(
                id: UUID(),
                name: "Lucas Petit",
                company: "CleanExpress",
                specialty: .cleaning,
                phone: "+32 2 567 89 01",
                email: "info@cleanexpress.be",
                address: "Boulevard du Nettoyage 25, 1070 Anderlecht",
                rating: 3.5,
                totalJobs: 20,
                notes: "Service rapide mais qualité variable.",
                isFavorite: false,
                createdAt: Date().addingTimeInterval(-25920000), // 10 months ago
                lastUsed: Date().addingTimeInterval(-604800),
                hourlyRate: 25.0,
                flatRate: nil
            ),
            Contractor(
                id: UUID(),
                name: "Emma Dubois",
                company: "SerruPro",
                specialty: .locksmith,
                phone: "+32 2 678 90 12",
                email: "contact@serrupro.be",
                address: nil,
                rating: 4.8,
                totalJobs: 5,
                notes: "Intervention rapide, très compétente. Dépannage 24/7.",
                isFavorite: true,
                createdAt: Date().addingTimeInterval(-7776000), // 3 months ago
                lastUsed: Date().addingTimeInterval(-2592000),
                hourlyRate: 60.0,
                flatRate: 80.0 // Emergency call-out fee
            )
        ]
    }
}

// MARK: - Contractor Stats

struct ContractorStats {
    let contractor: Contractor
    let totalSpent: Double
    let averageCost: Double
    let lastJobDate: Date?
    let onTimeRate: Double // Percentage of jobs completed on time

    static func from(contractor: Contractor, tasks: [MaintenanceTask]) -> ContractorStats {
        let contractorTasks = tasks.filter { $0.contractorId == contractor.id }
        let totalSpent = contractorTasks.compactMap { $0.actualCost }.reduce(0, +)
        let avgCost = contractorTasks.isEmpty ? 0 : totalSpent / Double(contractorTasks.count)
        let lastJob = contractorTasks.compactMap { $0.completedAt }.max()

        // Calculate on-time rate (simplified)
        let completedTasks = contractorTasks.filter { $0.status == .completed }
        let onTime = completedTasks.filter { task in
            guard let completed = task.completedAt, let due = task.dueDate else { return true }
            return completed <= due
        }.count

        let onTimeRate = completedTasks.isEmpty ? 100.0 : (Double(onTime) / Double(completedTasks.count)) * 100

        return ContractorStats(
            contractor: contractor,
            totalSpent: totalSpent,
            averageCost: avgCost,
            lastJobDate: lastJob,
            onTimeRate: onTimeRate
        )
    }
}
