import SwiftUI

// MARK: - Social Vibe Step (Web App Design)

struct OnboardingSocialVibeView: View {
    @Binding var data: OnboardingData

    var body: some View {
        VStack(alignment: .leading, spacing: 32) {
            // Header (matching web app)
            VStack(alignment: .leading, spacing: 8) {
                Text("Ambiance sociale")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "FFA040"))

                Text("Comment interagissez-vous avec les autres ?")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "666666"))
            }
            .padding(.bottom, 8)

            VStack(spacing: 24) {
                // Social level
                WebAppSelectionField(
                    title: "Niveau de sociabilité",
                    icon: "person.2.fill",
                    options: [
                        "quiet": "Calme et réservé",
                        "balanced": "Équilibré",
                        "social": "Social et ouvert",
                        "party": "Très sociable"
                    ],
                    selection: $data.socialLevel
                )

                // Guests frequency
                WebAppSelectionField(
                    title: "Fréquence des invités",
                    icon: "person.badge.plus",
                    options: [
                        "never": "Jamais",
                        "rarely": "Rarement",
                        "sometimes": "Parfois",
                        "often": "Souvent"
                    ],
                    selection: $data.guestsFrequency
                )

                // Noise tolerance
                WebAppSelectionField(
                    title: "Tolérance au bruit",
                    icon: "speaker.wave.2.fill",
                    options: [
                        "low": "Faible - J'aime le calme",
                        "medium": "Moyenne",
                        "high": "Élevée - Pas de problème"
                    ],
                    selection: $data.noiseTolerance
                )
            }

            Spacer()
        }
    }
}
