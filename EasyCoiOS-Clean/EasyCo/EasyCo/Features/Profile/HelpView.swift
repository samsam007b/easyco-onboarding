//
//  HelpView.swift
//  EasyCo
//
//  Help and support center
//

import SwiftUI

struct HelpView: View {
    @State private var searchText = ""
    @State private var selectedCategory: HelpCategory?

    var body: some View {
        ScrollView {
            VStack(spacing: Theme.Spacing.lg) {
                // Search Bar
                HStack {
                    Image.lucide("magnifyingglass")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 16, height: 16)
                        .foregroundColor(Theme.Colors.textTertiary)

                    TextField("Rechercher dans l'aide...", text: $searchText)
                        .font(Theme.Typography.body())
                }
                .padding()
                .background(Theme.Colors.backgroundSecondary)
                .cornerRadius(Theme.CornerRadius.md)
                .padding(.horizontal)

                // Quick Actions
                VStack(alignment: .leading, spacing: Theme.Spacing.md) {
                    Text("Actions rapides")
                        .font(Theme.Typography.headline(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)
                        .padding(.horizontal)

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: Theme.Spacing.sm) {
                            QuickActionCard(
                                icon: "message-circle",
                                title: "Chat support",
                                color: Color(hex: "3B82F6")
                            ) {
                                // TODO: Open chat
                            }

                            QuickActionCard(
                                icon: "mail",
                                title: "Email",
                                color: Color(hex: "10B981")
                            ) {
                                // TODO: Send email
                            }

                            QuickActionCard(
                                icon: "help-circle",
                                title: "FAQ",
                                color: Color(hex: "F59E0B")
                            ) {
                                selectedCategory = .faq
                            }

                            QuickActionCard(
                                icon: "phone",
                                title: "Téléphone",
                                color: Color(hex: "EF4444")
                            ) {
                                // TODO: Call
                            }
                        }
                        .padding(.horizontal)
                    }
                }

                // Help Categories
                VStack(alignment: .leading, spacing: Theme.Spacing.md) {
                    Text("Catégories d'aide")
                        .font(Theme.Typography.headline(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)
                        .padding(.horizontal)

                    VStack(spacing: Theme.Spacing.sm) {
                        NavigationLink(destination: HelpCategoryView(category: .gettingStarted)) {
                            HelpCategoryRow(
                                icon: "sparkles",
                                title: "Démarrage",
                                subtitle: "Premiers pas sur EasyCo",
                                articlesCount: 8
                            )
                        }

                        NavigationLink(destination: HelpCategoryView(category: .account)) {
                            HelpCategoryRow(
                                icon: "user",
                                title: "Mon compte",
                                subtitle: "Gérer vos informations",
                                articlesCount: 12
                            )
                        }

                        NavigationLink(destination: HelpCategoryView(category: .properties)) {
                            HelpCategoryRow(
                                icon: "home",
                                title: "Propriétés",
                                subtitle: "Recherche et location",
                                articlesCount: 15
                            )
                        }

                        NavigationLink(destination: HelpCategoryView(category: .payments)) {
                            HelpCategoryRow(
                                icon: "credit-card",
                                title: "Paiements",
                                subtitle: "Facturation et remboursements",
                                articlesCount: 10
                            )
                        }

                        NavigationLink(destination: HelpCategoryView(category: .safety)) {
                            HelpCategoryRow(
                                icon: "lock",
                                title: "Sécurité",
                                subtitle: "Confidentialité et sécurité",
                                articlesCount: 6
                            )
                        }
                    }
                    .padding(.horizontal)
                }

                // Contact Information
                VStack(alignment: .leading, spacing: Theme.Spacing.md) {
                    Text("Nous contacter")
                        .font(Theme.Typography.headline(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)
                        .padding(.horizontal)

                    VStack(spacing: Theme.Spacing.sm) {
                        ContactInfoRow(icon: "mail", label: "Email", value: "support@easyco.fr")
                        ContactInfoRow(icon: "phone", label: "Téléphone", value: "+33 1 23 45 67 89")
                        ContactInfoRow(icon: "clock", label: "Horaires", value: "Lun-Ven 9h-18h")
                    }
                    .padding()
                    .background(Theme.Colors.backgroundSecondary)
                    .cornerRadius(Theme.CornerRadius.md)
                    .padding(.horizontal)
                }
            }
            .padding(.vertical)
        }
        .navigationTitle("Aide et support")
        .navigationBarTitleDisplayMode(.large)
    }
}

// MARK: - Quick Action Card

struct QuickActionCard: View {
    let icon: String
    let title: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image.lucide(icon)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 24, height: 24)
                    .foregroundColor(.white)
                    .frame(width: 50, height: 50)
                    .background(color)
                    .cornerRadius(12)

                Text(title)
                    .font(Theme.Typography.caption(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
            }
            .frame(width: 100)
            .padding(.vertical, 12)
            .background(Theme.Colors.backgroundSecondary)
            .cornerRadius(Theme.CornerRadius.md)
        }
    }
}

// MARK: - Help Category Row

struct HelpCategoryRow: View {
    let icon: String
    let title: String
    let subtitle: String
    let articlesCount: Int

