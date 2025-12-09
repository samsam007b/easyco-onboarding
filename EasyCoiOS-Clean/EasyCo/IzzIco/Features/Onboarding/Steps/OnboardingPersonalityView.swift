import SwiftUI

// MARK: - Personality Step (Resident - Web App Design)

struct OnboardingPersonalityView: View {
    @Binding var data: OnboardingData

    var body: some View {
        VStack(alignment: .leading, spacing: 32) {
            // Header (matching web app with resident coral color)
            VStack(alignment: .leading, spacing: 8) {
                Text("Votre personnalité")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "E8865D"))

                Text("Aidez-nous à mieux vous connaître")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "666666"))
            }
            .padding(.bottom, 8)

            VStack(spacing: 24) {
                // Introvert/Extrovert Scale (web app style)
                VStack(alignment: .leading, spacing: 12) {
                    HStack(spacing: 6) {
                        Image(systemName: "person.2.fill")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "6B7280"))
                        Text("Introverti / Extraverti")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(Color(hex: "374151"))
                    }

                    VStack(spacing: 12) {
                        HStack {
                            Text("Introverti")
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "6B7280"))
                            Spacer()
                            Text(String(format: "%.0f", data.introvertExtrovertScale))
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(Color(hex: "E8865D"))
                            Spacer()
                            Text("Extraverti")
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "6B7280"))
                        }

                        Slider(value: $data.introvertExtrovertScale, in: 1...10, step: 1)
                            .accentColor(Color(hex: "E8865D"))
                    }
                    .padding(16)
                    .background(Color(hex: "FFF4ED"))
                    .cornerRadius(16)
                }

                // Sociability Level
                WebAppSelectionField(
                    title: "Niveau de sociabilité",
                    icon: "person.3.fill",
                    options: [
                        "low": "Faible",
                        "medium": "Moyen",
                        "high": "Élevé"
                    ],
                    selection: $data.sociabilityLevel
                )
            }

            Spacer()
        }
    }
}
