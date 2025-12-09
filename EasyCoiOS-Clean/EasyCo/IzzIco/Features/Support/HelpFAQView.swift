//
//  HelpFAQView.swift
//  IzzIco
//
//  Help & FAQ - Pinterest Style
//

import SwiftUI

struct HelpFAQView: View {
    @Environment(\.dismiss) var dismiss
    private let role: Theme.UserRole = .resident

    private let faqItems = [
        FAQItem(question: "Comment ajouter une dépense ?", answer: "Allez dans l'onglet Dépenses et appuyez sur le bouton '+' en haut à droite."),
        FAQItem(question: "Comment inviter un colocataire ?", answer: "Rendez-vous dans la section Colocataires et utilisez le bouton 'Inviter'."),
        FAQItem(question: "Comment modifier mon profil ?", answer: "Accédez à votre profil via le menu et sélectionnez 'Modifier le profil'."),
        FAQItem(question: "Que faire si j'oublie mon mot de passe ?", answer: "Utilisez l'option 'Mot de passe oublié' sur l'écran de connexion."),
        FAQItem(question: "Comment contacter le support ?", answer: "Envoyez-nous un email à support@easyco.fr ou utilisez le formulaire de contact.")
    ]

    var body: some View {
        ZStack(alignment: .top) {
            PinterestBackground(role: role, intensity: 0.15)
                .ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                VStack(spacing: Theme.PinterestSpacing.lg) {
                    // Header
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Aide & FAQ")
                            .font(Theme.PinterestTypography.heroSmall(.bold))
                            .foregroundColor(Theme.Colors.textPrimary)

                        Text("Questions fréquemment posées")
                            .font(Theme.PinterestTypography.bodyRegular(.medium))
                            .foregroundColor(Theme.Colors.textSecondary)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.top, Theme.PinterestSpacing.lg)

                    // FAQ Items
                    ForEach(faqItems) { item in
                        FAQItemView(item: item, role: role)
                    }
                }
                .padding(.horizontal, Theme.PinterestSpacing.lg)
                .padding(.bottom, 100)
            }
        }
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct FAQItem: Identifiable {
    let id = UUID()
    let question: String
    let answer: String
}

struct FAQItemView: View {
    let item: FAQItem
    let role: Theme.UserRole
    @State private var isExpanded = false

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Button(action: {
                withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                    isExpanded.toggle()
                }
                Haptic.light()
            }) {
                HStack {
                    Text(item.question)
                        .font(Theme.PinterestTypography.bodyLarge(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)
                        .multilineTextAlignment(.leading)

                    Spacer()

                    Image(systemName: isExpanded ? "chevron.up" : "chevron.down")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(role.primaryColor)
                        .rotationEffect(.degrees(isExpanded ? 180 : 0))
                }
            }
            .buttonStyle(PlainButtonStyle())

            if isExpanded {
                Text(item.answer)
                    .font(Theme.PinterestTypography.bodyRegular(.regular))
                    .foregroundColor(Theme.Colors.textSecondary)
                    .multilineTextAlignment(.leading)
                    .transition(.opacity.combined(with: .move(edge: .top)))
            }
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
