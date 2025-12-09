import SwiftUI

// MARK: - Terms of Service View

struct TermsOfServiceView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    // Last updated
                    HStack {
                        Image(systemName: "calendar")
                            .foregroundColor(Color(hex: "6B7280"))
                        Text("Dernière mise à jour : 1er décembre 2024")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "6B7280"))
                    }

                    // Introduction
                    LegalSection(title: "1. Acceptation des conditions") {
                        Text("En utilisant l'application EasyCo, vous acceptez d'être lié par les présentes conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.")
                    }

                    LegalSection(title: "2. Description du service") {
                        Text("EasyCo est une plateforme de mise en relation entre propriétaires et locataires potentiels. Notre service permet :")

                        BulletPoint("La recherche et la publication d'annonces immobilières")
                        BulletPoint("La gestion de colocation entre résidents")
                        BulletPoint("La communication entre les différentes parties")
                        BulletPoint("La gestion des visites et candidatures")
                    }

                    LegalSection(title: "3. Inscription et compte") {
                        Text("Pour utiliser certaines fonctionnalités de l'application, vous devez créer un compte. Vous vous engagez à :")

                        BulletPoint("Fournir des informations exactes et à jour")
                        BulletPoint("Maintenir la confidentialité de vos identifiants")
                        BulletPoint("Notifier immédiatement toute utilisation non autorisée")
                        BulletPoint("Être responsable de toute activité sous votre compte")
                    }

                    LegalSection(title: "4. Règles de conduite") {
                        Text("Les utilisateurs s'engagent à ne pas :")

                        BulletPoint("Publier de contenu illégal, offensant ou trompeur")
                        BulletPoint("Usurper l'identité d'une autre personne")
                        BulletPoint("Collecter des données personnelles d'autres utilisateurs")
                        BulletPoint("Interférer avec le bon fonctionnement du service")
                        BulletPoint("Utiliser le service à des fins commerciales non autorisées")
                    }

                    LegalSection(title: "5. Propriété intellectuelle") {
                        Text("Tous les contenus de l'application (logos, textes, images, code) sont la propriété exclusive d'EasyCo ou de ses partenaires. Toute reproduction sans autorisation est interdite.")
                    }

                    LegalSection(title: "6. Responsabilité") {
                        Text("EasyCo agit en tant qu'intermédiaire et ne peut être tenu responsable :")

                        BulletPoint("Des transactions entre utilisateurs")
                        BulletPoint("De l'exactitude des informations publiées")
                        BulletPoint("Des dommages résultant de l'utilisation du service")
                        BulletPoint("De l'indisponibilité temporaire du service")
                    }

                    LegalSection(title: "7. Résiliation") {
                        Text("Nous nous réservons le droit de suspendre ou de résilier votre compte en cas de violation des présentes conditions, sans préavis ni indemnité.")
                    }

                    LegalSection(title: "8. Modifications") {
                        Text("Nous pouvons modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur publication. L'utilisation continue du service vaut acceptation des nouvelles conditions.")
                    }

                    LegalSection(title: "9. Contact") {
                        Text("Pour toute question concernant ces conditions, contactez-nous à :")

                        Link("legal@easyco.app", destination: URL(string: "mailto:legal@easyco.app")!)
                            .font(.system(size: 15, weight: .medium))
                            .foregroundColor(Color(hex: "FFA040"))
                    }

                    LegalSection(title: "10. Droit applicable") {
                        Text("Les présentes conditions sont régies par le droit français. Tout litige sera soumis à la compétence exclusive des tribunaux de Paris.")
                    }
                }
                .padding(20)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationTitle("Conditions d'utilisation")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 24))
                            .foregroundColor(Color(hex: "D1D5DB"))
                    }
                }
            }
        }
    }
}

// MARK: - Privacy Policy View

