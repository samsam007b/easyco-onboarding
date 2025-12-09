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
        case .searcher: return 9  // Added profile photo step
        case .owner: return 7     // Added profile photo step
        case .resident: return 6  // Added profile photo step
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

    @Published var isSaving = false
    @Published var saveError: String?

    func completeOnboarding() {
        Task {
            await saveOnboardingToBackend()
        }
    }

    private func saveOnboardingToBackend() async {
        isSaving = true
        saveError = nil

        do {
            // Save directly to Supabase
            if !AppConfig.FeatureFlags.demoMode {
                try await saveOnboardingToSupabase()
                print("✅ Onboarding data saved to Supabase")
            } else {
                print("⚠️ Demo mode: Onboarding data not saved to backend")
            }

            // Update local user state
            if var user = AuthManager.shared.currentUser {
                user.onboardingCompleted = true
                user.firstName = onboardingData.firstName
                user.lastName = onboardingData.lastName
                user.phoneNumber = onboardingData.phoneNumber
                AuthManager.shared.currentUser = user
            }

            isCompleted = true
            print("✅ Onboarding completed for \(userType)")

        } catch {
            saveError = "Erreur lors de la sauvegarde: \(error.localizedDescription)"
            print("❌ Error saving onboarding: \(error)")
            // Still mark as completed locally to not block user
            isCompleted = true
        }

        isSaving = false
    }

    /// Save onboarding data directly to Supabase
    private func saveOnboardingToSupabase() async throws {
        guard let token = EasyCoKeychainManager.shared.getAuthToken() else {
            throw NetworkError.unauthorized
        }

        guard let userId = AuthManager.shared.currentUser?.id else {
            throw NetworkError.unknown(NSError(domain: "No user ID", code: -1))
        }

        let supabaseURL = AppConfig.supabaseURL
        let supabaseKey = AppConfig.supabaseAnonKey

        // 1. Update 'users' table with onboarding_completed and user_type
        try await updateUsersTable(userId: userId, token: token, supabaseURL: supabaseURL, supabaseKey: supabaseKey)

        // 2. Upsert 'profiles' table with name, phone, etc.
        try await upsertProfilesTable(userId: userId, token: token, supabaseURL: supabaseURL, supabaseKey: supabaseKey)
    }

    private func updateUsersTable(userId: UUID, token: String, supabaseURL: String, supabaseKey: String) async throws {
        var urlComponents = URLComponents(string: "\(supabaseURL)/rest/v1/users")!
        urlComponents.queryItems = [
            URLQueryItem(name: "id", value: "eq.\(userId.uuidString)")
        ]

        var request = URLRequest(url: urlComponents.url!)
        request.httpMethod = "PATCH"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("return=minimal", forHTTPHeaderField: "Prefer")

        let userData: [String: Any] = [
            "onboarding_completed": true,
            "user_type": userType.rawValue,
            "full_name": "\(onboardingData.firstName) \(onboardingData.lastName)".trimmingCharacters(in: .whitespaces),
            "updated_at": ISO8601DateFormatter().string(from: Date())
        ]

        request.httpBody = try JSONSerialization.data(withJSONObject: userData)

        print("📝 Updating users table: \(urlComponents.url!.absoluteString)")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if let responseString = String(data: data, encoding: .utf8), !responseString.isEmpty {
            print("📝 Users update response (\(httpResponse.statusCode)): \(responseString)")
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        print("✅ Users table updated successfully")
    }

    private func upsertProfilesTable(userId: UUID, token: String, supabaseURL: String, supabaseKey: String) async throws {
        let url = URL(string: "\(supabaseURL)/rest/v1/profiles")!

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        // Upsert: if user_id exists, update instead of insert
        request.setValue("resolution=merge-duplicates", forHTTPHeaderField: "Prefer")

        let email = AuthManager.shared.currentUser?.email ?? ""

        let dateFormatter = ISO8601DateFormatter()
        let dateOnlyFormatter = DateFormatter()
        dateOnlyFormatter.dateFormat = "yyyy-MM-dd"

        let profileData: [String: Any] = [
            "user_id": userId.uuidString,
            "email": email,
            "first_name": onboardingData.firstName,
            "last_name": onboardingData.lastName,
            "phone_number": onboardingData.phoneNumber,
            "date_of_birth": dateOnlyFormatter.string(from: onboardingData.dateOfBirth),
            "updated_at": dateFormatter.string(from: Date())
        ]

        request.httpBody = try JSONSerialization.data(withJSONObject: profileData)

        print("📝 Upserting profiles table: \(url.absoluteString)")
        print("📝 Profile data: \(profileData)")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if let responseString = String(data: data, encoding: .utf8), !responseString.isEmpty {
            print("📝 Profiles upsert response (\(httpResponse.statusCode)): \(responseString)")
        }

        // 201 = created, 200 = updated (upsert)
        guard (200...299).contains(httpResponse.statusCode) else {
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        print("✅ Profiles table updated successfully")
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
    var profileImageData: Data?
    var bio: String = ""

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
            OnboardingProfilePhotoView(data: $coordinator.onboardingData, userType: .searcher)
        case 2:
            OnboardingDailyHabitsView(data: $coordinator.onboardingData)
        case 3:
            OnboardingHomeLifestyleView(data: $coordinator.onboardingData)
        case 4:
            OnboardingSocialVibeView(data: $coordinator.onboardingData)
        case 5:
            OnboardingIdealColivingView(data: $coordinator.onboardingData)
        case 6:
            OnboardingPreferencesView(data: $coordinator.onboardingData)
        case 7:
            OnboardingVerificationView(data: $coordinator.onboardingData)
        case 8:
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
            OnboardingProfilePhotoView(data: $coordinator.onboardingData, userType: .owner)
        case 2:
            OnboardingOwnerAboutView(data: $coordinator.onboardingData)
        case 3:
            OnboardingPropertyBasicsView(data: $coordinator.onboardingData)
        case 4:
            OnboardingPaymentInfoView(data: $coordinator.onboardingData)
        case 5:
            OnboardingVerificationView(data: $coordinator.onboardingData)
        case 6:
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
            OnboardingProfilePhotoView(data: $coordinator.onboardingData, userType: .resident)
        case 2:
            OnboardingLifestyleView(data: $coordinator.onboardingData)
        case 3:
            OnboardingLivingSituationView(data: $coordinator.onboardingData)
        case 4:
            OnboardingPersonalityView(data: $coordinator.onboardingData)
        case 5:
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

// MARK: - Profile Photo Step

import PhotosUI

struct OnboardingProfilePhotoView: View {
    @Binding var data: OnboardingData
    @State private var selectedPhoto: PhotosPickerItem?
    @State private var profileImage: Image?
    @State private var isLoadingImage = false
    @State private var showCamera = false

    let roleColor: Color

    init(data: Binding<OnboardingData>, userType: User.UserType = .searcher) {
        self._data = data
        switch userType {
        case .searcher:
            self.roleColor = Color(hex: "FFA040")
        case .owner:
            self.roleColor = Color(hex: "6E56CF")
        case .resident:
            self.roleColor = Color(hex: "E8865D")
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 32) {
            // Header
            VStack(alignment: .leading, spacing: 8) {
                Text("Photo de profil")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(roleColor)

                Text("Ajoutez une photo pour que les autres utilisateurs puissent vous reconnaître")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "666666"))
            }
            .padding(.bottom, 8)

            // Photo picker
            VStack(spacing: 24) {
                // Preview
                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [roleColor.opacity(0.1), roleColor.opacity(0.05)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 160, height: 160)

                    if let profileImage = profileImage {
                        profileImage
                            .resizable()
                            .scaledToFill()
                            .frame(width: 150, height: 150)
                            .clipShape(Circle())
                    } else if isLoadingImage {
                        ProgressView()
                            .scaleEffect(1.5)
                    } else {
                        Image(systemName: "person.fill")
                            .font(.system(size: 60))
                            .foregroundColor(roleColor.opacity(0.5))
                    }

                    // Edit badge
                    Circle()
                        .fill(roleColor)
                        .frame(width: 44, height: 44)
                        .overlay(
                            Image(systemName: "camera.fill")
                                .font(.system(size: 18))
                                .foregroundColor(.white)
                        )
                        .offset(x: 55, y: 55)
                        .shadow(color: roleColor.opacity(0.4), radius: 8, x: 0, y: 4)
                }
                .frame(maxWidth: .infinity)

                // Action buttons
                HStack(spacing: 16) {
                    // Photos picker
                    PhotosPicker(selection: $selectedPhoto, matching: .images) {
                        HStack(spacing: 8) {
                            Image(systemName: "photo.on.rectangle")
                            Text("Galerie")
                        }
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(roleColor)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(roleColor, lineWidth: 2)
                        )
                    }

                    // Camera button
                    Button(action: {
                        showCamera = true
                    }) {
                        HStack(spacing: 8) {
                            Image(systemName: "camera")
                            Text("Caméra")
                        }
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(roleColor)
                        .cornerRadius(12)
                    }
                }

                // Tips
                VStack(alignment: .leading, spacing: 12) {
                    ProfilePhotoTipRow(icon: "person.crop.circle.fill", text: "Montrez clairement votre visage", color: roleColor)
                    ProfilePhotoTipRow(icon: "lightbulb.fill", text: "Bonne luminosité recommandée", color: roleColor)
                    ProfilePhotoTipRow(icon: "hand.thumbsup.fill", text: "Souriez, ça inspire confiance !", color: roleColor)
                }
                .padding(16)
                .background(roleColor.opacity(0.05))
                .cornerRadius(16)
            }

            Spacer()
        }
        .onChange(of: selectedPhoto) { newValue in
            Task {
                await loadImage(from: newValue)
            }
        }
        .sheet(isPresented: $showCamera) {
            OnboardingCameraView { image in
                if let image = image {
                    profileImage = Image(uiImage: image)
                    data.profileImageData = image.jpegData(compressionQuality: 0.8)
                }
            }
        }
    }

    private func loadImage(from item: PhotosPickerItem?) async {
        guard let item = item else { return }

        isLoadingImage = true

        do {
            if let data = try await item.loadTransferable(type: Data.self),
               let uiImage = UIImage(data: data) {
                self.profileImage = Image(uiImage: uiImage)
                self.data.profileImageData = uiImage.jpegData(compressionQuality: 0.8)
            }
        } catch {
            print("Error loading image: \(error)")
        }

        isLoadingImage = false
    }
}

// MARK: - Profile Photo Tip Row Component

private struct ProfilePhotoTipRow: View {
    let icon: String
    let text: String
    let color: Color

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundColor(color)
                .frame(width: 24)

            Text(text)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "374151"))
        }
    }
}

// MARK: - Camera View

struct OnboardingCameraView: UIViewControllerRepresentable {
    let onImageCaptured: (UIImage?) -> Void

    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.sourceType = .camera
        picker.cameraDevice = .front
        picker.delegate = context.coordinator
        return picker
    }

    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(onImageCaptured: onImageCaptured)
    }

    class Coordinator: NSObject, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
        let onImageCaptured: (UIImage?) -> Void

        init(onImageCaptured: @escaping (UIImage?) -> Void) {
            self.onImageCaptured = onImageCaptured
        }

        func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]) {
            let image = info[.originalImage] as? UIImage
            onImageCaptured(image)
            picker.dismiss(animated: true)
        }

        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
            onImageCaptured(nil)
            picker.dismiss(animated: true)
        }
    }
}
