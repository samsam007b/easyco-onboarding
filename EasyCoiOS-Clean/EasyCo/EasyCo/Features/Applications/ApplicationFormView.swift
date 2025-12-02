//
//  ApplicationFormView.swift
//  EasyCo
//
//  Multi-step application form for properties
//

import SwiftUI

struct ApplicationFormView: View {
    let property: Property
    @Environment(\.dismiss) private var dismiss

    @State private var currentStep = 0
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var email = ""
    @State private var phone = ""
    @State private var birthDate = Date()
    @State private var nationality = ""
    @State private var currentAddress = ""

    @State private var employmentStatus: EmploymentStatus = .employed
    @State private var employer = ""
    @State private var position = ""
    @State private var monthlyIncome = ""
    @State private var contractType: ContractType = .permanent

    @State private var hasGuarantor = false
    @State private var guarantorName = ""
    @State private var guarantorEmail = ""
    @State private var guarantorPhone = ""

    @State private var moveInDate = Date()
    @State private var leaseDuration: LeaseDuration = .oneYear
    @State private var motivation = ""

    @State private var uploadedDocuments: [UploadedDocument] = []
    @State private var showDocumentPicker = false

    private let totalSteps = 5

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.Colors.backgroundSecondary
                    .ignoresSafeArea()

                VStack(spacing: 0) {
                    // Progress bar
                    progressBar

                    // Step content
                    ScrollView {
                        VStack(spacing: 24) {
                            stepContent
                        }
                        .padding()
                        .padding(.bottom, 100)
                    }
                }

