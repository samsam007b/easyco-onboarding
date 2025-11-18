import SwiftUI

// MARK: - Home Lifestyle Step (Web App Design)

struct OnboardingHomeLifestyleView: View {
    @Binding var data: OnboardingData

    var body: some View {
        VStack(alignment: .leading, spacing: 32) {
            // Header (matching web app)
            VStack(alignment: .leading, spacing: 8) {
                Text("Style de vie à la maison")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "FFA040"))

                Text("Comment vivez-vous au quotidien ?")
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
