import SwiftUI

// MARK: - Profile Enhancement Coordinator

struct ProfileEnhancementView: View {
    @StateObject private var coordinator = ProfileEnhancementCoordinator()
    @Environment(\.dismiss) private var dismiss

    let userRole: Theme.UserRole

    var body: some View {
        NavigationStack(path: $coordinator.path) {
            EnhancementIntroView(
                userRole: userRole,
                onStart: {
                    coordinator.startEnhancement(for: userRole)
                }
            )
            .navigationDestination(for: EnhancementStep.self) { step in
                stepView(for: step)
            }
        }
        .environmentObject(coordinator)
    }

    @ViewBuilder
    private func stepView(for step: EnhancementStep) -> some View {
        switch step {
        // Searcher steps
        case .aboutYou:
            EnhancementAboutView()
        case .personality:
            EnhancementPersonalityView()
        case .hobbies:
            EnhancementHobbiesView()
        case .preferences:
            EnhancementPreferencesView()
        case .values:
            EnhancementValuesView()
        case .community:
            EnhancementCommunityView()
        case .financial:
            EnhancementFinancialView()
        case .verification:
            EnhancementVerificationView()
        case .review:
            EnhancementReviewView(onComplete: { dismiss() })

        // Owner specific steps
        case .ownerBio:
            OwnerEnhancementBioView()
        case .ownerExperience:
            OwnerEnhancementExperienceView()
        case .ownerPolicies:
            OwnerEnhancementPoliciesView()
        case .ownerServices:
            OwnerEnhancementServicesView()
        case .ownerVerification:
            OwnerEnhancementVerificationView()
        case .ownerReview:
            OwnerEnhancementReviewView(onComplete: { dismiss() })

        // Resident specific steps
        case .residentLifestyle:
            ResidentEnhancementLifestyleView()
        case .residentPersonality:
            ResidentEnhancementPersonalityView()
        case .residentCommunity:
            ResidentEnhancementCommunityView()
        case .residentVerification:
            ResidentEnhancementVerificationView()
        }
    }
}

// MARK: - Enhancement Steps

enum EnhancementStep: Hashable {
    // Searcher steps
    case aboutYou
    case personality
    case hobbies
    case preferences
    case values
    case community
    case financial
    case verification
    case review

    // Owner steps
    case ownerBio
    case ownerExperience
    case ownerPolicies
    case ownerServices
    case ownerVerification
    case ownerReview

    // Resident steps
    case residentLifestyle
    case residentPersonality
    case residentCommunity
    case residentVerification
}

// MARK: - Coordinator

@MainActor
class ProfileEnhancementCoordinator: ObservableObject {
    @Published var path = NavigationPath()
    @Published var currentStep: Int = 0
    @Published var totalSteps: Int = 0
    @Published var userRole: Theme.UserRole = .searcher

    // Enhancement data
    @Published var enhancementData = EnhancementData()

    var progress: Double {
        guard totalSteps > 0 else { return 0 }
        return Double(currentStep) / Double(totalSteps)
    }

    func startEnhancement(for role: Theme.UserRole) {
        userRole = role
        switch role {
        case .searcher:
            totalSteps = 9
            path.append(EnhancementStep.aboutYou)
        case .owner:
            totalSteps = 6
            path.append(EnhancementStep.ownerBio)
        case .resident:
            totalSteps = 4
            path.append(EnhancementStep.residentLifestyle)
        }
        currentStep = 1
    }

    func nextStep() {
        currentStep += 1
        switch userRole {
        case .searcher:
            navigateSearcherStep()
        case .owner:
            navigateOwnerStep()
        case .resident:
            navigateResidentStep()
        }
    }

    func previousStep() {
        if !path.isEmpty {
            path.removeLast()
            currentStep = max(0, currentStep - 1)
        }
    }

    private func navigateSearcherStep() {
        switch currentStep {
        case 2: path.append(EnhancementStep.personality)
        case 3: path.append(EnhancementStep.hobbies)
        case 4: path.append(EnhancementStep.preferences)
        case 5: path.append(EnhancementStep.values)
        case 6: path.append(EnhancementStep.community)
        case 7: path.append(EnhancementStep.financial)
        case 8: path.append(EnhancementStep.verification)
        case 9: path.append(EnhancementStep.review)
        default: break
        }
    }