                // Bottom buttons
                bottomButtons
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: { dismiss() }) {
                        Image.lucide("x")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 20, height: 20)
                            .foregroundColor(Theme.Colors.textPrimary)
                    }
                }

                ToolbarItem(placement: .principal) {
                    Text("Candidature")
                        .font(Theme.Typography.title3())
                        .foregroundColor(Theme.Colors.textPrimary)
                }
            }
        }
    }

    // MARK: - Progress Bar

    private var progressBar: some View {
        VStack(spacing: 8) {
            HStack(spacing: 8) {
                ForEach(0..<totalSteps, id: \.self) { index in
                    Rectangle()
                        .fill(index <= currentStep ? Theme.Colors.primary : Theme.Colors.gray200)
                        .frame(height: 4)
                        .cornerRadius(2)
                }
            }
            .padding(.horizontal)

            HStack {
                Text("Étape \(currentStep + 1) sur \(totalSteps)")
                    .font(Theme.Typography.bodySmall())
                    .foregroundColor(Theme.Colors.textSecondary)

                Spacer()

                Text("\(Int((Double(currentStep + 1) / Double(totalSteps)) * 100))%")
                    .font(Theme.Typography.bodySmall(.semibold))
                    .foregroundColor(Theme.Colors.primary)
            }
            .padding(.horizontal)
        }
        .padding(.vertical, 16)
        .background(Theme.Colors.backgroundPrimary)
    }

    // MARK: - Step Content

    @ViewBuilder
    private var stepContent: some View {
        switch currentStep {
        case 0: personalInfoStep
        case 1: employmentStep
        case 2: guarantorStep
        case 3: preferencesStep
        case 4: documentsStep
        default: EmptyView()
        }
    }

    // MARK: - Step 1: Personal Info

    private var personalInfoStep: some View {
        VStack(alignment: .leading, spacing: 24) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Informations personnelles")
                    .font(Theme.Typography.title2())
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Commençons par vos informations de base")
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
            }

            VStack(spacing: 20) {
                FormField(label: "Prénom", text: $firstName, placeholder: "Votre prénom")
                FormField(label: "Nom", text: $lastName, placeholder: "Votre nom")
                FormField(label: "Email", text: $email, placeholder: "votre@email.com", keyboardType: .emailAddress)
                FormField(label: "Téléphone", text: $phone, placeholder: "+33 6 12 34 56 78", keyboardType: .phonePad)

                VStack(alignment: .leading, spacing: 8) {
                    Text("Date de naissance")
                        .font(Theme.Typography.bodySmall(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    DatePicker("", selection: $birthDate, displayedComponents: .date)
                        .datePickerStyle(.compact)
                        .labelsHidden()
                        .padding(12)
                        .background(Theme.Colors.backgroundPrimary)
                        .cornerRadius(Theme.CornerRadius.md)
                        .overlay(
                            RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                                .stroke(Theme.Colors.gray200, lineWidth: 1)
                        )
                }

                FormField(label: "Nationalité", text: $nationality, placeholder: "Française")
                FormField(label: "Adresse actuelle", text: $currentAddress, placeholder: "12 rue de la Paix, Paris")
            }
        }
    }

    // MARK: - Step 2: Employment

    private var employmentStep: some View {
        VStack(alignment: .leading, spacing: 24) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Situation professionnelle")
                    .font(Theme.Typography.title2())
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Parlez-nous de votre activité professionnelle")
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
            }

            VStack(spacing: 20) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Statut professionnel")
                        .font(Theme.Typography.bodySmall(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    VStack(spacing: 8) {
                        ForEach(EmploymentStatus.allCases, id: \.self) { status in
                            Button(action: {
                                employmentStatus = status
                                Haptic.impact(.light)
                            }) {
                                HStack {
                                    Text(status.label)
                                        .font(Theme.Typography.body())
                                        .foregroundColor(Theme.Colors.textPrimary)

                                    Spacer()

                                    if employmentStatus == status {
                                        Image.lucide("check")
                                            .resizable()
                                            .scaledToFit()
                                            .frame(width: 20, height: 20)
                                            .foregroundColor(Theme.Colors.primary)
                                    }
                                }
                                .padding(16)
                                .background(employmentStatus == status ? Theme.Colors.primary.opacity(0.1) : Theme.Colors.backgroundPrimary)
                                .cornerRadius(Theme.CornerRadius.md)
                                .overlay(
                                    RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                                        .stroke(employmentStatus == status ? Theme.Colors.primary : Theme.Colors.gray200, lineWidth: 1.5)
                                )
                            }
                        }
                    }
                }

                if employmentStatus == .employed || employmentStatus == .selfEmployed {
                    FormField(label: "Employeur / Entreprise", text: $employer, placeholder: "Nom de l'entreprise")
                    FormField(label: "Poste", text: $position, placeholder: "Votre fonction")

                    VStack(alignment: .leading, spacing: 8) {
                        Text("Type de contrat")
                            .font(Theme.Typography.bodySmall(.semibold))
                            .foregroundColor(Theme.Colors.textPrimary)

                        HStack(spacing: 8) {
                            ForEach(ContractType.allCases, id: \.self) { type in
                                Button(action: {
                                    contractType = type
                                    Haptic.impact(.light)
                                }) {
                                    Text(type.label)
                                        .font(Theme.Typography.bodySmall(.semibold))
                                        .foregroundColor(contractType == type ? .white : Theme.Colors.textPrimary)
                                        .padding(.horizontal, 16)
                                        .padding(.vertical, 10)
                                        .background(contractType == type ? Theme.Colors.primary : Theme.Colors.backgroundPrimary)
                                        .cornerRadius(8)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 8)
                                                .stroke(Theme.Colors.gray200, lineWidth: 1)
                                        )
                                }
                            }
                        }
                    }
                }

                FormField(label: "Revenus mensuels nets", text: $monthlyIncome, placeholder: "2500", keyboardType: .numberPad, suffix: "€")
            }
        }
    }

    // MARK: - Step 3: Guarantor

    private var guarantorStep: some View {
        VStack(alignment: .leading, spacing: 24) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Garant")
                    .font(Theme.Typography.title2())
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Un garant renforce votre dossier")
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
            }

            VStack(spacing: 20) {
                Toggle(isOn: $hasGuarantor) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("J'ai un garant")
                            .font(Theme.Typography.body(.semibold))
                            .foregroundColor(Theme.Colors.textPrimary)

                        Text("Recommandé si vos revenus sont inférieurs à 3x le loyer")
                            .font(Theme.Typography.bodySmall())
                            .foregroundColor(Theme.Colors.textSecondary)
                    }
                }
                .toggleStyle(SwitchToggleStyle(tint: Theme.Colors.primary))
                .padding(16)
                .background(Theme.Colors.backgroundPrimary)
                .cornerRadius(Theme.CornerRadius.md)

                if hasGuarantor {
                    VStack(spacing: 16) {
                        FormField(label: "Nom complet du garant", text: $guarantorName, placeholder: "Prénom Nom")
                        FormField(label: "Email du garant", text: $guarantorEmail, placeholder: "garant@email.com", keyboardType: .emailAddress)
                        FormField(label: "Téléphone du garant", text: $guarantorPhone, placeholder: "+33 6 12 34 56 78", keyboardType: .phonePad)

                        HStack(spacing: 12) {
                            Image.lucide("info")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 20, height: 20)
                                .foregroundColor(Theme.Colors.primary)

                            Text("Votre garant recevra un email pour compléter ses informations")
                                .font(Theme.Typography.bodySmall())
                                .foregroundColor(Theme.Colors.textSecondary)
                        }
                        .padding(12)
                        .background(Theme.Colors.primary.opacity(0.1))
                        .cornerRadius(8)
                    }
                }
            }
        }
    }

    // MARK: - Step 4: Preferences

    private var preferencesStep: some View {
        VStack(alignment: .leading, spacing: 24) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Préférences de location")
                    .font(Theme.Typography.title2())
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Quand souhaitez-vous emménager ?")
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
            }

            VStack(spacing: 20) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Date d'emménagement souhaitée")
                        .font(Theme.Typography.bodySmall(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    DatePicker("", selection: $moveInDate, in: Date()..., displayedComponents: .date)
                        .datePickerStyle(.compact)
                        .labelsHidden()
                        .padding(12)
                        .background(Theme.Colors.backgroundPrimary)
                        .cornerRadius(Theme.CornerRadius.md)
                        .overlay(
                            RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                                .stroke(Theme.Colors.gray200, lineWidth: 1)
                        )
                }

                VStack(alignment: .leading, spacing: 8) {
                    Text("Durée de bail souhaitée")
                        .font(Theme.Typography.bodySmall(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    VStack(spacing: 8) {
                        ForEach(LeaseDuration.allCases, id: \.self) { duration in
                            Button(action: {
                                leaseDuration = duration
                                Haptic.impact(.light)
                            }) {
                                HStack {
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text(duration.label)
                                            .font(Theme.Typography.body(.semibold))
                                            .foregroundColor(Theme.Colors.textPrimary)

                                        Text(duration.description)
                                            .font(Theme.Typography.bodySmall())
                                            .foregroundColor(Theme.Colors.textSecondary)
                                    }

                                    Spacer()

                                    if leaseDuration == duration {
                                        Image.lucide("check")
                                            .resizable()
                                            .scaledToFit()
                                            .frame(width: 20, height: 20)
                                            .foregroundColor(Theme.Colors.primary)
                                    }
                                }
                                .padding(16)
                                .background(leaseDuration == duration ? Theme.Colors.primary.opacity(0.1) : Theme.Colors.backgroundPrimary)
                                .cornerRadius(Theme.CornerRadius.md)
                                .overlay(
                                    RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                                        .stroke(leaseDuration == duration ? Theme.Colors.primary : Theme.Colors.gray200, lineWidth: 1.5)
                                )
                            }
                        }
                    }
                }

                VStack(alignment: .leading, spacing: 8) {
                    Text("Pourquoi ce logement ?")
                        .font(Theme.Typography.bodySmall(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text("Facultatif - Présentez votre profil au propriétaire")
                        .font(Theme.Typography.caption())
                        .foregroundColor(Theme.Colors.textTertiary)

                    TextEditor(text: $motivation)
                        .font(Theme.Typography.body())
                        .foregroundColor(Theme.Colors.textPrimary)
                        .frame(height: 120)
                        .padding(12)
                        .background(Theme.Colors.backgroundPrimary)
                        .cornerRadius(Theme.CornerRadius.md)
                        .overlay(
                            RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                                .stroke(Theme.Colors.gray200, lineWidth: 1)
                        )
                }
            }
        }
    }

    // MARK: - Step 5: Documents

    private var documentsStep: some View {
        VStack(alignment: .leading, spacing: 24) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Documents")
                    .font(Theme.Typography.title2())
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Ajoutez vos justificatifs pour finaliser")
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
            }

            VStack(spacing: 16) {
                // Required documents
                VStack(alignment: .leading, spacing: 12) {
                    Text("Documents requis")
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    DocumentUploadCard(
                        title: "Pièce d'identité",
                        description: "Carte d'identité ou passeport",
                        isRequired: true,
                        isUploaded: uploadedDocuments.contains(where: { $0.type == .identity })
                    ) {
                        showDocumentPicker = true
                    }

                    DocumentUploadCard(
                        title: "Justificatif de domicile",
                        description: "Facture de moins de 3 mois",
                        isRequired: true,
                        isUploaded: uploadedDocuments.contains(where: { $0.type == .addressProof })
                    ) {
                        showDocumentPicker = true
                    }

                    DocumentUploadCard(
                        title: "Fiches de paie",
                        description: "3 derniers mois",
                        isRequired: true,
                        isUploaded: uploadedDocuments.contains(where: { $0.type == .payslips })
                    ) {
                        showDocumentPicker = true
                    }
                }

                // Optional documents
                VStack(alignment: .leading, spacing: 12) {
                    Text("Documents optionnels")
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    DocumentUploadCard(
                        title: "Contrat de travail",
                        description: "Renforce votre dossier",
                        isRequired: false,
                        isUploaded: uploadedDocuments.contains(where: { $0.type == .workContract })
                    ) {
                        showDocumentPicker = true
                    }

                    DocumentUploadCard(
                        title: "Avis d'imposition",
                        description: "Dernier avis disponible",
                        isRequired: false,
                        isUploaded: uploadedDocuments.contains(where: { $0.type == .taxNotice })
                    ) {
                        showDocumentPicker = true
                    }
                }
            }
        }
    }

    // MARK: - Bottom Buttons

    private var bottomButtons: some View {
        VStack {
            Spacer()

            HStack(spacing: 12) {
                if currentStep > 0 {
                    Button(action: {
                        withAnimation {
                            currentStep -= 1
                        }
                        Haptic.impact(.light)
                    }) {
                        HStack(spacing: 8) {
                            Image.lucide("arrow-left")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 16, height: 16)

                            Text("Retour")
                                .font(Theme.Typography.body(.semibold))
                        }
                        .foregroundColor(Theme.Colors.textPrimary)
                        .frame(maxWidth: .infinity)
                        .frame(height: Theme.Size.buttonHeight)
                        .background(Theme.Colors.backgroundPrimary)
                        .cornerRadius(Theme.CornerRadius.button)
                        .overlay(
                            RoundedRectangle(cornerRadius: Theme.CornerRadius.button)
                                .stroke(Theme.Colors.gray200, lineWidth: 1)
                        )
                    }
                }

                Button(action: {
                    if currentStep < totalSteps - 1 {
                        withAnimation {
                            currentStep += 1
                        }
                        Haptic.impact(.medium)
                    } else {
                        submitApplication()
                    }
                }) {
                    HStack(spacing: 8) {
                        Text(currentStep < totalSteps - 1 ? "Continuer" : "Envoyer ma candidature")
                            .font(Theme.Typography.body(.semibold))

                        if currentStep < totalSteps - 1 {
                            Image.lucide("arrow-right")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 16, height: 16)
                        }
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: Theme.Size.buttonHeight)
                    .background(Theme.Colors.primaryGradient)
                    .cornerRadius(Theme.CornerRadius.button)
                }
                .disabled(!canProceed)
                .opacity(canProceed ? 1 : 0.5)
            }
            .padding()
            .background(.ultraThinMaterial)
        }
    }

    // MARK: - Helpers

    private var canProceed: Bool {
        switch currentStep {
        case 0:
            return !firstName.isEmpty && !lastName.isEmpty && !email.isEmpty && !phone.isEmpty
        case 1:
            if employmentStatus == .employed || employmentStatus == .selfEmployed {
                return !employer.isEmpty && !position.isEmpty && !monthlyIncome.isEmpty
            }
            return !monthlyIncome.isEmpty
        case 2:
            if hasGuarantor {
                return !guarantorName.isEmpty && !guarantorEmail.isEmpty && !guarantorPhone.isEmpty
            }
            return true
        case 3:
            return true
        case 4:
            let requiredDocs: [DocumentType] = [.identity, .addressProof, .payslips]
            return requiredDocs.allSatisfy { type in
                uploadedDocuments.contains(where: { $0.type == type })
            }
        default:
            return true
        }
    }

    private func submitApplication() {
        Haptic.notification(.success)
        // TODO: Submit to backend
        dismiss()
    }
}

