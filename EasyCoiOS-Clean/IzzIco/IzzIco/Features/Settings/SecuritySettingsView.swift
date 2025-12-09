import SwiftUI
import LocalAuthentication

// MARK: - Security Settings View

struct SecuritySettingsView: View {
    @StateObject private var viewModel = SecuritySettingsViewModel()
    @State private var showChangePassword = false
    @State private var showTwoFactorSetup = false
    @State private var showDeleteAccount = false

    var body: some View {
        List {
            // Password section
            passwordSection

            // Two-factor authentication
            twoFactorSection

            // Biometric authentication
            biometricSection

            // Active sessions
            sessionsSection

            // Login history
            loginHistorySection

            // Danger zone
            dangerZoneSection
        }
        .listStyle(.insetGrouped)
        .navigationTitle("Sécurité")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showChangePassword) {
            ChangePasswordView()
        }
        .sheet(isPresented: $showTwoFactorSetup) {
            TwoFactorSetupView(isEnabled: $viewModel.twoFactorEnabled)
        }
        .alert("Supprimer le compte ?", isPresented: $showDeleteAccount) {
            Button("Annuler", role: .cancel) {}
            Button("Supprimer", role: .destructive) {
                viewModel.deleteAccount()
            }
        } message: {
            Text("Cette action est irréversible. Toutes vos données seront définitivement supprimées.")
        }
        .task {
            await viewModel.loadSecuritySettings()
        }
    }

    // MARK: - Password Section

    private var passwordSection: some View {
        Section {
            Button(action: { showChangePassword = true }) {
                HStack {
                    Image(systemName: "key.fill")
                        .font(.system(size: 18))
                        .foregroundColor(Color(hex: "FFA040"))
                        .frame(width: 28)

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Mot de passe")
                            .font(.system(size: 15))
                            .foregroundColor(Color(hex: "111827"))

                        Text("Dernière modification : \(viewModel.lastPasswordChange)")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "6B7280"))
                    }

                    Spacer()

                    Text("Modifier")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "FFA040"))
                }
            }

            // Password strength indicator
            HStack {
                Image(systemName: "shield.checkered")
                    .font(.system(size: 18))
                    .foregroundColor(viewModel.passwordStrengthColor)
                    .frame(width: 28)

                VStack(alignment: .leading, spacing: 4) {
                    Text("Force du mot de passe")
                        .font(.system(size: 15))

                    HStack(spacing: 4) {
                        ForEach(0..<4, id: \.self) { index in
                            Rectangle()
                                .fill(index < viewModel.passwordStrength ? viewModel.passwordStrengthColor : Color(hex: "E5E7EB"))
                                .frame(height: 4)
                                .cornerRadius(2)
                        }
                    }
                }

                Spacer()

                Text(viewModel.passwordStrengthLabel)
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(viewModel.passwordStrengthColor)
            }
        } header: {
            Text("Mot de passe")
        }
    }

    // MARK: - Two Factor Section

    private var twoFactorSection: some View {
        Section {
            Toggle(isOn: $viewModel.twoFactorEnabled) {
                HStack(spacing: 12) {
                    Image(systemName: "lock.shield.fill")
                        .font(.system(size: 18))
                        .foregroundColor(Color(hex: "6366F1"))
                        .frame(width: 28)

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Authentification à deux facteurs")
                            .font(.system(size: 15))

                        Text(viewModel.twoFactorEnabled ? "Activée via application" : "Non configurée")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }
            }
            .tint(Color(hex: "10B981"))
            .onChange(of: viewModel.twoFactorEnabled) { newValue in
                if newValue && !viewModel.was2FAEnabled {
                    showTwoFactorSetup = true
                }
            }

            if viewModel.twoFactorEnabled {
                NavigationLink {
                    RecoveryCodesView()
                } label: {
                    HStack {
                        Image(systemName: "doc.text.fill")
                            .font(.system(size: 18))
                            .foregroundColor(Color(hex: "F59E0B"))
                            .frame(width: 28)

                        Text("Codes de récupération")
                            .font(.system(size: 15))
                    }
                }
            }
        } header: {
            Text("Vérification en deux étapes")
        } footer: {
            Text("Ajoutez une couche de sécurité supplémentaire à votre compte.")
        }
    }

    // MARK: - Biometric Section

    private var biometricSection: some View {
        Section {
            if viewModel.biometricType != .none {
                Toggle(isOn: $viewModel.biometricEnabled) {
                    HStack(spacing: 12) {
                        Image(systemName: viewModel.biometricIcon)
                            .font(.system(size: 18))
                            .foregroundColor(Color(hex: "10B981"))
                            .frame(width: 28)

                        VStack(alignment: .leading, spacing: 2) {
                            Text(viewModel.biometricLabel)
                                .font(.system(size: 15))

                            Text("Déverrouillage rapide de l'application")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "6B7280"))
                        }
                    }
                }
                .tint(Color(hex: "10B981"))
            } else {
                HStack {
                    Image(systemName: "faceid")
                        .font(.system(size: 18))
                        .foregroundColor(Color(hex: "D1D5DB"))
                        .frame(width: 28)

                    Text("Non disponible sur cet appareil")
                        .font(.system(size: 15))
                        .foregroundColor(Color(hex: "9CA3AF"))
                }
            }
        } header: {
            Text("Biométrie")
        }
    }

    // MARK: - Sessions Section

    private var sessionsSection: some View {
        Section {
            ForEach(viewModel.activeSessions) { session in
                SessionRow(session: session, isCurrent: session.isCurrent) {
                    viewModel.revokeSession(session)
                }
            }

            Button(action: { viewModel.revokeAllOtherSessions() }) {
                HStack {
                    Image(systemName: "rectangle.portrait.and.arrow.right")
                        .font(.system(size: 16))
                    Text("Déconnecter tous les autres appareils")
                }
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Color(hex: "EF4444"))
            }
        } header: {
            HStack {
                Text("Sessions actives")
                Spacer()
                Text("\(viewModel.activeSessions.count)")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 2)
                    .background(Color(hex: "6B7280"))
                    .cornerRadius(999)
            }
        }
    }

    // MARK: - Login History Section

    private var loginHistorySection: some View {
        Section {
            ForEach(viewModel.loginHistory.prefix(5)) { entry in
                LoginHistoryRow(entry: entry)
            }

            NavigationLink {
                FullLoginHistoryView(history: viewModel.loginHistory)
            } label: {
                Text("Voir tout l'historique")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "FFA040"))
            }
        } header: {
            Text("Historique de connexion")
        }
    }

    // MARK: - Danger Zone Section

    private var dangerZoneSection: some View {
        Section {
            Button(action: { showDeleteAccount = true }) {
                HStack {
                    Image(systemName: "trash.fill")
                        .font(.system(size: 16))
                    Text("Supprimer mon compte")
                }
                .foregroundColor(Color(hex: "EF4444"))
            }
        } header: {
            Text("Zone de danger")
        } footer: {
            Text("La suppression de votre compte est définitive et irréversible.")
        }
    }
}

