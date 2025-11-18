import SwiftUI

// MARK: - Onboarding Coordinator

@MainActor
class OnboardingCoordinator: ObservableObject {
    @Published var currentStep = 0
    @Published var userType: User.UserType
    @Published var onboardingData: OnboardingData
    @Published var isCompleted = false

    init(userType: User.UserType) {
        self.userType = userType
        self.onboardingData = OnboardingData()
    }

    var totalSteps: Int {
        switch userType {
        case .searcher: return 8  // Simplified from 14
        case .owner: return 6     // Simplified from 9
        case .resident: return 5  // Simplified from 6
        }
    }

    var progress: Double {
        Double(currentStep) / Double(totalSteps)
    }

    func nextStep() {
        if currentStep < totalSteps - 1 {
            currentStep += 1
        } else {
            completeOnboarding()
        }
    }

    func previousStep() {
        if currentStep > 0 {
            currentStep -= 1
        }
    }

    func completeOnboarding() {
        // Update user's onboarding status
        if var user = AuthManager.shared.currentUser {
            user.onboardingCompleted = true
            user.firstName = onboardingData.firstName
            user.lastName = onboardingData.lastName
            user.phoneNumber = onboardingData.phoneNumber
            AuthManager.shared.currentUser = user
        }

        isCompleted = true
        // TODO: Save to backend (Supabase)
        print("✅ Onboarding completed for \(userType)")
    }
}

// MARK: - Onboarding Data Model

struct OnboardingData {
    // Basic Info (all roles)
    var firstName: String = ""
    var lastName: String = ""
    var dateOfBirth: Date = Date()
    var nationality: String = ""
    var phoneNumber: String = ""
    var languages: [String] = []

    // Searcher specific
    var wakeUpTime: String = "moderate"
    var sleepTime: String = "moderate"
    var workSchedule: String = "traditional"
    var isSmoker: Bool = false
    var drinksAlcohol: String = "occasionally"
    var cleanliness: String = "moderate"
    var budgetMin: Double = 400
    var budgetMax: Double = 1000
    var preferredCity: String = ""
    var moveInDate: Date = Date()

    // Social preferences (searcher)
    var socialLevel: String = "balanced"
    var guestsFrequency: String = "sometimes"
    var noiseTolerance: String = "medium"

    // Ideal coliving (searcher)
    var roommateCount: String = "3-4"
    var genderPreference: String = "no-preference"
    var ageRange: String = "26-35"

    // Owner specific
    var ownerType: String = "individual"
    var hasProperty: Bool = false
    var propertyCity: String = ""
    var propertyType: String = ""
    var bankIBAN: String = ""
    var bankAccountHolder: String = ""

    // Resident specific
    var currentAddress: String = ""
    var reasonForChange: String = ""
    var introvertExtrovertScale: Double = 5
    var sociabilityLevel: String = "medium"
}

// MARK: - Onboarding Container View

