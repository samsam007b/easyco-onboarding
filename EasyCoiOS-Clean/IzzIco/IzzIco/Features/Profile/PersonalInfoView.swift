//
//  PersonalInfoView.swift
//  IzzIco
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
                        FormField(label: "Prénom") {
                            TextField("Prénom", text: $firstName)
                                .font(Theme.PinterestTypography.bodyRegular(.medium))
                                .foregroundColor(Theme.Colors.textPrimary)
                        }

                        FormField(label: "Nom") {
                            TextField("Nom", text: $lastName)
                                .font(Theme.PinterestTypography.bodyRegular(.medium))
                                .foregroundColor(Theme.Colors.textPrimary)
                        }

                        FormField(label: "Email") {
                            TextField("Email", text: $email)
                                .font(Theme.PinterestTypography.bodyRegular(.medium))
                                .foregroundColor(Theme.Colors.textPrimary)
                        }

                        FormField(label: "Téléphone") {
                            TextField("Téléphone", text: $phone)
                                .font(Theme.PinterestTypography.bodyRegular(.medium))
                                .foregroundColor(Theme.Colors.textPrimary)
                        }
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
