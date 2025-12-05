import SwiftUI

// MARK: - About View

struct AboutView: View {
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 32) {
                    // Logo et version
                    VStack(spacing: 16) {
                        Image("EasyCoHouseIcon")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 100, height: 100)

                        Text("EasyCo")
                            .font(.system(size: 32, weight: .bold))
                            .foregroundColor(Color(hex: "FFA040"))

                        Text("Version 1.0.0")
                            .font(.system(size: 16))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                    .padding(.top, 40)

                    // Description
                    VStack(spacing: 16) {
                        Text("À propos d'EasyCo")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(Color(hex: "111827"))

                        Text("EasyCo est la plateforme de colocation qui simplifie la recherche de logement et la gestion du quotidien. Que vous soyez chercheur, propriétaire ou colocataire, nous facilitons chaque étape de votre expérience de colocation.")
                            .font(.system(size: 16))
                            .foregroundColor(Color(hex: "6B7280"))
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 20)
                    }

                    // Features
                    VStack(spacing: 16) {
                        InfoCard(
                            icon: "magnifyingglass",
                            title: "Recherche facilitée",
                            description: "Trouvez votre colocation idéale grâce à nos filtres intelligents"
                        )

                        InfoCard(
                            icon: "person.2.fill",
                            title: "Matching intelligent",
                            description: "Rencontrez des colocataires compatibles avec votre style de vie"
                        )

                        InfoCard(
                            icon: "house.fill",
                            title: "Gestion simplifiée",
                            description: "Gérez votre quotidien : tâches, dépenses, documents"
                        )
                    }
                    .padding(.horizontal, 20)

                    // Contact
                    VStack(spacing: 12) {
                        Text("Contactez-nous")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(Color(hex: "111827"))

                        Link("support@easyco.app", destination: URL(string: "mailto:support@easyco.app")!)
                            .font(.system(size: 16))
                            .foregroundColor(Color(hex: "FFA040"))
                    }
                    .padding(.bottom, 40)
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationTitle("À propos")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Fermer") {
                        dismiss()
                    }
                    .foregroundColor(Color(hex: "FFA040"))
                }
            }
        }
    }
}

// MARK: - Help & Support View

struct HelpSupportView: View {
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationStack {
            List {
                Section {
                    HelpRow(
                        icon: "questionmark.circle.fill",
                        title: "FAQ",
                        description: "Questions fréquemment posées"
                    )

                    HelpRow(
                        icon: "envelope.fill",
                        title: "Contactez-nous",
                        description: "support@easyco.app"
                    )

                    HelpRow(
                        icon: "phone.fill",
                        title: "Assistance téléphonique",
                        description: "Du lundi au vendredi, 9h-18h"
                    )
                } header: {
                    Text("Besoin d'aide ?")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(Color(hex: "6B7280"))
                        .textCase(.uppercase)
                }

                Section {
                    HelpRow(
                        icon: "video.fill",
                        title: "Tutoriels vidéo",
                        description: "Apprenez à utiliser EasyCo"
                    )

                    HelpRow(
                        icon: "book.fill",
                        title: "Guide utilisateur",
                        description: "Documentation complète"
                    )
                } header: {
                    Text("Ressources")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(Color(hex: "6B7280"))
                        .textCase(.uppercase)
                }

                Section {
                    HelpRow(
                        icon: "exclamationmark.triangle.fill",
                        title: "Signaler un problème",
                        description: "Aidez-nous à améliorer l'app"
                    )

                    HelpRow(
                        icon: "star.fill",
                        title: "Suggérer une fonctionnalité",
                        description: "Partagez vos idées"
                    )
                } header: {
                    Text("Feedback")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(Color(hex: "6B7280"))
                        .textCase(.uppercase)
                }
            }
            .listStyle(.insetGrouped)
            .navigationTitle("Aide & Support")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Fermer") {
                        dismiss()
                    }
                    .foregroundColor(Color(hex: "FFA040"))
                }
            }
        }
    }
}

// MARK: - Terms of Service View