// MARK: - Change Password View

struct ChangePasswordView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var currentPassword = ""
    @State private var newPassword = ""
    @State private var confirmPassword = ""
    @State private var showCurrentPassword = false
    @State private var showNewPassword = false

    var isValid: Bool {
        !currentPassword.isEmpty &&
        newPassword.count >= 8 &&
        newPassword == confirmPassword
    }

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    HStack {
                        if showCurrentPassword {
                            TextField("Mot de passe actuel", text: $currentPassword)
                        } else {
                            SecureField("Mot de passe actuel", text: $currentPassword)
                        }

                        Button(action: { showCurrentPassword.toggle() }) {
                            Image(systemName: showCurrentPassword ? "eye.slash" : "eye")
                                .foregroundColor(Color(hex: "6B7280"))
                        }
                    }
                } header: {
                    Text("Mot de passe actuel")
                }

                Section {
                    HStack {
                        if showNewPassword {
                            TextField("Nouveau mot de passe", text: $newPassword)
                        } else {
                            SecureField("Nouveau mot de passe", text: $newPassword)
                        }

                        Button(action: { showNewPassword.toggle() }) {
                            Image(systemName: showNewPassword ? "eye.slash" : "eye")
                                .foregroundColor(Color(hex: "6B7280"))
                        }
                    }

                    SecureField("Confirmer le mot de passe", text: $confirmPassword)

                    // Password requirements
                    VStack(alignment: .leading, spacing: 6) {
                        SecurityPasswordRequirement(text: "Au moins 8 caractères", isMet: newPassword.count >= 8)
                        SecurityPasswordRequirement(text: "Une lettre majuscule", isMet: newPassword.contains(where: { $0.isUppercase }))
                        SecurityPasswordRequirement(text: "Une lettre minuscule", isMet: newPassword.contains(where: { $0.isLowercase }))
                        SecurityPasswordRequirement(text: "Un chiffre", isMet: newPassword.contains(where: { $0.isNumber }))
                        SecurityPasswordRequirement(text: "Correspond à la confirmation", isMet: !confirmPassword.isEmpty && newPassword == confirmPassword)
                    }
                    .padding(.vertical, 4)
                } header: {
                    Text("Nouveau mot de passe")
                }
            }
            .navigationTitle("Changer le mot de passe")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") { dismiss() }
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Enregistrer") {
                        // TODO: Change password
                        dismiss()
                    }
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(isValid ? Color(hex: "FFA040") : Color(hex: "D1D5DB"))
                    .disabled(!isValid)
                }
            }
        }
    }
}