struct PrivacyPolicyView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    // Last updated
                    HStack {
                        Image(systemName: "calendar")
                            .foregroundColor(Color(hex: "6B7280"))
                        Text("Dernière mise à jour : 1er décembre 2024")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "6B7280"))
                    }

                    // RGPD badge
                    HStack(spacing: 8) {
                        Image(systemName: "checkmark.shield.fill")
                            .foregroundColor(Color(hex: "10B981"))
                        Text("Conforme RGPD")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(Color(hex: "10B981"))
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(Color(hex: "10B981").opacity(0.1))
                    .cornerRadius(8)

                    LegalSection(title: "1. Collecte des données") {
                        Text("Nous collectons les données suivantes :")

                        DataTypeRow(icon: "person.fill", title: "Données d'identité", description: "Nom, prénom, email, téléphone")
                        DataTypeRow(icon: "location.fill", title: "Données de localisation", description: "Adresse, préférences de zones")
                        DataTypeRow(icon: "doc.fill", title: "Documents", description: "Pièce d'identité, justificatifs (optionnel)")
                        DataTypeRow(icon: "iphone", title: "Données techniques", description: "Appareil, OS, identifiants")
                    }

                    LegalSection(title: "2. Utilisation des données") {
                        Text("Vos données sont utilisées pour :")

                        BulletPoint("Fournir et améliorer nos services")
                        BulletPoint("Personnaliser votre expérience")
                        BulletPoint("Vous envoyer des notifications pertinentes")
                        BulletPoint("Assurer la sécurité de votre compte")
                        BulletPoint("Respecter nos obligations légales")
                    }

                    LegalSection(title: "3. Base légale") {
                        Text("Le traitement de vos données repose sur :")

                        BulletPoint("L'exécution du contrat (fourniture du service)")
                        BulletPoint("Votre consentement (communications marketing)")
                        BulletPoint("Nos intérêts légitimes (amélioration du service)")
                        BulletPoint("Nos obligations légales (conservation des données)")
                    }

                    LegalSection(title: "4. Partage des données") {
                        Text("Vos données peuvent être partagées avec :")

                        BulletPoint("Les autres utilisateurs (selon vos paramètres)")
                        BulletPoint("Nos prestataires techniques")
                        BulletPoint("Les autorités (si requis par la loi)")

                        Text("Nous ne vendons jamais vos données à des tiers.")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(Color(hex: "10B981"))
                            .padding(.top, 8)
                    }

                    LegalSection(title: "5. Conservation") {
                        Text("Vos données sont conservées :")

                        BulletPoint("Données de compte : durée de l'inscription + 3 ans")
                        BulletPoint("Documents : 5 ans après la fin de la relation")
                        BulletPoint("Logs techniques : 12 mois")
                        BulletPoint("Cookies : 13 mois maximum")
                    }

                    LegalSection(title: "6. Vos droits") {
                        Text("Conformément au RGPD, vous disposez des droits suivants :")

                        RightRow(title: "Accès", description: "Obtenir une copie de vos données")
                        RightRow(title: "Rectification", description: "Corriger vos données")
                        RightRow(title: "Effacement", description: "Supprimer vos données")
                        RightRow(title: "Portabilité", description: "Récupérer vos données")
                        RightRow(title: "Opposition", description: "Vous opposer au traitement")
                        RightRow(title: "Limitation", description: "Limiter le traitement")

                        NavigationLink {
                            PrivacyActionsView()
                        } label: {
                            HStack {
                                Text("Exercer mes droits")
                                    .font(.system(size: 15, weight: .semibold))
                                Spacer()
                                Image(systemName: "chevron.right")
                            }
                            .foregroundColor(Color(hex: "FFA040"))
                            .padding(14)
                            .background(Color(hex: "FFA040").opacity(0.1))
                            .cornerRadius(10)
                        }
                        .padding(.top, 8)
                    }

                    LegalSection(title: "7. Cookies") {
                        Text("Notre application utilise des cookies et technologies similaires pour :")

                        BulletPoint("Assurer le bon fonctionnement")
                        BulletPoint("Mémoriser vos préférences")
                        BulletPoint("Analyser l'utilisation (analytics)")

                        Text("Vous pouvez gérer vos préférences dans les paramètres.")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "6B7280"))
                            .padding(.top, 4)
                    }

                    LegalSection(title: "8. Sécurité") {
                        Text("Nous mettons en œuvre des mesures de sécurité appropriées :")

                        BulletPoint("Chiffrement des données en transit (TLS)")
                        BulletPoint("Chiffrement des données sensibles au repos")
                        BulletPoint("Authentification à deux facteurs disponible")
                        BulletPoint("Audits de sécurité réguliers")
                    }

                    LegalSection(title: "9. Contact DPO") {
                        Text("Pour toute question relative à vos données personnelles :")

                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                Image(systemName: "envelope.fill")
                                    .foregroundColor(Color(hex: "6366F1"))
                                Link("dpo@easyco.app", destination: URL(string: "mailto:dpo@easyco.app")!)
                                    .foregroundColor(Color(hex: "6366F1"))
                            }

                            HStack {
                                Image(systemName: "building.2.fill")
                                    .foregroundColor(Color(hex: "6B7280"))
                                Text("CNIL - www.cnil.fr")
                                    .foregroundColor(Color(hex: "6B7280"))
                            }
                        }
                        .font(.system(size: 14))
                        .padding(.top, 4)
                    }
                }
                .padding(20)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationTitle("Politique de confidentialité")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 24))
                            .foregroundColor(Color(hex: "D1D5DB"))
                    }
                }
            }
        }
    }
}

