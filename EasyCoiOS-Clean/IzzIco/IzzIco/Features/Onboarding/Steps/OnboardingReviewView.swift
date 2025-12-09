import SwiftUI

// MARK: - Review Step (Web App Design)

struct OnboardingReviewView: View {
    let data: OnboardingData
    let userType: User.UserType

    var roleColor: Color {
        switch userType {
        case .searcher: return Color(hex: "FFA040")
        case .owner: return Color(hex: "6E56CF")
        case .resident: return Color(hex: "E8865D")
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 32) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Récapitulatif")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(roleColor)

                Text("Vérifiez vos informations avant de continuer")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "666666"))
            }
            .padding(.bottom, 8)

            ScrollView {
                VStack(spacing: 16) {
                    // Basic Info Section
                    ReviewSection(title: "Informations de base", icon: "person.circle.fill") {
                        ReviewItem(label: "Nom complet", value: "\(data.firstName) \(data.lastName)")
                        ReviewItem(label: "Date de naissance", value: formatDate(data.dateOfBirth))
                        ReviewItem(label: "Nationalité", value: data.nationality)
                        ReviewItem(label: "Téléphone", value: data.phoneNumber)
                    }

                    // Role-specific sections
                    switch userType {
                    case .searcher:
                        searcherSections
                    case .owner:
                        ownerSections
                    case .resident:
                        residentSections
                    }

                    // Success message (web app style)
                    HStack(alignment: .top, spacing: 12) {
                        Image(systemName: "checkmark.circle.fill")
                            .font(.system(size: 24))
                            .foregroundColor(roleColor)

                        VStack(alignment: .leading, spacing: 4) {
                            Text("Profil presque complet !")
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(Color(hex: "1F2937"))
                            Text("Cliquez sur Terminer pour finaliser votre inscription")
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "6B7280"))
                        }
                    }
                    .padding(16)
                    .background(roleColor.opacity(0.1))
                    .cornerRadius(16)
                }
            }

            Spacer()
        }
    }

    @ViewBuilder
    private var searcherSections: some View {
        ReviewSection(title: "Habitudes quotidiennes", icon: "sun.max.fill") {
            ReviewItem(label: "Réveil", value: translateHabitValue(data.wakeUpTime))
            ReviewItem(label: "Coucher", value: translateHabitValue(data.sleepTime))
            ReviewItem(label: "Horaire de travail", value: translateWorkSchedule(data.workSchedule))
            ReviewItem(label: "Fumeur", value: data.isSmoker ? "Oui" : "Non")
        }

        ReviewSection(title: "Préférences de logement", icon: "house.fill") {
            ReviewItem(label: "Budget", value: "€\(Int(data.budgetMin)) - €\(Int(data.budgetMax))")
            ReviewItem(label: "Ville préférée", value: data.preferredCity.isEmpty ? "Non renseignée" : data.preferredCity)
            ReviewItem(label: "Date d'emménagement", value: formatDate(data.moveInDate))
        }
    }

    @ViewBuilder
    private var ownerSections: some View {
        ReviewSection(title: "Type de propriétaire", icon: "building.2.fill") {
            ReviewItem(label: "Type", value: translateOwnerType(data.ownerType))
            ReviewItem(label: "Propriété", value: data.hasProperty ? "Oui" : "Non")
            if data.hasProperty {
                ReviewItem(label: "Ville", value: data.propertyCity)
                ReviewItem(label: "Type", value: data.propertyType)
            }
        }
    }

    @ViewBuilder
    private var residentSections: some View {
        ReviewSection(title: "Situation actuelle", icon: "mappin.circle.fill") {
            ReviewItem(label: "Adresse", value: data.currentAddress.isEmpty ? "Non renseignée" : data.currentAddress)
            ReviewItem(label: "Raison du changement", value: data.reasonForChange.isEmpty ? "Non renseignée" : data.reasonForChange)
        }
    }

    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.locale = Locale(identifier: "fr_FR")
        return formatter.string(from: date)
    }

    private func translateHabitValue(_ value: String) -> String {
        switch value {
        case "early": return "Tôt"
        case "moderate": return "Modéré"
        case "late": return "Tard"
        default: return value
        }
    }

    private func translateWorkSchedule(_ value: String) -> String {
        switch value {
        case "traditional": return "Traditionnel"
        case "flexible": return "Flexible"
        case "remote": return "Télétravail"
        case "student": return "Étudiant"
        default: return value
        }
    }

    private func translateOwnerType(_ value: String) -> String {
        switch value {
        case "individual": return "Particulier"
        case "agency": return "Agence"
        case "company": return "Entreprise"
        default: return value
        }
    }
}

// MARK: - Review Section Component (Web App Design)

struct ReviewSection<Content: View>: View {
    let title: String
    let icon: String
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "FFA040"))
                Text(title)
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(Color(hex: "1F2937"))
            }

            VStack(spacing: 8) {
                content
            }
        }
        .padding(16)
        .background(Color.white)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
        )
        .cornerRadius(16)
    }
}

// MARK: - Review Item Component (Web App Design)

struct ReviewItem: View {
    let label: String
    let value: String

    var body: some View {
        HStack {
            Text(label)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Color(hex: "6B7280"))
            Spacer()
            Text(value)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "1F2937"))
                .multilineTextAlignment(.trailing)
        }
        .padding(.vertical, 6)
    }
}
