//
//  ApplicationViewModel.swift
//  IzzIco
//
//  ViewModel for applications
//

import Foundation
import Combine

// MARK: - Applications List ViewModel

@MainActor
class ApplicationsViewModel: ObservableObject {
    @Published var applications: [ApplicationDetail] = []
    @Published var isLoading = false
    @Published var error: AppError?

    private let networkManager = NetworkManager.shared
    private var cancellables = Set<AnyCancellable>()

    // MARK: - Load Applications

    func loadApplications() async {
        isLoading = true
        error = nil

        // TODO: Implement API integration
        // do {
        //     let request = GetApplicationsRequest()
        //     let response = try await networkManager.execute(request)
        //
        //     applications = response.applications
        //     isLoading = false
        //
        // } catch let apiError as APIError {
        //     error = apiError.toAppError
        //     isLoading = false
        // } catch {
        //     self.error = AppError.unknown(error)
        //     isLoading = false
        // }

        isLoading = false
    }

    func refresh() async {
        await loadApplications()
    }
}

// MARK: - Application Form ViewModel

@MainActor
class ApplicationFormViewModel: ObservableObject {
    let propertyId: String

    // Form state
    @Published var currentStep = 0
    @Published var isSubmitting = false
    @Published var error: AppError?
    @Published var isSubmitted = false

    // Step 1: Personal Info
    @Published var firstName = ""
    @Published var lastName = ""
    @Published var email = ""
    @Published var phone = ""
    @Published var birthDate = Date()
    @Published var nationality = ""
    @Published var currentAddress = ""

    // Step 2: Employment
    @Published var employmentStatus: EmploymentStatus = .employee
    @Published var employer = ""
    @Published var position = ""
    @Published var contractType: ContractType = .permanent
    @Published var monthlyIncome = ""

    // Step 3: Guarantor
    @Published var hasGuarantor = false
    @Published var guarantorName = ""
    @Published var guarantorEmail = ""
    @Published var guarantorPhone = ""
    @Published var guarantorRelationship = ""

    // Step 4: Preferences
    @Published var moveInDate = Date()
    @Published var leaseDuration: LeaseDuration = .oneYear
    @Published var motivation = ""

    // Step 5: Documents
    @Published var uploadedDocuments: [UploadedDocument] = []

    private let networkManager = NetworkManager.shared
    private let totalSteps = 5

    init(propertyId: String) {
        self.propertyId = propertyId

        // Pre-fill user info if available
        if let user = AuthService.shared.currentUser {
            firstName = user.firstName ?? ""
            lastName = user.lastName ?? ""
            email = user.email
            phone = user.phoneNumber ?? ""
        }
    }

    // MARK: - Validation

    var canProceed: Bool {
        switch currentStep {
        case 0:
            return !firstName.isEmpty && !lastName.isEmpty && !email.isEmpty && !phone.isEmpty
        case 1:
            if employmentStatus == .employee {
                return !employer.isEmpty && !position.isEmpty && !monthlyIncome.isEmpty
            }
            return !monthlyIncome.isEmpty
        case 2:
            if hasGuarantor {
                return !guarantorName.isEmpty && !guarantorEmail.isEmpty && !guarantorPhone.isEmpty
            }
            return true
        case 3:
            return !motivation.isEmpty
        case 4:
            let requiredDocs: [DocumentType] = [.idCard, .payslip]
            return requiredDocs.allSatisfy { type in
                uploadedDocuments.contains(where: { $0.type == type })
            }
        default:
            return true
        }
    }

    // MARK: - Navigation

    func nextStep() {
        guard canProceed else { return }

        if currentStep < totalSteps - 1 {
            currentStep += 1
            Haptic.impact(.light)
        }
    }

    func previousStep() {
        if currentStep > 0 {
            currentStep -= 1
            Haptic.impact(.light)
        }
    }

    // MARK: - Submit Application

