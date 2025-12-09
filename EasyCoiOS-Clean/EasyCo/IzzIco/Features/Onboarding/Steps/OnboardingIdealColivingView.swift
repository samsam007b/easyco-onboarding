import SwiftUI

// MARK: - Ideal Coliving Step (Web App Design)

struct OnboardingIdealColivingView: View {
    @Binding var data: OnboardingData

    var body: some View {
        VStack(alignment: .leading, spacing: 32) {
            // Header (matching web app)
            VStack(alignment: .leading, spacing: 8) {
                Text("Colocation idéale")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "FFA040"))

                Text("Décrivez votre colocation parfaite")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "666666"))
            }
            .padding(.bottom, 8)

            VStack(spacing: 24) {
                // Preferred roommate count
                WebAppSelectionField(
                    title: "Nombre de colocataires",
                    icon: "person.3.fill",
                    options: [
                        "1-2": "1-2 personnes",
                        "3-4": "3-4 personnes",
                        "5+": "5+ personnes",
                        "flexible": "Flexible"
                    ],
                    selection: $data.roommateCount
                )

                // Gender preference
                WebAppSelectionField(
                    title: "Préférence de genre",
                    icon: "person.fill.questionmark",
                    options: [
                        "no-preference": "Pas de préférence",
                        "same-gender": "Même genre",
                        "mixed": "Mixte préféré"
                    ],
                    selection: $data.genderPreference
                )

                // Age range preference
                WebAppSelectionField(
                    title: "Tranche d'âge préférée",
                    icon: "calendar",
                    options: [
                        "18-25": "18-25 ans",
                        "26-35": "26-35 ans",
                        "36-45": "36-45 ans",
                        "flexible": "Flexible"
                    ],
                    selection: $data.ageRange
                )
            }

            Spacer()
        }
    }
}