// MARK: - Cookie Policy View

struct CookiePolicyView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    HStack {
                        Image(systemName: "calendar")
                            .foregroundColor(Color(hex: "6B7280"))
                        Text("Dernière mise à jour : 1er décembre 2024")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "6B7280"))
                    }

                    LegalSection(title: "Qu'est-ce qu'un cookie ?") {
                        Text("Un cookie est un petit fichier texte stocké sur votre appareil lors de votre visite sur notre application. Il permet de mémoriser vos préférences et d'améliorer votre expérience.")
                    }

                    LegalSection(title: "Types de cookies utilisés") {
                        CookieTypeCard(
                            title: "Cookies essentiels",
                            description: "Nécessaires au fonctionnement de l'application",
                            isRequired: true,
                            examples: ["Session utilisateur", "Authentification", "Sécurité"]
                        )

                        CookieTypeCard(
                            title: "Cookies de performance",
                            description: "Nous aident à améliorer l'application",
                            isRequired: false,
                            examples: ["Analytics", "Temps de chargement", "Erreurs"]
                        )

                        CookieTypeCard(
                            title: "Cookies de fonctionnalité",
                            description: "Mémorisent vos préférences",
                            isRequired: false,
                            examples: ["Langue", "Thème", "Filtres de recherche"]
                        )
                    }

                    LegalSection(title: "Durée de conservation") {
                        Text("Les cookies sont conservés pour une durée maximale de 13 mois, conformément aux recommandations de la CNIL.")
                    }

                    LegalSection(title: "Gérer vos préférences") {
                        Text("Vous pouvez à tout moment modifier vos préférences de cookies dans les paramètres de l'application ou de votre appareil.")

                        NavigationLink {
                            CookiePreferencesView()
                        } label: {
                            HStack {
                                Image(systemName: "slider.horizontal.3")
                                Text("Gérer mes préférences")
                                Spacer()
                                Image(systemName: "chevron.right")
                            }
                            .font(.system(size: 15, weight: .medium))
                            .foregroundColor(Color(hex: "FFA040"))
                            .padding(14)
                            .background(Color(hex: "FFA040").opacity(0.1))
                            .cornerRadius(10)
                        }
                    }
                }
                .padding(20)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationTitle("Politique des cookies")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 24))
                            .foregroundColor(Color(hex: "D1D5DB"))
                    }
                }
            }
        }
    }
}

// MARK: - Cookie Preferences View

