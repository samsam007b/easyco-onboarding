import SwiftUI
import PhotosUI

// MARK: - Apply View (Candidature Multi-Étapes)

struct ApplyView: View {
    let property: Property
    @StateObject private var viewModel = ApplyViewModel()
    @Environment(\.dismiss) private var dismiss
    @State private var currentStep = 1

    private let totalSteps = 4

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Progress bar
                progressBar

                // Content selon l'étape
                ScrollView {
                    Group {
                        switch currentStep {
                        case 1: step1PersonalInfo
                        case 2: step2ProfessionalInfo
                        case 3: step3Documents
                        case 4: step4Motivation
                        default: EmptyView()
                        }
                    }
                    .padding(24)
                }

                // Navigation buttons
                navigationButtons
            }
            .background(Color(hex: "F9FAFB"))
            .navigationTitle("Candidature")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark")
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }
            }
            .alert("Candidature envoyée", isPresented: $viewModel.showSuccessAlert) {
                Button("OK") {
                    dismiss()
                }
            } message: {
                Text("Votre candidature a été envoyée avec succès !")
            }
        }
    }

    // MARK: - Progress Bar

    private var progressBar: some View {
        VStack(spacing: 16) {
            HStack(spacing: 8) {
                ForEach(1...totalSteps, id: \.self) { step in
                    Rectangle()
                        .fill(step <= currentStep ? Color(hex: "FFA040") : Color(hex: "E5E7EB"))
                        .frame(height: 4)
                        .cornerRadius(2)
                }
            }
            .padding(.horizontal, 24)

            Text("Étape \(currentStep)/\(totalSteps)")
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .padding(.top, 16)
        .padding(.bottom, 8)
        .background(Color.white)
    }

    // MARK: - Step 1: Personal Info

    private var step1PersonalInfo: some View {
        VStack(alignment: .leading, spacing: 20) {
            stepHeader(
                icon: "person.fill",
                title: "Informations personnelles",
                subtitle: "Renseignez vos informations de base"
            )

            SearcherFormField(label: "Prénom") {
                TextField("Votre prénom", text: $viewModel.personalInfo.firstName)
            }

            SearcherFormField(label: "Nom") {
                TextField("Votre nom", text: $viewModel.personalInfo.lastName)
            }

            SearcherFormField(label: "Email") {
                TextField("votre@email.com", text: $viewModel.personalInfo.email)
                    .keyboardType(.emailAddress)
                    .textInputAutocapitalization(.never)
            }

            SearcherFormField(label: "Téléphone") {
                TextField("+33 6 12 34 56 78", text: $viewModel.personalInfo.phone)
                    .keyboardType(.phonePad)
            }

            SearcherFormField(label: "Date de naissance") {
                DatePicker(
                    "",
                    selection: $viewModel.personalInfo.dateOfBirth,
                    displayedComponents: .date
                )
                .datePickerStyle(.compact)
            }

            SearcherFormField(label: "Nationalité") {
                TextField("Française", text: $viewModel.personalInfo.nationality)
            }
        }
    }

    // MARK: - Step 2: Professional Info

    private var step2ProfessionalInfo: some View {
        VStack(alignment: .leading, spacing: 20) {
            stepHeader(
                icon: "briefcase.fill",
                title: "Situation professionnelle",
                subtitle: "Informations sur votre activité"
            )

            SearcherFormField(label: "Statut") {
                Picker("", selection: $viewModel.professionalInfo.employmentStatus) {
                    ForEach(EmploymentStatus.allCases, id: \.self) { status in
                        Text(status.displayName).tag(status)
                    }
                }
                .pickerStyle(.menu)
            }

            if viewModel.professionalInfo.employmentStatus != .unemployed {
                SearcherFormField(label: viewModel.professionalInfo.employmentStatus == .student ? "Établissement" : "Entreprise") {
                    TextField("Nom", text: $viewModel.professionalInfo.companyName)
                }

                SearcherFormField(label: viewModel.professionalInfo.employmentStatus == .student ? "Formation" : "Poste") {
                    TextField("Intitulé", text: $viewModel.professionalInfo.position)
                }

                SearcherFormField(label: "Revenus mensuels") {
                    HStack {
                        TextField("0", value: $viewModel.professionalInfo.monthlyIncome, format: .number)
                            .keyboardType(.decimalPad)
                        Text("€")
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }
            }

            // Guarantor toggle
            Toggle(isOn: $viewModel.professionalInfo.hasGuarantor) {
                Text("J'ai un garant")
                    .font(.system(size: 15, weight: .medium))
            }
            .tint(Color(hex: "FFA040"))

            if viewModel.professionalInfo.hasGuarantor {
                VStack(alignment: .leading, spacing: 16) {
                    Text("Informations du garant")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(Color(hex: "374151"))

                    SearcherFormField(label: "Nom complet") {
                        TextField("Nom du garant", text: Binding(
                            get: { viewModel.professionalInfo.guarantorInfo?.name ?? "" },
                            set: { viewModel.updateGuarantorInfo(name: $0) }
                        ))
                    }

                    SearcherFormField(label: "Lien de parenté") {
                        TextField("Ex: Père, Mère", text: Binding(
                            get: { viewModel.professionalInfo.guarantorInfo?.relationship ?? "" },
                            set: { viewModel.updateGuarantorInfo(relationship: $0) }
                        ))
                    }
                }
                .padding(16)
                .background(Color(hex: "FFF4ED"))
                .cornerRadius(12)
            }
        }
    }

    // MARK: - Step 3: Documents

    private var step3Documents: some View {
        VStack(alignment: .leading, spacing: 20) {
            stepHeader(
                icon: "doc.fill",
                title: "Documents justificatifs",
                subtitle: "Ajoutez les pièces nécessaires"
            )

            // Required documents
            VStack(alignment: .leading, spacing: 12) {
                Text("Documents obligatoires")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(hex: "374151"))

                DocumentUploadButton(
                    type: .idCard,
                    isUploaded: viewModel.hasDocument(.idCard),
                    onUpload: { viewModel.uploadDocument(.idCard) }
                )

                DocumentUploadButton(
                    type: .payslip,
                    isUploaded: viewModel.hasDocument(.payslip),
                    onUpload: { viewModel.uploadDocument(.payslip) }
                )
            }

            // Optional documents
            VStack(alignment: .leading, spacing: 12) {
                Text("Documents optionnels")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(hex: "374151"))

                if viewModel.professionalInfo.employmentStatus == .employee {
                    DocumentUploadButton(
                        type: .employmentContract,
                        isUploaded: viewModel.hasDocument(.employmentContract),
                        onUpload: { viewModel.uploadDocument(.employmentContract) }
                    )
                }

                if viewModel.professionalInfo.employmentStatus == .student {
                    DocumentUploadButton(
                        type: .studentCard,
                        isUploaded: viewModel.hasDocument(.studentCard),
                        onUpload: { viewModel.uploadDocument(.studentCard) }
                    )
                }

                if viewModel.professionalInfo.hasGuarantor {
                    DocumentUploadButton(
                        type: .guarantorDocument,
                        isUploaded: viewModel.hasDocument(.guarantorDocument),
                        onUpload: { viewModel.uploadDocument(.guarantorDocument) }
                    )
                }
            }

            // Info box
            HStack(alignment: .top, spacing: 12) {
                Image(systemName: "info.circle.fill")
                    .foregroundColor(Color(hex: "3B82F6"))
                VStack(alignment: .leading, spacing: 4) {
                    Text("Formats acceptés")
                        .font(.system(size: 13, weight: .semibold))
                    Text("PDF, JPG, PNG (max 10MB par fichier)")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "6B7280"))
                }
            }
            .padding(12)
            .background(Color(hex: "EFF6FF"))
            .cornerRadius(8)
        }
    }

    // MARK: - Step 4: Motivation

    private var step4Motivation: some View {
        VStack(alignment: .leading, spacing: 20) {
            stepHeader(
                icon: "text.bubble.fill",
                title: "Message de motivation",
                subtitle: "Présentez-vous au propriétaire"
            )

            VStack(alignment: .leading, spacing: 8) {
                Text("Votre message")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "374151"))

                TextEditor(text: $viewModel.motivationMessage)
                    .frame(minHeight: 150)
                    .padding(12)
                    .background(Color.white)
                    .cornerRadius(8)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                    )

                Text("\(viewModel.motivationMessage.count)/500 caractères")
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            // Summary
            VStack(alignment: .leading, spacing: 16) {
                Text("Récapitulatif")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                SummaryRow(label: "Nom", value: "\(viewModel.personalInfo.firstName) \(viewModel.personalInfo.lastName)")
                SummaryRow(label: "Email", value: viewModel.personalInfo.email)
                SummaryRow(label: "Statut", value: viewModel.professionalInfo.employmentStatus.displayName)
                SummaryRow(label: "Documents", value: "\(viewModel.documents.count) fichiers")
            }
            .padding(16)
            .background(Color.white)
            .cornerRadius(12)
        }
    }

    // MARK: - Navigation Buttons

    private var navigationButtons: some View {
        HStack(spacing: 12) {
            if currentStep > 1 {
                Button(action: { currentStep -= 1 }) {
                    HStack {
                        Image(systemName: "chevron.left")
                        Text("Précédent")
                    }
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(Color(hex: "6B7280"))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(Color.white)
                    .cornerRadius(999)
                    .overlay(
                        RoundedRectangle(cornerRadius: 999)
                            .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                    )
                }
            }

            Button(action: {
                if currentStep < totalSteps {
                    currentStep += 1
                } else {
                    _Concurrency.Task {
                        await viewModel.submitApplication(propertyId: property.id)
                    }
                }
            }) {
                HStack {
                    Text(currentStep == totalSteps ? "Envoyer" : "Suivant")
                    if currentStep < totalSteps {
                        Image(systemName: "chevron.right")
                    }
                }
                .font(.system(size: 15, weight: .semibold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(
                    LinearGradient(
                        colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(999)
                .opacity(viewModel.canProceed(from: currentStep) ? 1.0 : 0.5)
            }
            .disabled(!viewModel.canProceed(from: currentStep))
        }
        .padding(16)
        .background(Color.white)
        .shadow(color: .black.opacity(0.05), radius: 10, x: 0, y: -5)
    }

    // MARK: - Helpers

    private func stepHeader(icon: String, title: String, subtitle: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.system(size: 24))
                    .foregroundColor(Color(hex: "FFA040"))

                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(Color(hex: "111827"))

                    Text(subtitle)
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))
                }
            }
        }
        .padding(.bottom, 8)
    }
}

