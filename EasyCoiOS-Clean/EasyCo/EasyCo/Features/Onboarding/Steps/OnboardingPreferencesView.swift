import SwiftUI

// MARK: - Preferences Step (Searcher)

struct OnboardingPreferencesView: View {
    @Binding var data: OnboardingData

    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Préférences de logement")
                    .font(.system(size: 28, weight: .bold))
                Text("Qu'est-ce que vous recherchez ?")
                    .font(.system(size: 16))
                    .foregroundColor(.gray)
            }

            VStack(spacing: 20) {
                // Budget
                VStack(alignment: .leading, spacing: 12) {
                    HStack(spacing: 6) {
                        Image(systemName: "eurosign.circle.fill")
                            .font(.system(size: 14))
                            .foregroundColor(.gray)
                        Text("Budget mensuel")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.gray)
                    }

                    VStack(spacing: 16) {
                        HStack {
                            Text("Min: €\(Int(data.budgetMin))")
                                .font(.system(size: 15, weight: .medium))
                            Spacer()
                            Text("Max: €\(Int(data.budgetMax))")
                                .font(.system(size: 15, weight: .medium))
                        }

                        VStack(spacing: 8) {
                            Slider(value: $data.budgetMin, in: 200...2000, step: 50)
                                .accentColor(Color(hex: "FFD700"))
                            Slider(value: $data.budgetMax, in: 200...2000, step: 50)
                                .accentColor(Color(hex: "FFD700"))
                        }
                    }
                    .padding()
                    .background(Color.gray.opacity(0.05))
                    .cornerRadius(12)
                }

                // Preferred City
                WebAppFormField(title: "Ville préférée", isRequired: false) {
                    TextField("Bruxelles, Liège, Anvers...", text: $data.preferredCity)
                }

                // Move-in Date
                WebAppFormField(title: "Date d'emménagement", isRequired: false) {
                    DatePicker("", selection: $data.moveInDate, displayedComponents: .date)
                        .labelsHidden()
                        .datePickerStyle(.compact)
                }
            }

            Spacer()
        }
    }
}
