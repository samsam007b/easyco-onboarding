import SwiftUI

// MARK: - Lifestyle Step (Resident - Web App Design)

struct OnboardingLifestyleView: View {
    @Binding var data: OnboardingData

    var body: some View {
        VStack(alignment: .leading, spacing: 32) {
            // Header (matching web app with resident coral color)
            VStack(alignment: .leading, spacing: 8) {
                Text("Style de vie")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "E8865D"))

                Text("Parlez-nous de vos habitudes")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "666666"))
            }
            .padding(.bottom, 8)

            VStack(spacing: 24) {
                WebAppSelectionField(
                    title: "Niveau de propreté",
                    icon: "sparkles",
                    options: [
                        "relaxed": "Décontracté",
                        "moderate": "Modéré",
                        "tidy": "Ordonné",
                        "spotless": "Impeccable"
                    ],
                    selection: $data.cleanliness
                )
            }

            Spacer()
        }
    }
}