    private func navigateOwnerStep() {
        switch currentStep {
        case 2: path.append(EnhancementStep.ownerExperience)
        case 3: path.append(EnhancementStep.ownerPolicies)
        case 4: path.append(EnhancementStep.ownerServices)
        case 5: path.append(EnhancementStep.ownerVerification)
        case 6: path.append(EnhancementStep.ownerReview)
        default: break
        }
    }

    private func navigateResidentStep() {
        switch currentStep {
        case 2: path.append(EnhancementStep.residentPersonality)
        case 3: path.append(EnhancementStep.residentCommunity)
        case 4: path.append(EnhancementStep.residentVerification)
        default: break
        }
    }
}

// MARK: - Enhancement Data Model

struct EnhancementData {
    // About
    var bio: String = ""
    var occupation: String = ""
    var languages: [String] = []

    // Personality
    var personalityTraits: [String] = []
    var communicationStyle: String = ""

    // Hobbies
    var hobbies: [String] = []
    var interests: [String] = []

    // Preferences
    var workSchedule: String = ""
    var sleepSchedule: String = ""
    var guestPolicy: String = ""

    // Values
    var importantValues: [String] = []
    var dealbreakers: [String] = []

    // Community
    var socialPreference: String = ""
    var sharedActivities: [String] = []

    // Financial
    var budgetRange: String = ""
    var paymentPreference: String = ""

    // Owner specific
    var ownerBio: String = ""
    var yearsExperience: Int = 0
    var propertyTypes: [String] = []
    var policies: OwnerPolicies = OwnerPolicies()
    var services: [String] = []

    // Resident specific
    var lifestyleHabits: [String] = []
    var communityInvolvement: String = ""
}

struct OwnerPolicies {
    var smokingAllowed: Bool = false
    var petsAllowed: Bool = false
    var guestsAllowed: Bool = true
    var quietHours: String = "22h - 8h"
    var minStay: Int = 6
}

// MARK: - Enhancement Intro View

struct EnhancementIntroView: View {
    let userRole: Theme.UserRole
    let onStart: () -> Void

    var body: some View {
        VStack(spacing: 32) {
            Spacer()

            // Illustration
            ZStack {
                Circle()
                    .fill(roleGradient.opacity(0.2))
                    .frame(width: 140, height: 140)

                Image(systemName: roleIcon)
                    .font(.system(size: 60))
                    .foregroundStyle(roleGradient)
            }

            // Text
            VStack(spacing: 16) {
                Text(titleText)
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))
                    .multilineTextAlignment(.center)

                Text(subtitleText)
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 24)
            }

            // Benefits
            VStack(alignment: .leading, spacing: 16) {
                BenefitRow(
                    icon: "star.fill",
                    text: "Profil plus attractif et complet",
                    color: roleColor
                )
                BenefitRow(
                    icon: "person.2.fill",
                    text: "Meilleurs matchs avec d'autres utilisateurs",
                    color: roleColor
                )
                BenefitRow(
                    icon: "checkmark.shield.fill",
                    text: "Badge de profil vérifié",
                    color: roleColor
                )
            }
            .padding(20)
            .background(Color(hex: "F9FAFB"))
            .cornerRadius(16)

            Spacer()

            // CTA
            Button(action: onStart) {
                HStack(spacing: 8) {
                    Text("Commencer")
                        .font(.system(size: 17, weight: .semibold))
                    Image(systemName: "arrow.right")
                        .font(.system(size: 15, weight: .semibold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(roleGradient)
                .cornerRadius(14)
            }

            // Skip option
            Button("Plus tard") {
                // Dismiss
            }
            .font(.system(size: 15))
            .foregroundColor(Color(hex: "6B7280"))
        }
        .padding(24)
        .navigationTitle("Améliorer mon profil")
        .navigationBarTitleDisplayMode(.inline)
    }

    private var roleColor: Color {
        switch userRole {
        case .searcher: return Color(hex: "FFA040")
        case .owner: return Color(hex: "6E56CF")
        case .resident: return Color(hex: "10B981")
        }
    }

    private var roleGradient: LinearGradient {
        switch userRole {
        case .searcher:
            return LinearGradient(colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")], startPoint: .topLeading, endPoint: .bottomTrailing)
        case .owner:
            return LinearGradient(colors: [Color(hex: "6E56CF"), Color(hex: "9F7AEA")], startPoint: .topLeading, endPoint: .bottomTrailing)
        case .resident:
            return LinearGradient(colors: [Color(hex: "10B981"), Color(hex: "34D399")], startPoint: .topLeading, endPoint: .bottomTrailing)
        }
    }

    private var roleIcon: String {
        switch userRole {
        case .searcher: return "sparkles"
        case .owner: return "building.2.fill"
        case .resident: return "house.fill"
        }
    }

    private var titleText: String {
        switch userRole {
        case .searcher: return "Complétez votre profil\nde chercheur"
        case .owner: return "Améliorez votre profil\nde propriétaire"
        case .resident: return "Enrichissez votre profil\nde résident"
        }
    }

    private var subtitleText: String {
        switch userRole {
        case .searcher: return "Un profil complet augmente vos chances de trouver la colocation idéale de 75%"
        case .owner: return "Les propriétaires avec un profil complet reçoivent 3x plus de candidatures qualifiées"
        case .resident: return "Un profil enrichi aide vos colocataires à mieux vous connaître"
        }
    }
}

// MARK: - Benefit Row

struct BenefitRow: View {
    let icon: String
    let text: String
    let color: Color

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: icon)
                .font(.system(size: 18))
                .foregroundColor(color)
                .frame(width: 24)

            Text(text)
                .font(.system(size: 15))
                .foregroundColor(Color(hex: "374151"))
        }
    }
}

