import SwiftUI

// MARK: - Daily Habits Step (Web App Design)

struct OnboardingDailyHabitsView: View {
    @Binding var data: OnboardingData

    var body: some View {
        VStack(alignment: .leading, spacing: 32) {
            // Header (matching web app)
            VStack(alignment: .leading, spacing: 8) {
                Text("Habitudes quotidiennes")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "FFA040"))

                Text("Parlez-nous de votre routine")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "666666"))
            }
            .padding(.bottom, 8)

            VStack(spacing: 24) {
                // Wake up time
                WebAppSelectionField(
                    title: "Heure de réveil",
                    icon: "sunrise.fill",
                    options: ["early": "Tôt (avant 7h)", "moderate": "Modéré (7h-9h)", "late": "Tard (après 9h)"],
                    selection: $data.wakeUpTime
                )

                // Sleep time
                WebAppSelectionField(
                    title: "Heure de coucher",
                    icon: "moon.fill",
                    options: ["early": "Tôt (avant 22h)", "moderate": "Modéré (22h-00h)", "late": "Tard (après 00h)"],
                    selection: $data.sleepTime
                )

                // Work schedule
                WebAppSelectionField(
                    title: "Horaire de travail",
                    icon: "briefcase.fill",
                    options: [
                        "traditional": "Traditionnel (9h-17h)",
                        "flexible": "Flexible",
                        "remote": "Télétravail",
                        "student": "Étudiant"
                    ],
                    selection: $data.workSchedule
                )

                // Smoking toggle (web app style)
                VStack(alignment: .leading, spacing: 8) {
                    HStack(spacing: 6) {
                        Image(systemName: "smoke.fill")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "6B7280"))
                        Text("Fumeur")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(Color(hex: "374151"))
                    }

                    Toggle(isOn: $data.isSmoker) {
                        Text("Je fume")
                            .font(.system(size: 15))
                            .foregroundColor(Color(hex: "1F2937"))
                    }
                    .toggleStyle(SwitchToggleStyle(tint: Color(hex: "FFA040")))
                    .padding()
                    .background(Color(hex: "F9FAFB"))
                    .cornerRadius(12)
                }

                // Alcohol
                WebAppSelectionField(
                    title: "Consommation d'alcool",
                    icon: "wineglass.fill",
                    options: [
                        "never": "Jamais",
                        "occasionally": "Occasionnellement",
                        "socially": "Socialement",
                        "regularly": "Régulièrement"
                    ],
                    selection: $data.drinksAlcohol
                )
            }

            Spacer()
        }
    }
}

// MARK: - Web App Selection Field Component

struct WebAppSelectionField: View {
    let title: String
    let icon: String
    let options: [String: String]
    @Binding var selection: String

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Label with icon (text-sm font-medium text-gray-700)
            HStack(spacing: 6) {
                Image(systemName: icon)
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "6B7280")) // text-gray-500
                Text(title)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "374151")) // text-gray-700
            }

            // Options (p-4 rounded-xl border-2)
            VStack(spacing: 8) {
                ForEach(Array(options.keys.sorted()), id: \.self) { key in
                    Button(action: {
                        withAnimation(.easeInOut(duration: 0.2)) {
                            selection = key
                        }
                    }) {
                        HStack {
                            Text(options[key] ?? "")
                                .font(.system(size: 15))
                                .foregroundColor(selection == key ? Color(hex: "FFA040") : Color(hex: "1F2937"))
                            Spacer()
                            if selection == key {
                                Image(systemName: "checkmark.circle.fill")
                                    .font(.system(size: 18))
                                    .foregroundColor(Color(hex: "FFA040"))
                            }
                        }
                        .padding(.horizontal, 16) // px-4
                        .padding(.vertical, 12)    // py-3
                        .background(selection == key ? Color(hex: "FFF4ED") : Color.white) // bg-orange-50 or bg-white
                        .overlay(
                            RoundedRectangle(cornerRadius: 12) // rounded-xl
                                .stroke(
                                    selection == key ? Color(hex: "FFA040") : Color(hex: "E5E7EB"), // border-orange-500 or border-gray-200
                                    lineWidth: selection == key ? 2 : 1
                                )
                        )
                        .cornerRadius(12)
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
        }
    }
}