// MARK: - Supporting Models

enum EmploymentStatus: String, CaseIterable {
    case employed = "employed"
    case selfEmployed = "self_employed"
    case student = "student"
    case retired = "retired"
    case unemployed = "unemployed"

    var label: String {
        switch self {
        case .employed: return "Salarié(e)"
        case .selfEmployed: return "Indépendant(e)"
        case .student: return "Étudiant(e)"
        case .retired: return "Retraité(e)"
        case .unemployed: return "Sans emploi"
        }
    }
}

enum ContractType: String, CaseIterable {
    case permanent = "permanent"
    case temporary = "temporary"
    case freelance = "freelance"

    var label: String {
        switch self {
        case .permanent: return "CDI"
        case .temporary: return "CDD"
        case .freelance: return "Freelance"
        }
    }
}

enum LeaseDuration: String, CaseIterable {
    case sixMonths = "6_months"
    case oneYear = "1_year"
    case twoYears = "2_years"
    case threeYears = "3_years"

    var label: String {
        switch self {
        case .sixMonths: return "6 mois"
        case .oneYear: return "1 an"
        case .twoYears: return "2 ans"
        case .threeYears: return "3 ans"
        }
    }

    var description: String {
        switch self {
        case .sixMonths: return "Bail courte durée"
        case .oneYear: return "Standard pour location meublée"
        case .twoYears: return "Engagement moyen terme"
        case .threeYears: return "Standard pour location vide"
        }
    }
}