// MARK: - Enhancement Step Container

struct EnhancementStepContainer<Content: View>: View {
    @EnvironmentObject var coordinator: ProfileEnhancementCoordinator

    let title: String
    let subtitle: String
    let canContinue: Bool
    @ViewBuilder let content: Content

    var body: some View {
        VStack(spacing: 0) {
            // Progress bar
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    Rectangle()
                        .fill(Color(hex: "E5E7EB"))
                        .frame(height: 4)

                    Rectangle()
                        .fill(roleColor)
                        .frame(width: geometry.size.width * coordinator.progress, height: 4)
                        .animation(.easeInOut(duration: 0.3), value: coordinator.progress)
                }
            }
            .frame(height: 4)

            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    // Header
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Étape \(coordinator.currentStep)/\(coordinator.totalSteps)")
                            .font(.system(size: 13, weight: .medium))
                            .foregroundColor(roleColor)

                        Text(title)
                            .font(.system(size: 26, weight: .bold))
                            .foregroundColor(Color(hex: "111827"))

                        Text(subtitle)
                            .font(.system(size: 15))
                            .foregroundColor(Color(hex: "6B7280"))
                    }

                    content
                }
                .padding(24)
            }

            // Bottom navigation
            VStack(spacing: 12) {
                Button(action: { coordinator.nextStep() }) {
                    Text("Continuer")
                        .font(.system(size: 17, weight: .semibold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(canContinue ? roleColor : Color(hex: "D1D5DB"))
                        .cornerRadius(14)
                }
                .disabled(!canContinue)

                if coordinator.currentStep > 1 {
                    Button("Retour") {
                        coordinator.previousStep()
                    }
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "6B7280"))
                }
            }
            .padding(24)
            .background(Color.white)
            .shadow(color: .black.opacity(0.05), radius: 10, x: 0, y: -5)
        }
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                if coordinator.currentStep > 1 {
                    Button(action: { coordinator.previousStep() }) {
                        Image(systemName: "chevron.left")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "374151"))
                    }
                }
            }
        }
    }

    private var roleColor: Color {
        switch coordinator.userRole {
        case .searcher: return Color(hex: "FFA040")
        case .owner: return Color(hex: "6E56CF")
        case .resident: return Color(hex: "10B981")
        }
    }
}

// MARK: - Placeholder Step Views (Searcher)

