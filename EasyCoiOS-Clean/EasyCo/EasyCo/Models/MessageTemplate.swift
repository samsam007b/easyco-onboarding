//
//  MessageTemplate.swift
//  EasyCo
//
//  Message templates for Owner quick replies
//

import Foundation

// MARK: - Message Template

struct MessageTemplate: Identifiable, Codable {
    let id: UUID
    let name: String
    let content: String
    let category: TemplateCategory
    let variables: [String] // Placeholders like {candidateName}, {propertyTitle}

    init(id: UUID = UUID(), name: String, content: String, category: TemplateCategory, variables: [String] = []) {
        self.id = id
        self.name = name
        self.content = content
        self.category = category
        self.variables = variables
    }

    // Replace variables in content
    func fillVariables(_ replacements: [String: String]) -> String {
        var filledContent = content
        for (key, value) in replacements {
            filledContent = filledContent.replacingOccurrences(of: "{\(key)}", with: value)
        }
        return filledContent
    }

    static var predefinedTemplates: [MessageTemplate] {
        [
            // Visit Request Templates
            MessageTemplate(
                name: "Proposition de visite",
                content: "Bonjour {candidateName},\n\nVotre candidature pour {propertyTitle} a retenu mon attention.\n\nJe serais ravi de vous faire visiter le logement. Seriez-vous disponible cette semaine ?\n\nCordialement",
                category: .visitRequest,
                variables: ["candidateName", "propertyTitle"]
            ),
            MessageTemplate(
                name: "Confirmation de visite",
                content: "Bonjour {candidateName},\n\nJe confirme notre rendez-vous pour la visite de {propertyTitle} le {visitDate} à {visitTime}.\n\nAdresse : {propertyAddress}\n\nÀ bientôt !",
                category: .visitRequest,
                variables: ["candidateName", "propertyTitle", "visitDate", "visitTime", "propertyAddress"]
            ),
            MessageTemplate(
                name: "Reporter une visite",
                content: "Bonjour {candidateName},\n\nJe dois malheureusement reporter notre visite prévue. Pourriez-vous me proposer de nouvelles disponibilités ?\n\nMerci de votre compréhension.",
                category: .visitRequest,
                variables: ["candidateName"]
            ),

            // Document Request Templates
            MessageTemplate(
                name: "Demande de documents",
                content: "Bonjour {candidateName},\n\nPour continuer l'étude de votre candidature, pourriez-vous me fournir les documents suivants :\n\n• Pièce d'identité\n• 3 derniers bulletins de salaire\n• Attestation employeur\n\nMerci d'avance !",
                category: .documentRequest,
                variables: ["candidateName"]
            ),
            MessageTemplate(
                name: "Documents manquants",
                content: "Bonjour {candidateName},\n\nJe n'ai pas encore reçu tous les documents nécessaires. Il me manque :\n\n{missingDocuments}\n\nPourriez-vous me les transmettre rapidement ?\n\nMerci !",
                category: .documentRequest,
                variables: ["candidateName", "missingDocuments"]
            ),
            MessageTemplate(
                name: "Demande de garant",
                content: "Bonjour {candidateName},\n\nAprès étude de votre dossier, je vais avoir besoin des documents de votre garant :\n\n• Pièce d'identité\n• 3 derniers bulletins de salaire\n• Avis d'imposition\n• Attestation d'hébergement\n\nCordialement",
                category: .documentRequest,
                variables: ["candidateName"]
            ),

            // Polite Refusal Templates
            MessageTemplate(
                name: "Refus poli - Dossier incomplet",
                content: "Bonjour {candidateName},\n\nMerci pour votre candidature pour {propertyTitle}.\n\nMalheureusement, après étude de votre dossier, je ne peux pas donner suite à votre demande.\n\nJe vous souhaite bonne chance dans vos recherches.\n\nCordialement",
                category: .politeRefusal,
                variables: ["candidateName", "propertyTitle"]
            ),
            MessageTemplate(
                name: "Refus poli - Logement loué",
                content: "Bonjour {candidateName},\n\nMerci pour votre intérêt pour {propertyTitle}.\n\nLe logement vient d'être loué à un autre candidat. N'hésitez pas à consulter mes autres annonces !\n\nBonne continuation",
                category: .politeRefusal,
                variables: ["candidateName", "propertyTitle"]
            ),
            MessageTemplate(
                name: "Refus poli - Profil différent",
                content: "Bonjour {candidateName},\n\nMerci pour votre candidature. Après réflexion, je recherche un profil légèrement différent pour ce logement.\n\nJe vous souhaite de trouver rapidement.\n\nCordialement",
                category: .politeRefusal,
                variables: ["candidateName"]
            ),

            // Acceptance Templates
            MessageTemplate(
                name: "Acceptation de candidature",
                content: "Bonjour {candidateName},\n\nBonne nouvelle ! J'ai le plaisir de vous informer que votre candidature pour {propertyTitle} est acceptée.\n\nJe vous recontacte très prochainement pour finaliser les détails.\n\nFélicitations !",
                category: .acceptance,
                variables: ["candidateName", "propertyTitle"]
            ),
            MessageTemplate(
                name: "Signature du bail",
                content: "Bonjour {candidateName},\n\nPour finaliser votre location de {propertyTitle}, voici les prochaines étapes :\n\n• Signature du bail le {signatureDate}\n• Versement du dépôt de garantie : {depositAmount}€\n• Remise des clés : {moveInDate}\n\nÀ bientôt !",
                category: .acceptance,
                variables: ["candidateName", "propertyTitle", "signatureDate", "depositAmount", "moveInDate"]
            ),

            // Rent Reminder Templates
            MessageTemplate(
                name: "Rappel de loyer",
                content: "Bonjour {tenantName},\n\nJe me permets de vous rappeler que le loyer de {propertyTitle} pour le mois de {month} ({rentAmount}€) n'a pas encore été reçu.\n\nMerci de régulariser votre situation rapidement.\n\nCordialement",
                category: .rentReminder,
                variables: ["tenantName", "propertyTitle", "month", "rentAmount"]
            ),
            MessageTemplate(
                name: "Rappel charges",
                content: "Bonjour {tenantName},\n\nVoici le récapitulatif des charges pour {propertyTitle} :\n\n• Loyer : {rentAmount}€\n• Charges : {chargesAmount}€\n• Total : {totalAmount}€\n\nÀ régler avant le {dueDate}.\n\nMerci !",
                category: .rentReminder,
                variables: ["tenantName", "propertyTitle", "rentAmount", "chargesAmount", "totalAmount", "dueDate"]
            ),

            // General Templates
            MessageTemplate(
                name: "Réponse rapide - OK",
                content: "Parfait, merci !",
                category: .general
            ),
            MessageTemplate(
                name: "Réponse rapide - Compris",
                content: "Bien reçu, je vous remercie.",
                category: .general
            ),
            MessageTemplate(
                name: "Réponse rapide - Disponible",
                content: "Oui, je suis disponible à cette date.",
                category: .general
            ),
            MessageTemplate(
                name: "Prise de contact",
                content: "Bonjour {candidateName},\n\nMerci pour votre intérêt pour {propertyTitle}.\n\nJe suis à votre disposition pour toute question.\n\nCordialement",
                category: .general,
                variables: ["candidateName", "propertyTitle"]
            ),
            MessageTemplate(
                name: "Demande d'informations",
                content: "Bonjour,\n\nPourriez-vous me donner plus d'informations sur :\n\n{question}\n\nMerci d'avance !",
                category: .general,
                variables: ["question"]
            )
        ]
    }
}