// MARK: - Searcher Form Field

struct SearcherFormField<Content: View>: View {
    let label: String
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Color(hex: "374151"))

            content
                .font(.system(size: 15))
                .padding(12)
                .background(Color.white)
                .cornerRadius(8)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                )
        }
    }
}

// MARK: - Document Upload Button

struct DocumentUploadButton: View {
    let type: DocumentType
    let isUploaded: Bool
    let onUpload: () -> Void

    var body: some View {
        Button(action: onUpload) {
            HStack {
                Image(systemName: type.icon)
                    .font(.system(size: 18))
                    .foregroundColor(isUploaded ? Color(hex: "10B981") : Color(hex: "6B7280"))

                VStack(alignment: .leading, spacing: 2) {
                    Text(type.displayName)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "111827"))

                    if type.isRequired {
                        Text("Obligatoire")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "EF4444"))
                    }
                }

                Spacer()

                if isUploaded {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(Color(hex: "10B981"))
                } else {
                    Image(systemName: "arrow.up.circle")
                        .foregroundColor(Color(hex: "FFA040"))
                }
            }
            .padding(12)
            .background(isUploaded ? Color(hex: "F0FDF4") : Color.white)
            .cornerRadius(8)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(isUploaded ? Color(hex: "10B981") : Color(hex: "E5E7EB"), lineWidth: 1)
            )
        }
    }
}

