//
//  MagicLinkView.swift
//  EasyCo
//
//  Magic Link and OTP authentication views
//

import SwiftUI

// MARK: - Magic Link Login View

struct MagicLinkView: View {
    @StateObject private var viewModel = MagicLinkViewModel()
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                ScrollView {
                    VStack(spacing: 32) {
                        // Header
                        headerSection

                        // Content based on state
                        if viewModel.codeSent {
                            otpInputSection
                        } else {
                            emailInputSection
                        }
                    }
                    .padding(24)
                }

                // Bottom action button
                actionButton
            }
            .background(Theme.Colors.backgroundSecondary)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Theme.Colors.textSecondary)
                    }
                }
            }
            .alert("Erreur", isPresented: $viewModel.showError) {
                Button("OK", role: .cancel) {}
            } message: {
                Text(viewModel.errorMessage)
            }
        }
    }

    // MARK: - Header Section

    private var headerSection: some View {
        VStack(spacing: 16) {
            // Icon
            ZStack {
                Circle()
                    .fill(Theme.Gradients.brand)
                    .frame(width: 80, height: 80)

                Image(systemName: viewModel.codeSent ? "envelope.badge.fill" : "link")
                    .font(.system(size: 32, weight: .semibold))
                    .foregroundColor(.white)
            }
            .shadow(color: Theme.Colors.Owner.primary.opacity(0.3), radius: 12, x: 0, y: 4)

            VStack(spacing: 8) {
                Text(viewModel.codeSent ? "Vérifiez votre email" : "Connexion sans mot de passe")
                    .font(Theme.Typography.title2(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .multilineTextAlignment(.center)

                Text(viewModel.codeSent
                     ? "Entrez le code à 6 chiffres envoyé à \(viewModel.email)"
                     : "Recevez un code de connexion par email")
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
                    .multilineTextAlignment(.center)
            }
        }
        .padding(.top, 20)
    }

    // MARK: - Email Input Section

    private var emailInputSection: some View {
        VStack(spacing: 20) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Adresse email")
                    .font(Theme.Typography.bodySmall(.medium))
                    .foregroundColor(Theme.Colors.textSecondary)

                HStack(spacing: 12) {
                    Image(systemName: "envelope")
                        .font(.system(size: 18))
                        .foregroundColor(Theme.Colors.textTertiary)

                    TextField("votre@email.com", text: $viewModel.email)
                        .font(Theme.Typography.body())
                        .keyboardType(.emailAddress)
                        .textContentType(.emailAddress)
                        .autocapitalization(.none)
                        .autocorrectionDisabled()
                }
                .padding(16)
                .background(Color.white)
                .cornerRadius(Theme.CornerRadius.lg)
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.CornerRadius.lg)
                        .stroke(Theme.Colors.border, lineWidth: 1)
                )
            }

            // Benefits list
            VStack(alignment: .leading, spacing: 12) {
                benefitRow(icon: "bolt.fill", text: "Connexion rapide et sécurisée")
                benefitRow(icon: "lock.fill", text: "Pas de mot de passe à retenir")
                benefitRow(icon: "clock.fill", text: "Code valide 10 minutes")
            }
            .padding(16)
            .background(Theme.Colors.Owner._100)
            .cornerRadius(Theme.CornerRadius.lg)
        }
    }

    private func benefitRow(icon: String, text: String) -> some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 14))
                .foregroundColor(Theme.Colors.Owner.primary)
                .frame(width: 20)

            Text(text)
                .font(Theme.Typography.bodySmall())
                .foregroundColor(Theme.Colors.textPrimary)
        }
    }

    // MARK: - OTP Input Section

    private var otpInputSection: some View {
        VStack(spacing: 24) {
            // OTP Input
            OTPInputView(code: $viewModel.otpCode, length: 6)

            // Resend section
            VStack(spacing: 12) {
                if viewModel.canResend {
                    Button(action: {
                        Task { await viewModel.resendCode() }
                    }) {
                        Text("Renvoyer le code")
                            .font(Theme.Typography.bodySmall(.semibold))
                            .foregroundColor(Theme.Colors.Owner.primary)
                    }
                } else {
                    Text("Renvoyer dans \(viewModel.resendCountdown)s")
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textTertiary)
                }

                Button(action: {
                    viewModel.codeSent = false
                    viewModel.otpCode = ""
                }) {
                    Text("Changer d'email")
                        .font(Theme.Typography.bodySmall(.medium))
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }
        }
    }

    // MARK: - Action Button

    private var actionButton: some View {
        VStack(spacing: 0) {
            Divider()

            Button(action: {
                Task {
                    if viewModel.codeSent {
                        await viewModel.verifyCode()
                    } else {
                        await viewModel.sendCode()
                    }
                }
            }) {
                HStack(spacing: 8) {
                    if viewModel.isLoading {
                        ProgressView()
                            .tint(.white)
                    } else {
                        Text(viewModel.codeSent ? "Vérifier" : "Envoyer le code")
                            .font(Theme.Typography.body(.semibold))
                    }
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(
                    viewModel.isButtonEnabled
                        ? Theme.Gradients.ownerCTA
                        : LinearGradient(colors: [Theme.GrayColors._300, Theme.GrayColors._300], startPoint: .leading, endPoint: .trailing)
                )
                .cornerRadius(Theme.CornerRadius.xl)
            }
            .disabled(!viewModel.isButtonEnabled || viewModel.isLoading)
            .padding(16)
        }
        .background(Color.white)
    }
}

