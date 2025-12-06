//
//  ContactSupportView.swift
//  EasyCo
//
//  Contact Support - Pinterest Style
//

import SwiftUI

struct ContactSupportView: View {
    @Environment(\.dismiss) var dismiss
    private let role: Theme.UserRole = .resident

    @State private var subject = ""
    @State private var message = ""
    @State private var showSuccessAlert = false

    var body: some View {
        ZStack(alignment: .top) {
            PinterestBackground(role: role, intensity: 0.15)
                .ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                VStack(spacing: Theme.PinterestSpacing.lg) {
                    // Header
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Nous contacter")
                            .font(Theme.PinterestTypography.heroSmall(.bold))
                            .foregroundColor(Theme.Colors.textPrimary)

                        Text("Notre équipe vous répondra dans les plus brefs délais")
                            .font(Theme.PinterestTypography.bodyRegular(.medium))
                            .foregroundColor(Theme.Colors.textSecondary)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.top, Theme.PinterestSpacing.lg)

                    // Contact Info Cards
                    VStack(spacing: 12) {
                        ContactInfoCard(
                            icon: "envelope.fill",
                            title: "Email",
                            value: "support@easyco.fr",
                            color: Color(hex: "6366F1")
                        )

                        ContactInfoCard(
                            icon: "phone.fill",
                            title: "Téléphone",
                            value: "+33 1 23 45 67 89",
                            color: Color(hex: "10B981")
                        )

                        ContactInfoCard(
                            icon: "clock.fill",
                            title: "Horaires",
                            value: "Lun-Ven 9h-18h",
                            color: Color(hex: "F59E0B")
                        )
                    }

                    // Contact Form
                    VStack(alignment: .leading, spacing: 16) {
                        Text("Envoyez-nous un message")
                            .font(Theme.PinterestTypography.titleMedium(.bold))
                            .foregroundColor(Theme.Colors.textPrimary)
                            .padding(.top, Theme.PinterestSpacing.md)

                        // Subject Field
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Sujet")
                                .font(Theme.PinterestTypography.bodySmall(.semibold))
                                .foregroundColor(Theme.Colors.textSecondary)

                            TextField("Ex: Problème avec les dépenses", text: $subject)
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

                        // Message Field
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Message")
                                .font(Theme.PinterestTypography.bodySmall(.semibold))
                                .foregroundColor(Theme.Colors.textSecondary)

                            TextEditor(text: $message)
                                .font(Theme.PinterestTypography.bodyRegular(.medium))
                                .foregroundColor(Theme.Colors.textPrimary)
                                .frame(height: 150)
                                .padding(Theme.PinterestSpacing.sm)
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

                    // Send Button
                    PinterestPrimaryButton("Envoyer", role: role, icon: "paperplane.fill") {
                        Haptic.success()
                        showSuccessAlert = true
                    }
                    .padding(.top, Theme.PinterestSpacing.lg)
                }
                .padding(.horizontal, Theme.PinterestSpacing.lg)
                .padding(.bottom, 100)
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .alert("Message envoyé", isPresented: $showSuccessAlert) {
            Button("OK", role: .cancel) {
                dismiss()
            }
        } message: {
            Text("Merci ! Nous vous répondrons très bientôt.")
        }
    }
}

struct ContactInfoCard: View {
    let icon: String
    let title: String
    let value: String
    let color: Color

    var body: some View {
        HStack(spacing: 16) {
            ZStack {
                RoundedRectangle(cornerRadius: 12)
                    .fill(color.opacity(0.12))
                    .frame(width: 44, height: 44)

                Image(systemName: icon)
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(color)
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(Theme.PinterestTypography.caption(.semibold))
                    .foregroundColor(Theme.Colors.textSecondary)

                Text(value)
                    .font(Theme.PinterestTypography.bodyRegular(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
            }

            Spacer()
        }
        .padding(Theme.PinterestSpacing.md)
        .background(
            RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                .fill(Color.white.opacity(0.75))
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                        .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                )
        )
        .pinterestShadow(Theme.PinterestShadows.subtle)
    }
}