// MARK: - Template Category

enum TemplateCategory: String, Codable, CaseIterable {
    case visitRequest = "Visites"
    case documentRequest = "Documents"
    case politeRefusal = "Refus"
    case acceptance = "Acceptation"
    case rentReminder = "Loyers"
    case general = "Général"

    var displayName: String {
        self.rawValue
    }

    var icon: String {
        switch self {
        case .visitRequest: return "calendar"
        case .documentRequest: return "doc.text"
        case .politeRefusal: return "hand.raised"
        case .acceptance: return "checkmark.circle"
        case .rentReminder: return "eurosign.circle"
        case .general: return "message"
        }
    }

    var color: String {
        switch self {
        case .visitRequest: return "3B82F6"      // Blue
        case .documentRequest: return "FBBF24"   // Yellow
        case .politeRefusal: return "EF4444"     // Red
        case .acceptance: return "10B981"        // Green
        case .rentReminder: return "8B5CF6"      // Purple
        case .general: return "6B7280"           // Gray
        }
    }
}

// MARK: - Template Usage

struct TemplateUsage {
    let template: MessageTemplate
    let usedCount: Int
    let lastUsed: Date?

    static func sortedByUsage(_ templates: [MessageTemplate]) -> [TemplateUsage] {
        // In real app, would fetch from database
        // For demo, return templates with mock usage data
        templates.enumerated().map { index, template in
            TemplateUsage(
                template: template,
                usedCount: Int.random(in: 0...20),
                lastUsed: index < 5 ? Date().addingTimeInterval(-Double(index) * 86400) : nil
            )
        }.sorted { $0.usedCount > $1.usedCount }
    }
}