// MARK: - OTP Input View

struct OTPInputView: View {
    @Binding var code: String
    let length: Int
    @FocusState private var isFocused: Bool

    var body: some View {
        ZStack {
            // Hidden text field
            TextField("", text: $code)
                .keyboardType(.numberPad)
                .textContentType(.oneTimeCode)
                .focused($isFocused)
                .opacity(0)
                .onChange(of: code) { newValue in
                    // Limit to length
                    if newValue.count > length {
                        code = String(newValue.prefix(length))
                    }
                    // Filter non-digits
                    code = code.filter { $0.isNumber }
                }

            // Visual boxes
            HStack(spacing: 12) {
                ForEach(0..<length, id: \.self) { index in
                    OTPDigitBox(
                        digit: getDigit(at: index),
                        isActive: code.count == index && isFocused
                    )
                }
            }
            .onTapGesture {
                isFocused = true
            }
        }
        .onAppear {
            isFocused = true
        }
    }

    private func getDigit(at index: Int) -> String? {
        guard index < code.count else { return nil }
        let stringIndex = code.index(code.startIndex, offsetBy: index)
        return String(code[stringIndex])
    }
}

struct OTPDigitBox: View {
    let digit: String?
    let isActive: Bool

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: Theme.CornerRadius.lg)
                .fill(Color.white)
                .frame(width: 48, height: 56)
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.CornerRadius.lg)
                        .stroke(
                            isActive ? Theme.Colors.Owner.primary : Theme.Colors.border,
                            lineWidth: isActive ? 2 : 1
                        )
                )
                .shadow(color: isActive ? Theme.Colors.Owner.primary.opacity(0.2) : .clear, radius: 4)

            if let digit = digit {
                Text(digit)
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Theme.Colors.textPrimary)
            } else if isActive {
                Rectangle()
                    .fill(Theme.Colors.Owner.primary)
                    .frame(width: 2, height: 24)
                    .opacity(isActive ? 1 : 0)
                    .animation(.easeInOut(duration: 0.5).repeatForever(), value: isActive)
            }
        }
    }
}

// MARK: - View Model

@MainActor
class MagicLinkViewModel: ObservableObject {
    @Published var email = ""
    @Published var otpCode = ""
    @Published var codeSent = false
    @Published var isLoading = false
    @Published var showError = false
    @Published var errorMessage = ""
    @Published var resendCountdown = 60
    @Published var canResend = false

    private var resendTimer: Timer?
    private let authManager = AuthManager.shared

    var isButtonEnabled: Bool {
        if codeSent {
            return otpCode.count == 6
        } else {
            return isValidEmail(email)
        }
    }

    func sendCode() async {
        guard isValidEmail(email) else {
            showError(message: "Veuillez entrer une adresse email valide")
            return
        }

        isLoading = true

        do {
            try await authManager.sendOTP(email: email, type: .magiclink)
            codeSent = true
            startResendTimer()
        } catch {
            showError(message: error.localizedDescription)
        }

        isLoading = false
    }

    func verifyCode() async {
        guard otpCode.count == 6 else {
            showError(message: "Veuillez entrer le code complet")
            return
        }

        isLoading = true

        do {
            try await authManager.verifyOTP(email: email, token: otpCode, type: .magiclink)
            // Success - AuthManager will update isAuthenticated
        } catch {
            showError(message: error.localizedDescription)
        }

        isLoading = false
    }