struct CookiePreferencesView: View {
    @State private var essentialCookies = true
    @State private var performanceCookies = true
    @State private var functionalCookies = true
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        List {
            Section {
                Toggle(isOn: .constant(true)) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Cookies essentiels")
                            .font(.system(size: 15, weight: .medium))
                        Text("Toujours actifs - nécessaires au fonctionnement")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }
                .disabled(true)
                .tint(Color(hex: "10B981"))

                Toggle(isOn: $performanceCookies) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Cookies de performance")
                            .font(.system(size: 15, weight: .medium))
                        Text("Analytics et amélioration du service")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }
                .tint(Color(hex: "FFA040"))

                Toggle(isOn: $functionalCookies) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Cookies de fonctionnalité")
                            .font(.system(size: 15, weight: .medium))
                        Text("Mémorisation de vos préférences")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }
                .tint(Color(hex: "FFA040"))
            } header: {
                Text("Préférences")
            }

            Section {
                Button(action: {
                    performanceCookies = true
                    functionalCookies = true
                }) {
                    Text("Tout accepter")
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(Color(hex: "10B981"))
                        .frame(maxWidth: .infinity)
                }

                Button(action: {
                    performanceCookies = false
                    functionalCookies = false
                }) {
                    Text("Refuser les optionnels")
                        .font(.system(size: 15, weight: .medium))
                        .foregroundColor(Color(hex: "EF4444"))
                        .frame(maxWidth: .infinity)
                }
            }
        }
        .navigationTitle("Préférences cookies")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Privacy Actions View

struct PrivacyActionsView: View {
    @State private var showExportConfirmation = false
    @State private var showDeleteConfirmation = false

    var body: some View {
        List {
            Section {
                Button(action: { showExportConfirmation = true }) {
                    HStack {
                        Image(systemName: "square.and.arrow.down")
                            .font(.system(size: 18))
                            .foregroundColor(Color(hex: "6366F1"))
                            .frame(width: 28)

                        VStack(alignment: .leading, spacing: 2) {
                            Text("Exporter mes données")
                                .font(.system(size: 15))
                                .foregroundColor(Color(hex: "111827"))

                            Text("Télécharger une copie de vos données")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "6B7280"))
                        }

                        Spacer()

                        Image(systemName: "chevron.right")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "D1D5DB"))
                    }
                }

                NavigationLink {
                    DataAccessRequestView()
                } label: {
                    HStack {
                        Image(systemName: "doc.text.magnifyingglass")
                            .font(.system(size: 18))
                            .foregroundColor(Color(hex: "FFA040"))
                            .frame(width: 28)

                        VStack(alignment: .leading, spacing: 2) {
                            Text("Demande d'accès")
                                .font(.system(size: 15))

                            Text("Voir les données collectées")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "6B7280"))
                        }
                    }
                }

                NavigationLink {
                    DataRectificationView()
                } label: {
                    HStack {
                        Image(systemName: "pencil.circle")
                            .font(.system(size: 18))
                            .foregroundColor(Color(hex: "10B981"))
                            .frame(width: 28)

                        VStack(alignment: .leading, spacing: 2) {
                            Text("Rectifier mes données")
                                .font(.system(size: 15))

                            Text("Corriger des informations inexactes")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "6B7280"))
                        }
                    }
                }
            } header: {
                Text("Accès et rectification")
            }

            Section {
                Button(action: { showDeleteConfirmation = true }) {
                    HStack {
                        Image(systemName: "trash")
                            .font(.system(size: 18))
                            .foregroundColor(Color(hex: "EF4444"))
                            .frame(width: 28)

                        VStack(alignment: .leading, spacing: 2) {
                            Text("Supprimer mes données")
                                .font(.system(size: 15))
                                .foregroundColor(Color(hex: "EF4444"))

                            Text("Effacement définitif de votre compte")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "6B7280"))
                        }
                    }
                }
            } header: {
                Text("Suppression")
            } footer: {
                Text("La suppression est irréversible. Certaines données peuvent être conservées pour des raisons légales.")
            }

            Section {
                Link(destination: URL(string: "mailto:dpo@easyco.app")!) {
                    HStack {
                        Image(systemName: "envelope")
                            .font(.system(size: 18))
                            .foregroundColor(Color(hex: "6B7280"))
                            .frame(width: 28)

                        Text("Contacter le DPO")
                            .font(.system(size: 15))
                            .foregroundColor(Color(hex: "111827"))

                        Spacer()

                        Image(systemName: "arrow.up.right")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "D1D5DB"))
                    }
                }
            } header: {
                Text("Assistance")
            }
        }
        .navigationTitle("Mes droits RGPD")
        .navigationBarTitleDisplayMode(.inline)
        .alert("Exporter vos données", isPresented: $showExportConfirmation) {
            Button("Annuler", role: .cancel) {}
            Button("Exporter") {
                // TODO: Export data
            }
        } message: {
            Text("Vous recevrez un email avec un lien pour télécharger vos données sous 48h.")
        }
        .alert("Supprimer votre compte ?", isPresented: $showDeleteConfirmation) {
            Button("Annuler", role: .cancel) {}
            Button("Supprimer", role: .destructive) {
                // TODO: Delete account
            }
        } message: {
            Text("Cette action est irréversible. Toutes vos données seront définitivement supprimées.")
        }
    }
}