struct EnhancementAboutView: View {
    @EnvironmentObject var coordinator: ProfileEnhancementCoordinator
    @State private var bio = ""
    @State private var occupation = ""

    var body: some View {
        EnhancementStepContainer(
            title: "À propos de vous",
            subtitle: "Présentez-vous en quelques mots",
            canContinue: !bio.isEmpty
        ) {
            VStack(spacing: 20) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Bio")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "374151"))

                    TextEditor(text: $bio)
                        .frame(height: 120)
                        .padding(12)
                        .background(Color(hex: "F9FAFB"))
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                        )

                    Text("\(bio.count)/300 caractères")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "9CA3AF"))
                }

                VStack(alignment: .leading, spacing: 8) {
                    Text("Occupation")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "374151"))

                    TextField("Ex: Étudiant, Développeur...", text: $occupation)
                        .padding(14)
                        .background(Color(hex: "F9FAFB"))
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                        )
                }
            }
        }
        .onChange(of: bio) { newValue in
            coordinator.enhancementData.bio = newValue
        }
    }
}

struct EnhancementPersonalityView: View {
    @EnvironmentObject var coordinator: ProfileEnhancementCoordinator
    @State private var selectedTraits: Set<String> = []

    let traits = ["Extraverti", "Introverti", "Organisé", "Spontané", "Calme", "Énergique", "Créatif", "Pratique", "Sociable", "Indépendant"]

    var body: some View {
        EnhancementStepContainer(
            title: "Votre personnalité",
            subtitle: "Sélectionnez les traits qui vous décrivent",
            canContinue: selectedTraits.count >= 3
        ) {
            FlowLayout(spacing: 10) {
                ForEach(traits, id: \.self) { trait in
                    TraitChip(
                        title: trait,
                        isSelected: selectedTraits.contains(trait)
                    ) {
                        if selectedTraits.contains(trait) {
                            selectedTraits.remove(trait)
                        } else {
                            selectedTraits.insert(trait)
                        }
                    }
                }
            }

            Text("Sélectionnez au moins 3 traits")
                .font(.system(size: 13))
                .foregroundColor(Color(hex: "9CA3AF"))
        }
    }
}

struct EnhancementHobbiesView: View {
    @EnvironmentObject var coordinator: ProfileEnhancementCoordinator
    @State private var selectedHobbies: Set<String> = []

    let hobbies = ["Sport", "Musique", "Cuisine", "Lecture", "Jeux vidéo", "Voyages", "Cinéma", "Art", "Jardinage", "Yoga", "Photographie", "Randonnée"]

    var body: some View {
        EnhancementStepContainer(
            title: "Vos hobbies",
            subtitle: "Qu'aimez-vous faire pendant votre temps libre ?",
            canContinue: selectedHobbies.count >= 2
        ) {
            FlowLayout(spacing: 10) {
                ForEach(hobbies, id: \.self) { hobby in
                    TraitChip(
                        title: hobby,
                        isSelected: selectedHobbies.contains(hobby)
                    ) {
                        if selectedHobbies.contains(hobby) {
                            selectedHobbies.remove(hobby)
                        } else {
                            selectedHobbies.insert(hobby)
                        }
                    }
                }
            }
        }
    }
}

struct EnhancementPreferencesView: View {
    @EnvironmentObject var coordinator: ProfileEnhancementCoordinator
    @State private var workSchedule = ""
    @State private var sleepSchedule = ""

    var body: some View {
        EnhancementStepContainer(
            title: "Vos habitudes",
            subtitle: "Aidez-nous à trouver des colocataires compatibles",
            canContinue: !workSchedule.isEmpty && !sleepSchedule.isEmpty
        ) {
            VStack(spacing: 20) {
                PreferenceSelector(
                    title: "Horaires de travail",
                    options: ["Journée classique", "Horaires flexibles", "Nuit", "Télétravail"],
                    selection: $workSchedule
                )

                PreferenceSelector(
                    title: "Habitudes de sommeil",
                    options: ["Couche-tôt", "Couche-tard", "Variable"],
                    selection: $sleepSchedule
                )
            }
        }
    }
}

struct EnhancementValuesView: View {
    @EnvironmentObject var coordinator: ProfileEnhancementCoordinator
    @State private var selectedValues: Set<String> = []

