import SwiftUI

struct OnboardingPropertyBasicsView: View {
    @Binding var data: OnboardingData

    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Votre propriété")
                    .font(.system(size: 28, weight: .bold))
                Text("Avez-vous déjà une propriété à louer ?")
                    .font(.system(size: 16))
                    .foregroundColor(.gray)
            }

            VStack(spacing: 20) {
                // Has Property Toggle
                Toggle(isOn: $data.hasProperty) {
                    HStack(spacing: 8) {
                        Image(systemName: "house.fill")
                            .font(.system(size: 16))
                        Text("J'ai une propriété")
                            .font(.system(size: 16))
                    }
                }
                .padding()
                .background(Color.gray.opacity(0.05))
                .cornerRadius(12)

                if data.hasProperty {
                    // Property City
                    WebAppFormField(title: "Ville de la propriété", isRequired: true) {
                        TextField("Bruxelles, Liège...", text: $data.propertyCity)
                    }

                    // Property Type
                    WebAppFormField(title: "Type de propriété", isRequired: true) {
                        TextField("Appartement, Maison...", text: $data.propertyType)
                    }
                }
            }

            Spacer()
        }
    }
}