// MARK: - Data Access Request View

struct DataAccessRequestView: View {
    var body: some View {
        List {
            Section {
                DataCategoryRow(
                    icon: "person.fill",
                    title: "Données personnelles",
                    items: ["Nom, prénom", "Email", "Téléphone", "Adresse"]
                )

                DataCategoryRow(
                    icon: "doc.fill",
                    title: "Documents",
                    items: ["Pièce d'identité", "Justificatifs de revenus", "Attestations"]
                )

                DataCategoryRow(
                    icon: "message.fill",
                    title: "Communications",
                    items: ["Messages envoyés", "Historique des conversations"]
                )

                DataCategoryRow(
                    icon: "magnifyingglass",
                    title: "Activité",
                    items: ["Recherches effectuées", "Propriétés consultées", "Candidatures"]
                )
            }
        }
        .navigationTitle("Données collectées")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Data Rectification View

struct DataRectificationView: View {
    var body: some View {
        List {
            Section {
                NavigationLink {
                    // ProfileEditView()
                } label: {
                    HStack {
                        Image(systemName: "person.fill")
                            .foregroundColor(Color(hex: "FFA040"))
                        Text("Modifier mon profil")
                    }
                }

                NavigationLink {
                    // ContactInfoEditView()
                } label: {
                    HStack {
                        Image(systemName: "phone.fill")
                            .foregroundColor(Color(hex: "10B981"))
                        Text("Modifier mes coordonnées")
                    }
                }
            } header: {
                Text("Modifier directement")
            }

            Section {
                Link(destination: URL(string: "mailto:dpo@easyco.app?subject=Demande%20de%20rectification")!) {
                    HStack {
                        Image(systemName: "envelope.fill")
                            .foregroundColor(Color(hex: "6366F1"))
                        Text("Demander une rectification")
                        Spacer()
                        Image(systemName: "arrow.up.right")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "D1D5DB"))
                    }
                }
            } header: {
                Text("Assistance")
            } footer: {
                Text("Pour les données que vous ne pouvez pas modifier vous-même, contactez notre DPO.")
            }
        }
        .navigationTitle("Rectifier mes données")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Legal Mentions View

struct LegalMentionsView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    LegalSection(title: "Éditeur") {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("EasyCo SAS")
                                .font(.system(size: 16, weight: .semibold))

                            Text("Société par actions simplifiée au capital de 10 000€")
                            Text("RCS Paris B 123 456 789")
                            Text("SIRET : 123 456 789 00012")
                            Text("TVA : FR12 123456789")
                        }
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "374151"))
                    }

                    LegalSection(title: "Siège social") {
                        Text("123 Avenue de la République\n75011 Paris\nFrance")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "374151"))
                    }

                    LegalSection(title: "Directeur de la publication") {
                        Text("Jean Dupont, Président")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "374151"))
                    }

                    LegalSection(title: "Hébergement") {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Amazon Web Services (AWS)")
                                .font(.system(size: 14, weight: .medium))
                            Text("38 Avenue John F. Kennedy\nL-1855 Luxembourg")
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "6B7280"))
                        }
                    }

                    LegalSection(title: "Contact") {
                        VStack(alignment: .leading, spacing: 8) {
                            Link(destination: URL(string: "mailto:contact@easyco.app")!) {
                                HStack {
                                    Image(systemName: "envelope.fill")
                                    Text("contact@easyco.app")
                                }
                                .foregroundColor(Color(hex: "FFA040"))
                            }

                            Link(destination: URL(string: "tel:+33123456789")!) {
                                HStack {
                                    Image(systemName: "phone.fill")
                                    Text("+33 1 23 45 67 89")
                                }
                                .foregroundColor(Color(hex: "FFA040"))
                            }
                        }
                        .font(.system(size: 14))
                    }

                    LegalSection(title: "Médiation") {
                        Text("Conformément aux articles L.616-1 et R.616-1 du code de la consommation, notre société a mis en place un dispositif de médiation de la consommation.")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "374151"))
                    }
                }
                .padding(20)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationTitle("Mentions légales")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 24))
                            .foregroundColor(Color(hex: "D1D5DB"))
                    }
                }
            }
        }
    }
}