    let values = ["Respect", "Communication", "Propreté", "Écologie", "Partage", "Vie privée", "Entraide", "Convivialité"]

    var body: some View {
        EnhancementStepContainer(
            title: "Vos valeurs",
            subtitle: "Qu'est-ce qui est important pour vous en colocation ?",
            canContinue: selectedValues.count >= 2
        ) {
            FlowLayout(spacing: 10) {
                ForEach(values, id: \.self) { value in
                    TraitChip(
                        title: value,
                        isSelected: selectedValues.contains(value)
                    ) {
                        if selectedValues.contains(value) {
                            selectedValues.remove(value)
                        } else {
                            selectedValues.insert(value)
                        }
                    }
                }
            }
        }
    }
}

struct EnhancementCommunityView: View {
    @EnvironmentObject var coordinator: ProfileEnhancementCoordinator
    @State private var socialPreference = ""

    var body: some View {
        EnhancementStepContainer(
            title: "Vie sociale",
            subtitle: "Quel type de vie en colocation recherchez-vous ?",
            canContinue: !socialPreference.isEmpty
        ) {
            VStack(spacing: 16) {
                SocialOptionCard(
                    title: "Très social",
                    description: "J'aime passer du temps avec mes colocs, partager des repas et des activités",
                    icon: "person.3.fill",
                    isSelected: socialPreference == "social"
                ) {
                    socialPreference = "social"
                }

                SocialOptionCard(
                    title: "Équilibré",
                    description: "Un mix entre moments partagés et indépendance",
                    icon: "person.2.fill",
                    isSelected: socialPreference == "balanced"
                ) {
                    socialPreference = "balanced"
                }

                SocialOptionCard(
                    title: "Indépendant",
                    description: "Je préfère ma tranquillité tout en restant cordial",
                    icon: "person.fill",
                    isSelected: socialPreference == "independent"
                ) {
                    socialPreference = "independent"
                }
            }
        }
    }
}

struct EnhancementFinancialView: View {
    @EnvironmentObject var coordinator: ProfileEnhancementCoordinator
    @State private var budgetRange = ""

    var body: some View {
        EnhancementStepContainer(
            title: "Budget",
            subtitle: "Quel est votre budget mensuel pour le loyer ?",
            canContinue: !budgetRange.isEmpty
        ) {
            PreferenceSelector(
                title: "Fourchette de budget",
                options: ["< 400€", "400€ - 600€", "600€ - 800€", "800€ - 1000€", "> 1000€"],
                selection: $budgetRange
            )
        }
    }
}

struct EnhancementVerificationView: View {
    @EnvironmentObject var coordinator: ProfileEnhancementCoordinator
    @State private var idVerified = false
    @State private var phoneVerified = false

    var body: some View {
        EnhancementStepContainer(
            title: "Vérification",
            subtitle: "Augmentez la confiance de votre profil",
            canContinue: true
        ) {
            VStack(spacing: 16) {
                VerificationRow(
                    title: "Pièce d'identité",
                    subtitle: "Vérifiez votre identité pour plus de confiance",
                    icon: "person.text.rectangle",
                    isVerified: idVerified
                ) {
                    idVerified = true
                }

                VerificationRow(
                    title: "Numéro de téléphone",
                    subtitle: "Confirmez votre numéro",
                    icon: "phone.fill",
                    isVerified: phoneVerified
                ) {
                    phoneVerified = true
                }
            }

            Text("La vérification est optionnelle mais recommandée")
                .font(.system(size: 13))
                .foregroundColor(Color(hex: "9CA3AF"))
                .padding(.top, 8)
        }
    }
}

struct EnhancementReviewView: View {
    @EnvironmentObject var coordinator: ProfileEnhancementCoordinator
    let onComplete: () -> Void