struct GuestTermsOfServiceView: View {
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    Text("Dernière mise à jour : 5 décembre 2025")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))

                    TermsSection(
                        title: "1. Acceptation des conditions",
                        content: "En utilisant EasyCo, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services."
                    )

                    TermsSection(
                        title: "2. Utilisation du service",
                        content: "EasyCo est une plateforme de mise en relation pour la colocation. Nous ne sommes pas responsables des relations entre utilisateurs, mais nous nous engageons à fournir un service sûr et de qualité."
                    )

                    TermsSection(
                        title: "3. Compte utilisateur",
                        content: "Vous êtes responsable de la confidentialité de votre compte et de votre mot de passe. Vous acceptez de nous informer immédiatement de toute utilisation non autorisée."
                    )

                    TermsSection(
                        title: "4. Contenu utilisateur",
                        content: "Vous conservez tous les droits sur le contenu que vous publiez. Cependant, vous accordez à EasyCo une licence pour utiliser ce contenu dans le cadre de nos services."
                    )

                    TermsSection(
                        title: "5. Paiements",
                        content: "Tous les paiements effectués via la plateforme sont sécurisés. Les frais applicables seront clairement indiqués avant toute transaction."
                    )

                    TermsSection(
                        title: "6. Résiliation",
                        content: "Nous nous réservons le droit de suspendre ou de résilier votre compte en cas de violation de ces conditions."
                    )

                    TermsSection(
                        title: "7. Modifications",
                        content: "Nous pouvons modifier ces conditions à tout moment. Les modifications seront effectives dès leur publication sur la plateforme."
                    )

                    TermsSection(
                        title: "8. Contact",
                        content: "Pour toute question concernant ces conditions, contactez-nous à legal@easyco.app"
                    )
                }
                .padding(20)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationTitle("Conditions d'utilisation")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Fermer") {
                        dismiss()
                    }
                    .foregroundColor(Color(hex: "FFA040"))
                }
            }
        }
    }
}

// MARK: - Privacy Policy View

struct GuestPrivacyPolicyView: View {
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    Text("Dernière mise à jour : 5 décembre 2025")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))

                    TermsSection(
                        title: "1. Collecte des données",
                        content: "Nous collectons les informations que vous nous fournissez lors de l'inscription et de l'utilisation de nos services : nom, email, préférences de logement, etc."
                    )

                    TermsSection(
                        title: "2. Utilisation des données",
                        content: "Vos données sont utilisées pour améliorer nos services, vous mettre en relation avec d'autres utilisateurs et personnaliser votre expérience."
                    )

                    TermsSection(
                        title: "3. Partage des données",
                        content: "Nous ne vendons jamais vos données personnelles. Nous les partageons uniquement avec votre consentement ou pour respecter nos obligations légales."
                    )

                    TermsSection(
                        title: "4. Sécurité",
                        content: "Nous mettons en œuvre des mesures de sécurité pour protéger vos données contre tout accès non autorisé, altération ou destruction."
                    )

                    TermsSection(
                        title: "5. Cookies",
                        content: "Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur."
                    )

                    TermsSection(
                        title: "6. Vos droits",
                        content: "Vous avez le droit d'accéder, de modifier ou de supprimer vos données personnelles à tout moment. Contactez-nous à privacy@easyco.app"
                    )

                    TermsSection(
                        title: "7. Conservation des données",
                        content: "Nous conservons vos données aussi longtemps que nécessaire pour fournir nos services ou respecter nos obligations légales."
                    )

                    TermsSection(
                        title: "8. Modifications",
                        content: "Nous pouvons mettre à jour cette politique de confidentialité. Nous vous informerons des changements importants."
                    )
                }
                .padding(20)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationTitle("Politique de confidentialité")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Fermer") {
                        dismiss()
                    }
                    .foregroundColor(Color(hex: "FFA040"))
                }
            }
        }
    }
}

// MARK: - Language Settings View

struct LanguageSettingsGuestView: View {
    @Environment(\.dismiss) var dismiss
    @State private var selectedLanguage = "Français"

