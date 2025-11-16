import SwiftUI

struct OnboardingLivingSituationView: View {
    @Binding var data: OnboardingData

    var body: some View {
        VStack(alignment: .leading, spacing: 32) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Situation actuelle")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "E8865D"))
                Text("Où vivez-vous actuellement ?")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "666666"))
            }
            .padding(.bottom, 8)

            VStack(spacing: 24) {
                WebAppFormField(title: "Adresse actuelle", isRequired: true) {
                    TextField("Votre adresse", text: $data.currentAddress)
                }

                WebAppFormField(title: "Raison du changement", isRequired: false) {
                    TextField("Pourquoi cherchez-vous ?", text: $data.reasonForChange)
                }
            }

            Spacer()
        }
    }
}