    var body: some View {
        VStack(spacing: 32) {
            Spacer()

            // Success illustration
            ZStack {
                Circle()
                    .fill(Color(hex: "10B981").opacity(0.2))
                    .frame(width: 140, height: 140)

                Image(systemName: "checkmark.circle.fill")
                    .font(.system(size: 70))
                    .foregroundColor(Color(hex: "10B981"))
            }

            VStack(spacing: 12) {
                Text("Profil amélioré !")
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Votre profil est maintenant plus complet et attractif")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
            }

            // Stats
            HStack(spacing: 24) {
                StatBadge(value: "+75%", label: "Visibilité")
                StatBadge(value: "100%", label: "Complété")
            }

            Spacer()

            Button(action: onComplete) {
                Text("Terminer")
                    .font(.system(size: 17, weight: .semibold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(Color(hex: "10B981"))
                    .cornerRadius(14)
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 24)
        }
        .navigationBarBackButtonHidden(true)
    }
}

// MARK: - Owner Enhancement Views (Placeholders)

struct OwnerEnhancementBioView: View {
    @EnvironmentObject var coordinator: ProfileEnhancementCoordinator
    @State private var bio = ""

    var body: some View {
        EnhancementStepContainer(
            title: "Présentez-vous",
            subtitle: "Décrivez-vous en tant que propriétaire",
            canContinue: bio.count >= 50
        ) {
            TextEditor(text: $bio)
                .frame(height: 150)
                .padding(12)
                .background(Color(hex: "F9FAFB"))
                .cornerRadius(12)
        }
    }
}

struct OwnerEnhancementExperienceView: View {
    @EnvironmentObject var coordinator: ProfileEnhancementCoordinator
    @State private var years = 1

    var body: some View {
        EnhancementStepContainer(
            title: "Votre expérience",
            subtitle: "Depuis combien de temps êtes-vous propriétaire ?",
            canContinue: true
        ) {
            Stepper("\(years) an\(years > 1 ? "s" : "")", value: $years, in: 0...50)
                .padding()
                .background(Color(hex: "F9FAFB"))
                .cornerRadius(12)
        }
    }
}

struct OwnerEnhancementPoliciesView: View {
    @EnvironmentObject var coordinator: ProfileEnhancementCoordinator
    @State private var smokingAllowed = false
    @State private var petsAllowed = false

    var body: some View {
        EnhancementStepContainer(
            title: "Vos règles",
            subtitle: "Définissez les règles de votre propriété",
            canContinue: true
        ) {
            VStack(spacing: 16) {
                Toggle("Fumeurs acceptés", isOn: $smokingAllowed)
                Toggle("Animaux acceptés", isOn: $petsAllowed)
            }
            .padding()
            .background(Color(hex: "F9FAFB"))
            .cornerRadius(12)
        }
    }
}

struct OwnerEnhancementServicesView: View {
    @EnvironmentObject var coordinator: ProfileEnhancementCoordinator
    @State private var selectedServices: Set<String> = []

    let services = ["Ménage", "Internet", "Électricité incluse", "Parking", "Buanderie"]

    var body: some View {
        EnhancementStepContainer(
            title: "Services inclus",
            subtitle: "Quels services proposez-vous ?",
            canContinue: true
        ) {
            FlowLayout(spacing: 10) {
                ForEach(services, id: \.self) { service in
                    TraitChip(
                        title: service,
                        isSelected: selectedServices.contains(service)
                    ) {
                        if selectedServices.contains(service) {
                            selectedServices.remove(service)
                        } else {
                            selectedServices.insert(service)
                        }
                    }
                }
            }
        }
    }
}

struct OwnerEnhancementVerificationView: View {
    var body: some View {
        EnhancementVerificationView()
    }
}

struct OwnerEnhancementReviewView: View {
    let onComplete: () -> Void

    var body: some View {
        EnhancementReviewView(onComplete: onComplete)
    }
}

// MARK: - Resident Enhancement Views (Placeholders)

struct ResidentEnhancementLifestyleView: View {
    @EnvironmentObject var coordinator: ProfileEnhancementCoordinator
    @State private var selectedHabits: Set<String> = []

    let habits = ["Cuisine souvent", "Télétravail", "Sport régulier", "Sorties fréquentes", "Calme", "Fêtes occasionnelles"]

    var body: some View {
        EnhancementStepContainer(
            title: "Votre mode de vie",
            subtitle: "Partagez vos habitudes quotidiennes",
            canContinue: selectedHabits.count >= 2
        ) {
            FlowLayout(spacing: 10) {
                ForEach(habits, id: \.self) { habit in
                    TraitChip(
                        title: habit,
                        isSelected: selectedHabits.contains(habit)
                    ) {
                        if selectedHabits.contains(habit) {
                            selectedHabits.remove(habit)
                        } else {
                            selectedHabits.insert(habit)
                        }
                    }
                }
            }
        }
    }
}

struct ResidentEnhancementPersonalityView: View {
    var body: some View {
        EnhancementPersonalityView()
    }
}

struct ResidentEnhancementCommunityView: View {
    var body: some View {
        EnhancementCommunityView()
    }
}

struct ResidentEnhancementVerificationView: View {
    var body: some View {
        EnhancementVerificationView()
    }
}

// MARK: - Helper Components

struct TraitChip: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 14, weight: isSelected ? .semibold : .medium))
                .foregroundColor(isSelected ? .white : Color(hex: "374151"))
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(isSelected ? Color(hex: "FFA040") : Color(hex: "F3F4F6"))
                .cornerRadius(999)
        }
    }
}

