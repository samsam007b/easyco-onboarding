import SwiftUI

// MARK: - Payment Info Step (Owner - Web App Design)

struct OnboardingPaymentInfoView: View {
    @Binding var data: OnboardingData

    var body: some View {
        VStack(alignment: .leading, spacing: 32) {
            // Header (matching web app with owner purple color)
            VStack(alignment: .leading, spacing: 8) {
                Text("Informations de paiement")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "6E56CF"))

                Text("Pour recevoir les loyers (optionnel)")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "666666"))
            }
            .padding(.bottom, 8)

            VStack(spacing: 24) {
                // Info box (web app style with purple)
                HStack(alignment: .top, spacing: 12) {
                    Image(systemName: "info.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "6E56CF"))

                    Text("Vous pourrez ajouter vos informations bancaires plus tard dans les paramètres.")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))
                        .fixedSize(horizontal: false, vertical: true)
                }
                .padding(16)
                .background(Color(hex: "F5F3FF"))
                .cornerRadius(16)

                // Optional bank info fields
                WebAppFormField(title: "IBAN", isRequired: false) {
                    TextField("BE00 0000 0000 0000", text: $data.bankIBAN)
                        .keyboardType(.default)
                        .autocapitalization(.allCharacters)
                }

                WebAppFormField(title: "Titulaire du compte", isRequired: false) {
                    TextField("Nom du titulaire", text: $data.bankAccountHolder)
                        .autocapitalization(.words)
                }
            }

            Spacer()
        }
    }
}