// MARK: - Helper Components

struct LegalSection<Content: View>: View {
    let title: String
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            VStack(alignment: .leading, spacing: 8) {
                content
            }
            .font(.system(size: 15))
            .foregroundColor(Color(hex: "374151"))
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.white)
        .cornerRadius(12)
    }
}

struct BulletPoint: View {
    let text: String

    init(_ text: String) {
        self.text = text
    }

    var body: some View {
        HStack(alignment: .top, spacing: 10) {
            Circle()
                .fill(Color(hex: "FFA040"))
                .frame(width: 6, height: 6)
                .padding(.top, 6)

            Text(text)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "374151"))
        }
    }
}

struct DataTypeRow: View {
    let icon: String
    let title: String
    let description: String

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundColor(Color(hex: "FFA040"))
                .frame(width: 24)

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "111827"))

                Text(description)
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "6B7280"))
            }
        }
        .padding(.vertical, 4)
    }
}

struct RightRow: View {
    let title: String
    let description: String

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 16))
                .foregroundColor(Color(hex: "10B981"))

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                Text(description)
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "6B7280"))
            }
        }
        .padding(.vertical, 2)
    }
}

struct CookieTypeCard: View {
    let title: String
    let description: String
    let isRequired: Bool
    let examples: [String]

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(title)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                if isRequired {
                    Text("Requis")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(Color(hex: "10B981"))
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color(hex: "10B981").opacity(0.1))
                        .cornerRadius(4)
                }
            }

            Text(description)
                .font(.system(size: 13))
                .foregroundColor(Color(hex: "6B7280"))

            HStack(spacing: 6) {
                ForEach(examples, id: \.self) { example in
                    Text(example)
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "6B7280"))
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color(hex: "F3F4F6"))
                        .cornerRadius(999)
                }
            }
        }
        .padding(12)
        .background(Color(hex: "F9FAFB"))
        .cornerRadius(10)
    }
}

struct DataCategoryRow: View {
    let icon: String
    let title: String
    let items: [String]

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: icon)
                    .font(.system(size: 18))
                    .foregroundColor(Color(hex: "FFA040"))

                Text(title)
                    .font(.system(size: 15, weight: .semibold))
            }

            ForEach(items, id: \.self) { item in
                HStack(spacing: 8) {
                    Circle()
                        .fill(Color(hex: "D1D5DB"))
                        .frame(width: 4, height: 4)

                    Text(item)
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))
                }
                .padding(.leading, 28)
            }
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Previews

struct LegalPagesView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            TermsOfServiceView()
            PrivacyPolicyView()
            CookiePolicyView()
            LegalMentionsView()
        }
    }
}