    func resendCode() async {
        guard canResend else { return }

        isLoading = true

        do {
            try await authManager.sendOTP(email: email, type: .magiclink)
            startResendTimer()
        } catch {
            showError(message: error.localizedDescription)
        }

        isLoading = false
    }

    private func startResendTimer() {
        canResend = false
        resendCountdown = 60

        resendTimer?.invalidate()
        resendTimer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] timer in
            Task { @MainActor in
                guard let self = self else {
                    timer.invalidate()
                    return
                }

                self.resendCountdown -= 1
                if self.resendCountdown <= 0 {
                    self.canResend = true
                    timer.invalidate()
                }
            }
        }
    }

    private func showError(message: String) {
        errorMessage = message
        showError = true
    }

    private func isValidEmail(_ email: String) -> Bool {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPredicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: email)
    }
}

// MARK: - Email Confirmation View

struct EmailConfirmationView: View {
    let email: String
    @StateObject private var viewModel = EmailConfirmationViewModel()
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        VStack(spacing: 32) {
            Spacer()

            // Icon
            ZStack {
                Circle()
                    .fill(Theme.Colors.success.opacity(0.1))
                    .frame(width: 100, height: 100)

                Image(systemName: "envelope.badge.fill")
                    .font(.system(size: 44))
                    .foregroundColor(Theme.Colors.success)
            }

            // Text
            VStack(spacing: 12) {
                Text("Vérifiez votre email")
                    .font(Theme.Typography.title2(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Nous avons envoyé un lien de confirmation à")
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)

                Text(email)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.Owner.primary)
            }
            .multilineTextAlignment(.center)
            .padding(.horizontal, 24)

            Spacer()

            // Actions
            VStack(spacing: 16) {
                Button(action: {
                    Task { await viewModel.resendConfirmation(email: email) }
                }) {
                    HStack(spacing: 8) {
                        if viewModel.isLoading {
                            ProgressView()
                                .tint(Theme.Colors.Owner.primary)
                        } else {
                            Image(systemName: "arrow.counterclockwise")
                            Text(viewModel.canResend ? "Renvoyer l'email" : "Renvoyer dans \(viewModel.countdown)s")
                        }
                    }
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(viewModel.canResend ? Theme.Colors.Owner.primary : Theme.Colors.textTertiary)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(Color.white)
                    .cornerRadius(Theme.CornerRadius.xl)
                    .overlay(
                        RoundedRectangle(cornerRadius: Theme.CornerRadius.xl)
                            .stroke(viewModel.canResend ? Theme.Colors.Owner.primary : Theme.Colors.border, lineWidth: 1)
                    )
                }
                .disabled(!viewModel.canResend || viewModel.isLoading)

                Button(action: { dismiss() }) {
                    Text("Retour à la connexion")
                        .font(Theme.Typography.bodySmall(.medium))
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }
            .padding(24)
        }
        .background(Theme.Colors.backgroundSecondary)
        .alert("Email renvoyé", isPresented: $viewModel.showSuccess) {
            Button("OK", role: .cancel) {}
        } message: {
            Text("Un nouvel email de confirmation a été envoyé.")
        }
        .alert("Erreur", isPresented: $viewModel.showError) {
            Button("OK", role: .cancel) {}
        } message: {
            Text(viewModel.errorMessage)
        }
    }
}

@MainActor
class EmailConfirmationViewModel: ObservableObject {
    @Published var isLoading = false
    @Published var showSuccess = false
    @Published var showError = false
    @Published var errorMessage = ""
    @Published var countdown = 60
    @Published var canResend = true

    private var timer: Timer?
    private let authManager = AuthManager.shared

    func resendConfirmation(email: String) async {
        guard canResend else { return }

        isLoading = true

        do {
            try await authManager.resendConfirmation(email: email)
            showSuccess = true
            startCountdown()
        } catch {
            errorMessage = error.localizedDescription
            showError = true
        }

        isLoading = false
    }

    private func startCountdown() {
        canResend = false
        countdown = 60

        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] timer in
            Task { @MainActor in
                guard let self = self else {
                    timer.invalidate()
                    return
                }

                self.countdown -= 1
                if self.countdown <= 0 {
                    self.canResend = true
                    timer.invalidate()
                }
            }
        }
    }
}

// MARK: - Preview

#Preview {
    MagicLinkView()
}