struct PreferenceSelector: View {
    let title: String
    let options: [String]
    @Binding var selection: String

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Color(hex: "374151"))

            FlowLayout(spacing: 10) {
                ForEach(options, id: \.self) { option in
                    Button(action: { selection = option }) {
                        Text(option)
                            .font(.system(size: 14, weight: selection == option ? .semibold : .medium))
                            .foregroundColor(selection == option ? .white : Color(hex: "374151"))
                            .padding(.horizontal, 16)
                            .padding(.vertical, 10)
                            .background(selection == option ? Color(hex: "FFA040") : Color(hex: "F3F4F6"))
                            .cornerRadius(10)
                    }
                }
            }
        }
    }
}

struct SocialOptionCard: View {
    let title: String
    let description: String
    let icon: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 14) {
                Image(systemName: icon)
                    .font(.system(size: 24))
                    .foregroundColor(isSelected ? Color(hex: "FFA040") : Color(hex: "6B7280"))
                    .frame(width: 50, height: 50)
                    .background(isSelected ? Color(hex: "FFA040").opacity(0.1) : Color(hex: "F3F4F6"))
                    .cornerRadius(12)

                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    Text(description)
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "6B7280"))
                        .lineLimit(2)
                }

                Spacer()

                if isSelected {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 22))
                        .foregroundColor(Color(hex: "FFA040"))
                }
            }
            .padding(16)
            .background(Color.white)
            .cornerRadius(14)
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .stroke(isSelected ? Color(hex: "FFA040") : Color(hex: "E5E7EB"), lineWidth: isSelected ? 2 : 1)
            )
        }
    }
}

struct VerificationRow: View {
    let title: String
    let subtitle: String
    let icon: String
    let isVerified: Bool
    let action: () -> Void

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: icon)
                .font(.system(size: 22))
                .foregroundColor(isVerified ? Color(hex: "10B981") : Color(hex: "6B7280"))
                .frame(width: 50, height: 50)
                .background(isVerified ? Color(hex: "10B981").opacity(0.1) : Color(hex: "F3F4F6"))
                .cornerRadius(12)

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                Text(subtitle)
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            Spacer()

            if isVerified {
                Image(systemName: "checkmark.circle.fill")
                    .font(.system(size: 22))
                    .foregroundColor(Color(hex: "10B981"))
            } else {
                Button(action: action) {
                    Text("Vérifier")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "FFA040"))
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(Color(hex: "FFA040").opacity(0.1))
                        .cornerRadius(8)
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(14)
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
        )
    }
}

struct StatBadge: View {
    let value: String
    let label: String

    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.system(size: 24, weight: .bold))
                .foregroundColor(Color(hex: "10B981"))

            Text(label)
                .font(.system(size: 13))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .padding(.horizontal, 24)
        .padding(.vertical, 16)
        .background(Color(hex: "F0FDF4"))
        .cornerRadius(12)
    }
}

// MARK: - Preview

struct ProfileEnhancementView_Previews: PreviewProvider {
    static var previews: some View {
        ProfileEnhancementView(userRole: .searcher)
    }
}