enum DocumentType {
    case identity
    case addressProof
    case payslips
    case workContract
    case taxNotice
}

struct UploadedDocument: Identifiable {
    let id = UUID().uuidString
    let type: DocumentType
    let fileName: String
    let size: Int
}

// MARK: - Supporting Views

struct FormField: View {
    let label: String
    @Binding var text: String
    let placeholder: String
    var keyboardType: UIKeyboardType = .default
    var suffix: String? = nil

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label)
                .font(Theme.Typography.bodySmall(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)

            HStack {
                TextField(placeholder, text: $text)
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textPrimary)
                    .keyboardType(keyboardType)

                if let suffix = suffix {
                    Text(suffix)
                        .font(Theme.Typography.body())
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }
            .padding(16)
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.md)
            .overlay(
                RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                    .stroke(Theme.Colors.gray200, lineWidth: 1)
            )
        }
    }
}

struct DocumentUploadCard: View {
    let title: String
    let description: String
    let isRequired: Bool
    let isUploaded: Bool
    let onTap: () -> Void

    var body: some View {
        Button(action: {
            Haptic.impact(.light)
            onTap()
        }) {
            HStack(spacing: 16) {
                Image.lucide(isUploaded ? "check-circle" : "upload")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 24, height: 24)
                    .foregroundColor(isUploaded ? Theme.Colors.success : Theme.Colors.primary)
                    .frame(width: 48, height: 48)
                    .background((isUploaded ? Theme.Colors.success : Theme.Colors.primary).opacity(0.1))
                    .cornerRadius(12)

                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: 8) {
                        Text(title)
                            .font(Theme.Typography.body(.semibold))
                            .foregroundColor(Theme.Colors.textPrimary)

                        if isRequired {
                            Text("Requis")
                                .font(.system(size: 10, weight: .semibold))
                                .foregroundColor(.white)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Theme.Colors.error)
                                .cornerRadius(4)
                        }
                    }

                    Text(description)
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)
                }

                Spacer()

                Image.lucide(isUploaded ? "check" : "plus")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 20, height: 20)
                    .foregroundColor(isUploaded ? Theme.Colors.success : Theme.Colors.primary)
            }
            .padding(16)
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.md)
            .overlay(
                RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                    .stroke(isUploaded ? Theme.Colors.success : Theme.Colors.gray200, lineWidth: isUploaded ? 1.5 : 1)
            )
        }
    }
}

// MARK: - Preview

struct ApplicationFormView_Previews: PreviewProvider {
    static var previews: some View {
        ApplicationFormView(property: .mock)
    }
}
