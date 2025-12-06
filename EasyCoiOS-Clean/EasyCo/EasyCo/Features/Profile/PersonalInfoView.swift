//
//  PersonalInfoView.swift
//  EasyCo
//
//  Personal Information Settings - Pinterest Style
//

import SwiftUI

struct PersonalInfoView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var authManager: AuthManager
    private let role: Theme.UserRole = .resident

    @State private var firstName = "Sam"
    @State private var lastName = "Jones"
    @State private var email = "sam7777jones@gmail.com"
    @State private var phone = "+33 6 12 34 56 78"

    var body: some View {
        ZStack(alignment: .top) {
            PinterestBackground(role: role, intensity: 0.15)
                .ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                VStack(spacing: Theme.PinterestSpacing.lg) {
                    // Header
                    Text("Informations personnelles")
                        .font(Theme.PinterestTypography.heroSmall(.bold))
                        .foregroundColor(Theme.Colors.textPrimary)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.top, Theme.PinterestSpacing.lg)

                    // Form Fields
                    VStack(spacing: 16) {
                        FormField(label: "Prénom", text: $firstName)
                        FormField(label: "Nom", text: $lastName)
                        FormField(label: "Email", text: $email)
                        FormField(label: "Téléphone", text: $phone)
                    }

                    // Save Button
                    PinterestPrimaryButton("Enregistrer", role: role, icon: "checkmark") {
                        Haptic.success()
                        dismiss()
                    }
                    .padding(.top, Theme.PinterestSpacing.lg)
                }
                .padding(.horizontal, Theme.PinterestSpacing.lg)
                .padding(.bottom, 100)
            }
        }
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct FormField: View {
    let label: String
    @Binding var text: String

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label)
                .font(Theme.PinterestTypography.bodySmall(.semibold))
                .foregroundColor(Theme.Colors.textSecondary)

            TextField(label, text: $text)
                .font(Theme.PinterestTypography.bodyRegular(.medium))
                .foregroundColor(Theme.Colors.textPrimary)
                .padding(Theme.PinterestSpacing.md)
                .background(
                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                        .fill(Color.white.opacity(0.75))
                        .overlay(
                            RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                                .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                        )
                )
                .pinterestShadow(Theme.PinterestShadows.subtle)
        }
    }
}
