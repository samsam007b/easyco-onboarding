import SwiftUI

// MARK: - Verification Step (Web App Design)

struct OnboardingVerificationView: View {
    @Binding var data: OnboardingData

    var body: some View {
        VStack(alignment: .leading, spacing: 32) {
            // Header (matching web app)
            VStack(alignment: .leading, spacing: 8) {
                Text("Vérification")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "FFA040"))

                Text("Vérifiez votre identité pour plus de sécurité")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "666666"))
            }
            .padding(.bottom, 8)

            VStack(spacing: 24) {
                // Phone verification (web app card style)
                HStack(spacing: 12) {
                    Image(systemName: "phone.circle.fill")
                        .font(.system(size: 40))
                        .foregroundColor(Color(hex: "FFA040"))

                    VStack(alignment: .leading, spacing: 4) {
                        Text("Numéro de téléphone")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "1F2937"))
                        Text(data.phoneNumber.isEmpty ? "Non renseigné" : data.phoneNumber)
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "6B7280"))
                    }

                    Spacer()

                    Button("Vérifier") {
                        // TODO: Implement verification
                    }
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(hex: "FFA040"))
                }
                .padding(16)
                .background(Color(hex: "FFF4ED"))
                .cornerRadius(16)

                // ID document (web app card style)
                VStack(spacing: 12) {
                    HStack(spacing: 12) {
                        Image(systemName: "doc.text.fill")
                            .font(.system(size: 40))
                            .foregroundColor(Color(hex: "FFA040"))

                        VStack(alignment: .leading, spacing: 4) {
                            Text("Pièce d'identité")
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(Color(hex: "1F2937"))
                            Text("Passeport ou carte d'identité")
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "6B7280"))
                        }

                        Spacer()
                    }

                    Button(action: {
                        // TODO: Implement document upload
                    }) {
                        HStack {
                            Image(systemName: "arrow.up.doc.fill")
                            Text("Télécharger un document")
                        }
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(
                            LinearGradient(
                                colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(999)
                    }
                }
                .padding(16)
                .background(Color.white)
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                )
                .cornerRadius(16)

                // Info box (web app style with orange)
                HStack(alignment: .top, spacing: 12) {
                    Image(systemName: "info.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "FFA040"))

                    Text("La vérification d'identité est optionnelle mais fortement recommandée pour gagner la confiance des autres utilisateurs.")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))
                        .fixedSize(horizontal: false, vertical: true)
                }
                .padding(16)
                .background(Color(hex: "FFF4ED"))
                .cornerRadius(16)
            }

            Spacer()
        }
    }
}
