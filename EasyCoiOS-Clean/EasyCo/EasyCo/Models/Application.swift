import Foundation

// MARK: - Searcher Application Model (Candidature de chercheur)

struct SearcherApplication: Identifiable, Codable {
    let id: UUID
    let propertyId: UUID
    let applicantId: UUID
    var status: ApplicationStatus
    var personalInfo: PersonalInfo
    var professionalInfo: ProfessionalInfo
    var documents: [ApplicationDocument]
    var motivationMessage: String
    let submittedAt: Date
    var updatedAt: Date

    init(
        id: UUID = UUID(),
        propertyId: UUID,
        applicantId: UUID,
        status: ApplicationStatus = .pending,
        personalInfo: PersonalInfo,
        professionalInfo: ProfessionalInfo,
        documents: [ApplicationDocument] = [],
        motivationMessage: String = "",
        submittedAt: Date = Date(),
        updatedAt: Date = Date()
    ) {
        self.id = id
        self.propertyId = propertyId
        self.applicantId = applicantId
        self.status = status
        self.personalInfo = personalInfo
        self.professionalInfo = professionalInfo
        self.documents = documents
        self.motivationMessage = motivationMessage
        self.submittedAt = submittedAt
        self.updatedAt = updatedAt
    }
}

// MARK: - Application Status

enum ApplicationStatus: String, Codable {
    case pending = "pending"
    case reviewing = "reviewing"
    case accepted = "accepted"
    case rejected = "rejected"
    case withdrawn = "withdrawn"

    var displayName: String {
        switch self {
        case .pending: return "En attente"
        case .reviewing: return "En examen"
        case .accepted: return "Acceptée"
        case .rejected: return "Refusée"
        case .withdrawn: return "Retirée"
        }
    }

    var color: String {
        switch self {
        case .pending: return "FBBF24"        // Yellow
        case .reviewing: return "3B82F6"      // Blue
        case .accepted: return "10B981"       // Green
        case .rejected: return "EF4444"       // Red
        case .withdrawn: return "6B7280"      // Gray
        }
    }
}

// MARK: - Personal Info

struct PersonalInfo: Codable {
    var firstName: String
    var lastName: String
    var email: String
    var phone: String
    var dateOfBirth: Date
    var nationality: String

    init(
        firstName: String = "",
        lastName: String = "",
        email: String = "",
        phone: String = "",
        dateOfBirth: Date = Date(),
        nationality: String = ""
    ) {
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
        self.phone = phone
        self.dateOfBirth = dateOfBirth
        self.nationality = nationality
    }
}

// MARK: - Professional Info

struct ProfessionalInfo: Codable {
    var employmentStatus: EmploymentStatus
    var companyName: String
    var position: String
    var monthlyIncome: Double
    var hasGuarantor: Bool
    var guarantorInfo: GuarantorInfo?

    init(
        employmentStatus: EmploymentStatus = .employee,
        companyName: String = "",
        position: String = "",
        monthlyIncome: Double = 0,
        hasGuarantor: Bool = false,
        guarantorInfo: GuarantorInfo? = nil
    ) {
        self.employmentStatus = employmentStatus
        self.companyName = companyName
        self.position = position
        self.monthlyIncome = monthlyIncome
        self.hasGuarantor = hasGuarantor
        self.guarantorInfo = guarantorInfo
    }
}

enum EmploymentStatus: String, Codable, CaseIterable {
    case employee = "employee"
    case student = "student"
    case selfEmployed = "self_employed"
    case unemployed = "unemployed"
    case retired = "retired"

    var displayName: String {
        switch self {
        case .employee: return "Salarié(e)"
        case .student: return "Étudiant(e)"
        case .selfEmployed: return "Indépendant(e)"
        case .unemployed: return "Sans emploi"
        case .retired: return "Retraité(e)"
        }
    }
}

// MARK: - Guarantor Info

struct GuarantorInfo: Codable {
    var name: String
    var relationship: String
    var email: String
    var phone: String
    var monthlyIncome: Double

    init(
        name: String = "",
        relationship: String = "",
        email: String = "",
        phone: String = "",
        monthlyIncome: Double = 0
    ) {
        self.name = name
        self.relationship = relationship
        self.email = email
        self.phone = phone
        self.monthlyIncome = monthlyIncome
    }
}

// MARK: - Application Document