    var body: some View {
        HStack(spacing: Theme.Spacing.md) {
            Image.lucide(icon)
                .resizable()
                .scaledToFit()
                .frame(width: 24, height: 24)
                .foregroundColor(Theme.Colors.primary)
                .frame(width: 48, height: 48)
                .background(Theme.Colors.primary.opacity(0.1))
                .cornerRadius(12)

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(subtitle)
                    .font(Theme.Typography.caption())
                    .foregroundColor(Theme.Colors.textSecondary)
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 4) {
                Text("\(articlesCount)")
                    .font(Theme.Typography.caption(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("articles")
                    .font(Theme.Typography.caption())
                    .foregroundColor(Theme.Colors.textSecondary)
            }

            Image.lucide("chevron.right")
                .resizable()
                .scaledToFit()
                .frame(width: 12, height: 12)
                .foregroundColor(Theme.Colors.textTertiary)
        }
        .padding()
        .background(Theme.Colors.backgroundSecondary)
        .cornerRadius(Theme.CornerRadius.md)
    }
}

// MARK: - Contact Info Row

struct ContactInfoRow: View {
    let icon: String
    let label: String
    let value: String

    var body: some View {
        HStack(spacing: Theme.Spacing.md) {
            Image.lucide(icon)
                .resizable()
                .scaledToFit()
                .frame(width: 20, height: 20)
                .foregroundColor(Theme.Colors.primary)

            VStack(alignment: .leading, spacing: 2) {
                Text(label)
                    .font(Theme.Typography.caption())
                    .foregroundColor(Theme.Colors.textSecondary)

                Text(value)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
            }

            Spacer()
        }
    }
}

// MARK: - Help Category View

struct HelpCategoryView: View {
    let category: HelpCategory

    var body: some View {
        List {
            ForEach(category.articles, id: \.self) { article in
                NavigationLink(destination: HelpArticleView(article: article)) {
                    Text(article)
                        .font(Theme.Typography.body())
                }
            }
        }
        .navigationTitle(category.title)
        .navigationBarTitleDisplayMode(.large)
    }
}

// MARK: - Help Article View

struct HelpArticleView: View {
    let article: String

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: Theme.Spacing.md) {
                Text("Article d'aide")
                    .font(Theme.Typography.title3(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Contenu de l'article à venir...")
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)

                // Helpful buttons
                HStack(spacing: Theme.Spacing.md) {
                    Button {
                        // Mark as helpful
                    } label: {
                        HStack {
                            Image(systemName: "hand.thumbsup")
                            Text("Utile")
                        }
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.primary)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Theme.Colors.primary.opacity(0.1))
                        .cornerRadius(Theme.CornerRadius.md)
                    }

                    Button {
                        // Mark as not helpful
                    } label: {
                        HStack {
                            Image(systemName: "hand.thumbsdown")
                            Text("Pas utile")
                        }
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textSecondary)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Theme.Colors.backgroundSecondary)
                        .cornerRadius(Theme.CornerRadius.md)
                    }
                }
                .padding(.top)
            }
            .padding()
        }
        .navigationTitle(article)
        .navigationBarTitleDisplayMode(.large)
    }
}

// MARK: - Models

enum HelpCategory {
    case gettingStarted
    case account
    case properties
    case payments
    case safety
    case faq

    var title: String {
        switch self {
        case .gettingStarted: return "Démarrage"
        case .account: return "Mon compte"
        case .properties: return "Propriétés"
        case .payments: return "Paiements"
        case .safety: return "Sécurité"
        case .faq: return "FAQ"
        }
    }

    var articles: [String] {
        switch self {
        case .gettingStarted:
            return [
                "Comment créer un compte",
                "Première connexion",
                "Configurer son profil",
                "Comprendre l'interface",
                "Rechercher une propriété",
                "Créer une alerte",
                "Enregistrer des favoris",
                "Contacter un propriétaire"
            ]
        case .account:
            return [
                "Modifier mes informations",
                "Changer mon mot de passe",
                "Gérer mes notifications",
                "Paramètres de confidentialité",
                "Supprimer mon compte",
                "Vérifier mon identité",
                "Ajouter une photo de profil",
                "Gérer mes préférences",
                "Historique d'activité",
                "Codes d'accès privés",
                "Gérer mes appareils",
                "Sécurité du compte"
            ]
        case .properties:
            return [
                "Rechercher une propriété",
                "Filtrer les résultats",
                "Comprendre les annonces",
                "Visiter une propriété",
                "Candidater à une propriété",
                "Suivre ma candidature",
                "Annuler une candidature",
                "Critères de matching",
                "Propriétés favorites",
                "Alertes de nouvelles annonces",
                "Comparer des propriétés",
                "Questions fréquentes",
                "Conditions de location",
                "Documents requis",
                "Délais de réponse"
            ]
        case .payments:
            return [
                "Modes de paiement acceptés",
                "Ajouter une carte bancaire",
                "Payer un loyer",
                "Historique des paiements",
                "Remboursements",
                "Frais de service",
                "Facturation",
                "Caution et dépôt de garantie",
                "Paiements récurrents",
                "Résoudre un problème de paiement"
            ]
        case .safety:
            return [
                "Conseils de sécurité",
                "Signaler un problème",
                "Confidentialité des données",
                "Authentification à deux facteurs",
                "Détecter les arnaques",
                "Nos engagements"
            ]
        case .faq:
            return [
                "Questions générales",
                "Problèmes techniques",
                "Autres questions"
            ]
        }
    }
}

// MARK: - Preview

struct HelpView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            HelpView()
        }
    }
}