private struct SecurityPasswordRequirement: View {
    let text: String
    let isMet: Bool

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: isMet ? "checkmark.circle.fill" : "circle")
                .font(.system(size: 14))
                .foregroundColor(isMet ? Color(hex: "10B981") : Color(hex: "D1D5DB"))

            Text(text)
                .font(.system(size: 13))
                .foregroundColor(isMet ? Color(hex: "10B981") : Color(hex: "6B7280"))
        }
    }
}

// MARK: - Two Factor Setup View

struct TwoFactorSetupView: View {
    @Binding var isEnabled: Bool
    @Environment(\.dismiss) private var dismiss
    @State private var currentStep = 0
    @State private var verificationCode = ""

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                // Progress
                HStack(spacing: 8) {
                    ForEach(0..<3, id: \.self) { index in
                        Rectangle()
                            .fill(index <= currentStep ? Color(hex: "FFA040") : Color(hex: "E5E7EB"))
                            .frame(height: 4)
                            .cornerRadius(2)
                    }
                }
                .padding(.horizontal, 20)

                if currentStep == 0 {
                    step1DownloadApp
                } else if currentStep == 1 {
                    step2ScanQR
                } else {
                    step3Verify
                }

                Spacer()

                // Navigation buttons
                HStack(spacing: 12) {
                    if currentStep > 0 {
                        Button(action: { currentStep -= 1 }) {
                            Text("Retour")
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(Color(hex: "6B7280"))
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(Color(hex: "F3F4F6"))
                                .cornerRadius(12)
                        }
                    }

                    Button(action: {
                        if currentStep < 2 {
                            currentStep += 1
                        } else {
                            // Verify and enable
                            isEnabled = true
                            dismiss()
                        }
                    }) {
                        Text(currentStep < 2 ? "Continuer" : "Activer")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(Color(hex: "FFA040"))
                            .cornerRadius(12)
                    }
                    .disabled(currentStep == 2 && verificationCode.count != 6)
                }
                .padding(20)
            }
            .navigationTitle("Configuration 2FA")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark")
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }
            }
        }
    }

    private var step1DownloadApp: some View {
        VStack(spacing: 20) {
            Image(systemName: "apps.iphone")
                .font(.system(size: 60))
                .foregroundColor(Color(hex: "6366F1"))

            Text("Téléchargez une application d'authentification")
                .font(.system(size: 20, weight: .bold))
                .multilineTextAlignment(.center)

            Text("Nous recommandons Google Authenticator ou Authy")
                .font(.system(size: 15))
                .foregroundColor(Color(hex: "6B7280"))
                .multilineTextAlignment(.center)

            VStack(spacing: 12) {
                AppRecommendationRow(name: "Google Authenticator", icon: "g.circle.fill")
                AppRecommendationRow(name: "Authy", icon: "a.circle.fill")
                AppRecommendationRow(name: "Microsoft Authenticator", icon: "m.circle.fill")
            }
            .padding(.top, 12)
        }
        .padding(20)
    }

    private var step2ScanQR: some View {
        VStack(spacing: 20) {
            // Fake QR code placeholder
            ZStack {
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color.white)
                    .frame(width: 200, height: 200)
                    .shadow(color: .black.opacity(0.1), radius: 10)

                Image(systemName: "qrcode")
                    .font(.system(size: 120))
                    .foregroundColor(Color(hex: "111827"))
            }

            Text("Scannez ce QR code")
                .font(.system(size: 20, weight: .bold))

            Text("Ouvrez votre application d'authentification et scannez ce code")
                .font(.system(size: 15))
                .foregroundColor(Color(hex: "6B7280"))
                .multilineTextAlignment(.center)

            // Manual code
            VStack(spacing: 8) {
                Text("Ou entrez ce code manuellement :")
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "6B7280"))

                Text("ABCD EFGH IJKL MNOP")
                    .font(.system(size: 16, weight: .bold, design: .monospaced))
                    .foregroundColor(Color(hex: "FFA040"))
                    .padding(12)
                    .background(Color(hex: "FFA040").opacity(0.1))
                    .cornerRadius(8)
            }
            .padding(.top, 12)
        }
        .padding(20)
    }

    private var step3Verify: some View {
        VStack(spacing: 20) {
            Image(systemName: "checkmark.shield.fill")
                .font(.system(size: 60))
                .foregroundColor(Color(hex: "10B981"))

            Text("Vérification")
                .font(.system(size: 20, weight: .bold))

            Text("Entrez le code à 6 chiffres affiché dans votre application")
                .font(.system(size: 15))
                .foregroundColor(Color(hex: "6B7280"))
                .multilineTextAlignment(.center)

            // Code input
            HStack(spacing: 8) {
                ForEach(0..<6, id: \.self) { index in
                    ZStack {
                        RoundedRectangle(cornerRadius: 10)
                            .fill(Color.white)
                            .frame(width: 48, height: 56)
                            .overlay(
                                RoundedRectangle(cornerRadius: 10)
                                    .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                            )

                        if index < verificationCode.count {
                            Text(String(verificationCode[verificationCode.index(verificationCode.startIndex, offsetBy: index)]))
                                .font(.system(size: 24, weight: .bold))
                        }
                    }
                }
            }

            TextField("", text: $verificationCode)
                .keyboardType(.numberPad)
                .opacity(0)
                .frame(height: 1)
                .onChange(of: verificationCode) { newValue in
                    verificationCode = String(newValue.filter { $0.isNumber }.prefix(6))
                }
        }
        .padding(20)
    }
}