// MARK: - Summary Row

struct SummaryRow: View {
    let label: String
    let value: String

    var body: some View {
        HStack {
            Text(label)
                .font(.system(size: 13))
                .foregroundColor(Color(hex: "6B7280"))
            Spacer()
            Text(value)
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(Color(hex: "111827"))
        }
    }
}

// MARK: - ViewModel

class ApplyViewModel: ObservableObject {
    @Published var personalInfo = PersonalInfo()
    @Published var professionalInfo = ProfessionalInfo()
    @Published var documents: [ApplicationDocument] = []
    @Published var motivationMessage = ""
    @Published var showSuccessAlert = false

    func canProceed(from step: Int) -> Bool {
        switch step {
        case 1:
            return !personalInfo.firstName.isEmpty &&
                   !personalInfo.lastName.isEmpty &&
                   !personalInfo.email.isEmpty &&
                   !personalInfo.phone.isEmpty
        case 2:
            return !professionalInfo.companyName.isEmpty &&
                   professionalInfo.monthlyIncome > 0
        case 3:
            return hasDocument(.idCard) && hasDocument(.payslip)
        case 4:
            return !motivationMessage.isEmpty
        default:
            return true
        }
    }

    func hasDocument(_ type: DocumentType) -> Bool {
        documents.contains { $0.type == type }
    }

    func uploadDocument(_ type: DocumentType) {
        // TODO: Implement file picker and upload
        let doc = ApplicationDocument(
            type: type,
            fileName: "\(type.displayName).pdf",
            fileURL: "mock_url"
        )
        documents.append(doc)
    }

    func updateGuarantorInfo(name: String? = nil, relationship: String? = nil) {
        if professionalInfo.guarantorInfo == nil {
            professionalInfo.guarantorInfo = GuarantorInfo()
        }

        if let name = name {
            professionalInfo.guarantorInfo?.name = name
        }
        if let relationship = relationship {
            professionalInfo.guarantorInfo?.relationship = relationship
        }
    }

    func submitApplication(propertyId: UUID) async {
        // TODO: API call
        try? await _Concurrency.Task.sleep(nanoseconds: 1_000_000_000)
        showSuccessAlert = true
    }
}