struct OnboardingContainerView: View {
    @StateObject var coordinator: OnboardingCoordinator
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationStack {
            ZStack {
                // Background (bg-gray-50 from web app)
                Color(hex: "F9FAFB")
                    .ignoresSafeArea()

                VStack(spacing: 0) {
                    // Progress bar
                    progressBar

                    // Current step view
                    currentStepView
                        .animation(.easeInOut, value: coordinator.currentStep)

                    // Navigation buttons
                    navigationButtons
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    if coordinator.currentStep > 0 {
                        Button("Retour") {
                            coordinator.previousStep()
                        }
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(roleColor)
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Ignorer") {
                        dismiss()
                    }
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "9CA3AF")) // text-gray-400
                }
            }
            .onChange(of: coordinator.isCompleted) { completed in
                if completed {
                    dismiss()
                }
            }
        }
    }

    private var progressBar: some View {
        VStack(spacing: 8) {
            // Step indicator (text-sm font-medium)
            HStack {
                Text("Étape \(coordinator.currentStep + 1) sur \(coordinator.totalSteps)")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "6B7280")) // text-gray-500
                Spacer()
                Text("\(Int(coordinator.progress * 100))%")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(roleColor)
            }
            .padding(.horizontal, 24) // px-6

            // Progress bar (h-1.5 = 6px, bg-gray-200, rounded-full)
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    // Background
                    Rectangle()
                        .fill(Color(hex: "E5E7EB")) // bg-gray-200
                        .frame(height: 6) // h-1.5

                    // Filled progress
                    Rectangle()
                        .fill(roleGradient)
                        .frame(width: geometry.size.width * coordinator.progress, height: 6)
                        .animation(.easeInOut, value: coordinator.progress)
                }
                .cornerRadius(999) // rounded-full
            }
            .frame(height: 6)
            .padding(.horizontal, 24)
        }
        .padding(.vertical, 16) // py-4
        .background(Color.white)
        .shadow(color: Color.black.opacity(0.05), radius: 4, x: 0, y: 2) // shadow-sm
    }

    @ViewBuilder
    private var currentStepView: some View {
        ScrollView {
            VStack(spacing: 24) {
                switch coordinator.userType {
                case .searcher:
                    searcherStepView
                case .owner:
                    ownerStepView
                case .resident:
                    residentStepView
                }
            }
            .padding(20)
        }
    }

    @ViewBuilder
    private var searcherStepView: some View {
        switch coordinator.currentStep {
        case 0:
            OnboardingBasicInfoView(data: $coordinator.onboardingData)
        case 1:
            OnboardingDailyHabitsView(data: $coordinator.onboardingData)
        case 2:
            OnboardingHomeLifestyleView(data: $coordinator.onboardingData)
        case 3:
            OnboardingSocialVibeView(data: $coordinator.onboardingData)
        case 4:
            OnboardingIdealColivingView(data: $coordinator.onboardingData)
        case 5:
            OnboardingPreferencesView(data: $coordinator.onboardingData)
        case 6:
            OnboardingVerificationView(data: $coordinator.onboardingData)
        case 7:
            OnboardingReviewView(data: coordinator.onboardingData, userType: .searcher)
        default:
            EmptyView()
        }
    }

    @ViewBuilder
    private var ownerStepView: some View {
        switch coordinator.currentStep {
        case 0:
            OnboardingBasicInfoView(data: $coordinator.onboardingData)
        case 1:
            OnboardingOwnerAboutView(data: $coordinator.onboardingData)
        case 2:
            OnboardingPropertyBasicsView(data: $coordinator.onboardingData)
        case 3:
            OnboardingPaymentInfoView(data: $coordinator.onboardingData)
        case 4:
            OnboardingVerificationView(data: $coordinator.onboardingData)
        case 5:
            OnboardingReviewView(data: coordinator.onboardingData, userType: .owner)
        default:
            EmptyView()
        }
    }

    @ViewBuilder
    private var residentStepView: some View {
        switch coordinator.currentStep {
        case 0:
            OnboardingBasicInfoView(data: $coordinator.onboardingData)
        case 1:
            OnboardingLifestyleView(data: $coordinator.onboardingData)
        case 2:
            OnboardingLivingSituationView(data: $coordinator.onboardingData)
        case 3:
            OnboardingPersonalityView(data: $coordinator.onboardingData)
        case 4:
            OnboardingReviewView(data: coordinator.onboardingData, userType: .resident)
        default:
            EmptyView()
        }
    }

    private var navigationButtons: some View {
        HStack(spacing: 12) {
            if coordinator.currentStep > 0 {
                // Secondary button (border-2 border-gray-300)
                Button(action: {
                    coordinator.previousStep()
                }) {
                    HStack(spacing: 8) {
                        Image(systemName: "chevron.left")
                            .font(.system(size: 14))
                        Text("Retour")
                    }
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "374151")) // text-gray-700
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16) // py-4
                    .background(Color.white)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12) // rounded-lg
                            .stroke(Color(hex: "D1D5DB"), lineWidth: 2) // border-2 border-gray-300
                    )
                    .cornerRadius(12)
                }
            }

            // Primary button (gradient, rounded-full, py-4)
            Button(action: {
                coordinator.nextStep()
            }) {
                HStack(spacing: 8) {
                    Text(coordinator.currentStep == coordinator.totalSteps - 1 ? "Terminer" : "Continuer")
                    if coordinator.currentStep < coordinator.totalSteps - 1 {
                        Image(systemName: "chevron.right")
                            .font(.system(size: 14))
                    }
                }
                .font(.system(size: 18, weight: .semibold)) // text-lg font-semibold
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16) // py-4
                .background(roleGradient)
                .cornerRadius(999) // rounded-full (pill shape)
                .shadow(color: roleColor.opacity(0.3), radius: 8, x: 0, y: 4) // shadow-md
            }
        }
        .padding(.horizontal, 24) // px-6
        .padding(.vertical, 20) // py-5
        .background(Color.white)
        .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: -4) // shadow-sm top
    }

    private var roleColor: Color {
        switch coordinator.userType {
        case .searcher: return Color(hex: "FFA040") // Primary orange
        case .owner: return Color(hex: "6E56CF") // Primary mauve
        case .resident: return Color(hex: "E8865D") // Primary coral
        }
    }

    private var roleGradient: LinearGradient {
        switch coordinator.userType {
        case .searcher:
            return LinearGradient(
                colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                startPoint: .leading,
                endPoint: .trailing
            )
        case .owner:
            return LinearGradient(
                colors: [Color(hex: "6E56CF"), Color(hex: "4A148C")],
                startPoint: .leading,
                endPoint: .trailing
            )
        case .resident:
            return LinearGradient(
                colors: [Color(hex: "D97B6F"), Color(hex: "E8865D"), Color(hex: "FF8C4B")],
                startPoint: .leading,
                endPoint: .trailing
            )
        }
    }
}