    let languages = [
        ("Français", "fr"),
        ("English", "en"),
        ("Español", "es"),
        ("Deutsch", "de"),
        ("Italiano", "it"),
        ("Nederlands", "nl")
    ]

    var body: some View {
        NavigationStack {
            List {
                ForEach(languages, id: \.1) { language in
                    Button(action: {
                        selectedLanguage = language.0
                    }) {
                        HStack {
                            Text(language.0)
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "111827"))

                            Spacer()

                            if selectedLanguage == language.0 {
                                Image(systemName: "checkmark")
                                    .font(.system(size: 16, weight: .semibold))
                                    .foregroundColor(Color(hex: "FFA040"))
                            }
                        }
                        .padding(.vertical, 8)
                    }
                }
            }
            .listStyle(.insetGrouped)
            .navigationTitle("Langue")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Fermer") {
                        dismiss()
                    }
                    .foregroundColor(Color(hex: "FFA040"))
                }
            }
        }
    }
}

// MARK: - Notification Settings View

struct NotificationSettingsGuestView: View {
    @Environment(\.dismiss) var dismiss
    @State private var pushNotifications = false
    @State private var emailNotifications = true

    var body: some View {
        NavigationStack {
            List {
                Section {
                    Text("Créez un compte pour personnaliser vos notifications")
                        .font(.system(size: 15))
                        .foregroundColor(Color(hex: "6B7280"))
                        .padding(.vertical, 8)
                } header: {
                    Text("Mode invité")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(Color(hex: "6B7280"))
                        .textCase(.uppercase)
                }

                Section {
                    Toggle(isOn: $pushNotifications) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Notifications push")
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(Color(hex: "111827"))

                            Text("Recevez des alertes importantes")
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "6B7280"))
                        }
                    }
                    .tint(Color(hex: "FFA040"))
                    .disabled(true)

                    Toggle(isOn: $emailNotifications) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Notifications email")
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(Color(hex: "111827"))

                            Text("Recevez nos actualités")
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "6B7280"))
                        }
                    }
                    .tint(Color(hex: "FFA040"))
                    .disabled(true)
                } header: {
                    Text("Préférences")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(Color(hex: "6B7280"))
                        .textCase(.uppercase)
                }
            }
            .listStyle(.insetGrouped)
            .navigationTitle("Notifications")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Fermer") {
                        dismiss()
                    }
                    .foregroundColor(Color(hex: "FFA040"))
                }
            }
        }
    }
}

// MARK: - Supporting Components

struct InfoCard: View {
    let icon: String
    let title: String
    let description: String

    var body: some View {
        HStack(alignment: .top, spacing: 16) {
            ZStack {
                Circle()
                    .fill(Color(hex: "FFA040").opacity(0.15))
                    .frame(width: 48, height: 48)

                Image(systemName: icon)
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(Color(hex: "FFA040"))
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text(description)
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            Spacer()
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 2)
    }
}

struct HelpRow: View {
    let icon: String
    let title: String
    let description: String

    var body: some View {
        HStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(Color(hex: "FFA040").opacity(0.15))
                    .frame(width: 40, height: 40)

                Image(systemName: icon)
                    .font(.system(size: 18, weight: .medium))
                    .foregroundColor(Color(hex: "FFA040"))
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                Text(description)
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            Spacer()

            Image(systemName: "chevron.right")
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(Color(hex: "D1D5DB"))
        }
        .padding(.vertical, 4)
    }
}

struct TermsSection: View {
    let title: String
    let content: String

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            Text(content)
                .font(.system(size: 15))
                .foregroundColor(Color(hex: "6B7280"))
                .lineSpacing(4)
        }
    }
}

// MARK: - Previews

struct GuestInfoViews_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            AboutView()
                .previewDisplayName("About")

            HelpSupportView()
                .previewDisplayName("Help & Support")

            GuestTermsOfServiceView()
                .previewDisplayName("Terms of Service")

            GuestPrivacyPolicyView()
                .previewDisplayName("Privacy Policy")

            LanguageSettingsGuestView()
                .previewDisplayName("Language Settings")

            NotificationSettingsGuestView()
                .previewDisplayName("Notification Settings")
        }
    }
}