struct ApplicationDocument: Identifiable, Codable {
    let id: UUID
    let type: DocumentType
    var fileName: String
    var fileURL: String
    let uploadedAt: Date

    init(
        id: UUID = UUID(),
        type: DocumentType,
        fileName: String,
        fileURL: String,
        uploadedAt: Date = Date()
    ) {
        self.id = id
        self.type = type
        self.fileName = fileName
        self.fileURL = fileURL
        self.uploadedAt = uploadedAt
    }
}

enum DocumentType: String, Codable, CaseIterable {
    case idCard = "id_card"
    case payslip = "payslip"
    case employmentContract = "employment_contract"
    case studentCard = "student_card"
    case taxNotice = "tax_notice"
    case guarantorDocument = "guarantor_document"

    var displayName: String {
        switch self {
        case .idCard: return "Pièce d'identité"
        case .payslip: return "Bulletin de salaire"
        case .employmentContract: return "Contrat de travail"
        case .studentCard: return "Carte étudiant"
        case .taxNotice: return "Avis d'imposition"
        case .guarantorDocument: return "Document garant"
        }
    }

    var icon: String {
        switch self {
        case .idCard: return "person.text.rectangle"
        case .payslip: return "doc.text"
        case .employmentContract: return "doc.plaintext"
        case .studentCard: return "graduationcap"
        case .taxNotice: return "doc.badge.gearshape"
        case .guarantorDocument: return "person.2.badge.gearshape"
        }
    }

    var isRequired: Bool {
        switch self {
        case .idCard, .payslip: return true
        default: return false
        }
    }
}

// MARK: - Mock Data

extension SearcherApplication {
    static let mockApplications: [SearcherApplication] = [
        SearcherApplication(
            propertyId: UUID(),
            applicantId: UUID(),
            status: .pending,
            personalInfo: PersonalInfo(
                firstName: "Marie",
                lastName: "Dupont",
                email: "marie.dupont@example.com",
                phone: "+33 6 12 34 56 78",
                dateOfBirth: Date().addingTimeInterval(-25 * 365 * 24 * 60 * 60),
                nationality: "Française"
            ),
            professionalInfo: ProfessionalInfo(
                employmentStatus: .employee,
                companyName: "Tech Corp",
                position: "Développeuse",
                monthlyIncome: 2800,
                hasGuarantor: false
            ),
            documents: [
                ApplicationDocument(
                    type: .idCard,
                    fileName: "carte_identite.pdf",
                    fileURL: "mock_url"
                ),
                ApplicationDocument(
                    type: .payslip,
                    fileName: "bulletins_salaire.pdf",
                    fileURL: "mock_url"
                )
            ],
            motivationMessage: "Bonjour, je suis très intéressée par votre logement. Je suis une professionnelle sérieuse à la recherche d'un appartement calme.",
            submittedAt: Date().addingTimeInterval(-2 * 24 * 60 * 60)
        ),
        SearcherApplication(
            propertyId: UUID(),
            applicantId: UUID(),
            status: .reviewing,
            personalInfo: PersonalInfo(
                firstName: "Thomas",
                lastName: "Martin",
                email: "thomas.martin@example.com",
                phone: "+33 6 98 76 54 32",
                dateOfBirth: Date().addingTimeInterval(-22 * 365 * 24 * 60 * 60),
                nationality: "Français"
            ),
            professionalInfo: ProfessionalInfo(
                employmentStatus: .student,
                companyName: "Université Paris",
                position: "Étudiant Master",
                monthlyIncome: 1200,
                hasGuarantor: true,
                guarantorInfo: GuarantorInfo(
                    name: "Pierre Martin",
                    relationship: "Père",
                    email: "pierre.martin@example.com",
                    phone: "+33 6 11 22 33 44",
                    monthlyIncome: 4500
                )
            ),
            documents: [
                ApplicationDocument(
                    type: .idCard,
                    fileName: "piece_identite.pdf",
                    fileURL: "mock_url"
                ),
                ApplicationDocument(
                    type: .studentCard,
                    fileName: "carte_etudiant.pdf",
                    fileURL: "mock_url"
                ),
                ApplicationDocument(
                    type: .guarantorDocument,
                    fileName: "documents_garant.pdf",
                    fileURL: "mock_url"
                )
            ],
            motivationMessage: "Étudiant sérieux, je recherche un logement pour la durée de mes études.",
            submittedAt: Date().addingTimeInterval(-5 * 24 * 60 * 60)
        )
    ]
}
