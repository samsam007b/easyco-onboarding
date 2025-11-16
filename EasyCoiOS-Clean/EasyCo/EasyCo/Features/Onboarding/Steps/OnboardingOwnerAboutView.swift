import SwiftUI

// MARK: - Owner About Step (Web App Design)

struct OnboardingOwnerAboutView: View {
    @Binding var data: OnboardingData

    var body: some View {
        VStack(alignment: .leading, spacing: 32) {
            // Header (matching web app with owner purple color)
            VStack(alignment: .leading, spacing: 8) {
                Text("À propos de vous")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "6E56CF"))

                Text("Parlez-nous de votre activité")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "666666"))
            }
            .padding(.bottom, 8)

            VStack(spacing: 24) {
                WebAppSelectionField(
                    title: "Type de propriétaire",
                    icon: "building.2.fill",
                    options: [
                        "individual": "Particulier",
                        "agency": "Agence",
                        "company": "Entreprise"
                    ],
                    selection: $data.ownerType
                )
            }

            Spacer()
        }
    }
}