struct AppRecommendationRow: View {
    let name: String
    let icon: String

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 28))
                .foregroundColor(Color(hex: "6366F1"))

            Text(name)
                .font(.system(size: 15))

            Spacer()

            Image(systemName: "arrow.up.right.square")
                .font(.system(size: 16))
                .foregroundColor(Color(hex: "FFA040"))
        }
        .padding(12)
        .background(Color(hex: "F9FAFB"))
        .cornerRadius(10)
    }
}

// MARK: - Recovery Codes View

struct RecoveryCodesView: View {
    @State private var codes = [
        "ABCD-1234", "EFGH-5678", "IJKL-9012",
        "MNOP-3456", "QRST-7890", "UVWX-1357",
        "YZAB-2468", "CDEF-8024"
    ]
    @State private var showRegenerateAlert = false

    var body: some View {
        List {
            Section {
                VStack(alignment: .leading, spacing: 12) {
                    HStack(spacing: 8) {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .foregroundColor(Color(hex: "F59E0B"))
                        Text("Conservez ces codes en lieu sûr")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(Color(hex: "F59E0B"))
                    }

                    Text("Ces codes vous permettent d'accéder à votre compte si vous perdez l'accès à votre application d'authentification.")
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "6B7280"))
                }
                .padding(.vertical, 4)
            }