    func submitApplication() async -> Bool {
        guard canProceed else { return false }

        isSubmitting = true
        error = nil

        // TODO: Implement API integration
        // do {
        //     // Build application data
        //     let applicationData = ApplicationFormData(
        //         personalInfo: ApplicationFormData.PersonalInfo(
        //             firstName: firstName,
        //             lastName: lastName,
        //             email: email,
        //             phone: phone,
        //             birthDate: birthDate,
        //             nationality: nationality,
        //             currentAddress: currentAddress
        //         ),
        //         employment: ApplicationFormData.Employment(
        //             status: employmentStatus,
        //             employer: employer.isEmpty ? nil : employer,
        //             position: position.isEmpty ? nil : position,
        //             contractType: employmentStatus == .employee ? contractType : nil,
        //             monthlyIncome: Int(monthlyIncome) ?? 0
        //         ),
        //         guarantor: hasGuarantor ? ApplicationFormData.Guarantor(
        //             name: guarantorName,
        //             email: guarantorEmail,
        //             phone: guarantorPhone,
        //             relationship: guarantorRelationship
        //         ) : nil,
        //         preferences: ApplicationFormData.Preferences(
        //             moveInDate: moveInDate,
        //             leaseDuration: leaseDuration,
        //             motivation: motivation
        //         )
        //     )
        //
        //     // Submit application
        //     let request = CreateApplicationRequest(
        //         propertyId: propertyId,
        //         applicationData: applicationData
        //     )
        //     _ = try await networkManager.execute(request)
        //
        //     isSubmitting = false
        //     isSubmitted = true
        //
        //     // Play success haptic
        //     Haptic.notification(.success)
        //
        //     // Post notification
        //     NotificationCenter.default.post(name: .applicationSubmitted, object: nil)
        //
        //     return true
        //
        // } catch let apiError as APIError {
        //     error = apiError.toAppError
        //     isSubmitting = false
        //     return false
        // } catch {
        //     self.error = AppError.unknown(error)
        //     isSubmitting = false
        //     return false
        // }

        isSubmitting = false
        isSubmitted = true

        // Play success haptic
        Haptic.notification(.success)

        // Post notification
        NotificationCenter.default.post(name: .applicationSubmitted, object: nil)

        return true
    }

    // MARK: - Document Upload

    func uploadDocument(type: DocumentType, data: Data) async -> Bool {
        // TODO: Implement actual file upload
        // For now, simulate upload

        do {
            // Simulate upload delay
            try await Task.sleep(nanoseconds: 1_000_000_000)

            let document = UploadedDocument(
                id: UUID().uuidString,
                type: type,
                name: "\(type.rawValue).pdf",
                url: "https://example.com/documents/\(UUID().uuidString).pdf",
                uploadedAt: Date()
            )

            uploadedDocuments.append(document)

            Haptic.notification(.success)

            return true
        } catch {
            return false
        }
    }
}

// MARK: - Application Status ViewModel

@MainActor
class ApplicationStatusViewModel: ObservableObject {
    let applicationId: String

    @Published var application: ApplicationDetail?
    @Published var isLoading = false
    @Published var error: AppError?

    private let networkManager = NetworkManager.shared
    private var cancellables = Set<AnyCancellable>()

    init(applicationId: String) {
        self.applicationId = applicationId
    }

    // MARK: - Load Application

    func loadApplication() async {
        isLoading = true
        error = nil

        // TODO: Implement API integration
        // do {
        //     let request = GetApplicationRequest(id: applicationId)
        //     let app = try await networkManager.execute(request)
        //
        //     application = app
        //     isLoading = false
        //
        // } catch let apiError as APIError {
        //     error = apiError.toAppError
        //     isLoading = false
        // } catch {
        //     self.error = AppError.unknown(error)
        //     isLoading = false
        // }

        isLoading = false
    }

    func refresh() async {
        await loadApplication()
    }

    // MARK: - Cancel Application

    func cancelApplication() async -> Bool {
        // TODO: Implement cancel endpoint
        // For now, just simulate

        do {
            // Simulate API call
            try await Task.sleep(nanoseconds: 500_000_000)

            Haptic.notification(.success)

            // Post notification
            NotificationCenter.default.post(name: .applicationCancelled, object: applicationId)

            return true
        } catch {
            return false
        }
    }
}

// MARK: - Supporting Types

struct UploadedDocument: Identifiable {
    let id: String
    let type: DocumentType
    let name: String
    let url: String
    let uploadedAt: Date
}

// enum DocumentType: String, Codable {
//     case identity = "identity"
//     case addressProof = "address_proof"
//     case payslips = "payslips"
//     case employmentContract = "employment_contract"
//     case taxReturn = "tax_return"
//
//     var displayName: String {
//         switch self {
//         case .identity: return "Pièce d'identité"
//         case .addressProof: return "Justificatif de domicile"
//         case .payslips: return "Bulletins de salaire (3 derniers mois)"
//         case .employmentContract: return "Contrat de travail"
//         case .taxReturn: return "Avis d'imposition"
//         }
//     }
//
//     var isRequired: Bool {
//         switch self {
//         case .identity, .addressProof, .payslips:
//             return true
//         case .employmentContract, .taxReturn:
//             return false
//         }
//     }
// }

// MARK: - Notifications

extension Notification.Name {
    static let applicationSubmitted = Notification.Name("applicationSubmitted")
    static let applicationCancelled = Notification.Name("applicationCancelled")
}