            Section {
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                    ForEach(codes, id: \.self) { code in
                        Text(code)
                            .font(.system(size: 14, weight: .medium, design: .monospaced))
                            .foregroundColor(Color(hex: "111827"))
                            .padding(10)
                            .frame(maxWidth: .infinity)
                            .background(Color(hex: "F3F4F6"))
                            .cornerRadius(8)
                    }
                }
                .padding(.vertical, 4)
            } header: {
                Text("Codes de récupération")
            }

            Section {
                Button(action: {
                    UIPasteboard.general.string = codes.joined(separator: "\n")
                }) {
                    HStack {
                        Image(systemName: "doc.on.doc")
                        Text("Copier tous les codes")
                    }
                    .foregroundColor(Color(hex: "FFA040"))
                }

                Button(action: { showRegenerateAlert = true }) {
                    HStack {
                        Image(systemName: "arrow.clockwise")
                        Text("Régénérer les codes")
                    }
                    .foregroundColor(Color(hex: "EF4444"))
                }
            }
        }
        .navigationTitle("Codes de récupération")
        .navigationBarTitleDisplayMode(.inline)
        .alert("Régénérer les codes ?", isPresented: $showRegenerateAlert) {
            Button("Annuler", role: .cancel) {}
            Button("Régénérer", role: .destructive) {
                // Generate new codes
            }
        } message: {
            Text("Les anciens codes seront invalides. Assurez-vous de sauvegarder les nouveaux codes.")
        }
    }
}

// MARK: - Session Row

struct SessionRow: View {
    let session: ActiveSession
    let isCurrent: Bool
    let onRevoke: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: session.deviceIcon)
                .font(.system(size: 24))
                .foregroundColor(Color(hex: isCurrent ? "10B981" : "6B7280"))
                .frame(width: 32)

            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 6) {
                    Text(session.deviceName)
                        .font(.system(size: 15, weight: .medium))

                    if isCurrent {
                        Text("Actuel")
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundColor(Color(hex: "10B981"))
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color(hex: "10B981").opacity(0.1))
                            .cornerRadius(4)
                    }
                }

                Text("\(session.location) • \(session.lastActive)")
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            Spacer()

            if !isCurrent {
                Button(action: onRevoke) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "EF4444").opacity(0.7))
                }
            }
        }
    }
}

// MARK: - Login History Row

struct LoginHistoryRow: View {
    let entry: LoginHistoryEntry

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: entry.success ? "checkmark.circle.fill" : "xmark.circle.fill")
                .font(.system(size: 20))
                .foregroundColor(entry.success ? Color(hex: "10B981") : Color(hex: "EF4444"))

            VStack(alignment: .leading, spacing: 2) {
                Text(entry.deviceName)
                    .font(.system(size: 14, weight: .medium))

                Text("\(entry.location) • \(entry.date)")
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            Spacer()

            if !entry.success {
                Text("Échec")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(Color(hex: "EF4444"))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color(hex: "EF4444").opacity(0.1))
                    .cornerRadius(999)
            }
        }
    }
}

// MARK: - Full Login History View

struct FullLoginHistoryView: View {
    let history: [LoginHistoryEntry]

    var body: some View {
        List {
            ForEach(history) { entry in
                LoginHistoryRow(entry: entry)
            }
        }
        .navigationTitle("Historique de connexion")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Models

struct ActiveSession: Identifiable {
    let id: UUID
    let deviceName: String
    let deviceIcon: String
    let location: String
    let lastActive: String
    let isCurrent: Bool
}

struct LoginHistoryEntry: Identifiable {
    let id: UUID
    let deviceName: String
    let location: String
    let date: String
    let success: Bool
}

enum BiometricType {
    case none, faceID, touchID
}

// MARK: - ViewModel

@MainActor
class SecuritySettingsViewModel: ObservableObject {
    @Published var lastPasswordChange = "il y a 3 mois"
    @Published var passwordStrength = 3
    @Published var twoFactorEnabled = false
    @Published var was2FAEnabled = false
    @Published var biometricEnabled = false
    @Published var biometricType: BiometricType = .faceID
    @Published var activeSessions: [ActiveSession] = []
    @Published var loginHistory: [LoginHistoryEntry] = []

    var passwordStrengthColor: Color {
        switch passwordStrength {
        case 0...1: return Color(hex: "EF4444")
        case 2: return Color(hex: "F59E0B")
        case 3: return Color(hex: "10B981")
        default: return Color(hex: "10B981")
        }
    }

    var passwordStrengthLabel: String {
        switch passwordStrength {
        case 0...1: return "Faible"
        case 2: return "Moyen"
        case 3: return "Fort"
        default: return "Fort"
        }
    }

    var biometricIcon: String {
        switch biometricType {
        case .faceID: return "faceid"
        case .touchID: return "touchid"
        case .none: return "faceid"
        }
    }

    var biometricLabel: String {
        switch biometricType {
        case .faceID: return "Face ID"
        case .touchID: return "Touch ID"
        case .none: return "Biométrie"
        }
    }

    func loadSecuritySettings() async {
        // Check biometric availability
        let context = LAContext()
        var error: NSError?
        if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
            switch context.biometryType {
            case .faceID: biometricType = .faceID
            case .touchID: biometricType = .touchID
            default: biometricType = .none
            }
        } else {
            biometricType = .none
        }

        // Demo data
        if AppConfig.FeatureFlags.demoMode {
            activeSessions = [
                ActiveSession(
                    id: UUID(),
                    deviceName: "iPhone 15 Pro",
                    deviceIcon: "iphone",
                    location: "Paris, France",
                    lastActive: "Maintenant",
                    isCurrent: true
                ),
                ActiveSession(
                    id: UUID(),
                    deviceName: "MacBook Pro",
                    deviceIcon: "laptopcomputer",
                    location: "Paris, France",
                    lastActive: "Il y a 2h",
                    isCurrent: false
                ),
                ActiveSession(
                    id: UUID(),
                    deviceName: "iPad Air",
                    deviceIcon: "ipad",
                    location: "Lyon, France",
                    lastActive: "Il y a 3j",
                    isCurrent: false
                )
            ]

            loginHistory = [
                LoginHistoryEntry(id: UUID(), deviceName: "iPhone 15 Pro", location: "Paris", date: "Aujourd'hui, 14:30", success: true),
                LoginHistoryEntry(id: UUID(), deviceName: "MacBook Pro", location: "Paris", date: "Hier, 09:15", success: true),
                LoginHistoryEntry(id: UUID(), deviceName: "Appareil inconnu", location: "Londres", date: "Il y a 3j", success: false),
                LoginHistoryEntry(id: UUID(), deviceName: "iPad Air", location: "Lyon", date: "Il y a 5j", success: true),
                LoginHistoryEntry(id: UUID(), deviceName: "iPhone 15 Pro", location: "Paris", date: "Il y a 7j", success: true)
            ]
        }
    }

    func revokeSession(_ session: ActiveSession) {
        activeSessions.removeAll { $0.id == session.id }
    }

    func revokeAllOtherSessions() {
        activeSessions.removeAll { !$0.isCurrent }
    }

    func deleteAccount() {
        // TODO: Delete account
    }
}

// MARK: - Preview

struct SecuritySettingsView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            SecuritySettingsView()
        }
    }
}
